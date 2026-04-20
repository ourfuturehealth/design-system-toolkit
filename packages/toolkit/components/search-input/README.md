# Search input

Use the Search input component to let people submit a direct search request from a compact search field with an icon-only submit button.

The component owns the search control only. Empty states, "no results found" feedback, and results layout belong to the page or service using the component.

## Nunjucks macro

```njk
{% from 'components/search-input/macro.njk' import searchInput %}

{{ searchInput({
  "action": "/search",
  "label": {
    "text": "Search the site"
  },
  "input": {
    "id": "site-search",
    "name": "q",
    "placeholder": "Search"
  },
  "button": {
    "ariaLabel": "Search"
  }
}) }}
```

## HTML

```html
<form class="ofh-search-input" action="/search" method="get" role="search">
  <div class="ofh-search-input__field">
    <label class="ofh-u-visually-hidden" for="site-search">Search the site</label>
    <input
      class="ofh-search-input__input"
      id="site-search"
      name="q"
      placeholder="Search"
      type="search">
  </div>
  <button
    class="ofh-search-input__button"
    type="submit"
    aria-label="Search">
    <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--Search ofh-search-input__button-icon" aria-hidden="true" focusable="false" height="32" viewBox="0 0 24 24" width="32">
      <use href="/assets/images/icon-sprite.svg#ofh-icon-Search"></use>
    </svg>
  </button>
</form>
```

## Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | string | No | Form action URL for the submitted search request. |
| `method` | string | No | Form method. Defaults to `get`. |
| `label.text` | string | Yes | Accessible name for the search field. Rendered with the visually hidden utility. |
| `input.id` | string | No | Search field ID. Defaults to `search-input`. |
| `input.name` | string | No | Search field name. Defaults to `q`. |
| `input.value` | string | No | Initial search term value. |
| `input.placeholder` | string | No | Placeholder text shown in the field. Defaults to `Search`. |
| `input.attributes` | object | No | Additional HTML attributes for the search field. |
| `button.text` | string | No | Accessible button label fallback when `button.ariaLabel` is not provided. |
| `button.ariaLabel` | string | No | Accessible name for the icon-only submit button. Defaults to `Search`. |
| `button.attributes` | object | No | Additional HTML attributes for the submit button. |
| `classes` | string | No | Classes to add to the root form element. |
| `attributes` | object | No | Additional HTML attributes for the root form element. |

If you are using Nunjucks macros in production with `html` options, or ones ending with `html`, you must sanitise the HTML to protect against cross-site scripting exploits.
