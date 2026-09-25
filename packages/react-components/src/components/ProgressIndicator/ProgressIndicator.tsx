import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface ProgressIndicatorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  /** Current step, clamped between 1 and totalSteps. */
  currentStep: number;
  /** Number of steps, rounded to an integer with a minimum of 1. */
  totalSteps: number;
  /**
  * Additional progress as a percentage of one segment, clamped between 0 and 100.
   */
  subSegmentProgress?: number;
  /**
    * Optional visible label and accessible name. Defaults to "Progress" for assistive technology.
   */
    label?: string;
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
  currentStep,
  totalSteps,
  subSegmentProgress = 0,
  label,
  helperText,
  showBars = true,
  classes = '',
  className = '',
  ref,
  ...props
}: ProgressIndicatorProps) => {
  const segmentCount = Math.max(Math.round(totalSteps), 1);
  const clampedCurrentStep = Math.min(Math.max(currentStep, 1), segmentCount);
  const clampedSubSegmentProgress = Math.min(
    Math.max(subSegmentProgress, 0),
    100,
  );
  const overallProgress = Math.min(
    clampedCurrentStep + clampedSubSegmentProgress / 100,
    segmentCount,
  );
  const scaledProgress = overallProgress * 100;
  const filledSegmentCount = Math.floor(scaledProgress / 100);
  const segmentProgress = scaledProgress - filledSegmentCount * 100;
  const resolvedProgressText = `Page ${Math.ceil(overallProgress)} of ${segmentCount}`;
  const accessibleLabel = label?.trim() || 'Progress';
  const accessibleValueText = Number.isInteger(overallProgress)
    ? resolvedProgressText
    : `${overallProgress} of ${segmentCount} steps complete`;

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames('ofh-progress-indicator', classes, className)}
    >
      <div
        role="progressbar"
        aria-valuenow={overallProgress}
        aria-valuemin={1}
        aria-valuemax={segmentCount}
        aria-valuetext={accessibleValueText}
        aria-label={accessibleLabel}
      >
        <div className="ofh-progress-indicator__header" aria-hidden="true">
          {label ? (
            <label className="ofh-progress-indicator__label">
              {label}
            </label>
          ) : null}
          <span className="ofh-progress-indicator__steps">
            {resolvedProgressText}
          </span>
        </div>
        <div
          className={joinClassNames(
            'ofh-progress-indicator__track',
            !showBars && 'ofh-progress-indicator__track--without-bars',
          )}
          aria-hidden="true"
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
