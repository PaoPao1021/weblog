import type { Dictionary } from '@/lib/i18n';

export function Hero({ c }: { c: Dictionary }) {
  return <>
    <section className="hero section-frame" aria-labelledby="hero-title">
      <div className="hero-copy"><span className="eyebrow"><i /> {c.eyebrow}</span><h1 id="hero-title">{c.heroLine1}<span>{c.heroLine2}</span></h1><p>{c.intro}</p><div className="hero-actions"><a className="primary-button" href="#articles">{c.start} <span>↘</span></a><a className="text-link" href="#about">{c.meet} <span>→</span></a></div><dl className="hero-stats" aria-label="Blog statistics">{c.stats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl></div>
      <div className="hero-feature" aria-label={c.weekly}><div className="feature-card"><div className="feature-topline"><span>{c.weekly}</span><span>NO. 08</span></div><div className="feature-art" aria-hidden="true"><div className="paper paper-back" /><div className="paper paper-front"><i /><i /><i /><span>{c.mark}</span></div><div className="floating-dot dot-a" /><div className="floating-dot dot-b" /><div className="floating-star">✦</div></div><div className="feature-content"><span className="feature-tag">{c.garden}</span><h2>{c.featureTitle}</h2><p>{c.featureExcerpt}</p><a href="#articles">{c.readNote} <span>→</span></a></div></div></div>
    </section>
    <div className="marquee" aria-hidden="true"><div>{c.marquee.concat(c.marquee).map((item, index) => <span className="marquee-pair" key={`${item}-${index}`}><span>{item}</span><i>✦</i></span>)}</div></div>
  </>;
}
