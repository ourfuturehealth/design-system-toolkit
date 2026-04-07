import React from 'react';
import { joinClasses } from '../../internal/ofhUtils';
import { Icon } from '../Icon';

export interface PaginationProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children' | 'ref'> {
  previousUrl?: string;
  previousPage?: React.ReactNode;
  nextUrl?: string;
  nextPage?: React.ReactNode;
  classes?: string;
  ref?: React.Ref<HTMLElement>;
}

type PaginationLinkProps = {
  direction: 'previous' | 'next';
  url: string;
  page: React.ReactNode;
};

const renderPaginationLink = ({
  direction,
  url,
  page,
}: PaginationLinkProps) => {
  const isPrevious = direction === 'previous';

  return (
    <li
      className={
        isPrevious
          ? 'ofh-pagination-item--previous'
          : 'ofh-pagination-item--next'
      }
    >
      <a
        className={joinClasses(
          'ofh-pagination__link',
          isPrevious ? 'ofh-pagination__link--prev' : 'ofh-pagination__link--next',
        )}
        href={url}
      >
        <span className="ofh-pagination__title">
          {isPrevious ? 'Previous' : 'Next'}
        </span>
        <span className="ofh-u-visually-hidden">:</span>
        <span className="ofh-pagination__page">{page}</span>
        <Icon
          name={isPrevious ? 'West' : 'East'}
          size={32}
          className="ofh-pagination__icon"
        />
      </a>
    </li>
  );
};

export const Pagination = ({
  previousUrl,
  previousPage,
  nextUrl,
  nextPage,
  classes = '',
  className = '',
  ref,
  role = 'navigation',
  ...props
}: PaginationProps) => {
  const { 'aria-label': ariaLabel = 'Pagination' } = props;

  return (
    <nav
      {...props}
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      className={joinClasses('ofh-pagination', classes, className)}
    >
      <ul className="ofh-list ofh-pagination__list">
        {previousUrl && previousPage
          ? renderPaginationLink({
              direction: 'previous',
              url: previousUrl,
              page: previousPage,
            })
          : null}
        {nextUrl && nextPage
          ? renderPaginationLink({
              direction: 'next',
              url: nextUrl,
              page: nextPage,
            })
          : null}
      </ul>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
