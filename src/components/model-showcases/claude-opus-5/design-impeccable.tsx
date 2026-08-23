"use client"

import { Download, Save } from "lucide-react"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-design + impeccable",
  brief:
    "Bring Quarrystone, a slow-set concrete planter range, to balcony gardeners who keep buying plastic pots they hate.",
  controls: {
    audiences: ["Balcony gardeners", "Interior stylists", "Cafe fitouts"],
    channels: ["Home tour feature", "Local market", "Trade catalogue"],
    tones: ["Quiet", "Assertive", "Curious"],
    styles: ["Raw concrete", "Pale sand", "Deep shadow"],
  },
  concepts: [
    {
      id: "A",
      name: "Heavy on Purpose",
      headline: "Heavy enough that the wind stops mattering.",
      sub: "Function route turning weight into the selling point.",
      reach: 366,
      ctr: 5.0,
      conv: 5.7,
    },
    {
      id: "B",
      name: "It Will Stain",
      headline: "It stains. That's the finish, not the flaw.",
      sub: "Honesty route pre-empting the main complaint.",
      reach: 332,
      ctr: 5.7,
      conv: 6.2,
    },
    {
      id: "C",
      name: "Four Sizes",
      headline: "Four sizes, one silhouette, endless arrangement.",
      sub: "System route built for repeat purchase.",
      reach: 424,
      ctr: 4.4,
      conv: 5.1,
    },
  ],
  activity: ["Document opened", "Reading order set"],
}

