import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InsetText,
  type InsetTextBackground,
  type InsetTextProps,
  type InsetTextVariant,
} from './InsetText';

const variants: InsetTextVariant[] = ['info', 'success', 'warning', 'error'];
const backgrounds: InsetTextBackground[] = ['grey', 'yellow', 'blue'];

const meta: Meta<InsetTextProps> = {
  title: 'Components/InsetText',
  component: InsetText,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inset Text highlights short supporting information with a semantic feedback border, one of three background options, and optional heading and action-link slots.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    heading: {
      control: 'text',
      description: 'Optional heading shown above the body content.',
    },
    headingHtml: {
      control: false,
      description:
        'Trusted HTML for the heading contents. When this is provided, it replaces `heading`.',
      table: {
        category: 'Advanced',
      },
    },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description:
        'Semantic heading level for the optional heading. This does not change the visual styling.',
    },
    variant: {
      control: 'select',
      options: variants,
      description: 'Feedback border variant: info, success, warning, or error.',
    },
    background: {
      control: 'select',
      options: backgrounds,
      description: 'Background variant: grey, yellow, or blue.',
    },
    html: {
      control: false,
      description:
        'Trusted HTML body content. When this is provided, it replaces `text`.',
      table: {
        category: 'Advanced',
      },
    },
    text: {
      control: 'text',
      description: 'Plain text body content shown inside the inset text.',
    },
    actionLink: {
      control: false,
      description:
        'Optional action link with `text`, `href`, and optional anchor attributes.',
      table: {
        category: 'Advanced',
      },
    },
    visuallyHiddenText: {
      control: 'text',
      description:
        'Optional override for the hidden accessible prefix. By default this is only added when there is no visible heading.',
      table: {
        category: 'Advanced',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity alias for extra root classes. Prefer `className` in React-first usage.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description: 'Adds extra classes to the root `<div>` element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<div>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    heading: 'Information',
    variant: 'info',
    background: 'grey',
    text: 'You can report any suspected side effect to the Yellow Card safety scheme.',
    actionLink: {
      text: 'Report a side effect',
      href: '#report-a-side-effect',
    },
  },
};

export default meta;
type Story = StoryObj<InsetTextProps>;

export const Default: Story = {};

export const WithoutHeading: Story = {
  args: {
    heading: undefined,
    variant: 'warning',
    background: 'yellow',
    text: 'Bring your invitation letter with you on the day.',
    actionLink: {
      text: 'View preparation guidance',
      href: '#view-preparation-guidance',
    },
  },
};

export const HtmlContent: Story = {
  args: {
    heading: 'Information',
    background: 'blue',
    html: '<p>You can report any suspected side effect to the <a href="https://yellowcard.mhra.gov.uk/">Yellow Card safety scheme</a>.</p>',
    actionLink: {
      text: 'Read more',
      href: '#read-more',
    },
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
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
};
