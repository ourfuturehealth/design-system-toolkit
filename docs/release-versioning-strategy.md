# Release Versioning Strategy

## Purpose

This document defines the release versioning model after the monorepo refactor in `v4.0.0`.

- Tag naming conventions
- Package versioning rules
- Consumer-facing compatibility expectations

For operational release steps, checks, and troubleshooting, use [Release Process](./release-process.md).
For consumer migration instructions, use [Upgrading Guide](../UPGRADING.md).

## Context: Single Package to Monorepo

### Before `v3.4.3` and earlier

- One package: toolkit only
- One tag pattern: `v*` (for example `v3.4.3`)
- Install string pointed to repository root package

### After `v4.0.0`

- Multiple distributable packages in one repository
- Independent versioning per package
- Package-specific tag patterns
- Install strings must include the package subdirectory

## Canonical Tag Patterns

| Package                             | Canonical tag pattern | Example tag      | Install reference                         |
| ----------------------------------- | --------------------- | ---------------- | ----------------------------------------- |
| `@ourfuturehealth/toolkit`          | `toolkit-v*`          | `toolkit-v4.1.0` | `#toolkit-v4.1.0:packages/toolkit`        |
| `@ourfuturehealth/react-components` | `react-v*`            | `react-v0.0.1`   | `#react-v0.0.1:packages/react-components` |

### Legacy compatibility

The release workflow still accepts legacy toolkit tags in the `v*` format for backward compatibility, but new releases should use `toolkit-v*`.

## Versioning Rules

### Independent package versioning

- Toolkit and React components are versioned independently.
- `site` and workspace root are not versioned for distribution.

### Semver baseline

- `PATCH`: bug fixes
- `MINOR`: backward-compatible features
- `MAJOR`: breaking changes

## Consumer Compatibility Model

### Projects pinned to pre-monorepo tags (`v3.4.x`)

No immediate action required. Git tags are immutable and continue to resolve to the pre-monorepo toolkit.

### Projects adopting monorepo releases (`v4+`)

Consumers must use package-scoped install syntax with subdirectory suffix:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.1.0:packages/toolkit"
  }
}
```

## Version Correlation Table

This table is a visual aid for pre-monorepo vs post-monorepo release identification.

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

## Release Output Expectations

- Toolkit releases include toolkit zip artifact and source archive.
- React releases include source archive and built package artifacts from release workflow.
- Auto-generated GitHub source archives always contain the full monorepo.

## References

- [Release Process](./release-process.md)
- [Upgrading Guide](../UPGRADING.md)
- [Changelog](../CHANGELOG.md)
- [Release workflow](../.github/workflows/release.yml)
