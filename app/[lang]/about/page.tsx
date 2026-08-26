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
    <ContentIntro language={lang} kicker={zh ? '关于这座花园' : 'ABOUT THIS GARDEN'} title={zh ? '你好，很高兴在这里遇见你。' : 'Hello, I am glad you found this place.'} description={c.bioTitle} />
    <section className="about-grid section-frame">
      <div className="about-main"><h2>{zh ? '为什么写作' : 'Why I write'}</h2><p>{c.bio}</p><p>{zh ? '这里主要记录技术实践、学习方法、独立项目和普通生活。文章会尽量保留问题出现的背景、做出判断的理由，以及方法不适用的边界。' : 'This garden is mostly about technical practice, learning, independent projects, and ordinary life. Each story tries to preserve the original context, the reasoning behind decisions, and the limits of the method.'}</p><h2>{zh ? '关于内容' : 'About the content'}</h2><p>{zh ? '中文与英文拥有独立网址。重要文章会尽量提供双语版本；如果译文暂时缺席，网站不会用另一种语言的正文假装补齐。' : 'Chinese and English have independent URLs. Important stories aim to appear in both languages; when a translation is missing, the site will not disguise the other edition as a substitute.'}</p></div>
      <aside className="about-card"><span className="handwritten">{c.hello}</span><h2>{c.brand}</h2><p>{c.tagline}</p><dl><div><dt>{zh ? '开始记录' : 'Started'}</dt><dd>2026</dd></div><div><dt>{zh ? '更新节奏' : 'Rhythm'}</dt><dd>{zh ? '慢慢写' : 'Slowly'}</dd></div></dl></aside>
    </section>
  </PageShellClient>;
}
