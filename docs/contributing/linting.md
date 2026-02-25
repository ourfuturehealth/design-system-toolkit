# Linting

This monorepo uses a unified linting configuration to ensure code consistency across all packages.

## Linting Tools

- **ESLint** - For JavaScript and TypeScript files
- **Stylelint** - For SCSS files
- **Prettier** - For code formatting

## Configuration Structure

### Root Configuration Files

The monorepo has root-level configuration files that define shared rules:

- `eslint.config.mjs` - Shared ESLint rules for all JavaScript/TypeScript
- `stylelint.config.js` - Shared Stylelint rules for all SCSS
- `.prettierrc` - Shared Prettier formatting rules

### Package-Specific Configurations

Each package can extend the root configuration with package-specific overrides:

- `packages/toolkit/eslint.config.mjs` - Extends root config with Jest globals
- `packages/toolkit/stylelint.config.js` - Extends root config (no overrides currently)
- `packages/react-components/eslint.config.js` - Extends root config with React + TypeScript rules
- `packages/react-components/stylelint.config.js` - Extends root config (no overrides currently)
- `packages/site/stylelint.config.js` - Extends root config (no overrides currently)

## Running Linting

### Lint All Packages

```bash
pnpm run lint
```

### Lint Specific Packages

```bash
# Lint toolkit only
pnpm run lint:toolkit

# Lint React components only
pnpm run lint:react-components

# Lint site only
pnpm run lint:site

# Lint example consumer app only
pnpm run lint:react-consumer
```

### Package-Specific Linting

Each package has its own lint scripts:

**Toolkit:**

```bash
cd packages/toolkit
pnpm run lint          # Run all linters (JS + CSS)
pnpm run lint:js       # Lint JavaScript only
pnpm run lint:js:fix   # Auto-fix JavaScript issues
pnpm run lint:css      # Lint SCSS only
pnpm run lint:css:fix  # Auto-fix SCSS issues
```

**React Components:**

```bash
cd packages/react-components
pnpm run lint          # Run all linters (JS + CSS)
pnpm run lint:js       # Lint TypeScript only
pnpm run lint:js:fix   # Auto-fix TypeScript issues
pnpm run lint:css      # Lint SCSS only
pnpm run lint:css:fix  # Auto-fix SCSS issues
```

**Site:**

```bash
cd packages/site
pnpm run lint          # Run all linters (HTML + CSS)
pnpm run lint:html     # Lint HTML only
pnpm run lint:css      # Lint SCSS only
pnpm run lint:css:fix  # Auto-fix SCSS issues
```

## Linting rules

**Important:** This monorepo uses a combination of tools to enforce code quality and consistency:

- **Prettier** - Handles ALL code formatting (spacing, quotes, semicolons, line breaks, etc.)
- **Stylelint** - Detects errors and bad practices in SCSS (no hex colors, no !important, naming conventions, etc.)
- **ESLint** - Detects errors and bad practices in JavaScript/TypeScript

### How It Works

When you save a file:

1. **Prettier auto-formats** the code (if you have format-on-save enabled)
2. **Linters report errors** that Prettier can't fix (architectural issues, best practices violations)

Many of the rules below are now **automatically enforced by Prettier** and will be fixed on save. Others are **enforced by linters** and will show as errors/warnings. Some are **guidelines only** that require manual adherence.

### Rule Status Key

- ✅ **Auto-formatted (Prettier)** - Fixed automatically when you save
- 🔍 **Linter-enforced (Stylelint/ESLint)** - Shows as error/warning, must fix manually
- ℹ️ **Guideline only** - Best practice, not enforced by tools

---

## SCSS Rules

We use the following rules when linting SCSS files:

### Use soft tabs (2 spaces)

**Status:** ✅ Auto-formatted (Prettier)

### Write each property on its own line

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
.selector {border: 0; padding: 0;}
```

Good:

```
.selector {
  border: 0;
  padding: 0;
}
```

### Use variables for colours not HEX values in selectors rules, unless in variables

**Status:** 🔍 Linter-enforced (Stylelint: `color-no-hex`)

Bad:

```
.selector {
  color: #005eb8;
}
```

Good:

```
.selector {
  color: $colour_ofh-blue;
}
```

### Colours defined as variables should be in lowercase and in full length

**Status:** ℹ️ Guideline only (cannot be automatically enforced)

**Note:** This rule applies to variable definitions, which are not checked by linters. Follow this convention manually.

Bad:

```
$white: #FFF;
```

Good:

```
$white: #ffffff;
```

### Use `border: 0` not `none` to denote no border

**Status:** 🔍 Linter-enforced (Stylelint: `declaration-property-value-disallowed-list`)

Bad:

```
.selector {
  border: none;
}
```

Good:

```
.selector {
  border: 0;
}
```

### Avoid using ID selectors

**Status:** 🔍 Linter-enforced (Stylelint: `selector-max-id: 0`)

Bad:

```
#content {
  ...
}
```

Good:

```
.ofh-wrapper {
  ...
}
```

### Separate rule, function, and mixin declarations with empty lines

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
p {
  margin: 0;
  em {
    ...
  }
}
a {
  ...
}
```

