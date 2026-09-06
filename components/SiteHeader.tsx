'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Languages, Menu, Moon, Search, Sun, X } from 'lucide-react';
import type { Dictionary, Language } from '@/lib/i18n';

type Props = {
  c: Dictionary;
  language: Language;
  menuOpen: boolean;
  theme: 'light' | 'dark';
  onMenu: () => void;
  onSearch: () => void;
  onTheme: () => void;
  onNavigate: () => void;
  current?: 'home' | 'posts' | 'archive' | 'notes' | 'about';
  languageHref?: string;
};

export function SiteHeader({ c, language, menuOpen, theme, onMenu, onSearch, onTheme, onNavigate, current = 'home', languageHref }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const nextLanguage = language === 'zh' ? 'en' : 'zh';
  const navItems = [
    { id: 'home', href: `/${language}` },
    { id: 'posts', href: `/${language}/posts` },
    { id: 'archive', href: `/${language}/archive` },
    { id: 'notes', href: `/${language}/notes` },
    { id: 'about', href: `/${language}/about` },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link className="brand" href={`/${language}`} aria-label={`${c.brand} home`}>
          <span className="brand-mark">{c.mark}</span>
          <span className="brand-copy"><strong>{c.brand}</strong><small>{c.tagline}</small></span>
        </Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              className={current === item.id ? 'is-active' : undefined}
              aria-current={current === item.id ? 'page' : undefined}
              href={item.href}
              onClick={onNavigate}
            >
              {c.nav[index]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button search-button" type="button" onClick={onSearch} aria-label={c.searchAria}>
            <Search size={15} strokeWidth={2.2} aria-hidden="true" />
            <small>{c.search}</small>
            <kbd>⌘K</kbd>
          </button>
          <Link className="icon-button language-button" href={languageHref ?? `/${nextLanguage}`} hrefLang={nextLanguage} aria-label={c.languageAria} onClick={() => window.localStorage.setItem('blog-language', nextLanguage)}>
            <Languages size={15} strokeWidth={2.2} aria-hidden="true" />
            <span>{language === 'zh' ? 'EN' : '中'}</span>
          </Link>
          <button className="icon-button" type="button" onClick={onTheme} aria-label={c.themeAria}>
            {theme === 'light' ? <Moon size={15} strokeWidth={2.2} aria-hidden="true" /> : <Sun size={15} strokeWidth={2.2} aria-hidden="true" />}
          </button>
          <button className="icon-button menu-button" type="button" onClick={onMenu} aria-label={c.menuAria} aria-expanded={menuOpen}>
            {menuOpen ? <X size={17} strokeWidth={2.2} aria-hidden="true" /> : <Menu size={17} strokeWidth={2.2} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
