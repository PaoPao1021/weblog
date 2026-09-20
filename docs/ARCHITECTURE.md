# Personal OS — architecture

## Directory map

```text
src/
  app/                    Application composition, route and window state
  components/
    ui/                   Shared glass surfaces, controls, Markdown and errors
    desktop/              Environment, Hero and window frame
    windows/
      projects/           Selected work and project reading view
      notes/              Digital garden and Markdown reading view
      about/              Profile and current interests
      system/             Local system status
    dock/                 Application navigation
    command/              Search and keyboard commands
    terminal/             Simulated shell and command parser
  config/site.ts          Single source of personal information
  data/                   Local project and note records
  hooks/                  Theme, viewport and focus behavior
  utils/                  Resource URL and reusable pure helpers
  styles/                 Tokens, desktop layout and content typography
public/                   Local, base-aware static resources
scripts/                  Build-time SEO metadata generation
tests/unit/               State transitions, routes and command behavior
tests/e2e/                Browser journeys and accessibility interactions
.github/workflows/        Static GitHub Pages deployment
```

## Contracts

- `AppId` is projects, notes, about, terminal or system. Home has no app.
- Content components accept `{ item?: string, navigate(app, item?) }`.
- Hash routes identify the active application and optional content ID.
- The desktop owns window lifecycle; applications own filters and inputs.
- One instance per application. Minimize preserves state; close resets it.
- Desktop uses nonmodal windows. Compact/coarse-pointer mode uses one sheet.
- All personal text comes from `siteConfig`; editorial records live in data modules.
- Assets use `assetUrl`; deployment provides `VITE_BASE_PATH` and optional `SITE_URL`.
- No shell execution, remote database, API credentials, or runtime backend.

## Implementation sequence

1. Foundation and design system.
2. Hero, environment and main navigation.
3. Window manager and hash routes.
4. Projects, Notes and About.
5. Dock integration.
6. Command palette.
7. Terminal and system status.
8. Responsive and accessibility refinement.
9. Motion, performance and browser checks.
10. Pages, SEO and documentation.

Typecheck, lint and production build are integration gates. Parallel content modules are integrated behind these gates before final browser validation.
