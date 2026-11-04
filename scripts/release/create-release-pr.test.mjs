import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createOrUpdateReleasePr, githubClient, stageReleaseFiles } from './create-release-pr.mjs';

const sha = letter => letter.repeat(40);
const repository = 'ourfuturehealth/ds-changesets-testing-ground';
const appLogin = 'ds-changesets-release-testing[bot]';
const baseSha = sha('a');
const treeOid = sha('b');
const signedSha = sha('c');
const oldSha = sha('d');
const oldTree = sha('e');
const fileChanges = {
  additions: [{ path: 'CHANGELOG.md', contents: Buffer.from('new release\n').toString('base64') }],
  deletions: [{ path: '.changeset/example.md' }],
};

function fixture({ branch = null, pull = null, signed = true, main = baseSha } = {}) {
  const calls = [];
  const refs = new Map([['main', main]]);
  if (branch) refs.set('changeset-release/main', branch);
  const commits = new Map([
    [oldSha, { author: { login: appLogin }, commit: { tree: { sha: oldTree }, verification: { verified: true } } }],
    [baseSha, { author: { login: 'maintainer' }, commit: { tree: { sha: oldTree }, verification: { verified: true } } }],
  ]);
  const pulls = pull ? [pull] : [];
  const root = `repos/${repository}`;
  const client = {
    async request(method, path, body) {
      calls.push({ method, path, body });
      if (method === 'GET' && path.startsWith(`${root}/pulls?`)) return pulls;
      if (method === 'GET' && path.startsWith(`${root}/commits/`)) {
        const commit = commits.get(path.slice(`${root}/commits/`.length));
        assert(commit, `Missing fixture commit: ${path}`);
        return commit;
      }
      if (path.startsWith(`${root}/git/ref/heads/`) && method === 'GET') {
        const ref = path.slice(`${root}/git/ref/heads/`.length);
        if (!refs.has(ref)) throw Object.assign(new Error('Not Found'), { status: 404 });
        return { object: { sha: refs.get(ref) } };
      }
      if (path === `${root}/git/refs` && method === 'POST') {
        refs.set(body.ref.slice('refs/heads/'.length), body.sha);
        return { object: { sha: body.sha } };
      }
      if (path.startsWith(`${root}/git/refs/heads/`) && method === 'PATCH') {
        refs.set(path.slice(`${root}/git/refs/heads/`.length), body.sha);
        return { object: { sha: body.sha } };
      }
      if (path.startsWith(`${root}/git/refs/heads/`) && method === 'DELETE') {
        refs.delete(path.slice(`${root}/git/refs/heads/`.length));
        return {};
      }
      if (path === `${root}/pulls` && method === 'POST') return { number: 21, ...body };
      if (path === `${root}/pulls/20` && method === 'PATCH') return { number: 20, ...body };
      throw new Error(`Unexpected API call: ${method} ${path}`);
    },
    async graphql(variables) {
      calls.push({ method: 'GRAPHQL', variables });
      commits.set(signedSha, {
        author: { login: appLogin },
        commit: { tree: { sha: treeOid }, verification: { verified: signed } },
      });
      return signedSha;
    },
  };
  return { client, calls, refs };
}

const options = client => ({
  client, repository, baseSha, appSlug: 'ds-changesets-release-testing',
  body: 'Release scope\n', runId: '123', runAttempt: '1', treeOid, fileChanges,
});

test('stages only the generated release files, including consumed changeset deletion', () => {
  const directory = mkdtempSync(join(tmpdir(), 'release-pr-files-'));
  const previous = process.cwd();
  try {
    const run = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
    run('init', '-q', '-b', 'main');
    run('config', 'user.name', 'Release Test');
    run('config', 'user.email', 'release-test@example.invalid');
    mkdirSync(join(directory, '.changeset'));
    mkdirSync(join(directory, 'packages/toolkit'), { recursive: true });
    mkdirSync(join(directory, 'packages/react-components'), { recursive: true });
    for (const path of [
      '.changeset/example.md', 'packages/toolkit/package.json',
      'packages/react-components/package.json', 'pnpm-lock.yaml', 'CHANGELOG.md', 'UPGRADING.md',
    ]) writeFileSync(join(directory, path), 'old\n');
    run('add', '-A');
    run('commit', '-qm', 'baseline');
    const baseSha = run('rev-parse', 'HEAD');
    rmSync(join(directory, '.changeset/example.md'));
    writeFileSync(join(directory, '.changeset/release.json'), '{}\n');
    writeFileSync(join(directory, 'CHANGELOG.md'), 'new release\n');
    process.chdir(directory);
    const result = stageReleaseFiles({ baseSha, changesets: ['example'] });
    assert.match(result.treeOid, /^[a-f0-9]{40}$/);
    assert.deepEqual(result.fileChanges.deletions, [{ path: '.changeset/example.md' }]);
    assert.deepEqual(result.fileChanges.additions.map(change => change.path), ['.changeset/release.json', 'CHANGELOG.md']);
    assert.equal(Buffer.from(result.fileChanges.additions[1].contents, 'base64').toString(), 'new release\n');
    assert.equal(readFileSync(join(directory, '.changeset/release.json'), 'utf8'), '{}\n');
  } finally {
    process.chdir(previous);
    rmSync(directory, { recursive: true, force: true });
  }
});

