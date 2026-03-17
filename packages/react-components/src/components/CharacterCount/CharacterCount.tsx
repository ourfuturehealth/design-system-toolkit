import React from 'react';
import { Textarea } from '../Textarea';
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
  countMessageClassName,
  defaultValue = '',
  describedBy,
  maxLength,
  maxWords,
  onChange,
  threshold = 0,
  value,
  ...props
}: CharacterCountProps) => {
  const isControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useControllableState({
    defaultValue,
    value,
  });
  const limit = maxWords ?? maxLength ?? 0;
  const useWords = maxWords !== undefined;
  const textareaId = props.id ?? React.useId().replace(/:/g, '');
  const countMessageId = `${textareaId}-info`;
  const visibleCount = getCount(currentValue, useWords);
  const remainingCount = limit - visibleCount;
  const thresholdReached =
    threshold === 0 || limit === 0
      ? true
      : visibleCount >= (limit * threshold) / 100;
  const countMessage = getCountMessage(remainingCount, useWords);
  const descriptionText = `You can enter up to ${limit} ${
    useWords ? 'words' : 'characters'
  }`;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className="ofh-character-count">
      <Textarea
        {...props}
        className={joinClassNames(
          props.className,
          remainingCount < 0 ? 'ofh-textarea--error' : undefined,
        )}
        defaultValue={isControlled ? undefined : defaultValue}
        describedBy={
          [describedBy, countMessageId].filter(Boolean).join(' ') || undefined
        }
        id={textareaId}
        onChange={handleChange}
        value={isControlled ? currentValue : undefined}
      />
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
          thresholdReached ? undefined : 'ofh-character-count__message--disabled',
          remainingCount < 0 ? 'ofh-error-message' : 'ofh-hint',
          countMessageClassName,
        )}
      >
        {countMessage}
      </div>
      <div
        aria-hidden={thresholdReached ? undefined : true}
        aria-live="polite"
        className="ofh-character-count__sr-status ofh-u-visually-hidden"
      >
        {countMessage}
      </div>
    </div>
  );
};

CharacterCount.displayName = 'CharacterCount';
