import { useLocale } from '../../i18n/context';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useDragControls, useMotionValue, useReducedMotion } from 'framer-motion';
import { Maximize2, Minus, Minimize2, X } from 'lucide-react';
import { apps } from '../../app/appRegistry';
import { clampPosition, windowSizes, type DesktopAction, type WindowState } from '../../app/windowState';

interface Props {
  window: WindowState;
  active: boolean;
  compact: boolean;
  index: number;
  dispatch: (action: DesktopAction) => void;
  onClose: () => void;
  onMinimize: () => void;
  children: ReactNode;
}

export default function GlassWindow({
  window: win,
  active,
  compact,
  index,
  dispatch,
  onClose,
  onMinimize,
  children,
}: Props) {
  const { t } = useLocale();
  const controls = useDragControls();
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(win.position.x);
  const y = useMotionValue(win.position.y);
  const ref = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: innerWidth, height: innerHeight });
  const size = windowSizes[win.app];
  const width = compact ? viewport.width : win.expanded ? viewport.width - 48 : Math.min(size.width, viewport.width - 64);
  const height = compact ? viewport.height - 82 : win.expanded ? viewport.height - 164 : Math.min(size.height, viewport.height - 164);
  const data = apps[win.app];
  const Icon = data.icon;

  useEffect(() => {
    const sync = () => setViewport({ width: innerWidth, height: innerHeight });
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  useEffect(() => {
    const next = clampPosition(win.position, width, height, viewport);
    x.set(win.expanded || compact ? 0 : next.x);
    y.set(win.expanded || compact ? -22 : next.y);
  }, [win.position, win.expanded, width, height, viewport, compact, x, y]);

  useEffect(() => {
    if (active && !win.minimized && !ref.current?.contains(document.activeElement)) {
      ref.current?.focus({ preventScroll: true });
    }
  }, [active, win.minimized]);

  useEffect(() => {
    ref.current?.querySelector('.window-content')?.scrollTo({ top: 0 });
  }, [win.item]);

  const hidden = win.minimized || (compact && !active);

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-labelledby={`${win.app}-window-title`}
      tabIndex={-1}
      className={`glass-window ${active ? 'is-active' : ''} ${compact ? 'is-sheet' : ''}`}
      style={{
        width,
        height,
        x: compact ? 0 : x,
        y: compact ? 0 : y,
        zIndex: 30 + index,
        display: hidden ? 'none' : undefined,
      }}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      drag={!compact && !win.expanded}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      onDragEnd={() =>
        dispatch({
          type: 'move',
          app: win.app,
          position: clampPosition({ x: x.get(), y: y.get() }, width, height, viewport),
        })
      }
      onPointerDownCapture={() => {
        if (!active) dispatch({ type: 'focus', app: win.app });
      }}
      onFocusCapture={() => {
        if (!active) dispatch({ type: 'focus', app: win.app });
      }}
    >
      <header
        className="window-titlebar"
        onPointerDown={(event) => {
          if (!compact && !win.expanded && !(event.target as HTMLElement).closest('button')) {
            controls.start(event);
          }
        }}
      >
        <div className="window-controls">
          <button className="window-control close" aria-label={`Close ${t(data.title)}`} onClick={onClose}>
            <X size={10} />
          </button>
          {!compact && (
            <>
              <button className="window-control minimize" aria-label={`Minimize ${t(data.title)}`} onClick={onMinimize}>
                <Minus size={10} />
              </button>
              <button
                className="window-control expand"
                aria-label={`${win.expanded ? 'Restore' : 'Expand'} ${t(data.title)}`}
                onClick={() => dispatch({ type: 'expand', app: win.app })}
              >
                {win.expanded ? <Minimize2 size={9} /> : <Maximize2 size={9} />}
              </button>
            </>
          )}
        </div>
        <div
          className="window-title"
          id={`${win.app}-window-title`}
          tabIndex={compact ? undefined : 0}
          title={t('Use arrow keys to move this window')}
          onKeyDown={(event) => {
            if (compact || win.expanded || !event.key.startsWith('Arrow')) return;
            event.preventDefault();
            const step = event.shiftKey ? 40 : 25;
            dispatch({
              type: 'move',
              app: win.app,
              position: clampPosition(
                {
                  x: x.get() + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0),
                  y: y.get() + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0),
                },
                width,
                height,
                viewport
              ),
            });
          }}
        >
          <Icon size={14} />
          <span>{t(data.title)}</span>
        </div>
        <span className="window-caption">{t(data.subtitle)}</span>
      </header>
      <div className="window-content">{children}</div>
      <footer className="window-footer">
        <span>
          <span className="status-dot" />{' '}
          {t(
            win.app === 'projects'
              ? 'Made with curiosity'
              : win.app === 'notes'
              ? 'Ideas, growing slowly'
              : 'A personal space'
          )}
        </span>
        <span>
          {t('PERSONAL OS /')} {data.shortcut}
        </span>
      </footer>
    </motion.section>
  );
}
