"use client"

import { AlertCircle, Check, Download, Loader2, Save, Sparkles } from "lucide-react"

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
const CHAIN = "frontend-skill + taste-skill"

export default function VisualTaste() {
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
    <div className="min-h-dvh bg-[#efede8] font-sans text-[#1d1e1c]">
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 pt-6 sm:px-10">
        <p className="text-[13px] tracking-[0.18em] text-[#6f6d66] uppercase">Muse</p>
        <nav aria-label="Concept" className="flex flex-wrap gap-x-5">
          {concepts.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === conceptId}
              onClick={() => selectConcept(item.id)}
              className={cn(
                "text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1e1c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#efede8]",
                item.id === conceptId ? "text-[#1d1e1c]" : "text-[#8b8880] hover:text-[#1d1e1c]",
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <div className="ml-auto hidden text-[12px] text-[#8b8880] sm:block">
          {MODEL} · {CHAIN}
        </div>
        <div className="ml-auto flex items-center gap-4 sm:ml-4">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex items-center gap-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1e1c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#efede8]",
              saved ? "text-[#3f6b52]" : "text-[#5f5d57] hover:text-[#1d1e1c]",
            )}
          >
            {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PNG")}
            className="inline-flex items-center gap-1.5 text-[13px] text-[#5f5d57] transition-colors hover:text-[#1d1e1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1e1c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#efede8]"
          >
            <Download className="size-3.5" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-1.5 bg-[#1d1e1c] px-4 py-2 text-[13px] text-[#f6f5f2] transition-colors hover:bg-[#33352f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1e1c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#efede8]"
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

      <main className="grid gap-y-8 px-6 pb-10 pt-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-x-12">
        <section aria-label="Preview" className="order-1">
          <div className="mx-auto max-w-[520px]">
            <article
              aria-label={`Concept ${concept.id} preview`}
              className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden shadow-[0_30px_80px_rgba(29,30,28,0.18)]"
              style={{ background: concept.palette.bg, color: concept.palette.fg }}
            >
              <header className="flex items-center justify-between px-8 pt-7 text-[11px] tracking-[0.14em] uppercase opacity-80">
                <span>Hydra</span>
                <span>{channelRecord.format}</span>
              </header>
              <div className="px-8">
                <p className="text-[12px] opacity-80">{audienceRecord.note}</p>
                <h1 className="mt-4 max-w-[18ch] text-[36px] leading-[1.02] font-medium tracking-[-0.02em] sm:text-[52px]">
                  {concept.headline[tone]}
                </h1>
                <p className="mt-6 max-w-[42ch] text-[14px] leading-relaxed opacity-85">{concept.sub}</p>
              </div>
              <footer className="flex flex-wrap items-end justify-between gap-4 px-8 pb-7">
                <p className="text-[12px] opacity-75">{concept.tagline}</p>
                <span
                  className="px-5 py-2.5 text-[13px] font-medium"
                  style={{ background: concept.palette.fg, color: concept.palette.deep }}
                >
                  {toneRecord.cta}
                </span>
              </footer>
              {status === "loading" && (
                <div
                  aria-hidden
                  className="absolute inset-0 animate-pulse bg-[#efede8]/80 motion-reduce:animate-none"
                >
                  <div className="absolute inset-x-8 bottom-1/3 h-3 bg-[#d8d5cd]" />
                  <div className="absolute inset-x-8 bottom-1/3 mb-7 h-12 w-3/4 bg-[#d8d5cd]" />
                </div>
              )}
            </article>

            <div aria-live="polite" className="min-h-[24px]">
              {status === "error" && (
                <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[#9b4a2f]">
                  <AlertCircle className="size-3.5" aria-hidden />
                  {briefTooShort
                    ? "The brief is too short to generate from."
                    : "Generation failed. The model timed out."}
                  <button
                    type="button"
                    onClick={generate}
                    className="underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b4a2f]"
                  >
                    Try again
                  </button>
                </p>
              )}
              {status === "success" && (
                <p className="mt-4 text-[13px] text-[#3f6b52]">
                  New render ready for {channelRecord.label}.
                </p>
              )}
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-14 gap-y-5 border-t border-[#d8d5cd] pt-6">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "Click-through", value: formatPercent(metrics.ctr) },
                { label: "Conversion", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div key={metric.label}>
                  <dt className="text-[12px] text-[#8b8880]">{metric.label}</dt>
                  <dd className="mt-1 text-[30px] leading-none tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <aside className="order-2 flex flex-col gap-7 lg:pt-2">
          <div>
            <label htmlFor="vt-brief" className="block text-[12px] text-[#8b8880]">
              Brief
            </label>
            <textarea
              id="vt-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={5}
              className="mt-2 w-full resize-y border-b border-[#d8d5cd] bg-transparent pb-2 text-[14px] leading-relaxed text-[#1d1e1c] placeholder:text-[#b3b0a8] focus-visible:border-[#1d1e1c] focus-visible:outline-none"
              placeholder="What we are launching, and what people should do"
            />
            {briefTooShort && (
              <p className="mt-1.5 text-[12px] text-[#9b4a2f]">
                {24 - brief.trim().length} more characters needed.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vt-audience" className="block text-[12px] text-[#8b8880]">
              Audience
            </label>
            <select
              id="vt-audience"
              value={audience}
              onChange={(event) => {
                setAudience(event.target.value as AudienceId)
                log(`Audience set to ${event.target.value}`)
              }}
              className="mt-2 h-9 w-full border-b border-[#d8d5cd] bg-transparent text-[14px] text-[#1d1e1c] focus-visible:border-[#1d1e1c] focus-visible:outline-none"
            >
              {AUDIENCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vt-channel" className="block text-[12px] text-[#8b8880]">
              Channel
            </label>
            <select
              id="vt-channel"
              value={channel}
              onChange={(event) => {
                setChannel(event.target.value as ChannelId)
                log(`Channel set to ${event.target.value}`)
              }}
              className="mt-2 h-9 w-full border-b border-[#d8d5cd] bg-transparent text-[14px] text-[#1d1e1c] focus-visible:border-[#1d1e1c] focus-visible:outline-none"
            >
              {CHANNELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p id="vt-tone" className="text-[12px] text-[#8b8880]">
              Tone
            </p>
            <div role="radiogroup" aria-labelledby="vt-tone" className="mt-2 flex gap-5">
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
                    "text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1e1c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#efede8]",
                    tone === item.id ? "text-[#1d1e1c]" : "text-[#8b8880] hover:text-[#1d1e1c]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p id="vt-style" className="text-[12px] text-[#8b8880]">
              Visual style
            </p>
            <div role="radiogroup" aria-labelledby="vt-style" className="mt-2 flex flex-col">
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
                    "flex items-baseline justify-between border-b border-[#e2dfd8] py-2 text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1e1c]",
                    style === item.id ? "text-[#1d1e1c]" : "text-[#8b8880] hover:text-[#1d1e1c]",
                  )}
                >
                  {item.label}
                  <span className="text-[12px] text-[#a8a59d]">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[12px] text-[#8b8880]">Recent activity</h2>
            <ol className="mt-2 flex flex-col gap-1.5">
              {activity.slice(0, 4).map((entry) => (
                <li key={entry.id} className="flex gap-2 text-[12px] text-[#6f6d66]">
                  <time className="shrink-0 font-mono text-[11px] text-[#a8a59d] tabular-nums">
                    {entry.time}
                  </time>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </main>
    </div>
  )
}
