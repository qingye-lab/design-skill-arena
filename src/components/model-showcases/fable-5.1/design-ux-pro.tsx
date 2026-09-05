"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"
import { AlertTriangle, Check, ChevronDown, ChevronRight, Download, Loader2, RotateCcw, Save, Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"

type ConceptId = "A" | "B" | "C"
type ToneId = "playful" | "direct" | "warm"
type SectionId = "brief" | "audience" | "channel" | "tone" | "style" | "concepts" | "forecast"
type Density = "comfortable" | "compact"
type Toast = { id: number; kind: "success" | "error"; text: string; retry?: boolean }
type Entry = { id: number; at: string; text: string }

type Mult = { reach: number; ctr: number; cvr: number }
type Audience = Mult & { id: string; name: string; size: string; fit: string }
type Channel = Mult & { id: string; name: string; format: string }
type Objective = Mult & { id: string; name: string }
type Style = { id: string; name: string; bg: string; fg: string; accent: string; onAccent: string }
type Concept = Mult & { id: ConceptId; name: string; headlines: Record<ToneId, string>; body: string }

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "brief", label: "Brief" },
  { id: "audience", label: "Audience" },
  { id: "channel", label: "Channel" },
  { id: "tone", label: "Tone" },
  { id: "style", label: "Visual style" },
  { id: "concepts", label: "Concepts" },
  { id: "forecast", label: "Forecast" },
]

const OBJECTIVES: Objective[] = [
  { id: "installs", name: "App installs", reach: 1, ctr: 1, cvr: 1 },
  { id: "trials", name: "Trial starts", reach: 0.85, ctr: 1.2, cvr: 0.9 },
  { id: "awareness", name: "Brand awareness", reach: 1.3, ctr: 0.8, cvr: 0.6 },
]

const AUDIENCES: Audience[] = [
  { id: "commuters", name: "Commuters 25–40", size: "2.1M", fit: "High · 15-min sessions fit the ride", reach: 1, ctr: 1, cvr: 1 },
  { id: "students", name: "Students abroad", size: "640K", fit: "Medium · price-sensitive, high intent", reach: 0.55, ctr: 1.35, cvr: 1.2 },
  { id: "travel", name: "Travel planners", size: "3.4M", fit: "Low · seasonal and broad", reach: 1.5, ctr: 0.7, cvr: 0.65 },
  { id: "heritage", name: "Heritage speakers", size: "880K", fit: "High · emotional pull, long retention", reach: 0.7, ctr: 1.2, cvr: 1.4 },
]

const CHANNELS: Channel[] = [
  { id: "feed", name: "In-feed", format: "1080×1350", reach: 1, ctr: 1, cvr: 1 },
  { id: "stories", name: "Stories", format: "1080×1920", reach: 1.1, ctr: 0.9, cvr: 0.85 },
  { id: "search", name: "Search", format: "RSA", reach: 0.6, ctr: 1.4, cvr: 1.3 },
  { id: "podcast", name: "Podcast", format: "30s host-read", reach: 0.8, ctr: 0.5, cvr: 0.9 },
]

const TONES: { id: ToneId; name: string; cta: string }[] = [
  { id: "playful", name: "Playful", cta: "Try it free" },
  { id: "direct", name: "Direct", cta: "Start free trial" },
  { id: "warm", name: "Warm", cta: "Begin today" },
]

