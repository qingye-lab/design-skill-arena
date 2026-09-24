"use client"

import { Courier_Prime, Manrope, Syne } from "next/font/google"
import { CircleAlert, Download, LoaderCircle, RotateCcw, Save, Sparkles } from "lucide-react"
import type { KeyboardEvent } from "react"

import {
  BRIEF_MAX,
  GENERATION_STAGES,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ControlKey,
  type MuseStudio,
  type Option,
  type StudioSpec,
} from "./core"

const display = Syne({ subsets: ["latin"], display: "swap" })
const sans = Manrope({ subsets: ["latin"], display: "swap" })
const mono = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "max-quality-chain",
  product: "Alto Studio Monitor",
  brief:
    "Launch the Alto Studio Monitor: a two-way nearfield with a 5.25 inch paper woofer, DSP room correction over USB-C, and a cabinet damped to stop desktop resonance. Reach producers and podcasters mixing in untreated rooms before the 1 December preorder close.",
  audiences: [
    { id: "producers", label: "Home producers", hint: "mix in a spare room", size: 296000, lift: { ctr: 1.16, conversion: 1.12 } },
    { id: "podcasters", label: "Podcasters", hint: "two mics, one desk", size: 174000, lift: { ctr: 1.08, conversion: 1.26 } },
    { id: "hifi", label: "Desk hi-fi buyers", hint: "listen for pleasure", size: 640000, lift: { ctr: 0.94, conversion: 0.86 } },
  ],
  channels: [
    { id: "review", label: "Reviewer seeding", hint: "1:1 press image", lift: { reach: 0.4, ctr: 1.5, conversion: 1.5 } },
    { id: "youtube", label: "YouTube demo", hint: "16:9, 90 s", lift: { reach: 1.24, ctr: 1.04, conversion: 1.06 } },
    { id: "print", label: "Studio magazine", hint: "A4 full page", lift: { reach: 0.55, ctr: 1.3, conversion: 1.18 } },
  ],
  tones: [
    { id: "measured", label: "Measured", hint: "frequency response first", lift: { conversion: 1.09 } },
    { id: "plain", label: "Plain-spoken", hint: "no audiophile jargon", lift: { ctr: 1.06, conversion: 1.04 } },
    { id: "technical", label: "Technical", hint: "graphs and specs", lift: { ctr: 0.98, conversion: 1.12 } },
  ],
  styles: [
    { id: "studio", label: "Studio black", hint: "near-black, amber meters", lift: { ctr: 1.05 } },
    { id: "concrete", label: "Concrete wall", hint: "grey on grey", lift: { conversion: 1.03 } },
    { id: "duskroom", label: "Dusk room", hint: "warm lamp, dark corners", lift: { reach: 1.04, ctr: 1.02 } },
  ],
  variants: [
    {
      id: "A",
      name: "Room corrected",
      headline: "Your room is the problem. This fixes it.",
      body: "USB-C room correction measures the desk you actually mix on, then flattens what the walls add.",
      cta: "See the calibration",
    },
    {
      id: "B",
      name: "No resonance",
      headline: "Nothing rattles. Not even the desk.",
      body: "A damped cabinet and a rubber-decoupled baffle, so the low end comes from the woofer and not the furniture.",
      cta: "Read the spec sheet",
      lift: { ctr: 1.07, conversion: 1.05 },
    },
    {
      id: "C",
      name: "Preorder",
      headline: "Preorder before 1 December.",
      body: "Built in batches of 200 in Sheffield. A {tone} monitor for {audience} who mix at home.",
      cta: "Reserve a pair",
      lift: { reach: 1.02, conversion: 1.14 },
    },
  ],
  recent: [
    { id: "r1", title: "Alto Sub 8 announce", variant: "A", when: "Sun" },
    { id: "r2", title: "Podcast bundle autumn", variant: "C", when: "12 Sep" },
    { id: "r3", title: "Studio desk clamp stand", variant: "B", when: "25 Aug" },
  ],
  initialRun: 64,
}

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A33D]"

