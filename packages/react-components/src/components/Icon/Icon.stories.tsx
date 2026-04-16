import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import iconManifest from '@ourfuturehealth/toolkit/assets/icons/manifest.json';
import { Icon } from './Icon';

type IconSize = 16 | 24 | 32;

type IconStoryArgs = React.ComponentProps<typeof Icon> & {
  builderSize?: IconSize;
  sizingMode?: 'fixed' | 'responsive';
};

const iconNameOptions = iconManifest.icons
  .map(({ name }) => name)
  .sort((left, right) => left.localeCompare(right));

const iconUsageExample = `import { Icon } from '@ourfuturehealth/react-components';

<Icon
  name="Check"
  size={24}
/>;
`;

const renderIconBuilderStory = ({
  builderSize = 24,
  color,
  name = 'Check',
  sizingMode = 'fixed',
  title,
}: IconStoryArgs) => {
  const sharedProps = {
    color: color || undefined,
    name,
    title: title || undefined,
  };

  if (sizingMode === 'responsive') {
    return <Icon {...sharedProps} responsiveSize={builderSize} />;
  }

  return <Icon {...sharedProps} size={builderSize} />;
};

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Icon to render toolkit icons in React. Choose exactly one sizing mode: `size` for a fixed 16/24/32 icon, or `responsiveSize` to follow the toolkit iconography scale. The responsive scale maps `16` to `16/16/16`, `24` to `16/16/24`, and `32` to `24/24/32` across mobile, tablet, and desktop. Leave `title` empty for decorative icons. Any other SVG props, such as `aria-*`, `data-*`, or event handlers, are passed straight to the rendered `<svg>` element.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>Icon</code> to render one of the bundled toolkit icons in
            React. Pass the icon <code>name</code> and choose one sizing mode:
            fixed <code>size</code> or <code>responsiveSize</code>.
          </p>
          <p>
            Leave <code>title</code> empty when the icon is decorative. Add a{' '}
            <code>title</code> only when the icon needs to be announced as
            meaningful content on its own.
          </p>
          <Source code={iconUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={['name', 'size', 'responsiveSize', 'title', 'color']}
          />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>sizingMode</code> and <code>builderSize</code> are only used
            by the Storybook <code>Builder</code> story so you can try one
            sizing approach at a time. They are not React props accepted by{' '}
            <code>Icon</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Toolkit icon name from the generated manifest. This maps directly to bundled toolkit icon data in the React package.',
      table: {
        category: 'IconProps',
      },
    },
    size: {
      control: 'radio',
      options: [16, 24, 32],
      description:
        'Fixed icon size. Use this when the icon should stay at 16, 24, or 32 across every breakpoint. Mutually exclusive with `responsiveSize`.',
      table: {
        category: 'IconProps',
      },
    },
    responsiveSize: {
      control: 'radio',
      options: [16, 24, 32],
      description:
        'Responsive icon size from the toolkit iconography scale. `16` stays 16 everywhere, `24` becomes 16/16/24, and `32` becomes 24/24/32 across mobile, tablet, and desktop. Mutually exclusive with `size`.',
      table: {
        category: 'IconProps',
      },
    },
    title: {
      control: 'text',
      description:
        'Accessible label for meaningful standalone icons. When set, the icon renders with `role="img"`; leave it empty for decorative icons so it stays hidden from assistive technology.',
      table: {
        category: 'IconProps',
      },
    },
    color: {
      control: 'color',
      description:
        'Optional color override applied through inline style. Use this for monochrome icons that should not inherit surrounding text colour.',
      table: {
        category: 'IconProps',
      },
    },
    sizingMode: {
      control: 'radio',
      options: ['fixed', 'responsive'],
      description:
        'Storybook-only helper for the Builder story. Chooses whether the example drives the real `size` prop or the real `responsiveSize` prop.',
      table: {
        category: 'Builder story only',
      },
    },
    builderSize: {
      control: 'radio',
      options: [16, 24, 32],
      description:
        'Storybook-only helper for the Builder story. Sets the active fixed or responsive size value without exposing both sizing props at once.',
      table: {
        category: 'Builder story only',
      },
    },
    className: {
      control: false,
      description:
        'Optional extra classes applied to the `<svg>` element. Use this for component-specific styling hooks or layout adjustments.',
      table: {
        category: 'Advanced',
      },
    },
    style: {
      control: false,
      description:
        'Optional inline SVG styles. This merges with the `color` prop when both are provided.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the underlying `<svg>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    name: 'Check',
    size: 24,
  },
} satisfies Meta<IconStoryArgs>;

export default meta;

type Story = StoryObj<IconStoryArgs>;

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic decorative icon example. Use it as the default copyable pattern when the icon is decorative and does not need an accessible label.',
      },
    },
  },
  render: () => <Icon name="Check" size={24} />,
};

export const Builder: Story = {
  args: {
    builderSize: 24,
    color: '',
    name: 'Check',
    sizingMode: 'fixed',
    title: '',
  },
  render: renderIconBuilderStory,
  parameters: {
    controls: {
      include: ['name', 'sizingMode', 'builderSize', 'title', 'color'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the icon API interactively. It is the quickest way to test icon names, sizes, labels, and tinting together.',
      },
    },
  },
};

export const WithTitle: Story = {
  args: {
    name: 'UnfoldMore',
    title: 'Expand options',
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const StaticSizes: Story = {
  render: () => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <Icon name="Check" size={16} />
      <Icon name="Check" size={24} />
      <Icon name="Check" size={32} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ResponsiveScale: Story = {
  args: {
    name: 'Check',
    responsiveSize: 24,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed responsive-size example that shows the toolkit iconography scale collapsing and expanding at breakpoint boundaries.',
      },
    },
  },
};

export const ResponsiveScaleComparison: Story = {
  render: () => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <div>
        <Icon name="Check" responsiveSize={16} />
        <div>16 / 16 / 16</div>
      </div>
      <div>
        <Icon name="Check" responsiveSize={24} />
        <div>16 / 16 / 24</div>
      </div>
      <div>
        <Icon name="Check" responsiveSize={32} />
        <div>24 / 24 / 32</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
