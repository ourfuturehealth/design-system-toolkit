import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'Components/Input/Date input',
  component: DateInput,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A grouped date input for day, month, and year fields. Use the default setup for a standard date-of-birth style question. Pass `items` only when you need to customise an individual field label, width, autocomplete token, or native input props.',
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
      description:
        'Optional custom field definitions. Use this when you need to change a field label, width, autocomplete token, per-field error styling, or pass native input props.',
      table: {
        type: {
          summary: 'DateInputItem[]',
          detail:
            "{ name: string; label?: ReactNode; inputWidth?: 2 | 3 | 4 | 5 | 10 | 20 | 30; hasError?: boolean; autoComplete?: string; inputMode?: string; pattern?: string; defaultValue?: string; inputProps?: InputHTMLAttributes<HTMLInputElement>; className?: string }[]",
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
    id: 'date-of-birth-default',
    namePrefix: 'date-of-birth-default',
  },
};

export const WithBrowserAutocomplete: Story = {
  args: {
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-browser-autocomplete',
    items: [
      {
        name: 'day',
        inputWidth: 2,
        autoComplete: 'bday-day',
      },
      {
        name: 'month',
        inputWidth: 2,
        autoComplete: 'bday-month',
      },
      {
        name: 'year',
        inputWidth: 4,
        autoComplete: 'bday-year',
      },
    ],
    namePrefix: 'date-of-birth-browser-autocomplete',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Adds browser autocomplete tokens for day, month, and year so saved birth date details can be offered by the browser. The visible UI stays the same; the difference is in the generated input `autocomplete` attributes.',
      },
    },
  },
};

export const WithErrors: Story = {
  args: {
    errorMessage: 'Enter your date of birth',
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-errors',
    items: [
      {
        name: 'day',
        inputWidth: 2,
        hasError: true,
      },
      {
        name: 'month',
        inputWidth: 2,
        hasError: true,
      },
      {
        name: 'year',
        inputWidth: 4,
        hasError: true,
      },
    ],
    namePrefix: 'date-of-birth-errors',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Apply `errorMessage` for the group-level validation message and `hasError` on each item when every field should show the red error styling.',
      },
    },
  },
};

export const SingleFieldError: Story = {
  args: {
    errorMessage: 'Enter your date of birth',
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-single-field-error',
    items: [
      {
        name: 'day',
        inputWidth: 2,
        hasError: true,
      },
      {
        name: 'month',
        inputWidth: 2,
      },
      {
        name: 'year',
        inputWidth: 4,
      },
    ],
    namePrefix: 'date-of-birth-single-field-error',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `hasError` on a single item when only one part of the date is invalid.',
      },
    },
  },
};

export const AsPageHeading: Story = {
  args: {
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-page-heading',
    isPageHeading: true,
    namePrefix: 'date-of-birth-page-heading',
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
            inputWidth: 2,
            hasError: true,
          },
          {
            name: 'month',
            inputWidth: 2,
          },
          {
            name: 'year',
            inputWidth: 4,
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
