# Hero

## Guidance

Hero is the canonical full-width page-introduction component. Toolkit owns the structure and styling, site consumes it, and React mirrors it.

Use Hero for the single primary introduction at the top of a page when users need a short message, optional supporting media, and at most one primary button plus one secondary text link.

### Preview examples

- [Hero brand free example](/design-example/components/hero/default/layout-default/)
- [Hero dark free example](/design-example/components/hero/dark-free/layout-default/)
- [Hero brand boxed example](/design-example/components/hero/brand-boxed/layout-default/)
- [Hero dark boxed example](/design-example/components/hero/dark-boxed/layout-default/)
- [Hero secondary-action-only example](/design-example/components/hero/secondary-action-only/layout-default/)
- [Hero no-actions example](/design-example/components/hero/no-actions/layout-default/)
- [Hero text-only example](/design-example/components/hero/text-only/layout-default/)

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
- Hero owns the Tile Pattern rows, columns, placement and theme mapping; update the Hero implementation if a new treatment needs different tile types, colours or pattern dimensions
- `image` is optional; when it is missing, Hero renders as a text-only layout
- `headingLevel` defaults to `1`
- use `description` and `image` for supporting copy and media
- `secondaryAction` is a Hero-specific text link, not the Link action component
- if the image is decorative, set `decorative: true` and omit meaningful alt text

### Nunjucks arguments

| Name | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| `theme` | string | No | Hero colour theme. Use `brand` or `dark`. Defaults to `brand`. |
| `variant` | string | No | Hero containment variant. Use `free` or `boxed`. Defaults to `free`. |
| `heading` / `headingHtml` | string | Yes | Plain text or trusted HTML heading content. |
| `headingLevel` | number | No | Semantic heading level from `1` to `6`. Defaults to `1`. |
| `description` / `descriptionHtml` | string | No | Supporting copy below the heading. |
| `primaryAction` | object | No | Primary button configuration using toolkit Button fields such as `text`, `html`, `href`, `type`, `disabled`, and `attributes`. |
| `secondaryAction` | object | No | Secondary text-link configuration with `text` or `html`, required `href`, optional `openInNewWindow`, and optional `attributes`. |
| `image` | object | No | Media object with `src`, optional `srcset`, optional `sizes`, optional `alt`, and optional `decorative`. |
| `showDecoration` | boolean | No | Set to `false` to disable decorative pattern treatment. |
| `element` | string | No | Root element override. Use `section` or `div`. Defaults to `section`. |
| `classes` | string | No | Classes to add to the Hero root. |
| `attributes` | object | No | HTML attributes to add to the Hero root. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
