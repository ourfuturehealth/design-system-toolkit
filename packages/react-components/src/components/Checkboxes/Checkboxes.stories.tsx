import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { TextInput } from '../TextInput';
import { Checkboxes, type CheckboxesProps } from './Checkboxes';

type CheckboxesStoryArgs = CheckboxesProps & {
  itemSet?: 'contact' | 'conditional' | 'exclusive';
};

const contactItems: CheckboxesProps['items'] = [
  { value: 'email', label: 'Email', exclusiveGroup: 'contact' },
  { value: 'phone', label: 'Phone', exclusiveGroup: 'contact' },
  { divider: 'or' as const },
  {
    value: 'none',
    label: 'No, I do not want to be contacted',
    exclusive: true,
    exclusiveGroup: 'contact',
  },
];

const conditionalItems: CheckboxesProps['items'] = [
  {
    value: 'email',
    label: 'Email',
    conditional: (
      <TextInput
        hint="We will use this to send updates about your account."
        inputWidth={20}
        label="Email address"
      />
    ),
  },
  {
    value: 'phone',
    label: 'Phone',
    conditional: (
      <TextInput
        hint="We will only use this if we need to contact you urgently."
        inputWidth={20}
        label="Phone number"
      />
    ),
  },
  {
    value: 'text',
    label: 'Text message',
    conditional: (
      <TextInput
        hint="We will only use this for short service updates."
        inputWidth={20}
        label="Mobile phone number"
      />
    ),
  },
];

const exclusiveItems: CheckboxesProps['items'] = [
  {
    value: 'sore-throat',
    label: 'Sore throat',
    exclusiveGroup: 'symptoms',
  },
  {
    value: 'runny-nose',
    label: 'Runny nose',
    exclusiveGroup: 'symptoms',
  },
  {
    value: 'muscle-or-joint-pain',
    label: 'Muscle or joint pain',
    exclusiveGroup: 'symptoms',
  },
  { divider: 'or' as const },
  {
    value: 'none',
    label: 'No, I do not have any of these symptoms',
    exclusive: true,
    exclusiveGroup: 'symptoms',
  },
];

const checkboxItemSets: Record<
  NonNullable<CheckboxesStoryArgs['itemSet']>,
  CheckboxesProps['items']
> = {
  contact: contactItems,
  conditional: conditionalItems,
  exclusive: exclusiveItems,
};

const checkboxesUsageExample = `import { Checkboxes } from '@ourfuturehealth/react-components';

const items = [
  { value: 'email', label: 'Email', exclusiveGroup: 'contact' },
  { value: 'phone', label: 'Phone', exclusiveGroup: 'contact' },
  { divider: 'or' },
  {
    value: 'none',
    label: 'No, I do not want to be contacted',
    exclusive: true,
    exclusiveGroup: 'contact',
  },
];

<Checkboxes
  hint="Select all contact methods that apply."
  items={items}
  legend="How should we contact you?"
  name="contact-method"
/>;
`;

const checkboxItemsShapeExample = `type CheckboxItem =
  | {
      value: string | number;
      label: React.ReactNode;
      hint?: React.ReactNode;
      checked?: boolean;
      disabled?: boolean;
      exclusive?: boolean;
      exclusiveGroup?: string;
      conditional?: React.ReactNode;
      inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    }
  | {
      divider: React.ReactNode;
    };
`;

const renderCheckboxesBuilderStory = ({
  itemSet,
  ...args
}: CheckboxesStoryArgs) => {
  const items = itemSet ? checkboxItemSets[itemSet] : args.items ?? contactItems;
  const resolvedArgs = {
    ...args,
    describedBy: args.describedBy || undefined,
    errorMessage: args.errorMessage || undefined,
    hint: args.hint || undefined,
  };

  return (
    <Checkboxes
      {...resolvedArgs}
      items={items}
    />
  );
};

