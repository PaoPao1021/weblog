import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';

export function Hero({ c }: { c: Dictionary }) {
  return (
    <section className="hero section-frame" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          <span className="hero-line">{c.heroLine1}</span>
          <span className="hero-line hero-line-accent">{c.heroLine2}</span>
        </h1>
        <p>{c.intro}</p>
        <div className="hero-actions">
          <a className="primary-button" href="#articles">{c.start} <ArrowDown size={15} strokeWidth={2.4} aria-hidden="true" /></a>
          <a className="text-link" href="#about">{c.meet} <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="hero-feature" aria-label={c.weekly}>
        <div className="feature-card">
          <div className="feature-topline"><span>{c.weekly}</span></div>
          <div className="feature-art" aria-hidden="true">
            <div className="paper paper-back" />
            <div className="paper paper-front"><i /><i /><i /><span>{c.mark}</span></div>
            <div className="floating-dot dot-a" />
            <div className="floating-dot dot-b" />
            <Sparkles className="floating-star" size={26} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div className="feature-content">
            <h2>{c.featureTitle}</h2>
            <p>{c.featureExcerpt}</p>
            <a href="#articles">{c.readNote} <ArrowRight size={13} strokeWidth={2.4} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
