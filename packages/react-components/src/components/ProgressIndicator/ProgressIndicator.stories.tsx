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
            For a page-based journey, pass <code>currentStep</code> and{' '}
            <code>totalSteps</code>. For example, 11 and 12 generate "Page 11 of 12",
            11 filled segments, and an ARIA value of 11 out of 12. No percentage
            calculation or separate page text is needed.
          </p>
          <p>
            Both React and Nunjucks require these two step inputs. The total
            is rounded with a minimum of 1, and the current step is clamped
            between 1 and that total. Page text and the numeric accessible value
            are always generated from the step values.
          </p>
          <p>
            <code>subSegmentProgress</code> adds a fraction of one step. It is
            clamped between 0 and 100 and defaults to 0. Overall progress is
            capped at the total. Step 2 of 8 plus 50 represents 2.5 steps:
            the header shows "Page 3 of 8" and the numeric accessible value is
            2.5 on the 1-to-8 scale.
          </p>
          <p>
            Pass a plain-text string to the optional <code>label</code> prop to show text on the left
            of the header, and <code>helperText</code> to show supporting text below
            the track. Set <code>showBars</code> to <code>false</code> to remove
            the gaps between segments.
          </p>
          <p>
            Both packages expose one progress bar with the label followed by the
            generated page text in its accessible name, for example
            "Personal details, Page 2 of 8". A missing or blank label uses "Progress".
            The visual header and segments are hidden from the accessibility tree
            to avoid duplicate announcements. There is no separate{' '}
            <code>aria-valuetext</code> that VoiceOver could announce before the
            label; the native numeric value remains available. Helper text comes
            after the progress bar. Exact speech depends on the screen reader
            and its navigation mode.
          </p>
          <p>
            Use <code>classes</code>, <code>className</code>, or both to add
            classes to the root element. Both props are merged with the toolkit
            classes.
          </p>
          <Source code={progressIndicatorUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'currentStep',
              'totalSteps',
              'subSegmentProgress',
              'label',
              'helperText',
              'showBars',
              'classes',
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
    currentStep: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Required current step, clamped between 1 and totalSteps. Generates page text, visual fill, and ARIA values together with totalSteps.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    totalSteps: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Required number of steps, rounded to an integer with a minimum of 1.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    subSegmentProgress: {
      control: { type: 'number', min: 0, max: 100 },
      description:
        'Additional progress as a percentage of one segment, clamped between 0 and 100. Adds subSegmentProgress / 100 to the current step, capped at totalSteps.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    label: {
      control: 'text',
      type: 'string',
      description:
        'Optional plain-text label shown on the left and placed before the generated page text in the accessible name. Missing or blank labels use Progress. JSX is not supported.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    helperText: {
      control: 'text',
      description: 'Optional supporting text shown below the track and read separately from the progress bar.',
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
    classes: {
      control: 'text',
      description:
        'Toolkit-parity alias for adding extra classes to the root element. Merged with className.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    className: {
      control: 'text',
      description: 'Additional classes added to the root element. Merged with classes.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
  },
  args: {
    subSegmentProgress: 0,
    label: 'Personal details',
    helperText: 'About 5 minutes left',
    showBars: true,
    classes: '',
    className: '',
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
    />
  ),
};

export const Builder: Story = {
  args: {
    currentStep: 2,
    totalSteps: 8,
    subSegmentProgress: 0,
    label: 'Personal details',
    helperText: 'About 5 minutes left',
    showBars: true,
  },
  parameters: {
    controls: {
      include: [
        'currentStep',
        'totalSteps',
        'subSegmentProgress',
        'label',
        'helperText',
        'showBars',
        'classes',
        'className',
      ],
    },
    docs: {
      description: {
        story:
          'Change currentStep and totalSteps to update the generated page text, visual progress, and ARIA values together.',
      },
    },
  },
};

export const MinimumProgress: Story = {
  args: {
    currentStep: 1,
    totalSteps: 8,
    subSegmentProgress: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'The minimum current step is 1. Lower values are clamped to the first step.',
      },
    },
  },
};

export const PartialProgress: Story = {
  args: {
    currentStep: 2,
    totalSteps: 8,
    subSegmentProgress: 50,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Two full segments and half of the third represent 2.5 of 8 steps complete. The generated page text is Page 3 of 8 and the ARIA value includes the partial step.',
      },
    },
  },
};

export const LongLabel: Story = {
  args: {
    currentStep: 11,
    totalSteps: 12,
    subSegmentProgress: 0,
    label: 'Tell us about your current medical conditions so we can help diagnose it better',
    helperText: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A long label at page 11 of 12 for responsive QA. Use the mobile, tablet, and desktop viewport presets to check that the label wraps while the page count stays on one line.',
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
          'The label and helper text are optional. The generated page count remains visible when both are omitted.',
      },
    },
  },
};

