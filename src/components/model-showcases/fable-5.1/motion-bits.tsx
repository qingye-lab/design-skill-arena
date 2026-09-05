"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import {
  AlertTriangle,
  ChevronDown,
  Download,
  Headphones,
  Mic,
  Palette,
  Radio,
  Save,
  Users,
  X,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ConceptId = "A" | "B" | "C"
type Control = "audience" | "channel" | "tone" | "style"
type Status = "idle" | "loading" | "success" | "error"

interface Concept {
  id: ConceptId
  name: string
  blurb: string
  headline: Record<string, string>
  sub: string
  colors: [string, string, string]
  base: { reach: number; ctr: number; conv: number }
}

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Feel the low end",
    blurb: "Subwoofer energy, magenta on black.",
    headline: {
      Bold: "Bass you feel before you hear.",
      Warm: "Sink into the low end.",
      Technical: "Adaptive bass, tuned 40 times a second.",
    },
    sub: "Pulse reads the room and reshapes the low end so every track lands the same on a train or a rooftop.",
    colors: ["#ff2d95", "#7b2cff", "#2de2ff"],
    base: { reach: 212000, ctr: 2.9, conv: 1.6 },
  },
  {
    id: "B",
    name: "Bass that listens",
    blurb: "Cool signal blues, precision mood.",
    headline: {
      Bold: "Headphones that hear the room.",
      Warm: "Every room, the same warmth.",
      Technical: "Room-aware EQ. 40 ms response.",
    },
    sub: "Six microphones map your surroundings and correct the mix before you notice anything changed.",
    colors: ["#2de2ff", "#1f6bff", "#9be7ff"],
    base: { reach: 168000, ctr: 3.4, conv: 2.1 },
  },
  {
    id: "C",
    name: "Loud, quietly",
    blurb: "Amber heat, late-night confidence.",
    headline: {
      Bold: "Turn it up. Nobody else hears.",
      Warm: "Your volume. Your room.",
      Technical: "-38 dB leakage at full drive.",
    },
    sub: "Sealed acoustic chambers keep the drive inside the cup, so loud stays personal.",
    colors: ["#ffb02e", "#ff5a1f", "#ffe9a8"],
    base: { reach: 143000, ctr: 2.5, conv: 1.9 },
  },
]

const OPTIONS: Record<Control, string[]> = {
  audience: ["Commuters", "Producers", "Gamers", "Runners"],
  channel: ["Instagram Reels", "Spotify Audio", "YouTube", "Out-of-home"],
  tone: ["Bold", "Warm", "Technical"],
  style: ["Neon", "Monochrome", "Gradient", "Collage"],
}

const CONTROL_META: Record<Control, { label: string; Icon: typeof Users }> = {
  audience: { label: "Audience", Icon: Users },
  channel: { label: "Channel", Icon: Radio },
  tone: { label: "Tone", Icon: Mic },
  style: { label: "Style", Icon: Palette },
}

const CHANNEL_MULT: Record<string, { reach: number; ctr: number; format: string }> = {
  "Instagram Reels": { reach: 1.3, ctr: 0.9, format: "Reels · 9:16 cover" },
  "Spotify Audio": { reach: 0.9, ctr: 1.15, format: "Spotify · canvas 1:1" },
  YouTube: { reach: 1.5, ctr: 0.7, format: "YouTube · bumper" },
  "Out-of-home": { reach: 2.2, ctr: 0.3, format: "OOH · digital 1:1" },
}

const AUDIENCE_LINE: Record<string, string> = {
  Commuters: "For the 07:40 that never gets quieter",
  Producers: "For ears that notice everything",
  Gamers: "For footsteps you should have heard",
  Runners: "For bass that keeps pace",
}

const AUDIENCE_CONV: Record<string, number> = { Commuters: 1, Producers: 1.3, Gamers: 1.1, Runners: 0.9 }

interface Activity {
  id: number
  time: string
  text: string
}

