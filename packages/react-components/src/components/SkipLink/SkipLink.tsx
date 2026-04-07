import React from 'react';
import { joinClassNames } from '../_internal/joinClassNames';

export interface SkipLinkProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'ref'
  > {
  children?: React.ReactNode;
  href?: string;
  ref?: React.Ref<HTMLAnchorElement>;
}

export const SkipLink = ({
  children = 'Skip to main content',
  href = '#maincontent',
  className = '',
  ref,
  ...props
}: SkipLinkProps) => (
  <a
    {...props}
    ref={ref}
    className={joinClassNames('ofh-skip-link', className)}
    href={href}
  >
    {children}
  </a>
);

SkipLink.displayName = 'SkipLink';
