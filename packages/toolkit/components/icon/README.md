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
