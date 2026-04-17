import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArgTypes,
  Description,
  Source,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks';
import { Image, type ImageProps } from './Image';

const demoSrc =
  'https://assets.nhs.uk/prod/images/S_0318_Bullous_pemphigoid_lesions_.2e16d0ba.fill-320x213.jpg';
const demoAlt =
  "Lots of sore red patches with small blisters spread across white skin on a woman's chest.";
const demoCaption = 'It can affect large areas of the body or limbs.';
const responsiveDemoSrc =
  'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg';
const responsiveDemoAlt = 'Picture of allergic conjunctivitis';
const responsiveDemoCaption = 'Itchy, red, watering eyes.';
const responsiveDemoSrcSet =
  'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-640x427.jpg 640w, https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-767x511.jpg 767w';
const responsiveDemoSizes =
  '(min-width: 1020px) 320px, (min-width: 768px) 50vw, 100vw';

type ImageStoryArgs = ImageProps & {
  showCaption?: boolean;
  captionText?: string;
  useResponsiveSources?: boolean;
};

const defaultImageSource = `import { Image } from '@ourfuturehealth/react-components';

<Image
  src="${demoSrc}"
  alt="${demoAlt}"
  caption="${demoCaption}"
/>;
`;

const responsiveImageSource = `import { Image } from '@ourfuturehealth/react-components';

<Image
  src="${responsiveDemoSrc}"
  alt="${responsiveDemoAlt}"
  caption="${responsiveDemoCaption}"
  sizes="${responsiveDemoSizes}"
  srcSet="${responsiveDemoSrcSet}"
/>;
`;

const withoutCaptionSource = `import { Image } from '@ourfuturehealth/react-components';

<Image
  src="${responsiveDemoSrc}"
  alt="${responsiveDemoAlt}"
/>;
`;

const renderImageStory = ({
  showCaption = true,
  captionText = demoCaption,
  useResponsiveSources = false,
  ...args
}: ImageStoryArgs) => (
  <Image
    {...args}
    caption={showCaption ? captionText : undefined}
    sizes={useResponsiveSources ? responsiveDemoSizes : undefined}
    srcSet={useResponsiveSources ? responsiveDemoSrcSet : undefined}
  />
);

const meta: Meta<ImageStoryArgs> = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Image presents content imagery with an optional caption in the same layout as the toolkit figure component. Most React consumers only need to pass `src` and `alt`, then add `caption` when users need a short conclusion below the image. The responsive-image props are only needed when you already have multiple image files for the same picture.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass the required <code>src</code> and <code>alt</code> props for
            every image. Add an optional <code>caption</code> when users need a
            short explanation or conclusion below the image.
          </p>
          <p>
            If you only have one image URL, stop there and leave the responsive
            props out. Only add <code>sizes</code> and <code>srcSet</code> when
            you already have multiple files for the same image and want the
            browser to choose the best one.
          </p>
          <Source code={defaultImageSource} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'src',
              'alt',
              'caption',
              'sizes',
              'srcSet',
              'classes',
              'className',
            ]}
          />

          <h2>Responsive image sources</h2>
          <p>
            These props work together. <code>srcSet</code> lists the available
            image files, and <code>sizes</code> tells the browser roughly how
            much space the image will take up in the layout so it can pick the
            right file.
          </p>
          <p>
            In React, use the camel-case <code>srcSet</code> prop. The toolkit
            Nunjucks macro uses the lower-case HTML attribute name{' '}
            <code>srcset</code>, but React consumers do not need a separate
            prop for that.
          </p>
          <Source code={responsiveImageSource} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>showCaption</code>, <code>captionText</code>, and{' '}
            <code>useResponsiveSources</code> are only used by the Storybook{' '}
            <code>Builder</code> story to make the component easier to explore.
            They are not props accepted by <code>Image</code>.
          </p>

          <Stories title="Examples" />

          <h2>Example source</h2>
          <Source code={defaultImageSource} language="tsx" />
          <Source code={withoutCaptionSource} language="tsx" />
          <Source code={responsiveImageSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showCaption: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Shows or hides the caption below the image.',
      table: {
        category: 'Builder story only',
      },
    },
    captionText: {
      control: 'text',
      description:
        'Builder-only Storybook helper. Sets the caption text when the caption is enabled.',
      table: {
        category: 'Builder story only',
      },
    },
    useResponsiveSources: {
      control: 'boolean',
      description:
        'Builder-only Storybook helper. Toggles the example `sizes` and `srcSet` values on and off.',
      table: {
        category: 'Builder story only',
      },
    },
    src: {
      control: 'text',
      description: 'Required source URL for the image file.',
      table: {
        category: 'ImageProps',
      },
    },
    alt: {
      control: 'text',
      description:
        'Required alternative text that describes the information carried by the image.',
      table: {
        category: 'ImageProps',
      },
    },
    caption: {
      control: false,
      description:
        'Optional caption shown below the image when users need a short explanation or conclusion.',
      table: {
        category: 'ImageProps',
      },
    },
    sizes: {
      control: false,
      description:
        'Optional responsive image hint used together with `srcSet`. Most consumers can ignore this unless they already have multiple image files for the same picture.',
      table: {
        category: 'ImageProps',
      },
    },
    srcSet: {
      control: false,
      description:
        'Optional responsive image list. Use this when you have multiple versions of the same image and want the browser to choose the most appropriate one.',
      table: {
        category: 'ImageProps',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity escape hatch for extra root classes. Most React consumers should ignore this and use `className` instead.',
      table: {
        category: 'ImageProps',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root `<figure>` element. Use this for layout or integration hooks when you need to target the component from your app.',
      table: {
        category: 'ImageProps',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<figure>` element. Use this only when you need direct access to the rendered DOM node.',
      table: {
        category: 'ImageProps',
      },
    },
  },
  args: {
    src: demoSrc,
    alt: demoAlt,
    showCaption: true,
    captionText: demoCaption,
    useResponsiveSources: false,
  },
  render: renderImageStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Image
      src={demoSrc}
      alt={demoAlt}
      caption={demoCaption}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic default image example with a caption beneath the figure.',
      },
      source: {
        code: defaultImageSource,
      },
    },
  },
};

export const Builder: Story = {
  parameters: {
    controls: {
      include: [
        'src',
        'alt',
        'showCaption',
        'captionText',
        'useResponsiveSources',
      ],
    },
  },
};

export const WithoutCaption: Story = {
  render: () => (
    <Image
      src={responsiveDemoSrc}
      alt={responsiveDemoAlt}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example without a caption, for cases where the surrounding content already explains the image clearly enough.',
      },
      source: {
        code: withoutCaptionSource,
      },
    },
  },
};

export const ResponsiveSources: Story = {
  render: () => (
    <Image
      src={responsiveDemoSrc}
      alt={responsiveDemoAlt}
      caption={responsiveDemoCaption}
      sizes={responsiveDemoSizes}
      srcSet={responsiveDemoSrcSet}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A fixed example showing the responsive `sizes` and `srcSet` path for content images.',
      },
      source: {
        code: responsiveImageSource,
      },
    },
  },
};
