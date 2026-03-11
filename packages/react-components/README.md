# OFH Design System React

React component library for the OFH Design System.

## Installation

Install from the monorepo using a package-specific Git tag and subdirectory.

```bash
pnpm add @ourfuturehealth/react-components@github:ourfuturehealth/design-system-toolkit#react-v0.0.1:packages/react-components
```

or

```bash
npm install @ourfuturehealth/react-components@github:ourfuturehealth/design-system-toolkit#react-v0.0.1:packages/react-components
```

## Usage

```tsx
import { Button, ErrorSummary, TextInput } from '@ourfuturehealth/react-components';
import '@ourfuturehealth/react-components/styles/participant';

function App() {
  return (
    <div>
      <ErrorSummary
        titleText="There is a problem"
        focusOnPageLoad={false}
        errorList={[
          {
            text: 'Enter your name',
            href: '#name',
          },
        ]}
      />
      <Button variant="contained">Click me</Button>
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

**Props:**

- `titleText`: string
- `titleHtml`: string
- `descriptionText`: string
- `descriptionHtml`: string
- `errorList`: { href?: string; text?: string; html?: string; attributes?: object }[]
- `classes`: string
- `attributes`: object
- `idPrefix`: string
- `focusOnPageLoad`: boolean

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
