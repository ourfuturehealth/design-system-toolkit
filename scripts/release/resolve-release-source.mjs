import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const { GITHUB_EVENT_NAME: event, GITHUB_REF: ref, GITHUB_SHA: workflowSha, GITHUB_OUTPUT: output, GITHUB_ENV: environment } = process.env;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
let [tag, expectedSha] = process.argv.slice(2);
assert(output && environment, 'GitHub step output and environment paths are required');
assert.equal(git('rev-parse', 'HEAD'), workflowSha, 'Publisher checkout differs from the workflow SHA');
if (event === 'workflow_dispatch') {
  assert.equal(ref, 'refs/heads/main', 'Manual publication must run from main');
} else {
  assert.equal(event, 'push', 'Unsupported release event');
  assert(ref.startsWith('refs/tags/'), 'Release push must be a tag');
  tag = ref.slice('refs/tags/'.length);
  expectedSha = workflowSha;
}
assert(/^(toolkit|react)-v\d+\.\d+\.\d+$/.test(tag), 'Canonical stable release tag required');
assert(/^[a-f0-9]{40}$/.test(expectedSha), 'Expected release SHA must contain 40 hexadecimal characters');
const sha = git('rev-parse', '--verify', `refs/tags/${tag}^{commit}`);
assert.equal(sha, expectedSha, 'Tag differs from the expected release SHA');
assert(git('rev-list', '--first-parent', 'origin/main').split('\n').includes(sha), 'Release SHA must be on the main branch commit history');
appendFileSync(output, `TAG=${tag}\nSHA=${sha}\n`);
appendFileSync(environment, `RELEASE_TAG=${tag}\nRELEASE_SHA=${sha}\n`);
process.stdout.write(`Selected ${tag} at ${sha}; publisher workflow is ${workflowSha}\n`);
