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
          'A multiline input that reuses the toolkit textarea classes and shared input-family label, hint, and error treatments.',
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
      description: 'Visible label content for the textarea.',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text shown below the label.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional error message shown above the textarea.',
    },
    rows: {
      control: 'number',
      description: 'Visible row count for the textarea.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an h1 when the question is the page heading.',
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
    labelClassName: 'ofh-label--l',
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
};
