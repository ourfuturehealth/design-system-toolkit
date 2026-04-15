# Icon

Renders Material SVG icons from the toolkit sprite.

## Macro options

- `name` (required): icon name in PascalCase, e.g. `Search`
- `size` (optional): fixed icon size, `16`, `24`, or `32` (default: `24`)
- `responsiveSize` (optional): responsive icon size, `16`, `24`, or `32`; uses the toolkit iconography scale instead of a fixed size
- `title` (optional): accessible title. If omitted, icon is decorative (`aria-hidden="true"`)
- `color` (optional): CSS colour value applied to monochrome icons via `currentColor`
- `classes` (optional): additional class names
- `attributes` (optional): attribute map passed to the `<svg>` element
- `spritePath` (optional): sprite URL, defaults to `/assets/icons/icon-sprite.svg`

Use either `size` or `responsiveSize`, not both.

## Runtime asset requirement

The icon macro renders a browser URL like `/assets/icons/icon-sprite.svg#ofh-icon-Search`.

Installing `@ourfuturehealth/toolkit` puts the sprite file in `node_modules/@ourfuturehealth/toolkit/assets/icons/icon-sprite.svg`, but your app still needs to serve that file publicly for the browser. The usual setup is to copy it to `/assets/icons/icon-sprite.svg`.

If your app serves the toolkit sprite from a different public URL, pass that URL with `spritePath`.

## Sizing modes

- Fixed `size`
  - `16` stays `16`
  - `24` stays `24`
  - `32` stays `32`
- Responsive `responsiveSize`
  - `16` maps to `16 / 16 / 16` on mobile / tablet / desktop
  - `24` maps to `16 / 16 / 24`
  - `32` maps to `24 / 24 / 32`

## Example

```njk
{% from 'icon/macro.njk' import icon %}

{{ icon({
  "name": "Search",
  "size": 24,
  "title": "Search"
}) }}
```

```njk
{% from 'icon/macro.njk' import icon %}

{{ icon({
  "name": "Search",
  "responsiveSize": 24,
  "title": "Search"
}) }}
```
