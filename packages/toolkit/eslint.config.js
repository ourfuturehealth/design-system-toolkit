import rootConfig from '../../eslint.config.js';

/**
 * ESLint configuration for the toolkit package
 * Extends the root monorepo configuration with toolkit-specific overrides
 */
export default [
  ...rootConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
];
