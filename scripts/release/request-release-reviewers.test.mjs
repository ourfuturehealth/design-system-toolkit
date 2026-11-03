import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { contributingAuthors, missingReviewers } from './request-release-reviewers.mjs';

const sha = digit => digit.repeat(40);
const pull = (login, type = 'User') => ({ merged_at: '2026-11-02T12:00:00Z', base: { ref: 'main' }, user: { login, type } });

test('one merged feature PR author is selected for release review', () => {
  const authors = contributingAuthors(['first'], path => path === '.changeset/first.md' ? sha('a') : '',
    commit => commit === sha('a') ? [pull('diogo-filipe-costa')] : []);
  assert.deepEqual(authors, { authors: ['diogo-filipe-costa'], warnings: [] });
});

test('stacked changesets request each human author once', () => {
  const commits = { '.changeset/first.md': sha('a'), '.changeset/second.md': sha('b'), '.changeset/third.md': sha('c') };
  const pulls = { [sha('a')]: [pull('diogo-filipe-costa')], [sha('b')]: [pull('Other-Maintainer')], [sha('c')]: [pull('diogo-filipe-costa')] };
  assert.deepEqual(contributingAuthors(['first', 'second', 'third'], path => commits[path], commit => pulls[commit]),
    { authors: ['diogo-filipe-costa', 'Other-Maintainer'], warnings: [] });
});

test('a rerun requests only authors who have not been requested or reviewed', () => {
  const reviewers = missingReviewers(['diogo-filipe-costa', 'Other-Maintainer', 'New-Maintainer'],
    [{ login: 'Diogo-Filipe-Costa' }], [{ user: { login: 'other-maintainer' }, state: 'APPROVED' }]);
  assert.deepEqual(reviewers, ['New-Maintainer']);
});

test('missing Git history fails because provenance cannot be checked', () => {
  assert.throws(() => contributingAuthors(['missing'], () => '', () => []), /cannot find the commit/);
});

test('missing PR association warns while other feature authors are still requested', () => {
  const result = contributingAuthors(['missing', 'found'], path => path.includes('missing') ? sha('a') : sha('b'),
    commit => commit === sha('a') ? [] : [pull('diogo-filipe-costa')]);
  assert.deepEqual(result.authors, ['diogo-filipe-costa']);
  assert.match(result.warnings[0], /request a reviewer manually/);
});

test('bot-authored changesets warn instead of requesting a bot review', () => {
  const result = contributingAuthors(['bot'], () => sha('a'), () => [pull('automation[bot]', 'Bot')]);
  assert.deepEqual(result.authors, []);
  assert.match(result.warnings[0], /no human author/);
});

test('reviewer lookup uses the saved release record after the PR action restores checkout', t => {
  const directory = mkdtempSync(join(tmpdir(), 'release-reviewers-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, '.changeset'));
  mkdirSync(join(directory, 'bin'));
  writeFileSync(join(directory, '.changeset/release.json'), JSON.stringify({ baseSha: sha('b'), changesets: [] }));
  const savedRecord = join(directory, 'generated-release.json');
  writeFileSync(savedRecord, JSON.stringify({ baseSha: sha('a'), changesets: [] }));
  const gh = join(directory, 'bin/gh');
  writeFileSync(gh, '#!/bin/sh\ncase "$*" in\n  *requested_reviewers) printf \'{"users":[]}\' ;;\n  *reviews) printf \'[[]]\' ;;\n  *) exit 1 ;;\nesac\n', { mode: 0o755 });
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./request-release-reviewers.mjs', import.meta.url))], {
    cwd: directory, encoding: 'utf8', env: {
      ...process.env, PATH: `${join(directory, 'bin')}:${process.env.PATH}`,
      GITHUB_SHA: sha('a'), GITHUB_REPOSITORY: 'owner/repo', RELEASE_PR_NUMBER: '20', GH_TOKEN: 'test-token',
      RELEASE_RECORD_FILE: savedRecord,
    },
  });
  assert.match(output, /requested 0 new reviewer/);
});
