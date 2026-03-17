import React from 'react';
import { joinClassNames } from './joinClassNames';

type IconGlyphName = 'Done' | 'UnfoldMore';

interface IconGlyphProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconGlyphName;
  size?: 24 | 32;
}

const glyphPaths: Record<IconGlyphName, string> = {
  Done: 'M9.5501 18L3.8501 12.3L5.2751 10.875L9.5501 15.15L18.7251 5.97501L20.1501 7.40001L9.5501 18Z',
  UnfoldMore:
    'M12 21L7.5 16.5L8.95 15.05L12 18.1L15.05 15.05L16.5 16.5L12 21ZM8.95 9.04998L7.5 7.59998L12 3.09998L16.5 7.59998L15.05 9.04998L12 5.99998L8.95 9.04998Z',
};

export function IconGlyph({
  className,
  name,
  size = 24,
  ...props
}: IconGlyphProps) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      className={joinClassNames(
        'ofh-icon',
        'ofh-icon--material',
        `ofh-icon--${size}`,
        className,
      )}
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={glyphPaths[name]} fill="currentColor" />
    </svg>
  );
}
