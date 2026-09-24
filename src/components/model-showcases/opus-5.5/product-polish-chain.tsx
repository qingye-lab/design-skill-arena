"use client"

import { DM_Mono, Plus_Jakarta_Sans } from "next/font/google"
import { CircleAlert, Download, LoaderCircle, RotateCcw, Save, Sparkles } from "lucide-react"
import type { KeyboardEvent, ReactNode } from "react"

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

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" })
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "product-polish-chain",
  product: "Kestrel Dash Cam",
  brief:
    "Launch the Kestrel Dash Cam: 4K front and 1080p rear, plate-readable at night, with a parking mode that runs on a hard-wire kit. Convince company fleet managers to standardise on it before the 2 December budget close.",
  audiences: [
    { id: "fleet", label: "Fleet managers", hint: "12 to 200 vans", size: 34000, lift: { ctr: 1.18, conversion: 1.7 } },
    { id: "insurance", label: "Insurance-led drivers", hint: "claim discounts", size: 410000, lift: { ctr: 1.22, conversion: 0.94 } },
    { id: "private", label: "Private car owners", hint: "one car, one driveway", size: 1260000, lift: { ctr: 0.9, conversion: 0.7 } },
  ],
  channels: [
    { id: "webinar", label: "Fleet webinar invite", hint: "16:9 slide", lift: { reach: 0.32, ctr: 1.7, conversion: 1.6 } },
    { id: "linkedin", label: "LinkedIn sponsored", hint: "1.91:1 landscape", lift: { reach: 1.1, ctr: 1.06, conversion: 1.12 } },
    { id: "trade", label: "Trade press", hint: "half page, 3:2", lift: { reach: 0.7, ctr: 0.8, conversion: 1.05 } },
  ],
  tones: [
    { id: "operational", label: "Operational", hint: "cost per vehicle, uptime", lift: { conversion: 1.12 } },
    { id: "cautious", label: "Cautious", hint: "liability and evidence", lift: { ctr: 1.05, conversion: 1.08 } },
    { id: "forward", label: "Forward-looking", hint: "self-driving ready", lift: { ctr: 1.12, conversion: 0.9 } },
  ],
  styles: [
    { id: "dash", label: "Dashboard", hint: "graphite with signal cyan", lift: { ctr: 1.04 } },
    { id: "daylight", label: "Daylight road", hint: "bright, high key", lift: { reach: 1.04 } },
    { id: "forensic", label: "Forensic", hint: "black with plate crops", lift: { conversion: 1.06 } },
  ],
  variants: [
    {
      id: "A",
      name: "Plate readable",
      headline: "Read the plate at 3 a.m.",
      body: "4K front, 1080p rear, and night tuning that keeps plates legible in headlight glare. Built for {audience}.",
      cta: "Book the fleet demo",
    },
    {
      id: "B",
      name: "Evidence file",
      headline: "Every incident, one folder.",
      body: "Clips file themselves by vehicle and date, so a claim takes minutes instead of an afternoon.",
      cta: "See a sample claim",
      lift: { ctr: 1.08, conversion: 1.06 },
    },
    {
      id: "C",
      name: "Budget close",
      headline: "Fit the fleet before 2 December.",
      body: "Hard-wire kits and install slots booked before budgets close. A {tone} way to standardise 40 vans.",
      cta: "Get fleet pricing",
      lift: { reach: 0.98, conversion: 1.16 },
    },
  ],
  recent: [
    { id: "r1", title: "Kestrel Mini consumer push", variant: "B", when: "Sat" },
    { id: "r2", title: "Winter tyre safety tie-in", variant: "A", when: "13 Sep" },
    { id: "r3", title: "Driver training webinar", variant: "C", when: "27 Aug" },
  ],
  initialRun: 48,
}

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E6F73]"

