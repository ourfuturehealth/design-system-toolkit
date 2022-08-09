# Our Future Health design system toolkit

> **Note** <br>
> This toolkit is based on the [NHS.UK frontend](https://github.com/nhsuk/nhsuk-frontend), forked as of early 2022, and has been adapted for Our Future Health needs (which includes a rename of the prefix for all CSS classes to `ofh-`).
>
> We are indebted to the original work carried out by NHS Digital and GDS.

Our Future Health design system toolkit contains the code you need to start building user interfaces for Our Future Health websites and services.

## Guidance

Visit the [NHS digital service manual](https://service-manual.nhs.uk/) for examples of components and guidance for when to use them.

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

## Licence

The codebase is released under the MIT Licence, unless stated otherwise. This covers both the codebase and any sample code in the documentation. The documentation is © Crown copyright and available under the terms of the Open Government 3.0 licence.
