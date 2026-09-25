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
    aria-valuetext="Page 2 of 8"
    aria-label="Personal details"
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
Page text and accessible value text are generated; no separate text input is needed.

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
`aria-valuenow="2.5"` with `aria-valuetext="2.5 of 8 steps complete"`.
At completion, all segments are filled and no extra partial segment is rendered.

### Accessibility contract

Both packages expose one element with `role="progressbar"`. Its accessible name
is the trimmed `label`, falling back to `Progress` when missing or blank. Its
value text is separate from its name. For `label: "Personal details"`,
`currentStep: 2`, and `totalSteps: 8`, the accessible name, role, and value correspond to
"Personal details, progress bar, Page 2 of 8". Exact spoken order depends on the
screen reader and navigation mode.

In both packages, value text is generated: page text for whole steps or fractional steps complete for partial
steps. Numeric ARIA values always reflect the calculated overall progress.

The header and track form one accessible progress bar. Their visual contents are
hidden from the accessibility tree to avoid duplicate, standalone announcements.
Helper text remains outside the progress bar so it can be read separately.

### Options

- `currentStep` (required): current step, clamped between 1 and `totalSteps`.
- `totalSteps` (required): number of steps, rounded to an integer with a minimum of 1.
- `subSegmentProgress`: additional progress as a percentage of one segment, clamped between 0 and 100. Defaults to `0`. The overall value is capped at completion.
- `label`: optional text shown on the left of the header and used as the accessible name. Missing or blank labels use `Progress` as the accessible name.
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
