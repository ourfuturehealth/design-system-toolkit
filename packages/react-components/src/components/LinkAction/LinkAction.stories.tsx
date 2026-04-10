import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkAction, type LinkActionProps } from './LinkAction';

const meta: Meta<LinkActionProps> = {
  title: 'Components/Link/Action',
  component: LinkAction,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'LinkAction is the canonical React surface for the prominent Link / Action pattern. It keeps the toolkit structure, always renders the coloured circular arrow icon, and lets you customise the visible label, destination, and whether the link opens in a new tab. Standard anchor attributes still pass through when you need them.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Find a minor injuries unit',
    href: 'https://www.nhs.uk/service-search/minor-injuries-unit/locationsearch/551',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Visible link text. Keep it short and action-led.',
    },
    href: {
      control: 'text',
      description: 'Destination URL or fragment for the link action.',
    },
    openInNewWindow: {
      control: 'boolean',
      description:
        'Opens the link in a new tab and adds `target="_blank"` plus the safe `rel` values when enabled.',
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
type Story = StoryObj<LinkActionProps>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive link action example. Use the controls to change the label, destination, and `openInNewWindow` behaviour.',
      },
    },
  },
};

export const OpenInNewWindow: Story = {
  args: {
    openInNewWindow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `openInNewWindow` when the destination should open in a new tab or window. The component sets `target="_blank"` and `rel="noopener noreferrer"` for you.',
      },
    },
  },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <LinkAction href="#service-a">Find a minor injuries unit</LinkAction>
      <LinkAction href="#service-b" openInNewWindow>
        Open service search
      </LinkAction>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Common link action combinations: a standard in-journey destination and a version that opens an external journey in a new tab.',
      },
    },
  },
};
