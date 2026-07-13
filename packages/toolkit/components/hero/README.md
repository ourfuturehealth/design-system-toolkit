# Hero

## Guidance

Hero is the canonical full-width page-introduction component. Toolkit owns the structure and styling, site consumes it, and React mirrors it.

Use Hero for the single primary introduction at the top of a page when users need a short message, optional supporting media, and at most one primary button plus one secondary text link.

### Preview examples

- [Hero all-actions free brand example](/design-example/components/hero/all-actions-free-brand/layout-default/)
- [Hero all-actions free dark example](/design-example/components/hero/all-actions-free-dark/layout-default/)
- [Hero all-actions free light example](/design-example/components/hero/all-actions-free-light/layout-default/)
- [Hero all-actions boxed brand example](/design-example/components/hero/all-actions-boxed-brand/layout-default/)
- [Hero all-actions boxed dark example](/design-example/components/hero/all-actions-boxed-dark/layout-default/)
- [Hero all-actions boxed light example](/design-example/components/hero/all-actions-boxed-light/layout-default/)
- [Hero single text-link free brand example](/design-example/components/hero/single-text-link-free-brand/layout-default/)
- [Hero single button free brand example](/design-example/components/hero/single-button-free-brand/layout-default/)
- [Hero no-actions free brand example](/design-example/components/hero/no-actions-free-brand/layout-default/)
- [Hero no-imagery free brand example](/design-example/components/hero/all-actions-no-imagery-free-brand/layout-default/)

### Nunjucks macro

```njk
{% from 'components/hero/macro.njk' import hero %}

{{ hero({
  "theme": "brand",
  "variant": "free",
  "heading": "Design and build digital products at Our Future Health",
  "description": "Information and guidelines to help everyone design and build consistent, highly considered products and services that put people first.",
  "secondaryAction": {
    "text": "Get started",
    "href": "/get-started"
  },
  "primaryAction": {
    "text": "View components",
    "href": "/design-system/components"
  },
  "image": {
    "src": "https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg",
    "alt": "Picture of allergic conjunctivitis",
    "srcset": "https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-640x427.jpg 640w, https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-767x511.jpg 767w",
    "sizes": "(min-width: 1020px) 50vw, 100vw"
  }
}) }}
```

### Notes

- `theme` defaults to `brand`
- `variant` defaults to `free`
- decoration is built with the Tile Pattern primitive and is on by default for the supported theme and variant combinations; set `showDecoration: false` to opt out
- Hero owns the default Tile Pattern rows, columns, placement and theme mapping. Keep that default unless a page or product needs a deliberately custom treatment.
- If you need a custom pattern, set `showDecoration: false`, render a separate Tile Pattern in the consuming layout, and own the positioning CSS in that layout. Pass the exact tile matrix, global colour, per-tile colour overrides and tile size needed by the custom treatment.
- `image` is optional; when it is missing, Hero renders as a text-only layout
- `headingLevel` defaults to `1`
- use `description` and `image` for supporting copy and media
- `secondaryAction` is a Hero-specific text link, not the Link action component
- if the image is decorative, set `decorative: true` and omit meaningful alt text

```njk
{% from 'components/hero/macro.njk' import hero %}
{% from 'components/tile-pattern/macro.njk' import tilePattern %}

<div class="custom-hero-shell">
  {{ hero({
    "heading": "Take part in health research",
    "description": "Help build a clearer picture of health across the UK.",
    "showDecoration": false
  }) }}

  {{ tilePattern({
    "classes": "custom-hero-shell__pattern",
    "color": "brand",
    "tileSize": "96px",
    "tiles": [
      [1, { "type": 2, "color": "transparent" }, 5],
      [null, { "type": 8, "color": "accent" }, 12]
    ]
  }) }}
</div>
```

### Nunjucks arguments

| Name | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| `theme` | string | No | Hero colour theme. Use `brand`, `dark`, or `light`. Defaults to `brand`. |
| `variant` | string | No | Hero containment variant. Use `free` or `boxed`. Defaults to `free`. |
| `heading` / `headingHtml` | string | Yes | Plain text or trusted HTML heading content. |
| `headingLevel` | number | No | Semantic heading level from `1` to `6`. Defaults to `1`. |
| `description` / `descriptionHtml` | string | No | Supporting copy below the heading. |
| `primaryAction` | object | No | Primary button configuration using toolkit Button fields such as `text`, `html`, `href`, `type`, `disabled`, and `attributes`. |
| `secondaryAction` | object | No | Secondary text-link configuration with `text` or `html`, required `href`, optional `openInNewWindow`, and optional `attributes`. |
| `image` | object | No | Media object with `src`, optional `srcset`, optional `sizes`, optional `alt`, and optional `decorative`. Set `decorative` to `true` only when the image adds no information; this renders an empty `alt` value and hides the image from assistive technology. |
| `showDecoration` | boolean | No | Set to `false` to disable decorative pattern treatment. |
| `element` | string | No | Root element override. Use `section` or `div`. Defaults to `section`. |
| `classes` | string | No | Classes to add to the Hero root. |
| `attributes` | object | No | HTML attributes to add to the Hero root. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
