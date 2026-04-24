import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArgTypes, Description, Source, Stories, Title } from '@storybook/addon-docs/blocks';
import { Autocomplete, type AutocompleteProps } from './Autocomplete';

type AutocompleteOptionSet = 'countries' | 'cities' | 'empty';

type AutocompleteStoryArgs = AutocompleteProps & {
  optionSet?: AutocompleteOptionSet;
};

const countriesOptions = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

const citiesOptions = [
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Liverpool',
];

const optionSets: Record<AutocompleteOptionSet, string[]> = {
  countries: countriesOptions,
  cities: citiesOptions,
  empty: [],
};

const defaultStoryCode = `import { Autocomplete } from '@ourfuturehealth/react-components';

const countriesOptions = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

<Autocomplete
  hint="Start typing to filter the list."
  label="Country"
  name="country"
  options={countriesOptions}
/>;
`;

const withErrorStoryCode = `import { Autocomplete } from '@ourfuturehealth/react-components';

const countriesOptions = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

<Autocomplete
  errorMessage="Select a country from the list or enter a new one."
  hint="Start typing to filter the list."
  label="Country"
  name="country"
  options={countriesOptions}
/>;
`;

const fixedWidthStoryCode = `import { Autocomplete } from '@ourfuturehealth/react-components';

const countriesOptions = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

<Autocomplete
  hint="Start typing to filter the list."
  inputWidth={20}
  label="Country"
  name="country"
  options={countriesOptions}
/>;
`;

const customNoResultsStoryCode = `import { Autocomplete } from '@ourfuturehealth/react-components';

const countriesOptions = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

<Autocomplete
  hint="Start typing to filter the list."
  label="Country"
  name="country"
  noResultsText="No matching countries. Enter a new country instead."
  options={countriesOptions}
/>;
`;

const autocompleteUsageExample = `import { Autocomplete } from '@ourfuturehealth/react-components';

const options = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

<Autocomplete
  hint="Start typing to filter the list."
  label="Country"
  name="country"
  options={options}
/>;
`;

const autocompleteOptionsShapeExample = `const options = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];
`;

const renderAutocompleteStory = ({
  optionSet,
  options = countriesOptions,
  ...args
}: AutocompleteStoryArgs) => {
  const resolvedOptions =
    optionSet === undefined ? options : optionSets[optionSet];
  const resolvedArgs = {
    ...args,
    describedBy: args.describedBy || undefined,
    errorMessage: args.errorMessage || undefined,
    hint: args.hint || undefined,
    noResultsText: args.noResultsText || undefined,
  };

  return <Autocomplete {...resolvedArgs} options={resolvedOptions} />;
};

