import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const script = `${root}scripts/release/render-release-notes.sh`;
const version = JSON.parse(readFileSync(`${root}packages/toolkit/package.json`, 'utf8')).version;
const args = ['--package', 'toolkit', '--tag', `toolkit-v${version}`, '--version', version,
  '--tarball', `ourfuturehealth-toolkit-${version}.tgz`, '--zip', `ofh-design-system-toolkit-${version}.zip`, '--source-ref', 'a'.repeat(40)];

test('rehearsal notes link to the workflow repository and exact source SHA', () => {
  const notes = execFileSync(script, args, { cwd: root, encoding: 'utf8', stdio: 'pipe',
    env: { ...process.env, GITHUB_REPOSITORY: 'example/release-rehearsal' } });
  assert(notes.includes(`https://github.com/example/release-rehearsal/releases/download/toolkit-v${version}/`));
  assert(notes.includes(`https://github.com/example/release-rehearsal/blob/${'a'.repeat(40)}/UPGRADING.md`));
  assert(notes.includes(`https://github.com/example/release-rehearsal/blob/${'a'.repeat(40)}/CHANGELOG.md`));
});

test('release note repository names cannot inject a different URL or Markdown', () => {
  assert.throws(() => execFileSync(script, args, { cwd: root, stdio: 'pipe',
    env: { ...process.env, GITHUB_REPOSITORY: 'example/repository/../../other' } }), /Invalid release repository/);
});
