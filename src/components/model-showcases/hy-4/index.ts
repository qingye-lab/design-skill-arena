import type { ComponentType } from "react"

import ArtifactBuilder from "./artifact-builder"
import BalancedChain from "./balanced-chain"
import ComponentSystem from "./component-system"
import DesignImpeccable from "./design-impeccable"
import DesignLogic from "./design-logic"
import DesignUxPro from "./design-ux-pro"
import ImpeccableFullFlow from "./impeccable-full-flow"
import MaxQualityChain from "./max-quality-chain"
import MotionBits from "./motion-bits"
import ProductPolishChain from "./product-polish-chain"
import StandardBuilder from "./standard-builder"
import StandardImpeccable from "./standard-impeccable"
import StandardTaste from "./standard-taste"
import UxProReference from "./ux-pro-reference"
import VisualFrontend from "./visual-frontend"
import VisualImpeccable from "./visual-impeccable"
import VisualPremiumChain from "./visual-premium-chain"
import VisualTaste from "./visual-taste"

export const MODEL_SLUG = "hy-4"
export const MODEL_NAME = "Hy4"

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

export const showcaseSkills = {
  "standard-builder": "frontend-app-builder",
  "visual-frontend": "frontend-skill",
  "design-logic": "frontend-design",
  "impeccable-full-flow": "impeccable",
  "artifact-builder": "web-artifacts-builder / artifacts-builder",
  "ux-pro-reference": "ui-ux-pro-max",
  "component-system": "shadcn-best-practices / shadcn",
  "motion-bits": "react-bits",
  "standard-taste": "frontend-app-builder + taste-skill",
  "standard-impeccable": "frontend-app-builder + impeccable",
  "visual-taste": "frontend-skill + taste-skill",
  "visual-impeccable": "frontend-skill + impeccable",
  "design-ux-pro": "frontend-design + ui-ux-pro-max",
  "design-impeccable": "frontend-design + impeccable",
  "balanced-chain": "frontend-app-builder + taste-skill + impeccable",
  "visual-premium-chain": "frontend-skill + taste-skill + impeccable",
  "product-polish-chain":
    "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable",
  "max-quality-chain":
    "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable",
} as const

export type Hy4ShowcaseId = keyof typeof showcaseTitles

export const showcaseIds = Object.keys(showcaseTitles) as Hy4ShowcaseId[]

export const showcaseComponents: Record<Hy4ShowcaseId, ComponentType> = {
  "standard-builder": StandardBuilder,
  "visual-frontend": VisualFrontend,
  "design-logic": DesignLogic,
  "impeccable-full-flow": ImpeccableFullFlow,
  "artifact-builder": ArtifactBuilder,
  "ux-pro-reference": UxProReference,
  "component-system": ComponentSystem,
  "motion-bits": MotionBits,
  "standard-taste": StandardTaste,
  "standard-impeccable": StandardImpeccable,
  "visual-taste": VisualTaste,
  "visual-impeccable": VisualImpeccable,
  "design-ux-pro": DesignUxPro,
  "design-impeccable": DesignImpeccable,
  "balanced-chain": BalancedChain,
  "visual-premium-chain": VisualPremiumChain,
  "product-polish-chain": ProductPolishChain,
  "max-quality-chain": MaxQualityChain,
}

export function isHy4ShowcaseId(value: string): value is Hy4ShowcaseId {
  return value in showcaseComponents
}
