import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

function repository(t) {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-release-source-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], {
    cwd: directory,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  git('init', '--initial-branch=main');
  git('config', 'user.name', 'Release source test');
  git('config', 'user.email', 'release-source@example.invalid');
  git('commit', '--allow-empty', '-m', 'Release source');
  const sha = git('rev-parse', 'HEAD');
  git('tag', 'toolkit-v4.26.1');
  git('tag', '-a', 'react-v0.26.1', '-m', 'Annotated release');
  git('commit', '--allow-empty', '-m', 'Reviewed publisher fix');
  const controllerSha = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', controllerSha);
  const output = join(directory, 'output.txt');
  const environment = join(directory, 'environment.txt');
  const run = (tag = 'toolkit-v4.26.1', expectedSha = sha, env = {}) => {
    writeFileSync(output, '');
    writeFileSync(environment, '');
    const result = spawnSync(process.execPath, [resolve('scripts/release/resolve-release-source.mjs'), tag, expectedSha], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REF: 'refs/heads/main', GITHUB_SHA: git('rev-parse', 'HEAD'), GITHUB_OUTPUT: output, GITHUB_ENV: environment, ...env },
    });
    return { ...result, outputs: readFileSync(output, 'utf8'), environment: readFileSync(environment, 'utf8') };
  };
  return { git, sha, controllerSha, run };
}

test('manual resume selects the original release SHA, not the newer publisher commit', t => {
  const { run, sha, controllerSha } = repository(t);
  assert.notEqual(sha, controllerSha);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs, `TAG=toolkit-v4.26.1\nSHA=${sha}\n`);
  assert.equal(result.environment, `RELEASE_TAG=toolkit-v4.26.1\nRELEASE_SHA=${sha}\n`);
});

test('manual resume also resolves annotated React tags to their commit SHA', t => {
  const { run, sha } = repository(t);
  const result = run('react-v0.26.1');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs, `TAG=react-v0.26.1\nSHA=${sha}\n`);
});

test('manual resume rejects an unreviewed workflow branch or wrong expected SHA', t => {
  const { run } = repository(t);
  assert.match(run(undefined, undefined, { GITHUB_REF: 'refs/heads/feature' }).stderr, /must run from main/);
  const result = run('toolkit-v4.26.1', 'b'.repeat(40));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Tag differs from the expected release SHA/);
  assert.equal(result.outputs, '');
  assert.equal(result.environment, '');
});

test('noncanonical tags, missing tags, and invalid expected SHAs produce no outputs', t => {
  const { run } = repository(t);
  for (const [tag, sha] of [['v4.26.1', undefined], ['toolkit-v4.26.1\nSHA=injected', undefined], ['toolkit-v99.0.0', undefined], ['toolkit-v4.26.1', 'main']]) {
    const result = run(tag, sha);
    assert.notEqual(result.status, 0);
    assert.equal(result.outputs, '');
    assert.equal(result.environment, '');
  }
});

test('push events retain their exact tagged SHA and reject a mismatched tag', t => {
  const { git, run, sha } = repository(t);
  git('checkout', '--detach', sha);
  const env = { GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/tags/toolkit-v4.26.1', GITHUB_SHA: sha };
  const result = run('', '', env);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.outputs, `TAG=toolkit-v4.26.1\nSHA=${sha}\n`);
  assert.notEqual(run('', '', { ...env, GITHUB_SHA: 'b'.repeat(40) }).status, 0);
});

test('manual resume rejects unmerged and interior feature-branch release commits', t => {
  const { git, run } = repository(t);
  git('checkout', '-b', 'feature');
  git('commit', '--allow-empty', '-m', 'Unmerged feature');
  const featureSha = git('rev-parse', 'HEAD');
  git('tag', 'toolkit-v4.27.0');
  git('checkout', 'main');
  assert.match(run('toolkit-v4.27.0', featureSha).stderr, /main branch commit history/);
  git('merge', '--no-ff', 'feature', '-m', 'Merge feature');
  git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'HEAD'));
  assert.match(run('toolkit-v4.27.0', featureSha).stderr, /main branch commit history/);
});
