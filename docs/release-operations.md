# Release operations

Checks and recovery steps for the [release process](release-process.md).

## Release PR preparation

`Prepare release PR` runs after a merge to `main`. If it fails or misses a merge,
open its Actions run to find the cause. After fixing it, run the workflow manually
from `main` to collect pending changesets.

If the run says `Publish and verify <tag> before preparing another release`, a
package manifest names a version that has no matching public GitHub Release.
Check the release for that tag and the preceding release PR. If its publication
was paused, follow [missed publication](#release-pr-merged-while-publication-was-off).
If publication started but did not finish, follow [Recovery](#recovery). Correct
an incorrect manifest through a reviewed PR. Do not create a replacement tag by
hand. Once the manifest and published release agree, run `Prepare release PR`
again. If none of these cases explains the mismatch, stop for a reviewed
recovery plan.

## Pause and resume automation

Both repository variables are normally `true`:

| Variable | When set to `false` |
| --- | --- |
| `RELEASE_PR_AUTOMATION_ENABLED` | `Prepare release PR` skips new or updated release PRs. Pending changesets remain on `main`. |
| `RELEASE_PUBLISH_AUTOMATION_ENABLED` | `Publish merged release` skips publication when a release PR merges. The older tag-triggered workflow becomes eligible if a matching tag is created, so this variable alone is not a complete stop for every publisher. |

Changing a variable does not cancel a run already in progress. To resume the
normal flow, set the publication variable to `true`, then the release-PR variable
to `true`. If changesets accumulated while preparation was off, run
`Prepare release PR` manually from `main`.

### Release PR merged while publication was off

Turning publication back on does not publish an already merged release PR.

1. Set `RELEASE_PUBLISH_AUTOMATION_ENABLED` to `true`.
2. Find the merged release PR number. Check that no publication started for it
   and that its intended tags and releases do not already exist. If publication
   may have started, follow [Recovery](#recovery) instead.
3. In Actions, run `Publish merged release` from `main` with that `release_pr`
   number. Leave `allow_resume` off and `bundle_run_id` empty.
4. [Verify the published release](#verify-the-published-release). If several
   release PRs were missed, handle them in merge order, checking each result
   before starting the next.

## Local checks

The [Pull request workflow](../.github/workflows/pull-request.yml) runs the
complete lint, test, documentation and package-artifact checks. These commands
are useful for checking a change locally or reproducing a failed CI step. Run
them from the repository root after installing dependencies.

| To check | Command |
| --- | --- |
| A feature PR's changeset and package versions | `pnpm release:check-pr origin/main WORKTREE` |
| Release-tooling behaviour | `pnpm test:release` |
| Installable tarballs and the toolkit ZIP | `NPM_CONFIG_REGISTRY=https://registry.npmjs.org pnpm smoke:release-artifacts` |

Fetch the current base before checking a feature PR. For a stacked PR, use its
actual base branch in place of `origin/main`. The artifact smoke check uses
Chromium; follow the browser setup in the PR workflow if it is not installed
locally.

## Generated release documents

One root [changelog](../CHANGELOG.md) records the changes in each package
release. The [upgrading guide](../UPGRADING.md) says `No consumer action required`
or `Action required`, with migration steps for the latter. The release PR
generates both from reviewed changesets. CI checks that their entries and
package versions match those changesets and that installation links use the
expected tarball URL format.

## Recovery

### Validation or build failed before publication

If a new publication run failed before its `publish` job started, that run has
not created tags or releases. Fix the failing check or build and rerun the failed
jobs. If an earlier run for the same release PR may have started publication,
inspect that run and use the procedure below.

### Publication started or its outcome is uncertain

GitHub may have created some tags or releases even if the job failed or was
cancelled. A batch with both packages can have one public release and one draft.
Do not rerun the publish job without inspection.

1. Check every intended tag and GitHub Release, including drafts. Compare their
   commit and downloaded assets with the original `release-bundle-<SHA>` artifact
   from the publication run. If GitHub is unavailable, wait until its state can
   be checked.
2. If the existing tags and assets match, run `Publish merged release` from
   `main` with the merged `release_pr` number, `allow_resume` on and
   `bundle_run_id` set to the run that saved the original bundle. The workflow
   checks existing releases and publishes only what is still missing.
3. If the original bundle is missing or expired, or a tag or asset differs,
   stop and arrange a reviewed recovery plan. Do not rebuild substitute assets,
   move a tag or overwrite a published release.

### A public release is defective

Keep its tag and assets. Add a prominent `DO NOT USE` warning to its title and
notes, then prepare a corrected version through a new feature and release PR.
Once the replacement is public, link it from the old release and mark the old
one `SUPERSEDED / DO NOT USE`.

## Slack announcement recovery

After a verified publication, `Announce verified release in Slack` sends one
message through the `DS Release Announcement` Slack workflow. If the job fails
or its result is uncertain, inspect `#design-system`, the Slack workflow activity
and the `slack-announcement-<run ID>-<attempt>` Actions artifact before sending
again. A GitHub release remains published even if its announcement fails.

To send an announcement for an earlier verified publication, dispatch
`Announce verified release in Slack` with that publication's run ID and the
inspection confirmation. Do not rerun an uncertain submission without checking
whether the message already appeared.

## Verify the published release

For each affected package, check that its tag resolves to the merged release
commit and its public GitHub Release uses that tag. Check its downloads: a
tarball for either package and a ZIP for toolkit. Check the notes' installation
and documentation links. Install the published tarball in a consumer application
and build it; ZIP consumers should check the published ZIP too.
