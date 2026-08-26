import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { PageShellClient } from '@/components/PageShellClient';
import { categoryLabels, isLanguage, languages } from '@/lib/i18n';
import { formatPostDate, getPost, getPosts, toSearchItems } from '@/lib/content';

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return languages.flatMap((lang) => getPosts(lang).map((post) => ({ lang, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) return {};
  const post = getPost(lang, slug);
  if (!post) return {};
  const path = `/${lang}/posts/${slug}`;
  return {
    title: `${post.title} | ${lang === 'zh' ? '浮光笔记' : 'Afterglow Notes'}`,
    description: post.description,
    alternates: { canonical: path, languages: { 'zh-CN': `/zh/posts/${slug}`, en: `/en/posts/${slug}` } },
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.publishedAt, modifiedTime: post.updatedAt, images: [] },
    twitter: { title: post.title, description: post.description, images: [] },
  };
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const post = getPost(lang, slug);
  if (!post) notFound();
  const posts = getPosts(lang);
  const index = posts.findIndex((item) => item.slug === post.slug);
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index < posts.length - 1 ? posts[index + 1] : undefined;
  const other = lang === 'zh' ? 'en' : 'zh';

  return <PageShellClient language={lang} current="posts" languageHref={getPost(other, slug) ? `/${other}/posts/${slug}` : `/${other}/posts`} searchItems={toSearchItems(posts)}>
    <article className="post-page section-frame">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={`/${lang}`}>{lang === 'zh' ? '首页' : 'Home'}</Link><span>/</span><Link href={`/${lang}/posts`}>{lang === 'zh' ? '文章' : 'Writing'}</Link><span>/</span><span aria-current="page">{post.title}</span></nav>
      <header className="post-header">
        <Link className="post-category" href={`/${lang}/categories/${post.category}`}>{categoryLabels[post.category][lang]}</Link>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <div className="post-byline"><time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, lang)}</time><span>·</span><span>{post.readingMinutes} {lang === 'zh' ? '分钟阅读' : 'min read'}</span></div>
      </header>
      <div className="post-layout">
        <div className="prose"><MarkdownContent source={post.body} /></div>
        <aside className="post-aside"><span>{lang === 'zh' ? '标签' : 'TAGS'}</span><div>{post.tags.map((tag) => <Link key={tag} href={`/${lang}/tags/${tag}`}>#{tag}</Link>)}</div></aside>
      </div>
      <nav className="post-pagination" aria-label={lang === 'zh' ? '相邻文章' : 'Adjacent stories'}>
        {older ? <Link href={`/${lang}/posts/${older.slug}`}><span>← {lang === 'zh' ? '上一篇' : 'Older'}</span><strong>{older.title}</strong></Link> : <span />}
        {newer ? <Link className="next" href={`/${lang}/posts/${newer.slug}`}><span>{lang === 'zh' ? '下一篇' : 'Newer'} →</span><strong>{newer.title}</strong></Link> : <span />}
      </nav>
    </article>
  </PageShellClient>;
}
