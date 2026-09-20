import { useLocale } from '../../i18n/context';
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Command, Keyboard } from 'lucide-react';
import { synth } from '../../utils/audioSynth';

interface KeyboardHelpProps {
  onClose: () => void;
}

export default function KeyboardHelp({ onClose }: KeyboardHelpProps) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shortcuts = [
    { key: ['⌘', 'K'], desc: t('Open command palette') },
    { key: ['Esc'], desc: t('Close active window or modal') },
    { key: ['Tab'], desc: t('Navigate between accessible controls') },
    { key: ['←', '→', '↑', '↓'], desc: t('Move active window (when titlebar focused)') },
    { key: ['Shift', '←', '→'], desc: t('Move window in larger increments') },
    { key: ['?'], desc: t('Toggle this shortcuts cheat sheet') },
  ];

  return (
    <div
      className="command-overlay"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t('Keyboard shortcuts')}
        className="keyboard-help-panel glass-panel"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="keyboard-help-header">
          <div className="keyboard-help-title">
            <Keyboard size={16} className="text-accent" />
            <span>{t('Keyboard shortcuts')}</span>
          </div>
          <button
            ref={closeBtnRef}
            className="keyboard-help-close"
            onClick={() => {
              synth.playTick();
              onClose();
            }}
            aria-label={t('Close')}
          >
            <X size={14} />
          </button>
        </header>

        <div className="keyboard-help-content">
          <ul className="shortcuts-list">
            {shortcuts.map((item, idx) => (
              <li key={idx} className="shortcut-row">
                <span className="shortcut-desc">{item.desc}</span>
                <div className="shortcut-keys">
                  {item.key.map((k, kidx) => (
                    <kbd key={kidx} className="shortcut-kbd">
                      {k === '⌘' ? <Command size={10} /> : k}
                    </kbd>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
