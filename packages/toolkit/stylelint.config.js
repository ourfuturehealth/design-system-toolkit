/**
 * Stylelint configuration for the toolkit package
 * Extends the root monorepo configuration
 * 
 * Ignored globs are specified in .stylelintignore file
 * 
 * To disable a rule for an entire file:
 * stylelint-disable selector-no-id, declaration-no-important
 * 
 * To disable a rule for a single line:
 * stylelint-disable-line declaration-no-important
 */
module.exports = {
  extends: '../../stylelint.config.cjs',
  rules: {
    // Package-specific overrides can be added here if needed
    // See https://stylelint.io/user-guide/rules/list for all available rules
  },
};
