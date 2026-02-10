import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  className = '',
  disabled,
  children,
  ...props
}) => {
  const buttonClasses = [
    'ofh-button', // Existing OFH design system class
    styles.button, // Our component-specific styles
    `ofh-button--${variant}`, // Variant classes
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      <span>{children}</span>
    </button>
  );
};
