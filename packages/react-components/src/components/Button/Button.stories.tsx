import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible button component based on the OFH Design System with multiple variants and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'contained',
        'outlined',
        'ghost',
        'ghost-reverse',
        'text',
        'text-reverse',
      ],
      description: 'Visual style variant of the button',
    },
    children: {
      control: 'text',
      description: 'Button content/text',
    },
    onClick: {
      description: 'Click handler function',
    },
  },
  args: {
    onClick: () => alert('Button clicked!'),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Variant stories
export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const GhostReverse: Story = {
  args: {
    variant: 'ghost-reverse',
    children: 'Ghost Reverse Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

export const TextReverse: Story = {
  args: {
    variant: 'text-reverse',
    children: 'Text Reverse Button',
  },
};

// Multiple variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost-reverse">Ghost Reverse</Button>
      <Button variant="text">Text</Button>
      <Button variant="text-reverse">Text Reverse</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants in the OFH Design System.',
      },
    },
  },
};
