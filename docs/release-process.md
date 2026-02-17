# Release Process

This document explains how to create and publish releases of the design system toolkit and its packages.

## Overview

The design system toolkit uses **GitHub Releases** to distribute packages. Each package can be installed directly from GitHub by external projects without requiring npm publishing.

**Key principle:** Each package has **independent versioning**. You can release the toolkit without releasing react-components, and vice versa.

| Package                             | Versioned? | Distributed?             |
| ----------------------------------- | ---------- | ------------------------ |
| `@ourfuturehealth/toolkit`          | ✅ Yes     | ✅ Yes (via GitHub)      |
| `@ourfuturehealth/react-components` | ✅ Yes     | ✅ Yes (via GitHub)      |
| `site`                              | ❌ No      | ❌ No (docs only)        |
| `example-react-consumer-app`        | ❌ No      | ❌ No (example only)     |
| Root workspace                      | ❌ No      | ❌ No (coordinator only) |

## Prerequisites

- Ensure you have push access to the repository
- Your local branch is up to date with `main`
- All tests pass: `pnpm test`
- All linting passes: `pnpm lint`

## Release Steps

### 1. Decide What to Release

**Option A: Toolkit Only**

- Changes only affect toolkit (CSS, JS, templates, core styles)
- React components unchanged
- Bump: `packages/toolkit/package.json` version only

**Option B: React Components Only**

- Changes only affect React wrapper components
- Toolkit unchanged
- Bump: `packages/react-components/package.json` version only

**Option C: Both Packages**

- Changes affect both (e.g., design system-wide breaking change)
- Bump: Both `packages/toolkit/package.json` AND `packages/react-components/package.json`

**Note:** You never need to bump versions for `site` or `example-react-consumer-app` - they're not distributed.
Root package.json does NOT have a version** - it's a workspace coordinator only, not a distributed package.
**For toolkit release:\*\*

```bash
cd packages/toolkit
# Edit package.json - update "version" field
# Example: "version": "4.0.0" → "version": "4.0.1"
```

**For react-components release:**

```bash
cd packages/react-components
# Edit package.json - update "version" field
```

**For workspace root:**

```bash
# Edit root package.json - update "version" field
# This is the overall monorepo version
```

### 2. Update Changelog

Update [CHANGELOG.md](../CHANGELOG.md) with:

- New version number and date
- List of changes, bug fixes, new features
- Breaking changes (if any)
- Migration notes (if applicable)

### 3. Commit Version Changes

```bash
git add packages/toolkit/package.json CHANGELOG.md
git commit -m "chore: bump version to 3.5.1"
git push origin main
```

### 4. Create and Push Git Tag

Create a tag matching the version:

```bash
# Create annotated tag
git tag -a v3.5.1 -m "Release v3.5.1"

# Push tag to GitHub
git push origin v3.5.1
```

### 5. GitHub Actions Creates Release

When you push a tag starting with `v`, the [release workflow](.github/workflows/release.yml) automatically:

1. Installs dependencies
2. Runs linting
3. Runs tests
4. Builds the toolkit bundle and zip
5. Creates a GitHub Release
6. Uploads the toolkit zip as a release asset

### 6. Verify Release

1. Go to [GitHub Releases](https://github.com/ourfuturehealth/design-system-toolkit/releases)
2. Verify the new release is created
3. Check that the zip file is attached
4. Test installation in a separate project

## Testing a Release

After creating a release, test that external projects can install it:

### Test Toolkit Installation

Create a test project:

```bash
mkdir test-install && cd test-install
npm init -y
```

Update `package.json`:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#v3.5.1:packages/toolkit"
  }
}
```

Install:

```bash
npm install
```

Verify the toolkit is installed:

```bash
ls node_modules/@ourfuturehealth/toolkit/dist
# Should show: ofh-design-system-toolkit.css, ofh-design-system-toolkit.js, etc.
```

### Test React Components Installation

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "github:ourfuturehealth/design-system-toolkit#v3.5.1:packages/react-components"
  }
}
```

## Release Types

