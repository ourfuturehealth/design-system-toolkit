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
          'Use Card / Callout to highlight contextual information such as informational, warning, success or error messages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'error', 'success', 'warning'],
      description: 'Callout variant.',
    },
    heading: {
      control: 'text',
      description: 'Callout heading.',
    },
    text: {
      control: 'text',
      description: 'Plain text body content.',
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
};

export const AllVariants: Story = {
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
