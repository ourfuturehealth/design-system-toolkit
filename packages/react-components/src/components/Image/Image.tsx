import React from 'react';
import { joinClasses } from '../../internal/ofhUtils';

export interface ImageProps
  extends Omit<React.HTMLAttributes<HTMLFigureElement>, 'children' | 'ref'> {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  sizes?: string;
  srcSet?: string;
  srcset?: string;
  classes?: string;
  ref?: React.Ref<HTMLFigureElement>;
}

export const Image = ({
  src,
  alt,
  caption,
  sizes,
  srcSet,
  srcset,
  classes = '',
  className = '',
  ref,
  ...props
}: ImageProps) => {
  const resolvedSrcSet = srcSet ?? srcset;

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
        {...(sizes && resolvedSrcSet ? { sizes, srcSet: resolvedSrcSet } : undefined)}
      />
      {caption !== undefined && caption !== null ? (
        <figcaption className="ofh-image__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
};

Image.displayName = 'Image';
