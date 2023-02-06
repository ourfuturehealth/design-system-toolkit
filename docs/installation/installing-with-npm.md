# Installing using npm

## Requirements

To use Our Future Health design system toolkit in your projects with npm you must:

1. Have [Node.js](https://nodejs.org/en/) installed. We recommend using the [long-term support (LTS)](https://nodejs.org/en/download/) version of Nodejs, which also includes [npm](https://www.npmjs.com/).

2. Have a [package.json file](https://docs.npmjs.com/files/package.json) within your project. You can create a default `package.json` file by running `npm init -y` from the root of your project.

3. Have a pipeline set up to compile [Sass](https://sass-lang.com/) files to CSS.

4. (Optional) If you want to use our [Nunjucks](https://mozilla.github.io/nunjucks/) macros, you will need to install Nunjucks. [Nunjucks macros](https://mozilla.github.io/nunjucks/templating.html#macro) allows you to define reusable chunks of content. It is similar to a function in a programming language.

    ```
    npm install nunjucks --save
    ````

## Installation

At the moment, we don't publish an npm package for the design system toolkit. Instead, you can pull in the dependency in your `package.json` via Git, by adding the following in your `"dependencies"` (or `"devDependencies"`):

```
"ofh-design-system-toolkit": "https://github.com/ourfuturehealth/design-system-toolkit#main"
```

Then run `npm install`.

Whilst in alpha, you can directly depend on the `main` branch, but make sure you pin to a specific Git commmit hash in your lockfile (running `npm install` should do this for you).

## Configuration

You will need to import a couple of things into your project before you can start using Our Future Health design system toolkit:

- [Importing styles](#importing-styles)
- [Importing JavaScript](#importing-javascript)
- [Importing assets (optional)](#importing-assets-optional)

## Importing styles

To build the stylesheet you will need a pipeline set up to compile [Sass](https://sass-lang.com/) files to CSS. We recommend using the [sass](https://www.npmjs.com/package/sass) npm package, however you can use any tools that you are familiar with.

You need to import the Our Future Health design system toolkit styles into the main Sass file in your project. You should place the below code before your own Sass rules (or Sass imports).

```SCSS
@import 'PATH/TO/node_modules/ofh-design-system-toolkit/packages/ofh';
```

Alternatively you can import each of the individual components separately, meaning you can import just the components that you are using.

```SCSS
// Core (required)
@import 'PATH/TO/node_modules/ofh-design-system-toolkit/packages/core/all';

// Individual component (optional)
@import 'PATH/TO/node_modules/ofh-design-system-toolkit/packages/components/action-link/action-link';
```

## Importing JavaScript

Some of our components require JavaScript to function properly, others need JavaScript to improve the usability and accessibility.

You should include Our Future Health design system toolkit JavaScript in your project to ensure that all users can use it successfully.

Add the following JavaScript to the top of the `<body>` section of your page template:

```
document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
```

### Option 1: Include compiled JavaScript

Include the `node_modules/ofh-design-system-toolkit/dist/ofh-design-system-toolkit.min.js` script in the `<head>` of your page using the `defer` attribute.

> The defer attribute is used for performance benefits as the browser loads the JavaScript file as soon as possible, due to it being in the `<head>`, but will not run until after the page has loaded.

You might wish to copy the file into your project or reference it straight from node_modules.

```html
    <script src="path-to-assets/ofh-design-system-toolkit.min.js" defer></script>
  </head>
```

```html
    <script src="node_modules/ofh-design-system-toolkit/dist/ofh-design-system-toolkit.min.js" defer></script>
  </head>
```

### Option 2: Import JavaScript using modules

If you're using a transpiler or bundler such as [Babel](https://babeljs.io/) or [Webpack](https://webpack.js.org/), you can use the ES6 import syntax to import components via modules into your main Javascript file.

```javascript
// Components
import Card from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/card/card';
import Checkboxes from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/checkboxes/checkboxes';
import Details from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/details/details';
import ErrorSummary from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/error-summary/error-summary';
import Header from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/header/header';
import Radios from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/radios/radios';
import SkipLink from 'PATH/TO/node_modules/ofh-design-system-toolkit/components/skip-link/skip-link';

// Polyfills
import 'PATH/TO/node_modules/ofh-design-system-toolkit/packages/polyfills';

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

If you want to import assets such as the Our Future Health logo, favicons and SVG icons, you might wish to copy the files into your project folders from the `node_modules/ofh-design-system-toolkit/assets/` directory or you can reference them straight from the `node_modules` folder.

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
