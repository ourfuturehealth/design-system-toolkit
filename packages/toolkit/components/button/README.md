# Button

## Guidance

Find out more about the button component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/button).

## Quick start examples

### Button

[Preview the button component](https://ourfuturehealth.github.io/design-system-toolkit/components/button/index.html)

#### HTML markup

```html
<button class="ofh-button ofh-button--contained" type="submit">
  Save and continue
</button>
```

Or can be used with a link element.
```html
<a class="ofh-button ofh-button--contained" href="/">
  Save and continue
</a>
```

#### Nunjucks macro

```
{% from 'components/button/macro.njk' import button %}

{{ button({
  "text": "Save and continue"
}) }}
```

---

### Button as a link

[Preview the button as a link component](https://ourfuturehealth.github.io/design-system-toolkit/components/button/link.html)

#### HTML markup

```html
<a href="/" class="ofh-button ofh-button--text" draggable="false">
  Link button
</a>
```

#### Nunjucks macro

```
{% from 'components/button/macro.njk' import button %}

{{ button({
  "text": "Link button",
  "href": "/"
}) }}
```

---

#### Nunjucks macro

```
{% from 'components/button/macro.njk' import button %}

{{ button({
  "text": "Disabled button",
  "disabled": true
}) }}
```

---

#### Nunjucks macro

```
{% from 'components/button/macro.njk' import button %}

{{ button({
  "text": "Find my location",
  "classes": "ofh-button--contained"
}) }}
```

---

#### Nunjucks macro

```
{% from 'components/button/macro.njk' import button %}

{{ button({
  "text": "Save and continue",
  "classes": "ofh-button--outlined"
}) }}
```

### Nunjucks arguments

The button Nunjucks macro takes the following arguments:

| Name                | Type     | Required  | Description             |
| --------------------|----------|-----------|-------------------------|
| **element**         | string   | No        | Optional element override. In most cases you do not need this because the macro will render an anchor when you pass `href`, or a button when you pass `text` or `html`. |
| **text (or) html**  | string   | Yes       | Plain text or trusted HTML label content for the button or link. If `html` is provided, it replaces `text`. These arguments have no effect when `element` is set to `input`. |
| **name**            | string   | Yes       | Name attribute for `input` or `button` elements. This has no effect on anchors. |
| **type**            | string   | Yes       | Type of `input` or `button` element: `button`, `submit` or `reset`. Defaults to `submit`. This has no effect on anchors. |
| **value**           | string   | Yes       | Value for `button` elements. This has no effect on anchors or `input` elements. |
| **disabled**        | boolean  | No        | Whether the button should be disabled. For button and input elements, `disabled` and `aria-disabled` attributes will be set automatically. |
| **href**            | string   | No        | Navigation destination. When this is set, the macro will render an anchor unless you explicitly override `element`. |
| **classes**         | string   | No        | Optional additional classes to add to the root element. Separate each class with a space. |
| **attributes**      | object   | No        | Any extra HTML attributes (for example `data-*` or `aria-*` attributes) to add to the root element. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Button component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/button) with a few minor adaptations.
