import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput';
import { Radios } from './Radios';

const meta: Meta<typeof Radios> = {
  title: 'Components/Radios',
  component: Radios,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A radio group that reuses the toolkit fieldset, input-family supporting text, updated 48px controllers, and conditional reveal patterns.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { divider: 'or' as const },
      { value: 'post', label: 'Post' },
    ],
    legend: 'How should we contact you?',
    name: 'contact-method',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'Legend content for the radio group.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional validation message shown above the radio items.',
    },
    items: {
      control: false,
      description: 'Radio items rendered within the group.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
  },
};

export const WithItemHints: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
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
        value: 'post',
        label: 'Post',
        hint: 'Choose this if you prefer printed letters.',
      },
    ],
  },
};

export const ConditionalContent: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
    items: [
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
        value: 'post',
        label: 'Post',
      },
    ],
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select how we should contact you',
    hint: 'Choose one way for us to contact you.',
  },
};
