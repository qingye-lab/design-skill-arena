"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import {
  Check,
  CircleAlert,
  CircleCheck,
  Clock,
  Download,
  LoaderCircle,
  Minus,
  RefreshCw,
  Save,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Undo2,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------- mock data */

type ConceptId = "A" | "B" | "C"
type Audience = "Homeowners" | "Renters" | "Hosts"
type Channel = "Instagram" | "YouTube pre-roll" | "Search" | "In-store"
type Tone = "Reassuring" | "Direct" | "Witty"
type Style = "Photographic" | "Flat" | "Outline"
type Phase = "idle" | "loading" | "success" | "error"

type Concept = {
  id: ConceptId
  name: string
  angle: string
  accent: string
  dark: string
  headline: Record<Tone, string>
  sub: Record<Audience, string>
  cta: string
  base: { reach: number; ctr: number; conv: number }
}

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Your finger is the key",
    angle: "Fingerprint entry, no phone or fob needed",
    accent: "#059669",
    dark: "#064e3b",
    headline: { Reassuring: "You're already carrying the key.", Direct: "Touch. Unlock. Done.", Witty: "Keys: the original thing you lose." },
    sub: {
      Homeowners: "Keystone opens in 0.3 seconds with a fingerprint, and keeps working through a power cut.",
      Renters: "Fits over your existing deadbolt, no drilling, leaves with you when the lease ends.",
      Hosts: "Guests never wait on a lockbox. You never hand out a key you can't get back.",
    },
    cta: "See how it fits",
    base: { reach: 2.4, ctr: 2.9, conv: 1.8 },
  },
  {
    id: "B",
    name: "Keys you can take back",
    angle: "Time-boxed guest keys from the app",
    accent: "#4f46e5",
    dark: "#312e81",
    headline: { Reassuring: "Let people in. On your terms.", Direct: "Guest keys that expire on schedule.", Witty: "Give the dog walker a key. Not the house." },
    sub: {
      Homeowners: "Send a key that works Tuesdays 9 to 11, then quietly stops. Revoke it from anywhere.",
      Renters: "Share access with a flatmate for a week, or a cleaner for an hour, without copying anything.",
      Hosts: "Every booking gets its own key with its own window. Check-out revokes it automatically.",
    },
    cta: "Send a test key",
    base: { reach: 1.9, ctr: 3.6, conv: 2.4 },
  },
  {
    id: "C",
    name: "Twelve-minute install",
    angle: "Fits any standard deadbolt with one screwdriver",
    accent: "#d97706",
    dark: "#78350f",
    headline: { Reassuring: "Installed before the kettle boils.", Direct: "One screwdriver. Twelve minutes.", Witty: "Smarter than your door. Simpler than IKEA." },
    sub: {
      Homeowners: "Keystone replaces the thumb-turn, keeps your outside hardware, and works with your existing keys.",
      Renters: "Nothing permanent changes. Landlord-safe, deposit-safe, and it moves house with you.",
      Hosts: "Fit a whole building in an afternoon. Manage every door from one dashboard.",
    },
    cta: "Watch the install",
    base: { reach: 2.1, ctr: 2.4, conv: 2.0 },
  },
]

const AUDIENCES: { value: Audience; hint: string }[] = [
  { value: "Homeowners", hint: "Own the door, want fewer keys" },
  { value: "Renters", hint: "Need a no-drill, landlord-safe fit" },
  { value: "Hosts", hint: "Manage guest access for rentals" },
]
const CHANNELS: Channel[] = ["Instagram", "YouTube pre-roll", "Search", "In-store"]
const TONES: Tone[] = ["Reassuring", "Direct", "Witty"]
const STYLES: { value: Style; swatch: string }[] = [
  { value: "Photographic", swatch: "linear-gradient(135deg,#0f172a,#334155)" },
  { value: "Flat", swatch: "linear-gradient(135deg,#d1fae5,#a7f3d0)" },
  { value: "Outline", swatch: "linear-gradient(135deg,#ffffff,#e2e8f0)" },
]

