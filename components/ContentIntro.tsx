import Link from 'next/link';
import type { Language } from '@/lib/i18n';

export function ContentIntro({ language, title, description }: { language: Language; title: string; description: string }) {
  return <header className="content-intro section-frame">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={`/${language}`}>{language === 'zh' ? '首页' : 'Home'}</Link><span>/</span><span aria-current="page">{title}</span></nav>
    <h1>{title}</h1>
    <p>{description}</p>
  </header>;
}
