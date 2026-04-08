import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export type FieldsetLegendSize =
  | 'none'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge';

const legendSizeClassNames: Partial<Record<FieldsetLegendSize, string>> = {
  small: 'ofh-fieldset__legend--s',
  medium: 'ofh-fieldset__legend--m',
  large: 'ofh-fieldset__legend--l',
  extraLarge: 'ofh-fieldset__legend--xl',
};

interface FieldsetBaseProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'ref'> {
  /**
   * Content rendered inside the legend element.
   */
  legend?: React.ReactNode;
  /**
   * Optional IDs to append to the fieldset `aria-describedby` attribute.
   */
  describedBy?: string;
  /**
   * Wrap the legend content in an `h1` when this question is also the page heading.
   */
  isPageHeading?: boolean;
  /**
   * Named size modifier for the legend element.
   */
  legendSize?: FieldsetLegendSize;
  /**
   * Internal-only additional classes for the legend element.
   */
  legendClassName?: string;
  /**
   * React ref for the fieldset element.
   */
  ref?: React.Ref<HTMLFieldSetElement>;
}

export type FieldsetProps = Omit<FieldsetBaseProps, 'legendClassName'>;

// Internal shared renderer used by Fieldset and input-family components.
// It keeps the public Fieldset API simple while still allowing composed
// components like Radios, Checkboxes, and DateInput to add their input-specific
// legend classes without duplicating the fieldset and legend markup.
export const FieldsetBase = ({
  legend,
  describedBy,
  isPageHeading = false,
  legendSize = 'none',
  legendClassName,
  className,
  children,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FieldsetBaseProps) => {
  const describedByValue =
    [describedBy, ariaDescribedBy].filter(Boolean).join(' ') || undefined;
  const legendSizeClassName =
    legendSize === 'none' ? undefined : legendSizeClassNames[legendSize];

  return (
    <fieldset
      {...props}
      ref={ref}
      className={joinClassNames('ofh-fieldset', className)}
      aria-describedby={describedByValue}
    >
      {legend ? (
        <legend
          className={joinClassNames(
            'ofh-fieldset__legend',
            legendSizeClassName,
            legendClassName,
          )}
        >
          {isPageHeading ? (
            <h1 className="ofh-fieldset__heading">{legend}</h1>
          ) : (
            legend
          )}
        </legend>
      ) : null}
      {children}
    </fieldset>
  );
};

export const Fieldset = (props: FieldsetProps) => <FieldsetBase {...props} />;

FieldsetBase.displayName = 'FieldsetBase';
Fieldset.displayName = 'Fieldset';
