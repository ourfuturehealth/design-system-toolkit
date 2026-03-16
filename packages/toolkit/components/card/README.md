# Card

## Guidance

Find out more about the Card component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/card).

## Quick start examples

### Basic card

[Preview the basic card component](https://ourfuturehealth.github.io/design-system-toolkit/components/card/basic-card.html)

#### Nunjucks macro

```njk
{% from 'components/card/macro.njk' import card %}

{{ card({
  heading: 'If you need help now, but it’s not an emergency',
  headingLevel: 3,
  descriptionHtml: '<p class="ofh-card__description">Go to <a href="#">111.nhs.uk</a> or <a href="#">call 111</a></p>'
}) }}
```

### Clickable card

[Preview the clickable card component](https://ourfuturehealth.github.io/design-system-toolkit/components/card/clickable-card.html)

#### Nunjucks macro

```njk
{% from 'components/card/macro.njk' import card %}

{{ card({
  variant: 'clickable',
  href: '#',
  heading: 'Introduction to care and support',
  headingLevel: 3,
  description: 'A quick guide for people who have care and support needs and their carers'
}) }}
```

### Card with status icon

[Preview the basic success card](https://ourfuturehealth.github.io/design-system-toolkit/components/card/basic-success-card.html)

#### Nunjucks macro

```njk
{% from 'components/card/macro.njk' import card %}

{{ card({
  heading: 'Profile complete',
  headingLevel: 3,
  description: 'You’ve completed all the required profile details.',
  icon: {
    name: 'Done',
    size: 32
  }
}) }}
```

## Nunjucks arguments

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `variant` | string | No | Card variant: `basic` or `clickable`. Default: `basic`. |
| `heading` | string | No | Text heading. Ignored if `headingHtml` is provided. |
| `headingHtml` | string | No | HTML heading content. |
| `headingClasses` | string | No | Additional heading classes. |
| `headingLevel` | integer | No | Heading level. Default: `2`. |
| `href` | string | No | Primary card link URL. |
| `description` | string | No | Plain text body copy. |
| `descriptionHtml` | string | No | HTML body content. |
| `icon` | object | No | Trailing icon configuration. |
| `dismissButton` | object | No | Dismiss button configuration. |
| `number` | string | No | Large numeric value for dashboard-style cards. |
| `tag` | object | No | Tag macro options passed through to the tag component. |
| `metadataItems` | array | No | Metadata rows with icon and text. |
| `helperText` | string | No | Helper text below the main content. |
| `helperHtml` | string | No | HTML helper content below the main content. |
| `actionLink` | object | No | Secondary action link. |
| `imgURL` | string | No | Optional image URL. |
| `imgALT` | string | No | Alternative text for the image. |
| `classes` | string | No | Additional classes for the card root. |
| `attributes` | object | No | Additional HTML attributes for the card root. |

### Deprecated compatibility APIs

The following toolkit inputs are still supported for existing consumers, but they are deprecated and new work should use the new Card family APIs instead:

- `clickable` as a legacy alias for `variant: 'clickable'`
- `feature` for legacy feature cards
- `type` for legacy care-card variants
- `HTML` as a legacy alias for `descriptionHtml`
- `cardWithIcon()` as a legacy helper macro

Prefer:

- `variant` instead of `clickable`
- `icon` instead of `cardWithIcon()`
- `card-callout` instead of `warning-callout`
- `card-do-dont` instead of `do-dont-list`

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html`, can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
