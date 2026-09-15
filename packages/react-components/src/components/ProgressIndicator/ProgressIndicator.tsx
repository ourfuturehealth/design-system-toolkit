import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface ProgressIndicatorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  /**
   * The total number of steps in the process.
   */
  totalSteps: number;
  /**
   * The current step number, between 0 and `totalSteps`.
   */
  currentStep: number;
  /**
   * Optional text shown on the left of the header, above the track.
   */
  label?: React.ReactNode;
  /**
   * Optional supporting text shown below the track.
   */
  helperText?: React.ReactNode;
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
  totalSteps,
  currentStep,
  label,
  helperText,
  className = '',
  ref,
  ...props
}: ProgressIndicatorProps) => {
  const clampedStep = Math.min(Math.max(currentStep, 0), totalSteps);
  const stepsText = `Page ${clampedStep} of ${totalSteps}`;
  const accessibleLabel = label ? `${label}: ${stepsText}` : stepsText;

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames('ofh-progress-indicator-bar', className)}
    >
      <div className="ofh-progress-indicator-bar__header">
        {label ? (
          <span className="ofh-progress-indicator-bar__label">{label}</span>
        ) : null}
        <span className="ofh-progress-indicator-bar__steps">{stepsText}</span>
      </div>
      <div
        className="ofh-progress-indicator-bar__track"
        role="progressbar"
        aria-valuenow={clampedStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuetext={stepsText}
        aria-label={accessibleLabel}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key -- segments are static and have no other identity
            key={index}
            className={joinClassNames(
              'ofh-progress-indicator-bar__segment',
              index < clampedStep &&
                'ofh-progress-indicator-bar__segment--filled',
            )}
          />
        ))}
      </div>
      {helperText ? (
        <span className="ofh-progress-indicator-bar__helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

ProgressIndicator.displayName = 'ProgressIndicator';
