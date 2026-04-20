import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Expander } from './Expander';

const defaultExpanderCode = `import { Expander } from '@ourfuturehealth/react-components';

<Expander summary="Opening times">
  We are open Monday to Friday, 9am to 6pm.
</Expander>;
`;

const openExpanderCode = `import { Expander } from '@ourfuturehealth/react-components';

<Expander summary="Opening times" open>
  We are open Monday to Friday, 9am to 6pm.
</Expander>;
`;

const richContentExpanderCode = `import { Expander } from '@ourfuturehealth/react-components';

<Expander summary="What do I need to bring?">
  <p>
    Bring any documents we have asked for in your appointment letter.
  </p>
  <ul>
    <li>photo ID</li>
    <li>your NHS number if you know it</li>
    <li>any relevant medical documents</li>
  </ul>
</Expander>;
`;

const groupedExpanderCode = `import { Expander } from '@ourfuturehealth/react-components';

<div className="ofh-expander-group" style={{ maxWidth: '42rem' }}>
  <Expander summary="How to measure your blood glucose levels">
    Wash your hands and use the blood glucose monitor as described in your care plan.
  </Expander>
  <Expander summary="When to check your blood glucose level">
    Your care team will tell you when and how often to check your blood glucose level.
  </Expander>
</div>;
`;

const expanderUsageExample = `import { Expander } from '@ourfuturehealth/react-components';

<Expander summary="Opening times">
  We are open Monday to Friday, 9am to 6pm.
</Expander>;
`;

const meta: Meta<typeof Expander> = {
  title: 'Components/Expander',
  component: Expander,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Expander when users may feel overwhelmed by the amount of information and need it broken into smaller sections. The React API is intentionally small: `summary` is the clickable label, `open` controls the initial expanded state, and `children` is the content shown inside the disclosure panel. Prefer Details when only some users need the content and the disclosure should stay visually lighter.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>Expander</code> when a larger block of information needs
            to be broken into smaller sections without losing prominence. Pass
            the clickable label through <code>summary</code> and the disclosure
            content through <code>children</code>.
          </p>
          <p>
            Set <code>open</code> when the section should be expanded on first
            render. If the disclosure is lighter-weight supporting information,
            prefer <code>Details</code>.
          </p>
          <Source code={expanderUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes of={Expander} exclude={['ref']} />

          <h2>Examples</h2>
          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    summary: 'Opening times',
    open: false,
    children: 'We are open Monday to Friday, 9am to 6pm.',
  },
  argTypes: {
    summary: {
      control: 'text',
      description:
        'Clickable label shown in the closed state. Keep it short and descriptive so users know what the disclosure contains.',
    },
    open: {
      control: 'boolean',
      description:
        'Opens the disclosure on first render. Use this when the supporting content is important enough to show immediately.',
    },
    children: {
      control: 'text',
      description:
        'Content shown inside the disclosure panel after the summary. This can be plain text or richer React content.',
    },
    className: {
      control: false,
      description:
        'Additional classes added to the root `<details>` element. Use this for layout or integration hooks, not to change the built-in Expander behaviour.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the underlying `<details>` element when you need direct DOM access.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: defaultExpanderCode,
      },
      description: {
        story:
          'A realistic collapsed Expander example with short, plain text content inside the disclosure panel.',
      },
    },
  },
};

export const Builder: Story = {
  parameters: {
    controls: {
      include: ['summary', 'open', 'children'],
    },
    docs: {
      description: {
        story:
          'Interactive builder story. Use the real `summary`, `open`, and `children` props to explore the component without switching to raw JSON editing.',
      },
    },
  },
};

export const Open: Story = {
  args: {
    open: true,
    summary: 'Opening times',
    children: 'We are open Monday to Friday, 9am to 6pm.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: openExpanderCode,
      },
      description: {
        story:
          'Open state example for the Expander variant. The icon switches to the remove-circle glyph and the content panel becomes visible immediately.',
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
      source: {
        code: richContentExpanderCode,
      },
      description: {
        story:
          'Example content for the Expander variant. Use it for broader, more prominent disclosures that need more visual weight than the Details pattern.',
      },
    },
  },
};

export const Grouped: Story = {
  render: () => (
    <div className="ofh-expander-group" style={{ maxWidth: '42rem' }}>
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: groupedExpanderCode,
      },
      description: {
        story:
          'Grouped expanders, matching the docs-site example for pages that need several expandable sections in a row.',
      },
    },
  },
};
