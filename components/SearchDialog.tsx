'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CornerDownLeft, Search } from 'lucide-react';
import type { SearchItem } from '@/lib/content';
import type { Dictionary, Language } from '@/lib/i18n';

type Props = { c: Dictionary; language: Language; items: SearchItem[]; onClose: () => void };

export function SearchDialog({ c, language, items, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevNormalized, setPrevNormalized] = useState('');
  const dialogRef = useRef<HTMLElement>(null);
  const normalized = query.trim().toLocaleLowerCase();
  const results = useMemo(
    () => normalized ? items.filter((item) => item.searchText.includes(normalized)).slice(0, 6) : [],
    [items, normalized],
  );

  if (prevNormalized !== normalized) {
    setPrevNormalized(normalized);
    setActiveIndex(0);
  }

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const input = dialogRef.current?.querySelector('input');
    input?.focus();
    return () => previous?.focus?.();
  }, []);

  const openResult = (index: number) => {
    const link = dialogRef.current?.querySelector<HTMLAnchorElement>(`a[data-result-index="${index}"]`);
    link?.click();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      openResult(activeIndex);
    } else if (event.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button:not([tabindex="-1"])');
      if (!focusable || focusable.length < 2) return;
      event.preventDefault();
      const list = [...focusable];
      const current = list.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (current - 1 + list.length) % list.length : (current + 1) % list.length;
      list[next].focus();
    }
  };

  return <div className="search-overlay" role="presentation" onMouseDown={onClose}>
    <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" ref={dialogRef} onKeyDown={onKeyDown} onMouseDown={(event) => event.stopPropagation()}>
      <div className="search-input-wrap">
        <Search size={20} strokeWidth={2.2} aria-hidden="true" />
        <label className="sr-only" htmlFor="site-search" id="search-title">{c.searchAria}</label>
        <input
          id="site-search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={c.searchPlaceholder}
          role="combobox"
          aria-expanded={normalized ? 'true' : 'false'}
          aria-controls="search-results"
          aria-activedescendant={results.length ? `search-option-${activeIndex}` : undefined}
        />
        <button type="button" onClick={onClose} aria-label={language === 'zh' ? '关闭搜索' : 'Close search'}>ESC</button>
      </div>
      {!normalized && <div className="search-suggestions"><span>{c.suggested}</span>{c.suggestions.map((item) => <button type="button" key={item} onClick={() => setQuery(item)}>{item}</button>)}</div>}
      {normalized && <div className="search-results" aria-live="polite">
        <div id="search-results" role="listbox" aria-label={c.searchAria}>
          {results.map((item, index) => (
            <Link
              key={item.slug}
              id={`search-option-${index}`}
              data-result-index={index}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'is-active' : undefined}
              href={`/${language}/posts/${item.slug}`}
              onClick={onClose}
              onMouseMove={() => setActiveIndex(index)}
            >
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <CornerDownLeft className="search-go" size={13} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          ))}
        </div>
        {!results.length && <p>{language === 'zh' ? '没有找到匹配的记录。' : 'No matching records found.'}</p>}
      </div>}
      {!normalized && <p>{language === 'zh' ? '可搜索标题、摘要、主题和正文。↑↓ 选择，Enter 打开。' : 'Search titles, summaries, topics, and text. ↑↓ to pick, Enter to open.'}</p>}
    </section>
  </div>;
}
