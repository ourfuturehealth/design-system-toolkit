import assert from 'node:assert/strict';
import semver from 'semver';

export const packages = [
  { name: '@ourfuturehealth/toolkit', manifest: 'packages/toolkit/package.json', prefix: 'toolkit-v' },
  { name: '@ourfuturehealth/react-components', manifest: 'packages/react-components/package.json', prefix: 'react-v' },
];

export function validateVersion(version, previousVersions) {
  assert.equal(semver.valid(version), version, `Invalid semantic version: ${version}`);
  for (const previous of previousVersions) {
    assert.equal(semver.valid(previous), previous, `Invalid previous version: ${previous}`);
    assert(semver.gt(version, previous), `${version} must be greater than ${previous}`);
  }
}

export function parseChangelog(text) {
  const entries = new Map();
  const previousVersions = new Map();
  let date;
  let current;
  let previousDate;
  for (const line of text.split('\n')) {
    const dateHeading = /^### (\d{4}-\d{2}-\d{2}|Unreleased)$/.exec(line);
    if (dateHeading) {
      date = dateHeading[1];
      if (date !== 'Unreleased') {
        assert(new Date(date).toISOString().startsWith(date), `Invalid changelog date: ${date}`);
        if (previousDate) assert(date <= previousDate, 'Changelog dates must be in descending order');
        previousDate = date;
      }
      current = undefined;
      continue;
    }
    const heading = /^#### (@ourfuturehealth\/(?:toolkit|react-components)) (\S+) \(`([^`]+)`\)$/.exec(line);
    if (heading) {
      const [, name, version, tag] = heading;
      const pkg = packages.find(item => item.name === name);
      assert(date, `Missing date for ${tag}`);
      assert.equal(semver.valid(version), version, `Invalid version in ${tag}`);
      assert.equal(tag, `${pkg.prefix}${version}`, `Tag does not match ${name}@${version}`);
      assert(!entries.has(tag), `Duplicate changelog entry: ${tag}`);
      const previous = previousVersions.get(name);
      if (previous) assert(semver.lt(version, previous), `${name} changelog must be in descending version order`);
      previousVersions.set(name, version);
      current = { date, summary: [] };
      entries.set(tag, current);
    } else if (/^#{2,4} /.test(line)) {
      date = undefined;
      current = undefined;
    } else if (current && /^- /.test(line)) {
      current.summary.push(line);
    }
  }
  for (const [tag, entry] of entries) {
    assert(entry.summary.length, `Empty changelog entry: ${tag}`);
  }
  return entries;
}

export function upgradeDecision(text, name, version) {
  const pkg = packages.find(item => item.name === name);
  assert(pkg, `Unsupported upgrade package: ${name}`);
  const lines = text.split('\n');
  const cells = line => line.split('|').map(cell => cell.trim());
  const headers = lines.filter(line => line.trim().startsWith('|') && cells(line).includes('Consumer action'));
  assert.equal(headers.length, 1, 'Expected one upgrade guidance table with a Consumer action column');
  const header = cells(headers[0]);
  const versionColumn = header.indexOf('Version');
  const statusColumn = header.indexOf('Consumer action');
  const guidanceColumn = header.indexOf('Migration Complexity');
  assert(versionColumn > 0 && guidanceColumn > 0, 'Upgrade table needs Version and Migration Complexity columns');
  const versionLabel = `${pkg.prefix === 'react-v' ? 'React ' : ''}v${version}`;
  const matches = [];
  for (const line of lines.slice(lines.indexOf(headers[0]) + 1)) {
    if (!line.trim().startsWith('|')) break;
    const row = cells(line);
    const labels = (row[versionColumn] || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replaceAll('`', '').split(' / ');
    if (labels.includes(versionLabel)) matches.push(row);
  }
  assert.equal(matches.length, 1, `Expected one upgrade decision for ${name}@${version}`);
  const row = matches[0];
  const status = row[statusColumn];
  const versionCell = row[versionColumn];
  const instructions = row[guidanceColumn];
  assert(['No consumer action required', 'Action required'].includes(status), `Invalid upgrade decision for ${name}@${version}`);
  assert(instructions, `Missing upgrade guidance for ${name}@${version}`);
  const versionLink = /\]\(#([^)]*)\)/.exec(versionCell);
  if (status === 'Action required') {
    const link = versionLink || /\]\(#([^)]*)\)/.exec(instructions);
    assert(link, `Action required needs a migration link for ${name}@${version}`);
    const headings = lines.filter(line => /^#{1,6} /.test(line)).map(line => line.replace(/^#{1,6} /, '').toLowerCase().replace(/[^\w -]/g, '').replaceAll(' ', '-'));
    assert(text.includes(`<a id="${link[1]}"></a>`) || headings.includes(link[1]), `Missing migration section: ${link[1]}`);
  }
  const guidance = versionLink ? `${instructions} See ${versionCell}.` : instructions;
  return { status, guidance };
}
