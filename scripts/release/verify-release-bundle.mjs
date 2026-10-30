import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { releaseFiles, validateBundle } from './release-bundle.mjs';

const [planPath, directory] = process.argv.slice(2);
assert(planPath && directory, 'Usage: verify-release-bundle.mjs <plan.json> <bundle-directory>');
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const bundle = JSON.parse(readFileSync(join(directory, 'release-bundle.json'), 'utf8'));
const entries = validateBundle(bundle, plan, directory);
for (const entry of entries) {
  execFileSync(process.execPath, [fileURLToPath(new URL('./validate-artifact-identity.mjs', import.meta.url)), releaseFiles(entry).manifest, entry.assets[0]], { stdio: 'inherit' });
}
process.stdout.write(`Verified saved artifact names, identities, notes and checksums for ${plan.sha}.\n`);
