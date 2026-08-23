"use client"

import { useState } from "react"
import { ArrowUpRight, Download, Save, Sparkle } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-design",
  brief:
    "Bring Verdant, a soil-sensor houseplant system, to renters who keep killing plants and blame themselves for it.",
  controls: {
    audiences: ["Serial plant killers", "New homeowners", "Gift buyers"],
    channels: ["Search", "Garden centre", "Creator review"],
    tones: ["Reassuring", "Plain", "Curious"],
    styles: ["Paper & ink", "Botanical plate", "Data sketch"],
  },
  concepts: [
    {
      id: "A",
      name: "Not Your Fault",
      headline: "The plant was never going to tell you.",
      sub: "Blame-removal route that reframes failure as missing information.",
      reach: 402,
      ctr: 4.9,
      conv: 5.5,
    },
    {
      id: "B",
      name: "Read the Soil",
      headline: "Water when the soil says so, not when you remember.",
      sub: "Mechanism route explaining the sensor threshold plainly.",
      reach: 358,
      ctr: 5.4,
      conv: 6.1,
    },
    {
      id: "C",
      name: "Eleven Survivors",
      headline: "Eleven plants. One year. Zero funerals.",
      sub: "Evidence route built on a longitudinal household test.",
      reach: 447,
      ctr: 4.1,
      conv: 4.9,
    },
  ],
  activity: ["Brief drafted", "Three routes framed"],
}

const rationale: Record<string, string[]> = {
  A: [
    "Lead with absolution, not features",
    "Withhold the sensor until paragraph two",
    "Close on a low-commitment first step",
  ],
  B: [
    "Open on the mechanism people can verify",
    "Show a threshold number, not a promise",
    "Let the product do the explaining",
  ],
  C: [
    "Anchor on a countable outcome",
    "Name the duration to earn trust",
    "Keep the tone flat so data carries it",
  ],
}

