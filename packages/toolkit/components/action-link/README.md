# Action link

## Guidance

> Compatibility note: this is now a legacy alias for the canonical `link-action` component surface.

Find out more about the canonical link action component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/link-action).

## Quick start example

[Preview the action link alias](https://ourfuturehealth.github.io/design-system-toolkit/components/action-link/index.html)

### Nunjucks macro

```njk
{% from 'components/action-link/macro.njk' import actionLink %}

{{ actionLink({
  "text": "Find a minor injuries unit",
  "href": "https://www.nhs.uk/service-search/minor-injuries-unit/locationsearch/551"
}) }}
```

This alias is retained for compatibility while the canonical implementation and documentation move to the `link-action` component.
