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

```bash
npm install
npm run dev    # Start development server
npm run test   # Run tests
npm run build  # Build for production
```
