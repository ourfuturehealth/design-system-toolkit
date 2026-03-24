# Toolkit v4.5.0 Migration Guide: Spacing, Typography, and Token Changes

This is the full consumer migration guide for the spacing, typography, and token changes released in `@ourfuturehealth/toolkit` `v4.5.0`.

Use this guide if you are upgrading from either:

- `@ourfuturehealth/toolkit` `v4.4.x` on the monorepo line
- `ofh-design-system-toolkit` `v3.4.2` on the pre-monorepo line

This document is intentionally detailed. It is written so a consumer can work through every changed helper, class, and token, migrate them one by one, and then validate the result with confidence.

## Which migration track should you use?

Use the track that matches the version you are currently on:

- `Track A`: you are on `@ourfuturehealth/toolkit` `v4.4.x`
- `Track B`: you are on `ofh-design-system-toolkit` `v3.4.2` or earlier

Notes:

- `v3.4.2` is the last pre-monorepo toolkit tag available in this repository checkout.
- If your team refers to `v3.4.3` in external notes, use the `v3.4.2` API surface in this guide as the local baseline.

## What changed?

### Spacing

- Removed the static spacing function `ofh-spacing(...)`
- Removed the static spacing map `$ofh-spacing-points`
- Removed the single responsive spacing map `$ofh-space-responsive-scale`
- Added 2 responsive spacing maps:
  - `$ofh-space-horizontal-responsive-scale`
  - `$ofh-space-vertical-responsive-scale`
- Kept the mixin names `ofh-responsive-margin(...)` and `ofh-responsive-padding(...)`, but changed the accepted inputs from point indices to Figma-aligned size keys
- Renamed spacing utility class suffixes from point indices to Figma-aligned size keys
- Changed `all` spacing so it now combines the vertical scale for top and bottom with the horizontal scale for left and right

### Typography

- Renamed the direct typography scale keys to match Figma
- Removed the old direct key names from:
  - `ofh-typography-responsive(...)`
  - `ofh-font(...)`
- Renamed the direct heading classes:
  - `ofh-heading-l` -> `ofh-heading-lg`
  - `ofh-heading-m` -> `ofh-heading-md`
  - `ofh-heading-s` -> `ofh-heading-sm`
- Removed the legacy direct typography utility aliases such as `ofh-u-font-size-h1`
- Kept the numeric responsive font-size override classes as the supported override utility surface:
  - `ofh-u-font-size-64`
  - `ofh-u-font-size-48`
  - `ofh-u-font-size-32`
  - `ofh-u-font-size-24`
  - `ofh-u-font-size-22`
  - `ofh-u-font-size-20`
  - `ofh-u-font-size-16`
  - `ofh-u-font-size-14`
- Kept the semantic typography classes for now:
  - `ofh-body-l`
  - `ofh-body-m`
  - `ofh-body-s`
  - `ofh-caption-*`
  - `ofh-lede-text*`
- Changed the token basis behind those semantic classes, so they can still render differently after the upgrade even if the class name did not change

### Tokens

- Renamed raw color variables to match the current Figma token model
- Corrected one incorrect brand token name
- Renamed the breakpoint typography and paragraph spacing map keys
- Removed the old responsive spacing map and replaced it with separate horizontal and vertical maps
- Changed one iconography responsive value
- Removed `$ofh-width-page-max`

## Search your codebase first

Run these searches before making changes.

### Common searches for every consumer

```bash
rg "ofh-spacing\\(" -g '*.scss'
rg "ofh-responsive-(margin|padding)\\(" -g '*.scss'
rg "ofh-heading-(l|m|s)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
rg "\\$ofh-space-responsive-scale|\\$ofh-spacing-points|\\$ofh-width-page-max" -g '*.scss'
rg "\\$ofh-color-background-neutral-(grey|blue|yellow)|\\$ofh-color-brand-blue-royal-3\\b" -g '*.scss'
```

### Track A searches: `v4.4.x -> v4.5.0`

