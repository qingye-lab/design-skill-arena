/**
 * Shared campaign facts for every Hy4 Muse AI Campaign Studio page.
 *
 * The 18 showcase pages deliberately share only this brief and its simulated
 * numbers. Layout, colour system, typography, control vocabulary, motion and
 * panel structure are decided page by page, so no two pages reuse a visual
 * template.
 */

export const MIN_BRIEF = 24

export type ConceptId = "A" | "B" | "C"
export type ToneId = "direct" | "playful" | "premium"
export type AudienceId = "gym" | "commuters" | "hikers" | "parents"
export type ChannelId = "instagram" | "tiktok" | "youtube" | "newsletter"
export type StyleId = "studio" | "bold" | "lifestyle" | "technical"
export type RunStatus = "idle" | "loading" | "success" | "error"

export const DEFAULT_BRIEF =
  "Launch Hydra, a 600ml insulated bottle that sterilises itself with UV-C every two hours. Lead with the no-washing benefit, keep claims specific (99.9%, 24h cold), and end with a pre-order CTA."

export interface Concept {
  id: ConceptId
  name: string
  angle: string
  headline: Record<ToneId, string>
  sub: string
  tagline: string
  palette: {
    bg: string
    fg: string
    accent: string
    deep: string
  }
  base: { reach: number; ctr: number; conv: number }
}

export const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Clean by design",
    angle: "Product as proof",
    headline: {
      direct: "The bottle that cleans itself.",
      playful: "Dishwasher? Never heard of it.",
      premium: "Purity, engineered in.",
    },
    sub: "UV-C light treats the water and the inner wall every two hours. No scrubbing, no lingering taste.",
    tagline: "Hydra · self-cleaning hydration",
    palette: {
      bg: "linear-gradient(158deg, #0f4c81 0%, #1a7fb8 55%, #7cc6e8 100%)",
      fg: "#ffffff",
      accent: "#d8f3ff",
      deep: "#0b3357",
    },
    base: { reach: 184000, ctr: 2.4, conv: 1.7 },
  },
  {
    id: "B",
    name: "Never wash again",
    angle: "Benefit as enemy",
    headline: {
      direct: "Stop washing bottles. Start drinking.",
      playful: "Your sink just got a day off.",
      premium: "Care, without the chore.",
    },
    sub: "99.9% of bacteria removed on a timed cycle. Double-walled steel holds cold for 24 hours.",
    tagline: "Hydra · the last bottle you clean",
    palette: {
      bg: "linear-gradient(158deg, #1b1f23 0%, #2f3640 58%, #c5f04a 100%)",
      fg: "#f5f7f2",
      accent: "#c5f04a",
      deep: "#0e1114",
    },
    base: { reach: 152000, ctr: 3.1, conv: 2.2 },
  },
  {
    id: "C",
    name: "Drink brighter",
    angle: "Ritual as signal",
    headline: {
      direct: "Fresh water. Every single sip.",
      playful: "Sip happens. Hydra handles it.",
      premium: "Brighter water, quietly kept.",
    },
    sub: "A soft glow confirms the cycle finished. Two-hour cadence, or tap the cap to run one now.",
    tagline: "Hydra · always fresh",
    palette: {
      bg: "linear-gradient(158deg, #ff7a59 0%, #ffb199 52%, #fff1e6 100%)",
      fg: "#3b1d14",
      accent: "#3b1d14",
      deep: "#7a2a17",
    },
    base: { reach: 121000, ctr: 2.8, conv: 1.4 },
  },
]

export const TONES: { id: ToneId; label: string; ctrWeight: number; cta: string }[] = [
  { id: "direct", label: "Direct", ctrWeight: 1, cta: "Pre-order" },
  { id: "playful", label: "Playful", ctrWeight: 1.08, cta: "Grab one" },
  { id: "premium", label: "Premium", ctrWeight: 0.94, cta: "Reserve yours" },
]

export const AUDIENCES: {
  id: AudienceId
  label: string
  note: string
  reachWeight: number
  convWeight: number
}[] = [
  {
    id: "gym",
    label: "Gym regulars",
    note: "Refills four times a day",
    reachWeight: 1,
    convWeight: 1.15,
  },
  {
    id: "commuters",
    label: "Commuters",
    note: "One bag, every day",
    reachWeight: 1.2,
    convWeight: 0.95,
  },
  {
    id: "hikers",
    label: "Outdoor hikers",
    note: "Water you cannot vouch for",
    reachWeight: 0.8,
    convWeight: 1.1,
  },
  {
    id: "parents",
    label: "Parents",
    note: "One less thing to scrub tonight",
    reachWeight: 1.1,
    convWeight: 1.25,
  },
]

export const CHANNELS: {
  id: ChannelId
  label: string
  format: string
  reachWeight: number
  ctrWeight: number
}[] = [
  {
    id: "instagram",
    label: "Instagram Feed",
    format: "Instagram · 4:5 feed",
    reachWeight: 1,
    ctrWeight: 1,
  },
  {
    id: "tiktok",
    label: "TikTok",
    format: "TikTok · 4:5 in-feed",
    reachWeight: 1.45,
    ctrWeight: 0.85,
  },
  {
    id: "youtube",
    label: "YouTube Pre-roll",
    format: "YouTube · companion card",
    reachWeight: 1.25,
    ctrWeight: 0.6,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    format: "Email · hero module",
    reachWeight: 0.35,
    ctrWeight: 2.1,
  },
]

export const STYLES: { id: StyleId; label: string; hint: string }[] = [
  { id: "studio", label: "Clean studio", hint: "White sweep, hard shadow" },
  { id: "bold", label: "Bold color", hint: "Flat fields, oversized type" },
  { id: "lifestyle", label: "Lifestyle", hint: "In-hand, natural light" },
  { id: "technical", label: "Technical", hint: "Callouts and cutaways" },
]

export interface Forecast {
  reach: number
  ctr: number
  conv: number
}

export function forecast(
  concept: Concept,
  audience: AudienceId,
  channel: ChannelId,
  tone: ToneId,
  style: StyleId
): Forecast {
  const aud = AUDIENCES.find((a) => a.id === audience) ?? AUDIENCES[0]
  const chn = CHANNELS.find((c) => c.id === channel) ?? CHANNELS[0]
  const ton = TONES.find((t) => t.id === tone) ?? TONES[0]

  return {
    reach: Math.round(concept.base.reach * aud.reachWeight * chn.reachWeight),
    ctr: concept.base.ctr * chn.ctrWeight * ton.ctrWeight,
    conv: concept.base.conv * aud.convWeight * (style === "technical" ? 1.05 : 1),
  }
}

export const REACH_CEILING = 322000
export const CTR_CEILING = 7
export const CONV_CEILING = 3.2

export function formatReach(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(value)
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`
}

export function clockNow() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false })
}

export interface ActivityEntry {
  id: number
  time: string
  text: string
}

export const INITIAL_ACTIVITY: ActivityEntry[] = [
  { id: 3, time: "09:42:10", text: "Concept A generated from brief v1" },
  { id: 2, time: "09:41:37", text: "Channel set to Instagram Feed" },
  { id: 1, time: "09:40:02", text: "Workspace opened · Hydra launch" },
]

export function conceptById(id: ConceptId) {
  return CONCEPTS.find((c) => c.id === id) ?? CONCEPTS[0]
}
