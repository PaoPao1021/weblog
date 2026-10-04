# Personal OS Portfolio

A personal homepage shaped like a small desktop environment: selected work, a digital garden, a compact profile, command palette, and a simulated terminal. It is a static React application built to publish on GitHub Pages without a backend.

![Personal OS desktop](docs/screenshots/desktop-light.png)

[Dark appearance](docs/screenshots/desktop-dark.png) · [Selected projects](docs/screenshots/projects-light.png)

## Features

- Glass-inspired desktop surface with light, dark, and system themes
- Draggable desktop windows and a compact sheet experience on smaller screens
- Projects with detail views and local SVG cover art
- Markdown-powered notes with tag filtering, related notes, GFM tables, and code-copy controls
- Keyboard command palette and a safe simulated terminal
- Desktop pointer-responsive controls, distance-aware Dock, and subtle animated Lucide icons
- Hash-based deep links that work on GitHub Pages project sites
- Local-first personal content and no runtime API calls

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS and CSS design tokens
- Framer Motion
- Lucide icons
- react-markdown + remark-gfm

## Getting started

Use Node.js 22.18 or newer (`.nvmrc` selects Node 22).

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
npm run test:pages
npm run preview
```

`npm run build` also generates the static SEO files. End-to-end tests exist as a local command (`npm run test:e2e`) but are intentionally not part of the initial Pages deployment workflow.

For browser tests, install Chromium once with `npx playwright install chromium`, then run `npm run test:e2e`. To use an installed Google Chrome instead, run `PW_CHANNEL=chrome npm run test:e2e`. Add `-- --project=desktop` to run just the desktop checks.

`npm run test:pages` verifies a production build served from `/pages-check/` with an ordinary static server. It checks asset and SEO paths, hash-route entry delivery, and genuine 404s without rewrite rules, then restores the normal production build. Avoid running it concurrently with another production build.

## Configuration

Personal metadata lives in [`src/config/site.ts`](src/config/site.ts):

- Replace `name`, `username`, hero text, About copy, and the Currently section.
- GitHub currently links to [PaoPao1021](https://github.com/PaoPao1021). Set `email` and `resume` when ready. Unconfigured email and resume controls show an unavailable message on the home screen; About displays their configuration status.
- Set `siteUrl` to the final public URL before publishing so canonical and social metadata can be generated.
- Update `version` and `lastUpdated` when releasing meaningful changes.

Selected work is stored in [`src/data/projects.ts`](src/data/projects.ts). Each project has a stable `id`, description, stack, status, cover, optional GitHub/demo links, and detail content. Replace the three clearly-labelled placeholder records and their SVG covers in `public/images/projects/` with your own work.

Notes are local Markdown strings in [`src/data/notes.ts`](src/data/notes.ts). Add a unique `id`, ISO date, short description, tags, and Markdown content. Notes use tags for filtering and for choosing related reading.

Theme tokens and content typography are kept in `src/styles/`; adjust these instead of scattering colors through individual components. Assets should go through `assetUrl()` so they work from both a site root and a repository subpath.

See [architecture](docs/ARCHITECTURE.md) and [material / motion decisions](docs/DESIGN.md) for module responsibilities and the Liquid Glass reference adaptations. Desktop motion uses `interactions.css`; reduced-motion preferences are respected throughout.

## Deployment to GitHub Pages

The included workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on pushes to `main` and can also be started manually. It uses Node 22, installs from the lockfile, then runs type checking, linting, unit tests, the production build, and the official GitHub Pages deploy actions.

Before the first deployment:

1. Push this project to a GitHub repository and ensure its default branch is `main`.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Set `siteUrl` in `src/config/site.ts` to the final URL, such as `https://username.github.io/repository-name/` for a project site or `https://username.github.io/` for a user site.
4. Push to `main` or run the **Deploy GitHub Pages** workflow manually.

The workflow reads the base path from `actions/configure-pages`, passes it to Vite as `VITE_BASE_PATH`, and sets `SITE_URL` from the same Pages configuration. This covers both root sites and project repositories without hard-coding a repository name.

This repository's configured Pages address is `https://paopao1021.github.io/weblog/`. Changes in the local workspace require a push to `main` before the deployment workflow publishes them.

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
- [x] Link the GitHub profile and configure the Pages site URL.
- [ ] Add email and resume.
- [ ] Replace project records, covers, screenshots, and optional links.
- [ ] Add notes that reflect your own interests and work.
- [x] Capture and add interface screenshots to this README.
- [ ] Enable GitHub Pages and confirm the deployed subpath in a production browser.