```bash
rg "ofh-u-(margin|padding)(-[a-z]+)?-(0|1|2|3|4|5|6|7|8|9|10|11)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
rg "ofh-u-font-size-(h1|h2|h3|h4|h5|lead|paragraph|paragraph-small|list|list-small)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
rg "ofh-typography-responsive\\('(h1|h2|h3|h4|h5|lead|paragraph|paragraph-small|list|list-small)'" -g '*.scss'
rg "ofh-font\\('(h1|h2|h3|h4|h5|lead|paragraph|paragraph-small|list|list-small)'" -g '*.scss'
```

### Track B searches: `v3.4.2 -> v4.5.0`

```bash
rg "ofh-u-font-size-(64|48|32|24|22|19|16|14)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
rg "ofh-typography-responsive\\((64|48|32|24|22|19|16|14)\\)" -g '*.scss'
rg "ofh-font\\((64|48|32|24|22|19|16|14)" -g '*.scss'
rg "ofh-u-(margin|padding)(-[a-z]+)?-(0|1|2|3|4|5|6|7|8|9)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
```

## Spacing migration

### Spacing API inventory

Removed APIs:

- `ofh-spacing(...)`
- `$ofh-spacing-points`
- `$ofh-space-responsive-scale`

Retained but changed APIs:

- `ofh-responsive-margin(...)`
- `ofh-responsive-padding(...)`
- every generated `ofh-u-margin-*` utility class
- every generated `ofh-u-padding-*` utility class

New raw token maps:

- `$ofh-space-horizontal-responsive-scale`
- `$ofh-space-vertical-responsive-scale`

### Track A: `v4.4.x -> v4.5.0`

#### 1. Replace every removed `ofh-spacing(...)` call

Use these exact replacements:

| Removed | Replace with |
| ------ | ----- |
| `ofh-spacing(0)` | `$ofh-size-0` |
| `ofh-spacing(1)` | `$ofh-size-2` |
| `ofh-spacing(2)` | `$ofh-size-4` |
| `ofh-spacing(3)` | `$ofh-size-8` |
| `ofh-spacing(4)` | `$ofh-size-16` |
| `ofh-spacing(5)` | `$ofh-size-24` |
| `ofh-spacing(6)` | `$ofh-size-32` |
| `ofh-spacing(7)` | `$ofh-size-40` |
| `ofh-spacing(8)` | `$ofh-size-48` |
| `ofh-spacing(9)` | `$ofh-size-56` |
| `ofh-spacing(10)` | `$ofh-size-64` |

There is no new spacing function. Replace the function call with the raw size token directly.

#### 2. Replace responsive spacing point inputs with current size keys

Use this exact suffix and input mapping everywhere:

| Old point | New size key |
| --------- | ------------ |
| `0` | `0` |
| `1` | `2` |
| `2` | `4` |
| `3` | `8` |
| `4` | `12` |
| `5` | `16` |
| `6` | `24` |
| `7` | `32` |
| `8` | `40` |
| `9` | `48` |
| `10` | `56` |
| `11` | `64` |

That table applies to all of these:

- `@include ofh-responsive-margin(...)`
- `@include ofh-responsive-padding(...)`
- `ofh-u-margin-*`
- `ofh-u-margin-top-*`
- `ofh-u-margin-right-*`
- `ofh-u-margin-bottom-*`
- `ofh-u-margin-left-*`
- `ofh-u-padding-*`
- `ofh-u-padding-top-*`
- `ofh-u-padding-right-*`
- `ofh-u-padding-bottom-*`
- `ofh-u-padding-left-*`

Examples:

| Before | After |
| ------ | ----- |
| `@include ofh-responsive-margin(5, 'bottom')` | `@include ofh-responsive-margin(16, 'bottom')` |
| `@include ofh-responsive-padding(7, 'horizontal')` | `@include ofh-responsive-padding(32, 'horizontal')` |
| `ofh-u-margin-top-4` | `ofh-u-margin-top-12` |
| `ofh-u-padding-6` | `ofh-u-padding-24` |
| `ofh-u-padding-bottom-11` | `ofh-u-padding-bottom-64` |

#### 3. Replace raw responsive spacing map references

| Removed | Replace with |
| ------ | ----- |
| `$ofh-space-responsive-scale` | `$ofh-space-horizontal-responsive-scale` or `$ofh-space-vertical-responsive-scale` |

