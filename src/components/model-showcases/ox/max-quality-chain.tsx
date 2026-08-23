"use client"

import { useState } from "react"

const AUDIENCES = ["Design engineers", "Studio leads", "Hardware founders"]
const CHANNELS = ["Keynote moment", "Longform feature", "Launch digest"]
const TONES = ["Exact", "Visionary", "Plain"]
const STYLES = ["Mono precision", "Signal orange", "Deep field"]

const CONCEPTS = [
  {
    id: "A",
    name: "Tolerance",
    line: "Designed to a tolerance of zero excuses.",
    reach: 830,
    ctr: 4.1,
    conv: 3.6,
    signal: "#d4ff4f",
  },
  {
    id: "B",
    name: "Prototype Zero",
    line: "Every launch is prototype zero of the brand.",
    reach: 780,
    ctr: 3.8,
    conv: 3.9,
    signal: "#4fd8ff",
  },
  {
    id: "C",
    name: "Full Assembly",
    line: "The spec sheet, read aloud.",
    reach: 900,
    ctr: 3.5,
    conv: 3.3,
    signal: "#ff9d4f",
  },
]

type Phase = "idle" | "loading" | "success" | "error"
type CheckState = "pending" | "pass" | "fail"

const QA_CHECKS = [
  "Brief present and specific",
  "Audience and channel resolved",
  "Concept selected",
  "Metrics within forecast bounds",
]

