import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Footer,
  type FooterLinkItem,
  type FooterProps,
  type FooterSocialLinkItem,
  type FooterSocialPlatform,
} from './Footer';

type FooterLinkSet =
  | 'default'
  | 'minimal'
  | 'mixed-icons'
  | 'external-links';

type FooterStoryArgs = FooterProps & {
  linkSet?: FooterLinkSet;
  showSupportLinks?: boolean;
  showSmallPrint?: boolean;
  showLegalText?: boolean;
  showSocialLinks?: boolean;
  socialPlatforms?: FooterSocialPlatform[];
};

const legalText =
  'Our Future Health is a company limited by guarantee registered in England and Wales (number 12212468) and a charity registered with the Charity Commission for England and Wales (charity number 1189681) and OSCR, Scottish Charity Regulator (charity number SC050917). Registered office: 2 New Bailey, 6 Stanley Street, Manchester M3 5GS.';

const defaultLinks: FooterLinkItem[] = [
  {
    href: '#help',
    label: 'Help and Support',
  },
  {
    href: '#faq',
    label: 'Frequently Asked Questions',
  },
  {
    href: '#contact',
    label: 'Contact Us',
  },
  {
    href: '#accessibility',
    label: 'Accessibility',
  },
  {
    href: '#privacy',
    label: 'Privacy',
  },
  {
    href: '#cookies',
    label: 'Cookies',
  },
  {
    href: '#careers',
    label: 'Careers',
  },
];

const minimalLinks: FooterLinkItem[] = [
  {
    href: '#privacy',
    label: 'Privacy',
  },
];

const mixedIconLinks: FooterLinkItem[] = [
  {
    href: '#overview',
    label: 'Back to overview',
    iconName: 'ChevronLeft',
    iconPosition: 'left',
  },
  {
    href: '#search',
    label: 'Search site',
    iconName: 'Search',
    iconPosition: 'left',
  },
  {
    href: '#privacy',
    label: 'Privacy',
  },
  {
    href: 'https://example.com/guidance',
    label: 'External guidance',
    external: true,
    openInNewWindow: true,
  },
];

const externalLinks: FooterLinkItem[] = [
  {
    href: 'https://example.com/guidance',
    label: 'Clinical guidance',
    external: true,
    openInNewWindow: true,
  },
  {
    href: 'https://example.com/policies',
    label: 'Privacy policy',
    external: true,
    openInNewWindow: true,
  },
  {
    href: 'https://example.com/accessibility',
    label: 'Accessibility statement',
    external: true,
    openInNewWindow: true,
  },
];

const socialPlatformOptions: FooterSocialPlatform[] = [
  'linkedin',
  'x',
  'facebook',
  'youtube',
  'instagram',
  'tiktok',
];

const socialLinkMap: Record<FooterSocialPlatform, FooterSocialLinkItem> = {
  linkedin: {
    platform: 'linkedin',
    href: 'https://www.linkedin.com/company/our-future-health/',
    openInNewWindow: true,
  },
  x: {
    platform: 'x',
    href: 'https://x.com/',
    openInNewWindow: true,
  },
  facebook: {
    platform: 'facebook',
    href: 'https://facebook.com/',
    openInNewWindow: true,
  },
  youtube: {
    platform: 'youtube',
    href: 'https://youtube.com/',
    openInNewWindow: true,
  },
  instagram: {
    platform: 'instagram',
    href: 'https://instagram.com/',
    openInNewWindow: true,
  },
  tiktok: {
    platform: 'tiktok',
    href: 'https://tiktok.com/',
    openInNewWindow: true,
  },
};

const supportLinkSets: Record<FooterLinkSet, FooterLinkItem[]> = {
  default: defaultLinks,
  minimal: minimalLinks,
  'mixed-icons': mixedIconLinks,
  'external-links': externalLinks,
};

const buildSocialLinks = (
  platforms: FooterSocialPlatform[] = [],
): FooterSocialLinkItem[] =>
  platforms.map((platform) => socialLinkMap[platform]);

const friendlyControlNames = [
  'linkSet',
  'showSupportLinks',
  'showSmallPrint',
  'smallPrint',
  'showLegalText',
  'legalText',
  'showSocialLinks',
  'socialPlatforms',
  'socialLabel',
] satisfies Array<keyof FooterStoryArgs>;

