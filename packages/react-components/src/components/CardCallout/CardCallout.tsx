import React from 'react';
import {
  getHeadingTag,
  joinClasses,
  type HeadingLevel,
} from '../../internal/ofhUtils';

export interface CardCalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'ref'> {
  heading: React.ReactNode;
  headingHtml?: string;
  headingLevel?: HeadingLevel;
  variant?: 'info' | 'error' | 'success' | 'warning';
  html?: string;
  text?: React.ReactNode;
  classes?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const CardCallout = ({
  heading,
  headingHtml,
  headingLevel,
  variant = 'info',
  html,
  text,
  classes = '',
  className = '',
  ref,
  ...props
}: CardCalloutProps) => {
  return (
    <div
      {...props}
      ref={ref}
      className={joinClasses(
        'ofh-card-callout',
        `ofh-card-callout--${variant}`,
        classes,
        className,
      )}
    >
      {React.createElement(
        getHeadingTag(headingLevel, 3),
        { className: 'ofh-card-callout__label' },
        headingHtml ? (
          <span dangerouslySetInnerHTML={{ __html: headingHtml }} />
        ) : (
          heading
        ),
      )}
      <div className="ofh-card-callout__content">
        <div aria-hidden="true" className="ofh-card-callout__spacer" />
        <div
          className="ofh-card-callout__body"
          {...(html ? { dangerouslySetInnerHTML: { __html: html } } : undefined)}
        >
          {!html && text ? <p>{text}</p> : null}
        </div>
      </div>
    </div>
  );
};

CardCallout.displayName = 'CardCallout';
