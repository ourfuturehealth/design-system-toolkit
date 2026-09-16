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
    aria-valuenow="25"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuetext="25%"
    aria-label="Personal details: 25%"
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
  progressState: 25,
  totalSegments: 8,
  subSegmentProgress: 50,
  label: "Personal details",
  progressText: "Page 2 of 8",
  helperText: "About 5 minutes left"
})}}
```

### Options

- `progressState` (required): progress percentage, clamped between 0 and 100.
- `totalSegments` (required): fixed number of segments rendered in the track.
- `subSegmentProgress`: percentage fill applied to the current segment, clamped between 0 and 100. Defaults to `0`.
- `label`: optional text shown on the left of the header, above the track.
- `progressText`: optional free-form text shown on the right of the header.
- `helperText`: optional supporting text shown below the track.
- `showBars`: whether to show gaps between progress segments. Defaults to `true`.
- `classes`: additional classes to add to the outer element.
- `attributes`: additional HTML attributes to add to the outer element.
