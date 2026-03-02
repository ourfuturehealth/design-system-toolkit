/**
 * Root Stylelint configuration for the design-system-toolkit monorepo
 * 
 * This configuration provides shared SCSS linting rules across all packages
 * that contain SCSS files (toolkit, site, react-components).
 * 
 * Note: Stylelint v15+ removed stylistic rules. Use Prettier for code formatting.
 * This config focuses on error prevention and best practices only.
 * 
 * Packages can extend this config in their own stylelint.config.cjs:
 * ```js
 * module.exports = {
 *   extends: '../../stylelint.config.cjs',
 *   rules: { your overrides }
 * };
 * ```
 * 
 * Ignored globs should be specified in each package's .stylelintignore file.
 */
module.exports = {
  plugins: [
    'stylelint-order',
    'stylelint-scss',
  ],
  extends: [
    'stylelint-config-standard-scss',
  ],
  rules: {
    // Order of elements - enforce consistent structure
    'order/order': [
      {
        'type': 'at-rule',
        'name': 'extend',
      },
      {
        'type': 'at-rule',
        'name': 'mixin',
      },
      'declarations',
      'rules',
    ],
    'order/properties-alphabetical-order': true,

    // Disallows - enforce best practices
    'color-no-hex': true, // Use variables, not hex values
    'color-named': 'never', // Use variables, not named colors
    'at-rule-disallowed-list': ['debug', 'warn'],
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-values'] }, // Permit fallbacks
    ],
    'block-no-empty': true,
    'selector-max-id': 0, // No ID selectors
    'declaration-no-important': true, // No !important
    'color-no-invalid-hex': true,
    'no-duplicate-selectors': true,
    'property-no-unknown': true,
    'declaration-property-value-disallowed-list': {
      'transition': ['all'],
      '/^border/': ['none'], // Use 'border: 0' not 'border: none'
    },
    'selector-no-qualifying-type': true,

    // SCSS-specific rules
    'scss/load-partial-extension': 'never', // Renamed from at-import-partial-extension
    'scss/load-no-partial-leading-underscore': true, // Renamed from at-import-no-partial-leading-underscore
    'scss/at-import-partial-extension': null, // Deprecated rule - disable warning
    'scss/at-import-no-partial-leading-underscore': null, // Deprecated rule - disable warning

    // Name Formats - enforce lowercase kebab-case
    'scss/at-function-pattern': '^[-_a-z]+$',
    'scss/at-mixin-pattern': '^[-_a-z]+$',
    'scss/percent-placeholder-pattern': '^[-_a-z]+$',
    'selector-class-pattern': '^[-._a-z0-9]+$',
    'scss/dollar-variable-pattern': '^[-_a-z0-9]+$',

    // Other
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [true, {
      'ignorePseudoClasses': ['input-placeholder'],
    }],
    'selector-pseudo-element-no-unknown': [true, {
      'ignorePseudoElements': ['input-placeholder'],
    }],
    'alpha-value-notation': null,
    'number-max-precision': null,
    'scss/at-mixin-argumentless-call-parentheses': null,
    'selector-no-vendor-prefix': null,
    'value-keyword-case': null,
    'scss/function-unquote-no-unquoted-strings-inside': null,
    'scss/no-global-function-names': null,
    'property-no-vendor-prefix': null,
  },
};
