import React from 'react';

export type TagVariant =
  | 'neutral'
  | 'brand'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'red';

const variantClasses: Record<TagVariant, string> = {
  neutral: 'ofh-tag--neutral',
  brand: 'ofh-tag--brand',
  blue: 'ofh-tag--blue',
  green: 'ofh-tag--green',
  yellow: 'ofh-tag--yellow',
  red: 'ofh-tag--red',
};

export interface TagProps
  extends Omit<
    React.HTMLAttributes<HTMLElementTagNameMap['strong']>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  /**
   * Visual style variant.
   */
  variant?: TagVariant;
  /**
   * Tag content.
   */
  children: React.ReactNode;
  /**
   * Ref forwarding for the underlying strong element.
   */
  ref?: React.Ref<HTMLElementTagNameMap['strong']>;
}

export const Tag = ({
  variant = 'neutral',
  className = '',
  children,
  ref,
  ...props
}: TagProps) => {
  const tagClasses = ['ofh-tag', variantClasses[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <strong
      {...props}
      ref={ref}
      className={tagClasses}
    >
      {children}
    </strong>
  );
};

Tag.displayName = 'Tag';