const INITIAL_ACTIVITY: Activity[] = [
  { id: 3, time: "18:02:11", text: "Concept A composed for Instagram Reels" },
  { id: 2, time: "18:01:48", text: "Tone set to Bold" },
  { id: 1, time: "18:01:02", text: "Session started · Pulse launch" },
]

const DEFAULT_BRIEF =
  "Launch Pulse: wireless over-ears with adaptive bass that re-tunes to the room. Speak to people who listen on the move. Confident, a little cinematic, never shouty. Close on 'Hear it your way' and a waitlist CTA."

const MIN_BRIEF = 24

function timeNow() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false })
}

function CountUp({ value, format, label }: { value: number; format: (n: number) => string; label: string }) {
  const [display, setDisplay] = useState(value)
  const current = useRef(value)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const from = current.current
    const start = performance.now()
    const duration = reduce ? 0 : 600
    let raf = 0
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = from + (value - from) * eased
      current.current = next
      setDisplay(next)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">
        {format(display)}
      </span>
      <span className="text-[11px] font-medium tracking-[0.2em] text-white/50 uppercase">{label}</span>
    </div>
  )
}

export default function MotionBits() {
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [briefOpen, setBriefOpen] = useState(false)
  const [picks, setPicks] = useState<Record<Control, string>>({
    audience: "Commuters",
    channel: "Instagram Reels",
    tone: "Bold",
    style: "Neon",
  })
  const [openControl, setOpenControl] = useState<Control | null>(null)
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [status, setStatus] = useState<Status>("idle")
  const [burstKey, setBurstKey] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<{ kind: "error" | "info"; text: string } | null>(null)
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY)
  const [typed, setTyped] = useState<{ key: string; count: number }>({ key: "", count: 0 })

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const generateCount = useRef(0)
  const nextId = useRef(100)

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const log = useCallback((text: string) => {
    nextId.current += 1
    const entry = { id: nextId.current, time: timeNow(), text }
    setActivity((prev) => [entry, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS.find((c) => c.id === conceptId) ?? CONCEPTS[0]
  const headline = concept.headline[picks.tone] ?? concept.headline.Bold
  const chan = CHANNEL_MULT[picks.channel]
  const reach = Math.round(concept.base.reach * chan.reach)
  const ctr = concept.base.ctr * chan.ctr * (picks.tone === "Bold" ? 1.05 : 1)
  const conv = concept.base.conv * AUDIENCE_CONV[picks.audience] * (picks.style === "Monochrome" ? 0.95 : 1)
  const briefTooShort = brief.trim().length < MIN_BRIEF

  // Typewriter: re-types the headline whenever it changes. Display length is derived
  // from state keyed by the headline so a change resets to zero without a sync setState.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setTyped({ key: headline, count: headline.length }))
      return () => cancelAnimationFrame(raf)
    }
    const id = setInterval(() => {
      setTyped((prev) => {
        const count = prev.key === headline ? prev.count + 1 : 1
        if (count >= headline.length) clearInterval(id)
        return { key: headline, count: Math.min(count, headline.length) }
      })
    }, 34)
    return () => clearInterval(id)
  }, [headline])

  const typedCount = typed.key === headline ? typed.count : 0
  const typedText = headline.slice(0, typedCount)

  function pickConcept(id: ConceptId) {
    if (id === conceptId) return
    setConceptId(id)
    log(`Concept ${id} selected · ${CONCEPTS.find((c) => c.id === id)?.name}`)
  }

  function pickOption(control: Control, value: string) {
    setPicks((p) => ({ ...p, [control]: value }))
    setOpenControl(null)
    log(`${CONTROL_META[control].label} → ${value}`)
  }

  function handleGenerate() {
    if (status === "loading") return
    setToast(null)
    setStatus("loading")
    generateCount.current += 1
    // Error rule: brief shorter than 24 chars always fails; every 4th generate fails.
    const willFail = briefTooShort || generateCount.current % 4 === 0
    later(() => {
      if (willFail) {
        setStatus("error")
        setShakeKey((k) => k + 1)
        setToast({
          kind: "error",
          text: briefTooShort ? `Brief needs at least ${MIN_BRIEF} characters.` : "Render node dropped the job.",
        })
        log("Generate failed")
      } else {
        setStatus("success")
        setBurstKey((k) => k + 1)
        log(`Concept ${concept.id} regenerated for ${picks.channel}`)
        later(() => setStatus((s) => (s === "success" ? "idle" : s)), 1200)
      }
    }, 1500)
  }

  function handleSave() {
    if (saved) return
    setSaved(true)
    log(`Saved concept ${concept.id} · ${picks.tone.toLowerCase()} tone`)
    later(() => setSaved(false), 2000)
  }

  function handleExport() {
    setToast({ kind: "info", text: `Concept ${concept.id} exported as PNG · ${chan.format}` })
    log(`Exported concept ${concept.id} (PNG)`)
    later(() => setToast((t) => (t?.kind === "info" ? null : t)), 2400)
  }

  function onTilt(e: ReactMouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty("--fable-mb-ry", `${px * 14}deg`)
    e.currentTarget.style.setProperty("--fable-mb-rx", `${-py * 14}deg`)
  }
  function onTiltReset(e: ReactMouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.setProperty("--fable-mb-ry", "0deg")
    e.currentTarget.style.setProperty("--fable-mb-rx", "0deg")
  }

  const [c1, c2, c3] = concept.colors
  const ticker = [...activity, ...activity]

  return (
    <div
      data-fable-mb
      className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#0b0b12] font-sans text-white"
    >
      <style>{`
        @keyframes fable-mb-spin { to { transform: rotate(360deg); } }
        @keyframes fable-mb-float { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(6%, -8%, 0) scale(1.12); } }
        @keyframes fable-mb-shimmer { from { transform: translateX(-150%); } to { transform: translateX(250%); } }
        @keyframes fable-mb-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fable-mb-orbit { to { transform: rotate(360deg); } }
        @keyframes fable-mb-burst { 0% { transform: translate(0,0) scale(1); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; } }
        @keyframes fable-mb-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-12px); } 40% { transform: translateX(10px); } 60% { transform: translateX(-6px); } 80% { transform: translateX(4px); } }
        @keyframes fable-mb-spring { 0% { transform: translateY(0) scale(1); } 40% { transform: translateY(-10px) scale(1.06); } 70% { transform: translateY(-6px) scale(0.985); } 100% { transform: translateY(-8px) scale(1.02); } }
        @keyframes fable-mb-pop { from { opacity: 0; transform: scale(0.9) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fable-mb-bars { 0%,100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
        @keyframes fable-mb-caret { 50% { opacity: 0; } }
        .fable-mb-marquee:hover .fable-mb-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          [data-fable-mb] *, [data-fable-mb] *::before, [data-fable-mb] *::after {
            animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[c1, c2, c3].map((c, i) => (
          <span
            key={i}
            className="absolute rounded-full blur-3xl transition-colors duration-700"
            style={{
              background: c,
              opacity: 0.32,
              width: `${34 + i * 6}vmin`,
              height: `${34 + i * 6}vmin`,
              left: ["18%", "58%", "40%"][i],
              top: ["18%", "12%", "48%"][i],
              animation: `fable-mb-float ${14 + i * 4}s ease-in-out ${i * -3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 flex flex-wrap items-center gap-2 px-4 pt-4 sm:px-8 sm:pt-6">
        <div className="flex items-center gap-2 pr-2">
          <Headphones className="size-5" style={{ color: c1 }} aria-hidden />
          <span className="text-base font-semibold tracking-tight">Muse</span>
          <h1 className="text-sm text-white/60">Motion Bits</h1>
        </div>
        {["Fable 5.1", "react-bits"].map((t) => (
          <span
            key={t}
            className={cn("rounded-full border px-2.5 py-0.5 text-xs", t === "react-bits" && "font-mono")}
            style={{ borderColor: `${c1}99`, color: "#fff", boxShadow: `0 0 12px ${c1}66, inset 0 0 8px ${c1}22` }}
          >
            {t}
          </span>
        ))}
        <button
          type="button"
          aria-expanded={briefOpen}
          aria-controls="fable-mb-brief-drawer"
          onClick={() => setBriefOpen((o) => !o)}
          className="ml-auto inline-flex h-8 items-center gap-1 rounded-full border border-white/15 px-3 text-xs font-medium text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Brief
          <ChevronDown className={cn("size-3.5 transition-transform", briefOpen && "rotate-180")} aria-hidden />
        </button>
      </header>

      {/* Brief drawer */}
      <div
        id="fable-mb-brief-drawer"
        className={cn(
          "relative z-20 grid transition-[grid-template-rows] duration-400 ease-out",
          briefOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="mx-4 mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:mx-8">
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="fable-mb-brief" className="text-sm font-medium">
                Campaign brief
              </label>
              <span className={cn("text-xs tabular-nums", briefTooShort ? "text-rose-400" : "text-white/50")}>
                {brief.length} chars{briefTooShort ? ` · min ${MIN_BRIEF}` : ""}
              </span>
            </div>
            <textarea
              id="fable-mb-brief"
              rows={3}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              onBlur={() => log("Brief edited")}
              tabIndex={briefOpen ? 0 : -1}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm leading-relaxed text-white placeholder:text-white/30 focus-visible:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            />
          </div>
        </div>
      </div>

      {/* Stage */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pt-6 pb-24 sm:px-8 md:pr-28">
        <div
          key={shakeKey}
          className="relative w-full max-w-[560px]"
          style={shakeKey > 0 && status === "error" ? { animation: "fable-mb-shake 0.5s ease" } : undefined}
        >
          <div className="relative overflow-hidden rounded-[28px] p-[2px]">
            <div
              aria-hidden
              className="absolute inset-[-60%]"
              style={{
                background: `conic-gradient(from 0deg, ${c1}, ${c2}, ${c3}, ${c1})`,
                animation: "fable-mb-spin 9s linear infinite",
              }}
            />
            <article
              aria-label={`Concept ${concept.id} album cover preview`}
              className={cn(
                "relative flex aspect-square flex-col justify-between overflow-hidden rounded-[26px] bg-[#0e0e18] p-6 transition-opacity duration-300 sm:p-8",
                status === "loading" && "opacity-50",
              )}
              style={{
                backgroundImage:
                  picks.style === "Gradient"
                    ? `linear-gradient(150deg, ${c2}55, #0e0e18 60%)`
                    : picks.style === "Monochrome"
                      ? "linear-gradient(150deg, #1a1a24, #0e0e18)"
                      : picks.style === "Collage"
                        ? `linear-gradient(150deg, ${c1}22 0 40%, transparent 40%), linear-gradient(-30deg, ${c3}22 0 35%, transparent 35%)`
                        : `radial-gradient(circle at 80% 20%, ${c1}33, transparent 45%)`,
              }}
            >
              <header className="flex items-center justify-between text-[11px] font-medium tracking-[0.18em] text-white/60 uppercase">
                <span>Pulse</span>
                <span>{chan.format}</span>
              </header>

              <div aria-hidden className="absolute right-6 bottom-24 flex h-20 items-end gap-1 sm:right-8 sm:h-28">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 origin-bottom rounded-full sm:w-2"
                    style={{
                      height: "100%",
                      background: picks.style === "Monochrome" ? "#fff" : i % 2 ? c1 : c3,
                      opacity: 0.85,
                      animation: `fable-mb-bars ${1.1 + (i % 4) * 0.25}s ease-in-out ${i * -0.13}s infinite`,
                    }}
                  />
                ))}
              </div>

              <div className="relative max-w-[78%]">
                <p className="text-xs text-white/60">{AUDIENCE_LINE[picks.audience]}</p>
                <h2 className="mt-2 min-h-[2.2em] text-3xl leading-[1.05] font-bold tracking-tight sm:text-[2.75rem]">
                  {typedText}
                  <span
                    aria-hidden
                    className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] align-baseline"
                    style={{
                      background: picks.style === "Monochrome" ? "#fff" : c1,
                      animation: "fable-mb-caret 1s steps(1) infinite",
                    }}
                  />
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{concept.sub}</p>
              </div>

              <footer className="flex items-end justify-between gap-4">
                <p className="text-xs text-white/50">Pulse · adaptive bass</p>
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-black"
                  style={{ background: picks.style === "Monochrome" ? "#fff" : c3 }}
                >
                  {picks.tone === "Technical" ? "See the specs" : picks.tone === "Warm" ? "Hear it your way" : "Join the waitlist"}
                </span>
              </footer>
            </article>
          </div>

          {status === "loading" && (
            <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="relative size-20" style={{ animation: "fable-mb-orbit 1.4s linear infinite" }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute top-0 left-1/2 size-3 -translate-x-1/2 rounded-full"
                    style={{
                      background: [c1, c2, c3][i],
                      transform: `rotate(${i * 120}deg) translateY(-8px)`,
                      transformOrigin: "50% 40px",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dock (mobile: horizontal bar under hero, md+: floating vertical) */}
        <nav
          aria-label="Campaign controls"
          className="relative z-30 mt-5 flex w-full max-w-[560px] items-center justify-center gap-3 md:fixed md:top-1/2 md:right-6 md:mt-0 md:w-auto md:-translate-y-1/2 md:flex-col md:rounded-2xl md:border md:border-white/10 md:bg-white/[0.04] md:p-2 md:backdrop-blur"
        >
          {(Object.keys(CONTROL_META) as Control[]).map((key) => {
            const { label, Icon } = CONTROL_META[key]
            const open = openControl === key
            return (
              <div key={key} className="relative">
                <button
                  type="button"
                  aria-label={`${label}: ${picks[key]}`}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                  onClick={() => setOpenControl(open ? null : key)}
                  className={cn(
                    "grid size-11 place-items-center rounded-xl border border-white/10 bg-[#12121c] text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                    open && "text-white",
                  )}
                  style={open ? { borderColor: c1, boxShadow: `0 0 16px ${c1}66` } : undefined}
                >
                  <Icon className="size-5" aria-hidden />
                </button>
                {open && (
                  <div
                    role="dialog"
                    aria-label={label}
                    className="absolute bottom-full left-1/2 z-40 mb-3 w-48 -translate-x-1/2 origin-bottom md:w-56 rounded-2xl border border-white/10 bg-[#13131f]/95 p-3 shadow-2xl backdrop-blur md:top-0 md:right-full md:bottom-auto md:left-auto md:mr-3 md:mb-0 md:translate-x-0 md:origin-right"
                    style={{ animation: "fable-mb-pop 0.22s cubic-bezier(.2,.9,.3,1.2)" }}
                  >
                    <p className="mb-2 text-[11px] font-medium tracking-[0.18em] text-white/50 uppercase">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {OPTIONS[key].map((opt) => {
                        const active = picks[key] === opt
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={active}
                            onClick={() => pickOption(key, opt)}
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                              active ? "border-transparent text-black" : "border-white/15 text-white/80 hover:border-white/40",
                            )}
                            style={active ? { background: c3 } : undefined}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Concept cards */}
        <div
          role="radiogroup"
          aria-label="Creative concept"
          className="mt-6 flex w-full max-w-[720px] snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 [perspective:1000px] md:grid md:grid-cols-3 md:overflow-visible"
        >
          {CONCEPTS.map((c) => {
            const selected = c.id === conceptId
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pickConcept(c.id)}
                onMouseMove={onTilt}
                onMouseLeave={onTiltReset}
                className={cn(
                  "group relative w-[78%] shrink-0 snap-center rounded-2xl border bg-[#12121c] p-4 text-left transition-[transform,border-color,box-shadow] duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:w-auto",
                  selected ? "border-transparent" : "border-white/10 hover:border-white/25",
                )}
                style={{
                  transform: "rotateX(var(--fable-mb-rx, 0deg)) rotateY(var(--fable-mb-ry, 0deg))",
                  animation: selected ? "fable-mb-spring 0.6s cubic-bezier(.2,.9,.3,1.2) forwards" : undefined,
                  boxShadow: selected ? `0 0 0 1.5px ${c.colors[0]}, 0 18px 40px -16px ${c.colors[0]}99` : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-[0.18em] text-white/50 uppercase">Concept {c.id}</span>
                  <span className="flex gap-1">
                    {c.colors.map((col) => (
                      <span key={col} className="size-3 rounded-full" style={{ background: col }} />
                    ))}
                  </span>
                </div>
                <p className="mt-2 text-base font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-white/60">{c.blurb}</p>
              </button>
            )
          })}
        </div>

        {/* Metrics */}
        <section aria-label="Forecast" className="mt-8 grid w-full max-w-[560px] grid-cols-3 gap-4">
          <CountUp value={reach} label="Reach" format={(n) => `${(n / 1000).toFixed(0)}k`} />
          <CountUp value={ctr} label="CTR" format={(n) => `${n.toFixed(2)}%`} />
          <CountUp value={conv} label="Conversion" format={(n) => `${n.toFixed(2)}%`} />
        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-medium text-white/85 transition hover:border-white/50 hover:shadow-[0_0_18px_rgba(255,255,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Save className="size-4" aria-hidden />
            {saved ? "Saved" : "Save"}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={status === "loading"}
              className="relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full px-7 text-sm font-semibold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b12] disabled:cursor-progress disabled:opacity-80"
              style={{ background: `linear-gradient(100deg, ${c1}, ${c3})` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3 bg-white/40 blur-md"
                style={{ animation: "fable-mb-shimmer 2.4s ease-in-out infinite" }}
              />
              <Zap className="size-4" aria-hidden />
              {status === "loading" ? "Composing…" : "Generate"}
            </button>
            {burstKey > 0 && (
              <span key={burstKey} aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2
                  return (
                    <span
                      key={i}
                      className="absolute size-2 rounded-full"
                      style={{
                        background: [c1, c2, c3][i % 3],
                        ["--tx" as string]: `${Math.cos(a) * 70}px`,
                        ["--ty" as string]: `${Math.sin(a) * 70}px`,
                        animation: "fable-mb-burst 0.8s ease-out forwards",
                      }}
                    />
                  )
                })}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-medium text-white/85 transition hover:border-white/50 hover:shadow-[0_0_18px_rgba(255,255,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Download className="size-4" aria-hidden />
            Export
          </button>
        </div>

        <p role="status" aria-live="polite" className="mt-3 h-5 text-xs text-white/50">
          {status === "loading" && "Composing concept…"}
          {status === "success" && "Concept regenerated."}
          {status === "error" && "Generation failed."}
        </p>
      </main>

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          className={cn(
            "fixed right-4 bottom-16 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl sm:right-8",
            toast.kind === "error" ? "border-rose-500/40 bg-rose-950/90 text-rose-100" : "border-white/15 bg-[#13131f]/95 text-white",
          )}
          style={{ animation: "fable-mb-pop 0.22s ease-out" }}
        >
          {toast.kind === "error" && <AlertTriangle className="size-4 shrink-0 text-rose-400" aria-hidden />}
          <span>{toast.text}</span>
          {toast.kind === "error" && (
            <button
              type="button"
              onClick={handleGenerate}
              className="font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              Retry
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setToast(null)}
            className="rounded p-0.5 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      )}

      {/* Marquee ticker */}
      <div
        aria-label="Recent activity"
        className="fable-mb-marquee fixed inset-x-0 bottom-0 z-30 overflow-hidden border-t border-white/10 bg-[#0b0b12]/90 py-2.5 backdrop-blur"
      >
        <div
          className="fable-mb-marquee-track flex w-max gap-10 whitespace-nowrap"
          style={{ animation: `fable-mb-marquee ${Math.max(18, ticker.length * 3)}s linear infinite` }}
        >
          {ticker.map((a, i) => (
            <span key={`${a.id}-${i}`} className="flex items-center gap-2 text-xs text-white/70">
              <span className="size-1.5 rounded-full" style={{ background: c1 }} aria-hidden />
              <span className="font-mono text-white/45 tabular-nums">{a.time}</span>
              {a.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
