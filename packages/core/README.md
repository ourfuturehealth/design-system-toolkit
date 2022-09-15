# Core

Core contains all the building blocks (page layout and the responsive grid) and fundamental styles (such as colours and typography) needed for Our Future Health websites and services. These styles are required for all of the components to work.

Core also is the home of powerful `sass` features such as variables, mixins, functions and maps.

## Page layout

### Fixed-width container

```html
<div class="ofh-width-container">
  <main class="ofh-main-wrapper" id="maincontent">
    <!-- Grid items -->
  </main>
</div>
```

### Fluid-width container

```html
<div class="ofh-width-container-fluid">
  <main class="ofh-main-wrapper" id="maincontent">
    <!-- Grid items -->
  </main>
</div>
```

## Grid items

### Full width

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-full">
    <!-- Component -->
  </div>
</div>
```

### Three-quarters

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-three-quarters">
    <!-- Component -->
  </div>
</div>
```

### One-half

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-one-half">
    <!-- Component -->
  </div>
</div>
```

### Two-thirds

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-two-thirds">
    <!-- Component -->
  </div>
</div>
```

### One-third

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-one-third">
    <!-- Component -->
  </div>
</div>
```

### One-quarter

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-one-quarter">
    <!-- Component -->
  </div>
</div>
```

### Nested grid items

```html
<div class="ofh-grid-row">
  <div class="ofh-grid-column-two-thirds">
    <!-- Component -->
    <div class="ofh-grid-row">
      <div class="ofh-grid-column-one-half">
        <!-- Component -->
      </div>
      <div class="ofh-grid-column-one-half">
        <!-- Component -->
      </div>
    </div>

  </div>
</div>
```

### Example page layout

```html
<!-- Header -->
<div class="ofh-width-container">
  <main class="ofh-main-wrapper" id="maincontent">
    <div class="ofh-grid-row">
      <div class="ofh-grid-column-three-quarters">
        <!-- Components -->
      </div>
    </div>
  </main>
</div>
<!-- Footer -->
```

## Utilities

### Clearfix

Automatically clear an elements child elements.

```html
<div class="ofh-u-clear"></div>
```

### Bold font weight

```html
<p class="ofh-u-font-weight-bold"></p>
```

### Grid overrides

By default all grid elements will go to 100% width on screen sizes below tablet. These utilities can force
custom widths on all screen sizes.

```
ofh-u-[grid-size]
```

```html
<div class="ofh-grid-column-one-half ofh-u-one-half"></div>
```

### Normal font weight

```html
<p class="ofh-u-font-weight-normal"></p>
```

### Secondary text colour

```html
<p class="ofh-u-secondary-text-color"></p>
```

### Reading width

Add a maximum width to large pieces of content, to improve readability.

```html
<div class="ofh-u-reading-width">
  <!-- Component -->
</div
```

### Remove top and bottom margins

```html
<h1 class="ofh-u-top-and-bottom"></h1>
```

### Spacing overrides

```html
class="ofh-u-margin-[direction]-[spacing]"
```

#### Remove bottom margin

```html
<h1 class="ofh-u-margin-bottom-0"></h1>
```

#### Remove all margins

```html
<h1 class="ofh-u-margin-0"></h1>
```

#### Custom margins

```html
<h1 class="ofh-u-margin-top-1"></h1>
```

### Prevent text wrapping

Prevent long anchor links from line breaking on smaller screens.

```html
<a class="ofh-u-nowrap"></a>
```

### Visually hidden

Hide elements visually but keep it in the DOM, useful for screen readers.

```html
<span class="ofh-u-visually-hidden"></span>
```

## Typography

### Lede text

```html
<h1>Live Well</h1>
<p class="ofh-lede-text">Advice, tips and tools to help you make the best choices about your health and wellbeing.</p>
```

### Font

Source Sans Pro from Google Fonts – <https://fonts.google.com/specimen/Source+Sans+Pro>

## Breakpoints

```
mobile: 320px
tablet: 641px
desktop: 769px
large-desktop: 990px
```

### Media queries (using [sass-mq](https://github.com/sass-mq/sass-mq))

`mq()` is a Sass mixin that helps you compose media queries in an elegant way.

`mq()` takes up to three optional parameters:

- `$from`: inclusive `min-width` boundary
- `$until`: exclusive `max-width` boundary
- `$and`: additional custom directives

```scss
.responsive {
  // Apply styling to mobile and upwards
  @include mq($from: mobile) {
    color: red;
  }
  // Apply styling up to devices smaller than tablets (exclude tablets)
  @include mq($until: tablet) {
    color: blue;
  }
  // Same thing, in landscape orientation
  @include mq($until: tablet, $and: '(orientation: landscape)') {
    color: green;
  }
  // Apply styling to print media
  @include mq($media-type: print) {
    color: orange;
  }
}
```

## Colour variables

### Primary

```scss
$color_ofh-brand-yellow: #005eb8;
$color_ofh-brand-white: #ffffff;
$color_ofh-black: #212b32;
$color_ofh-brand-green: #007f3b;
$color_ofh-brand-red: #da291c;
$color_ofh-brand-yellow: #ffeb3b;
$color_ofh-purple: #330072;
```

### Secondary

```scss
$color_ofh-pale-yellow: #fff9c4;
$color_ofh-warm-yellow: #ffb81C;
$color_ofh-aqua-green: #00A499;
```

### Greyscale

```scss
$color_ofh-grey-1: #425563;
$color_ofh-grey-2: #768692;
$color_ofh-grey-3: #aeb7bd;
$color_ofh-grey-4: #d8dde0;
$color_ofh-grey-5: #f0f4f5;
```
