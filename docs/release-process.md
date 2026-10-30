# Release process

Packages are distributed through GitHub Releases. Toolkit supplies an installable
`.tgz` and compiled `.zip`; React supplies an installable `.tgz`. Consumers install
the tarball URL. Keep those filenames and the package-manager installation
contract described in [release versioning](release-versioning-strategy.md).

## Safeguards

Release PR checks compare the generated files with their exact `main` base SHA.
If `main` changes while a release PR is open, its checks must run against the new
base before merge. The release App does not bypass normal PR review or checks.

The tag-triggered publisher checks that each tag points to merged `main` and
rechecks it during publication. These checks detect tag movement; they cannot
prevent it. A GitHub tag ruleset is the separate preventive control for tag
updates and deletion. Until that ruleset is active, maintainers can still move
tags outside the workflow. [Immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)
protect published assets and their tags, but do not replace pre-publication tag
protection. Titles and notes remain editable so defective releases can be warned.

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
   Before the publication workflow is automated, follow the tag steps below.

## Release PR automation

The dedicated release App writes the generated files to `changeset-release/main`
and creates or updates its PR. The App has Contents and Pull requests write
permissions, but no branch-protection bypass or workflow administration access.
Its short-lived installation token lets the PR trigger normal checks. PR CI
recognises the App's author identity and `main` base, not a label or a chosen
branch name.

The repository variable `RELEASE_PR_AUTOMATION_ENABLED` controls whether this
workflow runs. When it is not `true`, feature PRs can still record changesets,
but no release PR is created automatically. When enabled, the workflow runs on
`main` pushes or manual dispatch on `main`. It does not prepare another release
while a current package version remains unpublished.

Changesets calculates versions; a pinned PR action uses the App token to create
or update a signed release commit and PR. The standard Changesets PR
action expects per-package changelogs, while this repository maintains one root
changelog and an upgrade index. This workflow does not create tags, publish to
npm, or publish GitHub releases. Those remain separate steps.

## Start publication

The release workflow runs when a maintainer pushes a canonical tag:
`toolkit-v<version>` or `react-v<version>`. Legacy `v*` tags are historical
references and do not trigger publication.

Check the merged commit SHA and each package manifest before creating its tag.
Create each tag at that exact SHA, not an interior feature-branch commit. Never
replace an existing tag or delete a tag to rerun a release. Packages released
together use the same merged SHA, but each tag starts its own release run.

Pushing a canonical tag authorises automatic publication if all checks pass.
The workflow has no separate environment approval. The release PR App prepares
versions but does not create or push tags; publication still uses this explicit
maintainer action.

## Automated checks and publication

The workflow checks that the tag points to the checkout SHA, the commit is on
merged `main`, the manifest agrees, and the version exceeds existing tags and
published releases. It also requires a dated changelog entry and one explicit
upgrade decision for that package version.

The validation job runs lint, tests, and docs checks. The build job checks the
staged package in consumer installations, then saves the verified files, release
notes, tag, SHA, and checksums as a workflow artifact. Only the toolkit ZIP check
installs Playwright. The publication job checks the downloaded artifact against
the tag, SHA, and checksums before creating a draft GitHub release. It uploads
without overwriting assets, downloads the uploaded files and compares their
SHA-256 digests with the staged files, and checks the remote tag again before
publication. Release notes include the reviewed package summary and upgrade
guidance, with source links pinned to the release SHA.

The publisher records the SHA-256 digest of each verified uploaded asset in the
job log. A final tag check after publication detects discrepancies; it is not a
publication gate and cannot undo a published release.

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

Passing these tests does not prove GitHub permissions, artifact handoff between
jobs, or live draft creation, upload, download, and publication. Rehearse that
path, including a publish-job rerun, in an explicitly authorised disposable
repository before first use or after changing the release workflow. Never use a
production release as a test.

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
version skips and missing consumer guidance. PR-creation tests replace only the
GitHub CLI response; they do not prove live App authentication, commit signing
or GitHub PR creation.

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

An interrupted draft can resume only when existing assets match the newly staged
bytes. A mismatch or unexpected asset stops the job for maintainer inspection;
it does not replace the asset. Failures reading GitHub state stop the workflow
rather than being interpreted as an absent release.

For a transient failure, use GitHub's **Re-run failed jobs** action. Successful
validation and build jobs do not repeat when only publication fails; the
publication job rechecks the saved artifact and remote tag before resuming.
Inspect an existing release first when the publication outcome is uncertain.

`Publication outcome is unknown` means the publish request failed without a
reliable result. The release may be public even though the command failed.
`Publication completed ... final verification failed` means the publish command
succeeded but the subsequent check failed. That failure may be a network problem
or confirmed tag movement; it does not by itself prove that the assets are wrong.

For either message:

1. Stop automatic reruns and inspect the existing GitHub release's draft/public
   state. Record the expected SHA from the error and the verified asset digests
   from the job log.
2. Check the remote tag against that SHA and download the existing assets to
   compare their SHA-256 digests. If GitHub is unreachable, wait for access before
   deciding whether publication completed.
3. If the release is still draft and the tag and assets match, a maintainer can
   resume the workflow after resolving the failure. If it is public and matches,
   record the verification result in the PR; do not rerun publication. Published
   releases fail both the version-reuse guard and the publisher's overwrite guard.
4. If a public release is defective, retain its tag and assets, add a prominent
   warning, and prepare a superseding version. Never automatically redraft,
   delete, overwrite, or retag it.

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