export default function DesignImpeccable() {
  const m = useMuse(spec)

  return (
    <main className="min-h-screen bg-[#f4f3f0] text-[#1c1c1a]">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#1c1c1a] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#f4f3f0] uppercase">
            {m.modelName}
          </span>
          <span className="rounded-full border border-[#1c1c1a]/20 px-2.5 py-1 font-mono text-[10px] text-[#1c1c1a]/60">
            {m.chain}
          </span>
          <span className="ml-auto font-mono text-[10px] text-[#1c1c1a]/45">Muse · r{m.revision}</span>
        </header>

        <section className="mt-14">
          <p className="font-mono text-[11px] tracking-[0.26em] text-[#1c1c1a]/45 uppercase">
            {m.concept.id} · {m.concept.name}
          </p>
          <h1 className="mt-5 text-[2.2rem] leading-[1.06] font-medium tracking-tight text-balance sm:text-5xl">
            {m.concept.headline}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#1c1c1a]/70">{m.concept.sub}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#1c1c1a]/50">
            Written {m.tone.toLowerCase()} for {m.audience.toLowerCase()}, placed on{" "}
            {m.channel.toLowerCase()}, art-directed {m.style.toLowerCase()}.
          </p>
        </section>

        <section className="mt-12 border-t border-[#1c1c1a]/12 pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-[#1c1c1a]/45 uppercase">
            Forecast
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-6">
            {[
              ["Reach", `${m.metrics.reach}K`],
              ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
              ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-[10px] tracking-[0.18em] text-[#1c1c1a]/45 uppercase">
                  {label}
                </div>
                <div className="mt-1.5 text-3xl leading-none font-medium tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-[#1c1c1a]/12 pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-[#1c1c1a]/45 uppercase">
            Routes
          </h2>
          <div className="mt-4 space-y-2">
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
                      ? "flex w-full items-baseline gap-4 border-l-2 border-[#1c1c1a] bg-white px-4 py-3 text-left"
                      : "flex w-full items-baseline gap-4 border-l-2 border-transparent px-4 py-3 text-left transition-colors hover:border-[#1c1c1a]/30 hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-[#1c1c1a]/25 focus-visible:outline-none"
                  }
                >
                  <span className="font-mono text-[11px] text-[#1c1c1a]/45">{concept.id}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{concept.name}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-[#1c1c1a]/55">
                      {concept.sub}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
        <section className="mt-12 border-t border-[#1c1c1a]/12 pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-[#1c1c1a]/45 uppercase">
            Brief
          </h2>
          <label className="mt-4 block">
            <span className="sr-only">Campaign brief</span>
            <textarea
              value={m.brief}
              onChange={(event) => m.setBrief(event.target.value)}
              rows={4}
              className="w-full resize-y border-b border-[#1c1c1a]/25 bg-transparent pb-2 text-sm leading-relaxed outline-none focus-visible:border-[#1c1c1a]"
            />
          </label>
          <p className="mt-2 text-[11px] text-[#1c1c1a]/45">
            {m.brief.trim().length} characters · 28 needed to forecast
          </p>

          <div className="mt-7 space-y-5">
            {(
              [
                ["audience", "Audience", spec.controls.audiences, m.audience],
                ["channel", "Channel", spec.controls.channels, m.channel],
                ["tone", "Tone", spec.controls.tones, m.tone],
                ["style", "Style", spec.controls.styles, m.style],
              ] as const
            ).map(([key, label, options, value]) => (
              <div key={key} className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="w-20 shrink-0 font-mono text-[10px] tracking-[0.18em] text-[#1c1c1a]/45 uppercase">
                  {label}
                </span>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {options.map((option) => {
                    const on = option === value
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => m.setControl(key, option)}
                        aria-pressed={on}
                        className={
                          on
                            ? "text-sm font-medium underline decoration-2 underline-offset-4"
                            : "text-sm text-[#1c1c1a]/45 transition-colors hover:text-[#1c1c1a] focus-visible:ring-2 focus-visible:ring-[#1c1c1a]/25 focus-visible:outline-none"
                        }
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-[#1c1c1a]/12 pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={m.generate}
              disabled={m.phase === "loading"}
              className="rounded-full bg-[#1c1c1a] px-6 py-2.5 text-xs font-semibold tracking-[0.16em] text-[#f4f3f0] uppercase transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#1c1c1a]/40 focus-visible:outline-none disabled:opacity-50"
            >
              {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
            </button>
            <button
              type="button"
              onClick={m.save}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1c1c1a]/25 px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#1c1c1a] focus-visible:ring-2 focus-visible:ring-[#1c1c1a]/25 focus-visible:outline-none"
            >
              <Save className="size-3" aria-hidden />
              {m.saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={m.exportCampaign}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1c1c1a]/25 px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#1c1c1a] focus-visible:ring-2 focus-visible:ring-[#1c1c1a]/25 focus-visible:outline-none"
            >
              <Download className="size-3" aria-hidden />
              {m.exported ? "Exported" : "Export"}
            </button>
          </div>

          {m.phase === "loading" ? (
            <div className="mt-5 h-px w-full bg-[#1c1c1a]/15">
              <div
                className="h-full bg-[#1c1c1a] transition-all duration-200"
                style={{ width: `${m.progress}%` }}
              />
            </div>
          ) : null}

          <p
            role="status"
            className={
              m.phase === "error"
                ? "mt-5 border-l-2 border-rose-700 pl-3 text-xs text-rose-800"
                : m.phase === "success"
                  ? "mt-5 border-l-2 border-emerald-700 pl-3 text-xs text-emerald-800"
                  : "mt-5 text-xs text-[#1c1c1a]/50"
            }
          >
            {m.phase === "error"
              ? "Brief needs more substance before a forecast can run."
              : m.phase === "success"
                ? "Forecast rebuilt for the selected route."
                : m.phase === "loading"
                  ? "Sampling routes."
                  : "Draft state. Everything on this page reads top to bottom in one column."}
          </p>
        </section>

        <section className="mt-12 border-t border-[#1c1c1a]/12 pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.22em] text-[#1c1c1a]/45 uppercase">
            Recent
          </h2>
          <ol className="mt-3 space-y-1.5">
            {m.log.map((entry, index) => (
              <li key={`${entry}-${index}`} className="flex gap-3 text-xs text-[#1c1c1a]/55">
                <span className="font-mono text-[#1c1c1a]/30">
                  {String(m.log.length - index).padStart(2, "0")}
                </span>
                {entry}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}

