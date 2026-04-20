# Release Versioning Strategy

## Purpose

This document defines the release model after the monorepo refactor in `v4.0.0`.

- tag naming conventions
- package versioning rules
- release artifact expectations
- consumer-facing install contract

For operational release steps, checks, and troubleshooting, use [Release Process](./release-process.md).
For consumer migration instructions, use [Upgrading Guide](../UPGRADING.md).

## Monorepo Release Model

### Before `v3.4.2` and earlier

- One distributable package: toolkit only
- One tag pattern: `v*` such as `v3.4.2`
- Consumers installed the repository root package directly

### From `v4.0.0` onward

- Multiple distributable packages live in one repository
- Toolkit and React components are versioned independently
- Consumers install packaged release artifacts, not git subdirectories
- Canonical tag patterns are package-specific

## Canonical Tag Patterns

| Package                             | Canonical tag pattern | Example tag      |
| ----------------------------------- | --------------------- | ---------------- |
| `@ourfuturehealth/toolkit`          | `toolkit-v*`          | `toolkit-v4.11.0` |
| `@ourfuturehealth/react-components` | `react-v*`            | `react-v0.10.0`  |

The release workflow still accepts legacy toolkit tags in the `v*` format for backward compatibility, but new toolkit releases should use `toolkit-v*`.

## Release Artifact Contract

Each GitHub release must publish an installable tarball for the released package.

| Package                             | Release asset pattern                            | Consumer install reference |
| ----------------------------------- | ------------------------------------------------ | -------------------------- |
| `@ourfuturehealth/toolkit`          | `ourfuturehealth-toolkit-{version}.tgz`          | `https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v{version}/ourfuturehealth-toolkit-{version}.tgz` |
| `@ourfuturehealth/react-components` | `ourfuturehealth-react-components-{version}.tgz` | `https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v{version}/ourfuturehealth-react-components-{version}.tgz` |

Toolkit releases also publish `ofh-design-system-toolkit-{version}.zip` for compiled-file consumers. The `.zip` is not the package-manager install path and does not replace the tarball for Sass, JavaScript module, or Nunjucks consumers.

## Consumer Compatibility Model

### Projects pinned to pre-monorepo tags (`v3.4.x`)

No immediate action is required. Git tags are immutable and continue to resolve to the pre-monorepo toolkit package.

### Projects adopting monorepo releases (`v4+`)

Consumers must install the package release tarball:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v4.11.0/ourfuturehealth-toolkit-4.11.0.tgz"
  }
}
```

React consumers follow the same contract:

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v0.10.0/ourfuturehealth-react-components-0.10.0.tgz"
  }
}
```

This contract is supported and smoke-tested against Yarn 1, npm, and pnpm.

## Unreleased Maintainer Testing

Do not document or recommend branch installs or the old git-subdirectory install syntax for consumers.

For unreleased maintainer testing:

1. Build the package locally.
2. Pack it with `npm pack --ignore-scripts`.
3. Install the local tarball into the consumer application.

Toolkit example:

```bash
pnpm --filter=@ourfuturehealth/toolkit run zip
npm pack ./packages/toolkit --ignore-scripts
```

React example:

```bash
pnpm --filter=@ourfuturehealth/react-components run build
npm pack ./packages/react-components --ignore-scripts
```

## Version Correlation Table

This table is a visual aid for pre-monorepo versus post-monorepo releases.

| Order | Release tag      | Toolkit version | React version | Repo model     | Status                 |
| ----- | ---------------- | --------------- | ------------- | -------------- | ---------------------- |
| 1     | `v3.4.0`         | `3.4.0`         | N/A           | Single package | Released               |
| 2     | `v3.4.1`         | `3.4.1`         | N/A           | Single package | Released               |
| 3     | `v3.4.2`         | `3.4.2`         | N/A           | Single package | Released               |
| 4     | `toolkit-v4.0.0` | `4.0.0`         | N/A           | Monorepo       | Released               |
| 5     | `react-v0.0.1`   | N/A             | `0.0.1`       | Monorepo       | Released               |
| 6     | `toolkit-v4.1.0` | `4.1.0`         | N/A           | Monorepo       | Released               |
| 7     | `react-v0.1.0`   | N/A             | `0.1.0`       | Monorepo       | Released               |
| 8     | `toolkit-v4.2.0` | `4.2.0`         | N/A           | Monorepo       | Released               |
| 9     | `toolkit-v4.3.0` | `4.3.0`         | N/A           | Monorepo       | Released               |
| 10    | `react-v0.2.0`   | N/A             | `0.2.0`       | Monorepo       | Released               |
| 11    | `toolkit-v4.4.0` | `4.4.0`         | N/A           | Monorepo       | Released               |
| 12    | `react-v0.3.0`   | N/A             | `0.3.0`       | Monorepo       | Released               |
| 13    | `toolkit-v4.5.0` | `4.5.0`         | N/A           | Monorepo       | Released               |
| 14    | `toolkit-v4.6.0` | `4.6.0`         | N/A           | Monorepo       | Released               |
| 15    | `react-v0.4.0`   | N/A             | `0.4.0`       | Monorepo       | Released               |
| 16    | `toolkit-v4.7.0` | `4.7.0`         | N/A           | Monorepo       | Released               |
| 17    | `react-v0.5.0`   | N/A             | `0.5.0`       | Monorepo       | Released               |
| 18    | `toolkit-v4.8.0` | `4.8.0`         | N/A           | Monorepo       | Released               |
| 19    | `react-v0.6.0`   | N/A             | `0.6.0`       | Monorepo       | Released               |
| 20    | `toolkit-v4.9.0` | `4.9.0`         | N/A           | Monorepo       | Released               |
| 21    | `react-v0.7.0`   | N/A             | `0.7.0`       | Monorepo       | Released               |
| 22    | `toolkit-v4.10.0` | `4.10.0`       | N/A           | Monorepo       | Released               |
| 23    | `react-v0.9.0`    | N/A            | `0.9.0`       | Monorepo       | Released               |
| 24    | `toolkit-v4.11.0` | `4.11.0`       | N/A           | Monorepo       | Released               |
| 25    | `react-v0.10.0`   | N/A            | `0.10.0`      | Monorepo       | Released               |

## References

- [Release Process](./release-process.md)
- [Upgrading Guide](../UPGRADING.md)
- [Changelog](../CHANGELOG.md)
- [Release workflow](../.github/workflows/release.yml)
