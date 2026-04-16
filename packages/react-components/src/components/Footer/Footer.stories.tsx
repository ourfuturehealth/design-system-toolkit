import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
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

const defaultFooterSource = `import { Footer } from '@ourfuturehealth/react-components';

const supportLinks = [
  { href: '#help', label: 'Help and Support' },
  { href: '#faq', label: 'Frequently Asked Questions' },
  { href: '#contact', label: 'Contact Us' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#cookies', label: 'Cookies' },
  { href: '#careers', label: 'Careers' },
];

const socialLinks = [
  {
    platform: 'linkedin',
    href: 'https://www.linkedin.com/company/our-future-health/',
    openInNewWindow: true,
  },
  {
    platform: 'x',
    href: 'https://x.com/',
    openInNewWindow: true,
  },
  {
    platform: 'facebook',
    href: 'https://facebook.com/',
    openInNewWindow: true,
  },
];

<Footer
  links={supportLinks}
  smallPrint="© Our Future Health 2026"
  legalText="Our Future Health is a company limited by guarantee registered in England and Wales (number 12212468) and a charity registered with the Charity Commission for England and Wales (charity number 1189681) and OSCR, Scottish Charity Regulator (charity number SC050917). Registered office: 2 New Bailey, 6 Stanley Street, Manchester M3 5GS."
  socialLabel="Follow us"
  socialLinks={socialLinks}
/>;
`;

const minimalFooterSource = `import { Footer } from '@ourfuturehealth/react-components';

const supportLinks = [{ href: '#privacy', label: 'Privacy' }];

<Footer
  links={supportLinks}
  smallPrint="© Our Future Health 2026"
/>;
`;

const supportLinksWithIconsSource = `import { Footer } from '@ourfuturehealth/react-components';

const supportLinks = [
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
  { href: '#privacy', label: 'Privacy' },
  {
    href: 'https://example.com/guidance',
    label: 'External guidance',
    external: true,
    openInNewWindow: true,
  },
];

<Footer
  links={supportLinks}
  smallPrint="© Our Future Health 2026"
/>;
`;

