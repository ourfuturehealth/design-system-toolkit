import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Tag, type TagVariant } from './Tag';

const variantOptions: TagVariant[] = [
  'neutral',
  'brand',
  'blue',
  'green',
  'yellow',
  'red',
];

const tagUsageExample = `import { Tag } from '@ourfuturehealth/react-components';

<Tag variant="neutral">
  Inactive
</Tag>;
`;

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Tag to show short status labels. The default Tag style is neutral. Choose a supported variant through the `variant` prop. Toolkit markup still supports the deprecated `ofh-tag--grey` class as an alias of neutral, but React uses the canonical `neutral` variant name.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>Tag</code> for short, non-interactive status labels or
            contextual markers.
          </p>
          <p>
            Pass the visible label as <code>children</code> and choose a{' '}
            <code>variant</code> when you need a different color treatment.
          </p>
          <Source code={tagUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={['children', 'variant', 'className']}
          />

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Tag content.',
      table: {
        category: 'TagProps',
      },
    },
    variant: {
      control: 'select',
      options: variantOptions,
      description:
        'Visual style variant. Use `neutral`, `brand`, `blue`, `green`, `yellow`, or `red`.',
      table: {
        category: 'TagProps',
      },
    },
    className: {
      control: 'text',
      description:
        'Additional classes added alongside the toolkit classes. Use this for integration hooks rather than choosing a Tag variant.',
      table: {
        category: 'TagProps',
      },
    },
  },
  args: {
    children: 'Inactive',
    variant: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic neutral tag example. Use this as the default pattern when you want a short, non-interactive label.',
      },
    },
  },
  render: () => <Tag variant="neutral">Inactive</Tag>,
};

export const Builder: Story = {
  args: {
    children: 'Inactive',
    variant: 'neutral',
  },
  parameters: {
    controls: {
      include: ['children', 'variant'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the Tag API interactively. It is the simplest place to change the label text and visual variant.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}
    >
      <Tag variant="neutral">Neutral</Tag>
      <Tag variant="brand">Beta</Tag>
      <Tag variant="blue">Ready</Tag>
      <Tag variant="green">In progress</Tag>
      <Tag variant="yellow">Delayed</Tag>
      <Tag variant="red">Urgent</Tag>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Showcase story for all supported Tag variants. Use `neutral` as the canonical replacement for the deprecated toolkit `ofh-tag--grey` alias.',
      },
    },
  },
};

export const UsageExamples: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span>Recruitment:</span>
        <Tag variant="brand">Beta</Tag>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span>Application status:</span>
        <Tag variant="blue">Ready</Tag>
        <Tag variant="green">In progress</Tag>
        <Tag variant="yellow">Delayed</Tag>
        <Tag variant="red">Urgent</Tag>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span>Account:</span>
        <Tag variant="neutral">Inactive</Tag>
      </div>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Non-interactive usage examples showing how the Tag variants can be combined in practical status displays.',
      },
    },
  },
};
