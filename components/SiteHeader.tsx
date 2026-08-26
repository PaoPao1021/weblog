import Link from 'next/link';
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
  current?: 'home' | 'posts' | 'notes' | 'about';
  languageHref?: string;
};

export function SiteHeader({ c, language, menuOpen, theme, onMenu, onSearch, onTheme, onNavigate, current = 'home', languageHref }: Props) {
  const nextLanguage = language === 'zh' ? 'en' : 'zh';
  const navItems = [
    { id: 'home', href: `/${language}` },
    { id: 'posts', href: `/${language}/posts` },
    { id: 'notes', href: `/${language}/notes` },
    { id: 'about', href: `/${language}/about` },
  ] as const;
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href={`/${language}`} aria-label={`${c.brand} home`}><span className="brand-mark">{c.mark}</span><span className="brand-copy"><strong>{c.brand}</strong><small>{c.tagline}</small></span></Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item, index) => <Link key={item.id} className={current === item.id ? 'is-active' : undefined} aria-current={current === item.id ? 'page' : undefined} href={item.href} onClick={onNavigate}>{c.nav[index]}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button search-button" type="button" onClick={onSearch} aria-label={c.searchAria}><span aria-hidden="true">⌕</span><small>{c.search}</small><kbd>⌘ K</kbd></button>
          <Link className="icon-button language-button" href={languageHref ?? `/${nextLanguage}`} hrefLang={nextLanguage} aria-label={c.languageAria} onClick={() => window.localStorage.setItem('blog-language', nextLanguage)}>{language === 'zh' ? 'EN' : '中'}</Link>
          <button className="icon-button" type="button" onClick={onTheme} aria-label={c.themeAria}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span></button>
          <button className="icon-button menu-button" type="button" onClick={onMenu} aria-label={c.menuAria} aria-expanded={menuOpen}><span aria-hidden="true">{menuOpen ? '×' : '☰'}</span></button>
        </div>
      </div>
    </header>
  );
}
