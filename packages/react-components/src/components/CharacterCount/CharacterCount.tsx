import React from 'react';
import type { TextareaProps } from '../Textarea';
import { joinClassNames } from '../_internal/joinClassNames';
import { useControllableState } from '../_internal/useControllableState';

export interface CharacterCountProps
  extends Omit<TextareaProps, 'className' | 'defaultValue' | 'describedBy' | 'value'> {
  maxLength?: number;
  maxWords?: number;
  threshold?: number;
  countMessageClassName?: string;
  className?: string;
  defaultValue?: string;
  describedBy?: string;
  value?: string;
}

function getCount(text: string, useWords: boolean) {
  if (useWords) {
    return (text.match(/\S+/g) || []).length;
  }

  return text.length;
}

function getCountMessage(remainingCount: number, useWords: boolean) {
  const singularUnit = useWords ? 'word' : 'character';
  const pluralUnit = `${singularUnit}s`;

  if (remainingCount === 0) {
    return `You have 0 ${pluralUnit} remaining`;
  }

  if (remainingCount < 0) {
    const overLimitCount = Math.abs(remainingCount);
    const unit = overLimitCount === 1 ? singularUnit : pluralUnit;

    return `You have ${overLimitCount} ${unit} too many`;
  }

  const unit = remainingCount === 1 ? singularUnit : pluralUnit;

  return `You have ${remainingCount} ${unit} remaining`;
}

export const CharacterCount = ({
  className,
  countMessageClassName,
  defaultValue = '',
  describedBy,
  errorMessage,
  errorMessageClassName,
  formGroupClassName,
  hint,
  hintClassName,
  id,
  isPageHeading = false,
  label,
  labelClassName,
  maxLength,
  maxWords,
  onChange,
  ref,
  rows = 4,
  threshold = 0,
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...textareaProps
}: CharacterCountProps) => {
  const isControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useControllableState({
    defaultValue,
    value,
  });
  const generatedId = React.useId().replace(/:/g, '');
  const limit = maxWords ?? maxLength;
  const hasLimit = limit !== undefined;
  const useWords = maxWords !== undefined;
  const textareaId = id ?? generatedId;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = errorMessage ? `${textareaId}-error` : undefined;
  const countMessageId = hasLimit ? `${textareaId}-info` : undefined;
  const describedByValue =
    [hintId, errorId, hasLimit ? countMessageId : undefined, describedBy, ariaDescribedBy]
      .filter(Boolean)
      .join(' ') || undefined;
  const visibleCount = getCount(currentValue, useWords);
  let remainingCount = 0;
  let thresholdReached = false;
  let countMessage = '';
  let descriptionText = '';

  if (hasLimit) {
    remainingCount = limit - visibleCount;
    thresholdReached =
      threshold === 0 || visibleCount >= (limit * threshold) / 100;
    countMessage = getCountMessage(remainingCount, useWords);
    descriptionText = `You can enter up to ${limit} ${
      useWords ? 'words' : 'characters'
    }`;
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className="ofh-character-count">
      <div
        className={joinClassNames(
          'ofh-form-group',
          errorMessage ? 'ofh-form-group--error' : undefined,
          formGroupClassName,
        )}
      >
        <div className="ofh-input__header">
          {isPageHeading ? (
            <h1 className="ofh-label-wrapper">
              <label
                className={joinClassNames(
                  'ofh-label',
                  'ofh-input__label',
                  'ofh-label--l',
                  labelClassName,
                )}
                htmlFor={textareaId}
              >
                {label}
              </label>
            </h1>
          ) : (
            <label
              className={joinClassNames(
                'ofh-label',
                'ofh-input__label',
                'ofh-label--s',
                labelClassName,
              )}
              htmlFor={textareaId}
            >
              {label}
            </label>
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
            errorMessage || (hasLimit && remainingCount < 0)
              ? 'ofh-textarea--error'
              : undefined,
            className,
          )}
          id={textareaId}
          rows={rows}
          aria-describedby={describedByValue}
          aria-invalid={
            ariaInvalid ??
            (errorMessage || (hasLimit && remainingCount < 0) ? true : undefined)
          }
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          value={isControlled ? currentValue : undefined}
          {...textareaProps}
        />
        {hasLimit ? (
          <>
            <div
              className={joinClassNames(
                'ofh-hint',
                'ofh-character-count__message',
                'ofh-u-visually-hidden',
                countMessageClassName,
              )}
              id={countMessageId}
            >
              {descriptionText}
            </div>
            <div
              aria-hidden="true"
              className={joinClassNames(
                'ofh-character-count__message',
                'ofh-character-count__status',
                thresholdReached
                  ? undefined
                  : 'ofh-character-count__message--disabled',
                remainingCount < 0 ? 'ofh-error-message' : 'ofh-hint',
                countMessageClassName,
              )}
            >
              {countMessage}
            </div>
          </>
        ) : null}
      </div>
      {hasLimit ? (
        <div
          aria-hidden={thresholdReached ? undefined : true}
          aria-live="polite"
          className="ofh-character-count__sr-status ofh-u-visually-hidden"
        >
          {countMessage}
        </div>
      ) : null}
    </div>
  );
};

CharacterCount.displayName = 'CharacterCount';
