import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gh, githubReleaseClient } from './github-release.mjs';
import { validateBundle } from './release-bundle.mjs';
import { resolvePublicationContext } from './resolve-publication-context.mjs';
import { validateMergedRelease } from './validate-merged-release.mjs';

export function publishReleaseBatch(plan, directory, resume, statePath) {
  const client = githubReleaseClient(plan.repository, plan.sha);
  const state = { sha: plan.sha, repository: plan.repository, prNumber: plan.prNumber, completed: false,
    releases: plan.releases.map(release => ({ tag: release.tag, status: 'pending' })) };
  const save = () => writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
  save();
  let active;
  function referenceSha(tag) {
    const matches = JSON.parse(gh('api', `repos/${plan.repository}/git/matching-refs/tags/${tag}`)).filter(ref => ref.ref === `refs/tags/${tag}`);
    assert(matches.length <= 1, 'Ambiguous remote tag reference');
    if (!matches.length) return undefined;
    let object = matches[0].object;
    if (object.type === 'tag') object = JSON.parse(gh('api', `repos/${plan.repository}/git/tags/${object.sha}`)).object;
    assert.equal(object.type, 'commit', 'Release tags must resolve directly to a commit');
    return object.sha;
  }
  try {
    assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), plan.sha, 'Checkout differs from release SHA');
    execFileSync('git', ['diff', '--exit-code', 'HEAD'], { stdio: 'pipe' });
    const bundle = JSON.parse(readFileSync(join(directory, 'release-bundle.json'), 'utf8'));
    const entries = validateBundle(bundle, plan, directory);
    // Inspect the entire remote batch before creating any tag or uploading anything.
    for (const entry of entries) {
      active = state.releases.find(item => item.tag === entry.tag);
      const sha = referenceSha(entry.tag);
      const release = client.findRelease(entry.tag);
      assert(resume || (!sha && !release), `Existing tag/release ${entry.tag}: inspect it and explicitly resume with the original bundle`);
      if (sha) assert.equal(sha, plan.sha, 'Existing release tag differs from the merged SHA; never retag it');
      if (release) {
        assert(sha, 'Existing release has no matching tag');
        client.verifyRemoteTag(entry.tag);
        client.verifyAssets(release, entry.assets, !release.draft);
      }
    }
    for (const entry of entries) {
      active = state.releases.find(item => item.tag === entry.tag);
      if (!referenceSha(entry.tag)) {
        try {
          gh('api', '--method', 'POST', '-f', `ref=refs/tags/${entry.tag}`, '-f', `sha=${plan.sha}`, `repos/${plan.repository}/git/refs`);
        } catch (error) {
          throw new Error(`Tag creation outcome is unknown for ${entry.tag}; inspect the remote reference before an explicit resume. Never update or delete it.`, { cause: error });
        }
      }
      assert.equal(referenceSha(entry.tag), plan.sha, 'Created tag differs from release SHA');
      active.status = 'tag-verified';
      save();
    }
    const staged = [];
    for (const entry of entries) {
      active = state.releases.find(item => item.tag === entry.tag);
      staged.push(client.stage(entry.tag, entry.notesPath, entry.assets, resume));
      active.status = staged.at(-1).release.draft ? 'draft-verified' : 'already-public';
      save();
    }
    // All intended releases and bytes must be ready before the first publish.
    validateBundle(bundle, plan, directory);
    for (const entry of staged) {
      active = state.releases.find(item => item.tag === entry.tag);
      assert.equal(referenceSha(entry.tag), plan.sha, 'Tag changed before publication');
      client.verifyRemoteTag(entry.tag);
      const release = client.findRelease(entry.tag);
      assert(release && release.draft === entry.release.draft, 'Release state changed after staging; inspect it before resuming');
      client.verifyAssets(release, entry.assets, true);
    }
    for (const entry of staged) {
      active = state.releases.find(item => item.tag === entry.tag);
      if (entry.release.draft) {
        active.status = 'publishing';
        save();
        client.publish(entry);
        active.status = 'published';
        save();
      }
    }
    for (const entry of staged) {
      active = state.releases.find(item => item.tag === entry.tag);
      assert.equal(referenceSha(entry.tag), plan.sha, 'Tag changed after publication');
      client.verifyRemoteTag(entry.tag);
      const release = client.findRelease(entry.tag);
      assert(release && !release.draft, 'Final public release verification failed');
      client.verifyAssets(release, entry.assets, true);
    }
    state.completed = true;
    save();
    process.stdout.write(`Verified all ${entries.length} public releases at ${plan.sha}.\n`);
    return state;
  } catch (error) {
    if (active) active.status = 'inspection-required';
    state.error = error.message;
    save();
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [planPath, directory, flag] = process.argv.slice(2);
  assert(planPath && directory && (!flag || flag === '--resume'), 'Usage: publish-release-batch.mjs <plan.json> <bundle-directory> [--resume]');
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  assert.equal(plan.repository, process.env.GITHUB_REPOSITORY, 'Plan repository differs from the workflow');
  const pull = JSON.parse(gh('api', `repos/${plan.repository}/pulls/${plan.prNumber}`));
  const context = resolvePublicationContext(pull, plan.repository, process.env.RELEASE_APP_SLUG);
  assert.equal(context.sha, plan.sha, 'Batch SHA differs from the actual merged release PR');
  assert.deepEqual(validateMergedRelease(context), plan, 'Batch differs from the verified merged release plan');
  publishReleaseBatch(plan, directory, flag === '--resume', process.env.RELEASE_BATCH_STATE);
}
