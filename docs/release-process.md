# Release process

Packages are distributed through GitHub Releases. Toolkit supplies an installable
`.tgz` and compiled `.zip`; React supplies an installable `.tgz`. Consumers install
the tarball URL. Keep those filenames and the package-manager installation
contract described in [release versioning](release-versioning-strategy.md).

## Safeguards

Protect `main` with reviewed PRs, required checks and an up-to-date branch
requirement (or an equivalent merge queue). An old green check must not authorise
merging over newly added changesets. Do not give the release App a bypass.

Release PR checks compare the generated files with their exact `main` base SHA.
If `main` changes while a release PR is open, its checks must run against the new
base before merge. The release App does not bypass normal PR review or checks.

Before automatic publication, configure two active tag rulesets matching
`toolkit-v*` and `react-v*`:

- Restrict creation, with only the dedicated release App allowed to bypass it.
- Restrict updates and deletion, without routine bypasses, including for the App.

Keep those rules separate: an App bypass on one combined ruleset would also let
it bypass mutation protection. During tag-triggered publication, maintainers
still need creation permission; apply App-only creation at cutover. The workflow
only creates missing references. It never
updates or deletes tags, but its checks cannot prevent another actor moving a tag
between checks. Administrator configuration and verification of these rulesets
remain required; the workflow does not configure or audit them. See
[GitHub tag rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

To protect published assets as well, an administrator can enable release
immutability in repository Settings, under Releases. It applies to future
releases, locks published assets and tags, and still allows edits to titles and
notes. Attach every asset to the draft before publishing. See
[GitHub's immutable releases guidance](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases).

## Prepare and review

1. Include a changeset in each feature PR that changes a public package. Run
   `pnpm changeset`, select the affected packages and bump types, then add the
   explicit consumer decision and migration notes from
   [the changeset format](../.changeset/README.md). Do not edit package versions.
2. Run the validation commands below. Review the summary and consumer guidance
   alongside the implementation. Complete human accessibility checks when
   changing accessible behaviour; markup checks do not prove the spoken result.
3. Review and merge the feature PR under the repository's branch protections.
   When release PR automation is enabled, the release App creates or updates one
   release PR from the pending changesets.
   Changesets calculates versions; `pnpm release:version` generates the root
   changelog and adds rows and migration sections to the existing upgrade index.
   It does not create per-package changelogs, tags, assets or releases.
4. Review the release PR's package versions, summaries, migration guidance and
   planned publication date. CI requires the exact Changesets version plan and
   reviewed guidance, plus versions above existing tags and published releases.
   A release PR cannot include component code or unrelated changes. Update the
   summaries in their feature changesets before generation, rather than editing
   generated notes. If only the date changes, update all new changelog and upgrade
   index dates together; CI regenerates the expected documents using that date.
5. Merge the release PR normally. There is no separate environment approval.
   Once enabled, publication starts from the actual merged SHA, including merge
   and squash merges. Before cutover, follow the tag steps below.

The generator commits `.changeset/release.json` with the reviewed base SHA,
consumed changeset IDs and intended packages/versions/tags. CI checks it against
the calculated plan. Publication revalidates the source, manifests and docs from
that recorded base to the exact merged commit; it does not publish from the PR
head, current branch tip or a tag pushed by a developer.

## Release PR automation

The dedicated release App writes the generated files to `changeset-release/main`
and creates or updates its PR. The App has Contents and Pull requests write
permissions, but no branch-protection bypass or workflow administration access.
Its short-lived installation token lets the PR trigger normal checks. PR CI
recognises the App's author identity and `main` base, not a label or a chosen
branch name.

Configure repository variables `RELEASE_APP_CLIENT_ID` and `RELEASE_APP_SLUG`
(without `[bot]`), plus secret `RELEASE_APP_PRIVATE_KEY`, in GitHub settings.
Never commit the private key. The workflow checks the minted token's App slug
and requests access only to this repository.

The repository variable `RELEASE_PR_AUTOMATION_ENABLED` controls whether this
workflow runs. When it is not `true`, feature PRs can still record changesets,
but no release PR is created automatically. When enabled, the workflow runs on
`main` pushes or manual dispatch on `main`. It does not prepare another release
while a current package version remains unpublished.

Set `RELEASE_PR_AUTOMATION_ENABLED=true` only after the current package releases
have been published and verified. The workflow otherwise stays disabled.
It runs on `main` pushes and can be dispatched manually on `main`; it refuses to
prepare a new release while the current manifest versions remain unpublished.
If new feature work merges before publication finishes, rerun preparation after
verifying the published releases. There is no fallback to a personal token or
the default Actions token for writing release PRs.

Changesets calculates versions; a SHA-pinned PR action commits the generated files
as the App and creates or updates `changeset-release/main`. The standard
Changesets PR action requires per-package changelogs, which this repository does
not maintain. Our workflow keeps the root changelog and supplies a GitHub-asset
focused PR body. It must not run Changesets' npm publication or default tag
creation. The publication workflow is separate and uses a token restricted to
Contents write and Pull requests read. Both tokens must match the configured App
slug. Repository App secrets trust collaborators who can modify and run workflows;
review changes to release scripts and workflows under `main` protections.

## Start publication

With `RELEASE_PUBLISH_AUTOMATION_ENABLED=true`, merging an App-owned
`changeset-release/main` PR to `main` starts `Publish merged release`. It reads the
PR from GitHub, verifies its author/repository/branch/merged SHA, and checks out
that exact SHA. Only packages listed in the release record receive tags and
releases. Unchanged package versions are not republished.

The activation variable defaults to disabled. When enabled, it also disables the
tag-triggered workflow, so the App's new tag events cannot start a second publisher.
Both publication workflows share one non-cancelling concurrency group.

Before cutover, the existing workflow runs when a maintainer pushes a canonical tag:
`toolkit-v<version>` or `react-v<version>`. Legacy `v*` tags are historical
references and do not trigger publication.

Check the merged commit SHA and each package manifest before creating its tag.
Create each tag at that exact SHA, not an interior feature-branch commit. Never
replace an existing tag or delete a tag to rerun a release. Packages released
together use the same merged SHA, but each tag starts its own release job.

Before cutover, pushing a canonical tag authorises publication if all checks pass.
After cutover, merging the reviewed release PR authorises publication. Neither
workflow uses a separate environment approval.

## Activate automatic publication

1. Verify the current package releases, tags, assets and version history form
   a valid baseline before enabling release preparation.
2. Merge the stacked implementation PRs in order. Configure the App and release
   PR variables above; keep publication disabled while setting up protections.
3. Verify required `main` checks/up-to-date protection, App-only tag creation and
   no routine tag update/deletion bypass. Consider native release immutability.
4. Rehearse the real App, generated PR and publication flow in an explicitly
   authorised disposable repository, with the same permissions and tag rules.
   Verify a paired release, a package-only release and an inspected partial-run
   resume. Offline tests do not prove these GitHub operations or permissions.
5. Set `RELEASE_PUBLISH_AUTOMATION_ENABLED=true`. Subsequent merged release PRs
   start the automatic workflow; normal developers no longer push release tags.

`Announce verified release in Slack` follows a successful automatic publication
and sends one message for the verified batch. It reads the publisher's completed
`publication-state.json` artifact, rechecks the merged release SHA and public
tags, and uses that SHA's changelog. It does not announce individual tag events.
The webhook URL stays in the `SLACK_RELEASE_WORKFLOW_WEBHOOK_URL` Actions secret.
The Slack workflow trigger must define `announcement`, `release_type` (`toolkit`,
`react`, or `both`), `changelog_url`, `upgrading_url`, `toolkit_release_url`, and
`react_release_url`. All six fields are sent for every batch. For a package-only
release, the unused release URL points to the repository's releases page. The
announcement is plain text; the Slack workflow applies labels to the URL fields.
The heading starts with 📣. Keep any `[TEST ONLY]` marker in deliberate test
messages to a private channel, not in automatic production announcements.
Slack failure does not change publication status. Do not blindly rerun the
announcement: check the release channel and announcement-state artifact first.
For an earlier verified publication, manually dispatch the announcement workflow
with the publication run ID and the inspection confirmation.

## Automated checks and publication

The automatic workflow verifies the recorded Changesets plan and increasing
versions against tags and published history, plus dated changelog entries and
explicit upgrade decisions. It accepts its own batch's existing versions only
for inspection; remote tags and assets still require an explicitly approved resume
and must match the exact source and original bytes. A newer release blocks an
older batch from resuming.

It runs lint, tests and docs checks, then builds and smoke-tests every intended
package. It saves a `release-bundle-<SHA>` Actions artifact containing canonical
assets, SHA-pinned reviewed notes and their SHA-256 checksums. The saved bundle
and publication-state artifacts expire after 30 days. Do not rebuild substitutes
for an existing release if its original bundle has expired.

Only after these checks and bundle verification does it mint a short-lived App
token. It inspects the entire remote batch, creates missing tags through the
create-reference API, and checks each target SHA. It stages every GitHub release
as draft, uploads without overwriting, and downloads and checks every asset before
the first release becomes public. It verifies tags and public assets again afterward.

GitHub publishes releases separately, so this is not an atomic transaction. A
late failure can leave one package public and another in draft. Final verification
detects discrepancies but cannot undo publication. The workflow records each
package's status in `publication-state.json`; only a fully verified batch has
`completed: true`.

## Validation

Install with the pinned package manager and run:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm lint:release
pnpm test
pnpm test:release
pnpm build
pnpm docs:release-contract
pnpm --filter=@ourfuturehealth/react-components exec playwright install chromium
NPM_CONFIG_REGISTRY=https://registry.npmjs.org pnpm smoke:release-artifacts
```

`pnpm test:release` tests metadata failures and release-SHA eligibility using
both command fixtures and real temporary Git repositories. It creates local
test commits and tags only inside those temporary repositories. Publication
tests simulate GitHub commands; they do not contact GitHub or publish releases.

Passing these tests does not prove GitHub permissions or live draft creation,
upload, download, and publication. That integration needs a separate rehearsal
in an authorised disposable repository; a production release is not a test.

The artifact smoke command:

- Builds and packs each package into a temporary staging directory outside its tree.
- Checks the name and version inside each tarball against its manifest.
- Installs and exercises tarballs through Yarn 1, npm, and pnpm using the public registry.
- Extracts the toolkit ZIP, checks CSS/JS/assets and local CSS references, and
  tests compiled styles and clickable-card JavaScript in Chromium. The current
  bundle uses a font stack and does not embed font files.
- Copies the React consumer example into an isolated directory, substitutes the
  staged tarball while preserving other locked dependencies, and runs lint and a
  production application build.

For faster local iteration:

```bash
./scripts/release/smoke-current-release-artifacts.sh toolkit --managers npm
./scripts/release/smoke-current-release-artifacts.sh react-components --managers npm
pnpm release:plan
pnpm release:check-pr origin/main WORKTREE
```

For a stacked PR, use its actual base branch in place of `origin/main`.

`pnpm test:release` exercises generation through the real Changesets CLI and
validates Git-aware rules in isolated temporary repositories. It checks manual
version skips and missing consumer guidance. Announcement tests use a synthetic
webhook endpoint and do not deliver to Slack. Local tests do not prove live App
authentication, commit signing, GitHub PR creation or webhook delivery.

PR CI runs metadata, lint, tests, docs, and external-consumer artifact checks.
Feature package changes need a new changeset; a previously pending changeset
cannot cover new work. Test, Storybook, and package README-only changes are
excluded. Generated release PRs need the calculated versions, root changelog and
upgrade guidance, without component-code changes.

## Documentation requirements

Keep one root changelog. Each release has a unique, nonempty package/version/tag
section, ordered by decreasing semantic version. Dated sections must descend.
Do not invent releases for intermediate manifest values that were never published.

Every version being released must appear once in the version index in
`UPGRADING.md`, with a `Consumer action` decision of `No consumer action required`
or `Action required`. Toolkit and React can share a row when their guidance is
the same. Use separate rows for package-only releases or different upgrade
decisions. An actionable row must link to a migration section through its version
or guidance cell. The target can be an explicit HTML anchor or a Markdown heading.

`pnpm docs:release-contract` scans tracked and new non-ignored Markdown, shell, and workflow files for
known invalid installation guidance, then renders the current release notes to
check their tarball URLs. `CHANGELOG.md` is excluded from the install-string scan
because it preserves historical entries; release metadata validates its structure
separately. If consumer documentation moves to another file type, update the
validator's file scan.

## Failure handling

Fix validation failures before attempting publication. Never retag or overwrite a
published release. Prepare a new version for fixes discovered after publication.

An interrupted automatic batch can resume only with its original saved bundle.
A mismatch or unexpected asset stops the job for maintainer inspection; it does
not replace the asset. Failures reading GitHub state stop the workflow rather
than being interpreted as an absent tag or release.

`Publication outcome is unknown` means the publish request failed without a
reliable result. The release may be public even though the command failed.
`Publication completed ... final verification failed` means the publish command
succeeded but the subsequent check failed. That failure may be a network problem
or confirmed tag movement; it does not by itself prove that the assets are wrong.

For either message, cancellation, or any partially published batch:

1. Inspect every intended release's draft/public state, its tag target, and the
   expected SHA/checksums in the original `release-bundle-<SHA>` artifact.
   `publication-state.json` and job logs help identify where the run stopped;
   a false/missing completion marker does not prove nothing was published.
2. Download existing assets and compare their SHA-256 digests against the bundle.
   If GitHub is unreachable, wait before deciding whether publication completed.
3. Resolve the failure, then dispatch `Publish merged release` from `main` with
   the merged `release_pr` number, `allow_resume` checked, and `bundle_run_id`
   set to the original run containing the saved verified bytes. The workflow
   checks the producer, source identity and all checksums before minting the App
   token. It does not rebuild the bundle. A normal rerun without explicit resume
   stops; a missing/expired/mismatched bundle needs a reviewed recovery plan.
4. Resume verifies already-public packages and skips them without editing notes,
   assets or tags. It fills only missing matching draft assets and publishes only
   the remaining drafts. If all intended releases are already public and match,
   verification can complete without another publication request.
5. If a public release is defective, retain its tag and assets, add a prominent
   warning, and prepare a superseding version. Never automatically redraft,
   delete, overwrite, or retag it.

Before cutover, the single-package tag-triggered publisher still refuses to adopt
an existing public release. Its draft-only resume compares the staged bytes;
inspect published outcomes manually rather than rerunning that publisher.

## Verify the published release

Confirm each tag still resolves to the recorded merged SHA, the GitHub release
contains the expected assets, and its notes link to the correct installation URL
and SHA-pinned changelog and upgrade guidance. Install from the published tarball
URL in a consumer application and build it; toolkit ZIP consumers should also
check the published ZIP.

For a release that replaces a defective version, retain the old tags and assets.
Prepend a prominent `SUPERSEDED / DO NOT USE` warning to the old release's title
and notes, with links to its published replacement and migration guidance.
Before a replacement is published, use `DO NOT USE` without claiming it is
available. A warning cannot prevent installation from a retained download URL.
