import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parseChangelog, upgradeDecision, validateVersion } from './release-metadata.mjs';

test('rejects downgrades, unchanged versions, and reuse of published versions', () => {
  assert.throws(() => validateVersion('4.25.0', ['4.25.1']));
  assert.throws(() => validateVersion('0.25.0', ['0.24.2', '0.26.0']));
  assert.throws(() => validateVersion('0.26.0', ['0.26.0']));
  assert.throws(() => validateVersion('01.2.3', []));
  validateVersion('4.26.1', ['4.25.0', '4.26.0']);
  validateVersion('0.26.1', ['0.24.2', '0.26.0']);
  validateVersion('0.28.0', ['0.26.1']);
});

const entry = (version, text = '- Fixed a public component.') => `### 2026-10-08\n\n#### @ourfuturehealth/toolkit ${version} (\`toolkit-v${version}\`)\n\n##### Fixed\n\n${text}\n`;
const upgradeTable = rows => `| Version | Date | Breaking Changes | Consumer action | Migration Complexity |\n| ------- | ---- | ---------------- | --------------- | -------------------- |\n${rows}\n`;

test('paired releases share an upgrade decision in the existing version table', () => {
  const guide = `## Breaking Changes by Version

| Version | Date | Breaking Changes | Consumer action | Migration Complexity |
| ------- | ---- | ---------------- | --------------- | -------------------- |
| [v4.26.1 / React v0.26.1](#release-recovery) | October 2026 | ProgressIndicator correction | Action required | Low - replace the defective package. |

<a id="release-recovery"></a>`;
  for (const [name, version] of [['@ourfuturehealth/toolkit', '4.26.1'], ['@ourfuturehealth/react-components', '0.26.1']]) {
    const decision = upgradeDecision(guide, name, version);
    assert.equal(decision.status, 'Action required');
    assert.match(decision.guidance, /replace the defective package/);
    assert.match(decision.guidance, /\]\(#release-recovery\)/);
  }
});

test('changelog checks content, tag identity, uniqueness, and package ordering', () => {
  assert.equal(parseChangelog(entry('4.26.1')).get('toolkit-v4.26.1').summary.length, 1);
  assert.throws(() => parseChangelog(entry('4.26.1', '')));
  assert.throws(() => parseChangelog(entry('4.26.1') + entry('4.26.1')));
  assert.throws(() => parseChangelog(entry('4.25.0') + entry('4.26.1')));
  assert.throws(() => parseChangelog(entry('4.26.1').replace('`toolkit-v4.26.1`', '`toolkit-v4.26.0`')));
  assert.throws(() => parseChangelog(entry('4.26.1') + entry('4.26.0').replace('2026-10-08', '2026-10-09')));
  assert.throws(() => parseChangelog(entry('4.26.1').replace('2026-10-08', '2026-02-30')));
});

test('every release needs an explicit upgrade decision and actionable migrations need a target', () => {
  const row = '| [v4.26.1](#recovery) | October 2026 | Corrected progress | Action required | Replace the package. |';
  assert.throws(() => upgradeDecision('', '@ourfuturehealth/toolkit', '4.26.1'));
  assert.throws(() => upgradeDecision(upgradeTable(row), '@ourfuturehealth/toolkit', '4.26.1'));
  const guide = `${upgradeTable(row)}\n<a id="recovery"></a>`;
  assert.equal(upgradeDecision(guide, '@ourfuturehealth/toolkit', '4.26.1').status, 'Action required');
  assert.throws(() => upgradeDecision(`${upgradeTable(`${row}\n${row}`)}\n<a id="recovery"></a>`, '@ourfuturehealth/toolkit', '4.26.1'), /Expected one upgrade decision/);
  assert.throws(() => upgradeDecision(guide.replace('Action required', 'Maybe'), '@ourfuturehealth/toolkit', '4.26.1'), /Invalid upgrade decision/);
  assert.throws(() => upgradeDecision(guide.replace('Replace the package.', ''), '@ourfuturehealth/toolkit', '4.26.1'), /Missing upgrade guidance/);
  assert.throws(() => upgradeDecision(guide.replace('[v4.26.1](#recovery)', '`v4.26.1`'), '@ourfuturehealth/toolkit', '4.26.1'), /needs a migration link/);
});

test('package-only releases and exact versions cannot be confused with another package or version', () => {
  const guide = upgradeTable(`| \`React v0.24.1\` | August 2026 | None | No consumer action required | Entry points fixed. |
| \`v4.26.10\` | October 2026 | None | No consumer action required | APIs unchanged. |`);
  assert.equal(upgradeDecision(guide, '@ourfuturehealth/react-components', '0.24.1').status, 'No consumer action required');
  assert.equal(upgradeDecision(guide, '@ourfuturehealth/toolkit', '4.26.10').status, 'No consumer action required');
  assert.throws(() => upgradeDecision(guide, '@ourfuturehealth/toolkit', '0.24.1'), /Expected one upgrade decision/);
  assert.throws(() => upgradeDecision(guide, '@ourfuturehealth/toolkit', '4.26.1'), /Expected one upgrade decision/);
});

test('existing Markdown migration headings are valid targets for paired releases', () => {
  const guide = `${upgradeTable('| [v4.9.0 / React v0.7.0](#upgrading-to-v490--react-v070) | April 2026 | Icon renames | Action required | Replace old icon names. |')}
## Upgrading to v4.9.0 / React v0.7.0`;
  for (const [name, version] of [['@ourfuturehealth/toolkit', '4.9.0'], ['@ourfuturehealth/react-components', '0.7.0']]) {
    assert.equal(upgradeDecision(guide, name, version).status, 'Action required');
    assert.throws(() => upgradeDecision(guide.replace('## Upgrading to v4.9.0 / React v0.7.0', ''), name, version), /Missing migration section/);
  }
});

test('upgrade decisions use named columns and require one canonical table', () => {
  const guide = `| Date | Version | Migration Complexity | Consumer action | Breaking Changes |
| ---- | ------- | -------------------- | --------------- | ---------------- |
| October 2026 | \`v4.26.1\` | APIs unchanged. | No consumer action required | None |`;
  assert.deepEqual(upgradeDecision(guide, '@ourfuturehealth/toolkit', '4.26.1'), { status: 'No consumer action required', guidance: 'APIs unchanged.' });
  assert.throws(() => upgradeDecision(`${guide}\n\n${guide}`, '@ourfuturehealth/toolkit', '4.26.1'), /Expected one upgrade guidance table/);
});

test('the repository guide retains recent and historical upgrade decisions in one index', () => {
  const guide = readFileSync(new URL('../../UPGRADING.md', import.meta.url), 'utf8');
  const releases = [
    ['@ourfuturehealth/toolkit', '4.26.1', 'Action required'],
    ['@ourfuturehealth/react-components', '0.26.1', 'Action required'],
    ['@ourfuturehealth/react-components', '0.24.1', 'No consumer action required'],
    ['@ourfuturehealth/toolkit', '4.24.1', 'Action required'],
    ['@ourfuturehealth/toolkit', '4.23.0', 'Action required'],
    ['@ourfuturehealth/react-components', '0.22.0', 'No consumer action required'],
    ['@ourfuturehealth/react-components', '0.8.0', 'Action required'],
    ['@ourfuturehealth/toolkit', '4.6.0', 'Action required'],
    ['@ourfuturehealth/react-components', '0.4.0', 'No consumer action required'],
    ['@ourfuturehealth/toolkit', '4.0.0', 'Action required'],
  ];
  for (const [name, version, status] of releases) {
    assert.equal(upgradeDecision(guide, name, version).status, status, `${name}@${version}`);
  }
});
