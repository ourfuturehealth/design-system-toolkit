import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image, type ImageProps } from './Image';

const demoSrc =
  'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg';
const demoSrcSet =
  'https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-640x427.jpg 640w, https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-767x511.jpg 767w';

const meta: Meta<ImageProps> = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Image presents responsive content imagery with an optional caption in the same layout as the toolkit figure component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Source URL for the image.',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the image.',
    },
    caption: {
      control: 'text',
      description: 'Optional caption shown below the image.',
    },
    sizes: {
      control: 'text',
      description: 'Responsive `sizes` attribute used with `srcSet`.',
    },
    srcSet: {
      control: 'text',
      description: 'Responsive `srcSet` attribute for the image.',
    },
    srcset: {
      control: false,
      description:
        'Toolkit-style alias for `srcSet`. Prefer `srcSet` in React-first usage.',
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
      description: 'Adds extra classes to the root `<figure>` element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<figure>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    src: demoSrc,
    alt: 'Picture of allergic conjunctivitis',
    caption: 'Itchy, red, watering eyes.',
    sizes: '(min-width: 1020px) 320px, (min-width: 768px) 50vw, 100vw',
    srcSet: demoSrcSet,
  },
};

export default meta;
type Story = StoryObj<ImageProps>;

export const Default: Story = {};

export const WithoutCaption: Story = {
  args: {
    caption: undefined,
  },
};
