import React from 'react';
import {
  getHeadingTag,
  joinClasses,
  type HeadingLevel,
} from '../../internal/ofhUtils';
import { Icon } from '../Icon';

export interface CardDoDontItem {
  item: React.ReactNode;
}

export interface CardDoDontProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'ref'> {
  type?: 'do' | 'dont';
  heading?: React.ReactNode;
  headingLevel?: HeadingLevel;
  items: CardDoDontItem[];
  classes?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const CardDoDont = ({
  type = 'do',
  heading,
  headingLevel,
  items,
  classes = '',
  className = '',
  ref,
  ...props
}: CardDoDontProps) => {
  const resolvedHeading = heading ?? (type === 'dont' ? 'Don’t' : 'Do');
  const iconName = type === 'dont' ? 'Close' : 'Done';

  return (
    <div
      {...props}
      ref={ref}
      className={joinClasses(
        'ofh-card-do-dont',
        `ofh-card-do-dont--${type}`,
        classes,
        className,
      )}
    >
      {React.createElement(
        getHeadingTag(headingLevel, 3),
        { className: 'ofh-card-do-dont__label' },
        resolvedHeading,
      )}
      <div className="ofh-card-do-dont__content">
        <div aria-hidden="true" className="ofh-card-do-dont__spacer" />
        <div className="ofh-card-do-dont__body">
          <ul className="ofh-card-do-dont__items">
            {items.map((data, index) => (
              <li className="ofh-card-do-dont__item" key={index}>
                <Icon
                  name={iconName}
                  size={32}
                  className={joinClasses(
                    'ofh-card-do-dont__icon',
                    `ofh-card-do-dont__icon--${type}`,
                  )}
                />
                <span className="ofh-card-do-dont__item-text">{data.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

CardDoDont.displayName = 'CardDoDont';
