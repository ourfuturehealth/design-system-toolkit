# Release process

Toolkit and React are versioned independently and distributed through GitHub
Releases. Package-manager consumers install each package's release tarball;
toolkit also provides a ZIP of compiled files. See [release versioning](release-versioning-strategy.md)
for version, tag and artifact names.

## Feature PR

A changeset is a short Markdown file that records which public packages changed,
whether each needs a `patch`, `minor` or `major` version bump, and what consumers
need to know. It travels with the feature PR so the release summary and upgrade
guidance can be reviewed alongside the code. Changesets from several feature PRs
can contribute to one release. See the [Changesets introduction](https://changesets.dev/guide/getting-started)
for the general model and our [changeset format](../.changeset/README.md) for the
required consumer guidance.

For a change to a public package, run `pnpm changeset` from the repository root
in the feature branch. Select every affected package and bump type, then edit the
generated `.changeset/*.md` file to add the required `Consumer action` and
`Migration notes` sections. Commit it with the feature. Do not change package
versions, `CHANGELOG.md` or `UPGRADING.md` in a feature PR. Tests, stories,
package README edits and repository tooling alone do not need a changeset.
Shared styles or assets can affect both packages; include both when both change
for consumers, even if the edited files sit under only one package.

The required `Pull request` check validates changesets and package versions,
then runs lint, tests, documentation checks and packaged-artifact checks. For a
public-package file change, it requires a new changeset naming that package.
It rejects missing summaries or migration notes, invalid consumer-action values,
placeholder guidance, direct version bumps and removal of pending changesets.
The file-path check cannot detect every indirect effect on another package, so
reviewers must also check the release summary, consumer guidance and any changed
accessibility behaviour against the code.

## Release PR

After a feature PR merges to `main`, `Prepare release PR` collects pending
changesets. It checks that the current versions of both packages have published
GitHub Releases before planning the next versions. If either baseline release is
missing, preparation fails and the Actions run shows which version needs attention.
The workflow calculates the next version of each affected package and writes
dated entries in the root changelog (`CHANGELOG.md`) and upgrading guide
(`UPGRADING.md`).

The release App creates or updates a single release PR. Feature PRs merged while
it is open are added to that PR, so one release can contain several features.
The App requests the human authors of the contributing feature PRs as reviewers;
if it cannot identify an author, a maintainer assigns a reviewer. The PR also
contains a generated record of the changesets and intended package versions,
which CI uses to check that the release matches the reviewed `main` base.

Reviewers check the version bumps, summaries, consumer actions, migration steps
and release date. They approve and merge only when the PR is current with `main`
and its required checks pass. The release App follows the same review and branch
protections as other contributors. If preparation needs to be retried, see
[release operations](release-operations.md#release-pr-preparation).

## Publication

Merging the reviewed release PR starts `Publish merged release`. It validates the
merged release, builds and tests the intended package assets, then creates the
package tags and GitHub Releases from that exact merge. Only packages with
changesets in the release get new versions and releases. The publisher verifies
the assets before making the releases public and checks the published results.
GitHub publishes package releases separately, so an interrupted batch can need
maintainer inspection; see [release operations](release-operations.md#recovery).

The repository requires one approval, a PR current with `main`, and a passing
`Pull request` check for merges to `main`. For `toolkit-v*` and `react-v*` tags,
one ruleset allows only the release App to create tags; another prevents updates
and deletions. Release immutability is enabled, protecting the tags and assets
of published releases. Release titles and notes can still be corrected.

## Slack announcement

After the batch is verified as published, `Announce verified release in Slack`
sends one 📣 announcement for the batch to the `DS Release Announcement` Slack
workflow, which posts in `#design-system`. It uses the reviewed changelog
summaries and includes labelled links to the changelog, upgrading guide and each
package release. GitHub Actions sends the message and links to Slack through a
webhook held in the `SLACK_RELEASE_WORKFLOW_WEBHOOK_URL` secret.

A Slack failure does not undo a GitHub release. Maintainers inspect the channel
and workflow result before requesting another announcement; see
[release operations](release-operations.md#slack-announcement-recovery).

## Pausing the automation

Repository variables provide separate stop switches for release-PR preparation
and publication. They are for pausing the flow when needed, rather than normal
release steps. See [release operations](release-operations.md#pause-and-resume-automation)
for their names and the effect of each switch.
