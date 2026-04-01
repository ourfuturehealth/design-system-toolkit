# Character Count

## Guidance

Find out more about the character count component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/character-count).

## Quick start example

### HTML markup

```html
<div class="ofh-character-count" data-maxlength="200">
  <div class="ofh-form-group">
    <div class="ofh-input__header">
      <label class="ofh-label ofh-label--s ofh-input__label" for="more-detail">
        Can you provide more detail?
      </label>
      <div class="ofh-hint ofh-input__hint" id="more-detail-hint">
        Do not include personal or financial information.
      </div>
    </div>
    <textarea
      class="ofh-textarea ofh-js-character-count"
      id="more-detail"
      name="more-detail"
      rows="4"
      aria-describedby="more-detail-hint more-detail-info"
    ></textarea>
    <div class="ofh-hint ofh-character-count__message" id="more-detail-info">
      You can enter up to 200 characters
    </div>
  </div>
</div>
```

### Nunjucks macro

```njk
{% from 'components/character-count/macro.njk' import characterCount %}

{{ characterCount({
  "id": "more-detail",
  "name": "more-detail",
  "maxlength": 200,
  "label": {
    "text": "Can you provide more detail?"
  },
  "hint": {
    "text": "Do not include personal or financial information."
  }
}) }}
```

## Common options

- `maxlength`: maximum number of characters allowed.
- `maxwords`: word-count mode instead of character-count mode.
- `threshold`: percentage at which the visible status message appears.
- `countMessage.classes`: classes added to the static count message that seeds the enhanced UI.
- `label`, `hint`, `errorMessage`, `describedBy`, `rows`, `classes`, and `attributes`: passed through to the textarea pattern.

The JavaScript enhancement creates the live visible status and screen-reader status messages, and adds textarea error styling when the user goes over the configured limit.

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend character count component](https://github.com/alphagov/govuk-frontend/tree/main/packages/govuk-frontend/src/govuk/components/character-count).
