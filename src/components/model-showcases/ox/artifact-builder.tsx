"use client"

import { useState } from "react"

const AUDIENCES = ["Indie devs", "Startup teams", "Open-source maintainers"]
const CHANNELS = ["Dev forum thread", "Changelog email", "Conference booth"]
const TONES = ["Direct", "Nerdy", "Understated"]
const STYLES = ["Terminal green", "Blueprint blue", "Paper white"]

const CONCEPTS = [
  {
    id: "A",
    name: "ship-it.md",
    headline: "Campaigns compile on the first try.",
    reach: 730,
    ctr: 4.8,
    conv: 3.3,
    fg: "#4ade80",
  },
  {
    id: "B",
    name: "release-notes.txt",
    headline: "Every launch is a changelog worth reading.",
    reach: 690,
    ctr: 4.2,
    conv: 3.0,
    fg: "#60a5fa",
  },
  {
    id: "C",
    name: "launch.config",
    headline: "Configure once. Resonate everywhere.",
    reach: 810,
    ctr: 3.9,
    conv: 2.7,
    fg: "#facc15",
  },
]

type Phase = "idle" | "loading" | "success" | "error"
type Tab = "preview" | "brief" | "metrics"

export default function ArtifactBuilder() {
  const [brief, setBrief] = useState(
    "Muse for developer tools: launch a CLI-first deploy product to engineers who read changelogs for fun."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [tab, setTab] = useState<Tab>("preview")
  const [phase, setPhase] = useState<Phase>("idle")
  const [console_, setConsole_] = useState<string[]>([
    "$ muse init --studio",
    "✓ workspace ready",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(line: string) {
    setConsole_((p) => [...p, line].slice(-8))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      log("error: brief too short (min 12 chars)")
      return
    }
    setPhase("loading")
    log(`$ muse build --concept ${active.id.toLowerCase()}`)
    window.setTimeout(() => {
      setPhase("success")
      log(`✓ artifact ${active.name} built in 1.4s`)
    }, 1500)
  }

  const tabBtn = (t: Tab) =>
    `px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
      tab === t ? "bg-neutral-800 text-white rounded-md" : "text-neutral-400 hover:text-neutral-200"
    }`

  const optBtn = (on: boolean) =>
    `rounded border px-2.5 py-1 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
      on
        ? "border-emerald-500 bg-emerald-500/15 text-emerald-300"
        : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
    }`

  return (
    <main className="flex min-h-screen flex-col bg-neutral-950 font-mono text-neutral-200">
      {/* Title bar */}
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[11px] font-bold text-black">OX</span>
          <span className="text-[11px] text-neutral-500">frontend-skill + artifacts-builder</span>
        </div>
        <span className="text-xs font-bold tracking-widest text-neutral-400">MUSE://CAMPAIGN-STUDIO</span>
      </header>

      <div className="grid flex-1 gap-0 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        {/* File tree */}
        <nav aria-label="Concept files" className="border-b border-neutral-800 p-3 lg:border-b-0 lg:border-r">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-600">campaign/</p>
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveId(c.id)
                setPhase("idle")
                log(`open campaign/${c.name}`)
              }}
              aria-current={activeId === c.id}
              className={`mb-1 block w-full truncate rounded px-2 py-1.5 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                activeId === c.id ? "bg-neutral-800 text-white" : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              }`}
            >
              <span style={{ color: c.fg }}>{activeId === c.id ? "▾" : "▸"}</span> {c.name}
            </button>
          ))}
          <p className="mt-4 mb-2 text-[10px] uppercase tracking-widest text-neutral-600">config/</p>
          <p className="px-2 text-[11px] leading-relaxed text-neutral-500">
            audience: {audience}<br />
            channel: {channel}<br />
            tone: {tone}<br />
            style: {style}
          </p>
        </nav>

        {/* Editor */}
        <section className="flex min-h-[420px] flex-col" aria-label="Editor">
          <div className="flex items-center gap-1 border-b border-neutral-800 px-3 py-2" role="tablist">
            <button role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")} className={tabBtn("preview")}>preview</button>
            <button role="tab" aria-selected={tab === "brief"} onClick={() => setTab("brief")} className={tabBtn("brief")}>brief.muse</button>
            <button role="tab" aria-selected={tab === "metrics"} onClick={() => setTab("metrics")} className={tabBtn("metrics")}>metrics.json</button>
          </div>

          <div className="flex-1 overflow-auto p-5">
            {tab === "preview" && (
              <div
                className={`flex h-full min-h-[320px] flex-col justify-between rounded-lg border p-6 transition-colors duration-500 ${
                  style === "Terminal green"
                    ? "border-emerald-900 bg-black"
                    : style === "Blueprint blue"
                      ? "border-blue-900 bg-blue-950/40"
                      : "border-neutral-700 bg-neutral-100 !text-neutral-900"
                }`}
              >
                <div>
                  <p className="text-[11px]" style={{ color: phase === "idle" ? active.fg : undefined }}>
                    # concept-{active.id.toLowerCase()} · {tone} · {channel}
                  </p>
                  {phase === "loading" ? (
                    <p className="mt-6 animate-pulse text-xl font-bold">building…</p>
                  ) : phase === "error" ? (
                    <p className="mt-6 text-xl font-bold text-red-400">build failed: brief too short</p>
                  ) : (
                    <h2 className="mt-4 max-w-lg text-2xl font-extrabold leading-snug sm:text-4xl">{active.headline}</h2>
                  )}
                  <p className="mt-3 max-w-md text-xs opacity-70">targeting {audience}</p>
                </div>
                {phase === "success" && (
                  <p className="text-xs" style={{ color: active.fg }}>✓ build succeeded — artifact ready to export</p>
                )}
              </div>
            )}

            {tab === "brief" && (
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (phase === "error") setPhase("idle")
                }}
                rows={8}
                aria-label="Brief source"
                className="w-full resize-none rounded-lg border border-neutral-800 bg-black p-4 text-sm leading-relaxed text-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            )}

            {tab === "metrics" && (
              <pre className="rounded-lg border border-neutral-800 bg-black p-4 text-xs leading-relaxed">
{`{
  "concept": "${active.id}",
  "reach_k": ${active.reach},
  "predicted_ctr": ${active.ctr.toFixed(1)},
  "predicted_conversion": ${active.conv.toFixed(1)},
  "audience": "${audience}",
  "status": "${phase}"
}`}
              </pre>
            )}
          </div>

          {/* Controls row */}
          <div className="space-y-2 border-t border-neutral-800 p-4">
            {(
              [
                ["audience", audience, AUDIENCES],
                ["channel", channel, CHANNELS],
                ["tone", tone, TONES],
                ["style", style, STYLES],
              ] as const
            ).map(([name, value, opts]) => (
              <div key={name} className="flex flex-wrap items-center gap-1.5">
                <span className="w-16 shrink-0 text-[10px] uppercase tracking-widest text-neutral-600">{name}</span>
                {opts.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      if (name === "audience") setAudience(o)
                      if (name === "channel") setChannel(o)
                      if (name === "tone") setTone(o)
                      if (name === "style") setStyle(o)
                      log(`set ${name}="${o}"`)
                    }}
                    className={optBtn(value === o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Console / actions */}
        <aside className="flex flex-col border-t border-neutral-800 lg:border-l lg:border-t-0" aria-label="Console and actions">
          <div className="flex-1 overflow-auto p-3">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-600">console</p>
            <div className="space-y-1 text-[11px] leading-relaxed">
              {console_.map((l, i) => (
                <p key={`${l}-${i}`} className={l.startsWith("error") ? "text-red-400" : l.startsWith("$") ? "text-neutral-300" : "text-emerald-400"}>
                  {l}
                </p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-neutral-800 p-3 lg:grid-cols-1">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="rounded bg-emerald-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-wait disabled:opacity-50"
            >
              {phase === "loading" ? "building…" : "▶ generate"}
            </button>
            <button
              type="button"
              onClick={() => log("✓ saved to workspace")}
              className="rounded border border-neutral-700 px-3 py-2 text-xs font-semibold transition hover:border-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              save
            </button>
            <button
              type="button"
              onClick={() => log("✓ exported bundle.zip (mock)")}
              className="rounded border border-neutral-700 px-3 py-2 text-xs font-semibold transition hover:border-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              export
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}
