import { useLocale } from '../../i18n/context';
import { useCallback, useEffect, useId, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Clock,
  Headphones,
  Timer,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronDown,
  ChevronUp,
  Radio,
  Zap,
  Activity,
  CloudRain,
  Coffee,
  Disc3,
  Flame,
  StickyNote,
} from 'lucide-react';
import { synth } from '../../utils/audioSynth';
import '../../styles/widgets.css';

type WidgetTab = 'clock' | 'audio' | 'pomodoro' | 'quote' | 'scratchpad';
type SoundMode = 'rain' | 'whitenoise' | 'cosmic';

interface Quote {
  en: string;
  zh: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    en: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    zh: '简单，在于删减显而易见的杂质，留存真正有意义的本质。',
    author: 'John Maeda',
  },
  {
    en: 'Calm is not the absence of information. It is the presence of a clear next step.',
    zh: '沉静并非信息的缺失，而是清晰可见的下一步。',
    author: 'PaoPao1021',
  },
  {
    en: 'Tools that respect your attention leave room for your own thinking.',
    zh: '尊重注意力的工具，会为使用者自身的思考留白。',
    author: 'Digital Garden Note',
  },
  {
    en: 'Make it work, make it right, make it fast, make it beautiful.',
    zh: '先让它运转，再让它正确，接着让它迅速，最终让它优雅。',
    author: 'Kent Beck',
  },
  {
    en: 'The details are not the details. They make the design.',
    zh: '细节绝非细枝末节，它们构成了设计的本身。',
    author: 'Charles Eames',
  },
];

const STATUS_OPTIONS = [
  { key: 'Deep Coding', zh: '沉浸编码', icon: Zap, color: '#38bdf8' },
  { key: 'Exploring Ideas', zh: '灵感探索', icon: Sparkles, color: '#a855f7' },
  { key: 'Coffee Break', zh: '咖啡休憩', icon: Coffee, color: '#f59e0b' },
  { key: 'In The Flow', zh: '心流状态', icon: Activity, color: '#10b981' },
];

