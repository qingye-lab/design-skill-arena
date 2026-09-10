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
  TriangleAlert,
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
const CHAIN = "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable"

export default function MaxQualityChain() {
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

  const [panel, setPanel] = useMobilePanel<"inputs" | "stack" | "results">("inputs")

  const headlineLength = concept.headline[tone].length
  const checks = [
    { label: "Brief length", value: `${brief.trim().length} / 24`, state: briefTooShort ? "fail" : "pass" },
    { label: "Audience defined", value: audienceRecord.label, state: "pass" },
    { label: "Format matched", value: channelRecord.format, state: channel === "youtube" ? "warn" : "pass" },
    { label: "CTA verb present", value: toneRecord.cta, state: "pass" },
    {
      label: "Headline length",
      value: `${headlineLength} characters`,
      state: headlineLength > 44 ? "warn" : "pass",
    },
    {
      label: "Text contrast",
      value: concept.id === "C" ? "6.1:1" : "8.4:1",
      state: concept.id === "C" ? "warn" : "pass",
    },
    { label: "Tap target", value: "48 × 44 px", state: "pass" },
    { label: "Reduced motion", value: "honoured", state: "pass" },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-[#f4f5f7] font-sans text-[#111827]">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[#e2e5ea] bg-white px-3">
        <span className="grid size-6 place-items-center rounded bg-[#111827] text-[11px] font-bold text-white">
          M
        </span>
        <h1 className="text-[13px] font-semibold">Muse quality cockpit</h1>
        <span className="hidden text-[12px] text-[#6b7280] lg:inline">Hydra launch</span>
        <div className="ml-1 hidden items-center gap-1 xl:flex">
          <span className="rounded border border-[#e2e5ea] bg-[#f7f8fa] px-1.5 py-0.5 text-[11px] text-[#374151]">
            {MODEL}
          </span>
          <span className="rounded border border-[#e2e5ea] bg-[#f7f8fa] px-1.5 py-0.5 font-mono text-[11px] text-[#6b7280]">
            {CHAIN}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded border px-2 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
              saved
                ? "border-[#047857] bg-[#ecfdf5] text-[#047857]"
                : "border-[#e2e5ea] bg-white text-[#374151] hover:bg-[#f7f8fa]",
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
              className="inline-flex h-7 items-center gap-1 rounded border border-[#e2e5ea] bg-white px-2 text-[12px] text-[#374151] transition-colors hover:bg-[#f7f8fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
            >
              <Download className="size-3" aria-hidden />
              Export
              <ChevronDown className="size-3 text-[#9ca3af]" aria-hidden />
            </button>
            {exportOpen && (
              <div
                role="menu"
                aria-label="Export options"
                className="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded border border-[#e2e5ea] bg-white py-1 shadow-lg"
              >
                {["PNG", "PDF", "Copy JSON", "Copy checklist"].map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    role="menuitem"
                    onClick={() => exportAs(kind)}
                    className="block w-full px-2.5 py-1.5 text-left text-[12px] text-[#374151] hover:bg-[#f7f8fa] focus-visible:bg-[#f7f8fa] focus-visible:outline-none"
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
            className="inline-flex h-7 items-center gap-1 rounded bg-[#111827] px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-[#1f2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
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

      <div
        role="tablist"
        aria-label="Workspace panel"
        className="grid grid-cols-3 border-b border-[#e2e5ea] bg-white lg:hidden"
      >
        {(
          [
            ["inputs", "Inputs"],
            ["stack", "Quality stack"],
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
              "h-9 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111827]",
              panel === id ? "font-medium text-[#111827]" : "text-[#6b7280]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="flex min-h-0 flex-1 flex-col pb-[68px] lg:grid lg:grid-cols-[264px_minmax(0,1fr)_264px] lg:pb-0">
        <aside
          className={cn(
            "order-3 bg-white lg:order-1 lg:block lg:overflow-y-auto lg:border-r lg:border-[#e2e5ea]",
            panel !== "inputs" && "hidden",
          )}
        >
          <div className="flex flex-col gap-3 p-3">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="mq-brief" className="text-[12px] font-medium">
                  Brief
                </label>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    briefTooShort ? "text-[#b91c1c]" : "text-[#9ca3af]",
                  )}
                >
                  {brief.trim().length}/24
                </span>
              </div>
              <textarea
                id="mq-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={5}
                className={cn(
                  "w-full resize-y rounded border px-2 py-1.5 text-[12px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                  briefTooShort ? "border-[#dc2626] bg-[#fef2f2]" : "border-[#e2e5ea]",
                )}
                placeholder="Product, promise, proof, call to action"
              />
            </div>

            {(
              [
                {
                  id: "mq-audience",
                  label: "Audience",
                  value: audience,
                  options: AUDIENCES,
                  apply: (value: string) => {
                    setAudience(value as AudienceId)
                    log(`Audience set to ${value}`)
                  },
                },
                {
                  id: "mq-channel",
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
                <label htmlFor={field.id} className="mb-1 block text-[12px] font-medium">
                  {field.label}
                </label>
                <select
                  id={field.id}
                  value={field.value}
                  onChange={(event) => field.apply(event.target.value)}
                  className="h-8 w-full rounded border border-[#e2e5ea] bg-white px-2 text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
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
              <p id="mq-tone" className="mb-1 text-[12px] font-medium">
                Tone
              </p>
              <div
                role="radiogroup"
                aria-labelledby="mq-tone"
                className="grid grid-cols-3 gap-1 rounded border border-[#e2e5ea] bg-[#f7f8fa] p-0.5"
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
                      "h-7 rounded text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                      tone === item.id
                        ? "bg-white font-medium shadow-sm"
                        : "text-[#6b7280] hover:text-[#111827]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="mb-1 text-[12px] font-medium">Visual style</legend>
              <div className="grid grid-cols-2 gap-1">
                {STYLES.map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="mq-style"
                      value={item.id}
                      checked={style === item.id}
                      onChange={() => {
                        setStyle(item.id as StyleId)
                        log(`Visual style set to ${item.label}`)
                      }}
                      className="peer sr-only"
                    />
                    <span className="block rounded border border-[#e2e5ea] bg-white px-1.5 py-1 text-[11px] text-[#374151] transition-colors hover:border-[#d1d5db] peer-checked:border-[#111827] peer-checked:bg-[#111827] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#111827]">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>

        <section aria-label="Preview" className="order-1 flex min-h-0 flex-col lg:order-2">
          <div className="flex items-center gap-1 border-b border-[#e2e5ea] bg-white px-2">
            <div role="tablist" aria-label="Concept" className="flex">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "relative h-9 px-2.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111827]",
                    item.id === conceptId ? "text-[#111827]" : "text-[#6b7280] hover:text-[#111827]",
                  )}
                >
                  {item.id}
                  <span className="ml-1 hidden text-[#9ca3af] sm:inline">{item.name}</span>
                  {item.id === conceptId && (
                    <span className="absolute inset-x-1.5 bottom-0 h-0.5 rounded-t bg-[#111827]" aria-hidden />
                  )}
                </button>
              ))}
            </div>
            <span className="ml-auto pr-1 font-mono text-[11px] text-[#9ca3af]">
              {channelRecord.format}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-[400px]">
              <article
                aria-label={`Concept ${concept.id} preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-lg border border-[#e2e5ea] shadow-sm"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-85">
                  <span>Hydra</span>
                  <span>{concept.angle}</span>
                </header>
                <div className="px-5">
                  <p className="text-[11px] opacity-80">{audienceRecord.note}</p>
                  <h2 className="mt-1.5 text-[27px] leading-[1.08] font-semibold tracking-tight sm:text-[32px]">
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-[12px] leading-relaxed opacity-85">
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
                    className="absolute inset-0 animate-pulse bg-white/85 motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-5 top-24 h-2.5 rounded bg-[#e5e7eb]" />
                    <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded bg-[#e5e7eb]" />
                    <div className="absolute inset-x-5 top-44 h-2.5 w-1/2 rounded bg-[#e5e7eb]" />
                  </div>
                )}
              </article>
              <p className="mt-2 text-center text-[11px] text-[#6b7280]">
                {channelRecord.format} · {toneRecord.label.toLowerCase()} tone
              </p>
            </div>
          </div>

          <div aria-live="polite" className="border-t border-[#e2e5ea] bg-white px-3 py-2">
            {status === "success" && (
              <p className="flex items-center gap-1.5 text-[12px] text-[#047857]">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Concept {concept.id} regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#b91c1c]">
                <AlertCircle className="size-3.5" aria-hidden />
                {briefTooShort
                  ? "Generation failed: the brief needs at least 24 characters."
                  : "Generation failed: the model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b91c1c]"
                >
                  Retry
                </button>
              </p>
            )}
            {status === "idle" && (
              <p className="text-[11px] text-[#6b7280]">
                Eight checks run on every generation. No run since the last save.
              </p>
            )}
            {status === "loading" && (
              <p className="text-[11px] text-[#6b7280]">Generating three routes and re-running checks…</p>
            )}
          </div>
        </section>

        <div className="order-2 flex lg:contents">
          <aside
            className={cn(
              "order-3 flex-1 bg-white lg:block lg:overflow-y-auto lg:border-l lg:border-[#e2e5ea]",
              panel !== "stack" && "hidden",
            )}
          >
            <div className="p-3">
              <h2 className="text-[12px] font-medium">Quality stack</h2>
              <ul className="mt-2 flex flex-col">
                {checks.map((check) => (
                  <li
                    key={check.label}
                    className="flex items-start gap-1.5 border-b border-[#f3f4f6] py-1.5 last:border-b-0"
                  >
                    {check.state === "pass" ? (
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#047857]" aria-hidden />
                    ) : check.state === "warn" ? (
                      <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-[#b45309]" aria-hidden />
                    ) : (
                      <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-[#b91c1c]" aria-hidden />
                    )}
                    <span className="text-[12px]">
                      <span className="block text-[#111827]">{check.label}</span>
                      <span className="block text-[11px] text-[#6b7280]">{check.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <aside
            className={cn(
              "order-3 flex-1 bg-white lg:block lg:overflow-y-auto lg:border-l lg:border-[#e2e5ea]",
              panel !== "results" && "hidden",
            )}
          >
            <div className="flex flex-col gap-4 p-3">
              <section aria-labelledby="mq-metrics">
                <h2 id="mq-metrics" className="text-[12px] font-medium">
                  Metrics
                </h2>
                <ul className="mt-2 flex flex-col gap-2">
                  {[
                    { label: "Reach", value: formatReach(metrics.reach), pct: metrics.reach / REACH_CEILING },
                    { label: "CTR", value: formatPercent(metrics.ctr), pct: metrics.ctr / CTR_CEILING },
                    { label: "Conversion", value: formatPercent(metrics.conv), pct: metrics.conv / CONV_CEILING },
                  ].map((metric) => (
                    <li key={metric.label}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-[#6b7280]">{metric.label}</span>
                        <span className="text-[12px] font-semibold tabular-nums">{metric.value}</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#eef0f3]">
                        <div
                          className="h-full rounded-full bg-[#111827] transition-[width] duration-500 motion-reduce:transition-none"
                          style={{ width: `${Math.min(100, metric.pct * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="mq-activity">
                <h2 id="mq-activity" className="text-[12px] font-medium">
                  Recent activity
                </h2>
                <ol className="mt-2 flex flex-col gap-1">
                  {activity.map((entry) => (
                    <li key={entry.id} className="flex gap-1.5 text-[11px]">
                      <time className="shrink-0 font-mono text-[#9ca3af] tabular-nums">{entry.time}</time>
                      <span className="text-[#374151]">{entry.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-end gap-2 border-t border-[#e2e5ea] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={save}
          className="inline-flex h-9 items-center gap-1.5 rounded border border-[#e2e5ea] px-2.5 text-[12px] text-[#374151]"
        >
          {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => exportAs("PNG")}
          className="inline-flex h-9 items-center gap-1.5 rounded border border-[#e2e5ea] px-2.5 text-[12px] text-[#374151]"
        >
          <Download className="size-3.5" aria-hidden />
          Export
        </button>
        <button
          type="button"
          onClick={generate}
          className="inline-flex h-9 items-center gap-1.5 rounded bg-[#111827] px-3 text-[12px] font-medium text-white"
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