export default function DesignLogic() {
  const m = useMuse(spec)
  const [showWhy, setShowWhy] = useState(true)

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#1f2418]">
      <div className="mx-auto max-w-[78rem] px-5 py-7 sm:px-10">
        <header className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b-2 border-[#1f2418] pb-3">
          <h2 className="font-serif text-2xl">Muse</h2>
          <span className="bg-[#1f2418] px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-[#fbfaf6] uppercase">
            {m.modelName}
          </span>
          <span className="font-mono text-[11px] text-[#1f2418]/60">{m.chain}</span>
          <span className="ml-auto font-mono text-[11px] text-[#1f2418]/60">
            rev {m.revision} · seed {m.seed}
          </span>
        </header>

        <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.24em] text-[#5c6b3f] uppercase">
              Route {m.concept.id} — {m.concept.name}
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-[2.1rem] leading-[1.06] text-balance sm:text-5xl">
              {m.concept.headline}
            </h1>
            <div className="mt-6 max-w-2xl border-l-2 border-[#5c6b3f] pl-4">
              <p className="text-sm leading-relaxed text-[#1f2418]/75">{m.concept.sub}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#1f2418]/55">
                Written {m.tone.toLowerCase()} for {m.audience.toLowerCase()}, placed on{" "}
                {m.channel.toLowerCase()}, art-directed as {m.style.toLowerCase()}.
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowWhy((value) => !value)}
                aria-expanded={showWhy}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] text-[#5c6b3f] uppercase underline decoration-dotted underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#5c6b3f]/40 focus-visible:outline-none"
              >
                <Sparkle className="size-3" aria-hidden />
                {showWhy ? "Collapse route logic" : "Expand route logic"}
              </button>
              {showWhy ? (
                <ol className="mt-4 max-w-xl space-y-2">
                  {(rationale[m.conceptId] ?? []).map((line, index) => (
                    <li key={line} className="flex gap-3 text-sm">
                      <span className="font-mono text-[11px] text-[#1f2418]/40">
                        0{index + 1}
                      </span>
                      <span className="text-[#1f2418]/80">{line}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>

            <div className="mt-10 grid gap-px overflow-hidden border border-[#1f2418]/25 bg-[#1f2418]/25 sm:grid-cols-3">
              {spec.concepts.map((concept) => {
                const on = m.conceptId === concept.id
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => m.selectConcept(concept.id)}
                    aria-pressed={on}
                    className={
                      on
                        ? "bg-[#1f2418] p-4 text-left text-[#fbfaf6]"
                        : "bg-[#fbfaf6] p-4 text-left transition-colors hover:bg-[#f0eee2] focus-visible:ring-2 focus-visible:ring-[#5c6b3f] focus-visible:outline-none focus-visible:ring-inset"
                    }
                  >
                    <span className="font-serif text-lg">{concept.id}</span>
                    <span className="mt-1 block text-xs font-semibold">{concept.name}</span>
                    <span className="mt-1.5 block text-[11px] leading-snug opacity-70">
                      {concept.sub}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <aside className="space-y-7">
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.22em] text-[#1f2418]/50 uppercase">
                Forecast
              </h3>
              <dl className="mt-3 divide-y divide-[#1f2418]/15 border-y border-[#1f2418]/15">
                {[
                  ["Reach", `${m.metrics.reach}K`],
                  ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                  ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between py-2.5">
                    <dt className="text-xs text-[#1f2418]/65">{label}</dt>
                    <dd className="font-serif text-xl tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <label
                htmlFor="dl-brief"
                className="font-mono text-[10px] tracking-[0.22em] text-[#1f2418]/50 uppercase"
              >
                Brief
              </label>
              <textarea
                id="dl-brief"
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={5}
                className="mt-2 w-full resize-y border border-[#1f2418]/25 bg-transparent px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-[#5c6b3f] focus-visible:ring-2 focus-visible:ring-[#5c6b3f]/25"
              />
            </div>

            <div className="space-y-3">
              {(
                [
                  ["audience", "Audience", spec.controls.audiences, m.audience],
                  ["channel", "Channel", spec.controls.channels, m.channel],
                  ["tone", "Tone", spec.controls.tones, m.tone],
                  ["style", "Style", spec.controls.styles, m.style],
                ] as const
              ).map(([key, label, options, value]) => (
                <div key={key}>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#1f2418]/50 uppercase">
                    {label}
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => m.setControl(key, option)}
                        aria-pressed={option === value}
                        className={
                          option === value
                            ? "border border-[#1f2418] bg-[#1f2418] px-2 py-1 text-[11px] text-[#fbfaf6]"
                            : "border border-[#1f2418]/25 px-2 py-1 text-[11px] text-[#1f2418]/70 transition-colors hover:border-[#1f2418] focus-visible:ring-2 focus-visible:ring-[#5c6b3f]/40 focus-visible:outline-none"
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="inline-flex w-full items-center justify-between gap-2 bg-[#1f2418] px-3 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#fbfaf6] uppercase transition-colors hover:bg-[#5c6b3f] focus-visible:ring-2 focus-visible:ring-[#5c6b3f]/50 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#1f2418]/30 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-[#f0eee2] focus-visible:ring-2 focus-visible:ring-[#5c6b3f]/40 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#1f2418]/30 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-[#f0eee2] focus-visible:ring-2 focus-visible:ring-[#5c6b3f]/40 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "border-l-2 border-rose-600 bg-rose-50 py-1.5 pl-2 text-[11px] text-rose-800"
                    : m.phase === "success"
                      ? "border-l-2 border-[#5c6b3f] bg-[#eef0e2] py-1.5 pl-2 text-[11px] text-[#3c4626]"
                      : "border-l-2 border-[#1f2418]/20 py-1.5 pl-2 text-[11px] text-[#1f2418]/55"
                }
              >
                {m.phase === "error"
                  ? "Brief needs more substance before a forecast can run."
                  : m.phase === "success"
                    ? "Forecast rebuilt for the selected route."
                    : m.phase === "loading"
                      ? "Sampling routes…"
                      : "Draft state. Edit any control to see the hero change."}
              </p>
            </div>

            <div>
              <h3 className="font-mono text-[10px] tracking-[0.22em] text-[#1f2418]/50 uppercase">
                Recent
              </h3>
              <ul className="mt-2 space-y-1.5">
                {m.log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="text-[11px] text-[#1f2418]/60">
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

