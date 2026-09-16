# Progress Indicator

## Guidance

Use the progress indicator to show users how far through a multi-step process (for example, a multi-page form) they are.

## Quick start example

### Default progress indicator

#### HTML markup

```html
<div class="ofh-progress-indicator">
  <div class="ofh-progress-indicator__header">
    <span class="ofh-progress-indicator__label">Personal details</span>
    <span class="ofh-progress-indicator__steps">Page 2 of 8</span>
  </div>
  <div
    class="ofh-progress-indicator__track"
    role="progressbar"
    aria-valuenow="2"
    aria-valuemin="0"
    aria-valuemax="8"
    aria-valuetext="Page 2 of 8"
  >
    <span class="ofh-progress-indicator__segment ofh-progress-indicator__segment--filled"></span>
    <span class="ofh-progress-indicator__segment ofh-progress-indicator__segment--filled"></span>
    <span class="ofh-progress-indicator__segment"></span>
    <span class="ofh-progress-indicator__segment"></span>
    <span class="ofh-progress-indicator__segment"></span>
    <span class="ofh-progress-indicator__segment"></span>
    <span class="ofh-progress-indicator__segment"></span>
    <span class="ofh-progress-indicator__segment"></span>
  </div>
  <span class="ofh-progress-indicator__helper">About 5 minutes left</span>
</div>
```

#### Nunjucks macro

```
{% from 'components/progress-indicator/macro.njk' import progressIndicator %}

{{ progressIndicator({
  currentStep: 2,
  totalSteps: 8,
  label: "Personal details",
  helperText: "About 5 minutes left"
})}}
```

### Options

- `currentStep` (required): the current step number.
- `totalSteps` (required): the total number of steps.
- `label`: optional text shown on the left of the header, above the track.
- `helperText`: optional supporting text shown below the track.
- `showBars`: whether to show gaps between progress segments. Defaults to `true`.
- `classes`: additional classes to add to the outer element.
- `attributes`: additional HTML attributes to add to the outer element.
