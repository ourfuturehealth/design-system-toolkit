# CSS Style Guide

## Class naming convention

## `nhsuk` namespacing

All class names start with a `.nhsuk-` namespace to reduce the likelihood of
conflicting with existing classes in your application. It also helps to identify
where the styling for a particular element is coming from.

If you are building components for your own application or framework you should
use a different prefix, for example `.app-` or the initials of your department.

## Block Element Modifier (BEM)

NHS.UK Frontend uses the Block Element Modifier (BEM) methodology when naming
CSS classes. This is designed to help developers understand how the different
classes relate to each other.

The naming convention follows this pattern:

```scss
.block {}
.block__element {}
.block--modifier {}

.nhsuk-promo              // Block - the root of a component
.nhsuk-promo__heading     // Element - a part of the block
.nhsuk-promo--small       // Modifier - a variant of the block
```

It uses double hyphens (`--`) and underscores (`__`) so that the block, element
or modifiers themselves can be hyphen delimited without causing ambiguity.

For example:

```scss
.nhsuk-a-z-nav
.nhsuk-a-z-nav__link
.nhsuk-a-z-nav__link--disabled
```

### Further reading:

* [Get BEM](http://getbem.com/introduction/)
* [BEM Resources](https://github.com/sturobson/BEM-resources)
* [Harry Roberts - BEMIT: Taking the BEM Naming Convention a Step Further](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)

## Nesting

Break elements and modifiers outside of blocks rather than nesting using a
parent selector `&`. 

Nesting pseudo elements like `:before` and `:hover` is ok.

This makes the codebase easier to read, and makes it easier to search for a
given class name. It also discourages excessive nesting.

Bad:

```
.nhsuk-contents-list {
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

```
.nhsuk-contents-list {
  ...
}

.nhsuk-contents-list__item {
  ...
  &:before {
    ...
  }
}
```

BEM stands for `Block__Element--Modifier`, not `Block__Element__Element--Modifier`.

Avoid including multiple elements when naming classes.

## Single Responsibility Principle

Each class has a single purpose, so you can be sure when making a change to a
class - it will only affect the element that class is applied to.

Also when deprecating classes, all of the CSS for this class can be removed
without affecting another component that had reused this css.

**Why?**

To ensure that styles can safely be added or removed without fear of breaking
other components.

## Component modifiers

Keep all of the variants of a component in the same place.

`.nhsuk-error-summary` modifies the `.nhsuk-list` component.

Component modifiers use an extra class, scoped to the component:

`.nhsuk-error-summary__list`

This class is part of the component, rather than a parent of a component.

**Why?**
This makes it easier to keep track of different contexts.

# Linting

## Running the lint task

## Linting rules

We use the following rules when linting files:

### Use soft tabs (2 spaces)

### Write each property on its own line

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

### Use variables for colours not HEX values in selectors rules, unless in variables.

Bad:
```
.selector {
  color: #005eb8;
}
```

Good:
```
.selector {
  color: $colour_nhsuk-blue;
}
```

### Colours defined as variables should be in lowercase and in full length

Bad:
```
$white: #FFF;
```

Good:
```
$white: #ffffff;
```

### Use `border: 0` not `none` to denote no border

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

Bad:
```
#content {
  ...
}
```

Good:
```
.nhsuk-wrapper {
  ...
}
```

### Separate rule, function, and mixin declarations with empty lines

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

Bad:
```
.nhsuk-breadcrumb {
  ...
  &__item {
    ...
  }
}
```

Good:
```
.nhsuk-breadcrumb {
  ...
}

.nhsuk-breadcrumb__item {
  ...
}
```

### Don't use extends, use mixins

Bad:
```
@extend %contain-floats;
```

Good:
```
@include clearfix;
```

### Allow max 3-rule property shorthand if possible

Bad:
```
margin: 1px 2px 3px 2px;
```

Good:
```
margin: 1px 2px 3px;
```
### Files should always have a final newline

### Commas in lists should be followed by a space

### The basenames of `@import`ed SCSS partials should not begin with an underscore and should not include the filename extension

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

### Operators should be formatted with a single space on both sides of an infix operator. These include `+, -, *, /, %, ==, !=, >, >=, <,` and `<=`

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

Bad:
```
@mixin FONT_STACK() {
  font-family: $nhsuk-font-stack;
}
```

Good:
```
@mixin font-stack() {
  font-family: $nhsuk-font-stack;
}
```

### Omit length units on zero values

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

More write up on [supported rules](https://github.com/sasstools/sass-lint/tree/master/docs/rules).
