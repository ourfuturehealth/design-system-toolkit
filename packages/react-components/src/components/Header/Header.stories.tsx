import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import {
  ArgTypes,
  Description,
  Source,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks';
import { Header, type HeaderBrandNhsLogo, type HeaderProps } from './Header';

type HeaderStoryArgs = HeaderProps & {
  accountState?: 'none' | 'sign-in' | 'account';
  builderNhsLogo?: HeaderBrandNhsLogo | 'none';
  showAction?: boolean;
  showDomainNavigationLinks?: boolean;
  showNavigationLinks?: boolean;
  showSearch?: boolean;
};

const defaultHeaderSource = `import { Header } from '@ourfuturehealth/react-components';

<Header
  theme="dark"
  brand={{
    href: '/',
    ariaLabel: 'Our Future Health home',
    nhsLogo: 'england',
  }}
  utilityLinks={[
    { href: '/docs', label: 'View docs', openInNewWindow: true },
    { href: '/github', label: 'View GitHub', openInNewWindow: true },
  ]}
  search={{
    action: '/search',
    label: 'Search the site',
    placeholder: 'Search',
  }}
  action={{ href: '/join', label: 'Join now' }}
  account={{ type: 'sign-in', href: '/log-in' }}
  navigation={[
    { href: '/about', label: 'About' },
    {
      label: 'Research',
      items: [
        { href: '/research/participant-portal', label: 'Participant portal' },
        { href: '/research/data-access', label: 'Data access' },
      ],
    },
    { href: '/contact', label: 'Contact' },
  ]}
/>;
`;

const utilityLinks = [
  {
    href: '/docs',
    label: 'View docs',
    openInNewWindow: true,
  },
  {
    href: '/github',
    label: 'View GitHub',
    openInNewWindow: true,
  },
  {
    href: '/confluence',
    label: 'View Confluence',
    openInNewWindow: true,
  },
  {
    href: '/storybook',
    label: 'View Storybook',
    openInNewWindow: true,
  },
] satisfies NonNullable<HeaderProps['utilityLinks']>;

const navigation = [
  {
    href: '/about',
    label: 'About',
  },
  {
    label: 'Research',
    items: [
      {
        href: '/research/participant-portal',
        label: 'Participant portal',
      },
      {
        href: '/research/data-access',
        label: 'Data access',
      },
      {
        href: '/research/publications',
        label: 'Publications',
      },
    ],
  },
  {
    href: '/events',
    label: 'Events',
  },
  {
    href: '/contact',
    label: 'Contact',
  },
] satisfies NonNullable<HeaderProps['navigation']>;

const navigationWithSelectedDropdownItem = [
  {
    href: '/about',
    label: 'About',
  },
  {
    label: 'Research',
    items: [
      {
        href: '/research/participant-portal',
        label: 'Participant portal',
      },
      {
        href: '/research/data-access',
        label: 'Data access',
        current: true,
      },
      {
        href: '/research/publications',
        label: 'Publications',
      },
    ],
  },
  {
    href: '/events',
    label: 'Events',
  },
  {
    href: '/contact',
    label: 'Contact',
  },
] satisfies NonNullable<HeaderProps['navigation']>;

const navigationWithCurrentGroup = [
  {
    href: '/about',
    label: 'About',
  },
  {
    label: 'Research',
    current: true,
    items: [
      {
        href: '/research/participant-portal',
        label: 'Participant portal',
      },
      {
        href: '/research/data-access',
        label: 'Data access',
      },
      {
        href: '/research/publications',
        label: 'Publications',
      },
    ],
  },
  {
    href: '/events',
    label: 'Events',
  },
  {
    href: '/contact',
    label: 'Contact',
  },
] satisfies NonNullable<HeaderProps['navigation']>;

const navigationWithShortDropdownItems = [
  {
    href: '/about',
    label: 'About',
  },
  {
    label: 'Research',
    items: [
      {
        href: '/research/news',
        label: 'News',
      },
      {
        href: '/research/blog',
        label: 'Blog',
      },
      {
        href: '/research/faq',
        label: 'FAQs',
      },
    ],
  },
  {
    href: '/events',
    label: 'Events',
  },
  {
    href: '/contact',
    label: 'Contact',
  },
] satisfies NonNullable<HeaderProps['navigation']>;

const navigationWithLongDropdownItem = [
  {
    href: '/about',
    label: 'About',
  },
  {
    label: 'Research',
    items: [
      {
        href: '/research/participant-portal',
        label: 'Participant portal',
      },
      {
        href: '/research/data-access',
        label: 'Data access and participant datasets programme overview',
      },
      {
        href: '/research/publications',
        label: 'Publications',
      },
    ],
  },
  {
    href: '/events',
    label: 'Events',
  },
  {
    href: '/contact',
    label: 'Contact',
  },
] satisfies NonNullable<HeaderProps['navigation']>;

const baseArgs: HeaderProps = {
  theme: 'dark',
  layout: 'fixed',
  brand: {
    href: '/',
    ariaLabel: 'Our Future Health home',
    nhsLogo: 'england',
  },
  utilityLinks,
  search: {
    action: '/search',
    label: 'Search the site',
    placeholder: 'Search',
  },
  action: {
    href: '/join',
    label: 'Join now',
  },
  account: {
    type: 'sign-in',
    href: '/log-in',
  },
  navigation,
};

const StoryInteractionBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const preventNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest('a');

    if (anchor) {
      event.preventDefault();
    }
  };

  return (
    <div onClickCapture={preventNavigation} onSubmitCapture={(event) => event.preventDefault()}>
      {children}
    </div>
  );
};

