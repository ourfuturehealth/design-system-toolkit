function getStoryNamespace(storyId: string) {
  return storyId.replace(/[^a-z0-9-]+/gi, '-');
}

export function namespaceStoryArgs(
  args: Record<string, unknown>,
  storyId: string,
  argKeys: string[],
) {
  if (argKeys.length === 0) {
    return args;
  }

  const namespace = getStoryNamespace(storyId);
  const namespacedArgKeys = new Set(argKeys);

  return Object.fromEntries(
    Object.entries(args).map(([key, value]) => {
      if (!namespacedArgKeys.has(key) || typeof value !== 'string') {
        return [key, value];
      }

      return [key, `${value}--${namespace}`];
    }),
  );
}
