"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  Download,
  FileJson,
  LoaderCircle,
  MousePointerClick,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------- mock data */

type ConceptId = "A" | "B" | "C"
type Tab = "studio" | "concepts" | "forecast" | "activity"
type ControlKey = "audience" | "channel" | "tone" | "style"
type Controls = Record<ControlKey, string>

type Concept = {
  id: ConceptId
  name: string
  accent: string
  soft: string
  promise: string
  headline: Record<string, string>
  notes: string[]
  cta: string
  base: { reach: number; ctr: number; conv: number }
  spark: { reach: number[]; ctr: number[]; conv: number[] }
}

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Remember everything",
    accent: "#7c3aed",
    soft: "#f5f3ff",
    promise: "Quill recalls the note you forgot you wrote.",
    headline: {
      Playful: "Your brain, but it actually remembers.",
      Direct: "Every note, recalled when you need it.",
      Warm: "The notes you take stay with you.",
    },
    notes: ["Meeting with Dana — pricing tiers", "Recipe: miso brown butter", "Q3 reading list (12)"],
    cta: "Start recalling",
    base: { reach: 820, ctr: 4.6, conv: 3.1 },
    spark: { reach: [3, 4, 4, 5, 6, 6, 7], ctr: [4, 4, 5, 5, 5, 6, 6], conv: [2, 3, 3, 4, 4, 5, 5] },
  },
  {
    id: "B",
    name: "Nothing else on the page",
    accent: "#0f766e",
    soft: "#f0fdfa",
    promise: "A blank page that stays blank until you type.",
    headline: {
      Playful: "No tabs. No toolbar. Just you and the cursor.",
      Direct: "Writing, without the interface.",
      Warm: "A quiet page for loud thoughts.",
    },
    notes: ["Draft — cover letter", "Ideas for the garden", "Thursday"],
    cta: "Open a blank page",
    base: { reach: 610, ctr: 5.8, conv: 3.9 },
    spark: { reach: [2, 2, 3, 3, 4, 4, 5], ctr: [5, 5, 6, 6, 7, 7, 7], conv: [3, 3, 4, 4, 5, 5, 6] },
  },
  {
    id: "C",
    name: "Ask your notes",
    accent: "#c2410c",
    soft: "#fff7ed",
    promise: "Type a question; Quill answers from your own notes.",
    headline: {
      Playful: "Ask your notes. They talk back now.",
      Direct: "Search by asking, not by scrolling.",
      Warm: "Your notes, ready to answer.",
    },
    notes: ["“What did Sam say about the deadline?”", "→ Sam moved it to May 14 (Mar 2 note)", "Sources: 3 notes"],
    cta: "Ask a question",
    base: { reach: 940, ctr: 3.9, conv: 2.4 },
    spark: { reach: [4, 5, 5, 6, 7, 7, 8], ctr: [3, 3, 4, 4, 4, 5, 5], conv: [2, 2, 2, 3, 3, 3, 4] },
  },
]

const CONTROL_OPTIONS: Record<ControlKey, string[]> = {
  audience: ["Students", "Writers", "Product teams", "Researchers"],
  channel: ["TikTok", "Instagram", "Newsletter", "Podcast read"],
  tone: ["Playful", "Direct", "Warm"],
  style: ["Soft gradient", "Paper", "Mono"],
}

const CONTROL_LABEL: Record<ControlKey, string> = { audience: "Audience", channel: "Channel", tone: "Tone", style: "Visual style" }

// Channel weights: reach ×, ctr ×, conv ×.
const CHANNEL_WEIGHT: Record<string, [number, number, number]> = {
  TikTok: [1.4, 0.9, 0.8],
  Instagram: [1.1, 1.0, 1.0],
  Newsletter: [0.5, 1.5, 1.4],
  "Podcast read": [0.7, 1.2, 1.1],
}
const AUDIENCE_SHIFT: Record<string, number> = { Students: 1.06, Writers: 1.0, "Product teams": 0.95, Researchers: 0.92 }

function forecast(c: Concept, ctl: Controls) {
  const [r, t, v] = CHANNEL_WEIGHT[ctl.channel] ?? [1, 1, 1]
  const s = AUDIENCE_SHIFT[ctl.audience] ?? 1
  return { reach: c.base.reach * r * s, ctr: c.base.ctr * t * s, conv: c.base.conv * v * s }
}

