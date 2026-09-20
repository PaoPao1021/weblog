import { readFile, writeFile } from 'node:fs/promises';
import { siteConfig } from '../src/config/site.ts';

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const rawUrl = process.env.SITE_URL || siteConfig.siteUrl;
let siteUrl: string | null = null;
if (rawUrl) {
  const parsed = new URL(rawUrl);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('SITE_URL must use http or https.');
  siteUrl = `${parsed.href.replace(/\/$/, '')}/`;
}
if (process.env.GITHUB_ACTIONS && !siteUrl) throw new Error('A public SITE_URL is required for Pages metadata.');
const title = `${siteConfig.name} — Personal OS`;
const tags = [
  `<meta property="og:type" content="website" />`,
  `<meta property="og:title" content="${escape(title)}" />`,
  `<meta property="og:description" content="${escape(siteConfig.description)}" />`,
  `<meta name="twitter:card" content="summary_large_image" />`,
  `<meta name="twitter:title" content="${escape(title)}" />`,
  `<meta name="twitter:description" content="${escape(siteConfig.description)}" />`,
];
if (siteUrl) tags.push(`<link rel="canonical" href="${escape(siteUrl)}" />`, `<meta property="og:url" content="${escape(siteUrl)}" />`, `<meta property="og:image" content="${escape(new URL('og-image.png', siteUrl).href)}" />`, `<meta name="twitter:image" content="${escape(new URL('og-image.png', siteUrl).href)}" />`);
let html = await readFile('dist/index.html', 'utf8');
html = html.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
  .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(siteConfig.description)}" />`)
  .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`);
await writeFile('dist/index.html', html);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${new URL('sitemap.xml', siteUrl).href}\n` : ''}`);
if (siteUrl) await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl)}</loc><lastmod>${siteConfig.lastUpdated}</lastmod></url></urlset>\n`);
console.log(`SEO generated${siteUrl ? ` for ${siteUrl}` : ' (set SITE_URL to include canonical and sitemap)'}.`);