const CHANNEL_WEIGHT: Record<Channel, { reach: number; ctr: number; conv: number; label: string }> = {
  Instagram: { reach: 1.25, ctr: 1.0, conv: 0.9, label: "Instagram weights reach ×1.25" },
  "YouTube pre-roll": { reach: 1.5, ctr: 0.7, conv: 0.8, label: "Pre-roll weights reach ×1.5, CTR ×0.7" },
  Search: { reach: 0.6, ctr: 1.6, conv: 1.5, label: "Search weights CTR ×1.6 and conversion ×1.5" },
  "In-store": { reach: 0.4, ctr: 1.0, conv: 1.8, label: "In-store weights conversion ×1.8" },
}
const TONE_SHIFT: Record<Tone, number> = { Reassuring: 1.0, Direct: 1.04, Witty: 1.07 }

function forecast(c: Concept, channel: Channel, tone: Tone) {
  const w = CHANNEL_WEIGHT[channel]
  const t = TONE_SHIFT[tone]
  return { reach: c.base.reach * w.reach, ctr: c.base.ctr * w.ctr * t, conv: c.base.conv * w.conv * t }
}

const METRICS: { key: "reach" | "ctr" | "conv"; label: string; help: string; fmt: (n: number) => string }[] = [
  { key: "reach", label: "Reach", help: "Unique people expected to see the creative over 30 days on this channel.", fmt: (n) => `${n.toFixed(1)}M` },
  { key: "ctr", label: "Click-through", help: "Share of impressions expected to click. Tone and channel move this the most.", fmt: (n) => `${n.toFixed(1)}%` },
  { key: "conv", label: "Conversion", help: "Share of clicks expected to reach checkout. In-store and Search convert best.", fmt: (n) => `${n.toFixed(1)}%` },
]

type Entry = { id: number; time: string; action: string; detail: string; undoable?: boolean }

const MIN_BRIEF = 20
const MAX_BRIEF = 400
const GENERATE_MS = 1500

const timeNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const epochNow = () => Date.now()

function savedLabel(savedAt: number, now: number, short: boolean) {
  const s = Math.max(0, Math.round((now - savedAt) / 1000))
  const rel = s < 5 ? "just now" : s < 60 ? `${s}s ago` : `${Math.round(s / 60)}m ago`
  return short ? `Saved ${rel.replace(" ago", "")}` : `Saved ${rel}`
}

/* ---------------------------------------------------------------- pieces */

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
const btn = "inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed"

function LockGlyph({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 96 120" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 52V36a24 24 0 0 1 48 0v16" />
      <rect x="12" y="52" width="72" height="60" rx="10" fill={color} fillOpacity="0.12" />
      <path d="M48 70a10 10 0 0 0-10 10c0 4 2 7 5 9" />
      <path d="M48 70a10 10 0 0 1 10 10c0 6-3 10-7 13" />
      <path d="M48 77a3 3 0 0 0-3 3c0 5 2 9 5 12" />
      <path d="M42 96c-5-4-8-9-8-16a14 14 0 0 1 28 0" />
    </svg>
  )
}

type StatusProps = { phase: Phase; reason: string | null; successText: string; onDismiss: () => void; onRetry: () => void }

