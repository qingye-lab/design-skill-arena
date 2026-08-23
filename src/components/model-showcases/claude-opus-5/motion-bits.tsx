"use client"

import { Download, MoveRight, Save, Waves } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "react-bits",
  brief:
    "Announce Pulseform, a wearable that scores recovery instead of activity, to athletes who already train too much.",
  controls: {
    audiences: ["Overtrainers", "Masters athletes", "Coaches"],
    channels: ["Endurance podcast", "Race expo", "Strava community"],
    tones: ["Charged", "Level", "Coaching"],
    styles: ["Signal green", "Heat map", "Night run"],
  },
  concepts: [
    {
      id: "A",
      name: "Rest Is Training",
      headline: "The session you skip is the one that works.",
      sub: "Counter-intuitive route that reframes rest as effort.",
      reach: 436,
      ctr: 4.9,
      conv: 5.2,
    },
    {
      id: "B",
      name: "Score the Night",
      headline: "Your best split starts eight hours earlier.",
      sub: "Sleep route connecting recovery score to race day.",
      reach: 384,
      ctr: 5.3,
      conv: 5.8,
    },
    {
      id: "C",
      name: "Red Day",
      headline: "It tells you to stop. Loudly.",
      sub: "Intervention route built on a single blunt signal.",
      reach: 468,
      ctr: 4.4,
      conv: 4.9,
    },
  ],
  activity: ["Motion layer mounted", "Reduced-motion respected"],
}

const palette: Record<string, { accent: string; bg: string }> = {
  "Signal green": { accent: "#3ddc84", bg: "#07120c" },
  "Heat map": { accent: "#ff6b3d", bg: "#170a06" },
  "Night run": { accent: "#7aa2ff", bg: "#080b18" },
}

export default function MotionBits() {
  const m = useMuse(spec)
  const p = palette[m.style] ?? palette["Signal green"]
  const beat = `${m.conceptId}|${m.style}|${m.tone}|${m.audience}|${m.channel}`

  const bars = Array.from({ length: 28 }, (_, index) => {
    const wave = Math.sin((index + m.seed) / 2.4) * 0.5 + 0.5
    return 18 + wave * (m.metrics.ctr * 11)
  })

  return (
    <main
      className="min-h-screen overflow-hidden transition-colors duration-700 motion-reduce:transition-none"
      style={{ backgroundColor: p.bg, color: "#f6f7f5" }}
    >
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-9">
        <header className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Waves className="size-4 animate-pulse motion-reduce:animate-none" style={{ color: p.accent }} aria-hidden />
            Muse
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] uppercase"
            style={{ backgroundColor: p.accent, color: p.bg }}
          >
            {m.modelName}
          </span>
          <span className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[10px] text-white/70">
            {m.chain}
          </span>
        </header>

        <section
          key={beat}
          className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none"
        >
          <p
            className="font-mono text-[11px] tracking-[0.26em] uppercase"
            style={{ color: p.accent }}
          >
            {m.concept.id} — {m.concept.name}
          </p>
          <h1 className="mt-4 max-w-3xl text-[2.3rem] leading-[0.98] font-bold tracking-tight text-balance sm:text-6xl">
            {m.concept.headline}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
            {m.concept.sub} Voiced {m.tone.toLowerCase()} for {m.audience.toLowerCase()} on{" "}
            {m.channel.toLowerCase()}.
          </p>
        </section>

        <div
          className="mt-9 flex h-28 items-end gap-1 overflow-hidden sm:h-36"
          aria-hidden
        >
          {bars.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-t-sm transition-all duration-500 ease-out motion-reduce:transition-none"
              style={{
                height: `${height}%`,
                backgroundColor: p.accent,
                opacity: 0.22 + (index % 5) * 0.14,
                transitionDelay: `${index * 14}ms`,
              }}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["Reach", `${m.metrics.reach}K`],
            ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
            ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
          ].map(([label, value], index) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                {label}
              </div>
              <div className="mt-1 text-3xl font-bold tabular-nums">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {spec.concepts.map((concept) => {
            const on = m.conceptId === concept.id
            return (
              <button
                key={concept.id}
                type="button"
                onClick={() => m.selectConcept(concept.id)}
                aria-pressed={on}
                className="group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                style={{
                  borderColor: on ? p.accent : "rgba(255,255,255,0.14)",
                  backgroundColor: on ? "rgba(255,255,255,0.07)" : "transparent",
                }}
              >
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                  style={{ backgroundColor: p.accent, transform: on ? "scaleX(1)" : undefined }}
                  aria-hidden
                />
                <span className="flex items-center gap-2 text-xs font-bold">
                  {concept.id}
                  <MoveRight
                    className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
                <span className="mt-1 block text-sm font-semibold">{concept.name}</span>
                <span className="mt-1 block text-[11px] leading-snug text-white/55">
                  {concept.sub}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-3">
            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                Brief
              </span>
              <textarea
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={3}
                className="mt-1.5 w-full resize-y rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-xs leading-relaxed outline-none transition-colors focus-visible:border-white/50"
              />
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {(
                [
                  ["audience", "Audience", spec.controls.audiences, m.audience],
                  ["channel", "Channel", spec.controls.channels, m.channel],
                  ["tone", "Tone", spec.controls.tones, m.tone],
                  ["style", "Palette", spec.controls.styles, m.style],
                ] as const
              ).map(([key, label, options, value]) => (
                <label key={key} className="block">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
                    {label}
                  </span>
                  <select
                    value={value}
                    onChange={(event) => m.setControl(key, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.03] px-2 py-1.5 text-[11px] outline-none focus-visible:border-white/50 [&>option]:text-neutral-900"
                  >
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={m.generate}
              disabled={m.phase === "loading"}
              className="relative w-full overflow-hidden rounded-lg px-4 py-2.5 text-xs font-bold tracking-[0.14em] uppercase transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:scale-100"
              style={{ backgroundColor: p.accent, color: p.bg }}
            >
              {m.phase === "loading" ? (
                <span className="absolute inset-y-0 left-0 bg-black/20 transition-all duration-200" style={{ width: `${m.progress}%` }} aria-hidden />
              ) : null}
              <span className="relative">
                {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
              </span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={m.save}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              >
                <Save className="size-3" aria-hidden />
                {m.saved ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={m.exportCampaign}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
              >
                <Download className="size-3" aria-hidden />
                {m.exported ? "Exported" : "Export"}
              </button>
            </div>
            <p
              role="status"
              className={
                m.phase === "error"
                  ? "rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200"
                  : m.phase === "success"
                    ? "rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200"
                    : "rounded-lg border border-white/10 px-3 py-2 text-[11px] text-white/50"
              }
            >
              {m.phase === "error"
                ? "Brief too short. Waveform held at last good state."
                : m.phase === "success"
                  ? "Waveform and metrics re-animated."
                  : m.phase === "loading"
                    ? "Sampling routes."
                    : `Draft r${m.revision}`}
            </p>
            <ul className="space-y-1 pt-1">
              {m.log.map((entry, index) => (
                <li
                  key={`${entry}-${index}`}
                  className="truncate font-mono text-[10px] text-white/40"
                >
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

