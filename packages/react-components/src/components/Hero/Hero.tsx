import React from 'react';
import { mergeRelTokens } from '../../internal/mergeRelTokens';
import { getHeadingTag, joinClasses, type HeadingLevel } from '../../internal/ofhUtils';
import { Button } from '../Button';
import { TilePattern, type TilePatternColor, type TilePatternTile } from '../TilePattern';

type HeroTheme = 'brand' | 'dark';
type HeroVariant = 'free' | 'boxed';
type HeroAs = 'section' | 'div';

const heroDecorationPatternRight: TilePatternTile[][] = [
  [
    1,
    { type: 2, color: 'transparent' },
    { type: 3, color: 'transparent' },
    { type: 4, color: 'transparent' },
    5,
    6,
  ],
  [
    { type: 7, color: 'transparent' },
    8,
    { type: 9, color: 'transparent' },
    10,
    11,
    12,
  ],
  [
    { type: 13, color: 'transparent' },
    14,
    15,
    { type: 16, color: 'transparent' },
    { type: 18, color: 'transparent' },
    19,
  ],
];

const heroDecorationPatternLeft: TilePatternTile[][] = [
  [
    { type: 1, color: 'transparent' },
    { type: 2, color: 'transparent' },
    { type: 3, color: 'transparent' },
    { type: 4, color: 'transparent' },
    { type: 5, color: 'transparent' },
    6,
  ],
  [7, 21, 9, { type: 10, color: 'transparent' }, 11, 12],
  [
    { type: 13, color: 'transparent' },
    1,
    5,
    3,
    { type: 18, color: 'transparent' },
    19,
  ],
];

interface HeroImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  decorative?: boolean;
}

type HeroPrimaryAction =
  | ({
      children: React.ReactNode;
      href: string;
    } & Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'children' | 'className' | 'href' | 'ref'
    >)
  | ({
      children: React.ReactNode;
    } & Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'children' | 'className' | 'ref'
    >);

interface HeroSecondaryAction
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'className' | 'href' | 'ref'
  > {
  children: React.ReactNode;
  href: string;
  openInNewWindow?: boolean;
}

export interface HeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'ref'> {
  theme?: HeroTheme;
  variant?: HeroVariant;
  heading: React.ReactNode;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode;
  primaryAction?: HeroPrimaryAction;
  secondaryAction?: HeroSecondaryAction;
  image?: HeroImage;
  showDecoration?: boolean;
  as?: HeroAs;
  classes?: string;
  ref?: React.Ref<HTMLElement>;
}

export const Hero = ({
  theme = 'brand',
  variant = 'free',
  heading,
  headingLevel = 1,
  description,
  primaryAction,
  secondaryAction,
  image,
  showDecoration = true,
  as = 'section',
  classes = '',
  className = '',
  ref,
  ...props
}: HeroProps) => {
  const headingTag = getHeadingTag(headingLevel, 1);
  const hasImage = Boolean(image?.src);
  const imageAlt = image?.decorative ? '' : (image?.alt ?? '');
  const decorationColor: TilePatternColor = theme === 'dark' ? 'white' : 'brand';
  const rootClassName = joinClasses(
    'ofh-hero',
    `ofh-hero--${theme}`,
    `ofh-hero--${variant}`,
    hasImage && 'ofh-hero--with-image',
    !showDecoration && 'ofh-hero--no-decoration',
    classes,
    className,
  );
  const rootProps = {
    ...props,
    className: rootClassName,
  };
  const secondaryActionContent = secondaryAction ? (
    (() => {
      const {
        children,
        href,
        openInNewWindow = false,
        ...secondaryActionProps
      } = secondaryAction;
      const opensInNewWindow =
        openInNewWindow || secondaryActionProps.target === '_blank';

      return (
        <p className="ofh-hero__secondary-action">
          <a
            {...secondaryActionProps}
            className="ofh-hero__secondary-link"
            href={href}
            rel={mergeRelTokens(
              secondaryActionProps.rel,
              opensInNewWindow,
            )}
            target={
              opensInNewWindow
                ? '_blank'
                : secondaryActionProps.target
            }
          >
            {children}
          </a>
        </p>
      );
    })()
  ) : null;

  const content = (
    <>
      {showDecoration ? (
        <>
          <div className="ofh-hero__decoration ofh-hero__decoration--top-right">
            <TilePattern
              className="ofh-hero__tile-pattern"
              color={decorationColor}
              tiles={heroDecorationPatternRight}
            />
          </div>
          <div className="ofh-hero__decoration ofh-hero__decoration--left-edge">
            <TilePattern
              className="ofh-hero__tile-pattern"
              color={decorationColor}
              tiles={heroDecorationPatternLeft}
            />
          </div>
          {variant === 'boxed' ? (
            <div className="ofh-hero__decoration ofh-hero__decoration--top-left">
              <TilePattern
                className="ofh-hero__tile-pattern"
                color={decorationColor}
                tiles={heroDecorationPatternLeft}
              />
            </div>
          ) : null}
        </>
      ) : null}
      <div className="ofh-width-container-fluid ofh-hero__container">
        <div className="ofh-grid-row ofh-hero__row">
          <div
            className={joinClasses(
              hasImage ? 'ofh-grid-column-one-half' : 'ofh-grid-column-two-thirds',
              'ofh-hero__content-column',
            )}
          >
            <div
              className={joinClasses(
                'ofh-hero__content',
                variant === 'boxed' && 'ofh-hero__content--boxed',
              )}
            >
              <div className="ofh-hero__text-group">
                {React.createElement(
                  headingTag,
                  { className: 'ofh-hero__heading' },
                  heading,
                )}

                {description ? (
                  <div className="ofh-hero__description">{description}</div>
                ) : null}

                {secondaryActionContent}
              </div>

              {primaryAction ? (
                <div className="ofh-hero__primary-action">
                  <Button {...primaryAction} variant="contained">
                    {primaryAction.children}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {hasImage && image ? (
            <div className="ofh-grid-column-one-half ofh-hero__media-column">
              <div className="ofh-hero__media">
                <img
                  className="ofh-hero__image"
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes={image.sizes}
                  alt={imageAlt}
                  aria-hidden={image.decorative ? 'true' : undefined}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  if (as === 'div') {
    return (
      <div {...rootProps} ref={ref as React.Ref<HTMLDivElement>}>
        {content}
      </div>
    );
  }

  return (
    <section {...rootProps} ref={ref as React.Ref<HTMLElement>}>
      {content}
    </section>
  );
};

Hero.displayName = 'Hero';

export type {
  HeroAs,
  HeroImage,
  HeroPrimaryAction,
  HeroSecondaryAction,
  HeroTheme,
  HeroVariant,
};
