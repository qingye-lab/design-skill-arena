"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { ArrowRight, ArrowUpRight, Download, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------- tokens */

const PAPER = "#f3efe7"
const INK = "#1a1816"
const ORANGE = "#e0542c"

/* ------------------------------------------------------------- mock data */

type ConceptId = "A" | "B" | "C"
type Audience = "Commuters" | "Students" | "Parents"
type Channel = "Social" | "Retail display" | "Email" | "Out-of-home"
type Tone = "Confident" | "Playful" | "Calm"
type Style = "Editorial" | "Technical" | "Minimal"

type Concept = {
  id: ConceptId
  name: string
  accent: string
  headlines: [string, string]
  subByTone: Record<Tone, string>
  base: { reach: number; ctr: number; conv: number }
}

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Charge in your hand",
    accent: ORANGE,
    headlines: ["Take the battery. Leave the bike.", "The lock-up is not the charge-up."],
    subByTone: {
      Confident: "Volt's 2.1 kg battery slides out and charges at your desk. Forty miles, zero outlets in the hallway.",
      Playful: "Pop the battery, pocket the range. Volt charges wherever you put your coffee down.",
      Calm: "A battery you carry in, not a bike you carry up. Volt charges quietly beside you.",
    },
    base: { reach: 1.4, ctr: 3.2, conv: 2.1 },
  },
  {
    id: "B",
    name: "Nineteen kilos",
    accent: "#3d5a80",
    headlines: ["Light enough for the fourth floor.", "Nineteen kilos. One flight at a time."],
    subByTone: {
      Confident: "Volt weighs 19 kg with the battery in. Stairs, trains and hallways stop being the hard part.",
      Playful: "Carry it like a bag of groceries. Ride it like you skipped the queue.",
      Calm: "Nineteen kilos is a number you can lift. Volt was built around it.",
    },
    base: { reach: 1.1, ctr: 4.1, conv: 2.6 },
  },
  {
    id: "C",
    name: "The 8:40 promise",
    accent: "#5c7a4a",
    headlines: ["Arrive on time. Arrive unbothered.", "Every 8:40 becomes an 8:29."],
    subByTone: {
      Confident: "Twenty-two minutes across town, no sweat and no parking. Volt turns commutes into arrivals.",
      Playful: "Beat the bus, skip the shower. Volt gets you there with your hair intact.",
      Calm: "A quieter route in. Volt keeps pace with the city without racing it.",
    },
    base: { reach: 1.7, ctr: 2.6, conv: 1.7 },
  },
]

const AUDIENCES: Audience[] = ["Commuters", "Students", "Parents"]
const CHANNELS: Channel[] = ["Social", "Retail display", "Email", "Out-of-home"]
const TONES: Tone[] = ["Confident", "Playful", "Calm"]
const STYLES: Style[] = ["Editorial", "Technical", "Minimal"]

const FORMAT_BY_CHANNEL: Record<Channel, string> = {
  Social: "4:5 feed post",
  "Retail display": "A1 counter poster",
  Email: "600px header",
  "Out-of-home": "6-sheet panel",
}

// Channel multipliers applied to the concept base values.
const CHANNEL_WEIGHT: Record<Channel, { reach: number; ctr: number; conv: number; note: string }> = {
  Social: { reach: 1.3, ctr: 1.1, conv: 1.0, note: "Social weights Reach ×1.3 and CTR ×1.1." },
  "Retail display": { reach: 0.7, ctr: 1.0, conv: 1.2, note: "Retail display weights Conversion ×1.2." },
  Email: { reach: 0.5, ctr: 1.4, conv: 1.15, note: "Email weights CTR ×1.4 and Conversion ×1.15." },
  "Out-of-home": { reach: 1.6, ctr: 0.8, conv: 0.85, note: "Out-of-home weights Reach ×1.6 and lowers CTR ×0.8." },
}

const AUDIENCE_SHIFT: Record<Audience, number> = { Commuters: 1.0, Students: 1.08, Parents: 0.94 }
const TONE_SHIFT: Record<Tone, number> = { Confident: 1.0, Playful: 1.05, Calm: 0.97 }

function forecastFor(c: Concept, channel: Channel, audience: Audience, tone: Tone) {
  const w = CHANNEL_WEIGHT[channel]
  const shift = AUDIENCE_SHIFT[audience] * TONE_SHIFT[tone]
  return {
    reach: c.base.reach * w.reach * shift,
    ctr: c.base.ctr * w.ctr * shift,
    conv: c.base.conv * w.conv * shift,
  }
}

