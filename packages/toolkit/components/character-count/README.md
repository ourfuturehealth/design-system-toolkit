# Character Count

## Guidance

Find out more about the character component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/character-count).

## Quick start examples

### Character count - max characters

[Preview the character count component](https://designsystem.ourfuturehealth.org.uk/design-system/components/character-count/default/layout-default/)

#### HTML markup

```html
<div class="ofh-character-count" data-maxlength="200">
  <div class="ofh-form-group">
    <label class="ofh-label" for="more-detail">Can you provide more detail?</label>
    <div class="ofh-hint" id="more-detail-hint">
      Don&#39;t include personal or financial information, eg your National Insurance number or credit card details.
    </div>
    <textarea
      class="ofh-textarea ofh-js-character-count"
      id="more-detail"
      name="more-detail"
      rows="5"
      aria-describedby="more-detail-hint"></textarea>
  </div>

  <div class="ofh-hint ofh-character-count__message" id="more-detail-info">You can enter up to 200 characters</div>
</div>
```

### Character count - max words

[Preview the character count component]((https://designsystem.ourfuturehealth.org.uk/design-system/components/character-count/word-count/layout-default/)

#### HTML markup

```html
<div class="ofh-character-count" data-maxwords="200">
  <div class="ofh-form-group">
    <label class="ofh-label" for="more-detail">Can you provide more detail?</label>
    <div class="ofh-hint" id="more-detail-hint">
      Don&#39;t include personal or financial information, eg your National Insurance number or credit card details.
    </div>
    <textarea
      class="ofh-textarea ofh-js-character-count"
      id="more-detail"
      name="more-detail"
      rows="5"
      aria-describedby="more-detail-hint"></textarea>
  </div>

  <div class="ofh-hint ofh-character-count__message" id="more-detail-info">You can enter up to 200 words</div>
</div>
```

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Character Count component](https://github.com/alphagov/govuk-frontend/tree/main/packages/govuk-frontend/src/govuk/components/character-count) with a few minor adaptations.