import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { TaskList } from './TaskList';
import type { TaskListItemProps, TaskListProps } from './TaskList';

type TaskListPreset = 'default' | 'with-hints' | 'status-variants';
type TaskListStatusMode = 'mixed' | 'complete' | 'incomplete' | 'pending';
type TaskListStoryArgs = TaskListProps & {
  taskSet?: TaskListPreset;
  showHints?: boolean;
  statusMode?: TaskListStatusMode;
  itemCount?: 3 | 5;
};

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

const withHintItems: TaskListItemProps[] = [
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
];

const statusVariantItems: TaskListItemProps[] = [
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
];

const taskItemSets: Record<TaskListPreset, TaskListItemProps[]> = {
  default: defaultItems,
  'with-hints': withHintItems,
  'status-variants': statusVariantItems,
};

const statusVariantMap = {
  complete: 'green',
  incomplete: 'blue',
  pending: 'yellow',
} satisfies Record<
  Exclude<TaskListStatusMode, 'mixed'>,
  NonNullable<TaskListItemProps['status']['variant']>
>;

const friendlyControlNames = [
  'taskSet',
  'showHints',
  'statusMode',
  'itemCount',
  'idPrefix',
] satisfies Array<keyof TaskListStoryArgs>;

const taskListUsageExample = `import { TaskList } from '@ourfuturehealth/react-components';

const items = [
  {
    title: 'Company directors',
    href: '/company/directors',
    status: {
      children: 'Complete',
      variant: 'green',
    },
  },
  {
    title: 'Financial history',
    href: '/company/financial-history',
    hint: 'Include 5 years of the company’s relevant financial information.',
    status: {
      children: 'Incomplete',
      variant: 'blue',
    },
  },
];

<TaskList
  idPrefix="company-task-list"
  items={items}
/>;
`;

const taskListItemShapeExample = `type TaskListItemProps = {
  title: React.ReactNode;
  href?: string;
  hint?: React.ReactNode;
  status: {
    children: React.ReactNode;
    variant?: 'neutral' | 'brand' | 'blue' | 'green' | 'yellow' | 'red';
  };
  className?: string;
  titleClassName?: string;
  hintClassName?: string;
};
`;

const defaultStoryCode = `import { TaskList } from '@ourfuturehealth/react-components';

const defaultItems = [
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
    hint: 'Include 5 years of the company’s relevant financial information.',
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

<TaskList
  idPrefix="task-list-default"
  items={defaultItems}
/>;
`;

const withHintsStoryCode = `import { TaskList } from '@ourfuturehealth/react-components';

const withHintItems = [
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
];

<TaskList
  idPrefix="task-list-with-hints"
  items={withHintItems}
/>;
`;

const statusVariantsStoryCode = `import { TaskList } from '@ourfuturehealth/react-components';

const statusVariantItems = [
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
];

<TaskList
  idPrefix="task-list-status-variants"
  items={statusVariantItems}
/>;
`;

const buildTaskItems = ({
  items = [],
  taskSet = 'default',
  showHints = true,
  statusMode = 'mixed',
  itemCount = 5,
}: Pick<
  TaskListStoryArgs,
  'items' | 'taskSet' | 'showHints' | 'statusMode' | 'itemCount'
>): TaskListItemProps[] =>
  (items.length > 0 ? items : taskItemSets[taskSet]).slice(0, itemCount).map((item) => ({
    ...item,
    hint: showHints ? item.hint : undefined,
    status: {
      ...item.status,
      variant:
        statusMode === 'mixed'
          ? item.status.variant
          : statusVariantMap[statusMode],
    },
  }));

const renderTaskListStory = ({
  items = [],
  taskSet = 'default',
  showHints = true,
  statusMode = 'mixed',
  itemCount = 5,
  ...args
}: TaskListStoryArgs) => (
  <TaskList
    {...args}
    items={buildTaskItems({
      items,
      taskSet,
      showHints,
      statusMode,
      itemCount,
    })}
  />
);

