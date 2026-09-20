import { useLocale } from '../i18n/context';
import { lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Command, Monitor, Moon, Search, Sparkles, Sun } from 'lucide-react';
import Background from '../components/desktop/Background';
import Hero from '../components/desktop/Hero';
import DesktopWidget from '../components/desktop/DesktopWidget';
import ContextMenu from '../components/desktop/ContextMenu';
import KeyboardHelp from '../components/desktop/KeyboardHelp';
import GlassWindow from '../components/desktop/GlassWindow';
import Dock from '../components/dock/Dock';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import System from '../components/windows/system/System';
import { useTheme } from '../hooks/useTheme';
import { useCompact } from '../hooks/useCompact';
import { useWallpaper, type WallpaperTheme } from '../hooks/useWallpaper';
import { desktopReducer, initialDesktop, type DesktopAction } from './windowState';
import { parseRoute, routeHash } from './route';
import type { AppId, Navigate } from './types';
import { siteConfig } from '../config/site';
import '../styles/content.css';

const Projects = lazy(() => import('../components/windows/projects/Projects'));
const Notes = lazy(() => import('../components/windows/notes/Notes'));
const About = lazy(() => import('../components/windows/about/About'));
const Terminal = lazy(() => import('../components/terminal/Terminal'));
const CommandPalette = lazy(() => import('../components/command/CommandPalette'));