const INITIAL_BRIEF =
  "Launch Volt, a 19 kg commuter e-bike with a removable battery, to city riders who live in walk-up flats and want a bike they can actually charge indoors."

const INITIAL_LOG = ["14:00 Brief drafted", "14:00 Audience → Commuters", "14:01 Selected Concept A"]

const MIN_BRIEF = 20

function clock() {
  return new Date().toTimeString().slice(0, 5)
}

/* --------------------------------------------------------------- pieces */

function BikeSilhouette({ accent, className }: { accent: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden="true" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="66" cy="126" r="46" />
      <circle cx="254" cy="126" r="46" />
      <circle cx="66" cy="126" r="4" fill={accent} />
      <circle cx="254" cy="126" r="4" fill={accent} />
      <path d="M66 126 L118 48 L172 48 L212 126 Z" />
      <path d="M118 48 L146 126 L212 126" />
      <path d="M212 126 L232 52 L254 126" />
      <path d="M100 42 L136 42" />
      <path d="M224 44 L248 40" />
      <rect x="126" y="62" width="60" height="16" rx="3" fill={accent} opacity="0.9" />
      <circle cx="146" cy="126" r="12" />
    </svg>
  )
}

/* ------------------------------------------------------------- component */

export default function DesignLogic() {
  const [brief, setBrief] = useState(INITIAL_BRIEF)
  const [audience, setAudience] = useState<Audience>("Commuters")
  const [channel, setChannel] = useState<Channel>("Social")
  const [tone, setTone] = useState<Tone>("Confident")
  const [style, setStyle] = useState<Style>("Editorial")
  const [selected, setSelected] = useState<ConceptId>("A")
  const [variant, setVariant] = useState<Record<ConceptId, 0 | 1>>({ A: 0, B: 0, C: 0 })
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorNote, setErrorNote] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>(INITIAL_LOG)
  const [exported, setExported] = useState(false)

  const attempts = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const columnRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const loading = phase === "loading"

  const record = (text: string) => setLog((prev) => [`${clock()} ${text}`, ...prev].slice(0, 12))

  const pickConcept = (id: ConceptId) => {
    if (id === selected) return
    setSelected(id)
    setPhase("idle")
    record(`Selected Concept ${id}`)
  }

  const onColumnKey = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const id = CONCEPTS[index].id
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      pickConcept(id)
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const next = (index + 1) % CONCEPTS.length
      pickConcept(CONCEPTS[next].id)
      columnRefs.current[next]?.focus()
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prev = (index + CONCEPTS.length - 1) % CONCEPTS.length
      pickConcept(CONCEPTS[prev].id)
      columnRefs.current[prev]?.focus()
    }
  }

  // Error rule: a brief shorter than MIN_BRIEF characters fails immediately;
  // otherwise every 4th generate attempt fails with a mock capacity error.
  const generate = () => {
    if (loading) return
    attempts.current += 1
    if (brief.trim().length < MIN_BRIEF) {
      setPhase("error")
      setErrorNote(`The brief needs at least ${MIN_BRIEF} characters before Muse can compose from it.`)
      record("Generate failed · brief too short")
      return
    }
    setPhase("loading")
    setErrorNote(null)
    record(`Composing Concept ${selected}`)
    timer.current = setTimeout(() => {
      if (attempts.current % 4 === 0) {
        setPhase("error")
        setErrorNote("The composer is at capacity for this channel. Nothing was changed.")
        record("Generate failed · capacity")
        return
      }
      setVariant((v) => ({ ...v, [selected]: v[selected] === 0 ? 1 : 0 }))
      setPhase("success")
      record(`New draft for Concept ${selected}`)
    }, 1500)
  }

  const save = () => {
    setExported(false)
    record(`Saved Concept ${selected} · ${channel}`)
  }
  const exportPlan = () => {
    setExported(true)
    record(`Exported ${FORMAT_BY_CHANNEL[channel]} · Concept ${selected}`)
  }

  const setControl = <T extends string>(setter: (v: T) => void, label: string) => (v: T) => {
    setter(v)
    setPhase((p) => (p === "success" ? "idle" : p))
    record(`${label} → ${v}`)
  }

  const gridCols = selected === "A" ? "6fr 3fr 3fr" : selected === "B" ? "3fr 6fr 3fr" : "3fr 3fr 6fr"
  const hasError = phase === "error"
  const rows: Array<{ key: "reach" | "ctr" | "conv"; label: string; max: number; fmt: (n: number) => string }> = [
    { key: "reach", label: "Reach", max: 3.2, fmt: (n) => `${n.toFixed(2)}M` },
    { key: "ctr", label: "CTR", max: 6.5, fmt: (n) => `${n.toFixed(1)}%` },
    { key: "conv", label: "Conversion", max: 4, fmt: (n) => `${n.toFixed(1)}%` },
  ]

  const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1816]"

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: PAPER, color: INK }}>
      <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-12">
        {/* ------------------------------------------------ brief bar */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 flex flex-wrap items-baseline justify-between gap-4 border-b-2 pb-4" style={{ borderColor: INK }}>
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-3xl font-semibold tracking-tight">Muse</span>
              <h1 className="text-sm uppercase tracking-[0.18em]">Design Logic</h1>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em]">
              <span className="rounded-sm border px-2 py-1" style={{ borderColor: INK }}>Fable 5.1</span>
              <span className="rounded-sm border px-2 py-1" style={{ borderColor: INK }}>frontend-design</span>
              <span className="rounded-sm border px-2 py-1 normal-case tracking-normal" style={{ borderColor: INK }}>Campaign · Volt e-bike</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-10 lg:col-start-2">
            <label htmlFor="dl-brief" className="mb-2 block text-[11px] uppercase tracking-[0.18em]">
              Campaign brief
            </label>
            <textarea
              id="dl-brief"
              value={brief}
              rows={2}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? "dl-brief-error" : undefined}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase !== "loading") setPhase("idle")
                const el = e.currentTarget
                el.style.height = "auto"
                el.style.height = `${el.scrollHeight}px`
              }}
              className={cn(
                "block w-full resize-none overflow-hidden border-b bg-transparent pb-3 font-serif text-xl leading-snug outline-none transition-colors sm:text-2xl lg:text-[1.75rem] lg:leading-snug",
                focusRing,
                hasError ? "border-b-2" : "border-[#1a1816]/40 focus-visible:border-[#1a1816]",
              )}
              style={hasError ? { borderColor: ORANGE } : undefined}
            />
            {hasError && errorNote && (
              <p id="dl-brief-error" role="alert" className="mt-2 flex flex-wrap items-center gap-3 font-serif text-sm italic" style={{ color: ORANGE }}>
                {errorNote}
                <button
                  type="button"
                  onClick={generate}
                  className={cn("inline-flex items-center gap-1 rounded-sm px-1 font-sans text-xs not-italic uppercase tracking-[0.14em] underline underline-offset-4", focusRing)}
                  style={{ color: INK }}
                >
                  <RotateCcw className="size-3" aria-hidden="true" /> Retry
                </button>
              </p>
            )}
          </div>

          {/* assumptions row */}
          <div className="col-span-12 grid grid-cols-12 gap-x-6 gap-y-4 lg:col-span-10 lg:col-start-2">
            <Segmented label="Audience" options={AUDIENCES} value={audience} onChange={setControl<Audience>(setAudience, "Audience")} />
            <Segmented label="Channel" options={CHANNELS} value={channel} onChange={setControl<Channel>(setChannel, "Channel")} />
            <Segmented label="Tone" options={TONES} value={tone} onChange={setControl<Tone>(setTone, "Tone")} />
            <Segmented label="Style" options={STYLES} value={style} onChange={setControl<Style>(setStyle, "Style")} />
          </div>
        </header>

        {/* ------------------------------------------------- concepts */}
        <section aria-labelledby="dl-concepts-h" className="mt-12">
          <div className="mb-4 flex items-baseline justify-between border-b pb-2" style={{ borderColor: `${INK}66` }}>
            <h2 id="dl-concepts-h" className="text-[11px] uppercase tracking-[0.18em]">Three concepts, one brief</h2>
            <span className="font-mono text-[11px] uppercase tracking-wider">Selected · {selected}</span>
          </div>
          <div
            role="radiogroup"
            aria-label="Creative concepts"
            className="grid grid-cols-1 gap-6 lg:[grid-template-columns:var(--dl-cols)] lg:[transition:grid-template-columns_450ms_cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none"
            style={{ "--dl-cols": gridCols } as CSSProperties}
          >
            {CONCEPTS.map((c, i) => {
              const isSel = c.id === selected
              const headline = c.headlines[variant[c.id]]
              return (
                <div
                  key={c.id}
                  ref={(el) => {
                    columnRefs.current[i] = el
                  }}
                  role="radio"
                  aria-checked={isSel}
                  tabIndex={0}
                  onClick={() => pickConcept(c.id)}
                  onKeyDown={(e) => onColumnKey(e, i)}
                  className={cn("group min-w-0 cursor-pointer rounded-sm", focusRing)}
                >
                  <div className="flex items-baseline justify-between gap-2 border-b pb-2" style={{ borderColor: isSel ? INK : `${INK}55` }}>
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span className="font-serif text-4xl leading-none" style={{ color: isSel ? ORANGE : INK }}>{c.id}</span>
                      <span className={cn("truncate text-sm", isSel ? "font-semibold" : "font-normal")}>{c.name}</span>
                    </div>
                    {!isSel && (
                      <span className="hidden shrink-0 items-center gap-1 text-[11px] uppercase tracking-[0.14em] opacity-60 transition-opacity group-hover:opacity-100 lg:inline-flex">
                        Select <ArrowRight className="size-3" aria-hidden="true" />
                      </span>
                    )}
                    {!isSel && <span className="text-[11px] uppercase tracking-[0.14em] opacity-60 lg:hidden">Tap to expand</span>}
                  </div>

                  {/* body: collapses on mobile when not selected */}
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height] duration-500 ease-out motion-reduce:transition-none",
                      isSel ? "max-h-[1600px]" : "max-h-0 lg:max-h-[1600px]",
                    )}
                  >
                    {isSel ? (
                      <article className="relative mt-4 flex aspect-[3/4] flex-col justify-between border p-6 sm:p-8" style={{ borderColor: INK, backgroundColor: style === "Minimal" ? "#faf8f3" : PAPER }}>
                        {phase === "success" && (
                          <span className="absolute right-4 top-4 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white" style={{ backgroundColor: ORANGE }}>
                            New draft
                          </span>
                        )}
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-wider opacity-70">
                            {c.id} · {String(variant[c.id] + 1).padStart(2, "0")} · {style}
                          </p>
                          {loading ? (
                            <div className="mt-4 space-y-3 motion-reduce:animate-none" aria-hidden="true">
                              <div className="h-10 w-11/12 animate-pulse rounded-sm bg-[#1a1816]/15" />
                              <div className="h-10 w-3/4 animate-pulse rounded-sm bg-[#1a1816]/15" />
                              <div className="mt-6 h-4 w-full animate-pulse rounded-sm bg-[#1a1816]/10" />
                              <div className="h-4 w-5/6 animate-pulse rounded-sm bg-[#1a1816]/10" />
                            </div>
                          ) : (
                            <>
                              <h3
                                className={cn(
                                  "mt-4 text-balance text-3xl leading-[1.05] tracking-tight sm:text-4xl xl:text-5xl",
                                  style === "Technical" ? "font-sans font-semibold" : "font-serif",
                                )}
                              >
                                {headline}
                              </h3>
                              <p className="mt-5 max-w-[34ch] text-sm leading-relaxed opacity-80 sm:text-base">{c.subByTone[tone]}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <div className="my-4 h-px w-full" style={{ backgroundColor: INK }} />
                          <BikeSilhouette accent={c.accent} className={cn("mx-auto w-full max-w-[300px]", loading && "opacity-30")} />
                          <div className="mt-6 flex flex-wrap items-end justify-between gap-2 font-mono text-[11px] uppercase tracking-wider">
                            <span>{channel} · {FORMAT_BY_CHANNEL[channel]}</span>
                            <span>For {audience.toLowerCase()} · {tone}</span>
                          </div>
                        </div>
                      </article>
                    ) : (
                      <div className="mt-4 hidden lg:block">
                        <article className="flex aspect-[3/4] flex-col justify-between border p-4 transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" style={{ borderColor: `${INK}66` }}>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider opacity-60">{c.id} · {String(variant[c.id] + 1).padStart(2, "0")}</p>
                            <p className="mt-3 font-serif text-lg leading-tight tracking-tight sm:text-xl">{headline}</p>
                          </div>
                          <BikeSilhouette accent={c.accent} className="w-full opacity-70" />
                        </article>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* -------------------------------------------------- forecast */}
        <section aria-labelledby="dl-forecast-h" className="mt-12 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 mb-4 flex items-baseline justify-between border-b pb-2" style={{ borderColor: `${INK}66` }}>
            <h2 id="dl-forecast-h" className="text-[11px] uppercase tracking-[0.18em]">Forecast · {channel}</h2>
            <span className="font-mono text-[11px] uppercase tracking-wider">A / B / C</span>
          </div>
          <div className="col-span-12 space-y-6 lg:col-span-10 lg:col-start-2">
            {rows.map((row) => (
              <div key={row.key} className="grid grid-cols-12 items-start gap-x-4">
                <span className="col-span-12 text-sm font-semibold sm:col-span-2">{row.label}</span>
                <ul className="col-span-12 space-y-1.5 sm:col-span-10" aria-label={`${row.label} by concept`}>
                  {CONCEPTS.map((c) => {
                    const v = forecastFor(c, channel, audience, tone)[row.key]
                    const pct = Math.min(100, (v / row.max) * 100)
                    const isSel = c.id === selected
                    return (
                      <li key={c.id} className="flex items-center gap-3">
                        <span className="w-3 font-mono text-[11px]">{c.id}</span>
                        <div className="relative h-4 flex-1">
                          <div
                            className="h-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
                            style={{ width: `${pct}%`, backgroundColor: isSel ? ORANGE : `${INK}40` }}
                          />
                          <span
                            className="absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-xs tabular-nums"
                            style={{ left: `${pct}%`, color: isSel ? INK : `${INK}99` }}
                          >
                            {row.fmt(v)}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
            <p className="font-serif text-sm italic opacity-70">{CHANNEL_WEIGHT[channel].note}</p>
          </div>
        </section>

        {/* ------------------------------------------ activity + actions */}
        <footer className="mt-12 grid grid-cols-12 gap-x-6 gap-y-6 border-t-2 pt-4" style={{ borderColor: INK }}>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-[11px] uppercase tracking-[0.18em]">Recent decisions</h2>
            <p className="mt-2 font-serif text-sm leading-relaxed" aria-live="polite">
              {log.map((entry, i) => (
                <span key={`${entry}-${i}`} className={i === 0 ? "font-semibold" : "opacity-70"}>
                  {entry}
                  {i < log.length - 1 && <span aria-hidden="true"> · </span>}
                </span>
              ))}
            </p>
          </div>

          <div
            className="fixed inset-x-0 bottom-0 z-10 col-span-12 flex items-center justify-between gap-3 border-t px-5 py-3 lg:static lg:col-span-4 lg:justify-end lg:border-0 lg:p-0"
            style={{ backgroundColor: PAPER, borderColor: INK }}
          >
            <div className="flex items-center gap-1">
              <button type="button" onClick={save} className={cn("inline-flex min-h-10 items-center gap-1 rounded-sm px-2 text-sm underline-offset-4 hover:underline", focusRing)}>
                Save <ArrowUpRight className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={exportPlan} className={cn("inline-flex min-h-10 items-center gap-1 rounded-sm px-2 text-sm underline-offset-4 hover:underline", focusRing)}>
                {exported ? "Exported" : "Export"} <Download className="size-4" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              aria-busy={loading}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-sm px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#e0542c] disabled:cursor-progress disabled:opacity-80",
                focusRing,
              )}
              style={{ backgroundColor: loading ? ORANGE : INK }}
            >
              {loading ? "Composing…" : "Generate"} <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {phase === "loading" ? `Composing Concept ${selected}` : phase === "success" ? `New draft ready for Concept ${selected}` : ""}
          </p>
        </footer>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- segmented */

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T; onChange: (v: T) => void }) {
  const id = `dl-seg-${label.toLowerCase()}`
  return (
    <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-3">
      <span id={id} className="mb-1.5 block text-[11px] uppercase tracking-[0.18em]">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="-mx-1 flex overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        <div className="inline-flex shrink-0 border" style={{ borderColor: INK }}>
          {options.map((opt) => {
            const on = opt === value
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange(opt)}
                className={cn(
                  "min-h-9 whitespace-nowrap px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#e0542c]",
                  on ? "text-[#f3efe7]" : "hover:bg-[#1a1816]/8",
                )}
                style={on ? { backgroundColor: INK } : undefined}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
