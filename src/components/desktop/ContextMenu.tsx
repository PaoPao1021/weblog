import { useLocale } from '../../i18n/context';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  Terminal as TerminalIcon,
  SunMoon,
  Headphones,
  Languages,
  User,
} from 'lucide-react';
import type { Navigate } from '../../app/types';
import type { ThemeMode } from '../../config/site';
import { synth } from '../../utils/audioSynth';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  navigate: Navigate;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  openPalette: () => void;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  navigate,
  theme,
  setTheme,
  openPalette,
}: ContextMenuProps) {
  const { t, locale, setLocale } = useLocale();
  const reducedMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-clamp to screen bounds
  const clampedX = Math.min(Math.max(10, x), window.innerWidth - 220);
  const clampedY = Math.min(Math.max(10, y), window.innerHeight - 260);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleResize = () => onClose();

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [onClose]);

  const handleAction = (fn: () => void) => {
    synth.playTick();
    fn();
    onClose();
  };

  const nextTheme: ThemeMode = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';

  return (
    <motion.div
      ref={menuRef}
      role="menu"
      aria-label={t('Desktop context menu')}
      className="desktop-context-menu glass-panel"
      style={{ left: clampedX, top: clampedY }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="menu-group">
        <button
          className="context-menu-item"
          role="menuitem"
          onClick={() => handleAction(openPalette)}
        >
          <Search size={14} />
          <span>{t('Explore')}</span>
          <kbd className="menu-shortcut">⌘K</kbd>
        </button>

        <button
          className="context-menu-item"
          role="menuitem"
          onClick={() => handleAction(() => navigate('terminal'))}
        >
          <TerminalIcon size={14} />
          <span>{t('Terminal')}</span>
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button
          className="context-menu-item"
          role="menuitem"
          onClick={() => handleAction(() => setTheme(nextTheme))}
        >
          <SunMoon size={14} />
          <span>
            {t('Theme')}: {t(theme)}
          </span>
        </button>

        <button
          className="context-menu-item"
          role="menuitem"
          onClick={() => handleAction(() => setLocale(locale === 'en' ? 'zh' : 'en'))}
        >
          <Languages size={14} />
          <span>{locale === 'en' ? '切换为中文' : 'Switch to English'}</span>
        </button>

        <button
          className="context-menu-item"
          role="menuitem"
          onClick={() =>
            handleAction(() => {
              const status = synth.getStatus();
              if (status.isPlaying) {
                synth.stopAmbient();
              } else {
                synth.playAmbient('rain', 0.35);
              }
            })
          }
        >
          <Headphones size={14} />
          <span>{t('Lo-Fi Ambient Player')}</span>
        </button>
      </div>

      <div className="menu-divider" />

      <div className="menu-group">
        <button
          className="context-menu-item"
          role="menuitem"
          onClick={() => handleAction(() => navigate('about'))}
        >
          <User size={14} />
          <span>{t('About')}</span>
        </button>
      </div>
    </motion.div>
  );
}
