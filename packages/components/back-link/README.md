# Back link

## Guidance

Find out more about the back link component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/back-link).

## Quick start example

[Preview the back link component](https://ourfuturehealth.github.io/design-system-toolkit/components/back-link/index.html)

### HTML markup

```html
<div class="ofh-back-link">
  <a class="ofh-back-link__link" href="#">
    <svg class="ofh-icon ofh-icon__chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" height="24" width="24">
      <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
    </svg>
    Go back
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
| **classes**         | string   | No        | Optional additional classes to add to the button element. Separate each class with a space. |
| **attributes**      | object   | No        | Any extra HTML attributes (for example data attributes) to add to the textarea tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Back link component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/back-link) with a few minor adaptations.
