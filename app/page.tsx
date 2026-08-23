'use client';

import { useEffect, useMemo, useState } from 'react';

type Language = 'zh' | 'en';
type Localized = { zh: string; en: string };
type CategoryId = 'all' | 'building' | 'learning' | 'life' | 'project';

type Post = {
  title: Localized;
  excerpt: Localized;
  category: Exclude<CategoryId, 'all'>;
  date: string;
  readTime: Localized;
  accent: string;
  visual: string;
};

const categoryLabels: Record<CategoryId, Localized> = {
  all: { zh: '全部', en: 'All' },
  building: { zh: '建站手记', en: 'Site Notes' },
  learning: { zh: '学习方法', en: 'Learning' },
  life: { zh: '生活切片', en: 'Life' },
  project: { zh: '项目复盘', en: 'Projects' },
};

const categories = Object.keys(categoryLabels) as CategoryId[];

const posts: Post[] = [
  {
    title: { zh: '我如何搭建这座小小的数字花园', en: 'How I built this little digital garden' },
    excerpt: {
      zh: '从域名、设计到内容结构，记录一个个人博客从想法变成真实网址的全过程。',
      en: 'From domain and visual design to content structure—a field note on turning an idea into a real home on the web.',
    },
    category: 'building',
    date: '2026.08.18',
    readTime: { zh: '8 分钟', en: '8 min' },
    accent: 'violet',
    visual: 'window',
  },
  {
    title: { zh: '把复杂的学习，整理成可以复用的路径', en: 'Turning complex learning into reusable paths' },
    excerpt: {
      zh: '笔记的价值不只是记住，而是让下一次遇见相似问题时，能够更快地重新出发。',
      en: 'Notes are not only for remembering. They help us restart faster when a familiar problem returns.',
    },
    category: 'learning',
    date: '2026.08.12',
    readTime: { zh: '6 分钟', en: '6 min' },
    accent: 'blue',
    visual: 'steps',
  },
  {
    title: { zh: '七月收藏夹：让我停下来多看一会儿的事物', en: 'July collection: things worth a longer look' },
    excerpt: {
      zh: '一组近期喜欢的书、网站、声音和生活片段，也是一份写给未来自己的月度切片。',
      en: 'Books, websites, sounds and small moments I loved lately—a monthly slice saved for my future self.',
    },
    category: 'life',
    date: '2026.07.30',
    readTime: { zh: '5 分钟', en: '5 min' },
    accent: 'orange',
    visual: 'sun',
  },
  {
    title: { zh: '写给第一次独立做项目的自己', en: 'A note to my first-time indie-builder self' },
    excerpt: {
      zh: '别急着把所有功能塞进第一版。先做出一个能被看见、能被使用的完整小闭环。',
      en: 'Do not force every feature into version one. Start with one complete loop people can see and use.',
    },
    category: 'project',
    date: '2026.07.21',
    readTime: { zh: '7 分钟', en: '7 min' },
    accent: 'green',
    visual: 'orbit',
  },
];

