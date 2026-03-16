# Adding a New Theme

This guide explains how to add a new theme to the design system.

Current built-in themes are:

- `participant`
- `research`

`example` is intentionally documentation-only and is not emitted as a CSS bundle.

## 1. Add token mappings

Update `packages/toolkit/core/settings/_tokens-theme.scss`.

1. Add your new mode to the `@if` / `@else if` chain.
2. Map:
   - `$ofh-color-foreground-accent-1..3`
   - `$ofh-color-background-accent-1..3`
   - `$ofh-color-border-accent-1..3`
   - `$ofh-color-border-header-option-1` when present in Figma
3. Update the file comments and `@error` message valid values.

## 1a. Evolving theme-specific token sets (future-proofing)

If Design adds new theme-specific tokens (for example `accent-4`, or a new family like `surface-highlight`), extend `_tokens-theme.scss` using the same pattern.

1. Declare defaults near the top of the file:
   - Example: `$ofh-color-foreground-accent-4: null !default;`
2. Map values inside each theme branch (`participant`, `research`, and any future themes).
3. Keep token naming aligned with the Figma semantic token name where possible.
4. Keep token categories explicit by family:
   - `foreground`
   - `background`
   - `border`
   - `header-option`
   - any new family introduced by design

Example (adding `accent-4`):

```scss
// Declarations
$ofh-color-foreground-accent-4: null !default;
$ofh-color-background-accent-4: null !default;
$ofh-color-border-accent-4: null !default;

@if $ofh-theme-mode == participant {
  $ofh-color-foreground-accent-4: $ofh-color-brand-yellow-1;
  $ofh-color-background-accent-4: $ofh-color-brand-yellow-1;
  $ofh-color-border-accent-4: $ofh-color-brand-yellow-2;
} @else if $ofh-theme-mode == research {
  $ofh-color-foreground-accent-4: $ofh-color-brand-green-teal-1;
  $ofh-color-background-accent-4: $ofh-color-brand-green-teal-1;
  $ofh-color-border-accent-4: $ofh-color-brand-green-teal-2;
}
```

When to update this file:

1. New theme mode added.
2. New theme-specific token introduced in Figma.
3. Existing theme token remapped to a different core token.

Validation rules before merge:

1. Every theme branch defines every theme-specific token (no missing mappings).
2. No component references removed/renamed tokens unexpectedly.
3. Built artifacts still compile for toolkit and react packages.

## 2. Add toolkit Sass entrypoint

Create `packages/toolkit/ofh-<theme>.scss`:

```scss
$ofh-theme-mode: <theme>;
@import 'ofh';
```

## 3. Emit toolkit CSS bundle

Update `packages/toolkit/gulpfile.js`:

1. Add `ofh-<theme>.scss` to `compileCSS().src(...)`.
2. Add output mapping:
   - `ofh-<theme>` -> `ofh-design-system-toolkit-<theme>`

Update `packages/toolkit/package.json`:

1. Add `ofh-<theme>.scss` to `files`.

## 4. Emit React theme stylesheet

Update `packages/react-components/scripts/build-themes.mjs`:

1. Add `'<theme>'` to the `themes` array.

Update `packages/react-components/package.json`:

1. Add export:
   - `"./styles/<theme>": "./dist/ofh-design-system-react-<theme>.css"`

No Vite config changes are required if you follow the existing naming pattern.

## 5. Update docs and developer guidance

Update references in:

- `docs/installation/installing-with-npm.md`
- `docs/installation/installing-compiled.md`
- `docs/consuming-react-components.md`
- `packages/site/views/get-started/guidance-for-dev/index.njk`
- `packages/react-components/README.md`

If needed, add module declaration in:

- `packages/example-react-consumer-app/src/types/react-components.d.ts`

## 6. Verification checklist

Run:

```bash
pnpm --filter @ourfuturehealth/toolkit run bundle
pnpm --filter @ourfuturehealth/react-components run build
```

Verify toolkit artifacts exist:

- `packages/toolkit/dist/ofh-design-system-toolkit-<theme>.css`
- `packages/toolkit/dist/ofh-design-system-toolkit-<theme>-<version>.min.css`

Verify React artifact exists:

- `packages/react-components/dist/ofh-design-system-react-<theme>.css`

Verify package exports:

1. `@ourfuturehealth/toolkit/ofh-<theme>` resolves.
2. `@ourfuturehealth/react-components/styles/<theme>` resolves.

Verify consumer imports:

1. Sass consumers can import `@ourfuturehealth/toolkit/ofh-<theme>`.
2. Compiled CSS consumers can include `ofh-design-system-toolkit-<theme>-<version>.min.css`.
3. React consumers can import `@ourfuturehealth/react-components/styles/<theme>`.
