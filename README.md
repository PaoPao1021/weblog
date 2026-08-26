# 浮光笔记 · Afterglow Notes

一个面向技术实践、学习方法与生活记录的双语个人数字花园。站点使用中文与英文独立路由，内容由构建时校验的 Markdown/MDX 文件驱动，并面向 OpenAI Sites / Cloudflare Workers 运行环境构建。

## 功能

- 中文 `/zh` 与英文 `/en` 独立网址
- 首页、文章列表、文章详情、归档、分类、标签、随笔和关于页
- 深浅主题、移动端导航和 `Ctrl/⌘ + K` 全文搜索
- Zod 校验文章头部数据，自动发现新增 `.md` / `.mdx` 内容
- 草稿隔离、翻译配对、阅读时长、上一篇/下一篇
- 页面级 canonical、hreflang、Open Graph 与 X 元数据
- Cloudflare Worker 兼容的无动态代码执行 Markdown 渲染

## 本地开发

需要 Node.js 22.13 或更高版本。

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000`。提交前运行：

```bash
npm run lint
npm run build
npm audit --omit=dev
```

## 添加文章

在 `content/posts/<translation-key>/` 中添加 `zh.md` 或 `en.md`。文件需包含以下头部数据：

```yaml
---
schemaVersion: 1
translationKey: example-post
locale: zh-CN
slug: example-post
status: published
title: 示例文章
description: 一句话摘要
publishedAt: '2026-08-26T09:00:00+08:00'
updatedAt: '2026-08-26T09:00:00+08:00'
category: building
tags: [frontend, writing]
featured: false
accent: violet
visual: window
---
```

`status` 可选 `draft`、`review`、`published` 或 `archived`；只有 `published` 会进入页面与搜索索引。分类、标签和双语版本由构建自动发现，无需维护源码清单。

## 环境变量

- `NEXT_PUBLIC_SITE_URL`：生产站点的绝对地址，用于 canonical 和分享元数据。未设置时使用当前 Sites 生产地址。

## 部署

项目包含 `.openai/hosting.json`，可直接通过 OpenAI Sites 构建和发布。生产部署前请设置 `NEXT_PUBLIC_SITE_URL`。

## License

源码保留所有权利；文章内容未经许可请勿转载。
