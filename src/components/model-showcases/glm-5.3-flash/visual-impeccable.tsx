"use client"

import { useState } from "react"

const AUDIENCES = ["Vinyl collectors", "Hi-fi forum members", "First-time buyers"]
const CHANNELS = ["Forum takeover", "Audio podcast", "Listening-room events"]
const TONES = ["Reverent", "Confident", "Understated"]
const STYLES = ["Studio black", "Valve warm", "Silver face"]

const CONCEPTS = [
  {
    id: "A",
    name: "Needle Drop",
    caption: "One drop. Everything changes.",
    reach: 610,
    ctr: 4.4,
    conv: 3.2,
    tone: "#e7c98a",
  },
  {
    id: "B",
    name: "Signal Path",
    caption: "Nothing between you and the take.",
    reach: 560,
    ctr: 4.0,
    conv: 3.6,
    tone: "#9db8d2",
  },
  {
    id: "C",
    name: "Room Tone",
    caption: "Hear the room disappear.",
    reach: 520,
    ctr: 4.8,
    conv: 2.9,
    tone: "#c9a0b8",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualImpeccable() {
  const [brief, setBrief] = useState(
    "Muse for a high-end turntable maker: a launch campaign that treats listening as an event."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Gallery opened",
    "Audience: Vinyl collectors",
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
    log("Developing print…")
    window.setTimeout(() => {
      setPhase("success")
      log(`Print ${active.id} developed`)
    }, 1500)
  }

  const pill = (on: boolean) =>
    `rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
      on ? "border-white bg-white text-black" : "border-neutral-700 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200"
    }`

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      {/* Minimal chrome */}
      <header className="flex items-center justify-between px-5 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="border border-neutral-600 px-1.5 py-0.5 text-[11px] font-bold tracking-widest">GLM 5.3 Flash</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">frontend-skill + impeccable</span>
        </div>
        <h1 className="text-xs uppercase tracking-[0.35em] text-neutral-400">Muse · Campaign Studio</h1>
      </header>

      {/* Gallery wall */}
      <section aria-label="Main creative preview" className="px-5 sm:px-10">
        <div className="relative mx-auto max-w-4xl">
          {phase === "loading" ? (
            <div className="flex aspect-[16/9] items-center justify-center border border-neutral-800 bg-neutral-950">
              <div className="flex flex-col items-center gap-4">
                <span className="h-10 w-10 animate-spin rounded-full border border-neutral-700 border-t-neutral-300" />
                <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">developing…</span>
              </div>
            </div>
          ) : (
            <figure
              key={activeId}
              className="relative flex aspect-[16/9] flex-col items-center justify-center overflow-hidden border border-neutral-800 transition-colors duration-1000"
              style={{ background: `radial-gradient(ellipse at center, #171310 0%, #000 75%)` }}
            >
              {/* spotlight cone */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-25"
                style={{ background: `conic-gradient(from 180deg at 50% -20%, transparent 40%, ${active.tone}55 50%, transparent 60%)` }}
              />
              {/* vinyl */}
              <div
                className="pointer-events-none absolute right-[12%] top-1/2 hidden h-56 w-56 -translate-y-1/2 animate-[spin_9s_linear_infinite] rounded-full sm:block"
                style={{
                  background: `repeating-radial-gradient(circle at center, #111 0px, #111 3px, #1d1d1d 4px, #111 5px)`,
                  boxShadow: `0 0 80px ${active.tone}22`,
                }}
                aria-hidden
              >
                <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: active.tone }} />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
              </div>

              <figcaption className="relative z-10 max-w-md px-6 text-left sm:text-center">
                <p className="mb-3 text-[10px] uppercase tracking-[0.4em]" style={{ color: active.tone }}>
                  Concept {active.id} · {style}
                </p>
                <blockquote className="text-2xl font-light leading-snug tracking-wide sm:text-4xl">
                  “{active.caption}”
                </blockquote>
                <p className="mt-4 text-xs text-neutral-500">{tone} · {channel} · {audience}</p>
                {phase === "success" && (
                  <span className="mt-5 inline-block border border-emerald-800 bg-emerald-950/60 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                    ✓ Print developed
                  </span>
                )}
                {phase === "error" && (
                  <span role="alert" className="mt-5 inline-block border border-red-900 bg-red-950/60 px-3 py-1 text-[11px] font-semibold text-red-400">
                    ✗ Brief too short to develop
                  </span>
                )}
              </figcaption>
            </figure>
          )}

          {/* Filmstrip selector */}
          <div role="radiogroup" aria-label="Concepts" className="mt-4 grid grid-cols-3 gap-3">
            {CONCEPTS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={activeId === c.id}
                onClick={() => {
                  setActiveId(c.id)
                  setPhase("idle")
                  log(`Mounted print ${c.id}`)
                }}
                className={`group relative overflow-hidden border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  activeId === c.id ? "border-neutral-300 bg-neutral-900" : "border-neutral-800 hover:border-neutral-500"
                }`}
              >
                <span
                  className="mb-2 block h-1 w-full origin-left transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: c.tone, transform: activeId === c.id ? "scaleX(1)" : "scaleX(0.25)" }}
                />
                <span className="block text-[10px] uppercase tracking-[0.25em] text-neutral-500">{c.id}</span>
                <span className="block truncate text-sm font-medium">{c.name}</span>
              </button>
            ))}
          </div>

          {/* Side metrics rail */}
          <dl className="mt-4 grid grid-cols-3 divide-x divide-neutral-800 border border-neutral-800 text-center">
            {(
              [
                ["Reach", active.reach.toLocaleString()],
                ["CTR", `${active.ctr.toFixed(1)}%`],
                ["Conversion", `${active.conv.toFixed(1)}%`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="px-2 py-4 transition-colors hover:bg-neutral-900">
                <dd className="text-xl font-light tabular-nums sm:text-2xl">{v}</dd>
                <dt className="mt-1 text-[10px] uppercase tracking-[0.3em] text-neutral-500">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Darkroom controls */}
      <section aria-label="Controls and actions" className="mx-auto max-w-4xl space-y-5 px-5 py-10 sm:px-10">
        <label htmlFor="d-brief" className="block text-[10px] uppercase tracking-[0.35em] text-neutral-500">
          Brief
        </label>
        <textarea
          id="d-brief"
          rows={2}
          value={brief}
          onChange={(e) => {
            setBrief(e.target.value)
            if (phase === "error") setPhase("idle")
          }}
          className="w-full resize-none border border-neutral-800 bg-neutral-950 p-4 text-sm leading-relaxed placeholder:text-neutral-600 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />

        {(
          [
            ["Audience", audience, AUDIENCES],
            ["Channel", channel, CHANNELS],
            ["Tone", tone, TONES],
            ["Style", style, STYLES],
          ] as const
        ).map(([name, value, opts]) => (
          <fieldset key={name}>
            <legend className="mb-2 text-[10px] uppercase tracking-[0.35em] text-neutral-500">{name}</legend>
            <div className="flex flex-wrap gap-2">
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
                  className={pill(value === o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={generate}
            disabled={phase === "loading"}
            className="bg-white px-8 py-2.5 text-sm font-bold text-black transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-wait disabled:opacity-50"
          >
            {phase === "loading" ? "Developing…" : "Develop"}
          </button>
          <button
            type="button"
            onClick={() => log("Filed to contact sheet")}
            className="border border-neutral-700 px-6 py-2.5 text-sm font-semibold transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => log("Exported TIFF (mock)")}
            className="border border-neutral-700 px-6 py-2.5 text-sm font-semibold transition hover:border-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            Export
          </button>
        </div>

        <ul aria-label="Activity" className="space-y-1 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
          {activity.map((a, i) => (
            <li key={`${a}-${i}`} className="flex gap-2">
              <span className="text-neutral-700">{String(activity.length - i).padStart(2, "0")}</span>
              {a}
            </li>
          ))}
        </ul>
      </section>

      <style>{`@keyframes spin { to { transform: translate(0,-50%) rotate(360deg); } }`}</style>
    </main>
  )
}
