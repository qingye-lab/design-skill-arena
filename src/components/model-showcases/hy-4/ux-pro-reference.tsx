"use client"

import { useState } from "react"
import {
  AlertCircle,
  AlertTriangle,
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
const CHAIN = "ui-ux-pro-max"

const STEPS = [
  { id: "brief", label: "Brief" },
  { id: "audience", label: "Audience" },
  { id: "concepts", label: "Concepts" },
  { id: "review", label: "Review" },
] as const

type StepId = (typeof STEPS)[number]["id"]

export default function UxProReference() {
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

  const [step, setStep] = useState<StepId>("brief")
  const [overlays, setOverlays] = useState({ safe: true, contrast: false, taps: false })

  const checks = [
    {
      label: "Brief is long enough to generate",
      state: briefTooShort ? "fail" : "pass",
      detail: briefTooShort ? `${brief.trim().length} of 24 characters` : `${brief.trim().length} characters`,
    },
    {
      label: "Audience selected",
      state: "pass",
      detail: audienceRecord.label,
    },
    {
      label: "Format matches the channel",
      state: "pass",
      detail: channelRecord.format,
    },
    {
      label: "Call to action is present",
      state: "pass",
      detail: toneRecord.cta,
    },
    {
      label: "Text contrast clears 4.5:1",
      state: concept.id === "C" ? "warn" : "pass",
      detail: concept.id === "C" ? "6.1:1 on the lower third" : "8.4:1 across the plate",
    },
    {
      label: "Headline fits two lines at 4:5",
      state: tone === "premium" && channel === "tiktok" ? "warn" : "pass",
      detail: tone === "premium" && channel === "tiktok" ? "Likely to wrap on small screens" : "Fits at 320 px",
    },
  ] as const

  const blocked = briefTooShort

  return (
    <div className="flex min-h-dvh flex-col bg-[#f6f8f9] font-sans text-[#0f172a]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e2e8ec] bg-white px-4">
        <span className="grid size-7 place-items-center rounded-md bg-[#0b6e7a] text-xs font-bold text-white">
          M
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">Muse campaign studio</h1>
          <p className="truncate text-xs text-[#64748b]">Hydra launch · review flow</p>
        </div>
        <div className="ml-auto hidden items-center gap-1.5 sm:flex">
          <span className="rounded-full bg-[#e6f4f5] px-2 py-0.5 text-xs font-medium text-[#0b6e7a]">
            {MODEL}
          </span>
          <span className="rounded-full bg-[#eef2f4] px-2 py-0.5 font-mono text-xs text-[#475569]">
            {CHAIN}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:ml-3">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a] focus-visible:ring-offset-2",
              saved
                ? "border-[#0b6e7a] bg-[#e6f4f5] text-[#0b6e7a]"
                : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f1f5f9]",
            )}
          >
            {saved ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PNG")}
            className="hidden h-9 items-center gap-1.5 rounded-md border border-[#cbd5e1] bg-white px-2.5 text-sm font-medium text-[#334155] transition-colors hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a] focus-visible:ring-offset-2 md:inline-flex"
          >
            <Download className="size-4" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            disabled={status === "loading"}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0b6e7a] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#095a63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a] focus-visible:ring-offset-2 disabled:cursor-progress disabled:opacity-80"
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

      <nav aria-label="Flow" className="shrink-0 border-b border-[#e2e8ec] bg-white px-2 sm:px-4">
        <ol className="flex items-center gap-1 overflow-x-auto py-2">
          {STEPS.map((item, index) => (
            <li key={item.id} className="flex items-center gap-1">
              {index > 0 && <span className="px-1 text-[#cbd5e1]" aria-hidden>/</span>}
              <button
                type="button"
                aria-current={step === item.id ? "step" : undefined}
                onClick={() => setStep(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a]",
                  step === item.id
                    ? "bg-[#0b6e7a] text-white"
                    : "text-[#475569] hover:bg-[#f1f5f9]",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[11px] font-semibold",
                    step === item.id ? "bg-white/25" : "bg-[#e2e8ec] text-[#475569]",
                  )}
                >
                  {index + 1}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-[300px_minmax(0,1fr)_300px] lg:gap-4">
        <section
          aria-label="Step details"
          className="rounded-lg border border-[#e2e8ec] bg-white p-4 lg:overflow-y-auto"
        >
          {step === "brief" && (
            <div>
              <h2 className="text-sm font-semibold">Brief</h2>
              <p className="mt-1 text-xs text-[#64748b]">
                Say what is launching, what makes it worth attention, and what the reader should do.
              </p>
              <label htmlFor="ux-brief" className="mt-3 block text-sm font-medium">
                Campaign brief
              </label>
              <textarea
                id="ux-brief"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                onBlur={() => log("Brief edited")}
                rows={9}
                aria-invalid={briefTooShort}
                aria-describedby="ux-brief-help"
                className={cn(
                  "mt-1.5 w-full resize-y rounded-md border px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a]",
                  briefTooShort ? "border-[#dc2626] bg-[#fef2f2]" : "border-[#cbd5e1] bg-white",
                )}
                placeholder="Product, promise, proof, call to action"
              />
              <p
                id="ux-brief-help"
                className={cn("mt-1.5 text-xs", briefTooShort ? "text-[#dc2626]" : "text-[#64748b]")}
              >
                {briefTooShort
                  ? `Add ${24 - brief.trim().length} more characters. Generation is blocked until then.`
                  : `${brief.trim().length} characters. Enough detail to generate.`}
              </p>
            </div>
          )}

          {step === "audience" && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-semibold">Audience</h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  Pick the group the promise is written for. This changes the line above the headline.
                </p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {AUDIENCES.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2 rounded-md border border-[#e2e8ec] px-2.5 py-2 hover:border-[#94a3b8] focus-within:ring-2 focus-within:ring-[#0b6e7a]"
                    >
                      <input
                        type="radio"
                        name="ux-audience"
                        value={item.id}
                        checked={audience === item.id}
                        onChange={() => {
                          setAudience(item.id as AudienceId)
                          log(`Audience set to ${item.label}`)
                        }}
                        className="mt-0.5 size-4 accent-[#0b6e7a]"
                      />
                      <span>
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="block text-xs text-[#64748b]">{item.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="ux-channel" className="text-sm font-medium">
                  Channel
                </label>
                <select
                  id="ux-channel"
                  value={channel}
                  onChange={(event) => {
                    setChannel(event.target.value as ChannelId)
                    log(`Channel set to ${event.target.value}`)
                  }}
                  className="mt-1.5 h-9 w-full rounded-md border border-[#cbd5e1] bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a]"
                >
                  {CHANNELS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-[#64748b]">{channelRecord.format}</p>
              </div>
            </div>
          )}

          {step === "concepts" && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-semibold">Concepts</h2>
                <p className="mt-1 text-xs text-[#64748b]">
                  Three routes from the same brief. Switch to compare wording and angle.
                </p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {concepts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={item.id === conceptId}
                      onClick={() => selectConcept(item.id)}
                      className={cn(
                        "rounded-md border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a]",
                        item.id === conceptId
                          ? "border-[#0b6e7a] bg-[#e6f4f5]"
                          : "border-[#e2e8ec] hover:border-[#94a3b8]",
                      )}
                    >
                      <span className="block text-sm font-medium">
                        {item.id}. {item.name}
                      </span>
                      <span className="block text-xs text-[#64748b]">{item.angle}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p id="ux-tone" className="text-sm font-medium">
                  Tone
                </p>
                <div role="radiogroup" aria-labelledby="ux-tone" className="mt-1.5 grid grid-cols-3 gap-1.5">
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
                        "h-8 rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a]",
                        tone === item.id
                          ? "border-[#0b6e7a] bg-[#0b6e7a] text-white"
                          : "border-[#cbd5e1] bg-white text-[#334155] hover:border-[#94a3b8]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div>
              <h2 className="text-sm font-semibold">Review</h2>
              <p className="mt-1 text-xs text-[#64748b]">
                Six checks run on the current combination. Fix anything marked before you export.
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {checks.map((check) => (
                  <li key={check.label} className="flex items-start gap-2 text-sm">
                    {check.state === "pass" ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#0f766e]" aria-hidden />
                    ) : check.state === "warn" ? (
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#b45309]" aria-hidden />
                    ) : (
                      <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#dc2626]" aria-hidden />
                    )}
                    <span>
                      <span className="block">{check.label}</span>
                      <span className="block text-xs text-[#64748b]">{check.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <fieldset className="mt-4">
                <legend className="text-sm font-medium">Visual style</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5">
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
                        "rounded-md border px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6e7a]",
                        style === item.id
                          ? "border-[#0b6e7a] bg-[#e6f4f5] text-[#0b6e7a]"
                          : "border-[#cbd5e1] bg-white text-[#334155] hover:border-[#94a3b8]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}
        </section>

        <section aria-label="Preview" className="flex min-h-0 flex-col rounded-lg border border-[#e2e8ec] bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e2e8ec] px-3 py-2">
            <h2 className="text-sm font-semibold">Preview</h2>
            <div className="ml-auto flex flex-wrap gap-1.5">
              {(
                [
                  ["safe", "Safe area"],
                  ["contrast", "Contrast"],
                  ["taps", "Tap targets"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e2e8ec] px-2 py-1 text-xs hover:border-[#94a3b8] focus-within:ring-2 focus-within:ring-[#0b6e7a]"
                >
                  <input
                    type="checkbox"
                    checked={overlays[key]}
                    onChange={(event) => setOverlays({ ...overlays, [key]: event.target.checked })}
                    className="size-3.5 accent-[#0b6e7a]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center bg-[#eef2f4] p-4 sm:p-6">
            <div className="relative w-full max-w-[380px]">
              <article
                aria-label={`Concept ${concept.id} preview`}
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden rounded-md"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-80">
                  <span>Hydra</span>
                  <span>{channelRecord.format}</span>
                </header>
                <div className="px-5">
                  <p className="text-[11px] opacity-80">{audienceRecord.note}</p>
                  <h3 className="mt-1.5 text-2xl leading-[1.1] font-semibold tracking-tight sm:text-[28px]">
                    {concept.headline[tone]}
                  </h3>
                  <p className="mt-2.5 max-w-[34ch] text-xs leading-relaxed opacity-85">{concept.sub}</p>
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

                {overlays.safe && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-3 rounded-sm border border-dashed border-white/70"
                  >
                    <span className="absolute -top-2 left-0 bg-white/85 px-1 text-[9px] font-medium text-[#0f172a]">
                      safe area
                    </span>
                  </div>
                )}
                {overlays.contrast && (
                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <span className="absolute top-8 left-3 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-[#0f172a]">
                      8.4:1
                    </span>
                    <span className="absolute bottom-16 left-3 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-[#0f172a]">
                      6.1:1
                    </span>
                  </div>
                )}
                {overlays.taps && (
                  <div aria-hidden className="pointer-events-none absolute inset-0">
                    <span className="absolute right-4 bottom-3 rounded border-2 border-dashed border-[#f97316] px-2 py-1 text-[10px] font-semibold text-white">
                      44 × 44 min
                    </span>
                  </div>
                )}

                {status === "loading" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-white/85 motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-5 top-24 h-2.5 rounded bg-[#cbd5e1]" />
                    <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded bg-[#cbd5e1]" />
                    <div className="absolute inset-x-5 top-44 h-2.5 w-1/2 rounded bg-[#cbd5e1]" />
                  </div>
                )}
              </article>
              <p className="mt-2 text-center text-xs text-[#64748b]">
                Concept {concept.id} · {concept.angle.toLowerCase()}
              </p>
            </div>
          </div>

          <div aria-live="polite" className="border-t border-[#e2e8ec] px-3 py-2">
            {status === "success" && (
              <p className="flex items-center gap-1.5 text-sm text-[#0f766e]">
                <CheckCircle2 className="size-4" aria-hidden />
                Concept {concept.id} regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 text-sm text-[#dc2626]">
                <AlertCircle className="size-4" aria-hidden />
                {blocked
                  ? "Generation blocked: the brief needs at least 24 characters."
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
              <p className="text-xs text-[#64748b]">
                Run a generation to refresh the forecast and the activity list.
              </p>
            )}
            {status === "loading" && <p className="text-xs text-[#64748b]">Rendering concepts…</p>}
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:overflow-y-auto">
          <section aria-labelledby="ux-metrics" className="rounded-lg border border-[#e2e8ec] bg-white p-4">
            <h2 id="ux-metrics" className="text-sm font-semibold">
              Simulated metrics
            </h2>
            <dl className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conv", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div key={metric.label} className="rounded-md bg-[#f1f5f9] px-2 py-2 text-center">
                  <dt className="text-[11px] text-[#64748b]">{metric.label}</dt>
                  <dd className="text-sm font-semibold tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-[#64748b]">
              Modelled for {audienceRecord.label.toLowerCase()} on {channelRecord.label.toLowerCase()}.
            </p>
          </section>

          <section aria-labelledby="ux-activity" className="rounded-lg border border-[#e2e8ec] bg-white p-4">
            <h2 id="ux-activity" className="text-sm font-semibold">
              Recent activity
            </h2>
            <ol className="mt-2 flex flex-col divide-y divide-[#eef2f4]">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-2 py-1.5 text-xs">
                  <time className="shrink-0 font-mono text-[#94a3b8] tabular-nums">{entry.time}</time>
                  <span className="text-[#334155]">{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="ux-notes" className="rounded-lg border border-[#e2e8ec] bg-white p-4">
            <h2 id="ux-notes" className="text-sm font-semibold">
              Accessibility notes
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-xs text-[#475569]">
              <li>Every control is reachable with Tab and shows a visible focus ring.</li>
              <li>The concept switcher uses pressed state and keeps its label in the accessible name.</li>
              <li>Status messages are announced through a polite live region.</li>
              <li>Motion respects the reduced-motion setting.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  )
}
