# Inset text

## Guidance

Find out more about the inset text component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/inset-text).

## Quick start example

[Preview the inset text component](https://ourfuturehealth.github.io/design-system-toolkit/components/inset-text/index.html)

### HTML markup

```html
<div class="ofh-inset-text ofh-inset-text--info ofh-inset-text--background-grey">
  <h3 class="ofh-inset-text__heading">Information</h3>
  <div class="ofh-inset-text__body">
    <p>You can report any suspected side effect to the <a href="https://yellowcard.mhra.gov.uk/" title="External website">UK safety scheme</a>.</p>
  </div>
  <p class="ofh-inset-text__action">
    <a class="ofh-inset-text__action-link" href="https://yellowcard.mhra.gov.uk/">
      Report a side effect
    </a>
  </p>
</div>
```

### Nunjucks macro

If you’re using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://en.wikipedia.org/wiki/Cross-site_scripting). More about it in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

```
{% from 'components/inset-text/macro.njk' import insetText %}

{{ insetText({
  "heading": "Information",
  "variant": "info",
  "background": "grey",
  "html": "<p>You can report any suspected side effect to the <a href=\"https://yellowcard.mhra.gov.uk/\" title=\"External website\">UK safety scheme</a>.</p>",
  "actionLink": {
    "text": "Report a side effect",
    "href": "https://yellowcard.mhra.gov.uk/"
  }
}) }}
```

### Nunjucks arguments

The inset text Nunjucks macro takes the following arguments:

| Name                    | Type     | Required  | Description  |
| ------------------------|----------|-----------|--------------|
| **heading**             | string   | No        | Optional heading text shown above the body content. Ignored when `headingHtml` is provided. |
| **headingHtml**         | string   | No        | Trusted HTML for the heading contents. |
| **headingLevel**        | integer  | No        | Semantic heading level for the optional heading. Defaults to `3`. |
| **variant**             | string   | No        | Feedback border variant: `info`, `success`, `warning`, or `error`. Defaults to `info`. |
| **background**          | string   | No        | Background variant: `grey`, `yellow`, or `blue`. Defaults to `grey`. |
| **html**                | string   | No        | Trusted HTML content for the body. When this is provided, it replaces `text`. |
| **HTML**                | string   | No        | Deprecated alias for `html`, retained for backward compatibility. |
| **text**                | string   | No        | Plain text content for the body. Ignored if `html` is provided. |
| **actionLink**          | object   | No        | Optional action link shown below the body. Supports `text`, `href`, and `attributes`. |
| **visuallyHiddenText**  | string   | No        | Override for the hidden accessible prefix. Defaults to the variant label when there is no visible heading. |
| **classes**             | string   | No        | Optional additional classes to add to the inset text container. Separate each class with a space. |
| **attributes**          | object   | No        | Any extra HTML attributes (for example data attributes) to add to the inset text container. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
