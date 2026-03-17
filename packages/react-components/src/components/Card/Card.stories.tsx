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
          'Use a card to present short, scannable summaries of content, status or next steps. `headingLevel` changes the semantic heading tag used for the card title, but does not change the visual styling on its own. The React component mirrors the toolkit Card family markup and classes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['basic', 'clickable'],
      description:
        'Changes the card behavior. `basic` is a static content card. `clickable` keeps a real link inside the card and expands the card hit area to that primary link.',
    },
    heading: {
      control: 'text',
      description:
        'Main heading content for the card. This is usually the most prominent text and can include a link when `href` is provided.',
    },
    headingHtml: {
      control: false,
      description:
        'Trusted HTML to render inside the heading. When this is provided, it replaces `heading`.',
      table: {
        category: 'Advanced',
      },
    },
    headingClasses: {
      control: false,
      description:
        'Extra classes for the heading element. Use this when you need to change the visual heading size while keeping the same semantic `headingLevel`.',
      table: {
        category: 'Advanced',
      },
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description:
        'Changes the semantic heading element for the title, for example `h2` or `h3`. This helps the card fit the page heading hierarchy, but does not change the visual appearance by itself.',
    },
    description: {
      control: 'text',
      description: 'Plain text body copy shown below the heading.',
    },
    descriptionHtml: {
      control: false,
      description:
        'Trusted HTML content for the card body. When this is provided, it replaces `description`.',
      table: {
        category: 'Advanced',
      },
    },
    href: {
      control: 'text',
      description:
        'Primary link destination. In clickable cards, this makes the heading link the main interactive target for the whole card.',
    },
    icon: {
      control: 'object',
      description:
        'Optional trailing icon shown to the right of the card content, for example a success state icon or action arrow.',
    },
    dismissButton: {
      control: 'object',
      description:
        'Optional dismiss button configuration. This renders a close button in the card top-right corner.',
    },
    number: {
      control: 'text',
      description:
        'Large numeric value used in dashboard-style cards where the number is the main message.',
    },
    tag: {
      control: 'object',
      description:
        'Optional contextual tag shown above the body copy, for example `New`.',
    },
    metadataItems: {
      control: 'object',
      description:
        'Optional metadata rows with an icon and text, used for supporting details like location, date, or reading time.',
    },
    helperText: {
      control: 'text',
      description:
        'Supporting helper text shown after the main body and metadata.',
    },
    helperHtml: {
      control: false,
      description:
        'Trusted HTML helper content shown after the main body and metadata. When this is provided, it replaces `helperText`.',
      table: {
        category: 'Advanced',
      },
    },
    actionLink: {
      control: 'object',
      description:
        'Optional secondary action link shown at the bottom of the card. In clickable numeric cards without `href`, this can act as the primary link target.',
    },
    imgURL: {
      control: 'text',
      description: 'Optional image shown at the top of the card.',
    },
    imgALT: {
      control: 'text',
      description:
        'Alternative text for the image. Use an empty string when the image is decorative.',
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
        'Adds extra classes to the root card element for layout or integration hooks. It does not change the built-in variants by itself.',
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

export const BasicDismissibleWithImage: Story = {
  args: {
    heading: 'Updated guidance available',
    description:
      'A newer version of this guidance is available. Review the latest content when you are ready.',
    imgURL:
      'https://assets.nhs.uk/prod/images/A_0218_exercise-main_FKW1X7.width-690.jpg',
    imgALT: '',
    dismissButton: {
      label: 'Dismiss guidance update',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const BasicWithIcon: Story = {
  args: {
    heading: 'Profile complete',
    description: 'You’ve completed all the required profile details.',
    icon: {
      name: 'Done',
      size: 32,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the `icon` prop to add a supporting icon to a basic card. Success is one common use, but the same pattern can support other short icon-led messages too.',
      },
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Clickable cards keep a real focusable link, and secondary controls remain independently focusable and operable.',
      },
    },
  },
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
};
