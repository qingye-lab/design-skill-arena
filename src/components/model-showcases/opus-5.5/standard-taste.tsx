"use client"

import { Geist, Geist_Mono } from "next/font/google"
import { Check, CircleAlert, Download, LoaderCircle, RotateCcw, Save, Sparkles } from "lucide-react"
import type { KeyboardEvent, ReactNode } from "react"

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

const sans = Geist({ subsets: ["latin"], display: "swap" })
const mono = Geist_Mono({ subsets: ["latin"], display: "swap" })

/*
 * Design read: a launch workbench for one creative director, used daily.
 * Dials: variance 5, motion 3, density 6. Monochrome with a single emerald
 * accent, one 12px radius scale, hairlines instead of cards.
 */

const spec: StudioSpec = {
  showcaseId: "standard-taste",
  product: "Halden Trail 2",
  brief:
    "Launch the Halden Trail 2, a 248 g trail shoe with a 4 mm lug and a recycled mesh upper that drains in under a minute. Reach runners moving from road to trail before the 12 October drop. Lead with grip on wet rock.",
  audiences: [
    { id: "switchers", label: "Road-to-trail switchers", hint: "10K regulars trying dirt", size: 612000, lift: { ctr: 1.08, conversion: 1.1 } },
    { id: "ultra", label: "Ultra runners", hint: "50K and up, buy twice a year", size: 88000, lift: { ctr: 1.3, conversion: 1.42 } },
    { id: "hikers", label: "Fast hikers", hint: "weekend mountain days", size: 1140000, lift: { ctr: 0.9, conversion: 0.84 } },
  ],
  channels: [
    { id: "story", label: "Instagram story", hint: "9:16, sound off", lift: { reach: 1.18, ctr: 1.04 } },
    { id: "preroll", label: "YouTube pre-roll", hint: "16:9, skippable at 5 s", lift: { reach: 1.34, ctr: 0.72, conversion: 0.94 } },
    { id: "print", label: "Trail Runner magazine", hint: "4:5 full page", lift: { reach: 0.42, ctr: 1.6, conversion: 1.22 } },
  ],
  tones: [
    { id: "direct", label: "Direct", hint: "specs first", lift: { conversion: 1.06 } },
    { id: "wry", label: "Wry", hint: "mud jokes allowed", lift: { ctr: 1.12, conversion: 0.97 } },
    { id: "earnest", label: "Earnest", hint: "why we run", lift: { ctr: 0.98, conversion: 1.02 } },
  ],
  styles: [
    { id: "granite", label: "Granite", hint: "grey rock, white type", lift: { ctr: 1.03 } },
    { id: "moss", label: "Moss", hint: "wet green ground", lift: { conversion: 1.05 } },
    { id: "night", label: "Headlamp", hint: "black, one beam of light", lift: { reach: 1.04, ctr: 1.02 } },
  ],
  variants: [
    {
      id: "A",
      name: "Wet rock",
      headline: "Grip that holds when the rock is wet.",
      body: "4 mm lugs and a sticky rubber compound. The {product} was tested on the granite slabs we used to walk down.",
      cta: "See the outsole",
    },
    {
      id: "B",
      name: "Drains fast",
      headline: "Run the river crossing. Keep going.",
      body: "The recycled mesh upper drains in 48 seconds. Built for {audience} who do not stop at the water.",
      cta: "Watch it drain",
      lift: { reach: 1.05, conversion: 0.96 },
    },
    {
      id: "C",
      name: "248 grams",
      headline: "248 g. Less shoe, more trail.",
      body: "Light enough for race day, lugged enough for the descent. A {tone} case for your next pair.",
      cta: "Pre-order, ships 12 Oct",
      lift: { ctr: 0.95, conversion: 1.14 },
    },
  ],
  recent: [
    { id: "r1", title: "Halden Road 5 spring refresh", variant: "B", when: "Mon" },
    { id: "r2", title: "Trail socks bundle", variant: "A", when: "19 Sep" },
    { id: "r3", title: "Autumn race kit", variant: "C", when: "8 Sep" },
  ],
  initialRun: 6,
}

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F8A5F]"

