# OFH Design System React

React component library for the OFH Design System.

## Installation

Install the packaged GitHub release artifact:

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v0.16.0/ourfuturehealth-react-components-0.16.0.tgz",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

Replace `{version}` with the React release you intend to consume.

Then run your package manager install command. This release-tarball contract is smoke-tested against Yarn 1, npm, and pnpm.

```bash
pnpm install
# or
npm install
# or
yarn install
```

For unreleased maintainer testing:

```bash
pnpm --filter=@ourfuturehealth/react-components run build
npm pack ./packages/react-components --ignore-scripts
```

Install the resulting local `.tgz` in the consumer application.

## Usage

```tsx
import {
  Autocomplete,
  Button,
  Card,
  CardCallout,
  CardDoDont,
  CharacterCount,
  Checkboxes,
  DateInput,
  Details,
  ErrorSummary,
  Expander,
  Fieldset,
  Footer,
  InsetText,
  Image,
  Icon,
  LinkAction,
  LinkIcon,
  LinkSkip,
  Pagination,
  Radios,
  Select,
  SummaryList,
  TaskList,
  Tag,
  Textarea,
  TextInput,
} from '@ourfuturehealth/react-components';
import '@ourfuturehealth/react-components/styles/participant';

function App() {
  const countryOptions = ['England', 'Scotland', 'Wales', 'Northern Ireland'];
  const contactCheckboxItems = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'text', label: 'Text message' },
  ];
  const contactRadioItems = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'post', label: 'Post' },
  ];
  const summaryRows = [
    {
      key: { text: 'Name' },
      value: { text: 'Sarah Philips' },
      actions: {
        items: [{ href: '#name', text: 'Change', visuallyHiddenText: 'name' }],
      },
    },
  ];

  return (
    <div>
      <ErrorSummary
        titleText="There is a problem"
        errorList={[
          {
            text: 'Enter your name',
            href: '#name',
          },
        ]}
      />
      <Details summary="Why we ask for this">
        We use your answers to tailor the information you see next.
      </Details>
      <Expander summary="What happens next">
        We will review your answers and let you know if we need any more
        information.
      </Expander>
      <SummaryList rows={summaryRows} />
      <Tag variant="brand">Beta</Tag>
      <TaskList
        items={[
          {
            title: 'Company directors',
            href: '#directors',
            status: {
              children: 'Complete',
              variant: 'green',
            },
          },
          {
            title: 'Registered company details',
            href: '#company-details',
            status: {
              children: 'Incomplete',
              variant: 'blue',
            },
          },
        ]}
      />
      <Button variant="contained">Click me</Button>
      <Pagination
        previousUrl="/section/treatments"
        previousPage="Treatments"
        nextUrl="/section/symptoms"
        nextPage="Symptoms"
      />
      <Icon name="Search" size={24} />
      <LinkAction href="/services/minor-injuries">Find a minor injuries unit</LinkAction>
      <LinkIcon href="/previous-step">Go back</LinkIcon>
      <LinkSkip href="#maincontent" />
      <Card heading="Profile complete" description="You’ve completed all the required profile details." />
      <CardCallout heading="Warning" variant="warning" text="Check this information before you continue." />
      <CardDoDont type="do" items={[{ item: 'keep points short and scannable' }]} />
      <InsetText
        heading="Information"
        text="You can report any suspected side effect to the Yellow Card safety scheme."
        actionLink={{ text: 'Report a side effect', href: '#report-a-side-effect' }}
      />
      <Image
        src="https://assets.nhs.uk/prod/images/S_1017_allergic-conjunctivitis_M15.2e16d0ba.fill-320x213.jpg"
        alt="Picture of allergic conjunctivitis"
        caption="Itchy, red, watering eyes."
      />
      <Fieldset legend="Contact details" legendSize="medium">
        <TextInput id="email" label="Email address" type="email" width="three-quarters" />
        <TextInput id="phone" label="Phone number" type="tel" width="two-thirds" />
      </Fieldset>
      <Footer
        links={[
          { href: '#privacy', label: 'Privacy' },
          { href: '#careers', label: 'Careers' },
        ]}
        smallPrint="© Our Future Health 2026"
      />
      <TextInput id="name" label="Your name" hint="Enter your full name" inputWidth={20} />
      <Textarea id="notes" label="Additional notes" />
      <Select
        id="country"
        label="Country"
        options={[
          { value: '', label: 'Select an option' },
          { value: 'england', label: 'England' },
        ]}
      />
      <DateInput
        id="date-of-birth"
        legend="What is your date of birth?"
        hint="For example, 31 3 1980"
        namePrefix="date-of-birth"
      />
      <Autocomplete
        id="country-autocomplete"
        label="Country"
        hint="Start typing to filter the list."
        name="country-autocomplete"
        options={countryOptions}
      />
      <CharacterCount
        id="summary"
        label="Short summary"
        hint="Do not include personal details."
        maxLength={200}
        name="summary"
      />
      <Checkboxes
        hint="Select all contact methods that apply."
        items={contactCheckboxItems}
        legend="How should we contact you?"
        name="contact-methods"
      />
      <Radios
        hint="Choose one way for us to contact you."
        items={contactRadioItems}
        legend="Preferred contact method"
        name="preferred-contact-method"
      />
    </div>
  );
}
```

### Theme styles

Choose one theme stylesheet import per application:

- `@ourfuturehealth/react-components/styles/participant`
- `@ourfuturehealth/react-components/styles/research`

`@ourfuturehealth/react-components/styles` is kept as a backward-compatible alias for `participant`.

