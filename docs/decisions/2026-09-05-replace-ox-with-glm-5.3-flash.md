# Replace Ox with GLM 5.3 Flash

- Status: accepted
- Date: 2026-09-05
- Owners: Design Skill Arena maintainers
- Scope: model identity, routes, screenshots, and vote target namespace
- Supersedes: none
- Superseded by: none

## Context

The 18-page model collection registered as `Ox` needs to use its intended public identity and the same integration contract as other current model releases.

## Evidence

| Claim | Kind | Source and environment | Observed | Reference | Freshness / redaction |
| --- | --- | --- | --- | --- | --- |
| The collection has 18 canonical pages and screenshots under the `ox` namespace. | fact | local repository | 2026-09-05 | `src/components/model-showcases/ox`, `public/model-screenshots/ox` before migration | current checkout; no secrets |
| Current model releases use a kebab-case slug, full display name, provider, canonical metadata, WebP cover hashes, and vote allowlisting. | fact | local repository | 2026-09-05 | `CONTRIBUTING.md`, `src/components/model-showcases/fable-5.1`, `tests/showcases.test.ts` | current checkout; no secrets |

## Decision

Replace the `Ox` identity with display name `GLM 5.3 Flash`, provider `Zhipu`, and canonical slug `glm-5.3-flash` across the model registry, all 18 standalone routes and components, screenshot paths, capture tooling, cache-version metadata, and vote target validation. The old `ox` namespace is removed rather than retained as a second model.

## Alternatives considered

- Change only the homepage label — rejected because routes, screenshots, metadata, and vote IDs would continue to expose an inconsistent identity.
- Register GLM 5.3 Flash alongside Ox — rejected because both entries would represent the same 18 generated outputs.

## Consequences

- Positive: one consistent model identity across gallery, pages, assets, metadata, and votes.
- Negative: old `/model-showcase/ox/*` links stop being canonical and will return 404 after deployment.
- Operational: before production cutover, upload screenshots under `model-screenshots/glm-5.3-flash/*`; migrate or explicitly retire existing `ox-*` vote rows if preserving historical likes is required. Rollback restores the complete previous release and its `ox` asset namespace.

## Verification

- The model registry contains 18 GLM 5.3 Flash entries and no Ox entry.
- All 18 new routes are statically generated; an unknown route is rejected.
- Every cover resolves to an existing WebP with its 12-character content hash.
- Vote validation accepts `glm-5.3-flash-*` and rejects `ox-*`.

## Revisit when

- A verified external consumer requires redirects from the retired `ox` route namespace.
- Product policy requires preserving existing Ox vote history under the corrected model identity.
