import assert from 'node:assert/strict';
import { lstatSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { packages } from './release-metadata.mjs';
import { digest } from './github-release.mjs';

export function releaseFiles(release) {
  const pkg = packages.find(item => item.name === release.name);
  assert(pkg, `Unsupported release package: ${release.name}`);
  assert(/^\d+\.\d+\.\d+$/.test(release.version), 'Stable release version required');
  assert.equal(release.tag, `${pkg.prefix}${release.version}`, 'Release tag differs from package/version');
  const key = pkg.manifest.split('/')[1];
  const tarball = `ourfuturehealth-${key}-${release.version}.tgz`;
  const zip = key === 'toolkit' ? `ofh-design-system-toolkit-${release.version}.zip` : undefined;
  return { ...pkg, key, tarball, zip };
}

export function validateBundle(bundle, plan, directory) {
  assert.equal(bundle.schemaVersion, 1, 'Unsupported release bundle');
  for (const field of ['repository', 'prNumber', 'sha', 'baseSha']) assert.equal(bundle[field], plan[field], `Bundle ${field} differs from the verified release plan`);
  assert(plan.releases.length > 0 && plan.releases.length <= packages.length, 'Release batch must contain supported packages');
  assert.equal(bundle.releases.length, plan.releases.length, 'Bundle package count differs from release plan');
  assert.equal(new Set(bundle.releases.map(release => release.name)).size, bundle.releases.length, 'Duplicate release package');
  return plan.releases.map(release => {
    const files = releaseFiles(release);
    const item = bundle.releases.find(entry => entry.name === release.name);
    assert(item && item.version === release.version && item.tag === release.tag, 'Bundle package identity differs from release plan');
    const paths = [files.tarball, files.zip].filter(Boolean).map(name => `${files.key}/${name}`);
    assert.deepEqual(item.assets.map(asset => asset.path), paths, 'Bundle must contain exactly the canonical package assets');
    assert.equal(item.notes.path, `${files.key}/notes.md`, 'Unexpected release notes path');
    for (const file of [...item.assets, item.notes]) {
      const path = join(realpathSync(directory), file.path);
      assert.equal(realpathSync(path), path, 'Bundle paths must not follow symlinked directories');
      assert(lstatSync(path).isFile(), 'Bundle files must be regular files, not symlinks');
      assert(/^[a-f0-9]{64}$/.test(file.sha256), 'SHA-256 digest required');
      assert.equal(digest(path), file.sha256, `Bundle checksum mismatch: ${file.path}`);
    }
    return { ...release, assets: item.assets.map(asset => join(directory, asset.path)), notesPath: join(directory, item.notes.path) };
  });
}
