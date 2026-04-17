import React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export interface ImageProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'ref'> {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  sizes?: string;
  srcSet?: string;
  classes?: string;
  ref?: React.Ref<HTMLElement>;
}

export const Image = ({
  src,
  alt,
  caption,
  sizes,
  srcSet,
  classes = '',
  className = '',
  ref,
  ...props
}: ImageProps) => {
  return (
    <figure
      {...props}
      ref={ref}
      className={joinClasses('ofh-image', classes, className)}
    >
      <img
        className="ofh-image__img"
        src={src}
        alt={alt}
        {...(sizes && srcSet ? { sizes, srcSet } : undefined)}
      />
      {caption !== undefined && caption !== null ? (
        <figcaption className="ofh-image__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
};

Image.displayName = 'Image';
