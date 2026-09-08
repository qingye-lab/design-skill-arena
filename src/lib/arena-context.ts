import type { PublicArenaSkill } from "./public-arena-skills"
import { showcases } from "@/data/showcases"
import { chainId, getChains, type ArenaLocale } from "./arena-gallery"
import type { ShowcaseItem } from "@/types/showcase"

const englishGoals: Record<string, string> = {
  "standard-builder": "Complete product structure, baseline visual direction, and responsive foundations.",
  "visual-frontend": "Art direction, composition, and typographic character.",
  "design-logic": "Typography, hierarchy, and design decisions rooted in the brief.",
  "impeccable-full-flow": "Visual polish, UX, accessibility, and interaction states.",
  "artifact-builder": "Single-page composition, content organization, and interactive states.",
  "ux-pro-reference": "Usability, accessibility, and responsive interaction patterns.",
  "component-system": "Consistent components, themes, and implementation structure.",
  "motion-bits": "Motion, micro-interactions, and feedback through animated components.",
  "standard-taste": "A complete product foundation with a more distinctive design direction.",
  "standard-impeccable": "A standard product workflow followed by a detailed polish pass.",
  "visual-taste": "Expressive art direction with deliberate, less templated design choices.",
  "visual-impeccable": "A strong visual concept refined through usability and polish checks.",
  "design-ux-pro": "Subject-driven layout decisions informed by UX references.",
  "design-impeccable": "Distinctive typography and hierarchy refined through a polish workflow.",
  "balanced-chain": "A balanced approach to product structure, design decisions, and UX.",
  "visual-premium-chain": "A layered visual workflow combining art direction, taste, and polish.",
  "product-polish-chain": "Product structure, component consistency, and interface detail checks.",
  "max-quality-chain": "A broad design workflow spanning visual direction, UX, components, and polish.",
}

export function designIntent(item: ShowcaseItem, locale: ArenaLocale) {
  return locale === "zh-CN" ? item.focus : englishGoals[chainId(item)] ?? item.tags.join(" · ")
}

export function chainContext(item: ShowcaseItem, locale: ArenaLocale, skills: PublicArenaSkill[]) {
  const references = item.skills.map((id) => {
    const skill = skills.find((entry) => entry.id === id)
    return `${id}: ${skill?.githubUrl ?? skill?.officialUrl ?? (locale === "zh-CN" ? "来源未记录" : "Source not recorded")}`
  }).join("\n")
  if (locale === "en-US") return `Build one independent Muse AI Campaign Studio page.
Reference model: ${item.model}
Skill chain: ${item.title} — ${item.skillChainLabel}
Design intent: ${designIntent(item, locale)}

Design an AI campaign workspace for a creative director planning a product launch. Include a campaign brief, audience and channel controls, tone and visual style, three selectable A / B / C creative directions, a main creative preview, simulated Reach / CTR / Conversion forecasts, and recent activity.
Implement Generate, Save, and Export with local mock data. Show loading, success, error, selected, hover, and keyboard focus states. Make the page readable and usable on desktop and mobile. Use your own layout and content decisions. Do not copy an existing output or add scoring or rankings.

Skill source references:
${references}

Generation date and skill versions used for the reference work are not recorded. This is reusable task context, not the exact original generation prompt. Check the source documents for current usage.`
  return `设计一个独立的 Muse AI Campaign Studio 工作台页面。
参考模型：${item.model}
技能组合：${item.title} — ${item.skillChainLabel}
设计目标：${designIntent(item, locale)}

为负责新品发布的创意总监设计 AI 营销活动工作台。包含 Campaign Brief、受众与渠道控件、语气与视觉风格、A / B / C 三个可切换创意方向、主创意预览、Reach / CTR / Conversion 模拟预测指标和最近活动。
使用本地 mock 数据实现 Generate、Save、Export。提供加载、成功、错误、选中、悬停及键盘焦点状态。确保桌面与手机上均可阅读和操作。自主决定布局与内容，不照抄现有作品，不加入评分或排名。

技能来源参考：
${references}

参考作品的生成日期与生成时技能版本未记录。这是可复用的任务上下文，并非原始生成提示词的完整记录。具体用法请查阅来源文档。`
}

export function contributionContext(locale: ArenaLocale) {
  const chains = getChains(showcases).map((item) => `${item.numericId}. ${chainId(item)} — ${item.skillChainLabel}`).join("\n")
  if (locale === "en-US") return `Contribute one model to the existing Design Skill Arena repository.
MODEL_NAME = your model name
MODEL_SLUG = your model slug

Create 18 independent Muse AI Campaign Studio pages, one for each chain below. Read AGENTS.md and CONTRIBUTING.md first. Preserve all existing works and unrelated changes. Add model components under src/components/model-showcases/{MODEL_SLUG}/ and independently accessible /model-showcase/{MODEL_SLUG}/{showcaseId} routes. Keep each design independent instead of applying one repeated template. Show the model and skill chain on each page.

${chains}

Use the shared Muse brief: a campaign workspace for a creative director planning a product launch, with a campaign brief, audience/channel/tone/style controls, three selectable A / B / C concepts, main preview, simulated Reach / CTR / Conversion, Generate / Save / Export, and recent activity. Implement real local interactions, loading, success, error, selected, hover, and focus states. Support desktop and mobile. Do not use iframes inside the contributed works or add scoring or rankings.

Check each page visually at desktop and mobile sizes. Save real desktop screenshots to public/model-screenshots/{MODEL_SLUG}/{showcaseId}/desktop.png and compressed desktop.webp. Record generation date, exact model identifier, source revisions actually used, page URLs, and validation evidence when available. Run proportional type, lint, and build checks. Report missing evidence honestly.

Do not modify the homepage, filtering, pagination, i18n, existing showcase registrations, existing screenshots, or global styles. Leave integration into the gallery to the maintainer.`
  return `为现有 Design Skill Arena 项目贡献一个模型。
MODEL_NAME = 当前模型名称
MODEL_SLUG = 当前模型标识

先阅读 AGENTS.md 与 CONTRIBUTING.md。为下列 18 个组合各自创建一个独立的 Muse AI Campaign Studio 页面。保留现有作品及无关修改。组件放入 src/components/model-showcases/{MODEL_SLUG}/，页面通过 /model-showcase/{MODEL_SLUG}/{showcaseId} 独立打开。18 件作品应各自设计，不能复用同一视觉模板。每页显示模型与技能组合。

${chains}

沿用共同 Muse 需求：为负责新品发布的创意总监设计营销活动工作台，包含 brief、受众/渠道/语气/视觉风格控件、A / B / C 三个可切换方案、主预览、Reach / CTR / Conversion 模拟指标、Generate / Save / Export 和最近活动。实现真实本地交互，覆盖加载、成功、错误、选中、悬停与焦点状态，适配桌面和手机。贡献作品内部不使用 iframe，不加入评分或排名。

逐页检查桌面和手机效果。保存真实桌面截图到 public/model-screenshots/{MODEL_SLUG}/{showcaseId}/desktop.png，并提供压缩 desktop.webp。尽可能记录生成日期、完整模型标识、实际使用的技能来源修订、页面 URL 和验证证据。运行相应类型、lint 与构建检查，如实说明缺失证据。

不修改首页、卡片、模型筛选、分页、i18n、现有展示注册数据、已有截图或全局样式。由维护者另行整合首页。`
}
