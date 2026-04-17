# Consuming Our Future Health React Components

This guide explains how to consume the `@ourfuturehealth/react-components` package in your React applications.

## Prerequisites

1. **Node.js** 20.19.0 or higher (Node.js 24 LTS recommended)
2. A package manager that can install tarball dependencies (`pnpm`, `npm`, or Yarn)
3. A React application (React 19+ required)

## Installation

We do not publish `@ourfuturehealth/react-components` to the npm registry. Install a GitHub release tarball instead.

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v{version}/ourfuturehealth-react-components-{version}.tgz",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

Replace `{version}` with the published React package version you want to install.

Then install with your package manager:

```bash
pnpm install
# or
npm install
# or
yarn install
```

This tarball-based install path is smoke-tested against Yarn 1, npm, and pnpm.

You do not need `pnpm` to consume the published package. `pnpm` is only required when working inside this monorepo.

### Unreleased maintainer testing

Do not point consumers at `#main` or the old git-subdirectory install syntax.

For unreleased testing:

```bash
pnpm --filter=@ourfuturehealth/react-components run build
npm pack ./packages/react-components --ignore-scripts
```

Install the resulting local `.tgz` file in the consumer application.

## Usage Example

Import components and styles in your React application:

```tsx
import React from 'react';
import { Button, Table, TextInput } from '@ourfuturehealth/react-components';
import '@ourfuturehealth/react-components/styles/participant';

function App() {
  const symptomsHead = [
    { content: 'Symptom' },
    { content: 'Self-care' },
  ];
  const symptomsRows = [
    [
      { content: 'Dry eyes' },
      { content: 'Use artificial tears' },
    ],
    [
      { content: 'Headache' },
      { content: 'Rest and keep hydrated' },
    ],
  ];

  return (
    <div>
      <TextInput
        id="name"
        label="Your name"
        hint="Enter your full name"
        inputWidth={20}
        onChange={(e) => console.log(e.target.value)}
      />
      <Table caption="Symptoms and self-care" head={symptomsHead} rows={symptomsRows} />
      <Button onClick={() => console.log('Clicked')}>Submit</Button>
    </div>
  );
}

export default App;
```

### Import Styles

Import the stylesheet once in your app's entry point:

```tsx
// main.tsx or App.tsx
import '@ourfuturehealth/react-components/styles/participant';
```

The styles are based on the Our Future Health design system toolkit and include all component styles.

## Theme Selection

Each application should use one theme. Current theme bundles are:

- `participant`
- `research`

### Participant theme

Use the participant styles export:

```tsx
import '@ourfuturehealth/react-components/styles/participant';
```

### Research theme

Use the matching themed styles export:

```tsx
import '@ourfuturehealth/react-components/styles/research';
```

For backward compatibility, `@ourfuturehealth/react-components/styles` remains available and maps to participant.

To add a new custom React theme stylesheet export, follow `docs/theming/adding-a-new-theme.md`.

## Available Components

The React components package currently provides the following components:

- `Button` - Call-to-action buttons and links
- `TextInput` - Text input fields with toolkit-parity hint, error, and width support
- `Fieldset` - Semantic fieldset wrapper for grouped form questions and legends
- `Textarea` - Multi-line text input fields
- `Select` - Native select inputs with toolkit styling and icon affordance
- `DateInput` - Grouped day/month/year input fields
- `Autocomplete` - Accessible text input with filtered suggestion list
- `CharacterCount` - Text input and textarea variants with count feedback
- `Checkboxes` - Grouped checkbox inputs with hints, exclusive options, and conditional reveals
- `Radios` - Grouped radio inputs with hints and conditional reveals
- `Icon` - Toolkit icon component with fixed and responsive sizing using bundled SVG data
- `ErrorSummary` - Page-level validation summaries with linked errors
- `Tag` - Status tags aligned with toolkit Tag variants
- `Card` - Content presentation cards for summaries, status, and next steps
- `CardCallout` - Feedback-style callout cards for informational, warning, success, and error messages
- `CardDoDont` - Positive and negative recommendation lists
- `Table` - Structured content tables with caption, responsive stacking, numeric cells, row headers, and merged-cell support

For complete component documentation and live examples, run Storybook locally from this repository:

```bash
pnpm storybook
```

Or see the [example consumer app](../packages/example-react-consumer-app/) for a small in-repo app that consumes the published tarball contract rather than a workspace dependency.

## TypeScript Support

The package includes full TypeScript definitions. No additional `@types/` packages needed.

```tsx
import type { ButtonProps } from '@ourfuturehealth/react-components';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Build Configuration

### Vite

The React components work out of the box with Vite. No additional configuration needed.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Webpack

If using Webpack, ensure you have appropriate loaders for CSS:

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

## Troubleshooting

### Package not found during installation

Check that:

- the GitHub release exists
- the release has the `.tgz` asset attached
- your dependency points to the release tarball URL

If you are testing unreleased code, build and pack the package locally instead.

### Module not found

**Error**: `Cannot find module '@ourfuturehealth/react-components'`

**Solution**:

- Verify the package is installed: `ls node_modules/@ourfuturehealth/react-components`
- Run your package-manager install command again
- Confirm you are using the tarball URL install contract, not the old git-subdirectory syntax

### Styles not loading

**Error**: Components appear unstyled

**Solution**: Ensure you import the styles:

```tsx
import '@ourfuturehealth/react-components/styles/participant';
```

Import this in your app's entry point (e.g., `main.tsx` or `App.tsx`).

### React version mismatch

**Error**: `Warning: Invalid hook call` or peer dependency warnings

**Solution**: The React components require React 19+. Update your React version with your package manager, for example:

```bash
npm install react@^19.2.4 react-dom@^19.2.4
```

### TypeScript errors

**Error**: Type definitions not found

**Solution**:

- Ensure `"moduleResolution": "bundler"` or `"moduleResolution": "node"` is set in your `tsconfig.json`
- Run your package-manager install command again to ensure type definitions are properly linked

## Contributing in this repository

If you are contributing to the React library inside this monorepo rather than consuming the published package, use the local development guide instead:

- [Running locally](./contributing/running-locally.md)
- [Main repository README](../README.md)
- [Contributing guide](../CONTRIBUTING.md)

## Example Consumer App

The monorepo includes `packages/example-react-consumer-app/`, a small standalone app pinned to the latest published React release. It is useful when you want to verify the package in a real consumer setup rather than through a workspace dependency.

```bash
# from the repository root
pnpm dev:react-consumer
```

Or run it directly from the app directory:

```bash
cd packages/example-react-consumer-app
npm install
npm run dev
```

## Need Help?

1. Review the [React package README](../packages/react-components/README.md)
2. Review the [example consumer app README](../packages/example-react-consumer-app/README.md)
3. Read the [upgrade guide](../UPGRADING.md) for migration instructions
4. Open an issue on [GitHub](https://github.com/ourfuturehealth/design-system-toolkit/issues)
