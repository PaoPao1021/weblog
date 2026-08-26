'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { SearchItem } from '@/lib/content';
import type { Dictionary, Language } from '@/lib/i18n';

type Props = { c: Dictionary; language: Language; items: SearchItem[]; onClose: () => void };

export function SearchDialog({ c, language, items, onClose }: Props) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const results = useMemo(
    () => normalized ? items.filter((item) => item.searchText.includes(normalized)).slice(0, 6) : [],
    [items, normalized],
  );

  return <div className="search-overlay" role="presentation" onMouseDown={onClose}>
    <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="search-input-wrap"><span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="site-search" id="search-title">{c.searchAria}</label><input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.searchPlaceholder} /><button type="button" onClick={onClose} aria-label={language === 'zh' ? '关闭搜索' : 'Close search'}>ESC</button></div>
      {!normalized && <div className="search-suggestions"><span>{c.suggested}</span>{c.suggestions.map((item) => <button type="button" key={item} onClick={() => setQuery(item)}>{item}</button>)}</div>}
      {normalized && <div className="search-results" aria-live="polite">
        {results.map((item) => <Link key={item.slug} href={`/${language}/posts/${item.slug}`} onClick={onClose}><strong>{item.title}</strong><span>{item.description}</span></Link>)}
        {!results.length && <p>{language === 'zh' ? '没有找到匹配的文章。' : 'No matching stories found.'}</p>}
      </div>}
      {!normalized && <p>{language === 'zh' ? '可搜索标题、摘要、标签和正文。' : 'Search titles, summaries, tags, and article text.'}</p>}
    </section>
  </div>;
}
