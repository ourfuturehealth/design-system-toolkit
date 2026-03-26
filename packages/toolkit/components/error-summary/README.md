# Error summary

## Guidance

Find out more about the error summary component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/error-summary).

## Quick start example

[Preview the error summary component](https://ourfuturehealth.github.io/design-system-toolkit/components/error-summary/index.html)

If you render more than one error summary on a page, pass `idPrefix` so each summary heading gets a unique `id`.

If you use `titleHtml`, `descriptionHtml`, or `errorList[].html`, only pass trusted or properly sanitised content. Do not pass untrusted user input directly into those HTML options.

### HTML markup

```html
<div
  class="ofh-error-summary"
  aria-labelledby="error-summary-title"
  role="alert"
>
  <h2 class="ofh-error-summary__title" id="error-summary-title">
    There is a problem
  </h2>
  <div class="ofh-error-summary__body">
    <p>Describe the errors and how to correct them</p>
    <ul class="ofh-list ofh-error-summary__list">
      <li>
        <a href="#example-error-1">Date of birth must be in the past</a>
      </li>
    </ul>
  </div>
</div>
```

### Nunjucks macro

```
{% from 'components/error-summary/macro.njk' import errorSummary %}

{{ errorSummary({
  "titleText": "There is a problem",
  "idPrefix": "error-summary-example",
  "descriptionText": "Describe the errors and how to correct them",
  "errorList": [
    {
      "text": "Date of birth must be in the past",
      "href": "#example-error-1"
    }
  ]
}) }}
```

## With multiple errors

[Preview the error summary component with multiple links](https://ourfuturehealth.github.io/design-system-toolkit/components/error-summary/multiple-errors.html)

### Nunjucks macro

```
{% from 'components/error-summary/macro.njk' import errorSummary %}

{{ errorSummary({
  "titleText": "There is a problem",
  "idPrefix": "multiple-errors",
  "errorList": [
    {
      "text": "Enter your first name",
      "href": "#first-name"
    },
    {
      "text": "Enter your last name",
      "href": "#last-name"
    }
  ]
}) }}
```

## With link to an input field

[Preview the error summary component with link to an input field](https://ourfuturehealth.github.io/design-system-toolkit/components/error-summary/linking-to-input.html)

### HTML markup

```html
<div
  class="ofh-error-summary"
  aria-labelledby="error-summary-title"
  role="alert"
>
  <h2 class="ofh-error-summary__title" id="error-summary-title">
    There is a problem
  </h2>
  <div class="ofh-error-summary__body">
    <p>
      Optional description of the errors and how to correct them.
    </p>
    <ul class="ofh-list ofh-error-summary__list">
      <li>
        <a href="#input-with-error-message"
          >Link to input error with explanation</a
        >
      </li>
    </ul>
  </div>
</div>

<div class="ofh-form-group ofh-form-group--error">
  <label class="ofh-label" for="input-with-error-message">
    National Insurance number
  </label>
  <div class="ofh-hint" id="input-with-error-message-hint">
    Clicking an error summary link should scroll the top of this input&#39;s
    label into view.
  </div>
  <span class="ofh-error-message" id="input-with-error-message-error">
    <span class="ofh-u-visually-hidden">Error:</span> Error message goes here
  </span>
  <input
    class="ofh-input ofh-input--error"
    id="input-with-error-message"
    name="test-name-3"
    type="text"
    aria-describedby="input-with-error-message-hint input-with-error-message-error"
  />
</div>
```

### Nunjucks macro

```
{% from 'components/error-summary/macro.njk' import errorSummary %}
{% from 'components/input/macro.njk' import input %}

{{ errorSummary({
  "titleText": "There is a problem",
  "descriptionHtml": "Optional description of the errors and how to correct them.",
  "errorList": [
    {
      "text": "Link to input error with explanation",
      "href": "#input-with-error-message"
    }
  ]
}) }}

{{ input({
  "label": {
    "text": "National Insurance number"
  },
  "hint": {
    "text": "Clicking an error summary link should scroll the top of this input's label into view."
  },
  "id": "input-with-error-message",
  "name": "test-name-3",
  "errorMessage": {
    "text": "Error message goes here"
  }
}) }}
```

## With link to a radio field

[Preview the error summary component with link to a radio field](https://ourfuturehealth.github.io/design-system-toolkit/components/error-summary/linking-to-radios.html)

### HTML markup

```html
<div
  class="ofh-error-summary"
  aria-labelledby="error-summary-title"
  role="alert"
>
  <h2 class="ofh-error-summary__title" id="error-summary-title">
    There is a problem
  </h2>
  <div class="ofh-error-summary__body">
    <p>
      Optional description of the errors and how to correct them.
    </p>
    <ul class="ofh-list ofh-error-summary__list">
      <li>
        <a href="#example-1"
          >Link to radio error with explanation (Note how it links to the first
          radio)</a
        >
      </li>
    </ul>
  </div>
</div>

<div class="ofh-form-group ofh-form-group--error">
  <fieldset
    class="ofh-fieldset"
    aria-describedby="example-hint example-error"
  >
    <legend class="ofh-fieldset__legend ofh-fieldset__legend--m">
      Have you changed your name?
    </legend>

    <div class="ofh-hint" id="example-hint">
      Clicking an error summary link should scroll the top of this radio
      fieldset into view.
    </div>

    <span class="ofh-error-message" id="example-error">
      <span class="ofh-u-visually-hidden">Error:</span> Please select an
      option
    </span>

    <div class="ofh-radios">
      <div class="ofh-radios__item">
        <input
          class="ofh-radios__input"
          id="example-1"
          name="radios-example"
          type="radio"
          value="yes"
        />
        <label class="ofh-label ofh-radios__label" for="example-1">
          Yes
        </label>
      </div>

      <div class="ofh-radios__item">
        <input
          class="ofh-radios__input"
          id="example-2"
          name="radios-example"
          type="radio"
          value="no"
        />
        <label class="ofh-label ofh-radios__label" for="example-2">
          No
        </label>
      </div>
    </div>
  </fieldset>
</div>
```

### Nunjucks macro

```
{% from 'components/error-summary/macro.njk' import errorSummary %}
{% from 'components/radios/macro.njk' import radios %}

{{ errorSummary({
  "titleText": "There is a problem",
  "descriptionHtml": "Optional description of the errors and how to correct them.",
  "errorList": [
    {
      "text": "Link to radio error with explanation (Note how it links to the first radio)",
      "href": "#example-1"
    }
  ]
}) }}

{{ radios({
  "idPrefix": "example",
  "name": "radios-example",
  "errorMessage": {
    "text": "Please select an option"
  },
  "fieldset": {
    "legend": {
      "text": "Have you changed your name?",
      "classes": "ofh-fieldset__legend--m"
    }
  },
  "hint": {
    "text": "Clicking an error summary link should scroll the top of this radio fieldset into view."
  },
  "items": [
    {
      "value": "yes",
      "text": "Yes"
    },
    {
      "value": "no",
      "text": "No"
    }
  ]
}) }}
```

### Nunjucks arguments

The error summary Nunjucks macro takes the following arguments:

| Name                                         | Type   | Required | Description                                                                                                                           |
| -------------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **titleText (or) titleHtml**                 | string | Yes      | Plain text or trusted HTML heading content for the summary. If `titleHtml` is provided, it replaces `titleText`. |
| **descriptionText (or) descriptionHtml**     | string | No       | Optional plain text or trusted HTML description shown below the heading. If `descriptionHtml` is provided, it replaces `descriptionText`. |
| **errorList**                                | object | Yes      | Contains an array of error link items and all their available arguments.                                                              |
| **errorList.{}.href**                        | string | No       | Href attribute for the error link item. If provided item will be an anchor.                                                           |
| **errorList.{}.text (or) errorList.{}.html** | string | No       | Plain text or trusted HTML for the error link item. If `html` is provided, it replaces `text`.                                     |
| **errorList.{}.attributes**                  | object | No       | Any extra HTML attributes (for example `data-*` attributes) to add to the error link anchor.                                              |
| **classes**                                  | string | No       | Optional additional classes to add to the root element. Separate each class with a space.                                  |
| **idPrefix**                                 | string | No       | Optional prefix used to generate the heading `id` referenced by `aria-labelledby`. Use it when rendering multiple summaries on a page. |
| **attributes**                               | object | No       | Any extra HTML attributes (for example `data-*` or `aria-*` attributes) to add to the root element.                                        |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).

## Thanks to the Government Digital Service (GDS)

This component and documentation has been taken from [GOV.UK Frontend - Error summary component](https://github.com/alphagov/govuk-frontend/tree/master/package/components/error-summary) with a few minor adaptations.
