# Application architecture

## Monorepo Structure

This repository is organized as a **pnpm workspace monorepo** containing multiple packages:

### Packages

**`packages/toolkit/`** - Core Design System

- SCSS/CSS design system and vanilla JavaScript components
- Distributed via GitHub releases
- Built with Gulp
- Versioned independently (e.g., v4.0.0)

**`packages/react-components/`** - React Component Library

- React implementation of the design system
- Imports and compiles toolkit SCSS
- Distributed via GitHub releases
- Built with Vite
- Versioned independently (e.g., v0.0.1)

**`packages/site/`** - Documentation Website

- Static documentation site built with Eleventy
- Uses Nunjucks templates
- Deployed to designsystem.ourfuturehealth.org.uk via Netlify
- Not versioned (documentation only)

**`packages/example-react-consumer-app/`** - Example Consumer App

- Demonstrates how an external-style consumer installs and uses the published React tarball contract
- Built with Vite
- Not versioned (example only)

### Root Directory

**`.github/`**

GitHub specific files, such as workflows, templates for pull requests and issues.

**`docs/`**

Markdown files for documentation on GitHub, including contributing guidelines, coding standards, and architectural docs (like this one).

**`node_modules/`** (Auto-generated)

pnpm workspace node modules. Generated when running `pnpm install`. Don't manually edit.

**`turbo.json`**

Turborepo configuration for orchestrating monorepo tasks (build, test, lint).

**`pnpm-workspace.yaml`**

Defines which directories are packages in the pnpm workspace.

## Build Tools

- **pnpm**: Package manager and workspace coordinator
- **Turbo**: Task orchestration for parallel builds/tests/lints
- **Gulp**: Toolkit build system (CSS/JS compilation, bundling)
- **Vite**: React packages build system (modern, fast HMR)
- **Eleventy**: Static site generator for documentation
- **Webpack**: Site JavaScript bundling

## Development Workflows

See [Running Locally](running-locally.md) for detailed setup instructions.

### Architecture Highlights

**Shared Dependencies**: The toolkit package is a workspace dependency for both react-components and site packages. Changes to toolkit SCSS are automatically picked up:

- Site webpack watches toolkit source files
- React components import toolkit SCSS at build time
- Standalone examples use toolkit's gulp-built distribution files

**Independent Builds**: Each package has its own build configuration:

- Toolkit: `gulp build` → `dist/`
- React components: `vite build` → `dist/`
- Site: `eleventy build` + `webpack` → `dist/`
- Consumer app: `vite build` → `dist/`

**Dual Build System for Site**: The site package uses toolkit in two ways:

1. Webpack bundles toolkit source for main documentation pages
2. Gulp-built toolkit dist/ is used for standalone iframe examples

See [Site Package README](../../packages/site/README.md) for details on why this architecture exists.

---

Next: [Coding standards and style guide](coding-standards.md)
