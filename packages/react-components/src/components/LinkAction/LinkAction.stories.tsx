import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Stories, Title } from '@storybook/addon-docs/blocks';
import { LinkAction, type LinkActionProps } from './LinkAction';

const meta: Meta<LinkActionProps> = {
  title: 'Components/Link/Action',
  component: LinkAction,
  parameters: {
    layout: 'padded',
    docsNamespaceArgKeys: ['href'],
    docs: {
      description: {
        component:
          'LinkAction is the canonical React surface for the prominent Link / Action pattern. It keeps the toolkit structure, always renders the coloured circular arrow icon, and lets you customise the visible label, destination, and whether the link opens in a new tab. Standard anchor attributes still pass through when you need them.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use LinkAction</h2>
          <p>
            Use <code>LinkAction</code> for the prominent action-style link that
            moves people forward in a journey. Pass the visible label with
            <code>children</code>, the destination with <code>href</code>, and
            set <code>openInNewWindow</code> when the destination should open in
            a new tab.
          </p>
          <p>
            <code>className</code> is for layout or integration hooks only.
            Anchor attributes such as <code>aria-*</code> still pass through
            when you need them.
          </p>

          <h2>Props</h2>
          <ArgTypes of={LinkAction} exclude={['ref']} />

          <h2>Examples</h2>
          <Stories title="Examples" />
        </>
      ),
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
      description:
        'Visible link text. Keep it short, action-led, and clear about where the link goes.',
    },
    href: {
      control: 'text',
      description:
        'Destination URL or fragment for the link action. This is the real link target, not just display text.',
    },
    openInNewWindow: {
      control: 'boolean',
      description:
        'Opens the link in a new tab and adds `target="_blank"` plus the safe `rel` values when enabled.',
    },
    className: {
      control: false,
      description:
        'Additional classes applied to the wrapper element. Use this for layout hooks or integration targets only.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the rendered anchor element when you need direct DOM access.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<LinkActionProps>;

export const Default: Story = {
  args: {
    children: 'Find a minor injuries unit',
    href: 'https://www.nhs.uk/service-search/minor-injuries-unit/locationsearch/551',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic in-journey action link with the standard icon and label treatment.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    children: 'Find a minor injuries unit',
    href: 'https://www.nhs.uk/service-search/minor-injuries-unit/locationsearch/551',
  },
  parameters: {
    controls: {
      include: ['children', 'href', 'openInNewWindow'],
    },
    docs: {
      description: {
        story:
          'Use the Builder controls to experiment with the label, destination, and `openInNewWindow` behaviour.',
      },
    },
  },
};

export const OpenInNewWindow: Story = {
  args: {
    openInNewWindow: true,
  },
  parameters: {
    controls: {
      disable: true,
    },
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
