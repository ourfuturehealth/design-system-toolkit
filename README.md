# Our Future Health design system toolkit

> **Note** <br>
> This toolkit is based on the [NHS.UK frontend](https://github.com/nhsuk/nhsuk-frontend), forked as of early 2022, and adapted for Our Future Health needs (which includes a rename of the prefix for all CSS classes to `ofh-`).
>
> We are indebted to the original work carried out by NHS Digital and GDS.

Our Future Health design system toolkit contains the code you need to start building user interfaces for Our Future Health websites and services.

## Guidance

Visit the [design system docs website](https://designsystem.ourfuturehealth.org.uk/) for examples of components and guidance for when to use them.

## How to install Our Future Health design system toolkit

### 1. Install with package managers

We recommend that you [install Our Future Health design system toolkit using node package manager (npm)](/docs/installation/installing-with-npm.md).

### 2. Install by using compiled files

You can also [install Our Future Health design system toolkit using our compiled files](/docs/installation/installing-compiled.md), if you are not currently using a package manager.

## How to make a new release

1. Create a new branch for the release, off the latest `main` branch, and name it `release-v{version_number}`.
1. Update the [CHANGELOG.md](CHANGELOG.md) and ensure it reflects everything that is being released in the new version.
    - This mainly involves converting the "Unreleased" section (at the top) to a new version section (remember to add a date) and adding a new "Unreleased" section for the next version.
    - The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
1. Update the `version` field in [package.json](package.json) and run `npm install` (to update the `package-lock.json`).
1. Submit a new pull request (PR) for the branch (with your changes) and get it reviewed.
    - Note that this PR should only contain changes to the `CHANGELOG.md`, `package.json` and `package-lock.json` files. Any actual code/feature changes should first be done in a separate PR, before the release PR.
1. Immediately after the PR is merged, update your local clone, then create and push a Git tag for the release.
    - E.g. `git tag -a v2.0.0-alpha.0 -m "v2.0.0-alpha.0" && git push origin --tags`.
    - Note the `v` prefix is important as the release workflow will only trigger on tags that are prefixed with this.
1. When the tag is pushed, the release workflow will trigger. Part of this workflow involves creating a named release in the GitHub repo ([docs](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)). Once this has been created, edit it via the GitHub UI and copy/paste the matching Changelog entries.

## Browsers and assistive technology

Visit our [support for browsers and assistive technology](/docs/contributing/browser-support.md), for details on operating systems and software.

## Contribute

Read our [contributing guidelines](CONTRIBUTING.md) to contribute to Our Future Health design system toolkit.

## Development environment

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/ourfuturehealth/design-system-toolkit)

## Design system docs website

> **Note** <br>
> The docs website is based on the [NHS.UK digital service manual](https://github.com/nhsuk/nhsuk-service-manual/),
> which we have incorporated into our design system toolkit as a statically generated site.

You can find the code for the docs website under the `site/` folder. More details on this below.

This is deployed using Netlify to <https://designsystem.ourfuturehealth.org.uk/>, on every merge to the `main` branch.

The content of this docs website is under review and will be iterated
on continuously whilst the design system toolkit is still in alpha.

### Development

To build the toolkit and site in watch mode, and also serve the docs website
(with hot reload), run the command:

```bash
npm run dev
```

### Code structure

The design system docs website codebase lives in the [`site/`](site/) directory.
The site uses [Nunjucks](https://mozilla.github.io/nunjucks/) templates and
is built using the [Eleventy](https://www.11ty.dev/) static site generator.

There are a few things to highlight about the structure of the site:

- **Build and watch scripts** - Commands for building and watching the
website are configured as npm run scripts in [`package.json`](./package.json).
These run scripts are all prefixed with `site:`. Run the command `npm run`
in your terminal to see all available npm run scripts.
- **Use of Nunjucks macros from toolkit components** - the component Nunjuck macros are imported into the site templates directly from the [`packages/components/`](./packages/components/) directory (which is the source of truth for toolkit components). This is possible because Eleventy adds the root directory to the lookup path for Nunjucks.
- **Use of toolkit assets and artifacts** - The Eleventy configuration
([`site.eleventy.config.js`](site.eleventy.config.js)) handles the copying of
the `dist/` and `packages/assets/` directories into the generated website.
The assets from these directories are then directly referenced in the site HTML.
- **Component examples** - Isolated component examples live under the
[`site/views/examples`](./site/views/examples) directory. These pages are ideal
for testing component changes during development.
- **Design examples** - All components, patterns and styles in the toolkit have
their own rendered design examples. These are HTML pages that are embedded in
iframes on the website. They can also be viewed standalone.
  - *Generating design examples* - The design example HTML pages are generated
  using Eleventy's [Pagination feature](https://www.11ty.dev/docs/pages-from-data/).
  The data is generated by [`site/views/_data/design-examples.js`](./site/views/_data/design-examples.js)
  and [`site/views/design-examples.njk`](./site/views/design-examples.njk) iterates
  over the data to generate the HTML pages.
  - *Embedding design examples* - The [`designExample`](./site/views/_includes/design-example.njk)
  Nunjucks macro is used in the website to embed design examples via an iframe.

## Licence

The codebase is released under the MIT Licence, unless stated otherwise. This covers both the codebase and any sample code in the documentation. The documentation is © Crown copyright and available under the terms of the Open Government 3.0 licence.
