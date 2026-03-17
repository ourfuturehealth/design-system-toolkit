import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './Autocomplete';

const options = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An input with inline suggestions that reuses the toolkit autocomplete classes, shared input-family label treatment, and suggestions list styling.',
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
      description: 'Visible label content for the autocomplete input.',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text shown below the label.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional error message shown above the input.',
    },
    options: {
      control: false,
      description: 'String options used to build the suggestions list.',
    },
    noResultsText: {
      control: 'text',
      description: 'Custom text shown when the query matches no suggestions.',
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
