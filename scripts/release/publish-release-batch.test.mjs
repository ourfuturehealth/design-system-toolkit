import assert from 'node:assert/strict';
import test from 'node:test';
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publishReleaseBatch } from './publish-release-batch.mjs';
import { digest } from './github-release.mjs';
import { releaseFiles } from './release-bundle.mjs';

function runBatch(overrides = {}, resume = false, mutate = () => {}, packageName) {
  const directory = mkdtempSync(`${tmpdir()}/ofh-batch-test-`);
  const previous = { PATH: process.env.PATH, MOCK_RELEASE_STATE: process.env.MOCK_RELEASE_STATE };
  try {
    const bin = join(directory, 'bin');
    mkdirSync(bin);
    const command = join(bin, 'command.mjs');
    cpSync('scripts/release/fixtures/release-command.mjs', command);
    chmodSync(command, 0o755);
    for (const name of ['git', 'gh']) symlinkSync(command, join(bin, name));
    const plan = {
      schemaVersion: 1, repository: 'example/design-system', prNumber: 42, sha: 'a'.repeat(40), baseSha: 'b'.repeat(40),
      releases: [
        { name: '@ourfuturehealth/toolkit', version: '4.26.1', tag: 'toolkit-v4.26.1' },
        { name: '@ourfuturehealth/react-components', version: '0.26.1', tag: 'react-v0.26.1' },
      ],
    };
    if (packageName) plan.releases = plan.releases.filter(release => release.name === packageName);
    const bundle = { ...plan, releases: [] };
    for (const release of plan.releases) {
      const files = releaseFiles(release);
      mkdirSync(join(directory, files.key));
      const describe = name => {
        const path = `${files.key}/${name}`;
        writeFileSync(join(directory, path), `${name}: verified bytes`);
        return { path, sha256: digest(join(directory, path)) };
      };
      bundle.releases.push({ ...release, assets: [files.tarball, files.zip].filter(Boolean).map(describe), notes: describe('notes.md') });
    }
    writeFileSync(join(directory, 'release-bundle.json'), JSON.stringify(bundle));
    mutate(directory, bundle);
    const statePath = join(directory, 'commands.json');
    writeFileSync(statePath, JSON.stringify({ sha: plan.sha, tags: {}, tagChecks: 0, releases: [], commands: [], ...overrides }));
    process.env.PATH = `${bin}:${previous.PATH}`;
    process.env.MOCK_RELEASE_STATE = statePath;
    let error;
    try { publishReleaseBatch(plan, directory, resume, join(directory, 'publication-state.json')); }
    catch (failure) { error = failure; }
    return {
      error, commands: JSON.parse(readFileSync(statePath, 'utf8')),
      outcome: JSON.parse(readFileSync(join(directory, 'publication-state.json'), 'utf8')),
    };
  } finally {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    rmSync(directory, { recursive: true, force: true });
  }
}

test('both drafts and all uploaded assets are verified before the first package becomes public', () => {
  const { error, commands, outcome } = runBatch();
  assert.ifError(error);
  assert(outcome.completed);
  assert(commands.releases.every(release => !release.draft));
  const firstPublish = commands.commands.findIndex(command => command[1] === 'release' && command[2] === 'edit');
  const uploads = commands.commands.map((command, index) => ({ command, index })).filter(item => item.command[2] === 'upload');
  assert.equal(uploads.length, 3);
  assert(uploads.every(item => item.index < firstPublish));
});

const mutations = state => state.commands.filter(command => command[0] === 'gh'
  && (command.includes('POST') || ['create', 'upload', 'edit'].includes(command[2])));

test('a corrupt second package leaves both releases as drafts, never partially public', () => {
  const { error, commands, outcome } = runBatch({ corruptTag: 'react-v0.26.1' });
  assert.match(error.message, /differs from staged bytes/);
  assert(commands.releases.every(release => release.draft));
  assert(!commands.commands.some(command => command[2] === 'edit'));
  assert.equal(outcome.completed, false);
});

test('a lost publish response stops the batch and records inspection rather than success', () => {
  const { error, commands, outcome } = runBatch({ failPublishAfterTag: 'toolkit-v4.26.1' });
  assert.match(error.message, /outcome is unknown/);
  assert.equal(commands.releases.find(release => release.tag_name === 'toolkit-v4.26.1').draft, false);
  assert.equal(commands.releases.find(release => release.tag_name === 'react-v0.26.1').draft, true);
  assert.equal(outcome.completed, false);
  assert.equal(outcome.releases[0].status, 'inspection-required');
});

