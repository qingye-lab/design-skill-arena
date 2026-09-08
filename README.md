# Design Skill Arena

[English](./README.md) | [简体中文](./README.zh-CN.md)

<p align="center">
  <strong>One product brief. Multiple AI models and frontend design skill chains.</strong>
</p>

<p align="center">
  <a href="https://arena.xflux.cn"><strong>Explore the live Arena</strong></a>
</p>

Design Skill Arena is a static gallery for observing how different AI models implement the same **Muse AI Campaign Studio** brief with different frontend design skill chains.

Each entry opens a real standalone page. The project is a **showcase, not a benchmark**: it avoids aggregate scores and rankings so visitors can inspect the actual product experience and make their own judgment.

## Explore the collection

- The homepage alternates between models and skill chains in a deterministic order. Search or fix a model/chain to narrow the collection.
- Open a work for its capture, design intent, skill sources, and reusable chain context. The interactive work remains a standalone page.
- Filters, pagination, the current work, and language are encoded in the URL for sharing and browser navigation.
- `/skills/` lists public skill sources and related chains. `/methodology/` explains the common brief, limitations, and the separate 18-work contribution template.
- Generation dates and skill versions are shown as unrecorded where evidence is unavailable. Optional likes do not affect ordering.

## Why this project exists

The quality of AI-generated frontend work depends on more than the model. Design context, skill composition, component constraints, responsive implementation, and the refinement process all shape the result.

Design Skill Arena makes those differences visible under a shared setup:

- the same product brief;
- the same page objective;
- isolated implementations for each model;
- different frontend design skill chains;
- one consistent browsing experience.

The goal is not to declare a universal winner. It is to observe questions such as:

- Which skill chains create clearer hierarchy and stronger product structure?
- Which implementations feel like real software rather than generated templates?
- How do component systems, responsiveness, and polish affect the result?
- How do model capability and design methodology interact?

## What you can explore

- Information architecture and page rhythm
- Visual hierarchy and typography
- Component consistency
- Product character and brand expression
- Desktop and mobile responsiveness
- Motion, interaction, and finishing quality
- Interpretation of the same source brief

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/base UI primitives
- Static export for Cloudflare Pages
- Optional Cloudflare R2 asset hosting
- Optional Cloudflare D1 likes

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Static Build

```bash
pnpm build:static
pnpm preview:static
```

The static output is written to `out/`. This command keeps screenshots on local
`public/` paths unless `NEXT_PUBLIC_USE_R2_ASSETS=1` and
`NEXT_PUBLIC_ASSET_BASE_URL` are both set.

## Cloudflare Pages

The project is configured for Cloudflare Pages direct upload with `wrangler.jsonc`.

```bash
pnpm deploy:cloudflare
```

This command intentionally runs `pnpm build:cloudflare` first. Do not replace it
with `pnpm build:static` for production, otherwise screenshots will fall back to
project-local paths instead of R2. The deploy command also pins `--branch main`
so direct uploads update the production Pages deployment instead of a preview
deployment from the current local branch.

Recommended production domains:

- Site: `https://arena.xflux.cn`
- Assets: `https://arena-assets.xflux.cn`

Cloudflare Pages build settings:

```text
Build command: pnpm build:cloudflare
Output directory: out
Environment variable: NEXT_PUBLIC_USE_R2_ASSETS=1
Environment variable: NEXT_PUBLIC_ASSET_BASE_URL=https://arena-assets.xflux.cn
```

## Likes

Likes are an optional Cloudflare Pages Functions enhancement. The gallery does not call the API on initial page load; counts load only when a card is focused, hovered, opened, or liked.

Production uses D1:

```bash
pnpm db:migrate:remote
pnpm dlx wrangler@latest pages secret put VOTE_HASH_SALT --project-name design-skill-arena
```

The vote table stores only `target_id`, an anonymous salted visitor hash, and a timestamp. If the API or D1 binding is unavailable, the static gallery still works.

## Asset Hosting

By default, screenshots load from local `public/` paths. For R2, turn on the
asset switch and set the asset origin:

```bash
NEXT_PUBLIC_USE_R2_ASSETS=1
NEXT_PUBLIC_ASSET_BASE_URL=https://arena-assets.xflux.cn
```

The frontend prefixes existing public asset paths. If assets are moved to R2, keep the same card screenshot path shape:

```text
model-screenshots/{modelSlug}/{showcaseId}/desktop.webp
```

For an open-source fork, R2 is optional:

1. Keep assets in `public/` and run `pnpm build:static`.
2. Or create an R2 bucket, upload the same path structure, attach a public custom
   domain, and set `NEXT_PUBLIC_USE_R2_ASSETS=1` plus
   `NEXT_PUBLIC_ASSET_BASE_URL=https://your-assets.example.com`.
3. On Cloudflare Pages, use `pnpm build:cloudflare` and set the same environment
   variables in project settings.

Contributors should not commit generated screenshots for new models unless requested. The maintainer should capture real pages, compress the images to WebP, and upload them to R2.

## Adding a Model

See [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

Add a model as an isolated implementation:

```text
src/components/model-showcases/{modelSlug}/
```

Each model should provide the same 18 showcase IDs:

```text
standard-builder
visual-frontend
design-logic
impeccable-full-flow
artifact-builder
ux-pro-reference
component-system
motion-bits
standard-taste
standard-impeccable
visual-taste
visual-impeccable
design-ux-pro
design-impeccable
balanced-chain
visual-premium-chain
product-polish-chain
max-quality-chain
```

Each page must be independently openable under:

```text
/model-showcase/{modelSlug}/{showcaseId}
```

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build:static
```

---

Created and maintained by [Qingye](https://github.com/liyanqing90).
