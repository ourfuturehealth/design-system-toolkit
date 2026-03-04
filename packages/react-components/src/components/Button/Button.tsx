import React from 'react';
import styles from './Button.module.scss';

// Base props shared between button and anchor variants
interface BaseButtonProps {
  /**
   * Button variant/style
   */
  variant?:
    | 'contained'
    | 'outlined'
    | 'ghost'
    | 'ghost-reverse'
    | 'text'
    | 'text-reverse';
  /**
   * Button content
   */
  children: React.ReactNode;
}

// Button element props
interface ButtonElementProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'ref'>,
    BaseButtonProps {
  /**
   * If provided, renders as an anchor tag
   */
  href?: never;
  /**
   * Ref forwarding for button element
   */
  ref?: React.Ref<HTMLButtonElement>;
}

// Anchor element props
interface AnchorElementProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'ref'>,
    BaseButtonProps {
  /**
   * URL to navigate to (renders as anchor tag)
   */
  href: string;
  /**
   * Not applicable for anchor elements
   */
  disabled?: never;
  /**
   * Ref forwarding for anchor element
   */
  ref?: React.Ref<HTMLAnchorElement>;
}

export type ButtonProps = ButtonElementProps | AnchorElementProps;

export const Button = ({
  variant = 'contained',
  className = '',
  children,
  ref,
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    'ofh-button', // Existing OFH design system class
    styles.button, // Our component-specific styles
    `ofh-button--${variant}`, // Variant classes
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render as anchor if href is provided
  if ('href' in props && props.href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={buttonClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  // Render as button
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={buttonClasses}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

Button.displayName = 'Button';
