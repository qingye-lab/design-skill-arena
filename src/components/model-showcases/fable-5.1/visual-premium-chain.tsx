"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, SlidersHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"

type ConceptIndex = 0 | 1 | 2
type Control = "audience" | "channel" | "tone" | "style"
type Status = "idle" | "loading" | "success" | "error"

const IVORY = "#f6f1e8"
const INK = "#141210"
const GOLD = "#b3924f"
const OXBLOOD = "#7a2e2e"

interface Concept {
  number: string
  name: string
  headline: Record<string, string>
  subtitle: string
  tint: string
  hands: { hour: number; minute: number; second: number }
  base: { reach: number; ctr: number; conv: number }
}

const CONCEPTS: Concept[] = [
  {
    number: "01",
    name: "Two cities, one dial",
    headline: {
      Reserved: "Two cities. One dial.",
      Poetic: "Home is the hour you carry with you.",
      Precise: "Dual time. Sapphire. 72 hours of reserve.",
    },
    subtitle: "The Meridian keeps a second hour beneath sapphire, so departure and arrival share one face.",
    tint: "#1c2b4a",
    hands: { hour: 10, minute: 8, second: 34 },
    base: { reach: 64000, ctr: 1.9, conv: 0.62 },
  },
  {
    number: "02",
    name: "Time, kept twice",
    headline: {
      Reserved: "Time, kept twice.",
      Poetic: "Somewhere, it is already evening.",
      Precise: "Independent GMT hand. 4 Hz. Hand-finished.",
    },
    subtitle: "An independent hand tracks the hour you left behind, adjusted with a single crown pull.",
    tint: "#4a3220",
    hands: { hour: 2, minute: 40, second: 12 },
    base: { reach: 52000, ctr: 2.3, conv: 0.81 },
  },
  {
    number: "03",
    name: "The hour, held",
    headline: {
      Reserved: "The hour, held.",
      Poetic: "Patience, measured in sapphire.",
      Precise: "41 mm. 11.2 mm thin. Anti-reflective on both sides.",
    },
    subtitle: "Machined from a single block of steel, finished by hand, and asked to last longer than its owner.",
    tint: "#26332b",
    hands: { hour: 7, minute: 22, second: 50 },
    base: { reach: 47000, ctr: 2.0, conv: 0.94 },
  },
]

const OPTIONS: Record<Control, string[]> = {
  audience: ["Collectors", "Frequent flyers", "First-watch buyers", "Gift givers"],
  channel: ["Print spread", "Instagram", "Airport OOH", "Newsletter"],
  tone: ["Reserved", "Poetic", "Precise"],
  style: ["Deep sapphire", "Warm film", "Monochrome", "Line drawing"],
}

const CONTROL_LABEL: Record<Control, string> = {
  audience: "Audience",
  channel: "Channel",
  tone: "Tone",
  style: "Visual style",
}

const CHANNEL: Record<string, { reach: number; ctr: number; format: string }> = {
  "Print spread": { reach: 0.6, ctr: 0.8, format: "Print · double spread" },
  Instagram: { reach: 1.6, ctr: 1.1, format: "Instagram · 4:5" },
  "Airport OOH": { reach: 2.4, ctr: 0.35, format: "Airport · portrait panel" },
  Newsletter: { reach: 0.4, ctr: 2.2, format: "Newsletter · hero" },
}

const AUDIENCE: Record<string, { conv: number; line: string }> = {
  Collectors: { conv: 1.3, line: "For those who already own a watch, and want another reason." },
  "Frequent flyers": { conv: 1.1, line: "For the seat by the window, six time zones from home." },
  "First-watch buyers": { conv: 0.85, line: "For a first watch chosen to be the last." },
  "Gift givers": { conv: 1.0, line: "For an occasion that deserves an object." },
}

interface Ledger {
  id: number
  time: string
  text: string
}

const INITIAL_LEDGER: Ledger[] = [
  { id: 2, time: "11:04:16", text: "Plate 01 composed" },
  { id: 1, time: "11:02:40", text: "Direction opened · Meridian" },
]

const DEFAULT_BRIEF =
  "Introduce the Meridian dual-time. Sapphire dial, independent GMT hand, 72-hour reserve. Speak quietly; let the object carry the weight. No superlatives. Close with the atelier address, not a discount."

const MIN_BRIEF = 30

function timeNow() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false })
}

