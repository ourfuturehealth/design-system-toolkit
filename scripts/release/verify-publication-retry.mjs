import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function assertPublicationRetryAllowed(attempt, runId, resume, artifactNames) {
  assert(Number.isSafeInteger(attempt) && attempt > 0, 'Valid publication attempt required');
  assert(Number.isSafeInteger(runId) && runId > 0, 'Valid publication run ID required');
  if (attempt === 1) return;
  assert(!resume, 'An inspected resume needs a new manual dispatch, not a job rerun');
  assert(!artifactNames.includes(`publication-attempt-${runId}`),
    'Publication may have started; inspect the remote state and dispatch an explicit resume with the original bundle');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const attempt = Number(process.env.GITHUB_RUN_ATTEMPT);
  const runId = Number(process.env.GITHUB_RUN_ID);
  const resume = process.env.RESUME_PUBLICATION === 'true';
  let names = [];
  if (attempt > 1 && !resume) {
    const repository = process.env.GITHUB_REPOSITORY;
    assert(repository, 'Repository required to inspect prior publication attempts');
    names = execFileSync('gh', ['api', '--paginate',
      `repos/${repository}/actions/runs/${runId}/artifacts?per_page=100`,
      '--jq', '.artifacts[].name'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  }
  assertPublicationRetryAllowed(attempt, runId, resume, names);
}
