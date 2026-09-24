import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { ProgressIndicator } from './ProgressIndicator';

const progressIndicatorUsageExample = `import { ProgressIndicator } from '@ourfuturehealth/react-components';

<ProgressIndicator
  progressState={25}
  totalSegments={8}
  subSegmentProgress={0}
  label="Personal details"
  progressText="Page 2 of 8"
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
            Pass the overall percentage from 1 to 100 through <code>progressState</code>{' '}
            and set the fixed number of segments with{' '}
            <code>totalSegments</code>. Full and partial segment fills are derived
            from that percentage; leave <code>subSegmentProgress</code> at 0
            when the percentage already includes all progress.
          </p>
          <p>
            Both React and the toolkit Nunjucks macro clamp <code>progressState</code>{' '}
            to 1 through 100. The optional <code>subSegmentProgress</code> is
            additional progress as a percentage of one segment, clamped between
            0 and 100. The overall percentage is{' '}
            <code>min(progressState + subSegmentProgress / segmentCount, 100)</code>{' '}
            after clamping inputs and normalizing the segment count. Both the
            visible fill and numeric ARIA value use this total. For example, 25% over
            eight segments plus a 50% segment adds up to 31.25%.
          </p>
          <p>
            Pass a plain-text string to the optional <code>label</code> prop to show text on the left
            of the header, <code>progressText</code> for free-form text on the
            right, and <code>helperText</code> to show supporting text below
            the track. Set <code>showBars</code> to <code>false</code> to remove
            the gaps between segments.
          </p>
          <p>
            Keep free-form <code>progressText</code> consistent with the overall
            progress. Non-empty strings provide <code>aria-valuetext</code>,
            such as "Page 2 of 8". Missing, empty, whitespace-only, or non-string
            values fall back to the calculated percentage. Numeric{' '}
            <code>aria-valuenow</code> always uses overall progress.
          </p>
          <p>
            Both packages expose one progress bar named by <code>label</code>,
            falling back to "Progress" when the label is missing or blank.
            The visual header and segments are hidden from the accessibility tree
            to avoid duplicate announcements. For example, the name, role, and
            value are "Personal details", "progress bar", and "Page 2 of 8".
            Helper text remains separately readable. Exact speech depends on the
            screen reader and its navigation mode.
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
              'progressState',
              'totalSegments',
              'subSegmentProgress',
              'label',
              'progressText',
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
    progressState: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Base progress percentage, clamped between 1 and 100. With subSegmentProgress at 0, this is the overall percentage used for visual fill and the numeric ARIA value.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    totalSegments: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Fixed number of segments rendered in the progress track.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    subSegmentProgress: {
      control: { type: 'number', min: 0, max: 100 },
      description:
        'Additional progress as a percentage of one segment, clamped between 0 and 100. Adds subSegmentProgress / segmentCount to the base percentage, capped at 100 overall.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    label: {
      control: 'text',
      type: 'string',
      description:
        'Optional plain-text string shown on the left and used as the accessible name. Missing or blank labels use Progress as the accessible name. JSX is not supported.',
      table: {
        category: 'ProgressIndicatorProps',
      },
    },
    progressText: {
      control: 'text',
      description: 'Optional text shown on the right. Non-empty strings also provide aria-valuetext; blank or non-string values fall back to the overall percentage. Numeric progress is unchanged.',
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
    progressState: 25,
    totalSegments: 8,
    subSegmentProgress: 0,
    label: 'Personal details',
    progressText: 'Page 2 of 8',
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
      progressState={25}
      totalSegments={8}
      subSegmentProgress={0}
      label="Personal details"
      progressText="Page 2 of 8"
    />
  ),
};

export const Builder: Story = {
  args: {
    progressState: 25,
    totalSegments: 8,
    subSegmentProgress: 0,
    label: 'Personal details',
    progressText: 'Page 2 of 8',
    helperText: 'About 5 minutes left',
    showBars: true,
  },
  parameters: {
    controls: {
      include: [
        'progressState',
        'totalSegments',
        'subSegmentProgress',
        'label',
        'progressText',
        'helperText',
        'showBars',
        'classes',
        'className',
      ],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the ProgressIndicator API interactively.',
      },
    },
  },
};

export const MinimumProgress: Story = {
  args: {
    progressState: 1,
    totalSegments: 8,
    subSegmentProgress: 0,
    progressText: '1%',
  },
  parameters: {
    docs: {
      description: {
        story: 'The minimum progress state is 1%. Lower values are clamped to 1%.',
      },
    },
  },
};

export const PartialProgress: Story = {
  args: {
    progressState: 25,
    totalSegments: 8,
    subSegmentProgress: 50,
    progressText: '31.25%',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Two full segments and half of the third represent 31.25% overall. The visual fill and ARIA values agree. Passing progressState={31.25} with no subSegmentProgress produces the same result.',
      },
    },
  },
};

export const LongLabel: Story = {
  args: {
    progressState: (11 * 100) / 12,
    totalSegments: 12,
    subSegmentProgress: 0,
    label: 'Tell us about your current medical conditions so we can help diagnose it better',
    progressText: 'Page 11 of 12',
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
      progressState={25}
      totalSegments={8}
      label="Personal details"
      progressText="Page 2 of 8"
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
  render: () => <ProgressIndicator progressState={75} totalSegments={4} />,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'The header and helper text are optional. Omit them to show only the progress track.',
      },
    },
  },
};

