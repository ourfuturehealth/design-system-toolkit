import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Textarea } from './Textarea';

const textareaUsageExample = `import { Textarea } from '@ourfuturehealth/react-components';

<Textarea
  hint="Do not include personal or financial information."
  label="Can you provide more detail?"
  name="details"
  rows={4}
/>;
`;

const meta: Meta<typeof Textarea> = {
  title: 'Components/Input/Textarea',
  component: Textarea,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A multiline input that reuses the toolkit textarea classes and shared input-family label, hint, and error treatments. Native textarea props such as `placeholder`, `rows`, `disabled`, and `required` pass through to the underlying `<textarea>`.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>label</code> and <code>name</code>, then set{' '}
            <code>rows</code> to the visible height you want before the field
            scrolls.
          </p>
          <p>
            Add <code>hint</code> for supporting guidance,{' '}
            <code>errorMessage</code> for validation feedback, and use{' '}
            <code>isPageHeading</code> when the textarea question should also be
            the page heading.
          </p>
          <Source code={textareaUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'label',
              'hint',
              'errorMessage',
              'name',
              'placeholder',
              'rows',
              'describedBy',
              'isPageHeading',
            ]}
          />

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Can you provide more detail?',
    name: 'details',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Question or field label shown above the textarea.',
      table: {
        category: 'TextareaProps',
      },
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above any error message.',
      table: {
        category: 'TextareaProps',
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the textarea. When present, the textarea is marked invalid and linked with `aria-describedby`.',
      table: {
        category: 'TextareaProps',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
      table: {
        category: 'TextareaProps',
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when the textarea is empty.',
      table: {
        category: 'TextareaProps',
      },
    },
    rows: {
      control: 'number',
      description: 'Visible row count for the textarea before it scrolls.',
      table: {
        category: 'TextareaProps',
      },
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'TextareaProps',
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an `h1` when this question is also the page heading.',
      table: {
        category: 'TextareaProps',
      },
    },
    className: {
      control: false,
      description:
        'Additional classes for the textarea element itself. Use this only for integration hooks or layout overrides.',
      table: {
        category: 'Advanced',
      },
    },
    formGroupClassName: {
      control: false,
      description: 'Additional classes for the outer form-group wrapper.',
      table: {
        category: 'Advanced',
      },
    },
    labelClassName: {
      control: false,
      description: 'Additional classes for the label element.',
      table: {
        category: 'Advanced',
      },
    },
    hintClassName: {
      control: false,
      description: 'Additional classes for the hint element.',
      table: {
        category: 'Advanced',
      },
    },
    errorMessageClassName: {
      control: false,
      description: 'Additional classes for the error message element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the underlying textarea element.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Do not include personal or financial information.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'A realistic multiline text area example.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    describedBy: '',
    errorMessage: '',
    hint: 'Do not include personal or financial information.',
    isPageHeading: false,
    label: 'Can you provide more detail?',
    name: 'details',
    placeholder: '',
    rows: 4,
  },
  parameters: {
    controls: {
      include: [
        'label',
        'hint',
        'errorMessage',
        'name',
        'placeholder',
        'rows',
        'isPageHeading',
      ],
    },
    docs: {
      description: {
        story:
          'Use the friendly controls here to explore the main textarea props without editing code.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'You must provide an explanation.',
    label: "Why can't you provide a National Insurance number?",
    name: 'ni-number-explanation',
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Longer: Story = {
  args: {
    hint: 'Do not include personal or financial information.',
    rows: 10,
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const AsPageHeading: Story = {
  args: {
    isPageHeading: true,
    label: 'Can you provide more detail?',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the textarea question should also be announced as the page heading.',
      },
    },
    controls: {
      disable: true,
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '32rem',
      }}
    >
      <Textarea
        hint="Do not include personal or financial information."
        label="Can you provide more detail?"
      />
      <Textarea
        errorMessage="You must provide an explanation."
        label="Why can't you provide a National Insurance number?"
      />
    </form>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Example of how textareas work within a form, including default and error states.',
      },
    },
  },
};
