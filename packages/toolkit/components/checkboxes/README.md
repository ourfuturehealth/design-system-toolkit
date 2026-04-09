# Checkboxes

## Guidance

Find out more about the checkboxes component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/checkboxes).

## Quick start example

### HTML markup

```html
<div class="ofh-form-group">
  <fieldset class="ofh-fieldset" aria-describedby="nationality-hint">
    <legend class="ofh-fieldset__legend ofh-fieldset__legend--s ofh-input__legend ofh-input__legend--with-supporting-text">
      What is your nationality?
    </legend>
    <div class="ofh-input__header">
      <div class="ofh-hint ofh-input__hint" id="nationality-hint">
        If you have more than 1 nationality, select all options that are relevant to you.
      </div>
    </div>
    <div class="ofh-checkboxes">
      <div class="ofh-checkboxes__item">
        <div class="ofh-checkboxes__row">
          <input class="ofh-checkboxes__input" id="nationality-1" name="nationality" type="checkbox" value="british">
          <span class="ofh-checkboxes__controller" aria-hidden="true">
            <!-- Check icon -->
          </span>
          <label class="ofh-label ofh-checkboxes__label" for="nationality-1">
            British
          </label>
        </div>
      </div>
      <div class="ofh-checkboxes__item">
        <div class="ofh-checkboxes__row">
          <input class="ofh-checkboxes__input" id="nationality-2" name="nationality" type="checkbox" value="irish">
          <span class="ofh-checkboxes__controller" aria-hidden="true">
            <!-- Check icon -->
          </span>
          <label class="ofh-label ofh-checkboxes__label" for="nationality-2">
            Irish
          </label>
        </div>
      </div>
    </div>
  </fieldset>
</div>
```

### Nunjucks macro

```njk
{% from 'components/checkboxes/macro.njk' import checkboxes %}

{{ checkboxes({
  "idPrefix": "nationality",
  "name": "nationality",
  "fieldset": {
    "legend": {
      "text": "What is your nationality?"
    }
  },
  "hint": {
    "text": "If you have more than 1 nationality, select all options that are relevant to you."
  },
  "items": [
    {
      "value": "british",
      "text": "British"
    },
    {
      "value": "irish",
      "text": "Irish"
    }
  ]
}) }}
```

## Common options

- `fieldset.legend`: question text and optional `isPageHeading` support.
- `hint` and `errorMessage`: shared supporting content shown above the items.
- `items[].hint`: optional hint text aligned under an individual item.
- `items[].conditional.html`: conditional reveal content shown when the checkbox is checked.
- `items[].divider`: divider text such as `or`.
- `items[].exclusive` and `items[].exclusiveGroup`: support "None of these" style exclusive behavior.
- `items[].attributes`: extra HTML attributes added to the checkbox input.
- `formGroup.classes`, `classes`, and `attributes`: wrapper classes and attributes.

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend checkboxes component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/checkboxes).
