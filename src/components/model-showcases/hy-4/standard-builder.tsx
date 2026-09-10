"use client"

import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
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
const CHAIN = "frontend-app-builder"

export default function StandardBuilder() {
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

  const [mobilePanel, setMobilePanel] = useMobilePanel<"inputs" | "insights">("inputs")

  const bars = [
    { label: "Reach", value: formatReach(metrics.reach), pct: (metrics.reach / REACH_CEILING) * 100, note: "estimated impressions" },
    { label: "CTR", value: formatPercent(metrics.ctr), pct: (metrics.ctr / CTR_CEILING) * 100, note: "click-through rate" },
    { label: "Conversion", value: formatPercent(metrics.conv), pct: (metrics.conv / CONV_CEILING) * 100, note: "pre-orders per click" },
  ]

  const actions = (
    <>
      <button
        type="button"
        onClick={save}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
          saved
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
        )}
      >
        {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
        {saved ? "Saved" : "Save"}
      </button>

      <div data-export-root className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={exportOpen}
          onClick={() => setExportOpen(!exportOpen)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <Download className="size-4" aria-hidden />
          Export
          <ChevronDown className="size-3.5 text-slate-400" aria-hidden />
        </button>
        {exportOpen && (
          <div
            role="menu"
            aria-label="Export options"
            className="absolute right-0 bottom-full z-30 mb-1 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg lg:top-full lg:bottom-auto lg:mt-1 lg:mb-0"
          >
            {["PNG 1080×1350", "PDF one-pager", "Copy campaign JSON"].map((kind) => (
              <button
                key={kind}
                type="button"
                role="menuitem"
                onClick={() => exportAs(kind)}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
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
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-slate-900 px-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
      >
        {status === "loading" ? (
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
        ) : (
          <Sparkles className="size-4" aria-hidden />
        )}
        {status === "loading" ? "Generating" : "Generate"}
      </button>
    </>
  )

  return (
    <div className="flex min-h-dvh flex-col bg-slate-100 font-sans text-slate-900">
      <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
        <span className="grid size-7 place-items-center rounded bg-slate-900 text-sm font-semibold text-white">
          M
        </span>
        <h1 className="truncate text-sm font-semibold tracking-tight">Muse · Standard Builder</h1>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
            {MODEL}
          </span>
          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-600">
            {CHAIN}
          </span>
        </div>
        <div className="ml-auto hidden items-center gap-2 lg:flex">{actions}</div>
      </header>

      <div role="status" aria-live="polite">
        {status === "success" && (
          <div className="flex items-center gap-2 border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            <CheckCircle2 className="size-4" aria-hidden />
            Concept {concept.id} regenerated. Forecast updated for {channelRecord.label}.
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-wrap items-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            <AlertCircle className="size-4" aria-hidden />
            {briefTooShort
              ? `Generation failed: the brief needs at least 24 characters.`
              : "Generation failed: the model timed out."}
            <button
              type="button"
              onClick={generate}
              className="font-medium underline underline-offset-2 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <main className="flex min-h-0 flex-1 flex-col pb-20 lg:grid lg:grid-cols-[300px_minmax(0,1fr)_300px] lg:pb-0">
        <aside
          className={cn(
            "order-3 bg-white lg:order-1 lg:block lg:overflow-y-auto lg:border-r lg:border-slate-200",
            mobilePanel !== "inputs" && "hidden",
          )}
        >
          <div className="flex flex-col gap-5 p-4">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="sb-brief" className="text-sm font-medium text-slate-800">
                  Campaign brief
                </label>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    briefTooShort ? "text-red-600" : "text-slate-500",
                  )}
                >
                  {brief.length} chars
                </span>
              </div>
              <textarea
                id="sb-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={6}
                className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                placeholder="Describe the product, the promise and the call to action"
              />
            </div>

            <div>
              <label htmlFor="sb-audience" className="mb-1.5 block text-sm font-medium text-slate-800">
                Audience
              </label>
              <select
                id="sb-audience"
                value={audience}
                onChange={(event) => {
                  setAudience(event.target.value as AudienceId)
                  log(`Audience set to ${event.target.value}`)
                }}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-900 focus-visible:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
              >
                {AUDIENCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sb-channel" className="mb-1.5 block text-sm font-medium text-slate-800">
                Channel
              </label>
              <select
                id="sb-channel"
                value={channel}
                onChange={(event) => {
                  setChannel(event.target.value as ChannelId)
                  log(`Channel set to ${event.target.value}`)
                }}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-900 focus-visible:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
              >
                {CHANNELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p id="sb-tone" className="mb-1.5 text-sm font-medium text-slate-800">
                Tone
              </p>
              <div
                role="radiogroup"
                aria-labelledby="sb-tone"
                className="grid grid-cols-3 gap-1 rounded-md border border-slate-300 bg-slate-100 p-0.5"
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
                      "h-8 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                      tone === item.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-slate-800">Visual style</legend>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map((item) => (
                  <label key={item.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="sb-style"
                      value={item.id}
                      checked={style === item.id}
                      onChange={() => {
                        setStyle(item.id as StyleId)
                        log(`Visual style set to ${item.label}`)
                      }}
                      className="peer sr-only"
                    />
                    <span className="block rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm font-medium text-slate-800 transition-colors hover:border-slate-400 peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-slate-900 peer-focus-visible:ring-offset-2">
                      {item.label}
                      <span className="mt-0.5 block text-xs font-normal opacity-70">{item.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>

        <div className="order-1 flex min-h-0 flex-col border-b border-slate-200 bg-white lg:order-2 lg:border-b-0 lg:bg-transparent">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4">
            <div role="tablist" aria-label="Creative concept" className="flex">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "relative h-11 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900",
                    item.id === conceptId
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  Concept {item.id}
                  <span className="ml-1.5 hidden text-slate-400 sm:inline">{item.name}</span>
                  {item.id === conceptId && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-slate-900" aria-hidden />
                  )}
                </button>
              ))}
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">{channelRecord.format}</span>
          </div>

          <div
            className="flex flex-1 items-center justify-center p-4 sm:p-8"
            style={{
              backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            <div className="w-full max-w-[420px]">
              <article
                aria-label={`Concept ${concept.id} ad preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-lg ring-1 ring-slate-900/10"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-6 pt-5 text-[11px] font-medium tracking-wide opacity-90">
                  <span>Hydra</span>
                  <span>{channelRecord.format}</span>
                </header>

                <div className="px-6">
                  <p className="text-[11px] font-medium tracking-wide opacity-80">{audienceRecord.note}</p>
                  <h2
                    className={cn(
                      "mt-2 font-bold tracking-tight",
                      style === "bold" ? "text-4xl sm:text-[2.6rem]" : "text-3xl sm:text-4xl",
                    )}
                  >
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-sm leading-relaxed opacity-90">{concept.sub}</p>
                </div>

                <footer className="flex items-end justify-between px-6 pb-5">
                  <p className="text-xs opacity-80">{concept.tagline}</p>
                  <span
                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ background: concept.palette.fg, color: concept.palette.deep }}
                  >
                    {toneRecord.cta}
                  </span>
                </footer>

                {status === "loading" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.55)_30%,rgba(255,255,255,0.85)_50%,rgba(255,255,255,0.55)_70%)] backdrop-blur-[2px] motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-6 top-20 h-3 rounded bg-slate-400/70" />
                    <div className="absolute inset-x-6 top-28 h-9 w-2/3 rounded bg-slate-400/70" />
                    <div className="absolute inset-x-6 top-40 h-3 w-1/2 rounded bg-slate-400/70" />
                  </div>
                )}
              </article>
              <p className="mt-3 text-center text-xs text-slate-500">
                {styleRecord.label} · {toneRecord.label} · {audienceRecord.label}
              </p>
            </div>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Workspace panel"
          className="order-2 grid grid-cols-2 border-b border-slate-200 bg-white lg:hidden"
        >
          {(
            [
              ["inputs", "Inputs"],
              ["insights", "Forecast and activity"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mobilePanel === id}
              onClick={() => setMobilePanel(id)}
              className={cn(
                "relative h-11 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900",
                mobilePanel === id ? "text-slate-900" : "text-slate-500",
              )}
            >
              {label}
              {mobilePanel === id && (
                <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-t bg-slate-900" aria-hidden />
              )}
            </button>
          ))}
        </div>

        <aside
          className={cn(
            "order-3 bg-white lg:order-3 lg:block lg:overflow-y-auto lg:border-l lg:border-slate-200",
            mobilePanel !== "insights" && "hidden",
          )}
        >
          <div className="flex flex-col gap-6 p-4">
            <section aria-labelledby="sb-forecast">
              <h2 id="sb-forecast" className="mb-3 text-sm font-semibold text-slate-900">
                Forecast
              </h2>
              <ul className="flex flex-col gap-3">
                {bars.map((bar) => (
                  <li key={bar.label}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-slate-700">{bar.label}</span>
                      <span className="text-sm font-semibold tabular-nums text-slate-900">{bar.value}</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${Math.min(100, bar.pct)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{bar.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Concept {concept.id} · {channelRecord.label} · {audienceRecord.label}
              </p>
            </section>

            <section aria-labelledby="sb-activity">
              <h2 id="sb-activity" className="mb-3 text-sm font-semibold text-slate-900">
                Recent activity
              </h2>
              <ol className="flex flex-col divide-y divide-slate-100">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex gap-3 py-2 text-sm">
                    <time className="shrink-0 font-mono text-xs leading-5 text-slate-500 tabular-nums">
                      {entry.time}
                    </time>
                    <span className="text-slate-800">{entry.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </aside>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        {actions}
      </div>
    </div>
  )
}
