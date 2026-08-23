"use client"

import { useState } from "react"
import { Download, Save, Users } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-design + ui-ux-pro-max",
  brief:
    "Introduce Thistle, a hearing-aid companion app, to adults who were prescribed aids two years ago and stopped wearing them.",
  controls: {
    audiences: ["Drawer non-wearers", "New fittings", "Audiologists"],
    channels: ["Clinic handout", "Family caregiver ads", "Support group"],
    tones: ["Respectful", "Direct", "Optimistic"],
    styles: ["Accessible large", "Soft contrast", "Illustrated"],
  },
  concepts: [
    {
      id: "A",
      name: "Tune the Room",
      headline: "Restaurants are the hard part. Start there.",
      sub: "Situational route targeting the specific failure moment.",
      reach: 384,
      ctr: 5.1,
      conv: 5.9,
    },
    {
      id: "B",
      name: "Second Try",
      headline: "The aids were fine. The settings weren't.",
      sub: "Recovery route removing blame from the device.",
      reach: 352,
      ctr: 5.5,
      conv: 6.3,
    },
    {
      id: "C",
      name: "Ask Once",
      headline: "Fewer 'sorry, what?' at the dinner table.",
      sub: "Relational route written for family members.",
      reach: 438,
      ctr: 4.6,
      conv: 5.0,
    },
  ],
  activity: ["Research panel loaded", "Funnel model attached"],
}

const personas: Record<string, { need: string; barrier: string; trigger: string }> = {
  "Drawer non-wearers": {
    need: "Hear in noise without concentrating on it",
    barrier: "Assumes the device itself failed",
    trigger: "A specific occasion they care about",
  },
  "New fittings": {
    need: "Confidence that adjustment is normal",
    barrier: "Fears looking dependent",
    trigger: "A clinician telling them to expect weeks",
  },
  Audiologists: {
    need: "Fewer follow-up appointments per fitting",
    barrier: "Doubts app-based tuning accuracy",
    trigger: "Evidence from their own patient list",
  },
}

const funnel = ["Impression", "Click", "Trial", "Daily wear"] as const

export default function DesignUxPro() {
  const m = useMuse(spec)
  const [personaOpen, setPersonaOpen] = useState(true)
  const persona = personas[m.audience] ?? personas["Drawer non-wearers"]

  const stages = [
    100,
    Math.min(100, m.metrics.ctr * 12),
    Math.min(100, m.metrics.conv * 9),
    Math.min(100, m.metrics.conv * 5.5),
  ]

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-[82rem] px-5 py-6 sm:px-9">
        <header className="flex flex-wrap items-center gap-2 pb-5">
          <span className="text-sm font-semibold tracking-tight">Muse</span>
          <span className="rounded-full bg-violet-700 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
            {m.modelName}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] text-slate-600">
            {m.chain}
          </span>
        </header>

        <div className="grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)_18rem]">
          <aside className="space-y-4">
            <div className="rounded-xl bg-violet-50 p-4">
              <button
                type="button"
                onClick={() => setPersonaOpen((value) => !value)}
                aria-expanded={personaOpen}
                className="flex w-full items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-violet-900 uppercase focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none"
              >
                <Users className="size-3.5" aria-hidden />
                {m.audience}
              </button>
              {personaOpen ? (
                <dl className="mt-3 space-y-2.5">
                  {[
                    ["Need", persona.need],
                    ["Barrier", persona.barrier],
                    ["Trigger", persona.trigger],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10px] font-semibold tracking-wider text-violet-700 uppercase">
                        {label}
                      </dt>
                      <dd className="text-xs leading-snug text-violet-950">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>

            <label className="block">
              <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                Brief
              </span>
              <textarea
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={6}
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-violet-600 focus-visible:ring-2 focus-visible:ring-violet-200"
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
                <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  {label}
                </span>
                <select
                  value={value}
                  onChange={(event) => m.setControl(key, event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs outline-none hover:border-slate-500 focus-visible:border-violet-600 focus-visible:ring-2 focus-visible:ring-violet-200"
                >
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </aside>
          <section className="min-w-0 space-y-5">
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 ring-1 ring-slate-200 sm:p-10">
              <p className="text-[11px] font-bold tracking-[0.18em] text-violet-700 uppercase">
                Route {m.concept.id} · {m.concept.name}
              </p>
              <h1 className="mt-3 max-w-2xl text-2xl leading-[1.1] font-bold tracking-tight text-balance sm:text-[2.6rem]">
                {m.concept.headline}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                {m.concept.sub}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Answers the barrier: {persona.barrier.toLowerCase()}.
              </p>
              {m.phase === "loading" ? (
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-violet-600 transition-all duration-200"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              ) : null}
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
                        ? "rounded-xl bg-violet-700 p-3.5 text-left text-white"
                        : "rounded-xl bg-white p-3.5 text-left ring-1 ring-slate-200 transition-all hover:ring-violet-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
                    }
                  >
                    <span className="text-[10px] font-bold tracking-[0.18em] uppercase opacity-70">
                      Route {concept.id}
                    </span>
                    <span className="mt-1 block text-sm font-bold">{concept.name}</span>
                    <span
                      className={
                        on
                          ? "mt-1 block text-[11px] leading-snug text-white/75"
                          : "mt-1 block text-[11px] leading-snug text-slate-600"
                      }
                    >
                      {concept.sub}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <h2 className="text-[11px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                Projected funnel
              </h2>
              <div className="mt-3 space-y-2">
                {funnel.map((stage, index) => (
                  <div key={stage} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-[11px] text-slate-600">{stage}</span>
                    <span className="h-5 flex-1 overflow-hidden rounded bg-slate-100">
                      <span
                        className="block h-full rounded bg-violet-500 transition-all duration-500"
                        style={{
                          width: `${stages[index]}%`,
                          opacity: 1 - index * 0.16,
                        }}
                      />
                    </span>
                    <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-slate-700">
                      {Math.round(stages[index])}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <aside className="space-y-4">
            <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
              {[
                ["Reach", `${m.metrics.reach}K`],
                ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {label}
                  </div>
                  <div className="mt-0.5 text-2xl font-bold tabular-nums">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="w-full rounded-lg bg-violet-700 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-800 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:outline-none"
                >
                  <Save className="size-3.5" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-2 py-2 text-xs font-semibold transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:outline-none"
                >
                  <Download className="size-3.5" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "rounded-lg bg-rose-50 px-2.5 py-2 text-[11px] font-medium text-rose-800 ring-1 ring-rose-200"
                    : m.phase === "success"
                      ? "rounded-lg bg-emerald-50 px-2.5 py-2 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200"
                      : "px-0.5 text-[11px] text-slate-500"
                }
              >
                {m.phase === "error"
                  ? "Brief needs more substance before a forecast can run."
                  : m.phase === "success"
                    ? "Forecast and funnel rebuilt for this route."
                    : m.phase === "loading"
                      ? "Sampling routes against the persona model."
                      : "Switching audience swaps the persona rail and the funnel."}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <h2 className="text-[11px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                Activity
              </h2>
              <ul className="mt-2.5 space-y-1.5">
                {m.log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="text-[11px] leading-snug text-slate-600">
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

