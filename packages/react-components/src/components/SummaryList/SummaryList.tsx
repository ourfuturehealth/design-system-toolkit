import React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export interface SummaryListContent {
  text?: React.ReactNode;
  html?: string;
  classes?: string;
}

export interface SummaryListActionItem {
  href: string;
  text?: React.ReactNode;
  html?: string;
  visuallyHiddenText?: string;
  attributes?: Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'dangerouslySetInnerHTML' | 'href' | 'ref'
  >;
}

export interface SummaryListRow {
  key: SummaryListContent;
  value: SummaryListContent;
  actions?: {
    items: SummaryListActionItem[];
    classes?: string;
  };
  classes?: string;
}

export interface SummaryListProps
  extends Omit<React.HTMLAttributes<HTMLDListElement>, 'children' | 'ref'> {
  rows: SummaryListRow[];
  padded?: boolean;
  noBorder?: boolean;
  classes?: string;
  attributes?: Record<string, string | number | boolean | null | undefined>;
  ref?: React.Ref<HTMLDListElement>;
}

function renderSummaryListContent(
  tagName: 'dt' | 'dd',
  content: SummaryListContent,
  className: string,
) {
  if (content.html) {
    return React.createElement(tagName, {
      className,
      dangerouslySetInnerHTML: { __html: content.html },
    });
  }

  return React.createElement(tagName, { className }, content.text);
}

function renderActionLink(
  action: SummaryListActionItem,
) {
  const visibleContent = action.html ? (
    <span dangerouslySetInnerHTML={{ __html: action.html }} />
  ) : (
    action.text
  );

  return (
    <a
      {...action.attributes}
      href={action.href}
    >
      {visibleContent}
      {action.visuallyHiddenText ? (
        <>
          {' '}
          <span className="ofh-u-visually-hidden">
            {action.visuallyHiddenText}
          </span>
        </>
      ) : null}
    </a>
  );
}

export const SummaryList = ({
  rows,
  padded = true,
  noBorder = false,
  classes = '',
  className = '',
  attributes,
  ref,
  ...props
}: SummaryListProps) => {
  const summaryListClasses = joinClasses(
    'ofh-summary-list',
    padded ? 'ofh-summary-list--padded' : 'ofh-summary-list--compact',
    noBorder ? 'ofh-summary-list--no-border' : undefined,
    classes,
    className,
  );

  return (
    <dl
      {...(attributes as React.HTMLAttributes<HTMLDListElement>)}
      {...props}
      ref={ref}
      className={summaryListClasses}
    >
      {rows.map((row, rowIndex) => {
        const rowClasses = joinClasses(
          'ofh-summary-list__row',
          row.classes,
        );
        const keyClassName = joinClasses(
          'ofh-summary-list__key',
          row.key.classes,
        );
        const valueClassName = joinClasses(
          'ofh-summary-list__value',
          row.value.classes,
        );
        const actionsClassName = joinClasses(
          'ofh-summary-list__actions',
          row.actions?.classes,
        );

        return (
          <div className={rowClasses} key={`summary-list-row-${rowIndex}`}>
            {renderSummaryListContent('dt', row.key, keyClassName)}
            {renderSummaryListContent('dd', row.value, valueClassName)}
            {row.actions?.items?.length ? (
              <dd className={actionsClassName}>
                {row.actions.items.length === 1 ? (
                  renderActionLink(row.actions.items[0])
                ) : (
                  <ul className="ofh-summary-list__actions-list">
                    {row.actions.items.map((action, index) => (
                      <li
                        className="ofh-summary-list__actions-list-item"
                        key={`${action.href}-${index}`}
                      >
                        {renderActionLink(action)}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
};

SummaryList.displayName = 'SummaryList';
