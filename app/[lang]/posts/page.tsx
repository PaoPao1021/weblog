import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIntro } from '@/components/ContentIntro';
import { PageShellClient } from '@/components/PageShellClient';
import { PostCollection } from '@/components/PostCollection';
import { getPosts, toSearchItems } from '@/lib/content';
import { isLanguage } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const title = lang === 'zh' ? '记录｜浮光笔记' : 'Records | Afterglow Notes';
  const description = lang === 'zh' ? '关于日常生活、感受、想法与经历的记录。' : 'Records of daily life, feelings, ideas, and experiences.';
  return { title, description, alternates: { canonical: `/${lang}/posts`, languages: { 'zh-CN': '/zh/posts', en: '/en/posts' } } };
}

export default async function PostsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = lang === 'zh'
    ? { title: '记录', description: '把实践、试错与仍在变化的想法，整理成可以重新走一遍的路径。' }
    : { title: 'Stories', description: 'Practice, wrong turns, and changing ideas shaped into paths worth walking again.' };
  const posts = getPosts(lang);
  return <PageShellClient language={lang} current="posts" languageHref={`/${lang === 'zh' ? 'en' : 'zh'}/posts`} searchItems={toSearchItems(posts)}>
    <ContentIntro language={lang} {...copy} />
    <section className="collection-section section-frame" aria-label={copy.title}><PostCollection posts={posts} language={lang} /></section>
  </PageShellClient>;
}
