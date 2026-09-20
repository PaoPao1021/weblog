import { lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Command, Search, Sparkles } from 'lucide-react';
import Background from '../components/desktop/Background';
import Hero from '../components/desktop/Hero';
import GlassWindow from '../components/desktop/GlassWindow';
import Dock from '../components/dock/Dock';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import System from '../components/windows/system/System';
import { useTheme } from '../hooks/useTheme';
import { useCompact } from '../hooks/useCompact';
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
  const [state, reduce] = useReducer(desktopReducer, initialDesktop);
  const [palette, setPalette] = useState(false);
  const { theme, setTheme } = useTheme();
  const compact = useCompact();
  const stateRef = useRef(state); stateRef.current = state;
  const triggers = useRef(new Map<AppId, HTMLElement>());
  const desktopRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const navigate: Navigate = useCallback((app, item) => {
    if (app && document.activeElement instanceof HTMLElement && !document.activeElement.closest('[role="dialog"]')) triggers.current.set(app, document.activeElement);
    const next = routeHash({ app, item });
    if (location.hash !== next) history.pushState(null, '', next);
    reduce(app ? { type: 'open', app, item } : { type: 'home' });
  }, []);
  useEffect(() => {
    const sync = () => { const route = parseRoute(location.hash); reduce(route.app ? { type: 'open', app: route.app, item: route.item } : { type: 'home' }); };
    sync(); window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  const dispatch = useCallback((action: DesktopAction) => {
    const next = desktopReducer(stateRef.current, action);
    reduce(action);
    if (action.type === 'close' || action.type === 'minimize' || action.type === 'focus') {
      const activeWindow = next.windows.find(w => w.app === next.active);
      history.replaceState(null, '', routeHash({ app: next.active, item: activeWindow?.item }));
      if (!next.active && action.type !== 'focus') requestAnimationFrame(() => triggers.current.get(action.app)?.focus());
    }
  }, []);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPalette(value => !value); }
      if (event.key === 'Escape' && !palette && stateRef.current.active) dispatch({ type: 'close', app: stateRef.current.active });
    };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, [dispatch, palette]);
  useEffect(() => {
    if (desktopRef.current) desktopRef.current.inert = palette || (compact && state.active !== null);
    if (dockRef.current) dockRef.current.inert = palette;
  }, [palette, compact, state.active]);
  return <MotionConfig reducedMotion="user"><div className={`personal-os ${compact ? 'compact' : ''}`}>
    <Background />
    <div ref={desktopRef} className="desktop-base">
      <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to main content</a>
      <header className="desktop-header"><button className="wordmark" aria-label={`${siteConfig.username} — Personal OS home`} onClick={() => navigate(null)}><span className="wordmark-symbol"><Sparkles size={17} strokeWidth={1.5} /></span><span>{siteConfig.username}<span className="wordmark-slash"> / </span><span className="wordmark-sub">personal space</span></span></button><div className="header-tools"><span className="header-note">A place for things that matter.</span><button className="search-trigger" onClick={() => setPalette(true)} aria-label="Explore — open command palette"><Search size={15} /><span>Explore</span><kbd><Command size={11} /> K</kbd></button></div></header>
      <Hero navigate={navigate} />
      <div className="desktop-bottom"><span className="desktop-coordinate">INDEPENDENT BY NATURE.<br /><span>CURIOUS BY DEFAULT.</span></span><button className="system-trigger" onClick={() => navigate('system')}><span className="status-dot" /> ONLINE <span className="system-trigger-divider">/</span><span>V{siteConfig.version}</span></button></div>
    </div>
    {compact && state.active && <div className="sheet-backdrop" />}
    <div className="window-layer" inert={palette || undefined}>
      <AnimatePresence>{state.windows.map((win, index) => <GlassWindow key={win.app} window={win} index={index} active={state.active === win.app} compact={compact} dispatch={dispatch} onClose={() => dispatch({ type: 'close', app: win.app })} onMinimize={() => dispatch({ type: 'minimize', app: win.app })}>
        <ErrorBoundary><Suspense fallback={<div className="loading-state"><span className="loading-dot" /> Opening your space…</div>}>
          {win.app === 'projects' && <Projects item={win.item} navigate={navigate} />}
          {win.app === 'notes' && <Notes item={win.item} navigate={navigate} />}
          {win.app === 'about' && <About navigate={navigate} />}
          {win.app === 'terminal' && <Terminal theme={theme} setTheme={setTheme} />}
          {win.app === 'system' && <System theme={theme} setTheme={setTheme} />}
        </Suspense></ErrorBoundary>
      </GlassWindow>)}</AnimatePresence>
    </div>
    <div ref={dockRef}><Dock state={state} navigate={navigate} /></div>
    <AnimatePresence>{palette && <Suspense fallback={null}><CommandPalette navigate={navigate} setTheme={setTheme} onClose={() => setPalette(false)} /></Suspense>}</AnimatePresence>
  </div></MotionConfig>;
}
