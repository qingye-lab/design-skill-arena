"use client"

import { Barlow, Barlow_Condensed, Inconsolata } from "next/font/google"
import { CircleAlert, CircleCheck, Download, LoaderCircle, RotateCcw, Save, Send } from "lucide-react"
import { useEffect, type KeyboardEvent, type ReactNode } from "react"

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

const cond = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" })
const text = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" })
const mono = Inconsolata({ subsets: ["latin"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "design-ux-pro",
  product: "Tern Solar Lantern",
  brief:
    "Launch the Tern Solar Lantern: 400 lumens, a fold-flat solar lid that charges in 6 hours of sun, and a USB-C port that tops up a phone. Win festival campers and van-lifers before the spring booking window opens on 1 November.",
  audiences: [
    { id: "festival", label: "Festival campers", hint: "4 nights, no mains", size: 460000, lift: { ctr: 1.14, conversion: 1.02 } },
    { id: "vanlife", label: "Van-lifers", hint: "live off solar", size: 132000, lift: { ctr: 1.22, conversion: 1.38 } },
    { id: "prep", label: "Power-cut planners", hint: "one box in the cupboard", size: 910000, lift: { ctr: 0.88, conversion: 0.92 } },
  ],
  channels: [
    { id: "tiktok", label: "TikTok", hint: "9:16, 15 s", lift: { reach: 1.4, ctr: 0.92, conversion: 0.86 } },
    { id: "email", label: "Retailer email", hint: "600 px hero", lift: { reach: 0.46, ctr: 1.8, conversion: 1.3 } },
    { id: "sampling", label: "Festival sampling card", hint: "A6 handout", lift: { reach: 0.3, ctr: 1.1, conversion: 1.5 } },
  ],
  tones: [
    { id: "practical", label: "Practical", hint: "hours and lumens", lift: { conversion: 1.07 } },
    { id: "warm", label: "Warm", hint: "tent glow stories", lift: { ctr: 1.06 } },
    { id: "dry", label: "Dry", hint: "British understatement", lift: { ctr: 1.09, conversion: 0.97 } },
  ],
  styles: [
    { id: "dusk", label: "Dusk", hint: "deep blue, amber light", lift: { ctr: 1.05 } },
    { id: "canvas", label: "Canvas", hint: "tent khaki, dark type", lift: { conversion: 1.04 } },
    { id: "alpine", label: "Alpine", hint: "white, teal detail", lift: { reach: 1.03 } },
  ],
  variants: [
    {
      id: "A",
      name: "Sun in, light out",
      headline: "Six hours of sun. Four nights of light.",
      body: "The fold-flat lid charges the {product} while you are at the main stage.",
      cta: "See run times",
    },
    {
      id: "B",
      name: "Phone rescue",
      headline: "The lantern that charges your phone.",
      body: "USB-C out, so {audience} can stop queueing at the charging tent.",
      cta: "Shop the lantern",
      lift: { ctr: 1.12, conversion: 0.96 },
    },
    {
      id: "C",
      name: "No mains needed",
      headline: "Off grid. Still bright.",
      body: "400 lumens from sunlight alone, with a {tone} promise: no cables, no generator.",
      cta: "Book before 1 Nov",
      lift: { reach: 0.96, conversion: 1.18 },
    },
  ],
  recent: [
    { id: "r1", title: "Tern Headtorch 2 restock", variant: "B", when: "Wed" },
    { id: "r2", title: "Summer festival bundle", variant: "A", when: "16 Sep" },
    { id: "r3", title: "Storm-season power bank", variant: "C", when: "4 Sep" },
  ],
  initialRun: 21,
}

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2BC4B0]"

const CONTROLS: { key: ControlKey; label: string; options: Option[] }[] = [
  { key: "audience", label: "Audience", options: spec.audiences },
  { key: "channel", label: "Channel", options: spec.channels },
  { key: "tone", label: "Tone", options: spec.tones },
  { key: "style", label: "Visual style", options: spec.styles },
]

const METRICS = [
  { key: "reach", label: "Reach", unit: "people" },
  { key: "ctr", label: "CTR", unit: "click-through" },
  { key: "conversion", label: "Conversion", unit: "orders per visit" },
] as const

const looks: Record<string, { bg: string; ink: string; sub: string; cta: string; ctaInk: string; glow: string }> = {
  dusk: { bg: "#1C2740", ink: "#FFFFFF", sub: "#C3CCDD", cta: "#F2B84B", ctaInk: "#1C2740", glow: "#F2B84B" },
  canvas: { bg: "#C9BE9F", ink: "#1F2319", sub: "#40443A", cta: "#1F2319", ctaInk: "#F3EEDC", glow: "#FFF3C4" },
  alpine: { bg: "#F2F5F7", ink: "#12222A", sub: "#44565F", cta: "#127A6D", ctaInk: "#FFFFFF", glow: "#BDEFE6" },
}

const frames: Record<string, { ratio: string; width: string; label: string }> = {
  tiktok: { ratio: "9 / 16", width: "min(100%, 15rem)", label: "9:16, 1080 × 1920, safe area 85%" },
  email: { ratio: "2 / 1", width: "100%", label: "600 × 300 email hero" },
  sampling: { ratio: "148 / 105", width: "min(100%, 26rem)", label: "A6 landscape card" },
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ["TEXTAREA", "INPUT", "SELECT"].includes(target.tagName)
}

export default function DesignUxPro() {
  const m = useMuseStudio(spec)
  const { generate, save, exportCampaign, select } = m

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return
      const key = event.key.toLowerCase()
      if (key === "g") generate()
      else if (key === "s") save()
      else if (key === "e") exportCampaign()
      else if (key === "1" || key === "2" || key === "3") select(VARIANT_IDS[Number(key) - 1])
      else return
      event.preventDefault()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [generate, save, exportCampaign, select])

  return (
    <div className={`${text.className} min-h-screen bg-[#0C0F11] text-[#E6EAEC] antialiased selection:bg-[#2BC4B0] selection:text-[#0C0F11] lg:flex lg:h-dvh lg:flex-col`} style={{ colorScheme: "dark" }}>
      <style>{`
        .ux-scan { animation: ux-scan 1.1s linear infinite; }
        @keyframes ux-scan { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) { .ux-scan { animation: none; opacity: 0.4; } }
      `}</style>

      <TopBar m={m} />
      <Telemetry m={m} />

      <div className="grid min-h-0 flex-1 gap-px bg-[#262C31] lg:grid-cols-[23rem_minmax(0,1fr)_19rem]">
        <InputsPanel m={m} />
        <PreviewPanel m={m} />
        <SidePanel m={m} />
      </div>
    </div>
  )
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className={`${mono.className} hidden min-w-5 rounded-[3px] border border-[#3A4248] px-1 text-center text-[12px] leading-4 text-[#97A1A8] lg:inline-block`}>
      {children}
    </kbd>
  )
}