export default function App() {
  const { t, locale, setLocale } = useLocale();
  const [state, reduce] = useReducer(desktopReducer, initialDesktop);
  const [palette, setPalette] = useState(false);
  const [keyboardHelp, setKeyboardHelp] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const paletteTrigger = useRef<HTMLElement | null>(null);
  const openPalette = useCallback(() => {
    paletteTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPalette(true);
  }, []);
  const { theme, setTheme } = useTheme();
  const { wallpaper, setWallpaper } = useWallpaper();
  const ThemeIcon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;
  const nextTheme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  const compact = useCompact();
  const stateRef = useRef(state);
  stateRef.current = state;
  const triggers = useRef(new Map<AppId, HTMLElement>());
  const desktopRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const cycleWallpaper = useCallback(() => {
    const themes: WallpaperTheme[] = ['aurora', 'sunset', 'forest', 'void'];
    const nextIdx = (themes.indexOf(wallpaper) + 1) % themes.length;
    setWallpaper(themes[nextIdx]);
  }, [wallpaper, setWallpaper]);

  const navigate: Navigate = useCallback((app, item) => {
    if (app && document.activeElement instanceof HTMLElement && !document.activeElement.closest('[role="dialog"]'))
      triggers.current.set(app, document.activeElement);
    const next = routeHash({ app, item });
    if (location.hash !== next) history.pushState(null, '', next);
    reduce(app ? { type: 'open', app, item } : { type: 'home' });
  }, []);

  useEffect(() => {
    const sync = () => {
      const route = parseRoute(location.hash);
      reduce(route.app ? { type: 'open', app: route.app, item: route.item } : { type: 'home' });
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const dispatch = useCallback((action: DesktopAction) => {
    const next = desktopReducer(stateRef.current, action);
    reduce(action);
    if (action.type === 'close' || action.type === 'minimize' || action.type === 'focus') {
      const activeWindow = next.windows.find((w) => w.app === next.active);
      history.replaceState(null, '', routeHash({ app: next.active, item: activeWindow?.item }));
      if (!next.active && action.type !== 'focus') requestAnimationFrame(() => triggers.current.get(action.app)?.focus());
    }
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (palette) setPalette(false);
        else openPalette();
      }
      if (event.key === '?' && !palette && !keyboardHelp && !document.activeElement?.closest('input, textarea')) {
        event.preventDefault();
        setKeyboardHelp(true);
      }
      if (event.key === 'Escape') {
        if (keyboardHelp) setKeyboardHelp(false);
        else if (!palette && stateRef.current.active) dispatch({ type: 'close', app: stateRef.current.active });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, palette, keyboardHelp, openPalette]);

  useEffect(() => {
    if (desktopRef.current) desktopRef.current.inert = palette || keyboardHelp || (compact && state.active !== null);
    if (dockRef.current) dockRef.current.inert = palette || keyboardHelp;
  }, [palette, keyboardHelp, compact, state.active]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[role="dialog"]') && !target.closest('input, textarea, button, a')) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`personal-os ${compact ? 'compact' : ''}`}>
        <Background />
        <div ref={desktopRef} className="desktop-base" onContextMenu={handleContextMenu}>
          <a
            href="#main-content"
            className="skip-link"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById('main-content')?.focus();
            }}
          >
            {t('Skip to main content')}
          </a>
          <header className="desktop-header">
            <button className="wordmark" aria-label={`${siteConfig.username} — ${t('Home')}`} onClick={() => navigate(null)}>
              <span className="wordmark-symbol">
                <Sparkles size={17} strokeWidth={1.5} />
              </span>
              <span>
                {siteConfig.username}
                <span className="wordmark-slash"> / </span>
                <span className="wordmark-sub">{t('personal space')}</span>
              </span>
            </button>
            <div className="header-tools">
              <button
                className="language-toggle theme-toggle"
                onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                aria-label={locale === 'en' ? '切换为中文' : 'Switch to English'}
                title={locale === 'en' ? '切换为中文' : 'Switch to English'}
              >
                <span aria-hidden="true">{locale === 'en' ? '中' : 'EN'}</span>
              </button>
              <button
                className="theme-toggle"
                onClick={() => setTheme(nextTheme)}
                aria-label={locale === 'en' ? `Theme: ${theme}. Switch to ${nextTheme}` : `主题：${t(theme)}。切换为${t(nextTheme)}`}
                title={locale === 'en' ? `Theme: ${theme} · Switch to ${nextTheme}` : `主题：${t(theme)} · 切换为${t(nextTheme)}`}
              >
                <ThemeIcon size={17} strokeWidth={1.6} />
                <span className="theme-toggle-label">{t(theme)}</span>
              </button>
              <span className="header-note">{t('A place for things that matter.')}</span>
              <button className="search-trigger" onClick={openPalette} aria-label={t('Explore — open command palette')}>
                <Search size={15} />
                <span>{t('Explore')}</span>
                <kbd>
                  <Command size={11} /> K
                </kbd>
              </button>
            </div>
          </header>
          <Hero navigate={navigate} />
          <DesktopWidget compact={compact} />
          <div className="desktop-bottom">
            <span className="desktop-coordinate">
              {t('INDEPENDENT BY NATURE.')}
              <br />
              <span>{t('CURIOUS BY DEFAULT.')}</span>
            </span>
            <button className="system-trigger" onClick={() => navigate('system')}>
              <span className="status-dot" /> {t('ONLINE')} <span className="system-trigger-divider">/</span>
              <span>V{siteConfig.version}</span>
            </button>
          </div>
        </div>
        {compact && state.active && <div className="sheet-backdrop" />}
        <div className="window-layer" inert={palette || keyboardHelp || undefined}>
          <AnimatePresence>
            {state.windows.map((win, index) => (
              <GlassWindow
                key={win.app}
                window={win}
                index={index}
                active={state.active === win.app}
                compact={compact}
                dispatch={dispatch}
                onClose={() => dispatch({ type: 'close', app: win.app })}
                onMinimize={() => dispatch({ type: 'minimize', app: win.app })}
              >
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <div className="loading-state">
                        <span className="loading-dot" /> {t('Opening your space…')}
                      </div>
                    }
                  >
                    {win.app === 'projects' && <Projects item={win.item} navigate={navigate} />}
                    {win.app === 'notes' && <Notes item={win.item} navigate={navigate} />}
                    {win.app === 'about' && <About navigate={navigate} />}
                    {win.app === 'terminal' && <Terminal theme={theme} setTheme={setTheme} />}
                    {win.app === 'system' && <System theme={theme} setTheme={setTheme} />}
                  </Suspense>
                </ErrorBoundary>
              </GlassWindow>
            ))}
          </AnimatePresence>
        </div>
        <div ref={dockRef}>
          <Dock state={state} navigate={navigate} />
        </div>
        <AnimatePresence>
          {palette && (
            <Suspense fallback={null}>
              <CommandPalette
                navigate={navigate}
                setTheme={setTheme}
                returnFocus={paletteTrigger.current}
                onClose={() => setPalette(false)}
              />
            </Suspense>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu(null)}
              navigate={navigate}
              theme={theme}
              setTheme={setTheme}
              openPalette={openPalette}
              openHelp={() => setKeyboardHelp(true)}
              cycleWallpaper={cycleWallpaper}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {keyboardHelp && <KeyboardHelp onClose={() => setKeyboardHelp(false)} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
