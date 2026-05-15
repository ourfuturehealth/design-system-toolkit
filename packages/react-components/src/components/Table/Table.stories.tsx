import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArgTypes,
  Description,
  Source,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks';
import {
  Table,
  type TableCell,
  type TableHeadCell,
  type TableProps,
} from './Table';

const symptomsHead: TableHeadCell[] = [
  { content: 'Skin symptoms' },
  { content: 'Possible cause' },
];

const symptomsRows: TableCell[][] = [
  [
    { content: 'Blisters on lips or around the mouth' },
    { content: 'Cold sores' },
  ],
  [
    { content: 'Itchy, dry, cracked, sore' },
    { content: 'Eczema' },
  ],
  [
    { content: 'Itchy blisters' },
    { content: 'Shingles, chickenpox' },
  ],
];

const dosageHead: TableHeadCell[] = [
  { content: 'Age' },
  { content: 'How much?' },
  { content: 'How often?' },
];

const dosageRows: TableCell[][] = [
  [
    { content: '7 to 9 years' },
    { content: '200mg' },
    { content: 'Max 3 times in 24 hours' },
  ],
  [
    { content: '10 to 11 years' },
    { content: '200mg to 300mg' },
    { content: 'Max 3 times in 24 hours' },
  ],
  [
    { content: '12 to 17 years' },
    { content: '200mg to 400mg' },
    { content: 'Max 3 times in 24 hours' },
  ],
];

const numericHead: TableHeadCell[] = [
  { content: 'Month' },
  { content: 'Appointments', format: 'numeric' },
  { content: 'Participants', format: 'numeric' },
];

const numericRows: TableCell[][] = [
  [
    { content: 'January' },
    { content: '128', format: 'numeric' },
    { content: '942', format: 'numeric' },
  ],
  [
    { content: 'February' },
    { content: '156', format: 'numeric' },
    { content: '1,084', format: 'numeric' },
  ],
  [
    { content: 'March' },
    { content: '149', format: 'numeric' },
    { content: '1,031', format: 'numeric' },
  ],
];

const spansHead: TableHeadCell[] = [
  { content: 'Day' },
  { content: 'Morning clinic' },
  { content: 'Afternoon clinic' },
  { content: 'Notes' },
];

const spansRows: TableCell[][] = [
  [
    { content: 'Monday', rowSpan: 2 },
    { content: 'Children' },
    { content: 'Adults' },
    { content: 'Walk-ins available' },
  ],
  [
    { content: 'Urgent care', colSpan: 2 },
    { content: 'Limited appointments' },
  ],
  [
    { content: 'Tuesday' },
    { content: 'Respiratory' },
    { content: 'Diabetes' },
    { content: 'Pre-booked only' },
  ],
];

type TablePreset = 'two-column' | 'responsive-multi-column' | 'numeric';

type TableStoryArgs = TableProps & {
  tablePreset?: TablePreset;
  captionText?: string;
  useRowHeaders?: boolean;
};

const getPresetConfig = (
  tablePreset: TablePreset,
): Pick<TableProps, 'caption' | 'head' | 'rows' | 'responsive'> => {
  switch (tablePreset) {
    case 'responsive-multi-column':
      return {
        caption: 'Ibuprofen tablet dosages for children',
        head: dosageHead,
        rows: dosageRows,
        responsive: true,
      };
    case 'numeric':
      return {
        caption: 'Monthly appointment summary',
        head: numericHead,
        rows: numericRows,
        responsive: false,
      };
    case 'two-column':
    default:
      return {
        caption: 'Skin symptoms and possible causes',
        head: symptomsHead,
        rows: symptomsRows,
        responsive: false,
      };
  }
};

const defaultSource = `import { Table } from '@ourfuturehealth/react-components';

const head = [
  { content: 'Skin symptoms' },
  { content: 'Possible cause' },
];

const rows = [
  [
    { content: 'Blisters on lips or around the mouth' },
    { content: 'Cold sores' },
  ],
  [
    { content: 'Itchy, dry, cracked, sore' },
    { content: 'Eczema' },
  ],
];

<Table
  caption="Skin symptoms and possible causes"
  head={head}
  rows={rows}
/>;
`;

const responsiveSource = `import { Table } from '@ourfuturehealth/react-components';

const head = [
  { content: 'Age' },
  { content: 'How much?' },
  { content: 'How often?' },
];

const rows = [
  [
    { content: '7 to 9 years' },
    { content: '200mg' },
    { content: 'Max 3 times in 24 hours' },
  ],
  [
    { content: '10 to 11 years' },
    { content: '200mg to 300mg' },
    { content: 'Max 3 times in 24 hours' },
  ],
];

<Table
  caption="Ibuprofen tablet dosages for children"
  head={head}
  rows={rows}
  responsive
/>;
`;

