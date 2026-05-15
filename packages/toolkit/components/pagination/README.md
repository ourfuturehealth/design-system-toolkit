# Pagination

## Guidance

> Icon migration: this component now renders icons using `components/icon/macro.njk` and the Material SVG sprite.
>
> The pagination link uses a 4px icon gap and a 4px focus outline offset to match the current design spec.


Find out more about the pagination component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/pagination).

## Quick start examples

### Pagination

[Preview the pagination component](https://ourfuturehealth.github.io/design-system-toolkit/components/pagination/index.html)

#### HTML markup

```html
<nav class="ofh-pagination" role="navigation" aria-label="Pagination">
  <ul class="ofh-list ofh-pagination__list">
    <li class="ofh-pagination-item--previous">
      <a class="ofh-pagination__link ofh-pagination__link--prev" href="/section/treatments">
        <span class="ofh-pagination__title">Previous</span>
        <span class="ofh-u-visually-hidden">:</span>
        <span class="ofh-pagination__page">Treatments</span>
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--ArrowLeft ofh-pagination__icon" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-ArrowLeft"></use>
        </svg>
      </a>
    </li>
    <li class="ofh-pagination-item--next">
      <a class="ofh-pagination__link ofh-pagination__link--next" href="/section/symptoms">
        <span class="ofh-pagination__title">Next</span>
        <span class="ofh-u-visually-hidden">:</span>
        <span class="ofh-pagination__page">Symptoms</span>
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--ArrowRight ofh-pagination__icon" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-ArrowRight"></use>
        </svg>
      </a>
    </li>
  </ul>
</nav>
```

#### Nunjucks macro

```
{% from 'components/pagination/macro.njk' import pagination %}

{{ pagination({
  "previousUrl": "/section/treatments",
  "previousPage": "Treatments",
  "nextUrl": "/section/symptoms",
  "nextPage": "Symptoms"
}) }}
```

---

### Next pagination

#### HTML markup

```html
<nav class="ofh-pagination" role="navigation" aria-label="Pagination">
  <ul class="ofh-list ofh-pagination__list">
    <li class="ofh-pagination-item--next">
      <a class="ofh-pagination__link ofh-pagination__link--next" href="/section/symptoms">
        <span class="ofh-pagination__title">Next</span>
        <span class="ofh-u-visually-hidden">:</span>
        <span class="ofh-pagination__page">Symptoms</span>
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--ArrowRight ofh-pagination__icon" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-ArrowRight"></use>
        </svg>
      </a>
    </li>
  </ul>
</nav>

```

#### Nunjucks macro

```
{% from 'components/pagination/macro.njk' import pagination %}

{{ pagination({
  "nextUrl": "/section/symptoms",
  "nextPage": "Symptoms"
}) }}
```

---

### Previous pagination

#### HTML markup

```html
<nav class="ofh-pagination" role="navigation" aria-label="Pagination">
  <ul class="ofh-list ofh-pagination__list">
    <li class="ofh-pagination-item--previous">
      <a class="ofh-pagination__link ofh-pagination__link--prev" href="/section/treatments">
        <span class="ofh-pagination__title">Previous</span>
        <span class="ofh-u-visually-hidden">:</span>
        <span class="ofh-pagination__page">Treatments</span>
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--ArrowLeft ofh-pagination__icon" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-ArrowLeft"></use>
        </svg>
      </a>
    </li>
  </ul>
</nav>

```

#### Nunjucks macro

```
{% from 'components/pagination/macro.njk' import pagination %}

{{ pagination({
  "previousUrl": "/section/treatments",
  "previousPage": "Treatments"
}) }}
```

---

### Nunjucks arguments

The pagination Nunjucks macro takes the following arguments:

| Name                | Type     | Required  | Description  |
| --------------------|----------|-----------|--------------|
| **previousUrl**     | string   | Yes       | The value of the previous link href attribute. |
| **previousPage**    | string   | Yes       | The text of the previous link. |
| **nextUrl**         | string   | Yes       | The value of the next link href attribute. |
| **nextPage**        | string   | Yes       | The text of the next link. |
| **classes**         | string   | No        | Optional additional classes to add to the pagination. Separate each class with a space. |
| **attributes**      | object   | No        | Any extra HTML attributes (for example data attributes) to add to the pagination. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
