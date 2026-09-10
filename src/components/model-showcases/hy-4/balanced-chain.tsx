"use client"

import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
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
  REACH_CEILING,
  CTR_CEILING,
  CONV_CEILING,
  formatReach,
  formatPercent,
} from "./campaign-data"
import { useCampaignStudio, useMobilePanel } from "./use-campaign"
import type { AudienceId, ChannelId, StyleId, ToneId } from "./campaign-data"

const MODEL = "Hy4"
const CHAIN = "frontend-app-builder + taste-skill + impeccable"

const DELTAS = [
  { label: "Reach", delta: "+6.4%", up: true },
  { label: "CTR", delta: "+0.3pt", up: true },
  { label: "Conversion", delta: "−0.2pt", up: false },
]

export default function BalancedChain() {
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
    styleRecord,
  } = useCampaignStudio()

  const [panel, setPanel] = useMobilePanel<"inputs" | "results">("inputs")

  const values = [
    { label: "Reach", value: formatReach(metrics.reach), pct: (metrics.reach / REACH_CEILING) * 100 },
    { label: "CTR", value: formatPercent(metrics.ctr), pct: (metrics.ctr / CTR_CEILING) * 100 },
    { label: "Conversion", value: formatPercent(metrics.conv), pct: (metrics.conv / CONV_CEILING) * 100 },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-[#eef1f5] font-sans text-[#16202e]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#dce2ea] bg-white px-4">
        <span className="grid size-7 place-items-center rounded-md bg-[#1f6feb] text-xs font-bold text-white">
          M
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">Muse campaign studio</h1>
          <p className="truncate text-xs text-[#64748b]">Hydra launch · Q3 flight</p>
        </div>
        <div className="ml-2 hidden items-center gap-1.5 md:flex">
          <span className="rounded border border-[#dce2ea] bg-[#f5f7fa] px-2 py-0.5 text-xs text-[#334155]">
            {MODEL}
          </span>
          <span className="rounded border border-[#dce2ea] bg-[#f5f7fa] px-2 py-0.5 font-mono text-xs text-[#64748b]">
            {CHAIN}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb] focus-visible:ring-offset-2",
              saved
                ? "border-[#16a34a] bg-[#f0fdf4] text-[#15803d]"
                : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]",
            )}
          >
            {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PNG")}
            className="hidden h-9 items-center gap-1.5 rounded-md border border-[#cbd5e1] bg-white px-2.5 text-sm text-[#334155] transition-colors hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb] focus-visible:ring-offset-2 sm:inline-flex"
          >
            <Download className="size-4" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#1f6feb] px-3 text-sm font-medium text-white transition-colors hover:bg-[#1a5fd0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb] focus-visible:ring-offset-2"
          >
            {status === "loading" ? (
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-4" aria-hidden />
            )}
            {status === "loading" ? "Generating" : "Generate"}
          </button>
        </div>
      </header>

      <section
        aria-label="Metrics"
        className="grid shrink-0 grid-cols-3 gap-px border-b border-[#dce2ea] bg-[#dce2ea]"
      >
        {values.map((metric, index) => (
          <div key={metric.label} className="bg-white px-4 py-3">
            <p className="text-xs text-[#64748b]">{metric.label}</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <p className="text-xl font-semibold tabular-nums">{metric.value}</p>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11px]",
                  DELTAS[index].up ? "text-[#15803d]" : "text-[#b45309]",
                )}
              >
                {DELTAS[index].up ? (
                  <ArrowUpRight className="size-3" aria-hidden />
                ) : (
                  <ArrowDownRight className="size-3" aria-hidden />
                )}
                {DELTAS[index].delta}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e9eef4]">
              <div
                className="h-full rounded-full bg-[#1f6feb] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${Math.min(100, metric.pct)}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      <main className="flex min-h-0 flex-1 flex-col pb-[72px] lg:grid lg:grid-cols-[272px_minmax(0,1fr)_288px] lg:pb-0">
        <aside
          className={cn(
            "order-3 bg-white lg:order-1 lg:block lg:overflow-y-auto lg:border-r lg:border-[#dce2ea]",
            panel !== "inputs" && "hidden",
          )}
        >
          <div className="flex flex-col gap-4 p-4">
            <div>
              <label htmlFor="bc-brief" className="mb-1.5 block text-sm font-medium">
                Campaign brief
              </label>
              <textarea
                id="bc-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={6}
                className={cn(
                  "w-full resize-y rounded-md border px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]",
                  briefTooShort ? "border-[#dc2626]" : "border-[#cbd5e1]",
                )}
                placeholder="Product, promise, proof, call to action"
              />
              {briefTooShort && (
                <p className="mt-1 text-xs text-[#dc2626]">
                  Add {24 - brief.trim().length} more characters to generate.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bc-audience" className="mb-1.5 block text-sm font-medium">
                Audience
              </label>
              <select
                id="bc-audience"
                value={audience}
                onChange={(event) => {
                  setAudience(event.target.value as AudienceId)
                  log(`Audience set to ${event.target.value}`)
                }}
                className="h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]"
              >
                {AUDIENCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[#64748b]">{audienceRecord.note}</p>
            </div>

            <div>
              <label htmlFor="bc-channel" className="mb-1.5 block text-sm font-medium">
                Channel
              </label>
              <select
                id="bc-channel"
                value={channel}
                onChange={(event) => {
                  setChannel(event.target.value as ChannelId)
                  log(`Channel set to ${event.target.value}`)
                }}
                className="h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]"
              >
                {CHANNELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p id="bc-tone" className="mb-1.5 text-sm font-medium">
                Tone
              </p>
              <div
                role="radiogroup"
                aria-labelledby="bc-tone"
                className="grid grid-cols-3 gap-1 rounded-md border border-[#cbd5e1] bg-[#f1f5f9] p-0.5"
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
                      "h-8 rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb]",
                      tone === item.id
                        ? "bg-white font-medium shadow-sm"
                        : "text-[#64748b] hover:text-[#16202e]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium">Visual style</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES.map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="bc-style"
                      value={item.id}
                      checked={style === item.id}
                      onChange={() => {
                        setStyle(item.id as StyleId)
                        log(`Visual style set to ${item.label}`)
                      }}
                      className="peer sr-only"
                    />
                    <span className="block rounded-md border border-[#cbd5e1] bg-white px-2 py-1.5 text-xs text-[#334155] transition-colors hover:border-[#94a3b8] peer-checked:border-[#1f6feb] peer-checked:bg-[#eaf2fe] peer-checked:text-[#1d4ed8] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1f6feb]">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>

        <section aria-label="Preview" className="order-1 flex min-h-0 flex-col lg:order-2">
          <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-[420px]">
              <article
                aria-label={`Concept ${concept.id} preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-lg shadow-[0_10px_40px_rgba(15,23,42,0.14)]"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-6 pt-5 text-[11px] opacity-85">
                  <span>Hydra</span>
                  <span>{channelRecord.format}</span>
                </header>
                <div className="px-6">
                  <p className="text-[11px] opacity-80">{audienceRecord.note}</p>
                  <h2 className="mt-2 text-3xl leading-[1.08] font-semibold tracking-tight sm:text-[34px]">
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-sm leading-relaxed opacity-85">{concept.sub}</p>
                </div>
                <footer className="flex items-end justify-between px-6 pb-5">
                  <p className="text-xs opacity-75">{concept.tagline}</p>
                  <span
                    className="rounded-full px-3.5 py-2 text-xs font-semibold"
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
                    <div className="absolute inset-x-6 top-28 h-3 rounded bg-[#cbd5e1]" />
                    <div className="absolute inset-x-6 top-36 h-9 w-2/3 rounded bg-[#cbd5e1]" />
                    <div className="absolute inset-x-6 top-48 h-3 w-1/2 rounded bg-[#cbd5e1]" />
                  </div>
                )}
              </article>
              <p className="mt-3 text-center text-xs text-[#64748b]">
                {styleRecord.label} · {toneRecord.label} · {audienceRecord.label}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {concepts.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === conceptId}
                    onClick={() => selectConcept(item.id)}
                    className={cn(
                      "overflow-hidden rounded-md border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f6feb] focus-visible:ring-offset-2",
                      item.id === conceptId
                        ? "border-[#1f6feb] ring-1 ring-[#1f6feb]"
                        : "border-[#cbd5e1] hover:border-[#94a3b8]",
                    )}
                  >
                    <span
                      className="block h-14 w-full"
                      style={{ background: item.palette.bg }}
                      aria-hidden
                    />
                    <span className="block bg-white px-2 py-1.5">
                      <span className="block text-xs font-medium">{item.id}. {item.name}</span>
                      <span className="block truncate text-[11px] text-[#64748b]">{item.angle}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div aria-live="polite" className="border-t border-[#dce2ea] bg-white px-4 py-2">
            {status === "success" && (
              <p className="flex items-center gap-1.5 text-sm text-[#15803d]">
                <CheckCircle2 className="size-4" aria-hidden />
                Concept {concept.id} regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 text-sm text-[#dc2626]">
                <AlertCircle className="size-4" aria-hidden />
                {briefTooShort
                  ? "Generation failed: the brief needs at least 24 characters."
                  : "Generation failed: the model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]"
                >
                  Retry
                </button>
              </p>
            )}
            {status === "idle" && (
              <p className="text-xs text-[#64748b]">Balanced chain: layout, taste and polish together.</p>
            )}
            {status === "loading" && <p className="text-xs text-[#64748b]">Generating three routes…</p>}
          </div>
        </section>

        <div
          role="tablist"
          aria-label="Workspace panel"
          className="order-2 grid grid-cols-2 border-b border-[#dce2ea] bg-white lg:hidden"
        >
          {(
            [
              ["inputs", "Inputs"],
              ["results", "Activity"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={panel === id}
              onClick={() => setPanel(id)}
              className={cn(
                "h-11 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1f6feb]",
                panel === id ? "font-medium text-[#1f6feb]" : "text-[#64748b]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <aside
          className={cn(
            "order-3 bg-white lg:order-3 lg:block lg:overflow-y-auto lg:border-l lg:border-[#dce2ea]",
            panel !== "results" && "hidden",
          )}
        >
          <div className="flex flex-col gap-5 p-4">
            <section aria-labelledby="bc-timeline">
              <h2 id="bc-timeline" className="text-sm font-semibold">
                Campaign timeline
              </h2>
              <ol className="mt-2 flex flex-col gap-2">
                {(
                  [
                    ["Brief locked", "Tue 09:20", true],
                    ["Concepts generated", "Tue 09:42", true],
                    ["Legal review", "Thu 14:00", false],
                    ["Flight goes live", "Mon 06:00", false],
                  ] as const
                ).map(([label, time, done]) => (
                  <li key={label} className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        done ? "bg-[#16a34a]" : "bg-[#cbd5e1]",
                      )}
                      aria-hidden
                    />
                    <span className={done ? "text-[#16202e]" : "text-[#64748b]"}>{label}</span>
                    <span className="ml-auto text-[#94a3b8]">{time}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="bc-activity">
              <h2 id="bc-activity" className="text-sm font-semibold">
                Recent activity
              </h2>
              <ol className="mt-2 flex flex-col divide-y divide-[#eef2f7]">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-2 py-1.5 text-xs">
                    <time className="shrink-0 font-mono text-[#94a3b8] tabular-nums">{entry.time}</time>
                    <span className="text-[#334155]">{entry.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-[#dce2ea] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={save}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#cbd5e1] px-3 text-sm text-[#334155]"
        >
          {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => exportAs("PNG")}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#cbd5e1] px-3 text-sm text-[#334155]"
        >
          <Download className="size-4" aria-hidden />
          Export
        </button>
        <button
          type="button"
          onClick={generate}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#1f6feb] px-3 text-sm font-medium text-white"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <Sparkles className="size-4" aria-hidden />
          )}
          {status === "loading" ? "Generating" : "Generate"}
        </button>
      </div>
    </div>
  )
}
