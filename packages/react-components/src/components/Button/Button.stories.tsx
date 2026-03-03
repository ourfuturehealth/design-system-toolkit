import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible button component based on the OFH Design System with multiple variants and states. Can render as a button or anchor element.',
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
    href: {
      control: 'text',
      description: 'URL to navigate to (renders as anchor tag)',
    },
    onClick: {
      description: 'Click handler function (only for button elements)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button (only for button elements)',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

// Variant stories
export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
    onClick: () => alert('Button clicked!'),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
    onClick: () => alert('Button clicked!'),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
    onClick: () => alert('Button clicked!'),
  },
};

export const GhostReverse: Story = {
  args: {
    variant: 'ghost-reverse',
    children: 'Ghost Reverse Button',
    onClick: () => alert('Button clicked!'),
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
    onClick: () => alert('Button clicked!'),
  },
};

export const TextReverse: Story = {
  args: {
    variant: 'text-reverse',
    children: 'Text Reverse Button',
    onClick: () => alert('Button clicked!'),
  },
  globals: {
    backgrounds: { value: 'dark' },
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
  globals: {
    backgrounds: { value: 'dark' },
  },
};

// Link button (rendered as anchor)
export const AsLink: Story = {
  args: {
    variant: 'contained',
    href: 'https://example.com',
    children: 'Link Button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When an href prop is provided, the button renders as an anchor tag (<a>) instead of a button element.',
      },
    },
  },
};

// Link variants showcase
export const AllLinkVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="contained" href="#contained">
        Contained Link
      </Button>
      <Button variant="outlined" href="#outlined">
        Outlined Link
      </Button>
      <Button variant="ghost" href="#ghost">
        Ghost Link
      </Button>
      <Button variant="ghost-reverse" href="#ghost-reverse">
        Ghost Reverse Link
      </Button>
      <Button variant="text" href="#text">
        Text Link
      </Button>
      <Button variant="text-reverse" href="#text-reverse">
        Text Reverse Link
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants rendered as links with href attributes.',
      },
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
};

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        Press Tab to focus buttons, Enter/Space to activate.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={() => alert('Button 1 clicked')}>
          Button 1
        </Button>
        <Button variant="outlined" onClick={() => alert('Button 2 clicked')}>
          Button 2
        </Button>
        <Button variant="ghost" href="#demo">
          Link Button
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstration of keyboard accessibility. All buttons are keyboard navigable and follow standard interaction patterns.',
      },
    },
  },
};

// Form usage example
export const InForm: Story = {
  render: () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert('Form submitted!');
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <input
        type="text"
        placeholder="Enter your name"
        style={{
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="contained" type="submit">
          Submit
        </Button>
        <Button
          variant="outlined"
          type="button"
          onClick={() => alert('Cancelled')}
        >
          Cancel
        </Button>
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example of buttons used in a form context with submit and cancel actions.',
      },
    },
  },
};
