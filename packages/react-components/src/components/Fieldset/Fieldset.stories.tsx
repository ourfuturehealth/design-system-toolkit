import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput';
import { Fieldset } from './Fieldset';

const meta: Meta<typeof Fieldset> = {
  title: 'Components/Fieldset',
  component: Fieldset,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A semantic fieldset wrapper for grouped form questions. Use it when several inputs belong to the same question and supply the question text through the legend.\n\nThe React component mirrors the toolkit fieldset macro while smoothing over the toolkit class names:\n- `legend` supplies the legend content and accepts plain text or richer React nodes.\n- `legendSize` applies the built-in legend hierarchy with friendly values: `none`, `small`, `medium`, `large`, and `extraLarge`.\n- `isPageHeading` wraps that legend content in an `h1` when the grouped question is also the page heading.\n- `describedBy` appends external hint or error IDs to the fieldset `aria-describedby` attribute.\n- Native fieldset attributes such as `id`, `role`, `disabled`, and data attributes pass through to the underlying `<fieldset>`.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    legend: 'Personal details',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'Question or grouping label shown in the fieldset legend.',
      table: {
        type: {
          summary: 'ReactNode',
        },
      },
    },
    describedBy: {
      control: 'text',
      description:
        'Additional element IDs to append to the fieldset `aria-describedby` value.',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend content in an `h1` when the question should also be announced as the page heading.',
      table: {
        type: {
          summary: 'boolean',
        },
      },
    },
    legendSize: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'extraLarge'],
      description:
        'Applies one of the published legend-size variants. Use `none` for the default legend styling with no size modifier class.',
      table: {
        type: {
          summary: "'none' | 'small' | 'medium' | 'large' | 'extraLarge'",
        },
      },
    },
    children: {
      control: false,
      description:
        'Inputs or other grouped content rendered inside the fieldset.',
    },
    className: {
      control: false,
      description: 'Additional classes for the fieldset element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the fieldset element.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    legend: 'Contact details',
    legendSize: 'medium',
  },
  render: (args) => (
    <Fieldset {...args}>
      <TextInput label="Email address" type="email" width="three-quarters" />
      <TextInput label="Phone number" type="tel" width="two-thirds" />
    </Fieldset>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use a standard legend when the page already has its own heading and the fieldset is grouping a smaller set of related inputs within that page.',
      },
    },
  },
};

export const AsPageHeading: Story = {
  args: {
    legend: 'What is your address?',
    isPageHeading: true,
    legendSize: 'large',
  },
  render: (args) => <Fieldset {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the fieldset question is also the page heading. This mirrors the docs-site example where the legend is the page heading and no extra grouped content is needed yet.',
      },
    },
  },
};

export const WithAddressInputs: Story = {
  args: {
    legend: 'What is your address?',
    legendSize: 'large',
  },
  render: (args) => (
    <Fieldset {...args}>
      <TextInput
        label={
          <>
            Building and street{' '}
            <span className="ofh-u-visually-hidden">line 1 of 2</span>
          </>
        }
      />
      <TextInput
        label={
          <span className="ofh-u-visually-hidden">
            Building and street line 2 of 2
          </span>
        }
      />
      <TextInput label="Town or city" width="two-thirds" />
      <TextInput inputWidth={10} label="Postcode" />
    </Fieldset>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A grouped-address example without making the legend the page heading. Use this when the page already has a heading and the address block is only one part of the form.',
      },
    },
  },
};

export const LegendSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '32rem',
      }}
    >
      <Fieldset legend="None legend" legendSize="none">
        <TextInput label="Example field" />
      </Fieldset>
      <Fieldset legend="Small legend" legendSize="small">
        <TextInput label="Example field" />
      </Fieldset>
      <Fieldset legend="Medium legend" legendSize="medium">
        <TextInput label="Example field" />
      </Fieldset>
      <Fieldset legend="Large legend" legendSize="large">
        <TextInput label="Example field" />
      </Fieldset>
      <Fieldset legend="Extra large legend" legendSize="extraLarge">
        <TextInput label="Example field" />
      </Fieldset>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Legend size modifiers mirror the toolkit hierarchy while exposing a friendlier React API. Use `none` for the base legend styling, or pick one of the named size variants when the grouped question needs a stronger heading treatment.',
      },
    },
  },
};

export const WithDescribedBy: Story = {
  args: {
    describedBy: 'fieldset-hint',
    legend: 'Contact details',
    legendSize: 'medium',
  },
  render: (args) => (
    <div style={{ maxWidth: '64rem' }}>
      <p className="ofh-hint" id="fieldset-hint">
        We will only use these details to contact you about your application.
      </p>
      <Fieldset {...args}>
        <TextInput label="Email address" type="email" />
        <TextInput label="Phone number" type="tel" />
      </Fieldset>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `describedBy` when supporting text lives outside the fieldset but still needs to be announced with the group.',
      },
    },
  },
};
