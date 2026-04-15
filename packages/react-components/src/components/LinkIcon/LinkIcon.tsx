import React from 'react';
import type { IconProps } from '../Icon';
import { Icon } from '../Icon';
import { mergeRelTokens } from '../../internal/mergeRelTokens';
import { joinClassNames } from '../_internal/joinClassNames';

export type LinkIconSize = 'small' | 'medium';
export type LinkIconIconPosition = 'left' | 'right';

const defaultIconNames: Record<LinkIconIconPosition, IconProps['name']> = {
  left: 'ChevronLeft',
  right: 'Launch',
};

const iconSizes: Record<LinkIconSize, 16 | 24> = {
  small: 16,
  medium: 24,
};

export interface LinkIconProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'ref'> {
  children: React.ReactNode;
  href: string;
  iconColor?: string;
  iconName?: IconProps['name'];
  iconPosition?: LinkIconIconPosition;
  leftIconName?: IconProps['name'];
  openInNewWindow?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
  rightIconName?: IconProps['name'];
  showIconLeft?: boolean;
  showIconRight?: boolean;
  size?: LinkIconSize;
}

export const LinkIcon = ({
  children,
  href,
  iconColor,
  iconName,
  iconPosition = 'left',
  leftIconName,
  openInNewWindow = false,
  size = 'small',
  className = '',
  ref,
  rel,
  rightIconName,
  showIconLeft,
  showIconRight,
  target,
  ...props
}: LinkIconProps) => {
  const resolvedShowIconLeft = showIconLeft ?? iconPosition === 'left';
  const resolvedShowIconRight = showIconRight ?? iconPosition === 'right';
  const resolvedLeftIconName =
    leftIconName ?? (iconPosition === 'left' && iconName ? iconName : defaultIconNames.left);
  const resolvedRightIconName =
    rightIconName ??
    (iconPosition === 'right' && iconName ? iconName : defaultIconNames.right);
  const resolvedIconSize = iconSizes[size];
  const rootClassName = joinClassNames(
    'ofh-link-icon',
    `ofh-link-icon--${size}`,
    `ofh-link-icon--icon-${iconPosition}`,
    className,
  );
  const resolvedRel = mergeRelTokens(rel, openInNewWindow);
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
        {resolvedShowIconLeft ? (
          <Icon
            name={resolvedLeftIconName}
            size={resolvedIconSize}
            className="ofh-link-icon__icon"
            color={iconColor}
          />
        ) : null}
        <span className="ofh-link-icon__text">{children}</span>
        {resolvedShowIconRight ? (
          <Icon
            name={resolvedRightIconName}
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
