# WORK IN PROGRESS (Needs to be updated)

# Consuming Our Future Health React Components

This guide explains how to consume the `@ourfuturehealth/react-components` package in your React applications.

## Prerequisites

1. **Node.js** 20.19.0 or higher (Node.js 24 LTS recommended)
2. **pnpm** (recommended) or npm as package manager
3. A React application (React 19+ required)

## Installation

> **Note:** As of v4.0.0, this repository is a monorepo. The React components package is located in `packages/react-components/`.

Currently, the React components are not published to npm registry. Install directly from GitHub:

### Using pnpm (recommended)

```bash
pnpm add @ourfuturehealth/react-components@github:ourfuturehealth/design-system-toolkit#react-v0.0.1:packages/react-components
```

### Using npm

```bash
npm install @ourfuturehealth/react-components@github:ourfuturehealth/design-system-toolkit#react-v0.0.1:packages/react-components
```

### Version Pinning

- **Production**: Use specific version tags (e.g., `#react-v0.0.1`)
- **Development**: You can use `#main:packages/react-components` but ensure your lockfile pins a specific commit

**package.json example:**

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "github:ourfuturehealth/design-system-toolkit#react-v0.0.1:packages/react-components",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

## Usage Example

Import components and styles in your React application:

```tsx
import React from "react";
import { Button, TextInput } from "@ourfuturehealth/react-components";
import "@ourfuturehealth/react-components/styles";

function App() {
  return (
    <div>
      <TextInput
        label="Your name"
        hint="Enter your full name"
        onChange={(e) => console.log(e.target.value)}
      />
      <Button onClick={() => console.log("Clicked")}>Submit</Button>
    </div>
  );
}

export default App;
```

### Import Styles

Import the stylesheet once in your app's entry point:

```tsx
// main.tsx or App.tsx
import "@ourfuturehealth/react-components/styles";
```

The styles are based on the Our Future Health design system toolkit and include all component styles.

## Available Components

The React components package currently provides the following components:

- `Button` - Call-to-action buttons
- `TextInput` - Text input fields

**More components coming soon!** We're actively developing additional React wrappers for the design system toolkit components.

For complete component documentation and live examples, run Storybook:

```bash
pnpm storybook
```

Or see the [example consumer app](../packages/example-react-consumer-app/) for usage demonstrations.

## TypeScript Support

The package includes full TypeScript definitions. No additional `@types/` packages needed.

```tsx
import type { ButtonProps } from "@ourfuturehealth/react-components";

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Build Configuration

### Vite

The React components work out of the box with Vite. No additional configuration needed.

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

## Troubleshooting

### Package not found during installation

**Error**: `fatal: Could not read from remote repository`

**Solution**: Ensure you have access to the GitHub repository. If it's a private repository, you may need to configure Git with your credentials or SSH key.

### Module not found

**Error**: `Cannot find module '@ourfuturehealth/react-components'`

**Solution**:

- Verify the package is installed: `ls node_modules/@ourfuturehealth/react-components`
- Run `pnpm install` or `npm install` again
- Check your `package.json` has the correct syntax with `:packages/react-components` suffix

### Styles not loading

**Error**: Components appear unstyled

**Solution**: Ensure you import the styles:

```tsx
import "@ourfuturehealth/react-components/styles";
```

Import this in your app's entry point (e.g., `main.tsx` or `App.tsx`).

### React version mismatch

**Error**: `Warning: Invalid hook call` or peer dependency warnings

**Solution**: The React components require React 19+. Update your React version:

```bash
pnpm add react@^19.2.4 react-dom@^19.2.4
```

### TypeScript errors

**Error**: Type definitions not found

**Solution**:

- Ensure `"moduleResolution": "bundler"` or `"moduleResolution": "node"` is set in your `tsconfig.json`
- Run `pnpm install` to ensure type definitions are properly linked

## Development and Contributing

For development and contributing to the React components:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run Storybook: `pnpm storybook`
4. Make changes in `packages/react-components/`
5. Run tests: `pnpm test:react-components`
6. Lint code: `pnpm lint:react-components`
7. Build all packages: `pnpm build`

See the main [README.md](../README.md) for detailed setup instructions and the [contributing guide](../CONTRIBUTING.md) for guidelines.

## Example Consumer App

The monorepo includes an example consumer app demonstrating usage:

```bash
# Run the example app
pnpm dev:react-consumer
```

The example app is located in `packages/example-react-consumer-app/` and shows how to consume the React components in a real application.

## Need Help?

1. Check the [Storybook](https://github.com/ourfuturehealth/design-system-toolkit#storybook) for component examples
2. Review the [example consumer app](../packages/example-react-consumer-app/)
3. Read the [migration guide](./monorepo-migration-guide.md) for monorepo structure details
4. Open an issue on [GitHub](https://github.com/ourfuturehealth/design-system-toolkit/issues)
