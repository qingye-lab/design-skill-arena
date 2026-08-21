"use client"

import { useState } from "react"

const AUDIENCES = ["Team admins", "IT buyers", "Department heads"]
const CHANNELS = ["Email sequence", "Webinar funnel", "Partner portal"]
const TONES = ["Clear", "Confident", "Friendly"]
const STYLES = ["Crisp cloud", "Deep navy", "Soft daylight"]

const CONCEPTS = [
  {
    id: "A",
    name: "Rollout Ready",
    headline: "Launch day, minus the fire drill.",
    reach: 1320,
    ctr: 3.9,
    conv: 3.4,
    primary: "bg-blue-600",
    soft: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  {
    id: "B",
    name: "Adoption First",
    headline: "Software people actually open.",
    reach: 1180,
    ctr: 4.2,
    conv: 3.1,
    primary: "bg-indigo-600",
    soft: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  {
    id: "C",
    name: "Quiet IT",
    headline: "The launch your help desk won't notice.",
    reach: 1450,
    ctr: 3.6,
    conv: 3.8,
    primary: "bg-sky-600",
    soft: "bg-sky-50 text-sky-700 ring-sky-200",
  },
]

type Phase = "idle" | "loading" | "success" | "error"
type Toast = { kind: "success" | "info"; text: string } | null

export default function ProductPolishChain() {
  const [brief, setBrief] = useState(
    "Muse for a B2B SaaS platform: a Q3 launch campaign for the new workflow automation suite."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [toast, setToast] = useState<Toast>(null)
  const [activity, setActivity] = useState([
    "Workspace loaded",
    "Audience set: Team admins",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 5))
  }

  function showToast(t: Toast) {
    setToast(t)
    window.setTimeout(() => setToast(null), 2400)
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      return
    }
    setPhase("loading")
    log("Generation queued")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} generated`)
      showToast({ kind: "success", text: `Concept ${active.id} is ready` })
    }, 1400)
  }

  const navItem =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  const chip = (on: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-400"
    }`

  return (
    <main className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* App sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex" aria-label="App navigation">
        <div className="mb-6 flex items-center gap-2 px-1">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-white ${active.primary}`}>Ox</span>
          <div>
            <p className="text-sm font-bold leading-tight">Muse Studio</p>
            <p className="text-[10px] text-slate-400">Campaign workspace</p>
          </div>
        </div>
        <nav className="space-y-1">
          {["Overview", "Brief", "Concepts", "Forecast"].map((item, i) => (
            <span
              key={item}
              aria-current={i === 1 || i === 2 ? "page" : undefined}
              className={`${navItem} ${
                i === 1 || i === 2 ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${i === 1 || i === 2 ? active.primary : "bg-slate-300"}`} />
              {item}
            </span>
          ))}
        </nav>
        <div className="mt-auto rounded-lg bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-400 ring-1 ring-slate-200">
          Chain: frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar with breadcrumb */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white lg:hidden">OX</span>
            <span className="hidden shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-400 lg:inline">product-polish-chain</span>
            <span className="truncate text-slate-400">Campaigns</span>
            <span className="text-slate-300">/</span>
            <span className="truncate font-semibold">Q3 Automation Launch</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            {phase === "loading" && (
              <span className="flex items-center gap-1.5 font-semibold text-blue-600">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                Working…
              </span>
            )}
            {phase === "success" && <span className="font-semibold text-emerald-600">✓ Complete</span>}
            {phase === "error" && <span className="font-semibold text-red-600">✗ Needs attention</span>}
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto w-full max-w-5xl flex-1 space-y-5 p-4 sm:p-6">
          {/* Brief panel */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Brief">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-bold">Brief</h2>
              <span className="text-[11px] text-slate-400">{brief.trim().length} characters</span>
            </div>
            <div className="p-5">
              <textarea
                rows={3}
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (phase === "error") setPhase("idle")
                }}
                aria-label="Campaign brief"
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-sm leading-relaxed transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {phase === "error" && (
                <p role="alert" className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 ring-1 ring-red-200">
                  <span aria-hidden>⚠</span> The brief is too short — add detail about the product and audience.
                </p>
              )}
            </div>
          </section>

          {/* Controls + preview split */}
          <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Direction controls">
              <h2 className="text-sm font-bold">Direction</h2>
              {(
                [
                  ["Audience", audience, AUDIENCES],
                  ["Channel", channel, CHANNELS],
                  ["Tone", tone, TONES],
                  ["Style", style, STYLES],
                ] as const
              ).map(([name, value, opts]) => (
                <fieldset key={name}>
                  <legend className="mb-1.5 text-xs font-semibold text-slate-400">{name}</legend>
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
                        aria-pressed={value === o}
                        className={chip(value === o)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </section>

            <section className="flex flex-col gap-4" aria-label="Preview and metrics">
              {/* Preview card */}
              <div className="relative min-h-[260px] flex-1 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-7 shadow-sm sm:min-h-[320px] sm:p-10">
                {phase === "loading" ? (
                  <div className="flex h-full min-h-[220px] flex-col justify-center gap-3">
                    <div className="h-3 w-28 animate-pulse rounded bg-slate-700" />
                    <div className="h-8 w-3/4 animate-pulse rounded bg-slate-700" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-700" />
                    <p className="mt-2 text-xs font-medium text-slate-400">Generating concept…</p>
                  </div>
                ) : (
                  <>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${active.soft}`}>
                      Concept {active.id}
                    </span>
                    <h2 className="mt-4 max-w-lg text-2xl font-black leading-snug tracking-tight text-white sm:text-4xl">
                      {active.headline}
                    </h2>
                    <p className="mt-3 max-w-md text-sm text-slate-400">
                      {active.name} · {audience} · {channel} · {tone.toLowerCase()} · {style}
                    </p>
                    {phase === "success" && (
                      <span className="absolute bottom-5 right-5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                        ✓ Ready to ship
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Metrics row */}
              <dl className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["Reach", active.reach.toLocaleString(), "+8% vs last"],
                    ["Predicted CTR", `${active.ctr.toFixed(1)}%`, "target 3.5%"],
                    ["Conversion", `${active.conv.toFixed(1)}%`, "target 3.0%"],
                  ] as const
                ).map(([k, v, note]) => (
                  <div key={k} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <dd className="text-xl font-black tabular-nums tracking-tight">{v}</dd>
                    <dt className="mt-0.5 text-[11px] font-medium text-slate-500">{k}</dt>
                    <p className="text-[10px] text-slate-400">{note}</p>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* Concepts table */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Concepts">
            <h2 className="border-b border-slate-100 px-5 py-3 text-sm font-bold">Concepts</h2>
            <ul className="divide-y divide-slate-100">
              {CONCEPTS.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(c.id)
                      setPhase("idle")
                      log(`Opened concept ${c.id}`)
                    }}
                    aria-pressed={activeId === c.id}
                    className={`flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                      activeId === c.id ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${c.primary}`}>
                      {c.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{c.name}</span>
                      <span className="block truncate text-xs text-slate-400">{c.headline}</span>
                    </span>
                    <span className="hidden shrink-0 text-right text-xs tabular-nums text-slate-400 sm:block">
                      {c.reach.toLocaleString()} · {c.ctr.toFixed(1)}% · {c.conv.toFixed(1)}%
                    </span>
                    {activeId === c.id && <span className={`h-2 w-2 shrink-0 rounded-full ${c.primary}`} />}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Activity */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Recent activity">
            <h2 className="mb-3 text-sm font-bold">Activity</h2>
            <ol className="space-y-2.5">
              {activity.map((a, i) => (
                <li key={`${a}-${i}`} className="flex items-start gap-3 text-xs text-slate-500">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${i === 0 ? active.primary : "bg-slate-200"}`} />
                  <span className={i === 0 ? "font-semibold text-slate-700" : ""}>{a}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Bottom action bar */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-end gap-2 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => {
                log("Draft saved")
                showToast({ kind: "success", text: "Draft saved" })
              }}
              className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                log("Export requested")
                showToast({ kind: "info", text: "Export started — deck.pdf (mock)" })
              }}
              className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold transition hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Export
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className={`ml-2 rounded-lg px-6 py-2 text-sm font-bold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${active.primary} focus-visible:ring-blue-500 hover:brightness-110`}
            >
              {phase === "loading" ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-20 left-1/2 z-30 -translate-x-1/2">
        {toast && (
          <p
            className={`animate-[toast_0.25s_ease-out] rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg ${
              toast.kind === "success" ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
            }`}
          >
            {toast.text}
          </p>
        )}
      </div>

      <style>{`@keyframes toast { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </main>
  )
}