const STYLES: Style[] = [
  { id: "citrus", name: "Citrus", bg: "#fff7ed", fg: "#1f2328", accent: "#f97316", onAccent: "#ffffff" },
  { id: "indigo", name: "Indigo night", bg: "#1e1b4b", fg: "#eef2ff", accent: "#818cf8", onAccent: "#1e1b4b" },
  { id: "paper", name: "Paper", bg: "#f5f1e8", fg: "#1f2328", accent: "#1f2328", onAccent: "#f5f1e8" },
  { id: "mint", name: "Mint", bg: "#ecfdf5", fg: "#064e3b", accent: "#0f766e", onAccent: "#ffffff" },
]

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Say it wrong first",
    headlines: { playful: "Mess up in Spanish. On purpose.", direct: "Speak Spanish in week one.", warm: "Your first conversation is closer than you think." },
    body: "Lingo talks back like a patient friend, not a quiz.",
    reach: 1.2,
    ctr: 2.4,
    cvr: 3.1,
  },
  {
    id: "B",
    name: "Ten minutes",
    headlines: { playful: "Ten minutes a day. Zero flashcards.", direct: "Conversational in ten minutes a day.", warm: "A small habit that turns into a language." },
    body: "Short spoken sessions built around your commute.",
    reach: 1.5,
    ctr: 1.9,
    cvr: 2.6,
  },
  {
    id: "C",
    name: "Real voices",
    headlines: { playful: "Talk like locals, not textbooks.", direct: "Learn from real conversations, not scripts.", warm: "Hear how people actually speak, then join in." },
    body: "Every lesson is cut from a real dialogue.",
    reach: 0.9,
    ctr: 2.9,
    cvr: 3.6,
  },
]

const BRIEF_MIN = 30
const RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"

function clock() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
function nowMs() {
  return Date.now()
}
function ago(at: number, now: number) {
  const m = Math.round((now - at) / 60_000)
  return m < 1 ? "just now" : `${m}m ago`
}
function reachLabel(m: number) {
  return m >= 1 ? `${m.toFixed(2)}M` : `${Math.round(m * 1000)}K`
}
function project(c: Mult, ch: Mult, a: Mult, o: Mult): Mult {
  return { reach: c.reach * ch.reach * a.reach * o.reach, ctr: c.ctr * ch.ctr * a.ctr * o.ctr, cvr: c.cvr * ch.cvr * a.cvr * o.cvr }
}

function SectionHead({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="text-[13px] font-semibold">{title}</h2>
      <p className="text-xs text-[#656d76]">{hint}</p>
    </div>
  )
}

