"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Download, Save, ShieldCheck } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-app-builder + impeccable",
  brief:
    "Roll out Northgate, a bike-locker network at commuter rail stations, to riders who stopped cycling because of theft.",
  controls: {
    audiences: ["Lapsed commuters", "Rail season holders", "Cargo bike parents"],
    channels: ["Station poster", "Transit app", "Council newsletter"],
    tones: ["Reassuring", "Civic", "Plain"],
    styles: ["Transit signage", "Municipal", "Photographic"],
  },
  concepts: [
    {
      id: "A",
      name: "Locked and Logged",
      headline: "Your bike is on camera the whole time you're not.",
      sub: "Security route that answers the objection directly.",
      reach: 452,
      ctr: 4.6,
      conv: 5.5,
    },
    {
      id: "B",
      name: "Ride the First Mile",
      headline: "The station is eleven minutes closer by bike.",
      sub: "Journey route reframing the locker as time saved.",
      reach: 408,
      ctr: 5.0,
      conv: 5.1,
    },
    {
      id: "C",
      name: "Bring It Back",
      headline: "The bike in your hallway still works.",
      sub: "Reactivation route aimed at bikes already owned.",
      reach: 374,
      ctr: 5.4,
      conv: 6.2,
    },
  ],
  activity: ["Audit panel attached", "Baseline captured"],
}

