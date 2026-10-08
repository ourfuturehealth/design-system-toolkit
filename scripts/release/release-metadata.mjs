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
  const rows = text.split('\n').map(line => line.split('|').map(cell => cell.trim()));
  const matches = rows.filter(row => row[1] === `\`${name}\`` && row[2] === `\`${version}\``);
  assert.equal(matches.length, 1, `Expected one upgrade decision for ${name}@${version}`);
  const [, , , status, guidance] = matches[0];
  assert(['No consumer action required', 'Action required'].includes(status), `Invalid upgrade decision for ${name}@${version}`);
  assert(guidance, `Missing upgrade guidance for ${name}@${version}`);
  if (status === 'Action required') {
    const link = /\]\(#([^)]*)\)/.exec(guidance);
    assert(link, `Action required needs a migration link for ${name}@${version}`);
    assert(text.includes(`<a id="${link[1]}"></a>`), `Missing migration section: ${link[1]}`);
  }
  return { status, guidance };
}
