"use client"

import { Bodoni_Moda, Karla } from "next/font/google"
import { AlertCircle, ChevronDown, RotateCcw } from "lucide-react"
import { useState } from "react"

import {
  BRIEF_MAX,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ControlKey,
  type Option,
  type StudioSpec,
} from "./core"

/* opsz axis loaded so large headlines get Bodoni's high-contrast display cut automatically (font-optical-sizing: auto). */
const bodoni = Bodoni_Moda({ subsets: ["latin"], axes: ["opsz"], display: "swap" })
const karla = Karla({ subsets: ["latin"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "visual-taste",
  product: "Oro Nuevo",
  brief:
    "Oro Nuevo is our first-harvest olive oil, pressed each November from green Picual olives picked in the first ten days. 4,000 bottles, sold before the first frost. Launch it to people who cook to taste and notice the difference.",
  audiences: [
    { id: "cooks", label: "Home cooks", hint: "Cook most nights", size: 860000, lift: { conversion: 1.04 } },
    { id: "chefs", label: "Chefs and restaurateurs", hint: "Buy by the case", size: 124000, lift: { ctr: 1.12, conversion: 1.28 } },
    { id: "gifts", label: "Gift buyers", hint: "Shopping for December", size: 540000, lift: { ctr: 1.05, conversion: 0.9 } },
  ],
  channels: [
    { id: "magazine", label: "Food magazine", lift: { reach: 0.82, ctr: 0.72, conversion: 1.2 } },
    { id: "feed", label: "Instagram feed", lift: { reach: 1.16, ctr: 1.04 } },
    { id: "letter", label: "Newsletter", lift: { reach: 0.42, ctr: 2.15, conversion: 1.34 } },
  ],
  tones: [
    { id: "quiet", label: "Quiet", lift: { conversion: 1.06 } },
    { id: "warm", label: "Warm", lift: { ctr: 1.06 } },
    { id: "exacting", label: "Exacting", lift: { ctr: 0.97, conversion: 1.1 } },
  ],
  styles: [
    { id: "morning", label: "Morning grove", lift: { ctr: 1.03 } },
    { id: "noon", label: "Noon stone", lift: { reach: 1.02 } },
    { id: "dusk", label: "Dusk press", lift: { ctr: 1.06, conversion: 1.02 } },
  ],
  variants: [
    {
      id: "A",
      name: "First press",
      headline: "Pressed the week it was picked.",
      body: "Green Picual olives, picked in the first ten days of November and pressed that same week. Poured for {audience}.",
      cta: "Reserve a bottle",
      lift: { conversion: 1.05 },
    },
    {
      id: "B",
      name: "Green and peppery",
      headline: "Green, bitter, peppery. Gone by spring.",
      body: "The first oil of the year catches the back of the throat. That is the point. 4,000 bottles of {product}.",
      cta: "Taste it first",
      lift: { ctr: 1.08, reach: 0.97 },
    },
    {
      id: "C",
      name: "The calendar",
      headline: "November has a taste.",
      body: "Every November we open the press for {product}. Put your name on a bottle before the first frost.",
      cta: "Join the list",
      lift: { reach: 1.05, conversion: 0.96 },
    },
  ],
  recent: [
    { id: "vt-r1", title: "Oro Nuevo 2025 release", variant: "A", when: "12 Nov 2025" },
    { id: "vt-r2", title: "Late-harvest tasting notes", variant: "C", when: "3 Oct" },
    { id: "vt-r3", title: "Chef sampling kit", variant: "B", when: "21 Sep" },
  ],
  initialRun: 3,
}

type Light = {
  sky: string
  highlight: number
  shadow: string
  shadowOpacity: number
  oilCore: string
  oilEdge: string
  leaf: string
}

/*
 * The three light conditions. Each one moves where the light comes from (gradient direction),
 * how warm it is (stop colours), where the glass catches it and which way the shadow falls.
 * Ink #1E2419 stays above 7:1 on the darkest stop of every sky.
 */
const LIGHTS: Record<string, Light> = {
  morning: {
    sky: "radial-gradient(58% 70% at 16% 6%, rgba(246,250,236,0.95), rgba(246,250,236,0) 70%), linear-gradient(128deg, #E8EDDD 0%, #D9DFD0 46%, #C5CDB8 100%)",
    highlight: -34,
    shadow: "translate(58px, 3px) scale(1.7, 1)",
    shadowOpacity: 0.2,
    oilCore: "#8A8F33",
    oilEdge: "#2F3B25",
    leaf: "#667453",
  },
  noon: {
    sky: "radial-gradient(70% 55% at 54% -6%, rgba(244,245,240,1), rgba(244,245,240,0) 72%), linear-gradient(180deg, #E3E5DD 0%, #D3D7CA 70%, #C9CDBF 100%)",
    highlight: 0,
    shadow: "translate(0px, 2px) scale(0.95, 1.15)",
    shadowOpacity: 0.3,
    oilCore: "#7C7F24",
    oilEdge: "#2A3521",
    leaf: "#5E6B4B",
  },
  dusk: {
    sky: "radial-gradient(52% 64% at 94% 36%, rgba(236,204,148,0.9), rgba(236,204,148,0) 72%), linear-gradient(252deg, #DDD5B6 0%, #CBCDB3 44%, #B1B89E 100%)",
    highlight: 36,
    shadow: "translate(-128px, 4px) scale(2.9, 0.85)",
    shadowOpacity: 0.24,
    oilCore: "#A08B2C",
    oilEdge: "#33391F",
    leaf: "#6B6F4A",
  },
}

const LIGHT_IDS = Object.keys(LIGHTS)

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#585C17]"

export default function VisualTaste() {
  const m = useMuseStudio(spec)
  const [briefOpen, setBriefOpen] = useState(false)
  const lightId = m.output.settings.style
  const light = LIGHTS[lightId] ?? LIGHTS.morning
  const variant = m.current
  const briefLength = m.settings.brief.trim().length

  function generate() {
    if (m.issue) setBriefOpen(true)
    m.generate()
  }

  const deltas = [
    formatDelta(variant.metrics.reach, m.previous?.metrics.reach, "reach"),
    formatDelta(variant.metrics.ctr, m.previous?.metrics.ctr, "percent"),
    formatDelta(variant.metrics.conversion, m.previous?.metrics.conversion, "percent"),
  ]

  const copy = (
    <>
      <p className="max-w-[40ch] text-[16px] leading-[1.6] text-[#2F3B25]">{variant.body}</p>
      <p className="mt-5 text-[16px] font-medium text-[#1E2419] underline decoration-[#7C7F24] decoration-1 underline-offset-[7px]">
        {variant.cta}
      </p>
      {m.stale && !m.busy && (
        <p className="mt-6 flex max-w-[40ch] items-start gap-2 text-[14px] leading-snug text-[#2F3B25]">
          <RotateCcw aria-hidden className="mt-0.5 size-3.5 shrink-0 text-[#585C17]" strokeWidth={1.75} />
          This still life is from run {m.output.run}. Generate again to see your new settings.
        </p>
      )}
    </>
  )

  return (
    <div
      className={`${karla.className} min-h-[100dvh] bg-[#F7F8F5] text-[#1E2419] selection:bg-[#2F3B25] selection:text-[#F7F8F5]`}
    >
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 md:px-12 xl:px-[72px]">
        <h1 className="flex items-baseline gap-3">
          <span className={`${bodoni.className} text-[24px] leading-none tracking-[-0.01em]`}>Oro Nuevo</span>
          <span className="text-[14px] text-[#4E5647]">Launch studio</span>
        </h1>
        <p className="text-[13px] text-[#4E5647]">
          Composed by <span className="font-semibold text-[#1E2419]">{m.modelName}</span> with {m.chain}
        </p>
      </header>

      {/* ---------- Still-life field ---------- */}
      <section aria-labelledby="vt-headline" className="relative isolate overflow-hidden">
        {LIGHT_IDS.map((id) => (
          <div
            key={id}
            aria-hidden
            className="absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{ background: LIGHTS[id].sky, opacity: id === lightId ? 1 : 0 }}
          />
        ))}
        {m.busy && (
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5">
            <div className="h-full bg-[#7C7F24] transition-[width] duration-300 ease-out" style={{ width: `${m.progress}%` }} />
          </div>
        )}

        <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_56px] px-5 md:h-[540px] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)_72px] md:px-12 xl:px-[72px]">
          <div className={`col-span-2 pt-8 transition-opacity duration-300 md:col-span-1 md:pt-14 ${m.busy ? "opacity-50" : ""}`}>
            <h2
              id="vt-headline"
              className={`${bodoni.className} max-w-[13ch] text-[clamp(2.3rem,4.5vw,4.4rem)] leading-[1.04] tracking-[-0.02em] text-balance`}
            >
              {variant.headline}
            </h2>
            <div className="mt-7 hidden md:block">{copy}</div>
          </div>

          <div className="relative aspect-[4/5] min-w-0 md:aspect-auto md:h-[540px]">
            <StillLife light={light} dim={m.busy} />
          </div>

          <fieldset className="flex flex-col items-center justify-center gap-1 self-center pb-[20%] md:pb-[12%]">
            <legend className="sr-only">Route</legend>
            {VARIANT_IDS.map((id) => (
              <label key={id} title={m.output.variants[id].name} className="relative">
                <input
                  type="radio"
                  name="vt-route"
                  value={id}
                  checked={m.selected === id}
                  onChange={() => m.select(id)}
                  className="peer sr-only"
                />
                <span className="sr-only">
                  Route {id}, {m.output.variants[id].name}
                </span>
                <span
                  aria-hidden
                  className={`${bodoni.className} flex size-11 cursor-pointer items-center justify-center text-[22px] text-[#4E5647] transition-colors duration-200 hover:text-[#1E2419] peer-checked:text-[#1E2419] peer-checked:underline peer-checked:decoration-[#7C7F24] peer-checked:decoration-2 peer-checked:underline-offset-[6px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-0 peer-focus-visible:outline-[#585C17]`}
                >
                  {id}
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 md:hidden">
        <div className="pt-5">{copy}</div>
      </div>

      {/* ---------- Caption line ---------- */}
      <section aria-label="Campaign settings and actions" className="mx-auto max-w-[1440px] px-5 md:px-12 xl:px-[72px]">
        <div className="mt-5 flex flex-col md:mt-0 md:flex-row md:flex-wrap md:items-center md:gap-x-9 md:gap-y-1 md:border-b md:border-[#1E2419]/12 md:py-3">
          <InlineSelect control="audience" label="Audience" options={spec.audiences} value={m.settings.audience} onPick={m.setControl} />
          <InlineSelect control="channel" label="Channel" options={spec.channels} value={m.settings.channel} onPick={m.setControl} />
          <InlineSelect control="tone" label="Tone" options={spec.tones} value={m.settings.tone} onPick={m.setControl} />
          <InlineSelect control="style" label="Light" options={spec.styles} value={m.settings.style} onPick={m.setControl} />
          <div className="flex min-h-11 min-w-0 items-center gap-3 border-b border-[#1E2419]/12 md:ml-auto md:border-0">
            <span className="shrink-0 text-[13px] text-[#4E5647]">Brief</span>
            <span className="min-w-0 truncate text-[15px] md:max-w-[12rem]">{m.settings.brief.trim() || "Empty"}</span>
            <button
              type="button"
              aria-expanded={briefOpen}
              aria-controls="vt-brief-panel"
              onClick={() => setBriefOpen((open) => !open)}
              className={`inline-flex min-h-10 shrink-0 items-center gap-1 text-[15px] font-medium underline decoration-[#7C7F24] decoration-1 underline-offset-[6px] hover:decoration-[#1E2419] ${focusRing}`}
            >
              {briefOpen ? "Close brief" : "Edit brief"}
              <ChevronDown aria-hidden className={`size-4 transition-transform duration-200 ${briefOpen ? "rotate-180" : ""}`} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {briefOpen && (
          <div id="vt-brief-panel" className="max-w-[760px] border-b border-[#1E2419]/12 py-4">
            <label htmlFor="vt-brief" className="text-[13px] text-[#4E5647]">
              Launch brief
            </label>
            <textarea
              id="vt-brief"
              rows={3}
              value={m.settings.brief}
              onChange={(event) => m.setBrief(event.target.value)}
              aria-invalid={m.issue ? true : undefined}
              aria-describedby="vt-brief-help"
              className="mt-1.5 block w-full resize-y border-0 border-b border-[#7C7F24] bg-transparent px-0 py-2 text-[16px] leading-[1.6] text-[#1E2419] caret-[#585C17] outline-none hover:border-[#1E2419] focus-visible:border-[#1E2419] focus-visible:shadow-[0_1px_0_#1E2419] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#585C17] aria-invalid:border-[#A23A1F]"
            />
            <p id="vt-brief-help" className={`mt-2 text-[13px] tabular-nums ${m.issue ? "text-[#A23A1F]" : "text-[#4E5647]"}`}>
              {m.issue ?? `${briefLength} of ${BRIEF_MAX} characters`}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 py-4 md:flex-row md:items-baseline md:justify-between md:gap-10">
          <p aria-live="polite" className="max-w-[78ch] text-[15px] leading-relaxed text-[#2F3B25]">
            {m.busy ? (
              <>Pressing run {m.output.run + 1}: {m.stageLabel.toLowerCase()}.</>
            ) : (
              <>
                Route {m.selected}, {variant.name.toLowerCase()}, reaches about{" "}
                <span className="font-semibold text-[#1E2419] tabular-nums">{formatReach(variant.metrics.reach)}</span> people;{" "}
                <span className="font-semibold text-[#1E2419] tabular-nums">{formatPercent(variant.metrics.ctr)}</span> click and{" "}
                <span className="font-semibold text-[#1E2419] tabular-nums">{formatPercent(variant.metrics.conversion)}</span> convert.{" "}
                <span className="text-[#4E5647]">
                  Simulated forecast, run {m.output.run}
                  {deltas[0] ? (
                    <span className="tabular-nums">
                      {" "}
                      ({deltas.join(", ")} on run {m.output.run - 1})
                    </span>
                  ) : null}
                  .
                </span>
                {m.generateStatus === "success" && <span className="sr-only"> Run {m.output.run} is ready.</span>}
              </>
            )}
          </p>

          <div className="flex shrink-0 items-baseline gap-7">
            <button
              type="button"
              onClick={generate}
              disabled={m.busy}
              className={`min-h-10 text-[16px] font-semibold underline decoration-[#7C7F24] decoration-2 underline-offset-[7px] transition-[text-decoration-color] hover:decoration-[#1E2419] disabled:cursor-progress disabled:text-[#4E5647] ${focusRing}`}
            >
              {m.busy ? `Generating, ${m.progress}%` : m.stale ? `Generate run ${m.output.run + 1}` : "Generate"}
            </button>
            <button
              type="button"
              onClick={m.save}
              disabled={m.saveStatus === "saving"}
              className={`min-h-10 text-[15px] font-medium underline decoration-[#1E2419]/30 decoration-1 underline-offset-[7px] hover:decoration-[#1E2419] disabled:cursor-progress disabled:text-[#4E5647] ${focusRing}`}
            >
              {m.saveStatus === "saving" ? "Saving" : m.saveStatus === "saved" ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => m.exportCampaign()}
              disabled={m.exportStatus === "exporting"}
              className={`min-h-10 text-[15px] font-medium underline decoration-[#1E2419]/30 decoration-1 underline-offset-[7px] hover:decoration-[#1E2419] disabled:cursor-progress disabled:text-[#4E5647] ${focusRing}`}
            >
              {m.exportStatus === "exporting" ? "Exporting" : m.exportStatus === "exported" ? "Exported" : "Export"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-2 md:flex-row md:items-start md:justify-between md:gap-10">
          <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[13px] text-[#4E5647] hover:text-[#1E2419]">
            <input
              type="checkbox"
              checked={m.failNext}
              onChange={(event) => m.setFailNext(event.target.checked)}
              className="size-4 accent-[#585C17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#585C17]"
            />
            Simulate a forecast outage on the next run
          </label>
          <div className="min-w-0 md:max-w-[62ch] md:text-right">
            {[m.generateError, m.saveError, m.exportError].map((error, index) =>
              error ? (
                <p key={index} role="alert" className="flex items-start gap-2 py-1 text-[14px] leading-snug text-[#A23A1F] md:justify-end">
                  <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
                  {error}
                </p>
              ) : null
            )}
            {m.saveStatus === "saved" && <p className="py-1 text-[14px] text-[#2F3B25]">Route {m.selected} saved to the list below.</p>}
            {m.exportStatus === "exported" && <p className="py-1 text-[14px] text-[#2F3B25]">Route {m.selected} exported as JSON.</p>}
          </div>
        </div>
      </section>

      {/* ---------- Recent ---------- */}
      <footer className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 pt-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:px-12 xl:px-[72px]">
        <section aria-labelledby="vt-recent">
          <h2 id="vt-recent" className={`${bodoni.className} text-[22px] leading-tight`}>
            Recent campaigns
          </h2>
          <ul className="mt-3">
            {m.recent.map((item) => (
              <li key={item.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-2 text-[15px]">
                <span className="tabular-nums text-[#4E5647]">{item.saved ? `Today ${item.when}` : item.when}</span>
                <span className="min-w-0 truncate">
                  {item.title} <span className="text-[#4E5647]">(route {item.variant})</span>
                </span>
                <button
                  type="button"
                  onClick={() => m.restore(item)}
                  className={`min-h-10 text-[14px] font-medium underline decoration-[#1E2419]/30 underline-offset-[6px] hover:decoration-[#1E2419] ${focusRing}`}
                >
                  Restore<span className="sr-only"> {item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="vt-log">
          <h2 id="vt-log" className={`${bodoni.className} text-[22px] leading-tight`}>
            This session
          </h2>
          <ol className="mt-3">
            {m.log.slice(0, 5).map((entry) => (
              <li key={entry.id} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 py-1.5 text-[14px]">
                <span className="tabular-nums text-[#4E5647]">{entry.at}</span>
                <span className={entry.tone === "error" ? "text-[#A23A1F]" : "text-[#2F3B25]"}>{entry.text}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={m.reset}
            className={`mt-3 min-h-10 text-[14px] font-medium underline decoration-[#1E2419]/30 underline-offset-[6px] hover:decoration-[#1E2419] ${focusRing}`}
          >
            Reset to the launch defaults
          </button>
        </section>
      </footer>
    </div>
  )
}

function InlineSelect({
  control,
  label,
  options,
  value,
  onPick,
}: {
  control: ControlKey
  label: string
  options: Option[]
  value: string
  onPick: (key: ControlKey, id: string) => void
}) {
  const id = `vt-${control}`
  return (
    <div className="flex min-h-11 min-w-0 items-center justify-between gap-3 border-b border-[#1E2419]/12 md:justify-start md:border-0">
      <label htmlFor={id} className="shrink-0 text-[13px] text-[#4E5647]">
        {label}
      </label>
      <span className="relative min-w-0">
        <select
          id={id}
          value={value}
          onChange={(event) => onPick(control, event.target.value)}
          className={`min-h-10 max-w-full cursor-pointer appearance-none truncate border-0 border-b border-[#7C7F24] bg-transparent py-1 pl-0 pr-6 text-right text-[15px] font-medium text-[#1E2419] hover:border-[#1E2419] md:text-left ${focusRing}`}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-[#585C17]" strokeWidth={1.75} />
      </span>
    </div>
  )
}

function StillLife({ light, dim }: { light: Light; dim: boolean }) {
  const ease = "1400ms cubic-bezier(0.16, 1, 0.3, 1)"
  return (
    <svg
      viewBox="0 0 520 540"
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label="A tall bottle of Oro Nuevo olive oil beside an olive sprig on a stone ledge"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-opacity duration-300 ${dim ? "opacity-70" : ""}`}
    >
      <defs>
        <linearGradient id="vt-oil" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: light.oilEdge, transition: `stop-color ${ease}` }} />
          <stop offset="0.48" style={{ stopColor: light.oilCore, transition: `stop-color ${ease}` }} />
          <stop offset="1" style={{ stopColor: light.oilEdge, transition: `stop-color ${ease}` }} />
        </linearGradient>
        <linearGradient id="vt-shine" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FBFCF6" stopOpacity="0" />
          <stop offset="0.3" stopColor="#FBFCF6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FBFCF6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="vt-shadow">
          <stop offset="0" stopColor="#1E2419" stopOpacity="1" />
          <stop offset="1" stopColor="#1E2419" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the stone ledge runs past the viewBox so it reads full-bleed while staying aligned with the bottle base */}
      <rect x="-3000" y="432" width="6520" height="400" fill="#2F3B25" opacity="0.07" />
      <rect x="-3000" y="432" width="6520" height="1" fill="#2F3B25" opacity="0.18" />

      <ellipse
        cx="262"
        cy="434"
        rx="74"
        ry="11"
        fill="url(#vt-shadow)"
        style={{
          transform: light.shadow,
          transformBox: "fill-box",
          transformOrigin: "center",
          opacity: light.shadowOpacity,
          transition: `transform ${ease}, opacity ${ease}`,
        }}
        className="motion-reduce:transition-none"
      />

      {/* bottle */}
      <path
        d="M210 432 L210 232 C210 204 224 188 246 176 C252 172 254 166 254 158 L254 96 L270 96 L270 158 C270 166 272 172 278 176 C300 188 314 204 314 232 L314 432 Z"
        fill="url(#vt-oil)"
      />
      <path d="M210 432 L314 432 L314 426 L210 426 Z" fill="#1E2419" opacity="0.35" />
      <rect x="250" y="72" width="24" height="28" fill="#7C7F24" />
      <rect x="250" y="80" width="24" height="1.5" fill="#2F3B25" opacity="0.5" />
      <rect x="250" y="88" width="24" height="1.5" fill="#2F3B25" opacity="0.5" />
      <rect
        x="258"
        y="196"
        width="7"
        height="222"
        rx="3.5"
        fill="url(#vt-shine)"
        style={{ transform: `translateX(${light.highlight}px)`, transition: `transform ${ease}` }}
        className="motion-reduce:transition-none"
      />

      {/* label */}
      <rect x="222" y="268" width="80" height="112" fill="#F7F8F5" />
      <rect x="226" y="272" width="72" height="104" fill="none" stroke="#7C7F24" strokeWidth="0.8" />
      <g className={bodoni.className} fill="#1E2419" textAnchor="middle">
        <text x="262" y="302" fontSize="13" letterSpacing="1.6">
          ORO
        </text>
        <text x="262" y="318" fontSize="13" letterSpacing="1.6">
          NUEVO
        </text>
        <line x1="246" x2="278" y1="330" y2="330" stroke="#7C7F24" strokeWidth="0.8" />
        <text x="262" y="346" fontSize="8.5">
          Primera cosecha
        </text>
        <text x="262" y="360" fontSize="8.5">
          Noviembre
        </text>
      </g>

      {/* sprig, lying on the ledge in front of the bottle */}
      <path d="M72 476 C136 458 214 456 330 470" fill="none" stroke="#4A5236" strokeWidth="2.4" strokeLinecap="round" />
      {[
        [98, 469, -24],
        [126, 462, 18],
        [158, 459, -30],
        [192, 457, 22],
        [236, 459, -20],
        [272, 462, 26],
        [306, 466, -16],
      ].map(([x, y, angle], index) => (
        <path
          key={index}
          d="M0 0 C10 -7 34 -7 48 0 C34 5 10 5 0 0 Z"
          transform={`translate(${x} ${y}) rotate(${angle})`}
          style={{ fill: index % 2 ? "#9AA487" : light.leaf, transition: `fill ${ease}` }}
        />
      ))}
      <ellipse cx="178" cy="476" rx="9" ry="11" fill="#2F3B25" />
      <ellipse cx="198" cy="480" rx="8.5" ry="10.5" fill="#56602E" />
      <ellipse cx="252" cy="476" rx="8" ry="10" fill="#3C4526" />
      <ellipse cx="175" cy="472" rx="2.4" ry="3.2" fill="#F7F8F5" opacity="0.45" />
      <ellipse cx="249" cy="472" rx="2.2" ry="3" fill="#F7F8F5" opacity="0.4" />
    </svg>
  )
}
