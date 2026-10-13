import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const tarball = resolve(process.argv[2] || '');
assert(process.argv[2], 'Usage: smoke-react-consumer.mjs <staged-react-tarball>');
const packed = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }));
assert.equal(packed.name, '@ourfuturehealth/react-components');
const consumer = mkdtempSync(join(tmpdir(), 'ofh-react-consumer-'));
try {
  cpSync('packages/example-react-consumer-app', consumer, {
    recursive: true,
    filter: path => !['node_modules', 'dist', '.git'].includes(basename(path)),
  });
  cpSync('eslint.config.mjs', join(consumer, 'eslint.shared.config.mjs'));
  const eslintPath = join(consumer, 'eslint.config.js');
  writeFileSync(eslintPath, readFileSync(eslintPath, 'utf8').replace('../../eslint.config.mjs', './eslint.shared.config.mjs'));
  const manifestPath = join(consumer, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.dependencies[packed.name] = `file:${tarball}`;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  const lockPath = join(consumer, 'package-lock.json');
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  lock.packages[''].dependencies[packed.name] = manifest.dependencies[packed.name];
  lock.packages[`node_modules/${packed.name}`] = {
    version: packed.version,
    resolved: `file:${tarball}`,
    integrity: `sha512-${createHash('sha512').update(readFileSync(tarball)).digest('base64')}`,
    peerDependencies: packed.peerDependencies,
  };
  // Preserve locked dependency versions/integrities while simulating the public registry.
  for (const entry of Object.values(lock.packages)) {
    if (entry.resolved) entry.resolved = entry.resolved.replace('https://npm.pkg.ofh.org.uk/npm/', 'https://registry.npmjs.org/');
  }
  writeFileSync(lockPath, JSON.stringify(lock, null, 2));
  execFileSync('npm', ['ci', '--ignore-scripts', '--registry=https://registry.npmjs.org'], { cwd: consumer, stdio: 'inherit' });
  const installed = JSON.parse(readFileSync(join(consumer, 'node_modules', packed.name, 'package.json'), 'utf8'));
  assert.equal(installed.version, packed.version);
  execFileSync('npm', ['run', 'lint'], { cwd: consumer, stdio: 'inherit' });
  execFileSync('npm', ['run', 'build'], { cwd: consumer, stdio: 'inherit' });
  process.stdout.write(`Standalone React app built against staged ${packed.name}@${packed.version}\n`);
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
