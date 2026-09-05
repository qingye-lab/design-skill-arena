"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Droplets,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ConceptId = "A" | "B" | "C"
type Tone = "Direct" | "Playful" | "Premium"
type Audience = "Gym regulars" | "Commuters" | "Outdoor hikers" | "Parents"
type Channel = "Instagram Feed" | "TikTok" | "YouTube Pre-roll" | "Newsletter"
type Style = "Clean studio" | "Bold color" | "Lifestyle" | "Technical"
type Status = "idle" | "loading" | "success" | "error"

interface Concept {
  id: ConceptId
  name: string
  headline: Record<Tone, string>
  sub: string
  tagline: string
  bg: string
  fg: string
  accent: string
  base: { reach: number; ctr: number; conv: number }
}

const CONCEPTS: Concept[] = [
  {
    id: "A",
    name: "Clean by design",
    headline: {
      Direct: "The bottle that cleans itself.",
      Playful: "Dishwasher? Never heard of it.",
      Premium: "Purity, engineered in.",
    },
    sub: "UV-C sterilises the water and the inner wall every two hours. Zero effort, zero taste.",
    tagline: "Hydra · self-cleaning hydration",
    bg: "linear-gradient(160deg,#0f4c81 0%,#1a7fb8 55%,#7cc6e8 100%)",
    fg: "#ffffff",
    accent: "#d8f3ff",
    base: { reach: 184000, ctr: 2.4, conv: 1.7 },
  },
  {
    id: "B",
    name: "Never wash again",
    headline: {
      Direct: "Stop washing bottles. Start drinking.",
      Playful: "Your sink just got a day off.",
      Premium: "Care, without the chore.",
    },
    sub: "99.9% of bacteria eliminated on a timed cycle. Insulated steel keeps cold for 24h.",
    tagline: "Hydra · the last bottle you'll clean",
    bg: "linear-gradient(160deg,#1b1f23 0%,#2f3640 60%,#c5f04a 100%)",
    fg: "#f5f7f2",
    accent: "#c5f04a",
    base: { reach: 152000, ctr: 3.1, conv: 2.2 },
  },
  {
    id: "C",
    name: "Drink brighter",
    headline: {
      Direct: "Fresh water. Every single sip.",
      Playful: "Sip happens. Hydra handles it.",
      Premium: "Brighter water, quietly kept.",
    },
    sub: "A soft glow tells you the cycle is done. Two-hour cadence, or tap to clean now.",
    tagline: "Hydra · always fresh",
    bg: "linear-gradient(160deg,#ff7a59 0%,#ffb199 50%,#fff1e6 100%)",
    fg: "#3b1d14",
    accent: "#3b1d14",
    base: { reach: 121000, ctr: 2.8, conv: 1.4 },
  },
]

const AUDIENCES: Record<Audience, { reach: number; conv: number; line: string }> = {
  "Gym regulars": { reach: 1, conv: 1.15, line: "For people who refill four times a day" },
  Commuters: { reach: 1.2, conv: 0.95, line: "For the bag that goes everywhere" },
  "Outdoor hikers": { reach: 0.8, conv: 1.1, line: "For water sources you can't vouch for" },
  Parents: { reach: 1.1, conv: 1.25, line: "One less thing to scrub tonight" },
}

const CHANNELS: Record<Channel, { reach: number; ctr: number; format: string }> = {
  "Instagram Feed": { reach: 1, ctr: 1, format: "Instagram · 4:5 feed" },
  TikTok: { reach: 1.45, ctr: 0.85, format: "TikTok · 4:5 in-feed" },
  "YouTube Pre-roll": { reach: 1.25, ctr: 0.6, format: "YouTube · companion card" },
  Newsletter: { reach: 0.35, ctr: 2.1, format: "Email · hero module" },
}

const TONES: Tone[] = ["Direct", "Playful", "Premium"]
const STYLES: Record<Style, string> = {
  "Clean studio": "White sweep, hard shadow",
  "Bold color": "Flat fields, oversized type",
  Lifestyle: "In-hand, natural light",
  Technical: "Callouts and cutaways",
}

