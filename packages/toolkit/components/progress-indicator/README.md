# Progress Indicator

## Guidance

Use the progress indicator to show users how far through a multi-step process (for example, a multi-page form) they are.

## Quick start example

### Default progress indicator

#### HTML markup

```html
<div class="ofh-progress-indicator">
  <div
    role="progressbar"
    aria-valuenow="25"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuetext="Page 2 of 8"
    aria-label="Progress Bar"
  >
    <div class="ofh-progress-indicator__header" aria-hidden="true">
      <span class="ofh-progress-indicator__label">Personal details</span>
      <span class="ofh-progress-indicator__steps">Page 2 of 8</span>
    </div>
    <div class="ofh-progress-indicator__track" aria-hidden="true">
      <span class="ofh-progress-indicator__segment ofh-progress-indicator__segment--filled"></span>
      <span class="ofh-progress-indicator__segment ofh-progress-indicator__segment--filled"></span>
      <span class="ofh-progress-indicator__segment"></span>
      <span class="ofh-progress-indicator__segment"></span>
      <span class="ofh-progress-indicator__segment"></span>
      <span class="ofh-progress-indicator__segment"></span>
      <span class="ofh-progress-indicator__segment"></span>
      <span class="ofh-progress-indicator__segment"></span>
    </div>
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

### Step-based progress

Pass both `currentStep` and `totalSteps` to use step-based progress instead of percentages:

```njk
{{ progressIndicator({
  currentStep: 10,
  totalSteps: 5,
  label: "Personal details"
}) }}
```

This renders `Page 5 of 5`, `aria-valuenow="5"`, and `aria-valuemax="5"`.
The current step is clamped between 1 and the total steps. Total steps are rounded
to an integer with a minimum of 1. The clamped step also determines filled segments
and accessible text. In this mode, the step props take precedence over percentage
props and `progressText` is generated automatically.

The progress bar uses `Progress Bar` as its accessible name, independent of the
visible `label`. The value is provided separately through
`aria-valuetext`: `Page 2 of 8` for step 2 of 8, or `progressText` in percentage
mode with a percentage fallback when no text is supplied.

The header and track form one accessible progress bar. Their visual contents are
hidden from the accessibility tree to avoid duplicate, standalone announcements.
Helper text remains outside the progress bar so it can be read separately.

### Options

- `progressState` (required for percentage mode): progress percentage, clamped between 0 and 100.
- `totalSegments` (required for percentage mode): fixed number of segments rendered in the track.
- `currentStep` (required for step mode): current step, clamped between 1 and `totalSteps`.
- `totalSteps` (required for step mode): number of steps, rounded to an integer with a minimum of 1.
- `subSegmentProgress`: percentage fill applied to the current segment, clamped between 0 and 100. Defaults to `0`.
- `label`: optional text shown on the left of the header, above the track.
- `progressText`: optional free-form text shown on the right of the header.
- `helperText`: optional supporting text shown below the track.
- `showBars`: whether to show gaps between progress segments. Defaults to `true`.
- `classes`: additional classes to add to the outer element.
- `attributes`: additional HTML attributes to add to the outer element.
