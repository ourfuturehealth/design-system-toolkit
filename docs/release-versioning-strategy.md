# Release Versioning Strategy

## Purpose

This document defines the version, tag and artifact contract for the toolkit and
React packages. The monorepo began releasing them separately with
`toolkit-v4.0.0` and `react-v0.0.1`.

For the Changesets lifecycle from feature PR to publication, see
[Release Process](./release-process.md). For validation and recovery procedures,
see [Release Operations](./release-operations.md). Consumer migration guidance
is in the [Upgrading Guide](../UPGRADING.md).

## Monorepo Release Model

### Through `v3.4.2`

- The repository root was the single distributable toolkit package.
- Releases used `v*` tags, such as `v3.4.2`.

### From `toolkit-v4.0.0` and `react-v0.0.1`

- Toolkit and React components are separate, independently versioned packages.
- Package-manager consumers install the package's GitHub release tarball rather
  than a git subdirectory. Toolkit also has a compiled-file ZIP.
- Each package has its own release tag prefix.

## Version Bumps

Feature PRs record release intent in a changeset for every affected public
package. Use `patch` for compatible fixes, `minor` for compatible additions and
`major` for breaking consumer changes. React follows the same rule while its
version is below 1.0; a major bump from a `0.x` release moves it to `1.0.0`.

Changesets calculates each package's next version in the reviewed release PR.
Contributors do not change package versions in feature PRs. Shared styles or
assets can affect both packages, so both must be named when both change for
consumers. See the [changeset format](../.changeset/README.md) for the required
summary and consumer guidance.

## Canonical Tag Patterns

| Package                             | Canonical tag pattern | Example tag      |
| ----------------------------------- | --------------------- | ---------------- |
| `@ourfuturehealth/toolkit`          | `toolkit-v*`          | `toolkit-v4.0.0` |
| `@ourfuturehealth/react-components` | `react-v*`            | `react-v0.0.1`   |

Legacy toolkit `v*` tags remain in the repository as historical references.
New releases use the package-specific prefixes above.

## Release Artifact Contract

Each new package-prefixed GitHub release includes an installable tarball for
the package named by its tag.

| Package                             | Release asset pattern                            | Consumer install reference |
| ----------------------------------- | ------------------------------------------------ | -------------------------- |
| `@ourfuturehealth/toolkit`          | `ourfuturehealth-toolkit-{version}.tgz`          | `https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v{version}/ourfuturehealth-toolkit-{version}.tgz` |
| `@ourfuturehealth/react-components` | `ourfuturehealth-react-components-{version}.tgz` | `https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v{version}/ourfuturehealth-react-components-{version}.tgz` |

Toolkit releases also include `ofh-design-system-toolkit-{version}.zip` for
consumers of prebuilt CSS, JavaScript and assets. The ZIP does not replace the
tarball for Sass, JavaScript module or Nunjucks imports. See
[installing compiled files](./installation/installing-compiled.md).

## Consumer Installation and Migration

Projects pinned to pre-monorepo `v3.4.x` tags can keep using those historical
versions. Moving to a package-prefixed release is a separate dependency update;
the monorepo change alone does not require an immediate migration.

For current releases, package-manager consumers use the versioned tarball URL
in the table above. Toolkit compiled-file consumers can use its ZIP instead.
See [toolkit installation](./installation/installing-with-npm.md) and
[React component installation](./consuming-react-components.md) for package
examples. The tarball install path is smoke-tested with Yarn 1, npm and pnpm.

## Testing an Unreleased Branch in a Consumer

To test a feature branch before publication, check out that branch in this
monorepo, build the affected package and pack it with
`npm pack --ignore-scripts`. Temporarily install the resulting local `.tgz` in
the consumer application and run its checks. Build before packing because
`--ignore-scripts` skips the package's build scripts. Restore the consumer's
published dependency and lockfile after the test. Do not commit a branch URL or
local-file path as a release dependency. The package-specific commands are in
the [toolkit](./installation/installing-with-npm.md#unreleased-maintainer-testing)
and [React](./consuming-react-components.md#unreleased-maintainer-testing)
installation guides.

## Tag History Examples

These published tags show the transition from one root package to independent
package releases. They do not form a shared version sequence.

| Release tag      | Package                             | Version | Repository model |
| ---------------- | ----------------------------------- | ------- | ---------------- |
| `v3.4.2`         | `ofh-design-system-toolkit`         | `3.4.2` | Single package   |
| `toolkit-v4.0.0` | `@ourfuturehealth/toolkit`          | `4.0.0` | Monorepo         |
| `react-v0.0.1`   | `@ourfuturehealth/react-components` | `0.0.1` | Monorepo         |

## References

- [Release Process](./release-process.md)
- [Release Operations](./release-operations.md)
- [Upgrading Guide](../UPGRADING.md)
- [Changelog](../CHANGELOG.md)
