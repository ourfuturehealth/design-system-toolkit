import type { Meta, StoryObj } from '@storybook/react-vite';
import iconManifest from '@ourfuturehealth/toolkit/assets/icons/manifest.json';
import { LinkIcon, type LinkIconProps } from './LinkIcon';

const iconNameOptions = iconManifest.icons
  .map(({ name }) => name)
  .sort((a, b) => a.localeCompare(b));

const meta: Meta<LinkIconProps> = {
  title: 'Components/Link/Icon',
  component: LinkIcon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'LinkIcon is the canonical React surface for the Link / Icon pattern. Use `iconPosition` to switch between back-navigation and forward or external link patterns, choose any toolkit sprite icon with `iconName`, and use `iconColor` only when the icon must differ from the label colour.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Go back',
    href: '#',
    iconPosition: 'left',
    size: 'small',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Visible link text.',
    },
    href: {
      control: 'text',
      description: 'Destination URL for the link icon.',
    },
    iconName: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Toolkit icon name from the generated sprite manifest. Defaults to `ChevronLeft` for left icons and `Launch` for right icons.',
    },
    iconColor: {
      control: 'color',
      description:
        'Optional icon-only color override. Leave unset to inherit the link text colour.',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Icon placement relative to the text.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description: 'Link icon size.',
    },
    openInNewWindow: {
      control: 'boolean',
      description:
        'Opens the link in a new tab and applies safe rel values when enabled.',
    },
    className: {
      control: false,
      description:
        'Additional classes applied to the wrapper element. Use this for layout hooks only.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the rendered anchor element.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<LinkIconProps>;

export const Default: Story = {};

export const RightIcon: Story = {
  args: {
    children: 'Open service search',
    href: 'https://example.com',
    iconName: 'Launch',
    iconPosition: 'right',
    size: 'medium',
    openInNewWindow: true,
  },
};

export const CustomIconColour: Story = {
  args: {
    children: 'Open service search',
    href: 'https://example.com',
    iconName: 'Search',
    iconColor: '#005eb8',
    iconPosition: 'right',
    size: 'medium',
    openInNewWindow: true,
  },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <LinkIcon href="#back" iconPosition="left" size="small">
        Go back
      </LinkIcon>
      <LinkIcon
        href="https://example.com"
        iconName="Launch"
        iconPosition="right"
        size="medium"
        openInNewWindow
      >
        Open in a new tab
      </LinkIcon>
      <LinkIcon
        href="#search"
        iconName="Search"
        iconPosition="left"
        iconColor="#005eb8"
      >
        Search results
      </LinkIcon>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
