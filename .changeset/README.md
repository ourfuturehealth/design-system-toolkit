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
Include packages affected indirectly by shared styles or assets, not only the
package containing the edited source file.

The generator writes `.changeset/release.json` with the exact reviewed base SHA,
consumed changesets and intended package versions/tags. Feature PRs must not
change this record. It identifies the batch to publish after the release PR merges.

Choose `patch` for compatible fixes, `minor` for compatible additions and `major`
for breaking changes in stable packages. React is pre-1.0: use `minor` for breaking
API changes and explain the migration. Changesets uses normal semver arithmetic,
so a React minor changeset after `0.26.1` produces `0.27.0`, not `1.0.0`.

Tests, stories and package README-only edits do not require a release. Public
package source, styles, templates, assets and manifest changes do. Repository
tooling changes outside the public packages do not require a package release.

See [the release process](../docs/release-process.md) for release PR review and
publication. Never run `changeset publish` or `changeset git-tag`: consumers use
GitHub release assets and the canonical `toolkit-v*` / `react-v*` tags.
