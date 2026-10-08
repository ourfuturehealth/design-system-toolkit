import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

function runPublisher(overrides = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-publisher-test-'));
  try {
    const bin = join(directory, 'bin');
    mkdirSync(bin);
    const fixture = join(bin, 'release-command.mjs');
    cpSync('scripts/release/fixtures/release-command.mjs', fixture);
    chmodSync(fixture, 0o755);
    for (const command of ['git', 'gh']) symlinkSync(fixture, join(bin, command));
    const statePath = join(directory, 'state.json');
    const state = { tag: 'toolkit-v4.26.1', sha: 'a'.repeat(40), releases: [], commands: [], tagChecks: 0, ...overrides };
    writeFileSync(statePath, JSON.stringify(state));
    const tarball = join(directory, 'ourfuturehealth-toolkit-4.26.1.tgz');
    const zip = join(directory, 'ofh-design-system-toolkit-4.26.1.zip');
    const notes = join(directory, 'notes.md');
    writeFileSync(tarball, 'tarball bytes');
    writeFileSync(zip, 'ZIP bytes');
    writeFileSync(notes, 'Reviewed release notes');
    const result = spawnSync(process.execPath, [resolve('scripts/release/publish-staged-release.mjs'), state.tag, notes, tarball, zip], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        MOCK_RELEASE_STATE: statePath,
        GITHUB_REPOSITORY: 'example/design-system',
        GITHUB_SHA: state.sha,
      },
    });
    return { result, state: JSON.parse(readFileSync(statePath, 'utf8')) };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test('publisher uploads to a draft, verifies both assets, then publishes', () => {
  const { result, state } = runPublisher();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(state.releases[0].draft, false);
  assert.equal(state.releases[0].assets.length, 2);
  const operations = state.commands.filter(command => command[0] === 'gh' && command[1] === 'release').map(command => command[2]);
  assert.deepEqual(operations, ['create', 'upload', 'download', 'upload', 'download', 'edit']);
  assert.equal(state.tagChecks, 3);
});

test('published releases are never overwritten', () => {
  const { result, state } = runPublisher({ releases: [{ tag_name: 'toolkit-v4.26.1', draft: false, assets: [] }] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not be overwritten/);
  assert(!state.commands.some(command => command[1] === 'release'));
});

test('matching draft assets can resume without being overwritten', () => {
  const { result, state } = runPublisher({ releases: [{ tag_name: 'toolkit-v4.26.1', draft: true, assets: [{ name: 'ourfuturehealth-toolkit-4.26.1.tgz', content: 'tarball bytes' }] }] });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(state.commands.filter(command => command[2] === 'upload').length, 1);
});

test('corrupt assets remain unpublished', () => {
  const { result, state } = runPublisher({ corruptUpload: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /differs from staged bytes/);
  assert.equal(state.releases[0].draft, true);
});

test('tag movement during upload prevents publication', () => {
  const { result, state } = runPublisher({ moveAfter: 2 });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /tag moved or disappeared/);
  assert.equal(state.releases[0].draft, true);
});

test('an API failure does not get treated as a missing release', () => {
  const { result, state } = runPublisher({ failApi: true });
  assert.notEqual(result.status, 0);
  assert(!state.commands.some(command => command[2] === 'create'));
});

test('source modifications during the build prevent publication', () => {
  const { result, state } = runPublisher({ dirty: true });
  assert.notEqual(result.status, 0);
  assert(!state.commands.some(command => command[0] === 'gh'));
});
