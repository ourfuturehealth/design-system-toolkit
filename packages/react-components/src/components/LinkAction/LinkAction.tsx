import React from 'react';
import { Icon } from '../Icon';
import { joinClassNames } from '../_internal/joinClassNames';

export interface LinkActionProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'ref'
  > {
  children: React.ReactNode;
  href: string;
  openInNewWindow?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}

export const LinkAction = ({
  children,
  href,
  openInNewWindow = false,
  className = '',
  ref,
  rel,
  target,
  ...props
}: LinkActionProps) => {
  const rootClassName = joinClassNames('ofh-action-link', className);
  const resolvedRel = openInNewWindow ? 'noopener noreferrer' : rel;
  const resolvedTarget = openInNewWindow ? '_blank' : target;

  return (
    <div className={rootClassName}>
      <a
        {...props}
        ref={ref}
        className="ofh-action-link__link"
        href={href}
        rel={resolvedRel}
        target={resolvedTarget}
      >
        <Icon
          name="ArrowCircleRightColour"
          responsiveSize={32}
          className="ofh-action-link__icon"
        />
        <span className="ofh-action-link__text">{children}</span>
      </a>
    </div>
  );
};

LinkAction.displayName = 'LinkAction';
