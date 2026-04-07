import React from 'react';
import { joinClasses } from '../../internal/ofhUtils';
import { Icon } from '../Icon';

export interface FooterLinkItem
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'className' | 'href' | 'ref'
  > {
  href: string;
  label: React.ReactNode;
  external?: boolean;
  openInNewWindow?: boolean;
}

export type FooterSocialPlatform =
  | 'linkedin'
  | 'x'
  | 'facebook'
  | 'youtube'
  | 'instagram'
  | 'tiktok';

export interface FooterSocialLinkItem
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'className' | 'href' | 'ref'
  > {
  href: string;
  label?: string;
  openInNewWindow?: boolean;
  platform: FooterSocialPlatform;
}

export interface FooterProps
  extends Omit<React.ComponentPropsWithoutRef<'footer'>, 'children' | 'ref'> {
  links?: FooterLinkItem[];
  smallPrint?: React.ReactNode;
  legalText?: React.ReactNode;
  socialLabel?: React.ReactNode;
  socialLinks?: FooterSocialLinkItem[];
  classes?: string;
  ref?: React.Ref<HTMLFooterElement>;
}

const socialIcons: Record<
  FooterSocialPlatform,
  {
    defaultIcon: string;
    hoverIcon: string;
    label: string;
  }
> = {
  linkedin: {
    defaultIcon: 'LinkedIn',
    hoverIcon: 'LinkedInHover',
    label: 'LinkedIn',
  },
  x: {
    defaultIcon: 'X',
    hoverIcon: 'XHover',
    label: 'X',
  },
  facebook: {
    defaultIcon: 'Facebook',
    hoverIcon: 'FacebookHover',
    label: 'Facebook',
  },
  youtube: {
    defaultIcon: 'Youtube',
    hoverIcon: 'YoutubeHover',
    label: 'YouTube',
  },
  instagram: {
    defaultIcon: 'Instagram',
    hoverIcon: 'InstagramHover',
    label: 'Instagram',
  },
  tiktok: {
    defaultIcon: 'Tiktok',
    hoverIcon: 'TiktokHover',
    label: 'TikTok',
  },
};

const renderFooterLink = (link: FooterLinkItem, index: number) => {
  const {
    href,
    label,
    external = false,
    openInNewWindow = false,
    rel,
    target,
    ...props
  } = link;
  const resolvedRel = openInNewWindow ? 'noopener noreferrer' : rel;
  const resolvedTarget = openInNewWindow ? '_blank' : target;

  return (
    <li className="ofh-footer__links-item" key={`footer-link-${index}`}>
      <a
        {...props}
        className="ofh-footer__link"
        href={href}
        rel={resolvedRel}
        target={resolvedTarget}
      >
        <span className="ofh-footer__link-text">{label}</span>
        {external ? (
          <Icon
            name="Launch"
            size={16}
            className="ofh-footer__link-icon"
          />
        ) : null}
      </a>
    </li>
  );
};

const renderSocialLink = (link: FooterSocialLinkItem, index: number) => {
  const {
    href,
    label,
    openInNewWindow = false,
    platform,
    rel,
    target,
    ...props
  } = link;
  const iconNames = socialIcons[platform];
  const resolvedRel = openInNewWindow ? 'noopener noreferrer' : rel;
  const resolvedTarget = openInNewWindow ? '_blank' : target;

  return (
    <li className="ofh-footer__social-item" key={`footer-social-${platform}-${index}`}>
      <a
        {...props}
        className="ofh-footer__social-link"
        href={href}
        rel={resolvedRel}
        target={resolvedTarget}
      >
        <span
          className="ofh-footer__social-icon ofh-footer__social-icon--default"
          aria-hidden="true"
        >
          <Icon
            name={iconNames.defaultIcon}
            size={32}
            className="ofh-footer__social-icon-svg"
          />
        </span>
        <span
          className="ofh-footer__social-icon ofh-footer__social-icon--hover"
          aria-hidden="true"
        >
          <Icon
            name={iconNames.hoverIcon}
            size={32}
            className="ofh-footer__social-icon-svg"
          />
        </span>
        <span className="ofh-u-visually-hidden">{label ?? iconNames.label}</span>
      </a>
    </li>
  );
};

export const Footer = ({
  links = [],
  smallPrint = '© Crown copyright',
  legalText,
  socialLabel = 'Follow us',
  socialLinks = [],
  classes = '',
  className = '',
  ref,
  role = 'contentinfo',
  ...props
}: FooterProps) => (
  <footer
    {...props}
    ref={ref}
    role={role}
    className={joinClasses('ofh-footer', classes, className)}
  >
    <div className="ofh-footer__main">
      <div className="ofh-width-container">
        <div className="ofh-footer__main-inner">
          <div className="ofh-footer__meta">
            {links.length ? (
              <>
                <h2 className="ofh-u-visually-hidden">Support links</h2>
                <ul className="ofh-footer__links">
                  {links.map(renderFooterLink)}
                </ul>
              </>
            ) : null}
            <p className="ofh-footer__small-print">{smallPrint}</p>
          </div>
          {legalText ? (
            <p className="ofh-footer__legal">{legalText}</p>
          ) : null}
        </div>
      </div>
    </div>

    {socialLinks.length ? (
      <div className="ofh-footer__social">
        <div className="ofh-width-container">
          <div className="ofh-footer__social-inner">
            <p className="ofh-footer__social-title">{socialLabel}</p>
            <ul className="ofh-footer__social-list">
              {socialLinks.map(renderSocialLink)}
            </ul>
          </div>
        </div>
      </div>
    ) : null}
  </footer>
);

Footer.displayName = 'Footer';
