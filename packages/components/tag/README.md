# Tag

## Guidance

Find out more about the tag component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/tag).

## Quick start example

[Preview the tag component](https://ourfuturehealth.github.io/design-system-toolkit/components/tag/index.html)

### Default tag

#### HTML markup

```html
<strong class="ofh-tag">
  Active
</strong>
```

#### Nunjucks macro

```
{% from 'components/tag/macro.njk' import tag %}

{{ tag({
  text: "Active"
})}}
```

### Additional tag colours

See the full list of tag colours on the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/tag).

#### HTML markup

```html
<strong class="ofh-tag ofh-tag--grey">
  Inactive
</strong>
```

#### Nunjucks macro

```
{% from 'components/tag/macro.njk' import tag %}

{{ tag({
  text: "Inactive",
  classes: "grey"
})}}
```

### Nunjucks arguments

The tag Nunjucks macro takes the following arguments:

| Name             | Type     | Required  | Description |
| -----------------|----------|-----------|-------------|
| text             | string   | Yes       | If `html` is set, this is not required. Text to use within the tag component. If `html` is provided, the `text` argument will be ignored. |
| html             | string   | Yes       | If `text` is set, this is not required. HTML to use within the tag component. If `html` is provided, the `text` argument will be ignored. |
| classes          | string   | No        | Optional additional classes to add to the tag. Separate each class with a space. |
| attributes         | object   | No        | HTML attributes (for example data attributes) to add to the tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
