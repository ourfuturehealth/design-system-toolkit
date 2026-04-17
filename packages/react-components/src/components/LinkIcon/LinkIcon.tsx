import React from 'react';
import { Icon } from '../Icon';
import { joinClassNames } from '../_internal/joinClassNames';

export type LinkIconSize = 'small' | 'medium';
export type LinkIconIconPosition = 'left' | 'right';

const defaultIconNames: Record<LinkIconIconPosition, string> = {
  left: 'ChevronLeft',
  right: 'Launch',
};

const iconSizes: Record<LinkIconSize, 16 | 24> = {
  small: 16,
  medium: 24,
};

export interface LinkIconProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'ref'
  > {
  children: React.ReactNode;
  href: string;
  iconColor?: string;
  iconName?: string;
  iconPosition?: LinkIconIconPosition;
  openInNewWindow?: boolean;
  size?: LinkIconSize;
  ref?: React.Ref<HTMLAnchorElement>;
}

export const LinkIcon = ({
  children,
  href,
  iconColor,
  iconName,
  iconPosition = 'left',
  openInNewWindow = false,
  size = 'small',
  className = '',
  ref,
  rel,
  target,
  ...props
}: LinkIconProps) => {
  const resolvedIconName = iconName ?? defaultIconNames[iconPosition];
  const resolvedIconSize = iconSizes[size];
  const rootClassName = joinClassNames(
    'ofh-link-icon',
    `ofh-link-icon--${size}`,
    `ofh-link-icon--icon-${iconPosition}`,
    className,
  );
  const resolvedRel = openInNewWindow ? 'noopener noreferrer' : rel;
  const resolvedTarget = openInNewWindow ? '_blank' : target;

  return (
    <div className={rootClassName}>
      <a
        {...props}
        ref={ref}
        className="ofh-link-icon__link"
        href={href}
        rel={resolvedRel}
        target={resolvedTarget}
      >
        {iconPosition === 'left' ? (
          <Icon
            name={resolvedIconName}
            size={resolvedIconSize}
            className="ofh-link-icon__icon"
            color={iconColor}
          />
        ) : null}
        <span className="ofh-link-icon__text">{children}</span>
        {iconPosition === 'right' ? (
          <Icon
            name={resolvedIconName}
            size={resolvedIconSize}
            className="ofh-link-icon__icon"
            color={iconColor}
          />
        ) : null}
      </a>
    </div>
  );
};

LinkIcon.displayName = 'LinkIcon';
