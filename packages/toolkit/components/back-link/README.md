# Back link

## Guidance

> Compatibility note: this is now a legacy alias for the canonical `link-icon` component surface.


Find out more about the canonical link icon component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/link-icon).

## Quick start example

[Preview the back link component](https://ourfuturehealth.github.io/design-system-toolkit/components/back-link/index.html)

### HTML markup

```html
<div class="ofh-back-link ofh-link-icon ofh-link-icon--small ofh-link-icon--icon-left">
  <a class="ofh-back-link__link ofh-link-icon__link" href="#">
    <svg class="ofh-icon ofh-icon--material ofh-icon--16 ofh-icon--ChevronLeft ofh-back-link__icon ofh-link-icon__icon" aria-hidden="true" focusable="false" width="16" height="16">
      ...
    </svg>
    <span class="ofh-link-icon__text">Go back</span>
  </a>
</div>
```

### Nunjucks macro

```
{% from 'components/back-link/macro.njk' import backLink %}

{{ backLink({
  "href": "#",
  "text": "Go back"
}) }}
```

### Nunjucks arguments

The back link Nunjucks macro takes the following arguments:

| Name                | Type     | Required  | Description             |
| --------------------|----------|-----------|-------------------------|
| **text (or) html**  | string   | Yes       | Text or HTML to use within the back link component. If `html` is provided, the `text` argument will be ignored. |
| **href**            | string   | Yes       | The value of the link href attribute. |
| **classes**         | string   | No        | Optional additional classes to add to the root container. Separate each class with a space. |
| **attributes**      | object   | No        | Any extra HTML attributes (for example data attributes) to add to the anchor tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component is retained for compatibility while the canonical implementation and documentation move to the `link-icon` component.
