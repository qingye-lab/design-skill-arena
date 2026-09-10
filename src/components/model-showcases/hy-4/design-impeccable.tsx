"use client"

import { AlertCircle, Download, Loader2, Sparkles } from "lucide-react"

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
const CHAIN = "frontend-design + impeccable"

export default function DesignImpeccable() {
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
    <div className="flex min-h-dvh flex-col bg-[#f1f1ee] font-sans text-[#14161a]">
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-[#14161a] px-4">
        <h1 className="text-[13px] font-semibold tracking-[-0.01em]">Muse</h1>
        <span className="h-4 w-px bg-[#14161a]/20" aria-hidden />
        <p className="text-[12px] text-[#4a4d52]">Hydra launch</p>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[11px] text-[#6b6e73] lg:inline">
            {MODEL} · {CHAIN}
          </span>
          <button
            type="button"
            onClick={save}
            className={cn(
              "text-[12px] underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67]",
              saved ? "text-[#2b3a67] underline" : "text-[#3d4045] hover:underline",
            )}
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PDF")}
            className="hidden items-center gap-1 text-[12px] text-[#3d4045] underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67] sm:flex"
          >
            <Download className="size-3" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-7 items-center gap-1.5 bg-[#2b3a67] px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-[#1e2a4c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67] focus-visible:ring-offset-2"
          >
            {status === "loading" ? (
              <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3" aria-hidden />
            )}
            {status === "loading" ? "Working" : "Generate"}
          </button>
        </div>
      </header>

      <main
        className="grid flex-1 grid-cols-1 gap-x-6 px-4 py-6 lg:grid-cols-12 lg:px-6"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,22,26,0.07) 0 1px, transparent 1px 8.3333%)",
        }}
      >
        <section
          aria-label="Inputs"
          className="order-2 flex flex-col gap-5 lg:order-1 lg:col-span-3"
        >
          <div>
            <label htmlFor="di-brief" className="block text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Brief
            </label>
            <textarea
              id="di-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={6}
              className={cn(
                "mt-1.5 w-full resize-y border bg-white px-2.5 py-2 text-[13px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67]",
                briefTooShort ? "border-[#b4432f]" : "border-[#14161a]/25",
              )}
              placeholder="Product, promise, proof, call to action"
            />
            {briefTooShort && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-[#b4432f]">
                <AlertCircle className="size-3" aria-hidden />
                Needs {24 - brief.trim().length} more characters.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="di-audience" className="block text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Audience
            </label>
            <select
              id="di-audience"
              value={audience}
              onChange={(event) => {
                setAudience(event.target.value as AudienceId)
                log(`Audience set to ${event.target.value}`)
              }}
              className="mt-1.5 h-8 w-full border border-[#14161a]/25 bg-white px-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67]"
            >
              {AUDIENCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="di-channel" className="block text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Channel
            </label>
            <select
              id="di-channel"
              value={channel}
              onChange={(event) => {
                setChannel(event.target.value as ChannelId)
                log(`Channel set to ${event.target.value}`)
              }}
              className="mt-1.5 h-8 w-full border border-[#14161a]/25 bg-white px-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67]"
            >
              {CHANNELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p id="di-tone" className="text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Tone
            </p>
            <div role="radiogroup" aria-labelledby="di-tone" className="mt-1.5 flex">
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
                    "h-8 flex-1 border text-[12px] transition-colors first:rounded-l last:rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67]",
                    tone === item.id
                      ? "border-[#2b3a67] bg-[#2b3a67] text-white"
                      : "border-[#14161a]/25 bg-white hover:bg-[#f7f7f5]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="text-[11px] tracking-[0.08em] text-[#6b6e73]">Visual style</legend>
            <div className="mt-1.5 grid grid-cols-2">
              {STYLES.map((item) => (
                <label key={item.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="di-style"
                    value={item.id}
                    checked={style === item.id}
                    onChange={() => {
                      setStyle(item.id as StyleId)
                      log(`Visual style set to ${item.label}`)
                    }}
                    className="peer sr-only"
                  />
                  <span className="block border border-[#14161a]/25 bg-white px-2 py-1.5 text-[12px] transition-colors hover:bg-[#f7f7f5] peer-checked:border-[#2b3a67] peer-checked:bg-[#eceef4] peer-focus-visible:ring-2 peer-focus-visible:ring-[#2b3a67]">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section aria-label="Plate" className="order-1 flex flex-col lg:order-2 lg:col-span-6">
          <div className="flex items-center gap-4 border-b border-[#14161a] pb-2">
            <div role="tablist" aria-label="Concept" className="flex gap-3">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b3a67]",
                    item.id === conceptId
                      ? "text-[#14161a] underline decoration-[#2b3a67] decoration-2 underline-offset-4"
                      : "text-[#6b6e73] hover:text-[#14161a]",
                  )}
                >
                  {item.id}. {item.name}
                </button>
              ))}
            </div>
            <span className="ml-auto text-[11px] text-[#6b6e73]">{channelRecord.format}</span>
          </div>

          <div className="mt-4 flex flex-1 items-start justify-center">
            <div className="w-full max-w-[440px]">
              <article
                aria-label={`Concept ${concept.id} preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between border border-[#14161a] sm:aspect-[1/1]"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between border-b border-current/20 px-5 py-3 text-[11px] tracking-[0.1em] opacity-85">
                  <span>Hydra</span>
                  <span>{concept.angle}</span>
                </header>
                <div className="px-5">
                  <p className="text-[11px] tracking-[0.1em] opacity-80">{audienceRecord.note}</p>
                  <h2 className="mt-3 max-w-[20ch] text-[30px] leading-[1.04] font-semibold tracking-[-0.02em] sm:text-[40px]">
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-4 max-w-[42ch] text-[13px] leading-relaxed opacity-85">
                    {concept.sub}
                  </p>
                </div>
                <footer className="flex items-end justify-between gap-3 px-5 py-4">
                  <p className="text-[11px] opacity-75">{concept.tagline}</p>
                  <span
                    className="px-4 py-2 text-[12px] font-semibold"
                    style={{ background: concept.palette.fg, color: concept.palette.deep }}
                  >
                    {toneRecord.cta}
                  </span>
                </footer>
                {status === "loading" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-[#f1f1ee]/90 motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-5 top-1/3 h-3 bg-[#14161a]/15" />
                    <div className="absolute inset-x-5 top-1/3 mt-6 h-10 w-2/3 bg-[#14161a]/15" />
                  </div>
                )}
              </article>
              <p className="mt-2 border-t border-[#14161a]/20 pt-2 text-[11px] text-[#6b6e73]">
                Plate {concept.id}, set in {toneRecord.label.toLowerCase()} tone.{" "}
                {styleRecordHint(style)}
              </p>
            </div>
          </div>

          <div aria-live="polite" className="mt-4 min-h-[22px]">
            {status === "success" && (
              <p className="text-[12px] text-[#2b3a67]">
                Plate {concept.id} regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-2 text-[12px] text-[#b4432f]">
                <AlertCircle className="size-3.5" aria-hidden />
                {briefTooShort
                  ? "Nothing generated: the brief is too short."
                  : "Generation failed: the model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4432f]"
                >
                  Retry
                </button>
              </p>
            )}
          </div>
        </section>

        <aside className="order-3 flex flex-col gap-6 lg:col-span-3">
          <section aria-labelledby="di-metrics">
            <h2 id="di-metrics" className="border-b border-[#14161a] pb-1.5 text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Forecast
            </h2>
            <dl className="mt-2">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conversion", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-baseline justify-between border-b border-[#14161a]/12 py-1.5"
                >
                  <dt className="text-[12px] text-[#4a4d52]">{metric.label}</dt>
                  <dd className="text-[16px] font-semibold tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[11px] leading-relaxed text-[#6b6e73]">
              Estimated for {audienceRecord.label.toLowerCase()} on {channelRecord.label.toLowerCase()}.
            </p>
          </section>

          <section aria-labelledby="di-activity">
            <h2 id="di-activity" className="border-b border-[#14161a] pb-1.5 text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Recent activity
            </h2>
            <ol className="mt-2">
              {activity.map((entry) => (
                <li
                  key={entry.id}
                  className="border-b border-[#14161a]/12 py-1.5 text-[12px] leading-snug"
                >
                  <time className="mr-2 font-mono text-[11px] text-[#8b8e93] tabular-nums">
                    {entry.time}
                  </time>
                  {entry.text}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="di-grid">
            <h2 id="di-grid" className="border-b border-[#14161a] pb-1.5 text-[11px] tracking-[0.08em] text-[#6b6e73]">
              Grid
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-[#6b6e73]">
              Twelve columns at 24 px gutters. Controls take three, the plate six, results three. Column
              rules stay visible on desktop so alignment can be checked at a glance.
            </p>
          </section>
        </aside>
      </main>
    </div>
  )
}

function styleRecordHint(style: string) {
  return STYLES.find((item) => item.id === style)?.hint.toLowerCase() ?? style
}
