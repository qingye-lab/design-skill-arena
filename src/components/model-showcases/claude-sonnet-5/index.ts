import type { ComponentType } from "react"

import StandardBuilder from "./standard-builder"
import VisualFrontend from "./visual-frontend"
import DesignLogic from "./design-logic"
import ImpeccableFullFlow from "./impeccable-full-flow"
import ArtifactBuilder from "./artifact-builder"
import UxProReference from "./ux-pro-reference"
import ComponentSystem from "./component-system"
import MotionBits from "./motion-bits"
import StandardTaste from "./standard-taste"
import StandardImpeccable from "./standard-impeccable"
import VisualTaste from "./visual-taste"
import VisualImpeccable from "./visual-impeccable"
import DesignUxPro from "./design-ux-pro"
import DesignImpeccable from "./design-impeccable"
import BalancedChain from "./balanced-chain"
import VisualPremiumChain from "./visual-premium-chain"
import ProductPolishChain from "./product-polish-chain"
import MaxQualityChain from "./max-quality-chain"

export const MODEL_SLUG = "claude-sonnet-5"
export const MODEL_NAME = "Claude sonnet 5"

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

export const showcaseSkills: Record<keyof typeof showcaseTitles, string> = {
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
}

export type ClaudeSonnet5ShowcaseId = keyof typeof showcaseTitles

export const showcaseIds = Object.keys(showcaseTitles) as ClaudeSonnet5ShowcaseId[]

export const showcaseComponents: Record<ClaudeSonnet5ShowcaseId, ComponentType> = {
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

export function isClaudeSonnet5ShowcaseId(
  value: string
): value is ClaudeSonnet5ShowcaseId {
  return value in showcaseComponents
}
