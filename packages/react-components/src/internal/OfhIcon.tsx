import defaultSpritePath from '@ourfuturehealth/toolkit/assets/icons/icon-sprite.svg?url';
import { joinClasses, type OfhIconProps } from './ofhUtils';

export const OfhIcon = ({
  name,
  size = 24,
  title,
  classes = '',
  attributes,
  spritePath = defaultSpritePath,
}: OfhIconProps) => {
  const iconSize = [16, 24, 32].includes(size) ? size : 24;
  const iconAttributes = attributes ?? {};
  const className = joinClasses(
    'ofh-icon',
    'ofh-icon--material',
    `ofh-icon--${iconSize}`,
    `ofh-icon--${name}`,
    classes,
    iconAttributes.className,
  );

  return (
    <svg
      {...iconAttributes}
      className={className}
      aria-hidden={title ? 'false' : 'true'}
      focusable={title ? undefined : 'false'}
      role={title ? 'img' : undefined}
      width={iconSize}
      height={iconSize}
    >
      {title ? <title>{title}</title> : null}
      <use href={`${spritePath}#ofh-icon-${name}`}></use>
    </svg>
  );
};
