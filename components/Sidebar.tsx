import type { Dictionary } from '@/lib/i18n';

export function Sidebar({ c }: { c: Dictionary }) {
  return <aside className="sidebar" aria-label="Blog sidebar">
    <section className="profile-card" id="about"><div className="profile-top"><div className="avatar" aria-hidden="true"><span>Hi</span></div><span className="status"><i /> {c.status}</span></div><span className="handwritten">{c.hello}</span><h2>{c.bioTitle}</h2><p>{c.bio}</p><div className="social-row" aria-label="Social links"><a href="#github" aria-label="GitHub">GH</a><a href="#email" aria-label="Email">@</a><a href="#rss" aria-label="RSS">RSS</a></div></section>
    <section className="side-card" id="notes"><div className="side-title"><div><span>{c.notesKicker}</span><h2>{c.notesTitle}</h2></div><a href="#notes">{c.all}</a></div><ul className="notes-list">{c.notes.map((note, index) => <li key={note}><time>{['08.21', '08.09', '07.28'][index]}</time><a href={`#note-${index}`}>{note}</a></li>)}</ul></section>
    <section className="side-card"><div className="side-title"><div><span>{c.explore}</span><h2>{c.topicsTitle}</h2></div></div><div className="topic-cloud">{c.topics.map((topic, index) => <a href="#topic" key={topic}>{topic} <b>{[12, 8, 16, 6, 9][index]}</b></a>)}</div></section>
  </aside>;
}