export default function StandardImpeccable() {
  const m = useMuse(spec)
  const [auditOpen, setAuditOpen] = useState(true)

  const findings = [
    {
      id: "brief-length",
      label: "Brief carries enough context to forecast",
      severity: "blocker" as const,
      ok: m.brief.trim().length >= 28,
      hint: "Add the audience and the objection you are answering.",
    },
    {
      id: "audience-channel",
      label: "Audience and channel are compatible",
      severity: "warning" as const,
      ok: !(m.audience === "Cargo bike parents" && m.channel === "Station poster"),
      hint: "Cargo bike parents rarely convert from station posters.",
    },
    {
      id: "forecast",
      label: "Forecast has been generated for this revision",
      severity: "warning" as const,
      ok: m.phase === "success",
      hint: "Run Generate so the metrics match the current controls.",
    },
    {
      id: "persisted",
      label: "Draft saved before export",
      severity: "info" as const,
      ok: m.saved,
      hint: "Save keeps the revision reproducible.",
    },
  ]

  const open = findings.filter((finding) => !finding.ok)
  const blocking = open.some((finding) => finding.severity === "blocker")

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <header className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Muse</span>
          <span className="rounded bg-stone-900 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
            {m.modelName}
          </span>
          <span className="rounded bg-stone-200 px-2 py-0.5 font-mono text-[10px] text-stone-700">
            {m.chain}
          </span>
          <button
            type="button"
            onClick={() => setAuditOpen((value) => !value)}
            aria-expanded={auditOpen}
            className={
              open.length === 0
                ? "ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
                : "ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
            }
          >
            <ShieldCheck className="size-3.5" aria-hidden />
            {open.length === 0 ? "Audit clear" : `${open.length} open`}
          </button>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <section className="min-w-0 space-y-4">
            <div className="rounded-lg bg-white p-6 ring-1 ring-stone-200 sm:p-9">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-stone-500 uppercase">
                Route {m.concept.id} · {m.concept.name}
              </p>
              <h1 className="mt-3 max-w-xl text-2xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl">
                {m.concept.headline}
              </h1>
              <p className="mt-3 max-w-lg text-sm text-stone-600">{m.concept.sub}</p>
              <p className="mt-4 text-xs text-stone-500">
                {m.audience} · {m.channel} · {m.tone} · {m.style}
              </p>
              {m.phase === "loading" ? (
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full bg-stone-900 transition-all duration-200"
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
                        ? "rounded-lg bg-stone-900 p-3 text-left text-white"
                        : "rounded-lg bg-white p-3 text-left ring-1 ring-stone-200 transition-all hover:ring-stone-400 focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:outline-none"
                    }
                  >
                    <span className="text-xs font-bold">
                      {concept.id} · {concept.name}
                    </span>
                    <span
                      className={
                        on
                          ? "mt-1 block text-[11px] leading-snug text-white/70"
                          : "mt-1 block text-[11px] leading-snug text-stone-600"
                      }
                    >
                      {concept.sub}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["Reach", `${m.metrics.reach}K`],
                ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
                ["Confidence", `${m.confidence}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white p-3 ring-1 ring-stone-200">
                  <div className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
                    {label}
                  </div>
                  <div className="mt-0.5 text-xl font-bold tabular-nums">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 rounded-lg bg-white p-4 ring-1 ring-stone-200">
              <label htmlFor="si-brief" className="text-xs font-semibold text-stone-700">
                Campaign brief
              </label>
              <textarea
                id="si-brief"
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={3}
                className="w-full resize-y rounded-md border border-stone-300 px-2.5 py-2 text-sm outline-none focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-300"
              />
              <div className="grid gap-3 sm:grid-cols-4">
                {(
                  [
                    ["audience", "Audience", spec.controls.audiences, m.audience],
                    ["channel", "Channel", spec.controls.channels, m.channel],
                    ["tone", "Tone", spec.controls.tones, m.tone],
                    ["style", "Style", spec.controls.styles, m.style],
                  ] as const
                ).map(([key, label, options, value]) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
                      {label}
                    </span>
                    <select
                      value={value}
                      onChange={(event) => m.setControl(key, event.target.value)}
                      className="w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-xs outline-none hover:border-stone-500 focus-visible:border-stone-900"
                    >
                      {options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          </section>
          <aside className="space-y-4">
            {auditOpen ? (
              <div className="rounded-lg bg-white p-4 ring-1 ring-stone-200">
                <h2 className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">
                  Audit findings
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {findings.map((finding) => (
                    <li key={finding.id} className="flex items-start gap-2">
                      {finding.ok ? (
                        <CheckCircle2
                          className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                          aria-hidden
                        />
                      ) : (
                        <AlertTriangle
                          className={
                            finding.severity === "blocker"
                              ? "mt-0.5 size-3.5 shrink-0 text-rose-600"
                              : finding.severity === "warning"
                                ? "mt-0.5 size-3.5 shrink-0 text-amber-600"
                                : "mt-0.5 size-3.5 shrink-0 text-stone-400"
                          }
                          aria-hidden
                        />
                      )}
                      <span className="min-w-0">
                        <span
                          className={
                            finding.ok
                              ? "block text-[11px] text-stone-400 line-through"
                              : "block text-[11px] font-medium text-stone-800"
                          }
                        >
                          {finding.label}
                        </span>
                        {finding.ok ? null : (
                          <span className="mt-0.5 block text-[10px] leading-snug text-stone-500">
                            {finding.hint}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading" || blocking}
                title={blocking ? "Resolve the blocking finding first" : undefined}
                className="w-full rounded-lg bg-stone-900 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
              >
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2 text-xs font-semibold ring-1 ring-stone-300 transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:outline-none"
                >
                  <Save className="size-3.5" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  disabled={!m.saved}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-2 py-2 text-xs font-semibold ring-1 ring-stone-300 transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
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
                      : "rounded-lg bg-white px-2.5 py-2 text-[11px] text-stone-600 ring-1 ring-stone-200"
                }
              >
                {m.phase === "error"
                  ? "Generation halted by the blocking finding."
                  : m.phase === "success"
                    ? "Forecast rebuilt and audit re-run."
                    : m.phase === "loading"
                      ? "Sampling routes against current controls."
                      : blocking
                        ? "Generate is disabled until the blocker clears."
                        : `Draft r${m.revision}. Audit re-runs on every change.`}
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 ring-1 ring-stone-200">
              <h2 className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">
                Activity
              </h2>
              <ul className="mt-2.5 space-y-1.5">
                {m.log.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="text-[11px] text-stone-600">
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

