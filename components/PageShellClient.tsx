'use client';

import { useEffect, useState } from 'react';
import { SearchDialog } from './SearchDialog';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { dictionaries, type Language } from '@/lib/i18n';
import type { SearchItem } from '@/lib/content';

type Props = {
  language: Language;
  current: 'home' | 'posts' | 'notes' | 'about';
  languageHref?: string;
  searchItems: SearchItem[];
  children: React.ReactNode;
};

export function PageShellClient({ language, current, languageHref, searchItems, children }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const c = dictionaries[language];

  useEffect(() => {
    const saved = window.localStorage.getItem('blog-theme');
    const next = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    const frame = window.requestAnimationFrame(() => setTheme(next));
    return () => window.cancelAnimationFrame(frame);
  }, [language]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('blog-theme', next);
  };

  return <div className={`site-shell lang-${language}`}>
    <a className="skip-link" href="#main-content">{c.skip}</a>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <SiteHeader c={c} language={language} menuOpen={menuOpen} theme={theme} current={current} languageHref={languageHref} onMenu={() => setMenuOpen((value) => !value)} onSearch={() => setSearchOpen(true)} onTheme={toggleTheme} onNavigate={() => setMenuOpen(false)} />
    <main id="main-content">{children}</main>
    <SiteFooter c={c} />
    {searchOpen && <SearchDialog c={c} language={language} items={searchItems} onClose={() => setSearchOpen(false)} />}
  </div>;
}
