export function mergeRelTokens(
  rel: string | undefined,
  openInNewWindow: boolean,
): string | undefined {
  if (!openInNewWindow) {
    return rel;
  }

  const relTokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  relTokens.add('noopener');
  relTokens.add('noreferrer');

  return Array.from(relTokens).join(' ');
}