const meta: Meta<TaskListStoryArgs> = {
  title: 'Components/Task list',
  component: TaskList,
  parameters: {
    docsNamespaceArgKeys: ['idPrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Task list for long, complex services where users may need to complete tasks in more than one session and can choose the order that works for them. In React, the component API is intentionally small: you pass an `items` array, and you can optionally provide an `idPrefix` when you want stable ids for the row hint/status relationships. The `Builder` story uses extra Storybook-only helper controls, but those are not part of `TaskListProps`.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>items</code> array. Each item becomes one task
            row. Use <code>href</code> when the row should be clickable, use
            <code>hint</code> for optional supporting text, and pass the shared
            <code>Tag</code> props through <code>status</code>.
          </p>
          <p>
            Use <code>idPrefix</code> when you want predictable ids for the hint
            and status relationships, such as tests, snapshots, or pages that
            render more than one task list.
          </p>
          <Source code={taskListUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={['idPrefix', 'items', 'classes', 'className']}
          />

          <h2>
            <code>items</code> shape
          </h2>
          <p>
            Each entry in the <code>items</code> array follows this shape:
          </p>
          <Source code={taskListItemShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>taskSet</code>, <code>showHints</code>,{' '}
            <code>statusMode</code>, and <code>itemCount</code> are only used by
            the Storybook <code>Builder</code> story to make the component easier
            to explore. They are not React component props accepted by{' '}
            <code>TaskList</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    idPrefix: 'task-list-default',
    items: defaultItems,
    taskSet: 'default',
    showHints: true,
    statusMode: 'mixed',
    itemCount: 5,
  },
  render: renderTaskListStory,
  argTypes: {
    taskSet: {
      control: 'select',
      options: ['default', 'with-hints', 'status-variants'],
      description:
        'Builder-only Storybook helper. Chooses a preset task list before the other Builder controls are applied.',
      table: {
        category: 'Builder story only',
      },
    },
    showHints: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Shows or hides any available hint text beneath the task title.',
      table: {
        category: 'Builder story only',
      },
    },
    statusMode: {
      control: 'select',
      options: ['mixed', 'complete', 'incomplete', 'pending'],
      description:
        'Builder-only Storybook helper. Switches between the mixed status example and single-status rows.',
      table: {
        category: 'Builder story only',
      },
    },
    itemCount: {
      control: 'radio',
      options: [3, 5],
      description:
        'Builder-only Storybook helper. Chooses how many rows to show when the selected preset has enough items.',
      table: {
        category: 'Builder story only',
      },
    },
    idPrefix: {
      control: 'text',
      description:
        'Optional prefix used to generate the ids behind each row’s hint and status text. Set this when you want predictable ids for tests, snapshots, or pages that render more than one task list.',
      table: {
        category: 'TaskListProps',
      },
    },
    items: {
      control: false,
      description:
        'Required task row data. Pass one object per task in the order you want the rows to appear. Each item contains the row title, optional `href`, optional `hint`, and the shared `Tag` props used for the status on the right.',
      table: {
        type: {
          summary: 'TaskListItemProps[]',
        },
        category: 'TaskListProps',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity escape hatch for adding extra classes to the root `<ul>`. Most React consumers should ignore this and use `className` instead.',
      table: {
        category: 'TaskListProps',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root `<ul>` element. Use this for layout tweaks or integration hooks when you need to target the component from your app.',
      table: {
        category: 'TaskListProps',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<ul>` element. Use this only when you need direct access to the rendered DOM node.',
      table: {
        category: 'TaskListProps',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TaskList
      idPrefix="task-list-default"
      items={defaultItems}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic default task list example with mixed statuses and one row that includes hint text.',
      },
      source: {
        code: defaultStoryCode,
      },
    },
  },
};

export const Builder: Story = {
  args: {
    idPrefix: 'task-list-builder',
    items: defaultItems,
    taskSet: 'default',
    showHints: true,
    statusMode: 'mixed',
    itemCount: 5,
  },
  parameters: {
    controls: {
      include: friendlyControlNames,
    },
    docs: {
      description: {
        story:
          'Use the friendly controls to switch between the built-in task sets, toggle hint text, and try different status patterns without editing raw JSON.',
      },
    },
  },
};

export const WithHints: Story = {
  render: () => (
    <TaskList
      idPrefix="task-list-with-hints"
      items={withHintItems}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Shows how the optional hint text sits beneath the linked task title while the status tag remains aligned on the right.',
      },
      source: {
        code: withHintsStoryCode,
      },
    },
  },
};

export const StatusVariants: Story = {
  render: () => (
    <TaskList
      idPrefix="task-list-status-variants"
      items={statusVariantItems}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A compact example that shows the existing Tag component reused across the task list status column.',
      },
      source: {
        code: statusVariantsStoryCode,
      },
    },
  },
};
