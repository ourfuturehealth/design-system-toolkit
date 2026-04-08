# OFH Design System React

React component library for the OFH Design System.

## Installation

Install the packaged GitHub release artifact:

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v0.5.0/ourfuturehealth-react-components-0.5.0.tgz",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

Then run your package manager install command. This release-tarball contract is smoke-tested against Yarn 1, npm, and pnpm.

For unreleased maintainer testing:

```bash
pnpm --filter=@ourfuturehealth/react-components run build
npm pack ./packages/react-components --ignore-scripts
```

Install the resulting local `.tgz` in the consumer application.

## Usage

```tsx
import {
  Button,
  Card,
  CardCallout,
  CardDoDont,
  ErrorSummary,
  Tag,
  TextInput,
} from '@ourfuturehealth/react-components';
import '@ourfuturehealth/react-components/styles/participant';

function App() {
  return (
    <div>
      <ErrorSummary
        titleText="There is a problem"
        errorList={[
          {
            text: 'Enter your name',
            href: '#name',
          },
        ]}
      />
      <Tag variant="brand">Beta</Tag>
      <Button variant="contained">Click me</Button>
      <Card heading="Profile complete" description="You’ve completed all the required profile details." />
      <CardCallout heading="Warning" variant="warning" text="Check this information before you continue." />
      <CardDoDont type="do" items={[{ item: 'keep points short and scannable' }]} />
      <TextInput id="name" label="Your name" />
    </div>
  );
}
```

### Theme styles

Choose one theme stylesheet import per application:

- `@ourfuturehealth/react-components/styles/participant`
- `@ourfuturehealth/react-components/styles/research`

`@ourfuturehealth/react-components/styles` is kept as a backward-compatible alias for `participant`.

## Components

### Button

Props:

- `variant`: `'contained' | 'outlined' | 'ghost' | 'ghost-inverted' | 'text' | 'text-inverted'`

### TextInput

Props:

- `label`
- `hint`
- `error`
- `required`
- `width`
- `maxLength`
- `id`

### ErrorSummary

Security note: `titleHtml`, `descriptionHtml`, and `errorList[].html` are rendered as raw HTML. Only pass trusted or sanitised content.

### Card

Props:

- `variant`
- `heading`, `headingHtml`, `headingLevel`
- `description`, `descriptionHtml`
- `icon`, `dismissButton`, `number`, `tag`
- `metadataItems`, `helperText`, `helperHtml`, `actionLink`
- `imgURL`, `imgALT`

### CardCallout

Props:

- `variant`: `'info' | 'warning' | 'success' | 'error'`
- `heading`, `headingHtml`, `headingLevel`
- `text` or `html`

### CardDoDont

Props:

- `type`: `'do' | 'dont'`
- `heading`, `headingLevel`
- `items`

### Tag

Props:

- `children`
- `variant`: `'neutral' | 'brand' | 'blue' | 'green' | 'yellow' | 'red'`
- `className`

## Development

Storybook:

```bash
pnpm --filter @ourfuturehealth/react-components storybook
```

Quick dev server:

```bash
pnpm --filter @ourfuturehealth/react-components dev
```

Library build watch:

```bash
pnpm --filter @ourfuturehealth/react-components watch:lib
```

Build:

```bash
pnpm --filter @ourfuturehealth/react-components build
```
