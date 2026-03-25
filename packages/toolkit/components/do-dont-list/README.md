# Do and don't list

## Guidance

`list()` is deprecated and now acts as a compatibility wrapper around the Card family do and don't component.

For current guidance and new implementations, use [Card / Do & Don’t](https://designsystem.ourfuturehealth.org.uk/design-system/components/card-do-dont).

## Migration

Before:

```njk
{% from 'components/do-dont-list/macro.njk' import list %}

{{ list({
  title: 'Do',
  type: 'tick',
  items: [
    { item: 'cover blisters that are likely to burst' }
  ]
}) }}
```

After:

```njk
{% from 'components/card-do-dont/macro.njk' import cardDoDont %}

{{ cardDoDont({
  type: 'do',
  items: [
    { item: 'cover blisters that are likely to burst' }
  ]
}) }}
```

The deprecated macro remains available for existing toolkit consumers, but it now renders the same updated markup and styling as `cardDoDont()`.
