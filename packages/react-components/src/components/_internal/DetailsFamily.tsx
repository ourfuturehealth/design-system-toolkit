import type React from 'react';
import { Icon } from '../Icon';
import { joinClasses } from '../../internal/ofhUtils';

export type DetailsFamilyVariant = 'details' | 'expander';

const summaryIcons: Record<
  DetailsFamilyVariant,
  {
    closed: string;
    open: string;
  }
> = {
  details: {
    closed: 'ChevronRight',
    open: 'ChevronDown',
  },
  expander: {
    closed: 'AddCircle',
    open: 'MinusCircle',
  },
};

export interface DetailsFamilyBaseProps
  extends Omit<
    React.DetailsHTMLAttributes<HTMLDetailsElement>,
    'children' | 'ref'
  > {
  /**
   * Summary text or nodes shown in the clickable header.
   */
  summary: React.ReactNode;
  /**
   * Content shown when the details element is expanded.
   */
  children: React.ReactNode;
  /**
   * Shared internal variant selector.
   */
  variant: DetailsFamilyVariant;
  /**
   * React ref for the underlying details element.
   */
  ref?: React.Ref<HTMLDetailsElement>;
}

export type DetailsFamilyProps = Omit<DetailsFamilyBaseProps, 'variant'>;

export const DetailsFamilyBase = ({
  summary,
  children,
  variant,
  className = '',
  ref,
  ...props
}: DetailsFamilyBaseProps) => {
  const iconNames = summaryIcons[variant];
  const rootClassName = joinClasses(
    'ofh-details',
    variant === 'expander' && 'ofh-expander',
    className,
  );

  return (
    <details
      {...props}
      ref={ref}
      className={rootClassName}
    >
      <summary
        className={joinClasses(
          'ofh-details__summary',
          `ofh-details__summary--${variant}`,
        )}
      >
        <span
          className={joinClasses(
            'ofh-details__summary-icon',
            `ofh-details__summary-icon--${variant}-closed`,
          )}
          aria-hidden="true"
        >
          <Icon
            name={iconNames.closed}
            size={32}
            className="ofh-details__summary-icon-svg"
          />
        </span>
        <span
          className={joinClasses(
            'ofh-details__summary-icon',
            `ofh-details__summary-icon--${variant}-open`,
          )}
          aria-hidden="true"
        >
          <Icon
            name={iconNames.open}
            size={32}
            className="ofh-details__summary-icon-svg"
          />
        </span>
        <span className="ofh-details__summary-text">{summary}</span>
      </summary>
      <div className="ofh-details__text">
        <div
          className={joinClasses(
            'ofh-details__panel',
            `ofh-details__panel--${variant}`,
          )}
        >
          {children}
        </div>
      </div>
    </details>
  );
};

DetailsFamilyBase.displayName = 'DetailsFamilyBase';
