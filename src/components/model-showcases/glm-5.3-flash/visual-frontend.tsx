"use client"

import { useState } from "react"

const AUDIENCES = ["Gen-Z festivalgoers", "Commuters", "Audiophile collectors"]
const CHANNELS = ["Cinema pre-roll", "OOH billboards", "Streaming audio"]
const TONES = ["Cinematic", "Playful", "Mysterious"]
const STYLES = ["Neon night", "Analog film", "Monochrome stage"]

const CONCEPTS = [
  {
    id: "A",
    name: "Afterglow",
    line1: "Sound you can",
    line2: "almost touch.",
    reach: 1240,
    ctr: 5.1,
    conv: 3.4,
    bg: "from-fuchsia-600 via-purple-700 to-indigo-950",
    glow: "bg-fuchsia-400/40",
  },
  {
    id: "B",
    name: "Rush Hour Anthem",
    line1: "Turn the commute",
    line2: "into the encore.",
    reach: 1080,
    ctr: 4.4,
    conv: 2.8,
    bg: "from-amber-500 via-orange-700 to-neutral-950",
    glow: "bg-amber-300/40",
  },
  {
    id: "C",
    name: "Blackout Frequency",
    line1: "One signal.",
    line2: "Total darkness.",
    reach: 960,
    ctr: 5.6,
    conv: 3.9,
    bg: "from-emerald-500 via-teal-800 to-black",
    glow: "bg-emerald-300/30",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualFrontend() {
  const [brief, setBrief] = useState(
    "Hero-led launch film for Muse: a flagship over-ear headphone drop aimed at culture-forward listeners."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [panelOpen, setPanelOpen] = useState(false)
  const [activity, setActivity] = useState([
    "Storyboard imported",
    "Audience locked: Gen-Z festivalgoers",
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
    log(`Rendering ${active.name} in ${style}`)
    window.setTimeout(() => setPhase("success"), 1600)
  }

  const sel =
    "rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Full-bleed cinematic preview */}
      <section aria-label="Main creative preview" className="relative">
        <div
          key={activeId}
          className={`relative flex min-h-[62vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${active.bg} transition-all duration-700 sm:min-h-[72vh]`}
        >
          <div className={`pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full blur-3xl ${active.glow}`} />
          <span className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] font-bold tracking-wider text-white/85 backdrop-blur sm:left-6 sm:top-6">
            GLM 5.3 Flash
          </span>
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.15) 3px,rgba(255,255,255,.15) 4px)]" />

          {phase === "loading" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-14 w-14 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="text-sm tracking-widest text-white/80">RENDERING SCENE…</p>
            </div>
          ) : phase === "error" ? (
            <div className="max-w-sm rounded-2xl border border-red-400/50 bg-red-950/60 p-6 text-center backdrop-blur">
              <p className="text-lg font-bold">Render failed</p>
              <p className="mt-1 text-sm text-red-200">The brief is too short to storyboard. Add more detail.</p>
              <button onClick={() => setPhase("idle")} className="mt-4 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-white/85">
                Back to edit
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center px-6 text-center">
              <span className="mb-4 rounded-full border border-white/30 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/80">
                {tone} · {channel}
              </span>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight drop-shadow-2xl sm:text-7xl">
                {active.line1}
                <br />
                <span className="italic">{active.line2}</span>
              </h1>
              <p className="mt-5 max-w-md text-sm text-white/75">{audience} · {style}</p>
              {phase === "success" && (
                <span className="mt-6 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                  ✓ Scene rendered for concept {active.id}
                </span>
              )}
            </div>
          )}

          {/* Overlay metrics */}
          <div className="absolute bottom-4 left-1/2 z-10 flex w-[min(92%,720px)] -translate-x-1/2 justify-between gap-2 rounded-2xl border border-white/15 bg-black/45 px-4 py-3 backdrop-blur-md">
            {(
              [
                ["Reach", `${(active.reach / 1000).toFixed(2)}M`],
                ["CTR", `${active.ctr.toFixed(1)}%`],
                ["Conversion", `${active.conv.toFixed(1)}%`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex-1 text-center">
                <p className="text-base font-bold tabular-nums sm:text-xl">{v}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/55">{k}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept filmstrip */}
        <div className="mx-auto -mt-6 flex max-w-3xl gap-3 px-4 pb-2">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveId(c.id)
                setPhase("idle")
                log(`Cut to concept ${c.id}`)
              }}
              aria-pressed={activeId === c.id}
              className={`group relative flex-1 overflow-hidden rounded-xl border p-3 text-left backdrop-blur transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                activeId === c.id ? `border-white/70 bg-gradient-to-br ${c.bg}` : "border-white/15 bg-white/5"
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest text-white/60">Concept {c.id}</span>
              <span className="block truncate text-sm font-bold group-hover:underline">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Control deck */}
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-6">
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
          className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          Campaign controls
          <span className={`transition-transform duration-300 ${panelOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        <div
          className={`grid overflow-hidden transition-all duration-500 ${
            panelOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 space-y-5 rounded-xl border border-white/15 bg-white/5 p-4">
            <label htmlFor="v-brief" className="block text-[11px] uppercase tracking-widest text-white/50">
              Brief
            </label>
            <textarea
              id="v-brief"
              rows={3}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              className="w-full resize-none rounded-lg border border-white/15 bg-black/40 p-3 text-sm placeholder:text-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {(
              [
                ["Audience", audience, AUDIENCES, setAudience],
                ["Channel", channel, CHANNELS, setChannel],
                ["Tone", tone, TONES, setTone],
                ["Style", style, STYLES, setStyle],
              ] as const
            ).map(([label, value, opts, set]) => (
              <fieldset key={label}>
                <legend className="mb-2 text-[11px] uppercase tracking-widest text-white/50">{label}</legend>
                <div className="flex flex-wrap gap-2">
                  {opts.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        set(o)
                        log(`${label}: ${o}`)
                      }}
                      className={`${sel} ${
                        value === o ? "bg-white text-black" : "border border-white/20 text-white/70 hover:border-white/50"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={generate}
                disabled={phase === "loading"}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-wait disabled:opacity-60"
              >
                {phase === "loading" ? "Rendering…" : "Generate scene"}
              </button>
              <button
                type="button"
                onClick={() => log("Saved to moodboard")}
                className="rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => log("Exported 4K frame (mock)")}
                className="rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Export
              </button>
            </div>

            <ul className="space-y-1.5 border-t border-white/10 pt-3 text-xs text-white/55" aria-label="Activity">
              {activity.map((a, i) => (
                <li key={`${a}-${i}`}>· {a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