There is no single new map that replaces the old unified one. Choose the new map based on axis intent.

Examples:

```scss
// Before
map.get($ofh-space-responsive-scale, 7);

// After
map.get($ofh-space-horizontal-responsive-scale, 32);
map.get($ofh-space-vertical-responsive-scale, 32);
```

#### 4. Review every `all` spacing usage

This is the most important behavior change in the spacing migration.

Before:

- `all` used one unified responsive spacing map for every side

Now:

- `top` and `bottom` use the vertical scale
- `left` and `right` use the horizontal scale
- `all` applies both scales together

That means the API name stayed the same, but the rendered layout can change even when the number was migrated correctly.

### Track B: `v3.4.2 -> v4.5.0`

The pre-monorepo spacing model differs from `v4.5.0` in two ways:

- the static spacing points were different
- the responsive spacing model now uses separate horizontal and vertical scales instead of a single scale

#### 1. Replace every removed `ofh-spacing(...)` call

Use these exact replacements:

| Removed | Replace with |
| ------ | ----- |
| `ofh-spacing(0)` | `$ofh-size-0` |
| `ofh-spacing(1)` | `$ofh-size-4` |
| `ofh-spacing(2)` | `$ofh-size-8` |
| `ofh-spacing(3)` | `$ofh-size-16` |
| `ofh-spacing(4)` | `$ofh-size-24` |
| `ofh-spacing(5)` | `$ofh-size-32` |
| `ofh-spacing(6)` | `$ofh-size-40` |
| `ofh-spacing(7)` | `$ofh-size-48` |
| `ofh-spacing(8)` | `$ofh-size-56` |
| `ofh-spacing(9)` | `$ofh-size-64` |

#### 2. Replace old responsive spacing points with current size keys

These are the old `v3.4.2` responsive values:

| Old point | Old responsive values |
| --------- | --------------------- |
| `0` | `0 / 0` |
| `1` | `4 / 4` |
| `2` | `8 / 8` |
| `3` | `8 / 16` |
| `4` | `16 / 24` |
| `5` | `24 / 32` |
| `6` | `32 / 40` |
| `7` | `40 / 48` |
| `8` | `48 / 56` |
| `9` | `56 / 64` |

Use this best-fit migration table as your starting point:

| Old point | Recommended current size key |
| --------- | ---------------------------- |
| `0` | `0` |
| `1` | `4` |
| `2` | `8` |
| `3` | `16` |
| `4` | `24` |
| `5` | `32` |
| `6` | `40` |
| `7` | `48` |
| `8` | `56` |
| `9` | `64` |

Important:

- This is not an exact 1:1 migration.
- `v4.5.0` does not reproduce the old responsive spacing behavior exactly.
- You must visually QA migrated spacing, especially anywhere the old spacing was tuned around the old mobile and tablet behavior.

#### 3. Replace old spacing utility classes

The old utility classes followed the same point indices as the old responsive scale.

Examples:

| Before | After |
| ------ | ----- |
| `ofh-u-margin-top-1` | `ofh-u-margin-top-4` |
| `ofh-u-padding-bottom-2` | `ofh-u-padding-bottom-8` |
| `ofh-u-margin-5` | `ofh-u-margin-32` |
| `ofh-u-padding-right-9` | `ofh-u-padding-right-64` |

Apply that same suffix mapping to every old margin and padding utility variant.

## Typography migration

### Typography API inventory

Changed APIs:

- `@include ofh-typography-responsive(...)`
- `@include ofh-font(...)`
- `.ofh-heading-l`
- `.ofh-heading-m`
- `.ofh-heading-s`
- `ofh-u-font-size-*`
- `$ofh-typography-responsive-scale`
- `$ofh-paragraph-spacing-responsive-scale`

Unchanged names with changed internals:

- `.ofh-body-l`
- `.ofh-body-m`
- `.ofh-body-s`
- `.ofh-caption-xl`
- `.ofh-caption-l`
- `.ofh-caption-m`
- `.ofh-caption--bottom`
- `.ofh-lede-text`
- `.ofh-lede-text--small`

### Track A: `v4.4.x -> v4.5.0`

