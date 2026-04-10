import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, type PaginationProps } from './Pagination';

const meta: Meta<PaginationProps> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pagination shows previous and next page links for a small set of related pages. The toolkit styling keeps the page title and action text on separate lines, uses the shared React `Icon` base for the arrows, and applies the 4px focus outline gap from the design spec.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    previousUrl: {
      control: 'text',
      description: 'Href for the previous-page link.',
    },
    previousPage: {
      control: 'text',
      description: 'Label for the previous-page destination.',
    },
    nextUrl: {
      control: 'text',
      description: 'Href for the next-page link.',
    },
    nextPage: {
      control: 'text',
      description: 'Label for the next-page destination.',
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
      description: 'Adds extra classes to the root `<nav>` element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<nav>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    previousUrl: '/section/treatments',
    previousPage: 'Treatments',
    nextUrl: '/section/symptoms',
    nextPage: 'Symptoms',
  },
};

export default meta;
type Story = StoryObj<PaginationProps>;

export const Default: Story = {};

export const PreviousOnly: Story = {
  render: () => (
    <Pagination previousUrl="/section/treatments" previousPage="Treatments" />
  ),
};

export const NextOnly: Story = {
  render: () => <Pagination nextUrl="/section/symptoms" nextPage="Symptoms" />,
};
