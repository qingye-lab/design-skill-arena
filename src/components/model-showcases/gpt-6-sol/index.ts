import StandardBuilder from "./standard-builder";
import VisualFrontend from "./visual-frontend";
import DesignLogic from "./design-logic";
import ImpeccableFullFlow from "./impeccable-full-flow";
import ArtifactBuilder from "./artifact-builder";
import UxProReference from "./ux-pro-reference";
import ComponentSystem from "./component-system";
import MotionBits from "./motion-bits";
import StandardTaste from "./standard-taste";
import StandardImpeccable from "./standard-impeccable";
import VisualTaste from "./visual-taste";
import VisualImpeccable from "./visual-impeccable";
import DesignUxPro from "./design-ux-pro";
import DesignImpeccable from "./design-impeccable";
import BalancedChain from "./balanced-chain";
import VisualPremiumChain from "./visual-premium-chain";
import ProductPolishChain from "./product-polish-chain";
import MaxQualityChain from "./max-quality-chain";
import { showcaseDetails, showcaseIds, isShowcaseId } from "./metadata";

export const solShowcases = {
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
} as const;

export { showcaseDetails, showcaseIds, isShowcaseId };
