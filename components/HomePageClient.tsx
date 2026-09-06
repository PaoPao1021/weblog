'use client';

import { useMemo, useState } from 'react';
import { ArticleList } from './ArticleList';
import { Hero } from './Hero';
import { PageShellClient } from './PageShellClient';
import { Sidebar } from './Sidebar';
import { dictionaries, type CategoryId, type Language } from '@/lib/i18n';
import type { Post } from '@/lib/posts';
import type { SearchItem } from '@/lib/content';

export function HomePageClient({ language, posts, searchItems }: { language: Language; posts: Post[]; searchItems: SearchItem[] }) {
  const [category, setCategory] = useState<CategoryId>('all');
  const c = dictionaries[language];

  const filteredPosts = useMemo(() => category === 'all' ? posts : posts.filter((post) => post.category === category), [category, posts]);

  return <PageShellClient language={language} current="home" searchItems={searchItems}>
    <div id="top" />
    <Hero c={c} />
    <section className="content-section section-frame" id="articles" aria-labelledby="articles-title">
      <ArticleList c={c} language={language} category={category} posts={filteredPosts} onCategory={setCategory} />
      <Sidebar c={c} language={language} />
    </section>
  </PageShellClient>;
}
