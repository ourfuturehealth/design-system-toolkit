import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const items = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email' },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Input/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A native select that reuses the toolkit select classes and shared input-family label, hint, error, and icon treatment. Each item defines the visible option text and value, with optional `optionProps` for extra native `<option>` attributes.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items,
    label: 'Preferred contact method',
    name: 'contact-method',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Question or field label shown above the select.',
    },
    hint: {
      control: 'text',
      description: 'Optional supporting text shown below the label and above any error message.',
    },
    errorMessage: {
      control: 'text',
      description: 'Validation message shown above the select. When present, the select is marked invalid and linked with `aria-describedby`.',
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
    },
    describedBy: {
      control: 'text',
      description: 'Additional element IDs to append to the component-generated `aria-describedby` value.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an `h1` when this question is also the page heading.',
    },
    items: {
      control: false,
      description: 'Option items rendered inside the select. Each item uses `text`, `value`, and optional `disabled`, `selected`, or `optionProps` values.',
      table: {
        type: {
          summary: 'SelectItem[]',
          detail:
            "{ text: ReactNode; value?: string | number; disabled?: boolean; selected?: boolean; optionProps?: OptionHTMLAttributes<HTMLOptionElement> }[]",
        },
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
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select how you would like us to contact you',
  },
};

export const WithSelectedOption: Story = {
  args: {
    items: [
      { value: '', text: 'Choose an option' },
      { value: 'email', text: 'Email', selected: true },
      { value: 'phone', text: 'Phone' },
      { value: 'text-message', text: 'Text message', disabled: true },
    ],
  },
};

export const AsPageHeading: Story = {
  args: {
    isPageHeading: true,
    label: 'How should we contact you?',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `isPageHeading` when the select question should also be announced as the page heading.',
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
        items={items}
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
        story: 'Example of how selects work together in a form.',
      },
    },
  },
};
