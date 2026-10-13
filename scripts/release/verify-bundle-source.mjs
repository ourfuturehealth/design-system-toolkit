import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function verifyBundleProducer(run, plan) {
  assert.equal(run.repository?.full_name, plan.repository, 'Bundle producer must be in this repository');
  assert.equal(run.path?.split('@')[0], '.github/workflows/publish-release.yml', 'Bundle must come from the protected publication workflow');
  assert.equal(run.status, 'completed', 'Inspect and wait for the original publication run to finish');
  assert(/^[a-f0-9]{40}$/.test(run.head_sha), 'Bundle producer needs an exact source SHA');
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  git('fetch', 'origin', run.head_sha);
  if (run.event === 'pull_request') {
    const pulls = run.pull_requests || [];
    if (pulls.length) assert(pulls.some(pull => pull.number === plan.prNumber), 'Bundle producer belongs to another release PR');
    // Do not depend on closed-PR metadata retaining an associated PR list.
    // The complete producer tree must still be the reviewed release tree.
    assert.equal(git('rev-parse', `${run.head_sha}^{tree}`), git('rev-parse', `${plan.sha}^{tree}`), 'Bundle producer tree differs from the merged release source');
  } else {
    assert.equal(run.event, 'workflow_dispatch', 'Unsupported bundle producer event');
    assert(git('rev-list', '--first-parent', 'origin/main').split('\n').includes(run.head_sha), 'Manual bundle producer must run from protected main history');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [runId, planPath] = process.argv.slice(2);
  assert(/^[1-9]\d*$/.test(runId || '') && planPath, 'Original bundle run ID and verified plan required');
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  const run = JSON.parse(execFileSync('gh', ['api', `repos/${plan.repository}/actions/runs/${runId}`], { encoding: 'utf8' }));
  verifyBundleProducer(run, plan);
  process.stdout.write(`Verified publication bundle producer run ${runId}.\n`);
}
