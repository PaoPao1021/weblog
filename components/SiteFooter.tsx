import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Dictionary, Language } from '@/lib/i18n';

export function SiteFooter({ c, language }: { c: Dictionary; language: Language }) {
  const links = [
    { href: `/${language}/posts`, label: c.nav[1] },
    { href: `/${language}/archive`, label: c.nav[2] },
    { href: `/${language}/notes`, label: c.nav[3] },
    { href: `/${language}/about`, label: c.nav[4] },
  ];

  return (
    <footer className="site-footer">
      <div className="section-frame footer-inner">
        <div className="footer-brand">
          <span className="brand-mark small">{c.mark}</span>
          <p>{c.footerWish}</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
              <ArrowUpRight size={12} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <p className="footer-note">© 2026 {c.brand} · {c.built}</p>
      </div>
    </footer>
  );
}
