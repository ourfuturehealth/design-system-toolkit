# Our Future Health design system toolkit

> **Note** <br>
> This toolkit is based on the [NHS.UK frontend](https://github.com/nhsuk/nhsuk-frontend), forked as of early 2022, and adapted for Our Future Health needs (which includes a rename of the prefix for all CSS classes to `ofh-`).
>
> We are indebted to the original work carried out by NHS Digital and GDS.

Our Future Health design system toolkit contains the code you need to start building user interfaces for Our Future Health websites and services.

## Monorepo Structure

This repository is organized as a monorepo containing:

- **Core toolkit** - SCSS/CSS design system and vanilla JavaScript components
- **React components** (`packages/react-components/`) - React implementation of the design system
- **Example consumer app** (`packages/example-react-consumer-app/`) - Demonstration of consuming React components

## Prerequisites

**Required:**

- **Node.js 20.19.0+** (minimum required by Vite 7)
  - Recommended: **Node 24.13.1 LTS** (see [.nvmrc](.nvmrc) for nvm users)
  - Any version >= 20.19.0 will work (e.g., 20.x, 22.x, 24.x)
- **pnpm 10+** (This project uses pnpm workspaces - npm/yarn will not work correctly)

**Install pnpm globally:**

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh
```

**Optional - Use nvm for Node version management:**

```bash
# If you use nvm, automatically switch to the recommended version
nvm use

# Or install the recommended version if not already installed
nvm install
```

## Quick Start

```bash
# Clone and install dependencies
git clone <repository-url>
cd design-system-toolkit
pnpm install

# Development workflows
pnpm storybook                  # React component documentation (Storybook)
pnpm dev:react-components       # React component library development
pnpm dev:react-consumer         # Example consumer app with library watch
pnpm dev:site                   # Documentation site development
pnpm dev:toolkit                # Core toolkit development
pnpm dev                        # Run all dev servers concurrently

# Testing & Building
pnpm test                       # Run all tests
pnpm lint                       # Run all linters
pnpm build                      # Build all packages
```

For step-by-step local setup (including fork/clone options and workflow selection), see [Running the application locally](/docs/contributing/running-locally.md).

## Guidance

Visit the [design system docs website](https://designsystem.ourfuturehealth.org.uk/) for examples of components and guidance for when to use them.

## How to install Our Future Health design system toolkit

**Note**
If you're looking to migrate an existing repo from OFH's V1 design system, see [this guide](https://ourfuturehealth.atlassian.net/wiki/spaces/DS/pages/277250064/Implementing+Design+System+V2).

### React Components

For React applications, use the React component library:

- **Installation guide:** [Consuming React Components](/docs/consuming-react-components.md)
- **Package:** `@ourfuturehealth/react-components`

### Traditional CSS/JavaScript

### 1. Install with package managers

We recommend that you [install Our Future Health design system toolkit using node package manager (npm)](/docs/installation/installing-with-npm.md).

### 2. Install by using compiled files

You can also [install Our Future Health design system toolkit using our compiled files](/docs/installation/installing-compiled.md), if you are not currently using a package manager.

## How to make a new release

This monorepo uses **independent versioning** for each package. See the detailed [Release Process documentation](/docs/release-process.md) for full instructions.
For the background on tag naming and monorepo versioning, see [Release Versioning Strategy](/docs/release-versioning-strategy.md).

**Quick summary:**

1. **Update package version**: Edit the `version` field in the specific package's `package.json`:
   - `packages/toolkit/package.json` for toolkit releases
   - `packages/react-components/package.json` for React component releases

2. **Update [CHANGELOG.md](CHANGELOG.md)**: Document what's being released

3. **Commit and push**:

   ```bash
   git add packages/[package-name]/package.json CHANGELOG.md
   git commit -m "chore([package]): bump version to X.X.X"
   git push origin main
   ```

4. **Create and push tag**:
   - Toolkit: `git tag -a toolkit-vX.X.X -m "Release toolkit vX.X.X" && git push origin toolkit-vX.X.X`
   - React: `git tag -a react-vX.X.X -m "Release react vX.X.X" && git push origin react-vX.X.X`

5. **Verify**: Check [GitHub Releases](https://github.com/ourfuturehealth/design-system-toolkit/releases) and test installation

6. **Announce**: Post in #design-system Slack channel

For detailed instructions, release types, and troubleshooting, see the [Release Process documentation](/docs/release-process.md).

## Browsers and assistive technology

Visit our [support for browsers and assistive technology](/docs/contributing/browser-support.md), for details on operating systems and software.

## Contribute

Read our [contributing guidelines](CONTRIBUTING.md) to contribute to Our Future Health design system toolkit.

## Design system docs website

> **Note** <br>
> The docs website is based on the [NHS.UK digital service manual](https://github.com/nhsuk/nhsuk-service-manual/),
> which we have incorporated into our design system toolkit as a statically generated site.

You can find the code for the docs website under the [`packages/site/`](packages/site/) folder. More details below.

This is deployed using Netlify to <https://designsystem.ourfuturehealth.org.uk/>, on every merge to the `main` branch.

The content of this docs website is under review and will be iterated
on continuously whilst the design system toolkit is still in alpha.

### Development

To build the toolkit and site in watch mode, and also serve the docs website
(with hot reload), run the command:

```bash
pnpm dev:site
```

Or to run all development servers concurrently (toolkit, site, and Storybook):

```bash
pnpm dev
```

### Code structure

The design system docs website codebase lives in the [`packages/site/`](packages/site/) directory.
The site uses [Nunjucks](https://mozilla.github.io/nunjucks/) templates and
is built using the [Eleventy](https://www.11ty.dev/) static site generator.

See the [Site Package README](packages/site/README.md) for detailed documentation on the site architecture and development workflow.

## Licence

The codebase is released under the MIT Licence, unless stated otherwise. This covers both the codebase and any sample code in the documentation. The documentation is © Crown copyright and available under the terms of the Open Government 3.0 licence.
