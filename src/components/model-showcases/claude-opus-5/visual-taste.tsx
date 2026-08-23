"use client"

import { useState } from "react"
import { Download, Save, SlidersHorizontal, X } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-skill + taste-skill",
  brief:
    "Present Solenne, a single-origin olive oil bottled by harvest date, to cooks who already read wine labels closely.",
  controls: {
    audiences: ["Label readers", "Restaurant buyers", "Gift shoppers"],
    channels: ["Delicatessen", "Food quarterly", "Tasting event"],
    tones: ["Composed", "Vivid", "Understated"],
    styles: ["Harvest green", "Bottle amber", "Marble"],
  },
  concepts: [
    {
      id: "A",
      name: "Picked in November",
      headline: "Bottled eleven hours after it left the tree.",
      sub: "Freshness route anchored on a single number.",
      reach: 358,
      ctr: 5.2,
      conv: 6.0,
    },
    {
      id: "B",
      name: "One Grove",
      headline: "One grove. One press. No blending.",
      sub: "Provenance route in the language of single-vineyard wine.",
      reach: 402,
      ctr: 4.7,
      conv: 5.4,
    },
    {
      id: "C",
      name: "Peppery Finish",
      headline: "It should catch the back of your throat.",
      sub: "Sensory route that teaches the tasting note.",
      reach: 384,
      ctr: 5.0,
      conv: 5.6,
    },
  ],
  activity: ["Poster canvas opened", "Sheet collapsed"],
}

const looks: Record<string, { bg: string; ink: string; accent: string }> = {
  "Harvest green": { bg: "#1d2b1f", ink: "#f2f0e6", accent: "#b9cf6a" },
  "Bottle amber": { bg: "#2a1a08", ink: "#f8efdf", accent: "#e0a44c" },
  Marble: { bg: "#eeece6", ink: "#221f1a", accent: "#7a6a4f" },
}

export default function VisualTaste() {
  const m = useMuse(spec)
  const [sheet, setSheet] = useState(false)
  const look = looks[m.style] ?? looks["Harvest green"]

  return (
    <main
      className="relative min-h-screen transition-colors duration-700"
      style={{ backgroundColor: look.bg, color: look.ink }}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-7 sm:px-10">
        <header className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ backgroundColor: look.accent, color: look.bg }}
          >
            {m.modelName}
          </span>
          <span className="rounded-full border border-current/25 px-2.5 py-1 font-mono text-[10px] opacity-70">
            {m.chain}
          </span>
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-current/30 px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Controls
          </button>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div
            className="h-px w-16 transition-colors duration-700"
            style={{ backgroundColor: look.accent }}
            aria-hidden
          />
          <p className="mt-6 font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">
            {m.concept.id} · {m.concept.name}
          </p>
          <h1 className="mt-6 max-w-2xl font-serif text-[2.5rem] leading-[1.02] font-normal text-balance sm:text-6xl lg:text-[4.5rem]">
            {m.concept.headline}
          </h1>
          <p className="mt-7 max-w-sm text-sm leading-relaxed opacity-70">{m.concept.sub}</p>
          <p className="mt-2 max-w-sm text-xs leading-relaxed opacity-45">
            {m.tone} register, {m.audience.toLowerCase()}, {m.channel.toLowerCase()}.
          </p>

          <div className="mt-12 flex flex-wrap items-end gap-10 border-t border-current/15 pt-7">
            {[
              ["Reach", `${m.metrics.reach}K`],
              ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
              ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45">
                  {label}
                </div>
                <div className="mt-1 font-serif text-3xl tabular-nums sm:text-4xl">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-current/15 pt-5 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            {spec.concepts.map((concept) => {
              const on = m.conceptId === concept.id
              return (
                <button
                  key={concept.id}
                  type="button"
                  onClick={() => m.selectConcept(concept.id)}
                  aria-pressed={on}
                  className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                  style={
                    on
                      ? { backgroundColor: look.accent, color: look.bg }
                      : { border: "1px solid currentColor", opacity: 0.5 }
                  }
                >
                  {concept.id} · {concept.name}
                </button>
              )
            })}
            <span className="ml-auto font-mono text-[10px] opacity-45">
              {m.phase === "loading"
                ? `generating ${m.progress}%`
                : m.phase === "success"
                  ? "forecast ready"
                  : m.phase === "error"
                    ? "brief too short"
                    : `draft r${m.revision}`}
            </span>
          </div>
        </footer>
      </div>
      {sheet ? (
        <div className="fixed inset-0 z-30 flex justify-end">
          <button
            type="button"
            aria-label="Close controls"
            onClick={() => setSheet(false)}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-label="Campaign controls"
            className="relative flex w-full max-w-sm flex-col gap-5 overflow-y-auto p-6 shadow-2xl"
            style={{ backgroundColor: look.bg, color: look.ink }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg">Controls</h2>
              <button
                type="button"
                onClick={() => setSheet(false)}
                aria-label="Close"
                className="rounded-full border border-current/25 p-1.5 transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>

            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">
                Brief
              </span>
              <textarea
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={5}
                className="mt-1.5 w-full resize-y rounded-md border border-current/25 bg-transparent px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-current/60"
              />
            </label>

            {(
              [
                ["audience", "Audience", spec.controls.audiences, m.audience],
                ["channel", "Channel", spec.controls.channels, m.channel],
                ["tone", "Tone", spec.controls.tones, m.tone],
                ["style", "Look", spec.controls.styles, m.style],
              ] as const
            ).map(([key, label, options, value]) => (
              <div key={key}>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">
                  {label}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {options.map((option) => {
                    const on = option === value
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => m.setControl(key, option)}
                        aria-pressed={on}
                        className="rounded-full px-2.5 py-1 text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                        style={
                          on
                            ? { backgroundColor: look.accent, color: look.bg }
                            : { border: "1px solid currentColor", opacity: 0.55 }
                        }
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="mt-auto space-y-2 border-t border-current/15 pt-4">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="w-full rounded-md px-3 py-2.5 text-xs font-bold tracking-[0.16em] uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none disabled:opacity-55"
                style={{ backgroundColor: look.accent, color: look.bg }}
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-current/25 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-current/25 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "rounded-md border border-rose-400/50 px-2.5 py-2 text-[11px] text-rose-300"
                    : "px-0.5 text-[11px] opacity-55"
                }
              >
                {m.phase === "error"
                  ? "Brief needs more substance before a forecast can run."
                  : m.log[0]}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

