# Monorepo Migration Guide

This guide explains the monorepo restructure that occurred with v4.0.0 and how to migrate projects consuming the toolkit.

## ⚠️ Will This Break My Project?

**No, existing consumers will NOT automatically break.**

If your project uses a version tag from v3.4.3 or earlier, it will continue to work indefinitely:

```json
{
  "dependencies": {
    "ofh-design-system-toolkit": "github:ourfuturehealth/design-system-toolkit#v3.4.3"
  }
}
```

✅ **This works forever** - Git tags are immutable and point to the pre-refactor code.

### When You WILL Need to Update

You'll need to update your installation syntax if:

| Scenario                                        | Will Break? | When to Update                           |
| ----------------------------------------------- | ----------- | ---------------------------------------- |
| Using `#v3.4.3` or older version tag            | ❌ No       | Only when you want to upgrade to v4.0.0+ |
| Using `#main` branch (no version)               | ✅ Yes      | Immediately after merge                  |
| Trying to upgrade to `#toolkit-v4.0.0` or newer | 🔄 Yes      | Must use new syntax (see below)          |
| No version specified in package.json            | ✅ Yes      | Immediately after merge                  |

**Bottom line:** If you're using a version tag from v3.4.3 or earlier, you're safe and can upgrade on your own timeline.

## Breaking Changes by Version

This section tracks breaking changes across toolkit releases to help with migration planning.

### Toolkit v4.2.0 / React Components v0.2.0 (March 2026)

**Button variant naming alignment**

- **What changed**: Button variant names updated to match Figma specifications
  - `ghost-reverse` → `ghost-inverted`
  - `text-reverse` → `text-inverted`
- **Impact**: CSS classes and React component props require updates
- **Migration guide**: See [Button Variant Migration Guide](./button-variant-migration-guide.md)

### Toolkit v4.1.0 (February 2026)

**Spacing scale update**

- **What changed**: Added 2px spacing point, shifted indices by +1
- **Impact**: Affects `ofh-spacing()`, `ofh-responsive-margin()`, `ofh-responsive-padding()`, utility classes
- **Migration guide**: See spacing migration section in this document

## Overview

**As of v4.0.0**, the toolkit was restructured from a single-package repository into a monorepo with separate packages. This change improves maintainability and separation of concerns, but requires updates to how consuming projects install and reference the toolkit.

### Historic Change Timeline

- **Before v3.4.3** (and earlier): Single-package repository
  - Install: `"ofh-design-system-toolkit": "github:ourfuturehealth/design-system-toolkit#v3.4.3"`
  - All files at repository root
  - Single `package.json`
- **v4.0.0 and later**: Monorepo structure
  - Install: `"@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit"`
  - Packages in subdirectories
  - Multiple package.json files (one per package)
  - Independent package versioning

## What Changed

### Repository Structure

**Before v3.4.3 (single-package):**

```
design-system-toolkit/
├── dist/                          # Compiled CSS & JS outputs
├── packages/
│   ├── components/                # Component templates & source
│   │   ├── action-link/
│   │   │   ├── macro.njk
│   │   │   ├── template.njk
│   │   │   ├── action-link.scss
│   │   │   └── action-link.js
│   │   └── ...
│   └── core/                      # Core styles & utilities
├── site/                          # Documentation site
│   └── views/
├── gulpfile.js                    # Build tasks at root
└── package.json                   # Single package.json
```

**After v4.0.0 (monorepo structure):**

```
design-system-toolkit/
├── packages/
│   ├── toolkit/                   # Design system toolkit package
│   │   ├── dist/                  # Compiled CSS & JS outputs
│   │   ├── components/            # Component templates & source
│   │   │   ├── action-link/
│   │   │   │   ├── macro.njk
│   │   │   │   ├── template.njk
│   │   │   │   ├── action-link.scss
│   │   │   │   └── action-link.js
│   │   │   └── ...
│   │   ├── core/                  # Core styles & utilities
│   │   ├── gulpfile.js            # Toolkit-specific build tasks
│   │   └── package.json           # Toolkit package.json
│   │
│   ├── site/                      # Documentation site package
│   │   ├── views/
│   │   ├── eleventy.config.js
│   │   └── package.json
│   │
│   └── react-components/          # React components package
│       └── ...
├── pnpm-workspace.yaml            # Monorepo workspace config
└── package.json                   # Root workspace package.json
```

