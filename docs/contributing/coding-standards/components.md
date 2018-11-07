# Components

Find components in `packages/components`.

Components must use the `.nhsuk-` namespace.

For example, `.nhsuk-promo`.

## Writing CSS for components

Components must follow the conventions described in our [CSS coding standards](css.md).

Components must:
* use classes for child elements, scoped to the parent component
* be flexible, not set a width or external padding and margins
* set internal margins in a single direction
* not rely on any other selector outside of the component scss file to style its children

### Component folder structure and naming

Component folder and files should be singular, except in cases where they are more commonly used in groups, for example, radios and checkboxes.

An example component exists in `docs/examples/components/component-example`.

Use this as the basis for creating new components.

The folder structure should be:

    component-name
      - `_component-name.scss`
      - `component-name.js`
      - `macro.njk`
      - `README.md`
      - `template.html`
      - `template.njk`
      - `template.test.js`       

## Nunjucks template API
[Read more](nunjucks-api.md) about the way we write component templates.
