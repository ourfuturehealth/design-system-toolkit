import React from 'react';
import {
  getHeadingTag,
  joinClasses,
  type HeadingLevel,
} from '../../internal/ofhUtils';

export type InsetTextVariant = 'info' | 'success' | 'warning' | 'error';
export type InsetTextBackground = 'grey' | 'yellow' | 'blue';

export interface InsetTextActionLink {
  text: React.ReactNode;
  href: string;
  attributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

export interface InsetTextProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  heading?: React.ReactNode;
  headingHtml?: string;
  headingLevel?: HeadingLevel;
  variant?: InsetTextVariant;
  background?: InsetTextBackground;
  html?: string;
  text?: React.ReactNode;
  actionLink?: InsetTextActionLink;
  visuallyHiddenText?: string;
  classes?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const defaultHiddenText: Record<InsetTextVariant, string> = {
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

const renderBodyText = (text: React.ReactNode) => {
  if (typeof text === 'string' || typeof text === 'number') {
    return <p>{text}</p>;
  }

  return text;
};

export const InsetText = ({
  heading,
  headingHtml,
  headingLevel,
  variant = 'info',
  background = 'grey',
  html,
  text,
  actionLink,
  visuallyHiddenText,
  classes = '',
  className = '',
  ref,
  ...props
}: InsetTextProps) => {
  const hasHeading = Boolean(heading || headingHtml);
  const resolvedVisuallyHiddenText =
    visuallyHiddenText ?? (!hasHeading ? defaultHiddenText[variant] : undefined);

  return (
    <div
      {...props}
      ref={ref}
      className={joinClasses(
        'ofh-inset-text',
        `ofh-inset-text--${variant}`,
        `ofh-inset-text--background-${background}`,
        classes,
        className,
      )}
    >
      {resolvedVisuallyHiddenText ? (
        <span className="ofh-u-visually-hidden">
          {resolvedVisuallyHiddenText}:
        </span>
      ) : null}

      {hasHeading
        ? React.createElement(
            getHeadingTag(headingLevel, 3),
            { className: 'ofh-inset-text__heading' },
            headingHtml ? (
              <span dangerouslySetInnerHTML={{ __html: headingHtml }} />
            ) : (
              heading
            ),
          )
        : null}

      {html ? (
        <div
          className="ofh-inset-text__body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : text ? (
        <div className="ofh-inset-text__body">{renderBodyText(text)}</div>
      ) : null}

      {actionLink ? (
        <p className="ofh-inset-text__action">
          <a
            {...actionLink.attributes}
            className={joinClasses(
              'ofh-inset-text__action-link',
              actionLink.attributes?.className,
            )}
            href={actionLink.href}
          >
            {actionLink.text}
          </a>
        </p>
      ) : null}
    </div>
  );
};

InsetText.displayName = 'InsetText';
