# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Whilst in the alpha phase, we don't yet adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html), but we aim to once stable.

## [Unreleased]

### Added

- Design system documentation site (statically generated with [Eleventy](https://eleventy.dev)). The site is based on the [NHS.UK digital service manual](https://github.com/nhsuk/nhsuk-service-manual/).

### Changed

- Updated **label** bottom margin (on all variants) to use non-responsive units and match the **legend** component more closely.
- Added a negative top margin to **hint** components when placed after a **label** `l` or `xl` variant.
- New colours.
- Updated breadcrumb link and chevron colours to use a separate set of colours than regular links + updated docs.
- Updated the action link font weight and made the arrow in the icon use the brand dark blue colour.
  - As part of this, removed the `icon-arrow-right-circle.svg` icon as we've now deviated from it and it's not needed as a separate file.
- Removed the serif font from `ofh-body-l` class and moved it into the existing `ofh-lede-text` class.

## [v2.0.0-alpha.2] - 2022-08-10

### Fixed

- Fix the path for the Our Future Health logo on the docs/examples site.

## [v2.0.0-alpha.1] - 2022-08-10

### Changed

- Output asset files renamed to `ofh-design-system-toolkit.*`.
- All favicons and logos updated to latest Our Future Health branding.
- Renamed the JS and SCSS source entry files to `ofh.*` (note: the build still outputs the compiled files as `ofh-design-system-toolkit.*`).
- Renamed the prefix for *all* CSS class names from `nhsuk-` to `ofh-`.

## [v2.0.0-alpha.0] - 2022-07-20

Initial alpha (but not released as an NPM package, yet).
