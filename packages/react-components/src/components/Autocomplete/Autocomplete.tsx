import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';
import { useControllableState } from '../_internal/useControllableState';
import type {
  TextInputFixedWidth,
  TextInputWidth,
} from '../TextInput/TextInput';

export interface AutocompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children' | 'defaultValue' | 'onChange' | 'ref' | 'type' | 'value'
> {
  label: React.ReactNode;
  options: string[];
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  describedBy?: string;
  width?: TextInputWidth;
  inputWidth?: TextInputFixedWidth;
  isPageHeading?: boolean;
  formGroupClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  noResultsText?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onOptionSelect?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  ref?: React.Ref<HTMLInputElement>;
}

function getLabelText(label: React.ReactNode) {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }

  return 'value';
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

export const Autocomplete = ({
  label,
  options,
  hint,
  errorMessage,
  describedBy,
  width,
  inputWidth,
  isPageHeading = false,
  formGroupClassName,
  labelClassName,
  hintClassName,
  errorMessageClassName,
  noResultsText,
  onChange,
  onOptionSelect,
  value,
  defaultValue = '',
  className,
  id,
  ref,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: AutocompleteProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
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
  const [inputValue, setInputValue] = useControllableState({
    defaultValue,
    value,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const deferredInputValue = React.useDeferredValue(inputValue);
  const normalizedQuery = deferredInputValue.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;
  const resolvedNoResultsText =
    noResultsText ??
    `No suggestions found. Enter a new ${getLabelText(label)}.`;
  const filteredOptions = hasQuery
    ? options.filter((option) => option.toLowerCase().includes(normalizedQuery))
    : [];
  const showSuggestions = filteredOptions.length > 0;
  const showMenu = isOpen && hasQuery;
  const activeDescendantId =
    showMenu && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
      ? `${inputId}-option-${highlightedIndex}`
      : undefined;

  const selectOption = (nextValue: string) => {
    setInputValue(nextValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onOptionSelect?.(nextValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const nextHasQuery = nextValue.trim().length > 0;

    setInputValue(nextValue);
    setIsOpen(nextHasQuery);
    setHighlightedIndex(-1);
    onChange?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasQuery) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }

      return;
    }

    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(showSuggestions ? 0 : -1);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((previousIndex) => {
        if (!showSuggestions) {
          return -1;
        }

        if (previousIndex >= filteredOptions.length - 1) {
          return 0;
        }

        return previousIndex + 1;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((previousIndex) => {
        if (!showSuggestions) {
          return -1;
        }

        if (previousIndex <= 0) {
          return filteredOptions.length - 1;
        }

        return previousIndex - 1;
      });
      return;
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      selectOption(filteredOptions[highlightedIndex]);
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

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
            className={joinClassNames(
              'ofh-hint',
              'ofh-input__hint',
              hintClassName,
            )}
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

      <div
        className={joinClassNames(
          'autocomplete__wrapper',
          width ? widthClassNames[width] : undefined,
          inputWidth ? inputWidthClassNames[inputWidth] : undefined,
        )}
      >
        <input
          {...props}
          ref={ref}
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-describedby={describedByValue}
          aria-expanded={isOpen}
          aria-invalid={ariaInvalid ?? (errorMessage ? true : undefined)}
          className={joinClassNames(
            'autocomplete__input',
            isFocused ? 'autocomplete__input--focused' : undefined,
            errorMessage ? 'autocomplete__input--error' : undefined,
            className,
          )}
          id={inputId}
          onBlur={() => {
            setIsFocused(false);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(inputValue.trim().length > 0);
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          type="text"
          value={inputValue}
        />

        {showMenu ? (
          <ul
            className={joinClassNames(
              'autocomplete__menu',
              'autocomplete__menu--inline',
              'autocomplete__menu--visible',
              showSuggestions
                ? 'autocomplete__menu--with-suggestions'
                : undefined,
            )}
            id={listboxId}
            role="listbox"
          >
            {showSuggestions ? (
              filteredOptions.map((option, index) => (
                <li
                  aria-selected={index === highlightedIndex}
                  className={joinClassNames(
                    'autocomplete__option',
                    index === highlightedIndex
                      ? 'autocomplete__option--focused'
                      : undefined,
                  )}
                  id={`${inputId}-option-${index}`}
                  key={`${option}-${index}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectOption(option);
                  }}
                  role="option"
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="autocomplete__option autocomplete__option--no-results">
                {resolvedNoResultsText}
              </li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

Autocomplete.displayName = 'Autocomplete';