#### 1. Replace every old direct typography key in `ofh-typography-responsive(...)`

Use these exact replacements:

| Before | After |
| ------ | ----- |
| `@include ofh-typography-responsive('h1')` | `@include ofh-typography-responsive('heading-xl')` |
| `@include ofh-typography-responsive('h2')` | `@include ofh-typography-responsive('heading-lg')` |
| `@include ofh-typography-responsive('h3')` | `@include ofh-typography-responsive('heading-md')` |
| `@include ofh-typography-responsive('h4')` | `@include ofh-typography-responsive('heading-sm')` |
| `@include ofh-typography-responsive('h5')` | `@include ofh-typography-responsive('heading-xs')` |
| `@include ofh-typography-responsive('lead')` | `@include ofh-typography-responsive('lead-md')` |
| `@include ofh-typography-responsive('paragraph')` | `@include ofh-typography-responsive('paragraph-md')` |
| `@include ofh-typography-responsive('paragraph-small')` | `@include ofh-typography-responsive('paragraph-sm')` |
| `@include ofh-typography-responsive('list')` | `@include ofh-typography-responsive('list-md')` |
| `@include ofh-typography-responsive('list-small')` | `@include ofh-typography-responsive('list-sm')` |

#### 2. Replace every old direct typography key in `ofh-font(...)`

Use these exact replacements:

| Before | After |
| ------ | ----- |
| `@include ofh-font('h1')` | `@include ofh-font('heading-xl')` |
| `@include ofh-font('h2')` | `@include ofh-font('heading-lg')` |
| `@include ofh-font('h3')` | `@include ofh-font('heading-md')` |
| `@include ofh-font('h4')` | `@include ofh-font('heading-sm')` |
| `@include ofh-font('h5')` | `@include ofh-font('heading-xs')` |
| `@include ofh-font('lead')` | `@include ofh-font('lead-md')` |
| `@include ofh-font('paragraph')` | `@include ofh-font('paragraph-md')` |
| `@include ofh-font('paragraph-small')` | `@include ofh-font('paragraph-sm')` |
| `@include ofh-font('list')` | `@include ofh-font('list-md')` |
| `@include ofh-font('list-small')` | `@include ofh-font('list-sm')` |

#### 3. Replace the renamed direct heading classes

| Before | After |
| ------ | ----- |
| `.ofh-heading-l` | `.ofh-heading-lg` |
| `.ofh-heading-m` | `.ofh-heading-md` |
| `.ofh-heading-s` | `.ofh-heading-sm` |

#### 4. Replace legacy direct typography utility aliases

The legacy utility aliases such as `ofh-u-font-size-h1` were removed.

There is no exact drop-in utility replacement for those classes, because the supported override utility surface now uses the older numeric responsive scale while the direct typography API uses the Figma-aligned named scale.

Use this rule:

- if you were using the utility to apply a real design-system text style, switch to the direct class or to the equivalent mixin in component SCSS
- if you were using it as a low-level override, switch to the numeric utility that matches the rendered size you want and visually QA it

Preferred replacements when you were expressing a direct text style:

| Removed class | Preferred replacement |
| ------------- | --------------------- |
| `ofh-u-font-size-h1` | `ofh-heading-xl` or `@include ofh-typography-responsive('heading-xl')` |
| `ofh-u-font-size-h2` | `ofh-heading-lg` or `@include ofh-typography-responsive('heading-lg')` |
| `ofh-u-font-size-h3` | `ofh-heading-md` or `@include ofh-typography-responsive('heading-md')` |
| `ofh-u-font-size-h4` | `ofh-heading-sm` or `@include ofh-typography-responsive('heading-sm')` |
| `ofh-u-font-size-h5` | `ofh-heading-xs` or `@include ofh-typography-responsive('heading-xs')` |
| `ofh-u-font-size-lead` | `ofh-body-l` or `@include ofh-font('lead-md')` |
| `ofh-u-font-size-paragraph` | `ofh-body-m` or `@include ofh-font('paragraph-md')` |
| `ofh-u-font-size-paragraph-small` | `ofh-body-s` or `@include ofh-font('paragraph-sm')` |
| `ofh-u-font-size-list` | `@include ofh-font('list-md')` |
| `ofh-u-font-size-list-small` | `@include ofh-font('list-sm')` |

