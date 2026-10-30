import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';
import { parseConsumerGuidance, readChangesetPlan, releasePRBody } from './changeset-plan.mjs';

test('a reviewed changeset records its summary and explicit consumer decision', () => {
  assert.deepEqual(parseConsumerGuidance('header-fix', `Fix the mobile Header link colour.

## Consumer action
No consumer action required

## Migration notes
Public APIs remain unchanged.
`), {
    summary: 'Fix the mobile Header link colour.',
    action: 'No consumer action required',
    migration: 'Public APIs remain unchanged.',
  });
});

const root = fileURLToPath(new URL('../../', import.meta.url));
const script = fileURLToPath(new URL('./version-packages.mjs', import.meta.url));
const config = readFileSync(`${root}.changeset/config.json`, 'utf8');
function fixture(t) {
  const directory = mkdtempSync(`${tmpdir()}/ofh-changesets-`);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const write = (path, value) => {
    mkdirSync(`${directory}/${dirname(path)}`, { recursive: true });
    writeFileSync(`${directory}/${path}`, value);
  };
  write('package.json', JSON.stringify({ name: 'fixture', private: true, packageManager: 'pnpm@10.29.2' }));
  write('pnpm-workspace.yaml', 'packages:\n  - packages/*\n');
  write('packages/toolkit/package.json', JSON.stringify({ name: '@ourfuturehealth/toolkit', version: '4.26.1' }));
  write('packages/react-components/package.json', JSON.stringify({ name: '@ourfuturehealth/react-components', version: '0.26.1' }));
  write('.changeset/config.json', config);
  write('CHANGELOG.md', '# Changelog\n\n## Monorepo Package Releases (`toolkit-v*`, `react-v*`)\n\n### 2026-10-12\n\n#### @ourfuturehealth/toolkit 4.26.1 (`toolkit-v4.26.1`)\n\n- Historical summary.\n');
  write('UPGRADING.md', '# Upgrading guide\n\n| Version | Date | Breaking Changes | Consumer action | Migration Complexity |\n| ------- | ---- | ---------------- | --------------- | -------------------- |\n| `v4.26.1` | October 2026 | No breaking changes | No consumer action required | None |\n\n## Historical guidance\n\nKeep this guidance.\n');
  const project = { directory, write, read: path => readFileSync(`${directory}/${path}`, 'utf8') };
  initialiseGit(project);
  return project;
}

function intent(packageName, bump, summary, action = 'No consumer action required', migration = 'Public APIs remain unchanged.') {
  return `---\n"${packageName}": ${bump}\n---\n\n${summary}\n\n## Consumer action\n${action}\n\n## Migration notes\n${migration}\n`;
}

