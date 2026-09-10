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
const CHAIN = "frontend-skill + impeccable"

export default function VisualImpeccable() {
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
    <div className="flex min-h-dvh flex-col bg-white font-sans text-[#101215] lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section aria-label="Stage" className="relative order-1 flex min-h-0 flex-col lg:h-dvh">
        <div
          className="absolute inset-0"
          style={{ background: concept.palette.bg }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(90% 70% at 100% 100%, rgba(0,0,0,0.25), transparent 55%)",
          }}
          aria-hidden
        />

        <div className="relative flex h-12 shrink-0 items-center gap-3 px-5 text-[12px]">
          <span className="font-semibold tracking-[0.16em] uppercase" style={{ color: concept.palette.fg }}>
            Muse
          </span>
          <span className="opacity-70" style={{ color: concept.palette.fg }}>
            {channelRecord.format}
          </span>
          <span className="ml-auto rounded-full bg-black/25 px-2 py-0.5 text-[11px] text-white/90">
            {MODEL} · {CHAIN}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col justify-end px-5 pb-6 sm:px-9 sm:pb-9">
          <p
            className="text-[12px] tracking-[0.14em] uppercase opacity-75"
            style={{ color: concept.palette.fg }}
          >
            {audienceRecord.note}
          </p>
          <h1
            className="mt-3 max-w-[16ch] text-[38px] leading-[0.98] font-semibold tracking-[-0.03em] sm:text-[62px] lg:text-[76px]"
            style={{ color: concept.palette.fg }}
          >
            {concept.headline[tone]}
          </h1>
          <p
            className="mt-5 max-w-[44ch] text-[14px] leading-relaxed opacity-85 sm:text-[16px]"
            style={{ color: concept.palette.fg }}
          >
            {concept.sub}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span
              className="rounded-full px-6 py-3 text-[14px] font-semibold"
              style={{ background: concept.palette.fg, color: concept.palette.deep }}
            >
              {toneRecord.cta}
            </span>
            <p className="text-[12px] opacity-75" style={{ color: concept.palette.fg }}>
              {concept.tagline}
            </p>
          </div>

          <div className="mt-8 flex gap-2">
            {concepts.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === conceptId}
                onClick={() => selectConcept(item.id)}
                className={cn(
                  "group relative h-16 w-24 overflow-hidden rounded-md text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  item.id === conceptId
                    ? "ring-2 ring-white"
                    : "opacity-70 hover:opacity-100 hover:-translate-y-0.5",
                )}
                style={{ background: item.palette.bg }}
              >
                <span
                  className="absolute bottom-1.5 left-2 text-[11px] font-semibold"
                  style={{ color: item.palette.fg }}
                >
                  {item.id}
                </span>
                <span className="sr-only">Concept {item.id}: {item.name}</span>
              </button>
            ))}
          </div>

          {status === "loading" && (
            <div
              aria-hidden
              className="absolute inset-0 animate-pulse bg-black/45 backdrop-blur-[3px] motion-reduce:animate-none"
            >
              <div className="absolute inset-x-9 bottom-1/3 h-3 rounded bg-white/25" />
              <div className="absolute inset-x-9 bottom-1/3 mb-6 h-12 w-2/3 rounded bg-white/25" />
            </div>
          )}
        </div>
      </section>

      <aside className="order-2 flex flex-col bg-white lg:h-dvh lg:overflow-y-auto">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[#e6e8ec] px-4">
          <h2 className="text-[13px] font-semibold">Inspector</h2>
          <span className="ml-auto font-mono text-[11px] text-[#8b909a]">concept {concept.id}</span>
        </header>

        <div className="flex flex-col gap-5 p-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={generate}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#101215] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#2a2d34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101215] focus-visible:ring-offset-2"
            >
              {status === "loading" ? (
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <Sparkles className="size-4" aria-hidden />
              )}
              {status === "loading" ? "Generating" : "Generate"}
            </button>
            <button
              type="button"
              onClick={save}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101215] focus-visible:ring-offset-2",
                saved
                  ? "border-[#1f7a4d] bg-[#eef8f2] text-[#1f7a4d]"
                  : "border-[#dfe2e7] bg-white text-[#31363d] hover:bg-[#f5f6f8]",
              )}
            >
              {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => exportAs("PNG")}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#dfe2e7] bg-white px-3 text-[13px] text-[#31363d] transition-colors hover:bg-[#f5f6f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101215] focus-visible:ring-offset-2"
            >
              <Download className="size-4" aria-hidden />
              Export
            </button>
          </div>

          <div aria-live="polite" className="min-h-[20px]">
            {status === "success" && (
              <p className="flex items-center gap-1.5 text-[12px] text-[#1f7a4d]">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Stage regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#c0392b]">
                <AlertCircle className="size-3.5" aria-hidden />
                {briefTooShort
                  ? "Brief is under 24 characters."
                  : "Generation failed. The model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c0392b]"
                >
                  Retry
                </button>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vi-brief" className="block text-[12px] font-medium text-[#31363d]">
              Brief
            </label>
            <textarea
              id="vi-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={4}
              className={cn(
                "mt-1.5 w-full resize-y rounded-md border px-2.5 py-2 text-[13px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101215]",
                briefTooShort ? "border-[#e0a49c]" : "border-[#dfe2e7]",
              )}
              placeholder="Product, promise, proof, call to action"
            />
          </div>

          {(
            [
              {
                id: "vi-audience",
                label: "Audience",
                value: audience,
                options: AUDIENCES,
                apply: (value: string) => {
                  setAudience(value as AudienceId)
                  log(`Audience set to ${value}`)
                },
              },
              {
                id: "vi-channel",
                label: "Channel",
                value: channel,
                options: CHANNELS,
                apply: (value: string) => {
                  setChannel(value as ChannelId)
                  log(`Channel set to ${value}`)
                },
              },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <p id={field.id} className="text-[12px] font-medium text-[#31363d]">
                {field.label}
              </p>
              <div
                role="radiogroup"
                aria-labelledby={field.id}
                className="mt-1.5 grid grid-cols-2 gap-1.5"
              >
                {field.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={field.value === option.id}
                    onClick={() => field.apply(option.id)}
                    className={cn(
                      "rounded-md border px-2 py-1.5 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101215]",
                      field.value === option.id
                        ? "border-[#101215] bg-[#101215] text-white"
                        : "border-[#dfe2e7] bg-white text-[#31363d] hover:border-[#b9bfc7]",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p id="vi-tone" className="text-[12px] font-medium text-[#31363d]">
              Tone
            </p>
            <div
              role="radiogroup"
              aria-labelledby="vi-tone"
              className="mt-1.5 flex overflow-hidden rounded-md border border-[#dfe2e7]"
            >
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
                    "h-8 flex-1 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#101215]",
                    tone === item.id
                      ? "bg-[#101215] text-white"
                      : "bg-white text-[#31363d] hover:bg-[#f5f6f8]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <fieldset>
            <legend className="text-[12px] font-medium text-[#31363d]">Visual style</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {STYLES.map((item) => (
                <label key={item.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="vi-style"
                    value={item.id}
                    checked={style === item.id}
                    onChange={() => {
                      setStyle(item.id as StyleId)
                      log(`Visual style set to ${item.label}`)
                    }}
                    className="peer sr-only"
                  />
                  <span className="block rounded-md border border-[#dfe2e7] bg-white px-2 py-1.5 text-[12px] text-[#31363d] transition-colors hover:border-[#b9bfc7] peer-checked:border-[#101215] peer-checked:bg-[#f2f3f5] peer-focus-visible:ring-2 peer-focus-visible:ring-[#101215]">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <section aria-labelledby="vi-metrics" className="border-t border-[#e6e8ec] pt-4">
            <h2 id="vi-metrics" className="text-[12px] font-medium text-[#31363d]">
              Simulated metrics
            </h2>
            <dl className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conv", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div key={metric.label} className="rounded-md bg-[#f5f6f8] px-2 py-2">
                  <dt className="text-[11px] text-[#8b909a]">{metric.label}</dt>
                  <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="vi-activity" className="border-t border-[#e6e8ec] pt-4">
            <h2 id="vi-activity" className="text-[12px] font-medium text-[#31363d]">
              Recent activity
            </h2>
            <ol className="mt-2 flex flex-col divide-y divide-[#f0f1f3]">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-2 py-1.5 text-[12px]">
                  <time className="shrink-0 font-mono text-[11px] text-[#a3a8b0] tabular-nums">
                    {entry.time}
                  </time>
                  <span className="text-[#4b5158]">{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  )
}
