"use client"

import { useState } from "react"

const AUDIENCES = ["Perfume loyalists", "Gift shoppers", "Beauty editors"]
const CHANNELS = ["Magazine insert", "Boutique window", "Editor's letter"]
const TONES = ["Poetic", "Assured", "Playful"]
const STYLES = ["Ivory & ink", "Blush wash", "Charcoal line"]

const CONCEPTS = [
  {
    id: "A",
    name: "First Breath",
    line: "Open the bottle. Open the room.",
    reach: 290,
    ctr: 3.1,
    conv: 4.5,
    accent: "#b91c1c",
  },
  {
    id: "B",
    name: "The Long Note",
    line: "Some arrivals refuse to leave.",
    reach: 265,
    ctr: 3.4,
    conv: 4.1,
    accent: "#1f2937",
  },
  {
    id: "C",
    name: "Vapour Study",
    line: "Visible for a moment. Worn all day.",
    reach: 240,
    ctr: 2.8,
    conv: 4.9,
    accent: "#9d174d",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function DesignImpeccable() {
  const [brief, setBrief] = useState(
    "Muse for a niche fragrance house: the launch campaign for a single, uncompromising new scent."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Atelier opened",
    "Muse consulted on register",
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
    log("Composing…")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} composed`)
    }, 1500)
  }

  const smallCaps = "text-[10px] font-semibold uppercase tracking-[0.28em]"
  const linkBtn =
    "text-sm underline decoration-[#b91c1c]/40 underline-offset-4 transition-colors hover:decoration-[#b91c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]/50"

  return (
    <main className="min-h-screen bg-[#faf8f4] text-neutral-900">
      {/* Hairline header */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="border border-neutral-900 px-1.5 py-0.5 text-[11px] font-bold tracking-widest">GLM 5.3 Flash</span>
            <span className={`${smallCaps} text-neutral-400`}>frontend-design + impeccable</span>
          </div>
          <h1 className="font-serif text-lg tracking-tight">Muse — Campaign Studio</h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-14 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left: quiet form */}
        <section aria-label="Campaign setup" className="space-y-9">
          <div>
            <label htmlFor="r-brief" className={`${smallCaps} mb-3 block text-neutral-500`}>
              The brief
            </label>
            <textarea
              id="r-brief"
              rows={4}
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              className="w-full resize-none border-0 border-b border-neutral-300 bg-transparent pb-3 font-serif text-base leading-relaxed italic placeholder:text-neutral-300 focus:border-[#b91c1c] focus:outline-none"
            />
            {phase === "error" && (
              <p role="alert" className="mt-2 text-xs text-[#b91c1c]">A brief this short cannot carry a scent.</p>
            )}
          </div>

          {(
            [
              ["For", audience, AUDIENCES],
              ["Seen in", channel, CHANNELS],
              ["Spoken", tone, TONES],
              ["Dressed in", style, STYLES],
            ] as const
          ).map(([lead, value, opts]) => (
            <fieldset key={lead}>
              <legend className={`${smallCaps} mb-2.5 text-neutral-500`}>{lead}</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {opts.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => {
                      if (lead === "For") setAudience(o)
                      if (lead === "Seen in") setChannel(o)
                      if (lead === "Spoken") setTone(o)
                      if (lead === "Dressed in") setStyle(o)
                      log(`${lead}: ${o}`)
                    }}
                    aria-pressed={value === o}
                    className={`font-serif text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]/60 ${
                      value === o ? "font-semibold text-neutral-900 underline decoration-[#b91c1c] decoration-2 underline-offset-[6px]" : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          {/* Concepts as a table of contents */}
          <nav aria-label="Concepts">
            <h2 className={`${smallCaps} mb-3 text-neutral-500`}>Concepts</h2>
            <ol className="divide-y divide-neutral-200 border-y border-neutral-200">
              {CONCEPTS.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(c.id)
                      setPhase("idle")
                      log(`Turned to ${c.name}`)
                    }}
                    aria-current={activeId === c.id}
                    className={`group flex w-full items-baseline justify-between py-3.5 text-left transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]/50 ${
                      activeId === c.id ? "pl-3" : ""
                    }`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-serif text-xs tabular-nums text-neutral-400">{c.id}</span>
                      <span className={`font-serif text-lg ${activeId === c.id ? "font-semibold italic" : ""}`}>{c.name}</span>
                    </span>
                    <span className={`${smallCaps} text-neutral-400 transition-colors group-hover:text-neutral-600`}>
                      {c.reach} · {c.conv.toFixed(1)}%
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="bg-neutral-900 px-9 py-3 text-sm font-medium tracking-wide text-[#faf8f4] transition hover:bg-[#b91c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
            >
              {phase === "loading" ? "Composing…" : "Compose"}
            </button>
            <button type="button" onClick={() => log("Kept in the folio")} className={linkBtn}>Save</button>
            <button type="button" onClick={() => log("Sent to press (mock)")} className={linkBtn}>Export</button>
          </div>

          {phase === "success" && (
            <p role="status" className="font-serif text-sm italic text-emerald-800">✓ Composed — concept {active.id} rests on the page.</p>
          )}

          <ul aria-label="Activity" className="space-y-1.5 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-400">
            {activity.map((a, i) => (
              <li key={`${a}-${i}`} className="flex gap-3">
                <span className="tabular-nums">{String(activity.length - i).padStart(2, "0")}</span>
                {a}
              </li>
            ))}
          </ul>
        </section>

        {/* Right: the page itself */}
        <section aria-label="Main creative preview" className="lg:pt-6">
          <article
            className="relative bg-white p-9 shadow-[0_24px_60px_-30px_rgba(23,23,23,0.25)] ring-1 ring-neutral-200/70 transition-shadow duration-700 sm:p-14"
          >
            {phase === "loading" ? (
              <div className="flex min-h-[380px] items-center justify-center">
                <span className="h-9 w-9 animate-spin rounded-full border border-neutral-200 border-t-neutral-700" />
              </div>
            ) : (
              <>
                <p className={`${smallCaps} mb-10 flex items-center justify-between`} style={{ color: active.accent }}>
                  <span>Concept {active.id}</span>
                  <span className="text-neutral-300">{style}</span>
                </p>

                <h2 className="font-serif text-4xl leading-[1.15] tracking-tight sm:text-[44px]">
                  {active.line.split(".")[0]}.
                  <br />
                  <span className="italic text-neutral-500">{active.line.split(".")[1]?.trim()}.</span>
                </h2>

                {/* thin rule with accent dot */}
                <div className="my-9 flex items-center gap-3">
                  <span className="h-px flex-1 bg-neutral-200" />
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.accent }} />
                  <span className="h-px w-16 bg-neutral-200" />
                </div>

                <p className="max-w-xs font-serif text-sm leading-relaxed text-neutral-500">
                  For {audience.toLowerCase()}, appearing in {channel.toLowerCase()}, written {tone}.
                </p>

                {/* metrics as footnote row */}
                <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-5 text-center">
                  {(
                    [
                      ["Reach", active.reach.toLocaleString()],
                      ["CTR", `${active.ctr.toFixed(1)}%`],
                      ["Conversion", `${active.conv.toFixed(1)}%`],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k}>
                      <dd className="font-serif text-xl font-semibold tabular-nums">{v}</dd>
                      <dt className={`${smallCaps} mt-1 text-neutral-400`}>{k}</dt>
                    </div>
                  ))}
                </dl>

                {phase === "success" && (
                  <span className="absolute right-6 top-6 rotate-6 border border-emerald-600 px-2.5 py-1 font-serif text-xs italic text-emerald-700">
                    approved
                  </span>
                )}
              </>
            )}
          </article>
        </section>
      </div>
    </main>
  )
}
