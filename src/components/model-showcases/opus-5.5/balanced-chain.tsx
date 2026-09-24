"use client"

import { Gabarito, Source_Serif_4 } from "next/font/google"
import {
  AlertCircle,
  ArrowRight,
  Check,
  Download,
  RotateCcw,
  Save,
  TriangleAlert,
} from "lucide-react"
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
  type LogEntry,
  type Option,
  type RenderedVariant,
  type StudioSpec,
  type VariantId,
} from "./core"

const ui = Gabarito({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" })
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"], display: "swap" })

/* ---------- the spec this page owns ---------- */

const spec: StudioSpec = {
  showcaseId: "balanced-chain",
  product: "Ardent Kettle 1.2 L",
  brief:
    "Launch the Ardent Kettle 1.2 L, a stovetop kettle with a stay-cool walnut handle and a ninety-second boil, for home coffee drinkers replacing a plastic electric kettle. The kitchen launch window opens on 4 October and the waitlist opens a fortnight earlier.",
  audiences: [
    {
      id: "pour-over",
      label: "Pour-over regulars",
      hint: "Already weigh their beans",
      size: 268000,
      lift: { conversion: 1.2 },
    },
    {
      id: "switchers",
      label: "Electric kettle switchers",
      hint: "Looking to drop plastic",
      size: 512000,
      lift: { reach: 1.12, ctr: 0.94 },
    },
    {
      id: "gifting",
      label: "Kitchen gift buyers",
      hint: "Buying for someone else",
      size: 940000,
      lift: { reach: 1.34, ctr: 0.86, conversion: 0.92 },
    },
  ],
  channels: [
    { id: "waitlist", label: "Waitlist email", lift: { reach: 0.34, ctr: 2.3, conversion: 1.4 } },
    { id: "journal", label: "Coffee journal", lift: { reach: 0.88, ctr: 1.12 } },
    { id: "kitchen", label: "Kitchen stockists", lift: { reach: 0.72, ctr: 0.9, conversion: 1.14 } },
  ],
  tones: [
    { id: "measured", label: "Measured", lift: { ctr: 1.06 } },
    { id: "warm", label: "Warm", lift: { ctr: 1.14, conversion: 0.96 } },
    { id: "plain", label: "Plain", lift: { conversion: 1.12 } },
  ],
  styles: [
    { id: "porcelain", label: "Porcelain", lift: { ctr: 1.04 } },
    { id: "ink", label: "Ink press", lift: { conversion: 1.08 } },
    { id: "stone", label: "Stone wash", lift: { reach: 1.05 } },
  ],
  variants: [
    {
      id: "A",
      name: "Ninety seconds",
      headline: "Boils before the filter paper finishes folding.",
      body: "The Ardent Kettle 1.2 L brings a litre to 96 °C in ninety seconds, then holds it while you finish setting up. Built for {audience} on a weekday morning.",
      cta: "Join the waitlist",
      note: "No plastic in the water path.",
      lift: { ctr: 1.08 },
    },
    {
      id: "B",
      name: "Stays cool",
      headline: "The handle stays cool. Your hands stay yours.",
      body: "A walnut handle on a one-piece steel body, so there is nothing to trap water and nothing to burn. Reserve one for the {tone} launch on 4 October.",
      cta: "Reserve one",
      note: "Ten-year body warranty.",
      lift: { reach: 1.1, conversion: 0.94 },
    },
    {
      id: "C",
      name: "Off the counter",
      headline: "A kettle you leave on the hob on purpose.",
      body: "Made to be looked at rather than hidden behind the bread bin, for {audience} who would rather see their kitchen. Ships from the first {channel} drop.",
      cta: "See the finishes",
      note: "Three finishes, one body.",
      lift: { ctr: 0.94, conversion: 1.14 },
    },
  ],
  recent: [
    { id: "b1", title: "Grinder burr upgrade waitlist", variant: "B", when: "Mon" },
    { id: "b2", title: "Spring roast subscription", variant: "A", when: "14 Sep" },
    { id: "b3", title: "Filter paper bundle", variant: "C", when: "6 Sep" },
  ],
  initialRun: 6,
}

/* ---------- page vocabulary ---------- */

type Look = { canvas: string; ink: string; quiet: string; accent: string; rule: string }

const looks: Record<string, Look> = {
  porcelain: { canvas: "#FBF8F3", ink: "#241D16", quiet: "#6B5C4C", accent: "#9E4A2C", rule: "#E4DACB" },
  ink: { canvas: "#1E1A17", ink: "#F6F1E8", quiet: "#B0A393", accent: "#E0A277", rule: "#3A322B" },
  stone: { canvas: "#E6E4DC", ink: "#22221E", quiet: "#5E5F55", accent: "#3F6152", rule: "#CFCCC0" },
}

const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E4A2C]"

const logTone: Record<LogEntry["tone"], string> = {
  info: "text-[#6B6459]",
  success: "text-[#3D6B4E]",
  error: "text-[#A03A28]",
}

function optionsFor(key: ControlKey, list: { audiences: Option[]; channels: Option[]; tones: Option[]; styles: Option[] }) {
  if (key === "audience") return list.audiences
  if (key === "channel") return list.channels
  if (key === "tone") return list.tones
  return list.styles
}

/* ---------- the run rail ---------- */

type RunRailProps = {
  runs: number
  busy: boolean
  progress: number
  stage: number
  stageLabel: string
  runAt: string
  stale: boolean
}

function RunRail({ runs, busy, progress, stage, stageLabel, runAt, stale }: RunRailProps) {
  return (
    <section aria-labelledby="bc-rail-title" className="rounded-sm border border-[#DDD3C2] bg-[#F7F3EB] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="bc-rail-title" className="text-[13px] font-semibold tracking-tight">
          Runs
        </h2>
        <p className="font-mono text-[10.5px] tabular-nums text-[#6B6459]">
          {busy ? `run ${runs + 1} in flight` : `${runs} complete`}
        </p>
      </div>

      <ol className="mt-3 flex flex-col gap-1.5">
        {GENERATION_STAGES.map((label, index) => {
          const reached = !busy || index <= stage
          const active = busy && index === stage
          return (
            <li key={label} aria-current={active ? "step" : undefined} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={`inline-block w-[2px] shrink-0 rounded-full ${reached ? "bg-[#9E4A2C]" : "bg-[#DED4C3]"}`}
                style={{ height: active ? 18 : 12 }}
              />
              <span
                className={`min-w-0 text-[12px] ${
                  active ? "font-semibold text-[#241D16]" : reached ? "text-[#4A4238]" : "text-[#9A9082]"
                }`}
              >
                {label}
              </span>
              {active ? (
                <span aria-hidden className="ml-auto size-[6px] shrink-0 rounded-full bg-[#9E4A2C] motion-safe:animate-pulse" />
              ) : (
                <span className="ml-auto shrink-0 font-mono text-[10.5px] tabular-nums text-[#9A9082]">{runAt}</span>
              )}
            </li>
          )
        })}
      </ol>

      <div aria-live="polite" className="mt-3 border-t border-[#DDD3C2] pt-3 text-[12px]">
        {busy ? (
          <div>
            <p className="font-semibold text-[#241D16]">{stageLabel}&hellip;</p>
            <div
              role="progressbar"
              aria-label="Generation progress"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[#E2D9C9]"
            >
              <div
                className="h-full rounded-full bg-[#9E4A2C]"
                style={{ width: `${progress}%`, transition: "width 240ms ease-out" }}
              />
            </div>
          </div>
        ) : stale ? (
          <p className="flex items-start gap-2 leading-relaxed text-[#7A5A15]">
            <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden />
            The settings have moved on since run {runs}. Generate to bring the desk up to date.
          </p>
        ) : (
          <p className="flex items-center gap-2 text-[#3D6B4E]">
            <Check className="size-3.5 shrink-0" aria-hidden />
            Run {runs} is on the desk.
          </p>
        )}
      </div>

      <p className="mt-3 border-t border-[#DDD3C2] pt-2.5 font-mono text-[10.5px] leading-relaxed text-[#6B6459]">
        Run {runs - 3} stopped short when the forecast service timed out. Reach, CTR and conversion are simulated in the
        browser.
      </p>
    </section>
  )
}

/* ---------- the desk ---------- */

type DeskProps = {
  variant: RenderedVariant
  channel: string
  style: string
  run: number
  look: Look
}

function Desk({ variant, channel, style, run, look }: DeskProps) {
  return (
    <article
      aria-label={`Preview of route ${variant.id}, ${variant.name}`}
      className="rounded-sm border p-5 sm:p-7"
      style={{ background: look.canvas, color: look.ink, borderColor: look.rule }}
    >
      <p className={`text-[19px] leading-snug text-balance sm:text-[22px] ${serif.className} font-semibold`}>
        {variant.headline}
      </p>
      <p className={`mt-3 max-w-[62ch] text-[13.5px] leading-relaxed ${serif.className}`} style={{ color: look.quiet }}>
        {variant.body}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span
          aria-hidden
          className="inline-flex h-10 items-center rounded-sm px-4 text-[13px] font-semibold"
          style={{ background: look.accent, color: look.canvas }}
        >
          {variant.cta}
        </span>
        {variant.note ? (
          <span className="font-mono text-[10.5px] leading-relaxed" style={{ color: look.quiet }}>
            {variant.note}
          </span>
        ) : null}
      </div>
      <p
        className="mt-5 border-t pt-2.5 font-mono text-[10.5px] tabular-nums"
        style={{ borderColor: look.rule, color: look.quiet }}
      >
        route {variant.id} &middot; {channel} &middot; {style} look &middot; run {run}
      </p>
    </article>
  )
}

/* ---------- the page ---------- */

export default function BalancedChain() {
  const m = useMuseStudio(spec)
  const look = looks[m.output.settings.style] ?? looks.porcelain
  const showIssue = m.generateStatus === "error" && m.issue !== null
  const generateLabel = m.busy
    ? `${m.stageLabel}\u2026`
    : m.stale
      ? "Generate with new settings"
      : "Generate again"

  function moveSelection(event: KeyboardEvent<HTMLButtonElement>, id: VariantId) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    const index = VARIANT_IDS.indexOf(id)
    const next = VARIANT_IDS[(index + step + VARIANT_IDS.length) % VARIANT_IDS.length]
    m.select(next)
    document.getElementById(`bc-route-${next}`)?.focus()
  }

  function moveOption(event: KeyboardEvent<HTMLSpanElement>, key: ControlKey, id: string) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (step === 0) return
    event.preventDefault()
    const list = optionsFor(key, m.spec)
    const index = list.findIndex((option) => option.id === id)
    const next = list[(index + step + list.length) % list.length]
    m.setControl(key, next.id)
    document.getElementById(`bc-${key}-${next.id}`)?.focus()
  }

  return (
    <div className={`${ui.className} min-h-screen bg-[#F2EDE4] text-[#241D16] selection:bg-[#9E4A2C]/25`}>
      <header className="border-b border-[#DDD3C2] bg-[#F7F3EB]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-tight">Muse Studio</h1>
            <p className="mt-0.5 font-mono text-[10.5px] text-[#6B6459]">
              {spec.product} &middot; kitchen launch, waitlist open
            </p>
          </div>
          <p className="font-mono text-[10.5px] leading-relaxed text-[#6B6459]">
            <span translate="no" className="border-b border-[#C8BCA8] pb-px text-[#4A4238]">
              {m.modelName}
            </span>
            , on the {m.chain} chain
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-7 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)_minmax(0,250px)]">
        {/* left room: the brief and its controls */}
        <section aria-labelledby="bc-brief-title" className="lg:order-1">
          <h2 id="bc-brief-title" className="text-[13px] font-semibold tracking-tight">
            The brief
          </h2>

          <label htmlFor="bc-brief" className="mt-3 block text-[12px] font-semibold">
            What is launching
          </label>
          <textarea
            id="bc-brief"
            value={m.settings.brief}
            onChange={(event) => m.setBrief(event.target.value)}
            rows={6}
            aria-invalid={showIssue}
            aria-describedby="bc-brief-note"
            className="mt-1.5 w-full resize-y rounded-sm border border-[#D6CAB6] bg-[#FBF8F2] px-2.5 py-2 text-[12.5px] leading-relaxed text-[#241D16] outline-none hover:border-[#B6A791] focus-visible:border-[#9E4A2C] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#9E4A2C] aria-invalid:border-[#A03A28]"
          />
          <p
            id="bc-brief-note"
            className={`mt-1.5 text-[11.5px] leading-relaxed ${
              m.issue ? "text-[#A03A28]" : "font-mono text-[10.5px] tabular-nums text-[#6B6459]"
            }`}
          >
            {m.issue ?? `${m.settings.brief.trim().length} / ${BRIEF_MAX} characters`}
          </p>

          <label htmlFor="bc-audience" className="mt-4 block text-[12px] font-semibold">
            Audience
          </label>
          <select
            id="bc-audience"
            value={m.settings.audience}
            onChange={(event) => m.setControl("audience", event.target.value)}
            style={{ backgroundColor: "#FBF8F2", color: "#241D16" }}
            className="mt-1.5 h-10 w-full rounded-sm border border-[#D6CAB6] px-2 text-[12.5px] hover:border-[#B6A791] focus-visible:border-[#9E4A2C] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#9E4A2C]"
          >
            {m.spec.audiences.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} ({option.hint})
              </option>
            ))}
          </select>

          {(["channel", "tone", "style"] as const).map((key) => {
            const list = optionsFor(key, m.spec)
            const legend = key === "channel" ? "Channel" : key === "tone" ? "Tone" : "Visual style"
            return (
              <fieldset key={key} className="mt-4">
                <legend className="text-[12px] font-semibold">{legend}</legend>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {list.map((option) => {
                    const active = m.settings[key] === option.id
                    return (
                      <label key={option.id} className="inline-flex">
                        <input
                          id={`bc-${key}-${option.id}`}
                          type="radio"
                          name={`bc-${key}`}
                          value={option.id}
                          checked={active}
                          onChange={() => m.setControl(key, option.id)}
                          onKeyDown={(event) => moveOption(event, key, option.id)}
                          className="peer sr-only"
                        />
                        <span
                          className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[12px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#9E4A2C] ${
                            active
                              ? "border-[#241D16] bg-[#241D16] font-semibold text-[#F7F3EB]"
                              : "border-[#D6CAB6] text-[#4A4238] hover:border-[#241D16] hover:bg-[#EFE8DC] hover:text-[#241D16]"
                          }`}
                        >
                          {key === "style" ? (
                            <span
                              aria-hidden
                              className="size-3 rounded-[2px] border border-black/10"
                              style={{ background: (looks[option.id] ?? looks.porcelain).canvas }}
                            />
                          ) : null}
                          {option.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}

          <label className="mt-5 flex min-h-10 cursor-pointer items-start gap-2 text-[11.5px] leading-relaxed text-[#4A4238]">
            <input
              type="checkbox"
              checked={m.failNext}
              onChange={(event) => m.setFailNext(event.target.checked)}
              className={`mt-0.5 size-4 shrink-0 accent-[#9E4A2C] ${ring}`}
            />
            Let the next run hit a forecast outage
          </label>
        </section>

        {/* centre room: the preview on the desk */}
        <section aria-labelledby="bc-desk-title" className="min-w-0 lg:order-2">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h2 id="bc-desk-title" className="text-[13px] font-semibold tracking-tight">
              On the desk
            </h2>
            <div role="tablist" aria-label="Campaign route" className="flex flex-wrap gap-1.5">
              {VARIANT_IDS.map((id) => {
                const active = m.selected === id
                return (
                  <button
                    key={id}
                    id={`bc-route-${id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="bc-desk-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => m.select(id)}
                    onKeyDown={(event) => moveSelection(event, id)}
                    className={`inline-flex min-h-10 items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[12px] ${ring} ${
                      active
                        ? "border-[#241D16] bg-[#241D16] font-semibold text-[#F7F3EB]"
                        : "border-[#D6CAB6] text-[#4A4238] hover:border-[#241D16] hover:bg-[#EFE8DC] hover:text-[#241D16]"
                    }`}
                  >
                    <span className="font-mono tabular-nums">{id}</span>
                    <span className="max-w-[9rem] truncate">{m.output.variants[id].name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div id="bc-desk-panel" role="tabpanel" aria-labelledby={`bc-route-${m.selected}`} className="mt-4">
            {m.stale && !m.busy ? (
              <p className="mb-3 flex items-start gap-2 rounded-sm border border-[#E2CFA6] bg-[#F8F0DC] px-2.5 py-2 text-[11.5px] leading-relaxed text-[#6E5310]">
                <RotateCcw className="mt-px size-3.5 shrink-0" aria-hidden />
                This is run {m.output.run}, and the controls have moved on since. Generate again so what you export
                matches what you see.
              </p>
            ) : null}

            <div className={m.busy ? "opacity-45 transition-opacity duration-200" : "transition-opacity duration-200"}>
              <Desk
                variant={m.current}
                channel={m.labelOf("channel", m.output.settings.channel)}
                style={m.labelOf("style", m.output.settings.style)}
                run={m.output.run}
                look={look}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.busy}
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#241D16] px-4 text-[13px] font-semibold text-[#F7F3EB] hover:bg-[#3A3029] disabled:cursor-progress disabled:bg-[#6A5F52] ${ring}`}
              >
                {m.busy ? (
                  <span aria-hidden className="size-2 rounded-full bg-[#F7F3EB] motion-safe:animate-pulse" />
                ) : (
                  <ArrowRight className="size-4" aria-hidden />
                )}
                {generateLabel}
              </button>
              <button
                type="button"
                onClick={m.save}
                disabled={m.saveStatus === "saving"}
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm border border-[#241D16] px-4 text-[13px] font-semibold text-[#241D16] hover:bg-[#E7DFD1] disabled:opacity-60 ${ring}`}
              >
                {m.saveStatus === "saving" ? (
                  <span aria-hidden className="size-2 rounded-full bg-[#9E4A2C] motion-safe:animate-pulse" />
                ) : m.saveStatus === "saved" ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                {m.saveStatus === "saving" ? "Saving\u2026" : m.saveStatus === "saved" ? "Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => m.exportCampaign()}
                disabled={m.exportStatus === "exporting"}
                className={`inline-flex min-h-11 items-center gap-2 rounded-sm px-4 text-[13px] font-semibold text-[#7A3A22] underline decoration-[#C79A83] decoration-1 underline-offset-4 hover:bg-[#EFE1D6] disabled:opacity-60 ${ring}`}
              >
                {m.exportStatus === "exporting" ? (
                  <span aria-hidden className="size-2 rounded-full bg-[#9E4A2C] motion-safe:animate-pulse" />
                ) : (
                  <Download className="size-4" aria-hidden />
                )}
                {m.exportStatus === "exporting"
                  ? "Exporting\u2026"
                  : m.exportStatus === "exported"
                    ? "Exported"
                    : "Export"}
              </button>
              <button
                type="button"
                onClick={m.reset}
                className={`inline-flex min-h-11 items-center rounded-sm px-2 text-[12px] text-[#6B6459] hover:text-[#241D16] ${ring}`}
              >
                Reset controls
              </button>
            </div>

            <div aria-live="polite" className="mt-3 flex flex-col gap-2 text-[12px] leading-relaxed">
              {m.generateError ? (
                <p role="alert" className="flex items-start gap-2 rounded-sm border border-[#E2B4A8] bg-[#FAEDE9] px-2.5 py-2 text-[#8E3320]">
                  <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
                  {m.generateError}
                </p>
              ) : null}
              {m.saveError ? (
                <p role="alert" className="flex items-start gap-2 rounded-sm border border-[#E2B4A8] bg-[#FAEDE9] px-2.5 py-2 text-[#8E3320]">
                  <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
                  {m.saveError}
                </p>
              ) : null}
              {m.exportError ? (
                <p role="alert" className="flex items-start gap-2 rounded-sm border border-[#E2B4A8] bg-[#FAEDE9] px-2.5 py-2 text-[#8E3320]">
                  <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
                  {m.exportError}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* right room: forecast, runs, what was filed before */}
        <section aria-labelledby="bc-forecast-title" className="flex min-w-0 flex-col gap-6 lg:order-3">
          <div>
            <h2 id="bc-forecast-title" className="text-[13px] font-semibold tracking-tight">
              Forecast, route {m.selected}
            </h2>
            <dl className="mt-3 flex flex-col gap-3">
              {[
                {
                  label: "Reach",
                  value: formatReach(m.current.metrics.reach),
                  delta: formatDelta(m.current.metrics.reach, m.previous?.metrics.reach, "reach"),
                },
                {
                  label: "CTR",
                  value: formatPercent(m.current.metrics.ctr),
                  delta: formatDelta(m.current.metrics.ctr, m.previous?.metrics.ctr, "percent"),
                },
                {
                  label: "Conversion",
                  value: formatPercent(m.current.metrics.conversion),
                  delta: formatDelta(m.current.metrics.conversion, m.previous?.metrics.conversion, "percent"),
                },
              ].map((metric) => (
                <div key={metric.label} className="flex items-baseline gap-3 border-b border-[#DFD5C4] pb-2">
                  <dt className="text-[11.5px] text-[#6B6459]">{metric.label}</dt>
                  <dd className="ml-auto font-mono text-[15px] tabular-nums text-[#241D16]">{metric.value}</dd>
                  <span className="w-14 shrink-0 text-right font-mono text-[10.5px] tabular-nums text-[#6B6459]">
                    {metric.delta ?? ""}
                  </span>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[11px] leading-relaxed text-[#6B6459]">
              Each figure is compared with the same route in the run before it.
            </p>
          </div>

          <RunRail
            runs={m.output.run}
            busy={m.busy}
            progress={m.progress}
            stage={m.stage}
            stageLabel={m.stageLabel}
            runAt={m.output.at}
            stale={m.stale}
          />

          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Filed earlier</h2>
            <ul className="mt-2.5 flex flex-col">
              {m.recent.map((item, index) => (
                <li key={item.id} className={index === 0 ? "" : "border-t border-[#E3DACA]"}>
                  <button
                    type="button"
                    onClick={() => m.restore(item)}
                    className={`flex min-h-11 w-full flex-col gap-0.5 py-2 text-left hover:bg-[#EFE8DC] ${ring}`}
                  >
                    <span className="min-w-0 truncate text-[12px] text-[#241D16]">{item.title}</span>
                    <span className="font-mono text-[10.5px] tabular-nums text-[#6B6459]">
                      {item.variant} &middot; {item.when}
                      {item.saved ? " \u00b7 saved here" : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] font-semibold tracking-tight">Studio log</h2>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {m.log.slice(0, 4).map((entry) => (
                <li key={entry.id} className="flex items-baseline gap-2 font-mono text-[10.5px] leading-relaxed">
                  <span className="shrink-0 tabular-nums text-[#6B6459]">{entry.at}</span>
                  <span className={`min-w-0 ${logTone[entry.tone]}`}>{entry.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1400px] px-4 pb-8 pt-1 sm:px-6">
        <p className="font-mono text-[10.5px] leading-relaxed text-[#6B6459]">
          Routes A, B and C are three drafts written from one brief. Nothing is published from this desk.
        </p>
      </footer>
    </div>
  )
}