const looks: Record<string, { bg: string; ink: string; sub: string; cta: string; ctaInk: string; accent: string }> = {
  studio: { bg: "#141414", ink: "#F5F3EF", sub: "#B4B0AA", cta: "#E8A33D", ctaInk: "#1A1408", accent: "#E8A33D" },
  concrete: { bg: "#B9B7B2", ink: "#1B1A18", sub: "#3E3C39", cta: "#1B1A18", ctaInk: "#EDEBE7", accent: "#4C4A46" },
  duskroom: { bg: "#3A2A22", ink: "#F7EFE6", sub: "#D3C0B0", cta: "#F0D9B5", ctaInk: "#2E1F17", accent: "#D9A05B" },
}

const frames: Record<string, { ratio: string; width: string; label: string }> = {
  review: { ratio: "1 / 1", width: "min(100%, 20rem)", label: "Press image, 1:1" },
  youtube: { ratio: "16 / 9", width: "100%", label: "Demo cut, 1920 × 1080" },
  print: { ratio: "1 / 1.414", width: "min(100%, 17rem)", label: "Full page, A4" },
}

const CONTROLS: { key: ControlKey; label: string; options: Option[] }[] = [
  { key: "audience", label: "Audience", options: spec.audiences },
  { key: "channel", label: "Channel", options: spec.channels },
  { key: "tone", label: "Tone", options: spec.tones },
  { key: "style", label: "Visual style", options: spec.styles },
]

const METRICS = [
  { key: "reach", label: "Reach" },
  { key: "ctr", label: "CTR" },
  { key: "conversion", label: "Conversion" },
] as const

function state(m: MuseStudio) {
  if (m.busy) return { text: `${m.stageLabel} (${m.progress}%)`, tone: "busy" as const }
  if (m.generateStatus === "error") return { text: "Last build failed", tone: "error" as const }
  if (m.saveStatus === "saving") return { text: "Saving", tone: "busy" as const }
  if (m.exportStatus === "exporting") return { text: "Exporting", tone: "busy" as const }
  if (m.saveStatus === "saved") return { text: `Saved route ${m.selected}`, tone: "ok" as const }
  if (m.exportStatus === "exported") return { text: `Exported route ${m.selected}`, tone: "ok" as const }
  if (m.generateStatus === "success") return { text: `Run ${m.output.run} ready`, tone: "ok" as const }
  if (m.stale) return { text: "Controls changed since the last build", tone: "warn" as const }
  return { text: `Run ${m.output.run} · ${m.output.at}`, tone: "idle" as const }
}

