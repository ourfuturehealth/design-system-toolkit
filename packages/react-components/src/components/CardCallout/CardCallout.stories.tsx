import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardCallout } from './CardCallout';

const meta: Meta<typeof CardCallout> = {
  title: 'Components/Card/Callout',
  component: CardCallout,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Card / Callout to highlight contextual information such as informational, warning, success or error messages. `heading` changes the colored label text. `headingLevel` changes the semantic heading tag used for that label, but does not change the visual styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'error', 'success', 'warning'],
      description:
        'Changes the callout color scheme to match the type of message: informational, warning, success, or error.',
    },
    heading: {
      control: 'text',
      description:
        'Text shown in the colored label block at the top of the callout.',
    },
    headingHtml: {
      control: false,
      description:
        'Trusted HTML to render inside the label. When this is provided, it replaces `heading`.',
      table: {
        category: 'Advanced',
      },
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description:
        'Changes the semantic heading element for the label, for example `h2` or `h3`. This helps the callout fit the page heading hierarchy, but does not change the visual appearance.',
    },
    html: {
      control: false,
      description:
        'Trusted HTML content for the callout body. When this is provided, it replaces `text`.',
      table: {
        category: 'Advanced',
      },
    },
    text: {
      control: 'text',
      description: 'Plain text body content shown inside the callout.',
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
        'Adds extra classes to the root callout element for layout or integration hooks. It does not change the built-in variants by itself.',
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

export const Info: Story = {
  args: {
    heading: 'Information',
    variant: 'info',
    text: 'This is additional context to help the user understand the next step.',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <CardCallout {...args} />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Warning: Story = {
  args: {
    heading: 'Warning',
    variant: 'warning',
    text: 'Check this information before you continue.',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <CardCallout {...args} />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Success: Story = {
  args: {
    heading: 'Success',
    variant: 'success',
    text: 'Your details have been saved successfully.',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <CardCallout {...args} />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Error: Story = {
  args: {
    heading: 'Error',
    variant: 'error',
    text: 'There is a problem with the information in this section.',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <CardCallout {...args} />
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic informational callout example. Use this as the default pattern when you need a simple explanatory message.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '32rem' }}>
      <CardCallout
        heading="Information"
        variant="info"
        text="This is additional context to help the user understand the next step."
      />
    </div>
  ),
};

export const Builder: Story = {
  args: {
    heading: 'Information',
    variant: 'info',
    text: 'This is additional context to help the user understand the next step.',
  },
  parameters: {
    controls: {
      include: ['variant', 'heading', 'text', 'headingLevel'],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the Card / Callout API interactively. It is the quickest way to compare the message type, label text, and heading semantics.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <CardCallout {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '32rem' }}>
      <CardCallout
        heading="Information"
        variant="info"
        text="Additional context to help the user understand the next step."
      />
      <CardCallout
        heading="Warning"
        variant="warning"
        text="Check this information before you continue."
      />
      <CardCallout
        heading="Success"
        variant="success"
        text="Your details have been saved successfully."
      />
      <CardCallout
        heading="Error"
        variant="error"
        text="There is a problem with the information in this section."
      />
    </div>
  ),
};
