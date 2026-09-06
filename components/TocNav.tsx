'use client';

import { useEffect, useState } from 'react';
import { ListTree } from 'lucide-react';
import type { TocItem } from '@/lib/toc';

export function TocNav({ items, label }: { items: TocItem[]; label: string }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-90px 0px -62% 0px' },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="toc-nav" aria-label={label}>
      <span><ListTree size={11} strokeWidth={2.4} aria-hidden="true" /> {label}</span>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'is-sub' : undefined}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? 'is-active' : undefined}
              aria-current={activeId === item.id ? 'location' : undefined}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
