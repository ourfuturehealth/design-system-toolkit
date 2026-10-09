# Release process

Packages are distributed through GitHub Releases. Toolkit supplies an installable
`.tgz` and compiled `.zip`; React supplies an installable `.tgz`. Consumers install
the tarball URL. Keep those filenames and the package-manager installation
contract described in [release versioning](release-versioning-strategy.md).

## Recovery first

DSE-447 prepares toolkit `4.26.1` and React `0.26.1` to recover from the defective
`4.26.0` / `0.26.0` releases. These recovery versions are calculated from published
history, rather than the lower package versions merged onto `main` in PR #279.
The changelog records them as unreleased until maintainers finalise publication.

Follow [the recovery runbook](release-recovery.md), including the existing-release
warnings and human screen-reader checks. Preserve defective assets and tags.

## Interim publication safeguards

The recovery workflow still starts from a manually created canonical tag. This is
a transitional step before Changesets release PRs and app-owned tag creation.
Legacy `v*` tags remain historical references; they no longer start new releases.

Before publication:

1. Review and merge the recovery PR into `main`. Finalise its changelog date in
   that PR to the actual planned release date. An `Unreleased` entry blocks publication.
2. Check the merged SHA and package version before creating each canonical tag.
   Publishing the tag to GitHub starts the release workflow, which publishes
   automatically if all release checks pass. There is no separate environment
   approval.
3. Create each new tag at the exact merged commit. Never tag an unmerged branch,
   replace an existing tag, or delete a tag to rerun a release.

The workflow checks that the tag points to the checkout SHA, the commit is on
merged `main`, the manifest agrees, and the version exceeds existing tags and
published releases. It also requires a dated changelog entry and one explicit
upgrade decision for that package version.

It then runs lint, tests, docs checks, and staged artifact checks. It creates a
draft GitHub release, uploads without overwriting assets, downloads the uploaded
files and compares their SHA-256 digests with the staged files, and checks the
remote tag again before publication. Release notes include the reviewed package
summary and upgrade guidance, with source links pinned to the release SHA.

No GitHub `release` environment or additional approver group is required. For
this interim workflow, the reviewed recovery PR and deliberate creation of its
release tags authorise publication. A tag workflow alone cannot prevent an
authorised user from moving a tag afterwards; tag rules remain necessary.

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

`pnpm test:release` tests metadata failures and draft publication with offline
command fixtures. It does not call GitHub, create tags, or publish releases.

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
Until Changesets is introduced, the recovery PR supplies the version/changelog
updates required by this interim gate. Normal feature PRs will use changesets
once the second DSE-447 slice switches the gate to release intent validation.

## Documentation requirements

Keep one root changelog. Each release has a unique, nonempty package/version/tag
section, ordered by decreasing semantic version. Dated sections must descend.
Do not invent releases for intermediate manifest values that were never published.

Every version being released must have one row in the release-decision index in
`UPGRADING.md`: `No consumer action required` or `Action required`. The latter
must link to a migration section with an explicit anchor in that guide.

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

After publication, confirm the expected assets and release notes are visible and
the tags still resolve to the recorded SHA. GitHub tag protection remains necessary.

## Next DSE-447 slices

After recovery establishes a supported published baseline:

1. Changesets records release intent and generates a release PR containing the
   proposed versions, changelog entries, and upgrade decisions. A developer
   reviews the whole release and merges the bot-authored PR under the existing
   branch-protection rules. That merge authorises automatic publication from the
   exact merged SHA, without a second workflow approval. The release app creates
   canonical tags; tag rules restrict creation and prohibit routine modification
   or deletion. Retain this repository's artifact and consumer checks.
2. Generate a reviewed announcement in the release PR and send it to the Slack
   webhook workflow after all planned releases publish successfully. Record
   notification submission separately and investigate ambiguous timeouts before
   resubmitting. These integrations are not enabled by the recovery slice.