const fmtReach = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2)}M` : `${Math.round(n)}K`)
const fmtPct = (n: number) => `${n.toFixed(1)}%`

type ActivityKind = "generate" | "save" | "export" | "select" | "control"
type Activity = { id: number; kind: ActivityKind; text: string; at: number | null }

const ACTIVITY_ICON: Record<ActivityKind, typeof Sparkles> = {
  generate: Sparkles,
  save: Save,
  export: Download,
  select: MousePointerClick,
  control: MousePointerClick,
}

function relative(at: number | null, now: number) {
  if (at === null || now === 0) return "on open"
  const s = Math.max(0, Math.round((now - at) / 1000))
  if (s < 8) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`
}

const TABS: { id: Tab; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "concepts", label: "Concepts" },
  { id: "forecast", label: "Forecast" },
  { id: "activity", label: "Activity" },
]

const MIN_BRIEF = 20
const GENERATE_MS = 1400

/* ---------------------------------------------------------------- pieces */

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 96
  const h = 28
  const max = Math.max(...points)
  const min = Math.min(...points)
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * (w - 4) + 2
      const y = h - 3 - ((p - min) / Math.max(1, max - min)) * (h - 6)
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" className="shrink-0">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w - 2} cy={h - 3 - ((points[points.length - 1] - min) / Math.max(1, max - min)) * (h - 6)} r="2.5" fill={color} />
    </svg>
  )
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"

/* ------------------------------------------------------------- component */

