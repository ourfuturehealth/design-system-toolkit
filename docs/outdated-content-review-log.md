# Outdated Content Review Log

This file tracks potentially outdated docs/content discovered during refactor and cleanup work.

Status labels:
- `candidate`: Looks outdated or inherited from NHS, but not yet validated for removal
- `ready-to-remove`: Confirmed safe to remove
- `removed`: Removed from codebase

## 1. Health A-Z content styles and page

- Status: `candidate`
- First noted: 2026-02-20
- Related files:
  - `packages/site/styles/app/_health-az.scss`
  - `packages/site/views/content/a-to-z-of-nhs-health-writing.njk`
  - `packages/site/styles/app/_app.scss`
- Context:
  - The page is marked `{% set unpublished = true %}` in `packages/site/views/content/a-to-z-of-nhs-health-writing.njk`.
  - Despite unpublished status, this route is still linked from multiple content/design-system pages and side nav structures.
  - The page is also present in `packages/site/views/site-map.njk` and `packages/site/views/sitemap.xml`.
- Action taken in this pass:
  - Replaced legacy extension token usage in `packages/site/styles/app/_health-az.scss`:
    - from `padding: ofh-spacing(2) + $ofh-box-shadow-link;`
    - to `padding: ofh-spacing(2) + $ofh-size-4;`
  - Removed `$ofh-box-shadow-link` from `packages/toolkit/core/settings/_tokens-extensions.scss`.
- Follow-up to decide:
  - Whether to keep the A-Z page and retain its styling.
  - If removing: delete `_health-az.scss`, remove `@import 'health-az';`, remove route and all cross-links.

## 2. Secondary-button extension tokens used by header close-button hover

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
  - `packages/toolkit/core/tools/_mixins.scss`
  - `packages/toolkit/components/header/_header.scss`
- Context:
  - `$ofh-secondary-button-color` only fed `$ofh-secondary-button-hover-color`.
  - `$ofh-secondary-button-hover-color` was used only in `@mixin close-button()` hover icon fill.
  - Header is planned for full rework, so keeping secondary-button legacy extension tokens was not justified.
- Action taken in this pass:
  - Updated `@mixin close-button()` hover fill in `packages/toolkit/core/tools/_mixins.scss`:
    - from `$ofh-secondary-button-hover-color`
    - to `$ofh-color-foreground-secondary`
  - Removed extension tokens from `packages/toolkit/core/settings/_tokens-extensions.scss`:
    - `$ofh-secondary-button-color`
    - `$ofh-secondary-button-hover-color`