const rowHeaderSource = `import { Table } from '@ourfuturehealth/react-components';

const head = [
  { content: 'Treatment' },
  { content: 'Uses' },
];

const rows = [
  [
    { content: 'Antibiotics' },
    { content: 'Treat bacterial infections' },
  ],
  [
    { content: 'Antihistamines' },
    { content: 'Ease allergic symptoms' },
  ],
];

<Table
  caption="Treatment types and uses"
  head={head}
  rows={rows}
  firstCellIsHeader
/>;
`;

const numericSource = `import { Table } from '@ourfuturehealth/react-components';

const head = [
  { content: 'Month' },
  { content: 'Appointments', format: 'numeric' },
  { content: 'Participants', format: 'numeric' },
];

const rows = [
  [
    { content: 'January' },
    { content: '128', format: 'numeric' },
    { content: '942', format: 'numeric' },
  ],
  [
    { content: 'February' },
    { content: '156', format: 'numeric' },
    { content: '1,084', format: 'numeric' },
  ],
];

<Table
  caption="Monthly appointment summary"
  head={head}
  rows={rows}
/>;
`;

const spansSource = `import { Table } from '@ourfuturehealth/react-components';

const head = [
  { content: 'Day' },
  { content: 'Morning clinic' },
  { content: 'Afternoon clinic' },
  { content: 'Notes' },
];

const rows = [
  [
    { content: 'Monday', rowSpan: 2 },
    { content: 'Children' },
    { content: 'Adults' },
    { content: 'Walk-ins available' },
  ],
  [
    { content: 'Urgent care', colSpan: 2 },
    { content: 'Limited appointments' },
  ],
];

<Table
  caption="Clinic availability by day"
  head={head}
  rows={rows}
/>;
`;

const renderBuilder = ({
  tablePreset = 'two-column',
  captionText,
  useRowHeaders = false,
  ...args
}: TableStoryArgs) => {
  const preset = getPresetConfig(tablePreset);

  return (
    <Table
      {...preset}
      {...args}
      caption={captionText || preset.caption}
      firstCellIsHeader={!preset.responsive && useRowHeaders}
    />
  );
};

