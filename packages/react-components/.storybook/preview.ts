import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { namespaceStoryArgs } from './namespaceStoryArgs';

// import design system styles
import '../src/styles/main.scss';

function DocsNamespacedStory({
  Story,
  context,
}: {
  Story: Parameters<NonNullable<Preview['decorators']>[number]>[0];
  context: Parameters<NonNullable<Preview['decorators']>[number]>[1];
}) {
  const renderInstanceId = React.useId().replace(/:/g, '');
  const argKeys = Array.isArray(context.parameters.docsNamespaceArgKeys)
    ? context.parameters.docsNamespaceArgKeys.filter(
        (key): key is string => typeof key === 'string',
      )
    : [];

  return Story({
    args: namespaceStoryArgs(
      context.args,
      `${context.id}-${renderInstanceId}`,
      argKeys,
    ),
  });
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      if (context.viewMode !== 'docs') {
        return Story();
      }

      return React.createElement(DocsNamespacedStory, { Story, context });
    },
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'en-US',
      },
    },
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
