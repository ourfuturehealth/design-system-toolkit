import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import iconManifest from '@ourfuturehealth/toolkit/assets/icons/manifest.json';
import { Card } from './Card';
import type { TagVariant } from '../Tag';

type CardStoryArgs = ComponentProps<typeof Card> & {
  tagText?: string;
  tagVariant?: TagVariant;
  iconName?: string;
  iconColor?: string;
  metadataItem1Icon?: string;
  metadataItem1Text?: string;
  metadataItem2Icon?: string;
  metadataItem2Text?: string;
  metadataItem3Icon?: string;
  metadataItem3Text?: string;
  actionLinkText?: string;
  actionLinkHref?: string;
};

const tagVariantOptions: TagVariant[] = [
  'neutral',
  'brand',
  'blue',
  'green',
  'yellow',
  'red',
];

const iconNameOptions = iconManifest.icons
  .map(({ name }) => name)
  .sort((left, right) => left.localeCompare(right));

const renderCard = ({
  tagText,
  tagVariant = 'blue',
  iconName,
  iconColor,
  metadataItem1Icon,
  metadataItem1Text,
  metadataItem2Icon,
  metadataItem2Text,
  metadataItem3Icon,
  metadataItem3Text,
  actionLinkText,
  actionLinkHref,
  dismissButton,
  tag,
  icon,
  metadataItems,
  actionLink,
  ...args
}: CardStoryArgs) => {
  const resolvedTag =
    tagText !== undefined
      ? tagText
        ? { children: tagText, variant: tagVariant }
        : undefined
      : tag;
  const resolvedIcon = iconName
    ? {
        ...icon,
        name: iconName,
        size: 32 as const,
        color: iconColor,
      }
    : icon;
  const resolvedMetadataItems =
    metadataItem1Text !== undefined ||
    metadataItem2Text !== undefined ||
    metadataItem3Text !== undefined
      ? [
          metadataItem1Text
            ? {
                icon: metadataItem1Icon ?? 'LocationOutline',
                text: metadataItem1Text,
              }
            : null,
          metadataItem2Text
            ? {
                icon: metadataItem2Icon ?? 'CalendarOutline',
                text: metadataItem2Text,
              }
            : null,
          metadataItem3Text
            ? {
                icon: metadataItem3Icon ?? 'ClockOutline',
                text: metadataItem3Text,
              }
            : null,
        ].filter((item) => item !== null)
      : metadataItems;
  const resolvedActionLink =
    actionLinkText !== undefined || actionLinkHref !== undefined
      ? actionLinkText && actionLinkHref
        ? {
            ...actionLink,
            text: actionLinkText,
            href: actionLinkHref,
          }
        : undefined
      : actionLink;

  return (
    <div style={{ maxWidth: '32rem' }}>
      <Card
        {...args}
        dismissButton={dismissButton}
        tag={resolvedTag}
        icon={resolvedIcon}
        metadataItems={resolvedMetadataItems}
        actionLink={resolvedActionLink}
      />
    </div>
  );
};

const meta: Meta<CardStoryArgs> = {
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
        'Optional trailing icon shown to the right of the card content. The card keeps this slot at a fixed 32px size. Monochrome icons can be tinted with `icon.color`, while icons with baked-in fills keep their own colours.',
    },
    dismissButton: {
      control: false,
      description:
        'Optional dismiss button configuration. This renders a close button in the card top-right corner. The label is announced to assistive technology, but does not change the visible icon.',
    },
    number: {
      control: 'text',
      description:
        'Large numeric value used in dashboard-style cards where the number is the main message.',
    },
    tag: {
      control: 'object',
      description:
        'Optional contextual tag shown above the body copy. This uses the React `Tag` API, for example `children`, `variant`, and `className`.',
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
  render: renderCard,
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
  render: renderCard,
};

