# Material Icon Catalog

This directory contains the curated Material SVG icon set used by toolkit components.

For the full end-to-end developer guide (architecture, sprite generation, docs wiring, and Figma onboarding flow), see:

- [`docs/contributing/material-icons.md`](../../../../docs/contributing/material-icons.md)

## Source of truth

- `manifest.json`: approved icon names, category metadata, and default sizes.
- `*.svg`: one SVG file per icon name.
- `../material-sprite.svg`: generated sprite used at runtime.

## Add or update icons

1. Update `manifest.json` with the icon metadata.
2. Add or replace the matching SVG file in this directory.
3. Build the sprite:
   - `pnpm --filter @ourfuturehealth/toolkit exec node scripts/build-material-icon-sprite.js`
4. Run toolkit checks:
   - `pnpm --filter @ourfuturehealth/toolkit build`
   - `pnpm --filter @ourfuturehealth/toolkit lint`

## Rules

- Keep names PascalCase matching Figma layer names and stable.
- Only ship icons approved in `do-not-track/iconography-updates.md`.
- Default sizes must be one of `16`, `24`, `32`.
- Use `currentColor` in SVG where color should follow CSS.
- For brand-colored icons (social media, `ArrowCircleRightColour`), preserve original Figma colors.
