import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Select, type SelectProps } from './Select';

type SelectItemSet = 'contact-methods' | 'contact-methods-selected' | 'countries';

type SelectStoryArgs = SelectProps & {
  itemSet?: SelectItemSet;
};

const contactMethodItems = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email' },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

const contactMethodSelectedItems = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email', selected: true },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

const countryItems = [
  { value: '', text: 'Choose a country' },
  { value: 'england', text: 'England' },
  { value: 'scotland', text: 'Scotland' },
  { value: 'wales', text: 'Wales' },
  { value: 'northern-ireland', text: 'Northern Ireland' },
];

const itemSets: Record<SelectItemSet, SelectProps['items']> = {
  'contact-methods': contactMethodItems,
  'contact-methods-selected': contactMethodSelectedItems,
  countries: countryItems,
};

const defaultStoryCode = `import { Select } from '@ourfuturehealth/react-components';

const contactMethodItems = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email' },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

<Select
  hint="Choose how you would like us to contact you."
  items={contactMethodItems}
  label="Preferred contact method"
  name="contact-method"
/>;
`;

const withErrorStoryCode = `import { Select } from '@ourfuturehealth/react-components';

const contactMethodItems = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email' },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

<Select
  errorMessage="Select how you would like us to contact you"
  items={contactMethodItems}
  label="Preferred contact method"
  name="contact-method"
/>;
`;

const withSelectedOptionStoryCode = `import { Select } from '@ourfuturehealth/react-components';

const contactMethodItems = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email', selected: true },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

<Select
  items={contactMethodItems}
  label="Preferred contact method"
  name="contact-method"
/>;
`;

const asPageHeadingStoryCode = `import { Select } from '@ourfuturehealth/react-components';

const countryItems = [
  { value: '', text: 'Choose a country' },
  { value: 'england', text: 'England' },
  { value: 'scotland', text: 'Scotland' },
  { value: 'wales', text: 'Wales' },
  { value: 'northern-ireland', text: 'Northern Ireland' },
];

<Select
  isPageHeading
  items={countryItems}
  label="How should we contact you?"
  name="contact-method"
/>;
`;

const selectUsageExample = `import { Select } from '@ourfuturehealth/react-components';

const items = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email' },
  { value: 'phone', text: 'Phone' },
];

<Select
  hint="Choose how you would like us to contact you."
  items={items}
  label="Preferred contact method"
  name="contact-method"
/>;
`;

const selectItemsShapeExample = `type SelectItem = {
  text: React.ReactNode;
  value?: string | number;
  disabled?: boolean;
  selected?: boolean;
  optionProps?: React.OptionHTMLAttributes<HTMLOptionElement>;
};
`;

const renderSelectStory = ({
  itemSet,
  items = contactMethodItems,
  ...args
}: SelectStoryArgs) => {
  const resolvedItems = itemSet === undefined ? items : itemSets[itemSet];
  const resolvedArgs = {
    ...args,
    describedBy: args.describedBy || undefined,
    errorMessage: args.errorMessage || undefined,
    hint: args.hint || undefined,
  };

  return <Select {...resolvedArgs} items={resolvedItems} />;
};

