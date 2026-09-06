import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentIntro } from '@/components/ContentIntro';
import { PageShellClient } from '@/components/PageShellClient';
import { dictionaries, isLanguage } from '@/lib/i18n';
import { getPosts, toSearchItems } from '@/lib/content';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  return { title: lang === 'zh' ? '关于｜浮光笔记' : 'About | Afterglow Notes', description: dictionaries[lang].description, alternates: { canonical: `/${lang}/about`, languages: { 'zh-CN': '/zh/about', en: '/en/about' } } };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const c = dictionaries[lang];
  const zh = lang === 'zh';
  return <PageShellClient language={lang} current="about" languageHref={`/${zh ? 'en' : 'zh'}/about`} searchItems={toSearchItems(getPosts(lang))}>
    <ContentIntro language={lang} title={zh ? '你好，很高兴在这里遇见你。' : 'Hello, I am glad you found this place.'} description={c.bioTitle} />
    <section className="about-grid section-frame">
      <div className="about-main"><h2>{zh ? '为什么记录' : 'Why I record'}</h2><p>{c.bio}</p><p>{zh ? '这里主要记录日常生活、情绪瞬间、忽然的想法和普通日子。每条记录都尽量保留当时的场景、真实的心情，以及回看时的温度。' : 'This place is mostly about everyday life, moods, passing thoughts, and ordinary days. Each entry tries to preserve the scene as it happened, the honest feeling behind it, and the warmth of revisiting.'}</p><h2>{zh ? '关于内容' : 'About the content'}</h2><p>{zh ? '中文与英文拥有独立网址。重要的记录会尽量提供双语版本；如果译文暂时缺席，网站不会用另一种语言的正文假装补齐。' : 'Chinese and English have independent URLs. Important entries aim to appear in both languages; when a translation is missing, the site will not disguise the other edition as a substitute.'}</p></div>
      <aside className="about-card"><span className="handwritten">{c.hello}</span><h2>{c.brand}</h2><p>{c.tagline}</p><dl><div><dt>{zh ? '开始记录' : 'Started'}</dt><dd>2026</dd></div><div><dt>{zh ? '更新节奏' : 'Rhythm'}</dt><dd>{zh ? '慢慢写' : 'Slowly'}</dd></div></dl></aside>
    </section>
  </PageShellClient>;
}
