# Autocomplete

Helps users choose answers from a list you provide.

## Guidance

Find out more about the autocomplete component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/auto-complete).

The authored markup starts as a standard input-family text field. JavaScript then enhances it into the accessible autocomplete experience and adds the suggestions heading to the dropdown when matches are available.

## Quick start example

### HTML markup

```html
<div class="ofh-js-autocomplete-element">
  <div class="ofh-form-group">
    <div class="ofh-input__header">
      <label class="ofh-label ofh-label--s ofh-input__label" for="organisation-name">
        Organisation name
      </label>
      <div class="ofh-hint ofh-input__hint" id="organisation-name-hint">
        Start typing to filter the list.
      </div>
    </div>
    <input class="ofh-input" id="organisation-name" name="organisation-name" type="text" aria-describedby="organisation-name-hint">
  </div>

  <div class="ofh-js-autocomplete-element-suggestions" data-default-value="" data-field-name="organisation-name"></div>
  <script>
    window.organisation_name_options = ["Cambridge", "Department of Health", "KCL", "OFH", "Oxford", "UCL", "University of York"];
  </script>
</div>
```

### Nunjucks macro

```njk
{% from 'components/auto-complete/macro.njk' import autoComplete %}

{{ autoComplete({
  "id": "organisation-name",
  "name": "organisation-name",
  "label": "Organisation name",
  "hint": {
    "text": "Start typing to filter the list."
  },
  "options": [
    "Cambridge",
    "Department of Health",
    "KCL",
    "OFH",
    "Oxford",
    "UCL",
    "University of York"
  ]
}) }}
```

## Common options

- `label`: plain-text label used for the input and no-results message.
- `hint` and `errorMessage`: shared input-family supporting content.
- `describedBy`: extra IDs appended to the input `aria-describedby`.
- `formGroup.classes`: classes applied to the outer `.ofh-form-group`.
- `classes`: classes applied to the enhanced autocomplete field. Width classes also constrain the suggestions dropdown.
- `attributes`: extra HTML attributes added to the enhanced autocomplete input.
- `options`: string options used to populate the suggestions list.
- `noResultsText`: optional custom message shown when the query has no matching suggestions.

## Thanks to the Government Digital Service (GDS)

This component uses the [GOV.UK Accessible Autocomplete component](https://github.com/alphagov/accessible-autocomplete).
