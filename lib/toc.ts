export type TocItem = { id: string; title: string; level: 2 | 3 };

const normalize = (title: string) => title.replace(/[`*]/g, '').trim();

export function createHeadingIder() {
  const seen = new Map<string, number>();
  return (title: string) => {
    const base = normalize(title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return `sec-${count ? `${base}-${count + 1}` : base}`;
  };
}

// Mirrors MarkdownContent's sequential id assignment, with fenced code
// blocks removed first so "## " lines inside code samples are ignored.
export function extractToc(body: string): TocItem[] {
  const withoutFences = body.replaceAll('\r\n', '\n').replace(/```[\s\S]*?```/g, '');
  const ider = createHeadingIder();
  return [...withoutFences.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const title = normalize(match[2]);
    return { id: ider(title), title, level: match[1].length as 2 | 3 };
  });
}
