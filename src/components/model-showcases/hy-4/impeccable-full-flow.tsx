"use client"

import { AlertCircle, Check, CheckCircle2, ChevronDown, Download, Loader2, Save, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AUDIENCES,
  CHANNELS,
  STYLES,
  TONES,
  REACH_CEILING,
  CTR_CEILING,
  CONV_CEILING,
  formatReach,
  formatPercent,
} from "./campaign-data"
import { useCampaignStudio, useMobilePanel } from "./use-campaign"
import type { AudienceId, ChannelId, StyleId, ToneId } from "./campaign-data"

const MODEL = "Hy4"
const CHAIN = "impeccable"

const STATES = [
  { id: "idle", label: "Idle" },
  { id: "loading", label: "Generating" },
  { id: "success", label: "Ready" },
  { id: "error", label: "Failed" },
] as const

export default function ImpeccableFullFlow() {
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

  const [panel, setPanel] = useMobilePanel<"inputs" | "results">("inputs")

  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0c10] font-sans text-[#e6e9ef]">
      <header className="flex h-13 shrink-0 items-center gap-3 border-b border-[#1e232c] bg-[#0d1015] px-4 py-2.5">
        <span className="grid size-6 place-items-center rounded-[6px] bg-[#6e8bff] text-[11px] font-bold text-[#0a0c10]">
          M
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[13px] font-semibold tracking-tight">Muse campaign studio</h1>
          <p className="truncate text-[11px] text-[#8a93a3]">Hydra launch · spring flight</p>
        </div>
        <div className="ml-2 hidden items-center gap-1.5 md:flex">
          <span className="rounded-full border border-[#1e232c] bg-[#12151b] px-2 py-0.5 text-[11px] text-[#b9c0cd]">
            {MODEL}
          </span>
          <span className="rounded-full border border-[#1e232c] bg-[#12151b] px-2 py-0.5 font-mono text-[11px] text-[#8a93a3]">
            {CHAIN}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[7px] border px-2.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1015]",
              saved
                ? "border-[#2f6f4f] bg-[#12241a] text-[#7bd88f]"
                : "border-[#262c37] bg-[#12151b] text-[#c3cad6] hover:border-[#39414f] hover:bg-[#171b22]",
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
              className="inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-[#262c37] bg-[#12151b] px-2.5 text-[12px] font-medium text-[#c3cad6] transition-colors hover:border-[#39414f] hover:bg-[#171b22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1015]"
            >
              <Download className="size-3.5" aria-hidden />
              Export
              <ChevronDown className="size-3 text-[#7b8494]" aria-hidden />
            </button>
            {exportOpen && (
              <div
                role="menu"
                aria-label="Export options"
                className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-[8px] border border-[#262c37] bg-[#14181f] p-1 shadow-xl"
              >
                {["PNG 1080×1350", "PDF proof", "Copy JSON"].map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    role="menuitem"
                    onClick={() => exportAs(kind)}
                    className="block w-full rounded-[6px] px-2 py-1.5 text-left text-[12px] text-[#c3cad6] hover:bg-[#1d232c] focus-visible:bg-[#1d232c] focus-visible:outline-none"
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
            className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#6e8bff] px-3 text-[12px] font-semibold text-[#0a0c10] transition-colors hover:bg-[#839cff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1015]"
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

      <div className="flex shrink-0 items-center gap-3 border-b border-[#1e232c] bg-[#0b0e13] px-4 py-2">
        <span className="text-[11px] text-[#7b8494]">Run state</span>
        <ol className="flex items-center gap-1.5" aria-label="Generation run state">
          {STATES.map((state, index) => (
            <li key={state.id} className="flex items-center gap-1.5">
              {index > 0 && <span className="h-px w-4 bg-[#262c37]" aria-hidden />}
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                  status === state.id
                    ? state.id === "error"
                      ? "border-[#7f3b3b] bg-[#2a1414] text-[#ff9b8f]"
                      : state.id === "success"
                        ? "border-[#2f6f4f] bg-[#12241a] text-[#7bd88f]"
                        : "border-[#3d4a6b] bg-[#151d33] text-[#a8bbff]"
                    : "border-[#222832] text-[#5e6675]",
                )}
              >
                {state.label}
              </span>
            </li>
          ))}
        </ol>
        <p role="status" aria-live="polite" className="ml-auto truncate text-[11px] text-[#8a93a3]">
          {status === "success" && `Concept ${concept.id} ready for ${channelRecord.label}.`}
          {status === "error" &&
            (briefTooShort ? "Brief is under 24 characters." : "Model timed out after 30s.")}
          {status === "idle" && "No run in progress."}
          {status === "loading" && "Rendering three concepts…"}
        </p>
      </div>

      <main className="flex min-h-0 flex-1 flex-col pb-[76px] lg:grid lg:grid-cols-[288px_minmax(0,1fr)_300px] lg:pb-0">
        <aside
          className={cn(
            "order-3 border-t border-[#1e232c] bg-[#0d1015] lg:order-1 lg:block lg:overflow-y-auto lg:border-t-0 lg:border-r",
            panel !== "inputs" && "hidden",
          )}
        >
          <div className="flex flex-col gap-4 p-3.5">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="if-brief" className="text-[12px] font-medium text-[#c3cad6]">
                  Brief
                </label>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    briefTooShort ? "text-[#ff9b8f]" : "text-[#6f7787]",
                  )}
                >
                  {brief.length}
                </span>
              </div>
              <textarea
                id="if-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={5}
                className={cn(
                  "w-full resize-y rounded-[7px] border bg-[#10141a] px-2.5 py-2 text-[12px] leading-relaxed text-[#e6e9ef] placeholder:text-[#5e6675] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff]",
                  briefTooShort ? "border-[#7f3b3b]" : "border-[#262c37]",
                )}
                placeholder="Product, promise, proof, call to action"
              />
              {briefTooShort && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[#ff9b8f]">
                  <AlertCircle className="size-3" aria-hidden />
                  Add {(24 - brief.trim().length)} more characters to generate.
                </p>
              )}
            </div>

            {(
              [
                {
                  id: "if-audience",
                  label: "Audience",
                  value: audience,
                  options: AUDIENCES,
                  onChange: (value: string) => {
                    setAudience(value as AudienceId)
                    log(`Audience set to ${value}`)
                  },
                },
                {
                  id: "if-channel",
                  label: "Channel",
                  value: channel,
                  options: CHANNELS,
                  onChange: (value: string) => {
                    setChannel(value as ChannelId)
                    log(`Channel set to ${value}`)
                  },
                },
              ] as const
            ).map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-1.5 block text-[12px] font-medium text-[#c3cad6]">
                  {field.label}
                </label>
                <select
                  id={field.id}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  className="h-8 w-full rounded-[7px] border border-[#262c37] bg-[#10141a] px-2 text-[12px] text-[#e6e9ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff]"
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
              <p id="if-tone" className="mb-1.5 text-[12px] font-medium text-[#c3cad6]">
                Tone
              </p>
              <div
                role="radiogroup"
                aria-labelledby="if-tone"
                className="grid grid-cols-3 gap-1 rounded-[7px] border border-[#262c37] bg-[#10141a] p-0.5"
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
                      "h-7 rounded-[5px] text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff]",
                      tone === item.id
                        ? "bg-[#232b38] text-white"
                        : "text-[#8a93a3] hover:bg-[#171c24] hover:text-[#c3cad6]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-[12px] font-medium text-[#c3cad6]">Visual style</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES.map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="if-style"
                      value={item.id}
                      checked={style === item.id}
                      onChange={() => {
                        setStyle(item.id as StyleId)
                        log(`Visual style set to ${item.label}`)
                      }}
                      className="peer sr-only"
                    />
                    <span className="block rounded-[7px] border border-[#262c37] bg-[#10141a] px-2 py-1.5 text-[12px] text-[#c3cad6] transition-colors hover:border-[#39414f] peer-checked:border-[#6e8bff] peer-checked:bg-[#151d33] peer-checked:text-[#a8bbff] peer-focus-visible:ring-2 peer-focus-visible:ring-[#6e8bff]">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>

        <section aria-label="Preview" className="order-1 flex min-h-0 flex-col lg:order-2">
          <div className="flex items-center gap-2 border-b border-[#1e232c] bg-[#0d1015] px-3 py-2">
            <div role="tablist" aria-label="Concept" className="flex gap-1">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6e8bff]",
                    item.id === conceptId
                      ? "bg-[#232b38] text-white"
                      : "text-[#8a93a3] hover:bg-[#171c24] hover:text-[#c3cad6]",
                  )}
                >
                  {item.id}
                  <span className="ml-1.5 hidden text-[#7b8494] sm:inline">{item.name}</span>
                </button>
              ))}
            </div>
            <span className="ml-auto font-mono text-[11px] text-[#6f7787]">{channelRecord.format}</span>
          </div>

          <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle,#1b212b_1px,transparent_1px)] [background-size:20px_20px] p-4 sm:p-8">
            <div className="w-full max-w-[400px]">
              <article
                aria-label={`Concept ${concept.id} preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-[10px] ring-1 ring-white/10"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-5 pt-4 font-mono text-[11px] opacity-80">
                  <span>hydra</span>
                  <span>{audienceRecord.note}</span>
                </header>
                <div className="px-5">
                  <h2 className="text-[26px] leading-[1.08] font-semibold tracking-tight sm:text-[32px]">
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-3 max-w-[32ch] text-[12px] leading-relaxed opacity-85">{concept.sub}</p>
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
                    className="absolute inset-0 animate-pulse bg-[#0a0c10]/80 backdrop-blur-[2px] motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-5 top-24 h-2.5 rounded bg-white/15" />
                    <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded bg-white/15" />
                    <div className="absolute inset-x-5 top-44 h-2.5 w-1/2 rounded bg-white/15" />
                  </div>
                )}
                {status === "error" && (
                  <div
                    role="alert"
                    className="absolute inset-x-4 bottom-4 flex items-start gap-2 rounded-[8px] bg-[#2a1414]/95 px-3 py-2 text-[12px] text-[#ff9b8f]"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>
                      {briefTooShort
                        ? "Generation stopped: brief under 24 characters."
                        : "Generation stopped: model timed out."}
                    </span>
                    <button
                      type="button"
                      onClick={generate}
                      className="ml-auto shrink-0 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9b8f]"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {status === "success" && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[11px] text-white">
                    <CheckCircle2 className="size-3" aria-hidden />
                    Regenerated
                  </div>
                )}
              </article>
              <p className="mt-2.5 text-center font-mono text-[11px] text-[#6f7787]">
                {styleRecord.label} · {toneRecord.label} · {audienceRecord.label}
              </p>
            </div>
          </div>
        </section>

        <div
          role="tablist"
          aria-label="Workspace panel"
          className="order-2 grid grid-cols-2 border-b border-[#1e232c] bg-[#0d1015] lg:hidden"
        >
          {(
            [
              ["inputs", "Inputs"],
              ["results", "Forecast and activity"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={panel === id}
              onClick={() => setPanel(id)}
              className={cn(
                "h-10 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6e8bff]",
                panel === id ? "text-white" : "text-[#8a93a3]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <aside
          className={cn(
            "order-3 border-t border-[#1e232c] bg-[#0d1015] lg:order-3 lg:block lg:overflow-y-auto lg:border-t-0 lg:border-l",
            panel !== "results" && "hidden",
          )}
        >
          <div className="flex flex-col gap-5 p-3.5">
            <section aria-labelledby="if-forecast">
              <h2 id="if-forecast" className="text-[12px] font-medium text-[#c3cad6]">
                Forecast
              </h2>
              <ul className="mt-2.5 flex flex-col gap-3">
                {[
                  { label: "Reach", value: formatReach(metrics.reach), pct: metrics.reach / REACH_CEILING },
                  { label: "CTR", value: formatPercent(metrics.ctr), pct: metrics.ctr / CTR_CEILING },
                  { label: "Conversion", value: formatPercent(metrics.conv), pct: metrics.conv / CONV_CEILING },
                ].map((row) => (
                  <li key={row.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[12px] text-[#8a93a3]">{row.label}</span>
                      <span className="font-mono text-[12px] tabular-nums text-[#e6e9ef]">{row.value}</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#1e232c]">
                      <div
                        className="h-full rounded-full bg-[#6e8bff] transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${Math.min(100, row.pct * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="if-activity">
              <h2 id="if-activity" className="text-[12px] font-medium text-[#c3cad6]">
                Recent activity
              </h2>
              <ol className="mt-2.5 flex flex-col gap-2">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-2 text-[12px] leading-snug">
                    <time className="shrink-0 font-mono text-[11px] text-[#5e6675] tabular-nums">
                      {entry.time}
                    </time>
                    <span className="text-[#a8b0be]">{entry.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-[#1e232c] bg-[#0d1015]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={save}
          className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-[#262c37] bg-[#12151b] px-3 text-[12px] text-[#c3cad6]"
        >
          {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => exportAs("PNG")}
          className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-[#262c37] bg-[#12151b] px-3 text-[12px] text-[#c3cad6]"
        >
          <Download className="size-3.5" aria-hidden />
          Export
        </button>
        <button
          type="button"
          onClick={generate}
          className="inline-flex h-9 items-center gap-1.5 rounded-[7px] bg-[#6e8bff] px-3 text-[12px] font-semibold text-[#0a0c10]"
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
