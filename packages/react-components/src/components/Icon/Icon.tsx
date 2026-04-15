import bundledSpriteContent from '@ourfuturehealth/toolkit/assets/icons/icon-sprite.svg?raw';
import type React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export type IconSize = 16 | 24 | 32;

interface BaseIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'children' | 'color' | 'ref'> {
  name: string;
  title?: string;
  color?: string;
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

type BundledIconDefinition = {
  body: string;
  viewBox: string;
};

const bundledIcons = new Map<string, BundledIconDefinition>(
  Array.from(
    bundledSpriteContent.matchAll(
      /<symbol\b([^>]*)>([\s\S]*?)<\/symbol>/g,
    ),
    ([, attributes, body]) => {
      const idMatch = attributes.match(/\bid="ofh-icon-([^"]+)"/);
      const viewBoxMatch = attributes.match(/\bviewBox="([^"]+)"/);

      if (!idMatch || !viewBoxMatch) {
        return null;
      }

      return [idMatch[1], { body, viewBox: viewBoxMatch[1] }] as const;
    },
  ).filter(
    (
      icon,
    ): icon is readonly [string, BundledIconDefinition] => icon !== null,
  ),
);

export const Icon = ({
  name,
  size = 24,
  responsiveSize,
  title,
  color,
  ref,
  className = '',
  style,
  ...props
}: IconProps) => {
  const svgProps = {
    ...(props as React.SVGAttributes<SVGSVGElement> & {
      spritePath?: string;
    }),
  };
  delete svgProps.spritePath;
  const iconSize = [16, 24, 32].includes(responsiveSize ?? size)
    ? (responsiveSize ?? size)
    : 24;
  const sizeClass = responsiveSize
    ? `ofh-icon--responsive-${iconSize}`
    : `ofh-icon--${iconSize}`;
  const bundledIcon = bundledIcons.get(name);
  const iconStyle =
    color || style
      ? {
          ...(style as React.CSSProperties | undefined),
          ...(color ? { color } : {}),
        }
      : undefined;

  return (
    <svg
      {...svgProps}
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
      viewBox={bundledIcon?.viewBox}
      style={iconStyle}
    >
      {title ? <title>{title}</title> : null}
      {bundledIcon ? (
        <g dangerouslySetInnerHTML={{ __html: bundledIcon.body }}></g>
      ) : null}
    </svg>
  );
};

Icon.displayName = 'Icon';
