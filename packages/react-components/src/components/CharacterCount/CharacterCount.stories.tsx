import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharacterCount } from './CharacterCount';

const meta: Meta<typeof CharacterCount> = {
  title: 'Components/Input/Character count',
  component: CharacterCount,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A textarea with live character or word count messaging that follows the toolkit character-count pattern and shared input-family styling. Use `maxLength` for character counts or `maxWords` for word counts; only one limit mode should be active at a time.',
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
      description: 'Question or field label shown above the textarea.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above the count message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the textarea. This is separate from the automatic over-limit count status.',
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
    },
    maxLength: {
      control: 'number',
      description: 'Character limit before the count message switches to an over-limit state.',
    },
    maxWords: {
      control: 'number',
      description: 'Word limit when using word-count mode instead of character-count mode.',
    },
    threshold: {
      control: 'number',
      description: 'Percentage of the limit at which the visible status message appears.',
    },
    rows: {
      control: 'number',
      description: 'Visible row count for the underlying textarea.',
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
    },
    countMessageClassName: {
      control: false,
      description: 'Additional classes for the count message elements.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description: 'Additional classes for the underlying textarea element.',
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
    hint: 'Do not include personal details.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default character-count textarea with the visible count message shown from the start.',
      },
    },
  },
};

export const WithThreshold: Story = {
  args: {
    hint: 'Do not include personal details.',
    threshold: 75,
  },
  parameters: {
    docs: {
      description: {
        story: 'The visible count message stays hidden until the user reaches 75% of the limit.',
      },
    },
  },
};

export const WordCount: Story = {
  args: {
    hint: 'Write a short summary in no more than 50 words.',
    maxLength: undefined,
    maxWords: 50,
  },
  parameters: {
    docs: {
      description: {
        story: 'Switches the component from character counting to word counting.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    defaultValue:
      'This starting value is intentionally long so the component opens in an over-limit state.',
    errorMessage: 'Summary must be 40 characters or less',
    maxLength: 40,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of an explicit validation error alongside the automatic over-limit state.',
      },
    },
  },
};
