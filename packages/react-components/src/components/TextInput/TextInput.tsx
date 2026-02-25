import React from 'react';
import styles from './TextInput.module.scss';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
   */
  label: string;
  /**
   * Input hint text
   */
  hint?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Whether the input is required
   */
  required?: boolean;
  /**
   * Input width variant
   */
  width?:
    | 'full'
    | 'three-quarters'
    | 'two-thirds'
    | 'one-half'
    | 'one-third'
    | 'one-quarter';
  /**
   * Character limit for the input (from 2,3,4,5,10,20)
   */
  maxLength?: 2 | 3 | 4 | 5 | 10 | 20;
  /**
   * Optional id for the input element
   */
  id?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  hint,
  error,
  required = false,
  width = 'full',
  maxLength,
  className = '',
  id,
  ...props
}) => {
  const inputId =
    id || `input-${crypto.randomUUID().replace(/-/g, '').slice(0, 9)}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const inputClasses = [
    'ofh-input', // OFH design system class
    styles.input,
    width && `ofh-u-width-${width}`,
    maxLength && `ofh-input--width-${maxLength}`,
    error && 'ofh-input--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const formGroupClasses = ['ofh-form-group', error && 'ofh-form-group--error']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={formGroupClasses}>
      <label className="ofh-label" htmlFor={inputId}>
        {label}
        {required && (
          <span className={styles.required} aria-label="required">
            *
          </span>
        )}
      </label>

      {hint && (
        <div className="ofh-hint" id={hintId}>
          {hint}
        </div>
      )}

      {error && (
        <span className="ofh-error-message" id={errorId}>
          <span className="ofh-u-visually-hidden">Error:</span>
          {error}
        </span>
      )}

      <input
        className={inputClasses}
        id={inputId}
        aria-describedby={
          [hintId, errorId].filter(Boolean).join(' ') || undefined
        }
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    </div>
  );
};
