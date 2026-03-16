import React from 'react';
import {
  getHeadingTag,
  joinClasses,
  type HeadingLevel,
  type OfhIconProps,
  type OfhTagProps,
} from '../../internal/ofhUtils';
import { OfhIcon } from '../../internal/OfhIcon';
import { OfhTag } from '../../internal/OfhTag';

const interactiveSelector =
  'a, button, input, select, textarea, summary, [role="button"], [role="link"]';

export interface CardDismissButton {
  label?: string;
  attributes?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export interface CardMetadataItem {
  icon: string;
  text: React.ReactNode;
  size?: 16 | 24 | 32;
}

export interface CardActionLink {
  text: React.ReactNode;
  href: string;
  attributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

export type CardTag = OfhTagProps;
export type CardIcon = OfhIconProps;

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'ref'> {
  variant?: 'basic' | 'clickable';
  heading?: React.ReactNode;
  headingHtml?: string;
  headingClasses?: string;
  headingLevel?: HeadingLevel;
  href?: string;
  description?: React.ReactNode;
  descriptionHtml?: string;
  icon?: CardIcon;
  dismissButton?: CardDismissButton;
  number?: React.ReactNode;
  tag?: CardTag;
  metadataItems?: CardMetadataItem[];
  helperText?: React.ReactNode;
  helperHtml?: string;
  actionLink?: CardActionLink;
  imgURL?: string;
  imgALT?: string;
  classes?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const Card = ({
  variant = 'basic',
  heading,
  headingHtml,
  headingClasses = '',
  headingLevel,
  href,
  description,
  descriptionHtml,
  icon,
  dismissButton,
  number,
  tag,
  metadataItems,
  helperText,
  helperHtml,
  actionLink,
  imgURL,
  imgALT = '',
  classes = '',
  className = '',
  ref,
  onClick,
  ...props
}: CardProps) => {
  const isClickable = variant === 'clickable';
  const hasTrailingContent = Boolean(icon);
  const contentHtml = descriptionHtml;
  const dismissButtonAttributes = dismissButton?.attributes ?? {};
  const dismissButtonClassName = joinClasses(
    'ofh-card__dismiss',
    dismissButtonAttributes.className,
  );

  const handleCardClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    onClick?.(event);

    if (!isClickable || event.defaultPrevented) {
      return;
    }

    if (!(event.target instanceof Element)) {
      return;
    }

    const primaryLink = event.currentTarget.querySelector<HTMLElement>(
      '[data-ofh-card-primary-link], .ofh-card__primary-link, .ofh-card__link',
    );

    if (primaryLink === null) {
      return;
    }

    const interactiveAncestor = event.target.closest(interactiveSelector);

    if (interactiveAncestor && interactiveAncestor !== primaryLink) {
      return;
    }

    if (interactiveAncestor === primaryLink) {
      return;
    }

    primaryLink.click();
  };

  const cardClasses = joinClasses(
    'ofh-card',
    isClickable && 'ofh-card--clickable',
    hasTrailingContent && 'ofh-card__with-icon',
    classes,
    className,
  );

  const contentClasses = joinClasses(
    'ofh-card__content',
    hasTrailingContent && 'ofh-card__content--with-aside',
    dismissButton && !imgURL && 'ofh-card__content--dismissible',
  );

  const renderHeadingContent = () => {
    if (headingHtml) {
      return <div dangerouslySetInnerHTML={{ __html: headingHtml }} />;
    }

    if (!heading) {
      return null;
    }

    const headingClassName = joinClasses(
      'ofh-card__heading',
      headingClasses,
    );

    return React.createElement(
      getHeadingTag(headingLevel, 2),
      { className: headingClassName },
      href ? (
        <a
          className={joinClasses(
            'ofh-card__link',
            isClickable && 'ofh-card__primary-link',
          )}
          href={href}
          data-ofh-card-primary-link={isClickable ? 'true' : undefined}
        >
          {heading}
        </a>
      ) : (
        heading
      ),
    );
  };

  const renderDescription = () => {
    if (contentHtml) {
      return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
    }

    if (!description) {
      return null;
    }

    return <p className="ofh-card__description">{description}</p>;
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cardClasses}
      onClick={handleCardClick}
    >
      {imgURL ? <img className="ofh-card__img" src={imgURL} alt={imgALT} /> : null}

      <div className={contentClasses}>
        <div className="ofh-card__main">
          {renderHeadingContent()}

          {number ? <p className="ofh-card__number">{number}</p> : null}

          {tag ? <OfhTag {...tag} /> : null}

          {renderDescription()}

          {metadataItems?.length ? (
            <div className="ofh-card__metadata-list">
              {metadataItems.map((item, index) => (
                <div className="ofh-card__metadata-item" key={`${item.icon}-${index}`}>
                  <span
                    className="ofh-card__metadata-icon-container"
                    aria-hidden="true"
                  >
                    <OfhIcon
                      name={item.icon}
                      size={item.size ?? 24}
                      classes="ofh-card__metadata-icon"
                    />
                  </span>
                  <span className="ofh-card__metadata-text">{item.text}</span>
                </div>
              ))}
            </div>
          ) : null}

          {helperHtml ? (
            <div
              className="ofh-card__helper"
              dangerouslySetInnerHTML={{ __html: helperHtml }}
            />
          ) : helperText ? (
            <p className="ofh-card__helper">{helperText}</p>
          ) : null}

          {actionLink ? (
            <p className="ofh-card__action">
              <a
                {...actionLink.attributes}
                className={joinClasses(
                  'ofh-card__action-link',
                  isClickable && !href && 'ofh-card__primary-link',
                  actionLink.attributes?.className,
                )}
                href={actionLink.href}
                data-ofh-card-primary-link={
                  isClickable && !href ? 'true' : undefined
                }
              >
                {actionLink.text}
              </a>
            </p>
          ) : null}
        </div>

        {icon ? (
          <div className="ofh-card__aside">
            <OfhIcon
              name={icon.name}
              size={icon.size ?? 32}
              title={icon.title}
              classes={joinClasses('ofh-card__icon', icon.classes)}
              attributes={icon.attributes}
            />
          </div>
        ) : null}

      </div>

      {dismissButton ? (
        <button
          {...dismissButtonAttributes}
          className={dismissButtonClassName}
          type={dismissButtonAttributes.type ?? 'button'}
        >
          <span className="ofh-u-visually-hidden">
            {dismissButton.label ?? 'Dismiss card'}
          </span>
          <OfhIcon
            name="Close"
            size={32}
            classes="ofh-card__dismiss-icon"
          />
        </button>
      ) : null}
    </div>
  );
};

Card.displayName = 'Card';