const meta: Meta<CheckboxesStoryArgs> = {
  title: 'Components/Input/Checkboxes',
  component: Checkboxes,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A checkbox group that reuses the toolkit fieldset, input-family supporting text, updated 48px controllers, and conditional reveal patterns. Items can include hints, exclusive options, and conditional content that is revealed when selected.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>legend</code>, <code>name</code>, and an{' '}
            <code>items</code> array. Each item becomes one checkbox row, and
            you can add a divider row where the list needs a visual break.
          </p>
          <p>
            Use <code>hint</code> for group-level guidance,{' '}
            <code>errorMessage</code> for validation feedback, and use{' '}
            <code>idPrefix</code> when you want predictable generated IDs for
            the inputs and any conditional content.
          </p>
          <Source code={checkboxesUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'legend',
              'hint',
              'errorMessage',
              'name',
              'idPrefix',
              'items',
              'describedBy',
              'isPageHeading',
            ]}
          />

          <h2>
            <code>items</code> shape
          </h2>
          <p>
            Each entry in the <code>items</code> array is either a checkbox item
            object or a divider row:
          </p>
          <Source code={checkboxItemsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>itemSet</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can switch between realistic
            checkbox examples without editing the real <code>items</code> prop.
            It is not a React prop accepted by <code>Checkboxes</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    legend: 'How should we contact you?',
    name: 'contact-method',
  },
  argTypes: {
    itemSet: {
      control: 'select',
      options: ['contact', 'conditional', 'exclusive'],
      description:
        'Builder-only Storybook helper. Switches between the contact, conditional, and exclusive checkbox presets.',
      table: {
        category: 'Builder story only',
      },
    },
    legend: {
      control: 'text',
      description: 'Question shown as the fieldset legend for the checkbox group.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend and above any error message.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the checkbox items. When present, the fieldset is linked with `aria-describedby`.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name used for each checkbox input in the group.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    idPrefix: {
      control: 'text',
      description: 'Optional prefix used when generating checkbox IDs.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    items: {
      control: false,
      description: 'Checkbox items rendered within the group. Items support labels, hints, conditional content, and exclusive-selection rules.',
      table: {
        type: {
          summary: 'CheckboxItem[]',
          detail:
            "{ value: string | number; label: ReactNode; hint?: ReactNode; checked?: boolean; disabled?: boolean; exclusive?: boolean; exclusiveGroup?: string; conditional?: ReactNode; inputProps?: InputHTMLAttributes<HTMLInputElement> }[] | { divider: ReactNode }[]",
        },
        category: 'CheckboxesProps',
      },
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend content in an `h1` when this question is also the page heading.',
      table: {
        category: 'CheckboxesProps',
      },
    },
    onChange: {
      control: false,
      description: 'Called with the full selected value array whenever the selection changes.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description: 'Additional classes for the checkbox group wrapper.',
      table: {
        category: 'Advanced',
      },
    },
    fieldsetClassName: {
      control: false,
      description: 'Additional classes for the fieldset element.',
      table: {
        category: 'Advanced',
      },
    },
    hintClassName: {
      control: false,
      description: 'Additional classes for the group hint element.',
      table: {
        category: 'Advanced',
      },
    },
    errorMessageClassName: {
      control: false,
      description: 'Additional classes for the group error message element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the fieldset element.',
      table: {
        category: 'Advanced',
      },
    },
  },
  render: renderCheckboxesBuilderStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Select all contact methods that apply.',
    idPrefix: 'contact-method-default',
    items: contactItems,
    name: 'contact-method-default',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Default contact-method checkbox group with an exclusive none option.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    describedBy: '',
    errorMessage: '',
    hint: 'Select all contact methods that apply.',
    idPrefix: 'contact-method-builder',
    isPageHeading: false,
    itemSet: 'contact',
    legend: 'How should we contact you?',
    name: 'contact-method-builder',
  },
  parameters: {
    controls: {
      include: ['itemSet', 'legend', 'hint', 'errorMessage', 'name', 'idPrefix', 'isPageHeading'],
    },
    docs: {
      description: {
        story:
          'Interactive checkbox example. Switch between the preset item sets and adjust the real group props without editing raw JSON.',
      },
    },
  },
};

export const WithHint: Story = {
  args: {
    hint: 'Select all options that are relevant to you.',
    idPrefix: 'contact-method-with-hint',
    items: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { value: 'text', label: 'Text message' },
    ],
    name: 'contact-method-with-hint',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Use the group-level `hint` when users need help understanding how many options they can select.',
      },
    },
  },
};

export const WithItemHints: Story = {
  args: {
    hint: 'Select all contact methods that apply.',
    idPrefix: 'contact-method-item-hints',
    items: [
      {
        value: 'email',
        label: 'Email',
        hint: 'We will send updates by email.',
      },
      {
        value: 'phone',
        label: 'Phone',
        hint: 'We will only call if we need to contact you urgently.',
      },
      {
        value: 'text',
        label: 'Text message',
        hint: 'We will only use this for short updates.',
      },
    ],
    name: 'contact-method-item-hints',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Each checkbox item can carry its own hint text under the main label.',
      },
    },
  },
};

export const ConditionalContent: Story = {
  args: {
    hint: 'Select all options that are relevant to you.',
    idPrefix: 'contact-method-conditional',
    items: conditionalItems,
    legend: 'How would you prefer to be contacted?',
    name: 'contact-method-conditional',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Checkbox items can reveal conditional content when selected. This matches the docs-site example with email, phone, and text-message follow-up fields.',
      },
    },
  },
};

export const WithExclusiveNoneOption: Story = {
  args: {
    hint: 'Select all the symptoms you have.',
    idPrefix: 'symptoms-exclusive-none',
    items: exclusiveItems,
    legend: 'Do you have any of these symptoms?',
    name: 'symptoms-exclusive-none',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Use an exclusive `none` option when users need to say that none of the listed choices apply. Selecting the exclusive option clears other options in the same exclusive group.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select at least one contact method',
    hint: 'Select all contact methods that apply.',
    idPrefix: 'contact-method-error',
    name: 'contact-method-error',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Example of a group-level validation error for checkbox questions.',
      },
    },
  },
};