const meta: Meta<SelectStoryArgs> = {
  title: 'Components/Input/Select',
  component: Select,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Select for a native dropdown where the choices are known up front. The React API is intentionally small: pass a label, an ordered array of items, and the usual input-style props such as hint, error message, and `isPageHeading` when the question is also the page heading. Use the `Builder` story to explore the component with friendly preset item sets.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>label</code>, <code>name</code>, and an{' '}
            <code>items</code> array. Each item becomes one native{' '}
            <code>{'<option>'}</code> inside the dropdown.
          </p>
          <p>
            Add <code>hint</code> or <code>errorMessage</code> when the field
            needs extra guidance or validation feedback. Use{' '}
            <code>isPageHeading</code> when the select question should also be
            announced as the page heading.
          </p>
          <Source code={selectUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'label',
              'hint',
              'errorMessage',
              'name',
              'items',
              'describedBy',
              'isPageHeading',
            ]}
          />

          <h2>
            <code>items</code> shape
          </h2>
          <p>
            Each entry in the <code>items</code> array follows this shape:
          </p>
          <Source code={selectItemsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>itemSet</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can try realistic option lists
            without editing the real <code>items</code> prop directly. It is not
            a React prop accepted by <code>Select</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    items: contactMethodItems,
    label: 'Preferred contact method',
    name: 'contact-method',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Question or field label shown above the select.',
      table: {
        category: 'SelectProps',
      },
    },
    hint: {
      control: 'text',
      description:
        'Optional supporting text shown below the label and above any error message.',
      table: {
        category: 'SelectProps',
      },
    },
    errorMessage: {
      control: 'text',
      description:
        'Validation message shown above the select. When present, the select is marked invalid and linked with `aria-describedby`.',
      table: {
        category: 'SelectProps',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
      table: {
        category: 'SelectProps',
      },
    },
    describedBy: {
      control: 'text',
      description:
        'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'SelectProps',
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an `h1` when this question is also the page heading.',
      table: {
        category: 'SelectProps',
      },
    },
    items: {
      control: false,
      description:
        'Ordered option items rendered inside the select. Each item uses `text`, `value`, and optional `disabled`, `selected`, or `optionProps` values.',
      table: {
        type: {
          summary: 'SelectItem[]',
          detail:
            "{ text: ReactNode; value?: string | number; disabled?: boolean; selected?: boolean; optionProps?: OptionHTMLAttributes<HTMLOptionElement> }[]",
        },
        category: 'SelectProps',
      },
    },
    itemSet: {
      control: 'select',
      options: [
        'contact-methods',
        'contact-methods-selected',
        'countries',
      ],
      description:
        'Storybook-only helper for the Builder story. Switches between preset item arrays without editing the real `items` prop directly.',
      table: {
        category: 'Builder story only',
      },
    },
    className: {
      control: false,
      description:
        'Additional classes for the `<select>` element itself. Use this only for integration hooks or layout overrides.',
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
      description: 'React ref for the underlying select element.',
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
    hint: 'Choose how you would like us to contact you.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'A realistic select example with a simple contact-method list.',
      },
      source: {
        code: defaultStoryCode,
      },
    },
  },
};

export const Builder: Story = {
  args: {
    hint: 'Choose how you would like us to contact you.',
    describedBy: '',
    errorMessage: '',
    isPageHeading: false,
    itemSet: 'contact-methods',
    items: contactMethodItems,
    label: 'Preferred contact method',
    name: 'contact-method',
  },
  render: renderSelectStory,
  parameters: {
    controls: {
      include: [
        'label',
        'hint',
        'errorMessage',
        'name',
        'describedBy',
        'isPageHeading',
        'itemSet',
      ],
    },
    docs: {
      description: {
        story:
          'Use the friendly controls here to try preset option sets and the main visible props without editing raw item arrays.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select how you would like us to contact you',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Shows how the component presents a validation message above the select.',
      },
      source: {
        code: withErrorStoryCode,
      },
    },
  },
};

export const WithSelectedOption: Story = {
  args: {
    items: contactMethodSelectedItems,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Shows how the select behaves when one option is already selected.',
      },
      source: {
        code: withSelectedOptionStoryCode,
      },
    },
  },
};

export const AsPageHeading: Story = {
  args: {
    isPageHeading: true,
    label: 'How should we contact you?',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the select question should also be announced as the page heading.',
      },
      source: {
        code: asPageHeadingStoryCode,
      },
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
      <Select
        hint="Choose how you would like us to contact you."
        items={contactMethodItems}
        label="Preferred contact method"
      />
      <Select
        errorMessage="Select your country"
        items={[
          { value: '', text: 'Choose a country' },
          { value: 'england', text: 'England' },
          { value: 'scotland', text: 'Scotland' },
          { value: 'wales', text: 'Wales' },
          { value: 'northern-ireland', text: 'Northern Ireland' },
        ]}
        label="Country"
      />
    </form>
  ),
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Example of how selects work together in a form, including an error state.',
      },
    },
  },
};
