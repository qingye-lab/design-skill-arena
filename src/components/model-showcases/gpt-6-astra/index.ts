import Page0 from "./standard-builder";
import Page1 from "./visual-frontend";
import Page2 from "./design-logic";
import Page3 from "./impeccable-full-flow";
import Page4 from "./artifact-builder";
import Page5 from "./ux-pro-reference";
import Page6 from "./component-system";
import Page7 from "./motion-bits";
import Page8 from "./standard-taste";
import Page9 from "./standard-impeccable";
import Page10 from "./visual-taste";
import Page11 from "./visual-impeccable";
import Page12 from "./design-ux-pro";
import Page13 from "./design-impeccable";
import Page14 from "./balanced-chain";
import Page15 from "./visual-premium-chain";
import Page16 from "./product-polish-chain";
import Page17 from "./max-quality-chain";

export const astraShowcases = {
  "standard-builder": {title:"Standard Builder", component: Page0},
  "visual-frontend": {title:"Visual Frontend", component: Page1},
  "design-logic": {title:"Design Logic", component: Page2},
  "impeccable-full-flow": {title:"Impeccable Full Flow", component: Page3},
  "artifact-builder": {title:"Artifact Builder", component: Page4},
  "ux-pro-reference": {title:"UX Pro Reference", component: Page5},
  "component-system": {title:"Component System", component: Page6},
  "motion-bits": {title:"Motion Bits", component: Page7},
  "standard-taste": {title:"Standard + Taste", component: Page8},
  "standard-impeccable": {title:"Standard + Impeccable", component: Page9},
  "visual-taste": {title:"Visual + Taste", component: Page10},
  "visual-impeccable": {title:"Visual + Impeccable", component: Page11},
  "design-ux-pro": {title:"Design + UX Pro", component: Page12},
  "design-impeccable": {title:"Design + Impeccable", component: Page13},
  "balanced-chain": {title:"Balanced Chain", component: Page14},
  "visual-premium-chain": {title:"Visual Premium Chain", component: Page15},
  "product-polish-chain": {title:"Product Polish Chain", component: Page16},
  "max-quality-chain": {title:"Max Quality Chain", component: Page17},
} as const;
export type AstraShowcaseId = keyof typeof astraShowcases;
export const astraShowcaseIds = Object.keys(astraShowcases) as AstraShowcaseId[];
export function isAstraShowcaseId(id: string): id is AstraShowcaseId { return Object.prototype.hasOwnProperty.call(astraShowcases, id); }
