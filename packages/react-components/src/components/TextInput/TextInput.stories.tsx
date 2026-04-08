import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Input/Text input',
  component: TextInput,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-line text input that reuses the toolkit markup and classes, including the shared input-family label, hint, error, and width treatments. Native input props such as `autoComplete`, `disabled`, `placeholder`, and `required` pass straight through to the underlying `<input>`.',
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
      description: 'Question or field label shown above the input.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the input. When present, the input is marked invalid and linked with `aria-describedby`.',
    },
    error: {
      control: false,
      table: {
        disable: true,
      },
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'search', 'password', 'url', 'number'],
      description: 'Native input type for the underlying `<input>` element.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the input is empty.',
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
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
      description: 'Responsive width utility for broader layout sizing. Use this for layout width, not expected answer length.',
    },
    inputWidth: {
      control: 'select',
      options: [2, 3, 4, 5, 10, 20, 30],
      description: 'Fixed character-width modifier that helps signal the expected answer length.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an `h1` when this question is also the page heading.',
    },
    className: {
      control: false,
      description:
        'Additional classes for the input element itself. Use this only for integration hooks or layout overrides.',
      table: {
        category: 'Advanced',
      },
    },
    formGroupClassName: {
      control: false,
      description: 'Additional classes for the outer form-group wrapper.',
      table: {
        category: 'Advanced',
      },
    },
    labelClassName: {
      control: false,
      description: 'Additional classes for the label element.',
      table: {
        category: 'Advanced',
      },
    },
    hintClassName: {
      control: false,
      description: 'Additional classes for the hint element.',
      table: {
        category: 'Advanced',
      },
    },
    errorMessageClassName: {
      control: false,
      description: 'Additional classes for the error message element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the underlying input element.',
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
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
    placeholder: 'Enter your full name',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the question should also be announced as the page heading. The component applies the larger heading label treatment automatically.',
      },
    },
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Example of how text inputs work together in a form.',
      },
    },
  },
};