export default function DesktopWidget({ compact }: { compact?: boolean }) {
  const { t, locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const [tab, setTab] = useState<WidgetTab>('clock');
  const [collapsed, setCollapsed] = useState(false);
  const volumeSliderId = useId();

  // Clock state
  const [now, setNow] = useState(() => new Date());
  const [uptimeSeconds, setUptimeSeconds] = useState(138);
  const [statusIdx, setStatusIdx] = useState(0);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundMode, setSoundMode] = useState<SoundMode>('rain');
  const [volume, setVolume] = useState(0.35);

  // Pomodoro state
  const [pomoDuration, setPomoDuration] = useState(25 * 60);
  const [pomoRemaining, setPomoRemaining] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);

  // Quote state
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Scratchpad state
  const [scratchpadText, setScratchpadText] = useState(() => {
    try {
      return localStorage.getItem('personal-os-scratchpad') || '';
    } catch {
      return '';
    }
  });

  const handleScratchpadChange = (val: string) => {
    setScratchpadText(val);
    try {
      localStorage.setItem('personal-os-scratchpad', val);
    } catch {
      /* storage unavailable */
    }
  };

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      setUptimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro ticker
  useEffect(() => {
    if (!isPomoRunning) return;
    const interval = setInterval(() => {
      setPomoRemaining((prev) => {
        if (prev <= 1) {
          setIsPomoRunning(false);
          synth.playChime();
          return pomoDuration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoDuration]);

  // Audio play/pause handler
  const togglePlay = useCallback(() => {
    synth.playTick();
    if (isPlaying) {
      synth.stopAmbient();
      setIsPlaying(false);
    } else {
      synth.playAmbient(soundMode, volume);
      setIsPlaying(true);
    }
  }, [isPlaying, soundMode, volume]);

  const changeSoundMode = useCallback(
    (mode: SoundMode) => {
      synth.playTick();
      setSoundMode(mode);
      if (isPlaying) {
        synth.playAmbient(mode, volume);
      }
    },
    [isPlaying, volume]
  );

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    synth.setVolume(v);
  }, []);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      synth.stopAmbient();
    };
  }, []);

  // Format time
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Format date
  const dateStr =
    locale === 'zh'
      ? now.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
      : now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

  // Format uptime
  const upHours = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
  const upMins = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
  const upSecs = String(uptimeSeconds % 60).padStart(2, '0');

  // Format pomodoro
  const pomoMins = String(Math.floor(pomoRemaining / 60)).padStart(2, '0');
  const pomoSecs = String(pomoRemaining % 60).padStart(2, '0');
  const pomoProgress = (pomoDuration - pomoRemaining) / pomoDuration;

  const currentStatus = STATUS_OPTIONS[statusIdx];
  const StatusIcon = currentStatus.icon;

  const nextStatus = () => {
    synth.playTick();
    setStatusIdx((prev) => (prev + 1) % STATUS_OPTIONS.length);
  };

  const nextQuote = () => {
    synth.playTick();
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
  };

  const selectPomoDuration = (mins: number) => {
    synth.playTick();
    const secs = mins * 60;
    setPomoDuration(secs);
    setPomoRemaining(secs);
    setIsPomoRunning(false);
  };

  return (
    <aside
      className={`desktop-widget-container ${collapsed ? 'is-collapsed' : ''} ${compact ? 'is-compact' : ''}`}
      aria-label={t('Desktop widget')}
    >
      <div className="desktop-widget glass-panel">
        {/* Dynamic Island Header */}
        <header className="widget-header">
          <div className="widget-header-left">
            <button
              className="widget-status-indicator"
              onClick={nextStatus}
              title={t('Click to cycle status')}
              aria-label={`${t('Status')}: ${locale === 'zh' ? currentStatus.zh : currentStatus.key}`}
            >
              <span className="widget-pulse-dot" style={{ backgroundColor: currentStatus.color }} />
              <span className="widget-status-name">
                {locale === 'zh' ? currentStatus.zh : currentStatus.key}
              </span>
            </button>
            <span className="widget-mini-clock" aria-hidden="true">
              {hours}:{minutes}
            </span>
          </div>

          <div className="widget-nav">
            <button
              className={`widget-tab-btn ${tab === 'clock' ? 'active' : ''}`}
              onClick={() => {
                synth.playTick();
                setTab('clock');
                if (collapsed) setCollapsed(false);
              }}
              title={t('Live Clock & Telemetry')}
              aria-label={t('Live Clock')}
              aria-pressed={tab === 'clock'}
            >
              <Clock size={14} />
            </button>

            <button
              className={`widget-tab-btn ${tab === 'audio' ? 'active' : ''}`}
              onClick={() => {
                synth.playTick();
                setTab('audio');
                if (collapsed) setCollapsed(false);
              }}
              title={t('Lo-Fi Ambient Player')}
              aria-label={t('Lo-Fi Player')}
              aria-pressed={tab === 'audio'}
            >
              <Headphones size={14} />
              {isPlaying && <span className="tab-playing-badge" />}
            </button>

            <button
              className={`widget-tab-btn ${tab === 'pomodoro' ? 'active' : ''}`}
              onClick={() => {
                synth.playTick();
                setTab('pomodoro');
                if (collapsed) setCollapsed(false);
              }}
              title={t('Focus Pomodoro Timer')}
              aria-label={t('Focus Timer')}
              aria-pressed={tab === 'pomodoro'}
            >
              <Timer size={14} />
              {isPomoRunning && <span className="tab-playing-badge" />}
            </button>

            <button
              className={`widget-tab-btn ${tab === 'quote' ? 'active' : ''}`}
              onClick={() => {
                synth.playTick();
                setTab('quote');
                if (collapsed) setCollapsed(false);
              }}
              title={t('Inspiration Spark')}
              aria-label={t('Daily Spark')}
              aria-pressed={tab === 'quote'}
            >
              <Sparkles size={14} />
            </button>

            <button
              className={`widget-tab-btn ${tab === 'scratchpad' ? 'active' : ''}`}
              onClick={() => {
                synth.playTick();
                setTab('scratchpad');
                if (collapsed) setCollapsed(false);
              }}
              title={t('Quick Scratchpad')}
              aria-label={t('Quick Scratchpad')}
              aria-pressed={tab === 'scratchpad'}
            >
              <StickyNote size={14} />
            </button>

            <button
              className="widget-collapse-toggle"
              onClick={() => {
                synth.playTick();
                setCollapsed(!collapsed);
              }}
              title={collapsed ? t('Expand widget') : t('Collapse widget')}
              aria-label={collapsed ? t('Expand widget') : t('Collapse widget')}
            >
              {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </header>

        {/* Expandable Content Area */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              className="widget-body"
              initial={reducedMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Tab 1: Clock & System Telemetry */}
              {tab === 'clock' && (
                <div className="widget-pane widget-clock-pane">
                  <div className="clock-date-row">
                    <span className="clock-date-text">{dateStr}</span>
                    <span className="clock-timezone">UTC+8</span>
                  </div>

                  <div className="clock-digital-display">
                    <span className="clock-digits">{hours}</span>
                    <span className="clock-colon">:</span>
                    <span className="clock-digits">{minutes}</span>
                    <span className="clock-seconds">
                      <span className="seconds-val">{seconds}</span>
                      <span
                        className="seconds-ring"
                        style={{ '--sec-pct': `${(Number(seconds) / 60) * 100}%` } as React.CSSProperties}
                      />
                    </span>
                  </div>

                  <div className="telemetry-grid">
                    <div className="telemetry-item" title={t('Session uptime')}>
                      <Radio size={12} className="telemetry-icon" />
                      <div className="telemetry-meta">
                        <span className="telemetry-label">{t('Uptime')}</span>
                        <span className="telemetry-value font-mono">
                          {upHours}:{upMins}:{upSecs}
                        </span>
                      </div>
                    </div>

                    <div className="telemetry-item" title={t('Battery status')}>
                      <Zap size={12} className="telemetry-icon" />
                      <div className="telemetry-meta">
                        <span className="telemetry-label">{t('Energy')}</span>
                        <span className="telemetry-value">100% ⚡</span>
                      </div>
                    </div>

                    <div className="telemetry-item full-width" onClick={nextStatus} style={{ cursor: 'pointer' }}>
                      <StatusIcon size={12} className="telemetry-icon" style={{ color: currentStatus.color }} />
                      <div className="telemetry-meta">
                        <span className="telemetry-label">{t('Vibe / Status')}</span>
                        <span className="telemetry-value">
                          {locale === 'zh' ? currentStatus.zh : currentStatus.key}
                          <span className="telemetry-hint"> · {t('Switch')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Lo-Fi Ambient Player */}
              {tab === 'audio' && (
                <div className="widget-pane widget-audio-pane">
                  <div className="vinyl-turntable-container">
                    <div className={`vinyl-disc ${isPlaying ? 'is-spinning' : ''}`}>
                      <div className="vinyl-groove groove-1" />
                      <div className="vinyl-groove groove-2" />
                      <div className="vinyl-groove groove-3" />
                      <div className="vinyl-center-label">
                        <Disc3 size={16} className="vinyl-symbol" />
                      </div>
                    </div>

                    {/* Animated Tonearm */}
                    <div className={`tonearm ${isPlaying ? 'is-playing' : ''}`}>
                      <div className="tonearm-base" />
                      <div className="tonearm-pole" />
                      <div className="tonearm-head" />
                    </div>

                    {/* Frequency Equalizer Visualizer */}
                    <div className={`eq-visualizer ${isPlaying ? 'is-active' : ''}`} aria-hidden="true">
                      <span className="eq-bar bar-1" />
                      <span className="eq-bar bar-2" />
                      <span className="eq-bar bar-3" />
                      <span className="eq-bar bar-4" />
                      <span className="eq-bar bar-5" />
                    </div>
                  </div>

                  {/* Sound Type Selector */}
                  <div className="sound-mode-selector">
                    <button
                      className={`sound-pill ${soundMode === 'rain' ? 'active' : ''}`}
                      onClick={() => changeSoundMode('rain')}
                      aria-label={t('Rainfall')}
                      aria-pressed={soundMode === 'rain'}
                    >
                      <CloudRain size={12} />
                      <span>{t('Rainfall')}</span>
                    </button>
                    <button
                      className={`sound-pill ${soundMode === 'whitenoise' ? 'active' : ''}`}
                      onClick={() => changeSoundMode('whitenoise')}
                      aria-label={t('Warm Noise')}
                      aria-pressed={soundMode === 'whitenoise'}
                    >
                      <Flame size={12} />
                      <span>{t('Warm Noise')}</span>
                    </button>
                    <button
                      className={`sound-pill ${soundMode === 'cosmic' ? 'active' : ''}`}
                      onClick={() => changeSoundMode('cosmic')}
                      aria-label={t('Cosmic')}
                      aria-pressed={soundMode === 'cosmic'}
                    >
                      <Sparkles size={12} />
                      <span>{t('Cosmic')}</span>
                    </button>
                  </div>

                  {/* Audio Controls */}
                  <div className="audio-controls-row">
                    <motion.button
                      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                      className={`audio-play-btn ${isPlaying ? 'playing' : ''}`}
                      onClick={togglePlay}
                      aria-label={isPlaying ? t('Pause') : t('Play')}
                    >
                      {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                    </motion.button>

                    <div className="volume-control-wrap">
                      <label htmlFor={volumeSliderId} className="sr-only">
                        {t('Volume')}
                      </label>
                      <Volume2 size={13} className="volume-icon" />
                      <input
                        id={volumeSliderId}
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="volume-slider"
                        aria-label={t('Volume')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Pomodoro Focus Timer */}
              {tab === 'pomodoro' && (
                <div className="widget-pane widget-pomo-pane">
                  <div className="pomo-dial-wrap">
                    <svg className="pomo-svg" viewBox="0 0 120 120">
                      <circle className="pomo-bg-ring" cx="60" cy="60" r="50" />
                      <circle
                        className="pomo-fg-ring"
                        cx="60"
                        cy="60"
                        r="50"
                        style={{
                          strokeDasharray: 314.159,
                          strokeDashoffset: 314.159 * (1 - pomoProgress),
                        }}
                      />
                    </svg>

                    <div className="pomo-time-overlay">
                      <span className="pomo-digits">
                        {pomoMins}:{pomoSecs}
                      </span>
                      <span className="pomo-status-sub">
                        {isPomoRunning ? t('Focusing') : t('Paused')}
                      </span>
                    </div>
                  </div>

                  <div className="pomo-presets">
                    <button
                      className={`pomo-preset-btn ${pomoDuration === 25 * 60 ? 'active' : ''}`}
                      onClick={() => selectPomoDuration(25)}
                    >
                      25m
                    </button>
                    <button
                      className={`pomo-preset-btn ${pomoDuration === 15 * 60 ? 'active' : ''}`}
                      onClick={() => selectPomoDuration(15)}
                    >
                      15m
                    </button>
                    <button
                      className={`pomo-preset-btn ${pomoDuration === 5 * 60 ? 'active' : ''}`}
                      onClick={() => selectPomoDuration(5)}
                    >
                      5m
                    </button>
                  </div>

                  <div className="pomo-actions">
                    <motion.button
                      whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                      className={`pomo-primary-btn ${isPomoRunning ? 'running' : ''}`}
                      onClick={() => {
                        synth.playTick();
                        setIsPomoRunning(!isPomoRunning);
                      }}
                    >
                      {isPomoRunning ? <Pause size={14} /> : <Play size={14} />}
                      <span>{isPomoRunning ? t('Pause') : t('Start')}</span>
                    </motion.button>

                    <button
                      className="pomo-reset-btn"
                      onClick={() => {
                        synth.playTick();
                        setIsPomoRunning(false);
                        setPomoRemaining(pomoDuration);
                      }}
                      title={t('Reset')}
                      aria-label={t('Reset')}
                    >
                      <RotateCcw size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Daily Inspiration Spark */}
              {tab === 'quote' && (
                <div className="widget-pane widget-quote-pane">
                  <motion.div
                    key={quoteIdx}
                    initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="quote-card"
                  >
                    <p className="quote-text">
                      “{locale === 'zh' ? QUOTES[quoteIdx].zh : QUOTES[quoteIdx].en}”
                    </p>
                    <footer className="quote-author">
                      <span className="quote-dash">—</span> {QUOTES[quoteIdx].author}
                    </footer>
                  </motion.div>

                  <div className="quote-actions">
                    <button className="quote-next-btn" onClick={nextQuote}>
                      <Sparkles size={13} />
                      <span>{t('Next Spark')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 5: Quick Scratchpad */}
              {tab === 'scratchpad' && (
                <div className="widget-pane widget-scratchpad-pane">
                  <div className="scratchpad-header">
                    <span className="scratchpad-title">{t('Quick Scratchpad')}</span>
                    <span className="scratchpad-badge font-mono">
                      {scratchpadText.length} {t('chars')}
                    </span>
                  </div>
                  <textarea
                    className="scratchpad-textarea"
                    placeholder={t('Jot down a quick thought, task, or link…')}
                    value={scratchpadText}
                    onChange={(e) => handleScratchpadChange(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
