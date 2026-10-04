# PaoPao1021 · Personal OS

A personal homepage shaped like a small desktop environment: selected work, a digital garden, a compact profile, command palette, and a simulated terminal. It is a static React application built to publish on GitHub Pages without a backend.

[Live website](https://paopao1021.github.io/weblog/) · [Projects](https://paopao1021.github.io/weblog/#/projects) · [GitHub profile](https://github.com/PaoPao1021) · [Source repository](https://github.com/PaoPao1021/weblog) · [All GitHub repositories](https://github.com/PaoPao1021?tab=repositories)

![Personal OS desktop](docs/screenshots/desktop-light.png)

[Dark appearance](docs/screenshots/desktop-dark.png) · [Selected projects](docs/screenshots/projects-light.png)

## Features

- Glass-inspired desktop surface with light, dark, and system themes
- Draggable desktop windows and a compact sheet experience on smaller screens
- Projects with detail views and local SVG cover art
- Markdown-powered notes with tag filtering, related notes, GFM tables, and code-copy controls
- Keyboard command palette and a safe simulated terminal
- Desktop pointer-responsive controls, distance-aware Dock, and subtle animated Lucide icons
- Original two-window brand mark with a matching favicon and keyboard-accessible home action
- Control Center for appearance, wallpaper, interface sound effects, ambient audio, and a local Do Not Disturb preference
- Desktop widget with a clock, ambient audio player, focus timer, daily prompt, and locally saved scratchpad
- Four wallpaper styles: Aurora Glass, Sunset Ember, Misty Forest, and Cosmic Void
- Desktop context menu, keyboard shortcut help, and terminal commands such as `neofetch` and `cowsay`
- Hash-based deep links that work on GitHub Pages project sites
- Local-first personal content and no runtime API calls
- English / Simplified Chinese interface, translated notes, and persistent language preference
- GitHub profile and nine public repository links, including explicit fork labels

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS and CSS design tokens
- Framer Motion
- Lucide icons
- react-markdown + remark-gfm

## Getting started

Use Node.js 22.18 or newer (`.nvmrc` selects Node 22). Clone the project and install the locked dependencies:

```bash
git clone https://github.com/PaoPao1021/weblog.git
cd weblog
npm ci
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

`npm run build` also generates the static SEO files. The separate **Validate changes** workflow runs type checking, lint, unit tests, a repository-subpath build, and desktop/mobile browser tests on pull requests and pushes to `main`. It does not require GitHub Pages to be enabled. The Pages deployment workflow remains separate.

For browser tests, install Chromium once with `npx playwright install chromium`, then run `npm run test:e2e`. To use installed Google Chrome on macOS or Linux, run `PW_CHANNEL=chrome npm run test:e2e`. For installed Edge in PowerShell, set `$env:PW_CHANNEL='msedge'` first. Add `-- --project=desktop` to run only desktop checks. Browser tests cover navigation, accessibility, focus restoration, pointer feedback, Control Center, widgets, language persistence, real repository links, and keyboard escape from terminal completion.

When testing a subpath build locally, keep `VITE_BASE_PATH` set to the same value for both `npm run build` and `npm run preview` (for example, `/weblog/`), then open that subpath in the preview server.

`npm run test:pages` verifies a production build served from `/pages-check/` with an ordinary static server. It checks asset and SEO paths, hash-route entry delivery, and genuine 404s without rewrite rules, then restores the normal production build. Avoid running it concurrently with another production build.

## Using the desktop

- Click the brand mark or **Home** in the Dock to return to the desktop; open applications from the Dock or homepage buttons.
- Use **Cmd/Ctrl + K** to search applications, notes, projects, repository names, and appearance commands. Use the arrow keys and Enter to choose a result, and Escape to close.
- Press **?** outside a text field to open keyboard shortcut help. Right-click the desktop background for its context menu.
- Open **Control Center** from the header to change appearance, wallpaper, and audio controls. These controls apply within the website.
- Use the widget tabs to switch between the clock, ambient audio, focus timer, daily prompt, and scratchpad. The scratchpad saves in this browser's local storage.
- Open **Terminal** and enter `help` for available commands. Commands run in the simulated site terminal.

## Configuration

### Languages and GitHub

Use the **中 / EN** button in the header to switch languages. System settings also provide language controls while a window is open. On the first visit, Chinese browser locales select Simplified Chinese; other locales select English. An explicit choice takes priority and is saved locally. Switching languages keeps window state and hash routes intact. Search accepts English and Chinese titles.

Interface translations are in `src/i18n/zh.json`; Chinese Markdown articles are in `src/i18n/notes-zh.ts`. English remains the source language. Add translations alongside new content; technical names, commands, URLs and code samples are preserved.

The configured profile is [PaoPao1021](https://github.com/PaoPao1021). `src/data/github-repositories.json` contains nine public repositories, refreshed on October 4, 2026. The project window displays those repositories first; the original template studies remain inside a separate collapsible section. The command palette also searches repository names. All repository links open GitHub directly; no API token or runtime fetch is required.

| Project | Source |
| --- | --- |
| Weblog / Personal OS | [weblog](https://github.com/PaoPao1021/weblog) |
| Mahjong advisor | [mahjong-jev-advisor](https://github.com/PaoPao1021/mahjong-jev-advisor) |
| LoveSpace | [LoveSpace](https://github.com/PaoPao1021/LoveSpace) |
| Chat1 | [chat1](https://github.com/PaoPao1021/chat1) |
| LearnTrack | [LearnTrack](https://github.com/PaoPao1021/LearnTrack) |
| Expense tracker | [expense-tracker](https://github.com/PaoPao1021/expense-tracker) |
| Love Space standalone app | [Love-Space-Standalone-App](https://github.com/PaoPao1021/Love-Space-Standalone-App) |
| Asterline (fork) | [Asterline](https://github.com/PaoPao1021/Asterline) |
| Sanke end | [sanke-end](https://github.com/PaoPao1021/sanke-end) |

To add or refresh repositories, update the snapshot's `name`, `description`, `url`, `language`, `fork`, and `archived` fields from public GitHub metadata. Keep the snapshot date in `GitHubRepositories.tsx` and its translated label current. Optional English translations of Chinese repository descriptions live in that component. This is a static list, not a live sync; use **All repositories** for the current GitHub listing.

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

The website is published at [paopao1021.github.io/weblog](https://paopao1021.github.io/weblog/). The October 4, 2026 deployment of `e009c01` succeeded, and the published brand mark and refreshed repository snapshot were verified. For subsequent updates, commit and push to `main`, then check [Deploy GitHub Pages](https://github.com/PaoPao1021/weblog/actions/workflows/deploy.yml). [Validate changes](https://github.com/PaoPao1021/weblog/actions/workflows/checks.yml) runs the separate browser regression checks.

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
src/data/                projects, notes, and public GitHub repository snapshot
src/i18n/                locale provider, interface dictionary, and Chinese notes
src/hooks/               appearance, wallpaper, viewport, and pointer preferences
src/styles/              theme tokens, layout, and typography
public/                  local images and other static assets
scripts/                 build-time SEO generation and Pages subpath verification
tests/                   unit, browser, accessibility, and interaction checks
.github/workflows/       GitHub Pages deployment and CI validation
```

## Verification

The October 4 merge was checked with TypeScript, ESLint, a production build, and Pages subpath verification. Local tests passed: **18 unit tests** and **45 browser tests**, with nine desktop-only cases skipped in the mobile project. See [validation details](docs/VALIDATION.md) for the tested behavior and historical Lighthouse measurements.

## Customization checklist

- [x] Configure the name and username as `PaoPao1021`.
- [ ] Personalize the remaining About copy and template prose.
- [x] Link the GitHub profile and configure the Pages site URL.
- [ ] Add email and resume.
- [x] Link all nine public GitHub repositories.
- [ ] Replace or remove the optional template interface studies and their covers.
- [ ] Add notes that reflect your own interests and work.
- [x] Capture and add interface screenshots to this README.
- [x] Enable GitHub Pages and verify the published subpath and assets.