### Key Changes

1. **Toolkit moved**: `packages/components/` → `packages/toolkit/components/`
2. **Build outputs moved**: `dist/` → `packages/toolkit/dist/`
3. **Separate package.json files**: Each package now has its own dependencies and scripts
4. **Workspace dependencies**: Packages reference each other using pnpm workspace protocol

## Component Distribution

The toolkit provides three main outputs:

### 1. Compiled Assets (Bundles)

Pre-built, minified files ready for production use:

- **CSS**: `packages/toolkit/dist/ofh-design-system-toolkit.css`
- **JavaScript**: `packages/toolkit/dist/ofh-design-system-toolkit.js`
- **Minified versions**: `*.min.css`, `*.min.js`

**Use case:** Traditional websites, static sites, simple projects that want plug-and-play assets.

**Example:**

```html
<link
  rel="stylesheet"
  href="/node_modules/@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.css"
/>
<script src="/node_modules/@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.js"></script>
```

### 2. Source Files (Module Imports)

Individual component source files for modern build tools:

- **SCSS**: `packages/toolkit/components/**/*.scss`, `packages/toolkit/core/**/*.scss`
- **JavaScript modules**: `packages/toolkit/components/**/*.js`

**Use case:** Modern applications using bundlers (webpack, vite, rollup) that want tree-shaking, selective imports, or customization.

**Example:**

```javascript
// Import only what you need
import { CharacterCount } from '@ourfuturehealth/toolkit/components/character-count/character-count.js';
import { Button } from '@ourfuturehealth/toolkit/components/button/button.js';
```

```scss
// Import specific component styles
@import '@ourfuturehealth/toolkit/components/button/button';
@import '@ourfuturehealth/toolkit/core/settings/colours';

// Or import all styles
@import '@ourfuturehealth/toolkit/ofh.scss';
```

### 3. Nunjucks Templates

Server-side rendering templates for generating HTML:

- **Macros**: `packages/toolkit/components/**/macro.njk`
- **Templates**: `packages/toolkit/components/**/template.njk`

**Use case:** Server-rendered applications using Nunjucks/Eleventy for HTML generation.

**Example:**

```njk
{% from 'button/macro.njk' import button %}
{{ button({ text: "Save and continue" }) }}
```

### What Gets Installed

When you install the toolkit via GitHub, you get **all three** distribution methods:

```bash
pnpm add @ourfuturehealth/toolkit@github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit
# or with npm:
npm install @ourfuturehealth/toolkit@github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit
```

This installs:

```
node_modules/@ourfuturehealth/toolkit/
├── dist/                          # Pre-built bundles ✓
│   ├── ofh-design-system-toolkit.css
│   ├── ofh-design-system-toolkit.js
│   └── ...
├── components/                    # Source files ✓
│   ├── button/
│   │   ├── button.js
│   │   ├── button.scss
│   │   ├── macro.njk              # Templates ✓
│   │   └── template.njk
│   └── ...
├── core/                          # Core styles
├── assets/                        # Icons, images
└── package.json
```

**You choose how to consume it** based on your project's needs!

## Migration Guide for Consuming Projects

### Template Engine Configuration (Nunjucks/Eleventy)

**Before:**

Templates were imported using the full path from the repository root:

```njk
{% from 'packages/components/action-link/macro.njk' import actionLink %}
{% from 'packages/components/breadcrumb/macro.njk' import breadcrumb %}
{% from 'packages/components/button/macro.njk' import button %}
```

Eleventy config had no explicit path configuration:

```javascript
// site.eleventy.config.js (on main branch)
module.exports = function configuration(eleventyConfig) {
  return {
    dir: {
      input: 'site/views/',
      output: 'site/dist/',
    },
  };
};
```

**After:**

Templates are imported using just the component name:

```njk
{% from 'action-link/macro.njk' import actionLink %}
{% from 'breadcrumb/macro.njk' import breadcrumb %}
{% from 'button/macro.njk' import button %}
```

Eleventy config explicitly configures Nunjucks search paths:

