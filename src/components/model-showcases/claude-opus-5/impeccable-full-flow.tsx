"use client"

import { useState } from "react"
import { Check, ChevronRight, CircleDot, Download, Loader2, Save } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "impeccable",
  brief:
    "Take Halden, a modular acoustic panel range, to small studio owners who record in rooms that were never built for it.",
  controls: {
    audiences: ["Home studio owners", "Podcast producers", "Office fitouts"],
    channels: ["Trade forum", "Comparison guide", "Installer network"],
    tones: ["Technical", "Direct", "Helpful"],
    styles: ["Measured grid", "Felt texture", "Blueprint"],
  },
  concepts: [
    {
      id: "A",
      name: "Treat the Room",
      headline: "Better mics won't fix a bad room.",
      sub: "Diagnosis-first route that sells the room before the panel.",
      reach: 374,
      ctr: 5.1,
      conv: 5.8,
    },
    {
      id: "B",
      name: "Six Panels In",
      headline: "Six panels. Measurable difference at 250Hz.",
      sub: "Measurement route built around a before-and-after sweep.",
      reach: 336,
      ctr: 5.7,
      conv: 6.6,
    },
    {
      id: "C",
      name: "Rent-Safe",
      headline: "Mounts without a single hole in the wall.",
      sub: "Reversibility route aimed at leaseholders.",
      reach: 458,
      ctr: 4.3,
      conv: 4.7,
    },
  ],
  activity: ["Session opened", "Step 1 of 4 active"],
}

const steps = ["Brief", "Direction", "Routes", "Forecast"] as const

const checks = [
  "Brief states audience and constraint",
  "Route selected and previewed",
  "Forecast generated at least once",
  "Draft saved before export",
] as const

