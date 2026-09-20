import { useLocale } from '../../i18n/context';
import { useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { House } from 'lucide-react';
import { apps } from '../../app/appRegistry';
import type { AppId, Navigate } from '../../app/types';
import type { DesktopState } from '../../app/windowState';
import { synth } from '../../utils/audioSynth';

function DockButton({
  id,
  title,
  Icon,
  isActive,
  isOpened,
  isBouncing,
  onClick,
  mouseX,
  reducedMotion,
  selected,
}: {
  id?: AppId;
  title: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  isActive: boolean;
  isOpened?: boolean;
  isBouncing?: boolean;
  onClick: () => void;
  mouseX: MotionValue<number>;
  reducedMotion: boolean | null;
  selected: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - (bounds.x + bounds.width / 2);
  });

  const scaleSync = useTransform(distance, [-100, 0, 100], [1, 1.2, 1]);
  const ySync = useTransform(distance, [-100, 0, 100], [0, -5, 0]);

  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 240, damping: 16 });
  const y = useSpring(ySync, { mass: 0.1, stiffness: 240, damping: 16 });

  return (
    <motion.button
      ref={ref}
      style={reducedMotion ? undefined : { scale, y }}
      animate={isBouncing && !reducedMotion ? { y: [0, -12, 0, -6, 0] } : undefined}
      transition={isBouncing ? { duration: 0.6, ease: 'easeInOut' } : undefined}
      whileTap={{ scale: reducedMotion ? 1 : 0.94 }}
      className={`dock-item ${id ? `dock-${id}` : 'dock-home'} ${isActive ? 'active' : ''} ${isOpened ? 'opened' : ''}`}
      aria-label={title}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      {isActive && selected}
      <span className="dock-icon">
        <Icon size={23} strokeWidth={1.65} />
      </span>
      <span className="dock-label">{title}</span>
      <span className="dock-indicator" />
    </motion.button>
  );
}

export default function Dock({ state, navigate }: { state: DesktopState; navigate: Navigate }) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(Infinity);
  const [bouncingApp, setBouncingApp] = useState<AppId | null>(null);

  const selected = (
    <motion.span
      className="dock-selection"
      layoutId={reducedMotion ? undefined : 'dock-selection'}
      transition={{ type: 'spring', stiffness: 460, damping: 38 }}
    />
  );
  const ids: AppId[] = ['projects', 'notes', 'about', 'terminal'];

  const handleAppClick = (id: AppId) => {
    synth.playTick();
    const isOpened = state.windows.some((w) => w.app === id);
    if (!isOpened) {
      setBouncingApp(id);
      setTimeout(() => setBouncingApp(null), 700);
    }
    navigate(id, state.windows.find((w) => w.app === id)?.item);
  };

  const handleHomeClick = () => {
    synth.playTick();
    navigate(null);
  };

  return (
    <nav
      className="dock glass-panel"
      aria-label={t('Application dock')}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <DockButton
        title={t('Home')}
        Icon={House}
        isActive={state.active === null}
        onClick={handleHomeClick}
        mouseX={mouseX}
        reducedMotion={reducedMotion}
        selected={selected}
      />
      <div className="dock-divider" />
      {ids.map((id) => {
        const Icon = apps[id].icon;
        const opened = state.windows.some((w) => w.app === id);
        return (
          <DockButton
            key={id}
            id={id}
            title={t(apps[id].title)}
            Icon={Icon}
            isActive={state.active === id}
            isOpened={opened}
            isBouncing={bouncingApp === id}
            onClick={() => handleAppClick(id)}
            mouseX={mouseX}
            reducedMotion={reducedMotion}
            selected={selected}
          />
        );
      })}
    </nav>
  );
}
