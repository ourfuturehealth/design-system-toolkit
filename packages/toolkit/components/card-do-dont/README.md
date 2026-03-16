# Card Do & Don’t

## Guidance

Find out more about the Card / Do & Don’t component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/card-do-dont).

## Quick start example

[Preview the Card / Do & Don’t component](https://ourfuturehealth.github.io/design-system-toolkit/components/card-do-dont/index.html)

### Do card

#### HTML markup

```html
<div class="ofh-card-do-dont ofh-card-do-dont--do">
  <h3 class="ofh-card-do-dont__label">Do</h3>
  <div class="ofh-card-do-dont__content">
    <div class="ofh-card-do-dont__spacer" aria-hidden="true"></div>
    <div class="ofh-card-do-dont__body">
      <ul class="ofh-card-do-dont__items">
        <li class="ofh-card-do-dont__item">
          <svg class="ofh-card-do-dont__icon ofh-card-do-dont__icon--do" aria-hidden="true"></svg>
          <span class="ofh-card-do-dont__item-text">cover blisters that are likely to burst</span>
        </li>
      </ul>
    </div>
  </div>
</div>
```

#### Nunjucks macro

```
{% from 'components/card-do-dont/macro.njk' import cardDoDont %}

{{ cardDoDont({
  type: 'do',
  items: [
    { item: 'cover blisters that are likely to burst' }
  ]
}) }}
```

### Nunjucks arguments

| Name                 | Type     | Required | Description |
| -------------------- | -------- | -------- | ----------- |
| type                 | string   | No       | Visual type: `do` or `dont`. Default: `do`. |
| heading              | string   | No       | Optional label text shown in the navy heading block. Defaults to `Do` or `Don’t` from `type`. |
| headingLevel         | integer  | No       | Optional semantic heading level for the label. Default: `3`. This changes the HTML heading tag, not the visual styling. |
| items                | array    | Yes      | Array of item objects with an `item` string. |
| classes              | string   | No       | Optional additional classes for the root element. |
| attributes           | object   | No       | Optional HTML attributes for the root element, for example an `id`, `data-*` attribute or `aria-*` attribute. |

### Deprecated compatibility API

`hidePrefix` remains available for existing toolkit consumers that still need the legacy `do not` wording on don’t items, but new work should use the default output and omit it.
