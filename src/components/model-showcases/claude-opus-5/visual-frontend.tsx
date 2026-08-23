"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Download, Loader2, Save, Wand2 } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-skill",
  brief:
    "Introduce Nocturne, a matte-black wireless turntable, to listeners who treat their living room as a listening room.",
  controls: {
    audiences: ["Vinyl returners", "Hi-fi collectors", "Design renters"],
    channels: ["Cinema pre-roll", "Music press", "Flagship window"],
    tones: ["Cinematic", "Restrained", "Bold"],
    styles: ["Deep black", "Amber spill", "Cool steel"],
  },
  concepts: [
    {
      id: "A",
      name: "Drop the Needle",
      headline: "The room goes quiet first.",
      sub: "Silence-before-sound route staged in a dark interior.",
      reach: 388,
      ctr: 4.8,
      conv: 5.0,
    },
    {
      id: "B",
      name: "No Cables Named",
      headline: "Analogue warmth. Nothing trailing behind it.",
      sub: "Form route contrasting wireless build with vinyl ritual.",
      reach: 441,
      ctr: 4.2,
      conv: 4.4,
    },
    {
      id: "C",
      name: "Side B",
      headline: "Made for the half of the record people skip.",
      sub: "Deep-listening route for full-album sequencing.",
      reach: 322,
      ctr: 5.6,
      conv: 6.4,
    },
  ],
  activity: ["Canvas initialised", "Grade set to deep black"],
}

const grade: Record<string, { bg: string; glow: string; ink: string }> = {
  "Deep black": { bg: "#08080a", glow: "rgba(120,120,140,0.35)", ink: "#f4f4f6" },
  "Amber spill": { bg: "#120b04", glow: "rgba(240,160,60,0.42)", ink: "#fdf3e4" },
  "Cool steel": { bg: "#060d12", glow: "rgba(90,180,220,0.38)", ink: "#eaf6fb" },
}

export default function VisualFrontend() {
  const m = useMuse(spec)
  const [dockOpen, setDockOpen] = useState(true)
  const g = grade[m.style] ?? grade["Deep black"]

  return (
    <main
      className="relative min-h-screen overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: g.bg, color: g.ink }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${g.glow}, transparent 68%)` }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 pt-6 pb-40 sm:px-8 lg:pb-32">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className="rounded-full px-3 py-1 font-semibold tracking-[0.18em] uppercase"
            style={{ backgroundColor: g.ink, color: g.bg }}
          >
            {m.modelName}
          </span>
          <span className="rounded-full border border-current/25 px-3 py-1 font-mono opacity-70">
            {m.chain}
          </span>
          <span className="ml-auto font-mono opacity-50">Muse · Campaign Studio</span>
        </div>

        <section className="flex flex-1 flex-col justify-center py-14 sm:py-20">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-55">
            {m.concept.id} / {m.concept.name} · {m.tone}
          </p>
          <h1 className="mt-5 max-w-3xl text-[2.4rem] leading-[0.98] font-light tracking-tight text-balance sm:text-6xl lg:text-7xl">
            {m.concept.headline}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed opacity-65">
            {m.concept.sub} Cut for {m.audience.toLowerCase()} on {m.channel.toLowerCase()}.
          </p>

          <div className="mt-10 flex flex-wrap gap-8">
            {[
              ["Reach", `${m.metrics.reach}K`],
              ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
              ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-45">
                  {label}
                </div>
                <div className="mt-1 text-3xl font-light tabular-nums sm:text-4xl">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 h-px w-full bg-current/15" />

          <div className="mt-6 flex flex-wrap gap-2">
            {spec.concepts.map((concept) => {
              const on = m.conceptId === concept.id
              return (
                <button
                  key={concept.id}
                  type="button"
                  onClick={() => m.selectConcept(concept.id)}
                  aria-pressed={on}
                  className="rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:outline-none"
                  style={
                    on
                      ? { backgroundColor: g.ink, color: g.bg, borderColor: g.ink }
                      : { borderColor: "currentColor", opacity: 0.55 }
                  }
                >
                  {concept.id} · {concept.name}
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-current/15 backdrop-blur-xl">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{ backgroundColor: g.bg }}
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDockOpen((value) => !value)}
              aria-expanded={dockOpen}
              className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:outline-none"
            >
              {dockOpen ? "Hide controls" : "Show controls"}
            </button>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px]">
              {m.phase === "loading" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  {m.progress}%
                </>
              ) : m.phase === "success" ? (
                <>
                  <CheckCircle2 className="size-3.5 text-emerald-400" aria-hidden />
                  Graded
                </>
              ) : m.phase === "error" ? (
                <>
                  <AlertCircle className="size-3.5 text-rose-400" aria-hidden />
                  Brief too short
                </>
              ) : (
                <span className="opacity-50">Draft r{m.revision}</span>
              )}
            </span>
          </div>

          {dockOpen ? (
            <div className="mt-3 grid gap-3 border-t border-current/10 pt-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_auto]">
              <label className="block">
                <span className="mb-1 block font-mono text-[10px] tracking-[0.2em] uppercase opacity-45">
                  Brief
                </span>
                <textarea
                  value={m.brief}
                  onChange={(event) => m.setBrief(event.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-md border border-current/20 bg-transparent px-2.5 py-2 text-xs leading-relaxed outline-none focus-visible:border-current/60"
                />
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    ["audience", "Aud", spec.controls.audiences, m.audience],
                    ["channel", "Chan", spec.controls.channels, m.channel],
                    ["tone", "Tone", spec.controls.tones, m.tone],
                    ["style", "Grade", spec.controls.styles, m.style],
                  ] as const
                ).map(([key, label, options, value]) => (
                  <label key={key} className="block">
                    <span className="mb-1 block font-mono text-[10px] tracking-[0.2em] uppercase opacity-45">
                      {label}
                    </span>
                    <select
                      value={value}
                      onChange={(event) => m.setControl(key, event.target.value)}
                      className="w-full rounded-md border border-current/20 bg-transparent px-2 py-1.5 text-xs outline-none focus-visible:border-current/60 [&>option]:text-neutral-900"
                    >
                      {options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={m.generate}
                  disabled={m.phase === "loading"}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:outline-none disabled:opacity-50 lg:flex-none"
                  style={{ backgroundColor: g.ink, color: g.bg }}
                >
                  <Wand2 className="size-3.5" aria-hidden />
                  Generate
                </button>
                <button
                  type="button"
                  onClick={m.save}
                  aria-label="Save"
                  className="rounded-md border border-current/25 p-2 transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:outline-none"
                >
                  <Save className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  aria-label="Export"
                  className="rounded-md border border-current/25 p-2 transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-current/50 focus-visible:outline-none"
                >
                  <Download className="size-3.5" aria-hidden />
                </button>
              </div>
            </div>
          ) : null}

          <p className="mt-2 truncate font-mono text-[10px] opacity-40">
            {m.saved ? "saved · " : ""}
            {m.exported ? "exported · " : ""}
            {m.log[0]}
          </p>
        </div>
      </div>
    </main>
  )
}

