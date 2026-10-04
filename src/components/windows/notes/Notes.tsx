import { noteContent } from '../../../i18n/notes-zh';
import { useLocale } from '../../../i18n/context';
import { ArrowUpRight, ChevronLeft, Hash, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ContentProps } from '../../../app/types';
import Markdown from '../../ui/Markdown';
import { findNote, notes, type Note } from '../../../data/notes';

const humanDate = (date: string, locale: string) => new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
const readingTime = (content: string, locale: string) => {
  const words = content.replace(/[\p{Script=Han}]/gu, ' word ').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return locale === 'zh' ? `${minutes} 分钟阅读` : `${minutes} min read`;
};

function NoteDetail({ note, navigate }: { note: Note; navigate: ContentProps['navigate'] }) {
  const { t, locale } = useLocale();
  const sharedTagCount = (entry: Note) => entry.tags.filter((tag) => note.tags.includes(tag)).length;
  const related = notes
    .filter((entry) => entry.id !== note.id && sharedTagCount(entry) > 0)
    .sort((a, b) => sharedTagCount(b) - sharedTagCount(a) || b.date.localeCompare(a.date))
    .slice(0, 3);
  return <article className="note-detail"><button className="content-back" type="button" onClick={() => navigate('notes')}><ChevronLeft size={17} aria-hidden="true" /> {t("All notes")}</button><header className="note-reading-header"><p className="content-eyebrow">{humanDate(note.date, locale)} · {readingTime(locale === 'zh' ? noteContent[note.id] ?? note.content : note.content, locale)}</p><h1>{t(note.title)}</h1><p>{t(note.description)}</p><div className="content-tags">{note.tags.map((tag) => <span key={t(tag)}>{t(tag)}</span>)}</div></header><Markdown content={locale === 'zh' ? noteContent[note.id] ?? note.content : note.content} />{related.length > 0 && <aside className="note-related"><p className="content-eyebrow">{t("Continue exploring")}</p><h2>{t("Related notes")}</h2><div>{related.map((entry) => <button type="button" key={entry.id} onClick={() => navigate('notes', entry.id)}><span>{t(entry.title)}</span><ArrowUpRight size={16} aria-hidden="true" /></button>)}</div></aside>}</article>;
}

function NoteIndex({ navigate }: Pick<ContentProps, 'navigate'>) {
  const { t, locale } = useLocale();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const tags = useMemo(() => [...new Set(notes.flatMap((note) => note.tags))].sort(), []);
  const visibleNotes = (activeTag ? notes.filter((note) => note.tags.includes(activeTag)) : [...notes]).sort((a, b) => b.date.localeCompare(a.date));
  return <section className="content-page note-index" aria-labelledby="notes-title"><header className="content-intro"><p className="content-eyebrow">{t("Digital garden")}</p><h1 id="notes-title">{t("Notes from the workbench.")}</h1><p>{t("Fragments on making, learning, and the systems that shape how we pay attention.")}</p></header><div className="note-filter" aria-label={t("Filter notes by topic")}><span><Hash size={14} aria-hidden="true" />{t("Topics")}</span><button aria-pressed={activeTag === null} className={activeTag === null ? 'is-active' : ''} type="button" onClick={() => setActiveTag(null)}>{t("All")}</button>{tags.map((tag) => <button aria-pressed={activeTag === tag} className={activeTag === tag ? 'is-active' : ''} key={t(tag)} type="button" onClick={() => setActiveTag(tag)}>{t(tag)}</button>)}</div>{visibleNotes.length ? <div className="note-grid">{visibleNotes.map((note) => <article className="note-card" key={note.id}><button type="button" onClick={() => navigate('notes', note.id)}><div className="note-date"><span>{humanDate(note.date, locale)}</span><span>{readingTime(locale === 'zh' ? noteContent[note.id] ?? note.content : note.content, locale)}</span></div><h2>{t(note.title)}</h2><p>{t(note.description)}</p><div className="content-tags">{note.tags.map((tag) => <span key={t(tag)}>{t(tag)}</span>)}</div><span className="note-read">{t("Read note")} <ArrowUpRight size={15} aria-hidden="true" /></span></button></article>)}</div> : <div className="content-empty"><SearchX size={24} aria-hidden="true" /><p>{t("No notes in this corner yet.")}</p><button type="button" onClick={() => setActiveTag(null)}>{t("Show all notes")}</button></div>}</section>;
}

export default function Notes({ item, navigate }: ContentProps) {
  const { t } = useLocale();
  const note = findNote(item);
  if (item && !note) return <section className="content-missing" aria-live="polite"><p className="content-eyebrow">{t("Not found")}</p><h1>{t("That note isn’t here.")}</h1><p>{t("It may have been renamed, or this link may no longer be current.")}</p><button className="content-back" type="button" onClick={() => navigate('notes')}><ChevronLeft size={17} aria-hidden="true" /> {t("Back to notes")}</button></section>;
  return note ? <NoteDetail note={note} navigate={navigate} /> : <NoteIndex navigate={navigate} />;
}
