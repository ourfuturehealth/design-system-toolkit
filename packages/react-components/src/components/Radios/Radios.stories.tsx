import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from '../TextInput';
import { Radios } from './Radios';

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

const meta: Meta<typeof Radios> = {
  title: 'Components/Input/Radios',
  component: Radios,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'A radio group that reuses the toolkit fieldset, input-family supporting text, updated 48px controllers, and conditional reveal patterns. Items can include hints or conditional content that is revealed for the selected option.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Phone' },
      { divider: 'or' as const },
      { value: 'post', label: 'Post' },
    ],
    legend: 'How should we contact you?',
    name: 'contact-method',
  },
  argTypes: {
    legend: {
      control: 'text',
      description: 'Question shown as the fieldset legend for the radio group.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the radio items. When present, the fieldset is linked with `aria-describedby`.',
    },
    name: {
      control: 'text',
      description: 'HTML name shared by all radio inputs in the group.',
    },
    idPrefix: {
      control: 'text',
      description: 'Optional prefix used when generating radio IDs.',
    },
    items: {
      control: false,
      description: 'Radio items rendered within the group. Items support labels, hints, conditional content, and divider rows.',
      table: {
        type: {
          summary: 'RadioItem[]',
          detail:
            "{ value: string | number; label: ReactNode; hint?: ReactNode; checked?: boolean; disabled?: boolean; conditional?: ReactNode; inputProps?: InputHTMLAttributes<HTMLInputElement> }[] | { divider: ReactNode }[]",
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
      description: 'Called with the selected value whenever the chosen radio option changes.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description: 'Additional classes for the radio group wrapper.',
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
    idPrefix: 'contact-method-default',
    name: 'contact-method-default',
  },
};

export const WithHint: Story = {
  args: {
    hint: 'This is a 10 digit number, like 485 777 3456. You can find it on NHS letters, prescriptions, or by logging in to a GP practice online service.',
    items: [
      { value: 'yes', label: 'Yes, I know my NHS number' },
      { value: 'no', label: 'No, I do not know my NHS number' },
      { value: 'not-sure', label: "I'm not sure" },
    ],
    legend: 'Do you know your NHS number?',
    idPrefix: 'nhs-number-with-hint',
    name: 'nhs-number',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use the group-level `hint` when the whole radio question needs extra supporting context before the options.',
      },
    },
  },
};

export const WithItemHints: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
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
        value: 'post',
        label: 'Post',
        hint: 'Choose this if you prefer printed letters.',
      },
    ],
    name: 'contact-method-item-hints',
  },
  parameters: {
    docs: {
      description: {
        story: 'Each radio item can carry its own hint text under the main label.',
      },
    },
  },
};

export const WithDivider: Story = {
  args: {
    idPrefix: 'sign-in-method-divider',
    items: [
      { value: 'nhs-login', label: 'Use NHS login' },
      { value: 'govuk-verify', label: 'Use GOV.UK Verify' },
      { divider: 'or' as const },
      { value: 'create-account', label: 'Create an account' },
    ],
    legend: 'How do you want to sign in?',
    name: 'sign-in-method-divider',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use a divider when one option group is meaningfully different from the others.',
      },
    },
  },
};

export const ConditionalContent: Story = {
  args: {
    hint: 'Choose one contact method.',
    idPrefix: 'contact-method-conditional',
    items: conditionalItems,
    legend: 'How would you prefer to be contacted?',
    name: 'contact-method-conditional',
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio items can reveal conditional content for the currently selected option. This matches the docs-site example with email, phone, and text-message follow-up fields.',
      },
    },
  },
};

export const Inline: Story = {
  args: {
    idPrefix: 'age-inline',
    items: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    className: 'ofh-radios--inline',
    legend: 'Are you 18 or over?',
    name: 'age-inline',
  },
  parameters: {
    docs: {
      description: {
        story: 'For short two-option choices, radios can be displayed inline to match the toolkit docs example.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select how we should contact you',
    hint: 'Choose one way for us to contact you.',
    idPrefix: 'contact-method-error',
    name: 'contact-method-error',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a group-level validation error for radio questions.',
      },
    },
  },
};
