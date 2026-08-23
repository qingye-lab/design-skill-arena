"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Download, Save } from "lucide-react"

import { useMuse, type MuseSpec, type ConceptId } from "./core"

const spec: MuseSpec = {
  chain: "frontend-skill + taste-skill + impeccable",
  brief:
    "Unveil Aubade, a linen bedding range woven in a single mill, to people who buy bedding once a decade and want it right.",
  controls: {
    audiences: ["Once-a-decade buyers", "Hotel procurement", "New parents"],
    channels: ["Interiors magazine", "Showroom", "Long-form email"],
    tones: ["Assured", "Sensory", "Spare"],
    styles: ["Chalk white", "Flax", "Slate blue"],
  },
  concepts: [
    {
      id: "A",
      name: "Softer by Winter",
      headline: "It gets better every time you wash it.",
      sub: "Time route promising improvement instead of decay.",
      reach: 372,
      ctr: 5.0,
      conv: 5.8,
    },
    {
      id: "B",
      name: "One Mill",
      headline: "One mill in Kortrijk. One weave. No substitutes.",
      sub: "Provenance route naming the single source.",
      reach: 414,
      ctr: 4.6,
      conv: 5.2,
    },
    {
      id: "C",
      name: "Cool at Four",
      headline: "Still cool at four in the morning.",
      sub: "Sensory route built on a single nocturnal detail.",
      reach: 396,
      ctr: 5.2,
      conv: 6.0,
    },
  ],
  activity: ["Spread opened", "Folio set to I"],
}

const folio: Record<ConceptId, string> = { A: "I", B: "II", C: "III" }

const shade: Record<string, { paper: string; ink: string; rule: string }> = {
  "Chalk white": { paper: "#fcfbf8", ink: "#22201c", rule: "#c9c4b8" },
  Flax: { paper: "#f3ece0", ink: "#2c2621", rule: "#cbbca4" },
  "Slate blue": { paper: "#eceff3", ink: "#1e2733", rule: "#a9b6c6" },
}