test('the real Changesets CLI generates independent versions and the existing root documentation', t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  project.write('.changeset/react-addition.md', intent('@ourfuturehealth/react-components', 'minor', 'Add a new Header option.', 'Action required', 'Replace the old Header option with the new name.'));
  const { base } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  const record = JSON.parse(project.read('.changeset/release.json'));
  assert.equal(record.baseSha, base);
  assert.deepEqual(record.changesets, ['react-addition', 'toolkit-fix']);
  assert.deepEqual(record.releases.map(release => release.tag), ['react-v0.27.0', 'toolkit-v4.26.2']);
  assert.equal(JSON.parse(project.read('packages/toolkit/package.json')).version, '4.26.2');
  assert.equal(JSON.parse(project.read('packages/react-components/package.json')).version, '0.27.0');
  assert.match(project.read('CHANGELOG.md'), /toolkit-v4\.26\.2[\s\S]+Fix Header colours/);
  assert.match(project.read('UPGRADING.md'), /React v0\.27\.0[\s\S]+Action required/);
  assert.match(project.read('UPGRADING.md'), /Replace the old Header option/);
  assert.match(project.read('UPGRADING.md'), /\| \[v4\.26\.2\]\(#release-toolkit-v4-26-2\) \| 2026-10-13 \| No breaking changes \| No consumer action required \| No migration required\. \|/);
  assert.match(project.read('UPGRADING.md'), /\| \[React v0\.27\.0\]\(#release-react-v0-27-0\) \| 2026-10-13 \| See migration notes \| Action required \| Follow migration steps\. \|/);
  assert.match(project.read('UPGRADING.md'), /Keep this guidance/);
  assert(!existsSync(`${project.directory}/.changeset/toolkit-fix.md`));
  assert(!existsSync(`${project.directory}/packages/toolkit/CHANGELOG.md`));
});

test('a breaking React changeset advances the pre-1.0 package to 1.0.0', t => {
  const project = fixture(t);
  project.write('.changeset/react-breaking.md', intent('@ourfuturehealth/react-components', 'major', 'Remove the old Header option.', 'Action required', 'Replace the old Header option with the new one.'));
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  assert.equal(JSON.parse(project.read('packages/react-components/package.json')).version, '1.0.0');
  assert.match(project.read('CHANGELOG.md'), /react-v1\.0\.0[\s\S]+Remove the old Header option/);
  assert.match(project.read('UPGRADING.md'), /React v1\.0\.0[\s\S]+Replace the old Header option/);
});

const checkScript = fileURLToPath(new URL('./validate-changeset-pr.mjs', import.meta.url));
function initialiseGit(project) {
  const git = (...args) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], { cwd: project.directory, encoding: 'utf8' }).trim();
  if (!existsSync(`${project.directory}/.git`)) git('init', '-b', 'main');
  git('config', 'user.email', 'release-tests@example.invalid');
  git('config', 'user.name', 'Release tests');
  git('add', '.');
  git('commit', '--allow-empty', '-m', 'Fixture baseline');
  return { git, base: git('rev-parse', 'HEAD') };
}
function runCheck(project, base, releasePR = false, published = '') {
  // Synthetic version history must not inherit the real repository's inventory.
  const env = { ...process.env };
  delete env.PUBLISHED_RELEASE_TAGS_FILE;
  if (releasePR === '--publication') {
    env.PUBLISHED_RELEASE_TAGS_FILE = `${project.directory}/.git/published.txt`;
    writeFileSync(env.PUBLISHED_RELEASE_TAGS_FILE, published);
  }
  return execFileSync(process.execPath, [checkScript, base, 'WORKTREE', ...(releasePR ? [typeof releasePR === 'string' ? releasePR : '--release-pr'] : [])], {
    cwd: project.directory, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], env,
  });
}

test('a feature PR needs new release intent and cannot bump its own package version', t => {
  const project = fixture(t);
  const { base, git } = initialiseGit(project);
  project.write('packages/toolkit/component.js', 'export const colour = "green";\n');
  git('add', '.');
  assert.throws(() => runCheck(project, base), /add a new changeset/);
  project.write('.changeset/component-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix the component colour.'));
  assert.match(runCheck(project, base), /Changeset PR validation passed/);
  project.write('packages/toolkit/package.json', JSON.stringify({ name: '@ourfuturehealth/toolkit', version: '4.26.2' }));
  assert.throws(() => runCheck(project, base), /do not change package versions in feature PRs/);
});

test('publication can inspect its own existing batch versions but cannot resume below a newer release', t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const { base, git } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  git('tag', 'toolkit-v4.26.2');
  assert.match(runCheck(project, base, '--publication', 'toolkit-v4.26.2\n'), /validation passed/);
  assert.throws(() => runCheck(project, base, '--publication', 'toolkit-v4.26.3\n'), /must be greater than/);
});

