# Hint

## Guidance

Find out more about the hint component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/hint-text).

## Quick start example

[Preview the hint component](https://ourfuturehealth.github.io/design-system-toolkit/components/hint/index.html)

### HTML markup

```html
<div class="ofh-hint">
  It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.
</div>
```

### Nunjucks macro

```
{% from 'components/hint/macro.njk' import hint %}

{{ hint({
  "text": "It’s on your National Insurance card, benefit letter, payslip or P60.\nFor example, ‘QQ 12 34 56 C’.\n"
}) }}
```

### Nunjucks arguments

The hint Nunjucks macro takes the following arguments:

| Name                    | Type     | Required  | Description             |
| ------------------------|----------|-----------|-------------------------|
| **text or (html) html** | string   | Yes       | Text or HTML to use within the hint. If `html` is provided, the `text` argument will be ignored. |
| **id**                  | string   | Yes       | Optional id attribute to add to the hint div tag. |
| **classes**             | string   | No        | Optional additional classes to add to the hint div tag. Separate each class with a space. |
| **attributes**          | object   | No        | Any extra HTML attributes (for example data attributes) to add to the input component. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Hint component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/hint) with a few minor adaptations.
