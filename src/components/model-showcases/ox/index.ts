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

export const MODEL_SLUG = "ox"
export const MODEL_NAME = "Ox"

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

export type OxShowcaseId = keyof typeof showcaseTitles

export const showcaseIds = Object.keys(showcaseTitles) as OxShowcaseId[]

export const showcaseComponents: Record<OxShowcaseId, ComponentType> = {
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

export function isOxShowcaseId(value: string): value is OxShowcaseId {
  return value in showcaseComponents
}
