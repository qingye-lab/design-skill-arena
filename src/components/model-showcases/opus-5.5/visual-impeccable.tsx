"use client"

import { Bricolage_Grotesque, Space_Mono } from "next/font/google"
import { CircleAlert, Download, LoaderCircle, RotateCcw, Save, Zap } from "lucide-react"
import type { KeyboardEvent } from "react"

import {
  BRIEF_MAX,
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

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" })
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "visual-impeccable",
  product: "Lumen Beam 900",
  brief:
    "Launch the Lumen Beam 900, a 900 lumen bike light with a cut-off beam that lights the road without blinding drivers, 11 hours on one charge. Commuters who ride after dark are the core buyers. Clocks go back on 26 October; be on every street before then.",
  audiences: [
    { id: "commuters", label: "Winter commuters", hint: "ride home in the dark", size: 740000, lift: { ctr: 1.1, conversion: 1.12 } },
    { id: "couriers", label: "Couriers", hint: "eight hours a night", size: 52000, lift: { ctr: 1.28, conversion: 1.5 } },
    { id: "parents", label: "School-run parents", hint: "cargo bikes, two kids", size: 380000, lift: { ctr: 0.96, conversion: 1.04 } },
  ],
  channels: [
    { id: "shelter", label: "Bus shelter poster", hint: "2:3 six-sheet", lift: { reach: 1.3, ctr: 0.7, conversion: 0.9 } },
    { id: "feed", label: "Instagram feed", hint: "1:1 square", lift: { reach: 1.05, ctr: 1.1 } },
    { id: "banner", label: "Newsletter banner", hint: "3:1 strip", lift: { reach: 0.5, ctr: 1.7, conversion: 1.2 } },
  ],
  tones: [
    { id: "blunt", label: "Blunt", hint: "short, loud, true", lift: { ctr: 1.08 } },
    { id: "reassuring", label: "Reassuring", hint: "safe home", lift: { conversion: 1.08 } },
    { id: "cheeky", label: "Cheeky", hint: "drivers will notice", lift: { ctr: 1.12, conversion: 0.95 } },
  ],
  styles: [
    { id: "night", label: "Night road", hint: "navy with a yellow beam", lift: { ctr: 1.05 } },
    { id: "signal", label: "Signal yellow", hint: "yellow ground, navy type", lift: { reach: 1.04 } },
    { id: "rain", label: "Wet tarmac", hint: "slate and white light", lift: { conversion: 1.03 } },
  ],
  variants: [
    {
      id: "A",
      name: "See the road",
      headline: "See the road. Not the glare.",
      body: "900 lumens with a cut-off beam, so the light lands on tarmac instead of in a driver's eyes.",
      cta: "Ride with Beam",
    },
    {
      id: "B",
      name: "Eleven hours",
      headline: "Eleven hours of daylight, after dark.",
      body: "One charge covers a week of commutes. Built for {audience} who leave after sunset.",
      cta: "Charge once a week",
      lift: { reach: 1.04, conversion: 1.05 },
    },
    {
      id: "C",
      name: "Clocks go back",
      headline: "The clocks go back. Your light goes on.",
      body: "26 October is the first dark ride home. The {product} is in shops before it.",
      cta: "Find a shop",
      lift: { ctr: 1.1, conversion: 0.94 },
    },
  ],
  recent: [
    { id: "r1", title: "Lumen Rear 60 relaunch", variant: "A", when: "Thu" },
    { id: "r2", title: "Helmet light bundle", variant: "C", when: "17 Sep" },
    { id: "r3", title: "Summer touring kit", variant: "B", when: "2 Sep" },
  ],
  initialRun: 9,
}

const looks: Record<string, { bg: string; ink: string; sub: string; beam: string; cta: string; ctaInk: string }> = {
  night: { bg: "#0F1A2B", ink: "#FFFFFF", sub: "#B9C4D6", beam: "#FFD23F", cta: "#FFD23F", ctaInk: "#0F1A2B" },
  signal: { bg: "#FFD23F", ink: "#0F1A2B", sub: "#3A3522", beam: "#FFFFFF", cta: "#0F1A2B", ctaInk: "#FFD23F" },
  rain: { bg: "#3C4A5C", ink: "#FFFFFF", sub: "#D5DDE7", beam: "#E9F0F8", cta: "#FFFFFF", ctaInk: "#1D2733" },
}

