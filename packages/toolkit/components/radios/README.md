# Radios

## Guidance

Find out more about the radios component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/radios).

## Quick start example

### HTML markup

```html
<div class="ofh-form-group">
  <fieldset class="ofh-fieldset" aria-describedby="contact-hint">
    <legend class="ofh-fieldset__legend ofh-fieldset__legend--s ofh-input__legend ofh-input__legend--with-supporting-text">
      How should we contact you?
    </legend>
    <div class="ofh-input__header">
      <div class="ofh-hint ofh-input__hint" id="contact-hint">
        Choose one option.
      </div>
    </div>
    <div class="ofh-radios">
      <div class="ofh-radios__item">
        <div class="ofh-radios__row">
          <input class="ofh-radios__input" id="contact-1" name="contact" type="radio" value="email">
          <span class="ofh-radios__controller" aria-hidden="true">
            <span class="ofh-radios__dot"></span>
          </span>
          <label class="ofh-label ofh-radios__label" for="contact-1">
            Email
          </label>
        </div>
      </div>
      <div class="ofh-radios__item">
        <div class="ofh-radios__row">
          <input class="ofh-radios__input" id="contact-2" name="contact" type="radio" value="phone">
          <span class="ofh-radios__controller" aria-hidden="true">
            <span class="ofh-radios__dot"></span>
          </span>
          <label class="ofh-label ofh-radios__label" for="contact-2">
            Phone
          </label>
        </div>
      </div>
    </div>
  </fieldset>
</div>
```

### Nunjucks macro

```njk
{% from 'components/radios/macro.njk' import radios %}

{{ radios({
  "idPrefix": "contact",
  "name": "contact",
  "fieldset": {
    "legend": {
      "text": "How should we contact you?"
    }
  },
  "hint": {
    "text": "Choose one option."
  },
  "items": [
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

- `fieldset.legend`: question text and optional `isPageHeading` support.
- `hint` and `errorMessage`: shared supporting content shown above the items.
- `items[].hint`: optional hint text aligned under an individual item.
- `items[].conditional.html`: conditional reveal content shown when the radio is selected.
- `items[].divider`: divider text such as `or`.
- `items[].attributes`: extra HTML attributes added to the radio input.
- `formGroup.classes`, `classes`, and `attributes`: wrapper classes and attributes.

Conditional radio items use `aria-controls` to point to their reveal container. The current pattern does not add `aria-expanded` to the radio input.

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend radios component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/radios).
