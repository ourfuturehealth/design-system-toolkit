# Fieldset

## Guidance

Find out more about the fieldset component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/fieldset).

## Quick start examples

### Fieldset

[Preview the fieldset component](https://ourfuturehealth.github.io/design-system-toolkit/components/fieldset/index.html)

Use the default fieldset pattern when you need to group related inputs under a shared question or section heading, but that grouped question is not the main page heading.

#### HTML markup

```html
<fieldset class="ofh-fieldset">
  <legend class="ofh-fieldset__legend">
    What is your address?
  </legend>
</fieldset>
```

#### Nunjucks macro

```
{% from 'components/fieldset/macro.njk' import fieldset %}

{{ fieldset({
  "legend": {
    "text": "What is your address?"
  }
}) }}
```

---

### Fieldset as page heading

[Preview the fieldset as page heading component](https://ourfuturehealth.github.io/design-system-toolkit/components/fieldset/page-heading.html)

Use this pattern when the grouped question is the main purpose of the page. The legend becomes the page heading, so screen reader users only hear that wording once.

#### HTML markup

```html
<fieldset class="ofh-fieldset">
  <legend class="ofh-fieldset__legend ofh-fieldset__legend--l">
    <h1 class="ofh-fieldset__heading">
      What is your address?
    </h1>
  </legend>
</fieldset>
```

#### Nunjucks macro

```
{% from 'components/fieldset/macro.njk' import fieldset %}

{{ fieldset({
  "legend": {
    "text": "What is your address?",
    "classes": "ofh-fieldset__legend--l",
    "isPageHeading": true
  }
}) }}
```

---

### Fieldset with input fields

[Preview the fieldset component with input fields](https://ourfuturehealth.github.io/design-system-toolkit/components/fieldset/with-inputs.html)

Use a fieldset around grouped text inputs when they all answer the same question. Address fields are a common example.


#### HTML markup

```html
<fieldset class="ofh-fieldset">
  <legend class="ofh-fieldset__legend ofh-fieldset__legend--l">
    <h1 class="ofh-fieldset__heading">
      What is your address?
    </h1>
  </legend>
  <div class="ofh-form-group">
    <label class="ofh-label" for="input-address1">
      Building and street <span class="ofh-u-visually-hidden">line 1 of 2</span>
    </label>
    <input class="ofh-input" id="input-address1" name="address1" type="text">
  </div>
  <div class="ofh-form-group">
    <label class="ofh-label" for="input-address2">
      <span class="ofh-u-visually-hidden">Building and street line 2 of 2</span>
    </label>
    <input class="ofh-input" id="input-address2" name="address2" type="text">
  </div>
  <div class="ofh-form-group">
    <label class="ofh-label" for="input-town-city">
      Town or city
    </label>
    <input class="ofh-input ofh-u-width-two-thirds" id="input-town-city" name="town" type="text">
  </div>
  <div class="ofh-form-group">
    <label class="ofh-label" for="input-county">
      County
    </label>
    <input class="ofh-input ofh-u-width-two-thirds" id="input-county" name="county" type="text">
  </div>
  <div class="ofh-form-group">
    <label class="ofh-label" for="input-postcode">
      Postcode
    </label>
    <input class="ofh-input ofh-input--width-10" id="input-postcode" name="postcode" type="text">
  </div>
</fieldset>

```

#### Nunjucks macro

To add input fields inside the fieldset, use the `call` block.

```
{% from 'components/input/macro.njk' import input %}
{% from 'components/fieldset/macro.njk' import fieldset %}

{% call fieldset({
  legend: {
    text: "What is your address?",
    "classes": "ofh-fieldset__legend--l"
  }
}) %}

  {{ input({
    "label": {
      "html": 'Building and street <span class="ofh-u-visually-hidden">line 1 of 2</span>'
    },
    "id": "input-address1",
    "name": "address1"
  }) }}

  {{ input({
    "label": {
      "html": '<span class="ofh-u-visually-hidden">Building and street line 2 of 2</span>'
    },
    "id": "input-address2",
    "name": "address2"
  }) }}

  {{ input({
    "label": {
      "text": "Town or city"
    },
    "classes": "ofh-u-width-two-thirds",
    "id": "input-town-city",
    "name": "town"
  }) }}

  {{ input({
    "label": {
      "text": "Postcode"
    },
    "classes": "ofh-input--width-10",
    "id": "input-postcode",
    "name": "postcode"
  }) }}

{% endcall %}
```

---

### Fieldset with additional description

Use `describedBy` when supporting text sits outside the fieldset but still needs to be announced together with the grouped question.

#### HTML markup

```html
<p class="ofh-hint" id="contact-details-hint">
  We will only use these details to contact you about your application.
</p>

<fieldset class="ofh-fieldset" aria-describedby="contact-details-hint">
  <legend class="ofh-fieldset__legend ofh-fieldset__legend--m">
    Contact details
  </legend>

  <div class="ofh-form-group">
    <label class="ofh-label" for="input-email">
      Email address
    </label>
    <input class="ofh-input ofh-u-width-three-quarters" id="input-email" name="email" type="email">
  </div>

  <div class="ofh-form-group">
    <label class="ofh-label" for="input-phone">
      Phone number
    </label>
    <input class="ofh-input ofh-u-width-two-thirds" id="input-phone" name="phone" type="tel">
  </div>
</fieldset>
```

#### Nunjucks macro

```
{% from 'components/input/macro.njk' import input %}
{% from 'components/fieldset/macro.njk' import fieldset %}

<p class="ofh-hint" id="contact-details-hint">
  We will only use these details to contact you about your application.
</p>

{% call fieldset({
  describedBy: "contact-details-hint",
  legend: {
    text: "Contact details",
    classes: "ofh-fieldset__legend--m"
  }
}) %}

  {{ input({
    "label": {
      "text": "Email address"
    },
    "classes": "ofh-u-width-three-quarters",
    "id": "input-email",
    "name": "email",
    "type": "email"
  }) }}

  {{ input({
    "label": {
      "text": "Phone number"
    },
    "classes": "ofh-u-width-two-thirds",
    "id": "input-phone",
    "name": "phone",
    "type": "tel"
  }) }}

{% endcall %}
```

---

### Nunjucks arguments

The fieldset Nunjucks macro takes the following arguments:

| Name                    | Type     | Required  | Description             |
| ------------------------|----------|-----------|-------------------------|
| **describedBy**         | string   | No        | Element ID or IDs to add to the `aria-describedby` attribute when supporting text sits outside the fieldset but still needs to be announced with the group. |
| **legend**              | object   | No        | Arguments for the legend. |
| **legend.{}.text (or) legend.{}.html**  | string   | No        | Legend text or HTML. Use `html` when you need inline markup such as visually hidden text. If `html` is provided, the `text` argument will be ignored. |
| **legend.{}.classes**   | string   | No        | Optional additional classes to add to the legend container. Use the built-in size modifiers `ofh-fieldset__legend--s`, `--m`, `--l`, or `--xl` to match the question hierarchy. |
| **legend.{}.isPageHeading**  | boolean   | No  | Whether the legend also acts as the heading for the page. |
| **classes**             | string   | No        | Optional additional classes to add to the fieldset container. Separate each class with a space. |
| **attributes**          | object   | No        | Any extra HTML attributes (for example data attributes, IDs, or ARIA attributes) to add to the fieldset container. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Fieldset component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/fieldset) with a few minor adaptations.