const meta: Meta<AutocompleteStoryArgs> = {
  title: 'Components/Input/Autocomplete',
  component: Autocomplete,
  parameters: {
    docsNamespaceArgKeys: ['id', 'idPrefix', 'name', 'namePrefix'],
    layout: 'padded',
    docs: {
      description: {
        component:
          'Use Autocomplete for a text field that suggests matches while the user types. The React API stays small: pass a label, an array of suggestion strings, and the usual form-field props such as hint, error message, width, and `defaultValue` or `value` when you need them. Use the `Builder` story to explore the component with friendly preset controls, and use the other stories as fixed examples.',
      },
      page: () => (
        <>
          <Title />
          <Description />

          <h2>How to use the React component</h2>
          <p>
            Pass a required <code>label</code>, <code>name</code>, and an{' '}
            <code>options</code> array of suggestion strings. Add{' '}
            <code>hint</code> when the user needs extra guidance, and use{' '}
            <code>errorMessage</code> when you need to show validation feedback.
          </p>
          <p>
            Use <code>noResultsText</code> when your service needs custom empty
            state wording, and use <code>width</code> or <code>inputWidth</code>{' '}
            to control the visible field width.
          </p>
          <Source code={autocompleteUsageExample} language="tsx" />

          <h2>Component props</h2>
          <ArgTypes
            of={Default}
            include={[
              'label',
              'hint',
              'errorMessage',
              'name',
              'options',
              'noResultsText',
              'width',
              'inputWidth',
              'describedBy',
              'isPageHeading',
            ]}
          />

          <h2>
            <code>options</code> shape
          </h2>
          <p>
            Pass a plain array of strings. Each string becomes one suggestion in
            the filtered results list.
          </p>
          <Source code={autocompleteOptionsShapeExample} language="tsx" />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>optionSet</code> is only used by the Storybook{' '}
            <code>Builder</code> story so you can swap between preset suggestion
            lists without editing the real <code>options</code> prop. It is not
            a React prop accepted by <code>Autocomplete</code>.
          </p>

          <Stories title="Examples" />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Country',
    name: 'country',
    options: countriesOptions,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Question or field label shown above the autocomplete input.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    hint: {
      control: 'text',
      description:
        'Optional supporting text shown below the label and above any error message.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    errorMessage: {
      control: 'text',
      description:
        'Validation message shown above the input. When present, the input is marked invalid and linked with `aria-describedby`.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name submitted with the form.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    options: {
      control: false,
      description:
        'Suggestion strings used to build the autocomplete menu. Pass a plain array of labels, for example country names or common answers.',
      table: {
        type: {
          summary: 'string[]',
        },
        category: 'AutocompleteProps',
      },
    },
    optionSet: {
      control: 'select',
      options: ['countries', 'cities', 'empty'],
      description:
        'Storybook-only helper for the Builder story. Switches between preset suggestion lists without editing the real `options` array.',
      table: {
        category: 'Builder story only',
      },
    },
    noResultsText: {
      control: 'text',
      description:
        'Override for the no-results message shown when the query matches no suggestions.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    width: {
      control: 'select',
      options: [
        'full',
        'three-quarters',
        'two-thirds',
        'one-half',
        'one-third',
        'one-quarter',
      ],
      description:
        'Responsive width utility for the autocomplete field, including its suggestions dropdown.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    inputWidth: {
      control: 'select',
      options: [2, 3, 4, 5, 10, 20, 30],
      description:
        'Fixed character-width modifier that helps signal the expected answer length and also constrains the suggestions dropdown width.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    describedBy: {
      control: 'text',
      description:
        'Additional element IDs to append to the component-generated `aria-describedby` value.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    isPageHeading: {
      control: 'boolean',
      description:
        'Wrap the label in an `h1` when this question is also the page heading.',
      table: {
        category: 'AutocompleteProps',
      },
    },
    onOptionSelect: {
      control: false,
      description: 'Called when the user picks an option from the suggestions list.',
      table: {
        category: 'Advanced',
      },
    },
    className: {
      control: false,
      description:
        'Additional classes for the input element itself. Use this only for integration hooks or layout overrides.',
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
      description: 'React ref for the underlying input element.',
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
    hint: 'Start typing to filter the list.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'A realistic autocomplete example with a small set of country suggestions.',
      },
      source: {
        code: defaultStoryCode,
      },
    },
  },
};

export const Builder: Story = {
  args: {
    hint: 'Start typing to filter the list.',
    label: 'Country',
    name: 'country',
    describedBy: '',
    errorMessage: '',
    isPageHeading: false,
    noResultsText: '',
    optionSet: 'countries',
    options: countriesOptions,
  },
  render: renderAutocompleteStory,
  parameters: {
    controls: {
      include: [
        'label',
        'hint',
        'errorMessage',
        'name',
        'optionSet',
        'noResultsText',
        'width',
        'inputWidth',
        'describedBy',
        'isPageHeading',
      ],
    },
    docs: {
      description: {
        story:
          'Use the friendly controls here to explore the component with preset suggestion lists and the most useful visible props.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Select a country from the list or enter a new one.',
    hint: 'Start typing to filter the list.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Shows how the component presents a validation message above the input.',
      },
      source: {
        code: withErrorStoryCode,
      },
    },
  },
};

export const FixedWidth: Story = {
  args: {
    hint: 'Start typing to filter the list.',
    inputWidth: 20,
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Shows the fixed character-width modifier that signals the expected answer length.',
      },
      source: {
        code: fixedWidthStoryCode,
      },
    },
  },
};

export const CustomNoResultsText: Story = {
  args: {
    hint: 'Start typing to filter the list.',
    noResultsText: 'No matching countries. Enter a new country instead.',
  },
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Shows how to override the empty-results message when you need service-specific wording.',
      },
      source: {
        code: customNoResultsStoryCode,
      },
    },
  },
};
