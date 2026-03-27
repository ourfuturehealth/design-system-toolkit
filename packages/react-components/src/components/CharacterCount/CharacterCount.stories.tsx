import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterCount } from './CharacterCount';

const meta: Meta<typeof CharacterCount> = {
  title: 'Components/Input/Character count',
  component: CharacterCount,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A textarea with live character or word count messaging that follows the toolkit character-count pattern and shared input-family styling.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Summary',
    maxLength: 200,
    name: 'summary',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label content for the textarea.',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text shown above the textarea.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional validation message shown above the textarea.',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed before the count goes over limit.',
    },
    maxWords: {
      control: 'number',
      description: 'Maximum number of words allowed when using word-count mode.',
    },
    threshold: {
      control: 'number',
      description: 'Percentage of the limit at which the visible status message appears.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Do not include personal details.',
  },
};

export const WithThreshold: Story = {
  args: {
    hint: 'Do not include personal details.',
    threshold: 75,
  },
};

export const WordCount: Story = {
  args: {
    hint: 'Write a short summary in no more than 50 words.',
    maxLength: undefined,
    maxWords: 50,
  },
};

export const WithError: Story = {
  args: {
    defaultValue:
      'This starting value is intentionally long so the component opens in an over-limit state.',
    errorMessage: 'Summary must be 40 characters or less',
    maxLength: 40,
  },
};