```javascript
// packages/site/eleventy.config.js (monorepo structure)
const nunjucks = require('nunjucks');

module.exports = function configuration(eleventyConfig) {
  const nunjucksEnv = nunjucks.configure(
    [
      'views/',
      'views/_includes/',
      './',
      '../toolkit/components/', // Toolkit templates
      '../toolkit/',
    ],
    {
      watch: false,
      noCache: true,
    }
  );

  eleventyConfig.setLibrary('njk', nunjucksEnv);

  return {
    dir: {
      input: 'views/',
      output: 'dist/',
    },
  };
};
```

### CSS/SCSS Imports

**Before:**

```scss
// Import from root packages directory
@import 'packages/core/all';
@import 'packages/components/button/button';
```

**After:**

If consuming via workspace/npm package:

```scss
// Import from toolkit package
@import 'toolkit/ofh.scss'; // All styles

// Or import specific components
@import 'toolkit/core/all';
@import 'toolkit/components/button/button';
```

For site package (using load-path):

```json
{
  "scripts": {
    "build:css": "sass --style compressed --load-path ./node_modules/toolkit ./styles/:./dist/css/"
  }
}
```

### JavaScript Imports

**Before:**

```javascript
// Import from root packages directory
import { Button } from '../packages/components/button/button.js';
```

**After:**

```javascript
// Import from toolkit package
import { Button } from 'toolkit/components/button/button.js';

// Or use the compiled bundle
import 'toolkit/dist/ofh-design-system-toolkit.js';
```

### Package Dependencies

**Before v3.4.3:**

Projects would reference the toolkit repository directly:

```json
{
  "dependencies": {
    "ofh-design-system-toolkit": "github:ourfuturehealth/design-system-toolkit#v3.4.3"
  }
}
```

**After v4.0.0:**

Within the monorepo, use workspace dependencies:

```json
{
  "name": "your-project",
  "dependencies": {
    "toolkit": "workspace:*"
  }
}
```

External projects consuming the toolkit should reference it via GitHub using the package subdirectory:

```json
{
  "name": "external-project",
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#main:packages/toolkit"
  }
}
```

Or reference a specific release tag:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit"
  }
}
```

**Note**: The use of `:packages/toolkit` tells npm/pnpm to install from that subdirectory of the repository. This is required with the monorepo structure.

## Step-by-Step Migration for External Projects

### 1. Update Template Imports

Find all Nunjucks template imports:

```bash
# Search for old import pattern
grep -r "from 'packages/components/" your-project/
```

Replace with new pattern:

```njk
# Old
{% from 'packages/components/button/macro.njk' import button %}

# New
{% from 'button/macro.njk' import button %}
```

### 2. Configure Template Search Paths

Update your Eleventy config (or equivalent template engine config):

```javascript
const nunjucks = require('nunjucks');

const nunjucksEnv = nunjucks.configure(
  [
    'views/',
    'views/_includes/',
    'node_modules/toolkit/components/', // ← Add this
    'node_modules/toolkit/',
  ],
  {
    watch: false,
    noCache: true,
  }
);

eleventyConfig.setLibrary('njk', nunjucksEnv);
```

### 3. Update Asset References

Update paths to compiled CSS and JS files:

```html
<!-- Old -->
<link rel="stylesheet" href="/design-system-toolkit/ofh-design-system-toolkit.css" />
<script src="/design-system-toolkit/ofh-design-system-toolkit.js"></script>

<!-- New (assuming toolkit is in node_modules) -->
<link rel="stylesheet" href="/node_modules/toolkit/dist/ofh-design-system-toolkit.css" />
<script src="/node_modules/toolkit/dist/ofh-design-system-toolkit.js"></script>
```

Or update your build process to copy from the new location:

```javascript
// Eleventy passthrough copy
eleventyConfig.addPassthroughCopy({
  'node_modules/toolkit/dist': 'ofh-design-system-toolkit',
});
```

### 4. Update SCSS Build Configuration

If using Sass CLI with `--load-path`:

```json
{
  "scripts": {
    "build:css": "sass --load-path ./node_modules/toolkit ./styles/:./dist/css/"
  }
}
```

If using webpack or another bundler, ensure `node_modules/toolkit` is in the resolve paths.

### 5. Update Package Reference

Update your `package.json` to reference the toolkit package from GitHub:

**Option 1: Install from specific release tag (recommended)**

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit"
  }
}
```

