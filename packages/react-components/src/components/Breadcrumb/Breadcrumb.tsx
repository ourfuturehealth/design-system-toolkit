import React from 'react';
import { Icon } from '../Icon';
import { joinClasses } from '../../internal/ofhUtils';

export interface BreadcrumbItem {
  /**
   * Visible breadcrumb label.
   */
  text: React.ReactNode;
  /**
   * Link target for the breadcrumb item.
   * If omitted, the item is rendered as text only.
   */
  href?: string;
  /**
   * Additional props for the breadcrumb anchor element.
   */
  anchorProps?: Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'href'
  >;
}

export interface BreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'ref'> {
  /**
   * Ancestor breadcrumb items shown in the full desktop trail.
   */
  items: BreadcrumbItem[];
  /**
   * Optional final breadcrumb item.
   * When provided, it is shown at the end of the desktop trail and used for
   * the tablet/mobile back link.
   */
  current?: BreadcrumbItem;
  /**
   * Additional toolkit-style classes for the root element.
   */
  classes?: string;
  /**
   * Ref forwarding for the underlying nav element.
   */
  ref?: React.Ref<HTMLElement>;
}

const renderDesktopItem = (
  item: BreadcrumbItem,
  key: string,
  showSeparator: boolean,
) => {
  const { className: itemAnchorClassName, ...itemAnchorProps } =
    item.anchorProps ?? {};
  const anchorClassName = joinClasses(
    'ofh-breadcrumb__link',
    itemAnchorClassName,
  );
  const content = item.href ? (
    <a
      className={anchorClassName}
      href={item.href}
      {...itemAnchorProps}
    >
      {item.text}
    </a>
  ) : (
    <span className="ofh-breadcrumb__link">{item.text}</span>
  );

  return (
    <li className="ofh-breadcrumb__item" key={key}>
      {content}
      {showSeparator ? (
        <Icon
          name="ChevronRight"
          size={16}
          className="ofh-breadcrumb__separator"
        />
      ) : null}
    </li>
  );
};

export const Breadcrumb = ({
  items,
  current,
  classes = '',
  className = '',
  ref,
  'aria-label': ariaLabel = 'Breadcrumb',
  ...props
}: BreadcrumbProps) => {
  const visibleItems = items.filter((item) => item.text !== undefined && item.text !== null);
  const mobileItem =
    current?.href
      ? current
      : [...visibleItems].reverse().find((item) => item.href);
  const rootClasses = joinClasses('ofh-breadcrumb', classes, className);
  const { className: mobileAnchorClassName, ...mobileAnchorProps } =
    mobileItem?.anchorProps ?? {};
  const mobileBackLinkClassName = joinClasses(
    'ofh-breadcrumb__backlink',
    mobileAnchorClassName,
  );

  return (
    <nav
      {...props}
      ref={ref}
      className={rootClasses}
      aria-label={ariaLabel}
    >
      <div className="ofh-width-container">
        <ol className="ofh-breadcrumb__list">
          {visibleItems.map((item, index) =>
            renderDesktopItem(
              item,
              `ancestor-${index}`,
              index < visibleItems.length - 1 || Boolean(current?.text),
            ),
          )}
          {current?.text
            ? renderDesktopItem(current, 'current', false)
            : null}
        </ol>
        {mobileItem?.href && mobileItem.text ? (
          <p className="ofh-breadcrumb__back">
            <a
              className={mobileBackLinkClassName}
              href={mobileItem.href}
              {...mobileAnchorProps}
            >
              <Icon
                name="ChevronLeft"
                size={16}
                className="ofh-breadcrumb__back-icon"
              />
              {mobileItem.text}
            </a>
          </p>
        ) : null}
      </div>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';
