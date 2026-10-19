# Release operations

Validation and recovery procedures for the [release process](release-process.md).

## Local validation

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
validates Git-aware rules in isolated temporary repositories. It creates local
test commits and tags, and checks manual version skips and missing consumer
guidance. Publication tests simulate GitHub commands; announcement tests use a
synthetic webhook endpoint. Local tests do not prove App authentication, signed
commits, live releases or Slack delivery. Those operations need a rehearsal in
an authorised disposable repository; a production release is not a test.

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

## Recovery

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