const BuilderPreview = ({
  accountState = 'sign-in',
  builderNhsLogo = 'england',
  showAction = true,
  showDomainNavigationLinks = true,
  showNavigationLinks = true,
  showSearch = true,
  ...args
}: HeaderStoryArgs) => {
  const account =
    accountState === 'none'
      ? undefined
      : accountState === 'account'
        ? {
            type: 'account' as const,
            accountHref: '/account',
            signOutHref: '/log-out',
          }
        : {
            type: 'sign-in' as const,
            href: '/log-in',
          };
  const resolvedBrand = {
    ...args.brand,
    nhsLogo: builderNhsLogo === 'none' ? undefined : builderNhsLogo,
  };

  return (
    <Header
      {...args}
      account={account}
      action={showAction ? args.action : undefined}
      brand={resolvedBrand}
      navigation={showNavigationLinks ? args.navigation : undefined}
      search={showSearch ? args.search : undefined}
      utilityLinks={showDomainNavigationLinks ? args.utilityLinks : undefined}
    />
  );
};

const OpenDesktopDropdownPreview = ({
  theme,
  navigation: previewNavigation = navigation,
}: {
  theme: HeaderProps['theme'];
  navigation?: NonNullable<HeaderProps['navigation']>;
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const button = containerRef.current?.querySelector(
      '.ofh-header__nav-trigger',
    ) as HTMLButtonElement | null;

    button?.click();
  }, []);

  return (
    <div ref={containerRef}>
      <Header {...baseArgs} theme={theme} navigation={previewNavigation} />
    </div>
  );
};

const OpenMobileMenuPreview = ({
  theme = 'dark',
  navigation: previewNavigation = navigation,
}: {
  theme?: HeaderProps['theme'];
  navigation?: NonNullable<HeaderProps['navigation']>;
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const menuButton = containerRef.current?.querySelector(
      '.ofh-header__menu-button',
    ) as HTMLButtonElement | null;

    menuButton?.click();

    const mobileGroupButton = containerRef.current?.querySelector(
      '.ofh-header__mobile-trigger',
    ) as HTMLButtonElement | null;

    mobileGroupButton?.click();
  }, []);

  return (
    <div ref={containerRef} style={{ maxWidth: '28rem' }}>
      <Header {...baseArgs} theme={theme} navigation={previewNavigation} />
    </div>
  );
};

