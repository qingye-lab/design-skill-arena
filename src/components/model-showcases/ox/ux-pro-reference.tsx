"use client"

import { useState } from "react"

const AUDIENCES = ["Commuter cyclists", "Trail runners", "City wanderers"]
const CHANNELS = ["Transit screens", "Running apps", "Street posters"]
const TONES = ["Energetic", "Grounded", "Bold"]
const STYLES = ["High-vis", "Earth tech", "Night neon"]

const CONCEPTS = [
  {
    id: "A",
    name: "Green Wave",
    promise: "Catch every light on the way home.",
    reach: 940,
    ctr: 4.5,
    conv: 3.0,
    color: "#16a34a",
    note: "Motion-first layout; works at 3-second glance distance.",
  },
  {
    id: "B",
    name: "Second Wind",
    promise: "The last kilometre is the loud one.",
    reach: 870,
    ctr: 4.9,
    conv: 2.8,
    color: "#ea580c",
    note: "Emotional peak framing for endurance audiences.",
  },
  {
    id: "C",
    name: "Night Kit",
    promise: "Be seen. Be early.",
    reach: 1010,
    ctr: 4.1,
    conv: 3.4,
    color: "#7c3aed",
    note: "Safety-led angle with strong contrast rules.",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function UxProReference() {
  const [brief, setBrief] = useState(
    "Launch Muse-built campaigns for a reflective cycling gear line across city transit networks."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Reference patterns loaded",
    "Audience segmented: Commuter cyclists",
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
    log("Validating against UX checklist")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} passed checks`)
    }, 1500)
  }

  const groupLabel = "mb-2 flex items-baseline justify-between"
  const groupTitle = "text-[11px] font-bold uppercase tracking-widest text-violet-700"
  const pill = (on: boolean) =>
    `rounded-lg border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
      on
        ? "border-violet-600 bg-violet-600 text-white shadow-sm"
        : "border-slate-300 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-700"
    }`

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-violet-600 px-2 py-1 text-xs font-bold text-white">Ox</span>
            <span className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-500">ui-ux-pro-max</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight">Muse · Campaign Studio</h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Control rail */}
        <section aria-label="Controls" className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <div className={groupLabel}>
              <label htmlFor="u-brief" className={groupTitle}>Campaign brief</label>
              <span className="text-[10px] text-slate-400">{brief.trim().length} chars</span>
            </div>
            <textarea
              id="u-brief"
              rows={4}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm leading-relaxed transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
            {phase === "error" && (
              <p role="alert" className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
                ⚠ Brief needs more detail before generating.
              </p>
            )}
          </div>

          {(
            [
              ["Audience", audience, AUDIENCES],
              ["Channel", channel, CHANNELS],
              ["Tone", tone, TONES],
              ["Visual style", style, STYLES],
            ] as const
          ).map(([name, value, opts]) => (
            <fieldset key={name}>
              <div className={groupLabel}>
                <legend className={groupTitle}>{name}</legend>
                <span className="text-[11px] font-medium text-slate-500">{value}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {opts.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      if (name === "Audience") setAudience(o)
                      if (name === "Channel") setChannel(o)
                      if (name === "Tone") setTone(o)
                      if (name === "Visual style") setStyle(o)
                      log(`${name}: ${o}`)
                    }}
                    className={pill(value === o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          <button
            type="button"
            onClick={generate}
            disabled={phase === "loading"}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
          >
            {phase === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Generating…
              </span>
            ) : (
              "Generate campaign"
            )}
          </button>
        </section>

        {/* Reference preview with annotations */}
        <section aria-label="Preview and metrics" className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div
              className="flex min-h-[340px] flex-col justify-end p-7 transition-colors duration-500 sm:min-h-[420px] sm:p-10"
              style={{ background: `linear-gradient(160deg, ${active.color}22 0%, #ffffff 70%)` }}
            >
              {phase === "loading" ? (
                <div className="m-auto flex flex-col items-center gap-3">
                  <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
                  <span className="text-sm text-slate-500">Checking layout, contrast & hierarchy…</span>
                </div>
              ) : (
                <>
                  <span
                    className="absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold text-white"
                    style={{ background: active.color }}
                  >
                    Concept {active.id}
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: active.color }}>
                    {channel} · {style}
                  </p>
                  <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                    {active.promise}
                  </h2>
                  <p className="mt-3 max-w-md text-sm text-slate-600">Speaking to {audience.toLowerCase()}, in a {tone.toLowerCase()} voice.</p>
                  {phase === "success" && (
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                      ✓ Passed UX checks
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Annotation callout */}
            <div className="hidden border-t border-dashed border-slate-300 bg-slate-50 px-5 py-3 sm:block">
              <p className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">Design note:</span> {active.note}
              </p>
            </div>
          </div>

          {/* Metrics + concepts row */}
          <div className="grid gap-4 sm:grid-cols-3">
            {CONCEPTS.map((c) => {
              const on = activeId === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveId(c.id)
                    setPhase("idle")
                    log(`Reference loaded: ${c.name}`)
                  }}
                  aria-pressed={on}
                  className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    on ? "border-violet-600 bg-white ring-2 ring-violet-600/30" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: c.color }}>
                      {c.id}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{c.name}</span>
                  </div>
                  <dl className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between"><dt className="text-slate-500">Reach</dt><dd className="font-bold tabular-nums">{c.reach.toLocaleString()}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">CTR</dt><dd className="font-bold tabular-nums">{c.ctr.toFixed(1)}%</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Conversion</dt><dd className="font-bold tabular-nums">{c.conv.toFixed(1)}%</dd></div>
                  </dl>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => log("Saved as reference")}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:flex-none sm:px-8"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => log("Exported spec sheet (mock)")}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:flex-none sm:px-8"
            >
              Export
            </button>
          </div>

          <ul aria-label="Activity" className="space-y-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
            {activity.map((a, i) => (
              <li key={`${a}-${i}`} className="flex gap-2">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-violet-500" />
                {a}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