test('handles GitHub reference deletion with no response body', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 204 });
  try {
    assert.deepEqual(await githubClient('synthetic-token').request('DELETE', 'repos/example/repo/git/refs/heads/staging'), {});
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('creates a signed App commit before opening the release PR', async () => {
  const { client, calls, refs } = fixture();
  assert.equal(await createOrUpdateReleasePr(options(client)), 21);
  assert.equal(refs.get('changeset-release/main'), signedSha);
  assert(!refs.has('changeset-release/staging-123-1'));
  const mutation = calls.find(call => call.method === 'GRAPHQL').variables.input;
  assert.deepEqual(mutation.branch, {
    repositoryNameWithOwner: repository,
    branchName: 'changeset-release/staging-123-1',
  });
  assert.deepEqual(mutation.fileChanges, fileChanges);
  assert.equal(calls.find(call => call.method === 'POST' && call.path.endsWith('/pulls')).body.base, 'main');
  assert(calls.findIndex(call => call.method === 'GRAPHQL') < calls.findIndex(call => call.path?.endsWith('/pulls') && call.method === 'POST'));
});

test('updates the App-owned release branch and PR for another feature', async () => {
  const pull = {
    number: 20, user: { login: appLogin }, title: 'Old title', body: 'Old body',
    head: { ref: 'changeset-release/main', repo: { full_name: repository } },
  };
  const { client, calls, refs } = fixture({ branch: oldSha, pull });
  assert.equal(await createOrUpdateReleasePr(options(client)), 20);
  assert.equal(refs.get('changeset-release/main'), signedSha);
  assert.deepEqual(calls.find(call => call.method === 'PATCH' && call.path.endsWith('/git/refs/heads/changeset-release/main')).body,
    { sha: signedSha, force: true });
  assert.equal(calls.find(call => call.method === 'PATCH' && call.path.endsWith('/pulls/20')).body.body, 'Release scope\n');
});

test('reuses a matching App commit without resetting the release branch', async () => {
  const { client, calls } = fixture({ branch: oldSha });
  const originalRequest = client.request;
  client.request = async (method, path, body) => {
    if (method === 'GET' && path.endsWith(`/commits/${oldSha}`)) {
      return { author: { login: appLogin }, commit: { tree: { sha: treeOid } } };
    }
    return originalRequest(method, path, body);
  };
  assert.equal(await createOrUpdateReleasePr(options(client)), 21);
  assert(!calls.some(call => call.method === 'GRAPHQL'));
  assert(!calls.some(call => call.method === 'PATCH' && call.path.includes('/git/refs/')));
});

test('does not replace a branch or PR owned by someone else', async () => {
  const pull = {
    number: 20, user: { login: 'other-user' }, title: 'Other PR', body: 'Body',
    head: { ref: 'changeset-release/main', repo: { full_name: repository } },
  };
  const { client, calls } = fixture({ branch: oldSha, pull });
  await assert.rejects(createOrUpdateReleasePr(options(client)), /not owned by the configured App/);
  assert(!calls.some(call => ['POST', 'PATCH', 'GRAPHQL'].includes(call.method)));
});

test('stops if main advanced before the release branch is prepared', async () => {
  const { client, calls, refs } = fixture({ main: oldSha });
  await assert.rejects(createOrUpdateReleasePr(options(client)), /main advanced/);
  assert(!refs.has('changeset-release/main'));
  assert(!calls.some(call => ['POST', 'PATCH', 'GRAPHQL'].includes(call.method)));
});

test('stops before updating the release branch if GitHub does not verify the signature', async () => {
  const { client, calls, refs } = fixture({ signed: false });
  await assert.rejects(createOrUpdateReleasePr(options(client)), /did not verify/);
  assert(!refs.has('changeset-release/main'));
  assert(!refs.has('changeset-release/staging-123-1'));
  assert(!calls.some(call => call.method === 'POST' && call.path.endsWith('/pulls')));
});