const meta: Meta<HeaderStoryArgs> = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    (Story) => (
      <StoryInteractionBoundary>
        <Story />
      </StoryInteractionBoundary>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <h2>How to use the React component</h2>
          <p>
            Header is the top-level global navigation shell for an OFH page. It
            brings together brand identity, optional utility links, the main
            search control, a standalone action, account links, and primary
            navigation.
          </p>
          <p>
            The real React API is structured around the real page sections.
            Pass <code>brand</code> for the OFH brand block, add{' '}
            <code>utilityLinks</code> for the domain-navigation row, pass{' '}
            <code>search</code>, <code>action</code>, and <code>account</code>{' '}
            for the main header row, and use <code>navigation</code> for leaf
            links or grouped dropdown navigation.
          </p>
          <p>
            Grouped navigation items use the shape{' '}
            <code>{'{ label, items: [...] }'}</code>, while leaf links use{' '}
            <code>{'{ href, label }'}</code>. Storybook helper toggles in the
            Builder story are story-only shortcuts, not part of the public API.
            Header supports only the <code>dark</code> and <code>light</code>{' '}
            themes, and the NHS logo region is selected through{' '}
            <code>brand.nhsLogo</code>.
          </p>
          <Source code={defaultHeaderSource} language="tsx" />
          <h2>Component props</h2>
          <ArgTypes of={Header} />
          <Stories includePrimary={false} title="Stories" />
        </>
      ),
    },
  },
  args: baseArgs,
  argTypes: {
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Visual theme for the Header surface.',
    },
    layout: {
      control: 'radio',
      options: ['fixed', 'fluid'],
      description:
        'Width behavior for the shared Header container. Use `fixed` by default and `fluid` only when the surrounding page layout needs it.',
    },
    brand: {
      control: false,
      description:
        'Header brand block configuration. Provide the destination, accessible name, and optionally choose the NHS partner logo region with `nhsLogo`.',
    },
    utilityLinks: {
      control: false,
      description:
        'Top-bar links rendered as compact underlined actions. These are best for cross-system utilities and documentation links.',
    },
    search: {
      control: false,
      description:
        'Header search control configuration. This reuses the public `SearchInput` API shape instead of inventing header-specific search props.',
    },
    action: {
      control: false,
      description:
        'Single standalone action rendered in the main Header row, for example “Join now”.',
    },
    account: {
      control: false,
      description:
        'Account area configuration. Use either `{ type: "sign-in", href }` or `{ type: "account", accountHref, signOutHref }`. Default labels are “Log in” and “Log out”.',
    },
    navigation: {
      control: false,
      description:
        'Primary navigation items. Each item is either a leaf link (`{ href, label }`) or a grouped dropdown (`{ label, items: [...] }`).',
    },
    showBottomBorder: {
      control: 'boolean',
      description:
        'Whether the Header renders its bottom border across the full width of the Header. Defaults to `true`.',
    },
    showDomainNavigationLinks: {
      control: 'boolean',
      description:
        'Story-only helper that toggles the domain-navigation links on and off.',
      table: {
        category: 'Builder story only',
      },
    },
    showSearch: {
      control: 'boolean',
      description:
        'Story-only helper that toggles the shared SearchInput section.',
      table: {
        category: 'Builder story only',
      },
    },
    showAction: {
      control: 'boolean',
      description:
        'Story-only helper that toggles the standalone middle action.',
      table: {
        category: 'Builder story only',
      },
    },
    showNavigationLinks: {
      control: 'boolean',
      description:
        'Story-only helper that toggles the primary navigation links on and off.',
      table: {
        category: 'Builder story only',
      },
    },
    accountState: {
      control: 'radio',
      options: ['none', 'sign-in', 'account'],
      description:
        'Story-only helper for switching between no account area, sign-in, and signed-out account states.',
      table: {
        category: 'Builder story only',
      },
    },
    builderNhsLogo: {
      control: 'radio',
      options: ['england', 'scotland', 'wales', 'northern-ireland', 'none'],
      description:
        'Story-only helper for switching the Header NHS partner logo region without editing the nested brand object.',
      table: {
        category: 'Builder story only',
      },
    },
    ref: {
      control: false,
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<HeaderStoryArgs>;

export const Default: Story = {};

export const Builder: Story = {
  args: {
    accountState: 'sign-in',
    builderNhsLogo: 'england',
    showAction: true,
    showDomainNavigationLinks: true,
    showNavigationLinks: true,
    showSearch: true,
    layout: 'fixed',
    showBottomBorder: true,
  },
  render: (args) => <BuilderPreview {...args} />,
  parameters: {
    controls: {
      include: [
        'theme',
        'layout',
        'showBottomBorder',
        'builderNhsLogo',
        'accountState',
        'showDomainNavigationLinks',
        'showSearch',
        'showAction',
        'showNavigationLinks',
      ],
    },
    docs: {
      description: {
        story:
          'Use the Builder controls to review the real Header sections without editing raw JSON. The toggles and NHS logo selector here are story-only helpers, not part of the public component API.',
      },
    },
  },
};

export const ThemeShowcase: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed theme review states for the complete Header surface. These examples keep the same content shape so visual comparisons stay honest.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
      }}
    >
      <Header {...baseArgs} theme="dark" />
      <Header {...baseArgs} theme="light" />
    </div>
  ),
};

