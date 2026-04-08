# Select

## Guidance

Find out more about the select component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/select).

## Quick start example

### HTML markup

```html
<div class="ofh-form-group">
  <div class="ofh-input__header">
    <label class="ofh-label ofh-label--s ofh-input__label" for="contact-method">
      Preferred contact method
    </label>
    <div class="ofh-hint ofh-input__hint" id="contact-method-hint">
      Choose how you would like us to contact you.
    </div>
  </div>
  <div class="ofh-select__wrapper">
    <select
      class="ofh-select"
      id="contact-method"
      name="contact-method"
      aria-describedby="contact-method-hint"
    >
      <option value="">Choose an option</option>
      <option value="email">Email</option>
      <option value="phone">Phone</option>
    </select>
    <span class="ofh-select__icon" aria-hidden="true">
      <!-- UnfoldMore icon -->
    </span>
  </div>
</div>
```

### Nunjucks macro

```njk
{% from 'components/select/macro.njk' import select %}

{{ select({
  "id": "contact-method",
  "name": "contact-method",
  "label": {
    "text": "Preferred contact method"
  },
  "hint": {
    "text": "Choose how you would like us to contact you."
  },
  "items": [
    {
      "value": "",
      "text": "Choose an option"
    },
    {
      "value": "email",
      "text": "Email"
    },
    {
      "value": "phone",
      "text": "Phone"
    }
  ]
}) }}
```

## Common options

- `items`: option data, including `value`, `text`, `selected`, `disabled`, and `attributes`.
- `label`, `hint`, and `errorMessage`: shared input-family supporting content.
- `describedBy`: extra IDs appended to `aria-describedby`.
- `formGroup.classes`: classes applied to the outer `.ofh-form-group`.
- `classes`: classes applied to the `<select>`.
- `attributes`: extra HTML attributes added to the `<select>`.

The macro renders the current decorative `UnfoldMore` icon inside `.ofh-select__wrapper`.

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend select component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/select).
