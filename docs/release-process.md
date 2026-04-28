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
- the release section in the pull request template is filled in

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

### 3. Select release intent in the pull request

Every pull request includes a release section:

```md
## Release

- [ ] No package release
- [ ] Release toolkit
- [ ] Release React components
```

Select:

- `No package release` when no package artifacts should be published
- `Release toolkit` when `packages/toolkit/package.json` is bumped
- `Release React components` when `packages/react-components/package.json` is bumped
- both package release checkboxes when both package manifests are bumped

The automated PR check fails if a package version changes without the matching release checkbox, if a release checkbox is selected without a package version change, if the candidate tag already exists, or if [CHANGELOG.md](../CHANGELOG.md) does not mention the candidate tag.

### 4. Open and merge the pull request

Open a pull request into `main` with the package version, changelog, and migration documentation changes. Use the release checkboxes in the pull request body to declare whether the PR should release toolkit, React components, both packages, or no package artifacts.

Before merging:

- confirm the release-intent PR check passes
- confirm the normal pull request checks pass
- confirm the candidate tag does not already exist

Merge the pull request through the normal repository process. Do not push release commits directly to `main`, and do not create release tags locally for the normal release path.

After the pull request is merged, the **Automated release** workflow runs on `main`. Maintainers do not create the release tag manually for the normal release path.

### 5. GitHub Actions builds the release

When a release-intent pull request is merged, [.github/workflows/auto-release.yml](../.github/workflows/auto-release.yml) automatically:

1. installs dependencies with pnpm
2. runs linting and tests
3. builds all packages
4. validates the release-contract docs
5. prepares the package release assets in a dedicated staging directory outside the package tree
6. smoke-tests the tarball with Yarn 1, npm, and pnpm
7. creates the annotated package tag
8. renders release notes with the tarball install URL
9. creates the GitHub release
10. uploads and verifies release assets

The automated workflow never overwrites existing tags, releases, or release assets.

Toolkit releases upload:

- `ourfuturehealth-toolkit-{version}.tgz`
- `ofh-design-system-toolkit-{version}.zip`

React releases upload:

- `ourfuturehealth-react-components-{version}.tgz`

### 6. Verify the release

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

### Dry-run the automated release flow

The **Automated release** workflow has a `workflow_dispatch` dry-run mode for safe end-to-end testing. It creates fake tags such as `auto-release-test-toolkit-v4.13.0-<run-id>`, creates draft prereleases, uploads real staged assets, verifies the assets, and cleans up the test tags and releases unless `keep_test_releases` is selected.

Use this before changing release automation or when validating a repair:

1. open the Actions tab
2. run **Automated release** manually
3. choose `toolkit`, `react-components`, or `all`
4. leave `keep_test_releases` unchecked unless you need to inspect the test release
5. select `send_slack_notification` only when testing the Slack notification path
6. select `force_failure_notification` only when testing the Slack failure notification path

### Slack release notifications

The automated release workflow can send success and failure notifications to Slack through a Slack Workflow Builder webhook. GitHub issues remain the authoritative repair trail for failures; Slack is a non-blocking notification layer.

To configure Slack notifications:

1. create a Slack workflow that starts **From a webhook**
2. add the flat text variables listed below to the webhook trigger
3. add a Slack step that posts those variables to the release channel
4. save the generated webhook URL as the repository secret `SLACK_RELEASE_WORKFLOW_WEBHOOK_URL`

Slack workflow variables:

| Variable | Description |
| -------- | ----------- |
| `status` | `success` or `failure` |
| `environment` | `production` or `dry-run` |
| `repository` | GitHub repository name |
| `summary` | Planned release summary from the workflow |
| `package_summary` | Package, version, and tag lines |
| `candidate_tags` | Comma-separated candidate tags |
| `release_urls` | GitHub release URLs for the tags |
| `workflow_url` | GitHub Actions run URL |
| `pull_request` | Pull request number, title, and URL when available |
| `actor` | Merge owner or workflow actor |
| `commit` | Short commit SHA |
| `failed_gate` | `planning`, `checks`, `publishing`, or `none` |
| `repair_issue_url` | GitHub repair issue URL for failed production auto-releases |

The notification step uses `curl` and does not use a third-party GitHub Action. If `SLACK_RELEASE_WORKFLOW_WEBHOOK_URL` is not configured, the workflow skips Slack notification without failing the release.

To test failure notifications safely, run the dry-run workflow with `send_slack_notification` and `force_failure_notification` selected. The workflow fails before release checks and before any tag or release is created, then posts a Slack failure message with `failed_gate` set to `checks`.

### How release-contract validation stays current

`pnpm docs:release-contract` scans all tracked Markdown, release JavaScript, shell, and workflow files in the repository rather than relying on a narrow hand-maintained file list.

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
It uses the same staged-asset preparation path as the tag-driven release workflow, so PR validation exercises the same artifact handoff that production releases rely on.

For local iteration you can scope this wrapper to one package and one or more package managers:

```bash
./scripts/release/smoke-current-release-artifacts.sh toolkit --managers yarn
./scripts/release/smoke-current-release-artifacts.sh react-components --managers npm,pnpm
```

### Prepare release assets directly

If you need to inspect the exact staged assets before tagging:

```bash
./scripts/release/prepare-release-artifacts.sh toolkit
./scripts/release/prepare-release-artifacts.sh react-components
```

The script prints the package, version, and staged asset paths. Toolkit releases must stage both the versioned `.zip` and the package tarball before the workflow can create or update the GitHub release.

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
- release intent checkboxes that do not match package version changes
- candidate tags or GitHub releases that already exist

On `main` merge failures, the workflow creates or updates a GitHub issue labelled `auto-release` and assigns it to the merge owner when possible.

### Manual release fallback

The normal release path is automated from `main`. Human-pushed release tags are reserved for recovery and exceptional cases through the **Manual release fallback** workflow.

Use the fallback only after confirming the automated path cannot be repaired through a normal follow-up pull request.

Toolkit fallback:

```bash
git fetch origin main --tags
git switch main
git pull --ff-only origin main
git tag -a toolkit-v4.0.1 -m "Release toolkit v4.0.1"
git push origin toolkit-v4.0.1
```

React fallback:

```bash
git fetch origin main --tags
git switch main
git pull --ff-only origin main
git tag -a react-v0.5.1 -m "Release react-components v0.5.1"
git push origin react-v0.5.1
```

The fallback workflow also refuses version/tag mismatches, but it may update an existing GitHub release for a human-pushed tag. Do not use it to overwrite a stale tag. Delete the incorrect remote tag or release intentionally first when that is the repair path.

### Why release assets are staged outside the package tree

The release workflow deliberately copies built assets into a dedicated staging directory before it runs `npm pack`.

This is intentional. CI previously showed the toolkit `createZip` step completing successfully, then failed later when the workflow tried to rediscover the versioned zip from `packages/toolkit/dist/`. Local reproduction did not show the same disappearance, and the local/CI npm versions differed, so the release flow now treats the package working tree as unstable across later packaging steps.

The staged asset copy is the source of truth for:

- tarball smoke testing
- toolkit compiled-file uploads
- release note asset references

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
6. Use the automated release path by default; reserve manual tags for recovery