test('explicit resume verifies an already public package and publishes only the remaining draft', () => {
  const first = runBatch({ failPublishAfterTag: 'toolkit-v4.26.1' });
  const { error, commands, outcome } = runBatch({ tags: first.commands.tags, releases: first.commands.releases }, true);
  assert.ifError(error);
  assert(outcome.completed);
  assert.equal(outcome.releases[0].status, 'already-public');
  const writes = mutations(commands);
  assert.equal(writes.length, 1);
  assert.deepEqual(writes.map(command => command[3]), ['react-v0.26.1']);
});

test('ordinary reruns cannot silently adopt tags or releases from an earlier attempt', () => {
  const { error, commands } = runBatch({ tags: { 'toolkit-v4.26.1': 'a'.repeat(40) } });
  assert.match(error.message, /explicitly resume/);
  assert.equal(mutations(commands).length, 0);
});

test('resume refuses a moved tag before making any remote change', () => {
  const { error, commands } = runBatch({ tags: { 'toolkit-v4.26.1': 'b'.repeat(40) } }, true);
  assert.match(error.message, /differs from the merged SHA/);
  assert.equal(mutations(commands).length, 0);
});

test('a lost tag-creation response cannot create additional tags or start publication', () => {
  const { error, commands, outcome } = runBatch({ failTagAfterCommit: true });
  assert.match(error.message, /Tag creation outcome is unknown/);
  assert.equal(Object.keys(commands.tags).length, 1);
  assert.equal(commands.releases.length, 0);
  assert.equal(outcome.completed, false);
  assert.equal(mutations(commands).length, 1);
});

test('changed saved bytes fail before any GitHub mutation', () => {
  const { error, commands } = runBatch({}, false, directory => {
    writeFileSync(join(directory, 'toolkit/ourfuturehealth-toolkit-4.26.1.tgz'), 'different bytes');
  });
  assert.match(error.message, /Bundle checksum mismatch/);
  assert.equal(mutations(commands).length, 0);
});

test('saved artifacts cannot use non-canonical package paths', () => {
  const { error, commands } = runBatch({}, false, (directory, bundle) => {
    bundle.releases[0].assets[0].path = '../unexpected.tgz';
    writeFileSync(join(directory, 'release-bundle.json'), JSON.stringify(bundle));
  });
  assert.match(error.message, /canonical package assets/);
  assert.equal(mutations(commands).length, 0);
});

test('saved release notes and source identity cannot differ from the verified bundle', () => {
  for (const field of ['sha', 'notes-path', 'notes-bytes']) {
    const { error, commands } = runBatch({}, false, (directory, bundle) => {
      if (field === 'sha') bundle.sha = 'c'.repeat(40);
      else if (field === 'notes-path') bundle.releases[0].notes.path = 'react-components/notes.md';
      else writeFileSync(join(directory, 'toolkit/notes.md'), 'Unreviewed release notes');
      writeFileSync(join(directory, 'release-bundle.json'), JSON.stringify(bundle));
    });
    assert.match(error.message, /Bundle sha differs|Unexpected release notes path|Bundle checksum mismatch/);
    assert.equal(mutations(commands).length, 0);
  }
});

test('bundle package directories cannot be replaced by symlinks', () => {
  const { error, commands } = runBatch({}, false, directory => {
    renameSync(join(directory, 'toolkit'), join(directory, 'other-directory'));
    symlinkSync(join(directory, 'other-directory'), join(directory, 'toolkit'));
  });
  assert.match(error.message, /must not follow symlinked directories/);
  assert.equal(mutations(commands).length, 0);
});

test('a package-only batch does not create or publish an unchanged package', () => {
  const { error, commands, outcome } = runBatch({}, false, undefined, '@ourfuturehealth/react-components');
  assert.ifError(error);
  assert(outcome.completed);
  assert.deepEqual(Object.keys(commands.tags), ['react-v0.26.1']);
  assert.deepEqual(commands.releases.map(release => release.tag_name), ['react-v0.26.1']);
});

test('an API outage is never interpreted as an absent tag or release', () => {
  const { error, commands } = runBatch({ failApi: true });
  assert(error);
  assert.equal(mutations(commands).length, 0);
});

test('a corrupt already public release prevents resuming the remaining package', () => {
  const first = runBatch({ failPublishAfterTag: 'toolkit-v4.26.1' });
  first.commands.releases[0].assets[0].content = 'changed public bytes';
  const { error, commands } = runBatch({ tags: first.commands.tags, releases: first.commands.releases }, true);
  assert.match(error.message, /differs from staged bytes/);
  assert.equal(mutations(commands).length, 0);
});
