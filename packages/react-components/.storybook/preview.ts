import type { Preview } from '@storybook/react-vite';

// import design system styles
import '../src/styles/main.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true, // Table of contents
    },
  },
  tags: ['autodocs'], // Enable auto-generated docs
};

export default preview;