test('a release PR must contain exactly the calculated versions and generated guidance', t => {
  const project = fixture(t);
  const changeset = intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.');
  project.write('.changeset/toolkit-fix.md', changeset);
  const { base } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  assert(!existsSync(`${project.directory}/.changeset/toolkit-fix.md`));
  assert.match(runCheck(project, base, true), /Changeset PR validation passed/);
  project.write('.changeset/toolkit-fix.md', changeset);
  assert.throws(() => runCheck(project, base, true), /must consume the pending changesets/);
  rmSync(`${project.directory}/.changeset/toolkit-fix.md`);
  project.write('packages/toolkit/package.json', JSON.stringify({ name: '@ourfuturehealth/toolkit', version: '4.28.0' }));
  assert.throws(() => runCheck(project, base, true), /does not match the Changesets release plan/);
});

test('generation rejects incomplete migration guidance before changing any manifest', t => {
  const project = fixture(t);
  project.write('.changeset/missing-guidance.md', '---\n"@ourfuturehealth/toolkit": patch\n---\n\nFix Header colours.\n');
  assert.throws(() => execFileSync(process.execPath, [script], { cwd: project.directory, stdio: 'pipe' }), /Consumer action/);
  assert.equal(JSON.parse(project.read('packages/toolkit/package.json')).version, '4.26.1');
  assert(existsSync(`${project.directory}/.changeset/missing-guidance.md`));
});

test('pending release intent cannot be reused for new source changes or silently consumed', t => {
  const project = fixture(t);
  project.write('.changeset/previous-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix previous colours.'));
  const { base } = initialiseGit(project);
  project.write('packages/toolkit/component.js', 'export const colour = "green";\n');
  assert.throws(() => runCheck(project, base), /add a new changeset/);
  rmSync(`${project.directory}/.changeset/previous-fix.md`);
  assert.throws(() => runCheck(project, base), /only a release PR may consume/);
});

test('tests, stories and repository tooling do not force an unrelated package release', t => {
  const project = fixture(t);
  const { base } = initialiseGit(project);
  project.write('packages/toolkit/component.test.js', '// regression test\n');
  project.write('packages/react-components/component.stories.tsx', '// story\n');
  project.write('scripts/build.mjs', '// repository tooling\n');
  assert.match(runCheck(project, base), /validation passed/);
});

test('a source change in both packages requires release intent for both', t => {
  const project = fixture(t);
  const { base } = initialiseGit(project);
  project.write('packages/toolkit/component.js', '// toolkit change\n');
  project.write('packages/react-components/component.tsx', '// React change\n');
  project.write('.changeset/toolkit-only.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix toolkit colours.'));
  assert.throws(() => runCheck(project, base), /react-components: add a new changeset/);
});

test('a none changeset cannot hide public source changes from release preparation', t => {
  const project = fixture(t);
  const { base } = initialiseGit(project);
  project.write('packages/toolkit/component.js', '// public change\n');
  project.write('.changeset/no-release.md', intent('@ourfuturehealth/toolkit', 'none', 'Change toolkit colours.'));
  assert.throws(() => runCheck(project, base), /use patch, minor or major/);
});

test('same-day generation keeps one date heading and combines all pending summaries', t => {
  const project = fixture(t);
  project.write('.changeset/one-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  project.write('.changeset/another-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Footer colours.'));
  const { base } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2026-10-12'], { cwd: project.directory });
  assert.equal(project.read('CHANGELOG.md').match(/^### 2026-10-12$/gm).length, 1);
  assert.match(project.read('CHANGELOG.md'), /Fix Header colours/);
  assert.match(project.read('CHANGELOG.md'), /Fix Footer colours/);
  assert.match(runCheck(project, base, true), /validation passed/);
});

test('generated release PRs cannot add component code or alter reviewed guidance', t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const { base } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  const guide = project.read('UPGRADING.md');
  project.write('UPGRADING.md', guide.replace('Public APIs remain unchanged.', 'A different claim.'));
  assert.throws(() => runCheck(project, base, true), /Upgrade guidance must match/);
  project.write('UPGRADING.md', guide);
  project.write('packages/toolkit/component.js', '// unrelated consumer code\n');
  assert.throws(() => runCheck(project, base, true), /must not include consumer code/);
});

test('generated release PRs cannot alter package scripts, exports or dependencies', t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const { base } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  const manifest = JSON.parse(project.read('packages/toolkit/package.json'));
  project.write('packages/toolkit/package.json', JSON.stringify({ ...manifest, exports: './missing-file.js', scripts: { postinstall: 'unreviewed-command' } }));
  assert.throws(() => runCheck(project, base, true), /manifest does not match Changesets output/);
});

test('a previously used canonical version blocks the generated release PR', t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const { base, git } = initialiseGit(project);
  git('tag', 'toolkit-v4.26.2');
  execFileSync(process.execPath, [script, '--date', '2026-10-13'], { cwd: project.directory });
  assert.throws(() => runCheck(project, base, true), /4.26.2 must be greater than 4.26.2/);
});

