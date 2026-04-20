import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArgTypes,
  Description,
  Source,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks';
import { SearchInput, type SearchInputProps } from './SearchInput';

type SearchInputStoryArgs = SearchInputProps & {
  inputId?: string;
};

const defaultSearchInputSource = `import { SearchInput } from '@ourfuturehealth/react-components';

<SearchInput
  action="/search"
  label="Search the site"
  name="q"
  placeholder="Search"
/>;
`;

const stateShowcaseStyles = `
.search-input-story__grid {
  display: grid;
  gap: 1.5rem;
  max-width: 32rem;
}

.search-input-story__item {
  display: grid;
  gap: 0.5rem;
}

.search-input-story__label {
  font: 600 0.95rem/1.4 sans-serif;
  margin: 0;
}

.search-input-story__state--hover .ofh-search-input__button {
  background-color: #002d61;
}

.search-input-story__state--active .ofh-search-input__button {
  background-color: #002d61;
}

.search-input-story__state--input-focus .ofh-search-input__field {
  border-radius: 8px 0 0 8px;
  box-shadow: 0 0 0 4px #0053b3;
  z-index: 1;
}

.search-input-story__state--button-focus .ofh-search-input__button {
  border-radius: 8px;
  outline: 4px solid #0053b3;
  outline-offset: 4px;
  position: relative;
  z-index: 1;
}
`;

const meta: Meta<SearchInputStoryArgs> = {
  title: 'Components/Input/Search input',
  component: SearchInput,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <h2>How to use the React component</h2>
          <p>
            SearchInput is a compact search control made of a single search
            field and an icon-only submit button.
          </p>
          <p>
            The real React API is intentionally small: <code>label</code> gives
            the field its accessible name, <code>action</code>,{' '}
            <code>method</code>, <code>name</code>, <code>placeholder</code>,
            and <code>defaultValue</code> configure the submitted request, and{' '}
            <code>submitLabel</code> sets the accessible name of the icon-only
            submit button.
          </p>
          <p>
            Use <code>inputProps</code> only for extra native input attributes
            such as <code>autoComplete</code>, <code>required</code>, or data
            attributes. Empty states and &ldquo;no results found&rdquo; feedback
            belong to the consuming search experience rather than the component
            itself.
          </p>
          <Source code={defaultSearchInputSource} language="tsx" />
          <h2>Component props</h2>
          <ArgTypes of={SearchInput} />
          <Stories includePrimary={false} title="Stories" />
        </>
      ),
    },
  },
  args: {
    action: '/search',
    label: 'Search the site',
    name: 'q',
    placeholder: 'Search',
    submitLabel: 'Search',
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'Accessible name for the search field. It is rendered with the shared visually-hidden utility in v1.',
    },
    name: {
      control: 'text',
      description: 'Form field name submitted with the search request.',
    },
    action: {
      control: 'text',
      description: 'Form action URL for the search request.',
    },
    method: {
      control: 'radio',
      options: ['get', 'post'],
      description: 'HTTP method used by the wrapping form.',
    },
    placeholder: {
      control: 'text',
      description:
        'Optional helper text shown in the field when it is empty. This does not replace the accessible label.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial search term rendered into the field.',
    },
    submitLabel: {
      control: 'text',
      description:
        'Accessible name applied to the icon-only submit button.',
    },
    inputProps: {
      control: false,
      description:
        'Extra native input attributes passed to the underlying `<input type="search">`, such as `autoComplete`, `required`, or data attributes.',
    },
    inputId: {
      control: false,
      description:
        'Story-only helper used to keep showcase instance IDs deterministic.',
      table: {
        category: 'Builder story only',
      },
    },
    className: {
      control: false,
      description: 'Additional classes applied to the root `<form>` element.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description: 'React ref for the root `<form>` element.',
      table: {
        category: 'Advanced',
      },
    },
    inputRef: {
      control: false,
      description: 'React ref for the underlying `<input>` element.',
      table: {
        category: 'Advanced',
      },
    },
  },
};

export default meta;
type Story = StoryObj<SearchInputStoryArgs>;

export const Default: Story = {
  args: {
    inputProps: {
      id: 'search-input-default',
    },
  },
};

export const Builder: Story = {
  args: {
    inputProps: {
      autoComplete: 'off',
      id: 'search-input-builder',
    },
  },
  render: ({ inputId, inputProps, ...args }) => (
    <SearchInput
      {...args}
      inputProps={{
        ...inputProps,
        id: inputId ?? inputProps?.id,
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the Builder controls to tune the submitted search target, field name, placeholder text, and button label. The component still only owns the control itself; search-result messaging belongs to the consuming page.',
      },
    },
  },
};

export const StateShowcase: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Fixed visual states for quick design review. These wrappers only simulate the pseudo-class styling for documentation; the public component API stays control-only.',
      },
    },
  },
  render: () => (
    <>
      <style>{stateShowcaseStyles}</style>
      <div className="search-input-story__grid">
        {[
          ['Default', 'search-input-story__state--default'],
          ['Hover', 'search-input-story__state--hover'],
          ['Active', 'search-input-story__state--active'],
          ['Input focus', 'search-input-story__state--input-focus'],
          ['Button focus', 'search-input-story__state--button-focus'],
        ].map(([label, className]) => (
          <div className="search-input-story__item" key={label}>
            <p className="search-input-story__label">{label}</p>
            <div className={className}>
              <SearchInput
                action="/search"
                inputProps={{
                  id: `search-input-${label.toLowerCase().replace(/\s+/g, '-')}`,
                }}
                label="Search the site"
                placeholder="Search"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  ),
};
