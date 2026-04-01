import React from 'react';
import { FieldsetBase } from '../Fieldset/Fieldset';
import { joinClassNames } from '../_internal/joinClassNames';
import { useControllableState } from '../_internal/useControllableState';

type RadioValue = string | number;

export interface RadioOptionItem {
  id?: string;
  value: RadioValue;
  label: React.ReactNode;
  hint?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  conditional?: React.ReactNode;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'children' | 'defaultChecked' | 'id' | 'name' | 'onChange' | 'ref' | 'type' | 'value'
  >;
  labelClassName?: string;
  hintClassName?: string;
}

export interface RadioDividerItem {
  divider: React.ReactNode;
}

export type RadioItem = RadioOptionItem | RadioDividerItem;

export interface RadiosProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    'children' | 'className' | 'onChange' | 'ref'
  > {
  idPrefix?: string;
  name: string;
  legend: React.ReactNode;
  items: RadioItem[];
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  describedBy?: string;
  isPageHeading?: boolean;
  formGroupClassName?: string;
  fieldsetClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  className?: string;
  value?: RadioValue;
  defaultValue?: RadioValue;
  onChange?: (
    value: RadioValue,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  ref?: React.Ref<HTMLFieldSetElement>;
}

function getRadioValueKey(value: RadioValue) {
  return String(value);
}

function isRadioOptionItem(item: RadioItem): item is RadioOptionItem {
  return 'value' in item;
}

export const Radios = ({
  idPrefix,
  name,
  legend,
  items,
  hint,
  errorMessage,
  describedBy,
  isPageHeading = false,
  formGroupClassName,
  fieldsetClassName,
  hintClassName,
  errorMessageClassName,
  className,
  value,
  defaultValue,
  onChange,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...fieldsetProps
}: RadiosProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const resolvedIdPrefix = idPrefix ?? name ?? generatedId;
  const hintId = hint ? `${resolvedIdPrefix}-hint` : undefined;
  const errorId = errorMessage ? `${resolvedIdPrefix}-error` : undefined;
  const describedByValue =
    [hintId, errorId, describedBy, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;
  const initialValue =
    defaultValue ?? items.find(isRadioOptionItem)?.value;
  const [selectedValue, setSelectedValue] = useControllableState({
    defaultValue: initialValue,
    value,
  });
  const selectedValueKey =
    selectedValue !== undefined ? getRadioValueKey(selectedValue) : undefined;
  const hasConditionalItems = items.some(
    (item) => isRadioOptionItem(item) && item.conditional,
  );
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

        <div
          className={joinClassNames(
            'ofh-radios',
            hasConditionalItems ? 'ofh-radios--conditional' : undefined,
            className,
          )}
        >
          {items.map((item, index) => {
            if (!isRadioOptionItem(item)) {
              return (
                <div className="ofh-radios__divider" key={`${resolvedIdPrefix}-divider-${index}`}>
                  {item.divider}
                </div>
              );
            }

            const itemId = item.id ?? `${resolvedIdPrefix}-${index + 1}`;
            const itemHintId = item.hint ? `${itemId}-item-hint` : undefined;
            const conditionalId = `conditional-${itemId}`;
            const checked = selectedValueKey === getRadioValueKey(item.value);
            const itemDescribedBy =
              [itemHintId, item.inputProps?.['aria-describedby']]
                .filter(Boolean)
                .join(' ') || undefined;

            return (
              <React.Fragment key={itemId}>
                <div className="ofh-radios__item">
                  <div className="ofh-radios__row">
                    <input
                      {...item.inputProps}
                      aria-controls={item.conditional ? conditionalId : undefined}
                      aria-describedby={itemDescribedBy}
                      checked={checked}
                      className="ofh-radios__input"
                      disabled={item.disabled}
                      id={itemId}
                      name={name}
                      onChange={(event) => {
                        setSelectedValue(item.value);
                        onChange?.(item.value, event);
                      }}
                      type="radio"
                      value={String(item.value)}
                    />
                    <span className="ofh-radios__controller" aria-hidden="true">
                      <span className="ofh-radios__dot"></span>
                    </span>
                    <label
                      className={joinClassNames('ofh-radios__label', item.labelClassName)}
                      htmlFor={itemId}
                    >
                      {item.label}
                    </label>
                  </div>

                  {item.hint ? (
                    <div
                      className={joinClassNames(
                        'ofh-hint',
                        'ofh-radios__hint',
                        item.hintClassName,
                      )}
                      id={itemHintId}
                    >
                      {item.hint}
                    </div>
                  ) : null}
                </div>

                {item.conditional ? (
                  <div
                    aria-hidden={!checked}
                    className={joinClassNames(
                      'ofh-radios__conditional',
                      checked ? undefined : 'ofh-radios__conditional--hidden',
                    )}
                    hidden={!checked}
                    id={conditionalId}
                  >
                    {item.conditional}
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </FieldsetBase>
    </div>
  );
};

Radios.displayName = 'Radios';
