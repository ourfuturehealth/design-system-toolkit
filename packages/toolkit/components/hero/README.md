# Hero

## Quick start examples

### Hero with heading and content

[Preview the hero with heading and content component](https://ourfuturehealth.github.io/design-system-toolkit/components/hero/index.html)

#### HTML markup

```html
<section class="ofh-hero">
  <div class="ofh-width-container ofh-hero--border">
    <div class="ofh-grid-row">
      <div class="ofh-grid-column-two-thirds">
        <div class="ofh-hero__wrapper">
          <h1 class="ofh-u-margin-bottom-3">We’re here for you</h1>
          <p class="ofh-body-l ofh-u-margin-bottom-0">Helping you take control of your health and wellbeing.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Nunjucks macro

```
{% from 'components/hero/macro.njk' import hero %}

{{ hero({
"heading": "We’re here for you",
"text": "Helping you take control of your health and wellbeing."
}) }}
```

---

### Hero with image, heading and content

[Preview the hero with image, heading and content component](https://ourfuturehealth.github.io/design-system-toolkit/components/hero/hero-image-content.html)

#### HTML markup

```html
<section class="ofh-hero ofh-hero--image ofh-hero--image-description" style="background-image: url('https://assets.nhs.uk/prod/images/S_0818_homepage_hero_1_F0147446.width-1000.jpg');">
  <div class="ofh-hero__overlay">
    <div class="ofh-width-container">
      <div class="ofh-grid-row">
        <div class="ofh-grid-column-two-thirds">
          <div class="ofh-hero-content">
            <h1 class="ofh-u-margin-bottom-3">We’re here for you</h1>
            <p class="ofh-body-l ofh-u-margin-bottom-0">Helping you take control of your health and wellbeing.</p>
            <span class="ofh-hero__arrow" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Nunjucks macro

```
{% from 'components/hero/macro.njk' import hero %}

{{ hero({
  "heading": "We’re here for you",
  "text": "Helping you take control of your health and wellbeing.",
  "imageURL": "https://assets.nhs.uk/prod/images/S_0818_homepage_hero_1_F0147446.width-1000.jpg"
}) }}
```

---

### Hero with image only

[Preview the hero with image only component](https://ourfuturehealth.github.io/design-system-toolkit/components/hero/hero-image.html)

#### HTML markup

```html
<section class="ofh-hero ofh-hero--image" style="background-image: url('https://assets.nhs.uk/prod/images/S_0818_homepage_hero_1_F0147446.width-1000.jpg');">
  <div class="ofh-hero__overlay">
  </div>
</section>
```

#### Nunjucks macro

```
{% from 'components/hero/macro.njk' import hero %}

{{ hero({
  "imageURL": "https://assets.nhs.uk/prod/images/S_0818_homepage_hero_1_F0147446.width-1000.jpg"
}) }}
```

---

### Nunjucks arguments

The hero macro takes the following arguments:

| Name                       | Type     | Required  | Description  |
| ---------------------------|----------|-----------|--------------|
| **heading**                | string   | No        | Text heading of the hero component. |
| **text**                   | string   | No        | Text content of the hero component. |
| **imageURL**               | string   | No        | URL of the image of the hero component. |
| **classes**                | string   | No        | Optional additional classes to add to the hero container. Separate each class with a space. |
| **attributes**             | object   | No        | Any extra HTML attributes (for example data attributes) to add to the hero container. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
