"use client"

import { useState } from "react"
import { Download, Save, Scale } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-app-builder + taste-skill + impeccable",
  brief:
    "Take Havlin, a shared-ownership tool library, to households who buy a drill once and use it for twenty minutes.",
  controls: {
    audiences: ["One-off DIYers", "Flat renters", "Community groups"],
    channels: ["Library noticeboard", "Neighbourhood app", "Council partnership"],
    tones: ["Neighbourly", "Pragmatic", "Bright"],
    styles: ["Workshop yellow", "Blueprint blue", "Pegboard"],
  },
  concepts: [
    {
      id: "A",
      name: "Twenty Minutes",
      headline: "You needed a hole, not a drill.",
      sub: "Reframing route separating the job from the object.",
      reach: 458,
      ctr: 4.7,
      conv: 5.4,
    },
    {
      id: "B",
      name: "Shelf of Nine",
      headline: "Nine neighbours. One very good mitre saw.",
      sub: "Community route trading up on shared quality.",
      reach: 388,
      ctr: 5.1,
      conv: 5.9,
    },
    {
      id: "C",
      name: "Cupboard Back",
      headline: "Get the cupboard space back.",
      sub: "Space route aimed at small-home storage pain.",
      reach: 348,
      ctr: 5.5,
      conv: 6.1,
    },
  ],
  activity: ["Board opened", "Three columns balanced"],
}

const weights = ["Reach first", "Balanced", "Conversion first"] as const

export default function BalancedChain() {
  const m = useMuse(spec)
  const [weight, setWeight] = useState<(typeof weights)[number]>("Balanced")

  const bias = weight === "Reach first" ? 1.18 : weight === "Conversion first" ? 0.86 : 1
  const convBias = weight === "Conversion first" ? 1.2 : weight === "Reach first" ? 0.88 : 1
  const reach = Math.round(m.metrics.reach * bias)
  const conv = Math.round(m.metrics.conv * convBias * 10) / 10

  return (
    <main className="min-h-screen bg-[#101418] text-[#e9edf1]">
      <div className="mx-auto max-w-[86rem] px-4 py-6 sm:px-8">
        <header className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Scale className="size-4 text-amber-400" aria-hidden />
            Muse
          </span>
          <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#101418] uppercase">
            {m.modelName}
          </span>
          <span className="max-w-full truncate rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/60">
            {m.chain}
          </span>
          <div
            className="ml-auto flex flex-wrap gap-0.5 rounded-md bg-white/5 p-0.5"
            role="group"
            aria-label="Forecast weighting"
          >
            {weights.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setWeight(option)}
                aria-pressed={weight === option}
                className={
                  weight === option
                    ? "rounded bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-[#101418]"
                    : "rounded px-2.5 py-1 text-[10px] font-semibold text-white/55 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-4 pt-5 xl:grid-cols-[15rem_minmax(0,1fr)_15rem]">
          <section className="space-y-2.5">
            <h2 className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Routes
            </h2>
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
                      ? "w-full rounded-lg border-l-4 border-amber-400 bg-white/10 p-3 text-left"
                      : "w-full rounded-lg border-l-4 border-transparent bg-white/[0.03] p-3 text-left transition-colors hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
                  }
                >
                  <span className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold">{concept.name}</span>
                    <span className="font-mono text-[10px] text-white/40">{concept.id}</span>
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-white/55">
                    {concept.sub}
                  </span>
                  <span className="mt-2 flex gap-2 font-mono text-[10px] text-white/40">
                    <span>{concept.reach}K</span>
                    <span>{concept.ctr.toFixed(1)}%</span>
                    <span>{concept.conv.toFixed(1)}%</span>
                  </span>
                </button>
              )
            })}
            <div className="rounded-lg bg-white/[0.03] p-3">
              <h3 className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                Activity
              </h3>
              <ul className="mt-2 space-y-1">
                {m.log.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="truncate text-[10px] text-white/45"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="min-w-0 space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6 sm:p-10">
              <p className="font-mono text-[10px] tracking-[0.24em] text-amber-400 uppercase">
                Route {m.concept.id} · {m.concept.name} · {weight}
              </p>
              <h1 className="mt-4 max-w-xl text-2xl leading-[1.08] font-bold tracking-tight text-balance sm:text-[2.7rem]">
                {m.concept.headline}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                {m.concept.sub}
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {[m.audience, m.channel, m.tone, m.style].map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/65"
                  >
                    {value}
                  </span>
                ))}
              </div>
              {m.phase === "loading" ? (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                  <div
                    className="h-full bg-amber-400 transition-all duration-200"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                  Brief
                </span>
                <textarea
                  value={m.brief}
                  onChange={(event) => m.setBrief(event.target.value)}
                  rows={3}
                  className="mt-1.5 w-full resize-y rounded-lg border border-white/15 bg-black/25 px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-amber-400/70"
                />
              </label>
              {(
                [
                  ["audience", "Audience", spec.controls.audiences, m.audience],
                  ["channel", "Channel", spec.controls.channels, m.channel],
                  ["tone", "Tone", spec.controls.tones, m.tone],
                  ["style", "Style", spec.controls.styles, m.style],
                ] as const
              ).map(([key, label, options, value]) => (
                <label key={key} className="block">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                    {label}
                  </span>
                  <select
                    value={value}
                    onChange={(event) => m.setControl(key, event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/25 px-2.5 py-1.5 text-xs outline-none focus-visible:border-amber-400/70 [&>option]:text-neutral-900"
                  >
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Forecast
            </h2>
            {[
              ["Reach", `${reach}K`, Math.min(100, reach / 6)],
              ["CTR", `${m.metrics.ctr.toFixed(1)}%`, Math.min(100, m.metrics.ctr * 14)],
              ["Conversion", `${conv.toFixed(1)}%`, Math.min(100, conv * 12)],
              ["Confidence", `${m.confidence}%`, m.confidence],
            ].map(([label, value, bar]) => (
              <div key={label as string} className="rounded-lg bg-white/[0.04] p-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
                    {label}
                  </span>
                  <span className="text-xl font-bold tabular-nums">{value}</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${Number(bar)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="w-full rounded-lg bg-amber-400 px-3 py-2.5 text-xs font-bold tracking-[0.14em] text-[#101418] uppercase transition-colors hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "rounded-lg border border-rose-400/40 bg-rose-500/10 px-2.5 py-2 text-[11px] font-medium text-rose-300"
                    : m.phase === "success"
                      ? "rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-2 text-[11px] font-medium text-emerald-300"
                      : "px-0.5 text-[11px] text-white/45"
                }
              >
                {m.phase === "error"
                  ? "Brief needs more substance before a forecast can run."
                  : m.phase === "success"
                    ? "Forecast rebuilt under the current weighting."
                    : m.phase === "loading"
                      ? "Sampling routes."
                      : `Weighting: ${weight}. Draft r${m.revision}.`}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