function TopBar({ m }: { m: MuseStudio }) {
  const btn = `inline-flex min-h-10 items-center gap-2 rounded-[4px] px-3 text-[14px] font-semibold transition-colors disabled:cursor-progress disabled:opacity-60 ${ring}`
  return (
    <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#262C31] bg-[#101315] px-4 py-2 lg:h-14 lg:flex-nowrap lg:py-0">
      <h1 className={`${cond.className} text-[20px] leading-none font-bold tracking-[0.02em] uppercase`}>
        Muse control <span className="text-[#97A1A8]">/</span> <span translate="no">{spec.product}</span>
      </h1>
      <dl className={`${mono.className} order-last flex w-full flex-wrap gap-x-5 text-[13px] lg:order-none lg:w-auto lg:flex-1`}>
        <div className="flex gap-1.5">
          <dt className="text-[#97A1A8]">operator</dt>
          <dd className="text-[#2BC4B0]">{m.modelName}</dd>
        </div>
        <div className="flex min-w-0 gap-1.5">
          <dt className="text-[#97A1A8]">chain</dt>
          <dd className="min-w-0 [overflow-wrap:anywhere]">{m.chain}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <button type="button" onClick={m.generate} disabled={m.busy} className={`${btn} bg-[#2BC4B0] text-[#0C0F11] hover:bg-[#4FD8C6]`}>
          {m.busy ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Send aria-hidden className="size-4" />}
          Generate <Kbd>G</Kbd>
        </button>
        <button type="button" onClick={m.save} disabled={m.saveStatus === "saving"} className={`${btn} border border-[#3A4248] hover:border-[#6B767E] hover:bg-[#161A1D]`}>
          {m.saveStatus === "saving" ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Save aria-hidden className="size-4" />}
          Save <Kbd>S</Kbd>
        </button>
        <button type="button" onClick={() => m.exportCampaign()} disabled={m.exportStatus === "exporting"} className={`${btn} border border-[#3A4248] hover:border-[#6B767E] hover:bg-[#161A1D]`}>
          {m.exportStatus === "exporting" ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : <Download aria-hidden className="size-4" />}
          Export <Kbd>E</Kbd>
        </button>
      </div>
    </header>
  )
}

