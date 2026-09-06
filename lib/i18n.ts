export const languages = ['zh', 'en'] as const;

export type Language = (typeof languages)[number];
export type CategoryId = 'all' | 'building' | 'learning' | 'life' | 'project';

export const isLanguage = (value: string): value is Language =>
  languages.includes(value as Language);

export const categoryLabels: Record<CategoryId, Record<Language, string>> = {
  all: { zh: '全部', en: 'All' },
  building: { zh: '建站手记', en: 'Site Log' },
  learning: { zh: '随想记录', en: 'Thoughts' },
  life: { zh: '生活切片', en: 'Moments' },
  project: { zh: '阶段复盘', en: 'Reviews' },
};

export const categories = Object.keys(categoryLabels) as CategoryId[];

export const dictionaries = {
  zh: {
    pageTitle: '浮光笔记｜记录我的生活与想法',
    description: '我的个人记录平台：写下日常的片段、忽然的想法，以及那些让普通日子微微发亮的瞬间。',
    brand: '浮光笔记', mark: '浮', tagline: 'A record of my days',
    nav: ['首页', '记录', '归档', '随笔', '关于'],
    search: '搜索', searchAria: '搜索记录', themeAria: '切换深浅主题',
    languageAria: 'Switch to English', menuAria: '打开导航', skip: '跳到主要内容',
    heroLine1: '把生活的微光，', heroLine2: '记成一条可回看的路。',
    intro: '这里是我的个人记录平台。写下日常的片段、忽然冒出的想法，也收藏那些让普通日子微微发亮的瞬间——不为教谁什么，只为认真生活。',
    start: '翻看记录', meet: '认识我',
    weekly: '本周记录', garden: '私人记录', featureTitle: '为什么我要拥有一个自己的记录空间？',
    featureExcerpt: '在快速流动的信息里，给自己的日子留一块安静、可回看的地方。', readNote: '阅读这条记录',
    latest: '最近记录', archive: '查看归档', readSuffix: '阅读', fullArticle: '阅读全文',
    status: '持续记录中', hello: '你好呀！', bioTitle: '一个认真生活、随手记录的人。',
    bio: '相信生活值得被记录，微小的瞬间也有回看的温度。',
    notesTitle: '最近随笔', all: '全部',
    notes: ['晚风和今天记下的一句话。', '记录不是为了完美，是为了真实。', '散步时想记下的一件小事。'],
    topicsTitle: '按主题浏览', topics: ['生活切片', '随想记录', '日常碎片', '阶段复盘', '琐碎灵感'],
    offline: '网络连接已断开，当前浏览的是已加载的页面。',
    footerWish: '愿这些被记下的日子，都好好发光。', built: '以真实生活构建。',
    backTop: '回到顶部',
    searchPlaceholder: '搜索记录、主题或关键词…', suggested: '推荐搜索', suggestions: ['生活切片', '随想', '瞬间'],
  },
  en: {
    pageTitle: 'Afterglow Notes | My life, recorded',
    description: 'My personal record platform: everyday fragments, sudden thoughts, and ordinary moments that quietly glow.',
    brand: 'Afterglow Notes', mark: 'A', tagline: 'A record of my days',
    nav: ['Home', 'Records', 'Archive', 'Notes', 'About'],
    search: 'Search', searchAria: 'Search records', themeAria: 'Toggle color theme',
    languageAria: '切换到中文', menuAria: 'Open navigation', skip: 'Skip to main content',
    heroLine1: 'Recording my days,', heroLine2: 'one glowing moment at a time.',
    intro: 'This is my personal record platform—everyday fragments, sudden thoughts, and ordinary moments that quietly glow. Not to teach anyone anything, just to live attentively and keep what matters.',
    start: 'Browse records', meet: 'Meet me',
    weekly: 'THIS WEEK', garden: 'PERSONAL RECORD', featureTitle: 'Why I keep a record of my own on the web?',
    featureExcerpt: 'A quiet, revisit-able corner of my own life in a fast-moving stream of information.', readNote: 'Read the entry',
    latest: 'Recent records', archive: 'View archive', readSuffix: 'read', fullArticle: 'Read entry',
    status: 'RECORDING DAILY', hello: 'Hello there!', bioTitle: 'A person who lives attentively and writes it down.',
    bio: 'I believe life is worth recording, and even tiny moments keep their warmth when revisited.',
    notesTitle: 'Recent notes', all: 'View all',
    notes: ['Evening breeze and one sentence worth keeping.', 'Recording is not about being perfect—it is about being real.', 'A small thing worth noting down during a walk.'],
    topicsTitle: 'Browse by topic', topics: ['Moments', 'Thoughts', 'Daily life', 'Reviews', 'Ideas'],
    offline: 'You are offline. The pages you have already loaded are still available.',
    footerWish: 'May the days I record keep glowing.', built: 'Built from real life.',
    backTop: 'Back to top',
    searchPlaceholder: 'Search records, topics or keywords…', suggested: 'Suggested', suggestions: ['Moments', 'Thoughts', 'Daily life'],
  },
} as const;

export type Dictionary = (typeof dictionaries)[Language];
