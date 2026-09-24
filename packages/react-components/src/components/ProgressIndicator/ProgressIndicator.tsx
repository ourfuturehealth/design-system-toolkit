import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface ProgressIndicatorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  /**
    * Base progress percentage, clamped between 1 and 100.
   */
    progressState: number;
  /**
    * Fixed number of segments rendered in the progress track.
   */
  totalSegments: number;
  /**
  * Additional progress as a percentage of one segment, clamped between 0 and 100.
   */
  subSegmentProgress?: number;
  /**
    * Optional plain-text string shown on the left of the header, above the track.
   */
    label?: string;
    /**
    * Optional free-form text shown on the right of the header.
    */
    progressText?: React.ReactNode;
  /**
   * Optional supporting text shown below the track.
   */
  helperText?: React.ReactNode;
  /**
   * Whether to show gaps between progress segments.
   */
  showBars?: boolean;
  /** Toolkit-parity alias for adding extra classes to the root element. */
  classes?: string;
  /**
   * Additional classes added alongside the toolkit classes.
   */
  className?: string;
  /**
   * Ref forwarding for the root element.
   */
  ref?: React.Ref<HTMLDivElement>;
}

export const ProgressIndicator = ({
  progressState,
  totalSegments,
  subSegmentProgress = 0,
  label,
  progressText,
  helperText,
  showBars = true,
  classes = '',
  className = '',
  ref,
  ...props
}: ProgressIndicatorProps) => {
  const labelId = React.useId();
  const clampedProgressState = Math.min(Math.max(progressState, 1), 100);
  const clampedSubSegmentProgress = Math.min(
    Math.max(subSegmentProgress, 0),
    100,
  );
  const segmentCount = Math.max(Math.round(totalSegments), 1);
  const overallProgress = Math.min(
    clampedProgressState + clampedSubSegmentProgress / segmentCount,
    100,
  );
  const scaledProgress = overallProgress * segmentCount;
  const filledSegmentCount = Math.floor(scaledProgress / 100);
  const segmentProgress = scaledProgress - filledSegmentCount * 100;
  const percentageText = `${overallProgress}%`;

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames('ofh-progress-indicator', classes, className)}
    >
      {label || progressText ? (
        <div className="ofh-progress-indicator__header">
          {label ? (
            <span id={labelId} className="ofh-progress-indicator__label">
              {label}
            </span>
          ) : null}
          {progressText ? (
            <span className="ofh-progress-indicator__steps">
              {progressText}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className={joinClassNames(
          'ofh-progress-indicator__track',
          !showBars && 'ofh-progress-indicator__track--without-bars',
        )}
        role="progressbar"
        aria-valuenow={overallProgress}
        aria-valuemin={1}
        aria-valuemax={100}
        aria-valuetext={percentageText}
        aria-label='Progress bar'
        aria-labelledby={label ? labelId : undefined}
      >
        {Array.from({ length: segmentCount }, (_, index) => {
          const isCurrentSegment =
            index === filledSegmentCount && filledSegmentCount < segmentCount;

          return (
            <span
              key={index}
              className={joinClassNames(
                'ofh-progress-indicator__segment',
                index < filledSegmentCount &&
                  'ofh-progress-indicator__segment--filled',
              )}
            >
              {isCurrentSegment ? (
                <span
                  className="ofh-progress-indicator__segment-progress"
                  style={{ width: `${segmentProgress}%` }}
                />
              ) : null}
            </span>
          );
        })}
      </div>
      {helperText ? (
        <span className="ofh-progress-indicator__helper">
          <span className="ofh-u-visually-hidden">Progress bar:</span>{' '}
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

ProgressIndicator.displayName = 'ProgressIndicator';
