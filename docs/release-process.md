# Release process

Packages are distributed through GitHub Releases. Toolkit supplies an installable
`.tgz` and compiled `.zip`; React supplies an installable `.tgz`. Consumers install
the tarball URL. Keep those filenames and the package-manager installation
contract described in [release versioning](release-versioning-strategy.md).

Each public-package change begins in a feature PR with a changeset. After feature
PRs merge, one App-owned release PR gathers their changesets, calculates independent
package versions and updates the root `CHANGELOG.md` and `UPGRADING.md`. Those
documents are reviewed before the release PR merges; publication does not write
them afterward. Once automatic publication is enabled, the merge starts package
validation, GitHub Releases and a Slack announcement for the completed batch.

## Contributor path

A contributor adds a changeset to a feature PR that changes a public package. It
names every affected package, the intended `patch`, `minor` or `major` bump, a
summary, a consumer-action decision and migration notes. The
[changeset format](../.changeset/README.md) has an example and the bump rules.
Package versions stay unchanged in feature PRs. Tests, stories, package README
edits and repository tooling do not need a package release. A change to shared
styles or assets may affect both packages even when only one package's files
changed; the contributor and reviewer must account for that impact.

The `Pull request` workflow runs `release:check-pr` on feature PRs. For changes
detected under a public package, it requires a new, valid changeset naming that
package. An older pending changeset cannot cover new work. The check rejects
missing or incomplete consumer guidance, direct version bumps and feature PRs
that remove pending changesets. Its path check cannot infer indirect impact from
files outside a package directory. CI failure blocks a merge only if repository
rules require the check; that external setting is not established by this file.

Reviewers check the changeset summary and consumer guidance with the code, plus
human accessibility behaviour when it changes. The [contributor guide](../CONTRIBUTING.md)
and PR template point to the changeset format.

## Release PR

After a feature PR merges, `Prepare release PR` runs on `main` when
`RELEASE_PR_AUTOMATION_ENABLED=true`. It also supports manual dispatch. The
workflow waits if either current package version has not yet been published.
Changesets calculates the next versions and consumes the pending changesets. The
repository generator writes dated entries in the root changelog and upgrade
index; it does not create per-package changelogs. A SHA-pinned PR action commits
the generated files as the dedicated release App to `changeset-release/main` and
creates or updates one release PR. It does not publish packages or create tags.

The release PR contains the versioned manifests, lockfile when needed, generated
docs and `.changeset/release.json`. That record identifies the reviewed `main`
base SHA, consumed changesets and intended package versions and tags. CI checks
the record, generated docs and versions against that exact base. It also checks
versions against existing tags and published releases. Consumer code and unrelated
changes are not allowed in the release PR. If new feature work reaches `main`
while the release PR is open, its checks must run against the new base before
merge. The release App has no review or branch-protection bypass.

Maintainers review the calculated versions, summaries, migration guidance and
date before merging the release PR. A date correction changes all new changelog
and upgrade-index entries together; CI regenerates the expected documents using
that date. Summaries and migration steps come from feature changesets, not from
manual edits to the generated release notes.

## Repository protections

The release flow depends on repository rules requiring reviewed, up-to-date PRs
and the `Pull request` check on `main` (or an equivalent merge queue). Without
those rules, a failing or stale check alone does not prevent a merge. The App is
not intended to bypass these protections. GitHub rules, unlike the workflow code,
must be verified in repository settings before activation.

