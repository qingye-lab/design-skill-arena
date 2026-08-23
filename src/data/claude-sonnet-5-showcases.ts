import type { ShowcaseItem, SkillTag } from "@/types/showcase"
import { coverScreenshots } from "@/data/showcase-assets"

export const CLAUDE_SONNET_5_MODEL_NAME = "Claude sonnet 5"
export const CLAUDE_SONNET_5_MODEL_SLUG = "claude-sonnet-5"

const screenshotFor = (id: string) => coverScreenshots(CLAUDE_SONNET_5_MODEL_SLUG, id)

type Seed = {
  id: string
  numericId: string
  title: string
  skills: string[]
  skillChainLabel: string
  tags: SkillTag[]
  bestFor: string
  focus: string
  reason: string
  stylePreset: ShowcaseItem["stylePreset"]
}

const seeds: Seed[] = [
  { id: "standard-builder", numericId: "01", title: "Standard Builder", skills: ["frontend-app-builder"], skillChainLabel: "frontend-app-builder", tags: ["Baseline", "Product"], bestFor: "标准产品页面、稳定基线版本", focus: "结构完整性、默认审美、响应式基础质量", reason: "展示未叠加额外设计 skill 的标准生成页面。", stylePreset: "standard" },
  { id: "visual-frontend", numericId: "02", title: "Visual Frontend", skills: ["frontend-skill"], skillChainLabel: "frontend-skill", tags: ["Visual"], bestFor: "视觉表现力强的产品界面", focus: "主视觉、构图、字体气质", reason: "展示 frontend-skill 单独作用下的视觉页面方向。", stylePreset: "visual" },
  { id: "design-logic", numericId: "03", title: "Design Logic", skills: ["frontend-design"], skillChainLabel: "frontend-design", tags: ["Design", "Visual"], bestFor: "信息层级和布局逻辑验证", focus: "排版、层级、题材化设计决策", reason: "展示 frontend-design 单独作用下的信息层级和布局方向。", stylePreset: "design" },
  { id: "impeccable-full-flow", numericId: "04", title: "Impeccable Full Flow", skills: ["impeccable"], skillChainLabel: "impeccable", tags: ["Polish", "UX", "Visual"], bestFor: "高审美完整 UI", focus: "视觉、UX、可访问性、状态", reason: "展示 impeccable 单独作用下的完整产品页面方向。", stylePreset: "premium" },
  { id: "artifact-builder", numericId: "05", title: "Artifact Builder", skills: ["artifacts-builder"], skillChainLabel: "web-artifacts-builder / artifacts-builder", tags: ["Artifact", "Product"], bestFor: "一次性单页 artifact", focus: "单页 artifact 组成、区域组织和交互状态", reason: "展示 artifact builder 单独作用下的单页页面方向。", stylePreset: "artifact" },
  { id: "ux-pro-reference", numericId: "06", title: "UX Pro Reference", skills: ["ui-ux-pro-max"], skillChainLabel: "ui-ux-pro-max", tags: ["UX", "Product"], bestFor: "专业 UX 结构和状态覆盖", focus: "可访问性、状态、布局和响应式", reason: "展示 ui-ux-pro-max 单独作用下的 UX 结构和状态覆盖。", stylePreset: "ux" },
  { id: "component-system", numericId: "07", title: "Component System", skills: ["shadcn"], skillChainLabel: "shadcn-best-practices / shadcn", tags: ["Component", "Product"], bestFor: "组件系统一致性", focus: "组件复用、状态一致、工程结构", reason: "展示 shadcn 组件体系作用下的产品页面方向。", stylePreset: "system" },
  { id: "motion-bits", numericId: "08", title: "Motion Bits", skills: ["react-bits"], skillChainLabel: "react-bits", tags: ["Motion", "Visual"], bestFor: "动效和微交互验证", focus: "hover、loading、过渡和注意力引导", reason: "展示 react-bits 相关动效和微交互页面方向。", stylePreset: "motion" },
  { id: "standard-taste", numericId: "09", title: "Standard + Taste", skills: ["frontend-app-builder", "taste-skill"], skillChainLabel: "frontend-app-builder + taste-skill", tags: ["Baseline", "Taste", "Product"], bestFor: "通用页面去 AI 味", focus: "默认审美校正、字体和布局克制", reason: "展示 taste-skill 加入基线链路后的页面变化。", stylePreset: "premium" },
  { id: "standard-impeccable", numericId: "10", title: "Standard + Impeccable", skills: ["frontend-app-builder", "impeccable"], skillChainLabel: "frontend-app-builder + impeccable", tags: ["Baseline", "Polish", "Product"], bestFor: "标准生成后的高质量精修", focus: "视觉 polish、状态和可访问性", reason: "展示 impeccable 加入标准构建链路后的精修变化。", stylePreset: "premium" },
  { id: "visual-taste", numericId: "11", title: "Visual + Taste", skills: ["frontend-skill", "taste-skill"], skillChainLabel: "frontend-skill + taste-skill", tags: ["Visual", "Taste"], bestFor: "强视觉但克制的页面", focus: "视觉表达和去模板化之间的平衡", reason: "展示 frontend-skill 与 taste-skill 串联后的视觉页面方向。", stylePreset: "visual" },
  { id: "visual-impeccable", numericId: "12", title: "Visual + Impeccable", skills: ["frontend-skill", "impeccable"], skillChainLabel: "frontend-skill + impeccable", tags: ["Visual", "Polish", "MaxQuality"], bestFor: "强视觉页面", focus: "强视觉、细节 polish、状态完整", reason: "展示强视觉页面经过 impeccable 处理后的效果。", stylePreset: "premium" },
  { id: "design-ux-pro", numericId: "13", title: "Design + UX Pro", skills: ["frontend-design", "ui-ux-pro-max"], skillChainLabel: "frontend-design + ui-ux-pro-max", tags: ["Design", "UX", "Product"], bestFor: "复杂产品 UI", focus: "设计逻辑和 UX 体系结合", reason: "展示设计逻辑和 UX 体系结合后的产品页面效果。", stylePreset: "ux" },
  { id: "design-impeccable", numericId: "14", title: "Design + Impeccable", skills: ["frontend-design", "impeccable"], skillChainLabel: "frontend-design + impeccable", tags: ["Design", "Polish", "Visual"], bestFor: "理性布局后的视觉精修", focus: "信息结构、视觉 polish、可读性", reason: "展示 frontend-design 与 impeccable 串联后的页面方向。", stylePreset: "premium" },
  { id: "balanced-chain", numericId: "15", title: "Balanced Chain", skills: ["frontend-app-builder", "taste-skill", "impeccable"], skillChainLabel: "frontend-app-builder + taste-skill + impeccable", tags: ["Baseline", "Taste", "Polish", "Product"], bestFor: "大多数产品页面", focus: "稳定结构、去 AI 味、收尾 polish", reason: "展示标准构建、taste-skill 和 impeccable 串联后的页面效果。", stylePreset: "premium" },
  { id: "visual-premium-chain", numericId: "16", title: "Visual Premium Chain", skills: ["frontend-skill", "taste-skill", "impeccable"], skillChainLabel: "frontend-skill + taste-skill + impeccable", tags: ["Visual", "Taste", "Polish", "MaxQuality"], bestFor: "视觉展示型页面", focus: "强视觉、克制、收尾 polish", reason: "展示强视觉链路加入 taste-skill 和 impeccable 后的页面效果。", stylePreset: "max" },
  { id: "product-polish-chain", numericId: "17", title: "Product Polish Chain", skills: ["frontend-app-builder", "shadcn", "web-interface-guidelines", "impeccable"], skillChainLabel: "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable", tags: ["Product", "Component", "Polish", "UX"], bestFor: "真实产品前端链路", focus: "组件系统、可访问性、产品 polish", reason: "展示标准构建、shadcn、界面规范和 impeccable 串联后的页面效果。", stylePreset: "system" },
  { id: "max-quality-chain", numericId: "18", title: "Max Quality Chain", skills: ["frontend-design", "ui-ux-pro-max", "web-interface-guidelines", "impeccable"], skillChainLabel: "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable", tags: ["Design", "UX", "Polish", "MaxQuality"], bestFor: "复杂产品 UI", focus: "设计逻辑、UX、可访问性、收尾 polish", reason: "展示设计、UX、界面规范和 impeccable 串联后的页面效果。", stylePreset: "max" },
]

export const claudeSonnet5Showcases: ShowcaseItem[] = seeds.map((seed) => ({
  ...seed,
  provider: "Anthropic",
  model: CLAUDE_SONNET_5_MODEL_NAME,
  screenshots: screenshotFor(seed.id),
  demoUrl: `/model-showcase/${CLAUDE_SONNET_5_MODEL_SLUG}/${seed.id}`,
}))

export const claudeSonnet5ShowcaseIds = claudeSonnet5Showcases.map((item) => item.id)

export function getClaudeSonnet5Showcase(id: string) {
  return claudeSonnet5Showcases.find((item) => item.id === id)
}
