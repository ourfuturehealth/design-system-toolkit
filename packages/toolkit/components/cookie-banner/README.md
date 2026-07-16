# Cookie Banner

## Guidance

Use Cookie Banner to ask a user whether the product can use analytics cookies. Render it where the product needs it. The component does not control placement, store consent, or load analytics.

The default copy and links match the OFH design. You can override the structured content when a product has approved content changes.

## Nunjucks macro

```njk
{% from 'components/cookie-banner/macro.njk' import cookieBanner %}

{{ cookieBanner({
  acceptAction: {
    attributes: {
      'data-cookie-choice': 'accept'
    }
  },
  rejectAction: {
    attributes: {
      'data-cookie-choice': 'reject'
    }
  }
}) }}
```

Both actions render as `type="button"`. Attach product-specific consent handling with button attributes such as `data-*`, `name`, or `value`.

### Custom body content

`bodyHtml` replaces the default message body. Avoid it unless the structured content options cannot meet an approved content need. It is trusted HTML, so consumers must never pass user-controlled content to it.

```njk
{{ cookieBanner({
  heading: 'Cookies on Example Service',
  bodyHtml: '<p>We use essential cookies to run this service.</p>',
  acceptAction: { text: 'Accept analytics' },
  rejectAction: { text: 'Reject analytics' }
}) }}
```

## Nunjucks arguments

| Name | Type | Description |
| --- | --- | --- |
| `heading` | string | Banner heading. Defaults to `Cookies on Our Future Health`. |
| `headingLevel` | integer | Semantic heading level from 1 to 6. Defaults to 2. |
| `essentialCookiesText` | string | First default body paragraph. |
| `analyticsCookiesText` | string | Second default body paragraph. |
| `privacyNotice` | object | Link object with `text`, `href`, and `attributes`. Opens in a new tab by default. |
| `cookiePolicy` | object | Link object with `text`, `href`, and `attributes`. Opens in a new tab by default. |
| `acceptAction` | object | Accept action with `text` and `attributes`. |
| `rejectAction` | object | Reject action with `text` and `attributes`. |
| `bodyHtml` | string | Trusted HTML that replaces the default body. Not recommended. |
| `idPrefix` | string | Prefix for the heading id used by `aria-labelledby`. |
| `classes` | string | Extra classes for the root element. |
| `attributes` | object | Extra attributes for the root element. |
