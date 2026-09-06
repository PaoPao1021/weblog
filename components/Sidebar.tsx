import Link from 'next/link';
import { CodeXml, Mail, Rss } from 'lucide-react';
import type { Dictionary, Language } from '@/lib/i18n';

const socials = [
  { href: 'https://github.com', label: 'GitHub', Icon: CodeXml },
  { href: 'mailto:hello@example.com', label: 'Email', Icon: Mail },
  { href: '/rss.xml', label: 'RSS', Icon: Rss },
] as const;

export function Sidebar({ c, language }: { c: Dictionary; language: Language }) {
  return (
    <aside className="sidebar" aria-label="Blog sidebar">
      <section className="profile-card" id="about">
        <div className="profile-top">
          <div className="avatar" aria-hidden="true"><span>Hi</span></div>
          <span className="status"><i /> {c.status}</span>
        </div>
        <span className="handwritten">{c.hello}</span>
        <h2>{c.bioTitle}</h2>
        <p>{c.bio}</p>
        <div className="social-row" aria-label="Social links">
          {socials.map(({ href, label, Icon }) => (
            <a key={label} href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
              <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <section className="side-card" id="notes">
        <div className="side-title">
          <h2>{c.notesTitle}</h2>
          <Link href={`/${language}/notes`}>{c.all}</Link>
        </div>
        <ul className="notes-list">
          {c.notes.map((note, index) => (
            <li key={note}>
              <time>{['08.21', '08.09', '07.28'][index]}</time>
              <Link href={`/${language}/notes`}>{note}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="side-card">
        <div className="side-title"><h2>{c.topicsTitle}</h2></div>
        <div className="topic-cloud">
          {c.topics.map((topic, index) => (
            <Link key={topic} href={`/${language}/archive`}>{topic} <b>{[12, 8, 16, 6, 9][index]}</b></Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
