import type { Dictionary } from '@/lib/i18n';

export function SiteFooter({ c }: { c: Dictionary }) {
  return <footer className="site-footer"><div className="section-frame footer-inner"><div><span className="brand-mark small">{c.mark}</span><p>{c.footerWish}</p></div><p>© 2026 {c.brand} · {c.built}</p></div></footer>;
}
