import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LocaleContext } from './context';
import { initialLocale, translate, type Locale } from './locale';
import { siteConfig } from '../config/site';
export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(() => {
    try { return initialLocale(localStorage, navigator.languages); } catch { return initialLocale(null, navigator.languages); }
  });
  const setLocale = useCallback((value: Locale) => {
    updateLocale(value);
    try { localStorage.setItem('personal-os-language', value); } catch { /* Session-only preference. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    document.title = `${siteConfig.name} — ${locale === 'zh' ? '个人空间' : 'Personal OS'}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(siteConfig.description, locale));
  }, [locale]);
  const value = useMemo(() => ({ locale, setLocale, t: (text: string) => translate(text, locale) }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
