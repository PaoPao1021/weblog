export const languages = ['zh', 'en'] as const;

export type Language = (typeof languages)[number];
export type CategoryId = 'all' | 'building' | 'learning' | 'life' | 'project';

export const isLanguage = (value: string): value is Language =>
  languages.includes(value as Language);

export const categoryLabels: Record<CategoryId, Record<Language, string>> = {
  all: { zh: '全部', en: 'All' },
  building: { zh: '建站手记', en: 'Site Notes' },
  learning: { zh: '学习方法', en: 'Learning' },
  life: { zh: '生活切片', en: 'Life' },
  project: { zh: '项目复盘', en: 'Projects' },
};

export const categories = Object.keys(categoryLabels) as CategoryId[];

export const dictionaries = {
  zh: {
    pageTitle: '浮光笔记｜记录学习、生活与创造',
    description: '一座记录技术实践、学习方法与生活片段的双语个人数字花园。',
    brand: '浮光笔记', mark: '浮', tagline: 'Notes between code & life',
    nav: ['首页', '文章', '随笔', '关于'],
    search: '搜索', searchAria: '搜索文章', themeAria: '切换深浅主题',
    languageAria: 'Switch to English', menuAria: '打开导航', skip: '跳到主要内容',
    eyebrow: '一座个人数字花园', heroLine1: '把学习与生活，', heroLine2: '写成一条可回看的路。',
    intro: '你好，我是这座数字花园的主人。这里记录技术实践、学习方法，也收藏那些让普通日子微微发亮的瞬间。',
    start: '开始阅读', meet: '认识我',
    stats: [['28', '篇文章'], ['7', '个主题'], ['2026', '开始记录']],
    weekly: '本周手记', garden: '数字花园', featureTitle: '为什么我们仍然需要一个属于自己的网站？',
    featureExcerpt: '在快速流动的信息里，给长期思考留一块安静的地方。', readNote: '阅读手记',
    marquee: ['慢慢写', '清楚地想', '保持好奇', '记录 · 思考 · 创造'],
    latestKicker: '最近写作', latest: '最近更新', archive: '查看归档', readSuffix: '阅读', fullArticle: '阅读全文',
    status: '正在持续更新', hello: '你好呀！', bioTitle: '一个在学习与创造之间，慢慢搭建世界的人。',
    bio: '相信好的记录会产生复利，也相信真诚比完美更值得被留下。', notesKicker: '随手记录', notesTitle: '最近随笔', all: '全部',
    notes: ['晚风和刚写完的第一行代码。', '读书不是收集句子，是改变看法。', '散步时想通的一件小事。'],
    explore: '探索主题', topicsTitle: '按主题浏览', topics: ['前端开发', '学习方法', '生活随笔', '项目复盘', '阅读笔记'],
    footerWish: '愿我们都能保留一块，安静生长的地方。', built: '以好奇心构建。',
    searchPlaceholder: '搜索文章、标签或关键词…', suggested: '推荐搜索', suggestions: ['数字花园', '学习方法', '前端'],
    searchHint: '正式接入文章数据后，这里会显示实时搜索结果。',
  },
  en: {
    pageTitle: 'Afterglow Notes | Learning, life & making',
    description: 'A bilingual digital garden for technical practice, learning methods, and everyday moments.',
    brand: 'Afterglow Notes', mark: 'A', tagline: 'Notes between code & life',
    nav: ['Home', 'Writing', 'Notes', 'About'],
    search: 'Search', searchAria: 'Search articles', themeAria: 'Toggle color theme',
    languageAria: '切换到中文', menuAria: 'Open navigation', skip: 'Skip to main content',
    eyebrow: 'A PERSONAL DIGITAL GARDEN', heroLine1: 'Turning learning and life', heroLine2: 'into a path worth revisiting.',
    intro: 'Hello, I am the keeper of this digital garden—a place for technical experiments, learning notes, and ordinary moments that quietly glow.',
    start: 'Start reading', meet: 'Meet me',
    stats: [['28', 'articles'], ['7', 'topics'], ['2026', 'since']],
    weekly: 'WEEKLY NOTE', garden: 'DIGITAL GARDEN', featureTitle: 'Why do we still need a place of our own on the web?',
    featureExcerpt: 'A quiet corner for long-term thinking in a fast-moving stream of information.', readNote: 'Read the note',
    marquee: ['WRITE SLOWLY', 'THINK CLEARLY', 'STAY CURIOUS', 'NOTE · THINK · MAKE'],
    latestKicker: 'LATEST WRITING', latest: 'Recent stories', archive: 'View archive', readSuffix: 'read', fullArticle: 'Read article',
    status: 'GROWING WEEKLY', hello: 'Hello there!', bioTitle: 'A person slowly building a world between learning and making.',
    bio: 'I believe good notes compound over time, and sincerity is always more memorable than perfection.', notesKicker: 'QUICK NOTES', notesTitle: 'Recent notes', all: 'View all',
    notes: ['Evening breeze and the first line of fresh code.', 'Reading is not collecting quotes—it is changing views.', 'A small thought that clicked during a walk.'],
    explore: 'EXPLORE', topicsTitle: 'Browse by topic', topics: ['Frontend', 'Learning', 'Life notes', 'Projects', 'Reading'],
    footerWish: 'May we all keep a quiet place where ideas can grow.', built: 'Built with curiosity.',
    searchPlaceholder: 'Search articles, tags or keywords…', suggested: 'Suggested', suggestions: ['Digital garden', 'Learning', 'Frontend'],
    searchHint: 'Live results will appear here after the article data is connected.',
  },
} as const;

export type Dictionary = (typeof dictionaries)[Language];
