# Textarea

## Guidance

Find out more about the textarea component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/textarea).

## Quick start example

### HTML markup

```html
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
      class="ofh-textarea"
      id="more-detail"
      name="more-detail"
      rows="4"
      aria-describedby="more-detail-hint"
    ></textarea>
</div>
```

### Nunjucks macro

```njk
{% from 'components/textarea/macro.njk' import textarea %}

{{ textarea({
  "id": "more-detail",
  "name": "more-detail",
  "label": {
    "text": "Can you provide more detail?"
  },
  "hint": {
    "text": "Do not include personal or financial information."
  }
}) }}
```

## Common options

- `rows`: visible row count. Defaults to `4`.
- `label`: label content and optional `isPageHeading` support.
- `hint`: supporting text rendered inside the shared `.ofh-input__header`.
- `errorMessage`: in-context validation message rendered above the textarea.
- `describedBy`: extra IDs appended to `aria-describedby`.
- `classes`: textarea classes.
- `formGroup.classes`: classes applied to the outer `.ofh-form-group`.
- `attributes`: extra HTML attributes added to the textarea.

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been adapted from the [GOV.UK Frontend textarea component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/textarea).
