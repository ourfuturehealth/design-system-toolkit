# Date input

## Guidance

Find out more about the date input component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/date-input).

The component renders a grouped fieldset with separate day, month, and year inputs, using the shared input-family legend, hint, and error treatments.

## Quick start example

### HTML markup

```html
<div class="ofh-form-group">
  <fieldset class="ofh-fieldset" aria-describedby="dob-hint" role="group">
    <legend class="ofh-fieldset__legend ofh-fieldset__legend--s ofh-input__legend ofh-input__legend--with-supporting-text">
      What is your date of birth?
    </legend>
    <div class="ofh-input__header">
      <div class="ofh-hint ofh-input__hint" id="dob-hint">
        For example, 31 3 1980
      </div>
    </div>
    <div class="ofh-date-input" id="dob">
      <div class="ofh-date-input__item ofh-date-input__item--day">
        <label class="ofh-date-input__label" for="dob-day">Day</label>
        <input class="ofh-input ofh-date-input__input ofh-input--width-2" id="dob-day" name="dob-day" type="text" inputmode="numeric" pattern="[0-9]*">
      </div>
      <div class="ofh-date-input__item ofh-date-input__item--month">
        <label class="ofh-date-input__label" for="dob-month">Month</label>
        <input class="ofh-input ofh-date-input__input ofh-input--width-2" id="dob-month" name="dob-month" type="text" inputmode="numeric" pattern="[0-9]*">
      </div>
      <div class="ofh-date-input__item ofh-date-input__item--year">
        <label class="ofh-date-input__label" for="dob-year">Year</label>
        <input class="ofh-input ofh-date-input__input ofh-input--width-4" id="dob-year" name="dob-year" type="text" inputmode="numeric" pattern="[0-9]*">
      </div>
    </div>
  </fieldset>
</div>
```

### Nunjucks macro

```njk
{% from 'components/date-input/macro.njk' import dateInput %}

{{ dateInput({
  "id": "dob",
  "namePrefix": "dob",
  "fieldset": {
    "legend": {
      "text": "What is your date of birth?"
    }
  },
  "hint": {
    "text": "For example, 31 3 1980"
  },
  "items": [
    {
      "name": "day",
      "classes": "ofh-input--width-2"
    },
    {
      "name": "month",
      "classes": "ofh-input--width-2"
    },
    {
      "name": "year",
      "classes": "ofh-input--width-4"
    }
  ]
}) }}
```

## Common options

- `fieldset.legend`: question text and optional `isPageHeading` support.
- `hint` and `errorMessage`: shared supporting content shown above the fields.
- `describedBy`: extra IDs appended to the fieldset `aria-describedby`.
- `items[]`: per-field configuration including `name`, `label`, `classes`, `value`, `autocomplete`, `inputmode`, `pattern`, and `attributes`.
- `namePrefix`: prefix used when composing each field name.
- `formGroup.classes`: classes applied to the outer `.ofh-form-group`.
- `classes`: classes applied to the `.ofh-date-input` wrapper.

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend date input component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/date-input).
