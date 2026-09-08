import { showcases } from "@/data/showcases"

const siteUrl = "https://arena.xflux.cn"

export const dynamic = "force-static"

export function GET() {
  const models = Array.from(new Set(showcases.map((item) => item.model)))
  const chains = Array.from(
    new Map(showcases.map((item) => [item.sourceUrl ?? item.id, item])).values()
  )

  const body = `# Design Skill Arena

Design Skill Arena is a bilingual static gallery for inspecting real standalone frontend pages generated from the same Muse AI Campaign Studio brief.

Design Skill Arena 是一个中英文静态展示站，用同一个 Muse AI Campaign Studio 需求展示不同 AI 模型与前端设计 skill chain 生成的真实页面效果。

## Site

- Canonical URL: ${siteUrl}
- GitHub: https://github.com/liyanqing90/design-skill-arena
- Static deployment: Cloudflare Pages
- Product topic: Muse AI Campaign Studio
- Purpose: showcase and inspect generated frontend pages
- Not a benchmark: no scores, no rankings, no final quality claims

## Models / 模型

${models.map((model) => `- ${model}`).join("\n")}

## Skill Chains / 技能组合

${chains
  .map(
    (item) =>
      `- ${item.numericId} ${item.title}: ${item.skillChainLabel}`
  )
  .join("\n")}

## URL Pattern / 页面规则

- Home: ${siteUrl}/
- Skills: ${siteUrl}/skills/
- Shared brief and limitations: ${siteUrl}/methodology/
- Showcase page: ${siteUrl}/model-showcase/{modelSlug}/{showcaseId}
- Example: ${siteUrl}/model-showcase/gpt-55/standard-builder

## Important Pages / 重要页面

${showcases
  .map(
    (item) =>
      `- ${item.model} / ${item.title}: ${siteUrl}${item.demoUrl}`
  )
  .join("\n")}
`

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}
