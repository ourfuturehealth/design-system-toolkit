import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

const baseNavigation = [
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Research',
    items: [
      {
        label: 'Participant portal',
        href: '/research/participant-portal',
      },
      {
        label: 'Data access',
        href: '/research/data-access',
        current: true,
      },
    ],
  },
];

describe('Header', () => {
  it('renders the brand, utilities, search, action, and navigation structure', () => {
    render(
      <Header
        account={{
          type: 'sign-in',
          href: '/log-in',
        }}
        action={{
          href: '/join',
          label: 'Join now',
        }}
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
          nhsLogo: 'england',
        }}
        navigation={baseNavigation}
        search={{
          action: '/search',
          label: 'Search the site',
        }}
        utilityLinks={[
          {
            href: '/docs',
            label: 'View docs',
            openInNewWindow: true,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'Our Future Health home' }),
    ).toHaveAttribute('href', '/');
    expect(
      document.querySelector('.ofh-header__partner-image'),
    ).toHaveAttribute('src', expect.stringContaining(
      'nhs-partnership-england-mobile-inverted.svg',
    ));
    expect(
      screen.getByRole('link', { name: 'Our Future Health home' }).querySelector(
        '.ofh-header__partner-image',
      ),
    ).toBeNull();
    expect(screen.getByRole('search')).toHaveAttribute('action', '/search');
    expect(screen.getByRole('link', { name: 'Join now' })).toHaveAttribute(
      'href',
      '/join',
    );
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute(
      'href',
      '/log-in',
    );
    expect(
      screen.getByRole('link', { name: 'View docs' }),
    ).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('button', { name: 'Research' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('renders the signed-out account cluster', () => {
    render(
      <Header
        account={{
          type: 'account',
          accountHref: '/account',
          signOutHref: '/log-out',
        }}
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
        }}
      />,
    );

    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
      'href',
      '/account',
    );
    expect(screen.getByRole('link', { name: 'Log out' })).toHaveAttribute(
      'href',
      '/log-out',
    );
  });

  it('renders the fixed layout and bottom border by default', () => {
    const { container } = render(
      <Header
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
        }}
      />,
    );

    expect(container.querySelector('.ofh-header')).toHaveClass('ofh-header--fixed');
    expect(container.querySelector('.ofh-header')).toHaveClass(
      'ofh-header--with-bottom-border',
    );
  });

  it('does not render the bottom border when disabled', () => {
    const { container } = render(
      <Header
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
        }}
        showBottomBorder={false}
      />,
    );

    expect(container.querySelector('.ofh-header')).not.toHaveClass(
      'ofh-header--with-bottom-border',
    );
  });

  it('opens and closes desktop dropdown navigation groups', async () => {
    const user = userEvent.setup();

    render(
      <Header
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
        }}
        navigation={baseNavigation}
      />,
    );

    const groupButton = screen.getByRole('button', { name: 'Research' });

    await user.click(groupButton);

    expect(groupButton).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('link', { name: 'Participant portal' }),
    ).toHaveAttribute('href', '/research/participant-portal');
    expect(screen.getByRole('link', { name: 'Data access' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await user.click(groupButton);

    expect(groupButton).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: 'Participant portal' }),
    ).not.toBeInTheDocument();
  });

  it('opens the mobile panel and nested mobile groups', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Header
        account={{
          type: 'sign-in',
          href: '/log-in',
        }}
        action={{
          href: '/join',
          label: 'Join now',
        }}
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
        }}
        navigation={baseNavigation}
        search={{
          action: '/search',
          label: 'Search the site',
        }}
      />,
    );

    const menuButton = screen.getByRole('button', { name: 'Menu' });

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const mobilePanel = container.querySelector('.ofh-header__mobile-panel');
    const mobilePanelQueries = within(mobilePanel as HTMLElement);
    const mobileGroupButton = mobilePanelQueries.getByRole('button', {
      name: 'Research',
    });

    await user.click(mobileGroupButton);

    expect(mobileGroupButton).toHaveAttribute('aria-expanded', 'true');
    expect(
      mobilePanelQueries.getByRole('link', { name: 'Participant portal' }),
    ).toHaveAttribute('href', '/research/participant-portal');
    expect(mobilePanelQueries.getByRole('search')).toBeInTheDocument();
    expect(
      mobilePanelQueries.getByRole('link', { name: 'Join now' }),
    ).toHaveAttribute('href', '/join');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Header
        account={{
          type: 'sign-in',
          href: '/log-in',
        }}
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
          nhsLogo: 'england',
        }}
        navigation={baseNavigation}
        search={{
          action: '/search',
          label: 'Search the site',
        }}
        utilityLinks={[
          {
            href: '/docs',
            label: 'View docs',
            openInNewWindow: true,
          },
        ]}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it('uses the inverted NHS logo assets on dark themes', () => {
    render(
      <Header
        brand={{
          ariaLabel: 'Our Future Health home',
          href: '/',
          nhsLogo: 'wales',
        }}
        theme="dark"
      />,
    );

    expect(
      document.querySelector('.ofh-header__partner-image'),
    ).toHaveAttribute(
      'src',
      expect.stringContaining(
        'nhs-partnership-wales-mobile-inverted.svg',
      ),
    );
  });
});
