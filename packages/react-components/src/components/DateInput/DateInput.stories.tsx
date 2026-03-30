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
          'A grouped date input that reuses the toolkit fieldset, hint, error, and shared input-family box styles for day, month, and year fields. Use the default item set for standard day, month, and year fields, or pass `items` to customise labels, widths, and native input props through `inputProps`.',
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
      description: 'Question shown as the fieldset legend for the grouped date fields.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the date fields. When present, the fieldset is linked with `aria-describedby`.',
    },
    id: {
      control: 'text',
      description: 'Base ID used for the group and for generated child field IDs.',
    },
    namePrefix: {
      control: 'text',
      description: 'Prefix applied to each child input name, such as `date-of-birth-day` and `date-of-birth-month`.',
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend content in an `h1` when this question is also the page heading.',
    },
    items: {
      control: false,
      description: 'Date field items rendered inside the group. Each item can override the label, width classes, autocomplete, pattern, and additional native input props.',
      table: {
        type: {
          summary: 'DateInputItem[]',
          detail:
            "{ name: string; label?: ReactNode; className?: string; autoComplete?: string; inputMode?: string; pattern?: string; inputProps?: InputHTMLAttributes<HTMLInputElement> }[]",
        },
      },
    },
    className: {
      control: false,
      description: 'Additional classes for the date-input grid wrapper.',
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
    fieldsetClassName: {
      control: false,
      description: 'Additional classes for the fieldset element.',
      table: {
        category: 'Advanced',
      },
    },
    legendClassName: {
      control: false,
      description: 'Additional classes for the legend element.',
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
  parameters: {
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the date question should also be announced as the page heading.',
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Example of date inputs used in a form, including a whole-group error and a field-level error state.',
      },
    },
  },
};
