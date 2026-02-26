# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

We are following [Semantic Versioning](https://semver.org/spec/v2.0.0.html), as close as we can.

## Monorepo Package Releases (`toolkit-v*`, `react-v*`)

### 2026-02-26

#### @ourfuturehealth/toolkit 4.1.0 (`toolkit-v4.1.0`)

##### ⚠️ BREAKING CHANGES (from toolkit `4.0.0`)

- Added a new spacing point: `1 => 2px`
- Shifted previous non-zero spacing indices by `+1`
- Affected APIs/usages:
  - `ofh-spacing(...)`
  - `ofh-responsive-margin(...)` / `ofh-responsive-padding(...)`
  - spacing utility classes: `ofh-u-margin-*`, `ofh-u-padding-*`
- Static token rename alignment:
  - Removed: `$ofh-color-background-brand-blue-navy-inverted`
  - Added: `$ofh-color-background-brand-blue-navy-1`, `$ofh-color-background-brand-blue-navy-2`

##### Added

- Figma-aligned token architecture in core settings:
  - `_tokens-core.scss`
  - `_tokens-breakpoint.scss`
  - `_tokens-static.scss`
  - `_tokens-theme.scss`
- New toolkit theme entrypoints:
  - `ofh-participant.scss`
  - `ofh-research.scss`
- Token-based spacing/typography utilities aligned to the new model.

##### Changed

- Broad code/design alignment across toolkit and site styles to match updated design tokens.
- Updated typography usage to semantic scale keys (for example `h1`, `h2`, `lead`, `paragraph`).
- Updated spacing documentation/examples to reflect the new spacing scale (including `2px` point).
- Updated migration guidance for spacing index shift and v4.1.0 applicability.
- Refined release-versioning strategy to focus on monorepo versioning model.
- Added release communication notes/template to release process documentation.

##### Removed

- Legacy toolkit settings files replaced by token model:
  - `_colours.scss`
  - `_globals.scss`
  - `_spacing.scss`
  - `_typography.scss`
  - `_tokens-colours.scss`
- Semantic token bridge/audit artifacts:
  - `packages/toolkit/core/settings/_tokens-semantic.scss`
  - semantic import from `packages/toolkit/core/settings/_all.scss`
  - `docs/tokens-semantic-audit.md`
  - `scripts/generate-tokens-semantic-audit.mjs`
  - root `audit:tokens-semantic` script

##### Fixed

- Restored docs-site Sass watch/live reload reliability.
- Updated release workflow and docs consistency around package-prefixed tag usage.

##### Migration Guide

See [docs/monorepo-migration-guide.md](/docs/monorepo-migration-guide.md) for detailed migration instructions, including spacing index shift mappings introduced in toolkit `4.1.0`.

#### @ourfuturehealth/react-components 0.1.0 (`react-v0.1.0`)

##### Added

- Theme-aware stylesheet exports:
  - `@ourfuturehealth/react-components/styles/participant`
  - `@ourfuturehealth/react-components/styles/research`

##### Changed

- Kept `@ourfuturehealth/react-components/styles` as a backward-compatible alias to participant styles.
- Added multi-theme build flow via `scripts/build-themes.mjs` and Vite theme mode.
- Updated lint/test scripts and package documentation for monorepo git-tag installation and theme style usage.

### 2026-02-25

#### @ourfuturehealth/toolkit 4.0.0 (`toolkit-v4.0.0`)

##### ⚠️ BREAKING CHANGES

Projects must update installation syntax to specify package name and subdirectory.

Before (`v3.4.3` and earlier):

```json
{
  "dependencies": {
    "ofh-design-system-toolkit": "github:ourfuturehealth/design-system-toolkit#v3.4.2"
  }
}
```

After (monorepo):

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit"
  }
}
```

##### Added

- Monorepo package structure with independent versioning
- `prepare` script for automatic building when installed from git
- Package metadata for monorepo subdirectory installation

##### Changed

- All toolkit files moved from repository root to `packages/toolkit/`
- Package name changed: `ofh-design-system-toolkit` → `@ourfuturehealth/toolkit`
- Release tag format changed to package-prefixed tags (`toolkit-v*`, `react-v*`)

#### @ourfuturehealth/react-components 0.0.1 (`react-v0.0.1`)

##### Added

- New package: React component library
- Initial components: `Button`, `TextInput`
- TypeScript support, Storybook integration, and Vitest setup

#### Monorepo/Docs (no package tag)

- Documentation site moved to `packages/site`
- Example consumer app added at `packages/example-react-consumer-app`
- Turborepo and pnpm workspace tooling introduced
- Installation, migration, and release docs updated for monorepo structure

---

## Legacy Single-Package Releases (`v*`)

## [v3.4.3] - 2026-02-23

### Removed

- Ran `npm audit fix` which fixed vulnerability in minimatch subdependencies
- Needed an override a subdependency editorconfig@1.0.4 which still required a vulnerable version

## [v3.4.2] - 2025-11-28

### Removed

- Removed unused dependencies: `minimist`, `wait-on`
- Removing `wait-on` fixes [high vulnerability](https://github.com/axios/axios/security/advisories/GHSA-4hjh-wcwx-xvwj) from axios subdependency

## [v3.4.1] - 2025-07-10

### Changed

- Update light variant link's offset
- Remove prelease tag

## [v3.4.0] - 2025-07-10

### Changed

- Add light variant of link
- Remove alpha from versioning

## [v3.3.0-alpha.1] - 2025-06-27

### Changed

- Updated Node version to 22
- various styling fixes
- stylelinting
- removed box shadow of menu toggle focus state

### Security

- fixed moderate security vulnerability in postcss by upgrading stylelint

## [v3.2.0-alpha.1] - 2025-02-19

### Changed

- Updated focus styling of components to use visible outline to improve accessibility.

## [v3.1.0-alpha.1] - 2025-02-13

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
- Renamed the prefix for _all_ CSS class names from `nhsuk-` to `ofh-`.

## [v2.0.0-alpha.0] - 2022-07-20

Initial alpha (but not released as an NPM package, yet).
