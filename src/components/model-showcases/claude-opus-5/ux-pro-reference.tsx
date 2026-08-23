"use client"

import { useState } from "react"
import { Download, Keyboard, Save, Target } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "ui-ux-pro-max",
  brief:
    "Position Ledgerline, a bookkeeping app for sole traders, against spreadsheets that already mostly work for them.",
  controls: {
    audiences: ["Sole traders", "Side-business owners", "Small agencies"],
    channels: ["Search ads", "Accountant referral", "Tax-season email"],
    tones: ["Calm", "Blunt", "Encouraging"],
    styles: ["High contrast", "Soft neutral", "Dense data"],
  },
  concepts: [
    {
      id: "A",
      name: "Spreadsheet Exit",
      headline: "Keep the spreadsheet. Stop maintaining it.",
      sub: "Migration route that respects the existing workflow.",
      reach: 456,
      ctr: 4.5,
      conv: 5.3,
    },
    {
      id: "B",
      name: "January Proof",
      headline: "Filing takes an evening, not a weekend.",
      sub: "Time-saving route timed to the filing deadline.",
      reach: 398,
      ctr: 5.2,
      conv: 6.3,
    },
    {
      id: "C",
      name: "One Screen",
      headline: "Every number you owe, on one screen.",
      sub: "Clarity route built around a single liability view.",
      reach: 342,
      ctr: 5.8,
      conv: 5.9,
    },
  ],
  activity: ["Spec opened", "Annotations on"],
}

const notes: Record<string, string> = {
  A: "Primary action stays visible; migration fear is addressed above the fold.",
  B: "Deadline framing raises urgency, so the CTA copy stays low-pressure.",
  C: "Single-view promise means the preview must not introduce second-order choices.",
}

