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
    aria-valuetext="25%"
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

`aria-valuenow` and `aria-valuetext` use the overall percentage. The ARIA range
remains 1 to 100. Free-form `progressText` is displayed in the header but does not
override the accessible percentage; keep it consistent with the overall value.

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

The progress bar uses `Progress Bar` as its accessible name, independent of the
visible `label`. The value is provided separately through
`aria-valuetext`: page text for whole steps, fractional steps complete for partial
steps, or the overall percentage in percentage mode.

The header and track form one accessible progress bar. Their visual contents are
hidden from the accessibility tree to avoid duplicate, standalone announcements.
Helper text remains outside the progress bar so it can be read separately.

### Options

- `progressState` (required for percentage mode): base progress percentage, clamped between 1 and 100, matching React.
- `totalSegments` (required for percentage mode): fixed number of segments rendered in the track.
- `currentStep` (required for step mode): current step, clamped between 1 and `totalSteps`.
- `totalSteps` (required for step mode): number of steps, rounded to an integer with a minimum of 1.
- `subSegmentProgress`: additional progress as a percentage of one segment, clamped between 0 and 100. Defaults to `0`. The overall value is capped at completion.
- `label`: optional text shown on the left of the header, above the track.
- `progressText`: optional free-form text shown on the right of the header in percentage mode. Does not override calculated ARIA values.
- `helperText`: optional supporting text shown below the track.
- `showBars`: whether to show gaps between progress segments. Defaults to `true`.
- `classes`: additional classes to add to the outer element.
- `attributes`: additional HTML attributes to add to the outer element.
