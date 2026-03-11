import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput';
import { ErrorSummary } from './ErrorSummary';

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

const meta: Meta<typeof ErrorSummary> = {
  title: 'Components/ErrorSummary',
  component: ErrorSummary,
  render: (args) => (
    <div style={{ maxWidth: '40rem' }}>
      <ErrorSummary
        {...args}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('a')) {
            event.preventDefault();
          }
        }}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use the Error Summary component to summarise validation errors at the top of a page and link each error back to the relevant answer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    titleText: {
      control: 'text',
      description: 'Plain text heading content for the summary.',
    },
    titleHtml: {
      control: 'text',
      description:
        'Optional HTML heading content. When provided it takes precedence over `titleText`.',
    },
    descriptionText: {
      control: 'text',
      description: 'Optional supporting text shown below the heading.',
    },
    descriptionHtml: {
      control: 'text',
      description:
        'Optional HTML description content. When provided it takes precedence over `descriptionText`.',
    },
    errorList: {
      control: 'object',
      description:
        'List of linked or unlinked errors shown in the summary. Each item supports `href`, `text`, `html`, and `attributes`. In the interactive stories, keep each `href` aligned with the rendered field ids shown in the story.',
      table: {
        type: {
          summary:
            'Array<{ href?: string; text?: string; html?: string; attributes?: Record<string, string | number | boolean | null | undefined> }>',
        },
      },
    },
    classes: {
      control: 'text',
      description: 'Additional toolkit-style classes added to the root element.',
    },
    attributes: {
      control: 'object',
      description: 'Additional HTML attributes added to the root element.',
    },
    idPrefix: {
      control: 'text',
      description:
        'Optional prefix used to generate the title id referenced by `aria-labelledby`.',
    },
    focusOnPageLoad: {
      control: 'boolean',
      description: 'Whether the summary should receive focus when it mounts.',
    },
  },
  args: {
    titleText: 'There is a problem',
    focusOnPageLoad: false,
    errorList: defaultErrorList,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Visual-only preview. The error item remains a link for presentation, but navigation is suppressed in this story because no matching field is rendered below it.',
      },
    },
  },
};

export const WithDescription: Story = {
  args: {
    descriptionText:
      'Check each answer and update the fields that are highlighted below.',
  },
  parameters: {
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
    focusOnPageLoad: false,
    errorList: multipleErrorsList,
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
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example with two linked fields. If you edit `errorList`, keep the `href` values aligned with `#multiple-errors-first-name` and `#multiple-errors-last-name` to preserve the focus and scroll behaviour.',
      },
    },
  },
};

export const HtmlContent: Story = {
  args: {
    titleHtml: '<span>There is a problem</span>',
    descriptionHtml:
      'Review the <strong>highlighted answers</strong> and update each field before continuing.',
    errorList: htmlContentList,
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
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example using HTML content for the title, description, and linked errors. Click directly on nested markup inside the error links to validate the nested-anchor behaviour.',
      },
    },
  },
};

export const InForm: Story = {
  args: {
    errorList: inFormList,
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
  parameters: {
    docs: {
      description: {
        story:
          'A realistic form example showing the error summary paired with inline field errors and unaffected fields in the same form.',
      },
    },
  },
};
