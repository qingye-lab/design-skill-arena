export const MODEL_NAME = "GPT-6 Luna";
export const MODEL_SLUG = "gpt-6-luna";

export const showcaseDefinitions = {
  "standard-builder": {
    title: "Standard Builder",
    skills: "frontend-app-builder",
  },
  "visual-frontend": {
    title: "Visual Frontend",
    skills: "frontend-skill",
  },
  "design-logic": {
    title: "Design Logic",
    skills: "frontend-design",
  },
  "impeccable-full-flow": {
    title: "Impeccable Full Flow",
    skills: "impeccable",
  },
  "artifact-builder": {
    title: "Artifact Builder",
    skills: "web-artifacts-builder / artifacts-builder",
  },
  "ux-pro-reference": {
    title: "UX Pro Reference",
    skills: "ui-ux-pro-max",
  },
  "component-system": {
    title: "Component System",
    skills: "shadcn-best-practices / shadcn",
  },
  "motion-bits": {
    title: "Motion Bits",
    skills: "react-bits",
  },
  "standard-taste": {
    title: "Standard + Taste",
    skills: "frontend-app-builder + taste-skill",
  },
  "standard-impeccable": {
    title: "Standard + Impeccable",
    skills: "frontend-app-builder + impeccable",
  },
  "visual-taste": {
    title: "Visual + Taste",
    skills: "frontend-skill + taste-skill",
  },
  "visual-impeccable": {
    title: "Visual + Impeccable",
    skills: "frontend-skill + impeccable",
  },
  "design-ux-pro": {
    title: "Design + UX Pro",
    skills: "frontend-design + ui-ux-pro-max",
  },
  "design-impeccable": {
    title: "Design + Impeccable",
    skills: "frontend-design + impeccable",
  },
  "balanced-chain": {
    title: "Balanced Chain",
    skills: "frontend-app-builder + taste-skill + impeccable",
  },
  "visual-premium-chain": {
    title: "Visual Premium Chain",
    skills: "frontend-skill + taste-skill + impeccable",
  },
  "product-polish-chain": {
    title: "Product Polish Chain",
    skills:
      "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable",
  },
  "max-quality-chain": {
    title: "Max Quality Chain",
    skills:
      "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable",
  },
} as const;

export type ShowcaseId = keyof typeof showcaseDefinitions;

export const showcaseIds = Object.keys(showcaseDefinitions) as ShowcaseId[];

export function isShowcaseId(value: string): value is ShowcaseId {
  return Object.prototype.hasOwnProperty.call(showcaseDefinitions, value);
}