function StatusRegion({ phase, reason, successText, onDismiss, onRetry }: StatusProps) {
  return (
    <div aria-live="polite" className="min-h-0">
      {phase === "loading" && (
        <div className="flex items-center gap-3 rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <LoaderCircle className="size-4 shrink-0 animate-spin text-emerald-600 motion-reduce:animate-none" aria-hidden="true" />
          <span className="font-medium">Generating…</span>
          <span className="relative ml-auto hidden h-1.5 w-40 overflow-hidden rounded-full bg-slate-100 sm:block" aria-hidden="true">
            <span className="fable-si-motion absolute inset-y-0 w-1/3 rounded-full bg-emerald-600 [animation:fable-si-slide_1.1s_ease-in-out_infinite]" />
          </span>
        </div>
      )}
      {phase === "success" && (
        <div className="flex items-start gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <p className="flex-1">{successText}</p>
          <button type="button" onClick={onDismiss} className={cn(btn, ring, "-my-1.5 -mr-2 min-h-10 px-3 text-emerald-800 hover:bg-emerald-100")}>
            <X className="size-4" aria-hidden="true" /> Dismiss
          </button>
        </div>
      )}
      {phase === "error" && (
        <div role="alert" className="flex flex-wrap items-start gap-3 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
          <p className="min-w-0 flex-1">
            <span className="font-semibold">Couldn&apos;t generate.</span> {reason}
          </p>
          <div className="flex gap-1">
            <button type="button" onClick={onRetry} className={cn(btn, ring, "-my-1.5 min-h-10 px-3 text-rose-800 hover:bg-rose-100")}>
              <RefreshCw className="size-4" aria-hidden="true" /> Retry
            </button>
            <button type="button" onClick={onDismiss} className={cn(btn, ring, "-my-1.5 -mr-2 min-h-10 px-3 text-rose-800 hover:bg-rose-100")}>
              <X className="size-4" aria-hidden="true" /> Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type ActionProps = {
  canGenerate: boolean
  loading: boolean
  disabledReason: string | null
  exportState: "idle" | "preparing" | "ready"
  onGenerate: () => void
  onSave: () => void
  onExport: () => void
}

function ActionBar({ canGenerate, loading, disabledReason, exportState, onGenerate, onSave, onExport }: ActionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onGenerate} disabled={!canGenerate || loading} aria-busy={loading} className={cn(btn, ring, "flex-1 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600")}>
          {loading ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
          {loading ? "Generating…" : "Generate"}
        </button>
        <button type="button" onClick={onSave} className={cn(btn, ring, "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50")}>
          <Save className="size-4" aria-hidden="true" /> Save
        </button>
        <button type="button" onClick={onExport} disabled={exportState === "preparing"} className={cn(btn, ring, "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:opacity-70")}>
          {exportState === "preparing" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Download className="size-4" aria-hidden="true" />}
          {exportState === "preparing" ? "Preparing export…" : "Export"}
        </button>
      </div>
      {disabledReason && !loading && <p className="text-xs text-slate-500">{disabledReason}</p>}
      {exportState === "ready" && (
        <p className="inline-flex flex-wrap items-center gap-1.5 self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700">
          <Check className="size-3.5 text-emerald-600" aria-hidden="true" /> Download ready ·{" "}
          <a href="#keystone-campaign.json" onClick={(e) => e.preventDefault()} className={cn("font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800", ring, "rounded-sm")}>
            keystone-campaign.json
          </a>
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- component */

export default function StandardImpeccable() {
  const [brief, setBrief] = useState("Launch Keystone, a smart deadbolt with fingerprint entry and time-boxed guest keys, to people who are tired of lockboxes and spare-key drawers.")
  const [audience, setAudience] = useState<Audience>("Homeowners")
  const [channel, setChannel] = useState<Channel>("Instagram")
  const [tone, setTone] = useState<Tone>("Reassuring")
  const [style, setStyle] = useState<Style>("Photographic")
  const [selected, setSelected] = useState<ConceptId>("A")
  const [generated, setGenerated] = useState(false)
  const [phase, setPhase] = useState<Phase>("idle")
  const [reason, setReason] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [undoSnapshot, setUndoSnapshot] = useState<{ dirty: boolean; savedAt: number | null } | null>(null)
  const [now, setNow] = useState(0)
  const [exportState, setExportState] = useState<"idle" | "preparing" | "ready">("idle")
  const [helpOpen, setHelpOpen] = useState<string | null>(null)
  const [entries, setEntries] = useState<Entry[]>([{ id: 1, time: "09:12", action: "Opened", detail: "Keystone campaign draft" }])

  const attempts = useRef(0)
  const nextId = useRef(2)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const conceptRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    const pending = timers.current
    const tick = setInterval(() => setNow(Date.now()), 5000)
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setPhase((p) => (p === "success" || p === "error" ? "idle" : p))
    }
    window.addEventListener("keydown", onKey)
    return () => {
      clearInterval(tick)
      pending.forEach(clearTimeout)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const concept = CONCEPTS.find((c) => c.id === selected) ?? CONCEPTS[0]
  const loading = phase === "loading"
  const briefLen = brief.trim().length
  const briefError = briefLen === 0 ? "Add a brief so the concept has something to work from." : briefLen < MIN_BRIEF ? `Brief is too short — add at least ${MIN_BRIEF - briefLen} more characters.` : null
  const disabledReason = briefError ? "Generate is unavailable until the brief is valid." : null
  const f = forecast(concept, channel, tone)

  const log = (action: string, detail: string, undoable = false) =>
    setEntries((prev) => [{ id: nextId.current++, time: timeNow(), action, detail, undoable }, ...prev.map((e) => ({ ...e, undoable: false }))].slice(0, 10))

  const touch = () => {
    setDirty(true)
    setExportState("idle")
  }

  // Error rule: an invalid brief disables Generate outright (so the error is
  // shown inline); when valid, every 4th attempt returns an empty draft.
  const generate = () => {
    if (loading || briefError) return
    attempts.current += 1
    setPhase("loading")
    setReason(null)
    later(() => {
      if (attempts.current % 4 === 0) {
        setPhase("error")
        setReason("The concept service returned an empty draft. Your brief and settings were kept.")
        log("Generate failed", `Concept ${selected} · empty draft`)
        return
      }
      setGenerated(true)
      setPhase("success")
      touch()
      log("Generated", `Concept ${selected} · ${audience} · ${channel}`)
    }, GENERATE_MS)
  }

  const save = () => {
    setUndoSnapshot({ dirty, savedAt })
    const t = epochNow()
    setSavedAt(t)
    setNow(t)
    setDirty(false)
    log("Saved", `Concept ${selected} · ${tone} tone`, true)
  }

  const undoSave = () => {
    if (!undoSnapshot) return
    setDirty(undoSnapshot.dirty)
    setSavedAt(undoSnapshot.savedAt)
    setUndoSnapshot(null)
    log("Undid save", "Reverted to the previous saved state")
  }

  const exportPlan = () => {
    setExportState("preparing")
    later(() => {
      setExportState("ready")
      log("Exported", `keystone-campaign.json · Concept ${selected}`)
    }, 800)
  }

  const pickConcept = (id: ConceptId) => {
    if (id === selected) return
    setSelected(id)
    touch()
    log("Switched concept", `${id} · ${CONCEPTS.find((c) => c.id === id)?.name}`)
  }

  const onConceptKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + CONCEPTS.length) % CONCEPTS.length
    pickConcept(CONCEPTS[n].id)
    conceptRefs.current[n]?.focus()
  }

  const control = <T extends string>(setter: (v: T) => void, label: string) => (v: T) => {
    setter(v)
    touch()
    log("Changed setting", `${label} → ${v}`)
  }
  const setAudienceCtl = control<Audience>(setAudience, "Audience")
  const setChannelCtl = control<Channel>(setChannel, "Channel")
  const setToneCtl = control<Tone>(setTone, "Tone")
  const setStyleCtl = control<Style>(setStyle, "Visual style")

  const dismiss = () => setPhase("idle")
  const successText = `Concept ${selected} drafted for ${audience.toLowerCase()} on ${channel}. Review the hero, then save.`

  const heroBg = style === "Photographic" ? `linear-gradient(135deg, ${concept.dark} 0%, #0f172a 70%)` : style === "Flat" ? `${concept.accent}1f` : "#ffffff"
  const heroText = style === "Photographic" ? "#f8fafc" : "#0f172a"

  const statusProps: StatusProps = { phase, reason, successText, onDismiss: dismiss, onRetry: generate }
  const actionProps: ActionProps = { canGenerate: !briefError, loading, disabledReason, exportState, onGenerate: generate, onSave: save, onExport: exportPlan }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-64 font-sans text-[#0f172a] min-[960px]:pb-10">
      <style>{`@keyframes fable-si-slide{0%{left:-33%}100%{left:100%}}@media (prefers-reduced-motion:reduce){.fable-si-motion{animation:none!important}}`}</style>

      {/* header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-[10px] bg-[#0f172a] text-sm font-bold text-white" aria-hidden="true">M</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Muse</p>
              <h1 className="text-xs text-slate-500">Standard + Impeccable · Keystone</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">Fable 5.1</span>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">frontend-app-builder + impeccable</span>
          </div>
          <div className="ml-auto">
            <span
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                dirty ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-600",
              )}
            >
              {dirty ? <CircleAlert className="size-3.5" aria-hidden="true" /> : savedAt ? <Check className="size-3.5 text-emerald-600" aria-hidden="true" /> : <Clock className="size-3.5" aria-hidden="true" />}
              <span className="hidden sm:inline">{dirty ? "Unsaved changes" : savedAt ? savedLabel(savedAt, now, false) : "Draft"}</span>
              <span className="sm:hidden">{dirty ? "Unsaved" : savedAt ? savedLabel(savedAt, now, true) : "Draft"}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="hidden min-[960px]:block">
          <StatusRegion {...statusProps} />
        </div>

        <div className={cn("grid grid-cols-1 gap-6 min-[960px]:grid-cols-[380px_minmax(0,1fr)]", phase !== "idle" && "min-[960px]:mt-6")}>
          {/* form */}
          <form className="order-3 flex flex-col gap-6 rounded-[10px] border border-slate-200 bg-white p-5 min-[960px]:order-none min-[960px]:col-start-1 min-[960px]:row-start-1 min-[960px]:row-span-3 min-[960px]:self-start" onSubmit={(e) => e.preventDefault()} aria-label="Campaign settings">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold">Brief</legend>
              <label htmlFor="si-brief" className="text-xs text-slate-600">What are we launching, and for whom?</label>
              <textarea
                id="si-brief"
                rows={5}
                maxLength={MAX_BRIEF}
                value={brief}
                aria-invalid={briefError ? true : undefined}
                aria-describedby="si-brief-help si-brief-count"
                onChange={(e) => {
                  setBrief(e.target.value)
                  touch()
                }}
                className={cn("w-full resize-y rounded-[10px] border bg-white px-3 py-2 text-sm leading-relaxed", ring, briefError ? "border-rose-500 focus-visible:ring-rose-600" : "border-slate-300 hover:border-slate-400")}
              />
              <div className="flex items-start justify-between gap-3 text-xs">
                <p id="si-brief-help" className={briefError ? "text-rose-700" : "text-slate-500"}>{briefError ?? "One or two sentences is plenty. Name the product and the person."}</p>
                <span id="si-brief-count" className="shrink-0 tabular-nums text-slate-500">{brief.length} / {MAX_BRIEF}</span>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Audience</legend>
              <div className="flex flex-col gap-1.5">
                {AUDIENCES.map((a) => (
                  <label key={a.value} className={cn("flex min-h-10 cursor-pointer items-start gap-3 rounded-[10px] border px-3 py-2 transition-colors hover:bg-slate-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600", audience === a.value ? "border-emerald-600 bg-emerald-50/50" : "border-slate-200")}>
                    <input type="radio" name="si-audience" value={a.value} checked={audience === a.value} onChange={() => setAudienceCtl(a.value)} className="mt-1 size-4 accent-emerald-600 focus-visible:outline-none" />
                    <span className="text-sm">
                      <span className="font-medium">{a.value}</span>
                      <span className="block text-xs text-slate-500">{a.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="si-channel" className="text-sm font-semibold">Channel</label>
              <select id="si-channel" value={channel} onChange={(e) => setChannelCtl(e.target.value as Channel)} className={cn("min-h-10 w-full rounded-[10px] border border-slate-300 bg-white px-3 text-sm hover:border-slate-400", ring)}>
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Tone</legend>
              <div role="radiogroup" aria-label="Tone" className="grid grid-cols-3 gap-1 rounded-[10px] bg-slate-100 p-1">
                {TONES.map((t) => (
                  <button key={t} type="button" role="radio" aria-checked={tone === t} onClick={() => setToneCtl(t)} className={cn("min-h-9 rounded-lg text-sm font-medium transition-colors", ring, tone === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900")}>
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Visual style</legend>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map((s) => (
                  <label key={s.value} className={cn("flex min-h-10 cursor-pointer flex-col gap-2 rounded-[10px] border p-2 transition-colors hover:bg-slate-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600", style === s.value ? "border-emerald-600 bg-emerald-50/50" : "border-slate-200")}>
                    <input type="radio" name="si-style" value={s.value} checked={style === s.value} onChange={() => setStyleCtl(s.value)} className="sr-only" />
                    <span className="block h-10 rounded-md border border-black/5" style={{ background: s.swatch }} aria-hidden="true" />
                    <span className="flex items-center justify-between text-xs font-medium">
                      {s.value}
                      {style === s.value && <Check className="size-3.5 text-emerald-600" aria-hidden="true" />}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="hidden border-t border-slate-200 pt-5 min-[960px]:block">
              <ActionBar {...actionProps} />
            </div>
          </form>

          {/* preview */}
          <section aria-labelledby="si-preview-h" className="order-1 min-[960px]:order-none min-[960px]:col-start-2 min-[960px]:row-start-1">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 id="si-preview-h" className="text-sm font-semibold">Landing hero</h2>
              <span className="text-xs text-slate-500">{channel} · 16:10</span>
            </div>
            {generated ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-slate-200 shadow-sm" style={{ background: heroBg, color: heroText }}>
                <div className="flex h-full flex-col justify-between p-6 sm:p-10">
                  <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide opacity-80">
                    <span>Keystone · Concept {concept.id}</span>
                    <span>{audience} · {tone}</span>
                  </div>
                  <div className="grid items-end gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div>
                      {loading ? (
                        <div className="space-y-3" aria-hidden="true">
                          <div className="h-9 w-4/5 animate-pulse rounded-md bg-current opacity-20 motion-reduce:animate-none sm:h-12" />
                          <div className="h-4 w-full animate-pulse rounded-md bg-current opacity-15 motion-reduce:animate-none" />
                          <div className="h-4 w-2/3 animate-pulse rounded-md bg-current opacity-15 motion-reduce:animate-none" />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl xl:text-5xl">{concept.headline[tone]}</h3>
                          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed opacity-85 sm:text-base">{concept.sub[audience]}</p>
                        </>
                      )}
                      <span className="mt-5 inline-flex min-h-10 items-center rounded-[10px] px-4 text-sm font-semibold text-white" style={{ backgroundColor: style === "Outline" ? "#0f172a" : concept.accent }}>
                        {concept.cta}
                      </span>
                    </div>
                    <LockGlyph color={style === "Photographic" ? "#f8fafc" : concept.accent} className="hidden h-28 w-auto sm:block sm:h-36 xl:h-44" />
                  </div>
                </div>
                {style === "Outline" && <div className="pointer-events-none absolute inset-3 rounded-md border-2" style={{ borderColor: concept.accent }} aria-hidden="true" />}
              </div>
            ) : (
              <div className="flex aspect-[16/10] flex-col items-center justify-center gap-4 rounded-[10px] border-2 border-dashed border-slate-300 bg-white p-6 text-center">
                <LockGlyph color="#94a3b8" className="h-16 w-auto" />
                <div>
                  <p className="text-sm font-medium">Generate a first concept to see the campaign</p>
                  <p className="mt-1 text-xs text-slate-500">The hero, the copy and the palette come from your brief and the selected concept.</p>
                </div>
                <button type="button" onClick={generate} disabled={!!briefError || loading} className={cn(btn, ring, "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600")}>
                  {loading ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
                  {loading ? "Generating…" : "Generate"}
                </button>
                {disabledReason && <p className="text-xs text-slate-500">{disabledReason}</p>}
              </div>
            )}
          </section>

          {/* concept switcher */}
          <section aria-labelledby="si-concepts-h" className="order-2 min-[960px]:order-none min-[960px]:col-start-2 min-[960px]:row-start-2">
            <h2 id="si-concepts-h" className="mb-2 text-sm font-semibold">Concept</h2>
            <div role="radiogroup" aria-labelledby="si-concepts-h" className="grid gap-2 sm:grid-cols-3">
              {CONCEPTS.map((c, i) => {
                const on = c.id === selected
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      conceptRefs.current[i] = el
                    }}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => pickConcept(c.id)}
                    onKeyDown={(e) => onConceptKey(e, i)}
                    className={cn("flex min-h-10 items-start gap-3 rounded-[10px] border bg-white p-3 text-left transition-colors hover:bg-slate-50", ring, on ? "border-emerald-600 ring-1 ring-emerald-600" : "border-slate-200")}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: c.accent }} aria-hidden="true">{c.id}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{c.name}</span>
                      <span className="block text-xs text-slate-500">{c.angle}</span>
                    </span>
                    {on && <Check className="ml-auto size-4 shrink-0 text-emerald-600" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </section>

          {/* forecast + activity */}
          <div className="order-4 grid gap-6 min-[960px]:order-none min-[960px]:col-start-2 min-[960px]:row-start-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section aria-labelledby="si-forecast-h">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h2 id="si-forecast-h" className="text-sm font-semibold">Forecast</h2>
                <span className="truncate text-xs text-slate-500">{CHANNEL_WEIGHT[channel].label}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {METRICS.map((m) => {
                  const v = f[m.key]
                  const baseline = CONCEPTS[0].base[m.key]
                  const Trend = v > baseline * 1.05 ? TrendingUp : v < baseline * 0.95 ? TrendingDown : Minus
                  const open = helpOpen === m.key
                  return (
                    <div key={m.key} title={m.help} className="rounded-[10px] border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs text-slate-500">{m.label}</span>
                        <button type="button" onClick={() => setHelpOpen(open ? null : m.key)} aria-expanded={open} aria-label={`About ${m.label}`} className={cn("grid size-6 place-items-center rounded-full text-[11px] font-semibold text-slate-500 hover:bg-slate-100", ring)}>
                          ?
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">{m.fmt(v)}</span>
                        <Trend className={cn("size-4", Trend === TrendingUp ? "text-emerald-600" : Trend === TrendingDown ? "text-rose-600" : "text-slate-400")} aria-hidden="true" />
                        <span className="sr-only">{Trend === TrendingUp ? "above baseline" : Trend === TrendingDown ? "below baseline" : "at baseline"}</span>
                      </div>
                      {open && <p className="mt-2 text-xs leading-relaxed text-slate-600">{m.help}</p>}
                    </div>
                  )
                })}
              </div>
            </section>

            <section aria-labelledby="si-activity-h">
              <h2 id="si-activity-h" className="mb-2 text-sm font-semibold">Activity</h2>
              <ul className="divide-y divide-slate-100 rounded-[10px] border border-slate-200 bg-white">
                {entries.map((e) => (
                  <li key={e.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 text-sm">
                    <span className="tabular-nums text-xs text-slate-500">{e.time}</span>
                    <span className="min-w-0">
                      <span className="font-medium">{e.action}</span>
                      <span className="block truncate text-xs text-slate-500">{e.detail}</span>
                    </span>
                    {e.undoable && undoSnapshot ? (
                      <button type="button" onClick={undoSave} className={cn(btn, ring, "-my-1 min-h-10 px-2.5 text-slate-700 hover:bg-slate-100")}>
                        <Undo2 className="size-4" aria-hidden="true" /> Undo
                      </button>
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur min-[960px]:hidden">
        <StatusRegion {...statusProps} />
        <ActionBar {...actionProps} />
      </div>
    </div>
  )
}
