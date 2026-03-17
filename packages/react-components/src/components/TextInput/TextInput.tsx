import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export type TextInputWidth =
  | 'full'
  | 'three-quarters'
  | 'two-thirds'
  | 'one-half'
  | 'one-third'
  | 'one-quarter';

export type TextInputFixedWidth = 2 | 3 | 4 | 5 | 10 | 20 | 30;

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'ref'> {
  /**
   * Input label content.
   */
  label: React.ReactNode;
  /**
   * Optional hint content.
   */
  hint?: React.ReactNode;
  /**
   * Optional error content.
   */
  errorMessage?: React.ReactNode;
  /**
   * Deprecated alias for `errorMessage`.
   */
  error?: React.ReactNode;
  /**
   * One or more element IDs to append to `aria-describedby`.
   */
  describedBy?: string;
  /**
   * Fluid width utility class.
   */
  width?: TextInputWidth;
  /**
   * Fixed character-width modifier.
   */
  inputWidth?: TextInputFixedWidth;
  /**
   * Whether the label also acts as the page heading.
   */
  isPageHeading?: boolean;
  /**
   * Optional classes for the wrapper, label, hint, and error message.
   */
  formGroupClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  /**
   * Ref forwarding for the underlying input element.
   */
  ref?: React.Ref<HTMLInputElement>;
}

const widthClassNames: Record<TextInputWidth, string> = {
  full: 'ofh-u-width-full',
  'three-quarters': 'ofh-u-width-three-quarters',
  'two-thirds': 'ofh-u-width-two-thirds',
  'one-half': 'ofh-u-width-one-half',
  'one-third': 'ofh-u-width-one-third',
  'one-quarter': 'ofh-u-width-one-quarter',
};

const inputWidthClassNames: Record<TextInputFixedWidth, string> = {
  2: 'ofh-input--width-2',
  3: 'ofh-input--width-3',
  4: 'ofh-input--width-4',
  5: 'ofh-input--width-5',
  10: 'ofh-input--width-10',
  20: 'ofh-input--width-20',
  30: 'ofh-input--width-30',
};

export const TextInput = ({
  label,
  hint,
  errorMessage,
  error,
  describedBy,
  width,
  inputWidth,
  isPageHeading = false,
  formGroupClassName,
  labelClassName,
  hintClassName,
  errorMessageClassName,
  className,
  id,
  type = 'text',
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextInputProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const inputId = id ?? generatedId;
  const resolvedErrorMessage = errorMessage ?? error;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = resolvedErrorMessage ? `${inputId}-error` : undefined;
  const describedByValue =
    [hintId, errorId, describedBy, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;
  const labelClasses = joinClassNames(
    'ofh-input__label',
    isPageHeading ? 'ofh-label--l' : 'ofh-label--s',
    labelClassName,
  );
  const labelElement = (
    <label className={labelClasses} htmlFor={inputId}>
      {label}
    </label>
  );

  return (
    <div
      className={joinClassNames(
        'ofh-form-group',
        resolvedErrorMessage ? 'ofh-form-group--error' : undefined,
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
        {resolvedErrorMessage ? (
          <span
            className={joinClassNames(
              'ofh-error-message',
              'ofh-input__error-message',
              errorMessageClassName,
            )}
            id={errorId}
          >
            <span className="ofh-u-visually-hidden">Error:</span>
            {resolvedErrorMessage}
          </span>
        ) : null}
      </div>

      <input
        ref={ref}
        className={joinClassNames(
          'ofh-input',
          width ? widthClassNames[width] : undefined,
          inputWidth ? inputWidthClassNames[inputWidth] : undefined,
          resolvedErrorMessage ? 'ofh-input--error' : undefined,
          className,
        )}
        id={inputId}
        type={type}
        aria-describedby={describedByValue}
        aria-invalid={ariaInvalid ?? (resolvedErrorMessage ? true : undefined)}
        {...props}
      />
    </div>
  );
};

TextInput.displayName = 'TextInput';
