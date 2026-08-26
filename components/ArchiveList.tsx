import Link from 'next/link';
import { formatPostDate, type ContentPost } from '@/lib/content';
import type { Language } from '@/lib/i18n';

export function ArchiveList({ posts, language }: { posts: ContentPost[]; language: Language }) {
  const groups = Map.groupBy(posts, (post) => post.publishedAt.slice(0, 7));
  return <div className="archive-list">{[...groups.entries()].map(([month, entries]) => {
    const monthLabel = new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', timeZone: 'Asia/Shanghai' }).format(new Date(`${month}-01T00:00:00+08:00`));
    return <section key={month}><h2>{monthLabel}</h2><ol>{entries.map((post) => <li key={post.slug}><time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, language)}</time><Link href={`/${language}/posts/${post.slug}`}>{post.title}</Link><span>{post.readingMinutes} {language === 'zh' ? '分钟' : 'min'}</span></li>)}</ol></section>;
  })}</div>;
}
