import type { CategoryId, Language } from './i18n';

type Localized = Record<Language, string>;

export type Post = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  category: Exclude<CategoryId, 'all'>;
  date: string;
  readTime: Localized;
  accent: 'violet' | 'blue' | 'orange' | 'green';
  visual: 'window' | 'steps' | 'sun' | 'orbit';
};

export const posts: Post[] = [
  { slug: 'build-my-digital-garden', title: { zh: '我如何搭建这座小小的数字花园', en: 'How I built this little digital garden' }, excerpt: { zh: '从域名、设计到内容结构，记录一个个人博客从想法变成真实网址的全过程。', en: 'From domain and visual design to content structure—a field note on turning an idea into a real home on the web.' }, category: 'building', date: '2026.08.18', readTime: { zh: '8 分钟', en: '8 min' }, accent: 'violet', visual: 'window' },
  { slug: 'reusable-learning-paths', title: { zh: '把复杂的学习，整理成可以复用的路径', en: 'Turning complex learning into reusable paths' }, excerpt: { zh: '笔记的价值不只是记住，而是让下一次遇见相似问题时，能够更快地重新出发。', en: 'Notes are not only for remembering. They help us restart faster when a familiar problem returns.' }, category: 'learning', date: '2026.08.12', readTime: { zh: '6 分钟', en: '6 min' }, accent: 'blue', visual: 'steps' },
  { slug: 'july-collection', title: { zh: '七月收藏夹：让我停下来多看一会儿的事物', en: 'July collection: things worth a longer look' }, excerpt: { zh: '一组近期喜欢的书、网站、声音和生活片段，也是一份写给未来自己的月度切片。', en: 'Books, websites, sounds and small moments I loved lately—a monthly slice saved for my future self.' }, category: 'life', date: '2026.07.30', readTime: { zh: '5 分钟', en: '5 min' }, accent: 'orange', visual: 'sun' },
  { slug: 'first-indie-project', title: { zh: '写给第一次独立做项目的自己', en: 'A note to my first-time indie-builder self' }, excerpt: { zh: '别急着把所有功能塞进第一版。先做出一个能被看见、能被使用的完整小闭环。', en: 'Do not force every feature into version one. Start with one complete loop people can see and use.' }, category: 'project', date: '2026.07.21', readTime: { zh: '7 分钟', en: '7 min' }, accent: 'green', visual: 'orbit' },
];
