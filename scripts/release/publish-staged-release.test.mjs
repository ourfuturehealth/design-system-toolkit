import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
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

test('new drafts are retrieved through the release list, not the published-tag endpoint', () => {
  const { result, state } = runPublisher();
  assert.equal(result.status, 0, result.stderr);
  const apiCalls = state.commands.filter(command => command[0] === 'gh' && command[1] === 'api');
  assert.equal(apiCalls.length, 2);
  assert(apiCalls.every(command => command.at(-1) === 'repos/example/design-system/releases'));
  const creation = state.commands.findIndex(command => command[2] === 'create');
  const lookup = state.commands.findIndex((command, index) => index > creation && command[1] === 'api');
  const upload = state.commands.findIndex(command => command[2] === 'upload');
  assert(lookup > creation && lookup < upload, 'Reload the newly created draft before uploading');
});

test('waits for a newly created draft to appear in the release list', () => {
  const { result, state } = runPublisher({ hiddenDraftReads: 2 });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(state.commands.filter(command => command[2] === 'create').length, 1);
  assert.equal(state.commands.filter(command => command[0] === 'gh' && command[1] === 'api').length, 4);
  assert.equal(state.releases[0].draft, false);
});

test('published releases are never overwritten', () => {
  const { result, state } = runPublisher({ releases: [{ tag_name: 'toolkit-v4.26.1', draft: false, assets: [] }] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not be overwritten/);
  assert(!state.commands.some(command => command[1] === 'release'));
});

test('delayed draft visibility retries reads without repeating creation or publication', () => {
  const { result, state } = runPublisher({ hiddenReadsAfterCreate: 2 });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(state.releases[0].draft, false);
  assert.equal(state.commands.filter(command => command[1] === 'api').length, 4);
  assert.equal(state.commands.filter(command => command[2] === 'create').length, 1);
  assert.equal(state.commands.filter(command => command[2] === 'edit').length, 1);
});

test('a draft that stays invisible stops after bounded reads without uploads or publication', () => {
  const { result, state } = runPublisher({ hiddenReadsAfterCreate: 100 });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Draft lookup failed after creation/);
  assert.match(result.stderr, /Inspect the existing release before resuming/);
  assert.equal(state.commands.filter(command => command[1] === 'api').length, 11);
  assert.equal(state.commands.filter(command => command[2] === 'create').length, 1);
  assert.equal(state.releases[0].draft, true);
  assert.equal(state.releases[0].assets.length, 0);
  assert(!state.commands.some(command => command[2] === 'upload' || command[2] === 'edit'));
});

test('an API error after creation stops immediately without recreating the draft', () => {
  const { result, state } = runPublisher({ failApiAfterCreate: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Draft lookup failed after creation/);
  assert.equal(state.commands.filter(command => command[1] === 'api').length, 2);
  assert.equal(state.commands.filter(command => command[2] === 'create').length, 1);
  assert.equal(state.releases[0].draft, true);
  assert(!state.commands.some(command => command[2] === 'upload' || command[2] === 'edit'));
});

test('an existing empty draft resumes without repeating creation', () => {
  const { result, state } = runPublisher({ releases: [{ tag_name: 'toolkit-v4.26.1', draft: true, assets: [] }] });
  assert.equal(result.status, 0, result.stderr);
  assert(!state.commands.some(command => command[2] === 'create'));
  assert.equal(state.releases[0].draft, false);
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

test('tag movement after publication requires inspection without rolling back the release', () => {
  const { result, state } = runPublisher({ moveAfter: 3 });
  assert.notEqual(result.status, 0);
  assert.equal(state.releases[0].draft, false);
  assert.match(result.stderr, /Publication completed.*final verification failed/);
  assert.match(result.stderr, /Inspect the existing release/);
  assert.match(result.stderr, /Do not rerun publication, overwrite, delete, or retag/);
  assert.equal(state.commands.filter(command => command[2] === 'edit').length, 1);
  for (const asset of state.releases[0].assets) {
    const digest = createHash('sha256').update(asset.content).digest('hex');
    assert(result.stdout.includes(`Verified uploaded asset ${asset.name}: SHA-256 ${digest}`));
  }
});

test('a final tag-read failure reports publication completed without claiming tag movement', () => {
  const { result, state } = runPublisher({ failTagCheckAt: 3 });
  assert.notEqual(result.status, 0);
  assert.equal(state.releases[0].draft, false);
  assert.match(result.stderr, /Publication completed.*final verification failed/);
  assert.match(result.stderr, /Synthetic remote tag read failed/);
  assert.doesNotMatch(result.stderr, /Remote tag moved or disappeared/);
});

test('a lost publish response reports uncertainty even when the release became public', () => {
  const { result, state } = runPublisher({ failPublishAfterCommit: true });
  assert.notEqual(result.status, 0);
  assert.equal(state.releases[0].draft, false);
  assert.match(result.stderr, /Publication outcome is unknown/);
  assert.match(result.stderr, /release may already be public/);
  assert.doesNotMatch(result.stderr, /Publication completed/);
  assert.equal(state.commands.filter(command => command[2] === 'edit').length, 1);
});

test('a rejected publish request also reports uncertainty without claiming publication completed', () => {
  const { result, state } = runPublisher({ failPublishBeforeCommit: true });
  assert.notEqual(result.status, 0);
  assert.equal(state.releases[0].draft, true);
  assert.match(result.stderr, /Publication outcome is unknown/);
  assert.doesNotMatch(result.stderr, /Publication completed/);
  assert.equal(state.commands.filter(command => command[2] === 'edit').length, 1);
});

test('a retry after failed final verification leaves the published release untouched', () => {
  const first = runPublisher({ moveAfter: 3 });
  const { result, state } = runPublisher({ releases: first.state.releases });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Published releases must not be overwritten/);
  assert.equal(state.releases[0].draft, false);
  assert(!state.commands.some(command => command[0] === 'gh' && command[1] === 'release'));
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