### Patch Release (4.0.0 → 4.0.1)

- Bug fixes
- Small updates
- No breaking changes
- No new features

**Example:**

```bash
# Update version in package.json
git add packages/toolkit/package.json CHANGELOG.md
git commit -m "chore: bump version to 3.5.1"
git push origin main
git tag -a v3.5.1 -m "Release v3.5.1 - Bug fixes"
git push origin v3.5.1
```

### Minor Release (4.0.0 → 4.1.0)

- New features
- Enhancements
- No breaking changes
- Backward compatible

**Example:**

```bash
# Update version in package.json
git add packages/toolkit/package.json CHANGELOG.md
git commit -m "chore: bump version to 3.6.0 - New components"
git push origin main
git tag -a v3.6.0 -m "Release v3.6.0 - New card component"
git push origin v3.6.0
```

### Major Release (3.5.0 → 4.0.0)

- Breaking changes
- Major refactoring
- Requires migration from consumers
- Include migration guide

**Example:**

```bash
# Update version in package.json
# Update migration guide in docs/
git add packages/toolkit/package.json CHANGELOG.md docs/
git commit -m "chore: bump version to 4.0.0 - BREAKING CHANGES"
git push origin main
git tag -a v4.0.0 -m "Release v4.0.0 - Monorepo refactor"
git push origin v4.0.0
```

## Individual Package Releases

You can release individual packages without releasing the entire monorepo:

### Releasing Only Toolkit

```bash
# Update toolkit version only
cd packages/toolkit
# Edit package.json version

git add packages/toolkit/package.json CHANGELOG.md
git commit -m "chore(toolkit): bump to 3.5.1"
git push origin main
git tag -a toolkit-v3.5.1 -m "Toolkit release v3.5.1"
git push origin toolkit-v3.5.1
```

External projects install:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#toolkit-v3.5.1:packages/toolkit"
  }
}
```

### Releasing Only React Components

```bash
# Update react-components version only
cd packages/react-components
# Edit package.json version

git add packages/react-components/package.json CHANGELOG.md
git commit -m "chore(react-components): bump to 0.0.2"
git push origin main
git tag -a react-components-v0.0.2 -m "React components release v0.0.2"
git push origin react-components-v0.0.2
```

## What the Release Workflow Does

The [.github/workflows/release.yml](.github/workflows/release.yml) workflow:

```yaml
# Triggered when you push a tag starting with 'v'
on:
  push:
    tags:
      - 'v*'

# Steps:
1. Checkout code
2. Setup pnpm and Node.js
3. Install dependencies (pnpm install)
4. Run linting (pnpm run lint)
5. Run tests (pnpm test)
6. Build release artifact (pnpm run build-gh-release)
   - Runs: turbo run zip --filter=toolkit
   - Creates: packages/toolkit/dist/ofh-design-system-toolkit-VERSION.zip
7. Extract version from tag
8. Create GitHub Release
9. Upload zip as release asset
```

## Package.json Configuration

### Toolkit Package

The toolkit [package.json](../packages/toolkit/package.json) includes:

```json
{
  "name": "@ourfuturehealth/toolkit",
  "version": "4.0.0",
  "description": "Our Future Health design system toolkit...",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ourfuturehealth/design-system-toolkit.git",
    "directory": "packages/toolkit"
  },
  "files": [
    "dist",
    "components",
    "core",
    "common",
    "assets",
    "ofh.js",
    "ofh.scss",
    "polyfills.js"
  ],
  "main": "dist/ofh-design-system-toolkit.js",
  "style": "dist/ofh-design-system-toolkit.css",
  "scripts": {
    "prepare": "gulp bundle"
  }
}
```

**Key fields:**

- `name`: Scoped package name for npm/GitHub
- `version`: Current package version
- `repository.directory`: Tells npm this is a monorepo subdirectory
- `files`: Which files to include when installed
- `main`/`style`: Entry points for JS and CSS
- `prepare`: Runs automatically when installed from git (builds the toolkit)

### React Components Package

The react-components [package.json](../packages/react-components/package.json) includes:

```json
{
  "name": "@ourfuturehealth/react-components",
  "version": "0.0.1",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    },
    "./styles": "./dist/ofh-design-system-react.css"
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "prepublishOnly": "pnpm run test:run && pnpm run build:clean"
  }
}
```

## How External Projects Install

### From Specific Release

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#v3.5.1:packages/toolkit"
  }
}
```

