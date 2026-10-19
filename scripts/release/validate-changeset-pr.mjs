import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createReleaseRecord, readChangesetPlan } from './changeset-plan.mjs';
import { packages, parseChangelog, validateVersion } from './release-metadata.mjs';
import { renderReleaseDocs } from './version-packages.mjs';

const [baseRef, headRef, mode] = process.argv.slice(2);
assert(baseRef && headRef && (!mode || ['--release-pr', '--publication'].includes(mode)) && process.argv.length <= 5,
  'Usage: validate-changeset-pr.mjs <base-ref> <head-ref> [--release-pr|--publication]');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
git('rev-parse', '--verify', `${baseRef}^{commit}`);
if (headRef !== 'WORKTREE') git('rev-parse', '--verify', `${headRef}^{commit}`);
const readAt = (ref, path) => ref === 'WORKTREE' ? readFileSync(path, 'utf8')
  : execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8' });
const files = git('diff', '--name-only', baseRef, ...(headRef === 'WORKTREE' ? [] : [headRef])).split('\n');
if (headRef === 'WORKTREE') files.push(...git('ls-files', '--others', '--exclude-standard').split('\n'));
const baseFiles = git('ls-tree', '-r', '--name-only', baseRef).split('\n');
const isIntent = path => /^\.changeset\/[^/]+\.md$/.test(path) && path !== '.changeset/README.md';

async function planAt(ref, generateManifests = false) {
  if (ref === 'WORKTREE') return readChangesetPlan(process.cwd());
  const directory = mkdtempSync(`${tmpdir()}/ofh-release-plan-`);
  try {
    const paths = git('ls-tree', '-r', '--name-only', ref).split('\n').filter(path =>
      path.startsWith('.changeset/') || path === 'pnpm-workspace.yaml' || path === 'package.json'
      || /^packages\/[^/]+\/package\.json$/.test(path));
    const archive = execFileSync('git', ['archive', '--format=tar', ref, '--', ...paths]);
    execFileSync('tar', ['-xf', '-', '-C', directory], { input: archive });
    const plan = await readChangesetPlan(directory);
    if (generateManifests) {
      execFileSync(process.execPath, [fileURLToPath(import.meta.resolve('@changesets/cli/bin.js')), 'version'], { cwd: directory, stdio: 'pipe' });
      plan.manifests = new Map(packages.map(pkg => [pkg.name, JSON.parse(readFileSync(`${directory}/${pkg.manifest}`, 'utf8'))]));
    }
    return plan;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

if (mode) {
  const plan = await planAt(baseRef, true);
  assert(plan.releases.length, 'Release PR has no pending changesets on its base');
  assert.deepEqual(JSON.parse(readAt(headRef, '.changeset/release.json')), createReleaseRecord(plan, git('rev-parse', baseRef)),
    'Release record must match the exact reviewed base, consumed changesets and package versions');
  for (const pkg of packages) {
    const release = plan.releases.find(item => item.name === pkg.name);
    const expected = release?.newVersion || JSON.parse(readAt(baseRef, pkg.manifest)).version;
    assert.equal(JSON.parse(readAt(headRef, pkg.manifest)).version, expected,
      `${pkg.name}: version does not match the Changesets release plan`);
    assert.deepEqual(JSON.parse(readAt(headRef, pkg.manifest)), plan.manifests.get(pkg.name),
      `${pkg.name}: manifest does not match Changesets output; keep API and dependency edits in feature PRs`);
  }
  assert.equal((await planAt(headRef)).changesets.length, 0, 'Release PR must consume the pending changesets');
  const allowed = ['CHANGELOG.md', 'UPGRADING.md', 'pnpm-lock.yaml', '.changeset/release.json', ...packages.map(pkg => pkg.manifest),
    ...plan.changesets.map(item => `.changeset/${item.id}.md`)];
  assert(files.filter(Boolean).every(path => allowed.includes(path)), 'Release PR must not include consumer code or unrelated changes');
  const headChangelog = readAt(headRef, 'CHANGELOG.md');
  const dates = plan.releases.map(release => parseChangelog(headChangelog).get(`${release.prefix}${release.newVersion}`)?.date);
  assert(dates[0] && dates.every(date => date === dates[0]), 'Release PR entries need one matching release date');
  const expectedDocs = renderReleaseDocs(plan, readAt(baseRef, 'CHANGELOG.md'), readAt(baseRef, 'UPGRADING.md'), dates[0]);
  assert.equal(headChangelog, expectedDocs.changelog, 'Changelog must match the reviewed changeset summaries');
  assert.equal(readAt(headRef, 'UPGRADING.md'), expectedDocs.guide, 'Upgrade guidance must match the reviewed changesets');
  if (mode === '--publication') {
    assert(process.env.PUBLISHED_RELEASE_TAGS_FILE, 'Publication requires published version history');
    const tags = [...git('tag', '--list').split('\n'), ...readFileSync(process.env.PUBLISHED_RELEASE_TAGS_FILE, 'utf8').split('\n')];
    assert(dates[0] <= new Date().toISOString().slice(0, 10), 'Publication date cannot be in the future');
    for (const release of plan.releases) {
      const ownTag = `${release.prefix}${release.newVersion}`;
      const versions = tags.filter(tag => tag.startsWith(release.prefix) && tag !== ownTag).map(tag => tag.slice(release.prefix.length));
      validateVersion(release.newVersion, [release.oldVersion, ...versions]);
    }
  } else {
    execFileSync(process.execPath, [fileURLToPath(new URL('./validate-package-release-metadata.mjs', import.meta.url)), baseRef, headRef], { stdio: 'inherit' });
  }
} else {
  assert(!files.includes('.changeset/release.json'), 'Only a generated release PR may change the release record');
  for (const pkg of packages) {
    assert.equal(JSON.parse(readAt(headRef, pkg.manifest)).version, JSON.parse(readAt(baseRef, pkg.manifest)).version,
      `${pkg.name}: do not change package versions in feature PRs; add a changeset`);
  }
  const plan = await planAt(headRef);
  for (const path of baseFiles.filter(isIntent)) {
    assert(plan.changesets.some(item => `.changeset/${item.id}.md` === path), `${path}: only a release PR may consume pending changesets`);
  }
  const newIntents = plan.changesets.filter(item => !baseFiles.includes(`.changeset/${item.id}.md`));
  for (const pkg of packages) {
    const directory = pkg.manifest.replace('/package.json', '/');
    const changed = files.some(path => path.startsWith(directory) && !/\.(test|spec|stories)\.[^.]+$|\/README\.md$/.test(path));
    if (changed) assert(newIntents.some(item => item.releases.some(release => release.name === pkg.name)),
      `${pkg.name}: add a new changeset describing this PR's release intent`);
  }
}
process.stdout.write('Changeset PR validation passed.\n');
