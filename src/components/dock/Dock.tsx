import { motion, useReducedMotion } from 'framer-motion';
import { House } from 'lucide-react';
import { apps } from '../../app/appRegistry';
import type { AppId, Navigate } from '../../app/types';
import type { DesktopState } from '../../app/windowState';

export default function Dock({ state, navigate }: { state: DesktopState; navigate: Navigate }) {
  const reducedMotion = useReducedMotion();
  const selected = <motion.span className="dock-selection" layoutId={reducedMotion ? undefined : 'dock-selection'} transition={{ type: 'spring', stiffness: 460, damping: 38 }} />;
  const ids: AppId[] = ['projects', 'notes', 'about', 'terminal'];
  return <nav className="dock glass-panel" aria-label="Application dock">
    <motion.button whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={{ scale: reducedMotion ? 1 : 0.96 }} className={`dock-item dock-home ${state.active === null ? 'active' : ''}`} aria-label="Home" aria-current={state.active === null ? 'page' : undefined} onClick={() => navigate(null)}>{state.active === null && selected}<span className="dock-icon"><House size={23} strokeWidth={1.65} /></span><span className="dock-label">Home</span><span className="dock-indicator" /></motion.button>
    <div className="dock-divider" />
    {ids.map(id => { const Icon = apps[id].icon; const opened = state.windows.some(w => w.app === id); return <motion.button key={id} whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={{ scale: reducedMotion ? 1 : 0.96 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className={`dock-item dock-${id} ${state.active === id ? 'active' : ''} ${opened ? 'opened' : ''}`} aria-label={apps[id].title} aria-current={state.active === id ? 'page' : undefined} onClick={() => navigate(id, state.windows.find(w => w.app === id)?.item)}>{state.active === id && selected}<span className="dock-icon"><Icon size={23} strokeWidth={1.65} /></span><span className="dock-label">{apps[id].title}</span><span className="dock-indicator" /></motion.button>; })}
  </nav>;
}
