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
    aria-valuenow="2"
    aria-valuemin="1"
    aria-valuemax="8"
    aria-label="Personal details, Page 2 of 8"
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
  currentStep: 2,
  totalSteps: 8,
  subSegmentProgress: 0,
  label: "Personal details",
  helperText: "About 5 minutes left"
})}}
```

### Step-based progress

In both React and Nunjucks, pass `currentStep` and `totalSteps` for a page-based
journey instead of calculating a percentage and supplying page text separately:

```tsx
<ProgressIndicator currentStep={11} totalSteps={12} label="Personal details" />
```

This generates `Page 11 of 12`, 11 filled segments, `aria-valuenow="11"`, and
`aria-valuemax="12"`. Both packages require `currentStep` and `totalSteps`.
Page text and the numeric accessible value are generated; no separate text input is needed.

For example, the Nunjucks macro also clamps out-of-range steps:

```njk
{{ progressIndicator({
  currentStep: 10,
  totalSteps: 5,
  label: "Personal details"
}) }}
```

This renders `Page 5 of 5`, `aria-valuenow="5"`, and `aria-valuemax="5"`.
The current step is clamped between 1 and the total steps. Total steps are rounded
to an integer with a minimum of 1. The overall step value is the clamped current
step plus `subSegmentProgress / 100`, capped at the total steps. This single value
determines full segments, partial fill, and `aria-valuenow` on the 1-to-total-steps
scale. Generated page text rounds up to the page containing the partial segment.
For example, step 2 of 8 plus 50% of a segment shows `Page 3 of 8` and exposes
`aria-valuenow="2.5"` on the 1-to-8 scale.
At completion, all segments are filled and no extra partial segment is rendered.

### Accessibility contract

Both packages expose one element with `role="progressbar"`. Its accessible name
contains the trimmed `label` followed by the generated page text, for example
`Personal details, Page 2 of 8`. A missing or blank label uses `Progress`.
Combining these phrases in one name keeps the label before the page count.

There is no `aria-valuetext` override that VoiceOver could announce before the
label. Numeric ARIA values still reflect calculated overall progress, including
partial steps, and allow the screen reader to announce its native progress value.
Exact speech and percentage formatting depend on the browser, screen reader,
and navigation mode.

The header and track form one accessible progress bar. Their visual contents are
hidden from the accessibility tree to avoid duplicate, standalone announcements.
Helper text remains outside the progress bar so it can be read separately.

### Options

- `currentStep` (required): current step, clamped between 1 and `totalSteps`.
- `totalSteps` (required): number of steps, rounded to an integer with a minimum of 1.
- `subSegmentProgress`: additional progress as a percentage of one segment, clamped between 0 and 100. Defaults to `0`. The overall value is capped at completion.
- `label`: optional text shown on the left of the header and placed before the page count in the accessible name. Missing or blank labels use `Progress`.
- `helperText`: optional supporting text shown below the track.
- `showBars`: whether to show gaps between progress segments. Defaults to `true`.
- `classes`: additional classes to add to the outer element.
- `attributes`: additional HTML attributes to add to the outer element.

### Migrating from percentage inputs

`progressState`, `totalSegments`, and manual `progressText` are no longer supported
in either package. Pass the journey's `currentStep` and `totalSteps` instead.
For example, use step 2 of 8 instead of a percentage of 25 with separately supplied
page text. `subSegmentProgress` remains available for partial progress through the
next step.