const meta: Meta<TableStoryArgs> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Table to present data users need to compare or scan. In React, pass `head` and `rows` as arrays of objects with `content`, then add `responsive` when you need the stacked mobile layout for larger tables.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a visible <code>caption</code>, an optional <code>head</code>{' '}
            array for column headers, and a required <code>rows</code> array for
            the body data. Each cell uses a simple <code>content</code> field so
            you can pass plain text or richer React content.
          </p>
          <p>
            Keep captions visible wherever possible. They act as the table title
            for both visual users and assistive technology, so this component
            supports omitting them but the normal path should be to provide one.
          </p>
          <p>
            Use <code>responsive</code> for the stacked multi-column layout used
            on smaller screens. When you do that, the component will use string
            content from the matching <code>head</code> cell as the mobile
            labels, or you can override a label per cell with{' '}
            <code>header</code>.
          </p>
          <Source code={defaultSource} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'caption',
              'head',
              'rows',
              'firstCellIsHeader',
              'responsive',
              'classes',
              'className',
            ]}
          />

          <h2>Head shape</h2>
          <p>
            Each head item represents a column header. Use{' '}
            <code>format: &apos;numeric&apos;</code> when a column should be
            right aligned.
          </p>
          <Source
            code={`const head = [
  { content: 'Month' },
  { content: 'Appointments', format: 'numeric' },
  { content: 'Participants', format: 'numeric' },
];`}
            language="tsx"
          />

          <h2>Rows shape</h2>
          <p>
            Each row is an array of cells. In responsive tables, add an optional{' '}
            <code>header</code> when you want to override the mobile label for a
            specific cell. Use <code>colSpan</code> and <code>rowSpan</code>{' '}
            when a cell genuinely needs to span across neighbouring columns or
            rows.
          </p>
          <Source
            code={`const rows = [
  [
    { content: 'January' },
    { content: '128', format: 'numeric' },
    { content: '942', format: 'numeric' },
  ],
  [
    { content: 'February', header: 'Month' },
    { content: '156', header: 'Appointments', format: 'numeric' },
    { content: '1,084', header: 'Participants', format: 'numeric' },
  ],
];`}
            language="tsx"
          />

          <h2>Merged cells</h2>
          <p>
            Use <code>colSpan</code> and <code>rowSpan</code> sparingly. They
            are useful for schedule-style or grouped data, but simple comparison
            tables are usually easier to scan without merged cells.
          </p>
          <Source code={spansSource} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>tablePreset</code>, <code>captionText</code>, and{' '}
            <code>useRowHeaders</code> are only used by the Storybook{' '}
            <code>Builder</code> story to keep the controls easy to use. They
            are not props accepted by <code>Table</code>.
          </p>

          <Stories title="Examples" />

          <h2>Example source</h2>
          <Source code={defaultSource} language="tsx" />
          <Source code={responsiveSource} language="tsx" />
          <Source code={rowHeaderSource} language="tsx" />
          <Source code={numericSource} language="tsx" />
          <Source code={spansSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tablePreset: {
      control: 'radio',
      options: ['two-column', 'responsive-multi-column', 'numeric'],
      description:
        'Builder-only Storybook helper. Switches between realistic table presets.',
      table: {
        category: 'Builder story only',
      },
    },
    captionText: {
      control: 'text',
      description:
        'Builder-only Storybook helper. Overrides the visible caption for the selected preset.',
      table: {
        category: 'Builder story only',
      },
    },
    useRowHeaders: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Turns the first column into row headers for non-responsive presets.',
      if: {
        arg: 'tablePreset',
        neq: 'responsive-multi-column',
      },
      table: {
        category: 'Builder story only',
      },
    },
    caption: {
      control: false,
      description:
        'Visible caption shown above the table and announced as the table title.',
      table: {
        category: 'TableProps',
      },
    },
    head: {
      control: false,
      description:
        'Optional column-header array. In responsive tables, string content from `head` is used for the stacked mobile labels when a cell does not provide `header`.',
      table: {
        category: 'TableProps',
      },
    },
    rows: {
      control: false,
      description:
        'Required row data. Each row is an array of cell objects with `content`, plus optional `header`, `format`, `colSpan`, and `rowSpan`.',
      table: {
        category: 'TableProps',
      },
    },
    firstCellIsHeader: {
      control: 'boolean',
      description:
        'When true, the first cell in each non-responsive body row is rendered as a row header.',
      table: {
        category: 'TableProps',
      },
    },
    responsive: {
      control: false,
      description:
        'Enables the stacked multi-column mobile layout used for larger tables.',
      table: {
        category: 'TableProps',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity escape hatch for extra root classes. Most React consumers should prefer `className`.',
      table: {
        category: 'TableProps',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root `<table>` element for layout or integration hooks.',
      table: {
        category: 'TableProps',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<table>` element. Use this only when you need direct DOM access.',
      table: {
        category: 'TableProps',
      },
    },
  },
  args: {
    tablePreset: 'two-column',
    captionText: '',
    useRowHeaders: false,
  },
  render: renderBuilder,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table
      caption="Skin symptoms and possible causes"
      head={symptomsHead}
      rows={symptomsRows}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic default two-column table for comparing labels and values.',
      },
      source: {
        code: defaultSource,
      },
    },
  },
};

export const Builder: Story = {
  parameters: {
    controls: {
      include: ['tablePreset', 'captionText', 'useRowHeaders'],
    },
  },
};

export const ResponsiveMultiColumn: Story = {
  render: () => (
    <Table
      caption="Ibuprofen tablet dosages for children"
      head={dosageHead}
      rows={dosageRows}
      responsive
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example showing the responsive multi-column pattern that collapses into stacked rows on smaller screens.',
      },
      source: {
        code: responsiveSource,
      },
    },
  },
};

export const FirstCellIsHeader: Story = {
  render: () => (
    <Table
      caption="Treatment types and uses"
      head={[
        { content: 'Treatment' },
        { content: 'Uses' },
      ]}
      rows={[
        [
          { content: 'Antibiotics' },
          { content: 'Treat bacterial infections' },
        ],
        [
          { content: 'Antihistamines' },
          { content: 'Ease allergic symptoms' },
        ],
      ]}
      firstCellIsHeader
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example where the first cell in each row becomes a row header for stronger row-to-value associations.',
      },
      source: {
        code: rowHeaderSource,
      },
    },
  },
};

export const NumericValues: Story = {
  render: () => (
    <Table
      caption="Monthly appointment summary"
      head={numericHead}
      rows={numericRows}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example using the numeric alignment modifier for columns that contain numbers.',
      },
      source: {
        code: numericSource,
      },
    },
  },
};

export const ColSpanAndRowSpan: Story = {
  render: () => (
    <Table
      caption="Clinic availability by day"
      head={spansHead}
      rows={spansRows}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example showing how to use `colSpan` and `rowSpan` for grouped schedule data when merged cells are genuinely needed.',
      },
      source: {
        code: spansSource,
      },
    },
  },
};
