"use client"

import { useState } from "react"

const AUDIENCES = ["Museum members", "Design students", "Touring visitors"]
const CHANNELS = ["Exhibition guide", "City transit cards", "Member newsletter"]
const TONES = ["Curatorial", "Inviting", "Scholarly"]
const STYLES = ["Bauhaus grid", "Archival print", "Neon vitrine"]

const CONCEPTS = [
  {
    id: "A",
    name: "Primary Structures",
    line: "Form follows the visitor.",
    reach: 380,
    ctr: 3.2,
    conv: 4.2,
    primary: "#1d4ed8",
    secondary: "#dc2626",
    tertiary: "#facc15",
  },
  {
    id: "B",
    name: "Open Stacks",
    line: "Every archive is an invitation.",
    reach: 350,
    ctr: 3.5,
    conv: 3.9,
    primary: "#0f766e",
    secondary: "#b45309",
    tertiary: "#e2e8f0",
  },
  {
    id: "C",
    name: "Night Vitrine",
    line: "The collection stays up late.",
    reach: 410,
    ctr: 2.9,
    conv: 4.6,
    primary: "#6d28d9",
    secondary: "#db2777",
    tertiary: "#22d3ee",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function DesignUxPro() {
  const [brief, setBrief] = useState(
    "Muse for a design museum: plan the season campaign for a retrospective on modular furniture."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Blueprint initialised",
    "Audience layer: Museum members",
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
    log("Drafting elevation…")
    window.setTimeout(() => {
      setPhase("success")
      log(`Sheet ${active.id} stamped`)
    }, 1500)
  }

  const specLabel = "font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-700"
  const seg = (on: boolean) =>
    `border px-2.5 py-1 font-mono text-[11px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
      on ? "border-transparent text-white" : "border-slate-400 bg-white text-slate-600 hover:border-slate-600"
    }`

  return (
    <main
      className="min-h-screen bg-[#f4f5fb] text-slate-900"
      style={{
        backgroundImage:
          "linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Title block like a drawing sheet */}
      <header className="border-b-2 border-indigo-900 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-between gap-x-8 px-4 sm:px-8">
          <div className="flex items-center gap-3 py-3">
            <span className="bg-indigo-900 px-2 py-1 font-mono text-xs font-bold text-white">OX</span>
            <span className={specLabel}>frontend-design + ui-ux-pro-max</span>
          </div>
          <div className="flex items-center gap-6 border-l border-dashed border-indigo-300 py-3 pl-6">
            <div>
              <p className={specLabel}>Project</p>
              <p className="text-sm font-bold">Muse Campaign Studio</p>
            </div>
            <div>
              <p className={specLabel}>Sheet</p>
              <p className="font-mono text-sm font-bold">CS-{active.id}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Drawing area */}
        <section aria-label="Main creative preview" className="space-y-4">
          <div className="relative border-2 border-indigo-900 bg-white shadow-[8px_8px_0_rgba(49,46,129,0.12)]">
            {/* dimension marks */}
            <span className="absolute -left-3 top-1/2 hidden h-16 w-px bg-indigo-400 lg:block" aria-hidden />
            <span className="absolute -top-3 left-1/2 hidden w-16 border-t border-indigo-400 lg:block" aria-hidden />

            {phase === "loading" ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-800" />
                  <span className={`${specLabel} animate-pulse`}>drafting…</span>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[360px] grid-cols-[auto_minmax(0,1fr)] overflow-hidden">
                {/* Bauhaus color column */}
                <div className="w-10 shrink-0 sm:w-14" aria-hidden>
                  <div className="h-1/3 transition-colors duration-500" style={{ background: active.primary }} />
                  <div className="h-1/3 transition-colors duration-500" style={{ background: active.secondary }} />
                  <div className="h-1/3 transition-colors duration-500" style={{ background: active.tertiary }} />
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-10">
                  <div>
                    <p className={`${specLabel} mb-3`}>Exhibit {active.id} — {active.name}</p>
                    <h2 className="max-w-lg text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                      {active.line}
                    </h2>
                    <p className="mt-4 max-w-md font-mono text-xs leading-relaxed text-slate-500">
                      audience: {audience.toLowerCase()}<br />
                      channel: {channel.toLowerCase()} · tone: {tone.toLowerCase()} · style: {style.toLowerCase()}
                    </p>
                  </div>

                  {phase === "success" && (
                    <span className="mt-6 inline-flex w-fit rotate-[-4deg] items-center gap-2 border-2 border-emerald-600 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-emerald-700">
                      ✓ approved for print
                    </span>
                  )}
                  {phase === "error" && (
                    <span role="alert" className="mt-6 inline-flex w-fit items-center gap-2 border-2 border-red-500 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-red-600">
                      ✗ revision required — brief incomplete
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sheet footer */}
            <div className="flex justify-between border-t-2 border-indigo-900 bg-indigo-50/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-indigo-800">
              <span>Muse / campaign studio</span>
              <span>scale 1:1 · rev {phase === "success" ? "B" : "A"}</span>
            </div>
          </div>

          {/* Metrics as a data table strip */}
          <dl className="grid grid-cols-3 divide-x-2 divide-indigo-900 border-2 border-indigo-900 bg-white text-center">
            {(
              [
                ["Reach", active.reach.toLocaleString()],
                ["CTR", `${active.ctr.toFixed(1)}%`],
                ["Conversion", `${active.conv.toFixed(1)}%`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="px-2 py-4 transition-colors hover:bg-indigo-50">
                <dd className="font-mono text-xl font-bold tabular-nums sm:text-2xl">{v}</dd>
                <dt className={`${specLabel} mt-1`}>{k}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Spec panel */}
        <aside aria-label="Specification controls" className="space-y-5 rounded-sm border-2 border-indigo-900 bg-white p-5">
          <fieldset>
            <legend className={`${specLabel} mb-2`}>01 — Brief</legend>
            <textarea
              rows={4}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              aria-label="Campaign brief"
              className="w-full resize-none border border-slate-300 bg-slate-50 p-3 font-mono text-xs leading-relaxed focus:border-indigo-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-700"
            />
          </fieldset>

          {(
            [
              ["02 — Audience", audience, AUDIENCES],
              ["03 — Channel", channel, CHANNELS],
              ["04 — Tone", tone, TONES],
              ["05 — Style", style, STYLES],
            ] as const
          ).map(([label, value, opts]) => (
            <fieldset key={label}>
              <legend className={`${specLabel} mb-2`}>{label}</legend>
              <div className="flex flex-wrap gap-1.5">
                {opts.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      if (label.includes("Audience")) setAudience(o)
                      if (label.includes("Channel")) setChannel(o)
                      if (label.includes("Tone")) setTone(o)
                      if (label.includes("Style")) setStyle(o)
                      log(`${label.slice(5)}: ${o}`)
                    }}
                    className={seg(value === o)}
                    style={value === o ? { background: active.primary } : undefined}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          <fieldset>
            <legend className={`${specLabel} mb-2`}>06 — Concept sheets</legend>
            <div className="space-y-1.5">
              {CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveId(c.id)
                    setPhase("idle")
                    log(`Loaded sheet CS-${c.id}`)
                  }}
                  aria-pressed={activeId === c.id}
                  className={`flex w-full items-center gap-3 border px-3 py-2 text-left font-mono text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 ${
                    activeId === c.id ? "border-indigo-900 bg-indigo-50 font-bold" : "border-slate-300 hover:border-indigo-500"
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0" style={{ background: c.primary }} aria-hidden />
                  <span className="flex-1 truncate">CS-{c.id} · {c.name}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="col-span-3 bg-indigo-900 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 disabled:cursor-wait disabled:opacity-60"
            >
              {phase === "loading" ? "Drafting…" : "Issue sheet"}
            </button>
            <button
              type="button"
              onClick={() => log("Filed to archive")}
              className="col-span-2 border border-slate-300 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider transition hover:border-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => log("Plotted PDF (mock)")}
              className="border border-slate-300 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider transition hover:border-indigo-600 hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
            >
              Export
            </button>
          </div>

          <ul aria-label="Activity" className="space-y-1 border-t border-dashed border-indigo-300 pt-3 font-mono text-[11px] leading-relaxed text-slate-500">
            {activity.map((a, i) => (
              <li key={`${a}-${i}`}>[{String(i + 1).padStart(2, "0")}] {a}</li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  )
}
