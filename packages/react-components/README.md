# OFH Design System React

React component library for the OFH Design System.

## Installation

Install from the monorepo using a package-specific Git tag and subdirectory.

```bash
pnpm add @ourfuturehealth/react-components@github:ourfuturehealth/design-system-toolkit#react-v0.5.0:packages/react-components
```

or

```bash
npm install @ourfuturehealth/react-components@github:ourfuturehealth/design-system-toolkit#react-v0.5.0:packages/react-components
```

## Usage

```tsx
import {
  Button,
  Card,
  CardCallout,
  CardDoDont,
  ErrorSummary,
  Tag,
  TextInput,
} from '@ourfuturehealth/react-components';
import '@ourfuturehealth/react-components/styles/participant';

function App() {
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
      <Tag variant="brand">Beta</Tag>
      <Button variant="contained">Click me</Button>
      <Card heading="Profile complete" description="You’ve completed all the required profile details." />
      <CardCallout heading="Warning" variant="warning" text="Check this information before you continue." />
      <CardDoDont type="do" items={[{ item: 'keep points short and scannable' }]} />
      <TextInput id="name" label="Your name" />
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

A form input component with label, hint, and error support.

**Props:**

- `label`: string (required)
- `hint`: string
- `error`: string
- `required`: boolean
- `width`: 'full' | 'three-quarters' | 'two-thirds' | 'one-half' | 'one-third' | 'one-quarter'
- `maxLength`: 2 | 3 | 4 | 5 | 10 | 20
- `id`: string

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
- `heading`, `headingLevel`
- `items`

### Icons

React components bundle the toolkit icon sprite automatically. Consumers do not need to copy `/assets/icons/icon-sprite.svg` into their own app to render Card icons.

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

## Hosted Storybook (Netlify)

The React Storybook is deployed as a separate Netlify project from the docs site. The repo-managed build settings live in [netlify.toml](./netlify.toml).

Create the Netlify project with these settings:

1. Connect the `ourfuturehealth/design-system-toolkit` repository.
2. Leave the base directory unset.
3. Set the package directory to `packages/react-components`.
4. Set the production branch to `main`.
5. Enable Deploy Previews and keep preview URLs on the default Netlify preview domain.

After the site is created, configure these settings in Netlify UI:

1. Set password protection at `Project configuration > Access & security > Visitor access > Password Protection`.
2. Choose `Customize this site's protection settings` if team defaults exist.
3. Choose `Basic password protection` with scope `All deploys`.
4. Set a password that is different from the docs site password.
5. Add the production domain `storybook.designsystem.ourfuturehealth.org.uk` in `Domain management`.

If DNS is external to Netlify, create the DNS record shown by Netlify in the `Pending DNS verification` flow and wait for HTTPS provisioning to complete.
