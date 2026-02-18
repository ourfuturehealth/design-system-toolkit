# OFH Design System React

React component library for the OFH Design System.

## Installation

```bash
npm install @ourfuturehealth/react-components
```

## Usage

```tsx
import { Button, TextInput } from '@ourfuturehealth/react-components';

function App() {
  return (
    <div>
      <Button variant="contained">Click me</Button>
      <TextInput label="Your name" />
    </div>
  );
}
```

## Components

### Button

A flexible button component with multiple variants.

**Props:**

- `variant`: 'contained' | 'outlined' | 'ghost' | 'ghost-reverse' | 'text' | 'text-reverse'

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

## Development

This package has two development modes:

### Component Development (dev server)

```bash
pnpm --filter @ourfuturehealth/react-components dev
# or from root: pnpm dev:react-components
```

Runs a Vite dev server serving [src/dev.tsx](src/dev.tsx) - a lightweight playground for developing components in isolation. Toolkit styles are compiled directly from source, so changes to `@ourfuturehealth/toolkit` SCSS are immediately visible.

**When to use**: Quick component iteration without needing the full consumer app.

### Library Build Watch

```bash
pnpm --filter @ourfuturehealth/react-components watch:lib
```

Runs `vite build --watch` to continuously rebuild the library distribution files (`dist/`) when source files change. This compiles components and toolkit styles into the consumable library format.

**When to use**: When developing with [example-react-consumer-app](../example-react-consumer-app/) to see changes reflected in the consumer app immediately.

**Note**: The `dev:react-consumer` root script automatically runs this alongside the consumer app.

### Storybook

```bash
pnpm --filter @ourfuturehealth/react-components storybook
# or from root: pnpm storybook
```

Interactive component documentation and testing environment.

### Build

```bash
pnpm --filter @ourfuturehealth/react-components build
```
