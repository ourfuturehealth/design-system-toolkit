const namespacedArgKeys = new Set(['id', 'idPrefix', 'name', 'namePrefix']);

function getStoryNamespace(storyId: string) {
  return storyId.replace(/[^a-z0-9-]+/gi, '-');
}

export function namespaceStoryArgs(
  args: Record<string, unknown>,
  storyId: string,
) {
  const namespace = getStoryNamespace(storyId);

  return Object.fromEntries(
    Object.entries(args).map(([key, value]) => {
      if (!namespacedArgKeys.has(key) || typeof value !== 'string') {
        return [key, value];
      }

      return [key, `${value}--${namespace}`];
    }),
  );
}
