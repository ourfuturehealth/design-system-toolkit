import defaultSpritePath from '@ourfuturehealth/toolkit/assets/icons/icon-sprite.svg?url';
import type React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export type IconSize = 16 | 24 | 32;

interface BaseIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children' | 'color' | 'ref'> {
  name: string;
  title?: string;
  color?: string;
  spritePath?: string;
  ref?: React.Ref<SVGSVGElement>;
}

type StaticIconSizeProps = {
  size?: IconSize;
  responsiveSize?: never;
};

type ResponsiveIconSizeProps = {
  size?: never;
  responsiveSize: IconSize;
};

export type IconProps = BaseIconProps & (
  | StaticIconSizeProps
  | ResponsiveIconSizeProps
);

export const Icon = ({
  name,
  size = 24,
  responsiveSize,
  title,
  color,
  spritePath = defaultSpritePath,
  ref,
  className = '',
  style,
  ...props
}: IconProps) => {
  const iconSize = [16, 24, 32].includes(responsiveSize ?? size)
    ? (responsiveSize ?? size)
    : 24;
  const sizeClass = responsiveSize
    ? `ofh-icon--responsive-${iconSize}`
    : `ofh-icon--${iconSize}`;
  const iconStyle =
    color || style
      ? {
          ...(style as React.CSSProperties | undefined),
          ...(color ? { color } : {}),
        }
      : undefined;

  return (
    <svg
      {...props}
      ref={ref}
      className={joinClasses(
        'ofh-icon',
        'ofh-icon--material',
        sizeClass,
        `ofh-icon--${name}`,
        className,
      )}
      aria-hidden={title ? undefined : true}
      focusable={title ? undefined : 'false'}
      role={title ? 'img' : undefined}
      width={iconSize}
      height={iconSize}
      style={iconStyle}
    >
      {title ? <title>{title}</title> : null}
      <use href={`${spritePath}#ofh-icon-${name}`}></use>
    </svg>
  );
};

Icon.displayName = 'Icon';
