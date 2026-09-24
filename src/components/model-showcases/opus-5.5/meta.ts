export const MODEL_SLUG = "opus-5.5"
export const MODEL_NAME = "Opus 5.5"
/** Model identifier reported by the runtime that generated these pages. */
export const MODEL_ID = "claude-opus-5-5"

export const showcaseTitles = {
  "standard-builder": "Standard Builder",
  "visual-frontend": "Visual Frontend",
  "design-logic": "Design Logic",
  "impeccable-full-flow": "Impeccable Full Flow",
  "artifact-builder": "Artifact Builder",
  "ux-pro-reference": "UX Pro Reference",
  "component-system": "Component System",
  "motion-bits": "Motion Bits",
  "standard-taste": "Standard + Taste",
  "standard-impeccable": "Standard + Impeccable",
  "visual-taste": "Visual + Taste",
  "visual-impeccable": "Visual + Impeccable",
  "design-ux-pro": "Design + UX Pro",
  "design-impeccable": "Design + Impeccable",
  "balanced-chain": "Balanced Chain",
  "visual-premium-chain": "Visual Premium Chain",
  "product-polish-chain": "Product Polish Chain",
  "max-quality-chain": "Max Quality Chain",
} as const

export type ShowcaseId = keyof typeof showcaseTitles

export const showcaseIds = Object.keys(showcaseTitles) as ShowcaseId[]

export const showcaseSkills: Record<ShowcaseId, readonly string[]> = {
  "standard-builder": ["frontend-app-builder"],
  "visual-frontend": ["frontend-skill"],
  "design-logic": ["frontend-design"],
  "impeccable-full-flow": ["impeccable"],
  "artifact-builder": ["web-artifacts-builder / artifacts-builder"],
  "ux-pro-reference": ["ui-ux-pro-max"],
  "component-system": ["shadcn-best-practices / shadcn"],
  "motion-bits": ["react-bits"],
  "standard-taste": ["frontend-app-builder", "taste-skill"],
  "standard-impeccable": ["frontend-app-builder", "impeccable"],
  "visual-taste": ["frontend-skill", "taste-skill"],
  "visual-impeccable": ["frontend-skill", "impeccable"],
  "design-ux-pro": ["frontend-design", "ui-ux-pro-max"],
  "design-impeccable": ["frontend-design", "impeccable"],
  "balanced-chain": ["frontend-app-builder", "taste-skill", "impeccable"],
  "visual-premium-chain": ["frontend-skill", "taste-skill", "impeccable"],
  "product-polish-chain": [
    "frontend-app-builder",
    "shadcn-best-practices",
    "web-interface-guidelines",
    "impeccable",
  ],
  "max-quality-chain": [
    "frontend-design",
    "ui-ux-pro-max",
    "web-interface-guidelines",
    "impeccable",
  ],
}

export function chainLabel(id: ShowcaseId) {
  return showcaseSkills[id].join(" + ")
}

export function isOpus55ShowcaseId(value: string): value is ShowcaseId {
  return Object.prototype.hasOwnProperty.call(showcaseTitles, value)
}