Good:

```
p {
  margin: 0;

  em {
    ...
  }
}

a {
  ...
}
```

### Use no more than 3 levels of nesting

**Status:** ℹ️ Guideline only (not enforced by linters)

**Note:** Following BEM methodology naturally limits nesting. This is an architectural best practice rather than a lint rule.

Bad:

```
.ofh-breadcrumb {
  ...
  &__item {
    ...
  }
}
```

Good:

```
.ofh-breadcrumb {
  ...
}

.ofh-breadcrumb__item {
  ...
}
```

### Don't use extends, use mixins

**Status:** ℹ️ Guideline only (not enforced by linters)

**Note:** This is a best practice recommendation. Consider adding `scss/at-extend-no-missing-placeholder` rule if strict enforcement is desired.

Bad:

```
@extend %contain-floats;
```

Good:

```
@include clearfix;
```

### Allow max 3-rule property shorthand if possible

**Status:** ⚠️ Partially enforced (Stylelint warns about redundant values)

Bad:

```
margin: 1px 2px 3px 2px;
```

Good:

```
margin: 1px 2px 3px;
```

### Files should always have a final newline

**Status:** ✅ Auto-formatted (Prettier)

### Commas in lists should be followed by a space

**Status:** ✅ Auto-formatted (Prettier)

### The basenames of `@import`ed SCSS partials should not begin with an underscore and should not include the filename extension

**Status:** 🔍 Linter-enforced (Stylelint: `scss/load-partial-extension`, `scss/load-no-partial-leading-underscore`)

Bad:

```
@import '_foo.scss';
@import '_bar/foo.scss';
```

Good:

```
@import 'foo';
@import 'bar/foo';
```

### Properties should be formatted with a single space separating the colon from the property's value

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
.foo {
  content:'bar';
}
```

Good:

```
.foo {
  content: 'bar';
}
```

### Operators should be formatted with a single space on both sides of an infix operator

**Status:** ✅ Auto-formatted (Prettier)

These include `+, -, *, /, %, ==, !=, >, >=, <,` and `<=`.

Bad:

```
.selector {
  margin: 5px+15px;
}

$foo: 1;
$bar: 3;

.selector {
  margin: $foo+$bar+'px';
}

$foo: 1+1;
$bar: 2-1;

@if $foo==$bar {
  $baz: 1;
}

@if ($foo!=$bar) {
  $baz: 1;
}
```

Good:

```
.selector {
  margin: 5px + 15px;
}

$foo: 1;
$bar: 3;

.selector {
  margin: $foo + $bar + 'px';
}

$foo: 1 + 1;
$bar: 2 - 1;

@if $foo == $bar {
  $baz: 1;
}

@if ($foo != $bar) {
  $baz: 1;
}
```

### Avoid whitespace between parentheses and the arguments

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
@function foo( $bar, $baz ) {
  @return $bar + $baz;
}
```

Good:

```
@function foo($bar, $baz) {
  @return $bar + $baz;
}
```

### Functions, mixins, variables, and placeholders should be declared with all lowercase letters and hyphens instead of underscores

**Status:** 🔍 Linter-enforced (Stylelint: naming pattern rules)

Bad:

```
@mixin FONT_STACK() {
  font-family: $ofh-font-stack;
}
```

Good:

```
@mixin font-stack() {
  font-family: $ofh-font-stack;
}
```

### Omit length units on zero values

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
.selector {
  margin: 0px;
}
```

Good:

```
.selector {
  margin: 0;
}
```

### Property values and variable declarations should always end with a semicolon

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
.selector {
  margin: 0
}

$my-example-var: value
```

Good:

```
.selector {
  margin: 0;
}

$my-example-var: value;
```

### Don't write trailing zeros for numeric values with a decimal point

**Status:** ✅ Auto-formatted (Prettier)

Bad:

```
.selector {
  font-size: 0.50em;
}
```

Good:

```
.selector {
  font-size: 0.5em;
}
```

### Remove trailing whitespace

**Status:** ✅ Auto-formatted (Prettier)

---

## Additional SCSS Best Practices

### Properties should be in alphabetical order

**Status:** 🔍 Linter-enforced (Stylelint: `order/properties-alphabetical-order`)

This makes it easier to find properties in large rule sets.

### No !important declarations

**Status:** 🔍 Linter-enforced (Stylelint: `declaration-no-important`)

Use specificity to override styles, not `!important`.

### No duplicate selectors

**Status:** 🔍 Linter-enforced (Stylelint: `no-duplicate-selectors`)

Duplicate selectors can lead to unintended overrides.

---

More write up on [supported rules](https://stylelint.io/user-guide/rules/list).

---

Next: [Testing](testing.md)
