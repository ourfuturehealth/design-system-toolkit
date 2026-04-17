import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

type ContentsListAnchorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'href'
> & {
  [key: `data-${string}`]: string | number | undefined;
};

export interface ContentsListItem {
  /** Visible label for the contents list item. */
  text: React.ReactNode;
  /** Link destination for the item. Omit it when the item is the current page. */
  href?: string;
  /** Marks the item as the current page so it is rendered as text instead of a link. */
  current?: boolean;
  /** Extra anchor attributes for linked items, such as `target`, `rel`, or `data-*` hooks. */
  anchorProps?: ContentsListAnchorProps;
}

export interface ContentsListProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children' | 'ref'> {
  /** Contents list items rendered in order. */
  items: ContentsListItem[];
  /** Toolkit-parity alias for adding extra classes to the root element. */
  classes?: string;
  /** React ref for the root `<nav>` element. */
  ref?: React.Ref<HTMLElement>;
}

export const ContentsList = ({
  items,
  classes = '',
  className = '',
  ref,
  ...props
}: ContentsListProps) => {
  const { 'aria-label': ariaLabel = 'Pages in this guide' } = props;

  return (
    <nav
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      className={joinClassNames('ofh-contents-list', classes, className)}
    >
      <h2 className="ofh-u-visually-hidden">Contents</h2>
      <ol className="ofh-contents-list__list">
        {items.map((item, index) => {
          const key = item.href ?? `${index}-${String(item.text)}`;

          return item.current ? (
            <li className="ofh-contents-list__item" aria-current="page" key={key}>
              <span className="ofh-contents-list__current">{item.text}</span>
            </li>
          ) : (
            <li className="ofh-contents-list__item" key={key}>
              <a
                {...item.anchorProps}
                className={joinClassNames(
                  'ofh-contents-list__link',
                  item.anchorProps?.className,
                )}
                href={item.href}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

ContentsList.displayName = 'ContentsList';
