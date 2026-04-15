# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

We are following [Semantic Versioning](https://semver.org/spec/v2.0.0.html), as close as we can.

## Monorepo Package Releases (`toolkit-v*`, `react-v*`)

### 2026-04-15

#### @ourfuturehealth/toolkit 4.13.0 (`toolkit-v4.13.0`)

##### Changed

- Refreshed the toolkit `footer` component to the current design-system treatment, including responsive main/social spacing, optional legal and social sections, and text-only support links by default
- Composed footer support links from the shared `link-icon` pattern so directional and external cues can be enabled with footer data instead of bespoke markup
- Expanded the footer macro, docs page, macro options, and README guidance to cover minimal, icon-led support-link, and legal-plus-social variants while preserving legacy `URL` and `copyright` compatibility

#### @ourfuturehealth/react-components 0.11.0 (`react-v0.11.0`)

##### Added

- First public React `Footer` component with toolkit-parity support links, small print, legal copy, optional social links, and icon-aware footer link items
- Storybook coverage and unit/accessibility tests for default, minimal, icon-led support-link, and legal-plus-social footer variants

##### Changed

- Simplified the React footer Storybook controls so reviewers and consumers can explore curated section toggles and link presets without editing raw nested data structures

### 2026-04-09

#### @ourfuturehealth/toolkit 4.9.0 (`toolkit-v4.9.0`)

##### ⚠️ BREAKING CHANGES

- **Icon naming aligned with Figma**: hard-renamed the public toolkit icon names to the current design-system set with no backward-compatible aliases
  - `Done` → `Check`
  - `ExpandLess` → `ChevronUp`
  - `ExpandMore` → `ChevronDown`
  - `CalendarTodayOutlined` → `CalendarOutline`
  - `FmdGoodOutlined` → `LocationOutline`
  - `HospitalOutlined` → `HospitalOutline`
  - see [UPGRADING.md](UPGRADING.md#upgrading-to-v490--react-v070) for the full rename table

##### Changed

- Renamed the toolkit icon SVG files, manifest entries, sprite symbols, docs gallery entries, and current component/example usages to the Figma-aligned public names
- Folded the earlier circle-outline addition into the renamed public surface as `AddCircleOutline` and `MinusCircleOutline`
- Updated the icon docs page and contributor guidance to reflect the renamed toolkit and React icon APIs

#### @ourfuturehealth/react-components 0.7.0 (`react-v0.7.0`)

##### ⚠️ BREAKING CHANGES

- **React Icon names aligned with toolkit/Figma**: any React consumer using the old `Icon` names must migrate to the renamed public set
  - `Done` → `Check`
  - `AccessTime` → `ClockOutline`
  - `LinkedIn` → `Linkedin`
  - `HospitalOutlined` → `HospitalOutline`
  - see [UPGRADING.md](UPGRADING.md#upgrading-to-v490--react-v070) for the full rename table

##### Changed

- Updated the public React `Icon` stories/tests and current component consumers to use the renamed icon surface

### 2026-03-30

#### @ourfuturehealth/toolkit 4.8.0 (`toolkit-v4.8.0`)

##### Added

- First-class toolkit docs for the `icon` component, including fixed-size, responsive-size, and titled examples
- Expanded docs-site examples for input-family components including autocomplete, date input, and select
- First-class toolkit docs for the `fieldset` component

##### Changed

- Refreshed the input family to the current Figma and token model across:
  - fieldset
  - text input
  - textarea
  - select
  - date input
  - autocomplete
  - character count
  - checkboxes
  - radios
- Updated shared input-family spacing, padding, state treatment, and fixed-width sizing
- Added responsive icon sizing support to the toolkit icon API
- Corrected input-family docs parity and README guidance after the refresh

#### @ourfuturehealth/react-components 0.6.0 (`react-v0.6.0`)

##### Added

- First full public React input-family release, including:
  - `TextInput`
  - `Autocomplete`
  - `CharacterCount`
  - `Checkboxes`
  - `DateInput`
  - `Radios`
  - `Select`
  - `Textarea`
- New public `Fieldset` component for grouped form questions and legends
- New public `Icon` component with fixed and responsive sizing support
- Storybook coverage and unit/accessibility tests for the input family and `Icon`

##### Changed

- `TextInput` is now the production React implementation and matches the toolkit input-family structure and public API more closely
- Any earlier local usage of the prototype `TextInput` should align to the released props such as `errorMessage`, `inputWidth`, `describedBy`, and `isPageHeading`
- Replaced internal React icon helpers with the public `Icon` component in input and Card consumers
- Refined Storybook docs and examples so the input family is easier to review and matches the docs site more closely
- Fixed grouped-control docs-page collisions by isolating story `id` / `name` values where needed

### 2026-03-25

#### @ourfuturehealth/toolkit 4.7.0 (`toolkit-v4.7.0`)

##### Added

- Dedicated `card-callout` and `card-do-dont` toolkit components aligned to the current Card family structure
- Dismissible-with-image Card examples in the docs site and examples index
- Responsive `gap-x`, `gap-y`, and `gap` spacing helpers for flex/grid component work

##### Changed

- Realigned the base `card` component to the current Figma structure across basic, dismissible, clickable, clickable-action, clickable-numeric, and icon-led variants
- Updated the Card family after the v4.5.0 spacing and typography hard cut, including responsive token alignment and shared labelled-panel spacing
- Aligned the dismissible Card hit-zone with the latest Figma corner-target model
- Updated Card trailing icons to be neutral by default and support an explicit colour override for monochrome icons
- Preserved legacy toolkit APIs such as `warningCallout()`, `list()`, and old Card inputs as deprecated compatibility paths for existing consumers
- Updated Card-family documentation and examples to prefer the new Card family macros and options
- Refined Card-family docs clarity across site docs, macro options, toolkit READMEs, and Storybook-facing guidance

#### @ourfuturehealth/react-components 0.5.0 (`react-v0.5.0`)

##### Added

- New Card family components using the current API only:
  - `Card`
  - `CardCallout`
  - `CardDoDont`
- Storybook coverage for base Card variants, Card / Callout, and Card / Do & Don’t
- Unit and accessibility coverage for the Card family

##### Changed

- Bundled the toolkit icon sprite for React and Storybook consumers so Card icons render without a separately hosted `/assets/icons/icon-sprite.svg`
- Refined Card-family Storybook docs, controls behaviour, and examples for easier manual QA
- Updated Card icon stories to expose glyph and colour controls that match the current component behavior

### 2026-03-24

#### @ourfuturehealth/toolkit 4.6.0 (`toolkit-v4.6.0`)

##### ⚠️ BREAKING CHANGES

- Tag defaults now align with Figma:
  - `.ofh-tag` now renders the neutral style by default
  - `.ofh-tag--grey` is deprecated in favour of `.ofh-tag--neutral`
  - consumers that relied on the old blue default should move to `.ofh-tag.ofh-tag--blue`
  - see [Upgrading Guide](UPGRADING.md#upgrading-to-v460--react-v040) for migration steps

##### Added

- New `ofh-tag--brand` modifier aligned with the OFH Tag component in Figma
- Canonical `ofh-tag--neutral` naming for the neutral tag variant

##### Changed

- Updated Tag typography, spacing, and colour tokens to match the current design spec on top of the v4.5.0 spacing/typography hard cut
- Refreshed toolkit Tag documentation, examples, and design-system guidance to use the supported Tag variants
- Preserved docs-site beta banner and example callout styling after the neutral default change

#### @ourfuturehealth/react-components 0.4.0 (`react-v0.4.0`)

##### Added

- New `Tag` component with a semantic React API based on `variant` and `children`
- Storybook coverage for default, variant showcase, and usage-example Tag stories
- Unit and accessibility coverage for variant mapping, children rendering, passthrough props, and ref support

### 2026-03-19

#### @ourfuturehealth/toolkit 4.5.0 (`toolkit-v4.5.0`)

##### ⚠️ BREAKING CHANGES

- **Spacing API hard cut to Figma-aligned size keys**
  - Removed `ofh-spacing(...)`
  - `ofh-responsive-margin(...)` and `ofh-responsive-padding(...)` now take spacing size keys directly
  - Spacing utility classes now use spacing size keys as their suffixes
  - See [UPGRADING.md](UPGRADING.md#upgrading-to-v450) for migration details

##### Changed

- Replaced legacy point-based spacing usage across toolkit and site source with `$ofh-size-*` tokens and Figma-aligned responsive spacing keys
- Removed legacy spacing helper compatibility and legacy point-based spacing utility generation
- Replaced direct typography alias usage across toolkit and site source with Figma-aligned typography keys such as `heading-lg`, `paragraph-md`, and `list-sm`
- Renamed the direct heading class surface from `.ofh-heading-l/.m/.s` to `.ofh-heading-lg/.md/.sm`
- Updated spacing documentation and examples to teach the horizontal and vertical responsive spacing scales directly
- Updated typography documentation and examples to teach the Figma-aligned direct heading classes and mixin keys, while keeping numeric responsive font-size override utilities for consumers and replacing `ofh-u-font-size-19` with `ofh-u-font-size-20`

##### Removed

- Direct typography alias support for legacy keys such as `h1`, `lead`, `paragraph`, and `list-small`
- Legacy direct typography utility aliases such as `.ofh-u-font-size-h1`; use numeric override classes such as `.ofh-u-font-size-64` instead

### 2026-03-11

#### @ourfuturehealth/toolkit 4.4.0 (`toolkit-v4.4.0`)

##### Added

- Error Summary `idPrefix` support so multiple summaries on the same page can render unique title ids and `aria-labelledby` values
- Dedicated multiple-errors examples in the site and design-system docs

##### Changed

- Error Summary containers are no longer focusable and are no longer focused on page load; error links still scroll and focus the relevant field
- Updated the toolkit Error Summary JavaScript to enhance every summary instance on the page instead of only the first one
- Error Summary links now resolve nested HTML click targets with `closest('a')`, so HTML-rich link content still scrolls and focuses the correct field
- Expanded toolkit Error Summary documentation and integration coverage for multi-link, multi-summary, and radio / legend behaviour

#### @ourfuturehealth/react-components 0.3.0 (`react-v0.3.0`)

##### Added

- New `ErrorSummary` component with toolkit-parity props and DOM structure:
  - `titleText` / `titleHtml`
  - `descriptionText` / `descriptionHtml`
  - `errorList`
  - `classes`
  - `attributes`
  - `idPrefix`
  - `focusOnPageLoad`
- Storybook coverage for default, description, multiple-errors, HTML-content, and in-form usage
- Unit and accessibility coverage for nested HTML link clicks, multi-link focus behaviour, and `idPrefix` handling

##### Changed

- ErrorSummary no longer makes the summary container focusable on mount; linked fields still receive focus when errors are selected
- React Storybook examples now isolate link targets per story so docs previews do not jump into unrelated story content
- In-form and multiple-errors stories were expanded to make focus and scroll behaviour easier to validate manually

### 2026-03-10

#### @ourfuturehealth/toolkit 4.3.0 (`toolkit-v4.3.0`)

##### ⚠️ BREAKING CHANGES

- **Button variant naming aligned with Figma**: Renamed button variants to match design specifications
  - `ghost-reverse` → `ghost-inverted`
  - `text-reverse` → `text-inverted`
  - CSS classes changed: `.ofh-button--ghost-reverse` → `.ofh-button--ghost-inverted`
  - CSS classes changed: `.ofh-button--text-reverse` → `.ofh-button--text-inverted`
  - See [Upgrading Guide](UPGRADING.md#upgrading-to-v430--react-v020) for detailed migration instructions

##### Changed

- Refactored button styles to use design tokens and responsive spacing mixins instead of hardcoded typography and padding values
- Aligned button focus treatments with Figma, including inverted variants on dark backgrounds
- Updated toolkit selectors, site documentation, and examples to use the renamed button variants

#### @ourfuturehealth/react-components 0.2.0 (`react-v0.2.0`)

##### ⚠️ BREAKING CHANGES

- **Button variant naming aligned with Figma**: Renamed button variants to match design specifications
  - `ghost-reverse` → `ghost-inverted`
  - `text-reverse` → `text-inverted`
  - TypeScript type definitions updated to reflect new variant names
  - See [Upgrading Guide](UPGRADING.md#upgrading-to-v430--react-v020) for detailed migration instructions

##### Changed

- Updated Button component variant types, stories, tests, example app, and docs to use the renamed button variants
- `Button` now renders an anchor automatically when `href` is provided, with ref support for both button and anchor paths
- Expanded story and test coverage for link rendering, keyboard navigation, and form usage

#### @ourfuturehealth/toolkit 4.2.0 (`toolkit-v4.2.0`)

##### Added

- **Material Design Icon System**: Complete icon set with 61 icons organized in 6 categories
  - Categories: DataValidation, Action, Arrows, Graphical, Stepper, Socials
  - Icons use PascalCase naming aligned with Figma layer names (e.g., `Search`, `ChevronLeft`, `Done`)
  - New icon macro: `components/icon/macro.njk` for consistent icon rendering
  - Sprite-based implementation: `assets/icons/icon-sprite.svg` (61 symbols)
  - Icon metadata: `assets/icons/manifest.json` with categories and default sizes
  - Support for brand-colored icons: social media icons with hover states, `ArrowCircleRightColour`
  - Stepper icons: `LooksZero` through `LooksNine` for multi-step flows
- Icon infrastructure:
  - Build script: `scripts/build-icon-sprite.js` for sprite generation
  - Material icon styles: `core/styles/_icons-material.scss`
- Documentation:
  - Material icons workflow guide: `docs/contributing/material-icons.md`
  - Icon component README with usage examples: `components/icon/README.md`
  - Material icons asset README: `assets/icons/README.md`
  - Updated documentation site icon gallery at `/design-system/styles/icons`

##### Changed

- Updated toolkit components that previously embedded legacy SVGs to use the Material icon macro:
  - Action link: migrated arrow circle icon
  - Back link and breadcrumb: migrated chevron navigation
  - Card: migrated confirmation icon
  - Details expanders: migrated expand and collapse icons
  - Do/Don't lists: migrated to `Done` and `Close` icons
  - Header: migrated search, close, and chevron navigation icons
  - Pagination: migrated arrow navigation
- Icon sizes standardized to Material icon system sizes (16px, 24px, 32px)
- Toolkit build now generates the Material icon sprite from `assets/icons`
- Documentation now includes the Material icons workflow guide, the new icon macro README, and migration notes for affected components

##### Removed

- Legacy icon system (14 icon files):
  - `assets/icons/icon-arrow-left.svg`
  - `assets/icons/icon-arrow-right-circle.svg`
  - `assets/icons/icon-arrow-right.svg`
  - `assets/icons/icon-chevron-left.svg`
  - `assets/icons/icon-chevron-right.svg`
  - `assets/icons/icon-close.svg`
  - `assets/icons/icon-cross.svg`
  - `assets/icons/icon-emdash-small.svg`
  - `assets/icons/icon-emdash.svg`
  - `assets/icons/icon-minus.svg`
  - `assets/icons/icon-new-tab.svg`
  - `assets/icons/icon-plus.svg`
  - `assets/icons/icon-search.svg`
  - `assets/icons/icon-tick.svg`
- `core/styles/_icons.scss` and associated icon styling
- Legacy icon helper mixins from `core/tools/_mixins.scss`

##### Migration Notes

**Replacing legacy icons with Material icons:**

The 14 legacy `icon-*.svg` files have been replaced with a comprehensive Material icon system. Use the icon macro to render Material icons:

```njk
{{ icon({ "name": "Search", "size": 24 }) }}
```

**Common replacements:**

- `icon-cross` → Use `Close` icon
- `icon-tick` → Use `Done` icon
- `icon-chevron-left` → Use `ChevronLeft` icon
- `icon-chevron-right` → Use `ChevronRight` icon
- `icon-search` → Use `Search` icon
- `icon-arrow-right-circle` → Use `ArrowCircleRight` icon
- Available sizes: `16`, `24` (default), `32`
- For decorative icons, omit the `title` parameter (automatically sets `aria-hidden="true"`)
- For semantic icons, include a `title` parameter for accessibility

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

See [UPGRADING.md](UPGRADING.md) for detailed migration instructions, including spacing index shift mappings introduced in toolkit `4.1.0`.

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
