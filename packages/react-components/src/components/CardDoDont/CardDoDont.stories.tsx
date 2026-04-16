import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { CardDoDont } from './CardDoDont';

type CardDoDontStoryArgs = ComponentProps<typeof CardDoDont> & {
  itemsText?: string;
};

const defaultDoItems = [
  'cover blisters that are likely to burst with a soft plaster or dressing',
  'wash your hands before touching a burst blister',
  'allow the fluid to drain before covering it',
  'keep the area clean and dry while it heals',
];

const defaultDontItems = [
  'burst a blister yourself',
  'peel the skin off a burst blister',
  'wear the shoes or use the equipment that caused your blister until it heals',
  'ignore signs that it may be infected',
];

const cardDoDontUsageExample = `import { CardDoDont } from '@ourfuturehealth/react-components';

const items = [
  { item: 'cover blisters that are likely to burst with a soft plaster or dressing' },
  { item: 'wash your hands before touching a burst blister' },
  { item: 'allow the fluid to drain before covering it' },
];

<CardDoDont
  items={items}
  type="do"
/>;
`;

const cardDoDontItemsShapeExample = `type CardDoDontItem = {
  item: React.ReactNode;
};
`;

const renderCardDoDont = ({ itemsText, items, ...args }: CardDoDontStoryArgs) => {
  const resolvedItems =
    itemsText !== undefined
      ? itemsText
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => ({ item }))
      : items;

  return (
    <div style={{ width: '26.5rem' }}>
      <CardDoDont {...args} items={resolvedItems} />
    </div>
  );
};

const meta: Meta<CardDoDontStoryArgs> = {
  title: 'Components/Card/Do & Don’t',
  component: CardDoDont,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Card / Do & Don’t to give users short, actionable recommendations that are easier to scan as positive and negative lists. `heading` changes the navy label text. `headingLevel` changes the semantic heading tag used for that label, but does not change the visual styling.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>CardDoDont</code> when you want a short, scannable list of
            recommended or discouraged actions.
          </p>
          <p>
            Pass the list type through <code>type</code> and the bullet content
            through an <code>items</code> array. You can override the default
            label with <code>heading</code> if your page needs more specific
            wording.
          </p>
          <Source code={cardDoDontUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={['type', 'heading', 'headingLevel', 'items']}
          />

          <h2>
            <code>items</code> shape
          </h2>
          <p>
            Each entry in the <code>items</code> array follows this shape:
          </p>
          <Source code={cardDoDontItemsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>itemsText</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can edit the list content as simple
            newline-separated text. It is not a React prop accepted by{' '}
            <code>CardDoDont</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['do', 'dont'],
      description:
        'Chooses whether the card presents a positive do list or a negative don’t list.',
      table: {
        category: 'CardDoDontProps',
      },
    },
    heading: {
      control: 'text',
      description:
        'Optional label text shown in the navy heading block. Defaults to `Do` or `Don’t` based on `type`.',
      table: {
        category: 'CardDoDontProps',
      },
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description:
        'Changes the semantic heading element for the label, for example `h2` or `h3`. This helps the component fit the page heading hierarchy, but does not change the visual appearance.',
      table: {
        category: 'CardDoDontProps',
      },
    },
    items: {
      control: false,
      description:
        'Array of list items rendered in the card body. Pass one object per bullet.',
      table: {
        category: 'CardDoDontProps',
      },
    },
    itemsText: {
      control: 'text',
      description:
        'List items as newline-separated text for this story. Each non-empty line becomes one bullet.',
      table: {
        category: 'Builder story only',
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
        'Adds extra classes to the root element for layout or integration hooks. It does not change the built-in `do` or `dont` styling by itself.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<div>` element. Use this only when you need direct access to the rendered DOM node.',
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
    type: 'do',
    itemsText: defaultDoItems.join('\n'),
  },
  render: renderCardDoDont,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic do-list example. Use this as the default pattern when you need a short, scannable positive recommendation list.',
      },
    },
  },
};

export const Dont: Story = {
  args: {
    type: 'dont',
    itemsText: defaultDontItems.join('\n'),
  },
  render: renderCardDoDont,
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Builder: Story = {
  args: {
    heading: '',
    headingLevel: 2,
    type: 'do',
    itemsText: defaultDoItems.join('\n'),
  },
  parameters: {
    controls: {
      include: ['type', 'heading', 'headingLevel', 'itemsText'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the Card / Do & Don’t API interactively. It is the easiest way to change the list type and swap the bullet content without editing raw JSON.',
      },
    },
  },
  render: renderCardDoDont,
};

export const BothLists: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '2.5rem', width: '26.5rem' }}>
      <CardDoDont
        type="do"
        items={defaultDoItems.map((item) => ({ item }))}
      />
      <CardDoDont
        type="dont"
        items={defaultDontItems.map((item) => ({ item }))}
      />
    </div>
  ),
};