The publisher checks that each tag points to the merged `main` commit and
rechecks it during publication. These checks detect movement but cannot stop
another actor moving a tag between checks. At cutover, separate admin-managed
rulesets for `toolkit-v*` and `react-v*` provide the preventive control: one
restricts creation to the release App; the other restricts updates and deletion
without routine bypasses, including for the App. The rules stay separate because
an App bypass on a combined ruleset would also permit tag mutation. Before
cutover, maintainers need tag-creation access for the existing publisher. The
workflows do not configure or audit the rulesets. See
[GitHub tag rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

GitHub release immutability is a separate repository setting. If enabled, it
locks assets and tags of future published releases while leaving titles and
notes editable. The publisher uploads and verifies all assets while each
release is still a draft. See
[GitHub's immutable releases guidance](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases).

## App and activation state

The dedicated release App has Contents and Pull requests write permissions on
this repository. It has no branch-protection bypass or workflow administration
access. Its client ID and slug come from `RELEASE_APP_CLIENT_ID` and
`RELEASE_APP_SLUG`; its private key is held in the `RELEASE_APP_PRIVATE_KEY`
Actions secret. The workflows check that the minted token belongs to the
configured App and scope it to this repository. Release PR CI identifies the App
by its author identity and `main` base, not by a label or branch name. The
repository's normal review and checks still apply.

The workflows start only when their repository variables are `true`. The intended
cutover keeps those flags unset until the production App, branch and tag rules,
published baseline, and Slack destination are ready; the flags do not verify
those external settings. While `RELEASE_PR_AUTOMATION_ENABLED` is not `true`,
feature PRs can collect changesets without an automatic release PR.
`RELEASE_PUBLISH_AUTOMATION_ENABLED` separately controls publication after a
release PR merges. The two workflows do not use Changesets' npm publishing or
default tag commands; packages are distributed as
GitHub release assets. The App credential is available to trusted workflows on
`main`, so changes to those workflows and release scripts need normal PR review.

## Publication before and after cutover

Before automatic publication is enabled, merging the release PR leaves the
generated changelog, upgrade index and versions on `main` but does not publish
them. A maintainer checks the merged SHA and package manifests, then pushes a
canonical `toolkit-v<version>` or `react-v<version>` tag at that SHA. Each tag
starts the existing single-package publisher. Legacy `v*` tags are historical
and do not trigger it. Packages released together use the same merged SHA, but
each tag has its own publication run.

With `RELEASE_PUBLISH_AUTOMATION_ENABLED=true`, the tag-triggered publisher is
disabled. Merging a reviewed, App-owned `changeset-release/main` PR starts
`Publish merged release` instead. It verifies the PR's author, repository, branch
and actual merged SHA, including merge or squash commits, then checks out that
commit. It revalidates the release record, manifests and generated docs from
the recorded base through the merge. Only the packages in the record get tags
and releases; unchanged package versions are not republished. Both publishers
share a non-cancelling concurrency group. Neither has a separate environment
approval. A reviewed release-PR merge is the publication decision after cutover.

Production cutover depends on a published baseline, the dedicated App, required
`main` checks, tag protections and the Slack webhook destination. The sandbox
rehearsal exercised the App, paired and package-only releases, inspected resume
and announcements, but production configuration still needs administrator
verification. Local tests alone do not establish GitHub or Slack permissions.

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

## Slack announcement

After a successful automatic publication run, `Announce verified release in
Slack` reads its completed `publication-state.json` artifact. It rechecks the
merged release SHA, package manifests, public tags and releases, then reads the
summaries from that SHA's changelog. One message covers the verified batch, not
each tag separately. The heading begins with 📣.

The message text is sent as `announcement`. Separate fields carry
`release_type` (`toolkit`, `react` or `both`) and the changelog, upgrade-guide,
toolkit-release and React-release URLs. The Slack workflow renders those URLs
with short link labels. For a package-only release, the unused package URL points
to the repository's releases page. The destination is set by the
`SLACK_RELEASE_WORKFLOW_WEBHOOK_URL` Actions secret, not by a URL in the repo.

The announcement is downstream of publication: a Slack failure does not roll
back a GitHub release. The workflow saves an acceptance, rejection or unknown
submission state without recording the webhook URL or message. An uncertain
outcome needs channel inspection before another attempt. Manual dispatch can
announce an earlier verified publication run only with its run ID and an
explicit inspection confirmation.

## Operational checks and recovery

Local validation commands, the generated-document contract, inspected recovery,
and post-publication checks are in [release operations](release-operations.md).
The workflows perform the routine checks and asset verification; maintainers
handle uncertain publication outcomes and consumer smoke checks.
