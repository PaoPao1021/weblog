import { useState, useEffect, useCallback } from 'react';

export type WallpaperTheme = 'aurora' | 'sunset' | 'forest' | 'void';

export const WALLPAPER_OPTIONS: { id: WallpaperTheme; en: string; zh: string; color: string }[] = [
  { id: 'aurora', en: 'Aurora Glass', zh: '极光琉璃', color: '#38bdf8' },
  { id: 'sunset', en: 'Sunset Ember', zh: '落日暖霞', color: '#f97316' },
  { id: 'forest', en: 'Misty Forest', zh: '幽林晨露', color: '#10b981' },
  { id: 'void', en: 'Cosmic Void', zh: '深空虚境', color: '#8b5cf6' },
];

export function useWallpaper() {
  const [wallpaper, setWallpaperState] = useState<WallpaperTheme>(() => {
    try {
      const saved = localStorage.getItem('personal-os-wallpaper') as WallpaperTheme;
      if (saved && WALLPAPER_OPTIONS.some((w) => w.id === saved)) return saved;
    } catch {
      /* storage unavailable */
    }
    return 'aurora';
  });

  const setWallpaper = useCallback((theme: WallpaperTheme) => {
    setWallpaperState(theme);
    try {
      localStorage.setItem('personal-os-wallpaper', theme);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-wallpaper', wallpaper);
  }, [wallpaper]);

  return { wallpaper, setWallpaper };
}
