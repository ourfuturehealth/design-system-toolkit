import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const items = [
  { value: '', text: 'Choose an option' },
  { value: 'email', text: 'Email' },
  { value: 'phone', text: 'Phone' },
  { value: 'text-message', text: 'Text message', disabled: true },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A native select that reuses the toolkit select classes and shared input-family label, hint, error, and icon treatment.',
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
      description: 'Visible label content for the select.',
    },
    hint: {
      control: 'text',
      description: 'Optional hint text shown below the label.',
    },
    errorMessage: {
      control: 'text',
      description: 'Optional error message shown above the select.',
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an h1 when the question is the page heading.',
    },
    items: {
      control: false,
      description: 'Option items rendered within the select.',
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
    labelClassName: 'ofh-label--l',
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
};
