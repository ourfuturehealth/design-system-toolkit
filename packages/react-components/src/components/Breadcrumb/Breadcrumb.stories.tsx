import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from './Breadcrumb';

type BreadcrumbPreset = 'default' | 'deep-trail' | 'ancestors-only';

type BreadcrumbStoryArgs = BreadcrumbProps & {
  trailPreset?: BreadcrumbPreset;
  currentText?: string;
  showCurrent?: boolean;
};

const defaultItems: BreadcrumbItem[] = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
];

const deepTrailItems: BreadcrumbItem[] = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
  {
    text: 'Skin problems',
    href: '/health-a-to-z/conditions/skin-problems',
  },
  {
    text: 'Dry skin',
    href: '/health-a-to-z/conditions/skin-problems/dry-skin',
  },
  {
    text: 'Treatments',
    href: '/health-a-to-z/conditions/skin-problems/dry-skin/treatments',
  },
];

const presetItems: Record<BreadcrumbPreset, BreadcrumbItem[]> = {
  default: defaultItems,
  'deep-trail': deepTrailItems,
  'ancestors-only': defaultItems,
};

const usageExample = `import { Breadcrumb } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
];

<Breadcrumb
  items={items}
  current={{
    text: 'Eczema',
    href: '/health-a-to-z/conditions/eczema',
  }}
/>;
`;

const itemsShapeExample = `type BreadcrumbItem = {
  text: React.ReactNode;
  href?: string;
  anchorProps?: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>;
};
`;

const currentShapeExample = `type BreadcrumbProps = {
  items: BreadcrumbItem[];
  current?: BreadcrumbItem;
  classes?: string;
  className?: string;
};
`;

const defaultSource = `import { Breadcrumb } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
];

<Breadcrumb
  items={items}
  current={{
    text: 'Eczema',
    href: '/health-a-to-z/conditions/eczema',
  }}
/>;
`;

const deepTrailSource = `import { Breadcrumb } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
  {
    text: 'Skin problems',
    href: '/health-a-to-z/conditions/skin-problems',
  },
  {
    text: 'Dry skin',
    href: '/health-a-to-z/conditions/skin-problems/dry-skin',
  },
  {
    text: 'Treatments',
    href: '/health-a-to-z/conditions/skin-problems/dry-skin/treatments',
  },
];

<Breadcrumb
  items={items}
  current={{
    text: 'Ointments',
    href: '/health-a-to-z/conditions/skin-problems/dry-skin/treatments/ointments',
  }}
/>;
`;

const ancestorsOnlySource = `import { Breadcrumb } from '@ourfuturehealth/react-components';

const items = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
];

<Breadcrumb items={items} />;
`;

const renderBreadcrumb = ({
  trailPreset = 'default',
  showCurrent = true,
  currentText = 'Eczema',
  items,
  current,
  ...props
}: BreadcrumbStoryArgs) => {
  const resolvedItems = items ?? presetItems[trailPreset];
  const resolvedCurrent =
    current ??
    (showCurrent
      ? {
          text: currentText,
          href: `/health-a-to-z/conditions/${currentText.toLowerCase().replace(/\s+/g, '-')}`,
        }
      : undefined);

  return (
    <Breadcrumb
      {...props}
      items={resolvedItems}
      current={resolvedCurrent}
    />
  );
};

const meta: Meta<BreadcrumbStoryArgs> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            Use Breadcrumb to show the path back through related content pages.
            It matches the toolkit breadcrumb structure, keeps the full trail on desktop,
            and collapses to a single back link on tablet and mobile.
          </p>

          <h2>How to use the React component</h2>
          <p>
            Pass ancestor links through the <code>items</code> prop. If you want a
            final breadcrumb item as well, pass it through <code>current</code>.
            On tablet and mobile, the component will collapse to a single back link
            using <code>current</code> when it is available, or the last linked
            ancestor when it is not.
          </p>
          <Source code={usageExample} language="tsx" />

          <h2>Items shape</h2>
          <p>
            Each breadcrumb item needs visible text and can optionally include an
            <code>href</code>. Use <code>anchorProps</code> when you need extra
            anchor attributes such as <code>target</code>, <code>rel</code>, or
            <code>data-*</code> hooks.
          </p>
          <Source code={itemsShapeExample} language="tsx" />

          <h2>Current item shape</h2>
          <p>
            <code>current</code> uses the same item shape as <code>items</code>.
            This keeps the desktop final crumb and the tablet/mobile back link aligned
            without needing separate props for the label and href.
          </p>
          <Source code={currentShapeExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>trailPreset</code>, <code>showCurrent</code>, and
            <code>currentText</code> are Storybook Builder helpers only. They make
            the interactive story easier to use, but they are not real
            <code>Breadcrumb</code> props.
          </p>

          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    items: {
      control: false,
      description:
        'Ancestor breadcrumb items shown in the full desktop trail.',
      table: {
        type: { summary: 'BreadcrumbItem[]' },
      },
    },
    current: {
      control: false,
      description:
        'Optional final breadcrumb item. When provided, it is also used for the tablet/mobile back link.',
      table: {
        type: { summary: 'BreadcrumbItem' },
      },
    },
    classes: {
      control: 'text',
      description:
        'Additional toolkit-style classes added to the root breadcrumb element.',
    },
    className: {
      control: 'text',
      description:
        'Additional React classes added alongside the toolkit classes.',
    },
    trailPreset: {
      control: 'radio',
      options: ['default', 'deep-trail', 'ancestors-only'],
      description:
        'Builder helper that swaps between a short trail, a deeper trail, and an ancestors-only example.',
      table: {
        category: 'Builder story only',
      },
    },
    showCurrent: {
      control: 'boolean',
      description:
        'Builder helper that toggles the final breadcrumb item on and off.',
      table: {
        category: 'Builder story only',
      },
    },
    currentText: {
      control: 'text',
      description:
        'Builder helper that changes the final breadcrumb label.',
      table: {
        category: 'Builder story only',
      },
    },
  },
  args: {
    trailPreset: 'default',
    showCurrent: true,
    currentText: 'Eczema',
    classes: '',
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: renderBreadcrumb,
  args: {
    items: defaultItems,
    current: {
      text: 'Eczema',
      href: '/health-a-to-z/conditions/eczema',
    },
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: defaultSource,
      },
      description: {
        story:
          'Realistic fixed example showing a short breadcrumb trail with a final breadcrumb item.',
      },
    },
  },
};

export const Builder: Story = {
  render: renderBreadcrumb,
  args: {
    trailPreset: 'default',
    showCurrent: true,
    currentText: 'Eczema',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive surface for trying the main breadcrumb options without editing raw item arrays.',
      },
    },
  },
};

export const DeepTrail: Story = {
  render: () => (
    <Breadcrumb
      items={deepTrailItems}
      current={{
        text: 'Ointments',
        href: '/health-a-to-z/conditions/skin-problems/dry-skin/treatments/ointments',
      }}
    />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: deepTrailSource,
      },
      description: {
        story:
          'Fixed showcase example for a deeper breadcrumb trail that can wrap on larger breakpoints.',
      },
    },
  },
};

export const WithoutCurrent: Story = {
  render: () => <Breadcrumb items={defaultItems} />,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: ancestorsOnlySource,
      },
      description: {
        story:
          'Fixed showcase example showing only ancestor breadcrumbs. On tablet and mobile, the last linked ancestor is used as the back link.',
      },
    },
  },
};
