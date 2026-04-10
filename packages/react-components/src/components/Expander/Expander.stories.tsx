import type { Meta, StoryObj } from '@storybook/react-vite';
import { Expander } from './Expander';

const meta: Meta<typeof Expander> = {
  title: 'Components/Expander',
  component: Expander,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Expander when users may feel overwhelmed by the amount of information and need it broken into smaller sections. Prefer Details when only some users need the content and the disclosure should stay visually lighter.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    summary: 'Opening times',
    open: false,
  },
  argTypes: {
    summary: {
      control: 'text',
      description: 'Summary text shown in the clickable header.',
    },
    open: {
      control: 'boolean',
      description: 'Sets the native `<details open>` state.',
    },
    children: {
      control: false,
      description: 'Content shown when the expander is expanded.',
    },
    className: {
      control: false,
      description:
        'Additional classes added to the root `<details>` element for layout or integration hooks.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the underlying `<details>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Expander {...args}>
      <p>
        We are open Monday to Friday, 9am to 6pm.
      </p>
      <p>Saturday appointments are limited.</p>
    </Expander>
  ),
};

export const Open: Story = {
  args: {
    open: true,
    summary: 'Opening times',
  },
  render: (args) => (
    <Expander {...args}>
      <p>
        We are open Monday to Friday, 9am to 6pm.
      </p>
      <p>Saturday appointments are limited.</p>
    </Expander>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Open state example for the expander variant. The icon switches to the remove-circle glyph and the content panel becomes visible immediately.',
      },
    },
  },
};

export const WithRichContent: Story = {
  render: () => (
    <Expander summary="What do I need to bring?">
      <p>Bring any documents we have asked for in your appointment letter.</p>
      <ul>
        <li>photo ID</li>
        <li>your NHS number if you know it</li>
        <li>any relevant medical documents</li>
      </ul>
    </Expander>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Example content for the expander variant. Use it for broader, more prominent disclosures that need more visual weight than the details pattern.',
      },
    },
  },
};

export const Grouped: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Grouped expanders, matching the docs-site example for pages that need several expandable sections in a row.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '42rem' }}>
      <Expander summary="How to measure your blood glucose levels">
        <p>
          Wash your hands and use the blood glucose monitor as described in
          your care plan.
        </p>
      </Expander>
      <Expander summary="When to check your blood glucose level">
        <p>
          Your care team will tell you when and how often to check your blood
          glucose level.
        </p>
      </Expander>
    </div>
  ),
};