If you need to stay with utility overrides, use the numeric override scale instead:

| Removed class | Closest numeric override | Important note |
| ------------- | ------------------------ | -------------- |
| `ofh-u-font-size-h1` | `ofh-u-font-size-48` | switches up at tablet instead of desktop |
| `ofh-u-font-size-h2` | `ofh-u-font-size-32` | switches up at tablet instead of desktop |
| `ofh-u-font-size-h3` | `ofh-u-font-size-24` | mobile line-height differs |
| `ofh-u-font-size-h4` | `ofh-u-font-size-22` | mobile line-height differs |
| `ofh-u-font-size-h5` | `ofh-u-font-size-20` | mobile and tablet values differ |
| `ofh-u-font-size-lead` | `ofh-u-font-size-24` | mobile line-height differs |
| `ofh-u-font-size-paragraph` | `ofh-u-font-size-20` | mobile and tablet values differ |
| `ofh-u-font-size-paragraph-small` | `ofh-u-font-size-16` | mobile value differs |
| `ofh-u-font-size-list` | `ofh-u-font-size-20` | mobile and tablet values differ |
| `ofh-u-font-size-list-small` | `ofh-u-font-size-16` | mobile value differs |

#### 5. Recheck semantic classes that stayed public

These names were kept, so they do not need a rename:

- `ofh-body-l`
- `ofh-body-m`
- `ofh-body-s`
- `ofh-caption-xl`
- `ofh-caption-l`
- `ofh-caption-m`
- `ofh-caption--bottom`
- `ofh-lede-text`
- `ofh-lede-text--small`

But their token basis changed:

| Class | Old basis | New basis |
| ----- | --------- | --------- |
| `ofh-body-l` | `lead` | `lead-md` |
| `ofh-body-m` | `paragraph` | `paragraph-md` |
| `ofh-body-s` | `paragraph-small` | `paragraph-sm` |
| `ofh-caption-xl` | `h2` | `heading-lg` |
| `ofh-caption-l` | `h3` | `heading-md` |
| `ofh-caption-m` | `paragraph` | `paragraph-md` |
| `ofh-lede-text` | `lead` | `lead-md` |
| `ofh-lede-text--small` | `paragraph` | `paragraph-md` |

If you keep these classes, you still need visual QA after upgrading.

### Track B: `v3.4.2 -> v4.5.0`

The pre-monorepo toolkit used numeric typography keys and numeric typography utility classes.

Those numeric utility classes are still supported in `v4.5.0`, but the mixin API moved to the named Figma-aligned scale.

#### 1. Replace numeric keys in `ofh-typography-responsive(...)`

Use this table when the old key appears in `ofh-typography-responsive(...)`:

| Before | Replace with |
| ------ | ------------ |
| `@include ofh-typography-responsive(64)` | `@include ofh-typography-responsive('heading-xl')` if you want the largest supported current scale |
| `@include ofh-typography-responsive(48)` | `@include ofh-typography-responsive('heading-xl')` |
| `@include ofh-typography-responsive(32)` | `@include ofh-typography-responsive('heading-lg')` |
| `@include ofh-typography-responsive(24)` | `@include ofh-typography-responsive('heading-md')` for headings, or `@include ofh-typography-responsive('lead-md')` for lead copy |
| `@include ofh-typography-responsive(22)` | `@include ofh-typography-responsive('heading-sm')` |
| `@include ofh-typography-responsive(19)` | `@include ofh-typography-responsive('paragraph-md')` for body copy, or `@include ofh-typography-responsive('heading-xs')` for small headings |
| `@include ofh-typography-responsive(16)` | `@include ofh-typography-responsive('paragraph-sm')` for body copy, or `@include ofh-typography-responsive('list-sm')` for lists |
| `@include ofh-typography-responsive(14)` | no exact replacement; redesign to `paragraph-sm`, `list-sm`, or a component-specific override |

#### 2. Replace numeric keys in `ofh-font(...)`

Use this table when the old key appears in `ofh-font(...)`:

