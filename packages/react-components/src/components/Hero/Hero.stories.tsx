import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import type React from 'react';
import decorativeHeroImage from '../../../../site/assets/ds-home-hero-multi-color.svg?url';
import { Hero, type HeroProps } from './Hero';

type HeroStoryArgs = HeroProps & {
  showImage?: boolean;
  useDecorativeImage?: boolean;
  showPrimaryAction?: boolean;
  showSecondaryAction?: boolean;
};

const heroUsageExample = `import { Hero } from '@ourfuturehealth/react-components';

<Hero
  heading="Design and build digital products at Our Future Health"
  description="Information and guidelines to help everyone design and build consistent products."
  secondaryAction={{ children: 'Get started', href: '/get-started' }}
  primaryAction={{ children: 'View components', href: '/design-system/components' }}
  image={{
    src: 'https://example.com/hero-image.jpg',
    alt: 'Example hero image',
    srcSet: 'https://example.com/hero-image-640.jpg 640w, https://example.com/hero-image-960.jpg 960w',
    sizes: '(min-width: 1020px) 50vw, 100vw',
  }}
/>;
`;

const customDecorationExample = `import { Hero, TilePattern } from '@ourfuturehealth/react-components';

<div className="custom-hero-shell">
  <Hero
    heading="Take part in health research"
    description="Help build a clearer picture of health across the UK."
    showDecoration={false}
  />

  <TilePattern
    className="custom-hero-shell__pattern"
    color="brand"
    tileSize="96px"
    tiles={[
      [1, { type: 2, color: 'transparent' }, 5],
      [null, { type: 8, color: 'accent' }, 12],
    ]}
  />
</div>;
`;

const defaultImage = {
  src: 'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg',
  alt: 'Picture of allergic conjunctivitis',
  srcSet:
    'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-640x427.jpg 640w, https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-767x511.jpg 767w',
  sizes: '(min-width: 1020px) 50vw, 100vw',
};

const disabledControls = {
  controls: {
    disable: true,
  },
};

const StoryInteractionBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const preventNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const anchor = target?.closest('a');

    if (anchor) {
      event.preventDefault();
    }
  };

  return <div onClickCapture={preventNavigation}>{children}</div>;
};

const renderHeroStory = ({
  showImage = true,
  useDecorativeImage = false,
  showPrimaryAction = true,
  showSecondaryAction = true,
  image,
  primaryAction,
  secondaryAction,
  ...args
}: HeroStoryArgs) => (
  <Hero
    {...args}
    image={
      showImage
        ? useDecorativeImage
          ? {
              src: decorativeHeroImage,
              decorative: true,
            }
          : (image ?? defaultImage)
        : undefined
    }
    primaryAction={
      showPrimaryAction
        ? (primaryAction ?? { children: 'View components', href: '/design-system/components' })
        : undefined
    }
    secondaryAction={
      showSecondaryAction
        ? (secondaryAction ?? { children: 'Get started', href: '/get-started' })
        : undefined
    }
  />
);

const meta: Meta<HeroStoryArgs> = {
  title: 'Components/Hero',
  component: Hero,
  decorators: [
    (Story) => (
      <StoryInteractionBoundary>
        <Story />
      </StoryInteractionBoundary>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero is the canonical full-width page introduction for short messaging, optional supporting media, and a tightly limited call-to-action model. It defaults to `theme="brand"`, `variant="free"`, and a semantic `section` root, while still allowing a limited root override for embedding cases.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Keep Hero content simple: a heading, optional description, optional
            secondary text link, optional primary button, and optional media.
            Use the <code>image</code> object for either a single{' '}
            <code>src</code> or responsive <code>srcSet</code> and{' '}
            <code>sizes</code>.
          </p>
          <p>
            When the image is decorative, set <code>decorative</code> to{' '}
            <code>true</code> and leave meaningful alt text out. Hero defaults
            to a <code>section</code> root. Only use the <code>as</code>
            {' '}override when surrounding page structure already supplies the
            right sectioning or landmark semantics.
          </p>
          <p>
            Hero decoration is built with the{' '}
            <a href="/?path=/docs/primitives-tilepattern--docs">
              TilePattern
            </a>{' '}
            primitive. Hero owns the pattern rows, columns, placement and theme
            mapping so each Hero instance keeps the canonical treatment. Use{' '}
            <code>showDecoration</code> to turn decoration off.
          </p>
          <p>
            Keep the default decoration unless the page or product needs a
            deliberately custom treatment. If you need a custom pattern, turn
            Hero decoration off, render a separate <code>TilePattern</code>{' '}
            next to the Hero in the consuming layout, and own the positioning
            CSS in that layout. Pass the exact tile matrix, global colour,
            per-tile colour overrides and tile size needed by the custom
            treatment.
          </p>
          <Source code={customDecorationExample} language="tsx" />
          <Source code={heroUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'theme',
              'variant',
              'heading',
              'headingLevel',
              'description',
              'primaryAction',
              'secondaryAction',
              'image',
              'showDecoration',
              'as',
              'classes',
              'className',
            ]}
          />

          <h2>Builder controls</h2>
          <p>
            The Builder story adds temporary helpers for toggling media and
            actions without editing nested objects. Those helper controls are
            Storybook-only and are not Hero props.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    theme: 'brand',
    variant: 'free',
    heading: 'Design and build digital products at Our Future Health',
    headingLevel: 1,
    description:
      'Information and guidelines to help everyone design and build consistent, highly-considered products and services that put people first.',
    image: defaultImage,
    showDecoration: true,
    as: 'section',
    showImage: true,
    useDecorativeImage: false,
    showPrimaryAction: true,
    showSecondaryAction: true,
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['brand', 'dark'],
      description: 'Hero colour theme.',
    },
    variant: {
      control: 'radio',
      options: ['free', 'boxed'],
      description: 'Hero containment variant.',
    },
    heading: {
      control: 'text',
      description: 'Main hero heading.',
    },
    headingLevel: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Semantic heading level for the Hero title.',
    },
    description: {
      control: 'text',
      description: 'Supporting hero copy.',
    },
    showDecoration: {
      control: 'boolean',
      description:
        'Disables the default decorative treatment when set to false.',
    },
    as: {
      control: 'radio',
      options: ['section', 'div'],
      description:
        'Root element override. Keep the default `section` unless the page structure already supplies the right semantics.',
    },
    image: {
      control: false,
      description:
        'Nested media object with `src`, optional `srcSet`, optional `sizes`, optional `alt`, and optional `decorative`.',
    },
    primaryAction: {
      control: false,
      description:
        'Primary button action. Hero allows at most one primary button.',
    },
    secondaryAction: {
      control: false,
      description:
        'Secondary text-link action. Hero allows at most one secondary action.',
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity escape hatch for extra root classes. Prefer `className` in normal React usage.',
    },
    className: {
      control: false,
      description:
        'Additional root classes for layout and integration hooks.',
    },
    ref: {
      control: false,
      description: 'React ref for the Hero root element.',
    },
    showImage: {
      control: 'boolean',
      description:
        'Storybook-only helper for toggling the media region in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    useDecorativeImage: {
      control: 'boolean',
      description:
        'Storybook-only helper for switching the Builder story to a decorative media example.',
      table: {
        category: 'Builder story only',
      },
    },
    showPrimaryAction: {
      control: 'boolean',
      description:
        'Storybook-only helper for toggling the primary action in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
    showSecondaryAction: {
      control: 'boolean',
      description:
        'Storybook-only helper for toggling the secondary action in the Builder story.',
      table: {
        category: 'Builder story only',
      },
    },
  },
  render: renderHeroStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Brand free',
  parameters: {
    ...disabledControls,
  },
};

