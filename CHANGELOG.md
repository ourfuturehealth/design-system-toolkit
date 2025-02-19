# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Whilst in the alpha phase, we don't yet adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html), but we aim to once stable.

## [Unreleased]

## [v3.2.0-alpha.1] - 2024-02-19

### Changed

- Updated focus styling of components to use visible outline to improve accessibility.

## [v3.1.0-alpha.1] - 2024-02-13

### Changed

- Added Autocomplete component
- Added Character count component

## [v3.0.3-alpha.1] - 2024-06-05

### Changed

- Updated `ofh-date-input__item` styling to include `vertical-align` to prevent date inputs from shifting

## [v3.0.2-alpha.1] - 2024-06-05

### Changed

- Updated `ofh-main-wrapper` styling to ensure the full viewport is used
- Doc site header and footer updates

## [v3.0.1-alpha.1] - 2024-05-17

### Changed

- Added back the original default margin bottom spacing on **button** components
- Updates to the doc site - allowing custom components to be used there without affecting the design system.

## [v3.0.0-alpha.1] - 2024-04-03

### Changed

- Updated the underline thickness and spacing on **button** components

## [v3.0.0-alpha.0] - 2024-04-03

### Added
- **Breaking change**: added new button variations, if your app is using the old button variations, you would have to ensure your app is using the latest button variation classes when updating to this version.

## [v2.0.0-alpha.6] - 2023-12-14

### Added
- Added **black** colour variation to section break typography

## [v2.0.0-alpha.5] - 2023-10-25

### Added
- Added **card with icon** variation of card component

## [v2.0.0-alpha.4] - 2023-09-19

### Added

- Added **extended colour palette** to dev toolkit and docs site
- Added **external link icon**

### Changed

- Update **tag** components to use new colours and spacing
- Updated **colour palette** in dev toolkit and docs site
- Removed content related to NHS Service Manual GitHub
- Content updates to **Layout, Typography and Spacing pages**
- Make side nav sticky on docs site
- Bump nunjucks from 3.2.3 to 3.2.4

### Fixed

- Fixed bugs with copy to clipboard function in design examples
- Fix docs site container size
- Updated colors for side nav links and back link in docs site

## [v2.0.0-alpha.3] - 2022-03-28

### Added

- Design system documentation site (statically generated with [Eleventy](https://eleventy.dev)). The site is based on the [NHS.UK digital service manual](https://github.com/nhsuk/nhsuk-service-manual/).

### Changed

- Updated **label** bottom margin (on all variants) to use non-responsive units and match the **legend** component more closely.
- Added a negative top margin to **hint** components when placed after a **label** `l` or `xl` variant.
- New colour palette and significant updates to the names and usages of the various colour variables.
- Updated breadcrumb link and chevron colours to use a separate set of colours than regular links + updated docs.
- Updated the action link font weight and made the arrow in the icon use the brand dark blue colour.
  - As part of this, removed the `icon-arrow-right-circle.svg` icon as we've now deviated from it and it's not needed as a separate file.
- Removed the serif font from `ofh-body-l` class and moved it into the existing `ofh-lede-text` class.
- Removed the explicit line height for the `.ofh-body-l` class, thus falling back to the default responsive typography styling.
- Reverted the secondary button colour back to the previous grey from the old colour palette (`#425563`).

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
