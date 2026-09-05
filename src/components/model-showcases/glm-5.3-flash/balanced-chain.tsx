"use client"

import { useState } from "react"

const AUDIENCES = ["Coffee subscribers", "Café owners", "Weekend brewers"]
const CHANNELS = ["Subscription box insert", "App push", "Store chalkboard"]
const TONES = ["Warm", "Energetic", "No-nonsense"]
const STYLES = ["Kraft paper", "Espresso dark", "Morning light"]

const CONCEPTS = [
  {
    id: "A",
    name: "First Cup",
    line: "The day starts when the kettle does.",
    reach: 720,
    ctr: 4.0,
    conv: 3.3,
    crema: "#b45309",
    foam: "#fef3c7",
  },
  {
    id: "B",
    name: "Second Shot",
    line: "For the 3pm version of you.",
    reach: 680,
    ctr: 4.4,
    conv: 3.0,
    crema: "#78350f",
    foam: "#fde8d0",
  },
  {
    id: "C",
    name: "Slow Roast",
    line: "Good things take four minutes.",
    reach: 640,
    ctr: 3.7,
    conv: 3.7,
    crema: "#166534",
    foam: "#ecfccb",
  },
]

type Phase = "idle" | "loading" | "success" | "error"
type Pane = "brief" | "direction"