| Before | Replace with |
| ------ | ------------ |
| `@include ofh-font(64)` | `@include ofh-font('heading-xl')` if you want the largest supported current scale |
| `@include ofh-font(48)` | `@include ofh-font('heading-xl')` |
| `@include ofh-font(32)` | `@include ofh-font('heading-lg')` |
| `@include ofh-font(24)` | `@include ofh-font('heading-md')` for headings, or `@include ofh-font('lead-md')` for lead copy |
| `@include ofh-font(22)` | `@include ofh-font('heading-sm')` |
| `@include ofh-font(19)` | `@include ofh-font('paragraph-md')` for body copy, or `@include ofh-font('heading-xs')` for small headings |
| `@include ofh-font(16)` | `@include ofh-font('paragraph-sm')` for body copy, or `@include ofh-font('list-sm')` for lists |
| `@include ofh-font(14)` | no exact replacement; redesign to `paragraph-sm`, `list-sm`, or a component-specific override |

#### 3. Numeric typography utility classes remain supported

The numeric typography utility classes were kept as the override API in `v4.5.0`.

That means these classes do not need a rename:

- `ofh-u-font-size-64`
- `ofh-u-font-size-48`
- `ofh-u-font-size-32`
- `ofh-u-font-size-24`
- `ofh-u-font-size-22`
- `ofh-u-font-size-20`
- `ofh-u-font-size-16`
- `ofh-u-font-size-14`

If you already adopted `ofh-u-font-size-19` from earlier monorepo-line work, rename it to `ofh-u-font-size-20` and visually QA the result. The supported utility set now uses `20`, and both the mobile and tablet-and-up values changed.

They keep the pre-monorepo responsive values and matching line heights, so a class like `ofh-u-font-size-64` still collapses on smaller screens instead of behaving like a fixed `64px` utility.

| Utility class | Mobile | Tablet and above |
| ------------- | ------ | ---------------- |
| `ofh-u-font-size-64` | `48px / 56px` | `64px / 72px` |
| `ofh-u-font-size-48` | `32px / 40px` | `48px / 56px` |
| `ofh-u-font-size-32` | `24px / 32px` | `32px / 40px` |
| `ofh-u-font-size-24` | `20px / 28px` | `24px / 32px` |
| `ofh-u-font-size-22` | `18px / 28px` | `22px / 32px` |
| `ofh-u-font-size-20` | `18px / 24px` | `20px / 28px` |
| `ofh-u-font-size-16` | `14px / 24px` | `16px / 24px` |
| `ofh-u-font-size-14` | `12px / 20px` | `14px / 24px` |

Important:

- The numeric utilities are for override use only.
- The direct typography API is still the Figma-aligned named scale.
- If you find numeric utility classes in consumer repos, you can keep them as-is unless you want to move to component-specific typography classes instead.

#### 4. Replace old direct heading classes if present

Only these heading class names changed:

| Before | After |
| ------ | ----- |
| `.ofh-heading-l` | `.ofh-heading-lg` |
| `.ofh-heading-m` | `.ofh-heading-md` |
| `.ofh-heading-s` | `.ofh-heading-sm` |

These class names stayed public, but their internals changed:

- `.ofh-heading-xl`
- `.ofh-heading-xs`
- `.ofh-body-l`
- `.ofh-body-m`
- `.ofh-body-s`
- `.ofh-caption-*`
- `.ofh-lede-text*`

## Token migration

This section applies to any consumer that imports toolkit Sass variables, looks up token maps directly, or uses toolkit Sass internals in overrides.

### 1. Replace renamed raw color variables

Use these exact replacements:

| Before | After |
| ------ | ----- |
| `$ofh-color-brand-blue-royal-3` | `$ofh-color-brand-blue-royal-4` |
| `$ofh-color-background-neutral-grey` | `$ofh-color-backgrounds-grey` |
| `$ofh-color-background-neutral-blue` | `$ofh-color-backgrounds-blue` |
| `$ofh-color-background-neutral-yellow` | `$ofh-color-backgrounds-yellow` |

The secondary aliases below still exist and do not need a rename:

- `$ofh-color-background-secondary-blue`
- `$ofh-color-background-secondary-yellow`
- `$ofh-color-background-secondary-grey`

