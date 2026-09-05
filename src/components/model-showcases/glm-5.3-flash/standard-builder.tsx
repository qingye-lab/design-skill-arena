"use client"

import { useState } from "react"

const AUDIENCES = ["Urban creators", "Design-led families", "Early adopters"]
const CHANNELS = ["Paid social", "Launch email", "Retail display"]
const TONES = ["Confident", "Warm", "Precise"]
const STYLES = ["Clean product", "Soft studio", "Bold contrast"]

const CONCEPTS = [
  {
    id: "A",
    name: "First Listen",
    headline: "The room becomes the speaker.",
    sub: "Product-first story anchored in one clear demo moment.",
    reach: 842,
    ctr: 4.2,
    conv: 2.9,
    accent: "#2563eb",
  },
  {
    id: "B",
    name: "Shared Volume",
    headline: "Built for every ear in the room.",
    sub: "Social proof angle around group listening rituals.",
    reach: 768,
    ctr: 4.6,
    conv: 3.2,
    accent: "#0d9488",
  },
  {
    id: "C",
    name: "Spec Sheet",
    headline: "Numbers that sound like music.",
    sub: "Proof-led campaign with measurable audio claims.",
    reach: 905,
    ctr: 3.8,
    conv: 2.6,
    accent: "#d97706",
  },
]

type Status = "idle" | "loading" | "success" | "error"

export default function StandardBuilder() {
  const [brief, setBrief] = useState(
    "Launch Muse as the campaign studio creative directors use to ship a premium modular speaker release across paid social and retail."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [status, setStatus] = useState<Status>("idle")
  const [saved, setSaved] = useState(false)
  const [activity, setActivity] = useState<string[]>([
    "Brief loaded",
    "Audience set to Urban creators",
    "Forecast baseline ready",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(entry: string) {
    setActivity((prev) => [entry, ...prev].slice(0, 6))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setStatus("error")
      log("Generate failed: brief too short")
      return
    }
    setStatus("loading")
    log("Generation started")
    window.setTimeout(() => {
      setStatus("success")
      log(`Generated concept ${active.id} · ${audience} · ${channel}`)
    }, 1400)
  }

  const chip =
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  const chipOff = "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
  const chipOn = "border-blue-600 bg-blue-600 text-white"

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-neutral-900 px-2 py-1 text-xs font-bold tracking-wide text-white">
              GLM 5.3 Flash
            </span>
            <span className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-600">
              frontend-app-builder
            </span>
          </div>
          <div className="flex items-center gap-3">
            {status === "loading" && (
              <span className="text-xs font-medium text-blue-600">Generating…</span>
            )}
            {status === "success" && (
              <span className="text-xs font-medium text-emerald-600">Campaign ready</span>
            )}
            {status === "error" && (
              <span className="text-xs font-medium text-red-600">Generation failed</span>
            )}
            <h1 className="text-sm font-bold tracking-tight">Muse Campaign Studio</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)_280px]">
        {/* Left: brief + controls */}
        <section className="space-y-4" aria-label="Campaign setup">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <label
              htmlFor="brief"
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-500"
            >
              Campaign Brief
            </label>
            <textarea
              id="brief"
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              rows={5}
              className="w-full resize-none rounded-lg border border-neutral-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            {(
              [
                ["Target audience", audience, AUDIENCES, setAudience],
                ["Channel", channel, CHANNELS, setChannel],
                ["Tone", tone, TONES, setTone],
                ["Visual style", style, STYLES, setStyle],
              ] as const
            ).map(([label, value, options, setter]) => (
              <fieldset key={label}>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {label}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setter(opt)
                        log(`${label} set to ${opt}`)
                      }}
                      className={`${chip} ${value === opt ? chipOn : chipOff}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        {/* Center: preview + metrics */}
        <section className="space-y-4" aria-label="Creative preview">
          <div
            className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${active.accent}14, #ffffff 55%)` }}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 bg-white/70 px-4 py-2 text-xs text-neutral-500">
              <span>Concept {active.id} — {active.name}</span>
              <span>{style}</span>
            </div>
            <div className="flex min-h-[320px] flex-col items-start justify-center gap-4 p-8 sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: active.accent }}>
                {tone} · {channel}
              </p>
              <h2 className="max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                {active.headline}
              </h2>
              <p className="max-w-md text-sm text-neutral-600">{active.sub}</p>
              <div className="mt-2 inline-flex h-24 w-24 items-center justify-center rounded-full text-white" style={{ background: active.accent }}>
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 14v-4a8 8 0 0 1 16 0v4" strokeLinecap="round" />
                  <rect x="2.5" y="13" width="4" height="7" rx="1.5" />
                  <rect x="17.5" y="13" width="4" height="7" rx="1.5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["Reach (K)", active.reach.toLocaleString()],
                ["Predicted CTR", `${active.ctr.toFixed(1)}%`],
                ["Conversion", `${active.conv.toFixed(1)}%`],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4 text-center shadow-sm">
                <p className="text-lg font-bold tabular-nums sm:text-2xl">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveId(c.id)
                  log(`Switched to concept ${c.id}`)
                }}
                aria-pressed={activeId === c.id}
                className={`flex-1 rounded-xl border px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  activeId === c.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-neutral-200 bg-white"
                }`}
              >
                <span className="block text-xs font-bold text-neutral-400">Concept {c.id}</span>
                <span className="block text-sm font-semibold">{c.name}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generate}
              disabled={status === "loading"}
              className="min-w-[140px] rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              {status === "loading" ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSaved(true)
                log("Campaign saved")
                window.setTimeout(() => setSaved(false), 1800)
              }}
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              {saved ? "Saved ✓" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => log("Exported campaign deck (mock)")}
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              Export
            </button>
          </div>
        </section>

        {/* Right: activity */}
        <aside className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm" aria-label="Recent activity">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Activity</h2>
          <ol className="space-y-3">
            {activity.map((entry, i) => (
              <li key={`${entry}-${i}`} className="flex gap-2 text-xs text-neutral-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {entry}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  )
}
