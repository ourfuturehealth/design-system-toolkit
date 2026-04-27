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
  z-index: 1;
}

.search-input-story__state--input-focus .ofh-search-input__field::after {
  opacity: 1;
}

.search-input-story__state--button-focus .ofh-search-input__button {
  position: relative;
  z-index: 1;
}

.search-input-story__state--button-focus .ofh-search-input__button::after {
  opacity: 1;
}
`;

const meta: Meta<SearchInputStoryArgs> = {
  title: 'Components/Input/Search',
  component: SearchInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact search control that renders a `<form role="search">` containing a visually hidden field label, a single `<input type="search">`, and an icon-only submit button. Pass standard form props such as `onSubmit` to the component itself, and use `inputProps` only for additional native input attributes that the component does not already own.',
      },
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
          <ArgTypes
            of={Default}
            include={[
              'label',
              'action',
              'method',
              'name',
              'placeholder',
              'defaultValue',
              'submitLabel',
              'inputProps',
            ]}
          />

          <h2>Storybook builder helpers</h2>
          <p>
            <code>inputId</code> is only used by the Storybook{' '}
            <code>Builder</code> story so the examples keep deterministic field
            IDs. It is not a React prop accepted by <code>SearchInput</code>.
          </p>
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
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description:
        'Required accessible name for the search field. In v1 it is rendered with the shared visually-hidden utility, so write it as the complete standalone label a screen reader should announce.',
      table: {
        category: 'SearchInputProps',
      },
    },
    name: {
      control: 'text',
      description:
        'HTML field name submitted with the search term. It defaults to `q`, which matches common search endpoints.',
      table: {
        category: 'SearchInputProps',
      },
    },
    action: {
      control: 'text',
      description:
        'Form action URL for the submitted search request. Leave it blank to submit to the current page, or set it explicitly when the search form should target another route.',
      table: {
        category: 'SearchInputProps',
      },
    },
    method: {
      control: 'radio',
      options: ['get', 'post'],
      description:
        'HTTP method used by the wrapping `<form>`. Use `get` for typical site or content search, and switch to `post` only when the receiving endpoint requires it.',
      table: {
        category: 'SearchInputProps',
      },
    },
    placeholder: {
      control: 'text',
      description:
        'Optional helper text shown inside the field when it is empty. This supports the control visually but does not replace the accessible label.',
      table: {
        category: 'SearchInputProps',
      },
    },
    defaultValue: {
      control: 'text',
      description:
        'Initial search term rendered into the field before the user types. This is useful on search-results pages that echo the submitted query back into the control.',
      table: {
        category: 'SearchInputProps',
      },
    },
    submitLabel: {
      control: 'text',
      description:
        'Accessible name applied to the icon-only submit button. Screen readers use this because the visible button only shows the search icon.',
      table: {
        category: 'SearchInputProps',
      },
    },
    inputProps: {
      control: false,
      description:
        'Optional passthrough for extra native `<input type="search">` attributes such as `autoComplete`, `required`, `aria-*`, or `data-*`. The component still owns the structure, `type`, and the main search props listed above.',
      table: {
        category: 'SearchInputProps',
      },
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
      description:
        'Additional classes applied to the root `<form>` element. Most consumers should not need this unless the surrounding layout requires an integration hook.',
      table: {
        category: 'Advanced',
      },
    },
    ref: {
      control: false,
      description:
        'React ref for the root `<form>` element when the consuming page needs direct form access.',
      table: {
        category: 'Advanced',
      },
    },
    inputRef: {
      control: false,
      description:
        'React ref for the underlying `<input>` element when the consuming page needs to focus or read the field directly.',
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
