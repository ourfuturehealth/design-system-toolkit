import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form input component with label, hint text, error states, and various width options based on the OFH Design System.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input field label (required)',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text to help users',
    },
    error: {
      control: 'text',
      description: 'Error message to display when validation fails',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required (shows asterisk)',
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
      description: 'Input field width',
    },
    maxLength: {
      control: 'select',
      options: [2, 3, 4, 5, 10, 20],
      description: 'Character limit for the input',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Enter your full name',
  },
};

// With hint
export const WithHint: Story = {
  args: {
    label: 'Email address',
    hint: "We'll never share your email with anyone else",
    type: 'email',
    placeholder: 'name@example.com',
  },
};

// Required field
export const Required: Story = {
  args: {
    label: 'Phone number',
    required: true,
    type: 'tel',
    placeholder: '+44 7700 900000',
  },
};

// With error
export const WithError: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    error: 'Enter a valid email address',
    value: 'invalid-email',
  },
};

// Different widths
export const DifferentWidths: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <TextInput label="Full width" width="full" />
      <TextInput label="Three quarters" width="three-quarters" />
      <TextInput label="Two thirds" width="two-thirds" />
      <TextInput label="One half" width="one-half" />
      <TextInput label="One third" width="one-third" />
      <TextInput label="One quarter" width="one-quarter" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different width options available for text inputs.',
      },
    },
  },
};

// Character limits
export const CharacterLimits: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px',
      }}
    >
      <TextInput label="2 characters" maxLength={2} hint="For country codes" />
      <TextInput label="4 characters" maxLength={4} hint="For year input" />
      <TextInput
        label="10 characters"
        maxLength={10}
        hint="For phone numbers"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different character limit options for specific use cases.',
      },
    },
  },
};

// Form example
export const FormExample: Story = {
  render: () => (
    <form
      style={{
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <TextInput
        label="Full name"
        required
        hint="Enter your first and last name"
        placeholder="e.g. John Smith"
      />
      <TextInput
        label="Email address"
        type="email"
        required
        hint="We'll use this to contact you"
        width="three-quarters"
      />
      <TextInput
        label="Phone number"
        type="tel"
        hint="Optional - for urgent updates only"
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
