import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '浮光笔记｜记录学习、生活与创造',
  description: '一座记录技术实践、学习方法与生活片段的双语个人数字花园。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
