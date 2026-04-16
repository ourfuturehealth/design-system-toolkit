import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Details } from './Details';

const defaultDetailsCode = `import { Details } from '@ourfuturehealth/react-components';

<Details summary="Where can I find my NHS number?">
  An NHS number is a 10 digit number, like 485 777 3456.
</Details>;
`;

const openDetailsCode = `import { Details } from '@ourfuturehealth/react-components';

<Details summary="Where can I find my NHS number?" open>
  An NHS number is a 10 digit number, like 485 777 3456.
</Details>;
`;

const richContentDetailsCode = `import { Details } from '@ourfuturehealth/react-components';

<Details summary="What can I use my NHS number for?">
  <p>
    The number helps different NHS services match your records correctly.
  </p>
  <ul>
    <li>book appointments</li>
    <li>view test results</li>
    <li>share records between services</li>
  </ul>
</Details>;
`;

const detailsUsageExample = `import { Details } from '@ourfuturehealth/react-components';

<Details summary="Where can I find my NHS number?">
  An NHS number is a 10 digit number, like 485 777 3456.
</Details>;
`;

const meta: Meta<typeof Details> = {
  title: 'Components/Details',
  component: Details,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Details to make a page easier to scan when only some users need supporting information. The React API is intentionally small: `summary` is the clickable label, `open` controls the initial expanded state, and `children` is the content shown inside the disclosure panel. Prefer Expander when the content is more important, aimed at a wider audience, or needs more visual prominence.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Use <code>Details</code> when the disclosure is supporting
            information that only some users will need. Pass the clickable
            label through <code>summary</code> and the hidden content through{' '}
            <code>children</code>.
          </p>
          <p>
            Set <code>open</code> only when the content should be expanded on
            first render. If the content is more prominent or intended for a
            wider audience, use <code>Expander</code> instead.
          </p>
          <Source code={detailsUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes of={Details} exclude={['ref']} />

          <h2>Examples</h2>
          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    summary: 'Where can I find my NHS number?',
    open: false,
    children: 'An NHS number is a 10 digit number, like 485 777 3456.',
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
        'Additional classes added to the root `<details>` element. Use this for layout or integration hooks, not to change the built-in Details behaviour.',
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
        code: defaultDetailsCode,
      },
      description: {
        story:
          'A realistic collapsed Details example with short, plain text content inside the disclosure panel.',
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
    summary: 'Where can I find my NHS number?',
    children: 'An NHS number is a 10 digit number, like 485 777 3456.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: openDetailsCode,
      },
      description: {
        story:
          'Open state example for the Details variant. Use this when you want the disclosure pre-expanded on first render.',
      },
    },
  },
};

export const WithRichContent: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: richContentDetailsCode,
      },
      description: {
        story:
          'Example content with paragraphs and a list. The component keeps the summary compact while still supporting richer disclosure content below it.',
      },
    },
  },
  render: () => (
    <Details summary="What can I use my NHS number for?">
      <p>
        The number helps different NHS services match your records correctly.
      </p>
      <ul>
        <li>book appointments</li>
        <li>view test results</li>
        <li>share records between services</li>
      </ul>
    </Details>
  ),
};
