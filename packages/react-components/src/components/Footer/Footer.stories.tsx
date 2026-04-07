import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer, type FooterProps } from './Footer';

const meta: Meta<FooterProps> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Footer shows support links, small-print/legal copy, and an optional social section. External footer links can render a right-side launch icon without introducing a generic link abstraction.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    links: [
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
        href: 'https://example.com/careers',
        label: 'Careers',
        external: true,
        openInNewWindow: true,
      },
    ],
    smallPrint: '© Our Future Health 2026',
    legalText:
      'Our Future Health is a company limited by guarantee registered in England and Wales (number 12212468) and a charity registered with the Charity Commission for England and Wales (charity number 1189681) and OSCR, Scottish Charity Regulator (charity number SC050917). Registered office: 2 New Bailey, 6 Stanley Street, Manchester M3 5GS.',
    socialLinks: [
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
      {
        platform: 'youtube',
        href: 'https://youtube.com/',
        openInNewWindow: true,
      },
      {
        platform: 'instagram',
        href: 'https://instagram.com/',
        openInNewWindow: true,
      },
      {
        platform: 'tiktok',
        href: 'https://tiktok.com/',
        openInNewWindow: true,
      },
    ],
  },
};

export default meta;
type Story = StoryObj<FooterProps>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    links: [
      {
        href: '#privacy',
        label: 'Privacy',
      },
    ],
    smallPrint: '© Our Future Health 2026',
    legalText: undefined,
    socialLinks: [],
  },
};
