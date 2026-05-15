import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';
import { Icon } from '../Icon';

type SearchInputNativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children' | 'defaultValue' | 'name' | 'placeholder' | 'ref' | 'type'
> &
  Partial<Record<`data-${string}`, string | number | boolean | undefined>>;

export interface SearchInputProps
  extends Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    'action' | 'children' | 'method' | 'ref'
  > {
  label: string;
  name?: string;
  action?: string;
  method?: 'get' | 'post';
  placeholder?: string;
  defaultValue?: string;
  submitLabel?: string;
  inputProps?: SearchInputNativeInputProps;
  inputRef?: React.Ref<HTMLInputElement>;
  ref?: React.Ref<HTMLFormElement>;
}

export const SearchInput = ({
  label,
  name = 'q',
  action,
  method = 'get',
  placeholder = 'Search',
  defaultValue,
  submitLabel = 'Search',
  inputProps,
  inputRef,
  className = '',
  ref,
  role = 'search',
  ...props
}: SearchInputProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const inputValueProps = inputProps as
    | Pick<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'value'>
    | undefined;
  const {
    className: inputClassName,
    id,
    ...resolvedInputProps
  } = inputProps ?? {};
  const inputId = id ?? `${generatedId}-search-input`;
  const inputDefaultValue =
    inputValueProps?.value === undefined &&
    inputValueProps?.defaultValue === undefined
      ? defaultValue
      : undefined;

  return (
    <form
      {...props}
      ref={ref}
      action={action}
      method={method}
      role={role}
      className={joinClassNames('ofh-search-input', className)}
    >
      <div className="ofh-search-input__field">
        <label className="ofh-u-visually-hidden" htmlFor={inputId}>
          {label}
        </label>
        <input
          {...resolvedInputProps}
          ref={inputRef}
          className={joinClassNames('ofh-search-input__input', inputClassName)}
          defaultValue={inputDefaultValue}
          id={inputId}
          name={name}
          placeholder={placeholder}
          type="search"
        />
      </div>
      <button
        aria-label={submitLabel}
        className="ofh-search-input__button"
        type="submit"
      >
        <Icon
          className="ofh-search-input__button-icon"
          name="Search"
          size={32}
        />
      </button>
    </form>
  );
};

SearchInput.displayName = 'SearchInput';
