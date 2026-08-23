"use client"

import { useState } from "react"
import { Download, PanelsTopLeft, Play, Save } from "lucide-react"

import { useMuse, phaseCopy, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-app-builder",
  brief:
    "Launch the Aster Field portable espresso press to commuters who already own a grinder but no reliable brewing routine.",
  controls: {
    audiences: ["Commuter brewers", "Office cafés", "Camp cooks"],
    channels: ["Paid social", "Retail endcap", "Newsletter"],
    tones: ["Practical", "Confident", "Warm"],
    styles: ["Product-forward", "Editorial grid", "Flat diagram"],
  },
  concepts: [
    {
      id: "A",
      name: "Nine Bars Anywhere",
      headline: "Nine bars of pressure. No outlet required.",
      sub: "Spec-led route that leans on the pressure gauge as proof.",
      reach: 412,
      ctr: 4.4,
      conv: 5.1,
    },
    {
      id: "B",
      name: "The 7am Window",
      headline: "Your best shot happens before the office does.",
      sub: "Routine route framed around the commute itself.",
      reach: 468,
      ctr: 3.9,
      conv: 4.6,
    },
    {
      id: "C",
      name: "Grinder Companion",
      headline: "You bought the grinder. Finish the setup.",
      sub: "Upgrade route aimed at existing gear owners.",
      reach: 356,
      ctr: 5.3,
      conv: 6.2,
    },
  ],
  activity: ["Workspace opened", "Brief imported from launch doc"],
}

const tabs = ["Preview", "Forecast", "Activity"] as const

