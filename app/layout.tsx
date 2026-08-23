import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '浮光笔记 · Afterglow Notes',
  description: '一座记录技术实践、学习方法与生活片段的双语个人数字花园。',
  openGraph: {
    title: '浮光笔记 · Afterglow Notes',
    description: '记录学习、生活与创造。',
    images: [{ url: '/og.png', width: 1731, height: 908, alt: '浮光笔记 · Afterglow Notes' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '浮光笔记 · Afterglow Notes',
    description: '记录学习、生活与创造。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
