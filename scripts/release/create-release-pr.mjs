import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const branchName = 'changeset-release/main';
const title = 'Release Design System packages';
const fixedPaths = [
  '.changeset/release.json',
  'packages/toolkit/package.json',
  'packages/react-components/package.json',
  'pnpm-lock.yaml',
  'CHANGELOG.md',
  'UPGRADING.md',
];
const commitMutation = `
  mutation($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) { commit { oid } }
  }
`;

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const oid = value => /^[a-f0-9]{40}$/.test(value || '');

export function stageReleaseFiles(record) {
  // 1. Stage only the generated release files and consumed changesets.
  assert(oid(record.baseSha), 'Release record needs an exact base SHA');
  assert(Array.isArray(record.changesets) && record.changesets.length, 'Release record needs changesets');
  assert.equal(git('rev-parse', 'HEAD'), record.baseSha, 'Generated release must start at its reviewed main SHA');
  const changesetPaths = record.changesets.map(id => {
    assert(/^[a-zA-Z0-9_-]+$/.test(id), `Invalid changeset ID: ${id}`);
    return `.changeset/${id}.md`;
  });
  const allowed = new Set([...changesetPaths, ...fixedPaths]);
  git('add', '-A', '--', ...allowed);
  git('diff', '--cached', '--check');
  const changed = git('diff', '--cached', '--name-only', '-z', '--no-renames').split('\0').filter(Boolean);
  assert(changed.length, 'Release generator produced no file changes');
  for (const path of changed) assert(allowed.has(path), `Unexpected release file: ${path}`);
  return {
    treeOid: git('write-tree'),
    fileChanges: {
      additions: changed.filter(path => existsSync(path)).map(path => ({ path, contents: readFileSync(path).toString('base64') })),
      deletions: changed.filter(path => !existsSync(path)).map(path => ({ path })),
    },
  };
}

