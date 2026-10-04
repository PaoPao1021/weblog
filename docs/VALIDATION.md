# Verification — 2026-09-22

This pass focuses on desktop interactions and GitHub profile navigation.

| Check | Result |
| --- | --- |
| TypeScript and ESLint | Passed |
| Unit tests | 14 passed |
| Desktop browser tests | 8 passed using local Google Chrome |
| GitHub Pages subpath build | Passed; assets, metadata, hash navigation, and missing-file responses verified |
| Production build | Passed |
| Lighthouse desktop | Performance 99, accessibility 100, best practices 100, SEO 100 |

The desktop browser run covers application navigation, window behavior, keyboard commands, accessibility, pointer-distance Dock scaling, pointer exit recovery, and reduced-motion behavior. Run it with:

```sh
PW_CHANNEL=chrome npm run test:e2e -- --project=desktop --grep-invert 'navigation stays inside'
```

The Lighthouse report is `lighthouse-desktop.json`, measured against the local production preview. These are lab results, not measurements of the deployed site. Mobile optimization was outside this interaction pass.

GitHub profile and Pages URLs are configured for `PaoPao1021`. Profile navigation does not require authentication or an API token. The latest changes remain local until committed and pushed; the existing Pages workflow deploys from `main`.

## Button regression fix — 2026-10-04

- Removed the 1024px motion gate: fine mouse pointers receive feedback in narrow desktop windows too.
- Kept button hit areas stationary and preserved the Projects gradient during hover, preventing edge hover oscillation and abrupt background changes.
- Added visible hover feedback for personal links and explicit unavailable messages for the unconfigured email and resume.
- Verified at 877px and 1440px: all three application buttons open their windows, stationary edge hover stays active across 24 frames, and link feedback appears.
- Final verification: 10 desktop browser tests and 14 unit tests passed; TypeScript, ESLint, production build, and whitespace checks passed. The Lighthouse results above belong to the earlier September pass.


## Pre-commit review — 2026-10-04

Reviewed the accumulated source changes, static verification script, regression tests, and light/dark desktop screenshots. Replaced the shared star icon with a dedicated Brand component and matching favicon; removed obsolete brand styles and corrected the README's unavailable-link behavior. No blocking findings remain in this review. Desktop checks include the Home label alignment and brand navigation back from an open project. September Lighthouse metrics remain historical.
