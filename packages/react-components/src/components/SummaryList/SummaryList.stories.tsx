import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