export const DesktopDropdownOpenDark: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing an open dropdown group. This is a docs-only interaction preview, not an extra public prop.',
      },
    },
  },
  render: () => <OpenDesktopDropdownPreview theme="dark" />,
};

export const DesktopDropdownOpenLight: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing an open dropdown group in the light theme. This is a docs-only interaction preview, not an extra public prop.',
      },
    },
  },
  render: () => <OpenDesktopDropdownPreview theme="light" />,
};

export const DesktopDropdownOpenSelectedDark: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing an open dropdown with one dropdown item in the selected state.',
      },
    },
  },
  render: () => (
    <OpenDesktopDropdownPreview
      theme="dark"
      navigation={navigationWithSelectedDropdownItem}
    />
  ),
};

export const DesktopDropdownOpenSelectedLight: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing an open dropdown with one dropdown item selected in the light theme.',
      },
    },
  },
  render: () => (
    <OpenDesktopDropdownPreview
      theme="light"
      navigation={navigationWithSelectedDropdownItem}
    />
  ),
};

export const DesktopDropdownOpenMinWidthDark: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing the dropdown panel holding at its 300px minimum width when child labels are shorter than that floor.',
      },
    },
  },
  render: () => (
    <OpenDesktopDropdownPreview
      theme="dark"
      navigation={navigationWithShortDropdownItems}
    />
  ),
};

export const DesktopDropdownOpenWideContentDark: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing the dropdown panel stretching wider than 300px to fit the longest child label.',
      },
    },
  },
  render: () => (
    <OpenDesktopDropdownPreview
      theme="dark"
      navigation={navigationWithLongDropdownItem}
    />
  ),
};

export const DesktopNavCurrentGroup: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed desktop review state showing a grouped navigation item in the current/active state without being opened. This is the thin 4px underline state from the nav-item spec.',
      },
    },
  },
  render: () => <Header {...baseArgs} navigation={navigationWithCurrentGroup} />,
};

export const MobileMenuOpen: Story = {
  globals: {
    viewport: { value: 'smallMobile' },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed mobile review state showing the condensed menu open with a nested group expanded. The open state is driven inside the story, not through the public component API.',
      },
    },
  },
  render: () => <OpenMobileMenuPreview />,
};

export const MobileMenuOpenLight: Story = {
  globals: {
    viewport: { value: 'smallMobile' },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed mobile review state showing the condensed menu open with a nested group expanded in the light theme.',
      },
    },
  },
  render: () => <OpenMobileMenuPreview theme="light" />,
};

export const MobileMenuOpenDataAccessCurrent: Story = {
  globals: {
    viewport: { value: 'smallMobile' },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed mobile review state showing the condensed menu open with the "Data access" child marked current in the navigation data.',
      },
    },
  },
  render: () => (
    <OpenMobileMenuPreview navigation={navigationWithSelectedDropdownItem} />
  ),
};

export const MobileMenuOpenDataAccessCurrentLight: Story = {
  globals: {
    viewport: { value: 'smallMobile' },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed mobile review state showing the condensed menu open with the "Data access" child marked current in the navigation data for the light theme.',
      },
    },
  },
  render: () => (
    <OpenMobileMenuPreview
      navigation={navigationWithSelectedDropdownItem}
      theme="light"
    />
  ),
};
