export function searchScore(text: string, query: string): number {
  const target = text.toLowerCase(); const term = query.trim().toLowerCase();
  if (!term) return 1;
  if (target === term) return 100;
  if (target.startsWith(term)) return 80;
  if (target.includes(term)) return 60;
  let index = 0;
  for (const char of target) if (char === term[index]) index++;
  return index === term.length ? 20 : 0;
}