const looks: Record<string, { bg: string; ink: string; sub: string; cta: string; ctaInk: string; grid: string }> = {
  dash: { bg: "#242A2E", ink: "#F2F5F6", sub: "#BFC7CB", cta: "#4FD1D9", ctaInk: "#12262A", grid: "#323A3F" },
  daylight: { bg: "#F1F4F6", ink: "#191C1F", sub: "#4E555B", cta: "#0E6F73", ctaInk: "#FFFFFF", grid: "#DDE3E6" },
  forensic: { bg: "#12100F", ink: "#F5F2EE", sub: "#C6BEB6", cta: "#E8B04B", ctaInk: "#241C0C", grid: "#2A2522" },
}

const frames: Record<string, { ratio: string; width: string; label: string }> = {
  webinar: { ratio: "16 / 9", width: "100%", label: "Webinar slide, 1920 × 1080" },
  linkedin: { ratio: "1200 / 628", width: "100%", label: "LinkedIn, 1200 × 628" },
  trade: { ratio: "3 / 2", width: "26rem", label: "Trade half page, 3:2" },
}

const CONTROLS: { key: ControlKey; label: string; options: Option[] }[] = [
  { key: "audience", label: "Audience", options: spec.audiences },
  { key: "channel", label: "Channel", options: spec.channels },
  { key: "tone", label: "Tone", options: spec.tones },
  { key: "style", label: "Visual style", options: spec.styles },
]

const METRICS = [
  { key: "reach", label: "Reach", note: "decision makers who see it" },
  { key: "ctr", label: "CTR", note: "click-through to pricing" },
  { key: "conversion", label: "Conversion", note: "fleet quotes requested" },
] as const

function progressLabel(m: MuseStudio) {
  if (m.busy) return `${m.stageLabel}, ${m.progress}%`
  if (m.generateStatus === "error") return "Run stopped"
  if (m.saveStatus === "saving") return "Saving draft"
  if (m.exportStatus === "exporting") return "Exporting board pack"
  if (m.saveStatus === "saved") return `Draft ${m.selected} saved`
  if (m.exportStatus === "exported") return `Board pack ${m.selected} exported`
  if (m.generateStatus === "success") return `Run ${m.output.run} ready for review`
  if (m.stale) return "Brief changed since the generator ran"
  return `Run ${m.output.run}, generated ${m.output.at}`
}