const frames: Record<string, { ratio: string; label: string; head: string; wide: boolean }> = {
  shelter: { ratio: "2 / 3", label: "Six-sheet, 1200 × 1800 mm", head: "clamp(2rem, 13cqw, 5.4rem)", wide: false },
  feed: { ratio: "1 / 1", label: "Feed post, 1080 × 1080", head: "clamp(1.8rem, 10cqw, 4.4rem)", wide: false },
  banner: { ratio: "3 / 1", label: "Banner, 1200 × 400", head: "clamp(1.2rem, 5.2cqw, 2.8rem)", wide: true },
}

const CONTROLS: { key: ControlKey; label: string; options: Option[] }[] = [
  { key: "audience", label: "Audience", options: spec.audiences },
  { key: "channel", label: "Channel", options: spec.channels },
  { key: "tone", label: "Tone", options: spec.tones },
  { key: "style", label: "Visual style", options: spec.styles },
]

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD23F]"

function status(m: MuseStudio) {
  if (m.busy) return `Printing run ${m.output.run + 1}: ${m.stageLabel.toLowerCase()}, ${m.progress}%`
  if (m.generateStatus === "error") return "Run stopped before printing"
  if (m.saveStatus === "saving") return "Saving poster"
  if (m.exportStatus === "exporting") return "Packing export"
  if (m.saveStatus === "saved") return `Poster ${m.selected} saved`
  if (m.exportStatus === "exported") return `Poster ${m.selected} exported`
  if (m.generateStatus === "success") return `Run ${m.output.run} printed, three posters`
  if (m.stale) return "Controls changed, poster not reprinted"
  return `Run ${m.output.run}, printed ${m.output.at}`
}

