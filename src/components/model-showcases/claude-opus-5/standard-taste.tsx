"use client"

import { useState } from "react"
import { Columns2, Download, Save } from "lucide-react"

import { useMuse, type MuseSpec, type ConceptId } from "./core"

const spec: MuseSpec = {
  chain: "frontend-app-builder + taste-skill",
  brief:
    "Take Marrow, a bone-broth subscription, to people cooking for someone recovering from illness or surgery.",
  controls: {
    audiences: ["Carers at home", "Post-op patients", "Clinic dietitians"],
    channels: ["Pharmacy leaflet", "Care forum", "Direct mail"],
    tones: ["Gentle", "Clinical", "Practical"],
    styles: ["Warm stone", "Clean clinical", "Kitchen table"],
  },
  concepts: [
    {
      id: "A",
      name: "Something Warm",
      headline: "When cooking is the last thing they can manage.",
      sub: "Care route written to the person doing the feeding.",
      reach: 366,
      ctr: 5.0,
      conv: 6.1,
    },
    {
      id: "B",
      name: "Twelve Hours",
      headline: "Simmered twelve hours so nobody has to.",
      sub: "Craft route trading on the process it replaces.",
      reach: 412,
      ctr: 4.5,
      conv: 5.2,
    },
    {
      id: "C",
      name: "Grams of Protein",
      headline: "Nine grams of protein in a cup they'll finish.",
      sub: "Nutrition route pitched at clinical referral.",
      reach: 328,
      ctr: 5.6,
      conv: 6.4,
    },
  ],
  activity: ["Two-up comparison opened", "Route A pinned left"],
}

