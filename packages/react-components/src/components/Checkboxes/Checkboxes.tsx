import React from 'react';
import { FieldsetBase } from '../Fieldset/Fieldset';
import { Icon } from '../Icon';
import { InputFieldsetHeader } from '../_internal/InputFieldsetHeader';
import { joinClassNames } from '../_internal/joinClassNames';
import { useControllableState } from '../_internal/useControllableState';

type CheckboxValue = string | number;

export interface CheckboxOptionItem {
  id?: string;
  name?: string;
  value: CheckboxValue;
  label: React.ReactNode;
  hint?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  exclusive?: boolean;
  exclusiveGroup?: string;
  conditional?: React.ReactNode;
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'children' | 'defaultChecked' | 'id' | 'name' | 'onChange' | 'ref' | 'type' | 'value'
  >;
  labelClassName?: string;
  hintClassName?: string;
}

export interface CheckboxDividerItem {
  divider: React.ReactNode;
}

export type CheckboxItem = CheckboxOptionItem | CheckboxDividerItem;

export interface CheckboxesProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    'children' | 'className' | 'defaultValue' | 'onChange' | 'ref' | 'value'
  > {
  idPrefix?: string;
  name: string;
  legend: React.ReactNode;
  items: CheckboxItem[];
  hint?: React.ReactNode;
  errorMessage?: React.ReactNode;
  describedBy?: string;
  isPageHeading?: boolean;
  formGroupClassName?: string;
  fieldsetClassName?: string;
  hintClassName?: string;
  errorMessageClassName?: string;
  className?: string;
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  onChange?: (
    values: CheckboxValue[],
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  ref?: React.Ref<HTMLFieldSetElement>;
}

function getCheckboxValueKey(value: CheckboxValue) {
  return String(value);
}

function isCheckboxOptionItem(item: CheckboxItem): item is CheckboxOptionItem {
  return 'value' in item;
}

function getNextCheckboxValues(
  items: CheckboxItem[],
  previousValues: CheckboxValue[],
  item: CheckboxOptionItem,
  checked: boolean,
) {
  const itemValueKey = getCheckboxValueKey(item.value);

  if (!checked) {
    return previousValues.filter(
      (selectedValue) => getCheckboxValueKey(selectedValue) !== itemValueKey,
    );
  }

  const nextValues = previousValues.filter((selectedValue) => {
    const selectedValueKey = getCheckboxValueKey(selectedValue);

    if (selectedValueKey === itemValueKey) {
      return false;
    }

    const selectedItem = items.find(
      (candidateItem): candidateItem is CheckboxOptionItem =>
        isCheckboxOptionItem(candidateItem)
        && getCheckboxValueKey(candidateItem.value) === selectedValueKey,
    );

    if (!selectedItem || !item.exclusiveGroup) {
      return true;
    }

    if (item.exclusive) {
      return selectedItem.exclusiveGroup !== item.exclusiveGroup;
    }

    return !(
      selectedItem.exclusive
      && selectedItem.exclusiveGroup === item.exclusiveGroup
    );
  });

  return [...nextValues, item.value];
}

export const Checkboxes = ({
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
}: CheckboxesProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const resolvedIdPrefix = idPrefix ?? name ?? generatedId;
  const hintId = hint ? `${resolvedIdPrefix}-hint` : undefined;
  const errorId = errorMessage ? `${resolvedIdPrefix}-error` : undefined;
  const describedByValue =
    [hintId, errorId, describedBy, ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined;
  const initialValues =
    defaultValue ??
    items.filter(isCheckboxOptionItem).filter((item) => item.checked).map((item) => item.value);
  const [selectedValues, setSelectedValues] = useControllableState({
    defaultValue: initialValues,
    value,
  });
  const selectedValueKeys = new Set(selectedValues.map(getCheckboxValueKey));
  const hasConditionalItems = items.some(
    (item) => isCheckboxOptionItem(item) && item.conditional,
  );
  const legendClasses = joinClassNames(
    'ofh-input__legend',
    hint || errorMessage ? 'ofh-input__legend--with-supporting-text' : undefined,
  );

  const handleChange =
    (item: CheckboxOptionItem) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValues = getNextCheckboxValues(
        items,
        selectedValues,
        item,
        event.target.checked,
      );

      setSelectedValues(nextValues);
      onChange?.(nextValues, event);
    };

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
        <InputFieldsetHeader
          errorId={errorId}
          errorMessage={errorMessage}
          errorMessageClassName={errorMessageClassName}
          hint={hint}
          hintClassName={hintClassName}
          hintId={hintId}
        />

        <div
          className={joinClassNames(
            'ofh-checkboxes',
            hasConditionalItems ? 'ofh-checkboxes--conditional' : undefined,
            className,
          )}
        >
          {items.map((item, index) => {
            if (!isCheckboxOptionItem(item)) {
              return (
                <div className="ofh-checkboxes__divider" key={`${resolvedIdPrefix}-divider-${index}`}>
                  {item.divider}
                </div>
              );
            }

            const itemId = item.id ?? `${resolvedIdPrefix}-${index + 1}`;
            const itemHintId = item.hint ? `${itemId}-item-hint` : undefined;
            const conditionalId = `conditional-${itemId}`;
            const checked = selectedValueKeys.has(getCheckboxValueKey(item.value));
            const itemDescribedBy =
              [itemHintId, item.inputProps?.['aria-describedby']]
                .filter(Boolean)
                .join(' ') || undefined;

            return (
              <React.Fragment key={itemId}>
                <div className="ofh-checkboxes__item">
                  <div className="ofh-checkboxes__row">
                    <input
                      {...item.inputProps}
                      aria-controls={item.conditional ? conditionalId : undefined}
                      aria-describedby={itemDescribedBy}
                      aria-expanded={item.conditional ? checked : undefined}
                      checked={checked}
                      className="ofh-checkboxes__input"
                      data-checkbox-exclusive={
                        item.exclusive ? '' : undefined
                      }
                      data-checkbox-exclusive-group={item.exclusiveGroup}
                      disabled={item.disabled}
                      id={itemId}
                      name={item.name ?? name}
                      onChange={handleChange(item)}
                      type="checkbox"
                      value={String(item.value)}
                    />
                    <span className="ofh-checkboxes__controller" aria-hidden="true">
                      <Icon className="ofh-checkboxes__icon" name="Check" size={32} />
                    </span>
                    <label
                      className={joinClassNames(
                        'ofh-checkboxes__label',
                        item.labelClassName,
                      )}
                      htmlFor={itemId}
                    >
                      {item.label}
                    </label>
                  </div>

                  {item.hint ? (
                    <div
                      className={joinClassNames(
                        'ofh-hint',
                        'ofh-checkboxes__hint',
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
                      'ofh-checkboxes__conditional',
                      checked ? undefined : 'ofh-checkboxes__conditional--hidden',
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

Checkboxes.displayName = 'Checkboxes';
