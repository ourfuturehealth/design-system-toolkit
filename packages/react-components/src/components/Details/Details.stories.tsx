import type { Meta, StoryObj } from '@storybook/react-vite';
import { Details } from './Details';

const meta: Meta<typeof Details> = {
  title: 'Components/Details',
  component: Details,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Details to make a page easier to scan when only some users need the supporting information. Prefer Expander when the content is more important, aimed at a wider audience, or needs more visual prominence.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    summary: 'Where can I find my NHS number?',
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
      description: 'Content shown when the details element is expanded.',
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
    <Details {...args}>
      <p>
        An NHS number is a 10 digit number, like 485 777 3456.
      </p>
      <p>
        You can find your NHS number on any document sent to you by the NHS.
      </p>
    </Details>
  ),
};

export const Open: Story = {
  args: {
    open: true,
    summary: 'Where can I find my NHS number?',
  },
  render: (args) => (
    <Details {...args}>
      <p>
        An NHS number is a 10 digit number, like 485 777 3456.
      </p>
      <p>
        You can find your NHS number on any document sent to you by the NHS.
      </p>
    </Details>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Open state example for the details variant. Use this when you want the disclosure pre-expanded on first render.',
      },
    },
  },
};

export const WithRichContent: Story = {
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
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Example content with paragraphs and a list. The component keeps the summary compact while still supporting richer disclosure content below it.',
      },
    },
  },
};
