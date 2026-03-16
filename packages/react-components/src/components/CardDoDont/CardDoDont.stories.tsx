import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardDoDont } from './CardDoDont';

const meta: Meta<typeof CardDoDont> = {
  title: 'Components/Card/Do & Don’t',
  component: CardDoDont,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Card / Do & Don’t to give users short, actionable recommendations that are easier to scan as positive and negative lists. `heading` changes the navy label text. `headingLevel` changes the semantic heading tag used for that label, but does not change the visual styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['do', 'dont'],
      description: 'List type.',
    },
    heading: {
      control: 'text',
      description:
        'Optional label text shown in the navy heading block. Defaults to `Do` or `Don’t` based on `type`.',
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description:
        'Changes the semantic heading element for the label, for example `h2` or `h3`. This helps the component fit the page heading hierarchy, but does not change the visual appearance.',
    },
    items: {
      control: 'object',
      description: 'Array of list items rendered in the card body.',
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

export const Do: Story = {
  args: {
    type: 'do',
    items: [
      { item: 'cover blisters that are likely to burst with a soft plaster or dressing' },
      { item: 'wash your hands before touching a burst blister' },
      { item: 'allow the fluid to drain before covering it' },
      { item: 'keep the area clean and dry while it heals' },
    ],
  },
  render: (args) => (
    <div style={{ width: '26.5rem' }}>
      <CardDoDont {...args} />
    </div>
  ),
};

export const Dont: Story = {
  args: {
    type: 'dont',
    items: [
      { item: 'burst a blister yourself' },
      { item: 'peel the skin off a burst blister' },
      { item: 'wear the shoes or use the equipment that caused your blister until it heals' },
      { item: 'ignore signs that it may be infected' },
    ],
  },
  render: (args) => (
    <div style={{ width: '26.5rem' }}>
      <CardDoDont {...args} />
    </div>
  ),
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
        items={[
          { item: 'cover blisters that are likely to burst with a soft plaster or dressing' },
          { item: 'wash your hands before touching a burst blister' },
          { item: 'allow the fluid to drain before covering it' },
          { item: 'keep the area clean and dry while it heals' },
        ]}
      />
      <CardDoDont
        type="dont"
        items={[
          { item: 'burst a blister yourself' },
          { item: 'peel the skin off a burst blister' },
          { item: 'wear the shoes or use the equipment that caused your blister until it heals' },
          { item: 'ignore signs that it may be infected' },
        ]}
      />
    </div>
  ),
};
