import type { Meta, StoryObj } from '@storybook/react-vite';
import iconManifest from '@ourfuturehealth/toolkit/assets/icons/manifest.json';
import { Icon } from './Icon';

const iconNameOptions = iconManifest.icons
  .map(({ name }) => name)
  .sort((left, right) => left.localeCompare(right));

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use Icon to render toolkit sprite icons in React. Choose exactly one sizing mode: `size` for a fixed 16/24/32 icon, or `responsiveSize` to follow the toolkit iconography scale. The responsive scale maps `16` to `16/16/16`, `24` to `16/16/24`, and `32` to `24/24/32` across mobile, tablet, and desktop. Leave `title` empty for decorative icons. Any other SVG props, such as `aria-*`, `data-*`, or event handlers, are passed straight to the rendered `<svg>` element.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Toolkit icon name from the generated sprite manifest. This maps directly to a symbol in `icon-sprite.svg`.',
    },
    size: {
      control: 'radio',
      options: [16, 24, 32],
      description:
        'Fixed icon size. Use this when the icon should stay at 16, 24, or 32 across every breakpoint. Mutually exclusive with `responsiveSize`.',
    },
    responsiveSize: {
      control: 'radio',
      options: [16, 24, 32],
      description:
        'Responsive icon size from the toolkit iconography scale. `16` stays 16 everywhere, `24` becomes 16/16/24, and `32` becomes 24/24/32 across mobile, tablet, and desktop. Mutually exclusive with `size`.',
    },
    title: {
      control: 'text',
      description:
        'Accessible label for meaningful standalone icons. When set, the icon renders with `role="img"`; leave it empty for decorative icons so it stays hidden from assistive technology.',
    },
    color: {
      control: 'color',
      description:
        'Optional color override applied through inline style. Use this for monochrome icons that should not inherit surrounding text colour.',
    },
    className: {
      control: false,
      description:
        'Optional extra classes applied to the `<svg>` element. Use this for component-specific styling hooks or layout adjustments.',
      table: {
        category: 'Advanced',
      },
    },
    style: {
      control: false,
      description:
        'Optional inline SVG styles. This merges with the `color` prop when both are provided.',
      table: {
        category: 'Advanced',
      },
    },
    spritePath: {
      control: false,
      description:
        'Advanced override for the generated icon sprite asset path. In normal app usage this should come from the default toolkit asset import.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the underlying `<svg>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    name: 'Check',
    size: 24,
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {};

export const WithTitle: Story = {
  args: {
    name: 'UnfoldMore',
    title: 'Expand options',
  },
};

export const StaticSizes: Story = {
  render: () => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <Icon name="Check" size={16} />
      <Icon name="Check" size={24} />
      <Icon name="Check" size={32} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ResponsiveScale: Story = {
  args: {
    name: 'Check',
    responsiveSize: 24,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Responsive icons follow the toolkit iconography scale instead of staying fixed. Resize the preview viewport to see `responsiveSize={24}` collapse to 16 on mobile and tablet, then return to 24 on desktop.',
      },
    },
  },
};

export const ResponsiveScaleComparison: Story = {
  render: () => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
    >
      <div>
        <Icon name="Check" responsiveSize={16} />
        <div>16 / 16 / 16</div>
      </div>
      <div>
        <Icon name="Check" responsiveSize={24} />
        <div>16 / 16 / 24</div>
      </div>
      <div>
        <Icon name="Check" responsiveSize={32} />
        <div>24 / 24 / 32</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};