const legalAndSocialOnlySource = `import { Footer } from '@ourfuturehealth/react-components';

const socialLinks = [
  {
    platform: 'linkedin',
    href: 'https://www.linkedin.com/company/our-future-health/',
    openInNewWindow: true,
  },
  {
    platform: 'x',
    href: 'https://x.com/',
    openInNewWindow: true,
  },
  {
    platform: 'facebook',
    href: 'https://facebook.com/',
    openInNewWindow: true,
  },
];

<Footer
  legalText="Our Future Health is a company limited by guarantee registered in England and Wales (number 12212468)."
  socialLabel="Follow us"
  socialLinks={socialLinks}
/>;
`;

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
          'Footer shows support links, optional small-print and legal copy, and an optional social section. The real React API is intentionally small: pass `links` for support links, `smallPrint` for the copyright line, `legalText` for the legal copy, `socialLabel` for the social heading, and `socialLinks` for the social icons. Storybook adds helper controls to make the examples easier to explore, but those helpers are not part of `FooterProps`.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Start with the real component props. The footer is composed from
            support links, optional small-print text, optional legal copy, and
            optional social links.
          </p>
          <p>
            Use the shared <code>LinkIcon</code> capabilities on support links
            only when a left or right icon genuinely adds meaning.
          </p>
          <Source code={defaultFooterSource} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes of={Footer} />

          <h2>Storybook helper controls</h2>
          <p>
            <code>linkSet</code>, <code>showSupportLinks</code>,{' '}
            <code>showSmallPrint</code>, <code>showLegalText</code>,{' '}
            <code>showSocialLinks</code>, <code>socialPlatforms</code>, and the
            other builder controls are Storybook-only helpers. They are used to
            explore the footer in Storybook, but they are not part of the
            React component API.
          </p>

          <h2>Examples</h2>
          <Stories />

          <h2>Example source</h2>
          <p>
            The snippets below show the rendered examples with the item arrays
            inlined so the support-link and social-link shapes are easy to
            copy.
          </p>
          <Source code={defaultFooterSource} language="tsx" />
          <Source code={minimalFooterSource} language="tsx" />
          <Source code={supportLinksWithIconsSource} language="tsx" />
          <Source code={legalAndSocialOnlySource} language="tsx" />
        </>
      ),
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
        'Storybook-only helper used to switch between support-link presets in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    showSupportLinks: {
      control: 'boolean',
      description:
        'Storybook-only helper used to show or hide the support links section in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    links: {
      control: false,
      description:
        'Support-link data passed to the real React component. Each item can be text-only or use the shared LinkIcon options when needed.',
      table: {
        category: 'FooterProps',
      },
    },
    smallPrint: {
      control: 'text',
      description:
        'Small-print line shown below the support links. Pass `null` to hide it explicitly when the footer should not show copyright text.',
    },
    showSmallPrint: {
      control: 'boolean',
      description:
        'Storybook-only helper used to show or hide the small-print line in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    legalText: {
      control: 'text',
      description:
        'Additional legal copy shown beside the support links on larger breakpoints.',
    },
    showLegalText: {
      control: 'boolean',
      description:
        'Storybook-only helper used to show or hide the legal copy block in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    socialLabel: {
      control: 'text',
      description:
        'Label shown before the social links on tablet and desktop.',
    },
    showSocialLinks: {
      control: 'boolean',
      description:
        'Storybook-only helper used to show or hide the social section in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    socialLinks: {
      control: false,
      description:
        'Social-link data passed to the real React component.',
      table: {
        category: 'FooterProps',
      },
    },
    socialPlatforms: {
      control: 'check',
      options: socialPlatformOptions,
      description:
        'Storybook-only helper used to choose which social icons the Builder story should render.',
      table: {
        category: 'Builder story only',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity escape hatch for adding extra classes to the root element. Most React consumers should ignore this and use `className` instead.',
      table: {
        category: 'FooterProps',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root `<footer>` element. Use this for layout tweaks or integration hooks when you need to target the component from your app.',
      table: {
        category: 'FooterProps',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<footer>` element.',
      table: {
        category: 'FooterProps',
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
  render: () => (
    <Footer
      links={defaultLinks}
      smallPrint="© Our Future Health 2026"
      legalText={legalText}
      socialLabel="Follow us"
      socialLinks={[
        socialLinkMap.linkedin,
        socialLinkMap.x,
        socialLinkMap.facebook,
      ]}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic default footer example with text-only support links, legal copy, small print, and the social section visible.',
      },
      source: {
        code: defaultFooterSource,
      },
    },
  },
};

export const Minimal: Story = {
  render: () => (
    <Footer links={minimalLinks} smallPrint="© Our Future Health 2026" />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A compact footer example with just one support link and the small-print line.',
      },
      source: {
        code: minimalFooterSource,
      },
    },
  },
};

export const SupportLinksWithIcons: Story = {
  render: () => (
    <Footer links={mixedIconLinks} smallPrint="© Our Future Health 2026" />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'The default footer keeps support links text-only, but footer link items can opt into the shared LinkIcon capabilities when a directional or external cue adds meaning.',
      },
      source: {
        code: supportLinksWithIconsSource,
      },
    },
  },
};

export const LegalAndSocialOnly: Story = {
  render: () => (
    <Footer
      legalText="Our Future Health is a company limited by guarantee registered in England and Wales (number 12212468)."
      socialLabel="Follow us"
      socialLinks={[
        socialLinkMap.linkedin,
        socialLinkMap.x,
        socialLinkMap.facebook,
      ]}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'This variant hides the support-link list and small-print line, leaving just legal copy plus the social section.',
      },
      source: {
        code: legalAndSocialOnlySource,
      },
    },
  },
};