const translations = {
  zh: {
    pageTitle: '浮光笔记｜记录学习、生活与创造',
    brand: '浮光笔记',
    mark: '浮',
    tagline: 'Notes between code & life',
    nav: ['首页', '文章', '随笔', '关于'],
    search: '搜索',
    searchAria: '搜索文章',
    themeAria: '切换深浅主题',
    languageAria: 'Switch to English',
    menuAria: '打开导航',
    eyebrow: '一座个人数字花园',
    heroLine1: '把学习与生活，',
    heroLine2: '写成一条可回看的路。',
    intro: '你好，我是这座数字花园的主人。这里记录技术实践、学习方法，也收藏那些让普通日子微微发亮的瞬间。',
    start: '开始阅读',
    meet: '认识我',
    stats: [
      ['28', '篇文章'],
      ['7', '个主题'],
      ['2026', '开始记录'],
    ],
    weekly: '本周手记',
    garden: '数字花园',
    featureTitle: '为什么我们仍然需要一个属于自己的网站？',
    featureExcerpt: '在快速流动的信息里，给长期思考留一块安静的地方。',
    readNote: '阅读手记',
    marquee: ['慢慢写', '清楚地想', '保持好奇', '记录 · 思考 · 创造'],
    latestKicker: '最近写作',
    latest: '最近更新',
    archive: '查看归档',
    readSuffix: '阅读',
    fullArticle: '阅读全文',
    status: '正在持续更新',
    hello: '你好呀！',
    bioTitle: '一个在学习与创造之间，慢慢搭建世界的人。',
    bio: '相信好的记录会产生复利，也相信真诚比完美更值得被留下。',
    notesKicker: '随手记录',
    notesTitle: '最近随笔',
    all: '全部',
    notes: [
      '晚风和刚写完的第一行代码。',
      '读书不是收集句子，是改变看法。',
      '散步时想通的一件小事。',
    ],
    explore: '探索主题',
    topicsTitle: '按主题浏览',
    topics: ['前端开发', '学习方法', '生活随笔', '项目复盘', '阅读笔记'],
    footerWish: '愿我们都能保留一块，安静生长的地方。',
    built: '以好奇心构建。',
    searchPlaceholder: '搜索文章、标签或关键词…',
    suggested: '推荐搜索',
    suggestions: ['数字花园', '学习方法', '前端'],
    searchHint: '正式接入文章数据后，这里会显示实时搜索结果。',
  },
  en: {
    pageTitle: 'Afterglow Notes | Learning, life & making',
    brand: 'Afterglow Notes',
    mark: 'A',
    tagline: 'Notes between code & life',
    nav: ['Home', 'Writing', 'Notes', 'About'],
    search: 'Search',
    searchAria: 'Search articles',
    themeAria: 'Toggle color theme',
    languageAria: '切换到中文',
    menuAria: 'Open navigation',
    eyebrow: 'A PERSONAL DIGITAL GARDEN',
    heroLine1: 'Turning learning and life',
    heroLine2: 'into a path worth revisiting.',
    intro: 'Hello, I am the keeper of this digital garden—a place for technical experiments, learning notes, and ordinary moments that quietly glow.',
    start: 'Start reading',
    meet: 'Meet me',
    stats: [
      ['28', 'articles'],
      ['7', 'topics'],
      ['2026', 'since'],
    ],
    weekly: 'WEEKLY NOTE',
    garden: 'DIGITAL GARDEN',
    featureTitle: 'Why do we still need a place of our own on the web?',
    featureExcerpt: 'A quiet corner for long-term thinking in a fast-moving stream of information.',
    readNote: 'Read the note',
    marquee: ['WRITE SLOWLY', 'THINK CLEARLY', 'STAY CURIOUS', 'NOTE · THINK · MAKE'],
    latestKicker: 'LATEST WRITING',
    latest: 'Recent stories',
    archive: 'View archive',
    readSuffix: 'read',
    fullArticle: 'Read article',
    status: 'GROWING WEEKLY',
    hello: 'Hello there!',
    bioTitle: 'A person slowly building a world between learning and making.',
    bio: 'I believe good notes compound over time, and sincerity is always more memorable than perfection.',
    notesKicker: 'QUICK NOTES',
    notesTitle: 'Recent notes',
    all: 'View all',
    notes: [
      'Evening breeze and the first line of fresh code.',
      'Reading is not collecting quotes—it is changing views.',
      'A small thought that clicked during a walk.',
    ],
    explore: 'EXPLORE',
    topicsTitle: 'Browse by topic',
    topics: ['Frontend', 'Learning', 'Life notes', 'Projects', 'Reading'],
    footerWish: 'May we all keep a quiet place where ideas can grow.',
    built: 'Built with curiosity.',
    searchPlaceholder: 'Search articles, tags or keywords…',
    suggested: 'Suggested',
    suggestions: ['Digital garden', 'Learning', 'Frontend'],
    searchHint: 'Live results will appear here after the article data is connected.',
  },
} as const;

