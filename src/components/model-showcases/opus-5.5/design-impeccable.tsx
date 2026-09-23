"use client"

import { Anybody, Chivo_Mono } from "next/font/google"
import { CircleAlert, Download, LoaderCircle, Printer, RotateCcw, Save } from "lucide-react"
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

const display = Anybody({ subsets: ["latin"], axes: ["wdth"], display: "swap" })
const mono = Chivo_Mono({ subsets: ["latin"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "design-impeccable",
  product: "Paperlane Field Notebook",
  brief:
    "Launch the Paperlane Field Notebook: 96 pages of 80 gsm dot grid that takes fountain pen without bleed, stitched so it lies flat. Sell it to people who write by hand every day, ahead of the 14 October stationery fair.",
  audiences: [
    { id: "journal", label: "Daily journallers", hint: "one page every night", size: 540000, lift: { ctr: 1.1, conversion: 1.08 } },
    { id: "pens", label: "Fountain pen people", hint: "own more ink than pens", size: 96000, lift: { ctr: 1.34, conversion: 1.46 } },
    { id: "students", label: "Design students", hint: "sketch in lectures", size: 820000, lift: { ctr: 0.94, conversion: 0.82 } },
  ],
  channels: [
    { id: "zine", label: "Zine insert", hint: "A5 portrait, stapled in", lift: { reach: 0.36, ctr: 1.5, conversion: 1.4 } },
    { id: "carousel", label: "Instagram carousel", hint: "4:5 slides", lift: { reach: 1.2, ctr: 1.02 } },
    { id: "window", label: "Shop window", hint: "landscape vinyl", lift: { reach: 0.8, ctr: 0.66, conversion: 1.1 } },
  ],
  tones: [
    { id: "candid", label: "Candid", hint: "what it is, plainly", lift: { conversion: 1.05 } },
    { id: "nerdy", label: "Nerdy", hint: "gsm and nib widths", lift: { ctr: 1.08, conversion: 1.04 } },
    { id: "wistful", label: "Wistful", hint: "the page you keep", lift: { ctr: 1.04, conversion: 0.96 } },
  ],
  styles: [
    { id: "pinkblue", label: "Fluoro pink and blue", hint: "two drums, full overprint", lift: { ctr: 1.06 } },
    { id: "blue", label: "Medium blue only", hint: "one drum, quiet", lift: { conversion: 1.03 } },
    { id: "pinkyellow", label: "Pink and yellow", hint: "loud, warm overprint", lift: { reach: 1.04, ctr: 1.02 } },
  ],
  variants: [
    {
      id: "A",
      name: "No bleed",
      headline: "Write wet. Nothing comes through.",
      body: "80 gsm paper that holds a broad nib without ghosting on the next page. 96 pages of dot grid in the {product}.",
      cta: "Order a notebook",
    },
    {
      id: "B",
      name: "Lies flat",
      headline: "Open it. It stays open.",
      body: "Thread-stitched binding, so {audience} can write to the gutter without holding the page down.",
      cta: "See the binding",
      lift: { ctr: 1.06, conversion: 0.98 },
    },
    {
      id: "C",
      name: "Every day",
      headline: "One page a day. Ninety-six days.",
      body: "A {tone} notebook sized for a season of writing, printed on paper you will want to finish.",
      cta: "Meet us at the fair",
      lift: { reach: 1.05, conversion: 1.1 },
    },
  ],
  recent: [
    { id: "r1", title: "Pocket planner 2027", variant: "C", when: "Tue" },
    { id: "r2", title: "Ink sampler cards", variant: "A", when: "15 Sep" },
    { id: "r3", title: "Sketchbook back-to-school", variant: "B", when: "29 Aug" },
  ],
  initialRun: 4,
}

const PINK = "#FF48B0"
const BLUE = "#0078BF"
const YELLOW = "#FFE800"
const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0078BF]"

const inks: Record<string, { a: string; b: string | null; label: string }> = {
  pinkblue: { a: BLUE, b: PINK, label: "Medium blue + fluoro pink" },
  blue: { a: BLUE, b: null, label: "Medium blue" },
  pinkyellow: { a: PINK, b: YELLOW, label: "Fluoro pink + yellow" },
}

const sheets: Record<string, { ratio: string; width: string; label: string }> = {
  zine: { ratio: "1 / 1.414", width: "min(100%, 20rem)", label: "A5, 148 × 210 mm" },
  carousel: { ratio: "4 / 5", width: "min(100%, 23rem)", label: "Slide, 1080 × 1350" },
  window: { ratio: "16 / 9", width: "100%", label: "Vinyl, 1600 × 900 mm" },
}

const CONTROLS: { key: ControlKey; label: string; options: Option[] }[] = [
  { key: "audience", label: "For", options: spec.audiences },
  { key: "channel", label: "Printed as", options: spec.channels },
  { key: "tone", label: "Voice", options: spec.tones },
  { key: "style", label: "Inks", options: spec.styles },
]

const METRICS = [
  { key: "reach", label: "Reach" },
  { key: "ctr", label: "CTR" },
  { key: "conversion", label: "Conversion" },
] as const

function ticketStatus(m: MuseStudio) {
  if (m.busy) return `On the drum: ${m.stageLabel.toLowerCase()} (${m.progress}%)`
  if (m.generateStatus === "error") return "Paper jam. Nothing printed."
  if (m.saveStatus === "saving") return "Filing the ticket"
  if (m.exportStatus === "exporting") return "Bundling the export"
  if (m.saveStatus === "saved") return `Proof ${m.selected} filed on the spike`
  if (m.exportStatus === "exported") return `Proof ${m.selected} exported`
  if (m.generateStatus === "success") return `Run ${m.output.run} pulled. Three proofs dry.`
  if (m.stale) return "Ticket edited after the last pull"
  return `Run ${m.output.run} pulled at ${m.output.at}`
}

export default function DesignImpeccable() {
  const m = useMuseStudio(spec)
  return (
    <div className={`${mono.className} min-h-screen bg-[#EFEDE6] text-[#1D1D1B] antialiased selection:bg-[#FF48B0] selection:text-[#1D1D1B]`}>
      <style>{`
        .di-plate { animation: di-plate 700ms cubic-bezier(0.3, 1.3, 0.5, 1) both; }
        @keyframes di-plate { from { transform: translate(10px, -7px); opacity: 0.2; } to { transform: translate(2px, -1px); opacity: 1; } }
        .di-dots { background-image: radial-gradient(currentColor 22%, transparent 24%); background-size: 7px 7px; }
        @media (prefers-reduced-motion: reduce) { .di-plate { animation: none; } }
      `}</style>

      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[27rem_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <Ticket m={m} />
        <ProofBench m={m} />
      </div>
    </div>
  )
}

function Ticket({ m }: { m: MuseStudio }) {
  const length = m.settings.brief.trim().length
  return (
    <section aria-labelledby="di-ticket" className="min-w-0 border-2 border-[#1D1D1B] bg-[#FBFAF6]">
      <header className="flex items-start justify-between gap-3 border-b-2 border-[#1D1D1B] px-4 py-3">
        <div className="min-w-0">
          <h1 id="di-ticket" className={`${display.className} text-[26px] leading-[0.95] font-extrabold tracking-[-0.01em] [font-stretch:75%]`}>
            Muse print room
          </h1>
          <p className="mt-1 text-[12px] leading-5">
            Job ticket for <span translate="no">{spec.product}</span>
          </p>
        </div>
        <p className="shrink-0 border border-[#1D1D1B] px-1.5 py-0.5 text-[12px] tabular-nums">Run {m.output.run}</p>
      </header>

      <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] border-b border-[#1D1D1B] text-[12px] leading-5">
        <dt className="border-r border-[#1D1D1B] px-4 py-1.5">Operator</dt>
        <dd className="px-3 py-1.5 font-medium">{m.modelName}</dd>
        <dt className="border-t border-r border-[#1D1D1B] px-4 py-1.5">Method</dt>
        <dd className="border-t border-[#1D1D1B] px-3 py-1.5 [overflow-wrap:anywhere]">{m.chain}</dd>
      </dl>

      <div className="flex flex-col gap-1.5 border-b border-[#1D1D1B] px-4 py-3">
        <label htmlFor="di-brief" className="flex justify-between text-[12px] font-medium">
          Brief
          <span className={`tabular-nums ${length > BRIEF_MAX ? "text-[#C8102E]" : ""}`}>
            {length}/{BRIEF_MAX}
          </span>
        </label>
        <textarea
          id="di-brief"
          rows={4}
          value={m.settings.brief}
          onChange={(event) => m.setBrief(event.target.value)}
          aria-invalid={m.issue ? true : undefined}
          aria-describedby={m.issue ? "di-brief-issue" : undefined}
          className={`w-full resize-y border-0 bg-[repeating-linear-gradient(transparent_0,transparent_23px,#CFCBC0_23px,#CFCBC0_24px)] px-0 py-0 text-base leading-6 hover:bg-[#F6F4EE] aria-invalid:outline-2 aria-invalid:outline-[#C8102E] lg:text-[13px] ${ring}`}
          style={{ fontFamily: "inherit" }}
        />
        {m.issue ? (
          <p id="di-brief-issue" className="flex gap-1.5 text-[12px] text-[#C8102E]">
            <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {m.issue}
          </p>
        ) : null}
      </div>

      {CONTROLS.map((control) => (
        <fieldset key={control.key} className="grid grid-cols-[6.5rem_minmax(0,1fr)] border-b border-[#1D1D1B]">
          <legend className="sr-only">{control.label}</legend>
          <span aria-hidden className="border-r border-[#1D1D1B] px-4 py-2 text-[12px]">
            {control.label}
          </span>
          <div className="flex flex-wrap gap-1.5 px-3 py-2">
            {control.options.map((option) => {
              const checked = m.settings[control.key] === option.id
              return (
                <label
                  key={option.id}
                  title={option.hint}
                  className={`flex min-h-10 cursor-pointer items-center gap-1.5 border px-2 text-[12px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0078BF] lg:min-h-8 ${
                    checked ? "border-[#1D1D1B] bg-[#1D1D1B] text-[#FBFAF6]" : "border-[#B9B4A6] hover:border-[#1D1D1B]"
                  }`}
                >
                  <input type="radio" name={`di-${control.key}`} checked={checked} onChange={() => m.setControl(control.key, option.id)} className="sr-only" />
                  <span aria-hidden className={`inline-block size-2.5 border ${checked ? "border-[#FBFAF6] bg-[#FF48B0]" : "border-[#1D1D1B]"}`} />
                  {option.label}
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col gap-3 px-4 py-3">
        <p role="status" aria-live="polite" className="flex items-center gap-2 text-[12px]">
          {m.busy ? <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" /> : null}
          {ticketStatus(m)}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Stamp primary onClick={m.generate} busy={m.busy} label="Generate" icon={<Printer aria-hidden className="size-4" />} />
          <Stamp onClick={m.save} busy={m.saveStatus === "saving"} label="Save" icon={<Save aria-hidden className="size-4" />} />
          <Stamp onClick={() => m.exportCampaign()} busy={m.exportStatus === "exporting"} label="Export" icon={<Download aria-hidden className="size-4" />} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[12px]">
            <input type="checkbox" checked={m.failNext} onChange={(event) => m.setFailNext(event.target.checked)} className={`size-4 accent-[#C8102E] ${ring}`} />
            Jam the next run (forecast outage)
          </label>
          <button type="button" onClick={m.reset} className={`inline-flex min-h-10 items-center gap-1.5 px-1 text-[12px] underline decoration-[#B9B4A6] underline-offset-4 hover:decoration-[#1D1D1B] ${ring}`}>
            <RotateCcw aria-hidden className="size-3.5" />
            New ticket
          </button>
        </div>
      </div>
    </section>
  )
}

function Stamp({ primary, onClick, busy, label, icon }: { primary?: boolean; onClick: () => void; busy: boolean; label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`${display.className} inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#1D1D1B] text-[16px] font-extrabold tracking-[0.01em] uppercase [font-stretch:80%] transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:shadow-[3px_3px_0_#1D1D1B] active:translate-y-0 active:shadow-none disabled:cursor-progress disabled:opacity-70 ${ring} ${
        primary ? "bg-[#FF48B0] text-[#1D1D1B]" : "bg-[#FBFAF6] hover:bg-white"
      }`}
    >
      {busy ? <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : icon}
      {label}
    </button>
  )
}

function ProofBench({ m }: { m: MuseStudio }) {
  const ink = inks[m.output.settings.style] ?? inks.pinkblue
  const sheet = sheets[m.output.settings.channel] ?? sheets.zine
  const v = m.current
  const error = (m.generateStatus === "error" && m.generateError) || (m.saveStatus === "error" && m.saveError) || (m.exportStatus === "error" && m.exportError) || null

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = VARIANT_IDS[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3]
    m.select(next)
    document.getElementById(`di-plate-${next}`)?.focus()
  }

  return (
    <section aria-labelledby="di-proofs" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="di-proofs" className={`${display.className} text-[40px] leading-[0.9] font-extrabold [font-stretch:62%] lg:text-[52px]`}>
          Proofs, run {m.output.run}
        </h2>
        <div role="tablist" aria-label="Proofs" className="flex gap-1.5">
          {VARIANT_IDS.map((id, index) => (
            <button
              key={id}
              id={`di-plate-${id}`}
              type="button"
              role="tab"
              aria-selected={m.selected === id}
              aria-controls="di-proof"
              tabIndex={m.selected === id ? 0 : -1}
              onClick={() => m.select(id)}
              onKeyDown={(event) => onKey(event, index)}
              className={`flex min-h-12 min-w-[6.5rem] flex-col items-start justify-center border-2 border-[#1D1D1B] px-2.5 text-left transition-colors ${ring} ${
                m.selected === id ? "bg-[#1D1D1B] text-[#FBFAF6]" : "bg-[#FBFAF6] hover:bg-white"
              }`}
            >
              <span className={`${display.className} text-[18px] leading-none font-extrabold`}>Proof {id}</span>
              <span className="max-w-[8rem] truncate text-[11px]">{m.output.variants[id].name}</span>
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p role="alert" className="flex items-start gap-2 border-2 border-[#C8102E] bg-[#FBFAF6] px-3 py-2 text-[13px] text-[#8E0B21]">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <figure className="flex min-w-0 flex-col gap-2">
          <div className="relative flex min-h-[20rem] items-center justify-center border border-dashed border-[#B9B4A6] bg-[#E4E1D8] p-5 lg:h-[31rem] lg:min-h-0">
            {m.stale && !m.busy ? (
              <p className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] bg-[#1D1D1B] px-2.5 py-1.5 text-[12px] text-[#FBFAF6]">
                Old proof. The ticket changed after run {m.output.run}; generate to pull a fresh one.
              </p>
            ) : null}
            <div
              id="di-proof"
              role="tabpanel"
              aria-labelledby={`di-plate-${m.selected}`}
              className={`relative max-h-full overflow-hidden bg-[#FBFAF6] shadow-[0_1px_0_#CFCBC0,0_10px_24px_-14px_rgba(29,29,27,0.35)] [container-type:inline-size] transition-opacity duration-300 motion-reduce:transition-none ${m.busy ? "opacity-40" : ""}`}
              style={{ aspectRatio: sheet.ratio, width: sheet.width }}
            >
              {ink.b ? (
                <div key={`${m.output.run}-${m.selected}-${m.output.settings.style}`} aria-hidden className="di-plate absolute inset-0 mix-blend-multiply" style={{ color: ink.b }}>
                  <span className="di-dots absolute top-[6%] right-[6%] size-[40cqw] rounded-full" />
                  <span className="absolute bottom-[7%] left-[7%] h-[7cqw] w-[44cqw]" style={{ background: ink.b }} />
                </div>
              ) : null}
              <div className="absolute inset-0 flex flex-col justify-between p-[7cqw] mix-blend-multiply" style={{ color: ink.a }}>
                <p className={`${display.className} text-[clamp(1.4rem,11.5cqw,3.6rem)] leading-[0.92] font-extrabold [font-stretch:70%] text-balance`}>{v.headline}</p>
                <div className="flex flex-col gap-[2.5cqw]">
                  <p className="max-w-[40ch] text-[clamp(0.7rem,3.2cqw,0.95rem)] leading-[1.45]">{v.body}</p>
                  <p className="flex flex-wrap items-center justify-between gap-2 text-[clamp(0.7rem,3cqw,0.9rem)] font-medium">
                    <span className="border-2 px-2 py-1" style={{ borderColor: ink.a }}>
                      {v.cta}
                    </span>
                    <span translate="no">{spec.product}</span>
                  </p>
                </div>
              </div>
            </div>
            {m.busy ? (
              <p className="absolute inset-x-0 bottom-3 text-center text-[12px]">
                {m.stageLabel} <span className="tabular-nums">{m.progress}%</span>
              </p>
            ) : null}
          </div>
          <figcaption className="flex flex-wrap justify-between gap-x-4 text-[12px]">
            <span>{sheet.label}</span>
            <span>{ink.label}</span>
          </figcaption>
        </figure>

        <div className="flex min-w-0 flex-col gap-4">
          <section aria-labelledby="di-count">
            <h3 id="di-count" className="border-b-2 border-[#1D1D1B] pb-1 text-[12px] font-medium">
              Forecast, proof {m.selected} (simulated)
            </h3>
            <dl>
              {METRICS.map((metric) => {
                const value = m.current.metrics[metric.key]
                const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
                return (
                  <div key={metric.key} className="flex items-baseline justify-between gap-2 border-b border-[#CFCBC0] py-2">
                    <dt className="text-[12px]">{metric.label}</dt>
                    <dd className="text-right">
                      <span className={`${display.className} block text-[26px] leading-none font-extrabold tabular-nums [font-stretch:75%]`}>
                        {metric.key === "reach" ? formatReach(value) : formatPercent(value)}
                      </span>
                      <span className={`text-[11px] tabular-nums ${delta?.startsWith("−") ? "text-[#C8102E]" : delta ? "text-[#005A90]" : ""}`}>{delta ?? "first pull"}</span>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </section>

          <section aria-labelledby="di-spike">
            <h3 id="di-spike" className="border-b-2 border-[#1D1D1B] pb-1 text-[12px] font-medium">
              On the spike
            </h3>
            <ul>
              {m.recent.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => m.restore(item)} className={`flex min-h-11 w-full items-center gap-2 border-b border-[#CFCBC0] text-left text-[12px] hover:bg-[#FBFAF6] ${ring}`}>
                    <span className={`${display.className} w-4 text-[15px] font-extrabold`}>{item.variant}</span>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    <span className="shrink-0 text-[11px]">{item.saved ? `filed ${item.when}` : item.when}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="di-log">
            <h3 id="di-log" className="border-b-2 border-[#1D1D1B] pb-1 text-[12px] font-medium">
              Press log
            </h3>
            <ol className="mt-1 flex flex-col gap-0.5 text-[11px] leading-[1.45]">
              {m.log.slice(0, 5).map((entry) => (
                <li key={entry.id} className={entry.tone === "error" ? "text-[#C8102E]" : entry.tone === "success" ? "text-[#005A90]" : ""}>
                  <span className="tabular-nums">{entry.at}</span> {entry.text}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  )
}
