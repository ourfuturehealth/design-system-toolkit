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
    hint: 'Choose one way for us to contact you.',
  },
};

export const WithItemHints: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Each radio item can carry its own hint text under the main label.',
      },
    },
  },
};

export const ConditionalContent: Story = {
  args: {
    hint: 'Choose one contact method.',
    items: conditionalItems,
    legend: 'How would you prefer to be contacted?',
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
    items: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    className: 'ofh-radios--inline',
    legend: 'Are you 18 or over?',
    name: 'age',
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a group-level validation error for radio questions.',
      },
    },
  },
};
