import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const [manifestPath, tarball] = process.argv.slice(2);
assert(manifestPath && tarball, 'Usage: validate-artifact-identity.mjs <manifest> <tarball>');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const packed = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }));
assert.equal(packed.name, manifest.name, 'Packed package name does not match manifest');
assert.equal(packed.version, manifest.version, 'Packed version does not match manifest');
assert.equal(basename(tarball), `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`);
process.stdout.write(`Verified ${packed.name}@${packed.version} in staged tarball\n`);
