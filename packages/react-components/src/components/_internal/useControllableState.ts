import React from 'react';

interface UseControllableStateParams<T> {
  defaultValue: T;
  value?: T;
}

export function useControllableState<T>({
  defaultValue,
  value,
}: UseControllableStateParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const setValue = (nextValue: T | ((previousValue: T) => T)) => {
    if (isControlled) {
      return;
    }

    setUncontrolledValue(nextValue);
  };

  return [currentValue, setValue] as const;
}
