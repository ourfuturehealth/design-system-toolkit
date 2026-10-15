# Release intent

Run `pnpm changeset` in a feature branch. Select each affected public package and
its bump type, then edit the generated Markdown file to include these sections:

```md
---
"@ourfuturehealth/toolkit": patch
"@ourfuturehealth/react-components": patch
---

Fix the mobile Header link colour in both packages.

## Consumer action
No consumer action required

## Migration notes
Public APIs remain unchanged. Test your application after updating the package.
```

Use `Action required` when consumers need to change their code or check changed
behaviour. Write the actual steps in `Migration notes`. Use separate changesets
when packages need different instructions. Avoid placeholders and empty changesets.

Review this text as part of the feature PR: it supplies the root changelog,
upgrade index and release notes. Do not bump package versions or add future
release entries to `CHANGELOG.md` / `UPGRADING.md` in a feature PR.

Choose `patch` for compatible fixes, `minor` for compatible additions and `major`
for breaking API changes in either package. This applies while React is pre-1.0:
a major changeset after `0.26.1` produces `1.0.0`. Describe the migration in the
changeset before proposing a breaking release.

Tests, stories and package README-only edits do not require a release. Public
package source, styles, templates, assets and manifest changes do. Repository
tooling changes outside the public packages do not require a package release.

See [the release process](../docs/release-process.md) for release PR review and
publication. Never run `changeset publish` or `changeset git-tag`: consumers use
GitHub release assets and the canonical `toolkit-v*` / `react-v*` tags.
