import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createReleaseRecord, readChangesetPlan } from './changeset-plan.mjs';
import { parseChangelog, upgradeDecision } from './release-metadata.mjs';

export function renderReleaseDocs(plan, changelog, guide, date) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date).toISOString().startsWith(date), 'Use an ISO release date');
  const entries = plan.releases.map(release => {
    const tag = `${release.prefix}${release.newVersion}`;
    const bullets = release.guidance.map(item => `- ${item.summary.replaceAll('\n', '\n  ')}`).join('\n');
    return `#### ${release.name} ${release.newVersion} (\`${tag}\`)\n\n##### Changes\n\n${bullets}\n\n`;
  }).join('');
  const firstDate = /^### (\d{4}-\d{2}-\d{2})\n\n/m.exec(changelog);
  assert(firstDate, 'Expected dated package releases in the root changelog');
  assert(date >= firstDate[1], 'Release date cannot precede the latest changelog date');
  const insertion = firstDate[1] === date ? firstDate.index + firstDate[0].length : firstDate.index;
  const updatedChangelog = changelog.slice(0, insertion) + (firstDate[1] === date ? '' : `### ${date}\n\n`) + entries + changelog.slice(insertion);

  const lines = guide.split('\n');
  const header = lines.findIndex(line => line === '| Version | Date | Breaking Changes | Consumer action | Migration Complexity |');
  assert(header >= 0 && lines[header + 1]?.startsWith('| ---'), 'Expected the existing five-column upgrade index');
  let tableEnd = header + 2;
  while (lines[tableEnd]?.startsWith('|')) tableEnd++;
  const rows = [];
  const sections = [];
  for (const release of plan.releases) {
    const tag = `${release.prefix}${release.newVersion}`;
    const anchor = `release-${tag.replaceAll('.', '-')}`;
    const label = `${release.prefix === 'react-v' ? 'React ' : ''}v${release.newVersion}`;
    const action = release.guidance.some(item => item.action === 'Action required') ? 'Action required' : 'No consumer action required';
    const breakingChanges = action === 'Action required' ? 'See migration notes' : 'No breaking changes';
    const migration = action === 'Action required' ? 'Follow migration steps.' : 'No migration required.';
    rows.push(`| [${label}](#${anchor}) | ${date} | ${breakingChanges} | ${action} | ${migration} |`);
    const notes = release.guidance.map(item => item.migration).join('\n\n');
    sections.push(`<a id="${anchor}"></a>\n## Upgrading to ${tag}\n\n${action}.\n\n${notes}\n`);
  }
  lines.splice(tableEnd, 0, '', ...sections);
  lines.splice(header + 2, 0, ...rows);
  const updatedGuide = lines.join('\n');
  const parsed = parseChangelog(updatedChangelog);
  for (const release of plan.releases) {
    assert(parsed.has(`${release.prefix}${release.newVersion}`));
    upgradeDecision(updatedGuide, release.name, release.newVersion);
  }
  return { changelog: updatedChangelog, guide: updatedGuide };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  assert(args.length === 0 || (args.length === 2 && args[0] === '--date'), 'Usage: version-packages.mjs [--date YYYY-MM-DD]');
  const plan = await readChangesetPlan(process.cwd());
  if (!plan.releases.length) {
    process.stdout.write('No pending package releases.\n');
  } else {
    const date = args[1] || new Date().toISOString().slice(0, 10);
    const docs = renderReleaseDocs(plan, readFileSync('CHANGELOG.md', 'utf8'), readFileSync('UPGRADING.md', 'utf8'), date);
    const record = createReleaseRecord(plan, execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim());
    // Changesets owns version arithmetic and changeset consumption. We own root docs.
    execFileSync(process.execPath, [fileURLToPath(import.meta.resolve('@changesets/cli/bin.js')), 'version'], { stdio: 'inherit' });
    for (const release of plan.releases) {
      assert.equal(JSON.parse(readFileSync(release.manifest, 'utf8')).version, release.newVersion);
    }
    writeFileSync('CHANGELOG.md', docs.changelog);
    writeFileSync('UPGRADING.md', docs.guide);
    writeFileSync('.changeset/release.json', `${JSON.stringify(record, null, 2)}\n`);
    process.stdout.write(`Prepared ${plan.releases.length} package releases; no tags or publication.\n`);
  }
}
