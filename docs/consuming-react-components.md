# WORK IN PROGRESS (Needs to be updated)

# Consuming Our Future Health React Components

This guide explains how to consume the `@ourfuturehealth/react-components` package from GitHub Packages in your own React applications.

## Prerequisites

1. **GitHub Personal Access Token** with `read:packages` permission
2. **pnpm** (recommended) or npm configured for GitHub Packages

## Setup Instructions

### 1. Create .npmrc file

Create a `.npmrc` file in your project root:

```ini
@ourfuturehealth:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Set your GitHub token

**Option A: Environment Variable (Recommended)**

```bash
export GITHUB_TOKEN=ghp_your_personal_access_token_here
```

**Option B: Add to .npmrc (Less Secure)**

```ini
@ourfuturehealth:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_your_personal_access_token_here
```

### 3. Install the package

```bash
# With pnpm (recommended)
pnpm add @ourfuturehealth/react-components

# With npm
npm install @ourfuturehealth/react-components
```

## Usage Example

```tsx
import React from "react";
import { Button, TextInput } from "@ourfuturehealth/react-components";
import "@ourfuturehealth/react-components/styles";

function App() {
  return (
    <div>
      <TextInput label="Your name" hint="Enter your full name" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}

export default App;
```

## TypeScript Support

The package includes full TypeScript definitions. No additional `@types/` packages needed.

## Troubleshooting

**403 Forbidden Error:**

- Verify your GitHub token has `read:packages` permission
- Ensure the token is properly set in your environment or .npmrc

**Module not found:**

- Verify the registry is set correctly in .npmrc
- Check that the package version exists in GitHub Packages

**Styles not loading:**

- Ensure you import the styles: `import '@ourfuturehealth/react-components/styles'`
- Import should be in your app's entry point (main.tsx, App.tsx, etc.)

## Development

For development and contributing, see the main repository README for monorepo setup instructions.