export default function ProductPolishChain() {
  const m = useMuseStudio(spec)
  const briefLength = m.settings.brief.trim().length
  const error = (m.generateStatus === "error" && m.generateError) || (m.saveStatus === "error" && m.saveError) || (m.exportStatus === "error" && m.exportError) || null

  return (
    <div className={`${sans.className} min-h-screen bg-[#F2F1EE] text-[#191C1F] antialiased selection:bg-[#0E6F73] selection:text-white`}>
      <style>{`
        .pp-bar { transition: width 300ms cubic-bezier(0.2, 0.8, 0.2, 1); }
        .pp-sweep { animation: pp-sweep 1.2s ease-in-out infinite; }
        @keyframes pp-sweep { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @media (prefers-reduced-motion: reduce) { .pp-bar { transition: none; } .pp-sweep { animation: none; } }
      `}</style>

      <header className="border-b border-[#DCDAD4] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:h-16 lg:flex-nowrap lg:py-0">
          <div className="min-w-0">
            <h1 className="truncate text-[16px] font-semibold tracking-[-0.015em]">
              Muse <span className="font-normal text-[#5B6167]">campaign board</span>
            </h1>
            <p className="truncate text-[12px] text-[#5B6167]" translate="no">
              {spec.product} launch
            </p>
          </div>
          <p className="order-last w-full text-[13px] text-[#5B6167] lg:order-none lg:w-auto lg:flex-1">
            <span className="font-medium text-[#191C1F]">{m.modelName}</span> · <span className={mono.className}>{m.chain}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <Action primary onClick={m.generate} busy={m.busy} label="Generate" icon={<Sparkles aria-hidden className="size-4" />} />
            <Action onClick={m.save} busy={m.saveStatus === "saving"} label="Save" icon={<Save aria-hidden className="size-4" />} />
            <Action onClick={() => m.exportCampaign()} busy={m.exportStatus === "exporting"} label="Export" icon={<Download aria-hidden className="size-4" />} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_18rem]">
        <section aria-labelledby="pp-brief" className="flex min-w-0 flex-col gap-4">
          <div className="rounded-lg border border-[#DCDAD4] bg-white">
            <h2 id="pp-brief" className="border-b border-[#DCDAD4] px-3.5 py-2 text-[13px] font-semibold">
              Brief
            </h2>
            <div className="flex flex-col gap-2 px-3.5 py-3">
              <label htmlFor="pp-brief-field" className="sr-only">
                Launch brief
              </label>
              <textarea
                id="pp-brief-field"
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
                aria-describedby="pp-brief-meta"
                className={`w-full resize-y rounded-md border border-[#DCDAD4] bg-[#FCFCFB] px-2.5 py-2 text-base leading-[1.5] transition-colors hover:border-[#B9B6AF] aria-invalid:border-[#B3261E] lg:text-[14px] ${ring}`}
              />
              <div id="pp-brief-meta" className="flex items-start justify-between gap-2 text-[12px]">
                <span className={`min-w-0 flex-1 ${m.issue ? "text-[#B3261E]" : "text-[#5B6167]"}`}>{m.issue ?? "Ctrl or ⌘ + Enter generates."}</span>
                <span className={`${mono.className} shrink-0 tabular-nums ${briefLength > BRIEF_MAX ? "text-[#B3261E]" : "text-[#5B6167]"}`}>
                  {briefLength}/{BRIEF_MAX}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#DCDAD4] bg-white">
            <h2 className="border-b border-[#DCDAD4] px-3.5 py-2 text-[13px] font-semibold">Targeting</h2>
            <dl>
              {CONTROLS.map((control) => (
                <div key={control.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center border-b border-[#EDEBE6] last:border-b-0">
                  <dt className="px-3.5 py-2 text-[12.5px] text-[#5B6167]">{control.label}</dt>
                  <dd className="min-w-0 px-2 py-1.5">
                    <select
                      id={`pp-${control.key}`}
                      aria-label={control.label}
                      value={m.settings[control.key]}
                      onChange={(event) => m.setControl(control.key, event.target.value)}
                      className={`min-h-10 w-full cursor-pointer rounded-md border border-[#DCDAD4] bg-white px-2 text-base transition-colors hover:border-[#9FB8B9] lg:text-[13.5px] ${ring} ${
                        m.settings[control.key] !== m.output.settings[control.key] ? "border-[#0E6F73] bg-[#F1F8F8]" : ""
                      }`}
                    >
                      {control.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border border-[#DCDAD4] bg-white px-3.5 py-2 text-[13px] text-[#5B6167]">
            <input type="checkbox" checked={m.failNext} onChange={(event) => m.setFailNext(event.target.checked)} className={`size-4 accent-[#C2410C] ${ring}`} />
            Simulate a forecast outage on the next run
          </label>

          <button
            type="button"
            onClick={m.reset}
            className={`inline-flex min-h-10 w-fit items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-[#5B6167] transition-colors hover:bg-white hover:text-[#191C1F] ${ring}`}
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Reset targeting
          </button>
        </section>

        <section aria-labelledby="pp-preview" className="flex min-w-0 flex-col gap-4">
          <h2 id="pp-preview" className="sr-only">
            Routes and preview
          </h2>

          {error ? (
            <p role="alert" className="flex items-start gap-2 rounded-lg border border-[#E5C3BC] bg-[#FDF4F2] px-3.5 py-2.5 text-[13.5px] text-[#8C2A18]">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="rounded-lg border border-[#DCDAD4] bg-white">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#DCDAD4] px-3.5 py-2">
              <div role="tablist" aria-label="Campaign routes" className="flex flex-wrap gap-1.5">
                {VARIANT_IDS.map((id, index) => {
                  const active = m.selected === id
                  return (
                    <button
                      key={id}
                      id={`pp-route-${id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="pp-canvas"
                      tabIndex={active ? 0 : -1}
                      onClick={() => m.select(id)}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
                        event.preventDefault()
                        const next = VARIANT_IDS[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3]
                        m.select(next)
                        document.getElementById(`pp-route-${next}`)?.focus()
                      }}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-md border px-2.5 text-[13px] transition-colors ${ring} ${
                        active ? "border-[#0E6F73] bg-[#E9F3F3] text-[#0B4F52]" : "border-[#DCDAD4] hover:border-[#B9B6AF] hover:bg-[#FAFAF8]"
                      }`}
                    >
                      <span className={`${mono.className} text-[12px] font-semibold`}>{id}</span>
                      <span className="max-w-[10rem] truncate">{m.output.variants[id].name}</span>
                    </button>
                  )
                })}
              </div>
              <p role="status" aria-live="polite" className="ml-auto flex min-w-0 items-center gap-2 text-[12.5px] text-[#5B6167]">
                {m.busy ? <LoaderCircle aria-hidden className="size-3.5 shrink-0 animate-spin motion-reduce:animate-none" /> : null}
                <span className="min-w-0 truncate">{progressLabel(m)}</span>
              </p>
            </div>

            {m.busy ? (
              <div className="h-1 w-full bg-[#E7E5E0]" aria-hidden>
                <div className="pp-bar h-full bg-[#0E6F73]" style={{ width: `${m.progress}%` }} />
              </div>
            ) : (
              <ol aria-label="Generation stages" className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[#EDEBE6] px-3.5 py-1.5">
                {GENERATION_STAGES.map((stage) => (
                  <li key={stage} className={`${mono.className} text-[11.5px] text-[#8A8F93]`}>
                    {stage}
                  </li>
                ))}
              </ol>
            )}

            <div id="pp-canvas" role="tabpanel" aria-labelledby={`pp-route-${m.selected}`} className="bg-[#EDEBE6] p-4 sm:p-5">
              <div className="relative mx-auto flex w-full max-w-[46rem] justify-center">
                <Preview m={m} />
                {m.stale && !m.busy ? (
                  <p className="absolute inset-x-2 top-2 rounded-md bg-[#191C1F] px-3 py-2 text-[12.5px] text-white">
                    Out of date. Targeting changed after run {m.output.run}; generate again to refresh.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#DCDAD4] bg-white">
            <h2 className="border-b border-[#DCDAD4] px-3.5 py-2 text-[13px] font-semibold">Forecast for route {m.selected}</h2>
            <dl className="grid gap-px bg-[#EDEBE6] sm:grid-cols-3">
              {METRICS.map((metric) => {
                const value = m.current.metrics[metric.key]
                const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
                return (
                  <div key={metric.key} className="flex min-w-0 flex-col gap-1 bg-white px-3.5 py-3">
                    <dt className="text-[12.5px] text-[#5B6167]">{metric.label}</dt>
                    <dd className={`text-[24px] leading-none font-semibold tracking-[-0.02em] tabular-nums ${m.busy ? "pp-sweep text-[#A9ADB1]" : ""}`}>
                      {metric.key === "reach" ? formatReach(value) : formatPercent(value)}
                    </dd>
                    <dd className={`${mono.className} text-[11.5px] tabular-nums ${delta?.startsWith("−") ? "text-[#B3261E]" : delta ? "text-[#0E6F73]" : "text-[#8A8F93]"}`}>
                      {delta ? `${delta} vs last run` : metric.note}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </section>

        <aside aria-label="History and activity" className="flex min-w-0 flex-col gap-4">
          <section className="rounded-lg border border-[#DCDAD4] bg-white">
            <h2 className="border-b border-[#DCDAD4] px-3.5 py-2 text-[13px] font-semibold">Recent campaigns</h2>
            <ul>
              {m.recent.map((item) => (
                <li key={item.id} className="border-b border-[#EDEBE6] last:border-b-0">
                  <button type="button" onClick={() => m.restore(item)} className={`flex min-h-11 w-full items-center gap-2.5 px-3.5 py-1.5 text-left transition-colors hover:bg-[#FAFAF8] ${ring}`}>
                    <span className={`${mono.className} flex size-6 shrink-0 items-center justify-center rounded bg-[#EDEBE6] text-[11.5px] font-semibold`}>{item.variant}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px]">{item.title}</span>
                      <span className="block text-[11.5px] text-[#5B6167]">
                        {item.saved ? "Saved" : "Archived"} {item.when}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-[#DCDAD4] bg-white">
            <h2 className="border-b border-[#DCDAD4] px-3.5 py-2 text-[13px] font-semibold">Activity</h2>
            <ol className="flex flex-col gap-1.5 px-3.5 py-2.5">
              {m.log.map((entry) => (
                <li key={entry.id} className="flex gap-2 text-[12px] leading-[1.45]">
                  <span className={`${mono.className} shrink-0 text-[#8A8F93] tabular-nums`}>{entry.at}</span>
                  <span className={entry.tone === "error" ? "text-[#B3261E]" : entry.tone === "success" ? "text-[#0E6F73]" : "text-[#5B6167]"}>{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <p className="text-[12px] leading-5 text-[#5B6167]">Fleet figures are a local simulation. Confirm install capacity with operations before quoting.</p>
        </aside>
      </main>
    </div>
  )
}

function Action({ primary, onClick, busy, label, icon }: { primary?: boolean; onClick: () => void; busy: boolean; label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3.5 text-[13.5px] font-medium transition-[background-color,border-color,transform] active:translate-y-px disabled:cursor-progress disabled:opacity-65 ${ring} ${
        primary ? "bg-[#0E6F73] text-white hover:bg-[#0B5A5D]" : "border border-[#DCDAD4] bg-white hover:border-[#B9B6AF] hover:bg-[#FAFAF8]"
      }`}
    >
      {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : icon}
      {label}
    </button>
  )
}

function Preview({ m }: { m: MuseStudio }) {
  const look = looks[m.output.settings.style] ?? looks.dash
  const frame = frames[m.output.settings.channel] ?? frames.webinar
  const v = m.current
  const fixed = frame.width !== "100%"
  return (
    <article
      className="flex w-full flex-col justify-between gap-3 overflow-hidden rounded-md p-5 [container-type:inline-size]"
      style={{ aspectRatio: frame.ratio, maxWidth: fixed ? frame.width : undefined, background: look.bg, color: look.ink }}
    >
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden className="inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5" style={{ background: look.grid }}>
          <span className="size-1.5 rounded-full" style={{ background: look.cta }} />
          <span className={`${mono.className} text-[10.5px]`}>REC</span>
        </span>
        <span className={`${mono.className} max-w-[45%] truncate text-[10.5px]`} style={{ color: look.sub }}>
          {frame.label}
        </span>
      </div>
      <p className="text-[clamp(1.05rem,6.2cqw,1.9rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance">{v.headline}</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-[38ch] min-w-0 flex-1 text-[clamp(0.72rem,2.9cqw,0.92rem)] leading-[1.45]" style={{ color: look.sub }}>
          {v.body}
        </p>
        <span className="shrink-0 rounded-sm px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: look.cta, color: look.ctaInk }}>
          {v.cta}
        </span>
      </div>
      <p className={`${mono.className} border-t pt-2 text-[10.5px] tracking-[0.06em] uppercase`} style={{ borderColor: look.grid, color: look.sub }}>
        {spec.product}
      </p>
    </article>
  )
}
