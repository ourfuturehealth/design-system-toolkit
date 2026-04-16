import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';
import { Tag, type TagProps } from '../Tag';

export interface TaskListItemProps {
  /** Task title content shown at the start of the row. */
  title: React.ReactNode;
  /** Optional URL. When provided, the task row becomes a clickable link. */
  href?: string;
  /** Optional short supporting text shown below the task title. */
  hint?: React.ReactNode;
  /** Shared Tag props used to render the task status on the right. */
  status: TagProps;
  /** Additional classes added to the row container. */
  className?: string;
  /** Additional classes added to the task title element or link. */
  titleClassName?: string;
  /** Additional classes added to the optional hint element. */
  hintClassName?: string;
}

export interface TaskListProps
  extends Omit<
    React.HTMLAttributes<HTMLUListElement>,
    'children' | 'className' | 'ref'
  > {
  /** Optional prefix used to generate the internal hint and status ids for each row. */
  idPrefix?: string;
  /** Task rows to render in order. */
  items: TaskListItemProps[];
  /** Toolkit-parity alias for adding extra classes to the root element. */
  classes?: string;
  /** Additional classes added to the root `<ul>` element. */
  className?: string;
  /** React ref for the root `<ul>` element. */
  ref?: React.Ref<HTMLUListElement>;
}

export const TaskList = ({
  idPrefix,
  items,
  classes = '',
  className = '',
  ref,
  ...props
}: TaskListProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const resolvedIdPrefix = idPrefix ?? `task-list-${generatedId}`;

  return (
    <ul
      {...props}
      ref={ref}
      className={joinClassNames('ofh-task-list', classes, className)}
    >
      {items.map((item, index) => {
        const itemIndex = index + 1;
        const hintId = item.hint
          ? `${resolvedIdPrefix}-${itemIndex}-hint`
          : undefined;
        const statusId = `${resolvedIdPrefix}-${itemIndex}-status`;
        const itemClasses = joinClassNames(
          'ofh-task-list__item',
          item.href ? 'ofh-task-list__item--with-link' : undefined,
          item.className,
        );
        const nameAndHintClasses = joinClassNames('ofh-task-list__name-and-hint');
        const titleClasses = joinClassNames(
          item.href ? 'ofh-link ofh-task-list__link' : undefined,
          item.titleClassName,
        );

        return (
          <li className={itemClasses} key={`${statusId}-${itemIndex}`}>
            <div className={nameAndHintClasses}>
              {item.href ? (
                <a
                  className={titleClasses}
                  href={item.href}
                  aria-describedby={
                    [hintId, statusId].filter(Boolean).join(' ') || undefined
                  }
                >
                  {item.title}
                </a>
              ) : (
                <div className={item.titleClassName}>{item.title}</div>
              )}

              {item.hint ? (
                <div id={hintId} className={joinClassNames('ofh-task-list__hint', item.hintClassName)}>
                  {item.hint}
                </div>
              ) : null}
            </div>

            <div className="ofh-task-list__status" id={statusId}>
              <Tag {...item.status} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

TaskList.displayName = 'TaskList';
