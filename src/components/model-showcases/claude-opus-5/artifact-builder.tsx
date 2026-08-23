"use client"

import { useState } from "react"
import { Braces, Download, Monitor, Save, Smartphone, Tablet, Zap } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "web-artifacts-builder / artifacts-builder",
  brief:
    "Ship Tessera, a browser-based tile pattern generator, to independent designers who currently fake patterns by hand.",
  controls: {
    audiences: ["Freelance designers", "Print shops", "Ceramics studios"],
    channels: ["Product Hunt", "Design newsletter", "Template gallery"],
    tones: ["Playful", "Matter-of-fact", "Nerdy"],
    styles: ["Terrazzo", "Isometric", "Monoline"],
  },
  concepts: [
    {
      id: "A",
      name: "Infinite Repeat",
      headline: "One tile. Every wall you'll ever need.",
      sub: "Scale route showing a single tile tiling out endlessly.",
      reach: 392,
      ctr: 4.7,
      conv: 5.2,
    },
    {
      id: "B",
      name: "Seed and Shuffle",
      headline: "Change one number. Get a different floor.",
      sub: "Parametric route where the seed is the hero.",
      reach: 348,
      ctr: 5.5,
      conv: 6.0,
    },
    {
      id: "C",
      name: "Export Ready",
      headline: "SVG out, no cleanup pass.",
      sub: "Workflow route aimed at production handoff.",
      reach: 428,
      ctr: 4.4,
      conv: 5.6,
    },
  ],
  activity: ["Artifact mounted", "Canvas ready"],
}

const viewports = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "34rem" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "20rem" },
] as const

const swatch: Record<string, string[]> = {
  Terrazzo: ["#e8574c", "#f2c14e", "#2f5d62", "#f4efe7"],
  Isometric: ["#3b4cca", "#7d8ef0", "#141a3c", "#e9ecfb"],
  Monoline: ["#1b1b1b", "#6b6b6b", "#c9c9c9", "#fafafa"],
}

