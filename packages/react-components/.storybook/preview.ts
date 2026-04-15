import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { namespaceStoryArgs } from './namespaceStoryArgs';

import participantThemeCss from './themes/participant.scss?inline';
import researchThemeCss from './themes/research.scss?inline';

const OFH_STORYBOOK_THEME_STYLE_ID = 'ofh-storybook-theme';
const OFH_THEME_STYLES = {
  participant: participantThemeCss,
  research: researchThemeCss,
} as const;

type OFHTheme = keyof typeof OFH_THEME_STYLES;

function ensureThemeStylesheet(theme: OFHTheme) {
  const existingElement = document.getElementById(
    OFH_STORYBOOK_THEME_STYLE_ID,
  );
  const styleElement =
    existingElement instanceof HTMLStyleElement
      ? existingElement
      : document.createElement('style');

  styleElement.id = OFH_STORYBOOK_THEME_STYLE_ID;
  styleElement.textContent = OFH_THEME_STYLES[theme];

  if (!existingElement) {
    document.head.appendChild(styleElement);
  }
}

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

function StorybookThemeDecorator({
  Story,
  context,
}: {
  Story: Parameters<NonNullable<Preview['decorators']>[number]>[0];
  context: Parameters<NonNullable<Preview['decorators']>[number]>[1];
}) {
  const theme: OFHTheme =
    context.globals.ofhTheme === 'research' ? 'research' : 'participant';

  React.useLayoutEffect(() => {
    ensureThemeStylesheet(theme);
  }, [theme]);

  if (context.viewMode !== 'docs') {
    return Story();
  }

  return React.createElement(DocsNamespacedStory, { Story, context });
}

const preview: Preview = {
  globalTypes: {
    ofhTheme: {
      name: 'OFH theme',
      description: 'Switch between participant and research theme styles',
      defaultValue: 'participant',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'participant', title: 'Participant' },
          { value: 'research', title: 'Research' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      return React.createElement(StorybookThemeDecorator, { Story, context });
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
