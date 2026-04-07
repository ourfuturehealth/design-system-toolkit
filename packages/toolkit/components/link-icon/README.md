# Link icon

## Guidance

Use link icons for prominent navigation links that need a clear directional or external-action cue.

Find out more about the link icon component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/link-icon).

## Quick start example

[Preview the link icon component](https://ourfuturehealth.github.io/design-system-toolkit/components/link-icon/index.html)

### HTML markup

```html
<div class="ofh-link-icon ofh-link-icon--small ofh-link-icon--icon-left">
  <a class="ofh-link-icon__link" href="#">
    <svg class="ofh-icon ofh-icon--material ofh-icon--16 ofh-icon--ChevronLeft ofh-link-icon__icon" aria-hidden="true" focusable="false" width="16" height="16">
      ...
    </svg>
    <span class="ofh-link-icon__text">Go back</span>
  </a>
</div>
```

### Nunjucks macro

```
{% from 'components/link-icon/macro.njk' import linkIcon %}

{{ linkIcon({
  "href": "#",
  "text": "Go back",
  "iconName": "ChevronLeft",
  "iconPosition": "left",
  "size": "small"
}) }}
```

### Nunjucks arguments

The link icon Nunjucks macro takes the following arguments:

| Name             | Type     | Required | Description |
| -----------------|----------|----------|-------------|
| text             | string   | No       | Text to display inside the link icon component. |
| html             | string   | No       | HTML to display inside the link icon component. If provided, `text` is ignored. |
| href             | string   | Yes      | The value of the link href attribute. |
| iconName         | string   | No       | Toolkit icon name to render. Defaults to `ChevronLeft` for left icons and `Launch` for right icons. |
| iconPosition     | string   | No       | Icon placement relative to the text. Use `left` or `right`. Defaults to `left`. |
| size             | string   | No       | Icon/text sizing. Use `small` or `medium`. Defaults to `small`. |
| openInNewWindow   | boolean  | No       | If set to true, then the link will open in a new window. |
| classes          | string   | No       | Optional additional classes to add to the root container. |
| attributes      | object   | No       | Any extra HTML attributes (for example data attributes) to add to the anchor tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
