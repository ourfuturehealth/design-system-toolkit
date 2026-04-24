import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { TextInput } from '../TextInput';
import { ErrorSummary, type ErrorSummaryProps } from './ErrorSummary';

type ErrorSummaryStoryArgs = ErrorSummaryProps & {
  scenario?: 'default' | 'with-description' | 'multiple-errors' | 'html-content' | 'in-form';
};

const defaultErrorList = [
  {
    text: 'Enter your first name',
    href: '#default-story-preview',
  },
];

const multipleErrorsList = [
  {
    text: 'Enter your first name',
    href: '#multiple-errors-first-name',
  },
  {
    text: 'Enter your last name',
    href: '#multiple-errors-last-name',
  },
];

const htmlContentList = [
  {
    html: '<span><strong>Email address</strong> is required</span>',
    href: '#html-content-email',
  },
  {
    html: '<span><strong>Phone number</strong> must include 11 digits</span>',
    href: '#html-content-phone',
  },
];

const inFormList = [
  {
    text: 'Enter your first name',
    href: '#in-form-first-name',
  },
  {
    text: 'Enter your last name',
    href: '#in-form-last-name',
  },
];

const errorSummaryUsageExample = `import { ErrorSummary } from '@ourfuturehealth/react-components';

const errorList = [
  { text: 'Enter your first name', href: '#first-name' },
  { text: 'Enter your last name', href: '#last-name' },
];

<ErrorSummary
  descriptionText="Check each answer and update the fields that are highlighted below."
  errorList={errorList}
  titleText="There is a problem"
/>;
`;

const errorListShapeExample = `type ErrorSummaryItem = {
  href?: string;
  text?: string;
  html?: string;
  attributes?: Record<string, string | number | boolean | null | undefined>;
};
`;

const renderErrorSummaryBuilderStory = ({
  scenario,
  ...args
}: ErrorSummaryStoryArgs) => {
  const normalizedDescriptionText =
    args.descriptionText === '' ? undefined : args.descriptionText;
  const normalizedIdPrefix =
    args.idPrefix === '' ? undefined : args.idPrefix;

  const resolvedArgs = (() => {
    switch (scenario) {
      case 'with-description':
        return {
          ...args,
          descriptionText:
            normalizedDescriptionText ??
            'Check each answer and update the fields that are highlighted below.',
          idPrefix: normalizedIdPrefix,
          errorList: args.errorList ?? defaultErrorList,
        };
      case 'multiple-errors':
        return {
          ...args,
          errorList: multipleErrorsList,
          descriptionText:
            normalizedDescriptionText ??
            'Check each answer and update the fields that are highlighted below.',
          idPrefix: normalizedIdPrefix,
        };
      case 'html-content':
        return {
          ...args,
          titleHtml: args.titleHtml ?? '<span>There is a problem</span>',
          descriptionHtml:
            args.descriptionHtml ??
            'Review the <strong>highlighted answers</strong> and update each field before continuing.',
          idPrefix: normalizedIdPrefix,
          errorList: htmlContentList,
        };
      case 'in-form':
        return {
          ...args,
          idPrefix: normalizedIdPrefix,
          errorList: inFormList,
        };
      case 'default':
      default:
        return {
          ...args,
          descriptionText: normalizedDescriptionText,
          idPrefix: normalizedIdPrefix,
          errorList: args.errorList ?? defaultErrorList,
        };
    }
  })();

  return (
    <div style={{ maxWidth: '40rem' }}>
      <ErrorSummary
        {...resolvedArgs}
        onClick={(event) => {
          const anchor =
            event.target instanceof Element
              ? event.target.closest<HTMLAnchorElement>('a[href]')
              : null;

          if (anchor === null) {
            return;
          }

          const href = anchor.getAttribute('href') || '';

          if (!href.startsWith('#')) {
            event.preventDefault();
            return;
          }

          const targetId = href.slice(1);

          if (targetId === '' || document.getElementById(targetId) === null) {
            event.preventDefault();
          }
        }}
      />
      {scenario === 'multiple-errors' ? (
        <form>
          <TextInput
            id="multiple-errors-first-name"
            label="First name"
            error="Enter your first name"
          />
          <div style={{ height: '24rem' }} />
          <TextInput
            id="multiple-errors-last-name"
            label="Last name"
            error="Enter your last name"
          />
        </form>
      ) : null}
      {scenario === 'html-content' ? (
        <form>
          <TextInput
            id="html-content-email"
            label="Email address"
            error="Email address is required"
          />
          <TextInput
            id="html-content-phone"
            label="Phone number"
            error="Phone number must include 11 digits"
          />
        </form>
      ) : null}
      {scenario === 'in-form' ? (
        <form noValidate>
          <TextInput
            id="in-form-email"
            label="Email address"
            type="email"
            hint="We will use this to send updates about your application."
            defaultValue="alex@example.com"
          />
          <TextInput
            id="in-form-first-name"
            label="First name"
            hint="Enter your given name."
            error="Enter your first name"
          />
          <TextInput
            id="in-form-phone"
            label="Phone number"
            type="tel"
            hint="Optional. Include this if you want SMS updates."
          />
          <TextInput
            id="in-form-last-name"
            label="Last name"
            hint="Enter your family name."
            error="Enter your last name"
          />
          <TextInput
            id="in-form-postcode"
            label="Postcode"
            hint="For example, SW1A 1AA."
            width="one-half"
          />
        </form>
      ) : null}
    </div>
  );
};

