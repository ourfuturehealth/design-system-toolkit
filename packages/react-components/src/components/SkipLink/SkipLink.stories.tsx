import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink, type SkipLinkProps } from './SkipLink';

const meta: Meta<SkipLinkProps> = {
  title: 'Components/Skip link',
  component: SkipLink,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SkipLink is the purpose-built React surface for the hidden skip link. It mirrors the toolkit behaviour by defaulting to `#maincontent` and "Skip to main content" while still allowing standard anchor attributes when needed.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Skip to main content',
    href: '#maincontent',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Visible skip-link label.',
    },
    href: {
      control: 'text',
      description: 'Target id or URL for the skip link.',
    },
    className: {
      control: false,
      description:
        'Additional classes applied to the anchor element. Use this only for layout hooks.',
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
type Story = StoryObj<SkipLinkProps>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    children: 'Skip to results',
    href: '#results',
  },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '6rem' }}>
      <SkipLink href="#maincontent">Skip to main content</SkipLink>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
