import { useLocale } from '../../i18n/context';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Asterisk } from 'lucide-react';
import { siteConfig } from '../../config/site';
import type { Navigate } from '../../app/types';
import { greeting } from '../../utils/greeting';
import { assetUrl } from '../../utils/assets';
import { AnimatedIcon } from '../ui/AnimatedIcon';
import { MotionButton } from '../ui/MotionButton';

export default function Hero({ navigate }: { navigate: Navigate }) {
  const { t } = useLocale();
  const [linkStatus, setLinkStatus] = useState('');
  const reducedMotion = useReducedMotion();
  const [hello, setHello] = useState(() => greeting(new Date().getHours()));
  useEffect(() => {
    const sync = () => setHello(greeting(new Date().getHours()));
    const timer = window.setInterval(sync, 60_000);
    document.addEventListener('visibilitychange', sync);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <main id="main-content" className="hero" tabIndex={-1}>
    <motion.div className="hero-inner" initial={reducedMotion ? false : { y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <p className="greeting">{t(hello)}</p>
      <h1>{t(siteConfig.hero.title).replace('{name}', siteConfig.name)}</h1>
      <p className="hero-description">{siteConfig.hero.subtitle.map((line, i) => <span key={t(line)}>{t(line)}{i !== siteConfig.hero.subtitle.length - 1 && <br />}</span>)}</p>
      <div className="hero-apps" aria-label={t("Explore my space")}>
        <MotionButton className="hero-app primary" onClick={() => navigate('projects')}><AnimatedIcon name="code" size={19} /><span>{t("Projects")}</span><ArrowUpRight size={16} /></MotionButton>
        <MotionButton className="hero-app" onClick={() => navigate('notes')}><AnimatedIcon name="document" size={18} /><span>{t("Notes")}</span><ArrowUpRight size={16} /></MotionButton>
        <MotionButton className="hero-app" onClick={() => navigate('about')}><AnimatedIcon name="about" size={18} /><span>{t("About")}</span><ArrowUpRight size={16} /></MotionButton>
      </div>
      <div className="hero-links">
        {siteConfig.github ? <a href={siteConfig.github} target="_blank" rel="noreferrer noopener"><AnimatedIcon name="github" size={14} />GitHub<ArrowUpRight size={12} /></a> : <button onClick={() => navigate('about')}><AnimatedIcon name="github" size={14} />GitHub<ArrowUpRight size={12} /></button>}
        {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}><AnimatedIcon name="mail" size={14} />{t("Email")}<ArrowUpRight size={12} /></a> : <button onClick={() => setLinkStatus("Email address isn’t available yet.")}><AnimatedIcon name="mail" size={14} />{t("Email")}<ArrowUpRight size={12} /></button>}
        {siteConfig.resume ? <a href={assetUrl(siteConfig.resume)} target="_blank" rel="noreferrer noopener"><AnimatedIcon name="document" size={14} />{t("Resume")}<ArrowUpRight size={12} /></a> : <button onClick={() => setLinkStatus("Resume isn’t available yet.")}><AnimatedIcon name="document" size={14} />{t("Resume")}<ArrowUpRight size={12} /></button>}
      </div>
      <p className="hero-signature"><Asterisk size={14} aria-hidden="true" /> {t("A work in progress. Just like me.")}</p>
      <p className="hero-link-status" role="status">{t(linkStatus)}</p>
    </motion.div>
    <motion.div className="hero-footnote" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : 0.3 }}><span className="footnote-line" /> {t("A little corner of the internet.")}<br /><span className="footnote-indent">{t("Built with intention. Always evolving.")}</span></motion.div>
  </main>;
}