export default function UxProReference() {
  const m = useMuse(spec)
  const [dense, setDense] = useState(false)
  const [annotate, setAnnotate] = useState(true)
  const pad = dense ? "p-3" : "p-5"

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-7">
        <header className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Target className="size-4 text-teal-600" aria-hidden />
            Muse
          </span>
          <span className="rounded border border-neutral-900 bg-neutral-900 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
            {m.modelName}
          </span>
          <span className="rounded border border-teal-600/40 bg-teal-50 px-2 py-0.5 font-mono text-[10px] text-teal-800">
            {m.chain}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-neutral-600">
              <input
                type="checkbox"
                checked={dense}
                onChange={(event) => setDense(event.target.checked)}
                className="size-3.5 accent-teal-600"
              />
              Dense
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-neutral-600">
              <input
                type="checkbox"
                checked={annotate}
                onChange={(event) => setAnnotate(event.target.checked)}
                className="size-3.5 accent-teal-600"
              />
              Annotations
            </label>
          </div>
        </header>

        <div className={dense ? "mt-3 grid gap-3 xl:grid-cols-[15rem_minmax(0,1fr)_16rem]" : "mt-5 grid gap-5 xl:grid-cols-[16rem_minmax(0,1fr)_17rem]"}>
          <aside className={`rounded-lg border border-neutral-200 bg-white ${pad} space-y-4`}>
            <div>
              <label
                htmlFor="ux-brief"
                className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase"
              >
                Brief
              </label>
              <textarea
                id="ux-brief"
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={dense ? 3 : 5}
                className="mt-1.5 w-full resize-y rounded-md border border-neutral-300 px-2.5 py-2 text-[13px] outline-none focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-200"
              />
            </div>
            {(
              [
                ["audience", "Audience", spec.controls.audiences, m.audience],
                ["channel", "Channel", spec.controls.channels, m.channel],
                ["tone", "Tone", spec.controls.tones, m.tone],
                ["style", "Style", spec.controls.styles, m.style],
              ] as const
            ).map(([key, label, options, value]) => (
              <label key={key} className="block">
                <span className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                  {label}
                </span>
                <select
                  value={value}
                  onChange={(event) => m.setControl(key, event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-[13px] outline-none hover:border-neutral-500 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-200"
                >
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
            <p className="flex items-start gap-1.5 border-t border-neutral-200 pt-3 text-[11px] text-neutral-500">
              <Keyboard className="mt-0.5 size-3 shrink-0" aria-hidden />
              Every control is reachable by keyboard and reflects into the preview immediately.
            </p>
          </aside>
          <section className="min-w-0 space-y-4">
            <div className="relative rounded-lg border border-neutral-200 bg-white">
              {annotate ? (
                <span className="absolute -top-2 left-3 rounded bg-teal-600 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-white uppercase">
                  hero · route {m.conceptId}
                </span>
              ) : null}
              <div className={dense ? "p-5" : "p-8 sm:p-10"}>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-700 uppercase">
                  {m.concept.name}
                </p>
                <h1
                  className={
                    dense
                      ? "mt-2 max-w-xl text-xl leading-tight font-semibold text-balance sm:text-2xl"
                      : "mt-3 max-w-2xl text-2xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-4xl"
                  }
                >
                  {m.concept.headline}
                </h1>
                <p className="mt-3 max-w-lg text-sm text-neutral-600">{m.concept.sub}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={m.generate}
                    disabled={m.phase === "loading"}
                    className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none disabled:opacity-60"
                  >
                    {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
                  </button>
                  <button
                    type="button"
                    onClick={m.save}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:outline-none"
                  >
                    <Save className="size-3.5" aria-hidden />
                    {m.saved ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={m.exportCampaign}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-teal-200 focus-visible:outline-none"
                  >
                    <Download className="size-3.5" aria-hidden />
                    {m.exported ? "Exported" : "Export"}
                  </button>
                </div>
              </div>
              {annotate ? (
                <p className="border-t border-dashed border-teal-300 bg-teal-50/60 px-4 py-2 text-[11px] text-teal-900">
                  {notes[m.conceptId]}
                </p>
              ) : null}
            </div>

            <div
              role="status"
              className={
                m.phase === "error"
                  ? "rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800"
                  : m.phase === "success"
                    ? "rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900"
                    : "rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600"
              }
            >
              {m.phase === "error"
                ? "Brief is under 28 characters, so the forecast was not run."
                : m.phase === "success"
                  ? "Forecast rebuilt. Metrics panel reflects the current route."
                  : m.phase === "loading"
                    ? "Sampling three routes against the current controls."
                    : "Draft state. Change any control to update the hero copy and metrics."}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
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
                        ? "rounded-lg border-2 border-teal-700 bg-white p-3 text-left shadow-sm"
                        : "rounded-lg border border-neutral-200 bg-white p-3 text-left transition-all hover:border-teal-400 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:outline-none"
                    }
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-xs font-bold">{concept.name}</span>
                      <span
                        className={
                          on
                            ? "grid size-5 place-items-center rounded bg-teal-700 text-[10px] font-bold text-white"
                            : "grid size-5 place-items-center rounded bg-neutral-100 text-[10px] font-bold text-neutral-500"
                        }
                      >
                        {concept.id}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-snug text-neutral-600">
                      {concept.sub}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
          <aside className={`rounded-lg border border-neutral-200 bg-white ${pad} space-y-4`}>
            <div>
              <h2 className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Forecast
              </h2>
              <div className="mt-2.5 space-y-2.5">
                {[
                  ["Reach", `${m.metrics.reach}K`, Math.min(100, m.metrics.reach / 6)],
                  ["CTR", `${m.metrics.ctr.toFixed(1)}%`, Math.min(100, m.metrics.ctr * 14)],
                  ["Conversion", `${m.metrics.conv.toFixed(1)}%`, Math.min(100, m.metrics.conv * 12)],
                  ["Confidence", `${m.confidence}%`, m.confidence],
                ].map(([label, value, bar]) => (
                  <div key={label as string}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-neutral-500">{label}</span>
                      <span className="text-sm font-semibold tabular-nums">{value}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all duration-500"
                        style={{ width: `${Number(bar)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-3">
              <h2 className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                Recent actions
              </h2>
              <ul className="mt-2 space-y-1.5">
                {m.log.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="flex gap-2 text-[11px] leading-snug text-neutral-600"
                  >
                    <span className="font-mono text-neutral-400">
                      {String(m.log.length - index).padStart(2, "0")}
                    </span>
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