export default function MaxQualityChain() {
  const [brief, setBrief] = useState(
    "Muse for a precision hardware studio: launch campaign for a modular measurement instrument."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Session initialised · quality mode on",
    "Baseline metrics pinned",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]
  const briefOk = brief.trim().length >= 12

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 6))
  }

  function generate() {
    if (!briefOk) {
      setPhase("error")
      log("QA FAIL — brief below threshold")
      return
    }
    setPhase("loading")
    log("Pipeline running: brief → direction → concept → QA")
    window.setTimeout(() => {
      setPhase("success")
      log(`QA PASS — concept ${active.id} certified`)
    }, 1700)
  }

  // QA checklist state derived from phase
  const checks: CheckState[] =
    phase === "error"
      ? ["fail", audience ? "pass" : "fail", "pass", "fail"]
      : phase === "success"
        ? ["pass", "pass", "pass", "pass"]
        : phase === "loading"
          ? ["pass", "pass", "pass", "pending"]
          : ([briefOk ? "pass" : "fail", "pass", "pass", "pending"] as CheckState[])

  const seg = (on: boolean) =>
    `border px-2.5 py-1 text-[11px] font-medium tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/70 ${
      on
        ? "border-transparent bg-neutral-100 text-black"
        : "border-neutral-800 bg-transparent text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
    }`

  return (
    <main className="min-h-screen bg-black font-mono text-neutral-200 selection:bg-[#d4ff4f] selection:text-black">
      {/* Command bar */}
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5 sm:px-6">
          <span className="bg-[#d4ff4f] px-1.5 py-0.5 text-[11px] font-black tracking-widest text-black">OX</span>
          <span className="text-[11px] text-neutral-500">
            frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable
          </span>
          <h1 className="ml-auto text-xs font-bold uppercase tracking-[0.25em] text-neutral-300">
            Muse · Campaign Studio
          </h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <section className="space-y-5" aria-label="Campaign pipeline">
          {/* Brief as command input */}
          <div>
            <label htmlFor="q-brief" className="mb-1.5 block text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              &gt; brief_
            </label>
            <textarea
              id="q-brief"
              rows={3}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              className={`w-full resize-none border bg-neutral-950 p-4 text-sm leading-relaxed transition focus:outline-none focus:ring-1 ${
                phase === "error"
                  ? "border-red-600 focus:border-red-400 focus:ring-red-500/50"
                  : "border-neutral-800 focus:border-[#d4ff4f]/60 focus:ring-[#d4ff4f]/30"
              }`}
            />
            {phase === "error" && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                ✗ QA gate: brief must be ≥ 12 characters before the pipeline can run.
              </p>
            )}
          </div>

          {/* Direction segments */}
          {(
            [
              ["audience", audience, AUDIENCES],
              ["channel", channel, CHANNELS],
              ["tone", tone, TONES],
              ["style", style, STYLES],
            ] as const
          ).map(([name, value, opts]) => (
            <fieldset key={name}>
              <legend className="mb-1.5 text-[10px] uppercase tracking-[0.3em] text-neutral-500">{name}</legend>
              <div className="flex flex-wrap gap-1.5">
                {opts.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      if (name === "audience") setAudience(o)
                      if (name === "channel") setChannel(o)
                      if (name === "tone") setTone(o)
                      if (name === "style") setStyle(o)
                      log(`${name} := "${o}"`)
                    }}
                    aria-pressed={value === o}
                    className={seg(value === o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          {/* Preview viewport with HUD */}
          <div className="relative overflow-hidden border border-neutral-800" aria-label="Main creative preview">
            {/* HUD corners */}
            <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#d4ff4f]/60" aria-hidden />
            <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#d4ff4f]/60" aria-hidden />
            <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#d4ff4f]/60" aria-hidden />
            <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#d4ff4f]/60" aria-hidden />

            <div
              key={activeId + phase}
              className="flex min-h-[320px] flex-col items-start justify-center p-8 transition-colors duration-700 sm:min-h-[400px] sm:p-14"
              style={{
                background:
                  phase === "success"
                    ? `radial-gradient(ellipse at 20% 20%, ${active.signal}18, #050505 65%)`
                    : "#050505",
              }}
            >
              {phase === "loading" ? (
                <div className="w-full space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">pipeline running</p>
                  {["brief", "direction", "concept", "qa"].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 text-xs">
                      <span
                        className={`inline-block h-2 w-2 ${
                          i < 3 ? "bg-[#d4ff4f]" : "animate-pulse bg-neutral-600"
                        }`}
                      />
                      <span className={i < 3 ? "text-neutral-300" : "text-neutral-500"}>{step}</span>
                      <span className="h-px flex-1 bg-neutral-800" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.35em]" style={{ color: active.signal }}>
                    concept_{active.id.toLowerCase()} · {tone} · {channel}
                  </p>
                  <h2 className="max-w-xl text-2xl font-bold leading-snug tracking-tight text-white sm:text-4xl">
                    {active.line}
                  </h2>
                  <p className="mt-4 max-w-md text-xs leading-relaxed text-neutral-500">
                    {audience} · {style}
                  </p>
                  {phase === "success" && (
                    <span className="mt-6 inline-block border border-[#d4ff4f]/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#d4ff4f]">
                      ✓ certified output
                    </span>
                  )}
                  {phase === "error" && (
                    <span role="alert" className="mt-6 inline-block border border-red-600/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400">
                      ✗ blocked at qa gate
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Status LED strip */}
            <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-1.5 text-[10px] uppercase tracking-widest text-neutral-500">
              <span>viewport · concept-{active.id.toLowerCase()}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    phase === "success" ? "bg-[#d4ff4f]"
                    : phase === "error" ? "bg-red-500"
                    : phase === "loading" ? "animate-pulse bg-amber-400"
                    : "bg-neutral-600"
                  }`}
                />
                {phase}
              </span>
            </div>
          </div>

          {/* Metrics readout */}
          <dl className="grid grid-cols-3 divide-x divide-neutral-800 border border-neutral-800 text-center">
            {(
              [
                ["reach_k", active.reach.toLocaleString()],
                ["ctr_pct", `${active.ctr.toFixed(1)}%`],
                ["conv_pct", `${active.conv.toFixed(1)}%`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="px-2 py-4 transition-colors hover:bg-neutral-950">
                <dd className="text-xl font-bold tabular-nums text-white sm:text-2xl">{v}</dd>
                <dt className="mt-1 text-[10px] uppercase tracking-[0.25em] text-neutral-500">{k}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* QA side panel */}
        <aside className="space-y-5" aria-label="Quality panel">
          {/* Concept selector */}
          <div className="border border-neutral-800 p-4">
            <h2 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">concepts</h2>
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
                    log(`loaded concept_${c.id.toLowerCase()}`)
                  }}
                  className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/70 ${
                    activeId === c.id ? "border-[#d4ff4f]/60 bg-[#d4ff4f]/5 font-bold" : "border-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.signal }} />
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="tabular-nums text-neutral-500">{c.reach}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QA checklist */}
          <div className="border border-neutral-800 p-4">
            <h2 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">qa checks</h2>
            <ul className="space-y-2 text-xs">
              {QA_CHECKS.map((label, i) => {
                const st = checks[i]
                return (
                  <li key={label} className="flex items-center gap-2.5">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[9px] font-black ${
                        st === "pass" ? "border-[#d4ff4f]/60 bg-[#d4ff4f]/15 text-[#d4ff4f]"
                        : st === "fail" ? "border-red-600/60 bg-red-950/40 text-red-400"
                        : "border-neutral-700 text-neutral-600"
                      }`}
                    >
                      {st === "pass" ? "✓" : st === "fail" ? "✗" : "…"}
                    </span>
                    <span className={st === "fail" ? "text-red-400" : st === "pass" ? "text-neutral-300" : "text-neutral-500"}>
                      {label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="col-span-3 bg-[#d4ff4f] py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f] disabled:cursor-wait disabled:opacity-50"
            >
              {phase === "loading" ? "running…" : "run pipeline"}
            </button>
            <button
              type="button"
              onClick={() => log("state committed to disk")}
              className="col-span-2 border border-neutral-700 py-2 text-xs font-semibold uppercase tracking-wider transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              save
            </button>
            <button
              type="button"
              onClick={() => log("artifact exported (mock)")}
              className="border border-neutral-700 py-2 text-xs font-semibold uppercase tracking-wider transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              export
            </button>
          </div>

          {/* Activity feed */}
          <div className="border border-neutral-800 p-4">
            <h2 className="mb-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">activity</h2>
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-neutral-500">
              {activity.map((a, i) => (
                <li key={`${a}-${i}`} className={`flex gap-2 ${a.startsWith("QA PASS") ? "text-[#d4ff4f]" : a.startsWith("QA FAIL") ? "text-red-400" : ""}`}>
                  <span className="shrink-0 text-neutral-700">›</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
