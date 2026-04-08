# Release Process

This document explains how to publish toolkit and React component releases from this repository.
For release tag conventions and versioning context, see [Release Versioning Strategy](./release-versioning-strategy.md).

## Overview

The design system distributes packages through **GitHub Releases**.

- `@ourfuturehealth/toolkit` ships an installable `.tgz` package and a compiled `.zip`
- `@ourfuturehealth/react-components` ships an installable `.tgz` package
- consumers install the package tarball URL, not a git subdirectory

## Prerequisites

- ensure your branch is up to date with `main`
- all tests pass locally: `pnpm test`
- all linting passes locally: `pnpm lint`
- changelog and migration docs are updated when required

## Release Steps

### 1. Decide what to release

Toolkit only:

- changes affect toolkit Sass, JavaScript, templates, or compiled assets
- bump `packages/toolkit/package.json`

React only:

- changes affect React components only
- bump `packages/react-components/package.json`

Both:

- changes affect both packages
- bump both package manifests

### 2. Update versioned files

For the package you are releasing:

- update the package `version` field
- update [CHANGELOG.md](../CHANGELOG.md)
- update [UPGRADING.md](../UPGRADING.md) if the release changes the public API or install contract

### 3. Commit and tag

Toolkit example:

```bash
git add packages/toolkit/package.json CHANGELOG.md UPGRADING.md
git commit -m "chore(toolkit): bump version to 4.0.1"
git push origin main
git tag -a toolkit-v4.0.1 -m "Release toolkit v4.0.1"
git push origin toolkit-v4.0.1
```

React example:

```bash
git add packages/react-components/package.json CHANGELOG.md UPGRADING.md
git commit -m "chore(react-components): bump version to 0.5.1"
git push origin main
git tag -a react-v0.5.1 -m "Release react-components v0.5.1"
git push origin react-v0.5.1
```

### 4. GitHub Actions builds the release

When a release tag is pushed, [.github/workflows/release.yml](../.github/workflows/release.yml) automatically:

1. installs dependencies with pnpm
2. runs linting and tests
3. validates the release-contract docs
4. builds the package being released
5. packs the package with `npm pack --ignore-scripts`
6. smoke-tests the tarball with Yarn 1, npm, and pnpm
7. renders release notes with the tarball install URL
8. creates or updates the GitHub release
9. uploads release assets

Toolkit releases upload:

- `ourfuturehealth-toolkit-{version}.tgz`
- `ofh-design-system-toolkit-{version}.zip`

React releases upload:

- `ourfuturehealth-react-components-{version}.tgz`

### 5. Verify the release

After the workflow completes:

1. check the [GitHub Releases](https://github.com/ourfuturehealth/design-system-toolkit/releases) page
2. confirm the expected `.tgz` asset is attached
3. for toolkit, confirm the `.zip` is also attached
4. verify the release notes show the tarball URL install contract

Toolkit release note example:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v4.0.1/ourfuturehealth-toolkit-4.0.1.tgz"
  }
}
```

React release note example:

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v0.5.1/ourfuturehealth-react-components-0.5.1.tgz"
  }
}
```

## Testing Before Or After Release

### How release-contract validation stays current

`pnpm docs:release-contract` scans all tracked Markdown, shell, and workflow files in the repository rather than relying on a narrow hand-maintained file list.

It validates that:

1. the broken git-subdirectory install syntax does not reappear in tracked docs or release automation
2. the incorrect pre-monorepo baseline does not reappear in tracked docs
3. the generated toolkit and React release notes still emit tarball install URLs

This is intentional: new docs under the normal repository conventions are picked up automatically.

`CHANGELOG.md` is excluded because it is a historical record and can legitimately contain superseded install strings from past releases.

If you add consumer-facing release/install docs in a different file type or move the release-note generator, update both [scripts/release/validate-release-docs.sh](../scripts/release/validate-release-docs.sh) and this section in the same change.

### Smoke test the current branch artifacts

```bash
pnpm docs:release-contract
pnpm smoke:release-artifacts
```

This validates the public docs and then tests the current branch tarballs with Yarn 1, npm, and pnpm.

For local iteration you can scope this wrapper to one package and one or more package managers:

```bash
./scripts/release/smoke-current-release-artifacts.sh toolkit --managers yarn
./scripts/release/smoke-current-release-artifacts.sh react-components --managers npm,pnpm
```

### Test unreleased changes locally in another consumer

Toolkit:

```bash
pnpm --filter=@ourfuturehealth/toolkit run zip
npm pack ./packages/toolkit --ignore-scripts
```

React:

```bash
pnpm --filter=@ourfuturehealth/react-components run build
npm pack ./packages/react-components --ignore-scripts
```

Install the resulting `.tgz` file in the consumer application rather than pointing the consumer at a git branch.

## Troubleshooting

### Release workflow failed

Check the [GitHub Actions tab](https://github.com/ourfuturehealth/design-system-toolkit/actions) and fix the failing step before re-tagging.

Common causes:

- failing tests or linting
- package build failures
- smoke test failures for the tarball install contract
- stale docs or release templates that still mention the old git-subdirectory syntax

### Consumer installation failed

Check that:

- the release has a `.tgz` asset attached
- the dependency points to the release tarball URL
- toolkit consumers use the `.zip` only for compiled-file installs, not package-manager installs

If you are testing unreleased code, build and pack the package locally instead of pointing the consumer at `#main`.

## Best Practices

1. Prefer package-prefixed tags: `toolkit-v*` and `react-v*`
2. Treat the release tarball as the public install contract
3. Keep `.zip` guidance limited to compiled-file toolkit consumers
4. Test every release with Yarn 1, npm, and pnpm before or during the workflow
5. Update migration docs whenever the public API or install path changes
