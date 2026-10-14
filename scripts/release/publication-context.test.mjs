import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePublicationContext } from './resolve-publication-context.mjs';

const repository = 'example/design-system';
const pull = {
  number: 42, merged: true, state: 'closed', merge_commit_sha: 'a'.repeat(40),
  user: { login: 'release-app[bot]', type: 'Bot' },
  base: { ref: 'main', repo: { full_name: repository } },
  head: { ref: 'changeset-release/main', repo: { full_name: repository } },
};

test('publication selects the exact merged SHA of an App-owned release PR', () => {
  assert.deepEqual(resolvePublicationContext(pull, repository, 'release-app'), {
    schemaVersion: 1, repository, prNumber: 42, sha: 'a'.repeat(40),
  });
});

test('unmerged PRs, human authors, forks and non-release branches cannot publish', () => {
  assert.throws(() => resolvePublicationContext({ ...pull, merged: false }, repository, 'release-app'), /Only merged/);
  assert.throws(() => resolvePublicationContext({ ...pull, user: { login: 'developer', type: 'User' } }, repository, 'release-app'), /configured App/);
  assert.throws(() => resolvePublicationContext({ ...pull, head: { ...pull.head, repo: { full_name: 'fork/design-system' } } }, repository, 'release-app'), /Forks/);
  assert.throws(() => resolvePublicationContext({ ...pull, head: { ...pull.head, ref: 'feature/work' } }, repository, 'release-app'), /Unexpected release PR branch/);
  assert.throws(() => resolvePublicationContext({ ...pull, base: { ...pull.base, ref: 'feature/parent' } }, repository, 'release-app'), /merge into main/);
});
