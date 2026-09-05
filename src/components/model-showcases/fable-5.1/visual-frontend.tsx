"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  RotateCcw,
  Save,
  Sparkles,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ConceptId = "A" | "B" | "C"
type ToneId = "hushed" | "assured" | "provocative"
type StyleId = "cinematic" | "editorial" | "minimal"
type Status = "idle" | "loading" | "success" | "error"
type ControlKey = "audience" | "channel" | "tone" | "style"

type Audience = { id: string; label: string; line: string; reach: number; ctr: number }
type Channel = { id: string; label: string; format: string; reach: number; ctr: number; cvr: number }
type Tone = { id: ToneId; label: string; cta: string; ctr: number; cvr: number }
type Style = { id: StyleId; label: string; grain: number; headline: string }
type Concept = {
  id: ConceptId
  name: string
  scene: string
  glow: string
  headlines: Record<ToneId, string>
  sub: string
  swatches: string[]
  reach: number
  ctr: number
  cvr: number
}
type Entry = { id: number; at: string; text: string }

const AUDIENCES: Audience[] = [
  { id: "night", label: "Night-out 25–34", line: "For the ones who leave last", reach: 1, ctr: 1 },
  { id: "design", label: "Design-minded 30–45", line: "For collectors of quiet objects", reach: 0.82, ctr: 1.14 },
  { id: "gift", label: "Gifting shoppers", line: "For the person who has everything", reach: 1.18, ctr: 0.88 },
]

const CHANNELS: Channel[] = [
  { id: "story", label: "Instagram Story", format: "9:16", reach: 1, ctr: 1, cvr: 1 },
  { id: "ooh", label: "OOH Billboard", format: "48-sheet", reach: 1.65, ctr: 0.32, cvr: 0.55 },
  { id: "preroll", label: "YouTube Pre-roll", format: "16:9", reach: 1.24, ctr: 0.78, cvr: 0.9 },
  { id: "email", label: "Email Header", format: "3:1", reach: 0.38, ctr: 1.9, cvr: 1.55 },
]

const TONES: Tone[] = [
  { id: "hushed", label: "Hushed", cta: "Discover Nocturne", ctr: 0.94, cvr: 1.08 },
  { id: "assured", label: "Assured", cta: "Find your hour", ctr: 1, cvr: 1 },
  { id: "provocative", label: "Provocative", cta: "Come closer", ctr: 1.16, cvr: 0.9 },
]

const STYLES: Style[] = [
  { id: "cinematic", label: "Cinematic", grain: 0.22, headline: "font-serif italic tracking-[-0.02em]" },
  { id: "editorial", label: "Editorial", grain: 0.12, headline: "font-serif uppercase tracking-[0.12em]" },
  { id: "minimal", label: "Minimal", grain: 0.05, headline: "font-sans font-light tracking-[-0.03em]" },
]

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "After Dark",
    scene: "linear-gradient(160deg, #2a0f2e 0%, #150813 45%, #050205 100%)",
    glow: "radial-gradient(70% 55% at 8% 100%, rgba(255,158,58,0.6) 0%, rgba(255,110,40,0.2) 35%, transparent 70%)",
    headlines: {
      hushed: "Wear the hour after dark.",
      assured: "Made for the hour after dark.",
      provocative: "Nothing good happens before midnight.",
    },
    sub: "Black fig, smoked cedar, a trace of salt.",
    swatches: ["#2a0f2e", "#ff9e3a", "#f4ebe4"],
    reach: 1.42,
    ctr: 2.9,
    cvr: 1.4,
  },
  {
    id: "B",
    name: "Cold Beam",
    scene: "linear-gradient(180deg, #0b2a33 0%, #071a22 50%, #04080d 100%)",
    glow: "linear-gradient(112deg, transparent 40%, rgba(225,242,255,0.5) 47%, rgba(225,242,255,0.1) 52%, transparent 60%)",
    headlines: {
      hushed: "Light finds you.",
      assured: "Light always finds you.",
      provocative: "Step into the beam.",
    },
    sub: "Fig at the top, cedar smoke beneath. It stays until it no longer matters.",
    swatches: ["#0b2a33", "#e1f2ff", "#04080d"],
    reach: 1.18,
    ctr: 3.4,
    cvr: 1.7,
  },
  {
    id: "C",
    name: "Bronze Room",
    scene: "linear-gradient(200deg, #2b2724 0%, #6b4a2a 55%, #8a6a3c 100%)",
    glow: "radial-gradient(80% 70% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
    headlines: {
      hushed: "Smoke, fig, and a quiet room.",
      assured: "A quiet room, worn.",
      provocative: "Leave something behind.",
    },
    sub: "A warm, resinous evening in a 50ml bottle.",
    swatches: ["#2b2724", "#8a6a3c", "#e8d9c3"],
    reach: 0.96,
    ctr: 2.4,
    cvr: 2.1,
  },
]

