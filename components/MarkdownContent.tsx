import type { ReactNode } from 'react';

function renderInline(value: string): ReactNode[] {
  const parts = value.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} rel={link[2].startsWith('http') ? 'noreferrer' : undefined}>{link[1]}</a>;
    return part;
  });
}

export function MarkdownContent({ source }: { source: string }) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const blocks: ReactNode[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trimEnd();
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```([\w-]*)$/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) code.push(lines[index++]);
      index += 1;
      blocks.push(<pre key={blocks.length}><code className={fence[1] ? `language-${fence[1]}` : undefined}>{code.join('\n')}</code></pre>);
      continue;
    }

    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      const content = renderInline(heading[2]);
      const key = blocks.length;
      blocks.push(heading[1].length === 2 ? <h2 key={key}>{content}</h2> : <h3 key={key}>{content}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith('> ')) quote.push(lines[index++].slice(2));
      blocks.push(<blockquote key={blocks.length}><p>{renderInline(quote.join(' '))}</p></blockquote>);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) items.push(lines[index++].replace(/^[-*]\s+/, ''));
      blocks.push(<ul key={blocks.length}>{items.map((item) => <li key={item}>{renderInline(item)}</li>)}</ul>);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{2,4})\s+|^```|^>\s+|^[-*]\s+/.test(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={blocks.length}>{renderInline(paragraph.join(' '))}</p>);
  }

  return <>{blocks}</>;
}
