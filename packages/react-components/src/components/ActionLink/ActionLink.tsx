import React from 'react';
import { Icon } from '../Icon';
import { joinClassNames } from '../_internal/joinClassNames';

export interface ActionLinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'ref'
  > {
  children: React.ReactNode;
  href: string;
  openInNewWindow?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}

export const ActionLink = ({
  children,
  href,
  openInNewWindow = false,
  className = '',
  ref,
  rel,
  target,
  ...props
}: ActionLinkProps) => {
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

ActionLink.displayName = 'ActionLink';
