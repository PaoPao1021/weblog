import { useLocale } from '../../../i18n/context';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Monitor, Moon, Sun, Radio } from 'lucide-react';
import { siteConfig, type ThemeMode } from '../../../config/site';
import { useWallpaper, WALLPAPER_OPTIONS } from '../../../hooks/useWallpaper';
import { synth } from '../../../utils/audioSynth';

export default function System({ theme, setTheme }: { theme: ThemeMode; setTheme: (value: ThemeMode) => void }) {
  const { t, locale, setLocale } = useLocale();
  const reducedMotion = useReducedMotion();
  const { wallpaper, setWallpaper } = useWallpaper();
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
    const onResize = () =>
      setScreenInfo({
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

  return (
    <div className="system-content">
      <div className="system-emblem">
        <Radio size={28} strokeWidth={1.3} />
      </div>
      <p className="eyebrow">{t('SYSTEM STATUS')}</p>
      <h2>{t('All systems, personal.')}</h2>
      <p className="system-intro">{t('A small space. An ongoing experiment.')}</p>
      <dl className="system-list">
        <div>
          <dt>{t('Local time')}</dt>
          <dd>{time.toLocaleTimeString(locale === 'zh' ? 'zh-CN' : 'en', { hour12: false })}</dd>
        </div>
        <div>
          <dt>{t('Network')}</dt>
          <dd>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className={`status-dot ${online ? '' : 'offline'}`} />
              {t(online ? 'Online' : 'Offline')}
            </span>
          </dd>
        </div>
        <div>
          <dt>{t('Display')}</dt>
          <dd>
            {screenInfo.viewport} · {screenInfo.dpr}x DPR
          </dd>
        </div>
        <div>
          <dt>{t('Color space')}</dt>
          <dd>{t(screenInfo.p3 ? 'Display P3 (Wide Color)' : 'sRGB Standard')}</dd>
        </div>
        <div>
          <dt>{t('Optics & Engine')}</dt>
          <dd>{t(reducedMotion ? 'Reduced Motion (Standard)' : 'Liquid Glass Active')}</dd>
        </div>
        <div>
          <dt>{t('Currently building')}</dt>
          <dd>{t(siteConfig.currently.building)}</dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd>
            {siteConfig.github ? (
              <a href={siteConfig.github} target="_blank" rel="noreferrer noopener">
                {t('Connected')} <ArrowUpRight size={12} />
              </a>
            ) : (
              t('Not configured')
            )}
            <small>{t('Demo status · no API connection')}</small>
          </dd>
        </div>
        <div>
          <dt>{t('Last updated')}</dt>
          <dd>{siteConfig.lastUpdated}</dd>
        </div>
        <div>
          <dt>{t('Version')}</dt>
          <dd>
            {t('Portfolio OS')} {siteConfig.version}
          </dd>
        </div>
      </dl>

      <div className="theme-control" aria-label={locale === 'zh' ? '界面语言' : 'Interface language'}>
        <button
          aria-pressed={locale === 'zh'}
          onClick={() => {
            synth.playTick();
            setLocale('zh');
          }}
        >
          中文
        </button>
        <button
          aria-pressed={locale === 'en'}
          onClick={() => {
            synth.playTick();
            setLocale('en');
          }}
        >
          English
        </button>
      </div>

      <div className="theme-control" aria-label={t('Color theme')}>
        {(
          [
            { id: 'light', Icon: Sun },
            { id: 'dark', Icon: Moon },
            { id: 'system', Icon: Monitor },
          ] as const
        ).map(({ id, Icon }) => (
          <button
            key={id}
            aria-pressed={theme === id}
            onClick={() => {
              synth.playTick();
              setTheme(id);
            }}
            style={{ position: 'relative' }}
          >
            {theme === id && (
              <motion.span
                layoutId={reducedMotion ? undefined : 'theme-pill'}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  background: 'var(--glass-reading)',
                  boxShadow: 'var(--glass-depth)',
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon size={14} />
              {t(id)}
            </span>
          </button>
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: 22 }}>
        {t('DESKTOP WALLPAPER')}
      </p>
      <div className="theme-control" aria-label={t('Desktop wallpaper')}>
        {WALLPAPER_OPTIONS.map((wp) => (
          <button
            key={wp.id}
            aria-pressed={wallpaper === wp.id}
            onClick={() => {
              synth.playTick();
              setWallpaper(wp.id);
            }}
            style={{ position: 'relative' }}
          >
            {wallpaper === wp.id && (
              <motion.span
                layoutId={reducedMotion ? undefined : 'wallpaper-pill'}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 999,
                  background: 'var(--glass-reading)',
                  boxShadow: 'var(--glass-depth)',
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: wp.color,
                  boxShadow: `0 0 4px ${wp.color}`,
                }}
              />
              {locale === 'zh' ? wp.zh : wp.en}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
