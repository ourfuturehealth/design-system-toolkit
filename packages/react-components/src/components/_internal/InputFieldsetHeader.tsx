import React from 'react';
import { joinClassNames } from './joinClassNames';

interface InputFieldsetHeaderProps {
  hint?: React.ReactNode;
  hintId?: string;
  hintClassName?: string;
  errorMessage?: React.ReactNode;
  errorId?: string;
  errorMessageClassName?: string;
}

export const InputFieldsetHeader = ({
  hint,
  hintId,
  hintClassName,
  errorMessage,
  errorId,
  errorMessageClassName,
}: InputFieldsetHeaderProps) => {
  if (!hint && !errorMessage) {
    return null;
  }

  return (
    <div className="ofh-input__header">
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
  );
};
