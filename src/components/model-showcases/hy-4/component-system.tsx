"use client"

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Download,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AUDIENCES,
  CHANNELS,
  STYLES,
  TONES,
  formatReach,
  formatPercent,
} from "./campaign-data"
import { useCampaignStudio } from "./use-campaign"
import type { AudienceId, ChannelId, StyleId, ToneId } from "./campaign-data"

const MODEL = "Hy4"
const CHAIN = "shadcn-best-practices / shadcn"

const TOKENS = [
  { name: "background", value: "#fafafa", swatch: "#fafafa" },
  { name: "surface", value: "#ffffff", swatch: "#ffffff" },
  { name: "border", value: "#e5e5e5", swatch: "#e5e5e5" },
  { name: "foreground", value: "#0a0a0a", swatch: "#0a0a0a" },
  { name: "muted", value: "#737373", swatch: "#737373" },
  { name: "selected", value: "#18181b", swatch: "#18181b" },
]

const RADII = ["2px", "6px", "10px"]

export default function ComponentSystem() {
  const {
    brief,
    setBrief,
    briefTooShort,
    audience,
    setAudience,
    channel,
    setChannel,
    tone,
    setTone,
    style,
    setStyle,
    concept,
    conceptId,
    selectConcept,
    concepts,
    status,
    generate,
    saved,
    save,
    exportAs,
    activity,
    log,
    metrics,
    channelRecord,
    audienceRecord,
    toneRecord,
  } = useCampaignStudio()

  return (
    <div className="flex min-h-dvh flex-col bg-[#fafafa] font-sans text-[#0a0a0a]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e5e5e5] bg-white px-4">
        <span className="grid size-7 place-items-center rounded-[6px] bg-[#18181b] text-xs font-semibold text-white">
          M
        </span>
        <h1 className="text-sm font-semibold tracking-tight">Muse component system</h1>
        <div className="ml-1 hidden items-center gap-1.5 md:flex">
          <span className="rounded-[6px] border border-[#e5e5e5] px-2 py-0.5 text-xs text-[#525252]">
            {MODEL}
          </span>
          <span className="rounded-[6px] border border-[#e5e5e5] px-2 py-0.5 font-mono text-xs text-[#737373]">
            {CHAIN}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2",
              saved
                ? "border-[#16a34a] bg-[#f0fdf4] text-[#15803d]"
                : "border-[#e5e5e5] bg-white hover:bg-[#f5f5f5]",
            )}
          >
            {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PNG")}
            className="hidden h-8 items-center gap-1.5 rounded-[6px] border border-[#e5e5e5] bg-white px-2.5 text-sm hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2 sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-[#18181b] px-3 text-sm font-medium text-white hover:bg-[#27272a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b] focus-visible:ring-offset-2"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3.5" aria-hidden />
            )}
            {status === "loading" ? "Generating" : "Generate"}
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="flex flex-col gap-4">
          <section
            aria-labelledby="cs-tokens"
            className="rounded-[10px] border border-[#e5e5e5] bg-white p-3"
          >
            <h2 id="cs-tokens" className="text-sm font-semibold">
              Tokens
            </h2>
            <ul className="mt-2 flex flex-col">
              {TOKENS.map((token) => (
                <li
                  key={token.name}
                  className="flex items-center gap-2 border-b border-[#f0f0f0] py-1.5 last:border-b-0"
                >
                  <span
                    className="size-5 shrink-0 rounded-[4px] border border-[#e5e5e5]"
                    style={{ background: token.swatch }}
                    aria-hidden
                  />
                  <span className="text-xs">{token.name}</span>
                  <span className="ml-auto font-mono text-[11px] text-[#737373]">{token.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <p className="text-xs text-[#737373]">Radius</p>
              <div className="mt-1.5 flex gap-1.5">
                {RADII.map((radius) => (
                  <span
                    key={radius}
                    className="grid h-8 flex-1 place-items-center border border-[#e5e5e5] font-mono text-[11px] text-[#525252]"
                    style={{ borderRadius: radius }}
                  >
                    {radius}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="cs-inputs"
            className="rounded-[10px] border border-[#e5e5e5] bg-white p-3"
          >
            <h2 id="cs-inputs" className="text-sm font-semibold">
              Inputs
            </h2>
            <label htmlFor="cs-audience" className="mt-2.5 block text-xs text-[#525252]">
              Audience
            </label>
            <select
              id="cs-audience"
              value={audience}
              onChange={(event) => {
                setAudience(event.target.value as AudienceId)
                log(`Audience set to ${event.target.value}`)
              }}
              className="mt-1 h-8 w-full rounded-[6px] border border-[#e5e5e5] bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]"
            >
              {AUDIENCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>

            <label htmlFor="cs-channel" className="mt-2.5 block text-xs text-[#525252]">
              Channel
            </label>
            <select
              id="cs-channel"
              value={channel}
              onChange={(event) => {
                setChannel(event.target.value as ChannelId)
                log(`Channel set to ${event.target.value}`)
              }}
              className="mt-1 h-8 w-full rounded-[6px] border border-[#e5e5e5] bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]"
            >
              {CHANNELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>

            <p id="cs-tone" className="mt-2.5 text-xs text-[#525252]">
              Tone
            </p>
            <div role="radiogroup" aria-labelledby="cs-tone" className="mt-1 grid grid-cols-3 gap-1">
              {TONES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={tone === item.id}
                  onClick={() => {
                    setTone(item.id as ToneId)
                    log(`Tone set to ${item.label}`)
                  }}
                  className={cn(
                    "h-7 rounded-[6px] border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]",
                    tone === item.id
                      ? "border-[#18181b] bg-[#18181b] text-white"
                      : "border-[#e5e5e5] bg-white hover:bg-[#f5f5f5]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p id="cs-style" className="mt-2.5 text-xs text-[#525252]">
              Visual style
            </p>
            <div role="radiogroup" aria-labelledby="cs-style" className="mt-1 grid grid-cols-2 gap-1">
              {STYLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={style === item.id}
                  onClick={() => {
                    setStyle(item.id as StyleId)
                    log(`Visual style set to ${item.label}`)
                  }}
                  className={cn(
                    "h-7 rounded-[6px] border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]",
                    style === item.id
                      ? "border-[#18181b] bg-[#f5f5f5] text-[#0a0a0a]"
                      : "border-[#e5e5e5] bg-white text-[#525252] hover:bg-[#f5f5f5]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section aria-label="Preview" className="flex min-h-0 flex-col gap-4">
          <div className="rounded-[10px] border border-[#e5e5e5] bg-white">
            <div className="flex items-center gap-1 border-b border-[#e5e5e5] px-2">
              <div role="tablist" aria-label="Concept" className="flex">
                {concepts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={item.id === conceptId}
                    onClick={() => selectConcept(item.id)}
                    className={cn(
                      "relative h-10 px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#18181b]",
                      item.id === conceptId ? "text-[#0a0a0a]" : "text-[#737373] hover:text-[#0a0a0a]",
                    )}
                  >
                    {item.id}. {item.name}
                    {item.id === conceptId && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-[#18181b]" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
              <span className="ml-auto pr-1 font-mono text-[11px] text-[#a3a3a3]">
                {channelRecord.format}
              </span>
            </div>

            <div className="flex items-center justify-center bg-[#f5f5f5] p-4 sm:p-6">
              <div className="w-full max-w-[380px]">
                <article
                  aria-label={`Concept ${concept.id} preview`}
                  className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[10px] border border-[#e5e5e5]"
                  style={{ background: concept.palette.bg, color: concept.palette.fg }}
                >
                  <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-80">
                    <span>Hydra</span>
                    <span>{audienceRecord.note}</span>
                  </header>
                  <div className="px-5">
                    <h3 className="text-2xl leading-[1.1] font-semibold tracking-tight sm:text-[28px]">
                      {concept.headline[tone]}
                    </h3>
                    <p className="mt-2.5 max-w-[34ch] text-xs leading-relaxed opacity-85">{concept.sub}</p>
                  </div>
                  <footer className="flex items-end justify-between px-5 pb-4">
                    <p className="text-[11px] opacity-75">{concept.tagline}</p>
                    <span
                      className="rounded-[6px] px-3 py-1.5 text-[11px] font-semibold"
                      style={{ background: concept.palette.fg, color: concept.palette.deep }}
                    >
                      {toneRecord.cta}
                    </span>
                  </footer>
                  {status === "loading" && (
                    <div
                      aria-hidden
                      className="absolute inset-0 animate-pulse bg-white/85 motion-reduce:animate-none"
                    >
                      <div className="absolute inset-x-5 top-24 h-2.5 rounded-[4px] bg-[#e5e5e5]" />
                      <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded-[4px] bg-[#e5e5e5]" />
                      <div className="absolute inset-x-5 top-44 h-2.5 w-1/2 rounded-[4px] bg-[#e5e5e5]" />
                    </div>
                  )}
                </article>
              </div>
            </div>
          </div>

          <div aria-live="polite">
            {status === "success" && (
              <p className="flex items-center gap-1.5 rounded-[6px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#15803d]">
                <CheckCircle2 className="size-4" aria-hidden />
                Concept {concept.id} regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
                <AlertCircle className="size-4" aria-hidden />
                {briefTooShort
                  ? "Generation failed: the brief needs at least 24 characters."
                  : "Generation failed: the model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]"
                >
                  Retry
                </button>
              </p>
            )}
          </div>

          <div className="rounded-[10px] border border-[#e5e5e5] bg-white p-3">
            <label htmlFor="cs-brief" className="block text-xs text-[#525252]">
              Brief
            </label>
            <textarea
              id="cs-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={5}
              className={cn(
                "mt-1.5 w-full resize-y rounded-[6px] border px-2.5 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]",
                briefTooShort ? "border-[#fca5a5]" : "border-[#e5e5e5]",
              )}
              placeholder="Product, promise, proof, call to action"
            />
            <p className={cn("mt-1 text-xs", briefTooShort ? "text-[#b91c1c]" : "text-[#737373]")}>
              {brief.trim().length} characters
              {briefTooShort ? " · 24 needed" : ""}
            </p>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section
            aria-labelledby="cs-states"
            className="rounded-[10px] border border-[#e5e5e5] bg-white p-3"
          >
            <h2 id="cs-states" className="text-sm font-semibold">
              Component states
            </h2>
            <p className="mt-1 text-xs text-[#737373]">
              The same components across default, focus, selected and disabled.
            </p>

            <div className="mt-3">
              <p className="text-xs text-[#525252]">Button</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="h-8 rounded-[6px] border border-[#e5e5e5] bg-white px-2.5 text-xs hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]"
                >
                  Default
                </button>
                <button
                  type="button"
                  className="h-8 rounded-[6px] border border-[#e5e5e5] bg-white px-2.5 text-xs ring-2 ring-[#18181b]"
                >
                  Focus
                </button>
                <button
                  type="button"
                  aria-pressed
                  className="h-8 rounded-[6px] bg-[#18181b] px-2.5 text-xs text-white"
                >
                  Selected
                </button>
                <button
                  type="button"
                  disabled
                  className="h-8 rounded-[6px] border border-[#e5e5e5] bg-[#f5f5f5] px-2.5 text-xs text-[#a3a3a3]"
                >
                  Disabled
                </button>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-[#525252]">Badge</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[
                  ["bg-[#f5f5f5] text-[#525252]", "Neutral"],
                  ["bg-[#18181b] text-white", "Strong"],
                  ["bg-[#fef2f2] text-[#b91c1c]", "Error"],
                  ["bg-[#f0fdf4] text-[#15803d]", "Success"],
                ].map(([classes, label]) => (
                  <span
                    key={label}
                    className={cn("rounded-[6px] px-2 py-1 text-[11px] font-medium", classes)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-[#525252]">Progress</p>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {[
                  ["Reach", Math.min(100, (metrics.reach / 322000) * 100)],
                  ["CTR", Math.min(100, (metrics.ctr / 7) * 100)],
                  ["Conversion", Math.min(100, (metrics.conv / 3.2) * 100)],
                ].map(([label, pct]) => (
                  <div key={label as string}>
                    <div className="flex justify-between text-[11px] text-[#737373]">
                      <span>{label}</span>
                      <span className="tabular-nums">{Math.round(pct as number)}%</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#f0f0f0]">
                      <div
                        className="h-full rounded-full bg-[#18181b] transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${pct as number}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="cs-metrics"
            className="rounded-[10px] border border-[#e5e5e5] bg-white p-3"
          >
            <h2 id="cs-metrics" className="text-sm font-semibold">
              Metrics
            </h2>
            <dl className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conv", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div key={metric.label} className="rounded-[6px] bg-[#f5f5f5] px-2 py-1.5">
                  <dt className="text-[11px] text-[#737373]">{metric.label}</dt>
                  <dd className="text-sm font-semibold tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="cs-activity"
            className="rounded-[10px] border border-[#e5e5e5] bg-white p-3"
          >
            <h2 id="cs-activity" className="text-sm font-semibold">
              Recent activity
            </h2>
            <ol className="mt-2 flex flex-col divide-y divide-[#f0f0f0]">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-2 py-1.5 text-xs">
                  <time className="shrink-0 font-mono text-[#a3a3a3] tabular-nums">{entry.time}</time>
                  <span className="text-[#525252]">{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </main>
    </div>
  )
}
