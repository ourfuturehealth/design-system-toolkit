import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'children' | 'ref'
  > {
  label: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  describedBy?: string;
  isPageHeading?: boolean;
  formGroupClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const Textarea = ({
  label,
  hint,
  errorMessage,
  describedBy,
  isPageHeading = false,
  formGroupClassName,
  labelClassName,
  hintClassName,
  errorMessageClassName,
  className,
  id,
  rows = 5,
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextareaProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const textareaId = id ?? generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = errorMessage ? `${textareaId}-error` : undefined;
  const describedByValue =
    [hintId, errorId, describedBy, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;
  const labelClasses = joinClassNames(
    'ofh-input__label',
    isPageHeading ? 'ofh-label--l' : 'ofh-label--s',
    labelClassName,
  );
  const labelElement = (
    <label className={labelClasses} htmlFor={textareaId}>
      {label}
    </label>
  );

  return (
    <div
      className={joinClassNames(
        'ofh-form-group',
        errorMessage ? 'ofh-form-group--error' : undefined,
        formGroupClassName,
      )}
    >
      <div className="ofh-input__header">
        {isPageHeading ? (
          <h1 className="ofh-label-wrapper">{labelElement}</h1>
        ) : (
          labelElement
        )}
        {hint ? (
          <div
            className={joinClassNames('ofh-hint', 'ofh-input__hint', hintClassName)}
            id={hintId}
          >
            {hint}
          </div>
        ) : null}
        {errorMessage ? (
          <span
            className={joinClassNames(
              'ofh-error-message',
              'ofh-input__error-message',
              errorMessageClassName,
            )}
            id={errorId}
          >
            <span className="ofh-u-visually-hidden">Error:</span>
            {errorMessage}
          </span>
        ) : null}
      </div>

      <textarea
        ref={ref}
        className={joinClassNames(
          'ofh-textarea',
          errorMessage ? 'ofh-textarea--error' : undefined,
          className,
        )}
        id={textareaId}
        rows={rows}
        aria-describedby={describedByValue}
        aria-invalid={ariaInvalid ?? (errorMessage ? true : undefined)}
        {...props}
      />
    </div>
  );
};

Textarea.displayName = 'Textarea';
