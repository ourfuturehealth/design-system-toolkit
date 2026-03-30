import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Input/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A multiline input that reuses the toolkit textarea classes and shared input-family label, hint, and error treatments. Native textarea props such as `placeholder`, `rows`, `disabled`, and `required` pass through to the underlying `<textarea>`.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Can you provide more detail?',
    name: 'details',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Question or field label shown above the textarea.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the textarea. When present, the textarea is marked invalid and linked with `aria-describedby`.',
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the textarea is empty.',
    },
    rows: {
      control: 'number',
      description: 'Visible row count for the textarea before it scrolls.',
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an `h1` when this question is also the page heading.',
    },
    className: {
      control: false,
      description:
        'Additional classes for the textarea element itself. Use this only for integration hooks or layout overrides.',
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
      description: 'React ref for the underlying textarea element.',
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
    hint: 'Do not include personal or financial information.',
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'You must provide an explanation.',
    label: "Why can't you provide a National Insurance number?",
  },
};

export const Longer: Story = {
  args: {
    hint: 'Do not include personal or financial information.',
    rows: 10,
  },
};

export const AsPageHeading: Story = {
  args: {
    isPageHeading: true,
    label: 'Can you provide more detail?',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the textarea question should also be announced as the page heading.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '32rem',
      }}
    >
      <Textarea
        hint="Do not include personal or financial information."
        label="Can you provide more detail?"
      />
      <Textarea
        errorMessage="You must provide an explanation."
        label="Why can't you provide a National Insurance number?"
      />
    </form>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Example of how textareas work within a form, including default and error states.',
      },
    },
  },
};