## 3. Remove `close-button` mixin abstraction

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/core/tools/_mixins.scss`
  - `packages/toolkit/components/header/_header.scss`
- Context:
  - `@mixin close-button()` was only used in two header selectors:
    - `.ofh-search__close` (mobile search close)
    - `.ofh-header__navigation-close` (menu close)
  - Header is planned for a full rework, so keeping the shared mixin abstraction was not necessary.
- Action taken in this pass:
  - Inlined close-button styles in:
    - `packages/toolkit/components/header/_header.scss`
  - Removed `@mixin close-button()` from:
    - `packages/toolkit/core/tools/_mixins.scss`

## 4. Replace input-element extension background token

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/components/radios/_radios.scss`
  - `packages/toolkit/components/checkboxes/_checkboxes.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - `$ofh-input-element-background-color` was an extension token resolving to white.
  - It was used only for radios/checkboxes control backgrounds.
- Action taken in this pass:
  - Replaced with semantic new-token equivalent `$ofh-color-background-primary` in:
    - `packages/toolkit/components/radios/_radios.scss`
    - `packages/toolkit/components/checkboxes/_checkboxes.scss`
  - Removed `$ofh-input-element-background-color` from:
    - `packages/toolkit/core/settings/_tokens-extensions.scss`

## 5. Remove bounce/overscroll extension color token

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/core/elements/_page.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - `$background-bounce-color` existed only to provide a separate `html` background for iOS overscroll/rubber-banding.
  - Project decision: do not preserve this special behavior.
- Action taken in this pass:
  - Updated `html` background in `packages/toolkit/core/elements/_page.scss`:
    - from `$background-bounce-color`
    - to `$background-color`
  - Removed `$background-bounce-color` from:
    - `packages/toolkit/core/settings/_tokens-extensions.scss`

## 6. Replace focus-text extension token with semantic focus/foreground tokens

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/components/header/_header.scss`
  - `packages/toolkit/components/error-summary/_error-summary.scss`
  - `packages/toolkit/components/status-flag/_status-flag.scss`
  - `packages/toolkit/core/tools/_links.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - `$ofh-focus-text-color` was used for mixed semantics:
    - border usage in focus states
    - text/fill usage in focus states
  - Better mapping in the new token system is:
    - borders -> `$ofh-focus-color` (maps to `$ofh-color-border-feedback-focus`)
    - text/fill -> `$ofh-color-foreground-brand-blue-navy`
- Action taken in this pass:
  - Replaced border uses of `$ofh-focus-text-color` with `$ofh-focus-color`.
  - Replaced remaining text/fill uses with `$ofh-color-foreground-brand-blue-navy`.
  - Removed `$ofh-focus-text-color` extension declaration from:
    - `packages/toolkit/core/settings/_tokens-extensions.scss`

## 7. Remove transparent hero overlay extension token

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/components/hero/_hero.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - `$color-transparent-ofh-blue-50` was only used once in hero overlay styling.
- Action taken in this pass:
  - Replaced usage in `packages/toolkit/components/hero/_hero.scss`:
    - from `$color-transparent-ofh-blue-50`
    - to `rgba($ofh-color-brand-blue-navy-3-main, 0.5)`
  - Removed `$color-transparent-ofh-blue-50` from:
    - `packages/toolkit/core/settings/_tokens-extensions.scss`

## 8. Replace single-use computed shade token (`-20`)

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/components/header/_header.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - `$color-shade-ofh-blue-20` was only used for search submit hover state in header.
- Action taken in this pass:
  - Replaced in `packages/toolkit/components/header/_header.scss`:
    - from `$color-shade-ofh-blue-20`
    - to `$ofh-color-brand-yellow-2`
  - Removed `$color-shade-ofh-blue-20` from:
    - `packages/toolkit/core/settings/_tokens-extensions.scss`

## 9. Remove remaining shade-derived extension tokens and `shade()` function

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/components/header/_header.scss`
  - `packages/toolkit/core/tools/_mixins.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - Remaining computed extension shades were:
    - `$color-shade-ofh-blue-35`
    - `$color-shade-ofh-blue-50`
  - They were only used in header/toggle-button states.
- Action taken in this pass:
  - Replaced usages:
    - `$color-shade-ofh-blue-35` -> `$ofh-color-brand-yellow-2`
    - `$color-shade-ofh-blue-50` -> `$ofh-color-brand-yellow-1`
  - Removed remaining shade-derived extension tokens and `@function shade(...)`.

## 10. Remove empty `tokens-extensions` settings file

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/core/settings/_all.scss`
  - `packages/toolkit/core/settings/_tokens-extensions.scss`
- Context:
  - After cleanup, `tokens-extensions` contained no active tokens/functions.
- Action taken in this pass:
  - Removed `@import 'tokens-extensions';` from `packages/toolkit/core/settings/_all.scss`.
  - Deleted `packages/toolkit/core/settings/_tokens-extensions.scss`.

## 11. Remove `toggle-button` mixin abstraction

- Status: `removed`
- First noted: 2026-02-20
- Related files:
  - `packages/toolkit/core/tools/_mixins.scss`
  - `packages/toolkit/components/header/_header.scss`
- Context:
  - `@mixin toggle-button()` was only used in header:
    - `.ofh-header__search-toggle`
    - `.ofh-header__menu-toggle`
  - Header is planned for a full rework, so this shared abstraction was not needed.
- Action taken in this pass:
  - Inlined toggle button styles directly into:
    - `packages/toolkit/components/header/_header.scss`
  - Removed `@mixin toggle-button()` from:
    - `packages/toolkit/core/tools/_mixins.scss`
