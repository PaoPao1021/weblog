---
schemaVersion: 1
translationKey: build-my-digital-garden
locale: en
slug: build-my-digital-garden
status: published
title: How I built this little digital garden
description: A field note on content structure, bilingual routes, and the visual details that turned an idea into a real place on the web.
publishedAt: '2026-08-18T09:00:00+08:00'
updatedAt: '2026-08-26T18:00:00+08:00'
category: building
tags: [frontend, digital-garden, writing]
featured: true
accent: violet
visual: window
---

I wanted a place that would not disappear in a fast-moving feed. It did not need to be complicated, but it had to make room for a complete thought and remain easy to revisit years later.

## Decide how content can grow

Before animation or an admin panel, I answered three questions: where writing lives, whether its address stays stable, and how Chinese and English editions relate. Each story now has a durable `slug` and `translationKey`, while the body lives in an independent MDX file.

## Let the URL express language

Chinese pages live under `/zh` and English pages under `/en`. A shared link therefore points to one explicit edition, and search engines no longer need to infer a client-side language state.

## Keep a handmade edge

Paper, pencil notes, and late-afternoon light shaped the visual language. Restrained color, generous space, and a few hand-drawn details make the site feel more like a familiar desk than a productivity dashboard.

## What comes next

The next step is connecting writing, validation, search, RSS, and backups into one dependable loop. A personal site earns its value not on launch day, but when it is still pleasant to maintain years later.
