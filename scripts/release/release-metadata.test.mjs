import assert from 'node:assert/strict';
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
  const row = '| `@ourfuturehealth/toolkit` | `4.26.1` | Action required | [Migrate](#recovery) |';
  assert.throws(() => upgradeDecision('', '@ourfuturehealth/toolkit', '4.26.1'));
  assert.throws(() => upgradeDecision(row, '@ourfuturehealth/toolkit', '4.26.1'));
  const guide = `${row}\n<a id="recovery"></a>`;
  assert.equal(upgradeDecision(guide, '@ourfuturehealth/toolkit', '4.26.1').status, 'Action required');
  assert.throws(() => upgradeDecision(guide + row, '@ourfuturehealth/toolkit', '4.26.1'));
});
