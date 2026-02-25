# Coding standards

This document outlines the coding standards for the Our Future Health design system toolkit monorepo.

**Automated Enforcement:** These standards are enforced through linting tools (ESLint, Stylelint, Prettier). See [Linting](linting.md) for configuration details.

- [HTML](#html)
- [SCSS](#scss)
- [JavaScript](#javascript)
- [TypeScript](#typescript)
- [Code Formatting](#code-formatting)
- [Nunjucks](#nunjucks)
- [Components](#components)

---

## HTML

Use valid HTML5 where possible, whilst considering earlier versions of browser and lack of support for some HTML5 elements.

Use HTML according to its purpose. Use elements for what they have been created for. This is important for accessibility, reuse and code efficiency reasons.

### Syntax

- Use soft tabs with two spaces - they're the only way to guarantee code renders the same in any environment.
- Nested elements should be indented once (two spaces).
- Always use double quotes, never single quotes, on attributes.
- Don't include a trailing slash in self-closing elements - the HTML5 spec says they're optional.
- Don't omit optional closing tags (e.g. `</li>` or `</body>`).

### Attribute order

HTML attributes should come in this particular order for easier reading of code.

- `class`
- `id`, `name`
- `data-*`
- `src`, `for`, `type`, `href`, `value`
- `title`, `alt`
- `role`, `aria-*`

Classes make for great reusable components, so they come first. Ids are more specific and should be used sparingly (e.g., for in-page bookmarks), so they come second.

---

## SCSS

All SCSS files are linted with Stylelint using a shared configuration across the monorepo. See [Linting](linting.md) for details.

### Class naming convention

All class names start with a `.ofh-` namespace to reduce the likelihood of
conflicting with existing classes in your application. It also helps to identify
where the styling for a particular element is coming from.

If you are building components for your own application or framework you should
use a different prefix, for example `.app-` or the initials of your department.

### Block Element Modifier (BEM)

Our Future Health design system toolkit uses the Block Element Modifier (BEM) methodology when naming
CSS classes. This is designed to help developers understand how the different
classes relate to each other.

The naming convention follows this pattern:

```scss
.block {}
.block__element {}
.block--modifier {}

.ofh-card              // Block - the root of a component
.ofh-card__heading     // Element - a part of the block
.ofh-card--clickable   // Modifier - a variant of the block
```

It uses double hyphens (`--`) and underscores (`__`) so that the block, element
or modifiers themselves can be hyphen delimited without causing ambiguity.

For example:

```scss
.ofh-a-z-nav
.ofh-a-z-nav__link
.ofh-a-z-nav__link--disabled
```

#### BEM further reading:

- [Get BEM](http://getbem.com/introduction/)
- [BEM Resources](https://github.com/sturobson/BEM-resources)
- [Harry Roberts - BEMIT: Taking the BEM Naming Convention a Step Further](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)

### Nesting

Break elements and modifiers outside of blocks rather than nesting using a
parent selector `&`.

Nesting pseudo elements like `:before` and `:hover` is ok.

This makes the codebase easier to read, and makes it easier to search for a
given class name. It also discourages excessive nesting.

Bad:

```scss
.ofh-contents-list {
  ...
  &__item {
    ...
    &:before {
      ...
    }
  }
}
```

Good:

```scss
.ofh-contents-list {
  ...
}

.ofh-contents-list__item {
  ...
  &:before {
    ...
  }
}
```

BEM stands for `Block__Element--Modifier`, not `Block__Element__Element--Modifier`.

Avoid including multiple elements when naming classes.

### Using ampsersands in selectors

Create separate selectors rather using an `&` in the middle of a selector.

This enables the Our Future Health styles to be used inside other applications, where, for example, an ID is being used to isolate a section of a page to style separately from the rest of an application; e.g.

```scss
div#ofh-ers {
...
@import 'node_modules/ofh-design-system-toolkit/packages/core/all';
...
}
```

Bad:

```scss
.ofh-checkboxes__conditional {
  ...
  .js-enabled &--hidden {
    ...
  }
 ...
}
```

Good:

```scss
.ofh-checkboxes__conditional {
  ...
}

.js-enabled .ofh-checkboxes__conditional--hidden {
  ...
}
```

### Single Responsibility Principle

Each class has a single purpose, so you can be sure when making a change to a
class - it will only affect the element that class is applied to.

Also when deprecating classes, all of the CSS for this class can be removed
without affecting another component that had reused this css.

**Why?**

To ensure that styles can safely be added or removed without fear of breaking
other components.

### Component modifiers

Keep all of the variants of a component in the same place.

`.ofh-error-summary` modifies the `.ofh-list` component.

Component modifiers use an extra class, scoped to the component:

`.ofh-error-summary__list`

This class is part of the component, rather than a parent of a component.

**Why?**
This makes it easier to keep track of different contexts.

### Code comments

All scss files should have comments (with intent rather than implementation). Line comments should all go within
the top block comment and then a reference to the number should go next to the line of code.

Example:

```scss
/* ==========================================================================
   #TITLE
   ========================================================================== */

/**
 * Long-form comment.
 *
 * This spans multiple lines and is also constrained to no longer than 80
 * characters in width.
 *
 * 1. Provide line-comments like this.
 */

.X-class {
  color: red; /* [1] */
}
```

---

## JavaScript

All JavaScript files are linted with ESLint using a shared configuration across the monorepo. See [Linting](linting.md) for details.

### General Principles

- Use `const` by default, `let` when reassignment is needed, never `var`
- Use arrow functions for callbacks and anonymous functions
- Use template literals for string interpolation
- Use destructuring for object and array access where appropriate
- Prefer `===` over `==` (except when comparing to `null`)

### Code Style

- **Indentation:** 2 spaces (enforced by Prettier)
- **Quotes:** Single quotes for strings (enforced by ESLint and Prettier)
- **Semicolons:** Always use semicolons (enforced by ESLint and Prettier)
- **Naming:**
  - Variables and functions: camelCase (e.g., `getUserName`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
  - Classes: PascalCase (e.g., `UserAccount`)
  - Private properties: Prefix with underscore (e.g., `_privateMethod`)

### Jest Testing

The toolkit package uses Jest for testing. Test globals (`describe`, `test`, `expect`, etc.) are automatically available without imports.

---

## TypeScript

The React components and example consumer app packages use TypeScript. All TypeScript files are linted with ESLint + TypeScript ESLint.

### General Principles

- Prioritize explicit return types for functions
- Use interfaces for object shapes, types for unions/intersections
- Avoid `any` - use `unknown` if type is truly unknown
- Enable strict mode features (already configured)

### Code Style

- Follow the same JavaScript code style principles
- Use TypeScript-specific features: generics, utility types, type guards
- Prefer type inference when obvious, explicit types when needed for clarity

---

## Code Formatting

All code is automatically formatted with Prettier to ensure consistency.

### Prettier Configuration

The monorepo uses a shared Prettier configuration (`.prettierrc` at root):

- **Single quotes** for strings (aligned with ESLint and Stylelint)
- **Semicolons** always
- **2 spaces** for indentation
- **100 character** line length
- **Trailing commas** for multi-line arrays/objects (ES5 compatible)

### Editor Integration

Install the Prettier extension for your editor:

- VS Code: `esbenp.prettier-vscode`
- Configure "Format on Save" for automatic formatting

---

## Nunjucks

We have chosen as Nunjucks as the templating language for Our Future Health design system toolkit components. We expose those templates as reusable chunks of code: macros. Developers import macros into their application, call them as per documentation and provide data to its arguments.

To provide a level of consistency for developers we have standardised argument names, their expected input, use and placement. There are expectations, and if so they are documented accordingly.

### Specifying content

When providing _content_ to a macro, say for a label or a button, we accept two argument options:

- `text` accepts a plain string and is the default way of passing content
- `html` accepts html markup. In the template we will not escape html so it will be rendered. In a scenario where both text and html are set, html argument will take precedence over text.

Example:

```
{{ insetText({
  "text": "You'll need to stay away from school, nursery or work until all the spots have crusted over. This is usually 5 days after the spots first appeared."
}) }}
```

```
{{ insetText({
  "HTML": "<p>If you drive you must tell the <a href='https://www.gov.uk/contact-the-dvla/' title='External website'>DVLA</a> about your vertigo. Visit the GOV.UK website for more information on <a href='https://www.gov.uk/dizziness-and-driving' title='External website'>driving with vertigo</a></p>"
}) }}
```

Example of implementing logic in a component template:

`{{ params.html | safe if params.html else params.text }}`

Example shows that if `html` and `text` arguments are present, then `html` takes precedence over `text` and we are not escaping it.

### Naming attributes

We should use **camelCase** for naming attributes.

### Specifying multiple items

When a component accepts a _single array of items_ for an output, such as checkboxes or radios, we accept an **_"items"_** array of objects. Table component is an exception is it can contain multiple array for rows, head, footer where there is need to for more specific names.

### Use of classes to specify variants

When a component has multiple visual presentations, such as the care cards, we make use of classes argument to differentiate between them.

Care card urgent (red) example:

```html
<div class="ofh-card ofh-card--care ofh-card--care--urgent"></div>
```

Care card emergency (red and black) example:

```html
<div class="ofh-card ofh-card--care ofh-card--care--emergency"></div>
```

---

## Components

You can find Our Future Health design system toolkit components in `packages/components`.

Components must use the `.ofh-` namespace.

For example, `.ofh-card`.

### Writing SCSS for components

Components must follow the conventions described in our SCSS coding standards.

Components must:

- use classes for child elements, scoped to the parent component
- be flexible, not set a width or external padding and margins
- set internal margins in a single direction
- not rely on any other selector outside of the component scss file to style its children

#### Component folder structure and naming

Component folder and files should be singular, except in cases where they are more commonly used in groups, for example, radios and checkboxes.

An example component exists in `app/examples/components/component-example`.

Use this as the basis for creating new components.

The folder structure should be:

    component-name
      - `_component-name.scss`
      - `component-name.js`
      - `macro.njk`
      - `README.md`
      - `template.njk`

---

Next: [Testing](testing.md)
