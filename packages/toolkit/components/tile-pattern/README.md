# Tile Pattern

Use the tile pattern as a decorative design-system primitive inside other components.

Tile patterns do not render a default layout. Components must pass the exact tile matrix they need.

```njk
{% from 'components/tile-pattern/macro.njk' import tilePattern %}

{{ tilePattern({
  "color": "brand",
  "tiles": [
    [1, 2, null],
    [7, { "type": 8, "color": "white" }, 9]
  ]
}) }}
```

## Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `tiles` | array | Yes | Two-dimensional tile matrix. Use Figma tile types `1` to `22`; use `null` for an empty tile. |
| `color` | string | No | Pattern colour. Use `brand`, `accent`, `accent-light`, `white`, or `transparent`. Defaults to `brand`. `accent` and `accent-light` follow the active participant or research theme; `brand`, `white`, and `transparent` are fixed. |
| `tileSize` | string | No | CSS length for each square tile. Defaults to `120px`. |
| `classes` | string | No | Additional classes to add to the pattern container. |
| `attributes` | object | No | Additional HTML attributes to add to the pattern container. |
| `spritePath` | string | No | Path to the tile-pattern sprite. Defaults to `/assets/tile-pattern/tile-pattern-sprite.svg`. |
