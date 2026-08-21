"use client"

import { useEffect, useState } from "react"

const AUDIENCES = ["Ops managers", "Procurement leads", "Field technicians"]
const CHANNELS = ["Trade press", "LinkedIn InMail", "Industry webinar"]
const TONES = ["Plain-spoken", "Authoritative", "Dry-witted"]
const STYLES = ["Grid utilitarian", "Safety orange", "Blueprint mono"]

const CONCEPTS = [
  {
    id: "A",
    name: "Uptime",
    claim: "The launch that never goes down.",
    reach: 540,
    ctr: 3.6,
    conv: 3.8,
    key: "G",
  },
  {
    id: "B",
    name: "Torque",
    claim: "More grip on every decision.",
    reach: 500,
    ctr: 3.9,
    conv: 3.4,
    key: "T",
  },
  {
    id: "C",
    name: "Redline",
    claim: "Built to run at the edge of schedule.",
    reach: 610,
    ctr: 3.2,
    conv: 4.1,
    key: "R",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function StandardImpeccable() {
  const [brief, setBrief] = useState(
    "Muse for industrial tooling: plan a B2B campaign for a cordless power-tool platform launch."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Session started 09:00",
    "Brief loaded from template IND-04",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 6))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      log("ERROR: brief below minimum length")
      return
    }
    setPhase("loading")
    log(`RUN generate(concept=${active.id})`)
    window.setTimeout(() => {
      setPhase("success")
      log(`OK generated in 1.4s — concept ${active.id}`)
    }, 1400)
  }

  // Keyboard shortcut: G generates
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "TEXTAREA" || tag === "INPUT") return
      if (e.key.toLowerCase() === "g") generate()
      if (["a", "b", "c"].includes(e.key.toLowerCase())) {
        setActiveId(e.key.toUpperCase())
        setPhase("idle")
        log(`Switched to concept ${e.key.toUpperCase()}`)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brief, activeId])

  const rowLabel = "w-24 shrink-0 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
  const seg = (on: boolean) =>
    `border px-2.5 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
      on ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
    }`

  return (
    <main className="min-h-screen bg-slate-200/60 font-sans text-slate-900">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 border-b border-slate-300 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
          <span className="bg-slate-900 px-1.5 py-0.5 text-[11px] font-black tracking-widest text-white">OX</span>
          <span className="text-[11px] font-medium text-slate-500">frontend-app-builder + impeccable</span>
          <h1 className="text-sm font-bold">Muse Campaign Studio</h1>
          <div className="ml-auto flex items-center gap-3 text-[11px]">
            {phase === "loading" && <span className="font-semibold text-orange-600">● running…</span>}
            {phase === "success" && <span className="font-semibold text-emerald-600">● done</span>}
            {phase === "error" && <span className="font-semibold text-red-600">● failed</span>}
            {phase === "idle" && <span className="text-slate-400">● idle</span>}
            <kbd className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">G = generate · A/B/C = switch</kbd>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-label="Workspace" className="space-y-4">
          {/* Spec rows */}
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-300 bg-white">
            <div className="flex flex-col gap-2 p-3 sm:flex-row">
              <label htmlFor="i-brief" className={rowLabel}>Brief</label>
              <textarea
                id="i-brief"
                rows={2}
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (phase === "error") setPhase("idle")
                }}
                className="min-h-0 w-full flex-1 resize-none rounded border border-slate-200 bg-slate-50 p-2 text-sm leading-relaxed focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            {(
              [
                ["Audience", audience, AUDIENCES],
                ["Channel", channel, CHANNELS],
                ["Tone", tone, TONES],
                ["Style", style, STYLES],
              ] as const
            ).map(([name, value, opts]) => (
              <div key={name} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start">
                <span className={rowLabel}>{name}</span>
                <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-1">
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
                        if (name === "Style") setStyle(o)
                        log(`${name}=${o}`)
                      }}
                      className={`${seg(value === o)} ${value === o ? "" : "rounded-sm"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {phase === "error" && (
            <p role="alert" className="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              ✗ Generation blocked — brief must be at least 12 characters.
            </p>
          )}

          {/* Preview viewport */}
          <div className="overflow-hidden rounded-lg border border-slate-300 bg-white" aria-label="Main creative preview">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500">
              <span>preview / concept-{active.id.toLowerCase()}</span>
              <span>{style}</span>
            </div>
            <div className="relative min-h-[280px] p-6 sm:min-h-[340px] sm:p-10">
              {phase === "loading" ? (
                <div className="flex h-full min-h-[240px] items-center justify-center gap-3 text-sm text-slate-400">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-orange-600" />
                  Generating…
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-orange-600">
                    {tone} · {channel}
                  </p>
                  <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                    {active.claim}
                  </h2>
                  <p className="mt-3 max-w-md text-sm text-slate-500">
                    Concept {active.id} “{active.name}” — aimed at {audience.toLowerCase()}.
                  </p>
                  {phase === "success" && (
                    <span className="mt-4 inline-block rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      ✓ OK — ready to save or export
                    </span>
                  )}
                  <div className="absolute bottom-4 right-4 hidden select-none font-mono text-[64px] font-black leading-none text-slate-100 sm:block">
                    {active.id}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Metrics table */}
          <table className="w-full overflow-hidden rounded-lg border border-slate-300 bg-white text-left text-sm" aria-label="Forecast metrics">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="px-3 py-2 font-bold">Metric</th>
                <th className="px-3 py-2 font-bold">Concept {active.id}</th>
                <th className="hidden px-3 py-2 font-bold sm:table-cell">Baseline</th>
                <th className="px-3 py-2 text-right font-bold">Δ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(
                [
                  ["Reach (K)", active.reach.toLocaleString(), "520"],
                  ["Predicted CTR", `${active.ctr.toFixed(1)}%`, "3.5%"],
                  ["Conversion", `${active.conv.toFixed(1)}%`, "3.0%"],
                ] as const
              ).map(([k, v, base]) => (
                <tr key={k} className="transition-colors hover:bg-orange-50/50">
                  <td className="px-3 py-2.5 font-medium text-slate-600">{k}</td>
                  <td className="px-3 py-2.5 font-bold tabular-nums">{v}</td>
                  <td className="hidden px-3 py-2.5 tabular-nums text-slate-400 sm:table-cell">{base}</td>
                  <td className={`px-3 py-2.5 text-right font-semibold tabular-nums ${parseFloat(v.replace(/[,%]/g, "")) >= parseFloat(base.replace(/[,%]/g, "")) ? "text-emerald-600" : "text-red-600"}`}>
                    {parseFloat(v.replace(/[,%]/g, "")) >= parseFloat(base.replace(/[,%]/g, "")) ? "+" : ""}
                    {(parseFloat(v.replace(/[,%]/g, "")) - parseFloat(base.replace(/[,%]/g, ""))).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Side panel */}
        <aside aria-label="Concepts and activity" className="space-y-4">
          <div className="rounded-lg border border-slate-300 bg-white p-3">
            <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Concepts</h2>
            <div className="space-y-1">
              {CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveId(c.id)
                    setPhase("idle")
                    log(`concept=${c.id}`)
                  }}
                  aria-pressed={activeId === c.id}
                  className={`flex w-full items-center gap-2 rounded border px-2.5 py-2 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    activeId === c.id ? "border-orange-500 bg-orange-50 font-semibold" : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <kbd className="rounded border border-slate-300 bg-slate-50 px-1 font-mono text-[10px] text-slate-500">{c.key}</kbd>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="tabular-nums text-slate-400">{c.reach}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="col-span-3 rounded bg-orange-600 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:cursor-wait disabled:opacity-60"
            >
              {phase === "loading" ? "Running…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => log("saved draft.json")}
              className="col-span-2 rounded border border-slate-300 bg-white py-2 text-xs font-semibold transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => log("exported .pdf (mock)")}
              className="rounded border border-slate-300 bg-white py-2 text-xs font-semibold transition hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Export
            </button>
          </div>

          <div className="rounded-lg border border-slate-300 bg-white p-3">
            <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Activity log</h2>
            <ul className="max-h-56 space-y-1 overflow-auto font-mono text-[11px] leading-relaxed text-slate-500">
              {activity.map((a, i) => (
                <li key={`${a}-${i}`} className={a.startsWith("ERROR") ? "text-red-600" : a.startsWith("OK") ? "text-emerald-600" : ""}>
                  {String(i + 1).padStart(2, "0")} {a}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