export function githubClient(token, apiUrl = 'https://api.github.com', graphqlUrl = 'https://api.github.com/graphql') {
  // GitHub signs commits created through GraphQL; REST manages branches and PRs.
  async function call(method, url, body) {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = response.status === 204 ? {} : await response.json();
    if (!response.ok) {
      const error = new Error(`GitHub API ${method} ${new URL(url).pathname}: ${data.message || response.status}`);
      error.status = response.status;
      throw error;
    }
    return data;
  }
  return {
    request: (method, path, body) => call(method, `${apiUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, body),
    graphql: async variables => {
      const data = await call('POST', graphqlUrl, { query: commitMutation, variables });
      if (data.errors?.length) throw new Error(`GitHub commit mutation: ${data.errors.map(error => error.message).join('; ')}`);
      return data.data.createCommitOnBranch.commit.oid;
    },
  };
}

export async function createOrUpdateReleasePr({ client, repository, baseSha, appSlug, body, runId, runAttempt, treeOid, fileChanges }) {
  assert(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository), 'Invalid GITHUB_REPOSITORY');
  assert(oid(baseSha) && oid(treeOid), 'Invalid release SHA or tree');
  assert(/^[a-zA-Z0-9-]+$/.test(appSlug), 'Invalid RELEASE_APP_SLUG');
  assert(/^\d+$/.test(runId) && /^\d+$/.test(runAttempt), 'Invalid workflow run ID');
  assert(body.trim(), 'Release PR body is empty');
  const root = `repos/${repository}`;
  const refPath = `${root}/git/ref/heads/${branchName}`;
  const appLogin = `${appSlug}[bot]`;
  const getRef = async () => {
    try {
      return await client.request('GET', refPath);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  };

  // 2. Find the current release PR and confirm the App owns its branch.
  const currentMain = await client.request('GET', `${root}/git/ref/heads/main`);
  assert.equal(currentMain.object.sha, baseSha, 'main advanced while preparing the release; retry on its latest push');
  const query = new URLSearchParams({ state: 'open', base: 'main', head: `${repository.split('/')[0]}:${branchName}` });
  const pulls = await client.request('GET', `${root}/pulls?${query}`);
  assert(pulls.length <= 1, 'More than one open release PR uses the release branch');
  const pull = pulls[0];
  if (pull) {
    assert.equal(pull.user?.login, appLogin, 'Release PR is not owned by the configured App');
    assert.equal(pull.head?.ref, branchName, 'Release PR points to an unexpected branch');
    assert.equal(pull.head?.repo?.full_name, repository, 'Release PR points to another repository');
  }
  const existingRef = await getRef();
  assert(!pull || existingRef, 'Open release PR has no branch');
  const currentCommit = existingRef
    ? await client.request('GET', `${root}/commits/${existingRef.object.sha}`)
    : null;
  if (currentCommit) {
    assert(existingRef.object.sha === baseSha || currentCommit.author?.login === appLogin,
      'Release branch contains a commit outside the configured App');
  }

  // 3. Reuse only a matching, verified commit; otherwise create a signed one.
  const reusableCommit = currentCommit?.commit.tree.sha === treeOid && currentCommit.commit.verification?.verified === true;
  if (!reusableCommit) {
    // Keep the open PR intact if GitHub cannot create or verify the new commit.
    const stagingBranch = `changeset-release/staging-${runId}-${runAttempt}`;
    const stagingRef = `refs/heads/${stagingBranch}`;
    await client.request('POST', `${root}/git/refs`, { ref: stagingRef, sha: baseSha });
    try {
      const signedSha = await client.graphql({ input: {
        branch: { repositoryNameWithOwner: repository, branchName: stagingBranch },
        expectedHeadOid: baseSha,
        message: { headline: 'chore: prepare package releases' },
        fileChanges,
      } });
      assert(oid(signedSha), 'GitHub did not return the release commit SHA');
      const signedCommit = await client.request('GET', `${root}/commits/${signedSha}`);
      assert(signedCommit.commit.verification.verified, 'GitHub did not verify the release App commit signature');
      assert.equal(signedCommit.commit.tree.sha, treeOid, 'GitHub release commit differs from the generated files');

      // 4. Move the release branch only if main and the PR branch are unchanged.
      const latestMain = await client.request('GET', `${root}/git/ref/heads/main`);
      assert.equal(latestMain.object.sha, baseSha, 'main advanced before updating the release PR');
      const latestRef = await getRef();
      assert.equal(latestRef?.object.sha ?? null, existingRef?.object.sha ?? null,
        'Release branch changed while preparing the release');
      if (latestRef) await client.request('PATCH', `${root}/git/refs/heads/${branchName}`, { sha: signedSha, force: true });
      else await client.request('POST', `${root}/git/refs`, { ref: `refs/heads/${branchName}`, sha: signedSha });
    } finally {
      try { await client.request('DELETE', `${root}/git/refs/heads/${stagingBranch}`); }
      catch (error) { process.stdout.write(`::warning::Could not remove temporary release branch: ${error.message}\n`); }
    }
  }

  // 5. Open the PR, or refresh its description as more changesets accumulate.
  let result;
  if (pull) {
    result = pull;
    if (pull.title !== title || pull.body !== body) {
      result = await client.request('PATCH', `${root}/pulls/${pull.number}`, { title, body });
    }
  } else {
    result = await client.request('POST', `${root}/pulls`, { title, body, head: branchName, base: 'main' });
  }
  assert(Number.isInteger(result.number) && result.number > 0, 'GitHub did not return a release PR number');
  return result.number;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // GitHub Actions supplies the release plan and the short-lived App token.
  const record = JSON.parse(readFileSync(process.env.RELEASE_RECORD_FILE, 'utf8'));
  assert.equal(record.baseSha, process.env.GITHUB_SHA, 'Release record does not match this workflow commit');
  assert(process.env.GH_TOKEN, 'Set GH_TOKEN to the release App token');
  assert(process.env.RELEASE_PR_BODY_FILE, 'Set RELEASE_PR_BODY_FILE');
  assert(process.env.GITHUB_OUTPUT, 'Set GITHUB_OUTPUT');
  const { treeOid, fileChanges } = stageReleaseFiles(record);
  const client = githubClient(process.env.GH_TOKEN, process.env.GITHUB_API_URL, process.env.GITHUB_GRAPHQL_URL);
  const number = await createOrUpdateReleasePr({
    client,
    repository: process.env.GITHUB_REPOSITORY,
    baseSha: record.baseSha,
    appSlug: process.env.RELEASE_APP_SLUG,
    body: readFileSync(process.env.RELEASE_PR_BODY_FILE, 'utf8'),
    runId: process.env.GITHUB_RUN_ID,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT,
    treeOid,
    fileChanges,
  });
  appendFileSync(process.env.GITHUB_OUTPUT, `pull-request-number=${number}\n`);
  process.stdout.write(`Release PR #${number} is current with ${record.baseSha}.\n`);
}
