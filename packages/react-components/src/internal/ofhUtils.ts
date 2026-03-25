import type React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type OfhIconSize = 16 | 24 | 32;

export interface OfhIconProps {
  name: string;
  size?: OfhIconSize;
  title?: string;
  color?: string;
  classes?: string;
  attributes?: React.SVGAttributes<SVGSVGElement>;
  spritePath?: string;
}

export const joinClasses = (
  ...classes: Array<string | false | null | undefined>
) => classes.filter(Boolean).join(' ');

export const getHeadingTag = (
  level: number | undefined,
  fallback: HeadingLevel,
) => {
  const safeLevel = [1, 2, 3, 4, 5, 6].includes(level ?? fallback)
    ? (level ?? fallback)
    : fallback;

  return `h${safeLevel}` as keyof React.JSX.IntrinsicElements;
};
