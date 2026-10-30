import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { resolvePublicationContext } from './resolve-publication-context.mjs';
import { assertPublicationRetryAllowed } from './verify-publication-retry.mjs';

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

test('a failed preparation job can retry, but a reached publication job needs inspected resume', () => {
  assert.doesNotThrow(() => assertPublicationRetryAllowed(1, 123, false, []));
  assert.doesNotThrow(() => assertPublicationRetryAllowed(2, 123, false, []));
  assert.throws(() => assertPublicationRetryAllowed(2, 123, false, ['publication-attempt-123']), /inspect the remote state/);
  assert.throws(() => assertPublicationRetryAllowed(2, 123, true, []), /new manual dispatch/);
});

test('the publication retry command checks the prior run marker and fails closed on API errors', () => {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-publication-retry-'));
  const gh = join(directory, 'gh');
  writeFileSync(gh, '#!/bin/sh\nif [ "$MOCK_GH_FAIL" = "1" ]; then exit 1; fi\nprintf "%s\\n" "$MOCK_ARTIFACT_NAMES"\n');
  chmodSync(gh, 0o755);
  const script = fileURLToPath(new URL('./verify-publication-retry.mjs', import.meta.url));
  const run = extra => spawnSync(process.execPath, [script], {
    encoding: 'utf8',
    env: {
      ...process.env, PATH: `${directory}:${process.env.PATH}`,
      GITHUB_REPOSITORY: repository, GITHUB_RUN_ID: '123', GITHUB_RUN_ATTEMPT: '2',
      RESUME_PUBLICATION: 'false', MOCK_GH_FAIL: '0', MOCK_ARTIFACT_NAMES: '', ...extra,
    },
  });
  try {
    assert.equal(run({}).status, 0);
    assert.match(run({ MOCK_ARTIFACT_NAMES: 'publication-attempt-123' }).stderr, /inspect the remote state/);
    assert.notEqual(run({ MOCK_GH_FAIL: '1' }).status, 0);
    assert.match(run({ RESUME_PUBLICATION: 'true' }).stderr, /new manual dispatch/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