function Dial({ hands, style, tint }: { hands: Concept["hands"]; style: string; tint: string }) {
  const line = style === "Line drawing"
  const stroke = style === "Monochrome" ? IVORY : GOLD
  const hourAngle = (hands.hour % 12) * 30 + hands.minute * 0.5
  const minuteAngle = hands.minute * 6
  const gmtAngle = ((hands.hour + 6) % 24) * 15
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full" role="img" aria-label="Meridian dual-time dial">
      <circle cx="100" cy="100" r="94" fill={line ? "none" : `${tint}`} stroke={stroke} strokeWidth="0.6" />
      <circle cx="100" cy="100" r="84" fill="none" stroke={IVORY} strokeOpacity="0.25" strokeWidth="0.4" />
      {Array.from({ length: 60 }).map((_, i) => {
        const major = i % 5 === 0
        return (
          <line
            key={i}
            x1="100"
            y1={major ? 12 : 15}
            x2="100"
            y2="19"
            stroke={major ? stroke : IVORY}
            strokeOpacity={major ? 1 : 0.5}
            strokeWidth={major ? 1 : 0.4}
            transform={`rotate(${i * 6} 100 100)`}
          />
        )
      })}
      {/* 24-hour sub-dial */}
      <circle cx="100" cy="138" r="22" fill="none" stroke={IVORY} strokeOpacity="0.35" strokeWidth="0.4" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="117"
          x2="100"
          y2={i % 6 === 0 ? 121 : 119}
          stroke={IVORY}
          strokeOpacity="0.6"
          strokeWidth="0.4"
          transform={`rotate(${i * 15} 100 138)`}
        />
      ))}
      <line x1="100" y1="138" x2="100" y2="121" stroke={stroke} strokeWidth="0.8" transform={`rotate(${gmtAngle} 100 138)`} />
      <text x="100" y="70" textAnchor="middle" fontSize="6" fill={IVORY} fillOpacity="0.8" letterSpacing="1.5" fontFamily="Georgia, serif">
        MERIDIAN
      </text>
      <text x="100" y="80" textAnchor="middle" fontSize="4" fill={IVORY} fillOpacity="0.5" letterSpacing="1.2" fontFamily="Georgia, serif">
        DUAL TIME
      </text>
      <line x1="100" y1="100" x2="100" y2="48" stroke={IVORY} strokeWidth="2" strokeLinecap="round" transform={`rotate(${hourAngle} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="28" stroke={IVORY} strokeWidth="1.3" strokeLinecap="round" transform={`rotate(${minuteAngle} 100 100)`} />
      <line x1="100" y1="108" x2="100" y2="24" stroke={stroke} strokeWidth="0.5" transform={`rotate(${hands.second * 6} 100 100)`} />
      <circle cx="100" cy="100" r="2" fill={stroke} />
    </svg>
  )
}

export default function VisualPremiumChain() {
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [picks, setPicks] = useState<Record<Control, string>>({
    audience: "Collectors",
    channel: "Print spread",
    tone: "Reserved",
    style: "Deep sapphire",
  })
  const [index, setIndex] = useState<ConceptIndex>(0)
  const [previous, setPrevious] = useState<{ reach: number; ctr: number; conv: number } | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [saved, setSaved] = useState(false)
  const [exported, setExported] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [ledger, setLedger] = useState<Ledger[]>(INITIAL_LEDGER)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const generateCount = useRef(0)
  const nextId = useRef(100)
  const briefRef = useRef<HTMLTextAreaElement>(null)
  const directionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    briefRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        directionRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [drawerOpen])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const log = useCallback((text: string) => {
    nextId.current += 1
    const entry = { id: nextId.current, time: timeNow(), text }
    setLedger((prev) => [entry, ...prev].slice(0, 5))
  }, [])

  const concept = CONCEPTS[index]
  const channel = CHANNEL[picks.channel]
  const audience = AUDIENCE[picks.audience]
  const metrics = {
    reach: Math.round(concept.base.reach * channel.reach),
    ctr: concept.base.ctr * channel.ctr * (picks.tone === "Precise" ? 1.06 : 1),
    conv: concept.base.conv * audience.conv * (picks.style === "Line drawing" ? 0.92 : 1),
  }
  const briefTooShort = brief.trim().length < MIN_BRIEF

  function selectConcept(i: ConceptIndex) {
    if (i === index) return
    setPrevious(metrics)
    setIndex(i)
    setStatus((s) => (s === "error" ? "idle" : s))
    log(`Plate ${CONCEPTS[i].number} selected`)
  }

  function pickOption(control: Control, value: string) {
    if (picks[control] === value) return
    setPicks((p) => ({ ...p, [control]: value }))
    log(`${CONTROL_LABEL[control]} · ${value}`)
  }

  function handleGenerate() {
    if (status === "loading") return
    setStatus("loading")
    generateCount.current += 1
    // Error rule: a brief under 30 characters always fails; every 4th generate fails.
    const willFail = briefTooShort || generateCount.current % 4 === 0
    later(() => {
      if (willFail) {
        setStatus("error")
        log(`Plate ${concept.number} failed to compose`)
      } else {
        setStatus("success")
        log(`Plate ${concept.number} composed · ${picks.channel}`)
        later(() => setStatus((s) => (s === "success" ? "idle" : s)), 2500)
      }
    }, 1600)
  }

  function handleSave() {
    if (saved) return
    setSaved(true)
    log(`Plate ${concept.number} saved`)
    later(() => setSaved(false), 2000)
  }

  function handleExport() {
    if (exported) return
    setExported(true)
    log(`Plate ${concept.number} exported · PDF`)
    later(() => setExported(false), 2000)
  }

  const headline = concept.headline[picks.tone] ?? concept.headline.Reserved
  const tint =
    picks.style === "Monochrome"
      ? "#2a2724"
      : picks.style === "Warm film"
        ? "#4a3a2a"
        : picks.style === "Line drawing"
          ? INK
          : concept.tint

  const deltas = previous
    ? {
        reach: metrics.reach - previous.reach,
        ctr: metrics.ctr - previous.ctr,
        conv: metrics.conv - previous.conv,
      }
    : null

  const fmtDelta = (n: number, unit: "k" | "pt") => {
    const sign = n > 0 ? "+" : n < 0 ? "−" : "±"
    const v = unit === "k" ? `${(Math.abs(n) / 1000).toFixed(1)}k` : Math.abs(n).toFixed(2)
    return `${sign}${v} vs previous plate`
  }

  const forecast = [
    { label: "Reach", value: `${(metrics.reach / 1000).toFixed(0)}k`, delta: deltas ? fmtDelta(deltas.reach, "k") : "Baseline plate" },
    { label: "Click-through", value: `${metrics.ctr.toFixed(2)}%`, delta: deltas ? fmtDelta(deltas.ctr, "pt") : "Baseline plate" },
    { label: "Conversion", value: `${metrics.conv.toFixed(2)}%`, delta: deltas ? fmtDelta(deltas.conv, "pt") : "Baseline plate" },
  ]

  const focusRing =
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#b3924f]"

  const indexButtons = CONCEPTS.map((c, i) => {
    const active = i === index
    return (
      <button
        key={c.number}
        type="button"
        role="radio"
        aria-checked={active}
        aria-label={`Plate ${c.number}, ${c.name}`}
        onClick={() => selectConcept(i as ConceptIndex)}
        className={cn(
          "group flex items-center gap-3 rounded-sm py-2 text-sm tracking-[0.2em] transition-opacity duration-300 motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-40 hover:opacity-100",
          focusRing,
        )}
        style={{ color: active ? GOLD : IVORY }}
      >
        <span className="tabular-nums">{c.number}</span>
        <span
          aria-hidden
          className="h-px transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: active ? 28 : 12, background: active ? GOLD : `${IVORY}66` }}
        />
      </button>
    )
  })

  return (
    <div className="flex min-h-dvh flex-col font-serif" style={{ background: INK, color: IVORY }}>
      <style>{`
        @keyframes fable-vp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fable-vp-progress { from { width: 0; } to { width: 100%; } }
        @keyframes fable-vp-drawer { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .fable-vp-anim { animation: none !important; }
        }
      `}</style>

      {/* Masthead */}
      <header
        className="grid grid-cols-2 items-center gap-y-2 border-b px-5 py-4 min-[900px]:grid-cols-[1fr_auto_1fr] min-[900px]:px-8"
        style={{ background: IVORY, color: INK, borderColor: `${INK}1f` }}
      >
        <p className="text-[11px] tracking-[0.28em] uppercase">
          Muse <span aria-hidden>—</span> Campaign Studio
        </p>
        <h1 className="col-span-2 order-last text-center text-lg tracking-wide min-[900px]:order-none min-[900px]:col-span-1">
          Visual Premium Chain
        </h1>
        <div className="flex items-center justify-end gap-3 text-[10px] tracking-[0.22em] uppercase">
          <span className="hidden sm:inline">Fable 5.1</span>
          <span className="hidden opacity-60 sm:inline">frontend-skill + taste-skill + impeccable</span>
          <button
            ref={directionRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 text-[11px] tracking-[0.22em] uppercase transition-colors hover:border-current",
              focusRing,
            )}
          >
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Direction
          </button>
        </div>
        <p className="col-span-2 text-[10px] tracking-[0.22em] uppercase opacity-70 sm:hidden">
          Fable 5.1 · frontend-skill + taste-skill + impeccable
        </p>
      </header>

      {/* Stage */}
      <main className="grid flex-1 grid-cols-1 gap-8 px-5 py-8 min-[900px]:grid-cols-[72px_minmax(0,1fr)_320px] min-[900px]:gap-10 min-[900px]:px-8 min-[900px]:py-12">
        {/* Index */}
        <nav aria-label="Plates" className="min-[900px]:pt-2">
          <div role="radiogroup" aria-label="Concept plate" className="flex flex-row gap-6 min-[900px]:flex-col min-[900px]:gap-3">
            {indexButtons}
          </div>
        </nav>

        {/* Plate */}
        <section aria-labelledby="fable-vp-plate" className="flex flex-col items-center">
          <h2 id="fable-vp-plate" className="sr-only">
            Campaign plate
          </h2>
          <div className="w-full max-w-[520px]">
            <article
              key={`${index}-${picks.tone}-${picks.style}`}
              className="fable-vp-anim relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden border p-7 transition-colors duration-500 sm:p-10 min-[900px]:aspect-[3/4]"
              style={{
                borderColor: status === "error" ? OXBLOOD : `${IVORY}26`,
                background: `radial-gradient(120% 90% at 50% 20%, ${tint} 0%, ${INK} 70%)`,
                animation: "fable-vp-fade 0.6s ease-out",
              }}
            >
              {status === "loading" && (
                <span
                  aria-hidden
                  className="fable-vp-anim absolute top-0 left-0 h-px"
                  style={{ background: GOLD, animation: "fable-vp-progress 1.6s linear forwards" }}
                />
              )}

              <header className="flex items-start justify-between text-[10px] tracking-[0.24em] uppercase" style={{ color: `${IVORY}99` }}>
                <span>Meridian</span>
                <span>{channel.format}</span>
              </header>

              <div className={cn("transition-opacity duration-500", status === "loading" && "opacity-30")}>
                <p className="text-xs italic" style={{ color: `${IVORY}b3` }}>
                  {audience.line}
                </p>
                <p className="mt-4 text-3xl leading-[1.08] tracking-tight sm:text-[2.6rem]">{headline}</p>
                <p className="mt-4 max-w-[34ch] text-sm leading-relaxed" style={{ color: `${IVORY}cc` }}>
                  {concept.subtitle}
                </p>
                <span aria-hidden className="mt-6 block h-px w-16" style={{ background: GOLD }} />
              </div>

              <div className="mx-auto w-[46%] sm:w-[42%]">
                <Dial hands={concept.hands} style={picks.style} tint={tint} />
              </div>

              <footer className="flex items-end justify-between text-[10px] tracking-[0.24em] uppercase" style={{ color: `${IVORY}99` }}>
                <span>Sapphire dual-time</span>
                <span style={{ color: GOLD }}>Plate {concept.number}</span>
              </footer>
            </article>

            {status === "error" && (
              <p role="alert" className="mt-4 text-sm italic" style={{ color: `${IVORY}cc` }}>
                {briefTooShort
                  ? `The brief is too brief — give the atelier at least ${MIN_BRIEF} characters.`
                  : "The plate could not be composed. The engraver has been notified."}
                <button
                  type="button"
                  onClick={handleGenerate}
                  className={cn("ml-3 border-b not-italic tracking-[0.18em] uppercase", focusRing)}
                  style={{ color: GOLD, borderColor: GOLD, fontSize: 11 }}
                >
                  Try again
                </button>
              </p>
            )}

            {/* Action bar */}
            <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-5" style={{ borderColor: `${IVORY}1f` }}>
              <button
                type="button"
                onClick={handleSave}
                className={cn("text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-100", saved ? "opacity-100" : "opacity-70", focusRing)}
                style={{ color: saved ? GOLD : IVORY }}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className={cn("text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-100", exported ? "opacity-100" : "opacity-70", focusRing)}
                style={{ color: exported ? GOLD : IVORY }}
              >
                {exported ? "Exported" : "Export"}
              </button>
              <div className="ml-auto flex items-center gap-4">
                <span role="status" aria-live="polite" className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase">
                  {status === "loading" && <span style={{ color: `${IVORY}99` }}>Composing</span>}
                  {status === "success" && (
                    <span className="fable-vp-anim flex items-center gap-1.5" style={{ color: GOLD, animation: "fable-vp-fade 0.5s ease-out" }}>
                      <Check className="size-3.5" aria-hidden /> Plate composed
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={status === "loading"}
                  className={cn(
                    "rounded-full px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-opacity hover:opacity-90 disabled:cursor-progress disabled:opacity-60",
                    focusRing,
                  )}
                  style={{ background: GOLD, color: INK }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Paper column */}
        <aside className="flex flex-col p-6 sm:p-7" style={{ background: IVORY, color: INK }}>
          <section aria-labelledby="fable-vp-forecast">
            <h2 id="fable-vp-forecast" className="text-[10px] tracking-[0.28em] uppercase opacity-60">
              Forecast
            </h2>
            <dl className="mt-3 divide-y" style={{ borderColor: `${INK}1f` }}>
              {forecast.map((f) => (
                <div key={f.label} className="py-5 first:pt-2" style={{ borderColor: `${INK}1f` }}>
                  <dt className="text-[10px] tracking-[0.24em] uppercase opacity-70">{f.label}</dt>
                  <dd className="mt-1 text-5xl leading-none tracking-tight tabular-nums sm:text-6xl">{f.value}</dd>
                  <dd className="mt-2 text-xs italic opacity-70">{f.delta}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="fable-vp-ledger" className="mt-auto border-t pt-5" style={{ borderColor: `${INK}1f` }}>
            <h2 id="fable-vp-ledger" className="text-[10px] tracking-[0.28em] uppercase opacity-60">
              Ledger
            </h2>
            <ol className="mt-3 space-y-2">
              {ledger.map((l) => (
                <li key={l.id} className="flex gap-3 text-xs leading-5">
                  <time className="shrink-0 font-mono text-[11px] tabular-nums opacity-60">{l.time}</time>
                  <span>{l.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </main>

      {/* Direction drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close direction"
            onClick={() => setDrawerOpen(false)}
            className="fable-vp-anim absolute inset-0 bg-black/50"
            style={{ animation: "fable-vp-fade 0.3s ease-out" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fable-vp-direction"
            className="fable-vp-anim absolute inset-0 flex flex-col overflow-y-auto p-6 min-[900px]:inset-y-0 min-[900px]:right-0 min-[900px]:left-auto min-[900px]:w-[440px] min-[900px]:p-8"
            style={{ background: IVORY, color: INK, animation: "fable-vp-drawer 0.35s ease-out" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 id="fable-vp-direction" className="text-[10px] tracking-[0.28em] uppercase opacity-60">
                  Direction
                </h2>
                <p className="mt-1 text-xl">Set the plate</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setDrawerOpen(false)
                  directionRef.current?.focus()
                }}
                className={cn("-m-2 p-2 opacity-70 hover:opacity-100", focusRing)}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <label htmlFor="fable-vp-brief" className="text-[10px] tracking-[0.24em] uppercase opacity-70">
                  Brief
                </label>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: briefTooShort ? OXBLOOD : `${INK}99` }}>
                  {brief.length} / {MIN_BRIEF} min
                </span>
              </div>
              <textarea
                ref={briefRef}
                id="fable-vp-brief"
                rows={6}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onBlur={() => log("Brief revised")}
                className={cn("mt-2 w-full resize-none border-0 bg-transparent px-0 text-sm leading-7 focus-visible:outline-offset-4", focusRing)}
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 27px, ${INK}26 27px 28px)`,
                  backgroundAttachment: "local",
                }}
              />
            </div>

            {(Object.keys(OPTIONS) as Control[]).map((control) => (
              <div key={control} className="mt-7 border-t pt-5" style={{ borderColor: `${INK}1f` }}>
                <p id={`fable-vp-${control}`} className="text-[10px] tracking-[0.24em] uppercase opacity-70">
                  {CONTROL_LABEL[control]}
                </p>
                <div role="radiogroup" aria-labelledby={`fable-vp-${control}`} className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {OPTIONS[control].map((opt) => {
                    const active = picks[control] === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => pickOption(control, opt)}
                        className={cn(
                          "border-b pb-0.5 text-sm transition-colors hover:opacity-100",
                          active ? "opacity-100" : "border-transparent opacity-60",
                          focusRing,
                        )}
                        style={{ borderColor: active ? GOLD : undefined, color: INK }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
