import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput';
import { Checkboxes } from './Checkboxes';

const conditionalItems = [
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

const exclusiveItems = [
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

const meta: Meta<typeof Checkboxes> = {
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
    },
  },
  tags: ['autodocs'],
  args: {
    items: [
      { value: 'email', label: 'Email', exclusiveGroup: 'contact' },
      { value: 'phone', label: 'Phone', exclusiveGroup: 'contact' },
      { divider: 'or' as const },
      {
        value: 'none',
        label: 'No, I do not want to be contacted',
        exclusive: true,
        exclusiveGroup: 'contact',
      },
    ],
    legend: 'How should we contact you?',
    name: 'contact-method',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'Question shown as the fieldset legend for the checkbox group.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the checkbox items. When present, the fieldset is linked with `aria-describedby`.',
    },
    name: {
      control: 'text',
      description: 'HTML name used for each checkbox input in the group.',
    },
    idPrefix: {
      control: 'text',
      description: 'Optional prefix used when generating checkbox IDs.',
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
      },
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend content in an `h1` when this question is also the page heading.',
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
    legendClassName: {
      control: false,
      description: 'Additional classes for the legend element.',
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Select all contact methods that apply.',
    idPrefix: 'contact-method-default',
    name: 'contact-method-default',
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
    docs: {
      description: {
        story: 'Example of a group-level validation error for checkbox questions.',
      },
    },
  },
};
