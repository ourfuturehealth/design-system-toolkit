import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-line text input that reuses the toolkit markup and classes, including the input-family label, hint, error, and width treatments.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Full name',
    name: 'full-name',
    type: 'text',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label content for the input.',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text shown below the label.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional error message shown above the input.',
    },
    error: {
      control: false,
      table: {
        disable: true,
      },
    },
    width: {
      control: 'select',
      options: [
        'full',
        'three-quarters',
        'two-thirds',
        'one-half',
        'one-third',
        'one-quarter',
      ],
      description: 'Fluid width utility applied to the input.',
    },
    inputWidth: {
      control: 'select',
      options: [2, 3, 4, 5, 10, 20, 30],
      description: 'Fixed character-width modifier class.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an h1 when the input question is the page heading.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your full name',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Email address',
    hint: "We'll never share your email with anyone else",
    type: 'email',
    placeholder: 'name@example.com',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    errorMessage: 'Enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

export const FixedWidths: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '32rem',
      }}
    >
      <TextInput inputWidth={20} label="20 character width" />
      <TextInput inputWidth={10} label="10 character width" />
      <TextInput inputWidth={5} label="5 character width" />
      <TextInput inputWidth={4} label="4 character width" />
      <TextInput inputWidth={3} label="3 character width" />
      <TextInput inputWidth={2} label="2 character width" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fixed-width modifiers help users understand the expected length of the answer.',
      },
    },
  },
};

export const FluidWidths: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '48rem',
      }}
    >
      <TextInput label="Full width" width="full" />
      <TextInput label="Three-quarters width" width="three-quarters" />
      <TextInput label="Two-thirds width" width="two-thirds" />
      <TextInput label="One-half width" width="one-half" />
      <TextInput label="One-third width" width="one-third" />
      <TextInput label="One-quarter width" width="one-quarter" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fluid width utilities resize with the viewport and work well for shorter answers inside wider layouts.',
      },
    },
  },
};

export const AsPageHeading: Story = {
  args: {
    isPageHeading: true,
    label: 'What is your name?',
    labelClassName: 'ofh-label--l',
    placeholder: 'Enter your full name',
  },
};

export const FormExample: Story = {
  render: () => (
    <form
      style={{
        maxWidth: '28rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <TextInput
        hint="Enter your first and last name"
        label="Full name"
        placeholder="e.g. John Smith"
        required
      />
      <TextInput
        hint="We'll use this to contact you"
        label="Email address"
        required
        type="email"
        width="three-quarters"
      />
      <TextInput
        errorMessage="Enter a valid phone number"
        label="Phone number"
        type="tel"
        width="two-thirds"
      />
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how text inputs work together in a form.',
      },
    },
  },
};
