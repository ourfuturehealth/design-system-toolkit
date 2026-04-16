import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
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

const cardUsageExample = `import { Card } from '@ourfuturehealth/react-components';

<Card
  description="Go to 111.nhs.uk or call 111 for urgent help that does not need emergency care."
  heading="If you need help now, but it’s not an emergency"
/>;
`;

const cardNestedPropsExample = `const tag = {
  children: 'New',
  variant: 'blue',
};

const metadataItems = [
  { icon: 'LocationOutline', text: 'Online' },
  { icon: 'CalendarOutline', text: 'Updated today' },
];

const actionLink = {
  text: 'Open tasks',
  href: '/tasks',
};
`;

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
          'Use a card to present short, scannable summaries of content, status or next steps. `headingLevel` changes the semantic heading tag used for the card title, but does not change the visual styling on its own. The React component mirrors the toolkit Card family markup and classes. Storybook-only helper args such as `tagText`, `iconName`, and `metadataItem1Text` exist only to make the Builder story easier to use and are not part of `CardProps`.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>Card</code> for short, scannable summaries of content,
            status, or next steps. Pass the main title through <code>heading</code>{' '}
            and the supporting copy through <code>description</code>.
          </p>
          <p>
            Add <code>href</code> and set <code>variant="clickable"</code> when
            the card should behave like a linked summary. Add nested props like{' '}
            <code>tag</code>, <code>metadataItems</code>, and{' '}
            <code>actionLink</code> only when the card needs those extra parts.
          </p>
          <Source code={cardUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'variant',
              'heading',
              'headingLevel',
              'description',
              'href',
              'number',
              'tag',
              'metadataItems',
              'helperText',
              'actionLink',
              'imgURL',
              'imgALT',
            ]}
          />

          <h2>Common nested prop shapes</h2>
          <p>
            When you need richer card content, these are the main nested object
            shapes used by the React API:
          </p>
          <Source code={cardNestedPropsExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>tagText</code>, <code>tagVariant</code>, <code>iconName</code>,{' '}
            <code>iconColor</code>, <code>metadataItem1Text</code>, and the
            related metadata/action helper args are only used by the Storybook{' '}
            <code>Builder</code> story. They exist to make the card easier to
            explore without editing nested JSON, and they are not React props
            accepted by <code>Card</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['basic', 'clickable'],
      description:
        'Changes the card behavior. `basic` is a static content card. `clickable` keeps a real link inside the card and expands the card hit area to that primary link.',
      table: {
        category: 'CardProps',
      },
    },
    heading: {
      control: 'text',
      description:
        'Main heading content for the card. This is usually the most prominent text and can include a link when `href` is provided.',
      table: {
        category: 'CardProps',
      },
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
      table: {
        category: 'CardProps',
      },
    },
    description: {
      control: 'text',
      description: 'Plain text body copy shown below the heading.',
      table: {
        category: 'CardProps',
      },
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
      table: {
        category: 'CardProps',
      },
    },
    icon: {
      control: 'object',
      description:
        'Optional trailing icon shown to the right of the card content. The card keeps this slot at a fixed 32px size. Monochrome icons can be tinted with `icon.color`, while icons with baked-in fills keep their own colours.',
      table: {
        category: 'CardProps',
      },
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
      table: {
        category: 'CardProps',
      },
    },
    tag: {
      control: 'object',
      description:
        'Optional contextual tag shown above the body copy. This uses the React `Tag` API, for example `children`, `variant`, and `className`.',
      table: {
        category: 'CardProps',
      },
    },
    metadataItems: {
      control: 'object',
      description:
        'Optional metadata rows with an icon and text, used for supporting details like location, date, or reading time.',
      table: {
        category: 'CardProps',
      },
    },
    helperText: {
      control: 'text',
      description:
        'Supporting helper text shown after the main body and metadata.',
      table: {
        category: 'CardProps',
      },
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
      table: {
        category: 'CardProps',
      },
    },
    imgURL: {
      control: 'text',
      description: 'Optional image shown at the top of the card.',
      table: {
        category: 'CardProps',
      },
    },
    imgALT: {
      control: 'text',
      description:
        'Alternative text for the image. Use an empty string when the image is decorative.',
      table: {
        category: 'CardProps',
      },
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

export const Default: Story = {
  args: {
    heading: 'If you need help now, but it’s not an emergency',
    description:
      'Go to 111.nhs.uk or call 111 for urgent help that does not need emergency care.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic basic card example. Use this as the first thing to copy when you need a short summary card.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <Card {...args} />
    </div>
  ),
};

export const Builder: Story = {
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
  parameters: {
    controls: {
      include: [
        'variant',
        'heading',
        'href',
        'description',
        'tagText',
        'tagVariant',
        'metadataItem1Icon',
        'metadataItem1Text',
        'metadataItem2Icon',
        'metadataItem2Text',
        'metadataItem3Icon',
        'metadataItem3Text',
        'helperText',
        'iconName',
        'iconColor',
      ],
    },
    docs: {
      description: {
        story:
          'Use the Builder story to try the Card API interactively. It keeps the complex nested props behind simple text, select, and color controls so you can explore the component without editing raw JSON.',
      },
    },
  },
  render: renderCard,
};

export const BasicDismissible: Story = {
  args: {
    heading: 'Update available',
    description: 'A newer version of this content is available for review.',
    dismissButton: {
      label: 'Dismiss update message',
    },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Fixed showcase of a dismissible card.',
      },
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
  parameters: {
    controls: {
      disable: true,
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed showcase of a basic card with a supporting trailing icon.',
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
  parameters: {
    controls: {
      disable: true,
    },
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
      table: {
        disable: true,
      },
    },
    tagVariant: {
      control: 'select',
      options: tagVariantOptions,
      description: 'Visual style variant for the tag.',
      table: {
        disable: true,
      },
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
      table: {
        disable: true,
      },
    },
    metadataItem1Text: {
      control: 'text',
      description: 'Text for the first metadata row.',
      table: {
        disable: true,
      },
    },
    metadataItem2Icon: {
      control: 'select',
      options: iconNameOptions,
      description: 'Icon for the second metadata row.',
      table: {
        disable: true,
      },
    },
    metadataItem2Text: {
      control: 'text',
      description: 'Text for the second metadata row.',
      table: {
        disable: true,
      },
    },
    metadataItem3Icon: {
      control: 'select',
      options: iconNameOptions,
      description: 'Icon for the third metadata row.',
      table: {
        disable: true,
      },
    },
    metadataItem3Text: {
      control: 'text',
      description: 'Text for the third metadata row.',
      table: {
        disable: true,
      },
    },
    iconName: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Trailing icon glyph from the toolkit icon set.',
      table: {
        disable: true,
      },
    },
    iconColor: {
      control: 'color',
      description:
        'Colour applied to monochrome trailing icons. Icons with baked-in fills, such as `ArrowCircleRightColour`, may ignore it.',
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed showcase of a clickable card with nested content, metadata, and a trailing icon.',
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed showcase of a numeric action card. Use it to see how the action link sits with the large number treatment.',
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
      table: {
        disable: true,
      },
    },
    actionLinkHref: {
      control: 'text',
      description: 'Destination for the numeric card action link.',
      table: {
        disable: true,
      },
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
  parameters: {
    controls: {
      disable: true,
    },
  },
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
