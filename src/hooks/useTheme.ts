import { useCallback, useEffect, useState } from 'react';
import type { ThemeMode } from '../config/site';

export function useTheme() {
  const [theme, setMode] = useState<ThemeMode>(() => {
    try { const saved = localStorage.getItem('personal-os-theme'); return saved === 'light' || saved === 'dark' ? saved : 'system'; }
    catch { return 'system'; }
  });
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const value = theme === 'system' ? media.matches ? 'dark' : 'light' : theme;
      document.documentElement.dataset.theme = value;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#090c10' : '#f2f5f9');
      setResolved(value);
    };
    apply(); media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
  const setTheme = useCallback((value: ThemeMode) => {
    setMode(value);
    try { localStorage.setItem('personal-os-theme', value); } catch { /* Session-only preference. */ }
  }, []);
  return { theme, resolved, setTheme };
}
