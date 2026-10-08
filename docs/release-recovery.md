# DSE-447 release recovery

Toolkit `4.26.0` and React `0.26.0` are defective. Their published artifacts,
current tags, and merged manifests disagree. Preserve those releases and assets
as historical evidence, and warn consumers before publishing replacements.

## Warn consumers immediately

A maintainer must edit the two GitHub release pages manually. Keep their existing
notes and assets, prepend the warning, and change the title to start with
`DO NOT USE`. Until replacements are available, use:

> **DO NOT USE THIS RELEASE.** Its published artifacts cannot be reproduced from
> the current tag, and ProgressIndicator can report invalid or inconsistent
> accessible progress. This release is retained for historical reference.
>
> The previous supported baseline is toolkit `4.25.1` and React `0.24.2`; those
> versions do not include ProgressIndicator. Recovery versions `4.26.1` and
> `0.26.1` are being prepared. Follow the repository's upgrading guide when the
> replacements are published.

Once the replacement for each package is published, change that package's title
to `SUPERSEDED / DO NOT USE: <old tag>` and prepend:

> **SUPERSEDED. DO NOT USE THIS RELEASE.** Replace it with the recovery version
> linked below. The old release remains available for historical reference.

Link the toolkit warning to `toolkit-v4.26.1` and the React warning to
`react-v0.26.1`, plus `UPGRADING.md#release-recovery` at the recovery SHA. Do not
describe a replacement as available until its release is actually published.
Warning text cannot prevent direct installation from retained download URLs.

## Before merging recovery

1. Confirm the package manifests contain `4.26.1` and `0.26.1`, both greater than
   the published version history.
2. Review the root changelog, including the explicit unreleased status of React
   `0.25.0`, and review the backfilled upgrade decisions.
3. Run the validation commands in [the release process](release-process.md).
4. Complete the screen-reader checks below and capture the result in the PR.
5. Replace the recovery `### Unreleased` heading with the planned actual release
   date before merging. Recheck metadata and release notes after this edit.

## Human accessibility check

Use the React Storybook builder and equivalent toolkit examples with VoiceOver
or NVDA. Test labelled/unlabelled progress and supporting text:

| Inputs | Visual / accessible expectation |
| ------ | ------------------------------- |
| Step 0, total 8 | Empty track; Page 1 of 8; 0% |
| Step 2, total 8 | Two filled segments; Page 2 of 8; 25% |
| Step 2, total 8, partial 50 | 2.5 filled segments; Page 3 of 8; 31.25% |
| Step 2, total 8, partial 125 | Three filled segments; Page 3 of 8; 37.5% |
| Step 8, total 8, partial 50 | Full track; Page 8 of 8; 100% |
| Step 2, total 4.4 | Four segments, two filled; Page 2 of 4; 50% |

Confirm the accessible name contains the optional label and page count once,
the native percentage agrees with the track, and helper text is readable after
the progress bar. Exact speech varies by screen reader and navigation mode.
Automated checks validate markup, not the spoken result.

## Publish and verify

An administrator must configure the protected `release` environment first.
After the recovery PR merges, use its exact merged SHA for both new canonical
tags. Do not move the old tags to that SHA. Follow the protected interim workflow
in [the release process](release-process.md).

Verify each tag, package manifest, uploaded asset, and GitHub release. Update the
old release warnings with the now-published replacements. Keep DSE-447 open:
Changesets/app-owned tags and Slack workflow delivery are separate remaining
slices, and their external configuration is required before ticket completion.
