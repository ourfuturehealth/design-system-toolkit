import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionLink, type ActionLinkProps } from './ActionLink';

const meta: Meta<ActionLinkProps> = {
  title: 'Components/Action link',
  component: ActionLink,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ActionLink is the purpose-built React surface for the prominent action-link pattern. It always renders the coloured circular arrow icon, keeps the toolkit structure, and uses the newer focus treatment from the Figma design.',
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
      description: 'Visible link text.',
    },
    href: {
      control: 'text',
      description: 'Destination URL for the action link.',
    },
    openInNewWindow: {
      control: 'boolean',
      description:
        'Opens the link in a new tab and adds the safe `rel` values when enabled.',
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
type Story = StoryObj<ActionLinkProps>;

export const Default: Story = {};

export const OpenInNewWindow: Story = {
  args: {
    openInNewWindow: true,
  },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <ActionLink href="#service-a">Find a minor injuries unit</ActionLink>
      <ActionLink href="#service-b" openInNewWindow>
        Open service search
      </ActionLink>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
