import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const changesetPath = id => {
  assert(/^[a-zA-Z0-9_-]+$/.test(id), `Invalid changeset ID: ${id}`);
  return `.changeset/${id}.md`;
};

export function contributingAuthors(changesets, addedCommit, associatedPulls) {
  const authors = new Map();
  const warnings = [];
  for (const id of changesets) {
    const commit = addedCommit(changesetPath(id));
    assert(/^[a-f0-9]{40}$/.test(commit), `${id}: cannot find the commit that added this changeset`);
    const pulls = associatedPulls(commit).filter(pull => pull.merged_at && pull.base?.ref === 'main');
    if (pulls.length !== 1) {
      warnings.push(`${id}: could not identify one merged feature PR on main; request a reviewer manually`);
      continue;
    }
    const author = pulls[0].user;
    if (author?.type !== 'User' || !author.login) {
      warnings.push(`${id}: feature PR has no human author; request a reviewer manually`);
      continue;
    }
    authors.set(author.login.toLowerCase(), author.login);
  }
  return { authors: [...authors.values()], warnings };
}

export function missingReviewers(authors, requested, reviews) {
  const alreadyInvolved = new Set([...requested.map(user => user.login), ...reviews.map(review => review.user?.login)]
    .filter(Boolean).map(login => login.toLowerCase()));
  return authors.filter(login => !alreadyInvolved.has(login.toLowerCase()));
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const api = (endpoint, ...args) => JSON.parse(execFileSync('gh', ['api', ...args, endpoint], { encoding: 'utf8' }));
const pages = endpoint => api(endpoint, '--paginate', '--slurp').flat();

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const repository = process.env.GITHUB_REPOSITORY;
  const pullNumber = process.env.RELEASE_PR_NUMBER;
  assert(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository || ''), 'Set GITHUB_REPOSITORY');
  assert(/^\d+$/.test(pullNumber || ''), 'Set RELEASE_PR_NUMBER');
  assert(process.env.GH_TOKEN, 'Set GH_TOKEN to the release App token');
  assert(process.env.RELEASE_RECORD_FILE, 'Set RELEASE_RECORD_FILE to the generated release record');

  const record = JSON.parse(readFileSync(process.env.RELEASE_RECORD_FILE, 'utf8'));
  assert(/^[a-f0-9]{40}$/.test(record.baseSha), 'Release record needs an exact base SHA');
  assert(record.baseSha === process.env.GITHUB_SHA, 'Release record must match the main push commit');
  const { authors, warnings } = contributingAuthors(record.changesets,
    path => git('log', '-1', '--diff-filter=A', '--format=%H', record.baseSha, '--', path),
    commit => pages(`repos/${repository}/commits/${commit}/pulls`));
  for (const warning of warnings) process.stdout.write(`::warning::${warning}\n`);
  const endpoint = `repos/${repository}/pulls/${pullNumber}`;
  const requested = api(`${endpoint}/requested_reviewers`).users;
  const reviews = pages(`${endpoint}/reviews`);
  const missing = missingReviewers(authors, requested, reviews);
  for (const login of missing) {
    execFileSync('gh', ['api', '-X', 'POST', '--input', '-', `${endpoint}/requested_reviewers`], {
      input: JSON.stringify({ reviewers: [login] }), encoding: 'utf8', stdio: ['pipe', 'ignore', 'inherit'],
    });
  }
  process.stdout.write(`Release PR #${pullNumber}: requested ${missing.length} new reviewer(s); ${authors.length} feature author(s) identified.\n`);
}
