# Installing with a package manager

This guide covers package-manager installation for `@ourfuturehealth/toolkit`.
The supported install contract is the toolkit release tarball URL, which is smoke-tested against Yarn 1, npm, and pnpm.

## Requirements

To use the toolkit in your project you must:

1. Have [Node.js](https://nodejs.org/en/) installed (`20.19.0` or higher). We recommend Node.js 24 LTS.
2. Have a `package.json` file in your project.
3. Have a pipeline set up to compile [Sass](https://sass-lang.com/) files to CSS if you are importing toolkit Sass.
4. Install [Nunjucks](https://mozilla.github.io/nunjucks/) if you want to use toolkit macros.

```bash
pnpm add nunjucks
# or
npm install nunjucks --save
```

## Installation

We do not publish `@ourfuturehealth/toolkit` to the npm registry. Install the packaged GitHub release artifact instead.

Add the dependency to `package.json`:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v{version}/ourfuturehealth-toolkit-{version}.tgz"
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

Use a specific tag for production upgrades. Replace `{version}` with the toolkit version you intend to consume.

### Unreleased maintainer testing

Do not point consumers at `#main` or the old git-subdirectory install syntax.

For unreleased testing:

```bash
pnpm --filter=@ourfuturehealth/toolkit run zip
npm pack ./packages/toolkit --ignore-scripts
```

Install the resulting local `.tgz` file in the consumer application.

### Compiled files only

If your project only needs prebuilt CSS, JavaScript, and assets, use the toolkit `.zip` release asset instead. Compiled-file installs do not support toolkit Sass imports, JavaScript module imports, or Nunjucks macros. See [Installing using compiled files](./installing-compiled.md).

## Configuration

You will usually need these pieces:

- [Importing styles](#importing-styles)
- [Importing JavaScript](#importing-javascript)
- [Importing assets](#importing-assets)

## Importing styles

Place toolkit imports before your own Sass rules.

### Choose a theme (recommended)

Each application should pick one theme:

- `participant`
- `research`

Use the matching theme entrypoint:

```scss
@import '@ourfuturehealth/toolkit/ofh-participant';
```

```scss
@import '@ourfuturehealth/toolkit/ofh-research';
```

To add a new custom theme, follow `docs/theming/adding-a-new-theme.md`.

### Default entrypoint (legacy-compatible)

`@ourfuturehealth/toolkit/ofh` currently resolves to the participant theme:

```scss
@import '@ourfuturehealth/toolkit/ofh';
```

You can also import toolkit layers individually:

```scss
@import '@ourfuturehealth/toolkit/core/all';
@import '@ourfuturehealth/toolkit/components/action-link/action-link';
```

## Importing JavaScript

Some toolkit components require JavaScript for behaviour, usability, and accessibility.

Add the following JavaScript to the top of the `<body>` section of your page template:

```html
<script>
  document.body.className = document.body.className ? `${document.body.className} js-enabled` : 'js-enabled';
</script>
```

### Option 1: Include compiled JavaScript

Reference the compiled bundle from the installed package:

```html
<script src="node_modules/@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.min.js" defer></script>
```

### Option 2: Import JavaScript using modules

If you use a bundler such as Webpack, Vite, or esbuild, import the modules you need:

```javascript
import Card from '@ourfuturehealth/toolkit/components/card/card';
import Checkboxes from '@ourfuturehealth/toolkit/components/checkboxes/checkboxes';
import Details from '@ourfuturehealth/toolkit/components/details/details';
import ErrorSummary from '@ourfuturehealth/toolkit/components/error-summary/error-summary';
import Header from '@ourfuturehealth/toolkit/components/header/header';
import Radios from '@ourfuturehealth/toolkit/components/radios/radios';
import SkipLink from '@ourfuturehealth/toolkit/components/skip-link/skip-link';
import '@ourfuturehealth/toolkit/polyfills';

document.addEventListener('DOMContentLoaded', () => {
  Card();
  Checkboxes();
  Details();
  ErrorSummary();
  Header();
  Radios();
  SkipLink();
});
```

## Importing assets

Toolkit assets are available under `node_modules/@ourfuturehealth/toolkit/assets/`.

If you use the toolkit `icon` macro or any toolkit component that renders an icon, your app must also publish the sprite file at a browser-visible URL. The default toolkit path is `/assets/icons/icon-sprite.svg`, so the usual setup is to copy:

- `node_modules/@ourfuturehealth/toolkit/assets/icons/icon-sprite.svg`

to:

- `/assets/icons/icon-sprite.svg`

The browser cannot read files directly from `node_modules`, so installing the package is not enough on its own.

If your app serves the sprite from a different public URL, pass that URL to the toolkit icon macro with `spritePath`.

```html
<link rel="shortcut icon" href="path-to-assets/favicons/favicon.ico" type="image/x-icon" />
<link rel="apple-touch-icon" href="path-to-assets/favicons/apple-touch-icon-180x180.png" />
<link rel="mask-icon" href="path-to-assets/favicons/favicon.svg" color="#FFC62C" />
<link rel="icon" sizes="192x192" href="path-to-assets/favicons/favicon-192x192.png" />
<meta name="msapplication-TileImage" content="path-to-assets/favicons/favicon-270x270.png" />
<meta name="msapplication-TileColor" content="#FFC62C" />
```

## Thanks to the Government Digital Service (GDS)

This documentation was originally adapted from [Installing GOV.UK Frontend with node package manager (NPM)](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md).
