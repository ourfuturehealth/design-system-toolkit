import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { CharacterCount } from './CharacterCount';

const characterCountUsageExample = `import { CharacterCount } from '@ourfuturehealth/react-components';

<CharacterCount
  hint="Do not include personal details."
  label="Summary"
  maxLength={200}
  name="summary"
/>;
`;

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
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>CharacterCount</code> when you need a textarea with a
            live count message. Pass a required <code>label</code> and{' '}
            <code>name</code>, then choose either <code>maxLength</code> for a
            character limit or <code>maxWords</code> for a word limit.
          </p>
          <p>
            Use <code>threshold</code> when you want the visible status message
            to stay hidden until the user gets close to the limit, and use{' '}
            <code>rows</code> to control the initial textarea height.
          </p>
          <Source code={characterCountUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'label',
              'hint',
              'errorMessage',
              'name',
              'maxLength',
              'maxWords',
              'threshold',
              'rows',
              'describedBy',
            ]}
          />

          <Stories title="Examples" />
        </>
      ),
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
      table: {
        category: 'CharacterCountProps',
      },
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above the count message.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    errorMessage: {
      control: 'text',
      description:
        'Validation message shown above the textarea. This is separate from the automatic over-limit count status.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    maxLength: {
      control: 'number',
      description: 'Character limit before the count message switches to an over-limit state.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    maxWords: {
      control: 'number',
      description: 'Word limit when using word-count mode instead of character-count mode.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    threshold: {
      control: 'number',
      description: 'Percentage of the limit at which the visible status message appears.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    rows: {
      control: 'number',
      description: 'Visible row count for the underlying textarea.',
      table: {
        category: 'CharacterCountProps',
      },
    },
    describedBy: {
      control: 'text',
      description:
        'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'CharacterCountProps',
      },
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Default character-count textarea with the visible count message shown from the start.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    describedBy: '',
    errorMessage: '',
    hint: 'Do not include personal details.',
    label: 'Summary',
    maxLength: 200,
    maxWords: undefined,
    name: 'summary',
    rows: 5,
    threshold: 0,
  },
  parameters: {
    controls: {
      include: [
        'label',
        'hint',
        'errorMessage',
        'name',
        'maxLength',
        'maxWords',
        'threshold',
        'rows',
        'describedBy',
      ],
    },
    docs: {
      description: {
        story:
          'Interactive character-count example. Adjust the real props to see how the counter changes with character or word limits.',
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'The visible count message stays hidden until the user reaches 75% of the limit.',
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Example of an explicit validation error alongside the automatic over-limit state.',
      },
    },
  },
};
