import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

const [tag, notesPath, ...assets] = process.argv.slice(2);
const { GITHUB_REPOSITORY: repository, GITHUB_SHA: sha } = process.env;
assert(repository && sha && notesPath && assets.length, 'Release tag, notes, assets, repository, and exact SHA are required');
assert(/^(toolkit|react)-v\d+\.\d+\.\d+$/.test(tag), 'Canonical stable release tag required');
const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' });
function verifyRemoteTag() {
  execFileSync('git', ['diff', '--exit-code', 'HEAD'], { encoding: 'utf8' });
  const refs = execFileSync('git', ['ls-remote', 'origin', `refs/tags/${tag}`, `refs/tags/${tag}^{}`], { encoding: 'utf8' }).trim().split('\n');
  const peeled = refs.find(line => line.endsWith('^{}')) || refs[0];
  assert.equal(peeled.split('\t')[0], sha, 'Remote tag moved or disappeared');
}
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
verifyRemoteTag();
// Listing distinguishes an absent release from an authentication/network failure.
const releases = JSON.parse(gh('api', '--paginate', '--slurp', `repos/${repository}/releases`)).flat();
let release = releases.find(item => item.tag_name === tag);
if (release) {
  assert(release.draft, 'Published releases must not be overwritten');
} else {
  gh('release', 'create', tag, '--verify-tag', '--target', sha, '--draft', '--title', tag, '--notes-file', notesPath, '--repo', repository);
  release = JSON.parse(gh('api', `repos/${repository}/releases/tags/${tag}`));
}
const downloads = mkdtempSync(join(tmpdir(), 'ofh-release-download-'));
try {
  const expectedNames = assets.map(asset => basename(asset));
  assert(release.assets.every(asset => expectedNames.includes(asset.name)), 'Draft has unexpected assets; inspect it before resuming');
  for (const asset of assets) {
    const name = basename(asset);
    if (!release.assets.some(item => item.name === name)) {
      gh('release', 'upload', tag, asset, '--repo', repository);
    }
    gh('release', 'download', tag, '--pattern', name, '--dir', downloads, '--repo', repository);
    assert.equal(digest(join(downloads, name)), digest(asset), `Uploaded asset differs from staged bytes: ${name}`);
  }
  verifyRemoteTag();
  gh('release', 'edit', tag, '--notes-file', notesPath, '--draft=false', '--repo', repository);
  verifyRemoteTag();
  process.stdout.write(`Published ${tag} after verifying remote tag and uploaded asset digests\n`);
} finally {
  rmSync(downloads, { recursive: true, force: true });
}
