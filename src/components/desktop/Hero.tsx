import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Asterisk, Code2, FileText, Github, Mail, UserRound } from 'lucide-react';
import { siteConfig } from '../../config/site';
import type { Navigate } from '../../app/types';
import { greeting } from '../../utils/greeting';
import { assetUrl } from '../../utils/assets';

export default function Hero({ navigate }: { navigate: Navigate }) {
  const reducedMotion = useReducedMotion();
  const [hello, setHello] = useState(() => greeting(new Date().getHours()));
  useEffect(() => {
    const sync = () => setHello(greeting(new Date().getHours()));
    const timer = window.setInterval(sync, 60_000);
    document.addEventListener('visibilitychange', sync);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <main id="main-content" className="hero" tabIndex={-1}>
    <motion.div className="hero-inner" initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="hero-eyebrow"><Asterisk className="tiny-star" size={16} /> A WORK IN PROGRESS. JUST LIKE ME.</div>
      <p className="greeting">{hello}</p>
      <h1>{siteConfig.hero.title.replace('{name}', siteConfig.name)}</h1>
      <p className="hero-description">{siteConfig.hero.subtitle.map((line, i) => <span key={line}>{line}{i !== siteConfig.hero.subtitle.length - 1 && <br />}</span>)}</p>
      <div className="hero-apps" aria-label="Explore my space">
        <motion.button whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }} transition={{ type: 'spring', stiffness: 450, damping: 25 }} className="hero-app primary" onClick={() => navigate('projects')}><Code2 size={19} /><span>Projects</span><ArrowUpRight size={16} /></motion.button>
        <motion.button whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }} transition={{ type: 'spring', stiffness: 450, damping: 25 }} className="hero-app" onClick={() => navigate('notes')}><FileText size={18} /><span>Notes</span><ArrowUpRight size={16} /></motion.button>
        <motion.button whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }} whileTap={reducedMotion ? undefined : { scale: 0.97 }} transition={{ type: 'spring', stiffness: 450, damping: 25 }} className="hero-app" onClick={() => navigate('about')}><UserRound size={18} /><span>About</span><ArrowUpRight size={16} /></motion.button>
      </div>
      <div className="hero-links">
        {siteConfig.github ? <a href={siteConfig.github} target="_blank" rel="noreferrer noopener"><Github size={14} />GitHub<ArrowUpRight size={12} /></a> : <button onClick={() => navigate('about')}><Github size={14} />GitHub<ArrowUpRight size={12} /></button>}
        {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}><Mail size={14} />Email<ArrowUpRight size={12} /></a> : <button onClick={() => navigate('about')}><Mail size={14} />Email<ArrowUpRight size={12} /></button>}
        {siteConfig.resume ? <a href={assetUrl(siteConfig.resume)} target="_blank" rel="noreferrer noopener"><FileText size={14} />Resume<ArrowUpRight size={12} /></a> : <button onClick={() => navigate('about')}><FileText size={14} />Resume<ArrowUpRight size={12} /></button>}
      </div>
    </motion.div>
    <motion.div className="hero-footnote" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : 0.3 }}><span className="footnote-line" /> A little corner of the internet.<br /><span className="footnote-indent">Built with intention. Always evolving.</span></motion.div>
  </main>;
}
