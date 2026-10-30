import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function resolvePublicationContext(pull, repository, appSlug) {
  assert(repository && appSlug, 'Repository and release App slug are required');
  assert.equal(pull.merged, true, 'Only merged PRs can publish');
  assert.equal(pull.state, 'closed', 'Release PR must be closed after merging');
  assert.equal(pull.user?.login, `${appSlug}[bot]`, 'Release PR must be owned by the configured App');
  assert.equal(pull.user?.type, 'Bot', 'Release PR author must be a GitHub App bot');
  assert.equal(pull.base?.ref, 'main', 'Release PR must merge into main');
  assert.equal(pull.head?.ref, 'changeset-release/main', 'Unexpected release PR branch');
  assert.equal(pull.base?.repo?.full_name, repository, 'Unexpected base repository');
  assert.equal(pull.head?.repo?.full_name, repository, 'Forks cannot start publication');
  assert(Number.isSafeInteger(pull.number) && pull.number > 0, 'Valid release PR number required');
  assert(/^[a-f0-9]{40}$/.test(pull.merge_commit_sha), 'Exact merged release SHA required');
  return { schemaVersion: 1, repository, prNumber: pull.number, sha: pull.merge_commit_sha };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assert.equal(process.env.GITHUB_REF, 'refs/heads/main', 'Publication workflow must run from main');
  const resume = process.env.RESUME_PUBLICATION === 'true';
  assert(Number(process.env.GITHUB_RUN_ATTEMPT || 1) === 1 || resume, 'Do not blindly rerun publication; inspect the previous attempt and dispatch an explicit resume');
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  assert(['pull_request', 'workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME), 'Unsupported publication event');
  if (resume) {
    assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch', 'Resume requires an explicit manual dispatch');
    assert(/^[1-9]\d*$/.test(process.env.BUNDLE_RUN_ID || ''), 'Resume needs the original bundle run ID');
  }
  const number = process.env.GITHUB_EVENT_NAME === 'pull_request' ? event.pull_request?.number : Number(process.env.RELEASE_PR_NUMBER);
  assert(Number.isSafeInteger(number) && number > 0, 'Valid release PR number required');
  const repository = process.env.GITHUB_REPOSITORY;
  const pull = JSON.parse(execFileSync('gh', ['api', `repos/${repository}/pulls/${number}`], { encoding: 'utf8' }));
  const context = resolvePublicationContext(pull, repository, process.env.RELEASE_APP_SLUG);
  if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    assert.equal(context.sha, event.pull_request.merge_commit_sha, 'Merged release SHA differs from the trigger');
  }
  writeFileSync(process.env.RELEASE_CONTEXT_FILE, `${JSON.stringify(context, null, 2)}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `release_sha=${context.sha}\n`);
}