function Telemetry({ m }: { m: MuseStudio }) {
  return (
    <section aria-label="Forecast telemetry, simulated" className="grid gap-px border-b border-[#262C31] bg-[#262C31] sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_23rem]">
      {METRICS.map((metric) => {
        const values = VARIANT_IDS.map((id) => m.output.variants[id].metrics[metric.key])
        const max = Math.max(...values)
        const value = m.current.metrics[metric.key]
        const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
        const fmt = (v: number) => (metric.key === "reach" ? formatReach(v) : formatPercent(v))
        return (
          <div key={metric.key} className="flex min-w-0 gap-4 bg-[#101315] px-4 py-3">
            <div className="min-w-0">
              <h2 className={`${cond.className} text-[15px] font-semibold tracking-[0.04em] text-[#97A1A8] uppercase`}>
                {metric.label} <span className="normal-case tracking-normal">, route {m.selected}</span>
              </h2>
              <p className={`${mono.className} text-[34px] leading-none font-medium tabular-nums ${m.busy ? "text-[#6B767E]" : ""}`}>{fmt(value)}</p>
              <p className={`${mono.className} mt-1 text-[13px] tabular-nums ${delta?.startsWith("−") ? "text-[#FF7A6B]" : delta ? "text-[#2BC4B0]" : "text-[#97A1A8]"}`}>
                {delta ? `${delta} vs run ${m.output.run - 1}` : metric.unit}
              </p>
            </div>
            <ul aria-label={`${metric.label} by route`} className="ml-auto flex w-28 shrink-0 flex-col justify-center gap-1.5">
              {VARIANT_IDS.map((id, index) => (
                <li key={id} className={`${mono.className} grid grid-cols-[1rem_minmax(0,1fr)] items-center gap-1.5 text-[12px] tabular-nums ${id === m.selected ? "text-[#E6EAEC]" : "text-[#97A1A8]"}`}>
                  <span>{id}</span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className={`h-1.5 rounded-[1px] ${id === m.selected ? "bg-[#2BC4B0]" : "bg-[#4A545B]"}`} style={{ width: `${Math.max(8, (values[index] / max) * 60)}%` }} />
                    <span className="sr-only">{fmt(values[index])}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <RunState m={m} />
    </section>
  )
}

function RunState({ m }: { m: MuseStudio }) {
  const failed = m.generateStatus === "error"
  return (
    <div className="flex min-w-0 flex-col justify-center gap-2 bg-[#101315] px-4 py-3">
      <div role="status" aria-live="polite" className="flex items-center gap-2 text-[14px] font-medium">
        {m.busy ? (
          <LoaderCircle aria-hidden className="size-4 animate-spin text-[#2BC4B0] motion-reduce:animate-none" />
        ) : failed ? (
          <CircleAlert aria-hidden className="size-4 text-[#FF7A6B]" />
        ) : (
          <CircleCheck aria-hidden className="size-4 text-[#2BC4B0]" />
        )}
        <span className="min-w-0 truncate">
          {m.busy
            ? `Run ${m.output.run + 1}: ${m.stageLabel}`
            : failed
              ? `Run ${m.output.run + 1} aborted`
              : m.stale
                ? `Run ${m.output.run} held, inputs changed`
                : `Run ${m.output.run} nominal, ${m.output.at}`}
        </span>
      </div>
      <ol aria-label="Pipeline" className="grid grid-cols-4 gap-1">
        {GENERATION_STAGES.map((stage, index) => {
          const done = m.busy ? index < m.stage : !failed
          const active = m.busy && index === m.stage
          return (
            <li key={stage} className="flex min-w-0 flex-col gap-1">
              <span aria-hidden className={`relative h-1 overflow-hidden rounded-[1px] ${done ? "bg-[#2BC4B0]" : failed && !m.busy ? "bg-[#6B2C26]" : "bg-[#2D3439]"}`}>
                {active ? <span className="ux-scan absolute inset-0 bg-[#2BC4B0]" /> : null}
              </span>
              <span className={`${mono.className} truncate text-[12px] ${active ? "text-[#E6EAEC]" : "text-[#97A1A8]"}`}>{stage}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function InputsPanel({ m }: { m: MuseStudio }) {
  const length = m.settings.brief.trim().length
  return (
    <section aria-labelledby="ux-inputs" className="flex min-w-0 flex-col gap-4 bg-[#101315] px-4 py-4 lg:overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 id="ux-inputs" className={`${cond.className} text-[16px] font-semibold tracking-[0.04em] uppercase`}>
          Inputs
        </h2>
        <button type="button" onClick={m.reset} className={`inline-flex min-h-10 items-center gap-1.5 rounded-[4px] px-2 text-[13px] text-[#97A1A8] hover:bg-[#161A1D] hover:text-[#E6EAEC] ${ring}`}>
          <RotateCcw aria-hidden className="size-3.5" />
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ux-brief" className="flex justify-between text-[14px] font-medium">
          Brief
          <span className={`${mono.className} text-[13px] tabular-nums ${length > BRIEF_MAX ? "text-[#FF7A6B]" : "text-[#97A1A8]"}`}>
            {length}/{BRIEF_MAX}
          </span>
        </label>
        <textarea
          id="ux-brief"
          rows={4}
          value={m.settings.brief}
          onChange={(event) => m.setBrief(event.target.value)}
          aria-invalid={m.issue ? true : undefined}
          aria-describedby="ux-brief-help"
          className={`w-full resize-y rounded-[4px] border border-[#3A4248] bg-[#0C0F11] px-3 py-2 text-base leading-[1.5] hover:border-[#6B767E] aria-invalid:border-[#FF7A6B] lg:text-[14px] ${ring}`}
        />
        <p id="ux-brief-help" className={`text-[13px] ${m.issue ? "text-[#FF7A6B]" : "text-[#97A1A8]"}`}>
          {m.issue ?? "Shortcuts pause while you type here."}
        </p>
      </div>

      {CONTROLS.map((control) => (
        <fieldset key={control.key} className="min-w-0">
          <legend className="mb-1.5 text-[14px] font-medium">{control.label}</legend>
          <div className="grid grid-cols-3 gap-1">
            {control.options.map((option) => {
              const checked = m.settings[control.key] === option.id
              return (
                <label
                  key={option.id}
                  title={option.hint}
                  className={`flex min-h-11 cursor-pointer items-center justify-center rounded-[4px] border px-1.5 py-1 text-center text-[13px] leading-tight transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2BC4B0] ${
                    checked ? "border-[#2BC4B0] bg-[#12302C] text-[#E6EAEC]" : "border-[#2D3439] text-[#B8C0C5] hover:border-[#6B767E] hover:text-[#E6EAEC]"
                  }`}
                >
                  <input type="radio" name={`ux-${control.key}`} checked={checked} onChange={() => m.setControl(control.key, option.id)} className="sr-only" />
                  {option.label}
                </label>
              )
            })}
          </div>
          <p className="mt-1 truncate text-[13px] text-[#97A1A8]">{control.options.find((o) => o.id === m.settings[control.key])?.hint}</p>
        </fieldset>
      ))}

      <label className="flex min-h-10 cursor-pointer items-center gap-2 border-t border-[#262C31] pt-3 text-[13px] text-[#B8C0C5]">
        <input type="checkbox" checked={m.failNext} onChange={(event) => m.setFailNext(event.target.checked)} className={`size-4 accent-[#FF7A6B] ${ring}`} />
        Inject a forecast outage into the next run
      </label>
    </section>
  )
}

function PreviewPanel({ m }: { m: MuseStudio }) {
  const look = looks[m.output.settings.style] ?? looks.dusk
  const frame = frames[m.output.settings.channel] ?? frames.tiktok
  const v = m.current
  const error = (m.generateStatus === "error" && m.generateError) || (m.saveStatus === "error" && m.saveError) || (m.exportStatus === "error" && m.exportError) || null

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = VARIANT_IDS[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3]
    m.select(next)
    document.getElementById(`ux-tab-${next}`)?.focus()
  }

  return (
    <section aria-labelledby="ux-preview" className="flex min-w-0 flex-col bg-[#0C0F11] lg:overflow-y-auto">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#262C31] px-4 py-2">
        <h2 id="ux-preview" className={`${cond.className} text-[16px] font-semibold tracking-[0.04em] uppercase`}>
          Monitor
        </h2>
        <div role="tablist" aria-label="Routes" className="flex gap-1">
          {VARIANT_IDS.map((id, index) => (
            <button
              key={id}
              id={`ux-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={m.selected === id}
              aria-controls="ux-monitor"
              tabIndex={m.selected === id ? 0 : -1}
              onClick={() => m.select(id)}
              onKeyDown={(event) => onKey(event, index)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-[4px] px-3 text-[14px] font-medium transition-colors ${ring} ${
                m.selected === id ? "bg-[#E6EAEC] text-[#0C0F11]" : "text-[#B8C0C5] hover:bg-[#161A1D] hover:text-[#E6EAEC]"
              }`}
            >
              {id}
              <span className="hidden max-w-[9rem] truncate xl:inline">{m.output.variants[id].name}</span>
              <Kbd>{index + 1}</Kbd>
            </button>
          ))}
        </div>
        <p className={`${mono.className} ml-auto text-[13px] text-[#97A1A8]`}>{frame.label}</p>
      </div>

      {error ? (
        <p role="alert" className="mx-4 mt-3 flex items-start gap-2 rounded-[4px] border border-[#6B2C26] bg-[#23120F] px-3 py-2 text-[14px] text-[#FFC9C1]">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-[#FF7A6B]" />
          {error}
        </p>
      ) : null}
      {m.stale && !m.busy ? (
        <p className="mx-4 mt-3 rounded-[4px] border border-[#5A4A22] bg-[#1E1A0F] px-3 py-2 text-[14px] text-[#F2D38A]">
          Monitor shows run {m.output.run}. Inputs changed since then; press Generate to refresh it.
        </p>
      ) : null}

      <div id="ux-monitor" role="tabpanel" aria-labelledby={`ux-tab-${m.selected}`} className="flex flex-1 items-center justify-center p-5">
        <div className="relative [container-type:inline-size]" style={{ aspectRatio: frame.ratio, width: frame.width, maxHeight: "100%" }}>
          <article className={`absolute inset-0 flex flex-col justify-end gap-[3cqw] overflow-hidden rounded-[6px] p-[7cqw] transition-opacity duration-200 motion-reduce:transition-none ${m.busy ? "opacity-30" : ""}`} style={{ background: look.bg, color: look.ink }}>
            <span aria-hidden className="absolute top-[12%] right-[10%] size-[26cqw] rounded-full blur-2xl" style={{ background: look.glow, opacity: 0.5 }} />
            <p className={`${cond.className} relative text-[clamp(1.2rem,10cqw,2.6rem)] leading-[0.98] font-bold text-balance uppercase`}>{v.headline}</p>
            <p className="relative text-[clamp(0.75rem,3.8cqw,1rem)] leading-[1.4]" style={{ color: look.sub }}>
              {v.body}
            </p>
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-[3px] px-3 py-1.5 text-[13px] font-semibold" style={{ background: look.cta, color: look.ctaInk }}>
                {v.cta}
              </span>
              <span className={`${cond.className} text-[14px] font-semibold uppercase`} translate="no">
                {spec.product}
              </span>
            </div>
          </article>
          <span aria-hidden className="pointer-events-none absolute inset-[7.5%] rounded-[3px] border border-dashed border-[#2BC4B0]/50" />
          {m.busy ? (
            <p className={`${mono.className} absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[14px] text-[#E6EAEC]`}>
              {m.stageLabel}, {m.progress}%
            </p>
          ) : null}
        </div>
      </div>
      <p className="border-t border-[#262C31] px-4 py-2 text-[13px] text-[#97A1A8]">
        Dashed line marks the platform safe area. Copy is generated locally and simulated; check claims before publishing.
      </p>
    </section>
  )
}

function SidePanel({ m }: { m: MuseStudio }) {
  const changes = [
    ...CONTROLS.filter((c) => m.settings[c.key] !== m.output.settings[c.key]).map((c) => ({
      key: c.key,
      label: c.label,
      from: m.labelOf(c.key, m.output.settings[c.key]),
      to: m.labelOf(c.key),
    })),
    ...(m.settings.brief.trim() !== m.output.settings.brief.trim()
      ? [{ key: "brief", label: "Brief", from: `${m.output.settings.brief.trim().length} chars`, to: `${m.settings.brief.trim().length} chars` }]
      : []),
  ]
  return (
    <aside aria-label="Changes, history and log" className="flex min-w-0 flex-col gap-4 bg-[#101315] px-4 py-4 lg:overflow-y-auto">
      <section aria-labelledby="ux-diff">
        <h2 id="ux-diff" className={`${cond.className} text-[16px] font-semibold tracking-[0.04em] uppercase`}>
          Diff since run {m.output.run}
        </h2>
        {changes.length === 0 ? (
          <p className="mt-1 text-[13px] text-[#97A1A8]">No changes. The monitor matches the inputs.</p>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {changes.map((change) => (
              <li key={change.key} className={`${mono.className} text-[13px] leading-5`}>
                <span className="text-[#97A1A8]">{change.label}</span>
                <br />
                <span className="text-[#FF9A8E] line-through decoration-1">{change.from}</span> <span aria-hidden className="text-[#97A1A8]">to</span>{" "}
                <span className="text-[#2BC4B0]">{change.to}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ux-recent" className="border-t border-[#262C31] pt-3">
        <h2 id="ux-recent" className={`${cond.className} text-[16px] font-semibold tracking-[0.04em] uppercase`}>
          Recent campaigns
        </h2>
        <ul className="mt-1 flex flex-col">
          {m.recent.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => m.restore(item)} className={`flex min-h-11 w-full items-center gap-2 rounded-[4px] px-1.5 text-left text-[14px] hover:bg-[#161A1D] ${ring}`}>
                <span className={`${mono.className} w-4 text-[#2BC4B0]`}>{item.variant}</span>
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span className={`${mono.className} text-[12px] text-[#97A1A8]`}>{item.when}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ux-log" className="border-t border-[#262C31] pt-3">
        <h2 id="ux-log" className={`${cond.className} text-[16px] font-semibold tracking-[0.04em] uppercase`}>
          Event log
        </h2>
        <ol className={`${mono.className} mt-1 flex flex-col gap-0.5 text-[13px] leading-5`}>
          {m.log.map((entry) => (
            <li key={entry.id} className="grid grid-cols-[3rem_minmax(0,1fr)]">
              <span className="text-[#6B767E] tabular-nums">{entry.at}</span>
              <span className={entry.tone === "error" ? "text-[#FF7A6B]" : entry.tone === "success" ? "text-[#2BC4B0]" : "text-[#B8C0C5]"}>{entry.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}
