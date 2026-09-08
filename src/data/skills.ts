import type { SkillRecord } from "@/types/showcase"

export const skills: SkillRecord[] = [
  {
    id: "frontend-app-builder",
    name: "frontend-app-builder",
    type: "local-skill",
    status: "bundled",
    summary:
      "面向新前端应用的标准构建流程，强调先做完整视觉概念，再实现并用浏览器验证。",
    summaryEn:
      "A standard frontend app-building workflow that starts from a complete visual concept, then implements and verifies it in a browser.",
    localPath:
      "/Users/tangyuan/.codex/plugins/cache/openai-curated-remote/build-web-apps/0.1.2/skills/frontend-app-builder/SKILL.md",
    officialUrl: "https://developers.openai.com/codex/skills",
    githubUrl:
      "https://github.com/openai/plugins/tree/main/plugins/build-web-apps/skills/frontend-app-builder",
    installCommands: ["Bundled in this Codex plugin cache"],
    usageCommands: ["Use when creating a new frontend app or visually driven UI."],
    notes: [
      "作为 Standard Builder 组合的 skill 来源记录。",
      "随 build-web-apps 插件缓存提供。",
    ],
  },
  {
    id: "frontend-skill",
    name: "frontend-skill",
    type: "local-skill",
    status: "installed",
    summary:
      "强调视觉表现、构图、克制动效和去模板化表达，用于生成更有视觉区分度的页面。",
    summaryEn:
      "A visual frontend skill focused on stronger art direction, composition, restrained motion, and less template-like output.",
    localPath: "/Users/tangyuan/.agents/skills/frontend-skill/SKILL.md",
    officialUrl:
      "https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4",
    githubUrl:
      "https://github.com/openai/skills/tree/82d2c5b44ac234ec0f204f647562a4349d90ef43/skills/.curated/frontend-skill",
    installCommands: ["Already installed locally"],
    usageCommands: ["Use when the page needs stronger art direction or visual hierarchy."],
    notes: [
      "作为 Visual Frontend 组合的 skill 来源记录。",
      "安装在通用 Skills 目录；固定为官方移除前最后可用版本，并非当前维护版本。",
    ],
  },
  {
    id: "frontend-design",
    name: "frontend-design",
    type: "external-skill",
    status: "installed",
    summary:
      "强调独特视觉主张、字体和布局决策，要求针对题材做有理由的设计风险。",
    summaryEn:
      "A design skill for distinctive visual positions, typography, and layout decisions grounded in the page subject.",
    localPath: "/Users/tangyuan/.codex/skills/frontend-design/SKILL.md",
    officialUrl: "https://github.com/anthropics/skills",
    githubUrl:
      "https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md",
    installCommands: [
      "python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo anthropics/skills --path skills/frontend-design --method git",
    ],
    usageCommands: ["Use when the interface needs a distinctive visual direction."],
    notes: [
      "已通过 git fallback 安装。",
      "Codex 可能需要重启后才会在自动技能列表中出现。",
    ],
  },
  {
    id: "impeccable",
    name: "impeccable",
    type: "local-skill",
    status: "installed",
    summary:
      "高审美 UI 打磨、信息架构、可访问性、动效、响应式和 polish 检查流程。",
    summaryEn:
      "A high-taste UI polish workflow covering information architecture, accessibility, motion, responsive behavior, and final detail checks.",
    localPath: "/Users/tangyuan/.codex/skills/impeccable/SKILL.md",
    officialUrl: "https://impeccable.style/",
    githubUrl: "https://github.com/pbakaus/impeccable",
    installCommands: ["Already installed locally"],
    usageCommands: ["<skill>/scripts/impeccable context"],
    notes: ["本项目已补充 PRODUCT.md 供后续 impeccable 流程读取。"],
  },
  {
    id: "artifacts-builder",
    name: "artifacts-builder",
    aliases: ["web-artifacts-builder"],
    type: "local-skill",
    status: "installed",
    summary:
      "用于复杂 HTML artifact，一次性产出多组件、可交互的前端作品。",
    summaryEn:
      "A builder for elaborate single-page HTML artifacts with multiple components and real interaction.",
    localPath: "/Users/tangyuan/.agents/skills/artifacts-builder/SKILL.md",
    officialUrl: "https://github.com/anthropics/skills",
    githubUrl:
      "https://github.com/anthropics/skills/blob/main/skills/web-artifacts-builder/SKILL.md",
    installCommands: ["Already installed locally"],
    usageCommands: ["Use for elaborate, multi-component HTML artifacts."],
    notes: ["作为 Artifact Builder 组合的 skill 来源记录。"],
  },
  {
    id: "ui-ux-pro-max",
    name: "ui-ux-pro-max",
    type: "local-skill",
    status: "installed",
    summary:
      "覆盖可访问性、触控、性能、布局、响应式、字体、色彩、动画和图表的 UX 参考库。",
    summaryEn:
      "A UX reference library covering accessibility, touch targets, performance, layout, responsiveness, typography, color, motion, and charts.",
    localPath: "/Users/tangyuan/.codex/skills/ui-ux-pro-max/SKILL.md",
    officialUrl: "https://ui-ux-pro-max-skill.nextlevelbuilder.io/",
    githubUrl: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    installCommands: ["Already installed locally"],
    usageCommands: [
      "python3 <skill>/scripts/search.py \"focus visible keyboard\" --domain ux",
    ],
    notes: ["作为 UX Pro Reference 组合的 skill 来源记录。"],
  },
  {
    id: "shadcn",
    name: "shadcn / shadcn-best-practices",
    aliases: ["shadcn-best-practices"],
    type: "local-skill",
    status: "bundled",
    summary:
      "管理 shadcn/ui 项目、组件安装、组合模式、主题和工程一致性。",
    summaryEn:
      "Guidance for shadcn/ui projects, component installation, composition patterns, theming, and implementation consistency.",
    localPath:
      "/Users/tangyuan/.codex/plugins/cache/openai-curated-remote/build-web-apps/0.1.2/skills/shadcn-best-practices/SKILL.md",
    officialUrl: "https://ui.shadcn.com/",
    githubUrl: "https://github.com/shadcn-ui/ui",
    installCommands: [
      "pnpm dlx shadcn@latest init -d",
      "pnpm dlx shadcn@latest add button card badge tabs select table progress",
    ],
    usageCommands: ["pnpm dlx shadcn@latest info", "pnpm dlx shadcn@latest docs button"],
    notes: ["作为 Component System 组合的 shadcn 来源记录。"],
  },
  {
    id: "react-bits",
    name: "react-bits",
    type: "library",
    status: "external",
    summary:
      "开源 React 动效组件集合，用于记录微交互和动态视觉相关资源。",
    summaryEn:
      "An open-source collection of animated React components used as a reference for micro-interactions and motion-driven UI.",
    officialUrl: "https://reactbits.dev/",
    githubUrl: "https://github.com/DavidHDev/react-bits",
    installCommands: ["Use component snippets from reactbits.dev as needed"],
    usageCommands: ["Copy selected React Bits component into the project and adapt tokens."],
    notes: ["第一版只记录为外部动效资源，不把库作为主站依赖。"],
  },
  {
    id: "taste-skill",
    name: "design-taste-frontend / taste-skill",
    type: "local-skill",
    status: "installed",
    summary:
      "反 AI 味的前端设计 skill，强调读懂 brief、约束默认审美和减少模板化痕迹。",
    summaryEn:
      "An anti-generic frontend design skill that emphasizes reading the brief, constraining default AI aesthetics, and reducing templated output.",
    localPath: "/Users/tangyuan/.codex/skills/taste-skill/SKILL.md",
    officialUrl: "https://www.tasteskill.dev/",
    githubUrl: "https://github.com/Leonxlnx/taste-skill",
    installCommands: ["Already installed locally"],
    usageCommands: ["Use with frontend-app-builder when the first pass looks generic."],
    notes: ["作为 taste-skill 相关组合的本地 skill 来源记录。"],
  },
  {
    id: "web-interface-guidelines",
    name: "web-interface-guidelines",
    type: "guideline",
    status: "external",
    summary:
      "Vercel Labs 的 Web interface guidelines，用于审计键盘、焦点、可访问性和界面细节。",
    summaryEn:
      "Vercel Labs' web interface guidelines, used as a reference for keyboard behavior, focus, accessibility, and interaction details.",
    officialUrl: "https://vercel.com/design/guidelines",
    githubUrl: "https://github.com/vercel-labs/web-interface-guidelines",
    installCommands: [
      "npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines",
    ],
    usageCommands: ["/web-design-guidelines <file-or-pattern>"],
    notes: ["第一版记录为外部 guideline，不作为运行时依赖。"],
  },
]

export function getSkill(id: string) {
  return skills.find((skill) => skill.id === id)
}
