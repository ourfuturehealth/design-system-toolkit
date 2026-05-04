import React from 'react';
import { mergeRelTokens } from '../../internal/mergeRelTokens';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { LinkIcon } from '../LinkIcon';
import { SearchInput, type SearchInputProps } from '../SearchInput';
import { joinClassNames } from '../_internal/joinClassNames';
import {
  headerBrandLogoAssets,
  type HeaderBrandNhsLogo,
} from './headerBrandAssets';

export type { HeaderBrandNhsLogo } from './headerBrandAssets';

type HeaderAnchorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'ref'
>;

export interface HeaderLinkItem extends HeaderAnchorProps {
  href: string;
  label: React.ReactNode;
  current?: boolean;
  external?: boolean;
  openInNewWindow?: boolean;
}

export interface HeaderNavLink extends HeaderLinkItem {
  items?: never;
}

export interface HeaderNavGroup {
  label: React.ReactNode;
  items: HeaderNavLink[];
  current?: boolean;
}

export type HeaderNavItem = HeaderNavLink | HeaderNavGroup;

export interface HeaderBrandConfig
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'aria-label' | 'children' | 'className' | 'href' | 'ref'
  > {
  href: string;
  ariaLabel: string;
  nhsLogo?: HeaderBrandNhsLogo;
}

export type HeaderSearchConfig = Omit<SearchInputProps, 'className' | 'ref'>;

type HeaderAccountLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'ref'
>;

export interface HeaderAccountSignIn extends HeaderAccountLinkProps {
  type: 'sign-in';
  href: string;
  label?: React.ReactNode;
}

export interface HeaderAccountSignedOut {
  type: 'account';
  accountHref: string;
  accountLabel?: React.ReactNode;
  accountLinkProps?: HeaderAccountLinkProps;
  signOutHref: string;
  signOutLabel?: React.ReactNode;
  signOutLinkProps?: HeaderAccountLinkProps;
}

export type HeaderAccountConfig = HeaderAccountSignIn | HeaderAccountSignedOut;

export type HeaderTheme = 'dark' | 'light';
export type HeaderLayout = 'fixed' | 'fluid';

export interface HeaderProps
  extends Omit<React.ComponentPropsWithoutRef<'header'>, 'children' | 'ref'> {
  theme?: HeaderTheme;
  layout?: HeaderLayout;
  brand: HeaderBrandConfig;
  utilityLinks?: HeaderLinkItem[];
  search?: HeaderSearchConfig;
  action?: HeaderLinkItem;
  account?: HeaderAccountConfig;
  navigation?: HeaderNavItem[];
  showBottomBorder?: boolean;
  ref?: React.Ref<HTMLElement>;
}

const isNavGroup = (item: HeaderNavItem): item is HeaderNavGroup =>
  'items' in item;

const navItemHasCurrentState = (item: HeaderNavItem) =>
  isNavGroup(item)
    ? item.current || item.items.some((child) => child.current)
    : item.current;

const resolveAnchorProps = (
  item: HeaderAccountLinkProps & { openInNewWindow?: boolean },
  href: string,
) => {
  const {
    openInNewWindow = false,
    rel,
    target,
    ...props
  } = item as HeaderLinkItem & { openInNewWindow?: boolean };

  return {
    ...props,
    href,
    rel: mergeRelTokens(rel, Boolean(openInNewWindow)),
    target: openInNewWindow ? '_blank' : target,
  };
};

const resolveHeaderLinkProps = (item: HeaderLinkItem) => {
  const {
    current,
    external,
    href,
    label,
    openInNewWindow,
    rel,
    target,
    ...props
  } = item;

  void current;
  void external;
  void label;

  return {
    ...props,
    href,
    rel: mergeRelTokens(rel, Boolean(openInNewWindow)),
    target: openInNewWindow ? '_blank' : target,
  };
};

const renderPartnerMark = (
  nhsLogo: HeaderBrandNhsLogo,
  isInverted: boolean,
) => {
  const assetSet = headerBrandLogoAssets.nhs[nhsLogo];

  return (
    <picture className="ofh-header__partner-picture">
      <source
        media="(min-width: 1300px)"
        srcSet={
          isInverted
            ? assetSet.largeDesktopInverted
            : assetSet.largeDesktop
        }
      />
      <source
        media="(min-width: 980px)"
        srcSet={isInverted ? assetSet.desktopInverted : assetSet.desktop}
      />
      <source
        media="(min-width: 740px)"
        srcSet={isInverted ? assetSet.tabletInverted : assetSet.tablet}
      />
      <img
        alt=""
        className="ofh-header__partner-image"
        src={isInverted ? assetSet.mobileInverted : assetSet.mobile}
      />
    </picture>
  );
};

