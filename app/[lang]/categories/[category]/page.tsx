import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIntro } from '@/components/ContentIntro';
import { PageShellClient } from '@/components/PageShellClient';
import { PostCollection } from '@/components/PostCollection';
import { getPosts, toSearchItems } from '@/lib/content';
import { categories, categoryLabels, isLanguage, type CategoryId } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string; category: string }> };
const categoryIds = categories.filter((item): item is Exclude<CategoryId, 'all'> => item !== 'all');

export function generateStaticParams() {
  return ['zh', 'en'].flatMap((lang) => categoryIds.map((category) => ({ lang, category })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  if (!isLanguage(lang) || !categoryIds.includes(category as Exclude<CategoryId, 'all'>)) return {};
  const id = category as Exclude<CategoryId, 'all'>;
  const title = categoryLabels[id][lang];
  return {
    title: `${title} | ${lang === 'zh' ? '浮光笔记' : 'Afterglow Notes'}`,
    description: lang === 'zh' ? `收录在“${title}”分类下的全部文章。` : `Every story filed under “${title}”.`,
    alternates: { canonical: `/${lang}/categories/${id}`, languages: { 'zh-CN': `/zh/categories/${id}`, en: `/en/categories/${id}` } },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, category } = await params;
  if (!isLanguage(lang) || !categoryIds.includes(category as Exclude<CategoryId, 'all'>)) notFound();
  const id = category as Exclude<CategoryId, 'all'>;
  const title = categoryLabels[id][lang];
  const posts = getPosts(lang).filter((post) => post.category === id);
  return <PageShellClient language={lang} current="posts" languageHref={`/${lang === 'zh' ? 'en' : 'zh'}/categories/${id}`} searchItems={toSearchItems(getPosts(lang))}><ContentIntro language={lang} kicker={lang === 'zh' ? '分类' : 'CATEGORY'} title={title} description={lang === 'zh' ? `收录在“${title}”分类下的全部文章。` : `Every story filed under “${title}”.`} /><section className="collection-section section-frame"><PostCollection posts={posts} language={lang} /></section></PageShellClient>;
}
