"use client"

import { useState } from "react"

const AUDIENCES = ["Balcony gardeners", "Allotment clubs", "Plant-shop browsers"]
const CHANNELS = ["Garden centre windows", "Sunday paper", "Seed-packet inserts"]
const TONES = ["Sunny", "Grounded", "Whimsical"]
const STYLES = ["Botanical plate", "Watercolour bed", "Seed catalogue"]

const CONCEPTS = [
  {
    id: "A",
    name: "Windowsill Harvest",
    line: "Dinner starts on the sill.",
    reach: 460,
    ctr: 3.4,
    conv: 3.7,
    leaf: "#4d7c0f",
    petal: "#fbbf24",
    wash: "#fefce8",
  },
  {
    id: "B",
    name: "The Long Row",
    line: "Plant a row. Pick all summer.",
    reach: 430,
    ctr: 3.1,
    conv: 4.0,
    leaf: "#166534",
    petal: "#f472b6",
    wash: "#f0fdf4",
  },
  {
    id: "C",
    name: "Volunteer Bloom",
    line: "The best gardens plan a little.",
    reach: 400,
    ctr: 3.6,
    conv: 3.3,
    leaf: "#0e7490",
    petal: "#a78bfa",
    wash: "#ecfeff",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualTaste() {
  const [brief, setBrief] = useState(
    "Muse for a heritage seed company: a spring launch that makes growing feel generous, not daunting."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Seed catalogue opened",
    "Season set: spring",
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
    log("Sowing concept…")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} sprouted`)
    }, 1500)
  }

  const tag = (on: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
      on ? "border-transparent text-white shadow-sm" : "border-stone-300 bg-white/80 text-stone-600 hover:border-stone-500"
    }`

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf6ee] text-stone-900">
      {/* Scattered header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-8 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-bold tracking-widest text-[#faf6ee]">OX</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500">frontend-skill + taste-skill</span>
        </div>
        <h1 className="font-serif text-lg italic sm:text-xl">Muse · Campaign Studio</h1>
      </header>

      {/* Collage canvas */}
      <section aria-label="Main creative preview" className="relative mx-auto max-w-6xl px-5 py-10 sm:px-10">
        {phase === "loading" ? (
          <div className="flex min-h-[380px] items-center justify-center rounded-[2rem] border border-dashed border-stone-300">
            <div className="flex flex-col items-center gap-3">
              <span className="h-12 w-12 animate-spin rounded-full border-4 border-lime-200 border-t-lime-700" />
              <p className="font-serif italic text-stone-500">germinating…</p>
            </div>
          </div>
        ) : (
          <div
            className="relative min-h-[380px] rounded-[2rem] p-7 shadow-[0_18px_40px_-18px_rgba(68,63,50,0.35)] transition-colors duration-700 sm:min-h-[440px] sm:p-12"
            style={{ background: active.wash }}
          >
            {/* decorative leaves */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 rotate-[-20deg] opacity-70" fill={active.leaf}>
              <path d="M50 5 C20 30 15 65 50 95 C85 65 80 30 50 5 Z M50 15 L50 88" stroke="#faf6ee" strokeWidth="2" />
            </svg>

            <span
              className="absolute right-6 top-6 rounded-full px-4 py-1.5 font-serif text-sm italic text-white shadow-md sm:right-10 sm:top-10"
              style={{ background: active.leaf }}
            >
              Concept {active.id}
            </span>

            <h2 className="max-w-lg pt-16 font-serif text-4xl leading-tight sm:pt-20 sm:text-6xl" style={{ color: "#292524" }}>
              {active.line}
            </h2>

            {/* floating chips over canvas */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[tone, channel, audience].map((t) => (
                <span key={t} className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-stone-600 shadow-sm backdrop-blur">
                  {t}
                </span>
              ))}
            </div>

            {/* bloom */}
            <div
              className="absolute bottom-8 right-8 h-28 w-28 rounded-full transition-all duration-700 sm:h-36 sm:w-36"
              style={{ background: `radial-gradient(circle at 32% 30%, ${active.petal}, ${active.leaf})`, boxShadow: `0 14px 30px -10px ${active.leaf}66` }}
            />

            {phase === "success" && (
              <span className="absolute bottom-10 left-7 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-md sm:left-12">
                ✓ In bloom — ready to review
              </span>
            )}
            {phase === "error" && (
              <span role="alert" className="absolute bottom-10 left-7 rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold text-red-800 shadow-md">
                ✗ The brief needs more soil (detail)
              </span>
            )}
          </div>
        )}

        {/* Metrics as pressed-flower cards */}
        <dl className="mx-auto mt-6 grid max-w-2xl grid-cols-3 gap-3">
          {(
            [
              ["Reach", active.reach.toLocaleString()],
              ["CTR", `${active.ctr.toFixed(1)}%`],
              ["Conversion", `${active.conv.toFixed(1)}%`],
            ] as const
          ).map(([k, v], i) => (
            <div
              key={k}
              className={`bg-white px-3 py-4 text-center shadow-md transition-transform hover:-translate-y-1 ${
                i === 1 ? "-rotate-1 rounded-tr-2xl rounded-bl-2xl" : i === 2 ? "rotate-1 rounded-tl-2xl rounded-br-2xl" : "-rotate-2 rounded-br-2xl rounded-tl-2xl"
              }`}
            >
              <dd className="font-serif text-2xl font-black tabular-nums">{v}</dd>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-stone-400">{k}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Garden-bed controls */}
      <section aria-label="Controls and actions" className="mx-auto max-w-6xl space-y-6 px-5 pb-16 sm:px-10">
        <label htmlFor="g-brief" className="block font-serif text-sm italic text-stone-500">
          The brief — what are we planting?
        </label>
        <textarea
          id="g-brief"
          rows={2}
          value={brief}
          onChange={(e) => {
            setBrief(e.target.value)
            if (phase === "error") setPhase("idle")
          }}
          className="w-full resize-none rounded-2xl border border-stone-200 bg-white/70 p-4 font-serif text-base italic leading-relaxed focus:border-lime-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-200"
        />

        {(
          [
            ["Speaking to", audience, AUDIENCES],
            ["Placed in", channel, CHANNELS],
            ["With a", tone, TONES],
            ["tone, drawn in", style, STYLES],
          ] as const
        ).map(([lead, value, opts]) => (
          <fieldset key={lead}>
            <legend className="mb-2 font-serif text-sm italic text-stone-500">{lead}</legend>
            <div className="flex flex-wrap gap-2">
              {opts.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    if (lead.includes("Speaking")) setAudience(o)
                    else if (lead.includes("Placed")) setChannel(o)
                    else if (lead.includes("tone")) setTone(o)
                    else setStyle(o)
                    log(`${lead}: ${o}`)
                  }}
                  className={tag(value === o)}
                  style={value === o ? { background: active.leaf } : undefined}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        {/* Concept seed packets */}
        <div role="radiogroup" aria-label="Concepts" className="grid grid-cols-3 gap-3">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={activeId === c.id}
              onClick={() => {
                setActiveId(c.id)
                setPhase("idle")
                log(`Picked packet ${c.id}`)
              }}
              className={`group relative overflow-hidden rounded-xl border-2 bg-white p-3 text-left transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-600 ${
                activeId === c.id ? "border-lime-700 shadow-md" : "border-stone-200"
              }`}
            >
              <span className="mb-2 block h-2 w-8 rounded-full" style={{ background: c.petal }} />
              <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400">Packet {c.id}</span>
              <span className="block truncate font-serif text-sm font-bold">{c.name}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={phase === "loading"}
            className="rounded-full bg-stone-900 px-8 py-3 text-sm font-bold text-[#faf6ee] transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {phase === "loading" ? "Sowing…" : "Sow the campaign"}
          </button>
          <button
            type="button"
            onClick={() => log("Pressed into the journal")}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold transition hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => log("Bundled for market (mock)")}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold transition hover:border-stone-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
          >
            Export
          </button>
        </div>

        <ul aria-label="Activity" className="space-y-1 border-t border-dashed border-stone-300 pt-4 font-serif text-xs italic text-stone-500">
          {activity.map((a, i) => (
            <li key={`${a}-${i}`}>❧ {a}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
