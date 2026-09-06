import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afterglow-notes.myteam-5878.chatgpt.site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '浮光笔记 · Afterglow Notes',
  description: '我的个人记录平台：写下日常的片段、忽然的想法，以及那些让普通日子微微发亮的瞬间。',
  other: { 'theme-color': '#f7f5f0' },
  openGraph: {
    title: '浮光笔记 · Afterglow Notes',
    description: '记录生活、感受与创造。',
    images: [{ url: '/og.png', width: 1731, height: 908, alt: '浮光笔记 · Afterglow Notes' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '浮光笔记 · Afterglow Notes',
    description: '记录生活、感受与创造。',
    images: ['/og.png'],
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem('blog-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
