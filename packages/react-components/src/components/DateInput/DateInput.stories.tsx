import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { DateInput, type DateInputProps } from './DateInput';

type DateInputStoryArgs = DateInputProps & {
  itemSet?: 'default' | 'browser-autocomplete' | 'errors' | 'single-field-error' | 'page-heading';
};

const defaultItems: NonNullable<DateInputStoryArgs['items']> = [
  {
    name: 'day',
    inputWidth: 2,
  },
  {
    name: 'month',
    inputWidth: 2,
  },
  {
    name: 'year',
    inputWidth: 4,
  },
];

const browserAutocompleteItems: NonNullable<DateInputStoryArgs['items']> = [
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
];

const errorItems: NonNullable<DateInputStoryArgs['items']> = [
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
];

const singleFieldErrorItems: NonNullable<DateInputStoryArgs['items']> = [
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
];

const pageHeadingItems: NonNullable<DateInputStoryArgs['items']> = defaultItems;

const dateInputItemSets: Record<
  NonNullable<DateInputStoryArgs['itemSet']>,
  NonNullable<DateInputStoryArgs['items']>
> = {
  default: defaultItems,
  'browser-autocomplete': browserAutocompleteItems,
  errors: errorItems,
  'single-field-error': singleFieldErrorItems,
  'page-heading': pageHeadingItems,
};

const dateInputUsageExample = `import { DateInput } from '@ourfuturehealth/react-components';

const items = [
  { name: 'day', inputWidth: 2 },
  { name: 'month', inputWidth: 2 },
  { name: 'year', inputWidth: 4 },
];

<DateInput
  hint="For example, 31 3 1980"
  id="date-of-birth"
  items={items}
  legend="What is your date of birth?"
  namePrefix="date-of-birth"
/>;
`;

const dateInputItemsShapeExample = `type DateInputItem = {
  name: string;
  label?: React.ReactNode;
  inputWidth?: 2 | 3 | 4 | 5 | 10 | 20 | 30;
  hasError?: boolean;
  autoComplete?: string;
  inputMode?: string;
  pattern?: string;
  defaultValue?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};
`;

const renderDateInputBuilderStory = ({
  itemSet,
  ...args
}: DateInputStoryArgs) => {
  const items = itemSet ? dateInputItemSets[itemSet] : args.items ?? defaultItems;
  const resolvedArgs = {
    ...args,
    describedBy: args.describedBy || undefined,
    errorMessage: args.errorMessage || undefined,
    hint: args.hint || undefined,
  };

  return (
    <DateInput
      {...resolvedArgs}
      items={items}
    />
  );
};

const meta: Meta<DateInputStoryArgs> = {
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
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>legend</code>, <code>id</code>, and{' '}
            <code>namePrefix</code>. The component renders a grouped day, month,
            and year input by default.
          </p>
          <p>
            Pass a custom <code>items</code> array only when you need to change
            one of the child fields, for example to add browser autocomplete
            tokens, per-field error styling, or a different input width.
          </p>
          <Source code={dateInputUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'legend',
              'hint',
              'errorMessage',
              'id',
              'namePrefix',
              'describedBy',
              'isPageHeading',
              'items',
            ]}
          />

          <h2>
            <code>items</code> shape
          </h2>
          <p>
            Each entry in the optional <code>items</code> array follows this
            shape:
          </p>
          <Source code={dateInputItemsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>itemSet</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can switch between realistic date
            input presets without editing the real <code>items</code> prop. It
            is not a React prop accepted by <code>DateInput</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    id: 'date-of-birth',
    legend: 'What is your date of birth?',
    namePrefix: 'date-of-birth',
  },
  argTypes: {
    itemSet: {
      control: 'select',
      options: ['default', 'browser-autocomplete', 'errors', 'single-field-error', 'page-heading'],
      description:
        'Builder-only Storybook helper. Switches between the default, autocomplete, error, and page-heading date presets.',
      table: {
        category: 'Builder story only',
      },
    },
    legend: {
      control: 'text',
      description: 'Question shown as the fieldset legend for the grouped date fields.',
      table: {
        category: 'DateInputProps',
      },
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend and above any error message.',
      table: {
        category: 'DateInputProps',
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the date fields. When present, the fieldset is linked with `aria-describedby`.',
      table: {
        category: 'DateInputProps',
      },
    },
    id: {
      control: 'text',
      description: 'Base ID used for the group and for generated child field IDs.',
      table: {
        category: 'DateInputProps',
      },
    },
    namePrefix: {
      control: 'text',
      description: 'Prefix applied to each child input name, such as `date-of-birth-day` and `date-of-birth-month`.',
      table: {
        category: 'DateInputProps',
      },
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'DateInputProps',
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend content in an `h1` when this question is also the page heading.',
      table: {
        category: 'DateInputProps',
      },
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
        category: 'DateInputProps',
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
  render: renderDateInputBuilderStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-default',
    items: defaultItems,
    namePrefix: 'date-of-birth-default',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Default date input for a standard date-of-birth question with the built-in day, month, and year fields.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    describedBy: '',
    errorMessage: '',
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-builder',
    isPageHeading: false,
    itemSet: 'default',
    legend: 'What is your date of birth?',
    namePrefix: 'date-of-birth-builder',
  },
  parameters: {
    controls: {
      include: ['itemSet', 'legend', 'hint', 'errorMessage', 'id', 'namePrefix', 'isPageHeading'],
    },
    docs: {
      description: {
        story:
          'Interactive date input example. Switch between the preset field configurations and adjust the real props without editing raw JSON.',
      },
    },
  },
};

export const WithBrowserAutocomplete: Story = {
  args: {
    hint: 'For example, 31 3 1980',
    id: 'date-of-birth-browser-autocomplete',
    items: browserAutocompleteItems,
    namePrefix: 'date-of-birth-browser-autocomplete',
  },
  parameters: {
    controls: {
      disable: true,
    },
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
    items: errorItems,
    namePrefix: 'date-of-birth-errors',
  },
  parameters: {
    controls: {
      disable: true,
    },
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
    items: singleFieldErrorItems,
    namePrefix: 'date-of-birth-single-field-error',
  },
  parameters: {
    controls: {
      disable: true,
    },
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
    items: pageHeadingItems,
    namePrefix: 'date-of-birth-page-heading',
  },
  parameters: {
    controls: {
      disable: true,
    },
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
