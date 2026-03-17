import React from 'react';

type AttributeValue = string | number | boolean | null | undefined;
type AttributeMap = Record<string, AttributeValue>;

export interface TagProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    'children' | 'dangerouslySetInnerHTML' | 'ref'
  > {
  /**
   * Plain text tag content.
   * If `html` is provided it takes precedence.
   */
  text?: string;
  /**
   * HTML tag content.
   * If provided it takes precedence over `text`.
   */
  html?: string;
  /**
   * Additional toolkit-style classes for the tag.
   */
  classes?: string;
  /**
   * Additional toolkit-style attributes for the tag.
   */
  attributes?: AttributeMap;
  /**
   * Ref forwarding for the underlying strong element.
   */
  ref?: React.Ref<HTMLElement>;
}

export const Tag = ({
  text,
  html,
  classes = '',
  className = '',
  attributes,
  ref,
  ...props
}: TagProps) => {
  const tagClasses = ['ofh-tag', classes, className].filter(Boolean).join(' ');

  return (
    <strong
      {...(attributes as React.HTMLAttributes<HTMLElement>)}
      {...props}
      ref={ref}
      className={tagClasses}
      {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}
    >
      {html ? undefined : text}
    </strong>
  );
};

Tag.displayName = 'Tag';
