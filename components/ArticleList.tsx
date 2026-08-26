import { ArticleVisual } from './ArticleVisual';
import { categories, categoryLabels, type CategoryId, type Dictionary, type Language } from '@/lib/i18n';
import type { Post } from '@/lib/posts';

type Props = { c: Dictionary; language: Language; category: CategoryId; posts: Post[]; onCategory: (category: CategoryId) => void };

export function ArticleList({ c, language, category, posts, onCategory }: Props) {
  return <div className="articles-column">
    <div className="section-heading"><div><span className="section-kicker">{c.latestKicker}</span><h2 id="articles-title">{c.latest}</h2></div><a href={`/${language}/archive`}>{c.archive} <span>↗</span></a></div>
    <div className="filter-row" aria-label="Article categories">{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} type="button" aria-pressed={category === item} onClick={() => onCategory(item)}>{categoryLabels[item][language]}</button>)}</div>
    <div className="article-list" aria-live="polite">{posts.map((post) => <article className="article-card" key={post.slug}><ArticleVisual post={post} /><div className="article-copy"><div className="article-meta"><span>{categoryLabels[post.category][language]}</span><time dateTime={post.date.replaceAll('.', '-')}>{post.date}</time></div><h3><a href={`/${language}/posts/${post.slug}`}>{post.title[language]}</a></h3><p>{post.excerpt[language]}</p><div className="article-footer"><span>{post.readTime[language]} {c.readSuffix}</span><a href={`/${language}/posts/${post.slug}`} aria-label={`${c.fullArticle}: ${post.title[language]}`}>{c.fullArticle} <span>→</span></a></div></div></article>)}</div>
  </div>;
}