export const Builder: Story = {
  parameters: {
    controls: {
      include: [
        'theme',
        'variant',
        'heading',
        'headingLevel',
        'description',
        'showImage',
        'useDecorativeImage',
        'showPrimaryAction',
        'showSecondaryAction',
        'showDecoration',
        'as',
      ],
    },
  },
};

export const DarkFree: Story = {
  args: {
    theme: 'dark',
    heading: 'Take part in health research that helps everyone',
    description:
      'Join Our Future Health to help researchers discover better ways to prevent, detect and treat disease.',
    secondaryAction: {
      children: 'Find out what taking part involves',
      href: '/get-started',
    },
    primaryAction: {
      children: 'Start now',
      href: '/get-started',
    },
    image: defaultImage,
    useDecorativeImage: undefined,
    showPrimaryAction: undefined,
    showSecondaryAction: undefined,
  },
  parameters: {
    ...disabledControls,
  },
};

export const BrandBoxed: Story = {
  args: {
    variant: 'boxed',
    heading: 'Continue your health questionnaire',
    description:
      'Answer questions about your health and lifestyle so researchers can build a clearer picture of health across the UK.',
    secondaryAction: {
      children: 'What you need before you start',
      href: '/get-started',
    },
    primaryAction: {
      children: 'Continue questionnaire',
      href: '/get-started',
    },
    image: defaultImage,
    useDecorativeImage: undefined,
    showPrimaryAction: undefined,
    showSecondaryAction: undefined,
  },
  parameters: {
    ...disabledControls,
  },
};

export const DarkBoxed: Story = {
  args: {
    theme: 'dark',
    variant: 'boxed',
    heading: 'Design principles',
    description:
      'These principles guide all of our design. Use them to get started on a project and to help with making decisions.',
    image: defaultImage,
    secondaryAction: {
      children: 'Read the principles',
      href: '/design-principles',
    },
    primaryAction: {
      children: 'Browse components',
      href: '/design-system/components',
    },
    useDecorativeImage: undefined,
    showPrimaryAction: undefined,
    showSecondaryAction: undefined,
  },
  parameters: {
    ...disabledControls,
  },
};

export const SecondaryActionOnly: Story = {
  args: {
    heading: 'Understand how your information supports research',
    description:
      'Read how Our Future Health protects participant information and makes approved research possible.',
    image: defaultImage,
    secondaryAction: {
      children: 'Read about data protection',
      href: '/get-started',
    },
    useDecorativeImage: undefined,
    showPrimaryAction: false,
    showSecondaryAction: undefined,
  },
  parameters: {
    ...disabledControls,
  },
};

export const NoActions: Story = {
  args: {
    theme: 'dark',
    variant: 'boxed',
    heading: 'Your appointment is confirmed',
    description:
      'We have sent the appointment details to your email address. You can return to your account to review the information at any time.',
    image: defaultImage,
    useDecorativeImage: undefined,
    showPrimaryAction: false,
    showSecondaryAction: false,
  },
  parameters: {
    ...disabledControls,
  },
};

export const TextOnly: Story = {
  args: {
    heading:
      'Use the text-only Hero when the page needs a clear introduction without supporting media.',
    description:
      'This configuration keeps the full-width Hero treatment while removing the media region.',
    image: undefined,
    showImage: false,
    secondaryAction: {
      children: 'Read Hero guidance',
      href: '/design-system/components/hero',
    },
    primaryAction: {
      children: 'View components',
      href: '/design-system/components',
    },
    useDecorativeImage: undefined,
    showPrimaryAction: undefined,
    showSecondaryAction: undefined,
  },
  parameters: {
    ...disabledControls,
  },
};