export default function ImpeccableFullFlow() {
  const m = useMuse(spec)
  const [step, setStep] = useState(0)

  const done = [
    m.brief.trim().length >= 28,
    m.revision > 1 || m.conceptId !== "A",
    m.phase === "success",
    m.saved,
  ]

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <header className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Muse</span>
          <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
            {m.modelName}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-600">
            {m.chain}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-zinc-500">
            {done.filter(Boolean).length}/4 checks
          </span>
        </header>

        <nav aria-label="Workflow" className="mt-6 flex flex-wrap items-center gap-1.5">
          {steps.map((label, index) => {
            const active = step === index
            return (
              <span key={label} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  aria-current={active ? "step" : undefined}
                  className={
                    active
                      ? "flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white"
                      : "flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none"
                  }
                >
                  {done[index] ? (
                    <Check className="size-3 text-emerald-500" aria-hidden />
                  ) : (
                    <CircleDot className="size-3 opacity-50" aria-hidden />
                  )}
                  {index + 1}. {label}
                </button>
                {index < steps.length - 1 ? (
                  <ChevronRight className="size-3 text-zinc-300" aria-hidden />
                ) : null}
              </span>
            )
          })}
        </nav>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section className="min-w-0 space-y-5">
            <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 sm:p-9">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-indigo-600 uppercase">
                Route {m.concept.id} · {m.concept.name}
              </p>
              <h1 className="mt-3 max-w-xl text-2xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
                {m.concept.headline}
              </h1>
              <p className="mt-3 max-w-lg text-sm text-zinc-600">{m.concept.sub}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {[m.audience, m.channel, m.tone, m.style].map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-600"
                  >
                    {value}
                  </span>
                ))}
              </div>
              {m.phase === "loading" ? (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-200">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-200"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              ) : null}
            </div>
            <div className="rounded-xl border border-zinc-200 p-4">
              {step === 0 ? (
                <div>
                  <label
                    htmlFor="if-brief"
                    className="text-xs font-semibold tracking-wide text-zinc-700 uppercase"
                  >
                    Campaign brief
                  </label>
                  <textarea
                    id="if-brief"
                    value={m.brief}
                    onChange={(event) => m.setBrief(event.target.value)}
                    rows={4}
                    aria-describedby="if-brief-help"
                    className="mt-2 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-200"
                  />
                  <p id="if-brief-help" className="mt-1.5 text-[11px] text-zinc-500">
                    {m.brief.trim().length} characters. 28 minimum for a forecast run.
                  </p>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["audience", "Audience", spec.controls.audiences, m.audience],
                      ["channel", "Channel", spec.controls.channels, m.channel],
                      ["tone", "Tone", spec.controls.tones, m.tone],
                      ["style", "Visual style", spec.controls.styles, m.style],
                    ] as const
                  ).map(([key, label, options, value]) => (
                    <fieldset key={key}>
                      <legend className="mb-2 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                        {label}
                      </legend>
                      <div className="space-y-1.5">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-50 has-checked:bg-indigo-50 has-checked:text-indigo-900"
                          >
                            <input
                              type="radio"
                              name={`if-${key}`}
                              checked={option === value}
                              onChange={() => m.setControl(key, option)}
                              className="size-3.5 accent-indigo-600"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-2">
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
                            ? "flex w-full items-start gap-3 rounded-lg border-2 border-indigo-500 bg-indigo-50/60 p-3 text-left"
                            : "flex w-full items-start gap-3 rounded-lg border border-zinc-200 p-3 text-left transition-colors hover:border-indigo-300 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none"
                        }
                      >
                        <span
                          className={
                            on
                              ? "grid size-7 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white"
                              : "grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500"
                          }
                        >
                          {concept.id}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{concept.name}</span>
                          <span className="block text-xs text-zinc-600">{concept.sub}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Reach", `${m.metrics.reach}K`, m.metrics.reach / 6],
                    ["CTR", `${m.metrics.ctr.toFixed(1)}%`, m.metrics.ctr * 14],
                    ["Conversion", `${m.metrics.conv.toFixed(1)}%`, m.metrics.conv * 12],
                  ].map(([label, value, bar]) => (
                    <div key={label as string} className="rounded-lg bg-zinc-50 p-3">
                      <div className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                        {label}
                      </div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
                      <div className="mt-2 h-1 rounded-full bg-zinc-200">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, Number(bar))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
          <aside className="space-y-4">
            <div className="rounded-xl border border-zinc-200 p-4">
              <h2 className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">
                Readiness
              </h2>
              <ul className="mt-3 space-y-2">
                {checks.map((label, index) => (
                  <li key={label} className="flex items-start gap-2 text-xs">
                    <span
                      className={
                        done[index]
                          ? "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"
                          : "mt-0.5 size-4 shrink-0 rounded-full border border-zinc-300"
                      }
                    >
                      {done[index] ? <Check className="size-2.5" aria-hidden /> : null}
                    </span>
                    <span className={done[index] ? "text-zinc-500 line-through" : "text-zinc-700"}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none disabled:opacity-60"
              >
                {m.phase === "loading" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                {m.phase === "loading" ? "Generating…" : "Generate forecast"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-2 py-2 text-xs font-semibold transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none"
                >
                  <Save className="size-3.5" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  disabled={!m.saved}
                  title={m.saved ? undefined : "Save the draft first"}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-2 py-2 text-xs font-semibold transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Download className="size-3.5" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-medium text-rose-700"
                    : m.phase === "success"
                      ? "rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[11px] font-medium text-emerald-800"
                      : "rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-[11px] text-zinc-600"
                }
              >
                {m.phase === "error"
                  ? "Generation halted. Add detail to the brief in step 1."
                  : m.phase === "success"
                    ? "Forecast rebuilt. Step 4 shows the current numbers."
                    : m.phase === "loading"
                      ? `Sampling routes… ${m.progress}%`
                      : "Walk the four steps in any order."}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 p-4">
              <h2 className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase">
                Activity
              </h2>
              <ol className="mt-3 space-y-2 border-l border-zinc-200 pl-3">
                {m.log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="relative text-[11px] text-zinc-600">
                    <span
                      className="absolute -left-[15px] top-1.5 size-1.5 rounded-full bg-zinc-300"
                      aria-hidden
                    />
                    {entry}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

