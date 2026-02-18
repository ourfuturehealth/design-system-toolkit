# Installing using pnpm (or npm)

## Requirements

To use Our Future Health design system toolkit in your projects you must:

1. Have [Node.js](https://nodejs.org/en/) installed (version 20.19.0 or higher). We recommend using Node.js 24 LTS and [pnpm](https://pnpm.io/) as the package manager.

2. Have a [package.json file](https://docs.npmjs.com/files/package.json) within your project. You can create a default `package.json` file by running `pnpm init` (or `npm init -y`) from the root of your project.

3. Have a pipeline set up to compile [Sass](https://sass-lang.com/) files to CSS.

4. (Optional) If you want to use our [Nunjucks](https://mozilla.github.io/nunjucks/) macros, you will need to install Nunjucks. [Nunjucks macros](https://mozilla.github.io/nunjucks/templating.html#macro) allows you to define reusable chunks of content. It is similar to a function in a programming language.

    ```bash
    pnpm add nunjucks
    # or with npm:
    npm install nunjucks --save
    ````

## Installation

> **Note:** As of v4.0.0, this repository is a monorepo. You must specify the package subdirectory when installing.

We don't publish to npm registry. Instead, install directly from GitHub using git with the subdirectory syntax:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v4.0.0:packages/toolkit"
  }
}
```

Then run:

```bash
pnpm install
# or with npm:
npm install
```

**Version pinning:**
- Use specific version tags (e.g., `toolkit-v4.0.0`) for production
- For development, you can use `#main:packages/toolkit` but ensure your lockfile pins a specific commit

## Configuration

You will need to import a couple of things into your project before you can start using Our Future Health design system toolkit:

- [Importing styles](#importing-styles)
- [Importing JavaScript](#importing-javascript)
- [Importing assets (optional)](#importing-assets-optional)

## Importing styles

To build the stylesheet you will need a pipeline set up to compile [Sass](https://sass-lang.com/) files to CSS. We recommend using the [sass](https://www.npmjs.com/package/sass) package.

Import the Our Future Health design system toolkit styles into the main Sass file in your project. Place this before your own Sass rules:

```scss
@import 'node_modules/@ourfuturehealth/toolkit/ofh';
```

Alternatively you can import components individually:

```scss
// Core (required)
@import 'node_modules/@ourfuturehealth/toolkit/core/all';

// Individual component (optional)
@import 'node_modules/@ourfuturehealth/toolkit/components/action-link/action-link';
```

## Importing JavaScript

Some of our components require JavaScript to function properly, others need JavaScript to improve the usability and accessibility.

You should include Our Future Health design system toolkit JavaScript in your project to ensure that all users can use it successfully.

Add the following JavaScript to the top of the `<body>` section of your page template:

```
document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
```

### Option 1: Include compiled JavaScript

Include the compiled JavaScript in the `<head>` of your page using the `defer` attribute.

> The defer attribute is used for performance benefits as the browser loads the JavaScript file as soon as possible, due to it being in the `<head>`, but will not run until after the page has loaded.

You can copy the file into your project or reference it from node_modules:

```html
    <script src="path-to-assets/ofh-design-system-toolkit.min.js" defer></script>
  </head>
```

```html
    <script src="node_modules/@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.min.js" defer></script>
  </head>
```

### Option 2: Import JavaScript using modules

If you're using a bundler such as [Webpack](https://webpack.js.org/) or [Vite](https://vitejs.dev/), you can import components using ES6 modules:

```javascript
// Components
import Card from '@ourfuturehealth/toolkit/components/card/card';
import Checkboxes from '@ourfuturehealth/toolkit/components/checkboxes/checkboxes';
import Details from '@ourfuturehealth/toolkit/components/details/details';
import ErrorSummary from '@ourfuturehealth/toolkit/components/error-summary/error-summary';
import Header from '@ourfuturehealth/toolkit/components/header/header';
import Radios from '@ourfuturehealth/toolkit/components/radios/radios';
import SkipLink from '@ourfuturehealth/toolkit/components/skip-link/skip-link';

// Polyfills
import '@ourfuturehealth/toolkit/polyfills';

// Initialize components
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

## Importing assets (optional)

If you want to import assets such as the Our Future Health logo, favicons and SVG icons, copy the files from `node_modules/@ourfuturehealth/toolkit/assets/` or reference them directly:

```html
<link rel="shortcut icon" href="path-to-assets/favicons/favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" href="path-to-assets/favicons/apple-touch-icon-180x180.png">
<link rel="mask-icon" href="path-to-assets/favicons/favicon.svg" color="#FFC62C">
<link rel="icon" sizes="192x192" href="path-to-assets/favicons/favicon-192x192.png">
<meta name="msapplication-TileImage" content="path-to-assets/favicons/favicon-270x270.png">
<meta name="msapplication-TileColor" content="#FFC62C">
```

## Thanks to the Government Digital Service (GDS)

This documentation has been taken from [Installing GOV.UK Frontend with node package manager (NPM)](https://github.com/alphagov/govuk-frontend/blob/master/docs/installation/installing-with-npm.md) with a few major adaptations.
