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
const CHAIN = "frontend-app-builder + taste-skill"

export default function StandardTaste() {
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
    <div className="min-h-dvh bg-[#f7f7f5] px-5 font-sans text-[#16181a] sm:px-8">
      <div className="mx-auto max-w-[1080px]">
        <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#e3e3df] py-7">
          <h1 className="text-[15px] font-medium tracking-tight">Muse</h1>
          <p className="text-[13px] text-[#6b6459]">
            Hydra launch · {MODEL} · {CHAIN}
          </p>
          <div className="ml-auto flex items-center gap-5">
            <button
              type="button"
              onClick={save}
              className={cn(
                "inline-flex items-center gap-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f5]",
                saved ? "text-[#2c5545]" : "text-[#4b4740] hover:text-[#16181a]",
              )}
            >
              {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => exportAs("PNG")}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#4b4740] transition-colors hover:text-[#16181a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f5]"
            >
              <Download className="size-3.5" aria-hidden />
              Export
            </button>
            <button
              type="button"
              onClick={generate}
              className="inline-flex items-center gap-1.5 bg-[#2c5545] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#244636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f5]"
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

        <main className="grid gap-x-14 gap-y-10 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <section aria-label="Campaign inputs" className="flex flex-col gap-8">
            <div>
              <label htmlFor="st-brief" className="block text-[13px] text-[#4b4740]">
                What are we launching
              </label>
              <textarea
                id="st-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={7}
                className="mt-2 w-full resize-y border-b border-[#dcdcd7] bg-transparent pb-3 text-[15px] leading-relaxed text-[#16181a] placeholder:text-[#a8a49c] focus-visible:border-[#2c5545] focus-visible:outline-none"
                placeholder="The product, the promise, and what the reader should do next"
              />
              {briefTooShort && (
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#a8442c]">
                  <AlertCircle className="size-3.5" aria-hidden />
                  Too short to generate. Add {24 - brief.trim().length} more characters.
                </p>
              )}
            </div>

            <div>
              <p id="st-audience" className="text-[13px] text-[#4b4740]">
                Who reads it
              </p>
              <div
                role="radiogroup"
                aria-labelledby="st-audience"
                className="mt-2 flex flex-wrap gap-x-6 gap-y-2"
              >
                {AUDIENCES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={audience === item.id}
                    onClick={() => {
                      setAudience(item.id as AudienceId)
                      log(`Audience set to ${item.label}`)
                    }}
                    className={cn(
                      "text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f5]",
                      audience === item.id
                        ? "text-[#16181a] underline decoration-[#2c5545] decoration-1 underline-offset-4"
                        : "text-[#6b6459] hover:text-[#16181a]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p id="st-channel" className="text-[13px] text-[#4b4740]">
                Where it runs
              </p>
              <div
                role="radiogroup"
                aria-labelledby="st-channel"
                className="mt-2 flex flex-wrap gap-x-6 gap-y-2"
              >
                {CHANNELS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={channel === item.id}
                    onClick={() => {
                      setChannel(item.id as ChannelId)
                      log(`Channel set to ${item.label}`)
                    }}
                    className={cn(
                      "text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f5]",
                      channel === item.id
                        ? "text-[#16181a] underline decoration-[#2c5545] decoration-1 underline-offset-4"
                        : "text-[#6b6459] hover:text-[#16181a]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p id="st-tone" className="text-[13px] text-[#4b4740]">
                How it sounds
              </p>
              <div role="radiogroup" aria-labelledby="st-tone" className="mt-2 flex gap-x-6">
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
                      "text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f7f5]",
                      tone === item.id
                        ? "text-[#16181a] underline decoration-[#2c5545] decoration-1 underline-offset-4"
                        : "text-[#6b6459] hover:text-[#16181a]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p id="st-style" className="text-[13px] text-[#4b4740]">
                How it looks
              </p>
              <div role="radiogroup" aria-labelledby="st-style" className="mt-2 flex flex-col">
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
                      "flex items-baseline justify-between border-b border-[#e3e3df] py-2.5 text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545]",
                      style === item.id ? "text-[#16181a]" : "text-[#6b6459] hover:text-[#16181a]",
                    )}
                  >
                    {item.label}
                    <span className="text-[12px] text-[#9a958c]">{item.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p id="st-concept" className="text-[13px] text-[#4b4740]">
                Which route
              </p>
              <div role="radiogroup" aria-labelledby="st-concept" className="mt-2 flex flex-col">
                {concepts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={conceptId === item.id}
                    onClick={() => selectConcept(item.id)}
                    className={cn(
                      "border-b border-[#e3e3df] py-2.5 text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c5545]",
                      conceptId === item.id ? "text-[#16181a]" : "text-[#6b6459] hover:text-[#16181a]",
                    )}
                  >
                    {item.name}
                    <span className="ml-2 text-[12px] text-[#9a958c]">{item.angle}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section aria-label="Preview and results" className="flex flex-col gap-8">
            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-medium">Concept {concept.id}</h2>
                <p className="text-[12px] text-[#9a958c]">{channelRecord.format}</p>
              </div>
              <article
                aria-label={`Concept ${concept.id} preview`}
                className="relative mt-3 flex aspect-[4/5] w-full flex-col justify-between overflow-hidden sm:aspect-[5/4]"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-6 pt-5 text-[11px] opacity-80">
                  <span>Hydra</span>
                  <span>{concept.angle}</span>
                </header>
                <div className="px-6">
                  <p className="text-[12px] opacity-80">{audienceRecord.note}</p>
                  <h3 className="mt-2 max-w-[24ch] text-[28px] leading-[1.12] font-medium tracking-tight sm:text-[34px]">
                    {concept.headline[tone]}
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed opacity-85">{concept.sub}</p>
                </div>
                <footer className="flex flex-wrap items-end justify-between gap-3 px-6 pb-5">
                  <p className="text-[12px] opacity-75">{concept.tagline}</p>
                  <span
                    className="px-4 py-2 text-[12px] font-medium"
                    style={{ background: concept.palette.fg, color: concept.palette.deep }}
                  >
                    {toneRecord.cta}
                  </span>
                </footer>
                {status === "loading" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-[#f7f7f5]/85 motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-6 bottom-1/3 h-3 bg-[#dcdcd7]" />
                    <div className="absolute inset-x-6 bottom-1/3 mb-6 h-10 w-2/3 bg-[#dcdcd7]" />
                  </div>
                )}
              </article>

              <div aria-live="polite" className="min-h-[28px]">
                {status === "success" && (
                  <p className="mt-3 text-[13px] text-[#2c5545]">
                    Regenerated for {channelRecord.label}. Forecast updated.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-[#a8442c]">
                    <AlertCircle className="size-3.5" aria-hidden />
                    {briefTooShort
                      ? "Generation stopped. The brief is too short."
                      : "Generation stopped. The model timed out."}
                    <button
                      type="button"
                      onClick={generate}
                      className="underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8442c]"
                    >
                      Try again
                    </button>
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-[#e3e3df] pt-6">
              <dl className="flex flex-wrap gap-x-12 gap-y-4">
                {[
                  { label: "Reach", value: formatReach(metrics.reach) },
                  { label: "Click-through", value: formatPercent(metrics.ctr) },
                  { label: "Conversion", value: formatPercent(metrics.conv) },
                ].map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-[12px] text-[#9a958c]">{metric.label}</dt>
                    <dd className="mt-1 text-[24px] tabular-nums">{metric.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[12px] text-[#9a958c]">
                Estimated for {audienceRecord.label.toLowerCase()}, {channelRecord.label.toLowerCase()},{" "}
                {toneRecord.label.toLowerCase()} wording.
              </p>
            </div>

            <div className="border-t border-[#e3e3df] pt-6">
              <h2 className="text-[13px] text-[#4b4740]">Recent activity</h2>
              <ol className="mt-3 flex flex-col gap-2">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-3 text-[13px] text-[#4b4740]">
                    <time className="shrink-0 font-mono text-[12px] text-[#a8a49c] tabular-nums">
                      {entry.time}
                    </time>
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