**Option 2: Install from branch (e.g., main)**

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#main:packages/toolkit"
  }
}
```

**Option 3: Download release zip manually**

Download the `ofh-design-system-toolkit-VERSION.zip` from [GitHub Releases](https://github.com/ourfuturehealth/design-system-toolkit/releases) and extract it to your project.

**Important**: The `:packages/toolkit` suffix is required to install the toolkit package from the monorepo subdirectory.

## Spacing Scale Migration (Index Shift, `@ourfuturehealth/toolkit` v4.1.0+)

The spacing scale now includes a new `2px` point at index `1`.
This is a breaking change from `v4.0.0` and applies from `v4.1.0` onward.

To add this new point, spacing indices were shifted by `+1` for existing non-zero values.

- `0` stays `0`
- `1` is now `2px`
- Previous `1..N` becomes `2..N+1`

### What Changed

- `ofh-spacing()` valid points changed from `0-9` to `0-10`
- Responsive spacing points changed from `0-10` to `0-11`
- Utility class suffixes for spacing (`ofh-u-margin-*`, `ofh-u-padding-*`) follow the same index shift

### Required Updates for Consumers

Update any spacing indices greater than zero by adding `1`.

| Before                                        | After                                         |
| --------------------------------------------- | --------------------------------------------- |
| `ofh-spacing(1)`                              | `ofh-spacing(2)`                              |
| `ofh-spacing(6)`                              | `ofh-spacing(7)`                              |
| `@include ofh-responsive-margin(4, 'bottom')` | `@include ofh-responsive-margin(5, 'bottom')` |
| `@include ofh-responsive-padding(8, 'top')`   | `@include ofh-responsive-padding(9, 'top')`   |
| `ofh-u-margin-1`                              | `ofh-u-margin-2`                              |
| `ofh-u-padding-top-4`                         | `ofh-u-padding-top-5`                         |
| `ofh-u-margin-10`                             | `ofh-u-margin-11`                             |

If you do not update these indices, spacing will render smaller than before.

## Benefits of the New Structure

### For Toolkit Maintainers

- **Separation of concerns**: Toolkit, site, and React components are independent
- **Independent versioning**: Each package can be versioned separately
- **Isolated dependencies**: Each package has only the dependencies it needs
- **Better tooling**: Can run tasks per-package or across workspace
- **Selective consumption**: External projects can install just what they need (toolkit, react-components, etc.)

### For Consumers

- **Cleaner imports**: No need to know internal directory structure
- **Standard npm package**: Toolkit can be consumed like any npm package
- **Flexible consumption**: Use compiled assets, source files, or templates as needed
- **Better IDE support**: Standard package structure improves autocomplete and imports
- **Selective installation**: Install only the packages you need (toolkit vs react-components)

## Release Process

### How Releases Work

The monorepo maintains a GitHub Actions workflow that creates releases when you push a version tag:

1. **Tag a release**: `git tag toolkit-v4.0.0 && git push origin toolkit-v4.0.0`
2. **Workflow runs**: Builds the toolkit, runs tests, and creates a release zip
3. **Release created**: GitHub Release is created with the toolkit zip attached
4. **Consumers install**: External projects can install via GitHub or download the zip

### Installing Individual Packages

Each package in the monorepo can be installed independently:

**Toolkit (styles, components, templates):**

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit"
  }
}
```

