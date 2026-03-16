import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card/Basic',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use a card to present short, scannable summaries of content, status or next steps. The React component mirrors the toolkit Card family markup and classes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['basic', 'clickable'],
      description: 'Card variant.',
    },
    heading: {
      control: 'text',
      description: 'Card heading content.',
    },
    description: {
      control: 'text',
      description: 'Card description text.',
    },
    href: {
      control: 'text',
      description: 'Primary card link URL.',
    },
    number: {
      control: 'text',
      description: 'Large numeric value for dashboard-style cards.',
    },
    helperText: {
      control: 'text',
      description: 'Supporting helper text.',
    },
  },
  args: {
    heading: 'Card heading',
    description: 'Card description',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    heading: 'If you need help now, but it’s not an emergency',
    description:
      'Go to 111.nhs.uk or call 111 for urgent help that does not need emergency care.',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const BasicDismissible: Story = {
  args: {
    heading: 'Update available',
    description: 'A newer version of this content is available for review.',
    dismissButton: {
      label: 'Dismiss update message',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const BasicSuccess: Story = {
  args: {
    heading: 'Profile complete',
    description: 'You’ve completed all the required profile details.',
    icon: {
      name: 'Done',
      size: 32,
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    variant: 'clickable',
    href: '#card-clickable',
    heading: 'Introduction to care and support',
    description:
      'A quick guide for people who have care and support needs and their carers.',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const ClickableAction: Story = {
  args: {
    variant: 'clickable',
    href: '#card-action',
    heading: 'Introduction to care and support',
    tag: {
      text: 'New',
      classes: 'ofh-tag--blue',
    },
    description:
      'A quick guide for people who have care and support needs and their carers.',
    metadataItems: [
      { icon: 'FmdGoodOutlined', text: 'Online' },
      { icon: 'CalendarTodayOutlined', text: 'Updated today' },
      { icon: 'AccessTime', text: '5 minute read' },
    ],
    helperText: 'Recommended for new participants.',
    icon: {
      name: 'ArrowCircleRightColour',
      size: 32,
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const ClickableNumeric: Story = {
  args: {
    variant: 'clickable',
    number: '12',
    actionLink: {
      text: 'Open tasks',
      href: '#card-numeric',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    variant: 'clickable',
    href: '#card-image',
    heading: 'Exercise',
    description:
      'Programmes, workouts and tips to get you moving and improve your fitness and wellbeing.',
    imgURL:
      'https://assets.nhs.uk/prod/images/A_0218_exercise-main_FKW1X7.width-690.jpg',
    imgALT: '',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '32rem' }}>
      <Card
        variant="clickable"
        href="#keyboard-primary"
        heading="Primary action"
        description="Press Tab to focus the link inside the clickable card."
      />
      <Card
        heading="Dismissible message"
        description="The dismiss button remains independently focusable."
        dismissButton={{ label: 'Dismiss message' }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Clickable cards keep a real focusable link, and secondary controls remain independently focusable and operable.',
      },
    },
  },
};
