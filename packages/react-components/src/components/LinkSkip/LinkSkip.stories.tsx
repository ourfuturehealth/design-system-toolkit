import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Stories, Title } from '@storybook/addon-docs/blocks';
import { LinkSkip, type LinkSkipProps } from './LinkSkip';

const getSkipTargetId = (href?: string) =>
  href?.startsWith('#') ? href.slice(1) : undefined;

const renderLinkSkipStory = (args: LinkSkipProps) => (
  <div style={{ position: 'relative', minHeight: '10rem' }}>
    <p style={{ marginBottom: '1rem' }}>
      To view the link skip, press Tab or move focus into this example and
      press Tab.
    </p>
    <LinkSkip {...args} />
    {getSkipTargetId(args.href) ? (
      <div
        id={getSkipTargetId(args.href)}
        tabIndex={-1}
        style={{
          marginTop: '3.5rem',
          border: '1px dashed #768692',
          padding: '1rem',
        }}
      >
        Example target: {getSkipTargetId(args.href)}
      </div>
    ) : null}
  </div>
);

const meta: Meta<LinkSkipProps> = {
  title: 'Components/Link/Skip',
  component: LinkSkip,
  parameters: {
    layout: 'padded',
    docsNamespaceArgKeys: ['href'],
    docs: {
      description: {
        component:
          'LinkSkip is the canonical React surface for the Link / Skip pattern. It defaults to `#maincontent` and "Skip to main content", and you normally only change the label or target when users need to skip somewhere more specific. Standard anchor attributes still pass through when you need them.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use LinkSkip</h2>
          <p>
            Use <code>LinkSkip</code> as the first focusable element on the
            page. Pass the visible label with <code>children</code> and the
            target with <code>href</code>.
          </p>
          <p>
            Most consumers only need the default <code>#maincontent</code>{' '}
            target. Change it only when the page needs to jump somewhere more
            specific, such as search results or a filtered section.
          </p>

          <h2>Props</h2>
          <ArgTypes of={LinkSkip} exclude={['ref']} />

          <h2>Examples</h2>
          <Stories title="Examples" />
        </>
      ),
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
      description:
        'Visible skip-link label. Defaults to `Skip to main content`.',
    },
    href: {
      control: 'text',
      description:
        'Target id or URL for the skip link. Defaults to `#maincontent`.',
    },
    className: {
      control: false,
      description:
        'Additional classes applied to the anchor element. Use this only for layout hooks or integration targets.',
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
type Story = StoryObj<LinkSkipProps>;

export const Default: Story = {
  args: {
    children: 'Skip to main content',
    href: '#maincontent',
  },
  render: renderLinkSkipStory,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'The standard skip link that jumps straight to the main content region.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    children: 'Skip to main content',
    href: '#maincontent',
  },
  render: renderLinkSkipStory,
  parameters: {
    controls: {
      include: ['children', 'href'],
    },
    docs: {
      description: {
        story:
          'Use the Builder controls to change the skip-link label and fragment target.',
      },
    },
  },
};

export const CustomTargetAndLabel: Story = {
  args: {
    children: 'Skip to results',
    href: '#results',
  },
  render: renderLinkSkipStory,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Retarget the skip link when people need to bypass repeated controls and jump to a more specific section, such as search results or filters.',
      },
    },
  },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {renderLinkSkipStory({
        children: 'Skip to main content',
        href: '#maincontent',
      })}
      {renderLinkSkipStory({
        children: 'Skip to results',
        href: '#results',
      })}
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Side-by-side examples of the default skip-link target and a custom target for journeys with repeated filters or other long blocks of controls.',
      },
    },
  },
};
