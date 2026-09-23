export const showcaseDetails = {
  "standard-builder": { name: "Standard Builder", skills: "frontend-app-builder" },
  "visual-frontend": { name: "Visual Frontend", skills: "frontend-skill" },
  "design-logic": { name: "Design Logic", skills: "frontend-design" },
  "impeccable-full-flow": { name: "Impeccable Full Flow", skills: "impeccable" },
  "artifact-builder": { name: "Artifact Builder", skills: "web-artifacts-builder / artifacts-builder" },
  "ux-pro-reference": { name: "UX Pro Reference", skills: "ui-ux-pro-max" },
  "component-system": { name: "Component System", skills: "shadcn-best-practices / shadcn" },
  "motion-bits": { name: "Motion Bits", skills: "react-bits" },
  "standard-taste": { name: "Standard + Taste", skills: "frontend-app-builder + taste-skill" },
  "standard-impeccable": { name: "Standard + Impeccable", skills: "frontend-app-builder + impeccable" },
  "visual-taste": { name: "Visual + Taste", skills: "frontend-skill + taste-skill" },
  "visual-impeccable": { name: "Visual + Impeccable", skills: "frontend-skill + impeccable" },
  "design-ux-pro": { name: "Design + UX Pro", skills: "frontend-design + ui-ux-pro-max" },
  "design-impeccable": { name: "Design + Impeccable", skills: "frontend-design + impeccable" },
  "balanced-chain": { name: "Balanced Chain", skills: "frontend-app-builder + taste-skill + impeccable" },
  "visual-premium-chain": { name: "Visual Premium Chain", skills: "frontend-skill + taste-skill + impeccable" },
  "product-polish-chain": { name: "Product Polish Chain", skills: "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable" },
  "max-quality-chain": { name: "Max Quality Chain", skills: "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable" },
} as const;

export type ShowcaseId = keyof typeof showcaseDetails;
export const showcaseIds = Object.keys(showcaseDetails) as ShowcaseId[];
export function isShowcaseId(value: string): value is ShowcaseId {
  return Object.prototype.hasOwnProperty.call(showcaseDetails, value);
}
