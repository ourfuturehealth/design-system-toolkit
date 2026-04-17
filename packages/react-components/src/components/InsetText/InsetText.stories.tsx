import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArgTypes,
  Description,
  Source,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks';
import {
  InsetText,
  type InsetTextBackground,
  type InsetTextProps,
  type InsetTextVariant,
} from './InsetText';

const variants: InsetTextVariant[] = ['info', 'success', 'warning', 'error'];
const backgrounds: InsetTextBackground[] = ['grey', 'yellow', 'blue'];

type InsetTextStoryArgs = InsetTextProps & {
  showHeading?: boolean;
  contentMode?: 'text' | 'html';
  showActionLink?: boolean;
  actionLinkText?: string;
  actionLinkHref?: string;
};

const defaultInsetTextSource = `import { InsetText } from '@ourfuturehealth/react-components';

<InsetText
  heading="Information"
  variant="info"
  background="grey"
  text="You can report any suspected side effect to the Yellow Card safety scheme."
  actionLink={{
    text: 'Report a side effect',
    href: '#report-a-side-effect',
  }}
/>;
`;

const withoutHeadingSource = `import { InsetText } from '@ourfuturehealth/react-components';

<InsetText
  variant="warning"
  background="yellow"
  text="Bring your invitation letter with you on the day."
  actionLink={{
    text: 'View preparation guidance',
    href: '#view-preparation-guidance',
  }}
/>;
`;

const htmlContentSource = `import { InsetText } from '@ourfuturehealth/react-components';

<InsetText
  heading="Information"
  variant="info"
  background="blue"
  html='<p>You can report any suspected side effect to the <a href="https://yellowcard.mhra.gov.uk/">Yellow Card safety scheme</a>.</p>'
  actionLink={{
    text: 'Read more',
    href: '#read-more',
  }}
/>;
`;

const actionLinkShapeSource = `type InsetTextActionLink = {
  text: React.ReactNode;
  href: string;
  attributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
};

const actionLink = {
  text: 'Report a side effect',
  href: '#report-a-side-effect',
  attributes: {
    target: '_blank',
    rel: 'noreferrer',
  },
};
`;

const renderBuilderStory = ({
  showHeading = true,
  heading = 'Information',
  contentMode = 'text',
  showActionLink = true,
  actionLinkText = 'Report a side effect',
  actionLinkHref = '#report-a-side-effect',
  text = 'You can report any suspected side effect to the Yellow Card safety scheme.',
  ...args
}: InsetTextStoryArgs) => (
  <InsetText
    {...args}
    heading={showHeading ? heading : undefined}
    text={contentMode === 'text' ? text : undefined}
    html={
      contentMode === 'html'
        ? '<p>You can report any suspected side effect to the <a href="https://yellowcard.mhra.gov.uk/">Yellow Card safety scheme</a>.</p>'
        : undefined
    }
    actionLink={
      showActionLink
        ? {
            text: actionLinkText,
            href: actionLinkHref,
          }
        : undefined
    }
  />
);

