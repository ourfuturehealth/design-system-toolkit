import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { setTimeout } from 'node:timers/promises';

export const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' });
export const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');

export function githubReleaseClient(repository, sha) {
  assert(repository && /^[a-f0-9]{40}$/.test(sha), 'Repository and exact release SHA required');
  function verifyRemoteTag(tag) {
    execFileSync('git', ['diff', '--exit-code', 'HEAD'], { encoding: 'utf8' });
    const refs = execFileSync('git', ['ls-remote', 'origin', `refs/tags/${tag}`, `refs/tags/${tag}^{}`], { encoding: 'utf8' }).trim().split('\n');
    const peeled = refs.find(line => line.endsWith('^{}')) || refs[0];
    assert.equal(peeled.split('\t')[0], sha, 'Remote tag moved or disappeared');
  }
  function findRelease(tag) {
    const releases = JSON.parse(gh('api', '--paginate', '--slurp', `repos/${repository}/releases`)).flat();
    return releases.find(item => item.tag_name === tag);
  }
  function checkNames(release, assets, complete = false) {
    const names = assets.map(asset => basename(asset));
    assert.equal(new Set(names).size, names.length, 'Duplicate staged asset names');
    assert(release.assets.every(asset => names.includes(asset.name)), 'Draft has unexpected assets; inspect it before resuming');
    if (complete) assert.equal(release.assets.length, names.length, 'Release is missing expected assets');
  }
  function verifyAssets(release, assets, complete = false) {
    checkNames(release, assets, complete);
    const downloads = mkdtempSync(join(tmpdir(), 'ofh-release-download-'));
    try {
      for (const asset of assets) {
        const name = basename(asset);
        if (!release.assets.some(item => item.name === name)) continue;
        gh('release', 'download', release.tag_name, '--pattern', name, '--dir', downloads, '--repo', repository);
        assert.equal(digest(join(downloads, name)), digest(asset), `Uploaded asset differs from staged bytes: ${name}`);
        process.stdout.write(`Verified uploaded asset ${name}: SHA-256 ${digest(asset)}\n`);
      }
    } finally {
      rmSync(downloads, { recursive: true, force: true });
    }
  }
  async function stage(tag, notesPath, assets, allowPublic = false) {
    verifyRemoteTag(tag);
    let release = findRelease(tag);
    if (!release) {
      gh('release', 'create', tag, '--verify-tag', '--target', sha, '--draft', '--title', tag, '--notes-file', notesPath, '--repo', repository);
      // Successful draft creation can precede its visibility in the release list.
      // Retry only successful reads with no match, never creation or publication.
      try {
        for (let attempt = 1; attempt <= 10; attempt += 1) {
          release = findRelease(tag);
          if (release) break;
          if (attempt < 10) await setTimeout(1000);
        }
        assert(release, 'Release draft was not visible after 10 reads');
      } catch (error) {
        throw new Error(`Draft lookup failed after creation for ${tag}. The draft may already exist. `
          + 'Inspect the existing release before resuming; do not delete, overwrite, or retag.', { cause: error });
      }
    }
    if (!release.draft) {
      assert(allowPublic, 'Published releases must not be overwritten');
      verifyAssets(release, assets, true);
      return { tag, notesPath, assets, release };
    }
    checkNames(release, assets);
    const downloads = mkdtempSync(join(tmpdir(), 'ofh-release-download-'));
    try {
      for (const asset of assets) {
        const name = basename(asset);
        if (!release.assets.some(item => item.name === name)) gh('release', 'upload', tag, asset, '--repo', repository);
        gh('release', 'download', tag, '--pattern', name, '--dir', downloads, '--repo', repository);
        assert.equal(digest(join(downloads, name)), digest(asset), `Uploaded asset differs from staged bytes: ${name}`);
        process.stdout.write(`Verified uploaded asset ${name}: SHA-256 ${digest(asset)}\n`);
      }
    } finally {
      rmSync(downloads, { recursive: true, force: true });
    }
    return { tag, notesPath, assets, release };
  }
  function publish(staged) {
    const { tag, notesPath, release } = staged;
    assert(release.draft, 'Published releases must not be overwritten');
    verifyRemoteTag(tag);
    try {
      gh('release', 'edit', tag, '--notes-file', notesPath, '--draft=false', '--repo', repository);
    } catch (error) {
      throw new Error(`Publication outcome is unknown for ${tag}; the release may already be public. `
        + `Inspect the existing release at https://github.com/${repository}/releases/tag/${tag} against expected SHA ${sha}. `
        + 'Do not rerun publication, overwrite, delete, or retag.', { cause: error });
    }
    try {
      verifyRemoteTag(tag);
    } catch (error) {
      throw new Error(`Publication completed for ${tag}, but final verification failed. `
        + `Inspect the existing release at https://github.com/${repository}/releases/tag/${tag} against expected SHA ${sha}. `
        + 'Do not rerun publication, overwrite, delete, or retag.', { cause: error });
    }
    process.stdout.write(`Published ${tag} after verifying remote tag and uploaded asset digests\n`);
  }
  return { verifyRemoteTag, findRelease, verifyAssets, stage, publish };
}
