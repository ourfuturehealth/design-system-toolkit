# Design System Documentation

## Setup

```bash
npm install
```

## Usage

```bash
# Build and serve the documentation site
npm run docs:dev
```

## Structure

- The `packages/components/ directory` is symlinked to `site/views/_includes/components/` so
Nunjucks macros for the components can be used in the documentation site.
- TODO: Explain how CSS, JS and image assets are copied from `dist/` and `packages/` to `site/nhsuk-frontend` (to be renamed) 
- TODO: Explain how design examples are generated by `site/views/design-examples.njk`
- TODO: Explain what `site/views/_data/helpers.js` contains