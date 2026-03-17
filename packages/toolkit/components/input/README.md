# Input

## Guidance

Find out more about the input component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/text-input).

## Quick start example

### HTML markup

```html
<div class="ofh-form-group">
  <div class="ofh-input__header">
    <label class="ofh-label ofh-label--s ofh-input__label" for="ni-number">
      National Insurance number
    </label>
    <div class="ofh-hint ofh-input__hint" id="ni-number-hint">
      It's on your National Insurance card, benefit letter, payslip or P60.
    </div>
  </div>
  <input
    class="ofh-input"
    id="ni-number"
    name="ni-number"
    type="text"
    aria-describedby="ni-number-hint"
  >
</div>
```

### Nunjucks macro

```njk
{% from 'components/input/macro.njk' import input %}

{{ input({
  "id": "ni-number",
  "name": "ni-number",
  "label": {
    "text": "National Insurance number"
  },
  "hint": {
    "text": "It's on your National Insurance card, benefit letter, payslip or P60."
  }
}) }}
```

## Common options

- `label`: label content and optional `isPageHeading` support.
- `hint`: supporting text rendered inside the shared `.ofh-input__header`.
- `errorMessage`: in-context validation message rendered above the input.
- `describedBy`: extra IDs appended to `aria-describedby`.
- `classes`: input classes such as width modifiers like `ofh-input--width-10`.
- `formGroup.classes`: classes applied to the outer `.ofh-form-group`.
- `attributes`: extra HTML attributes added to the input.

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend input component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/input).
