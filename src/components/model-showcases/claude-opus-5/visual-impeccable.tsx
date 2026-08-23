"use client"

import { useState } from "react"
import { Download, GitCompare, History, Save } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-skill + impeccable",
  brief:
    "Launch Cardinal, a hardcover notebook with a sewn spine, to people who abandoned journalling because the book fell apart.",
  controls: {
    audiences: ["Lapsed journallers", "Field researchers", "Students"],
    channels: ["Stationery shop", "Reading newsletter", "Campus stand"],
    tones: ["Considered", "Frank", "Warm"],
    styles: ["Ink on cream", "Cloth binding", "Grid overlay"],
  },
  concepts: [
    {
      id: "A",
      name: "Opens Flat",
      headline: "It stays open on the page you left it.",
      sub: "Construction route built on one physical behaviour.",
      reach: 344,
      ctr: 5.4,
      conv: 6.0,
    },
    {
      id: "B",
      name: "Four Hundred Pages",
      headline: "Four hundred pages that outlast the year.",
      sub: "Endurance route trading on capacity and binding.",
      reach: 396,
      ctr: 4.8,
      conv: 5.3,
    },
    {
      id: "C",
      name: "Start on Page One",
      headline: "No system. No prompts. Just page one.",
      sub: "Permission route removing the ritual overhead.",
      reach: 428,
      ctr: 4.5,
      conv: 5.7,
    },
  ],
  activity: ["Revision history enabled", "Baseline r1 stored"],
}

type Snapshot = {
  revision: number
  route: string
  audience: string
  tone: string
  reach: number
  conv: number
}

