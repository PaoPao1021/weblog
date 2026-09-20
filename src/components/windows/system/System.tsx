import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Monitor, Moon, Sun, Radio } from 'lucide-react';
import { siteConfig, type ThemeMode } from '../../../config/site';

export default function System({ theme, setTheme }: { theme: ThemeMode; setTheme: (value: ThemeMode) => void }) {
  const reducedMotion = useReducedMotion();
  const [time, setTime] = useState(new Date());
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [screenInfo, setScreenInfo] = useState({
    viewport: typeof window !== 'undefined' ? `${window.innerWidth} × ${window.innerHeight}` : '1440 × 900',
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    p3: typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(color-gamut: p3)').matches : false,
  });

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onResize = () => setScreenInfo({
      viewport: `${window.innerWidth} × ${window.innerHeight}`,
      dpr: window.devicePixelRatio || 1,
      p3: typeof window.matchMedia === 'function' ? window.matchMedia('(color-gamut: p3)').matches : false,
    });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('resize', onResize);
    return () => {
      clearInterval(id);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div className="system-content">
    <div className="system-emblem"><Radio size={28} strokeWidth={1.3} /></div>
    <p className="eyebrow">SYSTEM STATUS</p>
    <h2>All systems, personal.</h2>
    <p className="system-intro">A small space. An ongoing experiment.</p>
    <dl className="system-list">
      <div><dt>Local time</dt><dd>{time.toLocaleTimeString('en', { hour12: false })}</dd></div>
      <div><dt>Network</dt><dd><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className={`status-dot ${online ? '' : 'offline'}`} />{online ? 'Online' : 'Offline'}</span></dd></div>
      <div><dt>Display</dt><dd>{screenInfo.viewport} · {screenInfo.dpr}x DPR</dd></div>
      <div><dt>Color space</dt><dd>{screenInfo.p3 ? 'Display P3 (Wide Color)' : 'sRGB Standard'}</dd></div>
      <div><dt>Optics & Engine</dt><dd>{reducedMotion ? 'Reduced Motion (Standard)' : 'Liquid Glass Active'}</dd></div>
      <div><dt>Currently building</dt><dd>{siteConfig.currently.building}</dd></div>
      <div><dt>GitHub</dt><dd>{siteConfig.github ? <a href={siteConfig.github} target="_blank" rel="noreferrer noopener">Connected <ArrowUpRight size={12} /></a> : 'Connected'}<small>Demo status · no API connection</small></dd></div>
      <div><dt>Last updated</dt><dd>{siteConfig.lastUpdated}</dd></div>
      <div><dt>Version</dt><dd>Portfolio OS {siteConfig.version}</dd></div>
    </dl>
    <div className="theme-control" aria-label="Color theme">
      {([{ id: 'light', Icon: Sun }, { id: 'dark', Icon: Moon }, { id: 'system', Icon: Monitor }] as const).map(({ id, Icon }) => <button key={id} aria-pressed={theme === id} onClick={() => setTheme(id)} style={{ position: 'relative' }}>
        {theme === id && <motion.span layoutId={reducedMotion ? undefined : 'theme-pill'} transition={{ type: 'spring', stiffness: 420, damping: 32 }} style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--glass-reading)', boxShadow: 'var(--glass-depth)', zIndex: 0 }} />}
        <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon size={14} />{id}</span>
      </button>)}
    </div>
  </div>;
}
