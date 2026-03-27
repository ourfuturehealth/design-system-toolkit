import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'Components/Input/Date input',
  component: DateInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A grouped date input that reuses the toolkit fieldset, hint, error, and shared input-family box styles for day, month, and year fields.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    id: 'date-of-birth',
    legend: 'What is your date of birth?',
    namePrefix: 'date-of-birth',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'Legend content for the grouped date fields.',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text shown below the legend.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional error message shown above the date fields.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend in an h1 when the question is the page heading.',
    },
    items: {
      control: false,
      description: 'Date input items rendered within the group.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'For example, 31 3 1980',
  },
};

export const WithAutocomplete: Story = {
  args: {
    hint: 'For example, 31 3 1980',
    items: [
      {
        name: 'day',
        className: 'ofh-input--width-2',
        autoComplete: 'bday-day',
      },
      {
        name: 'month',
        className: 'ofh-input--width-2',
        autoComplete: 'bday-month',
      },
      {
        name: 'year',
        className: 'ofh-input--width-4',
        autoComplete: 'bday-year',
      },
    ],
  },
};

export const WithErrors: Story = {
  args: {
    errorMessage: 'Enter your date of birth',
    hint: 'For example, 31 3 1980',
    items: [
      {
        name: 'day',
        className: 'ofh-input--width-2 ofh-input--error',
      },
      {
        name: 'month',
        className: 'ofh-input--width-2 ofh-input--error',
      },
      {
        name: 'year',
        className: 'ofh-input--width-4 ofh-input--error',
      },
    ],
  },
};

export const SingleFieldError: Story = {
  args: {
    errorMessage: 'Enter your date of birth',
    hint: 'For example, 31 3 1980',
    items: [
      {
        name: 'day',
        className: 'ofh-input--width-2 ofh-input--error',
      },
      {
        name: 'month',
        className: 'ofh-input--width-2',
      },
      {
        name: 'year',
        className: 'ofh-input--width-4',
      },
    ],
  },
};

export const AsPageHeading: Story = {
  args: {
    hint: 'For example, 31 3 1980',
    isPageHeading: true,
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
      <DateInput
        hint="For example, 31 3 1980"
        id="date-of-birth"
        legend="What is your date of birth?"
        namePrefix="date-of-birth"
      />
      <DateInput
        errorMessage="Enter the date your appointment is booked for"
        hint="For example, 15 3 2026"
        id="appointment-date"
        items={[
          {
            name: 'day',
            className: 'ofh-input--width-2 ofh-input--error',
          },
          {
            name: 'month',
            className: 'ofh-input--width-2',
          },
          {
            name: 'year',
            className: 'ofh-input--width-4',
          },
        ]}
        legend="What date is your appointment?"
        namePrefix="appointment-date"
      />
    </form>
  ),
};
