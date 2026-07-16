import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent } from 'react';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { CookieBanner, type CookieBannerProps } from './CookieBanner';

const preventNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
};

const defaultSource = `import { CookieBanner } from '@ourfuturehealth/react-components';

<CookieBanner
  onAccept={() => saveCookieChoice('accept')}
  onReject={() => saveCookieChoice('reject')}
/>;
`;

const customContentSource = `import { CookieBanner } from '@ourfuturehealth/react-components';

<CookieBanner heading="Cookies on Example Service">
  <p>Use this escape hatch only when approved content needs a different structure.</p>
</CookieBanner>;
`;

type CookieBannerStoryArgs = Omit<
  CookieBannerProps,
  'children' | 'cookiePolicy' | 'privacyNotice'
> & {
  bodyMode?: 'default' | 'custom';
  customBodyText?: string;
  privacyNoticeHref?: string;
  privacyNoticeLabel?: string;
  cookiePolicyHref?: string;
  cookiePolicyLabel?: string;
};

const renderBuilderStory = ({
  bodyMode = 'default',
  customBodyText = 'Use essential cookies to make this service work.',
  privacyNoticeHref = 'https://ourfuturehealth.org.uk/privacy',
  privacyNoticeLabel = 'privacy notice',
  cookiePolicyHref = 'https://ourfuturehealth.org.uk/cookies',
  cookiePolicyLabel = 'cookie policy',
  ...args
}: CookieBannerStoryArgs) => (
  <CookieBanner
    {...args}
    privacyNotice={{
      href: privacyNoticeHref,
      label: privacyNoticeLabel,
      attributes: { onClick: preventNavigation },
    }}
    cookiePolicy={{
      href: cookiePolicyHref,
      label: cookiePolicyLabel,
      attributes: { onClick: preventNavigation },
    }}
  >
    {bodyMode === 'custom' ? <p>{customBodyText}</p> : undefined}
  </CookieBanner>
);

const meta: Meta<CookieBannerStoryArgs> = {
  title: 'Components/Cookie banner',
  component: CookieBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cookie Banner presents the OFH cookie choice. Consumers decide where to render it, persist the user choice, and enable analytics. The component does not manage consent state.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use Cookie Banner</h2>
          <p>
            Use the default copy unless your product has approved changes. Pass
            <code>onAccept</code> and <code>onReject</code> to handle the
            choice in your application.
          </p>
          <Source code={defaultSource} language="tsx" />

          <h2>Custom body content</h2>
          <p>
            Children replace the default body. This is not recommended. Use it
            only when the structured content props cannot meet an approved need.
          </p>
          <Source code={customContentSource} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes of={Default} exclude={['ref']} />
          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bodyMode: {
      control: 'radio',
      options: ['default', 'custom'],
      description:
        'Builder-only control. Uses the default content or replaces it with one custom paragraph.',
      table: { category: 'Builder story only' },
    },
    customBodyText: {
      control: 'text',
      description: 'Builder-only custom body paragraph.',
      table: { category: 'Builder story only' },
    },
    privacyNoticeHref: {
      control: 'text',
      description: 'Builder-only privacy-notice destination.',
      table: { category: 'Builder story only' },
    },
    privacyNoticeLabel: {
      control: 'text',
      description: 'Builder-only privacy-notice label.',
      table: { category: 'Builder story only' },
    },
    cookiePolicyHref: {
      control: 'text',
      description: 'Builder-only cookie-policy destination.',
      table: { category: 'Builder story only' },
    },
    cookiePolicyLabel: {
      control: 'text',
      description: 'Builder-only cookie-policy label.',
      table: { category: 'Builder story only' },
    },
    heading: {
      control: 'text',
      description: 'Visible banner heading.',
    },
    headingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Semantic heading level. Defaults to 2.',
    },
    essentialCookiesText: {
      control: 'text',
      description: 'First default body paragraph.',
    },
    analyticsCookiesText: {
      control: 'text',
      description: 'Second default body paragraph.',
    },
    acceptLabel: {
      control: 'text',
      description: 'Accept-action label.',
    },
    rejectLabel: {
      control: 'text',
      description: 'Reject-action label.',
    },
    acceptButtonAttributes: { control: false },
    rejectButtonAttributes: { control: false },
    classes: { control: false },
    className: { control: false },
    ref: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bodyMode: 'default',
    privacyNoticeHref: 'https://ourfuturehealth.org.uk/privacy',
    privacyNoticeLabel: 'privacy notice',
    cookiePolicyHref: 'https://ourfuturehealth.org.uk/cookies',
    cookiePolicyLabel: 'cookie policy',
  },
  render: renderBuilderStory,
};

export const CustomBody: Story = {
  args: {
    bodyMode: 'custom',
    customBodyText: 'Use essential cookies to make this service work.',
    heading: 'Cookies on Example Service',
    acceptLabel: 'Accept analytics',
    rejectLabel: 'Reject analytics',
  },
  render: renderBuilderStory,
};

export const Builder: Story = {
  args: {
    bodyMode: 'default',
    customBodyText: 'Use essential cookies to make this service work.',
    privacyNoticeHref: 'https://ourfuturehealth.org.uk/privacy',
    privacyNoticeLabel: 'privacy notice',
    cookiePolicyHref: 'https://ourfuturehealth.org.uk/cookies',
    cookiePolicyLabel: 'cookie policy',
    heading: 'Cookies on Our Future Health',
    essentialCookiesText:
      'We use small data files to make the website work, known as essential cookies.',
    analyticsCookiesText:
      "We'd like to use analytics cookies so we can improve our site's experience and measure the effectiveness of our marketing activities. We use the Mixpanel web analytics tool to carry out this activity.",
    acceptLabel: "I'm OK with analytics cookies",
    rejectLabel: 'Do not use analytics cookies',
  },
  render: renderBuilderStory,
  parameters: {
    controls: {
      include: [
        'bodyMode',
        'customBodyText',
        'heading',
        'headingLevel',
        'essentialCookiesText',
        'analyticsCookiesText',
        'privacyNoticeHref',
        'privacyNoticeLabel',
        'cookiePolicyHref',
        'cookiePolicyLabel',
        'acceptLabel',
        'rejectLabel',
      ],
    },
    docs: {
      description: {
        story:
          'Use Builder to explore the supported content overrides. It prevents policy-link navigation so the Storybook session stays open.',
      },
    },
  },
};
