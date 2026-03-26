# Icon

Renders Material SVG icons from the toolkit sprite.

## Macro options

- `name` (required): icon name in PascalCase, e.g. `Search`
- `size` (optional): `16`, `24`, or `32` (default: `24`)
- `title` (optional): accessible title. If omitted, icon is decorative (`aria-hidden="true"`)
- `color` (optional): CSS colour value applied to monochrome icons via `currentColor`
- `classes` (optional): additional class names
- `attributes` (optional): attribute map passed to the `<svg>` element
- `spritePath` (optional): sprite URL, defaults to `/assets/icons/icon-sprite.svg`

## Example

```njk
{% from 'icon/macro.njk' import icon %}

{{ icon({
  "name": "Search",
  "size": 24,
  "title": "Search"
}) }}
```
