import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Tag to show short status labels. The default Tag style is neutral. Apply toolkit modifier classes such as `ofh-tag--brand` or `ofh-tag--blue` through the `classes` prop to choose a variant explicitly.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description:
        'Plain text tag content. Provide either `text` or `html`. If `html` is provided it takes precedence.',
    },
    html: {
      control: 'text',
      description:
        'Optional HTML content rendered inside the tag. Only pass trusted or sanitised HTML. When provided it takes precedence over `text`.',
    },
    classes: {
      control: 'text',
      description:
        'Toolkit modifier classes for the tag. Supported variants are `ofh-tag--neutral`, `ofh-tag--brand`, `ofh-tag--blue`, `ofh-tag--green`, `ofh-tag--yellow`, and `ofh-tag--red`. `ofh-tag--grey` is deprecated.',
    },
    className: {
      control: 'text',
      description:
        'Additional React-side classes added alongside the toolkit classes. Use this for integration hooks rather than choosing a Tag variant.',
    },
    attributes: {
      control: 'object',
      description:
        'Additional toolkit-style HTML attributes applied to the root `<strong>` element.',
      table: {
        type: {
          summary: 'Record<string, string | number | boolean | null | undefined>',
        },
      },
    },
  },
  args: {
    text: 'Inactive',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive single-tag example. Leave `classes` empty to preview the default neutral Tag, or enter a supported modifier class to inspect another variant.',
      },
    },
  },
};

export const HtmlContent: Story = {
  args: {
    text: 'Fallback content',
    html: '<span><strong>Beta</strong> feature</span>',
    classes: 'ofh-tag--brand',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive single-tag example using the `html` prop. The HTML content takes precedence over `text`.',
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
      <Tag text="Default" />
      <Tag text="Neutral" classes="ofh-tag--neutral" />
      <Tag text="Beta" classes="ofh-tag--brand" />
      <Tag text="Ready" classes="ofh-tag--blue" />
      <Tag text="In progress" classes="ofh-tag--green" />
      <Tag text="Delayed" classes="ofh-tag--yellow" />
      <Tag text="Urgent" classes="ofh-tag--red" />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Showcase story for all supported Tag variants. `ofh-tag--grey` is still supported as a deprecated alias, but new work should use `ofh-tag--neutral`.',
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
        <Tag text="Beta" classes="ofh-tag--brand" />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span>Application status:</span>
        <Tag text="Ready" classes="ofh-tag--blue" />
        <Tag text="In progress" classes="ofh-tag--green" />
        <Tag text="Delayed" classes="ofh-tag--yellow" />
        <Tag text="Urgent" classes="ofh-tag--red" />
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span>Account:</span>
        <Tag text="Inactive" classes="ofh-tag--neutral" />
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
