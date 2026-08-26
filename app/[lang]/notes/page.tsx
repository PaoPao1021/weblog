import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIntro } from '@/components/ContentIntro';
import { PageShellClient } from '@/components/PageShellClient';
import { dictionaries, isLanguage } from '@/lib/i18n';
import { getPosts, toSearchItems } from '@/lib/content';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  return { title: lang === 'zh' ? '随笔｜浮光笔记' : 'Notes | Afterglow Notes', description: lang === 'zh' ? '比文章更短的观察、片段与念头。' : 'Short observations, fragments, and passing thoughts.', alternates: { canonical: `/${lang}/notes`, languages: { 'zh-CN': '/zh/notes', en: '/en/notes' } } };
}

export default async function NotesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const c = dictionaries[lang];
  const dates = ['2026.08.21', '2026.08.09', '2026.07.28'];
  const copy = lang === 'zh' ? { kicker: '随手记录', title: '随笔', description: '不必展开成长文章，也值得被好好放下来的片刻。' } : { kicker: 'QUICK NOTES', title: 'Notes', description: 'Small moments worth keeping, even when they do not need to become essays.' };
  return <PageShellClient language={lang} current="notes" languageHref={`/${lang === 'zh' ? 'en' : 'zh'}/notes`} searchItems={toSearchItems(getPosts(lang))}><ContentIntro language={lang} {...copy} /><section className="collection-section section-frame"><ol className="notes-timeline">{c.notes.map((note, index) => <li key={note}><time dateTime={dates[index].replaceAll('.', '-')}>{dates[index]}</time><p>{note}</p></li>)}</ol></section></PageShellClient>;
}
