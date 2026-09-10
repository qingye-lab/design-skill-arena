"use client"

import { AlertCircle, Check, CheckCircle2, Download, Loader2, Save, Sparkles } from "lucide-react"

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
const CHAIN = "frontend-skill + taste-skill + impeccable"

export default function VisualPremiumChain() {
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
    <div className="relative min-h-dvh bg-[#08080a] font-sans text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 30% 0%, rgba(120,150,255,0.18), transparent 70%), radial-gradient(50% 40% at 90% 100%, rgba(255,180,120,0.12), transparent 70%)",
        }}
      />

      <div className="relative flex min-h-dvh flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-label="Stage" className="relative order-1 flex flex-col lg:h-dvh">
          <div
            className="absolute inset-0 transition-[background] duration-500"
            style={{ background: concept.palette.bg }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(80% 60% at 25% 10%, rgba(255,255,255,0.4), transparent 60%), linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45))",
            }}
            aria-hidden
          />

          <header className="relative flex h-14 shrink-0 items-center gap-3 px-5">
            <span
              className="text-[13px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: concept.palette.fg }}
            >
              Muse
            </span>
            <span
              className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur"
            >
              {MODEL} · {CHAIN}
            </span>
            <span
              className="ml-auto text-[11px] opacity-80"
              style={{ color: concept.palette.fg }}
            >
              {channelRecord.format}
            </span>
          </header>

          <div className="relative flex flex-1 flex-col justify-center px-5 pb-6 sm:px-10">
            <p
              className="text-[11px] tracking-[0.28em] uppercase opacity-70"
              style={{ color: concept.palette.fg }}
            >
              {audienceRecord.note}
            </p>
            <h1
              className="mt-4 max-w-[15ch] text-[40px] leading-[0.95] font-semibold tracking-[-0.03em] sm:text-[68px] lg:text-[84px]"
              style={{ color: concept.palette.fg }}
            >
              {concept.headline[tone]}
            </h1>
            <p
              className="mt-6 max-w-[48ch] text-[14px] leading-relaxed opacity-85 sm:text-[17px]"
              style={{ color: concept.palette.fg }}
            >
              {concept.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <span
                className="rounded-full px-7 py-3.5 text-[14px] font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                style={{ background: concept.palette.fg, color: concept.palette.deep }}
              >
                {toneRecord.cta}
              </span>
              <p className="text-[12px] opacity-75" style={{ color: concept.palette.fg }}>
                {concept.tagline}
              </p>
            </div>

            {status === "loading" && (
              <div
                aria-hidden
                className="absolute inset-0 animate-pulse bg-[#08080a]/70 backdrop-blur-[3px] motion-reduce:animate-none"
              >
                <div className="absolute inset-x-10 top-1/2 h-4 rounded bg-white/20" />
                <div className="absolute inset-x-10 top-1/2 mt-8 h-12 w-2/3 rounded bg-white/20" />
              </div>
            )}
          </div>

          <div className="relative shrink-0 px-5 pb-5 sm:px-10">
            <div className="flex gap-2" role="tablist" aria-label="Concept">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "group relative h-20 w-28 overflow-hidden rounded-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-32",
                    item.id === conceptId
                      ? "ring-2 ring-white"
                      : "opacity-65 hover:-translate-y-1 hover:opacity-100",
                  )}
                  style={{ background: item.palette.bg }}
                >
                  <span
                    className="absolute bottom-2 left-2 text-[11px] font-semibold"
                    style={{ color: item.palette.fg }}
                  >
                    {item.id}
                  </span>
                  <span className="sr-only">Concept {item.id}: {item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="order-2 border-t border-white/10 bg-[#0d0d11]/90 p-4 backdrop-blur-xl lg:h-dvh lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generate}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 text-[13px] font-semibold text-[#08080a] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d11]"
              >
                {status === "loading" ? (
                  <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
                {status === "loading" ? "Rendering" : "Generate"}
              </button>
              <button
                type="button"
                onClick={save}
                className={cn(
                  "grid size-10 place-items-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  saved
                    ? "border-white bg-white/15 text-white"
                    : "border-white/20 text-white/80 hover:border-white/50",
                )}
                aria-label={saved ? "Saved" : "Save"}
              >
                {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
              </button>
              <button
                type="button"
                onClick={() => exportAs("PNG")}
                className="grid size-10 place-items-center rounded-xl border border-white/20 text-white/80 transition-colors hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Export"
              >
                <Download className="size-4" aria-hidden />
              </button>
            </div>

            <div aria-live="polite" className="min-h-[20px]">
              {status === "success" && (
                <p className="flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-2 text-[12px] text-white/90">
                  <CheckCircle2 className="size-3.5" aria-hidden />
                  Stage rendered for {channelRecord.label}.
                </p>
              )}
              {status === "error" && (
                <p className="flex flex-wrap items-center gap-1.5 rounded-lg bg-[#3a1512]/70 px-3 py-2 text-[12px] text-[#ffb4a2]">
                  <AlertCircle className="size-3.5" aria-hidden />
                  {briefTooShort
                    ? "Brief is under 24 characters."
                    : "Render failed. The model timed out."}
                  <button
                    type="button"
                    onClick={generate}
                    className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb4a2]"
                  >
                    Retry
                  </button>
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <label htmlFor="vp-brief" className="block text-[11px] text-white/60">
                Brief
              </label>
              <textarea
                id="vp-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={4}
                className={cn(
                  "mt-1.5 w-full resize-y rounded-lg border bg-black/30 px-2.5 py-2 text-[12px] leading-relaxed text-white placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  briefTooShort ? "border-[#e07a5f]" : "border-white/12",
                )}
                placeholder="Product, promise, proof, call to action"
              />
            </div>

            {(
              [
                {
                  id: "vp-audience",
                  label: "Audience",
                  value: audience,
                  options: AUDIENCES,
                  apply: (value: string) => {
                    setAudience(value as AudienceId)
                    log(`Audience set to ${value}`)
                  },
                },
                {
                  id: "vp-channel",
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
              <div key={field.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p id={field.id} className="text-[11px] text-white/60">
                  {field.label}
                </p>
                <div role="radiogroup" aria-labelledby={field.id} className="mt-2 grid grid-cols-2 gap-1.5">
                  {field.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={field.value === option.id}
                      onClick={() => field.apply(option.id)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                        field.value === option.id
                          ? "border-white bg-white text-[#08080a]"
                          : "border-white/12 text-white/80 hover:border-white/40",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p id="vp-tone" className="text-[11px] text-white/60">
                Tone
              </p>
              <div role="radiogroup" aria-labelledby="vp-tone" className="mt-2 flex overflow-hidden rounded-lg border border-white/12">
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
                      "h-8 flex-1 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white",
                      tone === item.id
                        ? "bg-white font-semibold text-[#08080a]"
                        : "text-white/75 hover:bg-white/10",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <fieldset className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <legend className="text-[11px] text-white/60">Visual style</legend>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {STYLES.map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="vp-style"
                      value={item.id}
                      checked={style === item.id}
                      onChange={() => {
                        setStyle(item.id as StyleId)
                        log(`Visual style set to ${item.label}`)
                      }}
                      className="peer sr-only"
                    />
                    <span className="block rounded-lg border border-white/12 px-2 py-1.5 text-[12px] text-white/80 transition-colors hover:border-white/40 peer-checked:border-white peer-checked:bg-white/15 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-white">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <h2 className="text-[11px] text-white/60">Simulated metrics</h2>
              <dl className="mt-2 grid grid-cols-3 gap-1.5">
                {[
                  { label: "Reach", value: formatReach(metrics.reach) },
                  { label: "CTR", value: formatPercent(metrics.ctr) },
                  { label: "Conv", value: formatPercent(metrics.conv) },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-black/30 px-2 py-2 text-center">
                    <dt className="text-[10px] text-white/55">{metric.label}</dt>
                    <dd className="mt-0.5 text-[14px] font-semibold tabular-nums">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="text-[11px] text-white/60">Recent activity</h2>
              <ol className="mt-2 flex flex-col gap-1.5">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-2 text-[11px] text-white/70">
                    <time className="shrink-0 font-mono text-white/40 tabular-nums">{entry.time}</time>
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