export default function DesignUxPro() {
  const [brief, setBrief] = useState("Launch Lingo, a conversational language app that teaches by talking, not drilling. First market: Spanish for English speakers.")
  const [objective, setObjective] = useState(OBJECTIVES[0].id)
  const [audience, setAudience] = useState(AUDIENCES[0].id)
  const [channel, setChannel] = useState(CHANNELS[0].id)
  const [tone, setTone] = useState<ToneId>("direct")
  const [style, setStyle] = useState(STYLES[0].id)
  const [concept, setConcept] = useState<ConceptId>("A")
  const [active, setActive] = useState<SectionId>("brief")
  const [density, setDensity] = useState<Density>("comfortable")
  const [exportOpen, setExportOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [briefError, setBriefError] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [now, setNow] = useState(nowMs)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [activity, setActivity] = useState<Entry[]>([
    { id: 2, at: "10:12", text: "Draft 3 opened" },
    { id: 1, at: "10:05", text: "Concept A generated for In-feed" },
  ])

  const ids = useRef(3)
  const genCount = useRef(0)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tick = setInterval(() => setNow(nowMs()), 30_000)
    const pending = timers.current
    return () => {
      clearInterval(tick)
      pending.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(`fable-dx-${s.id}`)).filter((x): x is HTMLElement => !!x)
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id.replace("fable-dx-", "") as SectionId)
      },
      { rootMargin: "-25% 0px -65% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!exportOpen) return
    const onDown = (e: PointerEvent) => {
      if (!exportRef.current?.contains(e.target as Node)) setExportOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExportOpen(false)
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [exportOpen])

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t)
      fn()
    }, ms)
    timers.current.add(t)
  }, [])

  const log = useCallback((text: string) => {
    const id = ids.current++
    setActivity((prev) => [{ id, at: clock(), text }, ...prev].slice(0, 12))
  }, [])

  const toast = useCallback(
    (kind: Toast["kind"], text: string, retry = false) => {
      const id = ids.current++
      setToasts((prev) => [...prev, { id, kind, text, retry }].slice(-3))
      later(() => setToasts((prev) => prev.filter((t) => t.id !== id)), kind === "error" ? 6000 : 3500)
    },
    [later],
  )

  const c = CONCEPTS.find((x) => x.id === concept) ?? CONCEPTS[0]
  const a = AUDIENCES.find((x) => x.id === audience) ?? AUDIENCES[0]
  const ch = CHANNELS.find((x) => x.id === channel) ?? CHANNELS[0]
  const st = STYLES.find((x) => x.id === style) ?? STYLES[0]
  const ob = OBJECTIVES.find((x) => x.id === objective) ?? OBJECTIVES[0]
  const tn = TONES.find((x) => x.id === tone) ?? TONES[1]
  const forecast = useMemo(() => CONCEPTS.map((k) => ({ id: k.id, ...project(k, ch, a, ob) })), [ch, a, ob])
  const current = forecast.find((f) => f.id === concept) ?? forecast[0]

  // Error rule: brief under 30 chars → "brief" error (Brief section gets a red
  // rule); otherwise every 4th Generate fails with a capacity error.
  const generate = useCallback(() => {
    if (loading) return
    genCount.current += 1
    const shortBrief = brief.trim().length < BRIEF_MIN
    const unlucky = genCount.current % 4 === 0
    setLoading(true)
    setBriefError(false)
    log(`Generate · Concept ${concept} · ${ch.name}`)
    later(() => {
      setLoading(false)
      if (shortBrief) {
        setBriefError(true)
        toast("error", `Brief is under ${BRIEF_MIN} characters. Add product context, then retry.`, true)
        log("Generate failed · brief too short")
      } else if (unlucky) {
        toast("error", "Render capacity exceeded. The draft was not changed.", true)
        log("Generate failed · capacity")
      } else {
        toast("success", `Concept ${concept} rendered for ${ch.name} · ${ch.format}`)
        log(`Rendered Concept ${concept} · ${ch.format}`)
      }
    }, 1400)
  }, [loading, brief, concept, ch, later, log, toast])

  const save = useCallback(() => {
    setSavedAt(nowMs())
    setNow(nowMs())
    log("Draft saved")
    toast("success", "Draft 3 saved")
  }, [log, toast])

  const exportAs = useCallback(
    (kind: string) => {
      setExportOpen(false)
      log(`Exported ${kind}`)
      toast("success", `${kind} export queued`)
    },
    [log, toast],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (t && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable)) return
      const k = e.key.toLowerCase()
      if (k === "g") generate()
      else if (k === "s") save()
      else if (k === "e") exportAs("PNG")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [generate, save, exportAs])

  const jump = (id: SectionId) => {
    setActive(id)
    document.getElementById(`fable-dx-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const pick = <T extends string>(setter: (v: T) => void, label: string) => (v: T, name: string) => {
    setter(v)
    log(`${label} → ${name}`)
  }
  const pickAudience = pick<string>(setAudience, "Audience")
  const pickChannel = pick<string>(setChannel, "Channel")
  const pickTone = pick<ToneId>(setTone, "Tone")
  const pickStyle = pick<string>(setStyle, "Visual style")
  const pickObjective = pick<string>(setObjective, "Objective")
  const pickConcept = (id: ConceptId) => {
    if (id === concept) return
    setConcept(id)
    log(`Concept ${id} selected`)
  }
  const onConceptKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const i = CONCEPTS.findIndex((k) => k.id === concept)
    let next = i
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % CONCEPTS.length
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + CONCEPTS.length) % CONCEPTS.length
    else return
    e.preventDefault()
    pickConcept(CONCEPTS[next].id)
    document.getElementById(`fable-dx-concept-${CONCEPTS[next].id}`)?.focus()
  }

  const headline = c.headlines[tone]
  const compact = density === "compact"
  const btn = "inline-flex items-center gap-1.5 rounded-[6px] border text-[12px] font-medium transition-colors " + RING
  const secondary = btn + " border-[#d0d7de] bg-white text-[#1f2328] hover:bg-[#f6f8fa]"
  const h = compact ? "h-7 px-2.5" : "h-8 px-3"
  const properties: [string, string][] = [
    ["Objective", ob.name],
    ["Audience", a.name],
    ["Channel", `${ch.name} · ${ch.format}`],
    ["Tone", tn.name],
    ["Style", st.name],
    ["Concept", `${c.id} · ${c.name}`],
    ["Accent", st.accent],
  ]

  return (
    <div
      data-density={density}
      className="group/d flex min-h-dvh flex-col bg-[#f6f8fa] text-[13px] text-[#1f2328] min-[1100px]:grid min-[1100px]:h-dvh min-[1100px]:grid-rows-[48px_minmax(0,1fr)_28px]"
    >
      <style>{`
        @keyframes fable-dx-bar { 0% { left: -30%; } 100% { left: 100%; } }
        .fable-dx-bar { animation: fable-dx-bar 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fable-dx-bar { animation: none; left: 0; width: 100%; } }
      `}</style>
      <p aria-live="polite" className="sr-only">{loading ? "Generating creative" : toasts.at(-1)?.text ?? ""}</p>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex min-h-12 flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#d0d7de] bg-white px-3 py-2 min-[1100px]:static min-[1100px]:h-12 min-[1100px]:flex-nowrap min-[1100px]:py-0">
        <span className="text-[15px] font-semibold tracking-tight">Muse</span>
        <span className="hidden text-[#656d76] sm:inline">Design + UX Pro</span>
        <span className="rounded-[4px] border border-[#d0d7de] bg-[#f6f8fa] px-1.5 py-0.5 font-mono text-[11px]">Fable 5.1</span>
        <span className="rounded-[4px] border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] text-indigo-700">frontend-design + ui-ux-pro-max</span>
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-[#656d76] lg:flex">
          <span>Campaigns</span><ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span>Lingo launch</span><ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-[#1f2328]">Draft 3</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div ref={exportRef} className="relative flex">
            <button type="button" onClick={() => exportAs("PNG")} aria-label="Export PNG" title="Export PNG (E)" className={cn(secondary, h, "rounded-r-none")}>
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button type="button" onClick={() => setExportOpen((v) => !v)} aria-haspopup="menu" aria-expanded={exportOpen} aria-label="More export formats" className={cn(secondary, compact ? "h-7 px-1.5" : "h-8 px-2", "-ml-px rounded-l-none")}>
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {exportOpen && (
              <ul role="menu" className="absolute right-0 top-full z-40 mt-1 w-40 rounded-[6px] border border-[#d0d7de] bg-white p-1 shadow-lg">
                {["PNG", "PDF", "Share link"].map((k) => (
                  <li key={k}>
                    <button type="button" role="menuitem" onClick={() => exportAs(k)} className={cn("w-full rounded-[4px] px-2 py-1.5 text-left text-xs hover:bg-[#f6f8fa]", RING)}>{k}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" onClick={save} aria-label="Save draft" title="Save (S)" className={cn(secondary, h)}>
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button type="button" onClick={generate} disabled={loading} title="Generate (G)" className={cn(btn, h, "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70")}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
            {loading ? "Generating" : "Generate"}
          </button>
          <div role="radiogroup" aria-label="Density" className="hidden rounded-[6px] border border-[#d0d7de] bg-[#f6f8fa] p-0.5 md:flex">
            {(["comfortable", "compact"] as Density[]).map((d) => (
              <button key={d} type="button" role="radio" aria-checked={density === d} onClick={() => setDensity(d)} className={cn("rounded-[4px] px-2 py-0.5 text-[11px] capitalize", RING, density === d ? "bg-white shadow-sm" : "text-[#656d76] hover:text-[#1f2328]")}>
                {d}
              </button>
            ))}
          </div>
          <span aria-label="Jules Laurent" role="img" className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 font-mono text-[11px] text-white">JL</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col min-[1100px]:grid min-[1100px]:min-h-0 min-[1100px]:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* Outline */}
        <nav aria-label="Outline" className="sticky top-12 z-20 order-2 border-b border-[#d0d7de] bg-[#f6f8fa] md:static md:border-b-0 min-[1100px]:order-1 min-[1100px]:overflow-y-auto min-[1100px]:border-r">
          <p className="hidden px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-[#656d76] min-[1100px]:block">Outline</p>
          <ul className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-wrap min-[1100px]:flex-col min-[1100px]:px-2">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => jump(s.id)}
                  aria-current={active === s.id ? "location" : undefined}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs min-[1100px]:w-full min-[1100px]:rounded-[6px] min-[1100px]:border-0 min-[1100px]:px-2 min-[1100px]:py-1.5 group-data-[density=compact]/d:min-[1100px]:py-1",
                    RING,
                    active === s.id ? "border-indigo-600 bg-white font-medium text-indigo-700 min-[1100px]:bg-indigo-50" : "border-[#d0d7de] text-[#656d76] hover:bg-white hover:text-[#1f2328]",
                  )}
                >
                  <span aria-hidden="true" className={cn("hidden h-1.5 w-1.5 rounded-full min-[1100px]:block", active === s.id ? "bg-indigo-600" : "bg-[#d0d7de]")} />
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Canvas */}
        <main className="order-3 min-w-0 flex-1 bg-white min-[1100px]:order-2 min-[1100px]:overflow-y-auto">
          <div className="mx-auto max-w-[760px] divide-y divide-[#d8dee4] px-4 md:px-8">
            <section id="fable-dx-brief" className={cn("scroll-mt-24 py-6 group-data-[density=compact]/d:py-4", briefError && "-ml-4 border-l-2 border-red-500 pl-3 md:-ml-8 md:pl-7")}>
              <SectionHead title="Brief" hint={briefError ? "Needs more context" : `${brief.trim().length} chars`} />
              <label htmlFor="fable-dx-brief-text" className="sr-only">Campaign brief</label>
              <textarea
                id="fable-dx-brief-text"
                rows={compact ? 3 : 4}
                value={brief}
                onChange={(e) => { setBrief(e.target.value); if (briefError && e.target.value.trim().length >= BRIEF_MIN) setBriefError(false) }}
                onBlur={() => log("Brief edited")}
                aria-invalid={briefError}
                aria-describedby="fable-dx-brief-hint"
                className={cn("w-full resize-y rounded-[6px] border bg-white px-3 py-2 text-[13px] leading-relaxed", RING, briefError ? "border-red-500" : "border-[#d0d7de] hover:border-[#8c959f]")}
              />
              <p id="fable-dx-brief-hint" className={cn("mt-1 text-xs", briefError ? "text-red-600" : "text-[#656d76]")}>
                {briefError ? `At least ${BRIEF_MIN} characters are needed to generate.` : "Product, market, and what the campaign must do."}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="fable-dx-objective" className="text-xs text-[#656d76]">Objective</label>
                <select id="fable-dx-objective" value={objective} onChange={(e) => pickObjective(e.target.value, OBJECTIVES.find((o) => o.id === e.target.value)?.name ?? "")} className={cn("rounded-[6px] border border-[#d0d7de] bg-white px-2 font-mono text-xs hover:border-[#8c959f]", RING, compact ? "h-7" : "h-8")}>
                  {OBJECTIVES.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            </section>

            <section id="fable-dx-audience" className="scroll-mt-24 py-6 group-data-[density=compact]/d:py-4">
              <SectionHead title="Audience" hint="Size · fit" />
              <div role="radiogroup" aria-label="Target audience" className="divide-y divide-[#eaeef2]">
                {AUDIENCES.map((x) => {
                  const on = audience === x.id
                  return (
                    <button
                      key={x.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => pickAudience(x.id, x.name)}
                      className={cn("grid w-full grid-cols-[16px_1fr_auto] items-center gap-3 text-left hover:bg-[#f6f8fa] sm:grid-cols-[16px_minmax(0,1fr)_64px_minmax(0,1.2fr)]", RING, "focus-visible:ring-inset focus-visible:ring-offset-0", compact ? "py-1.5" : "py-2.5", on && "bg-indigo-50/60")}
                    >
                      <span aria-hidden="true" className={cn("flex h-4 w-4 items-center justify-center rounded-full border", on ? "border-indigo-600" : "border-[#8c959f]")}>{on && <span className="h-2 w-2 rounded-full bg-indigo-600" />}</span>
                      <span className={cn("truncate", on && "font-medium")}>{x.name}</span>
                      <span className="font-mono text-xs text-[#656d76]">{x.size}</span>
                      <span className="col-span-full pl-7 text-xs text-[#656d76] sm:col-span-1 sm:pl-0">{x.fit}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section id="fable-dx-channel" className="scroll-mt-24 py-6 group-data-[density=compact]/d:py-4">
              <SectionHead title="Channel" hint={ch.format} />
              <div role="radiogroup" aria-label="Channel" className="inline-flex max-w-full overflow-x-auto rounded-[6px] border border-[#d0d7de] bg-[#f6f8fa] p-0.5">
                {CHANNELS.map((x) => (
                  <button key={x.id} type="button" role="radio" aria-checked={channel === x.id} onClick={() => pickChannel(x.id, x.name)} className={cn("whitespace-nowrap rounded-[4px] text-xs", RING, compact ? "px-2.5 py-1" : "px-3 py-1.5", channel === x.id ? "bg-white font-medium shadow-sm" : "text-[#656d76] hover:text-[#1f2328]")}>
                    {x.name}
                  </button>
                ))}
              </div>
            </section>

            <section id="fable-dx-tone" className="scroll-mt-24 py-6 group-data-[density=compact]/d:py-4">
              <SectionHead title="Tone" hint={`CTA · ${tn.cta}`} />
              <div role="radiogroup" aria-label="Tone" className="grid grid-cols-3 overflow-hidden rounded-[6px] border border-[#d0d7de]">
                {TONES.map((x) => (
                  <button key={x.id} type="button" role="radio" aria-checked={tone === x.id} onClick={() => pickTone(x.id, x.name)} className={cn("border-r border-[#d0d7de] text-xs last:border-r-0", RING, "focus-visible:ring-inset focus-visible:ring-offset-0", compact ? "py-1.5" : "py-2", tone === x.id ? "bg-indigo-600 font-medium text-white" : "bg-white hover:bg-[#f6f8fa]")}>
                    {x.name}
                  </button>
                ))}
              </div>
            </section>

            <section id="fable-dx-style" className="scroll-mt-24 py-6 group-data-[density=compact]/d:py-4">
              <SectionHead title="Visual style" hint={`${st.bg} / ${st.accent}`} />
              <div role="radiogroup" aria-label="Visual style" className="flex flex-wrap gap-2">
                {STYLES.map((x) => {
                  const on = style === x.id
                  return (
                    <button key={x.id} type="button" role="radio" aria-checked={on} onClick={() => pickStyle(x.id, x.name)} className={cn("flex items-center gap-2 rounded-[6px] border pr-3 text-xs hover:border-[#8c959f]", RING, compact ? "p-1" : "p-1.5", on ? "border-indigo-600 ring-1 ring-indigo-600" : "border-[#d0d7de]")}>
                      <span aria-hidden="true" className="flex h-7 w-10 items-end justify-end rounded-[4px] p-1" style={{ background: x.bg }}>
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: x.accent }} />
                      </span>
                      {x.name}
                    </button>
                  )
                })}
              </div>
            </section>

            <section id="fable-dx-concepts" className="scroll-mt-24 py-6 group-data-[density=compact]/d:py-4">
              <SectionHead title="Concepts" hint="Arrow keys to move" />
              <div role="radiogroup" aria-label="Creative concept" onKeyDown={onConceptKeys} className="grid gap-3 sm:grid-cols-3">
                {CONCEPTS.map((k) => {
                  const on = concept === k.id
                  return (
                    <button
                      key={k.id}
                      id={`fable-dx-concept-${k.id}`}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => pickConcept(k.id)}
                      className={cn("rounded-[6px] border p-2 text-left hover:border-[#8c959f]", RING, on ? "border-indigo-600 ring-1 ring-indigo-600" : "border-[#d0d7de]")}
                    >
                      <span aria-hidden="true" className="flex aspect-[4/3] flex-col justify-between rounded-[4px] p-2.5" style={{ background: st.bg, color: st.fg }}>
                        <span className="font-mono text-[9px] opacity-60">{k.id} · {ch.format}</span>
                        <span>
                          <span className="block text-[11px] font-semibold leading-tight">{k.headlines[tone]}</span>
                          <span className="mt-1.5 inline-block rounded-[3px] px-1.5 py-0.5 text-[8px] font-semibold" style={{ background: st.accent, color: st.onAccent }}>{tn.cta}</span>
                        </span>
                      </span>
                      <span className="mt-2 flex items-center justify-between text-xs">
                        <span className={cn(on && "font-medium")}>{k.id} · {k.name}</span>
                        {on && <Check className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section id="fable-dx-forecast" className="scroll-mt-24 py-6 group-data-[density=compact]/d:py-4">
              <SectionHead title="Forecast" hint={`${ob.name} · ${a.name} · ${ch.name}`} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-xs">
                  <thead>
                    <tr className="text-left text-[#656d76]">
                      <th scope="col" className="py-1.5 pr-3 font-medium">Metric</th>
                      {CONCEPTS.map((k) => (
                        <th key={k.id} scope="col" className={cn("px-3 py-1.5 font-medium", concept === k.id && "rounded-t-[6px] bg-indigo-50 text-indigo-700")}>
                          <button type="button" onClick={() => pickConcept(k.id)} aria-pressed={concept === k.id} className={cn("rounded-[4px] px-1", RING)}>Concept {k.id}</button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(["reach", "ctr", "cvr"] as const).map((m, ri) => (
                      <tr key={m} className="border-t border-[#eaeef2]">
                        <th scope="row" className={cn("pr-3 text-left font-medium", compact ? "py-1.5" : "py-2")}>{m === "reach" ? "Reach" : m === "ctr" ? "CTR" : "Conversion"}</th>
                        {forecast.map((f) => (
                          <td key={f.id} className={cn("px-3 font-mono tabular-nums", compact ? "py-1.5" : "py-2", concept === f.id && cn("bg-indigo-50 text-indigo-800", ri === 2 && "rounded-b-[6px]"))}>
                            {m === "reach" ? reachLabel(f.reach) : `${f[m].toFixed(1)}%`}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        {/* Inspector */}
        <aside aria-label="Inspector" className="order-1 border-b border-[#d0d7de] bg-white min-[1100px]:order-3 min-[1100px]:overflow-y-auto min-[1100px]:border-b-0 min-[1100px]:border-l">
          <div className="flex gap-4 overflow-x-auto p-3 min-[1100px]:sticky min-[1100px]:top-0 min-[1100px]:flex-col min-[1100px]:gap-5 min-[1100px]:p-4">
            {/* Phone preview */}
            <div className="shrink-0">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#656d76]">Preview · {ch.name}</p>
              <div className="relative mx-auto aspect-[9/19.5] w-[210px] overflow-hidden rounded-[28px] border-[6px] border-[#1f2328] bg-[#0d1117] shadow-xl min-[1100px]:w-[240px]" aria-label="Main creative preview">
                <div aria-hidden="true" className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-[#1f2328]" />
                <div className="flex h-full flex-col bg-white pt-8 text-[#1f2328]">
                  <div className="flex items-center gap-2 px-3 pb-2">
                    <span className="h-6 w-6 rounded-full" style={{ background: st.accent }} />
                    <span className="text-[10px] font-semibold">Lingo</span>
                    <span className="text-[9px] text-[#656d76]">Sponsored</span>
                  </div>
                  <div className="mx-2 flex flex-1 flex-col justify-between rounded-[10px] p-3" style={{ background: st.bg, color: st.fg }}>
                    <span className="font-mono text-[8px] opacity-60">{c.id} · {ch.format} · {a.name}</span>
                    <div>
                      <p className="text-[15px] font-bold leading-tight min-[1100px]:text-[17px]">{headline}</p>
                      <p className="mt-2 text-[10px] leading-snug opacity-80">{c.body}</p>
                    </div>
                    <span className="flex gap-1">
                      {[st.bg, st.accent, st.fg].map((col) => <span key={col} className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ background: col }} />)}
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="flex h-8 items-center justify-center rounded-[6px] text-[11px] font-semibold" style={{ background: st.accent, color: st.onAccent }}>{tn.cta}</span>
                    <p className="mt-1.5 px-1 text-[9px] leading-snug text-[#656d76]">{ob.name} · {tn.name.toLowerCase()} · Lingo for {a.name.toLowerCase()}</p>
                  </div>
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]" role="status" aria-label="Rendering">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600 motion-reduce:animate-none" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            {/* Properties + Activity */}
            <div className="flex min-w-[240px] flex-1 gap-4 min-[1100px]:flex-col min-[1100px]:gap-5">
              <div className="min-w-[220px] flex-1">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#656d76]">Properties</p>
                <dl className="divide-y divide-[#eaeef2] border-y border-[#eaeef2]">
                  {properties.map(([k, v]) => (
                    <div key={k} className={cn("flex justify-between gap-3", compact ? "py-1" : "py-1.5")}>
                      <dt className="text-xs text-[#656d76]">{k}</dt>
                      <dd className="truncate font-mono text-xs">{v}</dd>
                    </div>
                  ))}
                  <div className={cn("flex justify-between gap-3", compact ? "py-1" : "py-1.5")}>
                    <dt className="text-xs text-[#656d76]">Forecast</dt>
                    <dd className="font-mono text-xs">{reachLabel(current.reach)} · {current.ctr.toFixed(1)}% · {current.cvr.toFixed(1)}%</dd>
                  </div>
                </dl>
              </div>
              <div className="min-w-[220px] flex-1">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#656d76]">Activity</p>
                <ol className="max-h-40 overflow-y-auto min-[1100px]:max-h-none">
                  {activity.map((e) => (
                    <li key={e.id} className={cn("flex gap-2 text-xs", compact ? "py-0.5" : "py-1")}>
                      <time className="shrink-0 font-mono text-[#656d76]">{e.at}</time>
                      <span className="truncate">{e.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Status bar */}
      <footer className="relative flex h-7 items-center gap-4 overflow-hidden border-t border-[#d0d7de] bg-white px-3 font-mono text-[11px] text-[#656d76]">
        {loading && (
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-indigo-100">
            <span className="fable-dx-bar absolute top-0 h-full w-[30%] bg-indigo-600" />
          </span>
        )}
        <span>{loading ? "Generating…" : savedAt ? `Draft · saved ${ago(savedAt, now)}` : "Draft · unsaved"}</span>
        <span>3 concepts</span>
        <span className="ml-auto hidden items-center gap-3 md:flex">
          {[["G", "Generate"], ["S", "Save"], ["E", "Export"]].map(([k, v]) => (
            <span key={k}><kbd className="rounded-[3px] border border-[#d0d7de] bg-[#f6f8fa] px-1">{k}</kbd> {v}</span>
          ))}
        </span>
      </footer>

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-10 right-3 z-50 flex w-[calc(100%-24px)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role={t.kind === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex items-start gap-2 rounded-[6px] border bg-white px-3 py-2 text-xs shadow-lg", t.kind === "error" ? "border-red-300" : "border-[#d0d7de]")}>
            {t.kind === "error" ? <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden="true" /> : <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />}
            <span className="flex-1">{t.text}</span>
            {t.retry && (
              <button type="button" onClick={() => { setToasts((p) => p.filter((x) => x.id !== t.id)); generate() }} className={cn("inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-medium text-indigo-700 hover:bg-indigo-50", RING)}>
                <RotateCcw className="h-3 w-3" aria-hidden="true" />Retry
              </button>
            )}
            <button type="button" onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} aria-label="Dismiss" className={cn("rounded-[4px] p-0.5 text-[#656d76] hover:text-[#1f2328]", RING)}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
