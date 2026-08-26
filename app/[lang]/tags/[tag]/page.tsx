import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIntro } from '@/components/ContentIntro';
import { PageShellClient } from '@/components/PageShellClient';
import { PostCollection } from '@/components/PostCollection';
import { getPosts, getTags, toSearchItems } from '@/lib/content';
import { isLanguage, languages } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string; tag: string }> };

export function generateStaticParams() {
  return languages.flatMap((lang) => getTags(lang).map(({ tag }) => ({ lang, tag })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, tag } = await params;
  if (!isLanguage(lang) || !getTags(lang).some((item) => item.tag === tag)) return {};
  return {
    title: `#${tag} | ${lang === 'zh' ? '浮光笔记' : 'Afterglow Notes'}`,
    description: lang === 'zh' ? `带有 #${tag} 标签的全部文章。` : `Every story tagged #${tag}.`,
    alternates: { canonical: `/${lang}/tags/${tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { lang, tag } = await params;
  if (!isLanguage(lang) || !getTags(lang).some((item) => item.tag === tag)) notFound();
  const posts = getPosts(lang).filter((post) => post.tags.includes(tag));
  const other = lang === 'zh' ? 'en' : 'zh';
  const languageHref = getTags(other).some((item) => item.tag === tag) ? `/${other}/tags/${tag}` : `/${other}/posts`;
  return <PageShellClient language={lang} current="posts" languageHref={languageHref} searchItems={toSearchItems(getPosts(lang))}><ContentIntro language={lang} kicker={lang === 'zh' ? '标签' : 'TAG'} title={`#${tag}`} description={lang === 'zh' ? `带有 #${tag} 标签的全部文章。` : `Every story tagged #${tag}.`} /><section className="collection-section section-frame"><PostCollection posts={posts} language={lang} /></section></PageShellClient>;
}
