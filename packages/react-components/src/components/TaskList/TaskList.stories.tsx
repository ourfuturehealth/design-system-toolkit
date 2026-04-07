import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskList } from './TaskList';
import type { TaskListItemProps } from './TaskList';

const defaultItems: TaskListItemProps[] = [
  {
    title: 'Company directors',
    href: '#directors',
    status: {
      children: 'Complete',
      variant: 'green',
    },
  },
  {
    title: 'Registered company details',
    href: '#company-details',
    status: {
      children: 'Incomplete',
      variant: 'blue',
    },
  },
  {
    title: 'Financial history',
    hint: 'Include 5 years of the company’s relevant financial information.',
    href: '#financial-history',
    status: {
      children: 'Complete',
      variant: 'green',
    },
  },
  {
    title: 'Business plan',
    href: '#business-plan',
    status: {
      children: 'Pending',
      variant: 'yellow',
    },
  },
  {
    title: 'References',
    href: '#references',
    status: {
      children: 'Incomplete',
      variant: 'blue',
    },
  },
];

const meta: Meta<typeof TaskList> = {
  title: 'Components/Content Presentation/Task list',
  component: TaskList,
  parameters: {
    docsNamespaceArgKeys: ['idPrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A task list for content-presentation journeys. It keeps the toolkit row structure, uses the shared Tag component for the status column, and applies the same clickable row pattern as the toolkit version.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    idPrefix: 'task-list-default',
    items: defaultItems,
  },
  argTypes: {
    idPrefix: {
      control: 'text',
      description:
        'Prefix used to generate the hint and status ids for each row. Use a unique value when rendering more than one task list on the same docs page.',
    },
    items: {
      control: 'object',
      description:
        'Array of task rows. Each row includes title content, an optional hint, an optional href, and a Tag configuration for the status.',
      table: {
        type: {
          summary: 'TaskListItemProps[]',
        },
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity alias for adding extra classes to the root element. In React-only usage, prefer `className`.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root `<ul>` element for layout or integration hooks.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<ul>` element. Use this only when you need direct access to the rendered DOM node.',
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
    idPrefix: 'task-list-default',
    items: defaultItems,
  },
};

export const WithHints: Story = {
  args: {
    idPrefix: 'task-list-with-hints',
    items: [
      {
        title: 'Company directors',
        href: '#directors',
        hint: 'Add each director’s full name and date of birth.',
        status: {
          children: 'Complete',
          variant: 'green',
        },
      },
      {
        title: 'Registered company details',
        href: '#company-details',
        hint: 'Use the company registration number from your records.',
        status: {
          children: 'Incomplete',
          variant: 'blue',
        },
      },
      {
        title: 'Financial history',
        href: '#financial-history',
        hint: 'Include 5 years of the company’s relevant financial information.',
        status: {
          children: 'Pending',
          variant: 'yellow',
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows how the optional hint text sits beneath the linked task title while the status tag remains aligned on the right.',
      },
    },
  },
};

export const StatusVariants: Story = {
  args: {
    idPrefix: 'task-list-status-variants',
    items: [
      {
        title: 'Company directors',
        href: '#directors',
        status: {
          children: 'Complete',
          variant: 'green',
        },
      },
      {
        title: 'Registered company details',
        href: '#company-details',
        status: {
          children: 'Incomplete',
          variant: 'blue',
        },
      },
      {
        title: 'Financial history',
        href: '#financial-history',
        status: {
          children: 'Pending',
          variant: 'yellow',
        },
      },
    ],
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A compact example that shows the existing Tag component reused across the task list status column.',
      },
    },
  },
};
