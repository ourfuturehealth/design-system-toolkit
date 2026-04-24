import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { TextInput } from '../TextInput';
import { Radios, type RadiosProps } from './Radios';

type RadiosStoryArgs = RadiosProps & {
  itemSet?: 'contact' | 'conditional' | 'divider' | 'inline';
};

const contactItems: RadiosProps['items'] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { divider: 'or' as const },
  { value: 'post', label: 'Post' },
];

const conditionalItems: RadiosProps['items'] = [
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

const dividerItems: RadiosProps['items'] = [
  { value: 'nhs-login', label: 'Use NHS login' },
  { value: 'govuk-verify', label: 'Use GOV.UK Verify' },
  { divider: 'or' as const },
  { value: 'create-account', label: 'Create an account' },
];

const inlineItems: RadiosProps['items'] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const radioItemSets: Record<
  NonNullable<RadiosStoryArgs['itemSet']>,
  RadiosProps['items']
> = {
  contact: contactItems,
  conditional: conditionalItems,
  divider: dividerItems,
  inline: inlineItems,
};

const radiosUsageExample = `import { Radios } from '@ourfuturehealth/react-components';

const items = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { divider: 'or' },
  { value: 'post', label: 'Post' },
];

<Radios
  hint="Choose one way for us to contact you."
  items={items}
  legend="How should we contact you?"
  name="contact-method"
/>;
`;

const radioItemsShapeExample = `type RadioItem =
  | {
      value: string | number;
      label: React.ReactNode;
      hint?: React.ReactNode;
      checked?: boolean;
      disabled?: boolean;
      conditional?: React.ReactNode;
      inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    }
  | {
      divider: React.ReactNode;
    };
`;

const renderRadiosBuilderStory = ({ itemSet, ...args }: RadiosStoryArgs) => {
  const items = itemSet ? radioItemSets[itemSet] : args.items ?? contactItems;
  const resolvedArgs = {
    ...args,
    describedBy: args.describedBy || undefined,
    errorMessage: args.errorMessage || undefined,
    hint: args.hint || undefined,
  };

  return (
    <Radios
      {...resolvedArgs}
      items={items}
    />
  );
};

const meta: Meta<RadiosStoryArgs> = {
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
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>legend</code>, <code>name</code>, and an{' '}
            <code>items</code> array. Each item becomes one radio row, and you
            can add a divider row where the list needs a visual break.
          </p>
          <p>
            Use <code>hint</code> for group-level guidance,{' '}
            <code>errorMessage</code> for validation feedback, and use{' '}
            <code>idPrefix</code> when you want predictable generated IDs for
            the inputs and any conditional content.
          </p>
          <Source code={radiosUsageExample} language="tsx" />

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
            Each entry in the <code>items</code> array is either a radio item
            object or a divider row:
          </p>
          <Source code={radioItemsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>itemSet</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can switch between realistic radio
            examples without editing the real <code>items</code> prop. It is not
            a React prop accepted by <code>Radios</code>.
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
      options: ['contact', 'conditional', 'divider', 'inline'],
      description:
        'Builder-only Storybook helper. Switches between the contact, conditional, divider, and inline radio presets.',
      table: {
        category: 'Builder story only',
      },
    },
    legend: {
      control: 'text',
      description: 'Question shown as the fieldset legend for the radio group.',
      table: {
        category: 'RadiosProps',
      },
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the legend and above any error message.',
      table: {
        category: 'RadiosProps',
      },
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the radio items. When present, the fieldset is linked with `aria-describedby`.',
      table: {
        category: 'RadiosProps',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name shared by all radio inputs in the group.',
      table: {
        category: 'RadiosProps',
      },
    },
    idPrefix: {
      control: 'text',
      description: 'Optional prefix used when generating radio IDs.',
      table: {
        category: 'RadiosProps',
      },
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
        category: 'RadiosProps',
      },
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'RadiosProps',
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the legend content in an `h1` when this question is also the page heading.',
      table: {
        category: 'RadiosProps',
      },
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
  render: renderRadiosBuilderStory,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'Choose one way for us to contact you.',
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
        story: 'Default contact-method radio group with a divider between contact options and the sign-in path.',
      },
    },
  },
};

export const Builder: Story = {
  args: {
    describedBy: '',
    errorMessage: '',
    hint: 'Choose one way for us to contact you.',
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
          'Interactive radio example. Switch between the preset item sets and adjust the real group props without editing raw JSON.',
      },
    },
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
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
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story: 'Example of a group-level validation error for radio questions.',
      },
    },
  },
};
