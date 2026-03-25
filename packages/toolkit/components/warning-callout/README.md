# Warning callout

## Guidance

`warningCallout()` is deprecated and now acts as a compatibility wrapper around the Card family warning variant.

For current guidance and new implementations, use [Card / Callout](https://designsystem.ourfuturehealth.org.uk/design-system/components/card-callout).

## Migration

Before:

```njk
{% from 'components/warning-callout/macro.njk' import warningCallout %}

{{ warningCallout({
  heading: 'Important',
  HTML: '<p>Check the details in this section before you continue.</p>'
}) }}
```

After:

```njk
{% from 'components/card-callout/macro.njk' import cardCallout %}

{{ cardCallout({
  heading: 'Warning',
  variant: 'warning',
  html: '<p>Check the details in this section before you continue.</p>'
}) }}
```

The deprecated macro remains available for existing toolkit consumers, but it now renders the same updated markup and styling as `cardCallout({ variant: 'warning' })`.
