import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { ProgressIndicator } from './ProgressIndicator';

const progressIndicatorUsageExample = `import { ProgressIndicator } from '@ourfuturehealth/react-components';

<ProgressIndicator
  currentStep={2}
  totalSteps={8}
  label="Personal details"
  helperText="About 5 minutes left"
  showBars={true}
/>;
`;

const meta: Meta<typeof ProgressIndicator> = {
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use ProgressIndicator to show users how far through a multi-step process they are.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass the total number of steps in the process as{' '}
            <code>totalSteps</code>, and the step the user is currently on as{' '}
            <code>currentStep</code>. The component shows a{' '}
            <code>Page {'{currentStep}'} of {'{totalSteps}'}</code> count on
            the right of the header.
          </p>
          <p>
            Use the optional <code>label</code> prop to show text on the left
            of the header, and <code>helperText</code> to show supporting text
            below the track. Set <code>showBars</code> to <code>false</code> to
            remove the gaps between segments.
          </p>
          <Source code={progressIndicatorUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'totalSteps',
              'currentStep',
              'label',
              'helperText',
              'showBars',
              'className',
            ]}
          />

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    totalSteps: {
      control: { type: 'number', min: 1 },
      description: 'The total number of steps in the process.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    currentStep: {
      control: { type: 'number', min: 0 },
      description: 'The current step number, between 0 and `totalSteps`.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    label: {
      control: 'text',
      description:
        'Optional text shown on the left of the header, above the track.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    helperText: {
      control: 'text',
      description: 'Optional supporting text shown below the track.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    showBars: {
      control: 'boolean',
      description: 'Whether to show gaps between progress segments.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    className: {
      control: 'text',
      description: 'Additional classes added alongside the toolkit classes.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
  },
  args: {
    currentStep: 2,
    totalSteps: 8,
    label: 'Personal details',
    helperText: 'About 5 minutes left',
    showBars: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic progress indicator bar example showing page 2 of 8.',
      },
    },
  },
  render: () => (
    <ProgressIndicator
      currentStep={2}
      totalSteps={8}
      label="Personal details"
      helperText="About 5 minutes left"
    />
  ),
};

export const Builder: Story = {
  args: {
    currentStep: 2,
    totalSteps: 8,
    label: 'Personal details',
    helperText: 'About 5 minutes left',
    showBars: true,
  },
  parameters: {
    controls: {
      include: ['totalSteps', 'currentStep', 'label', 'helperText', 'showBars'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the ProgressIndicator API interactively.',
      },
    },
  },
};

export const WithoutBars: Story = {
  render: () => (
    <ProgressIndicator
      currentStep={2}
      totalSteps={8}
      label="Personal details"
      helperText="About 5 minutes left"
      showBars={false}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Set `showBars` to `false` to remove the gaps between progress segments.',
      },
    },
  },
};

export const WithoutLabelOrHelperText: Story = {
  render: () => <ProgressIndicator currentStep={3} totalSteps={4} />,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Both `label` and `helperText` are optional. Omit them to show only the page count and track.',
      },
    },
  },
};

