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
import type { ShowcaseId } from "./meta"

export {
  MODEL_ID,
  MODEL_NAME,
  MODEL_SLUG,
  chainLabel,
  isOpus55ShowcaseId,
  showcaseIds,
  showcaseSkills,
  showcaseTitles,
  type ShowcaseId,
} from "./meta"

export const showcaseComponents: Record<ShowcaseId, ComponentType> = {
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
