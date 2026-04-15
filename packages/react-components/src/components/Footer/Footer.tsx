import React from 'react';
import { mergeRelTokens } from '../../internal/mergeRelTokens';
import { joinClasses } from '../../internal/ofhUtils';
import { Icon } from '../Icon';
import { LinkIcon, type LinkIconProps } from '../LinkIcon';

type FooterLinkIconProps = Pick<
  LinkIconProps,
  | 'iconColor'
  | 'iconName'
  | 'iconPosition'
  | 'leftIconName'
  | 'rightIconName'
  | 'showIconLeft'
  | 'showIconRight'
  | 'size'
>;

export interface FooterLinkItem
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'className' | 'href' | 'ref'
  >,
    FooterLinkIconProps {
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
  ref?: React.Ref<HTMLElement>;
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
    defaultIcon: 'Linkedin',
    hoverIcon: 'LinkedinHover',
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
    iconColor,
    iconName,
    iconPosition,
    leftIconName,
    openInNewWindow = false,
    rel,
    rightIconName,
    showIconLeft,
    showIconRight,
    size,
    target,
    ...props
  } = link;
  const usesCustomLinkIconDisplay =
    iconPosition !== undefined ||
    iconName !== undefined ||
    leftIconName !== undefined ||
    rightIconName !== undefined ||
    showIconLeft !== undefined ||
    showIconRight !== undefined;
  const resolvedIconPosition = iconPosition ?? (external ? 'right' : 'left');
  const resolvedShowIconLeft =
    showIconLeft ?? (usesCustomLinkIconDisplay ? undefined : false);
  const resolvedShowIconRight =
    showIconRight ?? (usesCustomLinkIconDisplay ? undefined : external);

  return (
    <li className="ofh-footer__links-item" key={`footer-link-${index}`}>
      <LinkIcon
        {...props}
        className="ofh-footer__link-component"
        href={href}
        iconColor={iconColor}
        iconName={iconName}
        iconPosition={resolvedIconPosition}
        leftIconName={leftIconName}
        rel={rel}
        openInNewWindow={openInNewWindow}
        rightIconName={rightIconName}
        showIconLeft={resolvedShowIconLeft}
        showIconRight={resolvedShowIconRight}
        size={size}
        target={target}
      >
        {label}
      </LinkIcon>
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
  const resolvedRel = mergeRelTokens(rel, openInNewWindow);
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
  smallPrint,
  legalText,
  socialLabel = 'Follow us',
  socialLinks = [],
  classes = '',
  className = '',
  ref,
  role = 'contentinfo',
  ...props
}: FooterProps) => {
  const resolvedSmallPrint =
    smallPrint === undefined ? '© Crown copyright' : smallPrint;
  const hasMeta = links.length > 0 || Boolean(resolvedSmallPrint);

  return (
    <footer
      {...props}
      ref={ref}
      role={role}
      className={joinClasses('ofh-footer', classes, className)}
    >
      <div className="ofh-footer__main">
        <div className="ofh-width-container">
          <div className="ofh-footer__main-inner">
            {hasMeta ? (
              <div className="ofh-footer__meta">
                {links.length ? (
                  <>
                    <h2 className="ofh-u-visually-hidden">Support links</h2>
                    <ul className="ofh-footer__links">
                      {links.map(renderFooterLink)}
                    </ul>
                  </>
                ) : null}
                {resolvedSmallPrint ? (
                  <p className="ofh-footer__small-print">{resolvedSmallPrint}</p>
                ) : null}
              </div>
            ) : null}
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
};

Footer.displayName = 'Footer';
