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
const CHAIN = "frontend-skill"

export default function VisualFrontend() {
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
    exportOpen,
    setExportOpen,
    exportAs,
    activity,
    log,
    metrics,
    channelRecord,
    audienceRecord,
    toneRecord,
    styleRecord,
  } = useCampaignStudio()

  return (
    <div className="flex min-h-dvh flex-col bg-[#071019] font-sans text-[#e8e4dc]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/10 px-4">
        <span className="text-sm font-semibold tracking-[0.2em] text-[#79e2ce] uppercase">Muse</span>
        <span className="hidden text-sm text-white/50 sm:inline">
          {MODEL} · {CHAIN}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071019]",
              saved
                ? "border-[#79e2ce] text-[#79e2ce]"
                : "border-white/20 text-white/70 hover:border-white/40 hover:text-white",
            )}
          >
            {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <div data-export-root className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071019]"
            >
              <Download className="size-3.5" aria-hidden />
              Export
            </button>
            {exportOpen && (
              <div
                role="menu"
                aria-label="Export options"
                className="absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden rounded-md border border-white/15 bg-[#0c1822] py-1 shadow-xl"
              >
                {["PNG", "PDF", "Copy JSON"].map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    role="menuitem"
                    onClick={() => exportAs(kind)}
                    className="block w-full px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:outline-none"
                  >
                    {kind}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#79e2ce] px-4 text-xs font-semibold text-[#04141a] transition-colors hover:bg-[#9beee0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071019]"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3.5" aria-hidden />
            )}
            {status === "loading" ? "Working" : "Generate"}
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[64px_minmax(0,1fr)_340px]">
        <nav
          aria-label="Concept"
          className="order-2 flex gap-2 border-b border-white/10 px-4 py-3 lg:order-1 lg:flex-col lg:items-center lg:gap-3 lg:border-r lg:border-b-0 lg:px-0 lg:py-6"
        >
          {concepts.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === conceptId}
              onClick={() => selectConcept(item.id)}
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071019]",
                item.id === conceptId
                  ? "bg-[#79e2ce] text-[#04141a]"
                  : "border border-white/20 text-white/60 hover:border-white/50 hover:text-white",
              )}
            >
              {item.id}
              <span className="sr-only">Concept {item.id}: {item.name}</span>
            </button>
          ))}
        </nav>

        <section
          aria-label="Campaign preview"
          className="relative order-1 h-[56vh] shrink-0 overflow-hidden lg:order-2 lg:h-auto lg:min-h-0"
        >
          <div
            className="absolute inset-0"
            style={{ background: concept.palette.bg, color: concept.palette.fg }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 78% 30%, rgba(255,255,255,0.55), transparent 45%)",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
            <div className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase opacity-80">
              <span>Hydra</span>
              <span>{channelRecord.format}</span>
            </div>

            <div className="max-w-[19ch]">
              <h1 className="text-4xl leading-[0.95] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                {concept.headline[tone]}
              </h1>
              <p className="mt-5 max-w-[46ch] text-sm leading-relaxed opacity-85 sm:text-base">
                {concept.sub}
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="text-xs opacity-75">
                {concept.tagline} · {audienceRecord.note}
              </p>
              <span
                className="rounded-full px-5 py-2.5 text-sm font-semibold"
                style={{ background: concept.palette.fg, color: concept.palette.deep }}
              >
                {toneRecord.cta}
              </span>
            </div>
          </div>

          {status === "loading" && (
            <div
              aria-hidden
              className="absolute inset-0 animate-pulse bg-[#071019]/80 backdrop-blur-sm motion-reduce:animate-none"
            >
              <div className="absolute inset-x-6 top-1/3 h-3 rounded bg-white/20" />
              <div className="absolute inset-x-6 top-1/3 mt-6 h-10 w-3/4 rounded bg-white/20" />
              <div className="absolute inset-x-6 top-1/3 mt-20 h-3 w-1/2 rounded bg-white/20" />
            </div>
          )}
          {status === "error" && (
            <div className="absolute inset-x-4 bottom-4 flex items-start gap-2 rounded-md bg-[#2a0f0f]/95 px-4 py-3 text-sm text-[#ffd9d3]">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {briefTooShort
                  ? "The brief is too short to generate from. Add at least 24 characters."
                  : "Generation failed. The model did not respond in time."}
              </span>
              <button
                type="button"
                onClick={generate}
                className="ml-auto shrink-0 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd9d3]"
              >
                Retry
              </button>
            </div>
          )}
        </section>

        <aside className="order-3 flex flex-col gap-6 border-t border-white/10 px-5 py-6 lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <div>
            <label htmlFor="vf-brief" className="block text-xs text-white/50">
              Brief
            </label>
            <textarea
              id="vf-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={4}
              className="mt-2 w-full resize-y border-b border-white/20 bg-transparent pb-2 text-sm leading-relaxed text-white placeholder:text-white/30 focus-visible:border-[#79e2ce] focus-visible:outline-none"
              placeholder="What are we launching, and what should people do"
            />
          </div>

          <fieldset>
            <legend className="text-xs text-white/50">Audience</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {AUDIENCES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={audience === item.id}
                  onClick={() => {
                    setAudience(item.id as AudienceId)
                    log(`Audience set to ${item.label}`)
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071019]",
                    audience === item.id
                      ? "border-[#79e2ce] bg-[#79e2ce]/15 text-[#79e2ce]"
                      : "border-white/20 text-white/70 hover:border-white/45 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs text-white/50">Channel</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CHANNELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={channel === item.id}
                  onClick={() => {
                    setChannel(item.id as ChannelId)
                    log(`Channel set to ${item.label}`)
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071019]",
                    channel === item.id
                      ? "border-[#79e2ce] bg-[#79e2ce]/15 text-[#79e2ce]"
                      : "border-white/20 text-white/70 hover:border-white/45 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs text-white/50">Tone</legend>
            <div className="mt-2 flex gap-4">
              {TONES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={tone === item.id}
                  onClick={() => {
                    setTone(item.id as ToneId)
                    log(`Tone set to ${item.label}`)
                  }}
                  className={cn(
                    "border-b pb-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce]",
                    tone === item.id
                      ? "border-[#79e2ce] text-white"
                      : "border-transparent text-white/55 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs text-white/50">Visual style</legend>
            <div className="mt-2 flex flex-col">
              {STYLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={style === item.id}
                  onClick={() => {
                    setStyle(item.id as StyleId)
                    log(`Visual style set to ${item.label}`)
                  }}
                  className={cn(
                    "flex items-baseline justify-between border-b border-white/10 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e2ce]",
                    style === item.id ? "text-white" : "text-white/55 hover:text-white",
                  )}
                >
                  {item.label}
                  <span className="text-xs text-white/35">{item.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <section aria-label="Simulated metrics">
            <dl className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conv", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div key={metric.label} className="px-2 py-3 text-center first:pl-0 last:pr-0">
                  <dt className="text-[11px] text-white/50">{metric.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-white">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-white/40">
              Concept {concept.id} · {styleRecord.label}
            </p>
          </section>

          <section aria-labelledby="vf-activity">
            <h2 id="vf-activity" className="text-xs text-white/50">
              Recent activity
            </h2>
            <ol className="mt-2 flex flex-col gap-1.5">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-2 text-xs text-white/60">
                  <time className="font-mono tabular-nums text-white/35">{entry.time}</time>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </main>
    </div>
  )
}
