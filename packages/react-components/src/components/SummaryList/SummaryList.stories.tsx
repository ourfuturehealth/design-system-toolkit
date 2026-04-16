import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { SummaryList } from './SummaryList';

type SummaryListStoryArgs = ComponentProps<typeof SummaryList> & {
  showActions?: boolean;
};

const defaultRows = [
  {
    key: { text: 'Name' },
    value: { text: 'Sarah Philips' },
    actions: {
      items: [
        {
          href: '#name',
          text: 'Change',
          visuallyHiddenText: 'name',
        },
      ],
    },
  },
  {
    key: { text: 'Date of birth' },
    value: { text: '5 January 1978' },
    actions: {
      items: [
        {
          href: '#date-of-birth',
          text: 'Change',
          visuallyHiddenText: 'date of birth',
        },
      ],
    },
  },
  {
    key: { text: 'Contact details' },
    value: {
      html: '<p>07700 900457</p><p>sarah.phillips@example.com</p>',
    },
  },
];

const rowsWithoutActions = defaultRows.map((row) => {
  const nextRow = { ...row };
  delete nextRow.actions;
  return nextRow;
});

const defaultSummaryListCode = `import { SummaryList } from '@ourfuturehealth/react-components';

const defaultRows = [
  {
    key: { text: 'Name' },
    value: { text: 'Sarah Philips' },
    actions: {
      items: [
        {
          href: '#name',
          text: 'Change',
          visuallyHiddenText: 'name',
        },
      ],
    },
  },
  {
    key: { text: 'Date of birth' },
    value: { text: '5 January 1978' },
    actions: {
      items: [
        {
          href: '#date-of-birth',
          text: 'Change',
          visuallyHiddenText: 'date of birth',
        },
      ],
    },
  },
  {
    key: { text: 'Contact details' },
    value: {
      html: '<p>07700 900457</p><p>sarah.phillips@example.com</p>',
    },
  },
];

<SummaryList rows={defaultRows} padded />;
`;

const compactSummaryListCode = `import { SummaryList } from '@ourfuturehealth/react-components';

const defaultRows = [
  {
    key: { text: 'Name' },
    value: { text: 'Sarah Philips' },
    actions: {
      items: [
        {
          href: '#name',
          text: 'Change',
          visuallyHiddenText: 'name',
        },
      ],
    },
  },
  {
    key: { text: 'Date of birth' },
    value: { text: '5 January 1978' },
    actions: {
      items: [
        {
          href: '#date-of-birth',
          text: 'Change',
          visuallyHiddenText: 'date of birth',
        },
      ],
    },
  },
  {
    key: { text: 'Contact details' },
    value: {
      html: '<p>07700 900457</p><p>sarah.phillips@example.com</p>',
    },
  },
];

<SummaryList rows={defaultRows} padded={false} />;
`;

const withoutActionsSummaryListCode = `import { SummaryList } from '@ourfuturehealth/react-components';

const rowsWithoutActions = [
  {
    key: { text: 'Name' },
    value: { text: 'Sarah Philips' },
  },
  {
    key: { text: 'Date of birth' },
    value: { text: '5 January 1978' },
  },
  {
    key: { text: 'Contact details' },
    value: {
      html: '<p>07700 900457</p><p>sarah.phillips@example.com</p>',
    },
  },
];

<SummaryList rows={rowsWithoutActions} padded />;
`;

const withoutBorderSummaryListCode = `import { SummaryList } from '@ourfuturehealth/react-components';

const defaultRows = [
  {
    key: { text: 'Name' },
    value: { text: 'Sarah Philips' },
    actions: {
      items: [
        {
          href: '#name',
          text: 'Change',
          visuallyHiddenText: 'name',
        },
      ],
    },
  },
  {
    key: { text: 'Date of birth' },
    value: { text: '5 January 1978' },
    actions: {
      items: [
        {
          href: '#date-of-birth',
          text: 'Change',
          visuallyHiddenText: 'date of birth',
        },
      ],
    },
  },
  {
    key: { text: 'Contact details' },
    value: {
      html: '<p>07700 900457</p><p>sarah.phillips@example.com</p>',
    },
  },
];

<SummaryList rows={defaultRows} padded={false} noBorder />;
`;

