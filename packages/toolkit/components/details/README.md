# Details

## Guidance

> Icon migration: this component now renders icons using `components/icon/macro.njk` and the Material SVG sprite.

Find out more about the details component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/details).

## Dependencies

For this component to be accessible and compatible with older browsers, include the required polyfill JavaScript. You can either include the compiled JavaScript for all components or just the polyfill JavaScript `details.js`.

## Quick start examples

### Details

[Preview the details component](https://ourfuturehealth.github.io/design-system-toolkit/components/details/index.html)

#### HTML markup

```html
<details class="ofh-details">
  <summary class="ofh-details__summary ofh-details__summary--details">
    <span class="ofh-details__summary-icon ofh-details__summary-icon--details-closed" aria-hidden="true">
      <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--ChevronRight ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
        <use href="/assets/icons/icon-sprite.svg#ofh-icon-ChevronRight"></use>
      </svg>
    </span>
    <span class="ofh-details__summary-icon ofh-details__summary-icon--details-open" aria-hidden="true">
      <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--ExpandMore ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
        <use href="/assets/icons/icon-sprite.svg#ofh-icon-ExpandMore"></use>
      </svg>
    </span>
    <span class="ofh-details__summary-text">Where can I find my NHS number?</span>
  </summary>
  <div class="ofh-details__text">
    <div class="ofh-details__panel ofh-details__panel--details">
      <p>An NHS number is a 10 digit number, like 485 777 3456.</p>
      <p>You can find your NHS number on any document sent to you by the NHS. This may include:</p>
      <ul>
        <li>prescriptions</li>
        <li>test results</li>
        <li>hospital referral letters</li>
        <li>appointment letters</li>
        <li>your NHS medical card</li>
      </ul>
      <p>Ask your GP practice for help if you can't find your NHS number.</p>
    </div>
  </div>
</details>
```

#### Nunjucks macro

```njk
{% from 'components/details/macro.njk' import details %}

{{ details({
  "text": "Where can I find my NHS number?",
  "HTML": "
  <p>An NHS number is a 10 digit number, like 485 777 3456.</p>
  <p>You can find your NHS number on any document sent to you by the NHS. This may include:</p>
  <ul>
    <li>prescriptions</li>
    <li>test results</li>
    <li>hospital referral letters</li>
    <li>appointment letters</li>
    <li>your NHS medical card</li>
  </ul>
  <p>Ask your GP practice for help if you can't find your NHS number.</p>
  "
}) }}
```

---

### Expander

[Preview the expander component](https://ourfuturehealth.github.io/design-system-toolkit/components/details/expander.html)

#### Guidance

Find out more about the expander component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/expander).

#### HTML markup

```html
<details class="ofh-details ofh-expander">
  <summary class="ofh-details__summary ofh-details__summary--expander">
    <span class="ofh-details__summary-icon ofh-details__summary-icon--expander-closed" aria-hidden="true">
      <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--AddCircle ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
        <use href="/assets/icons/icon-sprite.svg#ofh-icon-AddCircle"></use>
      </svg>
    </span>
    <span class="ofh-details__summary-icon ofh-details__summary-icon--expander-open" aria-hidden="true">
      <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--RemoveCircle ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
        <use href="/assets/icons/icon-sprite.svg#ofh-icon-RemoveCircle"></use>
      </svg>
    </span>
    <span class="ofh-details__summary-text">Opening times</span>
  </summary>
  <div class="ofh-details__text">
    <div class="ofh-details__panel ofh-details__panel--expander">
      <table>
        <tbody>
          <tr>
            <th><strong>Day of the week</strong></th>
            <th><strong>Opening hours</strong></th>
          </tr>
          <tr>
            <th>Monday</th>
            <td>9am to 6pm</td>
          </tr>
          <tr>
            <th>Tuesday</th>
            <td>9am to 6pm</td>
          </tr>
          <tr>
            <th>Wednesday</th>
            <td>9am to 6pm</td>
          </tr>
          <tr>
            <th>Thursday</th>
            <td>9am to 6pm</td>
          </tr>
          <tr>
            <th>Friday</th>
            <td>9am to 6pm</td>
          </tr>
          <tr>
            <th>Saturday</th>
            <td>9am to 1pm</td>
          </tr>
          <tr>
            <th>Sunday</th>
            <td>Closed</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</details>
```

#### Nunjucks macro

```njk
{% from 'components/details/macro.njk' import details %}

{{ details({
  "classes": "ofh-expander",
  "text": "Opening times",
  "HTML": "
  <table>
    <tbody>
      <tr>
        <th><strong>Day of the week</strong></th>
        <th><strong>Opening hours</strong></th>
      </tr>
      <tr>
        <th>Monday</th>
        <td>9am to 6pm</td>
      </tr>
      <tr>
        <th>Tuesday</th>
        <td>9am to 6pm</td>
      </tr>
      <tr>
        <th>Wednesday</th>
        <td>9am to 6pm</td>
      </tr>
      <tr>
        <th>Thursday</th>
        <td>9am to 6pm</td>
      </tr>
      <tr>
        <th>Friday</th>
        <td>9am to 6pm</td>
      </tr>
      <tr>
        <th>Saturday</th>
        <td>9am to 1pm</td>
      </tr>
      <tr>
        <th>Sunday</th>
        <td>Closed</td>
      </tr>
    </tbody>
  </table>"
}) }}
```

---

### Expander group

[Preview the expander group component](https://ourfuturehealth.github.io/design-system-toolkit/components/details/expander-group.html)

#### HTML markup

```html
<div class="ofh-expander-group">
  <details class="ofh-details ofh-expander">
    <summary class="ofh-details__summary ofh-details__summary--expander">
      <span class="ofh-details__summary-icon ofh-details__summary-icon--expander-closed" aria-hidden="true">
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--AddCircle ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-AddCircle"></use>
        </svg>
      </span>
      <span class="ofh-details__summary-icon ofh-details__summary-icon--expander-open" aria-hidden="true">
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--RemoveCircle ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-RemoveCircle"></use>
        </svg>
      </span>
      <span class="ofh-details__summary-text">How to measure your blood glucose levels</span>
    </summary>
    <div class="ofh-details__text">
      <div class="ofh-details__panel ofh-details__panel--expander">
        <p>Testing your blood at home is quick and easy, although it can be uncomfortable. It does get better.</p>
        <p>You would have been given:</p>
        <ul>
          <li>a blood glucose metre</li>
          <li>small needles called lancets</li>
          <li>a plastic pen to hold the lancets</li>
          <li>small test strips</li>
        </ul>
      </div>
    </div>
  </details>
  <details class="ofh-details ofh-expander">
    <summary class="ofh-details__summary ofh-details__summary--expander">
      <span class="ofh-details__summary-icon ofh-details__summary-icon--expander-closed" aria-hidden="true">
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--AddCircle ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-AddCircle"></use>
        </svg>
      </span>
      <span class="ofh-details__summary-icon ofh-details__summary-icon--expander-open" aria-hidden="true">
        <svg class="ofh-icon ofh-icon--material ofh-icon--32 ofh-icon--RemoveCircle ofh-details__summary-icon-svg" aria-hidden="true" focusable="false" width="32" height="32">
          <use href="/assets/icons/icon-sprite.svg#ofh-icon-RemoveCircle"></use>
        </svg>
      </span>
      <span class="ofh-details__summary-text">When to check your blood glucose level</span>
    </summary>
    <div class="ofh-details__text">
      <div class="ofh-details__panel ofh-details__panel--expander">
        <p>Try to check your blood:</p>
        <ul>
          <li>before meals</li>
          <li>2 to 3 hours after meals</li>
          <li>before, during (take a break) and after exercise</li>
        </ul>
        <p>This helps you understand your blood glucose levels and how they’re affected by meals and exercise. It should help you have more stable blood glucose levels.</p>
      </div>
    </div>
  </details>
</div>
```

#### Nunjucks macro

```njk
{% from 'components/details/macro.njk' import details %}

<div class="ofh-expander-group">
  {{ details({
    "classes": "ofh-expander",
    "text": "How to measure your blood glucose levels",
    "HTML": "
    <p>Testing your blood at home is quick and easy, although it can be uncomfortable. It does get better.</p>
    <p>You would have been given:</p>
    <ul>
      <li>a blood glucose metre</li>
      <li>small needles called lancets</li>
      <li>a plastic pen to hold the lancets</li>
      <li>small test strips</li>
    </ul>
    "
  }) }}
  {{ details({
    "classes": "ofh-expander",
    "text": "When to check your blood glucose level",
    "HTML": "
    <p>Try to check your blood:</p>
    <ul>
      <li>before meals</li>
      <li>2 to 3 hours after meals</li>
      <li>before, during (take a break) and after exercise</li>
    </ul>
    <p>This helps you understand your blood glucose levels and how they’re affected by meals and exercise. It should help you have more stable blood glucose levels.</p>
    "
  }) }}
</div>
```

---

### Nunjucks arguments

The details Nunjucks macro takes the following arguments:

| Name         | Type     | Required  | Description |
| -------------|----------|-----------|-------------|
| text         | string   | Yes       | Text shown in the summary link. |
| HTML         | string   | Yes       | HTML content shown when the component expands. |
| classes      | string   | No        | Optional additional classes to add to the root `<details>`. Separate each class with a space. |
| attributes   | object   | No        | Any extra HTML attributes (for example data attributes) to add to the root `<details>`. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html`, can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/XSS). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