export default function VisualPremiumChain() {
  const m = useMuse(spec)
  const [briefOpen, setBriefOpen] = useState(false)
  const s = shade[m.style] ?? shade["Chalk white"]
  const order: ConceptId[] = ["A", "B", "C"]
  const index = order.indexOf(m.conceptId)

  const step = (direction: -1 | 1) => {
    const next = order[(index + direction + order.length) % order.length]
    m.selectConcept(next)
  }

  return (
    <main
      className="min-h-screen transition-colors duration-700"
      style={{ backgroundColor: s.paper, color: s.ink }}
    >
      <div className="mx-auto max-w-[84rem] px-6 py-7 sm:px-12">
        <header
          className="flex flex-wrap items-center gap-2 border-b pb-4"
          style={{ borderColor: s.rule }}
        >
          <span className="font-serif text-lg tracking-tight">Muse</span>
          <span
            className="rounded-sm px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ backgroundColor: s.ink, color: s.paper }}
          >
            {m.modelName}
          </span>
          <span
            className="rounded-sm border px-2 py-0.5 font-mono text-[10px] opacity-65"
            style={{ borderColor: s.rule }}
          >
            {m.chain}
          </span>
          <span className="ml-auto font-serif text-2xl opacity-30">{folio[m.conceptId]}</span>
        </header>

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <section className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-50">
              {m.concept.name}
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-[2.4rem] leading-[1.0] font-normal text-balance sm:text-6xl">
              {m.concept.headline}
            </h1>
            <div
              className="mt-8 max-w-xl border-t pt-6 sm:columns-2 sm:gap-8"
              style={{ borderColor: s.rule }}
            >
              <p className="text-sm leading-relaxed opacity-70">{m.concept.sub}</p>
              <p className="mt-3 text-sm leading-relaxed opacity-50 sm:mt-0">
                Voiced {m.tone.toLowerCase()} for {m.audience.toLowerCase()}. Placed in{" "}
                {m.channel.toLowerCase()}, printed on {m.style.toLowerCase()}.
              </p>
            </div>

            <div className="mt-9 flex items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous route"
                className="rounded-full border p-2 transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                style={{ borderColor: s.rule }}
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Routes">
                {order.map((id) => {
                  const on = id === m.conceptId
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => m.selectConcept(id)}
                      className="h-1 flex-1 transition-all duration-500 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                      style={{ backgroundColor: on ? s.ink : s.rule }}
                    >
                      <span className="sr-only">Route {id}</span>
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next route"
                className="rounded-full border p-2 transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                style={{ borderColor: s.rule }}
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {spec.concepts.map((concept) => {
                const on = m.conceptId === concept.id
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => m.selectConcept(concept.id)}
                    aria-pressed={on}
                    className="border-t pt-3 text-left transition-opacity focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                    style={{
                      borderColor: on ? s.ink : s.rule,
                      opacity: on ? 1 : 0.55,
                      borderTopWidth: on ? 2 : 1,
                    }}
                  >
                    <span className="font-serif text-lg">{folio[concept.id]}</span>
                    <span className="mt-1 block text-xs font-semibold">{concept.name}</span>
                    <span className="mt-1 block text-[11px] leading-snug opacity-70">
                      {concept.sub}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
          <aside className="space-y-7">
            <div>
              <h2 className="font-mono text-[10px] tracking-[0.24em] uppercase opacity-45">
                Forecast
              </h2>
              <dl className="mt-4 space-y-3">
                {[
                  ["Reach", `${m.metrics.reach}K`],
                  ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                  ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between border-b pb-2"
                    style={{ borderColor: s.rule }}
                  >
                    <dt className="text-xs opacity-55">{label}</dt>
                    <dd className="font-serif text-2xl tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setBriefOpen((value) => !value)}
                aria-expanded={briefOpen}
                className="font-mono text-[10px] tracking-[0.24em] uppercase opacity-45 underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
              >
                {briefOpen ? "Close brief" : "Edit brief"}
              </button>
              {briefOpen ? (
                <textarea
                  value={m.brief}
                  onChange={(event) => m.setBrief(event.target.value)}
                  rows={5}
                  className="mt-3 w-full resize-y border bg-transparent px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-current"
                  style={{ borderColor: s.rule }}
                />
              ) : (
                <p className="mt-3 text-xs leading-relaxed opacity-55">{m.brief}</p>
              )}
            </div>

            <div className="space-y-4">
              {(
                [
                  ["audience", "Audience", spec.controls.audiences, m.audience],
                  ["channel", "Channel", spec.controls.channels, m.channel],
                  ["tone", "Tone", spec.controls.tones, m.tone],
                  ["style", "Stock", spec.controls.styles, m.style],
                ] as const
              ).map(([key, label, options, value]) => (
                <div key={key}>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-45">
                    {label}
                  </span>
                  <div className="mt-1.5 flex flex-col gap-0.5">
                    {options.map((option) => {
                      const on = option === value
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => m.setControl(key, option)}
                          aria-pressed={on}
                          className={
                            on
                              ? "text-left text-sm font-medium"
                              : "text-left text-sm opacity-45 transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                          }
                        >
                          {on ? "— " : "  "}
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-5" style={{ borderColor: s.rule }}>
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="w-full px-3 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none disabled:opacity-50"
                style={{ backgroundColor: s.ink, color: s.paper }}
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 border px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                  style={{ borderColor: s.rule }}
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 border px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                  style={{ borderColor: s.rule }}
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "border-l-2 border-rose-700 pl-2 text-[11px] text-rose-800"
                    : m.phase === "success"
                      ? "border-l-2 border-emerald-700 pl-2 text-[11px] text-emerald-800"
                      : "text-[11px] opacity-50"
                }
              >
                {m.phase === "error"
                  ? "Brief needs more substance before a forecast can run."
                  : m.phase === "success"
                    ? "Forecast rebuilt for this folio."
                    : m.phase === "loading"
                      ? "Sampling routes."
                      : m.log[0]}
              </p>
            </div>

            <div>
              <h2 className="font-mono text-[10px] tracking-[0.24em] uppercase opacity-45">
                Recent
              </h2>
              <ul className="mt-2 space-y-1">
                {m.log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="text-[11px] opacity-55">
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

