import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput';
import { Checkboxes } from './Checkboxes';

const items = [
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'phone',
    label: 'Phone',
    conditional: (
      <TextInput
        hint="We will only use this if we need to contact you urgently."
        inputWidth={20}
        label="Phone number"
      />
    ),
  },
  { divider: 'or' as const },
  {
    value: 'none',
    label: 'No, I do not want to be contacted',
    exclusive: true,
    exclusiveGroup: 'contact',
  },
];

const meta: Meta<typeof Checkboxes> = {
  title: 'Components/Checkboxes',
  component: Checkboxes,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A checkbox group that reuses the toolkit fieldset, input-family supporting text, updated 48px controllers, and conditional reveal patterns.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items: [
      { value: 'email', label: 'Email', exclusiveGroup: 'contact' },
      { value: 'phone', label: 'Phone', exclusiveGroup: 'contact' },
      { divider: 'or' as const },
      {
        value: 'none',
        label: 'No, I do not want to be contacted',
        exclusive: true,
        exclusiveGroup: 'contact',
      },
    ],
    legend: 'How should we contact you?',
    name: 'contact-method',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'Legend content for the checkbox group.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional validation message shown above the checkbox items.',
    },
    items: {
      control: false,
      description: 'Checkbox items rendered within the group.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Select all contact methods that apply.',
  },
};

export const WithItemHints: Story = {
  args: {
    hint: 'Select all contact methods that apply.',
    items: [
      {
        value: 'email',
        label: 'Email',
        hint: 'We will send updates by email.',
      },
      {
        value: 'phone',
        label: 'Phone',
        hint: 'We will only call if we need to contact you urgently.',
      },
      {
        value: 'text',
        label: 'Text message',
        hint: 'We will only use this for short updates.',
      },
    ],
  },
};

export const ConditionalContent: Story = {
  args: {
    hint: 'Select all contact methods that apply.',
    items,
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select at least one contact method',
    hint: 'Select all contact methods that apply.',
  },
};
