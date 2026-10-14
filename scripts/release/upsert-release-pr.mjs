import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const branch = 'changeset-release/main';
const title = 'Release Design System packages';
const mutation = `mutation($input: CreateCommitOnBranchInput!) {
  createCommitOnBranch(input: $input) { commit { oid } }
}`;

function git(directory, ...args) {
  return execFileSync('git', args, { cwd: directory });
}

function gh(args, input) {
  return execFileSync('gh', args, { encoding: 'utf8', input });
}

function api(args, input) {
  return JSON.parse(gh(['api', ...args], input));
}

export function generatedFileChanges(directory = process.cwd()) {
  git(directory, 'add', '--all', '--', '.changeset', 'packages/toolkit/package.json',
    'packages/react-components/package.json', 'pnpm-lock.yaml', 'CHANGELOG.md', 'UPGRADING.md');
  const fields = git(directory, 'diff', '--cached', '--no-renames', '--name-status', '-z').toString().split('\0');
  fields.pop();
  const additions = [];
  const deletions = [];
  for (let i = 0; i < fields.length; i += 2) {
    const [status, path] = fields.slice(i, i + 2);
    if (status === 'D') {
      deletions.push({ path });
    } else {
      assert(['A', 'M'].includes(status), `Unexpected generated file status: ${status}`);
      additions.push({ path, contents: readFileSync(resolve(directory, path)).toString('base64') });
    }
  }
  assert(additions.length + deletions.length > 0, 'Pending changesets produced no release PR changes');
  return { additions, deletions };
}

function remoteRef(repository, ref) {
  try {
    return api([`repos/${repository}/git/ref/heads/${ref}`]);
  } catch (error) {
    if (/HTTP 404/.test(String(error.stderr))) return null;
    throw error;
  }
}

function openReleasePR(repository, appSlug) {
  const owner = repository.split('/')[0];
  const head = encodeURIComponent(`${owner}:${branch}`);
  const pulls = api([`repos/${repository}/pulls?state=open&head=${head}`]);
  assert(pulls.length <= 1, `Multiple open PRs use ${branch}`);
  const pull = pulls[0];
  if (pull) {
    assert.equal(pull.base.ref, 'main', 'The release PR must target main');
    assert.equal(pull.user.login, `${appSlug}[bot]`, 'The release PR must belong to the release App');
  }
  return pull;
}

function createOrUpdatePR() {
  const repository = process.env.GITHUB_REPOSITORY;
  const base = process.env.GITHUB_SHA;
  const appSlug = process.env.RELEASE_APP_SLUG;
  const bodyFile = process.env.RELEASE_PR_BODY_FILE;
  assert(repository && base && appSlug && bodyFile && process.env.GH_TOKEN,
    'Repository, base SHA, App slug, PR body and App token are required');

  const fileChanges = generatedFileChanges();
  const staging = `changeset-release/staging-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
  assert(process.env.GITHUB_RUN_ID && process.env.GITHUB_RUN_ATTEMPT, 'GitHub run identity is required');
  const pull = openReleasePR(repository, appSlug);

  // Build a verified commit off the exact main SHA before moving the visible PR branch.
  api(['-X', 'POST', `repos/${repository}/git/refs`,
    '-f', `ref=refs/heads/${staging}`, '-f', `sha=${base}`]);
  try {
    const result = api(['graphql', '--input', '-'], JSON.stringify({
      query: mutation,
      variables: { input: {
        branch: { repositoryNameWithOwner: repository, refName: `refs/heads/${staging}` },
        expectedHeadOid: base,
        message: { headline: 'chore: prepare package releases' },
        fileChanges,
      } },
    }));
    assert(!result.errors?.length, JSON.stringify(result.errors));
    const commit = result.data?.createCommitOnBranch?.commit?.oid;
    assert(commit, 'GitHub did not return the signed release commit');

    if (remoteRef(repository, branch)) {
      api(['-X', 'PATCH', `repos/${repository}/git/refs/heads/${branch}`,
        '-f', `sha=${commit}`, '-F', 'force=true']);
    } else {
      api(['-X', 'POST', `repos/${repository}/git/refs`,
        '-f', `ref=refs/heads/${branch}`, '-f', `sha=${commit}`]);
    }

    if (pull) {
      gh(['pr', 'edit', String(pull.number), '--repo', repository,
        '--title', title, '--body-file', bodyFile]);
    } else {
      gh(['pr', 'create', '--repo', repository, '--base', 'main', '--head', branch,
        '--title', title, '--body-file', bodyFile]);
    }
  } finally {
    gh(['api', '-X', 'DELETE', `repos/${repository}/git/refs/heads/${staging}`]);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createOrUpdatePR();
}
