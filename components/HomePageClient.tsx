'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArticleList } from './ArticleList';
import { Hero } from './Hero';
import { SearchDialog } from './SearchDialog';
import { Sidebar } from './Sidebar';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { dictionaries, type CategoryId, type Language } from '@/lib/i18n';
import type { Post } from '@/lib/posts';
import type { SearchItem } from '@/lib/content';

export function HomePageClient({ language, posts, searchItems }: { language: Language; posts: Post[]; searchItems: SearchItem[] }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<CategoryId>('all');
  const c = dictionaries[language];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('blog-theme');
    const nextTheme = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    window.localStorage.setItem('blog-language', language);
    const frame = window.requestAnimationFrame(() => setTheme(nextTheme));
    return () => window.cancelAnimationFrame(frame);
  }, [language]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const filteredPosts = useMemo(() => category === 'all' ? posts : posts.filter((post) => post.category === category), [category, posts]);
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('blog-theme', next);
  };

  return <div className={`site-shell lang-${language}`}>
    <a className="skip-link" href="#main-content">{c.skip}</a><div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <SiteHeader c={c} language={language} menuOpen={menuOpen} theme={theme} onMenu={() => setMenuOpen((value) => !value)} onSearch={() => setSearchOpen(true)} onTheme={toggleTheme} onNavigate={() => setMenuOpen(false)} />
    <main id="main-content"><div id="top" /><Hero c={c} /><section className="content-section section-frame" id="articles" aria-labelledby="articles-title"><ArticleList c={c} language={language} category={category} posts={filteredPosts} onCategory={setCategory} /><Sidebar c={c} /></section></main>
    <SiteFooter c={c} />{searchOpen && <SearchDialog c={c} language={language} items={searchItems} onClose={() => setSearchOpen(false)} />}
  </div>;
}
