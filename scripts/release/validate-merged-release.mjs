import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function validateMergedRelease(context) {
  assert(context.schemaVersion === 1 && /^[a-f0-9]{40}$/.test(context.sha), 'Exact publication context required');
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  assert.equal(git('rev-parse', 'HEAD'), context.sha, 'Checkout must be the exact merged release SHA');
  assert(git('rev-list', '--first-parent', 'origin/main').split('\n').includes(context.sha), 'Release SHA must be on main first-parent history');
  const record = JSON.parse(readFileSync('.changeset/release.json', 'utf8'));
  assert(record.schemaVersion === 1 && /^[a-f0-9]{40}$/.test(record.baseSha), 'Generated release record required');
  assert(record.baseSha !== context.sha && git('rev-list', '--first-parent', context.sha).split('\n').includes(record.baseSha), 'Recorded base must precede the release on main history');
  execFileSync(process.execPath, [fileURLToPath(new URL('./validate-changeset-pr.mjs', import.meta.url)), record.baseSha, context.sha, '--publication'], { stdio: 'inherit' });
  return { ...context, baseSha: record.baseSha, releases: record.releases };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [contextPath, planPath] = process.argv.slice(2);
  assert(contextPath && planPath, 'Usage: validate-merged-release.mjs <context.json> <plan.json>');
  const plan = validateMergedRelease(JSON.parse(readFileSync(contextPath, 'utf8')));
  writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
  process.stdout.write(`Validated release PR #${plan.prNumber} at merged SHA ${plan.sha}\n`);
}
