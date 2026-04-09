# Skip link

## Guidance

> Compatibility note: this is now a legacy alias for the canonical `link-skip` component surface.

Find out more about the canonical link skip component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/link-skip).

## Quick start example

[Preview the skip link alias](https://ourfuturehealth.github.io/design-system-toolkit/components/skip-link/index.html)

### Nunjucks macro

```njk
{% from 'components/skip-link/macro.njk' import skipLink %}

{{ skipLink({
  "href": "#maincontent",
  "text": "Skip to main content"
}) }}
```

This alias is retained for compatibility while the canonical implementation and documentation move to the `link-skip` component.
