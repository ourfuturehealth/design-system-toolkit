// Ignored globs are specified in .stylelintignore file

module.exports = {
  plugins: [
    "stylelint-order",
    "stylelint-scss"
  ],
  extends: [
    "stylelint-config-standard-scss"
  ],
  rules: {
    // Rules explanations can be found": https"://stylelint.io/user-guide/rules/list
    // Disable rule/s for the entire file": /* stylelint-disable selector-no-id, declaration-no-important */
    //                                     id {
    //                                       color": pink !important;
    //                                     }
    //                                     /* stylelint-enable selector-no-id, declaration-no-important */
    // Disable a rule for a "single" line": /* stylelint-disable-line declaration-no-important */

    // Order of elements
    "order/order": [
      {
        "type": "at-rule",
        "name": "extend",
      },
      {
        "type": "at-rule",
        "name": "mixin",
      },
      "declarations",
      "rules",
    ],
		"order/properties-alphabetical-order": true,

    // Line spacing
    "declaration-block-single-line-max-declarations": 1,
    "selector-list-comma-newline-after": "always",

    // Disallows
    "color-no-hex": true,
    "color-named": "never",
    "at-rule-disallowed-list": ["debug", "warn"],
    "declaration-block-no-duplicate-properties": [
      true,
      { ignore: ["consecutive-duplicates-with-different-values"]}, // Permits fallbacks
    ],
    "block-no-empty": true,
    "selector-max-id": 0,
    "declaration-no-important": true,
    "color-no-invalid-hex": true,
    "no-duplicate-selectors": true,
    "property-no-unknown": true,
    "declaration-property-value-disallowed-list": {"transition": ["all"], "/^border/": ["none"]},
    "selector-no-qualifying-type": true,

    // Stylistic/Whitespace
    "string-quotes": "single",
    "selector-attribute-quotes": "always",
    "indentation": 2,
    "no-eol-whitespace": true,
    "number-no-trailing-zeros": true,
    "number-leading-zero": "never",
    "scss/at-import-partial-extension": "never",
    "scss/at-import-no-partial-leading-underscore": true,
    "shorthand-property-no-redundant-values": true,
    "length-zero-no-unit": true,
    "comment-no-empty": null,
    "scss/comment-no-empty": null,

    // Name Formats
    "scss/at-function-pattern": "^[-_a-z]+$",
    "scss/at-mixin-pattern": "^[-_a-z]+$",
    "scss/percent-placeholder-pattern": "^[-_a-z]+$",
    "selector-class-pattern": "^[-._a-z0-9]+$",
    "scss/dollar-variable-pattern": "^[-_a-z0-9]+$",
    "property-no-vendor-prefix": null,

    // Brace Style (matches 1tbs style)
    "block-opening-brace-newline-after": "always-multi-line",
    "block-opening-brace-space-after": "always-single-line",
    "block-closing-brace-newline-after": "always-single-line",
    "block-closing-brace-newline-before": "always-multi-line",
    "block-closing-brace-space-before": "always-single-line",

    // Inner Spacing
    "value-list-comma-space-after": "always-single-line",
    "function-comma-space-after": "always-single-line",
    "selector-list-comma-space-after": "always-single-line",
    "media-query-list-comma-space-after": "always",
    "declaration-colon-space-before": "never",
    "media-feature-colon-space-before": "never",
    "declaration-colon-space-after": "always",
    "media-feature-colon-space-after": "always",
    "block-opening-brace-space-before": "always",
    "declaration-bang-space-before": "always",
    "declaration-bang-space-after": "never",
    "selector-pseudo-class-parentheses-space-inside": "never",
    "media-feature-parentheses-space-inside": "never",
    "function-calc-no-unspaced-operator": true,
    "media-feature-range-operator-space-after": "always",
    "media-feature-range-operator-space-before": "always",
    "scss/operator-no-unspaced": true,
    "scss/operator-no-newline-before": null,

    // Final Items
    "declaration-block-trailing-semicolon": "always",
    "no-missing-end-of-source-newline": true,
    "no-descending-specificity": null,
    "selector-pseudo-class-no-unknown": [true, {
      "ignorePseudoClasses": ["input-placeholder"],
    }],
    "selector-pseudo-element-no-unknown": [true, {
      "ignorePseudoElements": ["input-placeholder"],
    }],
    "alpha-value-notation": null,
    "number-max-precision": null,

    // Temporary
    "scss/no-global-function-names": null,
    "selector-pseudo-element-colon-notation": null,
    "color-hex-case": null,
    "max-line-length": null,
    "value-keyword-case": null,
    "color-function-notation": null,
    "scss/at-mixin-argumentless-call-parentheses": null,
    "scss/double-slash-comment-whitespace-inside": null,
    "scss/at-if-closing-brace-newline-after": null,
    "scss/function-unquote-no-unquoted-strings-inside": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "selector-no-vendor-prefix": null,
  }
}