## Components

### Button

A flexible button component with multiple variants.

**Props:**

- `variant`: 'contained' | 'outlined' | 'ghost' | 'ghost-inverted' | 'text' | 'text-inverted'

### TextInput

A form input component with toolkit-parity label, hint, error, and width support.

**Props:**

- `label`: ReactNode (required)
- `hint`: ReactNode
- `errorMessage`: ReactNode
- `required`: boolean
- `width`: 'full' | 'three-quarters' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter'
- `inputWidth`: 2 | 3 | 4 | 5 | 10 | 20 | 30
- `describedBy`: string
- `isPageHeading`: boolean
- `id`: string

### Additional components

The package also provides:

- `Fieldset`
- `Footer`
- `Textarea`
- `Select`
- `DateInput`
- `Autocomplete`
- `CharacterCount`
- `Checkboxes`
- `InsetText`
- `Image`
- `Radios`
- `TaskList`
- `Icon`
- `Pagination`
- `SummaryList`

### ErrorSummary

An error summary component for page-level validation messages.

**Security note:** `titleHtml`, `descriptionHtml`, and `errorList[].html` are rendered as raw HTML. Only pass trusted or properly sanitised content to these props. Do not pass untrusted user input directly into them.

**Props:**

- `titleText`: string
- `titleHtml`: string
- `descriptionText`: string
- `descriptionHtml`: string
- `errorList`: { href?: string; text?: string; html?: string; attributes?: object }[]
- `classes`: string
- `attributes`: object
- `idPrefix`: string

### Card

A content-presentation card for summary, status, and next-step content.

**Props:**

- `variant`: 'basic' | 'clickable'
- `heading`, `headingHtml`, `headingLevel`
- `description`, `descriptionHtml`
- `icon`, `dismissButton`, `number`, `tag`
- `metadataItems`, `helperText`, `helperHtml`, `actionLink`
- `imgURL`, `imgALT`

`tag` uses the React `Tag` component API, so nested tag content is passed with `children` plus optional Tag props such as `variant` and `className`.

### CardCallout

A feedback-style card for contextual info, warning, success, and error content.

**Props:**

- `variant`: 'info' | 'warning' | 'success' | 'error'
- `heading`, `headingHtml`, `headingLevel`
- `text` or `html`

### CardDoDont

A card for short do and don’t recommendation lists.

**Props:**

- `type`: 'do' | 'dont'
- `heading?`: React.ReactNode
- `headingLevel?`: 1 | 2 | 3 | 4 | 5 | 6
- `items`: `{ item: ReactNode }[]`
- `classes?`: string
- `className?`: string
- `ref?`: React ref forwarded to the root card element

### TaskList

A task list that reuses the shared `Tag` component for the status column.

Commonly used props are listed below. `TaskListProps` also includes optional `classes` and `ref` props.

**Props:**

- `items`: `{ title: ReactNode; href?: string; hint?: ReactNode; status: TagProps; className?: string; titleClassName?: string; hintClassName?: string }[]`
- `idPrefix?`: string
- `className?`: string
- `classes?`: styling override classes for the root task list element
- `ref?`: React ref forwarded to the root task list element

### InsetText

A lightweight content callout with feedback border variants, background options, and an optional action link.

**Props:**

- `variant`: 'info' | 'success' | 'warning' | 'error'
- `background`: 'grey' | 'yellow' | 'blue'
- `heading`, `headingHtml`, `headingLevel`
- `text` or `html`
- `actionLink`

### Image

A content image with optional caption and responsive image-source support.

**Props:**

- `src`, `alt`
- `caption`
- `sizes`, `srcSet`

### Icons

React components bundle the toolkit icon data automatically. Use the public `Icon` component rather than maintaining app-local sprite helpers or copying `/assets/icons/icon-sprite.svg` into your own app.
React `Icon` no longer supports overriding the sprite asset path.

### Tag

A status tag component with a simple React API that maps to the toolkit variants.

**Props:**

- `children`: React.ReactNode
- `variant`: 'neutral' | 'brand' | 'blue' | 'green' | 'yellow' | 'red'
- `className`: string

## Development

This package has three development modes:

### Storybook (Recommended)

```bash
pnpm --filter @ourfuturehealth/react-components storybook
# or from root: pnpm storybook
```

Interactive component documentation and testing environment. This is the **primary tool** for developing and showcasing components with full documentation, accessibility tests, and interactive controls.

**When to use**: Component development, documentation, and visual testing.

### Quick Dev Server (Temporary)

```bash
pnpm --filter @ourfuturehealth/react-components dev
# or from root: pnpm dev:react-components
```

Runs a Vite dev server serving [src/dev.tsx](src/dev.tsx) - a minimal playground for quick component iteration.

> **Note**: This is a temporary development aid. Once Storybook stories are complete for all components, dev.tsx will be removed as it duplicates Storybook's functionality.

**When to use**: Very quick component prototyping when Storybook feels too heavy-handed.

### Library Build Watch

```bash
pnpm --filter @ourfuturehealth/react-components watch:lib
```

Runs `vite build --watch` to continuously rebuild the library distribution files (`dist/`) when source files change. This compiles components and toolkit styles into the consumable library format.

**When to use**: When developing with [example-react-consumer-app](../example-react-consumer-app/) to see changes reflected in the consumer app immediately.

**Note**: The `dev:react-consumer` root script automatically runs this alongside the consumer app.

### Build

```bash
pnpm --filter @ourfuturehealth/react-components build
```
