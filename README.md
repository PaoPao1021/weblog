# Personal OS Portfolio

A personal homepage shaped like a small desktop environment: selected work, a digital garden, a compact profile, command palette, and a simulated terminal. It is a static React application built to publish on GitHub Pages without a backend.

> Screenshot placeholder: add a desktop overview image here after making the site your own.

## Features

- Glass-inspired desktop surface with light, dark, and system themes
- Draggable desktop windows and a compact sheet experience on smaller screens
- Projects with detail views and local SVG cover art
- Markdown-powered notes with tag filtering, related notes, GFM tables, and code-copy controls
- Keyboard command palette and a safe simulated terminal
- Hash-based deep links that work on GitHub Pages project sites
- Local-first personal content and no runtime API calls
- English / Simplified Chinese interface, translated notes, and persistent language preference
- GitHub profile and seven public repository links, including explicit fork labels

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS and CSS design tokens
- Framer Motion
- Lucide icons
- react-markdown + remark-gfm

## Getting started

Use Node.js 22 or newer.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

`npm run build` also generates the static SEO files. The separate **Validate changes** workflow runs type checking, lint, unit tests, a repository-subpath build, and desktop/mobile browser tests on pull requests and pushes to `main`. It does not require GitHub Pages to be enabled. The Pages deployment workflow remains separate.

For browser tests, install Chromium once with `npx playwright install chromium`, then run `npm run test:e2e`. To use an installed Edge browser in PowerShell, run `$env:PW_CHANNEL='msedge'` first. The browser tests cover navigation, accessibility, focus restoration, and keyboard escape from terminal completion.

When testing a subpath build locally, keep `VITE_BASE_PATH` set to the same value for both `npm run build` and `npm run preview` (for example, `/weblog/`), then open that subpath in the preview server.

## Configuration

### Languages and GitHub

Use the **中 / EN** button in the header to switch languages. System settings also provide language controls while a window is open. On the first visit, Chinese browser locales select Simplified Chinese; other locales select English. An explicit choice takes priority and is saved locally. Switching languages keeps window state and hash routes intact. Search accepts English and Chinese titles.

Interface translations are in `src/i18n/zh.json`; Chinese Markdown articles are in `src/i18n/notes-zh.ts`. English remains the source language. Add translations alongside new content; technical names, commands, URLs and code samples are preserved.

The configured profile is [PaoPao1021](https://github.com/PaoPao1021). `src/data/github-repositories.json` contains the public repository snapshot fetched on September 20, 2026. The project window displays those repositories first; the original template studies remain inside a separate collapsible section. The command palette also searches repository names. All repository links open GitHub directly; no API token or runtime fetch is required.

To add or refresh repositories, update the snapshot's `name`, `description`, `url`, `language`, `fork`, and `archived` fields from public GitHub metadata. Keep the snapshot date in `GitHubRepositories.tsx` and its translated label current. Optional English translations of Chinese repository descriptions live in that component. This is a static list, not a live sync; use **All repositories** for the current GitHub listing.

Personal metadata lives in [`src/config/site.ts`](src/config/site.ts):

- Replace `name`, `username`, hero text, About copy, and the Currently section.
- Set `github`, `email`, and `resume` when those destinations are ready. `null` renders an honest “Not configured” state.
- Set `siteUrl` to the final public URL before publishing so canonical and social metadata can be generated.
- Update `version` and `lastUpdated` when releasing meaningful changes.

Selected work is stored in [`src/data/projects.ts`](src/data/projects.ts). Each project has a stable `id`, description, stack, status, cover, optional GitHub/demo links, and detail content. Replace the three clearly-labelled placeholder records and their SVG covers in `public/images/projects/` with your own work.

Notes are local Markdown strings in [`src/data/notes.ts`](src/data/notes.ts). Add a unique `id`, ISO date, short description, tags, and Markdown content. Notes use tags for filtering and for choosing related reading.

Theme tokens and content typography are kept in `src/styles/`; adjust these instead of scattering colors through individual components. Assets should go through `assetUrl()` so they work from both a site root and a repository subpath.

## Deployment to GitHub Pages

The included workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on pushes to `main` and can also be started manually. It uses Node 22, installs from the lockfile, then runs type checking, linting, unit tests, the production build, and the official GitHub Pages deploy actions.

Before the first deployment:

1. Push this project to a GitHub repository and ensure its default branch is `main`.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Set `siteUrl` in `src/config/site.ts` to the final URL, such as `https://username.github.io/repository-name/` for a project site or `https://username.github.io/` for a user site.
4. Push to `main` or run the **Deploy GitHub Pages** workflow manually.

The workflow reads the base path from `actions/configure-pages`, passes it to Vite as `VITE_BASE_PATH`, and sets `SITE_URL` from the same Pages configuration. This covers both root sites and project repositories without hard-coding a repository name.

For a custom domain, configure the domain in GitHub Pages, then set `siteUrl` to the final HTTPS custom-domain URL. Keep the Pages workflow enabled; it will continue to provide the correct asset base path.

## Routes and SEO

The site uses hash routes, for example:

```text
#/projects/project-one
#/notes/designing-for-focus
```

This keeps deep links refresh-safe on static hosting because the server only needs to return the main `index.html`. It also means individual hash routes are client-side states, not separate crawlable documents. The generated sitemap and social metadata describe the site homepage; they do not claim unique SEO pages for every project or note.

If an image or JavaScript file 404s after deployment, verify that it is referenced with `assetUrl()` (or Vite’s base-aware asset handling) rather than a hard-coded root path such as `/images/...`.

## Project structure

```text
src/app/                 routes, providers, and desktop state
src/components/          desktop, windows, dock, command palette, terminal, shared UI
src/config/site.ts       personal metadata
src/data/                projects and notes
src/styles/              theme tokens, layout, and typography
public/                  local images and other static assets
scripts/                 build-time SEO generation
.github/workflows/       GitHub Pages deployment
```

## Customization checklist

- [ ] Replace `Your Name` and all placeholder prose.
- [ ] Add GitHub, email, resume, and final `siteUrl` values.
- [ ] Replace project records, covers, screenshots, and optional links.
- [ ] Add notes that reflect your own interests and work.
- [ ] Capture and add real screenshots to this README.
- [ ] Enable GitHub Pages and confirm the deployed subpath in a production browser.
