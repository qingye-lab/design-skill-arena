"use client"

import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Command,
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
import { useCampaignStudio, useMobilePanel } from "./use-campaign"
import type { AudienceId, ChannelId, StyleId, ToneId } from "./campaign-data"

const MODEL = "Hy4"
const CHAIN = "frontend-app-builder + impeccable"

const SPARK = [38, 44, 41, 52, 49, 61, 58, 72, 68, 81]

export default function StandardImpeccable() {
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
  } = useCampaignStudio()

  const [panel, setPanel] = useMobilePanel<"inputs" | "results">("inputs")

  return (
    <div className="flex min-h-dvh flex-col bg-[#17191d] font-sans text-[#e8eaee]">
      <header className="flex min-h-12 shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-[#262a31] bg-[#1b1e23] px-3 py-1.5 sm:h-12 sm:flex-nowrap sm:py-0">
        <span className="text-[13px] font-semibold tracking-tight">Muse</span>
        <ChevronRight className="hidden size-3.5 text-[#5d6470] sm:block" aria-hidden />
        <span className="hidden text-[13px] text-[#a7aeb9] sm:inline">Hydra launch</span>
        <ChevronRight className="size-3.5 text-[#5d6470]" aria-hidden />
        <span className="text-[13px] text-[#e8eaee]">Concept {concept.id}</span>
        <div className="ml-2 hidden items-center gap-1.5 lg:flex">
          <span className="rounded border border-[#2f343d] bg-[#21252b] px-1.5 py-0.5 text-[11px] text-[#b6bdc8]">
            {MODEL}
          </span>
          <span className="rounded border border-[#2f343d] bg-[#21252b] px-1.5 py-0.5 font-mono text-[11px] text-[#838b97]">
            {CHAIN}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded border px-2 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1e23]",
              saved
                ? "border-[#2f6f5f] bg-[#14312a] text-[#5eead4]"
                : "border-[#2f343d] bg-[#21252b] text-[#b6bdc8] hover:border-[#3b424c]",
            )}
          >
            {saved ? <Check className="size-3" aria-hidden /> : <Save className="size-3" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <div data-export-root className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              onClick={() => setExportOpen(!exportOpen)}
              className="inline-flex h-7 items-center gap-1.5 rounded border border-[#2f343d] bg-[#21252b] px-2 text-[12px] text-[#b6bdc8] transition-colors hover:border-[#3b424c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1e23]"
            >
              <Download className="size-3" aria-hidden />
              Export
              <ChevronDown className="size-3 text-[#7b828d]" aria-hidden />
            </button>
            {exportOpen && (
              <div
                role="menu"
                aria-label="Export options"
                className="absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded border border-[#2f343d] bg-[#21252b] p-1 shadow-xl"
              >
                {["PNG 1080×1350", "MP4 teaser", "PDF proof", "Copy JSON"].map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    role="menuitem"
                    onClick={() => exportAs(kind)}
                    className="block w-full rounded px-2 py-1.5 text-left text-[12px] text-[#c3cad4] hover:bg-[#2b3038] focus-visible:bg-[#2b3038] focus-visible:outline-none"
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
            className="inline-flex h-7 items-center gap-1.5 rounded bg-[#5eead4] px-2.5 text-[12px] font-semibold text-[#0d2b26] transition-colors hover:bg-[#7df0df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1e23]"
          >
            {status === "loading" ? (
              <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3" aria-hidden />
            )}
            {status === "loading" ? "Generating" : "Generate"}
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col pb-[72px] lg:grid lg:grid-cols-[276px_minmax(0,1fr)_296px] lg:pb-0">
        <aside
          className={cn(
            "order-3 bg-[#1b1e23] lg:order-1 lg:block lg:overflow-y-auto lg:border-r lg:border-[#262a31]",
            panel !== "inputs" && "hidden",
          )}
        >
          <div className="flex flex-col gap-4 p-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="si-brief" className="text-[12px] font-medium text-[#c3cad4]">
                  Brief
                </label>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    briefTooShort ? "text-[#f8a08a]" : "text-[#7b828d]",
                  )}
                >
                  {brief.length}/24
                </span>
              </div>
              <textarea
                id="si-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={6}
                className={cn(
                  "w-full resize-y rounded border bg-[#12151a] px-2.5 py-2 text-[12px] leading-relaxed text-[#e8eaee] placeholder:text-[#5d6470] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4]",
                  briefTooShort ? "border-[#7a3b32]" : "border-[#2f343d]",
                )}
                placeholder="Product, promise, proof, call to action"
              />
            </div>

            {(
              [
                {
                  id: "si-audience",
                  label: "Audience",
                  value: audience,
                  options: AUDIENCES,
                  apply: (value: string) => {
                    setAudience(value as AudienceId)
                    log(`Audience set to ${value}`)
                  },
                },
                {
                  id: "si-channel",
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
                <label htmlFor={field.id} className="mb-1.5 block text-[12px] font-medium text-[#c3cad4]">
                  {field.label}
                </label>
                <select
                  id={field.id}
                  value={field.value}
                  onChange={(event) => field.apply(event.target.value)}
                  className="h-8 w-full rounded border border-[#2f343d] bg-[#12151a] px-2 text-[12px] text-[#e8eaee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4]"
                >
                  {field.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div>
              <p id="si-tone" className="mb-1.5 text-[12px] font-medium text-[#c3cad4]">
                Tone
              </p>
              <div
                role="radiogroup"
                aria-labelledby="si-tone"
                className="grid grid-cols-3 gap-1 rounded border border-[#2f343d] bg-[#12151a] p-0.5"
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
                      "h-7 rounded text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4]",
                      tone === item.id
                        ? "bg-[#2b3038] text-white"
                        : "text-[#8b929d] hover:bg-[#20242a] hover:text-[#c3cad4]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-[12px] font-medium text-[#c3cad4]">Visual style</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES.map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="si-style"
                      value={item.id}
                      checked={style === item.id}
                      onChange={() => {
                        setStyle(item.id as StyleId)
                        log(`Visual style set to ${item.label}`)
                      }}
                      className="peer sr-only"
                    />
                    <span className="block rounded border border-[#2f343d] bg-[#12151a] px-2 py-1.5 text-[12px] text-[#b6bdc8] transition-colors hover:border-[#3b424c] peer-checked:border-[#5eead4] peer-checked:text-[#5eead4] peer-focus-visible:ring-2 peer-focus-visible:ring-[#5eead4]">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>

        <section aria-label="Preview" className="order-1 flex min-h-0 flex-col lg:order-2">
          <div className="flex items-center gap-2 border-b border-[#262a31] bg-[#1b1e23] px-3 py-2">
            <div role="tablist" aria-label="Concept" className="flex gap-1">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "rounded px-2 py-1 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5eead4]",
                    item.id === conceptId
                      ? "bg-[#2b3038] text-white"
                      : "text-[#8b929d] hover:bg-[#20242a] hover:text-[#c3cad4]",
                  )}
                >
                  {item.id}
                  <span className="ml-1.5 hidden text-[#7b828d] sm:inline">{item.name}</span>
                </button>
              ))}
            </div>
            <span className="ml-auto font-mono text-[11px] text-[#7b828d]">{channelRecord.format}</span>
          </div>

          <div className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#12151a,#1b1e23)] p-4 sm:p-8">
            <div className="w-full max-w-[400px]">
              <div className="rounded-[18px] bg-[#0d0f12] p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                <article
                  aria-label={`Concept ${concept.id} preview`}
                  className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[12px]"
                  style={{ background: concept.palette.bg, color: concept.palette.fg }}
                >
                  <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-80">
                    <span>Hydra</span>
                    <span>{audienceRecord.note}</span>
                  </header>
                  <div className="px-5">
                    <h2 className="text-[26px] leading-[1.08] font-semibold tracking-tight sm:text-[32px]">
                      {concept.headline[tone]}
                    </h2>
                    <p className="mt-3 max-w-[32ch] text-[12px] leading-relaxed opacity-85">
                      {concept.sub}
                    </p>
                  </div>
                  <footer className="flex items-end justify-between px-5 pb-4">
                    <p className="text-[11px] opacity-75">{concept.tagline}</p>
                    <span
                      className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
                      style={{ background: concept.palette.fg, color: concept.palette.deep }}
                    >
                      {toneRecord.cta}
                    </span>
                  </footer>
                  {status === "loading" && (
                    <div
                      aria-hidden
                      className="absolute inset-0 animate-pulse bg-[#0d0f12]/85 motion-reduce:animate-none"
                    >
                      <div className="absolute inset-x-5 top-24 h-2.5 rounded bg-white/15" />
                      <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded bg-white/15" />
                      <div className="absolute inset-x-5 top-44 h-2.5 w-1/2 rounded bg-white/15" />
                    </div>
                  )}
                </article>
              </div>
              <p className="mt-3 text-center font-mono text-[11px] text-[#7b828d]">
                {channelRecord.format}
              </p>
            </div>
          </div>

          <div aria-live="polite" className="border-t border-[#262a31] bg-[#1b1e23] px-3 py-2">
            {status === "success" && (
              <p className="flex items-center gap-1.5 text-[12px] text-[#5eead4]">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Concept {concept.id} regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#f8a08a]">
                <AlertCircle className="size-3.5" aria-hidden />
                {briefTooShort
                  ? "Generation failed: brief is shorter than 24 characters."
                  : "Generation failed: model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8a08a]"
                >
                  Retry
                </button>
              </p>
            )}
            {status === "idle" && (
              <p className="text-[11px] text-[#7b828d]">Ready. No run since the last save.</p>
            )}
            {status === "loading" && <p className="text-[11px] text-[#7b828d]">Rendering…</p>}
          </div>
        </section>

        <div
          role="tablist"
          aria-label="Workspace panel"
          className="order-2 grid grid-cols-2 border-b border-[#262a31] bg-[#1b1e23] lg:hidden"
        >
          {(
            [
              ["inputs", "Inputs"],
              ["results", "Results"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={panel === id}
              onClick={() => setPanel(id)}
              className={cn(
                "h-10 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#5eead4]",
                panel === id ? "text-white" : "text-[#8b929d]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <aside
          className={cn(
            "order-3 bg-[#1b1e23] lg:order-3 lg:block lg:overflow-y-auto lg:border-l lg:border-[#262a31]",
            panel !== "results" && "hidden",
          )}
        >
          <div className="flex flex-col gap-3 p-3">
            <section aria-labelledby="si-forecast">
              <h2 id="si-forecast" className="text-[12px] font-medium text-[#c3cad4]">
                Forecast
              </h2>
              <div className="mt-2 flex flex-col gap-2">
                {[
                  { label: "Reach", value: formatReach(metrics.reach), pct: (metrics.reach / 322000) * 100 },
                  { label: "CTR", value: formatPercent(metrics.ctr), pct: (metrics.ctr / 7) * 100 },
                  { label: "Conversion", value: formatPercent(metrics.conv), pct: (metrics.conv / 3.2) * 100 },
                ].map((metric) => (
                  <div key={metric.label} className="rounded border border-[#2f343d] bg-[#12151a] p-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-[#8b929d]">{metric.label}</span>
                      <span className="font-mono text-[13px] tabular-nums text-white">{metric.value}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#2b3038]">
                      <div
                        className="h-full rounded-full bg-[#5eead4] transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${Math.min(100, metric.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex h-10 items-end gap-0.5" aria-hidden>
                {SPARK.map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-sm bg-[#2f5f56]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="text-[11px] text-[#7b828d]">Ten-day reach trend, same channel.</p>
            </section>

            <section aria-labelledby="si-activity">
              <h2 id="si-activity" className="text-[12px] font-medium text-[#c3cad4]">
                Recent activity
              </h2>
              <ol className="mt-2 flex flex-col gap-1.5">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-2 text-[11px] leading-snug">
                    <time className="shrink-0 font-mono text-[#6b7280] tabular-nums">{entry.time}</time>
                    <span className="text-[#a7aeb9]">{entry.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </aside>
      </main>

      <footer className="hidden h-8 shrink-0 items-center gap-4 border-t border-[#262a31] bg-[#14171b] px-3 text-[11px] text-[#7b828d] lg:flex">
        <span className="flex items-center gap-1">
          <Command className="size-3" aria-hidden />S save
        </span>
        <span className="flex items-center gap-1">
          <Command className="size-3" aria-hidden />E export
        </span>
        <span className="flex items-center gap-1">
          <Command className="size-3" aria-hidden />
          {"↵"} generate
        </span>
        <span className="ml-auto">
          {saved ? "Draft saved just now" : "Last saved 6 minutes ago"}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "error" ? "bg-[#f87171]" : status === "loading" ? "bg-[#fbbf24]" : "bg-[#5eead4]",
            )}
            aria-hidden
          />
          {status === "error" ? "Error" : status === "loading" ? "Running" : "Ready"}
        </span>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-[#262a31] bg-[#1b1e23]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={save}
          className="inline-flex h-9 items-center gap-1.5 rounded border border-[#2f343d] bg-[#21252b] px-3 text-[12px] text-[#c3cad4]"
        >
          {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => exportAs("PNG")}
          className="inline-flex h-9 items-center gap-1.5 rounded border border-[#2f343d] bg-[#21252b] px-3 text-[12px] text-[#c3cad4]"
        >
          <Download className="size-3.5" aria-hidden />
          Export
        </button>
        <button
          type="button"
          onClick={generate}
          className="inline-flex h-9 items-center gap-1.5 rounded bg-[#5eead4] px-3 text-[12px] font-semibold text-[#0d2b26]"
        >
          {status === "loading" ? (
            <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <Sparkles className="size-3.5" aria-hidden />
          )}
          {status === "loading" ? "Generating" : "Generate"}
        </button>
      </div>
    </div>
  )
}
