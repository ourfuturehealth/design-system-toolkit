# Button

## Guidance

Find out more about the button component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/buttons).

## Quick start examples

### Button

[Preview the button component](https://ourfuturehealth.github.io/design-system-toolkit/components/button/index.html)

#### HTML markup

```html
<button class="ofh-button ofh-button--contained" type="submit">
  Save and continue
</button>
```

Or can be used with link element
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
| **element**         | string   | No        | Whether to use an `input`, `button` or `a` element to create the button. In most cases you will not need to set this as it will be configured automatically if you use `href` or `html`. |
| **text (or) html**  | string   | Yes       | Text or HTML for the button or link. If `html` is provided, the `text` argument will be ignored and `element` will be automatically set to `button` unless `href` is also set, or it has already been defined. This argument has no effect if `element` is set to `input`.|
| **name**            | string   | Yes       | Name for the `input` or `button`. This has no effect on `a` elements. |
| **type**            | string   | Yes       | Type of `input` or `button` – `button`, `submit` or `reset`. Defaults to `submit`. This has no effect on `a` elements. |
| **value**           | string   | Yes       | Value for the `button` tag. This has no effect on `a` or `input` elements. |
| **disabled**        | boolean   | No       | Whether the button should be disabled. For button and input elements, `disabled` and `aria-disabled` attributes will be set automatically. |
| **href**           | string   | No       | The URL that the button should link to. If this is set, `element` will be automatically set to `a` if it has not already been defined. |
| **classes**         | string   | No        | Optional additional classes to add to the button element. Separate each class with a space. |
| **attributes**      | object   | No        | Any extra HTML attributes (for example data attributes) to add to the textarea tag. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Button component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/button) with a few minor adaptations.