test('generation preserves the complete real root changelog and upgrade index', t => {
  const project = fixture(t);
  const changelog = readFileSync(`${root}CHANGELOG.md`, 'utf8');
  project.write('CHANGELOG.md', changelog);
  for (const directory of ['toolkit', 'react-components']) {
    project.write(`packages/${directory}/package.json`, readFileSync(`${root}packages/${directory}/package.json`, 'utf8'));
  }
  const nextToolkit = semver.inc(JSON.parse(project.read('packages/toolkit/package.json')).version, 'patch');
  const guide = readFileSync(`${root}UPGRADING.md`, 'utf8');
  project.write('UPGRADING.md', guide);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const date = /^### (\d{4}-\d{2}-\d{2})$/m.exec(changelog)[1];
  execFileSync(process.execPath, [script, '--date', date], { cwd: project.directory });
  assert(project.read('UPGRADING.md').includes(`v${nextToolkit}`));
  for (const row of guide.split('\n').filter(line => line.startsWith('| '))) {
    assert(project.read('UPGRADING.md').includes(row), `Preserve historical row: ${row}`);
  }
});

test('generation with no pending changesets leaves package versions and docs untouched', t => {
  const project = fixture(t);
  const before = project.read('CHANGELOG.md');
  assert.match(execFileSync(process.execPath, [script], { cwd: project.directory, encoding: 'utf8' }), /No pending package releases/);
  assert.equal(project.read('CHANGELOG.md'), before);
  assert.equal(JSON.parse(project.read('packages/toolkit/package.json')).version, '4.26.1');
});

test('placeholder or invalid consumer decisions are rejected', () => {
  assert.throws(() => parseConsumerGuidance('bad', 'Summary\n\n## Consumer action\nOptional\n\n## Migration notes\nNone.'), /invalid consumer action/);
  assert.throws(() => parseConsumerGuidance('todo', 'Summary\n\n## Consumer action\nAction required\n\n## Migration notes\nTODO: write steps.'), /placeholder/);
});

test('the bot PR body describes the actual version plan and GitHub publication contract', async t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const body = releasePRBody(await readChangesetPlan(project.directory));
  assert.match(body, /@ourfuturehealth\/toolkit 4\.26\.2/);
  assert.match(body, /Fix Header colours/);
  assert.match(body, /No consumer action required/);
  assert.match(body, /Merging this PR starts automatic GitHub publication when enabled/);
  assert(!body.includes('publish to npm'));
});

test('feature checks use the exact PR head rather than unrelated checkout changes', t => {
  const project = fixture(t);
  const { base, git } = initialiseGit(project);
  project.write('packages/toolkit/component.js', '// public change\n');
  project.write('.changeset/component-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix colours.'));
  git('add', '.');
  git('commit', '-m', 'Feature change');
  const head = git('rev-parse', 'HEAD');
  project.write('packages/toolkit/package.json', JSON.stringify({ name: '@ourfuturehealth/toolkit', version: '5.0.0' }));
  assert.match(execFileSync(process.execPath, [checkScript, base, head], { cwd: project.directory, encoding: 'utf8' }), /validation passed/);
});

