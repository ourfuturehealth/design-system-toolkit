# Running the application locally

## Requirements

To run Our Future Health design system toolkit locally you'll need to:

- [Set up git](https://help.github.com/articles/set-up-git/)
- **Node.js 20.19.0+** (recommended: Node 24.13.1 LTS - see [.nvmrc](../../.nvmrc))
- **pnpm 10+** (required - this project uses pnpm workspaces)

> Type `git --version` to check if git is installed. This should print a version number like "git version 2.39.0".

> Type `node -v` to check if Node is installed. This should print a version number like "v24.13.0".

> Type `pnpm --version` to check if pnpm is installed. This should print a version number like "10.29.2".

### Install pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh
```

### Optional: Use nvm for Node version management

If you use nvm, the project includes an `.nvmrc` file:

```bash
nvm use
# or install the recommended version
nvm install
```

## 1. Fork the repository

[Fork the repository](https://help.github.com/articles/fork-a-repo/) first, if you're an external contributor.

## 2. Clone the repository

You can clone the repository directly if you're a member of the Our Future Health GitHub organisation:

```bash
git clone https://github.com/ourfuturehealth/design-system-toolkit.git
```

Otherwise you'll have to clone your own fork:

```bash
git clone https://github.com/[Username]/design-system-toolkit.git design-system-toolkit
```

> Replace '[Username]' in the git clone command above with your own GitHub username.

## 3. Install dependencies

We use [pnpm](https://pnpm.io/) to manage dependencies in this monorepo.

Navigate to the project directory and install all dependencies:

```bash
cd design-system-toolkit
pnpm install
```

This will install dependencies for all packages in the workspace.

## 4. Start local development servers

The monorepo contains multiple packages. Choose the development workflow that matches what you're working on:

### Option A: Documentation Site (Eleventy)

Build and serve the documentation website with hot reload:

```bash
pnpm dev:site
```

The site will be available at [http://localhost:8080](http://localhost:8080).

### Option B: React Components (Storybook)

Develop React components with Storybook:

```bash
pnpm storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

### Option C: Core Toolkit

Work on the core design system (SCSS, vanilla JS):

```bash
pnpm dev:toolkit
```

This runs gulp watch to rebuild toolkit distribution files.

### Option D: React Consumer Example

Test consuming the React components library:

```bash
pnpm dev:react-consumer
```

This runs both the library build watch and the consumer app dev server at [http://localhost:5174](http://localhost:5174).

### Option E: Everything

Run all development servers concurrently:

```bash
pnpm dev
```

This starts toolkit watch, site dev server, and Storybook simultaneously.

## Package Structure

The monorepo contains:

- **`packages/toolkit/`** - Core design system (SCSS, JS, templates)
- **`packages/react-components/`** - React component library
- **`packages/site/`** - Documentation website (Eleventy)
- **`packages/example-react-consumer-app/`** - Example React consumer app

See the main [README](../../README.md) for more details on the monorepo structure.

---

Next: [Application architecture](application-architecture.md)
