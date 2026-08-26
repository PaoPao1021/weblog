import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomePageClient } from '@/components/HomePageClient';
import { dictionaries, isLanguage, languages } from '@/lib/i18n';

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const c = dictionaries[lang];
  return {
    title: c.pageTitle,
    description: c.description,
    alternates: { canonical: `/${lang}`, languages: { 'zh-CN': '/zh', en: '/en' } },
    openGraph: { title: c.pageTitle, description: c.description, locale: lang === 'zh' ? 'zh_CN' : 'en_US' },
    twitter: { title: c.pageTitle, description: c.description },
  };
}

export default async function LocalizedHome({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <HomePageClient language={lang} />;
}