const summaryListUsageExample = `import { SummaryList } from '@ourfuturehealth/react-components';

const rows = [
  {
    key: { text: 'Name' },
    value: { text: 'Sarah Philips' },
    actions: {
      items: [
        {
          href: '#name',
          text: 'Change',
          visuallyHiddenText: 'name',
        },
      ],
    },
  },
  {
    key: { text: 'Date of birth' },
    value: { text: '5 January 1978' },
  },
];

<SummaryList rows={rows} padded />;
`;

const summaryListRowsShapeExample = `type SummaryListRow = {
  key: { text?: string; html?: string };
  value: { text?: string; html?: string };
  actions?: {
    items: Array<{
      href: string;
      text: string;
      visuallyHiddenText?: string;
    }>;
  };
};
`;

const meta: Meta<SummaryListStoryArgs> = {
  title: 'Components/Summary list',
  component: SummaryList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Summary List to show key-value pairs such as review answers. The React API is intentionally small: `rows` defines the content, `padded` switches between the roomier and denser layouts, and `noBorder` removes the separators between rows. `classes`, `className`, `attributes`, and `ref` are integration props rather than the main consumer API. The Builder story uses a Storybook-only `showActions` helper so you can flip row actions on and off without editing raw JSON.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>SummaryList</code> to show key-value answers such as
            review information before submission. Pass the content through the{' '}
            <code>rows</code> array, then use <code>padded</code> and{' '}
            <code>noBorder</code> to switch between the published layout
            variants.
          </p>
          <p>
            Add row <code>actions</code> only when users need a clear way to
            change an answer. Use HTML values sparingly when the value cell
            needs richer markup such as stacked contact details.
          </p>
          <Source code={summaryListUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={SummaryList}
            include={['rows', 'padded', 'noBorder', 'classes', 'className', 'attributes']}
          />

          <h2>
            <code>rows</code> shape
          </h2>
          <p>
            Each entry in the <code>rows</code> array follows this shape:
          </p>
          <Source code={summaryListRowsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>showActions</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can toggle the row actions on and
            off without editing the real <code>rows</code> prop directly. It is
            not a React prop accepted by <code>SummaryList</code>.
          </p>

          <h2>Examples</h2>
          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    rows: defaultRows,
    padded: true,
    noBorder: false,
    showActions: true,
  },
  render: ({ showActions = true, rows = defaultRows, ...args }) => (
    <SummaryList
      {...args}
      rows={showActions ? rows : rowsWithoutActions}
    />
  ),
  argTypes: {
    rows: {
      control: false,
      description:
        'Ordered key/value rows rendered in the summary list. Each row can also include optional action links when users need a way to change an answer.',
    },
    padded: {
      control: 'boolean',
      description:
        'Use the roomier spacing from the Figma reference. Turn this off for the denser compact layout.',
    },
    noBorder: {
      control: 'boolean',
      description:
        'Removes the separator line between rows while keeping the rest of the summary list structure intact.',
    },
    showActions: {
      control: 'boolean',
      description:
        'Storybook-only helper used by the Builder story to show or hide the row action links without editing the raw rows array.',
      table: {
        disable: true,
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-style additional classes for the root `<dl>` element.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description: 'React `className` for the root `<dl>` element.',
      table: {
        category: 'Advanced',
      },
    },
    attributes: {
      control: false,
      description:
        'Additional HTML attributes forwarded to the root `<dl>` element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<dl>` element.',
      table: {
        category: 'Advanced',
      },
    },
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
      source: {
        code: defaultSummaryListCode,
      },
      description: {
        story:
          'A realistic summary list with action links and mixed content types, including HTML content for the contact details row.',
      },
    },
  },
};

export const Builder: Story = {
  parameters: {
    controls: {
      include: ['showActions', 'padded', 'noBorder'],
    },
    docs: {
      description: {
        story:
          'Interactive builder story. Use the Storybook-only `showActions` helper together with the real `padded` and `noBorder` props to explore the component without raw JSON editing.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    padded: false,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: compactSummaryListCode,
      },
      description: {
        story:
          'The compact layout uses the denser spacing variant while keeping the same row content.',
      },
    },
  },
};

export const WithoutActions: Story = {
  args: {
    rows: rowsWithoutActions,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: withoutActionsSummaryListCode,
      },
      description: {
        story:
          'Summary list rows without action links. Use this when the content is read-only.',
      },
    },
  },
};

export const WithoutBorder: Story = {
  args: {
    padded: false,
    noBorder: true,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: withoutBorderSummaryListCode,
      },
      description: {
        story:
          'Compact summary list rows with the row separators removed.',
      },
    },
  },
};
