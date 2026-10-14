import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { setTimeout } from 'node:timers/promises';

const [tag, notesPath, ...assets] = process.argv.slice(2);
const { GITHUB_REPOSITORY: repository } = process.env;
// A manual resume runs its controller on main but packages the original tag SHA.
const sha = process.env.RELEASE_SHA || process.env.GITHUB_SHA;
assert(repository && sha && notesPath && assets.length, 'Release tag, notes, assets, repository, and exact SHA are required');
assert(/^(toolkit|react)-v\d+\.\d+\.\d+$/.test(tag), 'Canonical stable release tag required');
const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' });
function verifyRemoteTag() {
  execFileSync('git', ['diff', '--exit-code', 'HEAD'], { encoding: 'utf8' });
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), sha, 'Package checkout differs from the release SHA');
  const refs = execFileSync('git', ['ls-remote', 'origin', `refs/tags/${tag}`, `refs/tags/${tag}^{}`], { encoding: 'utf8' }).trim().split('\n');
  const peeled = refs.find(line => line.endsWith('^{}')) || refs[0];
  assert.equal(peeled.split('\t')[0], sha, 'Remote tag moved or disappeared');
}
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
verifyRemoteTag();
// Listing distinguishes an absent release from an authentication/network failure.
function findRelease() {
  const releases = JSON.parse(gh('api', '--paginate', '--slurp', `repos/${repository}/releases`)).flat();
  return releases.find(item => item.tag_name === tag);
}
let release = findRelease();
if (!release) {
  gh('release', 'create', tag, '--verify-tag', '--target', sha, '--draft', '--title', tag, '--notes-file', notesPath, '--repo', repository);
  // GitHub's release list can lag behind a successful draft creation.
  // Retry only successful reads with no match, never creation or publication.
  try {
    for (let attempt = 1; attempt <= 10; attempt += 1) {
      release = findRelease();
      if (release) break;
      if (attempt < 10) await setTimeout(1000);
    }
    assert(release, 'Release draft was not visible after 10 reads');
  } catch (error) {
    throw new Error(
      `Draft lookup failed after creation for ${tag}. The draft may already exist. `
      + 'Inspect the existing release before resuming; do not delete, overwrite, or retag.',
      { cause: error },
    );
  }
}
assert(release.draft, 'Published releases must not be overwritten');
const downloads = mkdtempSync(join(tmpdir(), 'ofh-release-download-'));
try {
  const expectedNames = assets.map(asset => basename(asset));
  assert(release.assets.every(asset => expectedNames.includes(asset.name)), 'Draft has unexpected assets; inspect it before resuming');
  for (const asset of assets) {
    const name = basename(asset);
    const expectedDigest = digest(asset);
    if (!release.assets.some(item => item.name === name)) {
      gh('release', 'upload', tag, asset, '--repo', repository);
    }
    gh('release', 'download', tag, '--pattern', name, '--dir', downloads, '--repo', repository);
    assert.equal(digest(join(downloads, name)), expectedDigest, `Uploaded asset differs from staged bytes: ${name}`);
    process.stdout.write(`Verified uploaded asset ${name}: SHA-256 ${expectedDigest}\n`);
  }
  verifyRemoteTag();
  try {
    gh('release', 'edit', tag, '--notes-file', notesPath, '--draft=false', '--repo', repository);
  } catch (error) {
    throw new Error(
      `Publication outcome is unknown for ${tag}; the release may already be public. `
      + `Inspect the existing release at https://github.com/${repository}/releases/tag/${tag} against expected SHA ${sha}. `
      + 'Do not rerun publication, overwrite, delete, or retag.',
      { cause: error },
    );
  }
  try {
    verifyRemoteTag();
  } catch (error) {
    throw new Error(
      `Publication completed for ${tag}, but final verification failed. `
      + `Inspect the existing release at https://github.com/${repository}/releases/tag/${tag} against expected SHA ${sha}. `
      + 'Do not rerun publication, overwrite, delete, or retag.',
      { cause: error },
    );
  }
  process.stdout.write(`Published ${tag} after verifying remote tag and uploaded asset digests\n`);
} finally {
  rmSync(downloads, { recursive: true, force: true });
}
