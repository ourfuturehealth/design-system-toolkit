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
          'Use Card / Do & Don’t to give users short, actionable recommendations that are easier to scan as positive and negative lists.',
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
