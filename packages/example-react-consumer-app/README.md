# Example React Consumer App

Example application demonstrating how to consume `@ourfuturehealth/react-components` in a React project.

## Development

```bash
pnpm dev:react-consumer
# or from this directory: pnpm dev
```

This runs **two concurrent processes**:

1. **Library watch** - Rebuilds `@ourfuturehealth/react-components/dist/` when source files change
2. **App dev server** - Vite dev server for this consumer app (port 5174)

### Why library watch is needed

This consumer app imports the **built library** from `@ourfuturehealth/react-components` workspace dependency:

```tsx
import { Button } from "@ourfuturehealth/react-components";
```

When you make changes to:

- Toolkit styles (e.g., button background colors)
- React component implementations
- Component TypeScript definitions

The react-components library must rebuild its `dist/` directory for this consumer app to see the changes. Running `dev:react-consumer` ensures both the library rebuilds and the consumer's dev server picks up those changes automatically.

### Development without library watch

```bash
pnpm --filter @ourfuturehealth/example-react-consumer-app dev
```

Runs only the consumer app's dev server. Use this when you're **not** modifying the library, and only working on consumer app code.

## Architecture

- **Vite 7** - Build tool and dev server
- **React 19** - UI framework
- **TypeScript 5.9** - Type checking
- Imports `@ourfuturehealth/react-components` via pnpm workspace protocol