Those aliases now point to the renamed `backgrounds-*` core tokens.

### 2. Replace renamed typography and paragraph spacing map keys

These key renames apply to both:

- `$ofh-typography-responsive-scale`
- `$ofh-paragraph-spacing-responsive-scale`

Use these exact replacements:

| Before | After |
| ------ | ----- |
| `h1` | `heading-xl` |
| `h2` | `heading-lg` |
| `h3` | `heading-md` |
| `h4` | `heading-sm` |
| `h5` | `heading-xs` |
| `lead` | `lead-md` |
| `paragraph` | `paragraph-md` |
| `paragraph-small` | `paragraph-sm` |
| `list` | `list-md` |
| `list-small` | `list-sm` |

### 3. Replace the old responsive spacing map

| Before | After |
| ------ | ----- |
| `$ofh-space-responsive-scale` | `$ofh-space-horizontal-responsive-scale` or `$ofh-space-vertical-responsive-scale` |

There is no single new map that fully replaces the old one.

### 4. Recheck any direct consumer of the iconography responsive map

`$ofh-iconography-responsive-scale` was not renamed, but the value for key `24` changed:

| Key | Before | After |
| --- | ------ | ----- |
| `24` | `24 / 24 / 24` | `16 / 16 / 24` |

If your code reads `$ofh-iconography-responsive-scale` directly, recheck every `24` icon usage after the upgrade.

### 5. Remove the deleted width token

| Before | After |
| ------ | ----- |
| `$ofh-width-page-max` | removed with no direct replacement |

`$ofh-width-content-max` still exists and still resolves to `960px`.

Do not replace `$ofh-width-page-max` blindly with `$ofh-width-content-max`. Review the original layout intent first.

## Validation checklist after migration

### Spacing

- Check every component or template that previously used `ofh-spacing(...)`
- Check every component or template that previously used `ofh-responsive-margin(...)` or `ofh-responsive-padding(...)`
- Check every layout that used `all` spacing, because horizontal and vertical now come from different scales
- Check mobile, tablet, and desktop separately

### Typography

- Check every migrated `ofh-heading-l`, `ofh-heading-m`, and `ofh-heading-s`
- Check every migrated `ofh-u-font-size-*` utility, especially if you replaced removed `h1/h2/...` utility aliases with numeric overrides
- Check body copy, captions, and lede text even when the class name did not change
- Check headings and body hierarchy around cards, forms, tables, and error summaries

### Tokens

- Rebuild your Sass bundle and resolve every missing token reference
- Recheck any direct token map lookups if your code reads the maps directly
- Recheck any consumer that used `$ofh-width-page-max`
- Recheck any consumer that used the iconography responsive map for size `24`

## Suggested migration order

Use this order to reduce noise:

1. Update removed raw tokens and raw map names.
2. Replace `ofh-spacing(...)`.
3. Replace responsive spacing point inputs and spacing utility class suffixes.
4. Replace direct typography keys in `ofh-typography-responsive(...)`.
5. Replace direct typography keys in `ofh-font(...)`.
6. Replace direct heading classes.
7. Replace removed legacy typography utility aliases and decide whether each usage should become a direct class, a mixin, or a numeric override utility.
8. Rebuild and fix compile failures.
9. Do visual QA on spacing-heavy and typography-heavy pages.

## Final sanity searches

Run these before you call the migration complete:

```bash
rg "ofh-spacing\\(" -g '*.scss'
rg "ofh-u-font-size-(h1|h2|h3|h4|h5|lead|paragraph|paragraph-small|list|list-small)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
rg "ofh-heading-(l|m|s)\\b" -g '*.scss' -g '*.html' -g '*.njk' -g '*.md' -g '*.tsx' -g '*.jsx'
rg "\\$ofh-spacing-points|\\$ofh-space-responsive-scale|\\$ofh-width-page-max|\\$ofh-color-background-neutral-(grey|blue|yellow)|\\$ofh-color-brand-blue-royal-3\\b" -g '*.scss'
```

If those searches come back empty and your visual QA passes, you should be in a good place to adopt `v4.5.0`.