const TONE_CTR: Record<Tone, number> = { Direct: 1, Playful: 1.08, Premium: 0.94 }

interface Activity {
  id: number
  time: string
  text: string
}

const INITIAL_ACTIVITY: Activity[] = [
  { id: 3, time: "09:42:10", text: "Concept A generated from brief v1" },
  { id: 2, time: "09:41:37", text: "Channel set to Instagram Feed" },
  { id: 1, time: "09:40:02", text: "Workspace opened · Hydra launch" },
]

const DEFAULT_BRIEF =
  "Launch Hydra, a 600ml insulated bottle that sterilises itself with UV-C every two hours. Lead with the no-washing benefit, keep claims specific (99.9%, 24h cold), and end with a pre-order CTA."

const MIN_BRIEF = 20

function timeNow() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false })
}

function formatReach(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n)
}

export default function StandardBuilder() {
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [audience, setAudience] = useState<Audience>("Gym regulars")
  const [channel, setChannel] = useState<Channel>("Instagram Feed")
  const [tone, setTone] = useState<Tone>("Direct")
  const [style, setStyle] = useState<Style>("Clean studio")
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [status, setStatus] = useState<Status>("idle")
  const [saved, setSaved] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<"inputs" | "insights">("inputs")
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const generateCount = useRef(0)
  const nextId = useRef(100)

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (!exportOpen) return
    const onDown = (e: MouseEvent) => {
      // The action bar renders twice (app bar + mobile sticky bar), so match by attribute.
      if (!(e.target as Element).closest?.("[data-sb-export]")) setExportOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [exportOpen])

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
  }, [])

  const log = useCallback((text: string) => {
    nextId.current += 1
    const entry = { id: nextId.current, time: timeNow(), text }
    setActivity((prev) => [entry, ...prev].slice(0, 8))
  }, [])

  const concept = CONCEPTS.find((c) => c.id === conceptId) ?? CONCEPTS[0]
  const aud = AUDIENCES[audience]
  const ch = CHANNELS[channel]
  const reach = Math.round(concept.base.reach * aud.reach * ch.reach)
  const ctr = concept.base.ctr * ch.ctr * TONE_CTR[tone]
  const conv = concept.base.conv * aud.conv * (style === "Technical" ? 1.05 : 1)

  const briefTooShort = brief.trim().length < MIN_BRIEF

  function handleGenerate() {
    if (status === "loading") return
    setStatus("loading")
    setExportOpen(false)
    generateCount.current += 1
    // Error rule: a brief under 20 characters always fails; otherwise every 4th
    // generate fails to exercise the error path.
    const willFail = briefTooShort || generateCount.current % 4 === 0
    later(() => {
      if (willFail) {
        setStatus("error")
        log(briefTooShort ? "Generate failed · brief too short" : "Generate failed · model timeout")
      } else {
        setStatus("success")
        log(`Concept ${concept.id} regenerated for ${channel}`)
        later(() => setStatus((s) => (s === "success" ? "idle" : s)), 3000)
      }
    }, 1500)
  }

  function handleSave() {
    if (saved) return
    setSaved(true)
    log(`Draft saved · concept ${concept.id}, ${tone.toLowerCase()} tone`)
    later(() => setSaved(false), 2000)
  }

  function handleExport(kind: string) {
    setExportOpen(false)
    log(`Exported concept ${concept.id} as ${kind}`)
  }

  function pickConcept(id: ConceptId) {
    if (id === conceptId) return
    setConceptId(id)
    const next = CONCEPTS.find((c) => c.id === id)
    log(`Switched to concept ${id} · ${next?.name ?? ""}`)
  }

  const actionButtons = (
    <>
      <button
        type="button"
        onClick={handleSave}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
          saved && "border-green-300 bg-green-50 text-green-700 hover:bg-green-50",
        )}
      >
        {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
        {saved ? "Saved ✓" : "Save"}
      </button>
      <div data-sb-export className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={exportOpen}
          onClick={() => setExportOpen((o) => !o)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Download className="size-4" aria-hidden />
          Export
          <ChevronDown className="size-3.5 text-gray-500" aria-hidden />
        </button>
        {exportOpen && (
          <div
            role="menu"
            aria-label="Export options"
            className="absolute right-0 bottom-full z-30 mb-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg lg:top-full lg:bottom-auto lg:mt-1 lg:mb-0"
          >
            {["PNG", "PDF", "Copy JSON"].map((k) => (
              <button
                key={k}
                type="button"
                role="menuitem"
                onClick={() => handleExport(k)}
                className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none"
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={status === "loading"}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-progress disabled:opacity-80"
      >
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
        ) : (
          <Sparkles className="size-4" aria-hidden />
        )}
        {status === "loading" ? "Generating…" : "Generate"}
      </button>
    </>
  )

  const inputsPanel = (
    <section aria-labelledby="sb-inputs" className="flex flex-col gap-5 p-4">
      <h2 id="sb-inputs" className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        Inputs
      </h2>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="sb-brief" className="text-sm font-medium text-gray-800">
            Campaign brief
          </label>
          <span
            className={cn("text-xs tabular-nums", briefTooShort ? "text-red-600" : "text-gray-500")}
          >
            {brief.length} chars{briefTooShort ? ` · min ${MIN_BRIEF}` : ""}
          </span>
        </div>
        <textarea
          id="sb-brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          onBlur={() => log("Brief edited")}
          rows={6}
          className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
          placeholder="Describe the product, the promise, and the call to action…"
        />
      </div>

      <div>
        <label htmlFor="sb-audience" className="mb-1.5 block text-sm font-medium text-gray-800">
          Target audience
        </label>
        <select
          id="sb-audience"
          value={audience}
          onChange={(e) => {
            setAudience(e.target.value as Audience)
            log(`Audience set to ${e.target.value}`)
          }}
          className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
        >
          {(Object.keys(AUDIENCES) as Audience[]).map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sb-channel" className="mb-1.5 block text-sm font-medium text-gray-800">
          Channel
        </label>
        <select
          id="sb-channel"
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value as Channel)
            log(`Channel set to ${e.target.value}`)
          }}
          className="h-9 w-full rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
        >
          {(Object.keys(CHANNELS) as Channel[]).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <p id="sb-tone-label" className="mb-1.5 text-sm font-medium text-gray-800">
          Tone
        </p>
        <div
          role="radiogroup"
          aria-labelledby="sb-tone-label"
          className="grid grid-cols-3 rounded-lg border border-gray-300 bg-gray-100 p-0.5"
        >
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={tone === t}
              onClick={() => {
                setTone(t)
                log(`Tone set to ${t}`)
              }}
              className={cn(
                "h-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                tone === t
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-gray-800">Visual style</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(STYLES) as Style[]).map((s) => (
            <label key={s} className="relative cursor-pointer">
              <input
                type="radio"
                name="sb-style"
                value={s}
                checked={style === s}
                onChange={() => {
                  setStyle(s)
                  log(`Visual style set to ${s}`)
                }}
                className="peer sr-only"
              />
              <span className="block rounded-lg border border-gray-300 bg-white p-2.5 transition-colors peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:ring-1 peer-checked:ring-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 hover:border-gray-400">
                <span className="block text-sm font-medium text-gray-900">{s}</span>
                <span className="mt-0.5 block text-xs leading-snug text-gray-500">{STYLES[s]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  )

  const maxReach = Math.max(...CONCEPTS.map((c) => c.base.reach)) * 1.45 * 1.2
  const forecastRows = [
    { label: "Reach", value: formatReach(reach), pct: (reach / maxReach) * 100, note: "est. impressions" },
    { label: "CTR", value: `${ctr.toFixed(2)}%`, pct: (ctr / 7) * 100, note: "click-through" },
    { label: "Conversion", value: `${conv.toFixed(2)}%`, pct: (conv / 3.2) * 100, note: "pre-orders / click" },
  ]

  const insightsPanel = (
    <div className="flex flex-col gap-6 p-4">
      <section aria-labelledby="sb-forecast">
        <h2 id="sb-forecast" className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Forecast
        </h2>
        <ul className="flex flex-col gap-3">
          {forecastRows.map((r) => (
            <li key={r.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-700">{r.label}</span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">{r.value}</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${Math.min(100, r.pct)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{r.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Concept {concept.id} · {channel} · {audience}
        </p>
      </section>

      <section aria-labelledby="sb-activity">
        <h2 id="sb-activity" className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          Activity
        </h2>
        <ol className="flex flex-col divide-y divide-gray-100">
          {activity.map((a) => (
            <li key={a.id} className="flex gap-3 py-2 text-sm">
              <time className="shrink-0 font-mono text-xs leading-5 text-gray-500 tabular-nums">
                {a.time}
              </time>
              <span className="text-gray-800">{a.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )

  const preview = (
    <section aria-labelledby="sb-preview" className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4">
        <h2 id="sb-preview" className="sr-only">
          Preview
        </h2>
        <div role="tablist" aria-label="Creative concept" className="flex gap-1">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === conceptId}
              onClick={() => pickConcept(c.id)}
              className={cn(
                "relative h-11 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset",
                c.id === conceptId ? "text-blue-700" : "text-gray-600 hover:text-gray-900",
              )}
            >
              Concept {c.id}
              <span className="ml-1.5 hidden text-gray-400 sm:inline">{c.name}</span>
              {c.id === conceptId && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-blue-600" aria-hidden />
              )}
            </button>
          ))}
        </div>
        <span className="hidden text-xs text-gray-500 sm:block">{ch.format}</span>
      </div>

      <div
        className="flex flex-1 items-center justify-center p-4 sm:p-8"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd0d8 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div className="relative w-full max-w-[420px]">
          <article
            aria-label={`Concept ${concept.id} ad preview`}
            className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/10"
            style={{ background: concept.bg, color: concept.fg }}
          >
            <header className="flex items-center justify-between px-6 pt-5 text-[11px] font-medium tracking-wide uppercase opacity-90">
              <span className="inline-flex items-center gap-1.5">
                <Droplets className="size-3.5" aria-hidden /> Hydra
              </span>
              <span>{ch.format}</span>
            </header>

            <div
              aria-hidden
              className="absolute top-1/2 right-6 h-[46%] w-[22%] -translate-y-1/2 rounded-[999px_999px_28px_28px]"
              style={{
                background:
                  style === "Technical"
                    ? `repeating-linear-gradient(0deg, ${concept.accent}33 0 2px, transparent 2px 10px), ${concept.accent}22`
                    : `linear-gradient(90deg, ${concept.accent}55, ${concept.accent}11)`,
                border: `1.5px solid ${concept.accent}`,
                boxShadow: style === "Clean studio" ? `10px 14px 0 0 ${concept.accent}22` : "none",
              }}
            >
              <div
                className="absolute -top-3 left-1/2 h-4 w-1/2 -translate-x-1/2 rounded-md"
                style={{ background: concept.accent }}
              />
              <div
                className="absolute bottom-[26%] left-1/2 h-1.5 w-1/3 -translate-x-1/2 rounded-full"
                style={{ background: concept.accent, opacity: 0.9 }}
              />
            </div>

            <div className="relative max-w-[70%] px-6">
              <p className="text-[11px] font-medium tracking-wide uppercase opacity-80">{aud.line}</p>
              <h3
                className={cn(
                  "mt-2 leading-[1.05] font-bold tracking-tight",
                  style === "Bold color" ? "text-4xl sm:text-[2.6rem]" : "text-3xl sm:text-4xl",
                  style === "Lifestyle" && "font-semibold tracking-normal",
                )}
              >
                {concept.headline[tone]}
              </h3>
              <p className="mt-3 text-sm leading-relaxed opacity-90">{concept.sub}</p>
            </div>

            <footer className="flex items-end justify-between px-6 pb-5">
              <p className="text-xs opacity-80">{concept.tagline}</p>
              <span
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ background: concept.fg, color: concept.id === "C" ? "#fff" : "#0f172a" }}
              >
                {tone === "Premium" ? "Reserve yours" : tone === "Playful" ? "Grab one" : "Pre-order"}
              </span>
            </footer>

            {status === "loading" && (
              <div
                aria-hidden
                className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.55)_30%,rgba(255,255,255,0.85)_50%,rgba(255,255,255,0.55)_70%)] backdrop-blur-[2px] motion-reduce:animate-none"
              >
                <div className="absolute inset-x-6 top-16 h-3 rounded bg-gray-300/70" />
                <div className="absolute inset-x-6 top-24 h-9 w-2/3 rounded bg-gray-300/70" />
                <div className="absolute inset-x-6 top-36 h-3 w-1/2 rounded bg-gray-300/70" />
              </div>
            )}
          </article>
          <p className="mt-3 text-center text-xs text-gray-500">
            {style} · {tone} · {audience}
          </p>
        </div>
      </div>
    </section>
  )

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f5f7] font-sans text-gray-900">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-blue-600 text-sm font-bold text-white">
            M
          </span>
          <span className="text-sm font-semibold tracking-tight">Muse</span>
        </div>
        <span className="hidden h-5 w-px bg-gray-200 sm:block" aria-hidden />
        <h1 className="truncate text-sm font-medium text-gray-700">Standard Builder</h1>
        <div className="ml-1 flex items-center gap-1.5">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
            Fable 5.1
          </span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-700">
            frontend-app-builder
          </span>
        </div>
        <div className="ml-auto hidden items-center gap-2 lg:flex">{actionButtons}</div>
      </header>

      <div role="status" aria-live="polite" className="shrink-0">
        {status === "success" && (
          <div className="flex items-center gap-2 border-b border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
            <CheckCircle2 className="size-4" aria-hidden />
            Concept {concept.id} regenerated. Forecast updated for {channel}.
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            <AlertCircle className="size-4" aria-hidden />
            {briefTooShort
              ? `Generation failed: the brief needs at least ${MIN_BRIEF} characters.`
              : "Generation failed: the model timed out."}
            <button
              type="button"
              onClick={handleGenerate}
              className="ml-1 font-medium underline underline-offset-2 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Workspace: single DOM tree, reordered per breakpoint so ids/labels stay unique */}
      <main className="flex min-h-0 flex-1 flex-col pb-20 lg:grid lg:grid-cols-[300px_minmax(0,1fr)_280px] lg:pb-0">
        <aside
          className={cn(
            "order-3 bg-white lg:order-1 lg:block lg:overflow-y-auto lg:border-r lg:border-gray-200",
            mobileTab !== "inputs" && "hidden",
          )}
        >
          {inputsPanel}
        </aside>
        <div className="order-1 flex min-h-0 flex-col border-b border-gray-200 bg-white lg:order-2 lg:border-b-0 lg:bg-transparent">
          {preview}
        </div>
        <div
          role="tablist"
          aria-label="Workspace panel"
          className="order-2 grid grid-cols-2 border-b border-gray-200 bg-white lg:hidden"
        >
          {(
            [
              ["inputs", "Inputs"],
              ["insights", "Forecast & Activity"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mobileTab === id}
              onClick={() => setMobileTab(id)}
              className={cn(
                "relative h-11 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset",
                mobileTab === id ? "text-blue-700" : "text-gray-600",
              )}
            >
              {label}
              {mobileTab === id && (
                <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-t bg-blue-600" aria-hidden />
              )}
            </button>
          ))}
        </div>
        <aside
          className={cn(
            "order-3 bg-white lg:order-3 lg:block lg:overflow-y-auto lg:border-l lg:border-gray-200",
            mobileTab !== "insights" && "hidden",
          )}
        >
          {insightsPanel}
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        {actionButtons}
      </div>
    </div>
  )
}
