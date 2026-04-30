# Header

Use Header for top-level OFH branding, primary navigation, global actions, and account access.

## Nunjucks

```njk
{% from 'header/macro.njk' import header %}

{{ header({
  "theme": "dark",
  "brand": {
    "href": "/",
    "ariaLabel": "Our Future Health home",
    "nhsLogo": "england"
  },
  "utilityLinks": [
    {
      "href": "/docs",
      "label": "View docs",
      "openInNewWindow": true
    }
  ],
  "search": {
    "action": "/search",
    "label": {
      "text": "Search the site"
    },
    "input": {
      "id": "header-search"
    }
  },
  "action": {
    "href": "/join",
    "label": "Join now"
  },
  "account": {
    "type": "sign-in",
    "href": "/sign-in"
  },
  "navigation": [
    {
      "href": "/about",
      "label": "About"
    },
    {
      "label": "Research",
      "items": [
        {
          "href": "/research/participant-portal",
          "label": "Participant portal"
        },
        {
          "href": "/research/data-access",
          "label": "Data access"
        }
      ]
    }
  ]
}) }}
```

## API

- `theme`: `dark`, `light`, or `brand`. Defaults to `dark`.
- `layout`: `capped` or `fluid`. Defaults to `capped`.
- `brand`: required. Defines the linked OFH brand block with `href`, `ariaLabel`, and optional `nhsLogo` using `england`, `scotland`, `wales`, or `northern-ireland`.
- `utilityLinks`: optional top-bar links.
- `search`: optional search configuration using the same shape as `search-input`.
- `action`: optional standalone middle-row action link.
- `account`: optional account state. Use either `{ type: 'sign-in', href }` or `{ type: 'account', accountHref, signOutHref }`.
- `navigation`: optional primary navigation. Each item is either `{ href, label }` or `{ label, items: [...] }`.
- `idPrefix`: optional prefix for generated disclosure IDs when multiple headers appear on the same page.

## Notes

- The mobile menu button reuses existing button styling patterns. Dark uses the inverted bordered treatment, while light and brand use the standard outlined treatment.
- The Header reuses `search-input` and the shared `icon` component. The OFH brand block is an internal Header implementation detail.
- Storybook and docs should treat builder-only toggles as story-only helpers, not as part of the public API.
