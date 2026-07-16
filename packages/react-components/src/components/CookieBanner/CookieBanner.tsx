import React from 'react';
import { mergeRelTokens } from '../../internal/mergeRelTokens';
import { getHeadingTag, joinClasses, type HeadingLevel } from '../../internal/ofhUtils';
import { Button } from '../Button';

export interface CookieBannerLink {
  href?: string;
  label?: React.ReactNode;
  attributes?: Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'href'
  >;
}

type CookieBannerButtonAttributes = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick' | 'ref' | 'type'
> & {
  [key: `data-${string}`]: string | number | undefined;
};

export interface CookieBannerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'ref'> {
  heading?: React.ReactNode;
  headingLevel?: HeadingLevel;
  essentialCookiesText?: React.ReactNode;
  analyticsCookiesText?: React.ReactNode;
  privacyNotice?: CookieBannerLink;
  cookiePolicy?: CookieBannerLink;
  acceptLabel?: React.ReactNode;
  rejectLabel?: React.ReactNode;
  onAccept?: React.MouseEventHandler<HTMLButtonElement>;
  onReject?: React.MouseEventHandler<HTMLButtonElement>;
  acceptButtonAttributes?: CookieBannerButtonAttributes;
  rejectButtonAttributes?: CookieBannerButtonAttributes;
  children?: React.ReactNode;
  classes?: string;
  ref?: React.Ref<HTMLElement>;
}

const defaultPrivacyNotice: Required<
  Pick<CookieBannerLink, 'href' | 'label' | 'attributes'>
> = {
  href: 'https://ourfuturehealth.org.uk/privacy',
  label: 'privacy notice',
  attributes: { target: '_blank', rel: 'noopener noreferrer' },
};

const defaultCookiePolicy: Required<
  Pick<CookieBannerLink, 'href' | 'label' | 'attributes'>
> = {
  href: 'https://ourfuturehealth.org.uk/cookies',
  label: 'cookie policy',
  attributes: { target: '_blank', rel: 'noopener noreferrer' },
};

const resolveLink = (
  link: CookieBannerLink | undefined,
  fallback: Required<Pick<CookieBannerLink, 'href' | 'label' | 'attributes'>>,
) => ({
  href: link?.href ?? fallback.href,
  label: link?.label ?? fallback.label,
  attributes: { ...fallback.attributes, ...link?.attributes },
});

const CookieBannerLink = ({
  href,
  label,
  attributes,
}: Required<Pick<CookieBannerLink, 'href' | 'label' | 'attributes'>>) => {
  const { rel, target = '_blank', ...props } = attributes;

  return (
    <a
      {...props}
      className={joinClasses('ofh-cookie-banner__link', attributes.className)}
      href={href}
      rel={mergeRelTokens(rel, target === '_blank')}
      target={target}
    >
      {label}
    </a>
  );
};

export const CookieBanner = ({
  heading = 'Cookies on Our Future Health',
  headingLevel,
  essentialCookiesText = 'We use small data files to make the website work, known as essential cookies.',
  analyticsCookiesText = "We'd like to use analytics cookies so we can improve our site's experience and measure the effectiveness of our marketing activities. We use the Mixpanel web analytics tool to carry out this activity.",
  privacyNotice,
  cookiePolicy,
  acceptLabel = "I'm OK with analytics cookies",
  rejectLabel = 'Do not use analytics cookies',
  onAccept,
  onReject,
  acceptButtonAttributes,
  rejectButtonAttributes,
  children,
  classes = '',
  className = '',
  ref,
  ...props
}: CookieBannerProps) => {
  const generatedId = React.useId().replace(/:/g, '');
  const headingId = `ofh-cookie-banner-${generatedId}-heading`;
  const resolvedPrivacyNotice = resolveLink(privacyNotice, defaultPrivacyNotice);
  const resolvedCookiePolicy = resolveLink(cookiePolicy, defaultCookiePolicy);

  return (
    <section
      {...props}
      ref={ref}
      aria-labelledby={headingId}
      className={joinClasses('ofh-cookie-banner', classes, className)}
    >
      {React.createElement(
        getHeadingTag(headingLevel, 2),
        { className: 'ofh-cookie-banner__heading', id: headingId },
        heading,
      )}

      <div className="ofh-cookie-banner__body">
        {children !== undefined ? (
          children
        ) : (
          <>
            <p>{essentialCookiesText}</p>
            <p>{analyticsCookiesText}</p>
            <p>
              You can read more in our{' '}
              <CookieBannerLink {...resolvedPrivacyNotice} /> and{' '}
              <CookieBannerLink {...resolvedCookiePolicy} /> before you choose.
            </p>
          </>
        )}
      </div>

      <div className="ofh-cookie-banner__actions">
        <Button {...acceptButtonAttributes} type="button" onClick={onAccept}>
          {acceptLabel}
        </Button>
        <Button {...rejectButtonAttributes} type="button" onClick={onReject}>
          {rejectLabel}
        </Button>
      </div>
    </section>
  );
};

CookieBanner.displayName = 'CookieBanner';
