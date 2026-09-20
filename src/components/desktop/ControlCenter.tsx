import { useLocale } from '../../i18n/context';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Battery,
  Bell,
  BellOff,
  Clock,
  Monitor,
  Moon,
  Music,
  SlidersHorizontal,
  Sun,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';
import { synth, type SoundType } from '../../utils/audioSynth';
import type { ThemeMode } from '../../config/site';
import type { WallpaperTheme } from '../../hooks/useWallpaper';
import { siteConfig } from '../../config/site';

interface ControlCenterProps {
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  wallpaper: WallpaperTheme;
  setWallpaper: (wp: WallpaperTheme) => void;
  returnFocus?: HTMLElement | null;
}

export default function ControlCenter({
  onClose,
  theme,
  setTheme,
  wallpaper,
  setWallpaper,
  returnFocus,
}: ControlCenterProps) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Sound FX State
  const [soundFx, setSoundFx] = useState(() => synth.isSoundFxEnabled());

  // Focus / DND Mode State
  const [dnd, setDnd] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('personal-os-dnd') === 'true' : false;
  });

  // Ambient Sound State
  const [ambient, setAmbient] = useState(() => {
    const status = synth.getStatus();
    return {
      isPlaying: status.isPlaying,
      type: status.type ?? ('rain' as SoundType),
      volume: synth.getVolume(),
    };
  });

  // Session Uptime
  const [uptime, setUptime] = useState('0m');

  useEffect(() => {
    const startTime = Date.now();
    const updateUptime = () => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(elapsedSec / 60);
      const secs = elapsedSec % 60;
      setUptime(mins > 0 ? `${mins}m ${secs}s` : `${secs}s`);
    };
    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for external sound changes
  useEffect(() => {
    const handleSoundFxChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail) setSoundFx(customEvent.detail.enabled);
    };

    const handleAmbientChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean; type: SoundType | null; volume: number }>;
      if (customEvent.detail) {
        setAmbient((prev) => ({
          isPlaying: customEvent.detail.isPlaying,
          type: customEvent.detail.type ?? prev.type,
          volume: customEvent.detail.volume,
        }));
      }
    };

    window.addEventListener('personal-os-sound-fx-change', handleSoundFxChange);
    window.addEventListener('personal-os-ambient-change', handleAmbientChange);
    return () => {
      window.removeEventListener('personal-os-sound-fx-change', handleSoundFxChange);
      window.removeEventListener('personal-os-ambient-change', handleAmbientChange);
    };
  }, []);

  // Focus trap & Escape listener
  useEffect(() => {
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      returnFocus?.focus();
    };
  }, [onClose, returnFocus]);

  const toggleSoundFx = useCallback(() => {
    const next = !soundFx;
    setSoundFx(next);
    synth.setSoundFxEnabled(next);
    if (next) synth.playTick();
  }, [soundFx]);

  const toggleDnd = useCallback(() => {
    const next = !dnd;
    setDnd(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('personal-os-dnd', String(next));
    }
    synth.playTick();
  }, [dnd]);

  const toggleAmbientPlay = useCallback(() => {
    synth.playTick();
    if (ambient.isPlaying) {
      synth.stopAmbient();
    } else {
      synth.playAmbient(ambient.type, ambient.volume);
    }
  }, [ambient]);

  const selectAmbientType = useCallback(
    (type: SoundType) => {
      synth.playTick();
      setAmbient((prev) => ({ ...prev, type }));
      if (ambient.isPlaying) {
        synth.playAmbient(type, ambient.volume);
      }
    },
    [ambient.isPlaying, ambient.volume]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseFloat(e.target.value);
      setAmbient((prev) => ({ ...prev, volume: vol }));
      synth.setVolume(vol);
    },
    []
  );

  const wallpapers: { id: WallpaperTheme; name: string; gradient: string }[] = [
    { id: 'aurora', name: t('Aurora Glass'), gradient: 'linear-gradient(135deg, #38bdf8, #818cf8)' },
    { id: 'sunset', name: t('Sunset Ember'), gradient: 'linear-gradient(135deg, #fb923c, #f43f5e)' },
    { id: 'forest', name: t('Misty Forest'), gradient: 'linear-gradient(135deg, #34d399, #6366f1)' },
    { id: 'void', name: t('Cosmic Void'), gradient: 'linear-gradient(135deg, #64748b, #18181b)' },
  ];

  return (
    <div
      className="command-overlay cc-overlay"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('Control Center')}
        className="control-center-panel glass-panel"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="cc-header">
          <div className="cc-title">
            <SlidersHorizontal size={16} className="text-accent" />
            <span>{t('Control Center')}</span>
          </div>
          <button
            ref={closeBtnRef}
            className="cc-close-btn"
            onClick={() => {
              synth.playTick();
              onClose();
            }}
            aria-label={t('Close Control Center')}
          >
            <X size={14} />
          </button>
        </div>

        <div className="cc-body">
          {/* Quick Toggles Row */}
          <div className="cc-grid-two">
            {/* Sound FX Toggle Card */}
            <button
              className={`cc-card cc-toggle-card ${soundFx ? 'is-active' : ''}`}
              onClick={toggleSoundFx}
              aria-pressed={soundFx}
              aria-label={t('Sound FX')}
            >
              <div className="cc-card-icon">
                {soundFx ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </div>
              <div className="cc-card-text">
                <span className="cc-card-label">{t('Sound FX')}</span>
                <span className="cc-card-sub">{soundFx ? t('On') : t('Muted')}</span>
              </div>
            </button>

            {/* Do Not Disturb Toggle Card */}
            <button
              className={`cc-card cc-toggle-card ${dnd ? 'is-active' : ''}`}
              onClick={toggleDnd}
              aria-pressed={dnd}
              aria-label={t('Do Not Disturb')}
            >
              <div className="cc-card-icon">
                {dnd ? <BellOff size={18} /> : <Bell size={18} />}
              </div>
              <div className="cc-card-text">
                <span className="cc-card-label">{t('Focus Mode')}</span>
                <span className="cc-card-sub">{dnd ? t('Silent') : t('Active')}</span>
              </div>
            </button>
          </div>

          {/* Theme Mode Segmented Pill */}
          <div className="cc-section">
            <div className="cc-section-header">
              <span>{t('Appearance')}</span>
              <span className="cc-section-status">{t(theme)}</span>
            </div>
            <div className="cc-segmented-control" role="radiogroup" aria-label={t('Theme')}>
              {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
                const isSelected = theme === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`cc-seg-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      synth.playTick();
                      setTheme(mode);
                    }}
                  >
                    <Icon size={14} />
                    <span>{t(mode)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallpaper Selection */}
          <div className="cc-section">
            <div className="cc-section-header">
              <span>{t('Desktop Wallpaper')}</span>
            </div>
            <div className="cc-wallpaper-grid">
              {wallpapers.map((wp) => {
                const isSelected = wallpaper === wp.id;
                return (
                  <button
                    key={wp.id}
                    className={`cc-wp-chip ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      synth.playTick();
                      setWallpaper(wp.id);
                    }}
                    aria-label={`${t('Wallpaper')}: ${wp.name}`}
                    aria-pressed={isSelected}
                  >
                    <span className="cc-wp-swatch" style={{ background: wp.gradient }} />
                    <span className="cc-wp-title">{wp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lo-Fi Ambient Sound Module */}
          <div className="cc-section cc-audio-section">
            <div className="cc-section-header">
              <div className="cc-audio-title-wrap">
                <Music size={14} className="text-accent" />
                <span>{t('Ambient Soundscape')}</span>
              </div>
              <button
                className={`cc-audio-play-pill ${ambient.isPlaying ? 'is-playing' : ''}`}
                onClick={toggleAmbientPlay}
                aria-label={ambient.isPlaying ? t('Pause') : t('Play')}
              >
                {ambient.isPlaying ? t('Playing') : t('Play')}
              </button>
            </div>

            <div className="cc-sound-presets">
              {(
                [
                  { id: 'rain', name: t('Rainfall') },
                  { id: 'whitenoise', name: t('Warm Noise') },
                  { id: 'cosmic', name: t('Cosmic') },
                ] as { id: SoundType; name: string }[]
              ).map((snd) => (
                <button
                  key={snd.id}
                  className={`cc-sound-pill ${ambient.type === snd.id ? 'is-selected' : ''}`}
                  onClick={() => selectAmbientType(snd.id)}
                >
                  {snd.name}
                </button>
              ))}
            </div>

            <div className="cc-slider-wrap">
              <Volume2 size={13} className="text-muted" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={ambient.volume}
                onChange={handleVolumeChange}
                className="cc-slider"
                aria-label={t('Volume')}
              />
              <span className="cc-slider-val">{Math.round(ambient.volume * 100)}%</span>
            </div>
          </div>

          {/* System Telemetry Bar */}
          <div className="cc-telemetry-footer">
            <div className="cc-telemetry-item">
              <Clock size={12} />
              <span>
                {t('Uptime')}: {uptime}
              </span>
            </div>
            <div className="cc-telemetry-divider" />
            <div className="cc-telemetry-item">
              <Battery size={12} />
              <span>100%</span>
            </div>
            <div className="cc-telemetry-divider" />
            <div className="cc-telemetry-item">
              <Sparkles size={12} />
              <span>v{siteConfig.version}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
