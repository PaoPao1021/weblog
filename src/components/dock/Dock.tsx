import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { apps } from '../../app/appRegistry';
import type { AppId, Navigate } from '../../app/types';
import type { DesktopState } from '../../app/windowState';
import { useDesktopMotion } from '../../hooks/useDesktopMotion';
import { AnimatedIcon } from '../ui/AnimatedIcon';

type DockApp = 'home' | Exclude<AppId, 'system'>;
interface DockItemProps { id: DockApp; active: boolean; opened: boolean; enabled: boolean; mouseX: MotionValue<number>; onOpen: () => void }

function DockItem({ id, active, opened, enabled, mouseX, onOpen }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const influence = useTransform(mouseX, value => {
    if (!enabled || !Number.isFinite(value) || !ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0, 1 - Math.abs(value - rect.left - rect.width / 2) / 105) ** 2;
  });
  const scale = useSpring(useTransform(influence, value => 1 + value * 0.14), { stiffness: 440, damping: 32, mass: 0.3 });
  const y = useSpring(useTransform(influence, value => -value * 4), { stiffness: 440, damping: 32, mass: 0.3 });
  const title = id === 'home' ? 'Home' : apps[id].title;
  return <motion.button ref={ref}
    className={`dock-item dock-${id} ${active ? 'active' : ''} ${opened ? 'opened' : ''}`}
    style={{ scale: enabled ? scale : 1, y: enabled ? y : 0 }}
    whileTap={enabled ? { scale: 0.94, y: 0 } : undefined}
    transition={{ type: 'spring', stiffness: 480, damping: 32 }}
    aria-label={title} aria-current={active ? 'page' : undefined} onClick={onOpen}
  >
    {active && <motion.span className="dock-selection" layoutId={enabled ? 'dock-selection' : undefined} transition={{ type: 'spring', stiffness: 460, damping: 38 }} />}
    <span className="dock-icon"><AnimatedIcon name={id} size={23} strokeWidth={1.65} /></span>
    <span className="dock-label">{title}</span>
    <span className="dock-indicator" />
  </motion.button>;
}

export default function Dock({ state, navigate }: { state: DesktopState; navigate: Navigate }) {
  const enabled = useDesktopMotion();
  const mouseX = useMotionValue(Infinity);
  const ids: Exclude<AppId, 'system'>[] = ['projects', 'notes', 'about', 'terminal'];
  return <nav className="dock glass-panel" aria-label="Application dock"
    onPointerMove={event => { if (enabled && event.pointerType === 'mouse') mouseX.set(event.clientX); }}
    onPointerLeave={() => mouseX.set(Infinity)}>
    <DockItem id="home" active={state.active === null} opened={false} enabled={enabled} mouseX={mouseX} onOpen={() => navigate(null)} />
    <div className="dock-divider" />
    {ids.map(id => <DockItem key={id} id={id} active={state.active === id} opened={state.windows.some(win => win.app === id)} enabled={enabled} mouseX={mouseX} onOpen={() => navigate(id, state.windows.find(win => win.app === id)?.item)} />)}
  </nav>;
}
