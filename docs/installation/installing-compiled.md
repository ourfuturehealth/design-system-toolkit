# Installing using compiled files

When installing Our Future Health design system toolkit using compiled files, you are using compiled and minified versions of the stylesheet and JavaScript.

This means that you will not be able to:

- selectively include CSS for individual components.
- build your own styles or components based on the colour variables or typography and spacing mixins.
- use the component Nunjucks templates.

If you require any of this functionality, you should [install using npm](/docs/installation/installing-with-npm.md) instead.

## Installation

1. Download the compiled files

    [Download the latest CSS, JavaScript and assets from GitHub (zip file)](https://github.com/ourfuturehealth/design-system-toolkit/releases)

2. Include resources

    Copy all 3 folders, `css`, `js` and `assets`, into the root of your project. If you already have a folder structure
    in place, you will need to copy the individual files into the relevant folders.

    Make sure you change the version numbers of the `[latest version].min.css` and `[latest version].min.js` files,
    in the example below, to the version you are using.

    ```html
    <!-- Styles -->
    <link rel="stylesheet" href="css/ofh-design-system-toolkit-[latest version].min.css">

    <!-- Scripts -->
    <script src="js/ofh-design-system-toolkit-[latest version].min.js" defer></script>

    <!-- Favicons -->
    <link rel="shortcut icon" href="assets/favicons/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="assets/favicons/apple-touch-icon-180x180.png">
    <link rel="mask-icon" href="assets/favicons/favicon.svg" color="#FFC62C">
    <link rel="icon" sizes="192x192" href="assets/favicons/favicon-192x192.png">
    <meta name="msapplication-TileImage" content="assets/favicons/favicon-270x270.png">
    <meta name="msapplication-TileColor" content="#FFC62C">
    ```

  3. Get the JavaScript working

      Add the following JavaScript to the top of the `<body>` section of your page template:

      ```
      <script>document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');</script>
      ```

  4. Create pages using Our Future Health design system toolkit

      See <https://designsystem.ourfuturehealth.org.uk/> for docs.