export default function StandardBuilder() {
  const m = useMuse(spec)
  const [tab, setTab] = useState<(typeof tabs)[number]>("Preview")

  const controls = [
    { key: "audience", label: "Audience", value: m.audience, options: spec.controls.audiences },
    { key: "channel", label: "Channel", value: m.channel, options: spec.controls.channels },
    { key: "tone", label: "Tone", value: m.tone, options: spec.controls.tones },
    { key: "style", label: "Visual style", value: m.style, options: spec.controls.styles },
  ] as const

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-300 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5 px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2 font-semibold">
            <PanelsTopLeft className="size-4 text-blue-600" aria-hidden />
            Muse
          </span>
          <span className="rounded bg-slate-900 px-2 py-1 text-[11px] font-semibold tracking-wider text-white uppercase">
            {m.modelName}
          </span>
          <span className="rounded border border-slate-300 px-2 py-1 font-mono text-[11px] text-slate-600">
            {m.chain}
          </span>
          <span className="ml-auto text-xs text-slate-500">
            r{m.revision} · {phaseCopy[m.phase].label}
          </span>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-lg border border-slate-300 bg-white p-4">
          <div>
            <label htmlFor="sb-brief" className="mb-1.5 block text-xs font-semibold text-slate-600">
              Campaign brief
            </label>
            <textarea
              id="sb-brief"
              value={m.brief}
              onChange={(event) => m.setBrief(event.target.value)}
              rows={5}
              className="w-full resize-y rounded border border-slate-300 px-2.5 py-2 text-sm outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-200"
            />
            <p className="mt-1 text-[11px] text-slate-500">{m.brief.trim().length} characters</p>
          </div>
          {controls.map((control) => (
            <div key={control.key}>
              <label
                htmlFor={`sb-${control.key}`}
                className="mb-1.5 block text-xs font-semibold text-slate-600"
              >
                {control.label}
              </label>
              <select
                id={`sb-${control.key}`}
                value={control.value}
                onChange={(event) => m.setControl(control.key, event.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none hover:border-slate-500 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-200"
              >
                {control.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
          <div className="grid gap-2 border-t border-slate-200 pt-3">
            <button
              type="button"
              onClick={m.generate}
              disabled={m.phase === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:outline-none disabled:opacity-60"
            >
              <Play className="size-3.5" aria-hidden />
              {m.phase === "loading" ? "Generating…" : "Generate"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={m.save}
                className="inline-flex items-center justify-center gap-1.5 rounded border border-slate-300 px-2 py-2 text-xs font-semibold transition-colors hover:border-slate-500 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none"
              >
                <Save className="size-3.5" aria-hidden />
                {m.saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={m.exportCampaign}
                className="inline-flex items-center justify-center gap-1.5 rounded border border-slate-300 px-2 py-2 text-xs font-semibold transition-colors hover:border-slate-500 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none"
              >
                <Download className="size-3.5" aria-hidden />
                {m.exported ? "Exported" : "Export"}
              </button>
            </div>
          </div>
        </aside>
        <section className="min-w-0 rounded-lg border border-slate-300 bg-white">
          <div className="flex gap-1 border-b border-slate-200 px-3 pt-3" role="tablist">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={tab === item}
                onClick={() => setTab(item)}
                className={
                  tab === item
                    ? "rounded-t border border-slate-300 border-b-white bg-white px-3 py-2 text-xs font-semibold text-blue-700"
                    : "rounded-t border border-transparent px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:outline-none"
                }
              >
                {item}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === "Preview" ? (
              <div>
                <div className="relative overflow-hidden rounded border border-slate-200 bg-slate-50 p-6 sm:p-10">
                  {m.phase === "loading" ? (
                    <div className="absolute inset-x-0 top-0 h-1 bg-slate-200">
                      <div
                        className="h-full bg-blue-600 transition-all duration-200"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  ) : null}
                  <p className="text-[11px] font-semibold tracking-widest text-blue-700 uppercase">
                    Route {m.concept.id} · {m.concept.name}
                  </p>
                  <h1 className="mt-3 max-w-xl text-2xl leading-tight font-bold text-balance sm:text-4xl">
                    {m.concept.headline}
                  </h1>
                  <p className="mt-3 max-w-lg text-sm text-slate-600">{m.concept.sub}</p>
                  <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
                    {[
                      ["Audience", m.audience],
                      ["Channel", m.channel],
                      ["Tone", m.tone],
                      ["Style", m.style],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[10px] tracking-wider text-slate-400 uppercase">
                          {label}
                        </dt>
                        <dd className="font-medium text-slate-800">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div
                  className={
                    m.phase === "error"
                      ? "mt-4 rounded border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
                      : m.phase === "success"
                        ? "mt-4 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"
                        : "mt-4 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  }
                  role="status"
                >
                  {phaseCopy[m.phase].detail}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {spec.concepts.map((concept) => {
                    const selected = m.conceptId === concept.id
                    return (
                      <button
                        key={concept.id}
                        type="button"
                        onClick={() => m.selectConcept(concept.id)}
                        aria-pressed={selected}
                        className={
                          selected
                            ? "rounded border-2 border-blue-600 bg-blue-50 p-3 text-left"
                            : "rounded border border-slate-300 p-3 text-left transition-colors hover:border-blue-400 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:outline-none"
                        }
                      >
                        <span className="text-xs font-bold text-slate-900">
                          {concept.id} · {concept.name}
                        </span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-slate-600">
                          {concept.sub}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {tab === "Forecast" ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-[11px] tracking-wider text-slate-500 uppercase">
                    <th className="py-2 font-semibold">Metric</th>
                    <th className="py-2 font-semibold">Value</th>
                    <th className="py-2 font-semibold">Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Reach", `${m.metrics.reach}K`, `${m.channel} placement`],
                    ["CTR", `${m.metrics.ctr.toFixed(1)}%`, `${m.tone} copy`],
                    ["Conversion", `${m.metrics.conv.toFixed(1)}%`, `${m.audience} match`],
                    ["Confidence", `${m.confidence}%`, `Route ${m.concept.id}`],
                  ].map(([label, value, basis]) => (
                    <tr key={label} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2.5 font-medium">{label}</td>
                      <td className="py-2.5 font-mono text-blue-700">{value}</td>
                      <td className="py-2.5 text-slate-500">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {tab === "Activity" ? (
              <ol className="space-y-2 text-xs">
                {m.log.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="flex gap-2 rounded border border-slate-200 px-2.5 py-2 text-slate-700"
                  >
                    <span className="font-mono text-slate-400">
                      {String(m.log.length - index).padStart(2, "0")}
                    </span>
                    {entry}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