const looks: Record<string, { bg: string; ink: string; sub: string; cta: string; ctaInk: string; mark: string }> = {
  granite: { bg: "#6E7277", ink: "#FFFFFF", sub: "#EEF0F1", cta: "#141416", ctaInk: "#FFFFFF", mark: "#7E8287" },
  moss: { bg: "#2F4A34", ink: "#F3F6EF", sub: "#CBD8C6", cta: "#E6F0DC", ctaInk: "#1E2F21", mark: "#3A5840" },
  night: { bg: "#141416", ink: "#FFFFFF", sub: "#B8B8BE", cta: "#F5E7A8", ctaInk: "#141416", mark: "#222226" },
}

const frames: Record<string, { ratio: string; width: string; label: string }> = {
  story: { ratio: "9 / 16", width: "min(100%, 13.5rem)", label: "Story, 1080 × 1920" },
  preroll: { ratio: "16 / 9", width: "100%", label: "Pre-roll, 1920 × 1080" },
  print: { ratio: "4 / 5", width: "min(100%, 19rem)", label: "Full page, 4:5" },
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

function statusLine(m: MuseStudio) {
  if (m.busy) return `${m.stageLabel}. ${m.progress}% done.`
  if (m.generateStatus === "error") return "The last run did not finish."
  if (m.exportStatus === "exporting") return "Preparing the export."
  if (m.saveStatus === "saving") return "Saving to recent campaigns."
  if (m.exportStatus === "exported") return `Route ${m.selected} exported as JSON.`
  if (m.saveStatus === "saved") return `Route ${m.selected} saved to recent campaigns.`
  if (m.generateStatus === "success") return `Run ${m.output.run} is ready. Three routes forecast.`
  if (m.stale) return "Controls changed. Generate to refresh the routes."
  return `Run ${m.output.run}, generated at ${m.output.at}.`
}

export default function StandardTaste() {
  const m = useMuseStudio(spec)
  const briefLength = m.settings.brief.trim().length

  return (
    <div className={`${sans.className} min-h-screen bg-[#F3F3F1] text-[#141416] antialiased selection:bg-[#0F8A5F] selection:text-white`}>
      <style>{`
        .st-pulse { animation: st-pulse 1.4s ease-in-out infinite; }
        @keyframes st-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .st-in { animation: st-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes st-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .st-pulse, .st-in { animation: none; } }
      `}</style>

      <header className="border-b border-[#DADAD6]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:h-16 lg:flex-nowrap lg:py-0">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="text-[17px] font-semibold tracking-[-0.02em]">Muse</span>
            <h1 className="min-w-0 truncate text-[15px] text-[#5E5E66]">
              <span translate="no">{spec.product}</span> launch
            </h1>
          </div>
          <p className="order-last w-full text-[13px] text-[#5E5E66] lg:order-none lg:w-auto lg:flex-1">
            Built with <span className="font-medium text-[#141416]">{m.modelName}</span> using{" "}
            <span className={`${mono.className} text-[12px] text-[#141416]`}>{m.chain}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <ActionButton primary onClick={m.generate} busy={m.busy} label="Generate" icon={<Sparkles aria-hidden className="size-4" />} />
            <ActionButton onClick={m.save} busy={m.saveStatus === "saving"} label="Save" icon={<Save aria-hidden className="size-4" />} />
            <ActionButton onClick={() => m.exportCampaign()} busy={m.exportStatus === "exporting"} label="Export" icon={<Download aria-hidden className="size-4" />} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-x-10 gap-y-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section aria-labelledby="st-inputs" className="flex min-w-0 flex-col gap-5">
          <h2 id="st-inputs" className="sr-only">
            Brief and controls
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="st-brief" className="text-[14px] font-medium">
                Brief
              </label>
              <span className={`${mono.className} text-[12px] tabular-nums ${briefLength > BRIEF_MAX ? "text-[#B42318]" : "text-[#5E5E66]"}`}>
                {briefLength}/{BRIEF_MAX}
              </span>
            </div>
            <textarea
              id="st-brief"
              name="brief"
              rows={4}
              value={m.settings.brief}
              onChange={(event) => m.setBrief(event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault()
                  m.generate()
                }
              }}
              aria-invalid={m.issue ? true : undefined}
              aria-describedby="st-brief-help"
              placeholder="What is launching, for whom, and by when…"
              className={`w-full resize-y rounded-[12px] border border-[#DADAD6] bg-white px-3.5 py-3 text-base leading-[1.55] transition-colors placeholder:text-[#76767E] hover:border-[#B9B9B4] aria-invalid:border-[#B42318] lg:text-[14.5px] ${ring}`}
            />
            <p id="st-brief-help" className={`text-[13px] ${m.issue ? "text-[#B42318]" : "text-[#5E5E66]"}`}>
              {m.issue ?? "Ctrl or ⌘ + Enter generates."}
            </p>
          </div>

          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {CONTROLS.map((control) => (
              <fieldset key={control.key} className="min-w-0">
                <legend className="mb-1.5 text-[14px] font-medium">{control.label}</legend>
                <div className="flex flex-col gap-0.5">
                  {control.options.map((option) => {
                    const checked = m.settings[control.key] === option.id
                    const changed = checked && m.output.settings[control.key] !== option.id
                    return (
                      <label
                        key={option.id}
                        className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-[12px] px-3 py-1.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0F8A5F] lg:min-h-10 ${
                          checked ? "bg-[#141416] text-white" : "hover:bg-[#E7E7E3]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`st-${control.key}`}
                          value={option.id}
                          checked={checked}
                          onChange={() => m.setControl(control.key, option.id)}
                          className="sr-only"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium">{option.label}</span>
                          {option.hint ? (
                            <span className={`block truncate text-[12px] ${checked ? "text-[#C9C9CF]" : "text-[#5E5E66]"}`}>{option.hint}</span>
                          ) : null}
                        </span>
                        {changed ? <span className="text-[11px] font-medium text-[#8FE3BF]">Not generated</span> : null}
                        {checked && !changed ? <Check aria-hidden className="size-4 shrink-0" /> : null}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DADAD6] pt-3">
            <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[13px] text-[#5E5E66]">
              <input
                type="checkbox"
                checked={m.failNext}
                onChange={(event) => m.setFailNext(event.target.checked)}
                className={`size-4 accent-[#B42318] ${ring}`}
              />
              Simulate a forecast outage on the next run
            </label>
            <button
              type="button"
              onClick={m.reset}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-[12px] px-3 text-[13px] font-medium text-[#5E5E66] transition-colors hover:bg-[#E7E7E3] hover:text-[#141416] active:scale-[0.98] ${ring}`}
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Reset controls
            </button>
          </div>
        </section>

        <section aria-labelledby="st-output" className="flex min-w-0 flex-col gap-4">
          <h2 id="st-output" className="sr-only">
            Routes and preview
          </h2>

          <RouteSwitch m={m} />

          <p role="status" aria-live="polite" className="flex min-h-5 items-center gap-2 text-[13px] text-[#5E5E66]">
            {m.busy ? <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" /> : null}
            {statusLine(m)}
          </p>

          <Alerts m={m} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_13rem]">
            <Preview m={m} />
            <Forecast m={m} />
          </div>

          <RecentList m={m} />
        </section>
      </main>
    </div>
  )
}

function ActionButton({ primary, onClick, busy, label, icon }: { primary?: boolean; onClick: () => void; busy: boolean; label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy || undefined}
      className={`inline-flex min-h-10 items-center gap-2 rounded-[12px] px-3.5 text-[14px] font-medium transition-[background-color,border-color,transform] active:scale-[0.98] disabled:cursor-progress disabled:opacity-70 ${ring} ${
        primary ? "bg-[#0F8A5F] text-white hover:bg-[#0B754F]" : "border border-[#DADAD6] bg-white text-[#141416] hover:border-[#B9B9B4] hover:bg-[#FAFAF8]"
      }`}
    >
      {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : icon}
      {label}
    </button>
  )
}

function RouteSwitch({ m }: { m: MuseStudio }) {
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = VARIANT_IDS[(index + (event.key === "ArrowRight" ? 1 : VARIANT_IDS.length - 1)) % VARIANT_IDS.length]
    m.select(next)
    document.getElementById(`st-route-${next}`)?.focus()
  }
  return (
    <div role="tablist" aria-label="Campaign routes" className="grid grid-cols-3 gap-2">
      {VARIANT_IDS.map((id, index) => {
        const variant = m.output.variants[id]
        const active = m.selected === id
        return (
          <button
            key={id}
            id={`st-route-${id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="st-preview"
            tabIndex={active ? 0 : -1}
            onClick={() => m.select(id)}
            onKeyDown={(event) => onKey(event, index)}
            className={`min-h-14 min-w-0 rounded-[12px] border px-3 py-2 text-left transition-colors ${ring} ${
              active ? "border-[#141416] bg-white" : "border-transparent bg-[#E7E7E3] hover:bg-[#DDDDD8]"
            }`}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-semibold">Route {id}</span>
              <span className={`${mono.className} hidden text-[12px] tabular-nums text-[#5E5E66] sm:inline`}>{formatPercent(variant.metrics.ctr)}</span>
            </span>
            <span className="block truncate text-[13px] text-[#5E5E66]">{variant.name}</span>
          </button>
        )
      })}
    </div>
  )
}

function Alerts({ m }: { m: MuseStudio }) {
  const errors = [
    m.generateStatus === "error" ? m.generateError : null,
    m.saveStatus === "error" ? m.saveError : null,
    m.exportStatus === "error" ? m.exportError : null,
  ].filter((text): text is string => Boolean(text))
  if (errors.length === 0) return null
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-[12px] border border-[#F1C6C1] bg-[#FDF1EF] px-3.5 py-3 text-[14px] text-[#8A1C12]">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-col gap-1">
        {errors.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </div>
  )
}

function Preview({ m }: { m: MuseStudio }) {
  const look = looks[m.output.settings.style] ?? looks.granite
  const frame = frames[m.output.settings.channel] ?? frames.story
  const variant = m.current
  return (
    <figure id="st-preview" role="tabpanel" aria-labelledby={`st-route-${m.selected}`} className="flex min-w-0 flex-col gap-2">
      <div className="relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-[12px] bg-[#E7E7E3] p-4 lg:h-[26rem] lg:min-h-0">
        {m.busy ? (
          <div
            aria-hidden
            className="st-pulse flex max-h-full flex-col justify-end gap-3 rounded-[12px] bg-[#D6D6D1] p-5"
            style={{ aspectRatio: frame.ratio, width: frame.width }}
          >
            <span className="h-5 w-4/5 rounded-full bg-[#C4C4BE]" />
            <span className="h-5 w-3/5 rounded-full bg-[#C4C4BE]" />
            <span className="mt-2 h-3 w-full rounded-full bg-[#CBCBC5]" />
            <span className="h-3 w-5/6 rounded-full bg-[#CBCBC5]" />
            <span className="mt-2 h-9 w-2/5 rounded-full bg-[#C4C4BE]" />
          </div>
        ) : (
          <article
            key={`${m.output.run}-${m.selected}`}
            className="st-in relative flex max-h-full flex-col justify-end overflow-hidden rounded-[12px] p-5 [container-type:inline-size]"
            style={{ aspectRatio: frame.ratio, width: frame.width, background: look.bg, color: look.ink }}
          >
            <span aria-hidden className="pointer-events-none absolute -top-[0.1em] left-3 text-[40cqw] leading-none font-semibold tracking-[-0.06em]" style={{ color: look.mark }}>
              {variant.id}
            </span>
            <p className="relative text-[clamp(1rem,8cqw,2rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance">{variant.headline}</p>
            <p className="relative mt-2 text-[clamp(0.72rem,3.8cqw,0.95rem)] leading-[1.45]" style={{ color: look.sub }}>
              {variant.body}
            </p>
            <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ background: look.cta, color: look.ctaInk }}>
                {variant.cta}
              </span>
              <span className="text-[11px] font-semibold" translate="no">
                {spec.product}
              </span>
            </div>
          </article>
        )}
        {m.stale && !m.busy ? (
          <p className="absolute inset-x-3 top-3 rounded-[12px] bg-[#141416] px-3 py-2 text-[13px] text-white">
            Out of date. The controls changed after run {m.output.run}; generate again to see them here.
          </p>
        ) : null}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-[12px] text-[#5E5E66]">
        <span>{frame.label}</span>
        <span>
          {m.labelOf("tone", m.output.settings.tone)} tone, {m.labelOf("style", m.output.settings.style).toLowerCase()} look
        </span>
      </figcaption>
    </figure>
  )
}

function Forecast({ m }: { m: MuseStudio }) {
  return (
    <section aria-labelledby="st-forecast" className="flex min-w-0 flex-col">
      <h3 id="st-forecast" className="text-[14px] font-medium">
        Forecast, route {m.selected}
      </h3>
      <p className="text-[12px] text-[#5E5E66]">Simulated locally, not a media plan.</p>
      <dl className="mt-3 grid grid-cols-3 gap-4 border-t border-[#DADAD6] pt-3 xl:grid-cols-1 xl:gap-0 xl:divide-y xl:divide-[#DADAD6] xl:pt-0">
        {METRICS.map((metric) => {
          const value = m.current.metrics[metric.key]
          const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
          return (
            <div key={metric.key} className="min-w-0 xl:py-3">
              <dt className="text-[13px] text-[#5E5E66]">{metric.label}</dt>
              <dd className={`${m.busy ? "st-pulse" : ""} text-[clamp(1.2rem,3vw,1.7rem)] leading-tight font-semibold tracking-[-0.03em] tabular-nums`}>
                {metric.key === "reach" ? formatReach(value) : formatPercent(value)}
              </dd>
              <dd className={`${mono.className} text-[12px] tabular-nums ${delta?.startsWith("−") ? "text-[#B42318]" : delta ? "text-[#0F8A5F]" : "text-[#5E5E66]"}`}>
                {delta ? `${delta} vs last run` : "First run"}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

function RecentList({ m }: { m: MuseStudio }) {
  return (
    <section aria-labelledby="st-recent" className="border-t border-[#DADAD6] pt-3">
      <h3 id="st-recent" className="text-[14px] font-medium">
        Recent campaigns
      </h3>
      <ul className="mt-1.5 grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
        {m.recent.slice(0, 6).map((item) => (
          <li key={item.id} className="min-w-0">
            <button
              type="button"
              onClick={() => m.restore(item)}
              className={`group flex min-h-11 w-full items-center gap-3 rounded-[12px] px-3 py-1.5 text-left transition-colors hover:bg-[#E7E7E3] ${ring}`}
            >
              <span className={`${mono.className} flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-[#E7E7E3] text-[12px] font-medium group-hover:bg-white`}>
                {item.variant}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px]">{item.title}</span>
                <span className="block text-[12px] text-[#5E5E66]">
                  {item.saved ? "Saved" : "Archived"} {item.when}. Restore settings
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
