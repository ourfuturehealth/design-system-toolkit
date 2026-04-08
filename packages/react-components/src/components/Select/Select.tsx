import React from 'react';
import { Icon } from '../Icon';
import { joinClassNames } from '../_internal/joinClassNames';

export interface SelectItem {
  value?: string | number;
  text: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  optionProps?: Omit<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    'children' | 'disabled' | 'selected' | 'value'
  >;
  /**
   * @deprecated Use `optionProps` instead.
   */
  attributes?: Omit<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    'children' | 'disabled' | 'selected' | 'value'
  >;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'ref'> {
  label: React.ReactNode;
  items: SelectItem[];
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  describedBy?: string;
  isPageHeading?: boolean;
  formGroupClassName?: string;
  labelClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  ref?: React.Ref<HTMLSelectElement>;
}

export const Select = ({
  label,
  items,
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
  ref,
  defaultValue,
  value,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: SelectProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const selectId = id ?? generatedId;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = errorMessage ? `${selectId}-error` : undefined;
  const describedByValue =
    [hintId, errorId, describedBy, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;
  const labelClasses = joinClassNames(
    'ofh-label',
    'ofh-input__label',
    isPageHeading ? 'ofh-label--l' : 'ofh-label--s',
    labelClassName,
  );
  const selectedItem = items.find((item) => item.selected);
  const resolvedDefaultValue =
    value === undefined
      ? defaultValue === undefined
        ? (selectedItem?.value ?? '')
        : defaultValue
      : undefined;
  const labelElement = (
    <label className={labelClasses} htmlFor={selectId}>
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

      <div className="ofh-select__wrapper">
        <select
          ref={ref}
          className={joinClassNames(
            'ofh-select',
            errorMessage ? 'ofh-select--error' : undefined,
            className,
          )}
          id={selectId}
          defaultValue={resolvedDefaultValue}
          value={value}
          aria-describedby={describedByValue}
          aria-invalid={ariaInvalid ?? (errorMessage ? true : undefined)}
          {...props}
        >
          {items.map((item, index) => {
            const optionProps = item.optionProps ?? item.attributes;

            return (
              <option
                key={`${String(item.value ?? '')}-${index}`}
                value={item.value ?? ''}
                disabled={item.disabled}
                {...optionProps}
              >
                {item.text}
              </option>
            );
          })}
        </select>
        <span className="ofh-select__icon" aria-hidden="true">
          <Icon name="UnfoldMore" />
        </span>
      </div>
    </div>
  );
};

Select.displayName = 'Select';
