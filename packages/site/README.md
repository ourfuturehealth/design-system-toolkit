# Site Package

Documentation website for the Our Future Health Design System.

## Development

```bash
pnpm --filter site dev
```

This starts four concurrent watch processes:

1. **toolkit** - Watches and builds toolkit distribution files
2. **css** - Watches and compiles site Sass to CSS
3. **js** - Watches and bundles site JavaScript with webpack
4. **eleventy** - Serves the site with hot reload

### Why the toolkit watch is needed

The site package runs an external script from the `@ourfuturehealth/toolkit` package (`pnpm --filter @ourfuturehealth/toolkit watch`). This is necessary because the site uses **two different build outputs** of the toolkit:

#### 1. Webpack Bundle (for main documentation pages)

The site's webpack configuration imports toolkit source files directly:

```js
// scripts/main.js
import "@ourfuturehealth/toolkit/ofh";
```

Webpack watches these source files automatically and rebundles when they change. The output includes both toolkit components and site-specific documentation styles.

**Outputs**: `site/dist/css/main.css`, `site/dist/js/main.min.js`

#### 2. Toolkit Distribution Build (for standalone examples)

Component examples are displayed in iframes using standalone toolkit files without documentation UI styles:

```html
<!-- views/_includes/standalone-example-layout.njk -->
<link
  href="/ofh-design-system-toolkit/ofh-design-system-toolkit.css"
  rel="stylesheet"
/>
<script
  src="/ofh-design-system-toolkit/ofh-design-system-toolkit.js"
  defer
></script>
```

These files come from the toolkit's gulp build process, which must run separately because webpack doesn't generate standalone, framework-agnostic distribution files.

**Outputs**: `toolkit/dist/ofh-design-system-toolkit.css`, `toolkit/dist/ofh-design-system-toolkit.js`

Eleventy is configured to watch `toolkit/dist/` and trigger hot reload when these standalone files change.

## Build

```bash
pnpm --filter site build
```

Builds the static site to `site/dist/`.

## Architecture

- **Eleventy** - Static site generator
- **Sass** - CSS preprocessing
- **Webpack** - JavaScript bundling
- **Nunjucks** - Templating engine