export default function StandardTaste() {
  const m = useMuse(spec)
  const [compareId, setCompareId] = useState<ConceptId>("B")
  const compare = spec.concepts.find((item) => item.id === compareId) ?? spec.concepts[1]
  const delta = (a: number, b: number) => {
    const diff = Math.round((a - b) * 10) / 10
    return diff > 0 ? `+${diff}` : `${diff}`
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#26221d]">
      <div className="mx-auto max-w-[80rem] px-5 py-7 sm:px-9">
        <header className="flex flex-wrap items-center gap-2.5">
          <span className="font-serif text-xl">Muse</span>
          <span className="rounded-sm bg-[#26221d] px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#f6f3ee] uppercase">
            {m.modelName}
          </span>
          <span className="rounded-sm border border-[#26221d]/25 px-2 py-1 font-mono text-[10px] text-[#26221d]/65">
            {m.chain}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#26221d]/55">
            <Columns2 className="size-3.5" aria-hidden />
            Two-up comparison
          </span>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border-2 border-[#26221d] bg-white p-5 sm:p-7">
                <p className="font-mono text-[10px] tracking-[0.22em] text-[#a0522d] uppercase">
                  Selected · Route {m.concept.id}
                </p>
                <h1 className="mt-3 font-serif text-2xl leading-[1.08] text-balance sm:text-4xl">
                  {m.concept.headline}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-[#26221d]/70">{m.concept.sub}</p>
                <p className="mt-2 text-xs text-[#26221d]/50">
                  {m.tone} · {m.audience} · {m.channel} · {m.style}
                </p>
                <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[#26221d]/15 pt-4">
                  {[
                    ["Reach", `${m.metrics.reach}K`],
                    ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                    ["Conv", `${m.metrics.conv.toFixed(1)}%`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-mono text-[10px] tracking-wider text-[#26221d]/45 uppercase">
                        {label}
                      </dt>
                      <dd className="font-serif text-2xl tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>

              <article className="rounded-lg border border-dashed border-[#26221d]/35 bg-[#f6f3ee] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-[#26221d]/50 uppercase">
                    Against
                  </p>
                  <label className="text-[11px]">
                    <span className="sr-only">Comparison route</span>
                    <select
                      value={compareId}
                      onChange={(event) => setCompareId(event.target.value as ConceptId)}
                      className="rounded-sm border border-[#26221d]/25 bg-transparent px-1.5 py-1 text-[11px] outline-none focus-visible:border-[#26221d]"
                    >
                      {spec.concepts.map((concept) => (
                        <option key={concept.id} value={concept.id}>
                          Route {concept.id}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <h2 className="mt-3 font-serif text-xl leading-tight text-[#26221d]/70 text-balance sm:text-2xl">
                  {compare.headline}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#26221d]/55">{compare.sub}</p>
                <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[#26221d]/15 pt-4">
                  {[
                    ["Reach", delta(m.metrics.reach, compare.reach), "K"],
                    ["CTR", delta(m.metrics.ctr, compare.ctr), "pt"],
                    ["Conv", delta(m.metrics.conv, compare.conv), "pt"],
                  ].map(([label, value, unit]) => (
                    <div key={label}>
                      <dt className="font-mono text-[10px] tracking-wider text-[#26221d]/45 uppercase">
                        {label}
                      </dt>
                      <dd
                        className={
                          value.startsWith("+")
                            ? "font-mono text-lg text-[#3f6212] tabular-nums"
                            : "font-mono text-lg text-[#9f1239] tabular-nums"
                        }
                      >
                        {value}
                        {unit}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#26221d]/45 uppercase">
                Select
              </span>
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
                        ? "rounded-sm bg-[#26221d] px-3 py-1.5 text-[11px] font-semibold text-[#f6f3ee]"
                        : "rounded-sm border border-[#26221d]/25 px-3 py-1.5 text-[11px] font-semibold text-[#26221d]/70 transition-colors hover:border-[#26221d] hover:bg-white focus-visible:ring-2 focus-visible:ring-[#a0522d]/40 focus-visible:outline-none"
                    }
                  >
                    {concept.id} · {concept.name}
                  </button>
                )
              })}
            </div>

            <p
              role="status"
              className={
                m.phase === "error"
                  ? "rounded-sm border-l-4 border-[#9f1239] bg-white px-3 py-2 text-xs text-[#9f1239]"
                  : m.phase === "success"
                    ? "rounded-sm border-l-4 border-[#3f6212] bg-white px-3 py-2 text-xs text-[#3f6212]"
                    : "rounded-sm border-l-4 border-[#26221d]/20 bg-white px-3 py-2 text-xs text-[#26221d]/60"
              }
            >
              {m.phase === "error"
                ? "Brief needs more substance before a forecast can run."
                : m.phase === "success"
                  ? "Forecast rebuilt. Deltas recalculated against the comparison route."
                  : m.phase === "loading"
                    ? `Sampling routes… ${m.progress}%`
                    : "Draft state. Both panels react to control changes."}
            </p>
          </div>
          <aside className="space-y-5">
            <div>
              <label
                htmlFor="st-brief"
                className="font-mono text-[10px] tracking-[0.2em] text-[#26221d]/45 uppercase"
              >
                Brief
              </label>
              <textarea
                id="st-brief"
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={5}
                className="mt-1.5 w-full resize-y rounded-sm border border-[#26221d]/25 bg-white px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-[#a0522d] focus-visible:ring-2 focus-visible:ring-[#a0522d]/20"
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
                <label key={key} className="block">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#26221d]/45 uppercase">
                    {label}
                  </span>
                  <select
                    value={value}
                    onChange={(event) => m.setControl(key, event.target.value)}
                    className="mt-1.5 w-full rounded-sm border border-[#26221d]/25 bg-white px-2.5 py-1.5 text-xs outline-none hover:border-[#26221d]/50 focus-visible:border-[#a0522d]"
                  >
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="w-full rounded-sm bg-[#a0522d] px-3 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#8a4526] focus-visible:ring-2 focus-visible:ring-[#a0522d]/40 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#26221d]/25 bg-white px-2 py-2 text-[11px] font-semibold transition-colors hover:border-[#26221d] focus-visible:ring-2 focus-visible:ring-[#a0522d]/30 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-[#26221d]/25 bg-white px-2 py-2 text-[11px] font-semibold transition-colors hover:border-[#26221d] focus-visible:ring-2 focus-visible:ring-[#a0522d]/30 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[10px] tracking-[0.2em] text-[#26221d]/45 uppercase">
                Recent
              </h2>
              <ul className="mt-2 space-y-1.5">
                {m.log.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="border-b border-[#26221d]/10 pb-1.5 text-[11px] text-[#26221d]/60"
                  >
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

