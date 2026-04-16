import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, type ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible button component based on the OFH Design System with multiple variants and states. If `href` is provided, the component renders as an anchor instead of a button. The `variant` changes the visual prominence only, not the semantic element.',
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
        'ghost-inverted',
        'text',
        'text-inverted',
      ],
      description:
        'Changes the visual style and prominence of the button. It does not change whether the component renders as a button or link.',
    },
    children: {
      control: 'text',
      description: 'Visible label content for the button or link.',
    },
    href: {
      control: 'text',
      description:
        'Navigation destination. When this is set, the component renders as an anchor (`<a>`) instead of a button.',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description:
        'Button type for real `<button>` elements. This has no effect when `href` is set and the component renders as a link.',
    },
    onClick: {
      control: false,
      description:
        'Click handler for button or anchor elements.',
      table: {
        category: 'Advanced',
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables the button. This only applies to real `<button>` elements and has no effect when `href` is set.',
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root element for layout or integration hooks. It does not replace the built-in variant classes.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the rendered button or anchor element. Use this only when you need direct access to the DOM node.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic contained button example. Use this as the first thing to copy when you need the default button pattern.',
      },
    },
  },
  render: () => <Button variant="contained">Continue</Button>,
};

export const Builder: Story = {
  args: {
    variant: 'contained',
    children: 'Continue',
    type: 'button',
  },
  parameters: {
    controls: {
      include: ['variant', 'children', 'href', 'type', 'disabled'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the button API interactively. It is the place to change the visible label, switch between link and button behaviour, and inspect the simple state controls.',
      },
    },
  },
};

export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
    onClick: () => {},
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
    onClick: () => {},
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
    onClick: () => {},
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const GhostInverted: Story = {
  args: {
    variant: 'ghost-inverted',
    children: 'Ghost Inverted Button',
    onClick: () => {},
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
    onClick: () => {},
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const TextInverted: Story = {
  args: {
    variant: 'text-inverted',
    children: 'Text Inverted Button',
    onClick: () => {},
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
  globals: {
    backgrounds: { value: 'dark' },
  },
};

// Multiple variants showcase
export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'All available button variants in the OFH Design System.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost-inverted">Ghost Inverted</Button>
      <Button variant="text">Text</Button>
      <Button variant="text-inverted">Text Inverted</Button>
    </div>
  ),
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example showing the button rendered as a link when `href` is provided.',
      },
    },
  },
};

// Link variants showcase
export const AllLinkVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'All button variants rendered as links with href attributes.',
      },
    },
  },
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
      <Button variant="ghost-inverted" href="#ghost-inverted">
        Ghost Inverted Link
      </Button>
      <Button variant="text" href="#text">
        Text Link
      </Button>
      <Button variant="text-inverted" href="#text-inverted">
        Text Inverted Link
      </Button>
    </div>
  ),
  globals: {
    backgrounds: { value: 'dark' },
  },
};

// Keyboard navigation demo
export const KeyboardNavigation: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Demonstration of keyboard accessibility. All buttons are keyboard navigable and follow standard interaction patterns.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ marginBottom: '1rem' }}>
        Press Tab to focus buttons, Enter/Space to activate.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="contained">Button 1</Button>
        <Button variant="outlined">Button 2</Button>
        <Button variant="ghost" href="#demo">
          Link Button
        </Button>
      </div>
    </div>
  ),
};

// Form usage example
export const InForm: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Example of buttons used in a form context with submit and cancel actions.',
      },
    },
  },
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
};
