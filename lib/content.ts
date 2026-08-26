import { z } from 'zod';
import { parse as parseYaml } from 'yaml';
import type { Language } from './i18n';

const frontmatterSchema = z.object({
  schemaVersion: z.literal(1),
  translationKey: z.string().min(1),
  locale: z.enum(['zh-CN', 'en']),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['draft', 'review', 'published', 'archived']),
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  category: z.enum(['building', 'learning', 'life', 'project']),
  tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1).max(5),
  featured: z.boolean(),
  accent: z.enum(['violet', 'blue', 'orange', 'green']),
  visual: z.enum(['window', 'steps', 'sun', 'orbit']),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;
export type ContentPost = PostFrontmatter & { language: Language; body: string; readingMinutes: number };
export type SearchItem = Pick<ContentPost, 'slug' | 'title' | 'description' | 'tags'> & { searchText: string };

// Vite expands this at build time, so new Markdown and MDX files are
// discovered without maintaining a second list in source code.
const contentModules = import.meta.glob('../content/posts/**/*.{md,mdx}', {
  eager: true,
  query: '?raw',
});
const rawEntries = Object.values(contentModules).map((entry) => {
  if (typeof entry === 'string') return entry;
  if (entry && typeof entry === 'object' && 'default' in entry && typeof entry.default === 'string') return entry.default;
  throw new Error('Content import did not resolve to text.');
});

const countWords = (value: string, language: Language) => {
  const plain = value.replace(/[`#>*_\-[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
  if (language === 'zh') return Math.max(1, plain.replace(/\s/g, '').length);
  return Math.max(1, plain.split(' ').length);
};

const parsePost = (source: string): ContentPost => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('Content file is missing valid YAML frontmatter.');
  const data = frontmatterSchema.parse(parseYaml(match[1]));
  const language: Language = data.locale === 'zh-CN' ? 'zh' : 'en';
  const wordsPerMinute = language === 'zh' ? 350 : 220;
  const body = match[2].trim();
  return { ...data, language, body, readingMinutes: Math.max(1, Math.ceil(countWords(body, language) / wordsPerMinute)) };
};

const allPosts = rawEntries.map(parsePost);

const duplicatePost = allPosts.find((post, index) =>
  allPosts.findIndex((candidate) => candidate.language === post.language && candidate.slug === post.slug) !== index,
);
if (duplicatePost) throw new Error(`Duplicate ${duplicatePost.language} post slug: ${duplicatePost.slug}`);

const duplicateTranslation = allPosts.find((post, index) =>
  allPosts.findIndex((candidate) => candidate.language === post.language && candidate.translationKey === post.translationKey) !== index,
);
if (duplicateTranslation) throw new Error(`Duplicate ${duplicateTranslation.language} translation key: ${duplicateTranslation.translationKey}`);

export function getPosts(language: Language) {
  return allPosts.filter((post) => post.language === language && post.status === 'published').sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(language: Language, slug: string) {
  return getPosts(language).find((post) => post.slug === slug);
}

export function getTags(language: Language) {
  const counts = new Map<string, number>();
  getPosts(language).forEach((post) => post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([tag, count]) => ({ tag, count }));
}

export function toSearchItems(posts: ContentPost[]): SearchItem[] {
  return posts.map(({ slug, title, description, tags, body }) => ({
    slug,
    title,
    description,
    tags,
    searchText: `${title} ${description} ${tags.join(' ')} ${body}`.toLocaleLowerCase(),
  }));
}

export function formatPostDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: language === 'zh' ? '2-digit' : 'short', day: '2-digit', timeZone: 'Asia/Shanghai' }).format(new Date(date));
}