const mergedScript = fileURLToPath(new URL('./validate-merged-release.mjs', import.meta.url));
function publicationFixture(t) {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const { git } = initialiseGit(project);
  git('switch', '-c', 'release');
  execFileSync(process.execPath, [script, '--date', '2026-10-12'], { cwd: project.directory });
  git('add', '.');
  git('commit', '-m', 'Generated release');
  return { project, git };
}
function checkMerged(project, sha) {
  const context = { schemaVersion: 1, repository: 'example/design-system', prNumber: 42, sha };
  project.write('.git/context.json', JSON.stringify(context));
  project.write('.git/published.txt', 'toolkit-v4.26.1\nreact-v0.26.1\n');
  return execFileSync(process.execPath, [mergedScript, '.git/context.json', '.git/plan.json'], {
    cwd: project.directory, encoding: 'utf8', stdio: 'pipe',
    env: { ...process.env, PUBLISHED_RELEASE_TAGS_FILE: `${project.directory}/.git/published.txt` },
  });
}

for (const mode of ['merge', 'squash', 'fast-forward']) {
  test(`${mode} publication validates the exact merged release even after main advances`, t => {
    const { project, git } = publicationFixture(t);
    git('switch', 'main');
    if (mode === 'merge') git('merge', '--no-ff', 'release', '-m', 'Merge reviewed release');
    else if (mode === 'squash') {
      git('merge', '--squash', 'release');
      git('commit', '-m', 'Squash reviewed release');
    } else git('merge', '--ff-only', 'release');
    const sha = git('rev-parse', 'HEAD');
    project.write('later-documentation.md', 'Later unrelated work.\n');
    git('add', '.');
    git('commit', '-m', 'Main advances after release');
    git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'HEAD'));
    git('checkout', '--detach', sha);
    assert.match(checkMerged(project, sha), /Validated release PR #42/);
    const plan = JSON.parse(project.read('.git/plan.json'));
    assert.equal(plan.sha, sha);
    assert.deepEqual(plan.releases.map(release => release.tag), ['toolkit-v4.26.2']);
  });
}

test('an unmerged release branch cannot authorise publication', t => {
  const { project, git } = publicationFixture(t);
  git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'main'));
  assert.throws(() => checkMerged(project, git('rev-parse', 'HEAD')), /must be on main first-parent history/);
});

test('publication rejects tampered generated release records', t => {
  const { project, git } = publicationFixture(t);
  const record = JSON.parse(project.read('.changeset/release.json'));
  record.releases[0].tag = 'toolkit-v4.99.0';
  project.write('.changeset/release.json', JSON.stringify(record));
  git('add', '.');
  git('commit', '-m', 'Tamper release record');
  git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'HEAD'));
  assert.throws(() => checkMerged(project, git('rev-parse', 'HEAD')), /Release record must match/);
});

test('feature PRs cannot edit the generated publication record', t => {
  const project = fixture(t);
  const { base } = initialiseGit(project);
  project.write('.changeset/release.json', JSON.stringify({ schemaVersion: 1, baseSha: base, releases: [] }));
  assert.throws(() => runCheck(project, base), /Only a generated release PR may change the release record/);
});

test('a future publication date blocks the merged release', t => {
  const project = fixture(t);
  project.write('.changeset/toolkit-fix.md', intent('@ourfuturehealth/toolkit', 'patch', 'Fix Header colours.'));
  const { git } = initialiseGit(project);
  execFileSync(process.execPath, [script, '--date', '2099-01-01'], { cwd: project.directory });
  git('add', '.');
  git('commit', '-m', 'Future-dated release');
  git('update-ref', 'refs/remotes/origin/main', git('rev-parse', 'HEAD'));
  assert.throws(() => checkMerged(project, git('rev-parse', 'HEAD')), /Publication date cannot be in the future/);
});
