# Example React Consumer App

Example application demonstrating how an external React application consumes `@ourfuturehealth/react-components`.

This app is intentionally configured as a standalone published-consumer example:

- it installs the released `@ourfuturehealth/react-components` tarball
- it imports the published theme stylesheet bundle
- it does not use the monorepo workspace protocol

## Install and run

This app is validated with the repository's recommended Node LTS setup and npm 10.x.

```bash
cd packages/example-react-consumer-app
npm install
npm run dev
```

Or from the repository root:

```bash
pnpm dev:react-consumer
```

## What this app proves

- a published tarball install works in a real consumer app
- the exported React components render in a Vite application
- the published stylesheet entrypoints load correctly

This makes it useful as guidance for future React consumers outside the toolkit repo.

## What this app does not prove

- it is not the workspace-linked hot-reload development harness for the React library
- it does not automatically reflect unreleased local changes in `packages/react-components`

For local library development, use Storybook or the React package directly.

## Testing against an unreleased local tarball

If you need to validate unreleased React package changes in this app:

1. From the repository root, build and pack the React package:

   ```bash
   pnpm --filter=@ourfuturehealth/react-components run build
   npm pack ./packages/react-components --ignore-scripts
   ```

2. In this directory, temporarily install that local tarball:

   ```bash
   npm install ../../ourfuturehealth-react-components-0.5.0.tgz
   ```

3. Run the app again with `npm run dev` or `npm run build`.

Revert the dependency change afterwards if you want to return to the published release example.

## Architecture

- **Vite 7** - Build tool and dev server
- **React 19** - UI framework
- **TypeScript 5.9** - Type checking
- Installs `@ourfuturehealth/react-components` via the published tarball contract
