import rootConfig from '../../eslint.config.mjs';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';
import globals from 'globals';

/**
 * ESLint configuration for the react-components package
 * Extends the root monorepo configuration with React + TypeScript specific rules
 */
export default [
  ...rootConfig,
  { 
    ignores: [
      'dist', 
      'coverage', 
      'storybook-static',
      'src/dev.tsx', // Temporary dev playground - will be removed once Storybook is fully adopted
      '*.config.cjs', // CommonJS config files (stylelint)
    ] 
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
];
