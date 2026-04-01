import React from 'react';
import { FieldsetBase } from '../Fieldset/Fieldset';
import { joinClassNames } from '../_internal/joinClassNames';
import type { TextInputFixedWidth } from '../TextInput/TextInput';

export interface DateInputItem {
  id?: string;
  name: string;
  label?: React.ReactNode;
  /**
   * Uncontrolled initial value for the input.
   */
  defaultValue?: string;
  /**
   * Fixed character-width modifier reused from text inputs.
   */
  inputWidth?: TextInputFixedWidth;
  /**
   * Apply the red error input styling to this individual field.
   */
  hasError?: boolean;
  className?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'autoComplete'
    | 'children'
    | 'className'
    | 'id'
    | 'inputMode'
    | 'name'
    | 'ref'
    | 'type'
  >;
}

export interface DateInputProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    'children' | 'className' | 'id' | 'ref'
  > {
  id?: string;
  namePrefix?: string;
  legend: React.ReactNode;
  items?: DateInputItem[];
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  describedBy?: string;
  isPageHeading?: boolean;
  formGroupClassName?: string;
  fieldsetClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  className?: string;
  ref?: React.Ref<HTMLFieldSetElement>;
}

const inputWidthClassNames: Record<TextInputFixedWidth, string> = {
  2: 'ofh-input--width-2',
  3: 'ofh-input--width-3',
  4: 'ofh-input--width-4',
  5: 'ofh-input--width-5',
  10: 'ofh-input--width-10',
  20: 'ofh-input--width-20',
  30: 'ofh-input--width-30',
};

const defaultItems: DateInputItem[] = [
  {
    name: 'day',
    inputWidth: 2,
  },
  {
    name: 'month',
    inputWidth: 2,
  },
  {
    name: 'year',
    inputWidth: 4,
  },
];

function getDefaultLabel(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const DateInput = ({
  id,
  namePrefix,
  legend,
  items = defaultItems,
  hint,
  errorMessage,
  describedBy,
  isPageHeading = false,
  formGroupClassName,
  fieldsetClassName,
  hintClassName,
  errorMessageClassName,
  className,
  ref,
  'aria-describedby': ariaDescribedBy,
  role: fieldsetRole,
  ...fieldsetProps
}: DateInputProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const groupId = id ?? generatedId;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = errorMessage ? `${groupId}-error` : undefined;
  const describedByValue =
    [hintId, errorId, describedBy, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;
  const legendClasses = joinClassNames(
    'ofh-input__legend',
    hint || errorMessage ? 'ofh-input__legend--with-supporting-text' : undefined,
  );

  return (
    <div
      className={joinClassNames(
        'ofh-form-group',
        errorMessage ? 'ofh-form-group--error' : undefined,
        formGroupClassName,
      )}
    >
      <FieldsetBase
        {...fieldsetProps}
        describedBy={describedByValue}
        legend={legend}
        legendClassName={legendClasses}
        legendSize={isPageHeading ? 'large' : 'small'}
        ref={ref}
        className={fieldsetClassName}
        isPageHeading={isPageHeading}
        role={fieldsetRole ?? 'group'}
      >
        {hint || errorMessage ? (
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
        ) : null}

        <div className={joinClassNames('ofh-date-input', className)} id={groupId}>
          {items.map((item) => {
            const inputId = item.id ?? `${groupId}-${item.name}`;
            const itemModifierClass = ['day', 'month', 'year'].includes(item.name)
              ? `ofh-date-input__item--${item.name}`
              : undefined;
            const inputProps = item.inputProps;
            const itemWidthClass = item.inputWidth
              ? inputWidthClassNames[item.inputWidth]
              : undefined;
            const inputDefaultValue =
              inputProps?.value === undefined &&
              inputProps?.defaultValue === undefined
                ? item.defaultValue
                : undefined;

            return (
              <div
                className={joinClassNames('ofh-date-input__item', itemModifierClass)}
                key={inputId}
              >
                <label className="ofh-date-input__label" htmlFor={inputId}>
                  {item.label ?? getDefaultLabel(item.name)}
                </label>
                <input
                  className={joinClassNames(
                    'ofh-input',
                    'ofh-date-input__input',
                    itemWidthClass,
                    item.hasError ? 'ofh-input--error' : undefined,
                    item.className,
                  )}
                  id={inputId}
                  name={namePrefix ? `${namePrefix}-${item.name}` : item.name}
                  type="text"
                  inputMode={item.inputMode ?? 'numeric'}
                  autoComplete={item.autoComplete}
                  pattern={item.pattern ?? '[0-9]*'}
                  defaultValue={inputDefaultValue}
                  {...inputProps}
                />
              </div>
            );
          })}
        </div>
      </FieldsetBase>
    </div>
  );
};

DateInput.displayName = 'DateInput';
