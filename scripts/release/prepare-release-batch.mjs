import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { releaseFiles, validateBundle } from './release-bundle.mjs';
import { digest } from './github-release.mjs';

const [planPath, stagePath] = process.argv.slice(2);
assert(planPath && stagePath, 'Usage: prepare-release-batch.mjs <plan.json> <empty-stage-directory>');
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), plan.sha, 'Build checkout differs from release SHA');
const directory = resolve(stagePath);
mkdirSync(directory, { recursive: true });
assert.equal(readdirSync(directory).length, 0, 'Release batch stage must be empty');
const script = name => fileURLToPath(new URL(name, import.meta.url));
const runNode = (name, ...args) => execFileSync(process.execPath, [script(name), ...args], { stdio: 'inherit' });
const bundle = { ...plan, releases: [] };
for (const release of plan.releases) {
  const files = releaseFiles(release);
  const packageDir = files.manifest.replace('/package.json', '');
  const stage = join(directory, files.key);
  execFileSync(script('prepare-release-artifacts.sh'), [files.key, '--stage-dir', stage], { stdio: 'inherit', env: { ...process.env, GITHUB_OUTPUT: '' } });
  const tarball = join(stage, files.tarball);
  runNode('validate-artifact-identity.mjs', files.manifest, tarball);
  execFileSync(script('smoke-package-tarball.sh'), ['--package-dir', packageDir, '--tarball', tarball, '--managers', 'yarn,npm,pnpm'], { stdio: 'inherit' });
  if (files.zip) runNode('smoke-toolkit-zip.mjs', join(stage, files.zip));
  else runNode('smoke-react-consumer.mjs', tarball);
  const notesArgs = ['--package', files.key, '--tag', release.tag, '--version', release.version, '--tarball', files.tarball, '--source-ref', plan.sha];
  if (files.zip) notesArgs.push('--zip', files.zip);
  const notes = execFileSync(script('render-release-notes.sh'), notesArgs, { encoding: 'utf8' });
  writeFileSync(join(stage, 'notes.md'), notes);
  const describe = name => ({ path: `${files.key}/${name}`, sha256: digest(join(stage, name)) });
  bundle.releases.push({ ...release, assets: [files.tarball, files.zip].filter(Boolean).map(describe), notes: describe('notes.md') });
}
execFileSync('git', ['diff', '--exit-code', 'HEAD'], { stdio: 'inherit' });
validateBundle(bundle, plan, directory);
writeFileSync(join(directory, 'release-bundle.json'), `${JSON.stringify(bundle, null, 2)}\n`);
process.stdout.write(`All ${plan.releases.length} packages built and checked from ${plan.sha}; no tags or releases created.\n`);