const renderFooterStory = ({
  linkSet = 'default',
  showSupportLinks = true,
  showSmallPrint = true,
  showLegalText = true,
  showSocialLinks = true,
  socialPlatforms = socialPlatformOptions,
  smallPrint,
  legalText: legalCopy,
  socialLabel = 'Follow us',
  ...args
}: FooterStoryArgs) => (
  <Footer
    {...args}
    links={showSupportLinks ? supportLinkSets[linkSet] : []}
    smallPrint={showSmallPrint ? smallPrint : null}
    legalText={showLegalText ? legalCopy : undefined}
    socialLabel={socialLabel}
    socialLinks={showSocialLinks ? buildSocialLinks(socialPlatforms) : []}
  />
);

const meta: Meta<FooterStoryArgs> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Footer shows support links, optional small-print and legal copy, and an optional social section. Support links are composed from the shared LinkIcon pattern, so the default footer stays text-only while services can opt into left or right icon cues when they are genuinely helpful.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    linkSet: 'default',
    showSupportLinks: true,
    showSmallPrint: true,
    showLegalText: true,
    showSocialLinks: true,
    socialPlatforms: socialPlatformOptions,
    smallPrint: '© Our Future Health 2026',
    legalText,
    socialLabel: 'Follow us',
  },
  render: renderFooterStory,
  argTypes: {
    linkSet: {
      control: 'select',
      options: ['default', 'minimal', 'mixed-icons', 'external-links'],
      description:
        'Preset used to populate the support links section when it is enabled.',
    },
    showSupportLinks: {
      control: 'boolean',
      description: 'Shows or hides the support links section.',
    },
    links: {
      control: false,
      description:
        'Low-level support links data. In Storybook, prefer the `linkSet` and `showSupportLinks` controls.',
      table: {
        category: 'Advanced',
      },
    },
    smallPrint: {
      control: 'text',
      description:
        'Small-print line shown below the support links. Pass `null` to hide it explicitly.',
    },
    showSmallPrint: {
      control: 'boolean',
      description: 'Shows or hides the small-print line.',
    },
    legalText: {
      control: 'text',
      description:
        'Additional legal copy shown beside the support links on larger breakpoints.',
    },
    showLegalText: {
      control: 'boolean',
      description: 'Shows or hides the legal copy block.',
    },
    socialLabel: {
      control: 'text',
      description:
        'Label shown before the social links on tablet and desktop.',
    },
    showSocialLinks: {
      control: 'boolean',
      description: 'Shows or hides the social section.',
    },
    socialLinks: {
      control: false,
      description:
        'Low-level social links data. In Storybook, prefer the `socialPlatforms` and `showSocialLinks` controls.',
      table: {
        category: 'Advanced',
      },
    },
    socialPlatforms: {
      control: 'check',
      options: socialPlatformOptions,
      description:
        'Social icons to include when the social section is enabled.',
    },
    classes: {
      control: false,
      table: {
        disable: true,
      },
    },
    className: {
      control: false,
      table: {
        disable: true,
      },
    },
    ref: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FooterStoryArgs>;

export const Builder: Story = {
  parameters: {
    controls: {
      include: friendlyControlNames,
    },
    docs: {
      description: {
        story:
          'Use this builder to turn footer sections on and off without editing raw nested arrays. The link-set control swaps between text-only links, icon-led footer links, and external-link patterns.',
      },
    },
  },
  args: {
    socialPlatforms: ['linkedin', 'x', 'facebook'],
  },
};

export const Default: Story = {
  parameters: {
    controls: {
      include: friendlyControlNames,
    },
  },
};

export const Minimal: Story = {
  args: {
    linkSet: 'minimal',
    showSupportLinks: true,
    showSmallPrint: true,
    showLegalText: false,
    showSocialLinks: false,
  },
  parameters: {
    controls: {
      include: friendlyControlNames,
    },
  },
};

export const SupportLinksWithIcons: Story = {
  args: {
    linkSet: 'mixed-icons',
    showSupportLinks: true,
    showSmallPrint: true,
    showLegalText: false,
    showSocialLinks: false,
  },
  parameters: {
    controls: {
      include: friendlyControlNames,
    },
    docs: {
      description: {
        story:
          'The default footer keeps support links text-only, but footer link items can opt into the shared LinkIcon capabilities when a directional or external cue adds meaning.',
      },
    },
  },
};

export const LegalAndSocialOnly: Story = {
  args: {
    showSupportLinks: false,
    showSmallPrint: false,
    showLegalText: true,
    showSocialLinks: true,
    legalText:
      'Our Future Health is a company limited by guarantee registered in England and Wales (number 12212468).',
    socialPlatforms: ['linkedin', 'x', 'facebook'],
  },
  parameters: {
    controls: {
      include: friendlyControlNames,
    },
    docs: {
      description: {
        story:
          'This variant hides the support-link list and small-print line, leaving just legal copy plus the social section.',
      },
    },
  },
};
