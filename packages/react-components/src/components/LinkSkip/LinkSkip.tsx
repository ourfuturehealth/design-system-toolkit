import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface LinkSkipProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'ref'
  > {
  children?: React.ReactNode;
  href?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}

export const LinkSkip = ({
  children = 'Skip to main content',
  href = '#maincontent',
  className = '',
  ref,
  ...props
}: LinkSkipProps) => (
  <a
    {...props}
    ref={ref}
    className={joinClassNames('ofh-skip-link', className)}
    href={href}
  >
    {children}
  </a>
);

LinkSkip.displayName = 'LinkSkip';
