# Upgrading Guide

This guide provides detailed migration instructions for upgrading between versions of the Design System Toolkit and React Components packages.

**Quick reference:** Jump to the version you're upgrading from/to below.

## Breaking Changes by Version

| Version                                                 | Date          | Breaking Changes      | Migration Complexity                  |
| ------------------------------------------------------- | ------------- | --------------------- | ------------------------------------- |
| [v4.13.0 / React v0.12.0](#upgrading-to-v4130--react-v0120) | April 2026    | No breaking changes | 🟢 Low - adopt the public React footer if needed |
| [v4.12.0 / React v0.11.0](#upgrading-to-v4120--react-v0110) | April 2026    | No breaking changes | 🟢 Low - adopt the public React summary list if needed |
| [v4.11.0 / React v0.10.0](#upgrading-to-v4110--react-v0100) | April 2026    | No breaking changes | 🟢 Low - adopt the public React details family if needed |
| [v4.10.0 / React v0.9.0](#upgrading-to-v4100--react-v090) | April 2026    | No breaking changes | 🟢 Low - Adopt the public link family and canonical names for new usage |
| [React v0.8.0](#upgrading-to-react-v080)                | April 2026    | React `spritePath` removal | 🟢 Low - Remove the deprecated prop      |
| [v4.9.0 / React v0.7.0](#upgrading-to-v490--react-v070) | April 2026    | Icon naming sync    | 🟡 Medium - Search/replace icon names  |
| [v4.8.0 / React v0.6.0](#upgrading-to-v480--react-v060) | March 2026    | No breaking changes | 🟢 Low - only relevant if you adopted the earlier TextInput prototype |
| [v4.7.0 / React v0.5.0](#upgrading-to-v470--react-v050) | March 2026    | Card family realignment | 🟡 Medium - API migration recommended |
| [v4.6.0 / React v0.4.0](#upgrading-to-v460--react-v040) | March 2026    | Tag default + naming  | 🟡 Medium - Search/replace recommended |
| [v4.5.0](#upgrading-to-v450)                            | March 2026    | Spacing and typography API changes | 🟡 Medium - Replace legacy APIs and recheck overrides |
| [v4.3.0 / React v0.2.0](#upgrading-to-v430--react-v020) | March 2026    | Button variant naming      | 🟡 Medium - Find/replace required        |
| [v4.1.0](#upgrading-to-v410)                            | February 2026 | Spacing scale indices      | 🟡 Medium - Index updates required       |
| [v4.0.0](#upgrading-to-v400-monorepo-restructure)       | 2025          | Monorepo restructure       | 🔴 High - Installation & paths change    |

---

## Upgrading to v4.13.0 / React v0.12.0

**Released:** April 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.13.0+
- `@ourfuturehealth/react-components` v0.12.0+

### Breaking Changes

None.

### Release Overview

This release refreshes the toolkit `footer` component to the current design-system structure and introduces the first public React `Footer` component.

- Toolkit consumers can keep the default footer support links text-only while opting into shared link-icon cues when directional or external hints add value.
- Toolkit consumers can explicitly hide the small-print line with `smallPrint` while continuing to support the legacy `copyright` alias where no migration is needed.
- React consumers can now adopt the public `Footer` component instead of carrying local footer markup and social-link wiring.

### Migration Steps

1. Adopt the public React `Footer` where you need toolkit-parity page footers in React.
2. Prefer the footer macro/data options such as `smallPrint`, `legalText`, `socialLinks`, `iconPosition`, and `iconName` instead of bespoke footer markup when updating existing Nunjucks templates.
3. Re-run visual QA at desktop, tablet, and mobile, and validate both participant and research themes if you have local footer overrides, because the spacing, wrapping, and accent-border behavior now follows the current footer spec more closely.

#### React example

**New in `react-v0.12.0`:**

```tsx
import { Footer } from '@ourfuturehealth/react-components';
```

#### Toolkit example

**Before (`toolkit-v4.12.0`):**

```njk
{{ footer({
  "links": [
    {
      "URL": "#privacy",
      "label": "Privacy"
    }
  ],
  "copyright": "&copy; Crown copyright"
}) }}
```

**After (`toolkit-v4.13.0`):**

```njk
{{ footer({
  "links": [
    {
      "url": "#overview",
      "label": "Back to overview",
      "iconName": "ChevronLeft",
      "iconPosition": "left"
    },
    {
      "url": "https://example.com/guidance",
      "label": "External guidance",
      "iconName": "Launch",
      "iconPosition": "right"
    }
  ],
  "smallPrint": "",
  "legalText": "Organisation legal text.",
  "socialLinks": [
    {
      "platform": "linkedin",
      "href": "https://www.linkedin.com/company/our-future-health/",
      "openInNewWindow": true
    }
  ]
}) }}
```

---

## Upgrading to v4.12.0 / React v0.11.0

**Released:** April 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.12.0+
- `@ourfuturehealth/react-components` v0.11.0+

### Breaking Changes

None.

### Release Overview

This release refreshes the toolkit `summary-list` component to the current design-system treatment and introduces the first public React `SummaryList` component.

- Toolkit consumers can now use the explicit `padded: false` and `noBorder: true` macro options instead of relying only on manual class combinations.
- Existing toolkit templates that already apply `ofh-summary-list--no-border` continue to work in this release.
- React consumers can now adopt the public `SummaryList` component instead of carrying local review-answer list markup.

### Migration Steps

1. Adopt the public React `SummaryList` where you need toolkit-parity summary rows in React.
2. Prefer the explicit toolkit macro options for compact and no-border variants when touching existing Nunjucks templates.
3. Re-run visual QA for stacked mobile/tablet rows and action-link labelling if you have local summary-list overrides.

#### React example

**New in `react-v0.11.0`:**

```tsx
import { SummaryList } from '@ourfuturehealth/react-components';
```

#### Toolkit example

**Before (`toolkit-v4.11.0`):**

```njk
{{ summaryList({
  classes: 'ofh-summary-list--no-border',
  rows: rows
}) }}
```

**After (`toolkit-v4.12.0`):**

```njk
{{ summaryList({
  padded: false,
  noBorder: true,
  rows: rows
}) }}
```

---

## Upgrading to v4.11.0 / React v0.10.0

**Released:** April 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.11.0+
- `@ourfuturehealth/react-components` v0.10.0+

### Breaking Changes

None.

### Release Overview

This release refreshes the toolkit `details` and `expander` components to the current Figma treatment and introduces the first public React `Details` and `Expander` components.

No supported API migration is required for existing toolkit consumers.

React consumers can now adopt the public details family instead of carrying local disclosure implementations.

### Migration Steps

1. Re-run visual QA for the toolkit details family, especially open-state spacing, icon states, and revealed content layout.
2. If you want React parity, adopt the new public `Details` and `Expander` components.
3. Replace local disclosure wrappers with the shared React details family where appropriate.

#### React example

**New in `react-v0.10.0`:**

```tsx
import {
  Details,
  Expander,
} from '@ourfuturehealth/react-components';
```

## Upgrading to v4.10.0 / React v0.9.0

**Released:** April 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.10.0+
- `@ourfuturehealth/react-components` v0.9.0+

### Breaking Changes

None.

Toolkit macro paths and site routes now teach the canonical names below, while compatibility aliases remain available in this release:

| Preferred toolkit name | Compatibility alias |
| ---------------------- | ------------------- |
| `link-action` | `action-link` |
| `link-icon` | `back-link` |
| `link-skip` | `skip-link` |

### Release Overview

This release introduces the public React link family and aligns the toolkit link-family naming and IA to the current design-system terminology used in Figma and Jira.

- React consumers can adopt the new public `LinkAction`, `LinkIcon`, and `LinkSkip` components directly.
- Toolkit consumers can continue using the old macro paths temporarily, but new usage should move to the canonical names above.
- The canonical docs, examples, and Storybook surfaces now teach `Link action`, `Link icon`, and `Link skip`.

### Migration Steps

1. Adopt the new public React `LinkAction`, `LinkIcon`, and `LinkSkip` components where you want React parity for the link family.
2. Prefer the canonical toolkit macro paths and macro names when touching existing templates.
3. Re-run manual QA for keyboard and focus behavior, especially for `LinkSkip`, `LinkIcon`, and any icon-bearing surfaces such as `Icon`, `Select`, and `Card`.

#### React example

**New in `react-v0.9.0`:**

```tsx
import {
  LinkAction,
  LinkIcon,
  LinkSkip,
} from '@ourfuturehealth/react-components';
```

## Upgrading to React v0.8.0

**Released:** April 2026
**Affected packages:**

- `@ourfuturehealth/react-components` v0.8.0+

### Breaking Changes

`@ourfuturehealth/react-components` removes the `spritePath` prop from the public `Icon` API and from `Card` icon configuration. React icons now always render from bundled toolkit SVG data.

### Migration Steps

1. Remove any `spritePath` prop from `Icon` usage.
2. Remove any `spritePath` field from `Card` icon configuration objects.
3. Re-run visual checks for icon-bearing surfaces such as `Icon`, `Select`, `Card`, and `Checkboxes`.

#### React example

**Before:**

```tsx
<Icon name="Search" spritePath="/assets/icons/icon-sprite.svg" />

<Card
  icon={{
    name: 'Search',
    spritePath: '/assets/icons/icon-sprite.svg',
  }}
/>
```

**After:**

```tsx
<Icon name="Search" />

<Card
  icon={{
    name: 'Search',
  }}
/>
```

If an application previously passed `spritePath` in React, that prop should now be removed.

### Toolkit reminder

Toolkit/Nunjucks icon consumers are unchanged. They must still serve `icon-sprite.svg` at a public URL, default `/assets/icons/icon-sprite.svg`, or override that URL with `spritePath`.

## Upgrading to v4.9.0 / React v0.7.0

**Released:** April 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.9.0+
- `@ourfuturehealth/react-components` v0.7.0+

### Breaking Changes

Toolkit and React icon names now match the current Figma icon set directly. This is a hard rename with no backward-compatible aliases.

| Category | Previous name | New name |
| -------- | ------------- | -------- |
| DataValidation | `CancelOutlined` | `CancelOutline` |
| DataValidation | `Done` | `Check` |
| DataValidation | `AddCircleOutlineOutlined` | `AddCircleOutline` |
| DataValidation | `RemoveCircle` | `MinusCircle` |
| DataValidation | `RemoveCircleOutlineOutlined` | `MinusCircleOutline` |
| Action | `AccountCircleOutlined` | `AccountCircleOutline` |
| Action | `FileDownloadOutlined` | `FileDownloadOutline` |
| Action | `FavoriteBorderOutlined` | `FavoriteOutline` |
| Action | `CalendarTodayOutlined` | `CalendarOutline` |
| Action | `CalendarToday` | `Calendar` |
| Arrows | `ExpandLess` | `ChevronUp` |
| Arrows | `ExpandMore` | `ChevronDown` |
| Arrows | `East` | `ArrowRight` |
| Arrows | `West` | `ArrowLeft` |
| Graphical | `InfoOutlined` | `InfoOutline` |
| Graphical | `WorkOutlined` | `WorkOutline` |
| Graphical | `HealthCrossOutlined` | `HealthCrossOutline` |
| Graphical | `ListAltOutlined` | `ListAltOutline` |
| Graphical | `HealthAndSafetyOutlined` | `HealthAndSafetyOutline` |
| Graphical | `ListAltCheckedOutlined` | `ListAltCheckedOutline` |
| Graphical | `TestTubeOutlined` | `TestTubeOutline` |
| Graphical | `AccessTime` | `ClockOutline` |
| Graphical | `WatchLater` | `Clock` |
| Graphical | `FmdGoodOutlined` | `LocationOutline` |
| Graphical | `HospitalOutlined` | `HospitalOutline` |
| Stepper | `LooksZero` | `ListZero` |
| Stepper | `LooksOne` | `ListOne` |
| Stepper | `LooksTwo` | `ListTwo` |
| Stepper | `LooksThree` | `ListThree` |
| Stepper | `LooksFour` | `ListFour` |
| Stepper | `LooksFive` | `ListFive` |
| Stepper | `LooksSix` | `ListSix` |
| Stepper | `LooksSeven` | `ListSeven` |
| Stepper | `LooksEight` | `ListEight` |
| Stepper | `LooksNine` | `ListNine` |
| Socials | `LinkedIn` | `Linkedin` |
| Socials | `LinkedInHover` | `LinkedinHover` |

### Release Overview

This breaking release removes the older icon names and replaces them with the Figma-aligned public set across toolkit and React.

Current toolkit component templates, docs examples, React stories, and tests have already been moved to the renamed icon surface in this branch.

### Migration Steps

1. Search for old icon names in toolkit macros, Nunjucks data, React `Icon` props, and any manifest-driven tests.
2. Replace each old name with the corresponding Figma-aligned name from the table above.
3. Re-run any tests or visual checks that assert icon symbol ids or class names such as `ofh-icon--Done`.

#### Toolkit example

**Before (`toolkit-v4.8.0`):**

```njk
{{ icon({ "name": "Done", "size": 24 }) }}
{{ icon({ "name": "ExpandMore", "size": 24 }) }}
```

**After (`toolkit-v4.9.0`):**

```njk
{{ icon({ "name": "Check", "size": 24 }) }}
{{ icon({ "name": "ChevronDown", "size": 24 }) }}
```

#### React example

**Before (`react-v0.6.0`):**

```tsx
<Icon name="AccessTime" size={24} />
<Icon name="LinkedIn" size={24} />
```

**After (`react-v0.7.0`):**

```tsx
<Icon name="ClockOutline" size={24} />
<Icon name="Linkedin" size={24} />
```

---

## Upgrading to v4.8.0 / React v0.6.0

**Released:** March 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.8.0+
- `@ourfuturehealth/react-components` v0.6.0+

### Release Overview

This release does not introduce a supported breaking API change.

Toolkit consumers do not have a migration-breaking change in this release.

React consumers should review the refreshed input-family API only if they experimented with the earlier `TextInput` prototype before this family was properly released.

### React input family refresh

React now exposes the public input-family components:

- `TextInput`
- `Textarea`
- `Select`
- `DateInput`
- `Autocomplete`
- `CharacterCount`
- `Checkboxes`
- `Radios`
- `Icon`
React also now exposes the public `Fieldset` component for grouped form questions and legends.
`TextInput` is now the released React implementation and aligns with the toolkit API while keeping the React surface idiomatic.

| Previous usage | New usage |
| -------------- | --------- |
| `error="Enter your name"` | `errorMessage="Enter your name"` |
| `maxLength={20}` to make the field narrower | `inputWidth={20}` |
| ad hoc page-heading markup around the label | `isPageHeading` |
| manual `aria-describedby` stitching | `describedBy` |

#### Prototype-to-release `TextInput` example

**Before (`react-v0.5.0`):**

```tsx
<TextInput
  id="name"
  label="Your name"
  hint="Enter your full name"
  error="Enter your name"
  maxLength={20}
/>
```

**After (`react-v0.6.0`):**

```tsx
<TextInput
  id="name"
  label="Your name"
  hint="Enter your full name"
  errorMessage="Enter your name"
  inputWidth={20}
/>
```

#### New React `Icon` component

React now exposes the public `Icon` component used across the refreshed input family and Card components.

- Use `size` for a fixed icon size.
- Use `responsiveSize` when the icon should follow the toolkit responsive iconography scale.

```tsx
<Icon name="Search" size={24} />
<Icon name="UnfoldMore" responsiveSize={24} />
```

### Migration checklist

- If you adopted the earlier `TextInput` prototype, update `error` to `errorMessage`
- If you used `maxLength` to narrow the field, replace it with `inputWidth`
- Review any local input wrappers to make sure they still match the released input-family structure
- Prefer the public `Icon` component over any local sprite helpers

---

## Upgrading to v4.7.0 / React v0.5.0

**Released:** March 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.7.0+
- `@ourfuturehealth/react-components` v0.5.0+

### Breaking Changes

None.

### Card Family Realignment

The Card family has been aligned to the current design-system split:

- `card` remains the base component
- `warning-callout` has moved to `card-callout`
- `do-dont-list` has moved to `card-do-dont`

#### Toolkit consumers

Existing toolkit consumers should continue to work without immediate code changes:

- `warningCallout()` still renders, but it is deprecated
- `list()` still renders, but it is deprecated
- legacy `card` inputs such as `clickable`, `feature`, `type`, and `HTML` still render, but they are deprecated

For new work, migrate to the new APIs:

| Deprecated toolkit API | Preferred API |
| ---------------------- | ------------- |
| `warningCallout()` | `cardCallout({ variant: 'warning', ... })` |
| `list({ type: 'tick'|'cross' })` | `cardDoDont({ type: 'do'|'dont', ... })` |
| `card({ clickable: true })` | `card({ variant: 'clickable' })` |
| `cardWithIcon()` | `card({ icon: { ... } })` |
| `card({ HTML: ... })` | `card({ descriptionHtml: ... })` |

#### React consumers

React now exposes the Card family directly:

- `Card`
- `CardCallout`
- `CardDoDont`

The nested `Card` `tag` prop uses the public React `Tag` API, so tag content is passed with `children` plus optional Tag props such as `variant` and `className`.

---

## Upgrading to v4.6.0 / React v0.4.0

**Released:** March 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.6.0+
- `@ourfuturehealth/react-components` v0.4.0+

### Breaking Changes

Tag naming and defaults have been updated to align with Figma:

| Previous usage | New usage |
| -------------- | --------- |
| `.ofh-tag` (blue default) | `.ofh-tag.ofh-tag--blue` |
| `.ofh-tag--grey` | `.ofh-tag--neutral` |

**Why this change?** The Tag component now matches the Figma component set directly: the default Tag is neutral, `neutral` is the canonical public name, and `brand` is available as a new supported variant.

### Migration Steps

#### For Toolkit (CSS/SCSS) Consumers

If you rely on the default blue Tag styling, make the blue choice explicit:

**Before (toolkit v4.5.0 and earlier):**

```html
<strong class="ofh-tag">Beta</strong>
<strong class="ofh-tag ofh-tag--grey">Inactive</strong>
```

**After (toolkit v4.6.0+):**

```html
<strong class="ofh-tag ofh-tag--blue">Beta</strong>
<strong class="ofh-tag ofh-tag--neutral">Inactive</strong>
```

**SCSS/CSS overrides:**

Update custom selectors that target the deprecated grey modifier or assumed blue default:

```scss
// OLD
.ofh-tag--grey {
  // custom styles
}

.my-status-tag .ofh-tag {
  // styles that expected the old blue default
}

// NEW
.ofh-tag--neutral {
  // custom styles
}

.my-status-tag .ofh-tag.ofh-tag--blue {
  // styles for the explicit blue variant
}
```

#### For React Components Consumers

React Tag is available from `react-components` in v0.4.0+ and uses a semantic React API:

```tsx
import { Tag } from '@ourfuturehealth/react-components';

<Tag variant="neutral">Inactive</Tag>
<Tag variant="brand">Beta</Tag>
```

React exposes the canonical variant names directly. If you need additional classes for integration hooks, use `className`. If you still have toolkit wrappers that rely on the deprecated grey modifier, update them to use `ofh-tag--neutral`.

### Migration Checklist

- [ ] Replace `.ofh-tag` usages that expected the old blue default with `.ofh-tag.ofh-tag--blue`
- [ ] Replace `.ofh-tag--grey` with `.ofh-tag--neutral`
- [ ] Review Storybook stories, docs examples, and templates for removed legacy Tag colours
- [ ] Re-test any docs-site or app-specific wrappers that style `.ofh-tag` without an explicit modifier

### Search Your Codebase

```bash
grep -r "ofh-tag--grey" --include="*.scss" --include="*.css" --include="*.html" --include="*.njk" .
grep -r "class=\"ofh-tag\"" --include="*.html" --include="*.njk" .
```

### Testing After Migration

After updating your code, verify:

1. Neutral Tags render with the low-emphasis bordered appearance
2. Blue Tags are explicitly marked with `ofh-tag--blue`
3. Brand Tags render with the dark OFH branded background
4. Existing docs-site banners and example callouts still render as expected

---

## Upgrading to v4.5.0

**Released:** March 2026
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.5.0+

**Authoritative migration guide:** [Toolkit v4.5.0 spacing, typography, and token migration guide](docs/migrations/toolkit-v4.5.0-spacing-typography-tokens.md)

### Breaking Changes

The toolkit spacing and direct typography APIs now use the Figma-aligned keys directly.

Summary:

- removed `ofh-spacing(...)`
- replaced the old unified responsive spacing map with separate horizontal and vertical maps
- renamed direct typography keys in `ofh-typography-responsive(...)` and `ofh-font(...)`
- renamed direct heading classes from `l/m/s` to `lg/md/sm`
- removed legacy direct typography utility aliases such as `ofh-u-font-size-h1`
- kept the numeric responsive font-size override utilities as the supported override utility surface, with `ofh-u-font-size-20` replacing `ofh-u-font-size-19`
- renamed several raw tokens and removed `$ofh-width-page-max`

This is still being released as a minor bump because there are no active consumers on the post-`v3.4.2` monorepo line, but any consumer adopting `v4.5.0` should use the standalone migration guide above.

---

## Upgrading to v4.3.0 / React v0.2.0

**Released:** March 2026  
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.3.0+
- `@ourfuturehealth/react-components` v0.2.0+

### Breaking Changes

Button variant naming has been updated to align with Figma design specifications:

| Old Name (Deprecated) | New Name (Required) |
| --------------------- | ------------------- |
| `ghost-reverse`       | `ghost-inverted`    |
| `text-reverse`        | `text-inverted`     |

All other variants (`contained`, `outlined`, `ghost`, `text`) remain unchanged.

**Why this change?** The term "inverted" more accurately describes the visual treatment (inverted colors for dark backgrounds) than "reverse", and aligns with Figma design specifications.

### Migration Steps

#### For Toolkit (CSS/SCSS) Consumers

If you're using the toolkit's CSS classes directly in HTML or templates:

**Before (toolkit v4.2.0 and earlier):**

```html
<button class="ofh-button ofh-button--ghost-reverse">Button</button>
<button class="ofh-button ofh-button--text-reverse">Button</button>
```

**After (toolkit v4.3.0+):**

```html
<button class="ofh-button ofh-button--ghost-inverted">Button</button>
<button class="ofh-button ofh-button--text-inverted">Button</button>
```

**SCSS/CSS overrides:**

If you have custom styles targeting these classes:

```scss
// ❌ OLD - Update these
.ofh-button--ghost-reverse {
  // custom styles
}

.ofh-button--text-reverse {
  // custom styles
}

// ✅ NEW - Use these instead
.ofh-button--ghost-inverted {
  // custom styles
}

.ofh-button--text-inverted {
  // custom styles
}
```

#### For React Components Consumers

If you're using the React component library:

**Before (react-components v0.1.0):**

```tsx
import { Button } from '@ourfuturehealth/react-components';

<Button variant="ghost-reverse">Button</Button>
<Button variant="text-reverse">Button</Button>
```

**After (react-components v0.2.0+):**

```tsx
import { Button } from '@ourfuturehealth/react-components';

<Button variant="ghost-inverted">Button</Button>
<Button variant="text-inverted">Button</Button>
```

**TypeScript types:**

The TypeScript definitions have been updated. Your IDE/compiler will show errors for the old variant names:

```typescript
// ❌ TypeScript Error - Property '"ghost-reverse"' does not exist in type
type ButtonVariant = 'ghost-reverse' | 'text-reverse';

// ✅ Use the new names
type ButtonVariant = 'ghost-inverted' | 'text-inverted';
```

### Migration Checklist

Use this checklist to ensure you've updated all occurrences:

#### Search Your Codebase

Run these searches in your project:

```bash
# Search for old variant names in all files
grep -r "ghost-reverse" .
grep -r "text-reverse" .

# Search specifically in React/TypeScript files
grep -r "ghost-reverse\|text-reverse" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" .

# Search in SCSS/CSS files
grep -r "ghost-reverse\|text-reverse" --include="*.scss" --include="*.css" .

# Search in HTML/template files
grep -r "ghost-reverse\|text-reverse" --include="*.html" --include="*.njk" .
```

#### Update Locations

- [ ] React component `variant` props
- [ ] TypeScript type definitions
- [ ] HTML class names
- [ ] CSS/SCSS class selectors
- [ ] Storybook stories
- [ ] Test files
- [ ] Documentation
- [ ] Design system examples

### Testing After Migration

After updating your code, verify:

1. **Visual Testing**: All buttons render correctly with proper styling
2. **Functional Testing**: Button interactions (click, focus, hover) work as expected
3. **Accessibility Testing**: Focus indicators are visible on all button variants
4. **Responsive Testing**: Buttons behave correctly at different breakpoints

Test all button states for the renamed variants:

- [ ] `ghost-inverted` - Default, Hover, Active, Focus, Disabled states
- [ ] `text-inverted` - Default, Hover, Active, Focus, Disabled states

### Example Migration Commit Message

```
feat!: migrate button variants from -reverse to -inverted

BREAKING CHANGE: Update button variant naming to align with Figma
- ghost-reverse → ghost-inverted
- text-reverse → text-inverted

Refs: toolkit v4.3.0, react-components v0.2.0
```

---

## Upgrading to v4.1.0

**Released:** February 2026  
**Affected packages:**

- `@ourfuturehealth/toolkit` v4.1.0+

### Breaking Changes

The spacing scale now includes a new `2px` point at index `1`.

To add this new point, spacing indices were shifted by `+1` for all existing non-zero values:

- `0` stays `0`
- `1` is now `2px` (new)
- Previous `1..N` becomes `2..N+1`

### What Changed

- `ofh-spacing()` valid points changed from `0-9` to `0-10`
- Responsive spacing points changed from `0-10` to `0-11`
- Utility class suffixes for spacing (`ofh-u-margin-*`, `ofh-u-padding-*`) follow the same index shift

### Migration Steps

Update any spacing indices greater than zero by adding `1`:

| Before                                        | After                                         |
| --------------------------------------------- | --------------------------------------------- |
| `ofh-spacing(1)`                              | `ofh-spacing(2)`                              |
| `ofh-spacing(6)`                              | `ofh-spacing(7)`                              |
| `@include ofh-responsive-margin(4, 'bottom')` | `@include ofh-responsive-margin(5, 'bottom')` |
| `@include ofh-responsive-padding(8, 'top')`   | `@include ofh-responsive-padding(9, 'top')`   |
| `ofh-u-margin-1`                              | `ofh-u-margin-2`                              |
| `ofh-u-padding-top-4`                         | `ofh-u-padding-top-5`                         |
| `ofh-u-margin-10`                             | `ofh-u-margin-11`                             |

**Important:** If you do not update these indices, spacing will render smaller than before.

### Search Your Codebase

```bash
# Find SCSS function calls
grep -r "ofh-spacing(" --include="*.scss" .
grep -r "ofh-responsive-margin(" --include="*.scss" .
grep -r "ofh-responsive-padding(" --include="*.scss" .

# Find utility classes in templates
grep -r "ofh-u-margin-" --include="*.html" --include="*.njk" .
grep -r "ofh-u-padding-" --include="*.html" --include="*.njk" .
```

---

## Upgrading to v4.0.0 (Monorepo Restructure)

**Released:** February 2026
**Affected packages:**

- All packages (repository restructured)

### Overview

The toolkit was restructured from a single-package repository into a monorepo with separate packages. This change improves maintainability and separation of concerns, but requires updates to how consuming projects install and reference the toolkit.

### ⚠️ Will This Break My Project?

**No, existing consumers will NOT automatically break.**

If your project uses a version tag from v3.4.2 or earlier, it will continue to work indefinitely:

```json
{
  "dependencies": {
    "ofh-design-system-toolkit": "github:ourfuturehealth/design-system-toolkit#v3.4.2"
  }
}
```

✅ **This works forever** - Git tags are immutable and point to the pre-refactor code.

### When You WILL Need to Update

You'll need to update your installation syntax if:

| Scenario                                        | Will Break? | When to Update                           |
| ----------------------------------------------- | ----------- | ---------------------------------------- |
| Using `#v3.4.2` or older version tag            | ❌ No       | Only when you want to upgrade to v4.0.0+ |
| Using `#main` branch (no version)               | ✅ Yes      | Immediately after merge                  |
| Trying to upgrade to `#toolkit-v4.0.0` or newer | 🔄 Yes      | Must use new syntax (see below)          |
| No version specified in package.json            | ✅ Yes      | Immediately after merge                  |

**Bottom line:** If you're using a version tag from v3.4.2 or earlier, you're safe and can upgrade on your own timeline.

### What Changed

#### Repository Structure

**Before v3.4.2 (single-package):**

```
design-system-toolkit/
├── dist/                          # Compiled CSS & JS outputs
├── packages/
│   ├── components/                # Component templates & source
│   └── core/                      # Core styles & utilities
├── site/                          # Documentation site
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
│   │   ├── core/                  # Core styles & utilities
│   │   ├── gulpfile.js            # Toolkit-specific build tasks
│   │   └── package.json           # Toolkit package.json
│   │
│   ├── site/                      # Documentation site package
│   │   └── package.json
│   │
│   └── react-components/          # React components package
│       └── package.json
├── pnpm-workspace.yaml            # Monorepo workspace config
└── package.json                   # Root workspace package.json
```

#### Key Changes

1. **Toolkit moved**: `packages/components/` → `packages/toolkit/components/`
2. **Build outputs moved**: `dist/` → `packages/toolkit/dist/`
3. **Separate package.json files**: Each package now has its own dependencies and scripts
4. **Workspace dependencies**: Packages reference each other using pnpm workspace protocol
5. **Independent versioning**: Each package can be versioned separately

### Migration Steps for External Projects

#### Step 1: Update Package Dependency

**Before v3.4.2:**

```json
{
  "dependencies": {
    "ofh-design-system-toolkit": "github:ourfuturehealth/design-system-toolkit#v3.4.2"
  }
}
```

**After v4.0.0:**

Install the published toolkit release tarball:

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v{version}/ourfuturehealth-toolkit-{version}.tgz"
  }
}
```

Replace `{version}` with the toolkit release you want to install.

For unreleased maintainer testing, build and pack the toolkit locally instead of pointing consumers at a branch:

```bash
pnpm --filter=@ourfuturehealth/toolkit run zip
npm pack ./packages/toolkit --ignore-scripts
```

Install the resulting local `.tgz` file in the consumer application.

#### Step 2: Update Template Imports (Nunjucks/Eleventy)

**Before:**

```njk
{% from 'packages/components/action-link/macro.njk' import actionLink %}
{% from 'packages/components/breadcrumb/macro.njk' import breadcrumb %}
{% from 'packages/components/button/macro.njk' import button %}
```

**After:**

```njk
{% from 'action-link/macro.njk' import actionLink %}
{% from 'breadcrumb/macro.njk' import breadcrumb %}
{% from 'button/macro.njk' import button %}
```

**Search your codebase:**

```bash
# Find all Nunjucks template imports
grep -r "from 'packages/components/" .
```

#### Step 3: Configure Template Search Paths

Update your Eleventy config (or equivalent template engine config):

```javascript
const nunjucks = require('nunjucks');

module.exports = function configuration(eleventyConfig) {
  const nunjucksEnv = nunjucks.configure(
    [
      'views/',
      'views/_includes/',
      'node_modules/@ourfuturehealth/toolkit/components/', // ← Add this
      'node_modules/@ourfuturehealth/toolkit/',
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

#### Step 4: Update CSS/SCSS Imports

**Before:**

```scss
// Import from root packages directory
@import 'packages/core/all';
@import 'packages/components/button/button';
```

**After:**

```scss
// Import from toolkit package
@import '@ourfuturehealth/toolkit/ofh.scss'; // All styles

// Or import specific components
@import '@ourfuturehealth/toolkit/core/all';
@import '@ourfuturehealth/toolkit/components/button/button';
```

**Update Sass CLI with load paths:**

```json
{
  "scripts": {
    "build:css": "sass --style compressed --load-path ./node_modules/@ourfuturehealth/toolkit ./styles/:./dist/css/"
  }
}
```

#### Step 5: Update JavaScript Imports

**Before:**

```javascript
import { Button } from '../packages/components/button/button.js';
```

**After:**

```javascript
import { Button } from '@ourfuturehealth/toolkit/components/button/button.js';

// Or use the compiled bundle
import '@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.js';
```

#### Step 6: Update Asset References

Update paths to compiled CSS and JS files:

**Before:**

```html
<link rel="stylesheet" href="/design-system-toolkit/ofh-design-system-toolkit.css" />
<script src="/design-system-toolkit/ofh-design-system-toolkit.js"></script>
```

**After:**

```html
<link
  rel="stylesheet"
  href="/node_modules/@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.css"
/>
<script src="/node_modules/@ourfuturehealth/toolkit/dist/ofh-design-system-toolkit.js"></script>
```

Or update your build process to copy from the new location:

```javascript
// Eleventy passthrough copy
eleventyConfig.addPassthroughCopy({
  'node_modules/@ourfuturehealth/toolkit/dist': 'ofh-design-system-toolkit',
  'node_modules/@ourfuturehealth/toolkit/assets': 'ofh-design-system-toolkit/assets',
});
```

### Component Distribution Methods

The toolkit provides three main outputs:

#### 1. Compiled Assets (Bundles)

Pre-built, minified files ready for production use:

- **CSS**: `packages/toolkit/dist/ofh-design-system-toolkit.css`
- **JavaScript**: `packages/toolkit/dist/ofh-design-system-toolkit.js`
- **Minified versions**: `*.min.css`, `*.min.js`

**Use case:** Traditional websites, static sites, simple projects that want plug-and-play assets.

#### 2. Source Files (Module Imports)

Individual component source files for modern build tools:

- **SCSS**: `packages/toolkit/components/**/*.scss`, `packages/toolkit/core/**/*.scss`
- **JavaScript modules**: `packages/toolkit/components/**/*.js`

**Use case:** Modern applications using bundlers (webpack, vite, rollup) that want tree-shaking, selective imports, or customization.

#### 3. Nunjucks Templates

Server-side rendering templates for generating HTML:

- **Macros**: `packages/toolkit/components/**/macro.njk`
- **Templates**: `packages/toolkit/components/**/template.njk`

**Use case:** Server-rendered applications using Nunjucks/Eleventy for HTML generation.

### Release Process Changes

**Before v3.4.2 (single package):**

- Single `package.json` at root with version
- One version number for everything: `v3.4.2`, `v3.4.1`, etc.
- Tag format: `v*` (e.g., `v3.4.2`)

**After v4.0.0 (monorepo):**

- Each package has its own `package.json` with **independent versioning**
  - Toolkit: `4.0.0`, `4.0.1`, `4.1.0`...
  - React Components: `0.0.1`, `0.0.2`, `0.1.0`...
- Consumers install package release tarballs rather than git subdirectories
- **Packages can be released independently**
- Tag format:
  - Toolkit: `toolkit-v*` (e.g., `toolkit-v4.0.0`)
  - React: `react-v*` (e.g., `react-v0.2.0`)

### Installing Individual Packages

Each package in the monorepo can be installed independently:

**Toolkit (styles, components, templates):**

```json
{
  "dependencies": {
    "@ourfuturehealth/toolkit": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v{version}/ourfuturehealth-toolkit-{version}.tgz"
  }
}
```

**React Components:**

```json
{
  "dependencies": {
    "@ourfuturehealth/react-components": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/react-v{version}/ourfuturehealth-react-components-{version}.tgz"
  }
}
```

### Benefits of the New Structure

**For Toolkit Maintainers:**

- **Separation of concerns**: Toolkit, site, and React components are independent
- **Independent versioning**: Each package can be versioned separately
- **Isolated dependencies**: Each package has only the dependencies it needs
- **Better tooling**: Can run tasks per-package or across workspace
- **Selective consumption**: External projects can install just what they need

**For Consumers:**

- **Cleaner imports**: No need to know internal directory structure
- **Standard npm package**: Toolkit can be consumed like any npm package
- **Flexible consumption**: Use compiled assets, source files, or templates as needed
- **Better IDE support**: Standard package structure improves autocomplete and imports
- **Selective installation**: Install only the packages you need

---

## Troubleshooting

### Templates Not Found

**Error**: `Template render error: (unknown path) [Line X, Column Y] Error: template not found: button/macro.njk`

**Solution**: Ensure your template engine is configured with the correct search paths pointing to `node_modules/@ourfuturehealth/toolkit/components/` or the appropriate relative path.

### Styles Not Compiling

**Error**: `Error: Can't find stylesheet to import.`

**Solution**: Add `--load-path ./node_modules/@ourfuturehealth/toolkit` to your Sass compilation command, or configure your bundler's resolve paths.

### Assets Not Copying

**Error**: CSS/JS files not found in built site

**Solution**: Update your build configuration's passthrough copy or static file handling to point to `node_modules/@ourfuturehealth/toolkit/dist/` (or `packages/toolkit/dist/` within the monorepo).

---

## Example Configurations

### Complete Eleventy Setup

```javascript
// eleventy.config.js
const nunjucks = require('nunjucks');

module.exports = function configuration(eleventyConfig) {
  // Configure Nunjucks to find toolkit templates
  const nunjucksEnv = nunjucks.configure(
    [
      'views/',
      'views/_includes/',
      'node_modules/@ourfuturehealth/toolkit/components/',
      'node_modules/@ourfuturehealth/toolkit/',
    ],
    {
      watch: false,
      noCache: true,
    }
  );

  eleventyConfig.setLibrary('njk', nunjucksEnv);

  // Copy toolkit compiled assets
  eleventyConfig.addPassthroughCopy({
    'node_modules/@ourfuturehealth/toolkit/dist': 'ofh-design-system-toolkit',
  });

  // Copy toolkit asset files (icons, images, etc.)
  eleventyConfig.addPassthroughCopy({
    'node_modules/@ourfuturehealth/toolkit/assets': 'ofh-design-system-toolkit/assets',
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
    "build:css": "sass --style compressed --load-path ./node_modules/@ourfuturehealth/toolkit ./styles/:./dist/css/",
    "build:eleventy": "eleventy",
    "build": "npm run build:css && npm run build:eleventy",
    "watch:css": "sass --watch --load-path ./node_modules/@ourfuturehealth/toolkit ./styles/:./dist/css/",
    "watch:eleventy": "eleventy --serve",
    "dev": "concurrently 'npm:watch:css' 'npm:watch:eleventy'"
  },
  "dependencies": {
    "@ourfuturehealth/toolkit": "https://github.com/ourfuturehealth/design-system-toolkit/releases/download/toolkit-v{version}/ourfuturehealth-toolkit-{version}.tgz",
    "@11ty/eleventy": "^2.0.0",
    "nunjucks": "^3.2.4",
    "sass": "^1.60.0"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

---

## Need Help?

If you encounter issues during migration:

1. Check that all paths are updated consistently
2. Verify your template engine configuration
3. Ensure toolkit is properly installed in `node_modules`
4. Review the [toolkit documentation site](https://ourfuturehealth.github.io/design-system-toolkit/) for component usage examples
5. Open an issue on the [GitHub repository](https://github.com/ourfuturehealth/design-system-toolkit)