export default function BalancedChain() {
  const [brief, setBrief] = useState(
    "Muse for a specialty roaster: launch a subscription tier with a campaign that fits on a coffee cup."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [pane, setPane] = useState<Pane>("brief")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Counter opened",
    "Audience: Coffee subscribers",
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
    log("Pulling shot…")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} extracted`)
    }, 1400)
  }

  const tabBtn = (t: Pane) =>
    `flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-600 ${
      pane === t ? "bg-white text-amber-900" : "text-stone-400 hover:text-stone-600"
    }`
  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
      on ? "border-amber-800 bg-amber-800 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-amber-500"
    }`

  return (
    <main className="flex min-h-screen flex-col bg-[#f5f1ea] text-stone-900">
      {/* Slim top bar */}
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="rounded bg-amber-800 px-1.5 py-0.5 text-[11px] font-bold text-white">GLM 5.3 Flash</span>
          <span className="text-[11px] font-medium text-stone-400">
            frontend-app-builder + taste-skill + impeccable
          </span>
        </div>
        <h1 className="text-sm font-bold tracking-tight">Muse · Campaign Studio</h1>
      </header>

      {/* Master–detail */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-4 sm:p-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Master pane */}
        <section aria-label="Setup panes" className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
          <div role="tablist" aria-label="Setup sections" className="flex border-b border-stone-200 bg-stone-200/60">
            <button role="tab" aria-selected={pane === "brief"} onClick={() => setPane("brief")} className={tabBtn("brief")}>
              Brief
            </button>
            <button role="tab" aria-selected={pane === "direction"} onClick={() => setPane("direction")} className={tabBtn("direction")}>
              Direction
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-auto p-4">
            {pane === "brief" ? (
              <>
                <label htmlFor="b-brief" className="block text-xs font-semibold text-stone-500">
                  Describe the launch
                </label>
                <textarea
                  id="b-brief"
                  rows={7}
                  value={brief}
                  onChange={(e) => {
                    setBrief(e.target.value)
                    if (phase === "error") setPhase("idle")
                  }}
                  className="w-full resize-none rounded-lg border border-stone-300 bg-white p-3 text-sm leading-relaxed focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                {phase === "error" && (
                  <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 ring-1 ring-red-200">
                    Brief too short — add a sentence about the product.
                  </p>
                )}
                <div className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
                  <p className="font-bold">Currently brewing</p>
                  <p className="mt-1">Concept {active.id} “{active.name}” for {audience.toLowerCase()}.</p>
                </div>
              </>
            ) : (
              <>
                {(
                  [
                    ["Audience", audience, AUDIENCES],
                    ["Channel", channel, CHANNELS],
                    ["Tone", tone, TONES],
                    ["Style", style, STYLES],
                  ] as const
                ).map(([name, value, opts]) => (
                  <fieldset key={name}>
                    <legend className="mb-1.5 text-xs font-semibold text-stone-500">{name}</legend>
                    <div className="flex flex-wrap gap-1.5">
                      {opts.map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => {
                            if (name === "Audience") setAudience(o)
                            if (name === "Channel") setChannel(o)
                            if (name === "Tone") setTone(o)
                            if (name === "Style") setStyle(o)
                            log(`${name}: ${o}`)
                          }}
                          className={chip(value === o)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </>
            )}

            {/* Concepts list always visible below pane content */}
            <div className="border-t border-stone-200 pt-3">
              <h2 className="mb-2 text-xs font-semibold text-stone-500">Concepts</h2>
              <div role="radiogroup" aria-label="Concepts" className="space-y-1.5">
                {CONCEPTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={activeId === c.id}
                    onClick={() => {
                      setActiveId(c.id)
                      setPhase("idle")
                      log(`Poured ${c.name}`)
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                      activeId === c.id ? "border-amber-800 bg-white shadow-sm" : "border-transparent bg-white/60"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white" style={{ background: c.crema }}>
                      {c.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{c.name}</span>
                      <span className="block truncate text-[11px] text-stone-400">{c.line}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions pinned to master pane */}
          <div className="grid grid-cols-3 gap-2 border-t border-stone-200 bg-white p-3">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="col-span-3 rounded-lg bg-amber-800 py-2.5 text-sm font-bold text-white transition hover:bg-amber-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 disabled:cursor-wait disabled:opacity-60"
            >
              {phase === "loading" ? "Brewing…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => log("Kept warm (saved)")}
              className="col-span-2 rounded-lg border border-stone-300 py-2 text-xs font-semibold transition hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => log("Bagged for delivery (mock)")}
              className="rounded-lg border border-stone-300 py-2 text-xs font-semibold transition hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              Export
            </button>
          </div>
        </section>

        {/* Detail pane */}
        <section aria-label="Main creative preview" className="flex flex-col gap-4">
          <div
            className="relative flex min-h-[340px] flex-1 flex-col justify-center overflow-hidden rounded-xl p-7 transition-colors duration-500 sm:min-h-[420px] sm:p-12"
            style={{ background: active.foam }}
          >
            {/* steam arcs */}
            <svg viewBox="0 0 120 60" className="pointer-events-none absolute right-6 top-4 h-16 w-40 opacity-40 sm:right-12" fill="none" stroke={active.crema} strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="M20 55 C15 40 30 35 25 20 C22 10 30 5 28 0" />
              <path d="M60 55 C55 40 70 35 65 20 C62 10 70 5 68 0" />
              <path d="M100 55 C95 40 110 35 105 20 C102 10 110 5 108 0" />
            </svg>

            {phase === "loading" ? (
              <div className="flex flex-col items-center gap-3">
                <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-amber-200 border-t-amber-800" />
                <p className="text-sm font-medium text-stone-500">Extracting…</p>
              </div>
            ) : (
              <>
                <span className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: active.crema }}>
                  Concept {active.id} · {tone}
                </span>
                <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-tight text-stone-900 sm:text-5xl">
                  {active.line}
                </h2>
                <p className="mt-4 max-w-md text-sm text-stone-600">
                  {channel} · {style} · for {audience.toLowerCase()}
                </p>
                {phase === "success" && (
                  <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
                    ✓ Extracted — balanced and ready
                  </span>
                )}
              </>
            )}
          </div>

          {/* Metrics + activity row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <dl className="grid grid-cols-3 divide-x divide-stone-200 overflow-hidden rounded-xl border border-stone-200 bg-white text-center">
              {(
                [
                  ["Reach", active.reach.toLocaleString()],
                  ["CTR", `${active.ctr.toFixed(1)}%`],
                  ["Conv.", `${active.conv.toFixed(1)}%`],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="px-2 py-4 transition-colors hover:bg-amber-50">
                  <dd className="text-lg font-black tabular-nums sm:text-xl">{v}</dd>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{k}</dt>
                </div>
              ))}
            </dl>

            <ul aria-label="Activity" className="space-y-1 rounded-xl border border-stone-200 bg-white p-3.5 text-xs text-stone-500">
              {activity.slice(0, 4).map((a, i) => (
                <li key={`${a}-${i}`} className={`flex items-center gap-2 ${i === 0 ? "font-semibold text-stone-700" : ""}`}>
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-amber-700" : "bg-stone-300"}`} />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Status bar */}
      <footer className="border-t border-stone-200 bg-white px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] text-stone-400">
          <span>
            Status:{" "}
            <span className={
              phase === "success" ? "font-bold text-emerald-600"
              : phase === "error" ? "font-bold text-red-600"
              : phase === "loading" ? "font-bold text-amber-700"
              : "font-bold text-stone-500"
            }>
              {phase}
            </span>
          </span>
          <span>Concept {active.id} / {audience} / {channel}</span>
        </div>
      </footer>
    </main>
  )
}
