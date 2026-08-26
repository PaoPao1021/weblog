import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArchiveList } from '@/components/ArchiveList';
import { ContentIntro } from '@/components/ContentIntro';
import { PageShellClient } from '@/components/PageShellClient';
import { getPosts, toSearchItems } from '@/lib/content';
import { isLanguage } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  return { title: lang === 'zh' ? '归档｜浮光笔记' : 'Archive | Afterglow Notes', description: lang === 'zh' ? '按时间浏览全部文章。' : 'Browse every story by date.', alternates: { canonical: `/${lang}/archive`, languages: { 'zh-CN': '/zh/archive', en: '/en/archive' } } };
}

export default async function ArchivePage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = lang === 'zh' ? { kicker: '时间线', title: '文章归档', description: '让每一次认真记录，都在时间里拥有清楚的位置。' } : { kicker: 'TIMELINE', title: 'Archive', description: 'A clear place in time for every story worth keeping.' };
  const posts = getPosts(lang);
  return <PageShellClient language={lang} current="posts" languageHref={`/${lang === 'zh' ? 'en' : 'zh'}/archive`} searchItems={toSearchItems(posts)}><ContentIntro language={lang} {...copy} /><section className="collection-section section-frame"><ArchiveList posts={posts} language={lang} /></section></PageShellClient>;
}
