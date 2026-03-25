# Tag

## Guidance

Find out more about the tag component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/tag).

## Quick start example

[Preview the tag component](https://ourfuturehealth.github.io/design-system-toolkit/components/tag/index.html)

### Default tag

#### HTML markup

```html
<strong class="ofh-tag">
  Inactive
</strong>
```

#### Nunjucks macro

```
{% from 'components/tag/macro.njk' import tag %}

{{ tag({
  text: "Inactive"
})}}
```

### Canonical colour variants

See the full list of tag colours on the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/tag).

#### HTML markup

```html
<strong class="ofh-tag ofh-tag--brand">
  Beta
</strong>
```

#### Nunjucks macro

```
{% from 'components/tag/macro.njk' import tag %}

{{ tag({
  text: "Beta",
  classes: "ofh-tag--brand"
})}}
```

### Supported modifiers

- Default neutral: `ofh-tag`
- Explicit neutral: `ofh-tag--neutral`
- Brand: `ofh-tag--brand`
- Blue: `ofh-tag--blue`
- Green: `ofh-tag--green`
- Yellow: `ofh-tag--yellow`
- Red: `ofh-tag--red`

### Migration note

- `.ofh-tag` now renders the neutral style by default. If you previously relied on the old blue default, use `.ofh-tag.ofh-tag--blue`.
- `.ofh-tag--grey` is deprecated. Use `.ofh-tag--neutral` instead.

### Nunjucks arguments

The tag Nunjucks macro takes the following arguments:

| Name             | Type     | Required  | Description |
| -----------------|----------|-----------|-------------|
| text             | string   | Yes       | If `html` is set, this is not required. Text to use within the tag component. If `html` is provided, the `text` argument will be ignored. |
| html             | string   | Yes       | If `text` is set, this is not required. HTML to use within the tag component. If `html` is provided, the `text` argument will be ignored. |
| classes          | string   | No        | Optional additional classes to add to the tag. Use `ofh-tag--neutral`, `ofh-tag--brand`, `ofh-tag--blue`, `ofh-tag--green`, `ofh-tag--yellow`, or `ofh-tag--red` for the supported colour variants. `ofh-tag--grey` is deprecated. |
| attributes       | object   | No        | HTML attributes (for example data attributes) to add to the tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