export default function ArtifactBuilder() {
  const [tab, setTab] = useState<Tab>("studio")
  const [brief, setBrief] = useState(
    "Launch Quill, a distraction-free notes app whose AI recall answers questions from your own notes. Lead with calm, not features.",
  )
  const [controls, setControls] = useState<Controls>({ audience: "Students", channel: "TikTok", tone: "Playful", style: "Soft gradient" })
  const [openSelect, setOpenSelect] = useState<ControlKey | null>(null)
  const [selected, setSelected] = useState<ConceptId>("A")
  const [status, setStatus] = useState<{ kind: "ready" | "loading" | "success" | "error"; text: string }>({ kind: "ready", text: "Ready" })
  const [pulse, setPulse] = useState(false)
  const [compare, setCompare] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activity, setActivity] = useState<Activity[]>([{ id: 1, kind: "control", text: "Studio opened with a saved brief", at: null }])
  const [now, setNow] = useState(0)

  const attempts = useRef(0)
  const nextId = useRef(2)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const pending = timers.current
    const id = setInterval(() => setNow(Date.now()), 5000)
    return () => {
      clearInterval(id)
      pending.forEach(clearTimeout)
    }
  }, [])

  // Close any popover on outside click.
  useEffect(() => {
    if (!openSelect && !exportOpen) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-popover]")) {
        setOpenSelect(null)
        setExportOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [openSelect, exportOpen])

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  const concept = CONCEPTS.find((c) => c.id === selected) ?? CONCEPTS[0]
  const loading = status.kind === "loading"
  const briefInvalid = status.kind === "error" && brief.trim().length < MIN_BRIEF

  const log = (kind: ActivityKind, text: string) =>
    setActivity((prev) => [{ id: nextId.current++, kind, text, at: Date.now() }, ...prev].slice(0, 20))

  const choose = (id: ConceptId, source: "row" | "swatch") => {
    if (id !== selected) {
      setSelected(id)
      log("select", `Switched to Concept ${id} · ${CONCEPTS.find((c) => c.id === id)?.name}`)
    }
    if (source === "row") setTab("studio")
  }

  const setControl = (key: ControlKey, value: string) => {
    setControls((c) => ({ ...c, [key]: value }))
    setOpenSelect(null)
    log("control", `${CONTROL_LABEL[key]} set to ${value}`)
  }

  // Error rule: brief shorter than MIN_BRIEF fails immediately;
  // otherwise every 4th generate attempt fails with a mock timeout.
  const generate = () => {
    if (loading) return
    attempts.current += 1
    if (brief.trim().length < MIN_BRIEF) {
      setStatus({ kind: "error", text: "Couldn't generate — brief is too short" })
      log("generate", "Generate failed: brief is too short")
      return
    }
    setStatus({ kind: "loading", text: `Generating concept ${selected}…` })
    later(() => {
      if (attempts.current % 4 === 0) {
        setStatus({ kind: "error", text: "Couldn't generate — model timed out, try again" })
        log("generate", `Generate for Concept ${selected} timed out`)
        return
      }
      setStatus({ kind: "success", text: `Generated in ${(GENERATE_MS / 1000).toFixed(1)}s` })
      setPulse(true)
      later(() => setPulse(false), 1200)
      log("generate", `Generated Concept ${selected} for ${controls.audience} via ${controls.channel}`)
    }, GENERATE_MS)
  }

  const save = () => {
    setStatus({ kind: "ready", text: "Saved to workspace" })
    log("save", `Saved plan · Concept ${selected}`)
  }

  const copyMarkdown = async () => {
    const f = forecast(concept, controls)
    const md = `# Quill campaign — Concept ${concept.id}\n\n**${concept.headline[controls.tone]}**\n\n${concept.promise}\n\n- Audience: ${controls.audience}\n- Channel: ${controls.channel}\n- Tone: ${controls.tone}\n- Reach ${fmtReach(f.reach)} · CTR ${fmtPct(f.ctr)} · Conversion ${fmtPct(f.conv)}\n`
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      later(() => setCopied(false), 1600)
    } catch {
      setStatus({ kind: "error", text: "Couldn't copy — clipboard unavailable" })
    }
    log("export", "Copied plan as Markdown")
  }

  const downloadJson = () => {
    setExportOpen(false)
    setStatus({ kind: "ready", text: "quill-campaign.json ready" })
    log("export", `Exported Concept ${selected} as JSON`)
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -index : e.key === "End" ? TABS.length - 1 - index : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + TABS.length) % TABS.length
    setTab(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  const f = forecast(concept, controls)
  const caption = `For ${controls.audience.toLowerCase()} · via ${controls.channel} · ${controls.tone}`
  const previewBg =
    controls.style === "Paper"
      ? "#fdfcf8"
      : controls.style === "Mono"
        ? "#fafafa"
        : `linear-gradient(135deg, ${concept.soft} 0%, #ffffff 60%, ${concept.soft} 100%)`

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 md:px-6 md:py-8">
      <style>{`@keyframes fable-ab-indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}@keyframes fable-ab-pulse{0%{box-shadow:0 0 0 0 rgba(124,58,237,.55)}100%{box-shadow:0 0 0 14px rgba(124,58,237,0)}}@media (prefers-reduced-motion:reduce){.fable-ab-motion{animation:none!important}}`}</style>

      <section
        aria-label="Muse campaign artifact"
        className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col bg-white shadow-[0_1px_2px_rgba(0,0,0,.04),0_12px_40px_-12px_rgba(0,0,0,.12)] ring-1 ring-neutral-200/80 md:min-h-[80vh] md:rounded-xl"
      >
        {/* header */}
        <header className="border-b border-neutral-200 px-4 pt-4 md:px-6 md:pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-sm font-bold text-white" aria-hidden="true">
                M
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">Muse</p>
                <h1 className="mt-1 text-xs text-neutral-500">Artifact Builder · Quill launch</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">Fable 5.1</span>
              <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">web-artifacts-builder / artifacts-builder</span>
            </div>
          </div>

          <div role="tablist" aria-label="Studio sections" className="-mb-px mt-4 flex gap-1 overflow-x-auto [scrollbar-width:none]">
            {TABS.map((t, i) => {
              const on = tab === t.id
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`ab-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`ab-panel-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "relative shrink-0 rounded-t-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-violet-50 hover:text-violet-700",
                    ring,
                    on ? "text-violet-700 after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-violet-600" : "text-neutral-600",
                  )}
                >
                  {t.label}
                  {t.id === "activity" && activity.length > 1 && (
                    <span className="ml-1.5 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] tabular-nums text-neutral-600">{activity.length}</span>
                  )}
                </button>
              )
            })}
          </div>
        </header>

        {/* indeterminate bar */}
        <div className="relative h-0.5 overflow-hidden bg-transparent" aria-hidden="true">
          {loading && <div className="fable-ab-motion h-full w-1/3 rounded-full bg-violet-600 [animation:fable-ab-indeterminate_1.1s_ease-in-out_infinite]" />}
        </div>

        {/* body */}
        <div className="flex-1 px-4 py-5 md:px-6 md:py-6">
          {tab === "studio" && (
            <div id="ab-panel-studio" role="tabpanel" aria-labelledby="ab-tab-studio" className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {/* preview */}
              <div className="order-first md:order-none md:col-start-2">
                <p className="mb-2 text-xs font-medium text-neutral-500">Preview · {controls.channel}</p>
                <div
                  className={cn("overflow-hidden rounded-xl border border-neutral-200 p-5 sm:p-8", pulse && "fable-ab-motion [animation:fable-ab-pulse_1.1s_ease-out_1]")}
                  style={{ background: previewBg }}
                >
                  <div className="mx-auto max-w-[460px] overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,.35)] ring-1 ring-black/5">
                    <div className="flex items-center gap-1.5 border-b border-neutral-100 px-3 py-2.5">
                      <span className="size-2.5 rounded-full bg-neutral-300" aria-hidden="true" />
                      <span className="size-2.5 rounded-full bg-neutral-300" aria-hidden="true" />
                      <span className="size-2.5 rounded-full bg-neutral-300" aria-hidden="true" />
                      <span className="ml-auto text-[10px] text-neutral-400">quill.app</span>
                    </div>
                    <div className={cn("px-5 py-6 sm:px-7 sm:py-8", controls.style === "Mono" && "font-mono")}>
                      <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: concept.accent }}>
                        Quill · Concept {concept.id}
                      </p>
                      {loading ? (
                        <div className="mt-2 space-y-2 motion-reduce:animate-none" aria-hidden="true">
                          <div className="h-7 w-11/12 animate-pulse rounded-md bg-neutral-200 sm:h-8" />
                          <div className="h-7 w-2/3 animate-pulse rounded-md bg-neutral-200 sm:h-8" />
                        </div>
                      ) : (
                        <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{concept.headline[controls.tone]}</h2>
                      )}
                      <ul className="mt-5 space-y-2" aria-label="Sample notes">
                        {concept.notes.map((n) => (
                          <li key={n} className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                            <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: concept.accent }} aria-hidden="true" />
                            <span className="truncate">{n}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-5 inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold text-white" style={{ backgroundColor: concept.accent }}>
                        {concept.cta}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-xs text-neutral-600">{caption}</p>
                </div>
              </div>

              {/* controls */}
              <div className="md:col-start-1 md:row-start-1">
                <label htmlFor="ab-brief" className="mb-1.5 block text-xs font-medium text-neutral-700">
                  Campaign brief
                </label>
                <textarea
                  id="ab-brief"
                  rows={4}
                  value={brief}
                  aria-invalid={briefInvalid || undefined}
                  onChange={(e) => {
                    setBrief(e.target.value)
                    if (status.kind === "error") setStatus({ kind: "ready", text: "Ready" })
                  }}
                  className={cn(
                    "w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm leading-relaxed shadow-sm placeholder:text-neutral-400",
                    ring,
                    briefInvalid ? "border-red-500 ring-2 ring-red-200" : "border-neutral-300 hover:border-neutral-400",
                  )}
                  placeholder="What are we launching, for whom, and what should they feel?"
                />
                <p className={cn("mt-1 text-[11px]", briefInvalid ? "text-red-600" : "text-neutral-500")}>
                  {brief.trim().length} characters · at least {MIN_BRIEF} to generate
                </p>

                <div className="mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                  {(Object.keys(CONTROL_OPTIONS) as ControlKey[]).map((key) => {
                    const open = openSelect === key
                    return (
                      <div key={key} className="relative flex items-center justify-between gap-3 px-3 py-2" data-popover>
                        <span id={`ab-ctl-${key}`} className="text-sm text-neutral-700">
                          {CONTROL_LABEL[key]}
                        </span>
                        <button
                          type="button"
                          aria-haspopup="listbox"
                          aria-expanded={open}
                          aria-labelledby={`ab-ctl-${key}`}
                          onClick={() => setOpenSelect(open ? null : key)}
                          className={cn("inline-flex h-9 min-w-[150px] items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-medium hover:border-violet-400 hover:bg-violet-50", ring)}
                        >
                          {controls[key]}
                          <ChevronDown className={cn("size-4 text-neutral-500 transition-transform", open && "rotate-180")} aria-hidden="true" />
                        </button>
                        {open && (
                          <ul
                            role="listbox"
                            aria-labelledby={`ab-ctl-${key}`}
                            className="absolute right-3 top-full z-20 mt-1 w-[180px] overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
                          >
                            {CONTROL_OPTIONS[key].map((opt) => {
                              const on = controls[key] === opt
                              return (
                                <li key={opt} role="option" aria-selected={on}>
                                  <button
                                    type="button"
                                    onClick={() => setControl(key, opt)}
                                    className={cn("flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-violet-50 hover:text-violet-700", ring, on && "text-violet-700")}
                                  >
                                    {opt}
                                    {on && <Check className="size-4" aria-hidden="true" />}
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                  <span>Concept</span>
                  <div role="radiogroup" aria-label="Concept" className="flex gap-1">
                    {CONCEPTS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={c.id === selected}
                        aria-label={`Concept ${c.id}`}
                        onClick={() => choose(c.id, "swatch")}
                        className={cn("grid size-8 place-items-center rounded-lg text-xs font-semibold text-white ring-offset-2 transition-transform hover:scale-105", ring, c.id === selected && "ring-2 ring-violet-600")}
                        style={{ backgroundColor: c.accent }}
                      >
                        {c.id}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setTab("concepts")} className={cn("ml-auto inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-medium text-violet-700 hover:bg-violet-50", ring)}>
                    Compare concepts <ArrowRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "concepts" && (
            <div id="ab-panel-concepts" role="tabpanel" aria-labelledby="ab-tab-concepts" className="space-y-2">
              <p className="text-xs text-neutral-500">Three angles for Quill. Pick one and it drives the preview and the forecast.</p>
              {CONCEPTS.map((c) => {
                const on = c.id === selected
                const fc = forecast(c, controls)
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "flex flex-wrap items-center gap-3 rounded-xl border-l-4 py-3 pl-4 pr-3 transition-colors hover:bg-violet-50 sm:flex-nowrap",
                      on ? "border-violet-600 bg-violet-50/60" : "border-transparent",
                    )}
                  >
                    <span className="size-8 shrink-0 rounded-lg" style={{ backgroundColor: c.accent }} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        Concept {c.id} · {c.name}
                        {on && <Check className="size-4 text-violet-600" aria-label="Selected" />}
                      </p>
                      <p className="truncate text-xs text-neutral-600">{c.promise}</p>
                    </div>
                    <dl className="flex gap-4 text-xs tabular-nums text-neutral-600">
                      <div><dt className="text-[10px] uppercase text-neutral-400">Reach</dt><dd className="font-medium text-neutral-900">{fmtReach(fc.reach)}</dd></div>
                      <div><dt className="text-[10px] uppercase text-neutral-400">CTR</dt><dd className="font-medium text-neutral-900">{fmtPct(fc.ctr)}</dd></div>
                      <div><dt className="text-[10px] uppercase text-neutral-400">Conv.</dt><dd className="font-medium text-neutral-900">{fmtPct(fc.conv)}</dd></div>
                    </dl>
                    <button
                      type="button"
                      onClick={() => choose(c.id, "row")}
                      aria-pressed={on}
                      className={cn("inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium sm:w-auto", ring, on ? "bg-violet-600 text-white hover:bg-violet-700" : "border border-neutral-300 bg-white hover:border-violet-400")}
                    >
                      {on ? "Back to Studio" : "Use this concept"} <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {tab === "forecast" && (
            <div id="ab-panel-forecast" role="tabpanel" aria-labelledby="ab-tab-forecast">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-500">
                  Concept {concept.id} on {controls.channel}. Weighted reach ×{CHANNEL_WEIGHT[controls.channel][0]}, CTR ×{CHANNEL_WEIGHT[controls.channel][1]}, conversion ×{CHANNEL_WEIGHT[controls.channel][2]}.
                </p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={compare}
                  onClick={() => setCompare((v) => !v)}
                  className={cn("inline-flex h-8 items-center gap-2 rounded-full border border-neutral-300 pl-1 pr-3 text-xs font-medium hover:border-violet-400", ring)}
                >
                  <span className={cn("relative h-5 w-9 rounded-full transition-colors", compare ? "bg-violet-600" : "bg-neutral-300")} aria-hidden="true">
                    <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]", compare ? "left-[18px]" : "left-0.5")} />
                  </span>
                  Compare all
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(["reach", "ctr", "conv"] as const).map((k) => (
                  <div key={k} className="rounded-xl border border-neutral-200 p-4 transition-colors hover:bg-violet-50/40">
                    <p className="text-xs font-medium text-neutral-500">{k === "reach" ? "Reach" : k === "ctr" ? "CTR" : "Conversion"}</p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <p className="text-3xl font-semibold tabular-nums tracking-tight">{k === "reach" ? fmtReach(f[k]) : fmtPct(f[k])}</p>
                      <Sparkline points={concept.spark[k]} color={concept.accent} />
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-500">7-day projection</p>
                  </div>
                ))}
              </div>
              {compare && (
                <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead className="bg-neutral-50 text-xs text-neutral-500">
                      <tr><th className="px-4 py-2 text-left font-medium">Concept</th><th className="px-4 py-2 text-right font-medium">Reach</th><th className="px-4 py-2 text-right font-medium">CTR</th><th className="px-4 py-2 text-right font-medium">Conversion</th></tr>
                    </thead>
                    <tbody>
                      {CONCEPTS.map((c) => {
                        const fc = forecast(c, controls)
                        return (
                          <tr key={c.id} className={cn("border-t border-neutral-100 tabular-nums", c.id === selected && "bg-violet-50/60 font-medium")}>
                            <td className="px-4 py-2"><span className="mr-2 inline-block size-2.5 rounded-sm align-middle" style={{ backgroundColor: c.accent }} aria-hidden="true" />{c.id} · {c.name}</td>
                            <td className="px-4 py-2 text-right">{fmtReach(fc.reach)}</td>
                            <td className="px-4 py-2 text-right">{fmtPct(fc.ctr)}</td>
                            <td className="px-4 py-2 text-right">{fmtPct(fc.conv)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "activity" && (
            <div id="ab-panel-activity" role="tabpanel" aria-labelledby="ab-tab-activity">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500">Everything you did in this session.</p>
                <button
                  type="button"
                  onClick={() => setActivity([])}
                  disabled={activity.length === 0}
                  className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-40", ring)}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" /> Clear
                </button>
              </div>
              {activity.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">Nothing yet. Generate, save or pick a concept and it shows up here.</p>
              ) : (
                <ul className="mt-3 divide-y divide-neutral-100">
                  {activity.map((a) => {
                    const Icon = ACTIVITY_ICON[a.kind]
                    return (
                      <li key={a.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-violet-50">
                        <span className="grid size-8 place-items-center rounded-lg bg-neutral-100 text-neutral-600">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">{a.text}</span>
                        <span className="shrink-0 text-xs tabular-nums text-neutral-400">{relative(a.at, now)}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <footer className="flex flex-wrap items-center gap-3 border-t border-neutral-200 px-4 py-3 md:px-6">
          <p
            aria-live="polite"
            className={cn("flex min-w-0 flex-1 items-center gap-1.5 text-sm", status.kind === "error" ? "text-red-600" : status.kind === "success" ? "text-violet-700" : "text-neutral-500")}
          >
            {status.kind === "error" && <CircleAlert className="size-4 shrink-0" aria-hidden="true" />}
            {status.kind === "loading" && <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
            <span className="truncate">{status.text}</span>
          </p>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <button type="button" onClick={save} className={cn("inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-300 px-3 text-sm font-medium hover:bg-neutral-50 sm:flex-none", ring)}>
              <Save className="size-4" aria-hidden="true" /> Save
            </button>
            <div className="relative flex-1 sm:flex-none" data-popover>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={exportOpen}
                onClick={() => setExportOpen((v) => !v)}
                className={cn("inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-neutral-300 px-3 text-sm font-medium hover:bg-neutral-50", ring)}
              >
                <Download className="size-4" aria-hidden="true" /> Export <ChevronDown className="size-3.5 text-neutral-500" aria-hidden="true" />
              </button>
              {exportOpen && (
                <div role="menu" aria-label="Export options" className="absolute bottom-full right-0 z-20 mb-1 w-52 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
                  <button type="button" role="menuitem" onClick={copyMarkdown} className={cn("flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-violet-50 hover:text-violet-700", ring)}>
                    {copied ? <Check className="size-4 text-violet-600" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy as Markdown"}
                  </button>
                  <button type="button" role="menuitem" onClick={downloadJson} className={cn("flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-violet-50 hover:text-violet-700", ring)}>
                    <FileJson className="size-4" aria-hidden="true" /> Download JSON
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              aria-busy={loading}
              className={cn("inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:cursor-progress disabled:opacity-70 sm:w-auto", ring)}
            >
              {loading ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
              {loading ? "Generating" : "Generate"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}