export default function VisualImpeccable() {
  const m = useMuseStudio(spec)

  return (
    <div className={`${display.className} min-h-screen bg-[#0B1320] text-white antialiased selection:bg-[#FFD23F] selection:text-[#0F1A2B] lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:overflow-hidden`}>
      <style>{`
        .vi-beam { transform-origin: 0% 50%; animation: vi-beam 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes vi-beam { from { opacity: 0; transform: rotate(-14deg) scaleX(0.4); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .vi-beam { animation: none; } }
      `}</style>

      <Stage m={m} />

      <aside aria-label="Campaign controls" className="flex min-w-0 flex-col border-[#22324A] bg-[#0F1A2B] lg:h-dvh lg:overflow-y-auto lg:border-l">
        <header className="flex items-center justify-between gap-3 border-b border-[#22324A] px-5 py-3">
          <h1 className="text-[18px] leading-tight font-extrabold tracking-[-0.02em]">
            Muse <span className="font-medium text-[#B9C4D6]">poster room</span>
          </h1>
          <p role="status" aria-live="polite" className={`${mono.className} flex min-w-0 items-center gap-1.5 text-right text-[11px] text-[#B9C4D6]`}>
            {m.busy ? <LoaderCircle aria-hidden className="size-3 shrink-0 animate-spin text-[#FFD23F] motion-reduce:animate-none" /> : null}
            <span className="min-w-0 truncate">{status(m)}</span>
          </p>
        </header>

        <div className="flex flex-col gap-4 px-5 py-4">
          <BriefField m={m} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CONTROLS.map((control) => (
              <div key={control.key} className="flex min-w-0 flex-col gap-1">
                <label htmlFor={`vi-${control.key}`} className="text-[13px] font-semibold">
                  {control.label}
                  {m.settings[control.key] !== m.output.settings[control.key] ? (
                    <span className="ml-1.5 font-normal text-[#FFD23F]">changed</span>
                  ) : null}
                </label>
                <select
                  id={`vi-${control.key}`}
                  value={m.settings[control.key]}
                  onChange={(event) => m.setControl(control.key, event.target.value)}
                  className={`min-h-11 w-full cursor-pointer rounded-none border-b-2 border-[#33476A] bg-[#0F1A2B] px-0 text-base font-medium text-white transition-colors hover:border-[#FFD23F] lg:min-h-10 lg:text-[15px] ${ring}`}
                  style={{ colorScheme: "dark" }}
                >
                  {control.options.map((option) => (
                    <option key={option.id} value={option.id} style={{ backgroundColor: "#0F1A2B", color: "#FFFFFF" }}>
                      {option.label}, {option.hint}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <Routes m={m} />
          <Numbers m={m} />
          <Errors m={m} />

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={m.generate}
              disabled={m.busy}
              className={`inline-flex min-h-12 items-center justify-center gap-2 bg-[#FFD23F] px-3 text-[15px] font-extrabold text-[#0F1A2B] transition-[background-color,transform] hover:bg-[#FFE07A] active:translate-y-px disabled:cursor-progress disabled:opacity-75 ${ring}`}
            >
              {m.busy ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Zap aria-hidden className="size-4" />}
              Generate
            </button>
            <button
              type="button"
              onClick={m.save}
              disabled={m.saveStatus === "saving"}
              className={`inline-flex min-h-12 items-center justify-center gap-2 border border-[#33476A] px-3 text-[15px] font-bold transition-colors hover:border-white hover:bg-[#16243A] disabled:opacity-70 ${ring}`}
            >
              {m.saveStatus === "saving" ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Save aria-hidden className="size-4" />}
              Save
            </button>
            <button
              type="button"
              onClick={() => m.exportCampaign()}
              disabled={m.exportStatus === "exporting"}
              className={`inline-flex min-h-12 items-center justify-center gap-2 border border-[#33476A] px-3 text-[15px] font-bold transition-colors hover:border-white hover:bg-[#16243A] disabled:opacity-70 ${ring}`}
            >
              {m.exportStatus === "exporting" ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Download aria-hidden className="size-4" />}
              Export
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[13px] text-[#B9C4D6]">
              <input type="checkbox" checked={m.failNext} onChange={(event) => m.setFailNext(event.target.checked)} className={`size-4 accent-[#FF6B5B] ${ring}`} />
              Make the next print fail (forecast outage)
            </label>
            <button type="button" onClick={m.reset} className={`inline-flex min-h-10 items-center gap-1.5 px-1 text-[13px] text-[#B9C4D6] underline-offset-4 hover:text-white hover:underline ${ring}`}>
              <RotateCcw aria-hidden className="size-3.5" />
              Reset
            </button>
          </div>
        </div>

        <Archive m={m} />
      </aside>
    </div>
  )
}

function BriefField({ m }: { m: MuseStudio }) {
  const length = m.settings.brief.trim().length
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor="vi-brief" className="text-[13px] font-semibold">
          Brief
        </label>
        <span className={`${mono.className} text-[11px] tabular-nums ${length > BRIEF_MAX ? "text-[#FF8A7D]" : "text-[#8E9BB0]"}`}>
          {length}/{BRIEF_MAX}
        </span>
      </div>
      <textarea
        id="vi-brief"
        rows={3}
        value={m.settings.brief}
        onChange={(event) => m.setBrief(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            m.generate()
          }
        }}
        aria-invalid={m.issue ? true : undefined}
        aria-describedby={m.issue ? "vi-brief-issue" : undefined}
        className={`w-full resize-y border border-[#33476A] bg-[#0B1320] px-3 py-2.5 text-base leading-[1.5] text-white placeholder:text-[#8E9BB0] hover:border-[#4A6189] aria-invalid:border-[#FF8A7D] lg:text-[14px] ${ring}`}
        placeholder="What is launching, for whom, and by when…"
      />
      {m.issue ? (
        <p id="vi-brief-issue" className="flex items-start gap-1.5 text-[13px] text-[#FF8A7D]">
          <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {m.issue}
        </p>
      ) : null}
    </div>
  )
}

function Routes({ m }: { m: MuseStudio }) {
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = VARIANT_IDS[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3]
    m.select(next)
    document.getElementById(`vi-route-${next}`)?.focus()
  }
  return (
    <div>
      <p id="vi-routes" className="mb-1.5 text-[13px] font-semibold">
        Poster
      </p>
      <div role="tablist" aria-labelledby="vi-routes" className="grid grid-cols-3 gap-2">
        {VARIANT_IDS.map((id, index) => {
          const active = id === m.selected
          return (
            <button
              key={id}
              id={`vi-route-${id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="vi-poster"
              tabIndex={active ? 0 : -1}
              onClick={() => m.select(id)}
              onKeyDown={(event) => onKey(event, index)}
              className={`group flex min-h-16 min-w-0 flex-col items-start justify-between px-2.5 py-2 text-left transition-colors ${ring} ${
                active ? "bg-white text-[#0F1A2B]" : "bg-[#16243A] text-white hover:bg-[#1E3150]"
              }`}
            >
              <span className="text-[26px] leading-none font-extrabold">{id}</span>
              <span className={`w-full truncate text-[12px] ${active ? "text-[#3A4A63]" : "text-[#B9C4D6]"}`}>{m.output.variants[id].name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const METRICS = [
  { key: "reach", label: "Reach" },
  { key: "ctr", label: "CTR" },
  { key: "conversion", label: "Conversion" },
] as const

function Numbers({ m }: { m: MuseStudio }) {
  return (
    <section aria-labelledby="vi-numbers" className="border-y border-[#22324A] py-3">
      <h2 id="vi-numbers" className="flex items-baseline justify-between text-[13px] font-semibold">
        Forecast for poster {m.selected}
        <span className={`${mono.className} text-[11px] font-normal text-[#8E9BB0]`}>simulated</span>
      </h2>
      <dl className="mt-2 grid grid-cols-3 gap-3">
        {METRICS.map((metric) => {
          const value = m.current.metrics[metric.key]
          const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
          return (
            <div key={metric.key} className="min-w-0">
              <dt className="text-[12px] text-[#B9C4D6]">{metric.label}</dt>
              <dd className={`text-[26px] leading-tight font-extrabold tracking-[-0.03em] tabular-nums ${m.busy ? "opacity-40" : ""} transition-opacity`}>
                {metric.key === "reach" ? formatReach(value) : formatPercent(value)}
              </dd>
              <dd className={`${mono.className} text-[11px] tabular-nums ${delta?.startsWith("−") ? "text-[#FF8A7D]" : delta ? "text-[#FFD23F]" : "text-[#8E9BB0]"}`}>
                {delta ?? "first print"}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

function Errors({ m }: { m: MuseStudio }) {
  const message =
    (m.generateStatus === "error" && m.generateError) || (m.saveStatus === "error" && m.saveError) || (m.exportStatus === "error" && m.exportError) || null
  if (!message) return null
  return (
    <p role="alert" className="flex items-start gap-2 bg-[#3A1612] px-3 py-2.5 text-[14px] text-[#FFD9D3]">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-[#FF8A7D]" />
      {message}
    </p>
  )
}

function Stage({ m }: { m: MuseStudio }) {
  const look = looks[m.output.settings.style] ?? looks.night
  const frame = frames[m.output.settings.channel] ?? frames.shelter
  const variant = m.current
  return (
    <main className="relative flex min-w-0 flex-col bg-[#0B1320] lg:h-dvh">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pt-4 lg:px-8">
        <p className="text-[14px] font-semibold">
          <span translate="no">{spec.product}</span>
          <span className="text-[#8E9BB0]"> launch, poster {variant.id}</span>
        </p>
        <p className={`${mono.className} text-[11px] text-[#8E9BB0]`}>{frame.label}</p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-5 lg:px-8">
        <div
          id="vi-poster"
          role="tabpanel"
          aria-labelledby={`vi-route-${m.selected}`}
          className="relative w-full [container-type:inline-size]"
          style={{ aspectRatio: frame.ratio, maxHeight: "100%", maxWidth: frame.wide ? "100%" : `min(100%, calc((100dvh - 9rem) * ${frame.ratio.replace(" / ", "/")}))` }}
        >
          <article
            className={`absolute inset-0 flex overflow-hidden ${frame.wide ? "flex-row items-center gap-[4cqw] p-[4cqw]" : "flex-col justify-between p-[6cqw]"} transition-opacity duration-300 motion-reduce:transition-none ${m.busy ? "opacity-35" : ""}`}
            style={{ background: look.bg, color: look.ink }}
          >
            <span
              key={`${m.output.run}-${m.selected}-${m.output.settings.style}`}
              aria-hidden
              className="vi-beam pointer-events-none absolute top-[18%] left-0 h-[46%] w-[120%]"
              style={{ background: `linear-gradient(90deg, ${look.beam} 0%, transparent 78%)`, clipPath: "polygon(0 44%, 100% 0, 100% 100%, 0 56%)", opacity: 0.32 }}
            />
            <p className="relative min-w-0 leading-[0.94] font-extrabold tracking-[-0.045em] text-balance" style={{ fontSize: frame.head }}>
              {variant.headline}
            </p>
            <div className={`relative flex min-w-0 flex-col gap-[2.2cqw] ${frame.wide ? "max-w-[38%] shrink-0" : ""}`}>
              <p className="max-w-[46ch] text-[clamp(0.72rem,2.6cqw,1.1rem)] leading-[1.4]" style={{ color: look.sub }}>
                {variant.body}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-[2.4cqw] py-[1.2cqw] text-[clamp(0.7rem,2.2cqw,1rem)] font-extrabold" style={{ background: look.cta, color: look.ctaInk }}>
                  {variant.cta}
                </span>
                <span className="text-[clamp(0.65rem,2cqw,0.95rem)] font-bold" translate="no">
                  {spec.product}
                </span>
              </div>
            </div>
          </article>

          {m.busy ? (
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#22324A]" aria-hidden>
              <div className="h-full bg-[#FFD23F] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${m.progress}%` }} />
            </div>
          ) : null}

          {m.stale && !m.busy ? (
            <p className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] bg-[#0F1A2B] px-3 py-2 text-[13px] font-semibold text-white">
              Out of date. Generate to reprint with the new controls.
            </p>
          ) : null}
        </div>
      </div>

      <p className={`${mono.className} border-t border-[#22324A] px-5 py-2.5 text-[11px] leading-5 text-[#B9C4D6] lg:px-8`}>
        Poster set by <span className="font-bold text-white">{m.modelName}</span> with <span className="text-[#FFD23F]">{m.chain}</span>
      </p>
    </main>
  )
}

function Archive({ m }: { m: MuseStudio }) {
  return (
    <section aria-labelledby="vi-archive" className="mt-auto border-t border-[#22324A] px-5 py-4">
      <h2 id="vi-archive" className="text-[13px] font-semibold">
        Recent posters
      </h2>
      <ul className="mt-1.5 flex flex-col">
        {m.recent.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => m.restore(item)}
              className={`flex min-h-11 w-full items-center gap-3 border-b border-[#1A2940] py-1.5 text-left transition-colors hover:text-[#FFD23F] ${ring}`}
            >
              <span className="w-5 text-[18px] font-extrabold">{item.variant}</span>
              <span className="min-w-0 flex-1 truncate text-[14px]">{item.title}</span>
              <span className={`${mono.className} text-[11px] text-[#8E9BB0]`}>{item.saved ? `saved ${item.when}` : item.when}</span>
            </button>
          </li>
        ))}
      </ul>
      <h2 className="mt-4 text-[13px] font-semibold">Press log</h2>
      <ol className={`${mono.className} mt-1 flex flex-col gap-0.5 text-[11px] leading-5`}>
        {m.log.slice(0, 5).map((entry) => (
          <li key={entry.id} className="flex gap-2">
            <span className="text-[#8E9BB0] tabular-nums">{entry.at}</span>
            <span className={entry.tone === "error" ? "text-[#FF8A7D]" : entry.tone === "success" ? "text-[#FFD23F]" : "text-[#B9C4D6]"}>{entry.text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
