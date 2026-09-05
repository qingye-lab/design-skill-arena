"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Save,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4
type ConceptId = "A" | "B" | "C"
type Status = "idle" | "loading" | "success" | "error"

type Audience = { id: string; name: string; desc: string; reach: number; ctr: number; cvr: number; why: string }
type Channel = { id: string; name: string; format: string; reach: number; ctr: number; cvr: number; why: string }
type Style = { id: string; name: string; swatch: string; bg: string; fg: string; muted: string; font: string }
type Concept = {
  id: ConceptId
  name: string
  accent: string
  headlines: [string, string, string]
  sub: string
  why: string
  reach: number
  ctr: number
  cvr: number
}
type Entry = { id: number; at: number; text: string }

const STEPS: { n: Step; label: string; helper: string }[] = [
  { n: 1, label: "Brief", helper: "Tell Muse what Ember is and when it ships." },
  { n: 2, label: "Direction", helper: "Choose who this is for and how it should sound." },
  { n: 3, label: "Concepts", helper: "Pick the creative territory to develop." },
  { n: 4, label: "Review", helper: "Check the board, the forecast, and generate." },
]

const BUDGETS = [
  { id: "lean", name: "Lean", range: "Under $50k", desc: "One channel, one hero asset." },
  { id: "core", name: "Core", range: "$50–150k", desc: "Two channels with a retargeting layer." },
  { id: "full", name: "Full", range: "$150k+", desc: "Multi-channel launch with retail." },
]

const AUDIENCES: Audience[] = [
  { id: "baristas", name: "Home baristas", desc: "Already own a grinder and care about extraction.", reach: 0.9, ctr: 1.2, cvr: 1.3, why: "A narrow, high-intent pool" },
  { id: "design", name: "Design-led households", desc: "Buy for the counter as much as for the cup.", reach: 1, ctr: 1, cvr: 1, why: "Broad lifestyle reach" },
  { id: "pods", name: "Upgraders from pods", desc: "Want better coffee without learning a ritual.", reach: 1.35, ctr: 0.85, cvr: 0.8, why: "The widest pool of switchers" },
]

const CHANNELS: Channel[] = [
  { id: "social", name: "Paid social", format: "4:5 feed", reach: 1, ctr: 1.15, cvr: 1, why: "Paid social lifts CTR" },
  { id: "search", name: "Search", format: "Responsive ad", reach: 0.6, ctr: 1.4, cvr: 1.3, why: "Search captures existing intent" },
  { id: "retail", name: "Retail display", format: "A1 poster", reach: 1.3, ctr: 0.5, cvr: 0.85, why: "Retail is seen, not clicked" },
  { id: "news", name: "Newsletter", format: "600px header", reach: 0.35, ctr: 1.9, cvr: 1.5, why: "Owned audience converts best" },
]

const TONE_WORDS = [
  "Quiet · Precise · Plain",
  "Calm · Considered · Warm",
  "Confident · Clear · Warm",
  "Assured · Direct · Vivid",
  "Bold · Loud · Unapologetic",
]

const STYLES: Style[] = [
  { id: "warm", name: "Warm minimal", swatch: "linear-gradient(135deg,#f5ede3,#c2410c)", bg: "#f5ede3", fg: "#1c1917", muted: "#78716c", font: "font-sans" },
  { id: "mono", name: "Studio monochrome", swatch: "linear-gradient(135deg,#e7e5e4,#0c0a09)", bg: "#0c0a09", fg: "#fafaf9", muted: "#a8a29e", font: "font-sans uppercase tracking-[0.08em]" },
  { id: "kitchen", name: "Kitchen editorial", swatch: "linear-gradient(135deg,#d9dfd2,#8a6a3c)", bg: "#e7ebe1", fg: "#26301f", muted: "#6b7362", font: "font-serif" },
]

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "First Pour",
    accent: "#c2410c",
    headlines: ["It learns your beans, quietly.", "The grinder that learns your beans.", "Stop dialing in. Start drinking."],
    sub: "Ember adjusts grind size after every shot, so the second cup is already better than the first.",
    why: "Product proof drives conversion",
    reach: 0.82,
    ctr: 2.1,
    cvr: 1.9,
  },
  {
    id: "B",
    name: "Counter Piece",
    accent: "#8a6a3c",
    headlines: ["Quiet on the counter. Loud in the cup.", "Built for the counter. Tuned for the cup.", "The best-looking thing in your kitchen also tastes best."],
    sub: "Brushed steel, a walnut knob, and a grinder that remembers what you liked yesterday.",
    why: "Design appeal widens consideration",
    reach: 0.64,
    ctr: 2.6,
    cvr: 2.3,
  },
  {
    id: "C",
    name: "No Ritual",
    accent: "#0f766e",
    headlines: ["Good espresso, without the homework.", "Espresso without the homework.", "Skip the homework. Keep the espresso."],
    sub: "Ember dials itself in over three shots and holds the recipe until you change beans.",
    why: "Simplicity message trades depth for reach",
    reach: 1.1,
    ctr: 1.8,
    cvr: 1.5,
  },
]

const RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
const BRIEF_MIN = 40

function nowMs() {
  return Date.now()
}

function relative(at: number, now: number) {
  const s = Math.max(0, Math.round((now - at) / 1000))
  if (s < 5) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`
}

function formatReach(m: number) {
  return m >= 1 ? `${m.toFixed(2)}M` : `${Math.round(m * 1000)}K`
}

function toneIndex(tone: number) {
  return tone <= 2 ? 0 : tone === 3 ? 1 : 2
}

export default function ImpeccableFullFlow() {
  const [step, setStep] = useState<Step>(1)
  const [furthest, setFurthest] = useState<Step>(1)
  const [brief, setBrief] = useState("")
  const [briefTouched, setBriefTouched] = useState(false)
  const [launchDate, setLaunchDate] = useState("")
  const [budget, setBudget] = useState<string | null>(null)
  const [audience, setAudience] = useState<string | null>(null)
  const [channel, setChannel] = useState<string | null>(null)
  const [tone, setTone] = useState(3)
  const [style, setStyle] = useState<string | null>(null)
  const [concept, setConcept] = useState<ConceptId | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [errorText, setErrorText] = useState("")
  const [exportOpen, setExportOpen] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [activity, setActivity] = useState<Entry[]>([])
  const [now, setNow] = useState(nowMs)

  const nextId = useRef(1)
  const genCount = useRef(0)
  const genTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const tick = setInterval(() => setNow(nowMs()), 30_000)
    return () => {
      clearInterval(tick)
      if (genTimer.current) clearTimeout(genTimer.current)
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const log = (text: string) => {
    const at = nowMs()
    setNow(at)
    setActivity((prev) => [{ id: nextId.current++, at, text }, ...prev].slice(0, 10))
  }
  const edit = (text: string) => {
    setDirty(true)
    log(text)
  }

  const a = AUDIENCES.find((x) => x.id === audience) ?? AUDIENCES[1]
  const ch = CHANNELS.find((x) => x.id === channel) ?? CHANNELS[0]
  const st = STYLES.find((x) => x.id === style) ?? STYLES[0]
  const c = CONCEPTS.find((x) => x.id === concept) ?? CONCEPTS[0]
  const toneFactor = 0.9 + (tone - 1) * 0.06

  const forecast = useMemo(
    () => ({
      reach: c.reach * ch.reach * a.reach,
      ctr: c.ctr * ch.ctr * a.ctr * toneFactor,
      cvr: c.cvr * ch.cvr * a.cvr * (2 - toneFactor),
    }),
    [c, ch, a, toneFactor],
  )

  const briefLen = brief.trim().length
  const briefShort = briefLen < BRIEF_MIN
  const step1Reason = briefShort
    ? `Brief needs ${BRIEF_MIN - briefLen} more character${BRIEF_MIN - briefLen === 1 ? "" : "s"}`
    : !launchDate
      ? "Set a launch date"
      : !budget
        ? "Pick a budget band"
        : null
  const step2Reason = !audience ? "Choose an audience" : !channel ? "Choose a channel" : !style ? "Choose a visual style" : null
  const step3Reason = !concept ? "Select a concept to develop" : null
  const reasons: Record<Step, string | null> = { 1: step1Reason, 2: step2Reason, 3: step3Reason, 4: null }
  const reason = reasons[step]

  const goTo = (n: Step) => {
    if (n > furthest) return
    setStep(n)
    setExportOpen(false)
  }
  const continueStep = () => {
    if (step === 1) setBriefTouched(true)
    if (reason || step === 4) return
    const n = (step + 1) as Step
    setStep(n)
    if (n > furthest) setFurthest(n)
    log(`Completed ${STEPS[step - 1].label}`)
  }

  // Error rule: brief under 40 chars (possible if edited after reaching Review)
  // always fails; otherwise every 4th Generate fails with a capacity error.
  const generate = () => {
    if (status === "loading") return
    genCount.current += 1
    const shortBrief = briefShort
    const unlucky = genCount.current % 4 === 0
    setStatus("loading")
    setExportOpen(false)
    log(`Generating Concept ${c.id} for ${ch.name}`)
    genTimer.current = setTimeout(() => {
      if (shortBrief) {
        setStatus("error")
        setErrorText(`The brief is ${briefLen} characters; Muse needs at least ${BRIEF_MIN} to write copy that fits the product.`)
        log("Generate failed · brief too short")
      } else if (unlucky) {
        setStatus("error")
        setErrorText("The render queue was full and the request was dropped before it started. Your board is unchanged.")
        log("Generate failed · render queue full")
      } else {
        setStatus("success")
        log(`Generated Concept ${c.id} · ${ch.format}`)
      }
    }, 1500)
  }
  const save = () => {
    setSavedFlash(true)
    setHasSaved(true)
    setDirty(false)
    log("Saved draft")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSavedFlash(false), 1500)
  }
  const exportBoard = (kind: string) => log(`Exported ${kind}`)

  const loading = status === "loading"
  const headline = c.headlines[toneIndex(tone)]
  const stepMeta = STEPS[step - 1]
  const liveText = status === "loading" ? "Generating creative" : status === "success" ? "Creative generated" : status === "error" ? `Generate failed. ${errorText}` : ""

  return (
    <div className="min-h-dvh bg-[#faf8f5] text-stone-900">
      <style>{`
        @keyframes fable-if-bar { 0% { left: -40%; } 100% { left: 100%; } }
        .fable-if-bar { animation: fable-if-bar 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fable-if-bar { animation: none; left: 0; width: 100%; } }
      `}</style>
      <p aria-live="polite" className="sr-only">{liveText}</p>

      <div className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-col px-4 pb-24 pt-5 md:px-8 md:pb-12">
        {/* Header */}
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="relative text-xl font-semibold tracking-tight">
            Muse
            {hasSaved && dirty && (
              <span
                aria-label="Unsaved changes"
                role="img"
                className="absolute -right-2.5 top-0.5 h-2 w-2 rounded-full bg-orange-600"
              />
            )}
          </span>
          <span className="text-stone-400" aria-hidden="true">/</span>
          <h1 className="text-sm font-medium text-stone-700">Impeccable Full Flow</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-md border border-stone-300 px-2 py-0.5 text-[11px] font-medium text-stone-700">Fable 5.1</span>
            <span className="rounded-md border border-stone-300 px-2 py-0.5 font-mono text-[11px] text-stone-700">impeccable</span>
          </div>
        </header>

        {/* Stepper */}
        <nav aria-label="Progress" className="mt-8">
          <ol className="hidden items-center md:flex">
            {STEPS.map((s, i) => {
              const done = s.n < furthest
              const current = s.n === step
              const reachable = s.n <= furthest
              return (
                <li key={s.n} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                  <button
                    type="button"
                    onClick={() => goTo(s.n)}
                    disabled={!reachable}
                    aria-current={current ? "step" : undefined}
                    className={cn("group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors", RING, reachable && !current && "hover:bg-stone-200/60", !reachable && "cursor-not-allowed")}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors",
                        current ? "border-stone-900 bg-stone-900 text-white" : done ? "border-stone-900 bg-white text-stone-900" : "border-stone-300 text-stone-400",
                      )}
                    >
                      {done && !current ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : s.n}
                    </span>
                    <span className={cn("text-sm", current ? "font-semibold" : done ? "text-stone-700" : "text-stone-400")}>{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <span aria-hidden="true" className={cn("mx-2 h-px flex-1", s.n < furthest ? "bg-stone-900" : "bg-stone-300")} />}
                </li>
              )
            })}
          </ol>
          <div className="md:hidden">
            <p className="text-sm font-medium">
              Step {step} of 4 <span className="text-stone-400">—</span> {stepMeta.label}
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-stone-200" aria-hidden="true">
              <div className="h-full bg-stone-900 transition-[width] duration-500" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>
        </nav>

        {/* Panel */}
        <section aria-labelledby="fable-if-step-title" className="mt-8 flex-1">
          <h2 id="fable-if-step-title" className="text-2xl font-semibold tracking-tight">{stepMeta.label}</h2>
          <p className="mt-1 text-sm text-stone-600">{stepMeta.helper}</p>

          {step === 1 && (
            <div className="mt-8 space-y-8">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="fable-if-brief" className="text-sm font-medium">Campaign brief</label>
                  <span id="fable-if-brief-count" className={cn("font-mono text-xs tabular-nums", briefShort ? "text-stone-500" : "text-emerald-700")}>
                    {briefShort ? `${BRIEF_MIN - briefLen} to go` : `${briefLen} characters`}
                  </span>
                </div>
                <textarea
                  id="fable-if-brief"
                  rows={5}
                  value={brief}
                  onChange={(e) => { setBrief(e.target.value); setDirty(true) }}
                  onBlur={() => { setBriefTouched(true); if (brief.trim()) log("Edited brief") }}
                  aria-describedby="fable-if-brief-help fable-if-brief-count"
                  aria-invalid={briefTouched && briefShort}
                  placeholder="Ember is a countertop espresso machine with a grinder that learns from every shot. Launching to…"
                  className={cn("mt-2 w-full resize-y rounded-lg border bg-white px-3.5 py-3 text-sm leading-relaxed shadow-sm transition-colors placeholder:text-stone-400 hover:border-stone-400", RING, briefTouched && briefShort ? "border-red-500" : "border-stone-300")}
                />
                <p id="fable-if-brief-help" className={cn("mt-1.5 text-xs", briefTouched && briefShort ? "text-red-600" : "text-stone-500")}>
                  {briefTouched && briefShort ? `Write at least ${BRIEF_MIN} characters so the copy can reference the product.` : "Product, launch context, and what success looks like."}
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
                <div>
                  <label htmlFor="fable-if-date" className="text-sm font-medium">Launch date</label>
                  <input
                    id="fable-if-date"
                    type="date"
                    value={launchDate}
                    onChange={(e) => { setLaunchDate(e.target.value); edit(`Launch date set to ${e.target.value}`) }}
                    aria-describedby="fable-if-date-help"
                    className={cn("mt-2 h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm shadow-sm transition-colors hover:border-stone-400", RING)}
                  />
                  <p id="fable-if-date-help" className="mt-1.5 text-xs text-stone-500">Drives the flight plan.</p>
                </div>
                <fieldset>
                  <legend className="text-sm font-medium">Budget band</legend>
                  <div role="radiogroup" aria-label="Budget band" className="mt-2 grid gap-2 sm:grid-cols-3">
                    {BUDGETS.map((b) => {
                      const on = budget === b.id
                      return (
                        <button
                          key={b.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          aria-describedby={`fable-if-budget-${b.id}`}
                          onClick={() => { setBudget(b.id); edit(`Budget band → ${b.name}`) }}
                          className={cn("rounded-lg border bg-white p-3 text-left shadow-sm transition-colors hover:border-stone-500", RING, on ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-300")}
                        >
                          <span className="flex items-center justify-between text-sm font-medium">
                            {b.name}
                            {on && <Check className="h-4 w-4" aria-hidden="true" />}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs text-stone-600">{b.range}</span>
                          <span id={`fable-if-budget-${b.id}`} className="mt-1 block text-xs text-stone-500">{b.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 space-y-10">
              <fieldset>
                <legend className="text-sm font-medium">Target audience</legend>
                <div role="radiogroup" aria-label="Target audience" className="mt-2 divide-y divide-stone-200 rounded-lg border border-stone-300 bg-white shadow-sm">
                  {AUDIENCES.map((x) => {
                    const on = audience === x.id
                    return (
                      <button
                        key={x.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        aria-describedby={`fable-if-aud-${x.id}`}
                        onClick={() => { setAudience(x.id); edit(`Audience → ${x.name}`) }}
                        className={cn("flex w-full items-start gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-stone-50", RING, "focus-visible:ring-inset focus-visible:ring-offset-0")}
                      >
                        <span aria-hidden="true" className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", on ? "border-stone-900" : "border-stone-400")}>
                          {on && <span className="h-2 w-2 rounded-full bg-stone-900" />}
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{x.name}</span>
                          <span id={`fable-if-aud-${x.id}`} className="block text-xs text-stone-500">{x.desc}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium">Channel</legend>
                <p className="mt-0.5 text-xs text-stone-500">One channel for the hero asset. Others follow in the flight plan.</p>
                <div role="radiogroup" aria-label="Channel" className="mt-2 flex flex-wrap gap-2">
                  {CHANNELS.map((x) => {
                    const on = channel === x.id
                    return (
                      <button
                        key={x.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => { setChannel(x.id); edit(`Channel → ${x.name}`) }}
                        className={cn("inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors", RING, on ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white hover:border-stone-500")}
                      >
                        {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        {x.name}
                        <span className={cn("font-mono text-[11px]", on ? "text-stone-300" : "text-stone-500")}>{x.format}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="fable-if-tone" className="text-sm font-medium">Tone</label>
                  <span className="font-mono text-xs text-stone-600">{TONE_WORDS[tone - 1]}</span>
                </div>
                <input
                  id="fable-if-tone"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={tone}
                  onChange={(e) => { setTone(Number(e.target.value)); edit(`Tone → ${TONE_WORDS[Number(e.target.value) - 1]}`) }}
                  aria-valuetext={TONE_WORDS[tone - 1]}
                  aria-describedby="fable-if-tone-help"
                  className={cn("mt-3 w-full accent-stone-900", RING, "rounded-full")}
                />
                <div className="mt-1 flex justify-between text-[11px] text-stone-500" aria-hidden="true">
                  <span>Understated</span>
                  <span>·</span>
                  <span>·</span>
                  <span>·</span>
                  <span>Bold</span>
                </div>
                <p id="fable-if-tone-help" className="mt-1 text-xs text-stone-500">Changes the headline variant and the call-to-action wording.</p>
              </div>

              <fieldset>
                <legend className="text-sm font-medium">Visual style</legend>
                <div role="radiogroup" aria-label="Visual style" className="mt-2 grid gap-2 sm:grid-cols-3">
                  {STYLES.map((x) => {
                    const on = style === x.id
                    return (
                      <button
                        key={x.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => { setStyle(x.id); edit(`Visual style → ${x.name}`) }}
                        className={cn("flex items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-sm transition-colors hover:border-stone-500", RING, on ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-300")}
                      >
                        <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-md" style={{ backgroundImage: x.swatch }} />
                        <span className="flex-1 text-sm font-medium">{x.name}</span>
                        {on && <Check className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_280px]">
              <aside className="md:order-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen((v) => !v)}
                  aria-expanded={previewOpen}
                  aria-controls="fable-if-live"
                  className={cn("flex w-full items-center justify-between rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium md:hidden", RING)}
                >
                  Live preview
                  <ChevronDown className={cn("h-4 w-4 transition-transform", previewOpen && "rotate-180")} aria-hidden="true" />
                </button>
                <div id="fable-if-live" className={cn("md:sticky md:top-6 md:block", previewOpen ? "mt-2 block" : "hidden")}>
                  <p className="hidden text-xs font-medium uppercase tracking-wide text-stone-500 md:block">Live preview</p>
                  <div className="mt-2 rounded-lg border border-stone-200 p-4 shadow-sm" style={{ background: st.bg, color: st.fg }}>
                    <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: st.muted }}>Ember · {ch.format}</p>
                    <p className={cn("mt-3 text-lg font-semibold leading-snug", st.font)}>{concept ? headline : "Select a concept"}</p>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: st.muted }}>{concept ? c.sub : "The headline, sub, and palette update as you choose."}</p>
                    <div className="mt-4 flex items-center gap-1.5" aria-label="Palette">
                      {[st.bg, c.accent, st.fg].map((col) => (
                        <span key={col} className="h-4 w-4 rounded-full border border-black/10" style={{ background: col }} />
                      ))}
                      <span className="ml-auto font-mono text-[10px]" style={{ color: st.muted }}>{TONE_WORDS[tone - 1].split(" · ")[0]}</span>
                    </div>
                  </div>
                </div>
              </aside>

              <div role="radiogroup" aria-label="Creative concept" className="grid gap-3 md:order-1">
                {CONCEPTS.map((k) => {
                  const on = concept === k.id
                  const m = { reach: k.reach * ch.reach * a.reach, ctr: k.ctr * ch.ctr * a.ctr * toneFactor, cvr: k.cvr * ch.cvr * a.cvr * (2 - toneFactor) }
                  return (
                    <button
                      key={k.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => { setConcept(k.id); edit(`Concept ${k.id} · ${k.name} selected`) }}
                      className={cn("grid gap-4 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:border-stone-500 sm:grid-cols-[112px_1fr]", RING, on ? "border-stone-900 ring-1 ring-stone-900" : "border-stone-300")}
                    >
                      <span aria-hidden="true" className="flex aspect-video items-end rounded-md p-2 sm:aspect-[4/5]" style={{ background: `linear-gradient(160deg, ${st.bg} 0%, ${st.bg} 55%, ${k.accent} 100%)` }}>
                        <span className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ background: k.accent }}>{k.id}</span>
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Concept {k.id} · {k.name}</span>
                          {on && <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-900"><Check className="h-3.5 w-3.5" aria-hidden="true" />Selected</span>}
                        </span>
                        <span className="mt-1.5 text-base font-semibold leading-snug">{k.headlines[toneIndex(tone)]}</span>
                        <span className="mt-1 text-sm text-stone-600">{k.sub}</span>
                        <span className="mt-3 grid grid-cols-3 gap-2 border-t border-stone-200 pt-3 font-mono text-xs">
                          <span><span className="block text-[10px] uppercase text-stone-500">Reach</span>{formatReach(m.reach)}</span>
                          <span><span className="block text-[10px] uppercase text-stone-500">CTR</span>{m.ctr.toFixed(1)}%</span>
                          <span><span className="block text-[10px] uppercase text-stone-500">Conv.</span>{m.cvr.toFixed(1)}%</span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mt-8 space-y-8">
              {/* Hero board */}
              <div
                aria-label="Main creative preview"
                className={cn("relative aspect-video overflow-hidden rounded-xl border border-stone-200 shadow-sm", loading && "animate-pulse motion-reduce:animate-none")}
                style={{ background: st.bg, color: st.fg }}
              >
                <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[42%]" style={{ background: `linear-gradient(200deg, ${c.accent} 0%, transparent 70%)`, opacity: loading ? 0.3 : 0.85 }} />
                <div aria-hidden="true" className="absolute bottom-[12%] right-[10%] h-[46%] w-[22%] rounded-t-[22%] rounded-b-md border" style={{ borderColor: st.fg, opacity: 0.35 }} />
                <div className="relative flex h-full flex-col justify-between p-5 sm:p-8">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] sm:text-xs" style={{ color: st.muted }}>
                    <span>Ember</span>
                    <span>{ch.name} · {ch.format}</span>
                  </div>
                  <div className="max-w-[60%]">
                    {loading ? (
                      <div className="space-y-2" aria-hidden="true">
                        <div className="h-7 w-4/5 rounded bg-current opacity-20 sm:h-10" />
                        <div className="h-7 w-3/5 rounded bg-current opacity-20 sm:h-10" />
                        <div className="mt-4 h-3 w-full rounded bg-current opacity-10" />
                      </div>
                    ) : (
                      <>
                        <p className={cn("text-xl font-semibold leading-tight sm:text-4xl", st.font)}>{headline}</p>
                        <p className="mt-2 hidden text-sm leading-relaxed sm:block" style={{ color: st.muted }}>{c.sub}</p>
                        <span className="mt-3 inline-flex h-8 items-center rounded-full px-4 text-xs font-semibold text-white sm:mt-5 sm:h-10 sm:text-sm" style={{ background: c.accent }}>
                          {tone >= 4 ? "Get Ember now" : tone === 3 ? "Meet Ember" : "See how it learns"}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs" style={{ color: st.muted }}>
                    <span>For {a.name.toLowerCase()} · {TONE_WORDS[tone - 1]}</span>
                    <span className="flex gap-1">
                      {[st.bg, c.accent, st.fg].map((col) => (
                        <span key={col} className="h-3 w-3 rounded-full border border-black/10" style={{ background: col }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status notices */}
              {status === "success" && (
                <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p className="flex-1">
                      Concept {c.id} generated for {ch.name}.{" "}
                      <button type="button" onClick={() => setExportOpen((v) => !v)} aria-expanded={exportOpen} className={cn("font-medium underline underline-offset-2 hover:text-emerald-700", RING, "rounded")}>
                        View export options
                      </button>
                    </p>
                  </div>
                  {exportOpen && (
                    <div className="mt-3 grid gap-2 border-t border-emerald-200 pt-3 sm:grid-cols-3">
                      {[`PNG · ${ch.format}`, "PDF · print spread", "Share link"].map((k) => (
                        <button key={k} type="button" onClick={() => exportBoard(k)} className={cn("rounded-md border border-emerald-300 bg-white px-3 py-2 text-left text-xs font-medium hover:bg-emerald-100", RING)}>
                          {k}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {status === "error" && (
                <div role="alert" className="flex flex-wrap items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="min-w-0 flex-1">{errorText}</p>
                  <button type="button" onClick={generate} className={cn("rounded-md bg-red-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800", RING)}>
                    Try again
                  </button>
                </div>
              )}

              {/* Forecast + Activity */}
              <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div>
                  <h3 className="text-sm font-medium">Forecast</h3>
                  <dl className="mt-2 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 sm:grid-cols-3">
                    {[
                      { k: "Reach", v: formatReach(forecast.reach), why: a.why },
                      { k: "CTR", v: `${forecast.ctr.toFixed(1)}%`, why: ch.why },
                      { k: "Conversion", v: `${forecast.cvr.toFixed(1)}%`, why: c.why },
                    ].map((m) => (
                      <div key={m.k} className="bg-white p-4">
                        <dt className="text-xs uppercase tracking-wide text-stone-500">{m.k}</dt>
                        <dd className="mt-1 text-2xl font-semibold tabular-nums">{m.v}</dd>
                        <dd className="mt-1 text-xs text-stone-500">{m.why}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-medium">What changed</h3>
                  <ol className="mt-2 space-y-2.5 border-l border-stone-300 pl-4 text-xs">
                    {activity.length === 0 && <li className="text-stone-500">No changes yet.</li>}
                    {activity.slice(0, 6).map((e) => (
                      <li key={e.id} className="relative">
                        <span aria-hidden="true" className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-stone-400 bg-[#faf8f5]" />
                        <span className="block text-stone-800">{e.text}</span>
                        <time className="font-mono text-[10px] text-stone-500">{relative(e.at, now)}</time>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 border-t border-stone-200 pt-6">
                <button
                  type="button"
                  onClick={generate}
                  disabled={loading}
                  aria-busy={loading}
                  className={cn("relative inline-flex h-11 min-w-36 items-center justify-center gap-2 overflow-hidden rounded-lg bg-stone-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-progress", RING)}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {loading ? "Generating" : "Generate"}
                  {loading && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-white/20">
                      <span className="fable-if-bar absolute top-0 h-full w-[40%] bg-orange-400" />
                    </span>
                  )}
                </button>
                <button type="button" onClick={save} className={cn("inline-flex h-11 items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium transition-colors hover:border-stone-500", RING)}>
                  {savedFlash ? <Check className="h-4 w-4 text-emerald-700" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                  {savedFlash ? "Saved" : "Save"}
                </button>
                <button type="button" onClick={() => exportBoard(`PNG · ${ch.format}`)} className={cn("inline-flex h-11 items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-medium transition-colors hover:border-stone-500", RING)}>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Step footer */}
        <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-[#faf8f5]/95 px-4 py-3 backdrop-blur md:static md:mt-10 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
          <div className="mx-auto flex w-full max-w-[960px] items-center gap-3">
            <button
              type="button"
              onClick={() => goTo((step - 1) as Step)}
              disabled={step === 1}
              className={cn("inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200/60 disabled:opacity-40 disabled:hover:bg-transparent", RING)}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            {step < 4 ? (
              <>
                <span id="fable-if-continue-reason" className="ml-auto text-xs text-stone-500">{reason ?? `Ready for ${STEPS[step].label}`}</span>
                <button
                  type="button"
                  onClick={continueStep}
                  aria-disabled={!!reason}
                  aria-describedby="fable-if-continue-reason"
                  className={cn("inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-colors", RING, reason ? "bg-stone-300 text-stone-600" : "bg-stone-900 text-white hover:bg-stone-800")}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <span className="ml-auto text-xs text-stone-500">{hasSaved && !dirty ? "All changes saved" : "Draft"}</span>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}
