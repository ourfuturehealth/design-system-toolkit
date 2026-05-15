import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { ContentsList, type ContentsListItem, type ContentsListProps } from './ContentsList';

type ContentsListCurrentItem =
  | 'what-is-amd'
  | 'symptoms'
  | 'getting-diagnosed'
  | 'treatments'
  | 'living-with-amd';

type ContentsListStoryArgs = ContentsListProps & {
  showCurrent?: boolean;
  currentItem?: ContentsListCurrentItem;
};

const baseItems: Array<{ id: ContentsListCurrentItem; text: string; href: string }> = [
  {
    id: 'what-is-amd',
    text: 'What is AMD?',
    href: '/conditions/amd',
  },
  {
    id: 'symptoms',
    text: 'Symptoms',
    href: '/conditions/amd/symptoms',
  },
  {
    id: 'getting-diagnosed',
    text: 'Getting diagnosed',
    href: '/conditions/amd/getting-diagnosed',
  },
  {
    id: 'treatments',
    text: 'Treatments',
    href: '/conditions/amd/treatments',
  },
  {
    id: 'living-with-amd',
    text: 'Living with AMD',
    href: '/conditions/amd/living-with-amd',
  },
];

const currentItemLabels: Record<ContentsListCurrentItem, string> = {
  'what-is-amd': 'What is AMD?',
  symptoms: 'Symptoms',
  'getting-diagnosed': 'Getting diagnosed',
  treatments: 'Treatments',
  'living-with-amd': 'Living with AMD',
};

const buildItems = ({
  showCurrent = true,
  currentItem = 'what-is-amd',
}: Pick<ContentsListStoryArgs, 'showCurrent' | 'currentItem'>): ContentsListItem[] =>
  baseItems.map((item) =>
    showCurrent && item.id === currentItem
      ? {
          text: item.text,
          current: true,
        }
      : {
          text: item.text,
          href: item.href,
        },
  );

const usageExample = `import { ContentsList } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'What is AMD?',
    current: true,
  },
  {
    text: 'Symptoms',
    href: '/conditions/amd/symptoms',
  },
  {
    text: 'Getting diagnosed',
    href: '/conditions/amd/getting-diagnosed',
  },
];

<ContentsList items={items} />;
`;

const itemsShapeExample = `type ContentsListCurrentItem = {
  text: React.ReactNode;
  current: true;
};

type ContentsListLinkedItem = {
  text: React.ReactNode;
  href: string;
  current?: false;
  anchorProps?: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>;
};

type ContentsListItem = ContentsListCurrentItem | ContentsListLinkedItem;
`;

const defaultSource = `import { ContentsList } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'What is AMD?',
    current: true,
  },
  {
    text: 'Symptoms',
    href: '/conditions/amd/symptoms',
  },
  {
    text: 'Getting diagnosed',
    href: '/conditions/amd/getting-diagnosed',
  },
  {
    text: 'Treatments',
    href: '/conditions/amd/treatments',
  },
  {
    text: 'Living with AMD',
    href: '/conditions/amd/living-with-amd',
  },
];

<ContentsList items={items} />;
`;

const currentInMiddleSource = `import { ContentsList } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'What is AMD?',
    href: '/conditions/amd',
  },
  {
    text: 'Symptoms',
    href: '/conditions/amd/symptoms',
  },
  {
    text: 'Getting diagnosed',
    current: true,
  },
  {
    text: 'Treatments',
    href: '/conditions/amd/treatments',
  },
  {
    text: 'Living with AMD',
    href: '/conditions/amd/living-with-amd',
  },
];

<ContentsList items={items} />;
`;

const allLinksSource = `import { ContentsList } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'What is AMD?',
    href: '/conditions/amd',
  },
  {
    text: 'Symptoms',
    href: '/conditions/amd/symptoms',
  },
  {
    text: 'Getting diagnosed',
    href: '/conditions/amd/getting-diagnosed',
  },
  {
    text: 'Treatments',
    href: '/conditions/amd/treatments',
  },
  {
    text: 'Living with AMD',
    href: '/conditions/amd/living-with-amd',
  },
];

<ContentsList items={items} />;
`;

const renderContentsList = ({
  showCurrent = true,
  currentItem = 'what-is-amd',
  items,
  ...props
}: ContentsListStoryArgs) => (
  <ContentsList
    {...props}
    items={items ?? buildItems({ showCurrent, currentItem })}
  />
);

const meta: Meta<ContentsListStoryArgs> = {
  title: 'Components/Contents List',
  component: ContentsList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            Use ContentsList to show a short list of related pages near the top
            of a guide or information hub. It matches the toolkit markup,
            keeps the current page as text instead of a link, and uses the same
            visually hidden heading and navigation label as the Nunjucks macro.
          </p>

          <h2>How to use the React component</h2>
          <p>
            Pass the list of pages through <code>items</code>. Mark the current
            page item with <code>current: true</code> and omit its
            <code>href</code>. Leave every item linked when you are using the
            component as a related-pages list from a landing page.
          </p>
          <Source code={usageExample} language="tsx" />

          <h2>Items shape</h2>
          <p>
            Each item needs visible text. Add <code>href</code> for linked
            items, <code>current</code> for the current page item, and
            <code>anchorProps</code> when you need extra link attributes.
          </p>
          <Source code={itemsShapeExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>showCurrent</code> and <code>currentItem</code> are
            Storybook Builder helpers only. They make the interactive story
            easier to use, but they are not real <code>ContentsList</code> props.
          </p>

          <h2>Examples</h2>
          <Stories />
        </>
      ),
    },
  },
  argTypes: {
    items: {
      control: false,
      description:
        'Contents list items rendered in order. Use `current: true` on the current page item.',
      table: {
        type: { summary: 'ContentsListItem[]' },
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity alias for extra root classes. Prefer `className` in React-first usage.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description: 'Adds extra classes to the root `<nav>` element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<nav>` element.',
      table: {
        category: 'Advanced',
      },
    },
    showCurrent: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Toggles whether one item is rendered as the current page.',
      table: {
        category: 'Builder story only',
      },
    },
    currentItem: {
      control: {
        type: 'select',
        labels: currentItemLabels,
      },
      options: Object.keys(currentItemLabels),
      description:
        'Builder-only Storybook helper. Chooses which item is rendered as the current page.',
      if: {
        arg: 'showCurrent',
      },
      table: {
        category: 'Builder story only',
        type: {
          summary: 'ContentsListCurrentItem',
        },
      },
    },
  },
  args: {
    showCurrent: true,
    currentItem: 'what-is-amd',
  },
};

export default meta;
type Story = StoryObj<ContentsListStoryArgs>;

export const Default: Story = {
  render: renderContentsList,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: defaultSource,
      },
      description: {
        story:
          'A realistic contents list example with the current page shown as text at the top of the list.',
      },
    },
  },
};

export const Builder: Story = {
  render: renderContentsList,
  parameters: {
    controls: {
      include: ['showCurrent', 'currentItem'],
    },
  },
};

export const CurrentInMiddle: Story = {
  render: () => (
    <ContentsList
      items={buildItems({
        showCurrent: true,
        currentItem: 'getting-diagnosed',
      })}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: currentInMiddleSource,
      },
      description: {
        story:
          'A fixed example showing that the current page item can appear anywhere in the list, not only at the start.',
      },
    },
  },
};

export const AllLinks: Story = {
  render: () => <ContentsList items={buildItems({ showCurrent: false })} />,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: allLinksSource,
      },
      description: {
        story:
          'A fixed example for hub or landing pages where the contents list is a set of links and no current page item is shown.',
      },
    },
  },
};