When npm/pnpm installs this:

1. Clones the repository at tag `v3.5.1`
2. Navigates to `packages/toolkit`
3. Runs `pnpm install` (installs toolkit dependencies)
4. Runs `prepare` script (`gulp bundle`)
5. Copies files listed in `files` field to `node_modules/@ourfuturehealth/toolkit`

### From Branch

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "github:ourfuturehealth/design-system-toolkit#main:packages/toolkit"
  }
}
```

Same process but uses the latest commit on `main` branch.

## Troubleshooting

### Release Workflow Failed

Check the [GitHub Actions tab](https://github.com/ourfuturehealth/design-system-toolkit/actions) to see the error.

Common issues:

- Tests failing - Fix tests and create a new tag
- Linting errors - Fix linting and create a new tag
- Build errors - Fix build process and create a new tag

To fix:

```bash
# Delete the bad tag locally and remotely
git tag -d v3.5.1
git push origin :refs/tags/v3.5.1

# Fix the issue, commit, and create tag again
git add .
git commit -m "fix: resolve build issue"
git push origin main
git tag -a v3.5.1 -m "Release v3.5.1"
git push origin v3.5.1
```

### Installation Fails for External Projects

**Error:** `prepare script failed`

This means the `gulp bundle` command failed during installation.

**Solution:**

- Ensure all build dependencies are listed in `devDependencies`
- Test the build locally: `cd packages/toolkit && pnpm install && pnpm run bundle`
- Check that `gulpfile.js` and all required files are included in the `files` field

**Error:** `Package not found`

**Solution:**

- Verify the tag exists: `git tag -l`
- Check the syntax: `github:org/repo#tag:packages/toolkit`
- Ensure the `packages/toolkit/package.json` has the correct `name` field

### Zip File Not Attached to Release

**Solution:**

- Check that the GitHub Actions workflow ran successfully
- Verify the zip path in `.github/workflows/release.yml` matches where gulp creates it
- Ensure `build-gh-release` script in root package.json runs successfully

## Future: Publishing to npm or GitHub Packages

### GitHub Packages (Recommended for Private Distribution)

To publish to GitHub Packages (free for public repos):

1. Add `.npmrc` to repository root:

```
@ourfuturehealth:registry=https://npm.pkg.github.com
```

2. Update release workflow:

```yaml
- name: Publish to GitHub Packages
  run: |
    cd packages/toolkit
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.GITHUB_TOKEN }}" > .npmrc
    npm publish
```

3. External projects install:

```bash
npm config set @ourfuturehealth:registry https://npm.pkg.github.com
npm install @ourfuturehealth/toolkit
```

### npm Registry (For Public Distribution)

To publish to npm:

1. Create npm organization account
2. Add npm token to GitHub secrets
3. Uncomment the npm publish step in release workflow
4. Remove `"private": true` if present

## Best Practices

1. **Test before releasing**: Always run `pnpm test` and `pnpm lint` locally
2. **Update changelog**: Keep CHANGELOG.md up to date with each release
3. **Semantic versioning**: Follow semver (MAJOR.MINOR.PATCH)
4. **Test installation**: Verify external projects can install the new release
5. **Coordinate releases**: If multiple packages change, decide on individual vs combined release
6. **Document breaking changes**: Provide migration guides for major versions
7. **Keep tags clean**: Delete and recreate tags if a release fails, don't accumulate bad tags

## Questions?

- Check [GitHub Releases](https://github.com/ourfuturehealth/design-system-toolkit/releases) for examples
- Review [GitHub Actions workflows](../.github/workflows/) to understand automation
- See [Monorepo Migration Guide](./monorepo-migration-guide.md) for consumer perspective
