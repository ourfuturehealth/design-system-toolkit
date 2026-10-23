# Release process

Packages are distributed through GitHub Releases. Toolkit supplies an installable
`.tgz` and compiled `.zip`; React supplies an installable `.tgz`. Consumers install
the tarball URL. Keep those filenames and the package-manager installation
contract described in [release versioning](release-versioning-strategy.md).

## Repository protections

Before publishing, confirm an active GitHub tag ruleset protects `toolkit-v*` and
`react-v*` against updates and deletion, without routine bypasses. Maintainers
can create canonical tags for the tag-triggered workflow. The workflow's tag
checks detect changes but cannot prevent a tag moving between a check and
publication. These settings require administrator configuration and manual
verification; the workflow does not configure or validate the ruleset.

To protect published assets as well, an administrator can enable release
immutability in repository Settings, under Releases. It applies to future
releases, locks published assets and tags, and still allows edits to titles and
notes. Attach every asset to the draft before publishing. See
[GitHub's immutable releases guidance](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases).

## Prepare and review

1. Update each affected package's version, root changelog entry, and upgrade
   guidance in the PR. The version must exceed that package's existing tags and
   published releases, even if the version on `main` is lower.
2. Run the validation commands below. Review the generated release notes and
   test the affected components in their consuming applications. Complete human
   accessibility checks when changing accessible behaviour; automated markup
   checks do not establish the spoken screen-reader result.
3. Set the changelog entry to the planned actual release date before merging.
   An `Unreleased` entry or a future date blocks publication.
4. Review and merge the PR into `main` under the repository's branch protections.

## Start publication

The release workflow runs when a maintainer pushes a canonical tag:
`toolkit-v<version>` or `react-v<version>`. Legacy `v*` tags are historical
references and do not trigger publication.

Check the merged commit SHA and each package manifest before creating its tag.
Create each tag at that exact SHA, not an interior feature-branch commit. Never
replace an existing tag or delete a tag to rerun a release. Packages released
together use the same merged SHA, but each tag starts its own release run.

Pushing a canonical tag authorises automatic publication if all checks pass.
The workflow has no separate environment approval. Changesets release PRs and
automated tag creation are not configured.

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
./scripts/release/validate-package-release-metadata.sh origin/main WORKTREE
```

PR CI runs metadata, lint, tests, docs, and external-consumer artifact checks.
Package source changes must include a version increase, changelog entry, and
upgrade decision. The metadata guard excludes test, Storybook, and package README
changes from this source-change requirement.

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