export default function VisualImpeccable() {
  const m = useMuse(spec)
  const [history, setHistory] = useState<Snapshot[]>([])
  const [showDiff, setShowDiff] = useState(true)

  const snapshot = () => {
    setHistory((current) =>
      [
        {
          revision: m.revision,
          route: `${m.concept.id} · ${m.concept.name}`,
          audience: m.audience,
          tone: m.tone,
          reach: m.metrics.reach,
          conv: m.metrics.conv,
        },
        ...current,
      ].slice(0, 5)
    )
    m.save()
  }

  const previous = history[0]

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#231f1a]">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-9">
        <header className="flex flex-wrap items-center gap-2 border-b border-[#231f1a]/12 pb-4">
          <span className="text-sm font-semibold">Muse</span>
          <span className="rounded-sm bg-[#231f1a] px-2 py-0.5 text-[10px] font-bold tracking-[0.16em] text-[#faf7f0] uppercase">
            {m.modelName}
          </span>
          <span className="rounded-sm border border-[#231f1a]/20 px-2 py-0.5 font-mono text-[10px] text-[#231f1a]/60">
            {m.chain}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDiff((value) => !value)}
              aria-pressed={showDiff}
              className={
                showDiff
                  ? "inline-flex items-center gap-1.5 rounded-sm bg-[#231f1a] px-2.5 py-1 text-[11px] font-semibold text-[#faf7f0]"
                  : "inline-flex items-center gap-1.5 rounded-sm border border-[#231f1a]/25 px-2.5 py-1 text-[11px] font-semibold text-[#231f1a]/70 transition-colors hover:border-[#231f1a] focus-visible:ring-2 focus-visible:ring-[#231f1a]/30 focus-visible:outline-none"
              }
            >
              <GitCompare className="size-3" aria-hidden />
              Diff
            </button>
            <span className="font-mono text-[10px] text-[#231f1a]/45">r{m.revision}</span>
          </div>
        </header>

        <div className="grid gap-7 pt-7 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6">
            <section>
              <p className="font-mono text-[11px] tracking-[0.24em] text-[#8a5a2b] uppercase">
                Route {m.concept.id} — {m.concept.name}
              </p>
              <h1 className="mt-4 max-w-2xl text-[2.1rem] leading-[1.04] font-semibold tracking-tight text-balance sm:text-5xl">
                {m.concept.headline}
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#231f1a]/65">
                {m.concept.sub}
              </p>
              <p className="mt-2 text-xs text-[#231f1a]/45">
                {m.audience} · {m.channel} · {m.tone} · {m.style}
              </p>
              {m.phase === "loading" ? (
                <div className="mt-6 h-0.5 w-full bg-[#231f1a]/10">
                  <div
                    className="h-full bg-[#8a5a2b] transition-all duration-200"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              ) : null}
            </section>

            {showDiff && previous ? (
              <section className="rounded-md border border-[#231f1a]/15 bg-white">
                <h2 className="border-b border-[#231f1a]/10 px-3 py-2 font-mono text-[10px] tracking-[0.18em] text-[#231f1a]/50 uppercase">
                  Diff vs r{previous.revision}
                </h2>
                <dl className="divide-y divide-[#231f1a]/8">
                  {[
                    ["Route", previous.route, `${m.concept.id} · ${m.concept.name}`],
                    ["Audience", previous.audience, m.audience],
                    ["Tone", previous.tone, m.tone],
                    ["Reach", `${previous.reach}K`, `${m.metrics.reach}K`],
                    ["Conversion", `${previous.conv.toFixed(1)}%`, `${m.metrics.conv.toFixed(1)}%`],
                  ].map(([label, before, after]) => {
                    const changed = before !== after
                    return (
                      <div
                        key={label}
                        className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] items-baseline gap-2 px-3 py-2 text-[11px]"
                      >
                        <dt className="text-[#231f1a]/50">{label}</dt>
                        <dd
                          className={
                            changed
                              ? "truncate font-mono text-rose-700 line-through"
                              : "truncate font-mono text-[#231f1a]/35"
                          }
                        >
                          {before}
                        </dd>
                        <dd
                          className={
                            changed
                              ? "truncate font-mono text-emerald-800"
                              : "truncate font-mono text-[#231f1a]/45"
                          }
                        >
                          {after}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </section>
            ) : null}
            <section className="grid gap-px overflow-hidden rounded-md border border-[#231f1a]/15 bg-[#231f1a]/15 sm:grid-cols-3">
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
                        ? "bg-[#231f1a] p-4 text-left text-[#faf7f0]"
                        : "bg-white p-4 text-left transition-colors hover:bg-[#f2ede2] focus-visible:ring-2 focus-visible:ring-[#8a5a2b] focus-visible:outline-none focus-visible:ring-inset"
                    }
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-60">
                      {concept.id}
                    </span>
                    <span className="mt-1 block text-sm font-semibold">{concept.name}</span>
                    <span className="mt-1 block text-[11px] leading-snug opacity-65">
                      {concept.sub}
                    </span>
                  </button>
                )
              })}
            </section>

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Reach", `${m.metrics.reach}K`],
                ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
                ["Confidence", `${m.confidence}%`],
              ].map(([label, value]) => (
                <div key={label} className="border-t border-[#231f1a]/20 pt-2.5">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-[#231f1a]/45 uppercase">
                    {label}
                  </div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
                </div>
              ))}
            </section>

            <p
              role="status"
              className={
                m.phase === "error"
                  ? "rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800"
                  : m.phase === "success"
                    ? "rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"
                    : "text-xs text-[#231f1a]/55"
              }
            >
              {m.phase === "error"
                ? "Brief needs more substance before a forecast can run."
                : m.phase === "success"
                  ? "Forecast rebuilt. Save to snapshot this revision into history."
                  : m.phase === "loading"
                    ? `Sampling routes… ${m.progress}%`
                    : "Save writes a snapshot so the diff panel has something to compare against."}
            </p>
          </div>
          <aside className="space-y-5">
            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#231f1a]/45 uppercase">
                Brief
              </span>
              <textarea
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={5}
                className="mt-1.5 w-full resize-y rounded-md border border-[#231f1a]/20 bg-white px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-[#8a5a2b] focus-visible:ring-2 focus-visible:ring-[#8a5a2b]/20"
              />
            </label>

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
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#231f1a]/45 uppercase">
                    {label}
                  </span>
                  <select
                    value={value}
                    onChange={(event) => m.setControl(key, event.target.value)}
                    className="mt-1.5 w-full rounded-md border border-[#231f1a]/20 bg-white px-2.5 py-1.5 text-xs outline-none hover:border-[#231f1a]/45 focus-visible:border-[#8a5a2b]"
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
                className="w-full rounded-md bg-[#231f1a] px-3 py-2.5 text-xs font-bold tracking-[0.14em] text-[#faf7f0] uppercase transition-colors hover:bg-[#8a5a2b] focus-visible:ring-2 focus-visible:ring-[#8a5a2b]/40 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={snapshot}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#231f1a]/25 bg-white px-2 py-2 text-[11px] font-semibold transition-colors hover:border-[#231f1a] focus-visible:ring-2 focus-visible:ring-[#8a5a2b]/30 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#231f1a]/25 bg-white px-2 py-2 text-[11px] font-semibold transition-colors hover:border-[#231f1a] focus-visible:ring-2 focus-visible:ring-[#8a5a2b]/30 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-[#231f1a]/45 uppercase">
                <History className="size-3" aria-hidden />
                Snapshots
              </h2>
              {history.length === 0 ? (
                <p className="mt-2 text-[11px] text-[#231f1a]/45">
                  No snapshots yet. Save to capture one.
                </p>
              ) : (
                <ol className="mt-2 space-y-1.5">
                  {history.map((item, index) => (
                    <li
                      key={`${item.revision}-${index}`}
                      className="rounded-sm border border-[#231f1a]/12 bg-white px-2 py-1.5 text-[11px]"
                    >
                      <span className="font-mono text-[#231f1a]/45">r{item.revision}</span>{" "}
                      {item.route} · {item.reach}K
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <h2 className="font-mono text-[10px] tracking-[0.2em] text-[#231f1a]/45 uppercase">
                Recent
              </h2>
              <ul className="mt-2 space-y-1">
                {m.log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="text-[11px] text-[#231f1a]/55">
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

