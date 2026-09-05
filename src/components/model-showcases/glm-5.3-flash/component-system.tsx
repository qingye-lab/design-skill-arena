"use client"

import { useState } from "react"

const AUDIENCES = ["Remote teams", "Studio managers", "Freelance leads"]
const CHANNELS = ["LinkedIn ads", "Webinar series", "Partner co-marketing"]
const TONES = ["Professional", "Friendly", "Aspirational"]
const STYLES = ["Soft SaaS", "Vivid gradient", "Editorial clean"]

const CONCEPTS = [
  {
    id: "A",
    name: "Team Rhythm",
    headline: "Every launch, on the same beat.",
    reach: 1150,
    ctr: 3.8,
    conv: 3.2,
    ring: "ring-blue-500",
    dot: "bg-blue-500",
    soft: "bg-blue-50 text-blue-700",
  },
  {
    id: "B",
    name: "Quiet Handoff",
    headline: "Briefs that hand themselves off.",
    reach: 980,
    ctr: 4.1,
    conv: 2.9,
    ring: "ring-violet-500",
    dot: "bg-violet-500",
    soft: "bg-violet-50 text-violet-700",
  },
  {
    id: "C",
    name: "Show Your Work",
    headline: "Campaigns your whole studio can read.",
    reach: 1240,
    ctr: 3.5,
    conv: 3.6,
    ring: "ring-emerald-500",
    dot: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-700",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function ComponentSystem() {
  const [brief, setBrief] = useState(
    "Muse for B2B creative teams: plan a multi-channel campaign for a collaborative design platform."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Component library mounted",
    "Audience set: Remote teams",
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
    log("Composing from component system")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} composed`)
    }, 1400)
  }

  const card = "rounded-xl border border-slate-200 bg-white shadow-sm"
  const chipBase =
    "rounded-full border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
  const chipOff = "border-slate-200 bg-white text-slate-600 hover:border-slate-400"

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      {/* Header card */}
      <header className={`${card} mb-4 flex flex-wrap items-center justify-between gap-3 px-5 py-4`}>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-bold text-white">GLM 5.3 Flash</span>
          <span className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500">shadcn-best-practices</span>
        </div>
        <h1 className="text-base font-bold tracking-tight">Muse · Campaign Studio</h1>
      </header>

      {/* Bento grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Brief card */}
        <section className={`${card} p-5`} aria-label="Campaign brief">
          <h2 className="mb-1 text-sm font-bold">Campaign Brief</h2>
          <p className="mb-3 text-xs text-slate-500">Describe the product and the moment.</p>
          <textarea
            rows={5}
            value={brief}
            onChange={(e) => {
              setBrief(e.target.value)
              if (phase === "error") setPhase("idle")
            }}
            aria-label="Campaign brief"
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed transition focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
          {phase === "error" && (
            <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              Brief is too short to compose from.
            </p>
          )}
        </section>

        {/* Controls card */}
        <section className={`${card} space-y-4 p-5`} aria-label="Direction controls">
          <h2 className="text-sm font-bold">Direction</h2>
          {(
            [
              ["Audience", audience, AUDIENCES],
              ["Channel", channel, CHANNELS],
              ["Tone", tone, TONES],
              ["Visual style", style, STYLES],
            ] as const
          ).map(([name, value, opts]) => (
            <fieldset key={name}>
              <legend className="mb-1.5 text-xs font-semibold text-slate-500">{name}</legend>
              <div className="flex flex-wrap gap-1.5">
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
                    aria-pressed={value === o}
                    className={`${chipBase} ${value === o ? "border-slate-900 bg-slate-900 text-white" : chipOff}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </section>

        {/* Metrics card */}
        <section className={`${card} flex flex-col p-5`} aria-label="Forecast metrics">
          <h2 className="mb-3 text-sm font-bold">Forecast</h2>
          {phase === "loading" ? (
            <div className="flex flex-1 items-center justify-center gap-2 text-sm text-slate-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Computing…
            </div>
          ) : (
            <dl className="flex flex-1 flex-col justify-center gap-4">
              {(
                [
                  ["Reach", active.reach.toLocaleString(), "accounts"],
                  ["Predicted CTR", `${active.ctr.toFixed(1)}%`, "vs 3.4% baseline"],
                  ["Conversion", `${active.conv.toFixed(1)}%`, "vs 2.8% baseline"],
                ] as const
              ).map(([k, v, note]) => (
                <div key={k} className="flex items-baseline justify-between border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs font-medium text-slate-500">
                    {k}
                    <span className="ml-1 text-[10px] text-slate-400">{note}</span>
                  </dt>
                  <dd className="text-2xl font-black tabular-nums tracking-tight">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Preview card — spans full width */}
        <section className={`${card} overflow-hidden lg:col-span-2`} aria-label="Main creative preview">
          <div className={`flex min-h-[300px] flex-col justify-center p-7 ring-inset sm:min-h-[360px] sm:p-12 ring-1 ${active.ring} transition-all duration-500`}>
            {phase === "loading" ? (
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
              </div>
            ) : (
              <>
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${active.soft}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${active.dot}`} />
                  Concept {active.id} · {active.name}
                </span>
                <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                  {active.headline}
                </h2>
                <p className="mt-3 max-w-lg text-sm text-slate-500">
                  {audience} · {channel} · {tone.toLowerCase()} tone · {style}
                </p>
                {phase === "success" && (
                  <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    ✓ Campaign composed successfully
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        {/* Concept switcher + actions */}
        <section className={`${card} flex flex-col p-5`} aria-label="Concepts and actions">
          <h2 className="mb-3 text-sm font-bold">Concepts</h2>
          <div role="radiogroup" aria-label="Concepts" className="space-y-2">
            {CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={activeId === c.id}
                onClick={() => {
                  setActiveId(c.id)
                  setPhase("idle")
                  log(`Mounted concept ${c.id}`)
                }}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  activeId === c.id ? "border-slate-900 bg-slate-50 font-semibold" : "border-slate-200"
                }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="text-xs tabular-nums text-slate-400">{c.ctr.toFixed(1)}%</span>
              </button>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="col-span-3 rounded-lg bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            >
              {phase === "loading" ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => log("Saved draft")}
              className="rounded-lg border border-slate-200 py-2 text-xs font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => log("Exported deck (mock)")}
              className="rounded-lg border border-slate-200 py-2 text-xs font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => {
                setPhase("idle")
                log("Reset to idle")
              }}
              className="rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-500 transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Activity */}
        <section className={`${card} p-5 lg:col-span-3`} aria-label="Recent activity">
          <h2 className="mb-3 text-sm font-bold">Activity</h2>
          <ol className="grid gap-x-8 gap-y-2 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
            {activity.map((a, i) => (
              <li key={`${a}-${i}`} className="flex items-center gap-2 border-b border-dashed border-slate-100 pb-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? active.dot : "bg-slate-300"}`} />
                {a}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
