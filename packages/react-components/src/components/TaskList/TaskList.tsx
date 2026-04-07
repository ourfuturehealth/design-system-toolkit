import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';
import { Tag, type TagProps } from '../Tag';

export interface TaskListItemProps {
  title: React.ReactNode;
  href?: string;
  hint?: React.ReactNode;
  status: TagProps;
  className?: string;
  titleClassName?: string;
  hintClassName?: string;
}

export interface TaskListProps
  extends Omit<
    React.HTMLAttributes<HTMLUListElement>,
    'children' | 'className' | 'ref'
  > {
  idPrefix?: string;
  items: TaskListItemProps[];
  classes?: string;
  className?: string;
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
