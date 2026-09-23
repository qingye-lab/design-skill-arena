# Opus 5.5 — Muse AI Campaign Studio: provenance

- Model name / slug: Opus 5.5 / `opus-5.5`
- Full model identifier: `claude-opus-5-5` (Claude Code agent session; page-building subagents ran on the same model — a 503 capacity error from one of them names `claude-opus-5-5`)
- Generated: 2026-09-23
- Routes: `/model-showcase/opus-5.5/{showcaseId}` for the 18 ids in `index.ts`
- Screenshots: `public/model-screenshots/opus-5.5/{showcaseId}/desktop.png` + `desktop.webp` (sharp, q82), captured 2026-09-23T12:01Z at 1440×900 from `next start` on a fresh production build, Chromium r1243 headless, `prefers-reduced-motion: reduce`, empty localStorage

## Skill sources and revisions

| Skill | Source | Revision |
|---|---|---|
| frontend-app-builder, frontend-skill | openai/skills · openai/plugins | `49f948f` · `1dc1958` |
| frontend-design, web-artifacts-builder / artifacts-builder | anthropics/skills | `34040c9` |
| impeccable | local install `~/.claude/skills/impeccable` (not a git checkout) | SKILL.md `version: 4.3.1`, file dated 2026-09-09 |
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill | `dcc40ff` |
| shadcn-best-practices / shadcn | shadcn-ui/ui | `98a1fe6` |
| react-bits | DavidHDev/react-bits | `c5df861` |
| taste-skill | Leonxlnx/taste-skill | `a6153b3` |
| web-interface-guidelines | vercel-labs/web-interface-guidelines | `e3d624b` |

Every page shares `core.ts` (local state, simulated forecast, localStorage save, file export). The visuals, layout, type, and palettes are written separately for each page.

## Verification (2026-09-23)

- `tsc --noEmit`: exit 0
- `eslint src/components/model-showcases/opus-5.5 src/app/model-showcase/opus-5.5`: exit 0, no warnings. The 60 repo-wide warnings are all in other models' folders.
- `next build`: exit 0, 18 opus-5.5 routes prerendered (the existing chunk-size warning is unrelated)
- Scripted browser pass, one page at a time, desktop 1440×900 and mobile 390×844:
  - every page returns HTTP 200 with no console errors and no iframe
  - no horizontal overflow on mobile or desktop
  - model name and skill chain are visible on every page
  - Generate goes loading → success, Save shows the saved state, and Export downloads a real file on all 18
  - validation error (brief too short) shows on all 18
  - simulated service outage shows its error on all 18
  - keyboard Tab through the first 13–14 stops showed a visible ring on most pages

## Known gaps / unverified by script

- Route-switch automation reports "no-control-found" on several pages. That is a checker limitation: letters are joined to names (e.g. `BNo signal needed`). A separate DOM enumeration confirmed that every page has A/B/C as `role=tab` or a radiogroup. On `impeccable-full-flow` the scripted click on B did not change page text, and this was not investigated further.
- `artifact-builder`: the stale-export error failed inside the long scripted sequence but works when checked on its own.
- The focus check flagged the brief textarea on `design-logic`, `artifact-builder`, and `balanced-chain`, plus a recent-campaign row on `component-system`. Their source has `focus-visible:outline-*` classes, but I did not confirm them by eye.
- `standard-impeccable` route buttons on mobile are 28×44. `component-system` radios are `sr-only` inside full-size labels.
- Mobile layouts were measured, and screenshots were saved outside the repo for review. Only desktop screenshots are committed, as the task asked.
- Visual quality was not scored or ranked, as the task required.