function ArticleVisual({ post }: { post: Post }) {
  return (
    <div className={`article-visual visual-${post.accent}`} aria-hidden="true">
      {post.visual === 'window' && <div className="mini-window"><span>•••</span><i /><i /><i /></div>}
      {post.visual === 'steps' && <div className="mini-steps"><i /><i /><i /><i /></div>}
      {post.visual === 'sun' && <div className="mini-sun"><i /><span>07</span></div>}
      {post.visual === 'orbit' && <div className="mini-orbit"><i /><i /><span /></div>}
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('zh');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState<CategoryId>('all');
  const c = translations[language];

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('blog-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextTheme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';
    const savedLanguage = window.localStorage.getItem('blog-language');
    const nextLanguage: Language = savedLanguage === 'en' ? 'en' : 'zh';
    setTheme(nextTheme);
    setLanguage(nextLanguage);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.lang = nextLanguage === 'zh' ? 'zh-CN' : 'en';
  }, []);

  useEffect(() => {
    document.title = c.pageTitle;
  }, [c.pageTitle]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSearchOpen(false);
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const filteredPosts = useMemo(
    () => category === 'all' ? posts : posts.filter((post) => post.category === category),
    [category],
  );

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('blog-theme', next);
  };

  const toggleLanguage = () => {
    const next: Language = language === 'zh' ? 'en' : 'zh';
    setLanguage(next);
    setCategory('all');
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    window.localStorage.setItem('blog-language', next);
  };

  return (
    <div className={`site-shell lang-${language}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label={`${c.brand} home`}>
            <span className="brand-mark">{c.mark}</span>
            <span className="brand-copy"><strong>{c.brand}</strong><small>{c.tagline}</small></span>
          </a>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <a className="is-active" href="#top" onClick={() => setMenuOpen(false)}>{c.nav[0]}</a>
            <a href="#articles" onClick={() => setMenuOpen(false)}>{c.nav[1]}</a>
            <a href="#notes" onClick={() => setMenuOpen(false)}>{c.nav[2]}</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>{c.nav[3]}</a>
          </nav>

          <div className="header-actions">
            <button className="icon-button search-button" type="button" onClick={() => setSearchOpen(true)} aria-label={c.searchAria}>
              <span aria-hidden="true">⌕</span><small>{c.search}</small><kbd>⌘ K</kbd>
            </button>
            <button className="icon-button language-button" type="button" onClick={toggleLanguage} aria-label={c.languageAria}>
              {language === 'zh' ? 'EN' : '中'}
            </button>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label={c.themeAria}>
              <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            </button>
            <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={c.menuAria} aria-expanded={menuOpen}>
              <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero section-frame" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><i /> {c.eyebrow}</span>
            <h1 id="hero-title">{c.heroLine1}<span>{c.heroLine2}</span></h1>
            <p>{c.intro}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#articles">{c.start} <span>↘</span></a>
              <a className="text-link" href="#about">{c.meet} <span>→</span></a>
            </div>
            <dl className="hero-stats" aria-label="Blog statistics">
              {c.stats.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
            </dl>
          </div>

          <div className="hero-feature" aria-label={c.weekly}>
            <div className="feature-card">
              <div className="feature-topline"><span>{c.weekly}</span><span>NO. 08</span></div>
              <div className="feature-art" aria-hidden="true">
                <div className="paper paper-back" />
                <div className="paper paper-front"><i /><i /><i /><span>{c.mark}</span></div>
                <div className="floating-dot dot-a" /><div className="floating-dot dot-b" /><div className="floating-star">✦</div>
              </div>
              <div className="feature-content">
                <span className="feature-tag">{c.garden}</span>
                <h2>{c.featureTitle}</h2>
                <p>{c.featureExcerpt}</p>
                <a href="#articles">{c.readNote} <span>→</span></a>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {c.marquee.concat(c.marquee).map((item, index) => (
              <span className="marquee-pair" key={`${item}-${index}`}><span>{item}</span><i>✦</i></span>
            ))}
          </div>
        </div>

        <section className="content-section section-frame" id="articles" aria-labelledby="articles-title">
          <div className="articles-column">
            <div className="section-heading">
              <div><span className="section-kicker">{c.latestKicker}</span><h2 id="articles-title">{c.latest}</h2></div>
              <a href="#articles">{c.archive} <span>↗</span></a>
            </div>

            <div className="filter-row" aria-label="Article categories">
              {categories.map((item) => (
                <button key={item} className={category === item ? 'is-active' : ''} type="button" onClick={() => setCategory(item)}>
                  {categoryLabels[item][language]}
                </button>
              ))}
            </div>

            <div className="article-list" aria-live="polite">
              {filteredPosts.map((post, index) => (
                <article className="article-card" key={post.title.en}>
                  <ArticleVisual post={post} />
                  <div className="article-copy">
                    <div className="article-meta"><span>{categoryLabels[post.category][language]}</span><time>{post.date}</time></div>
                    <h3><a href={`#post-${index}`}>{post.title[language]}</a></h3>
                    <p>{post.excerpt[language]}</p>
                    <div className="article-footer">
                      <span>{post.readTime[language]} {c.readSuffix}</span>
                      <a href={`#post-${index}`} aria-label={`${c.fullArticle}: ${post.title[language]}`}>{c.fullArticle} <span>→</span></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="sidebar" aria-label="Blog sidebar">
            <section className="profile-card" id="about">
              <div className="profile-top">
                <div className="avatar" aria-hidden="true"><span>Hi</span></div>
                <span className="status"><i /> {c.status}</span>
              </div>
              <span className="handwritten">{c.hello}</span>
              <h2>{c.bioTitle}</h2>
              <p>{c.bio}</p>
              <div className="social-row" aria-label="Social links">
                <a href="#github" aria-label="GitHub">GH</a><a href="#email" aria-label="Email">@</a><a href="#rss" aria-label="RSS">RSS</a>
              </div>
            </section>

            <section className="side-card" id="notes">
              <div className="side-title"><div><span>{c.notesKicker}</span><h2>{c.notesTitle}</h2></div><a href="#notes">{c.all}</a></div>
              <ul className="notes-list">
                {c.notes.map((note, index) => <li key={note}><time>{['08.21', '08.09', '07.28'][index]}</time><a href={`#note-${index}`}>{note}</a></li>)}
              </ul>
            </section>

            <section className="side-card">
              <div className="side-title"><div><span>{c.explore}</span><h2>{c.topicsTitle}</h2></div></div>
              <div className="topic-cloud">
                {c.topics.map((topic, index) => <a href="#topic" key={topic}>{topic} <b>{[12, 8, 16, 6, 9][index]}</b></a>)}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-frame footer-inner">
          <div><span className="brand-mark small">{c.mark}</span><p>{c.footerWish}</p></div>
          <p>© 2026 {c.brand} · {c.built}</p>
        </div>
      </footer>

      {searchOpen && (
        <div className="search-overlay" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="search-input-wrap">
              <span aria-hidden="true">⌕</span>
              <label className="sr-only" htmlFor="site-search" id="search-title">{c.searchAria}</label>
              <input id="site-search" autoFocus placeholder={c.searchPlaceholder} />
              <button type="button" onClick={() => setSearchOpen(false)}>ESC</button>
            </div>
            <div className="search-suggestions">
              <span>{c.suggested}</span>
              {c.suggestions.map((item) => <button type="button" key={item}>{item}</button>)}
            </div>
            <p>{c.searchHint}</p>
          </section>
        </div>
      )}
    </div>
  );
}
