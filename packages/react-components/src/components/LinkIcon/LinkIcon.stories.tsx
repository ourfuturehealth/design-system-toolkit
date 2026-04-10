import type { Meta, StoryObj } from '@storybook/react-vite';
import iconManifest from '@ourfuturehealth/toolkit/assets/icons/manifest.json';
import { LinkIcon, type LinkIconProps } from './LinkIcon';

const iconNameOptions = iconManifest.icons
  .map(({ name }) => name)
  .sort((a, b) => a.localeCompare(b));

const meta: Meta<LinkIconProps> = {
  title: 'Components/Link/Icon',
  component: LinkIcon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'LinkIcon is the canonical React surface for the Link / Icon pattern. Use `iconPosition` to switch between back-navigation and forward or external link patterns, choose any toolkit sprite icon with `iconName`, change the emphasis with `size`, and use `openInNewWindow` when the destination should open in a new tab. If you leave `iconName` unset, the component defaults to `ChevronLeft` on the left and `Launch` on the right.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Go back',
    href: '#',
    iconPosition: 'left',
    size: 'small',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Visible link text. The icon should support the label, not replace it.',
    },
    href: {
      control: 'text',
      description: 'Destination URL or fragment for the link icon.',
    },
    iconName: {
      control: 'select',
      options: iconNameOptions,
      description:
        'Toolkit icon name from the generated sprite manifest. Defaults to `ChevronLeft` for left icons and `Launch` for right icons.',
    },
    iconColor: {
      control: 'color',
      description:
        'Optional icon-only colour override. Leave unset to inherit the link text colour.',
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description:
        'Icon placement relative to the text. Use `left` for back-navigation patterns and `right` for forward or external links.',
    },
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description:
        'Link icon size. Use `small` for compact inline usage or `medium` when the link needs more emphasis.',
    },
    openInNewWindow: {
      control: 'boolean',
      description:
        'Opens the link in a new tab and adds `target="_blank"` plus the safe `rel` values when enabled.',
    },
    className: {
      control: false,
      description:
        'Additional classes applied to the wrapper element. Use this for layout hooks only.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the rendered anchor element.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<LinkIconProps>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive back-navigation example. Use the controls to explore `iconPosition`, `iconName`, `size`, and `openInNewWindow`.',
      },
    },
  },
};

export const RightIcon: Story = {
  args: {
    children: 'Open service search',
    href: 'https://example.com',
    iconName: 'Launch',
    iconPosition: 'right',
    size: 'medium',
    openInNewWindow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A right-positioned, medium-sized link icon for outward navigation. This combination is useful when signposting an external destination or next step.',
      },
    },
  },
};

export const CustomIconColour: Story = {
  args: {
    children: 'Open service search',
    href: 'https://example.com',
    iconName: 'Search',
    iconColor: '#005eb8',
    iconPosition: 'right',
    size: 'medium',
    openInNewWindow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of choosing a different toolkit icon with `iconName` and overriding the icon colour separately from the text with `iconColor`.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <LinkIcon href="#overview" iconPosition="right" size="small">
        Open overview
      </LinkIcon>
      <LinkIcon href="#detailed-guidance" iconPosition="right" size="medium">
        Open detailed guidance
      </LinkIcon>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Size comparison for the same pattern. Use `small` for compact inline usage and `medium` when the link needs more visual emphasis.',
      },
    },
  },
};

export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <LinkIcon href="#back" iconPosition="left" size="small">
        Go back
      </LinkIcon>
      <LinkIcon
        href="https://example.com"
        iconName="Launch"
        iconPosition="right"
        size="medium"
        openInNewWindow
      >
        Open in a new tab
      </LinkIcon>
      <LinkIcon
        href="#search"
        iconName="Search"
        iconPosition="left"
        iconColor="#005eb8"
      >
        Search results
      </LinkIcon>
    </div>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Property combinations in one place: left and right icon positions, default and custom icons, icon colour overrides, and links that do or do not open in a new tab.',
      },
    },
  },
};