export const BasicWithIcon: Story = {
  args: {
    heading: 'Profile complete',
    description: 'You’ve completed all the required profile details.',
    iconName: 'Check',
    iconColor: '#00725F',
  },
  argTypes: {
    icon: {
      control: false,
      table: {
        disable: true,
      },
    },
    iconName: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Glyph name for the fixed 32px trailing icon slot.',
    },
    iconColor: {
      control: 'color',
      description:
        'Colour applied to monochrome icons in the trailing slot. Icons with baked-in fills may ignore it.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the `icon` prop to add a supporting icon to a basic card. Success is one common use, but the same pattern can support other short icon-led messages too. This story lets you swap the glyph and tint monochrome icons, while the Card component keeps the trailing icon slot at its built-in 32px size.',
      },
    },
  },
  render: renderCard,
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
    tagText: 'New',
    tagVariant: 'blue',
    description:
      'A quick guide for people who have care and support needs and their carers.',
    metadataItem1Icon: 'LocationOutline',
    metadataItem1Text: 'Online',
    metadataItem2Icon: 'CalendarOutline',
    metadataItem2Text: 'Updated today',
    metadataItem3Icon: 'ClockOutline',
    metadataItem3Text: '5 minute read',
    helperText: 'Recommended for new participants.',
    iconName: 'ArrowCircleRightColour',
    iconColor: '#FFC62C',
  },
  argTypes: {
    tag: {
      control: false,
      table: {
        disable: true,
      },
    },
    tagText: {
      control: 'text',
      description: 'Text content for the supporting tag.',
    },
    tagVariant: {
      control: 'select',
      options: tagVariantOptions,
      description: 'Visual style variant for the tag.',
    },
    icon: {
      control: false,
      table: {
        disable: true,
      },
    },
    metadataItems: {
      control: false,
      table: {
        disable: true,
      },
    },
    metadataItem1Icon: {
      control: 'select',
      options: iconNameOptions,
      description: 'Icon for the first metadata row.',
    },
    metadataItem1Text: {
      control: 'text',
      description: 'Text for the first metadata row.',
    },
    metadataItem2Icon: {
      control: 'select',
      options: iconNameOptions,
      description: 'Icon for the second metadata row.',
    },
    metadataItem2Text: {
      control: 'text',
      description: 'Text for the second metadata row.',
    },
    metadataItem3Icon: {
      control: 'select',
      options: iconNameOptions,
      description: 'Icon for the third metadata row.',
    },
    metadataItem3Text: {
      control: 'text',
      description: 'Text for the third metadata row.',
    },
    iconName: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Trailing icon glyph from the toolkit icon set.',
    },
    iconColor: {
      control: 'color',
      description:
        'Colour applied to monochrome trailing icons. Icons with baked-in fills, such as `ArrowCircleRightColour`, may ignore it.',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story exposes simpler controls for the nested tag, metadata rows, and trailing icon props. The tag can be edited as text plus variant, the metadata rows can be edited without raw JSON, and the trailing icon control lets you change the glyph and tint monochrome icons while the Card component keeps that slot at its built-in 32px size.',
      },
    },
  },
  render: renderCard,
};

export const ClickableNumeric: Story = {
  args: {
    variant: 'clickable',
    number: '12',
    actionLinkText: 'Open tasks',
    actionLinkHref: '#card-numeric',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story uses simple text controls for the numeric action link instead of exposing the nested `actionLink` object directly.',
      },
    },
  },
  argTypes: {
    actionLink: {
      control: false,
      table: {
        disable: true,
      },
    },
    actionLinkText: {
      control: 'text',
      description: 'Link text for the numeric card action.',
    },
    actionLinkHref: {
      control: 'text',
      description: 'Destination for the numeric card action link.',
    },
  },
  render: ({
    actionLinkText,
    actionLinkHref,
    actionLink,
    ...args
  }) => {
    const resolvedActionLink =
      actionLinkText && actionLinkHref
        ? {
            ...actionLink,
            text: actionLinkText,
            href: actionLinkHref,
          }
        : undefined;

    return (
      <div style={{ maxWidth: '20rem' }}>
        <Card {...args} actionLink={resolvedActionLink} />
      </div>
    );
  },
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
