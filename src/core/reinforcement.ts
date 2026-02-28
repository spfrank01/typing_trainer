export function createRepetitionDrill(
  mistakeCountByKey: Record<string, number>,
  maxKeys = 3,
  repeats = 3
): string[] {
  const weakKeys = Object.entries(mistakeCountByKey)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeys)
    .map(([key]) => key);

  if (weakKeys.length === 0) {
    return [];
  }

  const drill: string[] = [];
  weakKeys.forEach((key) => {
    for (let i = 0; i < repeats; i += 1) {
      drill.push(key);
    }
  });

  return drill;
}
