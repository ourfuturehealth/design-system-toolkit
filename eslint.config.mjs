// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import globals from 'globals';

/**
 * Root ESLint configuration for the design-system-toolkit monorepo
 * 
 * This configuration provides shared JavaScript/TypeScript linting rules
 * across all packages. Individual packages can extend or override these
 * rules in their own eslint.config files.
 * 
 * Packages should import and extend this config:
 * ```js
 * import rootConfig from '../../eslint.config.mjs';
 * export default [...rootConfig, { your overrides }];
 * ```
 */
export default [{
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/storybook-static/**',
    '**/*.config.js', // Build config files often need different rules
    '**/build/**',
    '**/.turbo/**',
  ],
}, js.configs.recommended, {
  files: ['**/*.js', '**/*.mjs'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2021,
    },
  },
  rules: {
    // Possible Problems
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    
    // Best Practices
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'warn',
    
    // Stylistic (aligned with Prettier)
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2, { SwitchCase: 1 }],
  },
}, ...storybook.configs["flat/recommended"]];
