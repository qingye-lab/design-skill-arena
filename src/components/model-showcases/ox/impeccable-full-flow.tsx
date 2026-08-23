"use client"

import { useState } from "react"

const AUDIENCES = ["Home cooks", "Weekend hosts", "Gift buyers"]
const CHANNELS = ["Recipe newsletters", "Cooking shorts", "In-store endcap"]
const TONES = ["Encouraging", "Playful", "Refined"]
const STYLES = ["Warm kitchen", "Fresh market", "Editorial table"]

const CONCEPTS = [
  {
    id: "A",
    name: "First Pour",
    hook: "The first pour should feel like an occasion.",
    detail: "Lead with the ritual of opening, not the spec list.",
    reach: 620,
    ctr: 3.9,
    conv: 3.1,
    tint: "#fff7ed",
    chip: "#c2410c",
  },
  {
    id: "B",
    name: "Table for Many",
    hook: "Made for the second helping.",
    detail: "Host-to-guest storytelling with generous framing.",
    reach: 580,
    ctr: 4.3,
    conv: 2.9,
    tint: "#f0fdf4",
    chip: "#15803d",
  },
  {
    id: "C",
    name: "Quiet Craft",
    hook: "Details you taste before you notice.",
    detail: "Close-up craft moments with restrained copy.",
    reach: 540,
    ctr: 3.5,
    conv: 3.6,
    tint: "#eff6ff",
    chip: "#1d4ed8",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function ImpeccableFullFlow() {
  const [brief, setBrief] = useState(
    "Position Muse as the studio a specialty olive-oil brand uses to plan its first national launch."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activity, setActivity] = useState([
    "Flow started",
    "Audience chosen: Home cooks",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 5))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      return
    }
    setPhase("loading")
    log("Generating campaign")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} generated`)
    }, 1400)
  }

  const label = "mb-1.5 block text-xs font-semibold text-stone-500"
  const field =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"

  return (
    <main className="min-h-screen bg-stone-50 pb-28 text-stone-900">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-stone-900 px-2 py-0.5 text-xs font-bold text-white">Ox</span>
            <span className="rounded-md border border-stone-300 px-2 py-0.5 text-xs text-stone-600">impeccable</span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Muse · Campaign Studio</h1>
        </div>
      </header>

      {/* Single focused column flow */}
      <div className="mx-auto max-w-2xl space-y-8 px-4 pt-8 sm:px-6">
        {/* Step 1 — brief */}
        <section aria-label="Step 1: brief">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-700">Step 1 · Brief</p>
          <label htmlFor="f-brief" className={label}>
            What are we launching?
          </label>
          <textarea
            id="f-brief"
            rows={3}
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value)
              if (phase === "error") setPhase("idle")
            }}
            className={`${field} resize-none`}
          />
          {phase === "error" && (
            <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
              A one-line brief isn&apos;t enough. Add a sentence or two about the product and moment.
            </p>
          )}
        </section>

        {/* Step 2 — controls */}
        <section aria-label="Step 2: direction">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-700">Step 2 · Direction</p>
          <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            {(
              [
                ["Audience", audience, AUDIENCES],
                ["Channel", channel, CHANNELS],
                ["Tone", tone, TONES],
                ["Visual style", style, STYLES],
              ] as const
            ).map(([name, value, opts]) => (
              <fieldset key={name}>
                <legend className={label}>{name}</legend>
                <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
                  {opts.map((o) => (
                    <button
                      key={o}
                      type="button"
                      role="radio"
                      aria-checked={value === o}
                      onClick={() => {
                        if (name === "Audience") setAudience(o)
                        if (name === "Channel") setChannel(o)
                        if (name === "Tone") setTone(o)
                        if (name === "Visual style") setStyle(o)
                        log(`${name}: ${o}`)
                      }}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                        value === o
                          ? "border-orange-600 bg-orange-600 text-white"
                          : "border-stone-300 text-stone-600 hover:border-orange-400 hover:text-orange-700"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        {/* Step 3 — concept + preview */}
        <section aria-label="Step 3: creative">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-700">Step 3 · Creative</p>

          <div className="grid grid-cols-3 gap-2">
            {CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveId(c.id)
                  log(`Previewing ${c.name}`)
                }}
                aria-pressed={activeId === c.id}
                className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  activeId === c.id ? "border-orange-600 bg-orange-50 shadow-sm" : "border-stone-200 bg-white"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{c.id}</span>
                <span className="block truncate text-sm font-semibold">{c.name}</span>
              </button>
            ))}
          </div>

          {/* Main preview */}
          <div
            className="mt-3 overflow-hidden rounded-2xl border border-stone-200 shadow-sm transition-colors duration-500"
            style={{ background: active.tint }}
          >
            {phase === "loading" ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-200 border-t-orange-600" />
                <p className="text-sm text-stone-500">Composing your campaign…</p>
              </div>
            ) : (
              <div className="flex min-h-[280px] flex-col justify-between p-7 sm:p-10">
                <div>
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ background: active.chip }}
                  >
                    {tone} · {channel}
                  </span>
                  <h2 className="mt-4 max-w-md text-2xl font-extrabold leading-snug tracking-tight sm:text-4xl">
                    {active.hook}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">{active.detail}</p>
                </div>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <p className="text-xs text-stone-500">
                    For {audience.toLowerCase()} · {style}
                  </p>
                  {phase === "success" && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      ✓ Ready
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Metrics */}
          <dl className="mt-3 grid grid-cols-3 divide-x divide-stone-200 overflow-hidden rounded-xl border border-stone-200 bg-white text-center">
            {(
              [
                ["Reach", active.reach.toLocaleString(), "est. accounts"],
                ["CTR", `${active.ctr.toFixed(1)}%`, "predicted"],
                ["Conversion", `${active.conv.toFixed(1)}%`, "predicted"],
              ] as const
            ).map(([k, v, note]) => (
              <div key={k} className="px-2 py-4">
                <dd className="text-xl font-bold tabular-nums">{v}</dd>
                <dt className="text-[11px] font-medium text-stone-500">{k}</dt>
                <p className="text-[10px] text-stone-400">{note}</p>
              </div>
            ))}
          </dl>
        </section>

        {/* Step 4 — activity */}
        <section aria-label="Recent activity">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-700">Activity</p>
          <ul className="space-y-2 rounded-xl border border-stone-200 bg-white p-4 text-xs text-stone-600">
            {activity.map((a, i) => (
              <li key={`${a}-${i}`} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-orange-500" />
                {a}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="hidden text-xs text-stone-500 sm:block">
            Concept {active.id} · {audience}
          </p>
          <div className="flex flex-1 gap-2 sm:flex-none">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="flex-1 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 sm:flex-none"
            >
              {phase === "loading" ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSavedAt(new Date().toLocaleTimeString())
                log("Draft saved")
              }}
              className="flex-1 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold transition hover:border-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 sm:flex-none"
            >
              {savedAt ? `Saved ${savedAt}` : "Save"}
            </button>
            <button
              type="button"
              onClick={() => log("Exported PDF one-pager (mock)")}
              className="flex-1 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold transition hover:border-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 sm:flex-none"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