export const Header = ({
  theme = 'dark',
  layout = 'fixed',
  brand,
  utilityLinks = [],
  search,
  action,
  account,
  navigation = [],
  showBottomBorder = true,
  className = '',
  ref,
  ...props
}: HeaderProps) => {
  const { ariaLabel, href: brandHref, nhsLogo, ...brandLinkProps } = brand;
  const generatedId = React.useId().replace(/:/g, '');
  const mobileMenuId = `${generatedId}-mobile-menu`;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = React.useState<string | null>(
    null,
  );
  const [openMobileGroup, setOpenMobileGroup] = React.useState<string | null>(
    null,
  );
  const widthContainerClassName =
    layout === 'fluid' ? 'ofh-width-container-fluid' : 'ofh-width-container';
  const sectionInnerClassName = joinClassNames(
    widthContainerClassName,
    'ofh-header__section-inner',
  );
  const hasDesktopToolsContent = Boolean(search || action || account);
  const hasMobilePanelContent = Boolean(
    search ||
      action ||
      account ||
      navigation.length,
  );
  const showPartnerMark = Boolean(nhsLogo);
  const showPartnerDivider = showPartnerMark && (
    hasDesktopToolsContent || hasMobilePanelContent
  );

  const renderAccount = (context: 'desktop' | 'mobile-footer') => {
    if (!account) {
      return null;
    }

    if (account.type === 'sign-in') {
      const {
        label = 'Log in',
        href,
        ...linkProps
      } = account;
      const resolvedProps = resolveAnchorProps(linkProps, href);
      const signLinkClassName = joinClassNames(
        'ofh-header__account-link',
        'ofh-header__account-link--icon',
        context === 'mobile-footer'
          ? 'ofh-header__mobile-footer-sign-link'
          : undefined,
      );

      return (
        <LinkIcon
          {...resolvedProps}
          className={signLinkClassName}
          href={href}
          iconName="AccountCircle"
          iconPosition="left"
          size="medium"
        >
          {label}
        </LinkIcon>
      );
    }

    const {
      accountHref,
      accountLabel = 'Account',
      accountLinkProps,
      signOutHref,
      signOutLabel = 'Log out',
      signOutLinkProps,
    } = account;

    const resolvedAccountProps = resolveAnchorProps(
      accountLinkProps ?? {},
      accountHref,
    );
    const resolvedSignOutProps = resolveAnchorProps(
      signOutLinkProps ?? {},
      signOutHref,
    );

    return (
      <div
        className={joinClassNames(
          'ofh-header__account-cluster',
          context === 'mobile-footer'
            ? 'ofh-header__mobile-footer-account'
            : undefined,
        )}
      >
        <LinkIcon
          {...resolvedAccountProps}
          className={joinClassNames(
            'ofh-header__account-link',
            context === 'mobile-footer'
              ? 'ofh-header__mobile-footer-link'
              : undefined,
          )}
          href={accountHref}
          showIconLeft={false}
          showIconRight={false}
          size="medium"
        >
          {accountLabel}
        </LinkIcon>
        <LinkIcon
          {...resolvedSignOutProps}
          className={joinClassNames(
            'ofh-header__account-link',
            'ofh-header__account-link--icon',
            context === 'mobile-footer'
              ? 'ofh-header__mobile-footer-sign-link'
              : undefined,
          )}
          href={signOutHref}
          iconName="AccountCircle"
          iconPosition="left"
          size="medium"
        >
          {signOutLabel}
        </LinkIcon>
      </div>
    );
  };

  return (
    <header
      {...props}
      ref={ref}
      className={joinClassNames(
        'ofh-header',
        `ofh-header--${theme}`,
        `ofh-header--${layout}`,
        showBottomBorder ? 'ofh-header--with-bottom-border' : undefined,
        className,
      )}
    >
      {utilityLinks.length ? (
        <div className="ofh-header__domain-navigation">
          <div className={sectionInnerClassName}>
            <ul className="ofh-header__utility-list">
              {utilityLinks.map((item, index) => {
                const resolvedProps = resolveHeaderLinkProps(item);
                const showExternalIcon = Boolean(
                  item.external || item.openInNewWindow,
                );

                return (
                  <li
                    className="ofh-header__utility-item"
                    key={`header-utility-${index}`}
                  >
                    <LinkIcon
                      {...resolvedProps}
                      className="ofh-header__utility-link"
                      href={item.href}
                      iconPosition="right"
                      openInNewWindow={Boolean(item.openInNewWindow)}
                      showIconLeft={false}
                      showIconRight={showExternalIcon}
                      size="small"
                    >
                      {item.label}
                    </LinkIcon>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="ofh-header__header">
        <div className={sectionInnerClassName}>
          <div className="ofh-header__header-layout">
            <a
              {...brandLinkProps}
              aria-label={ariaLabel}
              className="ofh-header__brand-link"
              href={brandHref}
            >
              <span aria-hidden="true" className="ofh-header__brand-logo">
                <img
                  alt=""
                  className="ofh-header__brand-logo-image"
                  src={headerBrandLogoAssets.ofhDefault}
                />
              </span>
            </a>

            <div className="ofh-header__header-tools">
              {showPartnerMark ? (
                <span aria-hidden="true" className="ofh-header__partner">
                  {renderPartnerMark(nhsLogo as HeaderBrandNhsLogo, theme === 'dark')}
                </span>
              ) : null}

              {showPartnerDivider ? (
                <span aria-hidden="true" className="ofh-header__partner-divider" />
              ) : null}

              <div className="ofh-header__header-desktop-tools">
                {search ? (
                  <SearchInput
                    {...search}
                    className="ofh-header__search"
                  />
                ) : null}
                {action ? (
                  <LinkIcon
                    {...resolveHeaderLinkProps(action)}
                    className="ofh-header__action-link"
                    href={action.href}
                    showIconLeft={false}
                    showIconRight={false}
                    size="medium"
                  >
                    {action.label}
                  </LinkIcon>
                ) : null}
                {renderAccount('desktop')}
              </div>

              {hasMobilePanelContent ? (
                <Button
                  aria-controls={mobileMenuId}
                  aria-expanded={isMobileMenuOpen}
                  className="ofh-header__menu-button"
                  onClick={() => {
                    setIsMobileMenuOpen((currentValue) => {
                      const nextValue = !currentValue;

                      if (!nextValue) {
                        setOpenMobileGroup(null);
                      }

                      return nextValue;
                    });
                  }}
                  type="button"
                  variant={theme === 'dark' ? 'ghost-inverted' : 'outlined'}
                >
                  Menu
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {navigation.length ? (
        <nav
          aria-label="Primary navigation"
          className="ofh-header__navigation"
        >
          <div className={sectionInnerClassName}>
            <ul className="ofh-header__nav-list">
              {navigation.map((item, index) => {
                if (!isNavGroup(item)) {
                  const resolvedProps = resolveAnchorProps(item, item.href);

                  return (
                    <li className="ofh-header__nav-item" key={`header-nav-${index}`}>
                      <a
                        {...resolvedProps}
                        aria-current={item.current ? 'page' : undefined}
                        className={joinClassNames(
                          'ofh-header__nav-link',
                          item.current ? 'ofh-header__nav-link--current' : undefined,
                        )}
                        href={item.href}
                      >
                        <span className="ofh-header__nav-label">{item.label}</span>
                      </a>
                    </li>
                  );
                }

                const groupId = `${generatedId}-desktop-group-${index}`;
                const isOpen = openDesktopGroup === groupId;
                const isCurrent = navItemHasCurrentState(item);

                return (
                  <li
                    className="ofh-header__nav-item ofh-header__nav-item--group"
                    key={`header-nav-group-${index}`}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setOpenDesktopGroup((currentValue) =>
                          currentValue === groupId ? null : currentValue,
                        );
                      }
                    }}
                  >
                    <button
                      aria-controls={`${groupId}-panel`}
                      aria-expanded={isOpen}
                      className={joinClassNames(
                        'ofh-header__nav-trigger',
                        isCurrent ? 'ofh-header__nav-trigger--current' : undefined,
                        isOpen ? 'ofh-header__nav-trigger--open' : undefined,
                      )}
                      onClick={() => {
                        setOpenDesktopGroup((currentValue) =>
                          currentValue === groupId ? null : groupId,
                        );
                      }}
                      type="button"
                    >
                      <span className="ofh-header__nav-label">{item.label}</span>
                      <Icon
                        className="ofh-header__nav-icon"
                        name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                        size={24}
                      />
                    </button>

                    <div
                      className="ofh-header__nav-panel"
                      hidden={!isOpen}
                      id={`${groupId}-panel`}
                    >
                      <ul className="ofh-header__nav-panel-list">
                        {item.items.map((child, childIndex) => (
                          <li
                            className="ofh-header__nav-panel-item"
                            key={`header-nav-panel-${index}-${childIndex}`}
                          >
                            <a
                              {...resolveHeaderLinkProps(child)}
                              aria-current={child.current ? 'page' : undefined}
                              className={joinClassNames(
                                'ofh-header__nav-panel-link',
                                child.current
                                  ? 'ofh-header__nav-panel-link--current'
                                  : undefined,
                              )}
                              href={child.href}
                            >
                              <span className="ofh-header__nav-panel-label">
                                {child.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      ) : null}

      {hasMobilePanelContent ? (
        <div
          className="ofh-header__mobile-panel"
          hidden={!isMobileMenuOpen}
          id={mobileMenuId}
        >
          <div className={sectionInnerClassName}>
            {search ? (
              <div className="ofh-header__mobile-search">
                <SearchInput
                  {...search}
                  className="ofh-header__mobile-search-control"
                />
              </div>
            ) : null}

            {navigation.length ? (
              <ul className="ofh-header__mobile-nav-list">
                {navigation.map((item, index) => {
                  if (!isNavGroup(item)) {
                    return (
                      <li
                        className="ofh-header__mobile-nav-item"
                        key={`header-mobile-nav-${index}`}
                      >
                        <a
                          {...resolveHeaderLinkProps(item)}
                          aria-current={item.current ? 'page' : undefined}
                          className={joinClassNames(
                            'ofh-header__mobile-link',
                            item.current ? 'ofh-header__mobile-link--current' : undefined,
                          )}
                          href={item.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setOpenMobileGroup(null);
                          }}
                        >
                          <span className="ofh-header__mobile-link-text">
                            {item.label}
                          </span>
                        </a>
                      </li>
                    );
                  }

                  const groupId = `${generatedId}-mobile-group-${index}`;
                  const isOpen = openMobileGroup === groupId;

                  return (
                    <li
                      className={joinClassNames(
                        'ofh-header__mobile-nav-item',
                        'ofh-header__mobile-nav-item--group',
                        isOpen ? 'ofh-header__mobile-nav-item--open' : undefined,
                      )}
                      key={`header-mobile-group-${index}`}
                    >
                      <button
                        aria-controls={`${groupId}-panel`}
                        aria-expanded={isOpen}
                        className="ofh-header__mobile-trigger"
                        onClick={() => {
                          setOpenMobileGroup((currentValue) =>
                            currentValue === groupId ? null : groupId,
                          );
                        }}
                        type="button"
                      >
                        <span className="ofh-header__mobile-link-text">
                          {item.label}
                        </span>
                        <Icon
                          className="ofh-header__mobile-trigger-icon"
                          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                          size={24}
                        />
                      </button>

                      <ul
                        className="ofh-header__mobile-subnav"
                        hidden={!isOpen}
                        id={`${groupId}-panel`}
                      >
                        {item.items.map((child, childIndex) => (
                          <li
                            className="ofh-header__mobile-subnav-item"
                            key={`header-mobile-subnav-${index}-${childIndex}`}
                          >
                            <a
                              {...resolveHeaderLinkProps(child)}
                              aria-current={child.current ? 'page' : undefined}
                              className={joinClassNames(
                                'ofh-header__mobile-subnav-link',
                                child.current
                                  ? 'ofh-header__mobile-subnav-link--current'
                                  : undefined,
                              )}
                              href={child.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenMobileGroup(null);
                              }}
                            >
                              <span className="ofh-header__mobile-link-text">
                                {child.label}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {action || account ? (
              <div className="ofh-header__mobile-footer">
                {action ? (
                  <LinkIcon
                    {...resolveHeaderLinkProps(action)}
                    className="ofh-header__action-link ofh-header__mobile-footer-link"
                    href={action.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setOpenMobileGroup(null);
                    }}
                    showIconLeft={false}
                    showIconRight={false}
                    size="medium"
                  >
                    {action.label}
                  </LinkIcon>
                ) : null}
                {renderAccount('mobile-footer')}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
};

Header.displayName = 'Header';
