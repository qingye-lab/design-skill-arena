"use client"

import { Anton, Work_Sans } from "next/font/google"
import { AlertTriangle, ArrowUpRight, Check, Download, Loader2, RotateCcw, Save } from "lucide-react"
import { useState, type CSSProperties } from "react"

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
  type RecentCampaign,
  type StudioSpec,
  type VariantId,
} from "./core"

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" })
const work = Work_Sans({ subsets: ["latin"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "visual-frontend",
  product: "Volta S1",
  brief:
    "Volta S1 is a 14 kg electric city scooter that folds in three seconds and rides 25 km per charge. Launch it on 12 October to people who hate the last mile, and sell the first 2,000 units on pre-order.",
  audiences: [
    { id: "commuters", label: "Train commuters", hint: "Station to desk", size: 1240000, lift: { conversion: 1.12 } },
    { id: "campus", label: "Campus riders", hint: "Lecture to lab", size: 680000, lift: { ctr: 1.16, conversion: 0.86 } },
    { id: "flats", label: "Flat dwellers", hint: "No room for a bike", size: 910000, lift: { ctr: 0.96, conversion: 1.05 } },
  ],
  channels: [
    { id: "street", label: "Street poster", lift: { reach: 1.24, ctr: 0.62, conversion: 0.94 } },
    { id: "story", label: "Instagram story", lift: { reach: 1.02, ctr: 1.18 } },
    { id: "metro", label: "Metro screen", lift: { reach: 0.88, ctr: 0.84, conversion: 1.14 } },
  ],
  tones: [
    { id: "loud", label: "Loud", lift: { ctr: 1.1, conversion: 0.95 } },
    { id: "wry", label: "Wry", lift: { ctr: 1.04, reach: 1.03 } },
    { id: "plain", label: "Plain-spoken", lift: { conversion: 1.09 } },
  ],
  styles: [
    { id: "vermilion", label: "Vermilion field", lift: { ctr: 1.07 } },
    { id: "ultramarine", label: "Ultramarine field", lift: { reach: 1.03, ctr: 1.01 } },
    { id: "bone", label: "Bone field", lift: { conversion: 1.04 } },
  ],
  variants: [
    {
      id: "A",
      name: "Two-minute city",
      headline: "City in two minutes.",
      body: "Unfold {product} at the station, ride the last stretch, fold it under your desk. Built for {audience}.",
      cta: "Reserve yours",
      lift: { ctr: 1.05 },
    },
    {
      id: "B",
      name: "Fold and carry",
      headline: "Folds in three seconds. Rides all week.",
      body: "14 kg, one latch, 25 km a charge. {product} goes up the stairs and into the lift with you.",
      cta: "See it fold",
      lift: { reach: 1.06, conversion: 0.95 },
    },
    {
      id: "C",
      name: "Car stays parked",
      headline: "The car stays parked.",
      body: "Pre-order {product} before 12 October and make the short trips the fast ones.",
      cta: "Pre-order now",
      lift: { ctr: 0.94, conversion: 1.13 },
    },
  ],
  recent: [
    { id: "vf-r1", title: "Volta S0 winter clearance", variant: "B", when: "Mon" },
    { id: "vf-r2", title: "Station pop-up, Kings Cross", variant: "A", when: "18 Sep" },
    { id: "vf-r3", title: "Campus ride week", variant: "C", when: "9 Sep" },
  ],
  initialRun: 4,
}

type Field = {
  bg: string
  text: string
  bar: string
  barText: string
  block: string
  disc: string
  body: string
  accent: string
  hub: string
}

const INK = "#0D0D0F"
const BONE = "#F1ECE2"
const VERMILION = "#FF4A1C"
const ULTRA = "#1B2BD1"

/* Every pairing that carries text was checked for AA: ink on vermilion 5.8:1, bone on ultramarine 7.7:1, ink on bone 16:1. */
const FIELDS: Record<string, Field> = {
  vermilion: { bg: VERMILION, text: INK, bar: INK, barText: BONE, block: ULTRA, disc: BONE, body: INK, accent: VERMILION, hub: BONE },
  ultramarine: { bg: ULTRA, text: BONE, bar: VERMILION, barText: INK, block: BONE, disc: VERMILION, body: INK, accent: ULTRA, hub: BONE },
  bone: { bg: BONE, text: INK, bar: ULTRA, barText: BONE, block: VERMILION, disc: ULTRA, body: INK, accent: BONE, hub: VERMILION },
}

function splitHeadline(text: string) {
  const words = text.split(" ")
  const cut = Math.max(1, Math.ceil(words.length / 2))
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")] as const
}

const SCOPED = `
@keyframes vf-wipe { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
.vf-wipe { animation: vf-wipe 620ms cubic-bezier(0.76, 0, 0.24, 1) both; }
.vf-proof { transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease-out; }
.vf-proof-input:checked + .vf-proof { transform: translateY(-10px); box-shadow: 0 0 0 3px var(--vf-band), 0 0 0 6px var(--vf-ring); }
.vf-proof-input:not(:checked) + .vf-proof:hover { transform: translateY(-5px); }
.vf-proof-input:focus-visible + .vf-proof { outline: 2px dashed var(--vf-ring); outline-offset: 10px; }
@media (prefers-reduced-motion: reduce) {
  .vf-wipe { animation: none; }
  .vf-proof { transition: none; }
  .vf-proof-input:checked + .vf-proof, .vf-proof-input:not(:checked) + .vf-proof:hover { transform: none; }
}
`

export default function VisualFrontend() {
  const m = useMuseStudio(spec)
  const [armed, setArmed] = useState(false)
  const field = FIELDS[m.output.settings.style] ?? FIELDS.vermilion
  const variant = m.current
  const [lead, tail] = splitHeadline(variant.headline)
  const sig = `${m.selected}-${m.output.settings.style}-${m.output.run}`
  const channel = m.labelOf("channel", m.output.settings.channel)

  function choose(id: VariantId) {
    setArmed(true)
    m.select(id)
  }

  function print() {
    setArmed(true)
    m.generate()
  }

  function restore(item: RecentCampaign) {
    setArmed(true)
    m.restore(item)
  }

  const metrics = [
    { label: "Reach", value: formatReach(variant.metrics.reach), delta: formatDelta(variant.metrics.reach, m.previous?.metrics.reach, "reach") },
    { label: "CTR", value: formatPercent(variant.metrics.ctr), delta: formatDelta(variant.metrics.ctr, m.previous?.metrics.ctr, "percent") },
    {
      label: "Conversion",
      value: formatPercent(variant.metrics.conversion),
      delta: formatDelta(variant.metrics.conversion, m.previous?.metrics.conversion, "percent"),
    },
  ]

  const stageText = `Printing run ${m.output.run + 1}: ${m.stageLabel}`

  return (
    <div
      className={`${work.className} min-h-[100dvh] bg-[#0D0D0F] text-[#F1ECE2] selection:bg-[#FF4A1C] selection:text-[#0D0D0F] lg:grid lg:h-[100dvh] lg:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)] lg:overflow-hidden`}
    >
      <style>{SCOPED}</style>

      {/* ---------- Poster canvas ---------- */}
      <section aria-labelledby="vf-poster-headline" className="relative flex min-w-0 flex-col lg:h-[100dvh]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0D0D0F] sm:aspect-[5/4] lg:aspect-auto lg:min-h-0 lg:flex-1">
          <div
            key={sig}
            className={`absolute inset-0 flex flex-col ${armed ? "vf-wipe" : ""}`}
            style={{ background: field.bg, color: field.text }}
          >
            {/* top strip */}
            <div className="relative flex items-center justify-between gap-3 px-4 pt-3 sm:px-7 sm:pt-5">
              <p className={`${anton.className} text-[22px] uppercase leading-none tracking-[0.02em] sm:text-[28px]`}>
                Volta S1
              </p>
              <p className="text-right text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] tabular-nums sm:text-[12px]">
                {channel}
                <span className="hidden sm:inline">, run {m.output.run}, printed {m.output.at}</span>
              </p>
              {m.busy && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1.5 origin-left transition-[width] duration-300"
                  style={{ width: `${m.progress}%`, background: field.text }}
                />
              )}
            </div>

            {/* composition */}
            <div className={`relative min-h-0 flex-1 transition-opacity duration-300 ${m.busy ? "opacity-55" : ""}`}>
              <span aria-hidden className="absolute bottom-0 right-0 top-[44%] w-[54%] sm:top-0 sm:w-[44%]" style={{ background: field.block }} />
              <span
                aria-hidden
                className="absolute right-[5%] top-[40%] aspect-square w-[38%] rounded-full sm:right-[6%] sm:top-[9%] sm:w-[31%]"
                style={{ background: field.disc }}
              />
              <div aria-hidden className="absolute bottom-[3%] right-[1%] w-[58%] sm:bottom-[5%] sm:right-[2%] sm:w-[50%]">
                <Scooter body={field.body} accent={field.accent} hub={field.hub} />
              </div>

              <div className="relative flex h-full max-w-[100%] flex-col justify-between px-4 pb-4 pt-3 sm:max-w-[56%] sm:px-7 sm:pb-6 sm:pt-5">
                <h2
                  id="vf-poster-headline"
                  className={`${anton.className} max-w-none text-[clamp(2.25rem,6.2vw,6rem)] sm:max-w-[11ch] uppercase leading-[0.88] tracking-[0.005em] text-balance`}
                >
                  <span className="block">{lead}</span>
                  {tail && (
                    <span className="box-decoration-clone px-[0.1em]" style={{ background: field.bar, color: field.barText }}>
                      {tail}
                    </span>
                  )}
                </h2>
                <div>
                  <p className="mb-4 hidden max-w-[34ch] text-[15px] font-medium leading-snug sm:block">{variant.body}</p>
                  <span
                    className={`${anton.className} inline-flex items-center gap-2 px-4 py-2.5 text-[18px] uppercase leading-none tracking-[0.03em] sm:px-5 sm:py-3.5 sm:text-[24px]`}
                    style={{ background: field.text, color: field.bg }}
                  >
                    {variant.cta}
                    <ArrowUpRight aria-hidden className="size-5 sm:size-6" strokeWidth={2.5} />
                  </span>
                </div>
              </div>

              {m.stale && !m.busy && (
                <p
                  className="absolute right-3 top-2 flex max-w-[15rem] rotate-[2deg] items-start gap-2 px-3 py-2 text-[12px] font-semibold leading-snug shadow-[0_6px_14px_rgba(13,13,15,0.28)] sm:right-6 sm:top-4 sm:text-[13px]"
                  style={{ background: field.text, color: field.bg }}
                >
                  <RotateCcw aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  Proof out of date. Generate again to re-print it with your new settings.
                </p>
              )}
            </div>

            {/* printed spec band */}
            <div className="relative px-4 py-3 sm:px-7 sm:py-4 lg:min-h-[132px] lg:pr-[360px]" style={{ background: field.text, color: field.bg }}>
              <dl className="grid grid-cols-3 gap-3 sm:max-w-[520px]">
                {metrics.map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.08em]">{metric.label}</dt>
                    <dd className={`${anton.className} mt-0.5 text-[24px] leading-none tabular-nums sm:text-[40px]`}>{metric.value}</dd>
                    {metric.delta && (
                      <dd className="mt-1 text-[11px] font-semibold tabular-nums">
                        {metric.delta} <span className="hidden sm:inline">vs run {m.output.run - 1}</span>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
              <p className="mt-2 flex flex-wrap gap-x-3 text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-[11px]">
                <span>Simulated forecast, route {m.selected}</span>
                <span>
                  Set by {m.modelName} / {m.chain}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Proofs m={m} field={field} onChoose={choose} />
        <p className="bg-[#0D0D0F] px-4 pb-1 pt-3 text-[14px] leading-snug text-[#D6D0C4] sm:hidden">{variant.body}</p>
      </section>

      {/* ---------- Print desk ---------- */}
      <aside
        aria-labelledby="vf-desk-title"
        className="min-w-0 px-4 pb-10 pt-5 sm:px-6 lg:h-[100dvh] lg:overflow-y-auto lg:border-l lg:border-[#F1ECE2]/15 lg:pb-6 lg:pt-5 [scrollbar-color:#4A4845_#0D0D0F] [scrollbar-width:thin]"
      >
        <div className="flex items-end justify-between gap-3 border-b border-[#F1ECE2]/20 pb-3">
          <div className="min-w-0">
            <h1 id="vf-desk-title" className={`${anton.className} text-[30px] uppercase leading-none tracking-[0.01em]`}>
              Print desk
            </h1>
            <p className="mt-1 text-[13px] text-[#BDB7AC]">Volta S1 launch, run {m.output.run} on the wall</p>
          </div>
          <button
            type="button"
            onClick={m.reset}
            className="inline-flex min-h-10 items-center gap-1.5 px-2 text-[13px] font-semibold text-[#F1ECE2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4A1C]"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Reset
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="vf-brief" className="text-[12px] font-semibold uppercase tracking-[0.08em]">
              Brief
            </label>
            <span className="text-[12px] tabular-nums text-[#BDB7AC]">
              {m.settings.brief.trim().length} / {BRIEF_MAX}
            </span>
          </div>
          <textarea
            id="vf-brief"
            rows={3}
            value={m.settings.brief}
            onChange={(event) => m.setBrief(event.target.value)}
            aria-invalid={m.issue ? true : undefined}
            aria-describedby={m.issue ? "vf-brief-issue" : undefined}
            className="mt-1.5 block w-full resize-y border border-[#F1ECE2]/50 bg-transparent px-3 py-2 text-[14px] leading-snug text-[#F1ECE2] caret-[#FF4A1C] outline-none hover:border-[#F1ECE2]/80 focus-visible:border-[#FF4A1C] focus-visible:ring-2 focus-visible:ring-[#FF4A1C] aria-invalid:border-[#FF4A1C]"
          />
          {m.issue && (
            <p id="vf-brief-issue" className="mt-1.5 text-[12px] font-medium text-[#FF4A1C]">
              {m.issue}
            </p>
          )}
        </div>

        <div className="mt-3 space-y-3">
          <Tiles legend="Audience" control="audience" options={spec.audiences} value={m.settings.audience} onPick={m.setControl} />
          <Tiles legend="Channel" control="channel" options={spec.channels} value={m.settings.channel} onPick={m.setControl} />
          <Tiles legend="Tone" control="tone" options={spec.tones} value={m.settings.tone} onPick={m.setControl} />
          <Tiles legend="Colour field" control="style" options={spec.styles} value={m.settings.style} onPick={m.setControl} swatches />
        </div>

        <label className="mt-3 flex min-h-10 cursor-pointer items-center gap-2.5 text-[13px] text-[#D6D0C4] hover:text-[#F1ECE2]">
          <input
            type="checkbox"
            checked={m.failNext}
            onChange={(event) => m.setFailNext(event.target.checked)}
            className="size-4 shrink-0 accent-[#FF4A1C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4A1C]"
          />
          Jam the press: simulate a forecast outage on the next run
        </label>

        <button
          type="button"
          onClick={print}
          disabled={m.busy}
          className="relative mt-2 flex min-h-[72px] w-full items-center justify-between gap-3 overflow-hidden bg-[#FF4A1C] px-5 py-3 text-left text-[#0D0D0F] transition-colors duration-150 hover:bg-[#F1ECE2] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#F1ECE2] active:translate-y-px disabled:cursor-progress disabled:hover:bg-[#FF4A1C]"
        >
          <span className="min-w-0">
            <span className={`${anton.className} block text-[34px] uppercase leading-none tracking-[0.02em]`}>Generate</span>
            <span className="mt-1 block text-[12px] font-semibold tabular-nums">
              {m.busy
                ? `${m.stageLabel}, ${m.progress}%`
                : m.stale
                  ? `Settings changed. Print run ${m.output.run + 1}`
                  : `Reprint all three routes as run ${m.output.run + 1}`}
            </span>
          </span>
          {m.busy ? (
            <Loader2 aria-hidden className="size-7 shrink-0 animate-spin motion-reduce:animate-none" />
          ) : (
            <ArrowUpRight aria-hidden className="size-8 shrink-0" strokeWidth={2.25} />
          )}
          {m.busy && (
            <span aria-hidden className="absolute bottom-0 left-0 h-1.5 bg-[#0D0D0F] transition-[width] duration-300" style={{ width: `${m.progress}%` }} />
          )}
        </button>

        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={m.save}
            disabled={m.saveStatus === "saving"}
            className="flex min-h-12 items-center justify-center gap-2 border border-[#F1ECE2]/70 px-3 text-[14px] font-semibold transition-colors duration-150 hover:bg-[#F1ECE2] hover:text-[#0D0D0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4A1C] active:translate-y-px disabled:cursor-progress"
          >
            {m.saveStatus === "saving" ? (
              <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
            ) : m.saveStatus === "saved" ? (
              <Check aria-hidden className="size-4" />
            ) : (
              <Save aria-hidden className="size-4" />
            )}
            {m.saveStatus === "saving" ? "Saving" : m.saveStatus === "saved" ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => m.exportCampaign()}
            disabled={m.exportStatus === "exporting"}
            className="flex min-h-12 items-center justify-center gap-2 border border-[#F1ECE2]/70 px-3 text-[14px] font-semibold transition-colors duration-150 hover:bg-[#F1ECE2] hover:text-[#0D0D0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4A1C] active:translate-y-px disabled:cursor-progress"
          >
            {m.exportStatus === "exporting" ? (
              <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
            ) : m.exportStatus === "exported" ? (
              <Check aria-hidden className="size-4" />
            ) : (
              <Download aria-hidden className="size-4" />
            )}
            {m.exportStatus === "exporting" ? "Exporting" : m.exportStatus === "exported" ? "Exported" : "Export"}
          </button>
        </div>

        <div aria-live="polite" className="mt-2 min-h-5 text-[13px] leading-snug text-[#D6D0C4]">
          {m.busy
            ? stageText
            : m.generateStatus === "success"
              ? `Run ${m.output.run} printed. Proofs A, B and C are pinned under the poster.`
              : m.saveStatus === "saved"
                ? `Route ${m.selected} saved to recent runs.`
                : m.exportStatus === "exported"
                  ? `Route ${m.selected} exported as a JSON spec.`
                  : m.stale
                    ? `The wall still shows run ${m.output.run}. Generate to print your changes.`
                    : `Run ${m.output.run} on the wall, printed ${m.output.at}.`}
        </div>

        {[m.generateError, m.saveError, m.exportError].map((error, index) =>
          error ? (
            <p
              key={index}
              role="alert"
              className="mt-2 flex items-start gap-2 border border-[#FF4A1C] px-3 py-2.5 text-[13px] leading-snug text-[#F1ECE2]"
            >
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-[#FF4A1C]" />
              {error}
            </p>
          ) : null
        )}

        <div className="mt-6 border-t border-[#F1ECE2]/20 pt-4">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em]">Recent runs</h2>
          <ul className="mt-2">
            {m.recent.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => restore(item)}
                  className="group flex min-h-11 w-full items-center gap-3 px-2 text-left text-[13px] hover:bg-[#F1ECE2] hover:text-[#0D0D0F] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF4A1C]"
                >
                  <span className={`${anton.className} w-4 shrink-0 text-[18px] leading-none`}>{item.variant}</span>
                  <span className="min-w-0 flex-1 truncate font-medium">{item.title}</span>
                  <span className="shrink-0 tabular-nums text-[#BDB7AC] group-hover:text-[#3A3833]">
                    {item.saved ? `Saved ${item.when}` : item.when}
                  </span>
                  <span className="shrink-0 font-semibold underline underline-offset-4">Restore</span>
                </button>
              </li>
            ))}
          </ul>
          <h2 className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em]">Press log</h2>
          <ol className="mt-2 space-y-1.5 text-[12px] leading-snug">
            {m.log.slice(0, 5).map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <span className="w-10 shrink-0 tabular-nums text-[#BDB7AC]">{entry.at}</span>
                <span className={entry.tone === "error" ? "text-[#FF4A1C]" : "text-[#D6D0C4]"}>{entry.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  )
}

function Tiles({
  legend,
  control,
  options,
  value,
  onPick,
  swatches = false,
}: {
  legend: string
  control: ControlKey
  options: Option[]
  value: string
  onPick: (key: ControlKey, id: string) => void
  swatches?: boolean
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-[12px] font-semibold uppercase tracking-[0.08em]">{legend}</legend>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        {options.map((option) => (
          <label key={option.id} className="relative min-w-0">
            <input
              type="radio"
              name={`vf-${control}`}
              value={option.id}
              checked={value === option.id}
              onChange={() => onPick(control, option.id)}
              className="peer sr-only"
            />
            <span
              title={option.hint}
              className={`flex h-full cursor-pointer flex-col justify-center border border-[#F1ECE2]/45 px-2.5 text-[13px] font-semibold leading-tight transition-colors duration-150 hover:border-[#F1ECE2] hover:bg-[#F1ECE2] hover:text-[#0D0D0F] peer-checked:border-[#F1ECE2] peer-checked:bg-[#F1ECE2] peer-checked:text-[#0D0D0F] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FF4A1C] ${
                swatches ? "min-h-14 gap-1.5 py-2" : "min-h-11 py-1.5"
              }`}
            >
              {swatches && (
                <span aria-hidden className="block h-2.5 w-full border border-[#F1ECE2]/40" style={{ background: FIELDS[option.id]?.bg }} />
              )}
              <span className="flex items-center justify-between gap-1">
                <span className="min-w-0 break-words">{option.label}</span>
                {value === option.id && <Check aria-hidden className="size-3.5 shrink-0" strokeWidth={3} />}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Proofs({ m, field, onChoose }: { m: MuseStudio; field: Field; onChoose: (id: VariantId) => void }) {
  const vars = { "--vf-band": field.text, "--vf-ring": field.bg } as CSSProperties
  return (
    <fieldset
      className="grid grid-cols-3 gap-3 px-4 pb-5 pt-4 sm:px-7 lg:absolute lg:bottom-6 lg:right-7 lg:flex lg:gap-4 lg:p-0"
      style={{ ...vars, background: field.text }}
    >
      <legend className="sr-only">Route shown on the poster</legend>
      {VARIANT_IDS.map((id) => {
        const route = m.output.variants[id]
        return (
          <label key={id} className="relative block min-w-0 cursor-pointer lg:w-[96px]">
            <input
              type="radio"
              name="vf-route"
              value={id}
              checked={m.selected === id}
              onChange={() => onChoose(id)}
              className="vf-proof-input peer sr-only"
            />
            <span
              className="vf-proof relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-2 shadow-[0_8px_18px_rgba(13,13,15,0.35)]"
              style={{ background: field.bg, color: field.text }}
            >
              <span aria-hidden className="absolute right-0 top-0 h-full w-[40%]" style={{ background: field.block }} />
              <span
                aria-hidden
                className="absolute left-1/2 top-1 size-2.5 -translate-x-1/2 rounded-full"
                style={{ background: field.hub, boxShadow: `0 0 0 2px ${field.text}` }}
              />
              <span className={`${anton.className} relative text-[34px] leading-none`}>{id}</span>
              <span className="relative">
                <span className="block text-[10px] font-bold uppercase leading-tight tracking-[0.04em]">
                  <span className="sr-only">Route {id}: </span>
                  {route.name}
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold tabular-nums">CTR {formatPercent(route.metrics.ctr)}</span>
              </span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}

function Scooter({ body, accent, hub }: { body: string; accent: string; hub: string }) {
  return (
    <svg viewBox="0 0 420 300" className="h-auto w-full" role="presentation">
      <path d="M26 212 A54 54 0 0 1 128 196" fill="none" stroke={body} strokeWidth="11" strokeLinecap="round" />
      <line x1="150" y1="228" x2="128" y2="266" stroke={body} strokeWidth="7" strokeLinecap="round" />
      <line x1="332" y1="214" x2="296" y2="54" stroke={body} strokeWidth="22" strokeLinecap="round" />
      <line x1="258" y1="52" x2="340" y2="40" stroke={body} strokeWidth="14" strokeLinecap="round" />
      <line x1="258" y1="52" x2="278" y2="49" stroke={accent} strokeWidth="9" strokeLinecap="round" />
      <circle cx="306" cy="92" r="8" fill={accent} stroke={body} strokeWidth="4" />
      <rect x="66" y="202" width="258" height="28" rx="14" fill={body} />
      <rect x="94" y="207" width="190" height="8" rx="4" fill={accent} />
      <circle cx="322" cy="172" r="13" fill={accent} stroke={body} strokeWidth="6" />
      <circle cx="78" cy="234" r="46" fill={body} />
      <circle cx="78" cy="234" r="17" fill={hub} />
      <circle cx="344" cy="234" r="46" fill={body} />
      <circle cx="344" cy="234" r="17" fill={hub} />
    </svg>
  )
}
