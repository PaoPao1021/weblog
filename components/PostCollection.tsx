import Link from 'next/link';
import { ArticleVisual } from './ArticleVisual';
import { categoryLabels, type Language } from '@/lib/i18n';
import { formatPostDate, type ContentPost } from '@/lib/content';
import type { Post } from '@/lib/posts';

export function PostCollection({ posts, language }: { posts: ContentPost[]; language: Language }) {
  const read = language === 'zh' ? '阅读全文' : 'Read article';
  const empty = language === 'zh' ? '这里还没有文章。' : 'No stories here yet.';
  if (!posts.length) return <div className="empty-state">{empty}</div>;

  return <div className="collection-list">{posts.map((post) => {
    const visualPost: Post = {
      slug: post.slug,
      title: { zh: post.title, en: post.title },
      excerpt: { zh: post.description, en: post.description },
      category: post.category,
      date: post.publishedAt.slice(0, 10).replaceAll('-', '.'),
      readTime: { zh: `${post.readingMinutes} 分钟`, en: `${post.readingMinutes} min` },
      accent: post.accent,
      visual: post.visual,
    };
    return <article className="collection-card" key={post.slug}>
      <ArticleVisual post={visualPost} />
      <div>
        <div className="article-meta"><Link href={`/${language}/categories/${post.category}`}>{categoryLabels[post.category][language]}</Link><time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, language)}</time></div>
        <h2><Link href={`/${language}/posts/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.description}</p>
        <div className="collection-footer"><span>{post.readingMinutes} {language === 'zh' ? '分钟阅读' : 'min read'}</span><Link href={`/${language}/posts/${post.slug}`}>{read} →</Link></div>
      </div>
    </article>;
  })}</div>;
}
