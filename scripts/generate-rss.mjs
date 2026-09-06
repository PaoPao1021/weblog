// Generates public/rss.xml from content/posts frontmatter so the feed
// stays in sync without a runtime dependency on import.meta.glob.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

const root = process.cwd();
const contentDir = join(root, 'content', 'posts');
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afterglow-notes.myteam-5878.chatgpt.site').replace(/\/$/, '');

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const listMarkdownFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(path);
    return /\.mdx?$/i.test(entry.name) ? [path] : [];
  });

const parseFrontmatter = (source) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parseYaml(match[1]) : null;
};

const posts = listMarkdownFiles(contentDir)
  .map((path) => {
    const data = parseFrontmatter(readFileSync(path, 'utf8'));
    return data && data.status === 'published'
      ? { ...data, language: data.locale === 'zh-CN' ? 'zh' : 'en', file: relative(contentDir, path) }
      : null;
  })
  .filter(Boolean)
  .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

const items = posts.map((post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/${post.language}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${post.language}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <language>${post.language === 'zh' ? 'zh-CN' : 'en'}</language>
    </item>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>浮光笔记 · Afterglow Notes</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>我的个人记录平台：写下日常的片段、忽然的想法，以及那些让普通日子微微发亮的瞬间。</description>
    <language>zh-CN</language>
    <generator>afterglow-notes</generator>
${items}
  </channel>
</rss>
`;

writeFileSync(join(root, 'public', 'rss.xml'), xml);
console.log(`rss.xml written with ${posts.length} items.`);
