import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    // Ensure SCSS is handled properly
    if (!config.css) {
      config.css = {};
    }
    if (!config.css.preprocessorOptions) {
      config.css.preprocessorOptions = {};
    }
    config.css.preprocessorOptions.scss = {
      charset: false,
      quietDeps: true, // Suppress deprecation warnings from dependencies
      silenceDeprecations: ['import', 'if-function'], // Silence specific deprecations
    };
    return config;
  },
};
export default config;
