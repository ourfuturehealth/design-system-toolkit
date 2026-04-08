import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './Autocomplete';

const options = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Input/Autocomplete',
  component: Autocomplete,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'An input with inline suggestions that reuses the toolkit autocomplete classes, shared input-family label treatment, and suggestions list styling. The component manages the suggestion menu internally and supports both controlled and uncontrolled input values.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Country',
    name: 'country',
    options,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Question or field label shown above the autocomplete input.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the input. When present, the input is marked invalid and linked with `aria-describedby`.',
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
    },
    options: {
      control: 'object',
      description: 'Plain-text options used to build the suggestions list. Edit this as a simple array of strings.',
      table: {
        type: {
          summary: 'string[]',
        },
      },
    },
    noResultsText: {
      control: 'text',
      description: 'Override for the no-results message shown when the query matches no suggestions.',
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
      description: 'Responsive width utility for the autocomplete field, including its suggestions dropdown.',
    },
    inputWidth: {
      control: 'select',
      options: [2, 3, 4, 5, 10, 20, 30],
      description: 'Fixed character-width modifier that helps signal the expected answer length and also constrains the suggestions dropdown width.',
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
    },
    onOptionSelect: {
      control: false,
      description: 'Called when the user picks an option from the suggestions list.',
      table: {
        category: 'Advanced',
      },
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
    hint: 'Start typing to filter the list.',
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select a country from the list or enter a new one.',
    hint: 'Start typing to filter the list.',
  },
};

export const FixedWidth: Story = {
  args: {
    hint: 'Start typing to filter the list.',
    inputWidth: 20,
  },
};

export const CustomNoResultsText: Story = {
  args: {
    hint: 'Start typing to filter the list.',
    noResultsText: 'No matching countries. Enter a new country instead.',
  },
};