const meta: Meta<InsetTextStoryArgs> = {
  title: 'Components/Inset text',
  component: InsetText,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inset Text highlights short supporting information with a semantic feedback border, a background option, and an optional heading and action link. In React, the common path is to pass `text` for simple copy and `actionLink` when you want one clear next step. Use `html` or `headingHtml` only when you need trusted inline markup.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Start with plain-text content by passing <code>text</code>. Add an
            optional <code>heading</code> when the message needs a visible label,
            choose the <code>variant</code> and <code>background</code> that fit
            the message, and pass <code>actionLink</code> when you want one clear
            next step below the copy.
          </p>
          <p>
            Only reach for <code>html</code> or <code>headingHtml</code> when the
            content needs trusted inline markup such as a link inside the body.
          </p>
          <Source code={defaultInsetTextSource} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'heading',
              'headingHtml',
              'headingLevel',
              'variant',
              'background',
              'text',
              'html',
              'actionLink',
              'visuallyHiddenText',
              'classes',
              'className',
            ]}
          />

          <h2>
            <code>actionLink</code> shape
          </h2>
          <p>
            Pass a single action link object when the inset text should offer one
            clear next step. The optional <code>attributes</code> field lets you
            forward standard anchor attributes such as <code>target</code>,{' '}
            <code>rel</code>, or analytics hooks.
          </p>
          <Source code={actionLinkShapeSource} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>showHeading</code>, <code>contentMode</code>,{' '}
            <code>showActionLink</code>, <code>actionLinkText</code>, and{' '}
            <code>actionLinkHref</code> are only used by the Storybook{' '}
            <code>Builder</code> story to make the component easier to explore.
            They are not props accepted by <code>InsetText</code>.
          </p>

          <Stories title="Examples" />

          <h2>Example source</h2>
          <Source code={defaultInsetTextSource} language="tsx" />
          <Source code={withoutHeadingSource} language="tsx" />
          <Source code={htmlContentSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showHeading: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Shows or hides the visible heading.',
      table: {
        category: 'Builder story only',
      },
    },
    contentMode: {
      control: 'radio',
      options: ['text', 'html'],
      description:
        'Builder-only Storybook helper. Chooses between the plain-text body and the rich-text HTML example.',
      table: {
        category: 'Builder story only',
      },
    },
    showActionLink: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Shows or hides the action link row.',
      table: {
        category: 'Builder story only',
      },
    },
    actionLinkText: {
      control: 'text',
      description:
        'Builder-only Storybook helper. Sets the visible label when the action link is enabled.',
      table: {
        category: 'Builder story only',
      },
    },
    actionLinkHref: {
      control: 'text',
      description:
        'Builder-only Storybook helper. Sets the href when the action link is enabled.',
      table: {
        category: 'Builder story only',
      },
    },
    heading: {
      control: 'text',
      description:
        'Optional visible heading shown above the body copy, such as Information or Warning.',
      table: {
        category: 'InsetTextProps',
      },
    },
    headingHtml: {
      control: false,
      description:
        'Trusted HTML for the heading contents. Use this only when the heading itself needs inline markup.',
      table: {
        category: 'InsetTextProps',
      },
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description:
        'Semantic heading level for the optional heading. This does not change the visual styling.',
      table: {
        category: 'InsetTextProps',
      },
    },
    variant: {
      control: 'select',
      options: variants,
      description:
        'Feedback border variant. Use info for neutral support, success for confirmation, warning for caution, and error for serious problems.',
      table: {
        category: 'InsetTextProps',
      },
    },
    background: {
      control: 'select',
      options: backgrounds,
      description:
        'Background variant behind the inset text body. Choose the one that fits the surrounding layout.',
      table: {
        category: 'InsetTextProps',
      },
    },
    text: {
      control: 'text',
      description:
        'Plain-text body content for the common case. Use this instead of `html` when the message does not need inline markup.',
      table: {
        category: 'InsetTextProps',
      },
    },
    html: {
      control: false,
      description:
        'Trusted HTML body content. Use this only when the inset text body needs inline markup such as links.',
      table: {
        category: 'InsetTextProps',
      },
    },
    actionLink: {
      control: false,
      description:
        'Optional action link object with `text`, `href`, and optional anchor `attributes`.',
      table: {
        category: 'InsetTextProps',
        type: {
          summary: 'InsetTextActionLink',
        },
      },
    },
    visuallyHiddenText: {
      control: 'text',
      description:
        'Optional override for the hidden accessible prefix. This is usually only needed when there is no visible heading and you want to override the default message type.',
      table: {
        category: 'InsetTextProps',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity escape hatch for extra root classes. Most React consumers should ignore this and use `className` instead.',
      table: {
        category: 'InsetTextProps',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root `<div>` element. Use this for layout or integration hooks when you need to target the component from your app.',
      table: {
        category: 'InsetTextProps',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<div>` element. Use this only when you need direct access to the rendered DOM node.',
      table: {
        category: 'InsetTextProps',
      },
    },
  },
  args: {
    showHeading: true,
    heading: 'Information',
    headingLevel: 3,
    variant: 'info',
    background: 'grey',
    contentMode: 'text',
    text: 'You can report any suspected side effect to the Yellow Card safety scheme.',
    showActionLink: true,
    actionLinkText: 'Report a side effect',
    actionLinkHref: '#report-a-side-effect',
  },
  render: renderBuilderStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InsetText
      heading="Information"
      variant="info"
      background="grey"
      text="You can report any suspected side effect to the Yellow Card safety scheme."
      actionLink={{
        text: 'Report a side effect',
        href: '#report-a-side-effect',
      }}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic default inset text example with a visible heading, plain-text body copy, and one action link.',
      },
      source: {
        code: defaultInsetTextSource,
      },
    },
  },
};

export const Builder: Story = {
  parameters: {
    controls: {
      include: [
        'showHeading',
        'heading',
        'headingLevel',
        'variant',
        'background',
        'contentMode',
        'text',
        'showActionLink',
        'actionLinkText',
        'actionLinkHref',
      ],
    },
  },
};

export const WithoutHeading: Story = {
  render: () => (
    <InsetText
      variant="warning"
      background="yellow"
      text="Bring your invitation letter with you on the day."
      actionLink={{
        text: 'View preparation guidance',
        href: '#view-preparation-guidance',
      }}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example without a visible heading, relying on the hidden accessible prefix instead.',
      },
      source: {
        code: withoutHeadingSource,
      },
    },
  },
};

export const HtmlContent: Story = {
  render: () => (
    <InsetText
      heading="Information"
      variant="info"
      background="blue"
      html='<p>You can report any suspected side effect to the <a href="https://yellowcard.mhra.gov.uk/">Yellow Card safety scheme</a>.</p>'
      actionLink={{
        text: 'Read more',
        href: '#read-more',
      }}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example that uses trusted HTML for inline rich-text content inside the body copy.',
      },
      source: {
        code: htmlContentSource,
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '35rem' }}>
      {backgrounds.flatMap((background) =>
        variants.map((variant) => (
          <InsetText
            key={`${background}-${variant}`}
            heading={
              variant === 'info'
                ? 'Information'
                : variant[0].toUpperCase() + variant.slice(1)
            }
            variant={variant}
            background={background}
            text="Short supporting information that matches the selected border and background."
            actionLink={{
              text: 'Read more',
              href: '#read-more',
            }}
          />
        )),
      )}
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed showcase of all border and background combinations so consumers can compare the available variants.',
      },
    },
  },
};
