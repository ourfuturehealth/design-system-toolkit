import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface ProgressIndicatorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  /**
    * Progress percentage, between 0 and 100.
   */
    progressState: number;
  /**
    * Fixed number of segments rendered in the progress track.
   */
    totalSegments: number;
  /**
   * Optional text shown on the left of the header, above the track.
   */
  label?: React.ReactNode;
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
  label,
  progressText,
  helperText,
  showBars = true,
  className = '',
  ref,
  ...props
}: ProgressIndicatorProps) => {
  const clampedProgressState = Math.min(Math.max(progressState, 0), 100);
  const segmentCount = Math.max(Math.round(totalSegments), 1);
  const filledSegmentCount = Math.round(
    (clampedProgressState / 100) * segmentCount,
  );
  const percentageText = `${clampedProgressState}%`;
  const accessibleLabel =
    typeof label === 'string' ? `${label}: ${percentageText}` : percentageText;

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames('ofh-progress-indicator', className)}
    >
      {label || progressText ? (
        <div className="ofh-progress-indicator__header">
          {label ? (
            <span className="ofh-progress-indicator__label">{label}</span>
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
        aria-valuenow={clampedProgressState}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={percentageText}
        aria-label={accessibleLabel}
      >
        {Array.from({ length: segmentCount }, (_, index) => (
          <span
            key={index}
            className={joinClassNames(
              'ofh-progress-indicator__segment',
              index < filledSegmentCount &&
                'ofh-progress-indicator__segment--filled',
            )}
          />
        ))}
      </div>
      {helperText ? (
        <span className="ofh-progress-indicator__helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

ProgressIndicator.displayName = 'ProgressIndicator';
