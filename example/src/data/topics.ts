export const trendingTopics = [
  'navigation 3',
  'jetpack compose',
  'fabric',
  'deep links',
  'bottom tabs',
  'back handling',
];

/** Fake search results derived from a query, so every search looks different. */
export function resultsFor(query: string) {
  const kinds = ['Guide', 'API', 'Example', 'Discussion', 'Changelog'];
  return kinds.map((kind, index) => ({
    id: `${query}-${index}`,
    kind,
    title: `${capitalize(query)} ${kind.toLowerCase()}`,
    summary: `Everything about “${query}” in a ${kind.toLowerCase()} you can skim in ${index + 2} minutes.`,
  }));
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
