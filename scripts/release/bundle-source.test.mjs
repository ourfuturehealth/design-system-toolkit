import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { verifyBundleProducer } from './verify-bundle-source.mjs';

function fixture(t, check) {
  const directory = mkdtempSync(`${tmpdir()}/ofh-bundle-source-`);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args],
    { cwd: directory, encoding: 'utf8', stdio: 'pipe' }).trim();
  git('init', '-b', 'main');
  git('config', 'user.email', 'release-tests@example.invalid');
  git('config', 'user.name', 'Release tests');
  writeFileSync(`${directory}/source.txt`, 'Baseline');
  git('add', '.');
  git('commit', '-m', 'Baseline');
  const base = git('rev-parse', 'HEAD');
  writeFileSync(`${directory}/source.txt`, 'Reviewed release');
  git('add', '.');
  git('commit', '-m', 'Reviewed release');
  const sha = git('rev-parse', 'HEAD');
  // Every fetch remains local to this disposable repository.
  git('remote', 'add', 'origin', directory);
  git('update-ref', 'refs/remotes/origin/main', sha);
  const plan = { repository: 'example/design-system', prNumber: 42, sha };
  const run = { repository: { full_name: plan.repository }, path: '.github/workflows/publish-release.yml',
    status: 'completed', event: 'pull_request', head_sha: sha, pull_requests: [{ number: 42 }] };
  const previous = process.cwd();
  process.chdir(directory);
  try { check({ git, base, plan, run }); }
  finally { process.chdir(previous); }
}

test('an original publication bundle requires the protected workflow and completed run', t => {
  fixture(t, ({ plan, run }) => {
    assert.throws(() => verifyBundleProducer({ ...run, repository: { full_name: 'fork/design-system' } }, plan), /in this repository/);
    assert.throws(() => verifyBundleProducer({ ...run, path: '.github/workflows/other.yml' }, plan), /protected publication workflow/);
    assert.throws(() => verifyBundleProducer({ ...run, status: 'in_progress' }, plan), /wait for the original/);
    assert.throws(() => verifyBundleProducer({ ...run, head_sha: 'main' }, plan), /exact source SHA/);
  });
});

test('PR bundle provenance checks the exact release tree, including absent closed-PR associations', t => {
  fixture(t, ({ git, base, plan, run }) => {
    verifyBundleProducer(run, plan);
    verifyBundleProducer({ ...run, pull_requests: [] }, plan);
    // A squash result can have a different SHA but the identical reviewed tree.
    git('commit', '--allow-empty', '-m', 'Equivalent merge tree');
    verifyBundleProducer({ ...run, head_sha: git('rev-parse', 'HEAD') }, plan);
    assert.throws(() => verifyBundleProducer({ ...run, pull_requests: [{ number: 99 }] }, plan), /another release PR/);
    assert.throws(() => verifyBundleProducer({ ...run, head_sha: base }, plan), /tree differs/);
  });
});

test('manually produced bundles require protected main history, not an unmerged branch', t => {
  fixture(t, ({ git, plan, run }) => {
    verifyBundleProducer({ ...run, event: 'workflow_dispatch' }, plan);
    git('switch', '-c', 'unmerged');
    git('commit', '--allow-empty', '-m', 'Unmerged workflow source');
    assert.throws(() => verifyBundleProducer({ ...run, event: 'workflow_dispatch', head_sha: git('rev-parse', 'HEAD') }, plan), /protected main history/);
    assert.throws(() => verifyBundleProducer({ ...run, event: 'push' }, plan), /Unsupported bundle producer/);
  });
});
