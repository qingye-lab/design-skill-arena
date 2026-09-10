"use client"

import { useState } from "react"
import { AlertCircle, Check, Download, Loader2, Save, Sparkles, Waves } from "lucide-react"

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
const CHAIN = "react-bits"

const KEYFRAMES = `
@keyframes muse-rise { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes muse-sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes muse-pop { 0% { transform: scale(0.94); opacity: 0; } 60% { transform: scale(1.02); } 100% { transform: scale(1); opacity: 1; } }
`

export default function MotionBits() {
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

  const [intensity, setIntensity] = useState(70)
  const duration = 0.18 + (intensity / 100) * 0.7
  const still = intensity === 0

  const rise = (delay: number) =>
    still
      ? undefined
      : {
          animation: `muse-rise ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
        }

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#0c0a12] font-sans text-[#ede9fe]"
      style={{ ["--muse-dur" as string]: `${duration}s` }}
    >
      <style>{KEYFRAMES}</style>
      <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/10 bg-[#120f1b] px-4 py-2 sm:h-14 sm:flex-nowrap sm:py-0">
        <span className="grid size-7 place-items-center rounded-lg bg-[#a78bfa] text-[#1a1030]">
          <Waves className="size-4" aria-hidden />
        </span>
        <h1 className="text-sm font-semibold tracking-tight">Muse motion lab</h1>
        <div className="ml-2 hidden items-center gap-1.5 lg:flex">
          <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-[#c4b5fd]">
            {MODEL}
          </span>
          <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-xs text-[#8b83a8]">
            {CHAIN}
          </span>
        </div>

        <label className="ml-auto flex items-center gap-2 text-xs text-[#a99fc4]">
          Motion
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/20 accent-[#a78bfa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]"
            aria-label="Motion intensity"
          />
          <span className="w-8 font-mono tabular-nums text-[#c4b5fd]">{intensity}</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]",
              saved
                ? "border-[#a78bfa] bg-[#a78bfa]/15 text-[#c4b5fd]"
                : "border-white/15 text-[#c9c2dd] hover:border-[#a78bfa]/60",
            )}
          >
            {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PNG")}
            className="hidden h-8 items-center gap-1.5 rounded-lg border border-white/15 px-2.5 text-xs text-[#c9c2dd] transition-all duration-200 hover:-translate-y-px hover:border-[#a78bfa]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#a78bfa] px-3 text-xs font-semibold text-[#1a1030] transition-all duration-200 hover:-translate-y-px hover:bg-[#c4b5fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120f1b]"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3.5" aria-hidden />
            )}
            {status === "loading" ? "Rendering" : "Generate"}
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-[250px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col gap-3">
          <div className="rounded-xl border border-white/10 bg-[#14111f] p-3">
            <label htmlFor="mb-brief" className="block text-xs text-[#a99fc4]">
              Brief
            </label>
            <textarea
              id="mb-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={6}
              className={cn(
                "mt-1.5 w-full resize-y rounded-lg border bg-[#0c0a12] px-2.5 py-2 text-xs leading-relaxed text-[#ede9fe] placeholder:text-[#6b6486] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]",
                briefTooShort ? "border-[#f87171]" : "border-white/12",
              )}
              placeholder="Product, promise, proof, call to action"
            />
            {briefTooShort && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[#fca5a5]">
                <AlertCircle className="size-3" aria-hidden />
                Needs 24 characters to generate.
              </p>
            )}
          </div>

          {(
            [
              {
                label: "Audience",
                options: AUDIENCES,
                value: audience,
                onSelect: (value: string) => {
                  setAudience(value as AudienceId)
                  log(`Audience set to ${value}`)
                },
              },
              {
                label: "Channel",
                options: CHANNELS,
                value: channel,
                onSelect: (value: string) => {
                  setChannel(value as ChannelId)
                  log(`Channel set to ${value}`)
                },
              },
              {
                label: "Tone",
                options: TONES,
                value: tone,
                onSelect: (value: string) => {
                  setTone(value as ToneId)
                  log(`Tone set to ${value}`)
                },
              },
              {
                label: "Style",
                options: STYLES,
                value: style,
                onSelect: (value: string) => {
                  setStyle(value as StyleId)
                  log(`Visual style set to ${value}`)
                },
              },
            ] as const
          ).map((group) => (
            <div key={group.label} className="rounded-xl border border-white/10 bg-[#14111f] p-3">
              <p id={`mb-${group.label}`} className="text-xs text-[#a99fc4]">
                {group.label}
              </p>
              <div
                role="radiogroup"
                aria-labelledby={`mb-${group.label}`}
                className="mt-2 flex flex-wrap gap-1.5"
              >
                {group.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={group.value === option.id}
                    onClick={() => group.onSelect(option.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]",
                      group.value === option.id
                        ? "border-[#a78bfa] bg-[#a78bfa] text-[#1a1030]"
                        : "border-white/15 text-[#c9c2dd] hover:border-[#a78bfa]/60",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section aria-label="Preview" className="flex min-h-0 flex-col gap-3">
          <div className="flex gap-1.5">
            {concepts.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === conceptId}
                onClick={() => selectConcept(item.id)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]",
                  item.id === conceptId
                    ? "border-[#a78bfa] bg-[#1b1530]"
                    : "border-white/10 bg-[#14111f] hover:border-white/25",
                )}
              >
                <span className="block text-xs font-semibold">{item.id}</span>
                <span className="block truncate text-[11px] text-[#a99fc4]">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-[#14111f] p-4 sm:p-6">
            <div className="w-full max-w-[400px]">
              <article
                key={`${conceptId}-${tone}-${style}`}
                aria-label={`Concept ${concept.id} preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-xl"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-80">
                  <span>Hydra</span>
                  <span>{channelRecord.format}</span>
                </header>
                <div className="px-5">
                  <p className="text-[11px] opacity-80" style={rise(0)}>
                    {audienceRecord.note}
                  </p>
                  <h2
                    className="mt-1.5 text-2xl leading-[1.1] font-semibold tracking-tight sm:text-[30px]"
                    style={rise(0.06)}
                  >
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-2.5 max-w-[34ch] text-xs leading-relaxed opacity-85" style={rise(0.12)}>
                    {concept.sub}
                  </p>
                </div>
                <footer className="flex items-end justify-between px-5 pb-4">
                  <p className="text-[11px] opacity-75" style={rise(0.18)}>
                    {concept.tagline}
                  </p>
                  <span
                    className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
                    style={{ background: concept.palette.fg, color: concept.palette.deep, ...rise(0.24) }}
                  >
                    {toneRecord.cta}
                  </span>
                </footer>

                {status === "loading" && (
                  <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#0c0a12]/85">
                    <div
                      className="absolute inset-y-0 w-1/2"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(167,139,250,0.35), transparent)",
                        animation: `muse-sweep ${duration * 2}s linear infinite`,
                      }}
                    />
                    <div className="absolute inset-x-5 top-24 h-2.5 rounded bg-white/15" />
                    <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded bg-white/15" />
                  </div>
                )}
              </article>
              <p className="mt-2.5 text-center text-[11px] text-[#8b83a8]">
                {channelRecord.format} · {concept.angle}
              </p>
            </div>
          </div>

          <div aria-live="polite" className="min-h-[36px]">
            {status === "success" && (
              <p
                className="flex items-center gap-1.5 rounded-xl border border-[#a78bfa]/40 bg-[#a78bfa]/12 px-3 py-2 text-xs text-[#ddd6fe]"
                style={still ? undefined : { animation: `muse-pop ${duration}s ease-out both` }}
              >
                <Check className="size-3.5" aria-hidden />
                Concept {concept.id} rendered for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p
                className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#f87171]/40 bg-[#f87171]/12 px-3 py-2 text-xs text-[#fecaca]"
                style={still ? undefined : { animation: `muse-pop ${duration}s ease-out both` }}
              >
                <AlertCircle className="size-3.5" aria-hidden />
                {briefTooShort
                  ? "Nothing rendered: the brief is under 24 characters."
                  : "Render failed: the model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fecaca]"
                >
                  Retry
                </button>
              </p>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-3">
          <div className="rounded-xl border border-white/10 bg-[#14111f] p-3">
            <h2 className="text-xs font-semibold text-[#ddd6fe]">Metrics</h2>
            <dl className="mt-2 flex flex-col gap-2">
              {[
                { label: "Reach", value: formatReach(metrics.reach), pct: (metrics.reach / 322000) * 100 },
                { label: "CTR", value: formatPercent(metrics.ctr), pct: (metrics.ctr / 7) * 100 },
                { label: "Conversion", value: formatPercent(metrics.conv), pct: (metrics.conv / 3.2) * 100 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-[11px] text-[#a99fc4]">
                    <dt>{metric.label}</dt>
                    <dd className="tabular-nums text-[#ede9fe]">{metric.value}</dd>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#a78bfa]"
                      style={{
                        width: `${Math.min(100, metric.pct)}%`,
                        transition: still ? undefined : `width ${duration * 1.4}s cubic-bezier(0.22,1,0.36,1)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#14111f] p-3">
            <h2 className="text-xs font-semibold text-[#ddd6fe]">Motion register</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-[11px] text-[#a99fc4]">
              <li>Staggered entrance on every concept switch.</li>
              <li>Sweeping shimmer while the render runs.</li>
              <li>Pop confirmation when a run succeeds.</li>
              <li>Lift on hover for every control.</li>
            </ul>
            <p className="mt-2 text-[11px] text-[#6b6486]">
              Set motion to 0 to disable the entrance animation entirely.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#14111f] p-3">
            <h2 className="text-xs font-semibold text-[#ddd6fe]">Recent activity</h2>
            <ol className="mt-2 flex flex-col gap-1.5">
              {activity.map((entry, index) => (
                <li
                  key={entry.id}
                  className="flex gap-2 text-[11px] text-[#c9c2dd]"
                  style={still ? undefined : { animation: `muse-rise ${duration}s ease-out both` }}
                >
                  <time className="shrink-0 font-mono text-[#6b6486] tabular-nums">{entry.time}</time>
                  <span className={index === 0 ? "text-[#ede9fe]" : undefined}>{entry.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </main>
    </div>
  )
}
