# Consuming Our Future Health React Components

This guide explains how to consume `@ourfuturehealth/react-components` in React applications.

## Prerequisites

1. Node.js `20.19.0` or higher
2. pnpm, npm, or Yarn
3. A React application using React 19+

## Installation

We do not publish `@ourfuturehealth/react-components` to the npm registry. Install the release tarball instead.

Add the dependency to `package.json`:

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v0.5.0/ourfuturehealth-react-components-0.5.0.tgz",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

Then install with your package manager:

```bash
pnpm install
# or
npm install
# or
yarn install
```

This tarball-based install path is smoke-tested against Yarn 1, npm, and pnpm.

### Unreleased maintainer testing

Do not point consumers at `#main` or the old git-subdirectory install syntax.

For unreleased testing:

```bash
pnpm --filter=@ourfuturehealth/react-components run build
npm pack ./packages/react-components --ignore-scripts
```

Install the resulting local `.tgz` file in the consumer application.

## Usage Example

```tsx
import React from 'react';
import { Button, TextInput } from '@ourfuturehealth/react-components';
import '@ourfuturehealth/react-components/styles/participant';

function App() {
  return (
    <div>
      <TextInput
        label="Your name"
        hint="Enter your full name"
        onChange={(e) => console.log(e.target.value)}
      />
      <Button onClick={() => console.log('Clicked')}>Submit</Button>
    </div>
  );
}

export default App;
```

### Import styles

Import one theme stylesheet once in your app entry point:

```tsx
import '@ourfuturehealth/react-components/styles/participant';
```

Available theme bundles:

- `@ourfuturehealth/react-components/styles/participant`
- `@ourfuturehealth/react-components/styles/research`

`@ourfuturehealth/react-components/styles` remains available as a backward-compatible alias for `participant`.

## Available Components

The package currently provides:

- `Button`
- `TextInput`
- `ErrorSummary`
- `Tag`
- `Card`
- `CardCallout`
- `CardDoDont`

For complete component documentation and live examples, run Storybook:

```bash
pnpm storybook
```

Or see the [example consumer app](../packages/example-react-consumer-app/) for a small in-repo app that consumes the published tarball contract rather than a workspace dependency.

## TypeScript Support

The package includes TypeScript definitions. No additional `@types/` packages are required.

```tsx
import type { ButtonProps } from '@ourfuturehealth/react-components';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Build Configuration

### Vite

The React components work out of the box with Vite.

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Webpack

Ensure you have appropriate CSS loaders:

```javascript
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

If `@ourfuturehealth/react-components` cannot be resolved:

- verify the package is installed in `node_modules`
- run your package-manager install again
- confirm you are using the tarball URL install contract, not the old git-subdirectory syntax

### Styles not loading

Import the stylesheet once in your entry point:

```tsx
import '@ourfuturehealth/react-components/styles/participant';
```

### React version mismatch

The React components require React 19+:

```bash
pnpm add react@^19.2.4 react-dom@^19.2.4
```

## Development and Contributing

For development:

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm storybook`
4. Make changes in `packages/react-components/`
5. Run `pnpm test:react-components`
6. Run `pnpm lint:react-components`
7. Run `pnpm build`

See the main [README.md](../README.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) for more detail.
