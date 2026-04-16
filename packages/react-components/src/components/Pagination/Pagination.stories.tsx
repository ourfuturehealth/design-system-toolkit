import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Pagination, type PaginationProps } from './Pagination';

const defaultPaginationSource = `import { Pagination } from '@ourfuturehealth/react-components';

<Pagination
  previousUrl="/section/treatments"
  previousPage="Treatments"
  nextUrl="/section/symptoms"
  nextPage="Symptoms"
/>;
`;

const previousOnlyPaginationSource = `import { Pagination } from '@ourfuturehealth/react-components';

<Pagination
  previousUrl="/section/treatments"
  previousPage="Treatments"
/>;
`;

const nextOnlyPaginationSource = `import { Pagination } from '@ourfuturehealth/react-components';

<Pagination
  nextUrl="/section/symptoms"
  nextPage="Symptoms"
/>;
`;

const meta: Meta<PaginationProps> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pagination shows previous and next page links for a small set of related pages. Pass `previousUrl` and `previousPage` for the previous link, `nextUrl` and `nextPage` for the next link, and leave either pair out when you only need one side. The toolkit styling keeps the page title and action text on separate lines, uses the shared React `Icon` base for the arrows, and applies the 4px focus outline gap from the design spec.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pagination is a very small API. Give it the previous and next page
            label plus URL pairs, or provide just one side when you only need a
            previous-only or next-only navigation pattern.
          </p>

          <h2>Component props</h2>
          <ArgTypes of={Pagination} />

          <h2>Examples</h2>
          <Stories />

          <h2>Example source</h2>
          <Source code={defaultPaginationSource} language="tsx" />
          <Source code={previousOnlyPaginationSource} language="tsx" />
          <Source code={nextOnlyPaginationSource} language="tsx" />
        </>
      ),
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

export const Builder: Story = {
  parameters: {
    controls: {
      include: ['previousUrl', 'previousPage', 'nextUrl', 'nextPage'],
    },
  },
};

export const Default: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: defaultPaginationSource,
      },
      description: {
        story:
          'A realistic default pagination example with both previous and next links visible.',
      },
    },
  },
};

export const PreviousOnly: Story = {
  render: () => (
    <Pagination previousUrl="/section/treatments" previousPage="Treatments" />
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: previousOnlyPaginationSource,
      },
    },
  },
};

export const NextOnly: Story = {
  render: () => <Pagination nextUrl="/section/symptoms" nextPage="Symptoms" />,
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      source: {
        code: nextOnlyPaginationSource,
      },
    },
  },
};
