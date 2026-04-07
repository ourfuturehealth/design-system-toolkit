# Action link

## Guidance

> Updated to match the latest Figma action-link treatment, including the new coloured circular arrow icon and the revised focus treatment.


Find out more about the action link component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/action-link).

## Quick start example

[Preview the action link component](https://ourfuturehealth.github.io/design-system-toolkit/components/action-link/index.html)

### HTML markup

```html
<div class="ofh-action-link">
  <a class="ofh-action-link__link" href="https://www.nhs.uk/service-search/minor-injuries-unit/locationsearch/551">
    <svg class="ofh-icon ofh-icon--material ofh-icon--responsive-32 ofh-icon--ArrowCircleRightColour ofh-action-link__icon" aria-hidden="true" focusable="false" width="32" height="32">
      ...
    </svg>
    <span class="ofh-action-link__text">Find a minor injuries unit</span>
  </a>
</div>
```

### Nunjucks macro

```
{% from 'components/action-link/macro.njk' import actionLink %}

{{ actionLink({
  "text": "Find a minor injuries unit",
  "href": "https://www.nhs.uk/service-search/minor-injuries-unit/locationsearch/551"
}) }}
```

### Nunjucks arguments

The action link Nunjucks macro takes the following arguments:

| Name             | Type     | Required  | Description |
| -----------------|----------|-----------|-------------|
| text             | string   | Yes       | Text to be displayed within the action link component. |
| href             | string   | Yes       | The value of the link href attribute |
| openInNewWindow  | boolean  | No        | If set to true, then the link will open in a new window |
| classes          | string   | No        | Optional additional classes to add to the anchor tag. Separate each class with a space. |
| attributes       | object   | No        | Any extra HTML attributes (for example data attributes) to add to the anchor tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
