import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkSkip, type LinkSkipProps } from './LinkSkip';

const renderLinkSkipStory = (args: LinkSkipProps) => (
  <div style={{ position: 'relative', minHeight: '6rem' }}>
    <p style={{ marginBottom: '1rem' }}>
      To view the link skip, press Tab or move focus into this example and
      press Tab.
    </p>
    <LinkSkip {...args} />
  </div>
);

const meta: Meta<LinkSkipProps> = {
  title: 'Components/Link/Skip',
  component: LinkSkip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'LinkSkip is the canonical React surface for the Link / Skip pattern. It mirrors the toolkit behaviour by defaulting to `#maincontent` and "Skip to main content" while still allowing standard anchor attributes when needed.',
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
type Story = StoryObj<LinkSkipProps>;

export const Default: Story = {
  render: renderLinkSkipStory,
};

export const CustomLabel: Story = {
  args: {
    children: 'Skip to results',
    href: '#results',
  },
  render: renderLinkSkipStory,
};

export const Showcase: Story = {
  render: () =>
    renderLinkSkipStory({
      children: 'Skip to main content',
      href: '#maincontent',
    }),
  parameters: {
    controls: {
      disable: true,
    },
  },
};
