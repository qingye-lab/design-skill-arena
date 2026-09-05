"use client"

import { useState } from "react"

const AUDIENCES = ["Ceramic collectors", "Slow-design readers", "Studio visitors"]
const CHANNELS = ["Gallery mailer", "Craft fair booth", "Journal feature"]
const TONES = ["Contemplative", "Earthy", "Precise"]
const STYLES = ["Raw clay", "Linen field", "Kiln glow"]

const CONCEPTS = [
  {
    id: "A",
    name: "Thrown, Not Made",
    line: "Shaped by hand. Finished by fire.",
    reach: 320,
    ctr: 2.9,
    conv: 4.4,
    clay: "#a15c38",
    wash: "#f3e7dc",
  },
  {
    id: "B",
    name: "The Quiet Glaze",
    line: "Colour that whispers across the table.",
    reach: 295,
    ctr: 3.3,
    conv: 4.0,
    clay: "#5b6650",
    wash: "#e9ece2",
  },
  {
    id: "C",
    name: "Second Firing",
    line: "What the kiln decides, we keep.",
    reach: 270,
    ctr: 2.6,
    conv: 4.8,
    clay: "#6b5b8e",
    wash: "#eae5f0",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function StandardTaste() {
  const [brief, setBrief] = useState(
    "Muse for a small-batch ceramics studio planning its first seasonal collection release."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Collection brief received",
    "Palette drawn from studio glazes",
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
    log("Throwing concept on the wheel")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} fired`)
    }, 1500)
  }

  const word = (on: boolean) =>
    `border-b-2 pb-0.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-800 ${
      on ? "border-stone-900 font-semibold text-stone-900" : "border-transparent text-stone-500 hover:border-stone-400 hover:text-stone-800"
    }`

  return (
    <main className="min-h-screen bg-[#efe9df] text-stone-900">
      {/* Masthead */}
      <header className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-8 gap-y-3 px-5 pt-10 sm:px-10">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="bg-stone-900 px-2 py-0.5 text-xs font-bold tracking-widest text-[#efe9df]">GLM 5.3 Flash</span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500">frontend-app-builder + taste-skill</span>
          </div>
          <h1 className="text-4xl font-black leading-none tracking-tighter sm:text-6xl">
            Muse<span className="align-top text-lg font-medium tracking-normal text-stone-500"> / campaign studio</span>
          </h1>
        </div>
        <p className="max-w-xs pb-1 text-right text-xs leading-relaxed text-stone-500">
          A campaign studio for launches that deserve a slower look.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Left column — sentence-form controls */}
        <section aria-label="Campaign setup" className="space-y-10">
          <div>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">01 · The brief</h2>
            <textarea
              rows={4}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              aria-label="Campaign brief"
              className="w-full resize-none border-l-2 border-stone-900 bg-transparent pl-4 text-base italic leading-relaxed focus:border-stone-500 focus:outline-none"
            />
            {phase === "error" && (
              <p role="alert" className="mt-2 pl-4 text-sm text-red-800">The brief is a fragment. Finish the thought.</p>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">02 · The direction</h2>
            {(
              [
                ["We are speaking to", audience, AUDIENCES],
                ["through", channel, CHANNELS],
                ["in a", tone, TONES],
                ["voice, dressed in", style, STYLES],
              ] as const
            ).map(([lead, value, opts]) => (
              <fieldset key={lead}>
                <legend className="mb-2 text-sm text-stone-600">{lead}</legend>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pl-1">
                  {opts.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        if (lead.includes("speaking")) setAudience(o)
                        else if (lead === "through") setChannel(o)
                        else if (lead.includes("voice")) setTone(o)
                        else setStyle(o)
                        log(`${lead.trim()}: ${o}`)
                      }}
                      className={word(value === o)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">03 · The concepts</h2>
            <ul className="divide-y divide-stone-300/70 border-y border-stone-300/70">
              {CONCEPTS.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(c.id)
                      setPhase("idle")
                      log(`Turned to ${c.name}`)
                    }}
                    aria-pressed={activeId === c.id}
                    className={`group flex w-full items-baseline justify-between gap-4 py-4 text-left transition-colors hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 ${
                      activeId === c.id ? "bg-white/60" : ""
                    }`}
                  >
                    <span>
                      <span className="mr-3 text-xs font-bold tabular-nums text-stone-400">{c.id}</span>
                      <span className={`text-lg ${activeId === c.id ? "font-bold underline decoration-2 underline-offset-4" : ""}`}>
                        {c.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs tabular-nums text-stone-500">{c.reach} reach</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="bg-stone-900 px-8 py-3 text-sm font-bold tracking-wide text-[#efe9df] transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
            >
              {phase === "loading" ? "Firing…" : "Fire the kiln"}
            </button>
            <button
              type="button"
              onClick={() => log("Placed in the archive")}
              className="text-sm font-semibold underline underline-offset-4 hover:text-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => log("Wrapped for delivery (mock)")}
              className="text-sm font-semibold underline underline-offset-4 hover:text-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-800"
            >
              Export
            </button>
          </div>

          {phase === "success" && (
            <p role="status" className="text-sm font-medium text-emerald-900">✓ Out of the kiln — concept {active.id} is ready.</p>
          )}

          <ul aria-label="Activity" className="space-y-1 border-t border-stone-300/70 pt-4 text-xs text-stone-500">
            {activity.map((a, i) => (
              <li key={`${a}-${i}`}>{i === 0 ? "● " : "○ "}{a}</li>
            ))}
          </ul>
        </section>

        {/* Right column — offset editorial preview */}
        <section aria-label="Main creative preview" className="lg:pt-16">
          <div
            className="relative p-8 shadow-[10px_10px_0_rgba(87,74,58,0.18)] transition-colors duration-700 sm:p-14"
            style={{ background: active.wash }}
          >
            {phase === "loading" ? (
              <div className="flex min-h-[340px] items-center justify-center">
                <span className="h-12 w-12 animate-spin rounded-full border-4 border-stone-300 border-t-stone-700" />
              </div>
            ) : (
              <>
                <p className="mb-8 flex justify-between text-[11px] uppercase tracking-[0.3em]" style={{ color: active.clay }}>
                  <span>Concept {active.id}</span>
                  <span>{style}</span>
                </p>
                <h2 className="max-w-md text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl" style={{ color: "#2d2620" }}>
                  {active.line}
                </h2>
                <div className="mt-10 flex items-end gap-6">
                  <div className="h-28 w-28 shrink-0 rounded-full sm:h-36 sm:w-36" style={{ background: `radial-gradient(circle at 35% 30%, ${active.clay}, #2d2620)` }} />
                  <p className="max-w-[180px] text-xs leading-relaxed text-stone-600">
                    For {audience.toLowerCase()}, placed in {channel.toLowerCase()}.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Metrics strip */}
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-stone-300/70 text-center ring-1 ring-stone-300/70">
            {(
              [
                ["Reach", active.reach.toLocaleString()],
                ["CTR", `${active.ctr.toFixed(1)}%`],
                ["Conversion", `${active.conv.toFixed(1)}%`],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="bg-[#efe9df] px-2 py-4">
                <dd className="text-xl font-black tabular-nums sm:text-2xl">{v}</dd>
                <dt className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-stone-500">{k}</dt>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  )
}