export default function MaxQualityChain() {
  const m = useMuseStudio(spec)
  const briefLength = m.settings.brief.trim().length
  const status = state(m)
  const error = (m.generateStatus === "error" && m.generateError) || (m.saveStatus === "error" && m.saveError) || (m.exportStatus === "error" && m.exportError) || null

  return (
    <div className={`${sans.className} min-h-screen bg-[#0E0E0E] text-[#F5F3EF] antialiased selection:bg-[#E8A33D] selection:text-[#1A1408]`}>
      <style>{`
        .mq-spot { animation: mq-spot 620ms cubic-bezier(0.2, 0.9, 0.2, 1) both; }
        @keyframes mq-spot { from { opacity: 0; transform: translateY(8px) scale(0.99); } to { opacity: 1; transform: none; } }
        .mq-meter { animation: mq-meter 1.4s ease-in-out infinite; }
        @keyframes mq-meter { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @media (prefers-reduced-motion: reduce) { .mq-spot, .mq-meter { animation: none; } }
      `}</style>

      <header className="sticky top-0 z-10 border-b border-[#262626] bg-[#0E0E0E]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:h-16 lg:flex-nowrap lg:py-0">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className={`${display.className} text-[17px] font-extrabold tracking-[-0.02em]`}>Muse</span>
            <h1 className="min-w-0 truncate text-[14px] font-medium text-[#B4B0AA]" translate="no">
              {spec.product}
            </h1>
          </div>
          <p className={`${mono.className} order-last w-full text-[12px] text-[#8E8A85] lg:order-none lg:w-auto lg:flex-1`}>
            {m.modelName} / {m.chain}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={m.generate}
              disabled={m.busy}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-[#E8A33D] px-4 text-[13.5px] font-semibold text-[#1A1408] transition-[background-color,transform] hover:bg-[#F2B75C] active:scale-[0.98] disabled:cursor-progress disabled:opacity-70 ${ring}`}
            >
              {m.busy ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Sparkles aria-hidden className="size-4" />}
              Generate
            </button>
            <button
              type="button"
              onClick={m.save}
              disabled={m.saveStatus === "saving"}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-[#3A3A3A] px-4 text-[13.5px] font-medium transition-colors hover:border-[#5C5C5C] hover:bg-[#1A1A1A] disabled:opacity-70 ${ring}`}
            >
              {m.saveStatus === "saving" ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Save aria-hidden className="size-4" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => m.exportCampaign()}
              disabled={m.exportStatus === "exporting"}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-[#3A3A3A] px-4 text-[13.5px] font-medium transition-colors hover:border-[#5C5C5C] hover:bg-[#1A1A1A] disabled:opacity-70 ${ring}`}
            >
              {m.exportStatus === "exporting" ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Download aria-hidden className="size-4" />}
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 pb-10 pt-6 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start">
          <section aria-labelledby="mq-artefact" className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="mq-artefact" className={`${display.className} text-[30px] leading-[1] font-extrabold tracking-[-0.03em] sm:text-[38px]`}>
                The artefact
              </h2>
              <div role="tablist" aria-label="Routes" className="flex gap-1 rounded-full border border-[#2A2A2A] p-1">
                {VARIANT_IDS.map((id, index) => (
                  <button
                    key={id}
                    id={`mq-route-${id}`}
                    type="button"
                    role="tab"
                    aria-selected={m.selected === id}
                    aria-controls="mq-stage"
                    tabIndex={m.selected === id ? 0 : -1}
                    onClick={() => m.select(id)}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
                      event.preventDefault()
                      const next = VARIANT_IDS[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3]
                      m.select(next)
                      document.getElementById(`mq-route-${next}`)?.focus()
                    }}
                    className={`min-h-10 min-w-[4.5rem] rounded-full px-3 text-[13px] font-semibold transition-colors ${ring} ${
                      m.selected === id ? "bg-[#F5F3EF] text-[#0E0E0E]" : "text-[#B4B0AA] hover:bg-[#1C1C1C] hover:text-[#F5F3EF]"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <p role="alert" className="flex items-start gap-2.5 rounded-2xl border border-[#5A2E22] bg-[#20100C] px-4 py-3 text-[13.5px] text-[#F2C4B6]">
                <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-[#E5764F]" />
                {error}
              </p>
            ) : null}

            <div className="relative overflow-hidden rounded-3xl border border-[#242424] bg-[radial-gradient(120%_90%_at_50%_0%,#232323_0%,#101010_60%)] px-4 py-6 sm:px-8 sm:py-9">
              {m.busy ? (
                <div className="mx-auto flex w-full max-w-[44rem] flex-col gap-3" aria-hidden>
                  <div className="mq-meter h-6 w-4/5 rounded-full bg-[#2A2A2A]" />
                  <div className="mq-meter h-6 w-3/5 rounded-full bg-[#2A2A2A]" />
                  <div className="mq-meter h-24 w-full rounded-2xl bg-[#242424]" />
                  <div className="mq-meter h-10 w-40 rounded-full bg-[#2A2A2A]" />
                </div>
              ) : (
                <div className="mx-auto w-full max-w-[44rem]">
                  <Preview m={m} />
                </div>
              )}

              {m.busy ? (
                <div className="mx-auto mt-5 flex max-w-[44rem] flex-wrap items-center gap-x-4 gap-y-1">
                  {GENERATION_STAGES.map((stage, index) => (
                    <span
                      key={stage}
                      className={`${mono.className} text-[11.5px] ${index === m.stage ? "text-[#E8A33D]" : index < m.stage ? "text-[#7E7A74]" : "text-[#4A4744]"}`}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <p
                role="status"
                aria-live="polite"
                className={`flex min-w-0 items-center gap-2 text-[13px] ${
                  status.tone === "error" ? "text-[#E5764F]" : status.tone === "warn" ? "text-[#E8A33D]" : status.tone === "ok" ? "text-[#8FD3A8]" : "text-[#B4B0AA]"
                }`}
              >
                {m.busy ? <LoaderCircle aria-hidden className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none" /> : null}
                <span className="min-w-0 truncate">{status.text}</span>
              </p>
              <p className={`${mono.className} text-[11.5px] text-[#7E7A74]`}>
                {m.labelOf("audience", m.output.settings.audience)} · {m.labelOf("channel", m.output.settings.channel)} · {m.labelOf("tone", m.output.settings.tone)} tone
              </p>
            </div>

            {m.stale && !m.busy ? (
              <p className="rounded-2xl border border-[#4A3A1E] bg-[#1D1708] px-4 py-3 text-[13.5px] text-[#E8C68C]">
                Out of date. These controls changed after run {m.output.run}; generate again so the artefact and forecast match what you picked.
              </p>
            ) : null}

            <dl className="mt-1 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#242424] bg-[#242424] sm:grid-cols-3">
              {METRICS.map((metric) => {
                const value = m.current.metrics[metric.key]
                const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
                return (
                  <div key={metric.key} className="flex min-w-0 flex-col gap-1.5 bg-[#131313] px-4 py-4">
                    <dt className={`${mono.className} text-[11.5px] text-[#8E8A85]`}>{metric.label}</dt>
                    <dd className={`${display.className} text-[28px] leading-none font-extrabold tabular-nums ${m.busy ? "mq-meter text-[#4A4744]" : ""}`}>
                      {metric.key === "reach" ? formatReach(value) : formatPercent(value)}
                    </dd>
                    <dd className={`${mono.className} text-[11.5px] tabular-nums ${delta?.startsWith("−") ? "text-[#E5764F]" : delta ? "text-[#8FD3A8]" : "text-[#5E5B57]"}`}>
                      {delta ? `${delta} vs run ${Math.max(1, m.output.run - 1)}` : "simulated, first run"}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </section>

          <aside aria-label="Brief, controls and history" className="flex min-w-0 flex-col gap-6">
            <section aria-labelledby="mq-brief" className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="mq-brief" className={`${display.className} text-[15px] font-bold tracking-[-0.01em]`}>
                  Brief
                </h2>
                <span className={`${mono.className} text-[11.5px] tabular-nums ${briefLength > BRIEF_MAX ? "text-[#E5764F]" : "text-[#7E7A74]"}`}>
                  {briefLength}/{BRIEF_MAX}
                </span>
              </div>
              <textarea
                id="mq-brief-field"
                rows={5}
                value={m.settings.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    m.generate()
                  }
                }}
                aria-invalid={m.issue ? true : undefined}
                aria-describedby="mq-brief-help"
                className={`w-full resize-y rounded-2xl border border-[#2A2A2A] bg-[#141414] px-3.5 py-3 text-base leading-[1.55] text-[#F5F3EF] transition-colors placeholder:text-[#6E6B67] hover:border-[#3E3E3E] aria-invalid:border-[#E5764F] lg:text-[14px] ${ring}`}
                placeholder="What is launching, for whom, and by when…"
              />
              <p id="mq-brief-help" className={`text-[12.5px] ${m.issue ? "text-[#E5764F]" : "text-[#8E8A85]"}`}>
                {m.issue ?? "Ctrl or ⌘ + Enter generates."}
              </p>
            </section>

            {CONTROLS.map((control) => (
              <fieldset key={control.key} className="flex min-w-0 flex-col gap-2">
                <legend className={`${display.className} text-[15px] font-bold tracking-[-0.01em]`}>{control.label}</legend>
                <div className="flex flex-col gap-1">
                  {control.options.map((option) => {
                    const checked = m.settings[control.key] === option.id
                    const changed = checked && m.output.settings[control.key] !== option.id
                    return (
                      <label
                        key={option.id}
                        className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-1.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E8A33D] ${
                          checked ? "border-[#E8A33D] bg-[#1C1608]" : "border-[#242424] hover:border-[#3E3E3E] hover:bg-[#161616]"
                        }`}
                      >
                        <input type="radio" name={`mq-${control.key}`} checked={checked} onChange={() => m.setControl(control.key, option.id)} className="sr-only" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium">{option.label}</span>
                          <span className="block truncate text-[12px] text-[#8E8A85]">{option.hint}</span>
                        </span>
                        {changed ? <span className={`${mono.className} shrink-0 text-[11px] text-[#E8A33D]`}>not built</span> : null}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#242424] pt-4">
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[12.5px] text-[#B4B0AA]">
                <input type="checkbox" checked={m.failNext} onChange={(event) => m.setFailNext(event.target.checked)} className={`size-4 accent-[#E5764F] ${ring}`} />
                Fail the next build (forecast outage)
              </label>
              <button
                type="button"
                onClick={m.reset}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-[#B4B0AA] transition-colors hover:bg-[#1A1A1A] hover:text-[#F5F3EF] ${ring}`}
              >
                <RotateCcw aria-hidden className="size-3.5" />
                Reset
              </button>
            </div>

            <section aria-labelledby="mq-recent" className="flex flex-col gap-2 border-t border-[#242424] pt-4">
              <h2 id="mq-recent" className={`${display.className} text-[15px] font-bold tracking-[-0.01em]`}>
                Recent campaigns
              </h2>
              <ul className="flex flex-col">
                {m.recent.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => m.restore(item)}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-2 text-left transition-colors hover:bg-[#1A1A1A] ${ring}`}
                    >
                      <span className={`${mono.className} flex size-6 shrink-0 items-center justify-center rounded-md border border-[#2E2E2E] text-[11.5px] text-[#E8A33D]`}>
                        {item.variant}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13.5px]">{item.title}</span>
                      <span className={`${mono.className} shrink-0 text-[11.5px] text-[#7E7A74]`}>{item.when}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="mq-log" className="flex flex-col gap-2 border-t border-[#242424] pt-4">
              <h2 id="mq-log" className={`${display.className} text-[15px] font-bold tracking-[-0.01em]`}>
                Build log
              </h2>
              <ol className={`${mono.className} flex flex-col gap-1 text-[11.5px] leading-[1.5]`}>
                {m.log.map((entry) => (
                  <li key={entry.id} className="flex gap-2">
                    <span className="shrink-0 text-[#5E5B57] tabular-nums">{entry.at}</span>
                    <span className={`min-w-0 ${entry.tone === "error" ? "text-[#E5764F]" : entry.tone === "success" ? "text-[#8FD3A8]" : "text-[#B4B0AA]"}`}>
                      {entry.text}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

function Preview({ m }: { m: MuseStudio }) {
  const look = looks[m.output.settings.style] ?? looks.studio
  const frame = frames[m.output.settings.channel] ?? frames.youtube
  const v = m.current
  return (
    <figure className="flex flex-col gap-3">
      <article
        key={`${m.output.run}-${m.selected}-${m.output.settings.style}`}
        className="mq-spot mx-auto flex flex-col justify-between gap-5 overflow-hidden rounded-2xl p-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/5 [container-type:inline-size]"
        style={{ aspectRatio: frame.ratio, width: frame.width, background: look.bg, color: look.ink }}
      >
        <div className="flex items-start justify-between gap-3">
          <span aria-hidden className="flex items-center gap-1">
            {[0, 1, 2, 3].map((bar) => (
              <span key={bar} className="w-[3px] rounded-full" style={{ height: `${8 + bar * 5}px`, background: look.accent }} />
            ))}
          </span>
          <span className={`${mono.className} max-w-[55%] truncate text-[10.5px]`} style={{ color: look.sub }}>
            {frame.label}
          </span>
        </div>
        <p className={`${display.className} text-[clamp(1.15rem,7cqw,2.2rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance`}>{v.headline}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-[40ch] min-w-0 flex-1 text-[clamp(0.74rem,3.1cqw,0.95rem)] leading-[1.5]" style={{ color: look.sub }}>
            {v.body}
          </p>
          <span className="shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold" style={{ background: look.cta, color: look.ctaInk }}>
            {v.cta}
          </span>
        </div>
        <p className={`${mono.className} border-t pt-3 text-[10.5px] tracking-[0.14em] uppercase`} style={{ borderColor: look.accent + "44", color: look.sub }}>
          {spec.product}
        </p>
      </article>
    </figure>
  )
}
