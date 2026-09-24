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
    aria-valuemin="1"
    aria-valuemax="100"
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
  progressState: 25,
  totalSegments: 8,
  subSegmentProgress: 0,
  label: "Personal details",
  progressText: "Page 2 of 8",
  helperText: "About 5 minutes left"
})}}
```

### Overall percentage

Prefer passing the overall percentage as `progressState`, with
`subSegmentProgress` left at its default of 0. Both packages derive full and
partial segments from that percentage, without discarding fractional progress.

The base `progressState` is clamped between 1 and 100. `subSegmentProgress` adds
progress as a percentage of one segment and is independently clamped between
0 and 100. After normalizing the segment count, the overall percentage is:

```text
min(progressState + subSegmentProgress / segmentCount, 100)
```

For example, `progressState: 25`, `totalSegments: 8`, and
`subSegmentProgress: 50` produce 2.5 filled segments and 31.25% overall. Passing
`progressState: 31.25` without a sub-segment value produces the same result.
At the 1% minimum, the first segment is partially filled instead of showing no
progress. A total of 100% fills every segment without an extra partial segment.

`aria-valuenow` uses the overall percentage, with an ARIA range of 1 to 100.
Non-empty plain-text `progressText` provides the readable `aria-valuetext`, such
as `Page 2 of 8`. When that text is missing or blank, the value text falls back to
the overall percentage. Keep custom text consistent with the numeric progress;
it does not change the calculation or fill.

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
to an integer with a minimum of 1. The overall step value is the clamped current
step plus `subSegmentProgress / 100`, capped at the total steps. This single value
determines full segments, partial fill, and `aria-valuenow` on the 1-to-total-steps
scale. Generated page text rounds up to the page containing the partial segment.
For example, step 2 of 8 plus 50% of a segment shows `Page 3 of 8` and exposes
`aria-valuenow="2.5"` with `aria-valuetext="2.5 of 8 steps complete"`.
In this mode, the step props take precedence over percentage props and
`progressText` is generated automatically.

### Accessibility contract

Both packages expose one element with `role="progressbar"`. Its accessible name
is the trimmed `label`, falling back to `Progress` when missing or blank. Its
value text is separate from its name. For `label: "Personal details"` and
`progressText: "Page 2 of 8"`, the accessible name, role, and value correspond to
"Personal details, progress bar, Page 2 of 8". Exact spoken order depends on the
screen reader and navigation mode.

In percentage mode, non-empty plain-text `progressText` provides `aria-valuetext`;
otherwise the overall percentage is used. In React, non-string `progressText`
also falls back to the overall percentage. In toolkit step mode, the value text
is generated: page text for whole steps or fractional steps complete for partial
steps. Numeric ARIA values always reflect the calculated overall progress.

The header and track form one accessible progress bar. Their visual contents are
hidden from the accessibility tree to avoid duplicate, standalone announcements.
Helper text remains outside the progress bar so it can be read separately.

### Options

- `progressState` (required for percentage mode): base progress percentage, clamped between 1 and 100, matching React.
- `totalSegments` (required for percentage mode): fixed number of segments rendered in the track.
- `currentStep` (required for step mode): current step, clamped between 1 and `totalSteps`.
- `totalSteps` (required for step mode): number of steps, rounded to an integer with a minimum of 1.
- `subSegmentProgress`: additional progress as a percentage of one segment, clamped between 0 and 100. Defaults to `0`. The overall value is capped at completion.
- `label`: optional text shown on the left of the header and used as the accessible name. Missing or blank labels use `Progress` as the accessible name.
- `progressText`: optional text shown on the right of the header in percentage mode. Non-empty text also supplies `aria-valuetext`; otherwise the overall percentage is used. Does not change numeric progress.
- `helperText`: optional supporting text shown below the track.
- `showBars`: whether to show gaps between progress segments. Defaults to `true`.
- `classes`: additional classes to add to the outer element.
- `attributes`: additional HTML attributes to add to the outer element.
