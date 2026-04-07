import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkIcon, type LinkIconProps } from './LinkIcon';

const meta: Meta<LinkIconProps> = {
  title: 'Components/Link icon',
  component: LinkIcon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'LinkIcon is the canonical React surface for the link-icon family. Use `iconPosition` to switch between back-link and forward/external patterns, and keep the API limited to `children`, `href`, `iconName`, `iconPosition`, and `size` unless you need a standard anchor attribute.',
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
      options: ['ChevronLeft', 'Launch'],
      description:
        'Toolkit icon name. Defaults to `ChevronLeft` for left icons and `Launch` for right icons.',
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
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