const DEFAULT_BRIEF =
  "Launch Nocturne, a unisex eau de parfum built on black fig and smoked cedar. Position it as the scent for the last hour of the night, not the first."

function clock() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatReach(m: number) {
  return m >= 1 ? `${m.toFixed(2)}M` : `${Math.round(m * 1000)}K`
}

function GlassChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-medium tracking-wide text-white/85 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </span>
  )
}

type DeckSelectProps = {
  id: ControlKey
  label: string
  value: string
  options: { id: string; label: string }[]
  open: boolean
  onToggle: (id: ControlKey) => void
  onSelect: (id: ControlKey, value: string) => void
}

function DeckSelect({ id, label, value, options, open, onToggle, onSelect }: DeckSelectProps) {
  const current = options.find((o) => o.id === value)
  return (
    <div className={cn("relative", open && "max-[819px]:col-span-2")}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current?.label ?? ""}`}
        onClick={() => onToggle(id)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-full border px-3 text-left text-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
          open
            ? "border-white/40 bg-white/20 text-white"
            : "border-white/15 bg-white/5 text-white/85 hover:border-white/30 hover:bg-white/12",
        )}
      >
        <span className="text-white/50">{label}</span>
        <span className="truncate font-medium">{current?.label}</span>
        <ChevronDown
          className={cn("ml-auto h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="z-30 mt-2 min-w-full rounded-2xl border border-white/15 bg-black/75 p-1 shadow-2xl backdrop-blur-xl min-[820px]:absolute min-[820px]:bottom-full min-[820px]:left-0 min-[820px]:mb-2 min-[820px]:mt-0 min-[820px]:min-w-52"
        >
          {options.map((o) => {
            const selected = o.id === value
            return (
              <li key={o.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelect(id, o.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    selected ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {o.label}
                  {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function VisualFrontend() {
  const [concept, setConcept] = useState<ConceptId>("A")
  const [audience, setAudience] = useState(AUDIENCES[0].id)
  const [channel, setChannel] = useState(CHANNELS[0].id)
  const [tone, setTone] = useState<ToneId>("assured")
  const [style, setStyle] = useState<StyleId>("cinematic")
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [briefOpen, setBriefOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<ControlKey | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [render, setRender] = useState(1)
  const [savedFlash, setSavedFlash] = useState(false)
  const [activity, setActivity] = useState<Entry[]>([
    { id: 2, at: "09:41", text: "Rendered Concept A · Instagram Story" },
    { id: 1, at: "09:38", text: "Brief imported from Nocturne launch deck" },
  ])

  const nextId = useRef(3)
  const genCount = useRef(0)
  const genTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  const c = CONCEPTS.find((x) => x.id === concept) ?? CONCEPTS[0]
  const a = AUDIENCES.find((x) => x.id === audience) ?? AUDIENCES[0]
  const ch = CHANNELS.find((x) => x.id === channel) ?? CHANNELS[0]
  const t = TONES.find((x) => x.id === tone) ?? TONES[1]
  const s = STYLES.find((x) => x.id === style) ?? STYLES[0]

  const metrics = useMemo(
    () => ({
      reach: c.reach * ch.reach * a.reach,
      ctr: c.ctr * ch.ctr * a.ctr * t.ctr,
      cvr: c.cvr * ch.cvr * t.cvr,
    }),
    [c, ch, a, t],
  )

  useEffect(() => {
    return () => {
      if (genTimer.current) clearTimeout(genTimer.current)
      if (flashTimer.current) clearTimeout(flashTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!openMenu) return
    const onDown = (e: PointerEvent) => {
      if (!controlsRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [openMenu])

  const log = (text: string) => {
    const id = nextId.current++
    setActivity((prev) => [{ id, at: clock(), text }, ...prev].slice(0, 14))
  }

  const pickConcept = (id: ConceptId) => {
    if (id === concept) return
    setConcept(id)
    const name = CONCEPTS.find((x) => x.id === id)?.name ?? id
    log(`Switched to Concept ${id} · ${name}`)
  }

  const onSelect = (key: ControlKey, value: string) => {
    setOpenMenu(null)
    if (key === "audience") {
      setAudience(value)
      log(`Audience → ${AUDIENCES.find((x) => x.id === value)?.label}`)
    } else if (key === "channel") {
      setChannel(value)
      log(`Channel → ${CHANNELS.find((x) => x.id === value)?.label}`)
    } else if (key === "tone") {
      setTone(value as ToneId)
      log(`Tone → ${TONES.find((x) => x.id === value)?.label}`)
    } else {
      setStyle(value as StyleId)
      log(`Style → ${STYLES.find((x) => x.id === value)?.label}`)
    }
  }

  // Error rule: a brief under 24 characters always fails; otherwise every 4th
  // Generate fails with a simulated render timeout.
  const generate = () => {
    if (status === "loading") return
    setOpenMenu(null)
    genCount.current += 1
    const tooShort = brief.trim().length < 24
    const unlucky = genCount.current % 4 === 0
    setStatus("loading")
    setError(null)
    log(`Generate · Concept ${concept} · ${ch.label}`)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    genTimer.current = setTimeout(() => {
      if (tooShort) {
        setStatus("error")
        setError("The brief is too short to render. Give Muse at least 24 characters about the product or the moment.")
        log("Render failed · brief too short")
        return
      }
      if (unlucky) {
        setStatus("error")
        setError("The render engine timed out before the scene finished. Nothing was changed.")
        log("Render failed · engine timeout")
        return
      }
      setStatus("success")
      setRender((v) => v + 1)
      log(`Rendered Concept ${concept} · ${ch.label}`)
      flashTimer.current = setTimeout(() => setStatus("idle"), 2000)
    }, 1500)
  }

  const save = () => {
    setSavedFlash(true)
    log(`Saved draft · Concept ${concept}`)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setSavedFlash(false), 1500)
  }

  const exportBoard = () => log(`Exported ${ch.label} ${ch.format} · PNG`)

  const loading = status === "loading"
  const headline = c.headlines[tone]
  const statusText =
    status === "loading"
      ? `Rendering Concept ${concept}`
      : status === "success"
        ? `Rendered Concept ${concept}`
        : status === "error"
          ? `Render failed. ${error ?? ""}`
          : ""

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden bg-black text-white">
      <style>{`
        @keyframes fable-vf-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes fable-vf-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fable-vf-flash { 0%, 100% { border-color: rgba(255,255,255,0.15); } 50% { border-color: rgba(248,113,113,0.9); } }
        .fable-vf-progress { animation: fable-vf-progress 1.2s ease-in-out infinite; }
        .fable-vf-shimmer {
          background: linear-gradient(90deg, #fff 0%, #fff 40%, rgba(255,255,255,0.35) 50%, #fff 60%, #fff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text; background-clip: text; color: transparent;
          animation: fable-vf-shimmer 1.4s linear infinite;
        }
        .fable-vf-flash { animation: fable-vf-flash 0.5s ease-in-out 3; }
        @media (prefers-reduced-motion: reduce) {
          .fable-vf-progress, .fable-vf-shimmer, .fable-vf-flash { animation: none; }
          .fable-vf-progress { transform: none; }
        }
      `}</style>

      {/* Scene layers: one per concept, cross-faded by opacity */}
      {CONCEPTS.map((k) => (
        <div
          key={k.id}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-700 ease-out",
            k.id === concept ? (loading ? "opacity-50" : "opacity-100") : "opacity-0",
          )}
          style={{ backgroundImage: `${k.glow}, ${k.scene}` }}
        />
      ))}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full mix-blend-soft-light transition-opacity duration-500"
        style={{ opacity: s.grain }}
      >
        <filter id="fable-vf-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fable-vf-grain)" />
      </svg>

      {/* Progress line */}
      {loading && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px overflow-hidden" aria-hidden="true">
          <div className="fable-vf-progress h-full w-full bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {statusText}
      </p>

      {/* Top bar */}
      <header className="relative z-20 flex flex-wrap items-center gap-2 px-4 py-4 min-[820px]:gap-3 min-[820px]:px-8">
        <span className="mr-1 font-serif text-2xl italic leading-none tracking-tight">Muse</span>
        <GlassChip>Visual Frontend</GlassChip>
        <GlassChip className="border-white/25 bg-white/15 text-white">Fable 5.1</GlassChip>
        <GlassChip className="font-mono tracking-normal">frontend-skill</GlassChip>
        <button
          type="button"
          onClick={() => setBriefOpen((v) => !v)}
          aria-expanded={briefOpen}
          aria-controls="fable-vf-brief"
          className={cn(
            "ml-auto inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium backdrop-blur-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
            briefOpen ? "border-white bg-white text-black" : "border-white/20 bg-white/10 text-white hover:bg-white/20",
          )}
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Brief
        </button>
      </header>

      {/* Poster copy */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10 text-center min-[820px]:px-16">
        <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/60">Nocturne · Eau de Parfum</p>
        <h1
          className={cn(
            "max-w-[16ch] text-balance text-[clamp(40px,8vw,112px)] leading-[0.95] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] transition-[letter-spacing] duration-500",
            s.headline,
            loading && "fable-vf-shimmer",
          )}
        >
          {headline}
        </h1>
        <p className="mt-6 max-w-[42ch] text-balance text-base text-white/80 min-[820px]:text-lg">{c.sub}</p>
        <span className="mt-7 inline-flex h-10 items-center rounded-full border border-white/40 px-5 text-sm font-medium tracking-wide">
          {t.cta}
        </span>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
          {ch.label} · {ch.format} · {a.line} · Render {String(render).padStart(2, "0")}
        </p>
      </main>

      {/* Error line */}
      {status === "error" && error && (
        <div
          role="alert"
          className="relative z-20 mx-4 mb-2 flex flex-wrap items-center gap-3 rounded-2xl border border-red-400/40 bg-red-950/60 px-4 py-2.5 text-sm text-red-100 backdrop-blur-md min-[820px]:mx-8"
        >
          <span className="min-w-0 flex-1">{error}</span>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-red-400/20 px-3 text-xs font-medium text-red-50 transition-colors hover:bg-red-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {/* Control deck / bottom sheet */}
      <section
        aria-label="Control deck"
        className={cn(
          "sticky bottom-0 z-20 mx-3 mb-3 rounded-3xl border border-white/15 bg-white/8 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl min-[820px]:mx-8 min-[820px]:mb-8",
          status === "error" && "fable-vf-flash border-red-400/70",
          sheetOpen && "max-[819px]:max-h-[80dvh] max-[819px]:overflow-y-auto",
        )}
      >
        <button
          type="button"
          onClick={() => setSheetOpen((v) => !v)}
          aria-expanded={sheetOpen}
          aria-label={sheetOpen ? "Collapse controls" : "Expand controls"}
          className="flex w-full items-center justify-center py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset min-[820px]:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-white/40" />
          {sheetOpen ? (
            <ChevronDown className="ml-2 h-3.5 w-3.5 text-white/60" aria-hidden="true" />
          ) : (
            <ChevronUp className="ml-2 h-3.5 w-3.5 text-white/60" aria-hidden="true" />
          )}
        </button>

        <div className="flex flex-col gap-4 px-4 pb-4 pt-1 min-[820px]:grid min-[820px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[820px]:items-center min-[820px]:gap-6 min-[820px]:p-5">
          {/* LEFT — filmstrip (+ mobile Generate) */}
          <div className="flex items-center justify-between gap-3">
            <div role="radiogroup" aria-label="Creative concept" className="flex items-center gap-3 px-1 py-1">
              {CONCEPTS.map((k) => {
                const selected = k.id === concept
                return (
                  <button
                    key={k.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`Concept ${k.id} · ${k.name}`}
                    onClick={() => pickConcept(k.id)}
                    className={cn(
                      "relative flex h-14 w-10 items-end justify-center rounded-lg pb-1 font-serif text-sm italic transition-transform duration-200 hover:scale-[1.04]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
                      selected ? "ring-2 ring-white ring-offset-2 ring-offset-black/40" : "opacity-70 hover:opacity-100",
                    )}
                    style={{ backgroundImage: `${k.glow}, ${k.scene}` }}
                  >
                    {k.id}
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.75)]"
                      />
                    )}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 min-[820px]:hidden"
            >
              <Sparkles className={cn("h-4 w-4", loading && "animate-spin motion-reduce:animate-none")} aria-hidden="true" />
              {loading ? "Rendering" : "Generate"}
            </button>
          </div>

          {/* MIDDLE — controls */}
          <div
            ref={controlsRef}
            className={cn(
              "grid grid-cols-2 gap-2 min-[820px]:flex min-[820px]:flex-wrap min-[820px]:items-center",
              !sheetOpen && "hidden min-[820px]:flex",
            )}
          >
            <DeckSelect id="audience" label="Audience" value={audience} options={AUDIENCES} open={openMenu === "audience"} onToggle={(k) => setOpenMenu((v) => (v === k ? null : k))} onSelect={onSelect} />
            <DeckSelect id="channel" label="Channel" value={channel} options={CHANNELS} open={openMenu === "channel"} onToggle={(k) => setOpenMenu((v) => (v === k ? null : k))} onSelect={onSelect} />
            <DeckSelect id="tone" label="Tone" value={tone} options={TONES} open={openMenu === "tone"} onToggle={(k) => setOpenMenu((v) => (v === k ? null : k))} onSelect={onSelect} />
            <DeckSelect id="style" label="Style" value={style} options={STYLES} open={openMenu === "style"} onToggle={(k) => setOpenMenu((v) => (v === k ? null : k))} onSelect={onSelect} />
          </div>

          {/* RIGHT — metrics + actions */}
          <div className={cn("flex flex-wrap items-center gap-3", !sheetOpen && "hidden min-[820px]:flex")}>
            <dl className="flex gap-2">
              {[
                { k: "Reach", v: formatReach(metrics.reach) },
                { k: "CTR", v: `${metrics.ctr.toFixed(1)}%` },
                { k: "Conv.", v: `${metrics.cvr.toFixed(1)}%` },
              ].map((m) => (
                <div key={m.k} className="flex min-w-[72px] flex-col-reverse items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                  <dt className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/55">{m.k}</dt>
                  <dd className="text-xl font-semibold tabular-nums leading-none">{m.v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-2">
              {status === "success" && (
                <span className="inline-flex h-8 animate-pulse items-center gap-1 rounded-full bg-emerald-400/20 px-3 text-xs font-medium text-emerald-100 motion-reduce:animate-none">
                  Rendered <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}
              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="hidden h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 min-[820px]:inline-flex"
              >
                <Sparkles className={cn("h-4 w-4", loading && "animate-spin motion-reduce:animate-none")} aria-hidden="true" />
                {loading ? "Rendering" : "Generate"}
              </button>
              <button
                type="button"
                onClick={save}
                title="Save draft"
                aria-label="Save draft"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
              >
                {savedFlash ? <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={exportBoard}
                title={`Export ${ch.format} PNG`}
                aria-label={`Export ${ch.format} PNG`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brief panel */}
      {briefOpen && (
        <aside
          id="fable-vf-brief"
          aria-label="Campaign brief"
          className="fixed inset-0 z-40 flex flex-col border-white/15 bg-black/70 p-5 backdrop-blur-2xl min-[820px]:inset-auto min-[820px]:bottom-6 min-[820px]:right-6 min-[820px]:top-20 min-[820px]:w-[380px] min-[820px]:rounded-3xl min-[820px]:border min-[820px]:bg-black/50"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg italic">Campaign brief</h2>
            <button
              type="button"
              onClick={() => setBriefOpen(false)}
              aria-label="Close brief"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <label htmlFor="fable-vf-brief-text" className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
            What are we launching?
          </label>
          <textarea
            id="fable-vf-brief-text"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-3 text-sm leading-relaxed text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            placeholder="Describe the product, the moment, and who should feel it."
          />
          <p className={cn("mt-1.5 text-right font-mono text-[11px]", brief.trim().length < 24 ? "text-red-300" : "text-white/45")}>
            {brief.trim().length} chars · min 24
          </p>
          <h3 className="mb-2 mt-6 text-[11px] uppercase tracking-[0.18em] text-white/55">Recent</h3>
          <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-xs">
            {activity.map((e) => (
              <li key={e.id} className="flex gap-3 border-l border-white/15 pl-3 text-white/80">
                <span className="shrink-0 font-mono text-white/45">{e.at}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ol>
        </aside>
      )}
    </div>
  )
}
