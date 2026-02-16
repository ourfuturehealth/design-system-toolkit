# Custom Components for the Doc site

There are some occassions where we don't want to use the design system components for the documentation site or make any custom changes to design system components to meet the needs of it.

If that is the case, this `site/components` directory can be used to create custom components. 


## How to create a Doc site component

1. You can find a template in `site/components/example`. The structure should be the same, with the `example` being replaced with your component name.
2. Update `site/styles/main.scss` to load the doc site component SCSS by adding:

    ```
    @import '../components/example/example';
    ```
