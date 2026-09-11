# Header, Footer, and Locale Control Refresh

- Status: accepted
- Date: 2026-09-11
- Owners: Design Skill Arena maintainers
- Scope: shared arena chrome (`ArenaShell`), locale copy (`arenaCopy`), homepage hero
- Supersedes: none
- Superseded by: none

## Context

Four maintainer requests on the shared chrome: judge whether the homepage brief block carries
meaning, replace the wordless copy-prompt control with an icon plus label, surface the
maintainer's personal site, and shrink the two-button locale switch.

The brief block (`共同任务 / Muse · AI Campaign Studio`) is the only plain-language statement of
the shared task and the entry point to `/methodology/#brief`, so it is not redundant. The problem
was placement: it sat inside the hero next to the headline, and pages other than the homepage had
no path to it. Decision: keep the block, move it into the shared footer so all three pages carry
it, and leave the `项目简报` nav item untouched.

## Evidence

| Claim | Kind | Source and environment | Observed | Reference | Freshness / redaction |
| --- | --- | --- | --- | --- | --- |
| The brief block previously rendered only in the homepage hero; `/skills/` and `/methodology/` had no link to `/methodology/#brief`. | fact | local repository, dev server | 2026-09-11 | `src/components/arena/home-page.tsx` before this change | current checkout; no secrets |
| The moved block renders in the shared footer on all three pages, with the hero headline intact. | fact | local repository, built `out/` served over HTTP | 2026-09-11 | `/`, `/skills/`, `/methodology/` screenshots in `/tmp/arena-verify/` | current checkout; no secrets |
| No horizontal overflow is introduced at any tested width. | fact | Playwright 1.62.1, viewports 1440 / 900 / 390 | 2026-09-11 | `document.documentElement.scrollWidth === clientWidth` on all 9 page × width combinations | current checkout; no secrets |
| The locale control switches locale, updates `document.documentElement.lang`, and encodes `?lang=en`. | fact | Playwright click sequence on the built export | 2026-09-11 | `lang="en"`, summary mark `EN`, URL `?lang=en` | current checkout; no secrets |
| `pnpm typecheck`, `pnpm lint`, `pnpm test`, and the static export still pass. | fact | local repository | 2026-09-11 | 0 type errors, 0 lint errors (60 pre-existing warnings), 34/34 tests, `next build` exit 0 | current checkout; no secrets |

## Changes

| Surface | Before | After |
| --- | --- | --- |
| Homepage hero | headline + brief block | headline only; brief block moved to the shared footer |
| Copy-prompt control (header) | icon only, `复制提示词` as the accessible name | `Copy` icon + visible `复制提示词` / `Copy prompt` label |
| Locale control | two pressed-state buttons (`中文` / `English`) in a bordered pill | globe icon + current locale mark (`中` / `EN`), 148px dropdown with a check on the active option |
| Header cluster | prompt, GitHub | prompt, GitHub, `yanqing.li` |
| Mobile menu | nav, prompt, GitHub | nav, prompt, personal site, GitHub, both locales |
| Footer | project lines + `贡献作品` | project lines + brief block + personal site + `贡献作品` |

Both dropdowns in the header are mutually exclusive and close on outside pointer-down, matching
the existing `SearchFilter` interaction. Below 767px the standalone locale switcher and the text
outbound links are hidden; their content moves into the hamburger menu so nothing is lost on
mobile. The `promptAction` and `copyContribution` strings were added to `arenaCopy`, which also
removed the last hardcoded locale ternary in the prompt dialog label.

## Consequences

- The personal site is linked from every arena page, in two places per viewport.
- `arenaCopy` gains `authorSite`, `language`, `promptAction`, and `copyContribution`; `i18n.ts` is
  untouched and remains in use by `site-footer.tsx` for legacy routes.
- Local `desktop.png` captures stay untracked by design; only `desktop.webp` is committed, per
  `README.md`.
