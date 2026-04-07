import type { Meta, StoryObj } from '@storybook/react-vite';
import { SummaryList } from './SummaryList';

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

const meta: Meta<typeof SummaryList> = {
  title: 'Components/SummaryList',
  component: SummaryList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Summary List to show key-value pairs such as review answers. The React component mirrors the toolkit `<dl>` markup, supports the same action links, and exposes the padded and compact spacing variants used in the design system docs.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    rows: defaultRows,
    padded: true,
  },
  argTypes: {
    rows: {
      control: false,
      description:
        'The list rows rendered as key/value pairs with optional action links.',
    },
    padded: {
      control: 'boolean',
      description:
        'Use the relaxed spacing from the Figma reference. Turn this off for the denser compact layout.',
    },
    noBorder: {
      control: 'boolean',
      description:
        'Removes the separator line between rows while keeping the rest of the summary list structure intact.',
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
      description: 'React className for the root `<dl>` element.',
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

export const Default: Story = {};

export const Compact: Story = {
  args: {
    padded: false,
  },
};

export const WithoutActions: Story = {
  args: {
    rows: defaultRows.map((row) => ({
      key: row.key,
      value: row.value,
    })),
  },
};

export const WithoutBorder: Story = {
  args: {
    padded: false,
    noBorder: true,
  },
};