export default function ArtifactBuilder() {
  const m = useMuse(spec)
  const [viewport, setViewport] = useState<(typeof viewports)[number]["id"]>("desktop")
  const [showSpec, setShowSpec] = useState(false)
  const colors = swatch[m.style] ?? swatch.Terrazzo
  const active = viewports.find((item) => item.id === viewport) ?? viewports[0]

  return (
    <main className="min-h-screen bg-[#1c1c1f] text-zinc-100">
      <div className="flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-2.5 sm:px-6">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Zap className="size-4 text-lime-400" aria-hidden />
            Muse Artifact
          </span>
          <span className="rounded bg-lime-400 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#1c1c1f] uppercase">
            {m.modelName}
          </span>
          <span className="max-w-full truncate rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
            {m.chain}
          </span>

          <div
            className="ml-auto flex items-center gap-0.5 rounded-md bg-white/5 p-0.5"
            role="group"
            aria-label="Viewport"
          >
            {viewports.map((item) => {
              const Icon = item.icon
              const on = viewport === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setViewport(item.id)}
                  aria-pressed={on}
                  aria-label={item.label}
                  className={
                    on
                      ? "rounded bg-white/15 p-1.5 text-lime-300"
                      : "rounded p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-lime-400/60 focus-visible:outline-none"
                  }
                >
                  <Icon className="size-3.5" aria-hidden />
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setShowSpec((value) => !value)}
            aria-pressed={showSpec}
            className={
              showSpec
                ? "rounded-md bg-white/15 p-1.5 text-lime-300"
                : "rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime-400/60 focus-visible:outline-none"
            }
            aria-label="Toggle spec panel"
          >
            <Braces className="size-3.5" aria-hidden />
          </button>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <section className="flex flex-1 flex-col items-center overflow-hidden bg-[#26262a] p-4 sm:p-8">
            <div className="mb-2 font-mono text-[10px] text-zinc-500">
              {active.label} · {active.width}
            </div>
            <div
              className="w-full overflow-hidden rounded-xl bg-white text-zinc-900 shadow-2xl transition-all duration-500"
              style={{ maxWidth: active.width }}
            >
              <div className="flex h-7 items-center gap-1.5 border-b border-zinc-200 bg-zinc-100 px-3">
                {["#f87171", "#fbbf24", "#4ade80"].map((dot) => (
                  <span
                    key={dot}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: dot }}
                    aria-hidden
                  />
                ))}
                <span className="ml-2 font-mono text-[10px] text-zinc-400">
                  tessera / route-{m.conceptId.toLowerCase()}
                </span>
              </div>
              <div className="p-5 sm:p-8">
                <div className="flex gap-1" aria-hidden>
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="h-8 flex-1 rounded transition-colors duration-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="mt-5 font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: colors[0] }}>
                  {m.concept.id} · {m.concept.name}
                </p>
                <h1 className="mt-2 text-xl leading-tight font-bold tracking-tight text-balance sm:text-3xl">
                  {m.concept.headline}
                </h1>
                <p className="mt-2 text-sm text-zinc-600">{m.concept.sub}</p>
                <p className="mt-3 text-xs text-zinc-500">
                  {m.audience} · {m.channel} · {m.tone}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-zinc-200 pt-4">
                  {[
                    ["Reach", `${m.metrics.reach}K`],
                    ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                    ["Conv", `${m.metrics.conv.toFixed(1)}%`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="font-mono text-[9px] tracking-wider text-zinc-400 uppercase">
                        {label}
                      </div>
                      <div className="text-lg font-bold tabular-nums">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
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
                        ? "rounded-md bg-lime-400 px-3 py-1.5 text-xs font-bold text-[#1c1c1f]"
                        : "rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-lime-400/60 hover:text-lime-200 focus-visible:ring-2 focus-visible:ring-lime-400/60 focus-visible:outline-none"
                    }
                  >
                    {concept.id} · {concept.name}
                  </button>
                )
              })}
            </div>
          </section>
          <aside className="w-full shrink-0 space-y-4 border-t border-white/10 bg-[#1c1c1f] p-4 lg:w-80 lg:border-t-0 lg:border-l">
            <div>
              <label
                htmlFor="ab-brief"
                className="font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase"
              >
                brief
              </label>
              <textarea
                id="ab-brief"
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={4}
                className="mt-1.5 w-full resize-y rounded-md border border-white/15 bg-black/30 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-zinc-200 outline-none focus-visible:border-lime-400/70 focus-visible:ring-2 focus-visible:ring-lime-400/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  ["audience", "audience", spec.controls.audiences, m.audience],
                  ["channel", "channel", spec.controls.channels, m.channel],
                  ["tone", "tone", spec.controls.tones, m.tone],
                  ["style", "style", spec.controls.styles, m.style],
                ] as const
              ).map(([key, label, options, value]) => (
                <label key={key} className="block">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
                    {label}
                  </span>
                  <select
                    value={value}
                    onChange={(event) => m.setControl(key, event.target.value)}
                    className="mt-1 w-full rounded-md border border-white/15 bg-black/30 px-2 py-1.5 text-[11px] text-zinc-200 outline-none focus-visible:border-lime-400/70 [&>option]:text-zinc-900"
                  >
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {showSpec ? (
              <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/50 p-2.5 font-mono text-[10px] leading-relaxed text-lime-300">
                {JSON.stringify(
                  {
                    route: m.conceptId,
                    audience: m.audience,
                    channel: m.channel,
                    tone: m.tone,
                    style: m.style,
                    metrics: m.metrics,
                    revision: m.revision,
                  },
                  null,
                  2
                )}
              </pre>
            ) : null}

            <div className="space-y-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="w-full rounded-md bg-lime-400 px-3 py-2 text-xs font-bold tracking-wide text-[#1c1c1f] uppercase transition-colors hover:bg-lime-300 focus-visible:ring-2 focus-visible:ring-lime-400/60 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? `building ${m.progress}%` : "generate"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-2 py-2 text-[11px] font-semibold text-zinc-300 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime-400/50 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "saved" : "save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-2 py-2 text-[11px] font-semibold text-zinc-300 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-lime-400/50 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "exported" : "export"}
                </button>
              </div>
            </div>

            <div
              role="status"
              className={
                m.phase === "error"
                  ? "rounded-md border border-rose-500/40 bg-rose-500/10 px-2.5 py-2 font-mono text-[10px] text-rose-300"
                  : m.phase === "success"
                    ? "rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-2 font-mono text-[10px] text-emerald-300"
                    : "rounded-md border border-white/10 px-2.5 py-2 font-mono text-[10px] text-zinc-500"
              }
            >
              {m.phase === "error"
                ? "error: brief too short to build"
                : m.phase === "success"
                  ? "ok: artifact rebuilt"
                  : m.phase === "loading"
                    ? `building… ${m.progress}%`
                    : `idle · r${m.revision}`}
            </div>

            <div>
              <h2 className="font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase">
                log
              </h2>
              <ul className="mt-1.5 space-y-1">
                {m.log.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="truncate font-mono text-[10px] text-zinc-400"
                  >
                    <span className="text-zinc-600">$ </span>
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