**React Components:**

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "github:ourfuturehealth/design-system-toolkit#react-v0.0.1:packages/react-components"
  }
}
```

### What Changed in the Release Process

**Before v3.4.3 (single package):**

- Single `package.json` at root with version
- `npm install` from root would run `prepare` script and build everything
- Git installations would get the entire repository as one package
- One version number for everything: `v3.4.3`, `v3.4.2`, etc.
- Tag format: `v*` (e.g., `v3.4.3`)

**After v4.0.0 (monorepo):**

- Each package has its own `package.json` with **independent versioning**
  - Toolkit: `4.0.0`, `4.0.1`, `4.1.0`...
  - React Components: `0.0.1`, `0.0.2`, `0.1.0`...
- Root `package.json` has no version (it's just a workspace coordinator)
- Git installations must specify subdirectory: `:packages/toolkit` or `:packages/react-components`
- Each package runs its own `prepare` script when installed
- Allows selective installation of only what you need
- **Packages can be released independently** - toolkit doesn't need a new version when react-components updates
- Tag format:
  - Toolkit: `toolkit-v*` (e.g., `toolkit-v4.0.0`)
  - React: `react-v*` (e.g., `react-v0.0.1`)

### Independent Package Versioning

Each package maintains its own semantic version:

| Package                               | Current Version | Purpose                                       |
| ------------------------------------- | --------------- | --------------------------------------------- |
| **@ourfuturehealth/toolkit**          | `4.0.0`         | Core HTML/CSS/JS components and templates     |
| **@ourfuturehealth/react-components** | `0.0.1`         | React wrapper components                      |
| **site**                              | (no version)    | Documentation/examples site (not distributed) |
| **example-react-consumer-app**        | (no version)    | Development example app (not distributed)     |

**When to bump which version:**

**Toolkit only:**

- CSS/SCSS changes
- Component template (`.njk`) changes
- Vanilla JavaScript component changes
- New non-React components

**React Components only:**

- React component implementation changes
- React-specific features
- New React components that don't affect toolkit

**Both:**

- Breaking changes that affect base styles used by React components
- Design system-wide changes
- New components added to both libraries

### Release Workflow Configuration

The toolkit package now includes:

- `"prepare": "gulp bundle"` - Automatically builds when installed from git
- `"files": [...]` - Specifies which files to include when installed
- `"main"` and `"style"` - Entry points for JavaScript and CSS
- `"repository.directory"` - Tells npm this is a monorepo package

This ensures that when external projects install from GitHub, the toolkit is automatically built and ready to use.

## Troubleshooting

### Templates Not Found

**Error**: `Template render error: (unknown path) [Line X, Column Y] Error: template not found: button/macro.njk`

**Solution**: Ensure your template engine is configured with the correct search paths pointing to `node_modules/toolkit/components/` or the appropriate relative path.

### Styles Not Compiling

**Error**: `Error: Can't find stylesheet to import.`

**Solution**: Add `--load-path ./node_modules/toolkit` to your Sass compilation command, or configure your bundler's resolve paths.

### Assets Not Copying

**Error**: CSS/JS files not found in built site

**Solution**: Update your build configuration's passthrough copy or static file handling to point to `node_modules/toolkit/dist/` (or `packages/toolkit/dist/` within the monorepo).

## Example Configurations

### Complete Eleventy Setup

```javascript
// eleventy.config.js
const nunjucks = require('nunjucks');

module.exports = function configuration(eleventyConfig) {
  // Configure Nunjucks to find toolkit templates
  const nunjucksEnv = nunjucks.configure(
    ['views/', 'views/_includes/', 'node_modules/toolkit/components/', 'node_modules/toolkit/'],
    {
      watch: false,
      noCache: true,
    }
  );

  eleventyConfig.setLibrary('njk', nunjucksEnv);

  // Copy toolkit compiled assets
  eleventyConfig.addPassthroughCopy({
    'node_modules/toolkit/dist': 'ofh-design-system-toolkit',
  });

  // Copy toolkit asset files (icons, images, etc.)
  eleventyConfig.addPassthroughCopy({
    'node_modules/toolkit/assets': 'ofh-design-system-toolkit/assets',
  });

  return {
    dir: {
      input: 'views/',
      output: 'dist/',
    },
  };
};
```

### Package Scripts

```json
{
  "name": "your-site",
  "scripts": {
    "build:css": "sass --style compressed --load-path ./node_modules/toolkit ./styles/:./dist/css/",
    "build:eleventy": "eleventy",
    "build": "npm run build:css && npm run build:eleventy",
    "watch:css": "sass --watch --load-path ./node_modules/toolkit ./styles/:./dist/css/",
    "watch:eleventy": "eleventy --serve",
    "dev": "concurrently 'npm:watch:css' 'npm:watch:eleventy'"
  },
  "dependencies": {
    "@ourfuturehealth/toolkit": "^3.4.3",
    "@11ty/eleventy": "^2.0.0",
    "nunjucks": "^3.2.4",
    "sass": "^1.60.0"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

## Need Help?

If you encounter issues during migration:

1. Check that all paths are updated consistently
2. Verify your template engine configuration
3. Ensure toolkit is properly installed in `node_modules`
4. Review the [toolkit documentation site](https://ourfuturehealth.github.io/design-system-toolkit/) for component usage examples
5. Open an issue on the [GitHub repository](https://github.com/ourfuturehealth/design-system-toolkit)
