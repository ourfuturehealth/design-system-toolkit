# Card Callout

## Guidance

Find out more about the Card / Callout component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/card-callout).

## Quick start example

[Preview the Card / Callout component](https://ourfuturehealth.github.io/design-system-toolkit/components/card-callout/index.html)

### Info callout

#### HTML markup

```html
<div class="ofh-card-callout ofh-card-callout--info">
  <h3 class="ofh-card-callout__label">Information</h3>
  <div class="ofh-card-callout__content">
    <div class="ofh-card-callout__spacer" aria-hidden="true"></div>
    <div class="ofh-card-callout__body">
      <p>This is additional context for the user.</p>
    </div>
  </div>
</div>
```

#### Nunjucks macro

```
{% from 'components/card-callout/macro.njk' import cardCallout %}

{{ cardCallout({
  heading: 'Information',
  variant: 'info',
  html: '<p>This is additional context for the user.</p>'
}) }}
```

### Nunjucks arguments

| Name                 | Type     | Required | Description |
| -------------------- | -------- | -------- | ----------- |
| heading              | string   | Yes      | Heading text for the callout. Ignored when `headingHtml` is provided. |
| headingHtml          | string   | No       | HTML to use inside the heading element. |
| headingLevel         | integer  | No       | Optional heading level. Default: `3`. |
| variant              | string   | No       | Visual variant: `info`, `error`, `success`, or `warning`. Default: `info`. |
| html                 | string   | No       | HTML content inside the callout body. |
| text                 | string   | No       | Plain text content inside the callout body. |
| classes              | string   | No       | Optional additional classes for the root element. |
| attributes           | object   | No       | Optional HTML attributes for the root element. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