const meta: Meta<ErrorSummaryStoryArgs> = {
  title: 'Components/ErrorSummary',
  component: ErrorSummary,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use the Error Summary component to summarise validation errors at the top of a page and link each error back to the relevant answer. `titleHtml` replaces `titleText`, and `descriptionHtml` replaces `descriptionText`. Use `idPrefix` when you need more than one summary on the same page so each summary gets a unique heading id.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass an <code>errorList</code> array and a heading through{' '}
            <code>titleText</code>. Each error can link back to the relevant
            field using <code>href</code>.
          </p>
          <p>
            Add <code>descriptionText</code> when you want supporting guidance
            below the heading. Use the HTML variants only when you need trusted
            markup rather than plain text.
          </p>
          <Source code={errorSummaryUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'titleText',
              'descriptionText',
              'errorList',
              'idPrefix',
              'className',
            ]}
          />

          <h2>
            <code>errorList</code> shape
          </h2>
          <p>
            Each entry in the <code>errorList</code> array follows this shape:
          </p>
          <Source code={errorListShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>scenario</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can switch between realistic error
            summary examples without rebuilding the linked form markup by hand.
            It is not a React prop accepted by <code>ErrorSummary</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    scenario: {
      control: 'select',
      options: ['default', 'with-description', 'multiple-errors', 'html-content', 'in-form'],
      description:
        'Builder-only Storybook helper. Switches between the common error-summary example shapes.',
      table: {
        category: 'Builder story only',
      },
    },
    titleText: {
      control: 'text',
      description:
        'Plain text heading content for the summary. Ignored if `titleHtml` is provided.',
      table: {
        category: 'ErrorSummaryProps',
      },
    },
    titleHtml: {
      control: false,
      description:
        'Trusted HTML heading content. When provided it replaces `titleText`.',
      table: {
        category: 'Advanced',
      },
    },
    descriptionText: {
      control: 'text',
      description:
        'Optional supporting text shown below the heading. Ignored if `descriptionHtml` is provided.',
      table: {
        category: 'ErrorSummaryProps',
      },
    },
    descriptionHtml: {
      control: false,
      description:
        'Trusted HTML description content. When provided it replaces `descriptionText`.',
      table: {
        category: 'Advanced',
      },
    },
    errorList: {
      control: false,
      description:
        'List of linked or unlinked errors shown in the summary. Each item supports `href`, `text`, `html`, and `attributes`. In stories that render linked fields, keep each `href` aligned with the field ids shown in the story.',
      table: {
        type: {
          summary:
            'Array<{ href?: string; text?: string; html?: string; attributes?: Record<string, string | number | boolean | null | undefined> }>',
        },
        category: 'ErrorSummaryProps',
      },
    },
    classes: {
      control: false,
      description:
        'Toolkit-parity alias for adding extra classes to the root element. In React-only usage, prefer `className`.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description:
        'Adds extra classes to the root element for layout or integration hooks. It does not change the built-in summary styling by itself.',
      table: {
        category: 'Advanced',
      },
    },
    attributes: {
      control: false,
      description:
        'Additional HTML attributes added to the root element, for example `data-*` or `aria-*` attributes.',
      table: {
        category: 'Advanced',
      },
    },
    idPrefix: {
      control: 'text',
      description:
        'Optional prefix used to generate the title id referenced by `aria-labelledby`. Use this when rendering more than one error summary on the same page.',
      table: {
        category: 'ErrorSummaryProps',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<div>` element. Use this only when you need direct access to the rendered DOM node.',
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    titleText: 'There is a problem',
    errorList: defaultErrorList,
  },
  render: renderErrorSummaryBuilderStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    titleText: 'There is a problem',
    errorList: defaultErrorList,
    scenario: 'default',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Visual-only preview. The error item remains a link for presentation, but navigation is suppressed in this story because no matching field is rendered below it.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    descriptionText: '',
    idPrefix: '',
    scenario: 'default',
    titleText: 'There is a problem',
  },
  parameters: {
    controls: {
      include: ['scenario', 'titleText', 'descriptionText', 'idPrefix'],
    },
    docs: {
      description: {
        story:
          'Interactive error-summary example. Switch between the common summary shapes and edit the real props without rebuilding the example by hand.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    descriptionText:
      'Check each answer and update the fields that are highlighted below.',
    scenario: 'with-description',
    errorList: defaultErrorList,
    titleText: 'There is a problem',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Visual-only preview with supporting copy. The summary still renders a link, but navigation is suppressed in this story because no linked field is present.',
      },
    },
  },
};

export const MultipleErrors: Story = {
  args: {
    errorList: multipleErrorsList,
    scenario: 'multiple-errors',
    titleText: 'There is a problem',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Interactive example with two linked fields. If you edit `errorList`, keep the `href` values aligned with `#multiple-errors-first-name` and `#multiple-errors-last-name` to preserve the focus and scroll behaviour.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '40rem' }}>
      <ErrorSummary {...args} />
      <form>
        <TextInput
          id="multiple-errors-first-name"
          label="First name"
          error="Enter your first name"
        />
        <div style={{ height: '24rem' }} />
        <TextInput
          id="multiple-errors-last-name"
          label="Last name"
          error="Enter your last name"
        />
      </form>
    </div>
  ),
};

export const HtmlContent: Story = {
  args: {
    titleHtml: '<span>There is a problem</span>',
    descriptionHtml:
      'Review the <strong>highlighted answers</strong> and update each field before continuing.',
    errorList: htmlContentList,
    scenario: 'html-content',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Interactive example using HTML content for the title, description, and linked errors. Click directly on nested markup inside the error links to validate the nested-anchor behaviour.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '40rem' }}>
      <ErrorSummary {...args} />
      <form>
        <TextInput
          id="html-content-email"
          label="Email address"
          error="Email address is required"
        />
        <TextInput
          id="html-content-phone"
          label="Phone number"
          error="Phone number must include 11 digits"
        />
      </form>
    </div>
  ),
};

export const InForm: Story = {
  args: {
    errorList: inFormList,
    scenario: 'in-form',
    titleText: 'There is a problem',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic form example showing the error summary paired with inline field errors and unaffected fields in the same form.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '40rem' }}>
      <ErrorSummary {...args} />
      <form noValidate>
        <TextInput
          id="in-form-email"
          label="Email address"
          type="email"
          hint="We will use this to send updates about your application."
          defaultValue="alex@example.com"
        />
        <TextInput
          id="in-form-first-name"
          label="First name"
          hint="Enter your given name."
          error="Enter your first name"
        />
        <TextInput
          id="in-form-phone"
          label="Phone number"
          type="tel"
          hint="Optional. Include this if you want SMS updates."
        />
        <TextInput
          id="in-form-last-name"
          label="Last name"
          hint="Enter your family name."
          error="Enter your last name"
        />
        <TextInput
          id="in-form-postcode"
          label="Postcode"
          hint="For example, SW1A 1AA."
          width="one-half"
        />
      </form>
    </div>
  ),
};
