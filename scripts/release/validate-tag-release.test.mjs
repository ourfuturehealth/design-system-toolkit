import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

function runGuard(overrides = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-tag-guard-test-'));
  try {
    const bin = join(directory, 'bin');
    mkdirSync(bin);
    const fixture = join(bin, 'release-command.mjs');
    cpSync('scripts/release/fixtures/release-command.mjs', fixture);
    chmodSync(fixture, 0o755);
    symlinkSync(fixture, join(bin, 'git'));
    const statePath = join(directory, 'state.json');
    const state = { tag: 'toolkit-v4.26.1', sha: 'a'.repeat(40), commands: [], ...overrides };
    writeFileSync(statePath, JSON.stringify(state));
    mkdirSync(join(directory, 'packages/toolkit'), { recursive: true });
    writeFileSync(join(directory, 'packages/toolkit/package.json'), JSON.stringify({ name: state.manifestName || '@ourfuturehealth/toolkit', version: state.manifestVersion || '4.26.1' }));
    const date = state.date || new Date().toISOString().slice(0, 10);
    writeFileSync(join(directory, 'CHANGELOG.md'), `### ${date}\n\n#### @ourfuturehealth/toolkit 4.26.1 (\`toolkit-v4.26.1\`)\n\n##### Fixed\n\n- Fixed the public component.\n`);
    writeFileSync(join(directory, 'UPGRADING.md'), state.missingUpgrade ? '' : '| Version | Date | Breaking Changes | Consumer action | Migration Complexity |\n| ------- | ---- | ---------------- | --------------- | -------------------- |\n| `v4.26.1` | October 2026 | None | No consumer action required | APIs unchanged. |\n');
    const inventory = join(directory, 'releases.txt');
    writeFileSync(inventory, state.publishedTags || 'toolkit-v4.26.0\n');
    return spawnSync(process.execPath, [resolve('scripts/release/validate-tag-release.mjs'), state.tag, state.sha], {
      cwd: directory,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        MOCK_RELEASE_STATE: statePath,
        PUBLISHED_RELEASE_TAGS_FILE: inventory,
      },
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('merged SHA, tag, manifest, dated notes, and upgrade decision are required', () => {
  const result = runGuard();
  assert.equal(result.status, 0, result.stderr);
});

test('an unmerged commit or moved tag is rejected', () => {
  assert.notEqual(runGuard({ unmerged: true }).status, 0);
  assert.match(runGuard({ interiorCommit: true }).stderr, /main branch commit history/);
  assert.match(runGuard({ localMoved: true }).stderr, /tag differs from the release SHA/);
});

test('manifest mismatch and published version reuse are rejected', () => {
  assert.match(runGuard({ manifestName: '@ourfuturehealth/wrong-package' }).stderr, /package name differs/);
  assert.match(runGuard({ manifestVersion: '4.25.1' }).stderr, /tag differs from the package version/);
  assert.match(runGuard({ publishedTags: 'toolkit-v4.26.1\n' }).stderr, /must be greater than/);
});

test('unreleased notes, future dates, and missing upgrade decisions block publication', () => {
  assert.match(runGuard({ date: 'Unreleased' }).stderr, /Finalise the real release date/);
  assert.match(runGuard({ date: '2099-01-01' }).stderr, /Release date is in the future/);
  assert.match(runGuard({ missingUpgrade: true }).stderr, /Expected one upgrade guidance table/);
});

function createRealGitGuard(t) {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-real-tag-guard-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], {
    cwd: directory,
    encoding: 'utf8',
  }).trim();
  git('init', '--initial-branch=main');
  git('config', 'user.name', 'Release guard test');
  git('config', 'user.email', 'release-guard@example.invalid');
  mkdirSync(join(directory, 'packages/toolkit'), { recursive: true });
  writeFileSync(join(directory, 'packages/toolkit/package.json'), JSON.stringify({ name: '@ourfuturehealth/toolkit', version: '4.26.1' }));
  writeFileSync(join(directory, 'CHANGELOG.md'), `### ${new Date().toISOString().slice(0, 10)}\n\n#### @ourfuturehealth/toolkit 4.26.1 (\`toolkit-v4.26.1\`)\n\n- Fixed the public component.\n`);
  writeFileSync(join(directory, 'UPGRADING.md'), '| Version | Consumer action | Migration Complexity |\n| ------- | --------------- | -------------------- |\n| `v4.26.1` | No consumer action required | APIs unchanged. |\n');
  const inventory = join(directory, 'published-tags.txt');
  writeFileSync(inventory, 'toolkit-v4.26.0\n');
  git('add', '.');
  git('commit', '-m', 'Initial main commit');
  git('checkout', '-b', 'feature');
  writeFileSync(join(directory, 'component.txt'), 'Feature change\n');
  git('add', '.');
  git('commit', '-m', 'Feature commit');
  const featureSha = git('rev-parse', 'HEAD');
  git('checkout', 'main');
  const run = sha => {
    git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'main'));
    git('checkout', '--detach', sha);
    git('tag', 'toolkit-v4.26.1', sha);
    return spawnSync(process.execPath, [resolve('scripts/release/validate-tag-release.mjs'), 'toolkit-v4.26.1', sha], {
      cwd: directory,
      encoding: 'utf8',
      env: { ...process.env, PUBLISHED_RELEASE_TAGS_FILE: inventory },
    });
  };
  return { git, featureSha, run };
}

test('real Git accepts a merged release SHA even after main advances', t => {
  const { git, run } = createRealGitGuard(t);
  git('merge', '--no-ff', 'feature', '-m', 'Merge release PR');
  const mergedSha = git('rev-parse', 'HEAD');
  git('commit', '--allow-empty', '-m', 'Later main commit');
  const result = run(mergedSha);
  assert.equal(result.status, 0, result.stderr);
});

test('real Git accepts a fast-forwarded release commit on main', t => {
  const { git, featureSha, run } = createRealGitGuard(t);
  git('merge', '--ff-only', 'feature');
  const result = run(featureSha);
  assert.equal(result.status, 0, result.stderr);
});

test('real Git accepts the main commit created by a squash merge', t => {
  const { git, run } = createRealGitGuard(t);
  git('merge', '--squash', 'feature');
  git('commit', '-m', 'Squash release PR');
  const result = run(git('rev-parse', 'HEAD'));
  assert.equal(result.status, 0, result.stderr);
});

test('real Git rejects a feature commit that has not merged to main', t => {
  const { featureSha, run } = createRealGitGuard(t);
  const result = run(featureSha);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /merge-base --is-ancestor/);
});

test('real Git rejects an interior feature commit even after its PR merges', t => {
  const { git, featureSha, run } = createRealGitGuard(t);
  git('merge', '--no-ff', 'feature', '-m', 'Merge release PR');
  const result = run(featureSha);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /main branch commit history/);
});
