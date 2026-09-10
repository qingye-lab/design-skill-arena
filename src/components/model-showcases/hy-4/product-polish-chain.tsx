"use client"

import { useState } from "react"
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Loader2,
  Monitor,
  Save,
  Smartphone,
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
const CHAIN = "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable"

const TABS = [
  { id: "creative", label: "Creative" },
  { id: "forecast", label: "Forecast" },
  { id: "activity", label: "Activity" },
] as const

type TabId = (typeof TABS)[number]["id"]
type Device = "desktop" | "mobile"

export default function ProductPolishChain() {
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

  const [tab, setTab] = useState<TabId>("creative")
  const [device, setDevice] = useState<Device>("desktop")
  const [inputsOpen, setInputsOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f9fb] font-sans text-[#111827]">
      <nav aria-label="Workspace" className="flex h-12 shrink-0 items-center gap-1 border-b border-[#e5e7eb] bg-white px-3">
        <span className="mr-2 grid size-6 place-items-center rounded bg-[#111827] text-[11px] font-bold text-white">
          M
        </span>
        <div role="tablist" aria-label="Section" className="flex gap-0.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                tab === item.id
                  ? "bg-[#f3f4f6] font-medium text-[#111827]"
                  : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={inputsOpen}
          onClick={() => setInputsOpen((open) => !open)}
          className="ml-auto rounded-md border border-[#e5e7eb] px-2 py-1 text-[12px] text-[#374151] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] lg:hidden"
        >
          {inputsOpen ? "Hide inputs" : "Campaign inputs"}
        </button>
        <div className="ml-auto hidden items-center gap-1.5 lg:flex">
          <span className="rounded border border-[#e5e7eb] px-1.5 py-0.5 text-[11px] text-[#4b5563]">
            {MODEL}
          </span>
          <span className="rounded border border-[#e5e7eb] px-1.5 py-0.5 font-mono text-[11px] text-[#6b7280]">
            {CHAIN}
          </span>
        </div>
        <span className="ml-auto grid size-7 place-items-center rounded-full bg-[#e5e7eb] text-[11px] font-semibold text-[#374151] lg:ml-2">
          CD
        </span>
      </nav>

      <main className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[224px_minmax(0,1fr)_284px]">
        <aside
          className={cn(
            "shrink-0 border-r border-[#e5e7eb] bg-white p-3 lg:block lg:overflow-y-auto",
            inputsOpen ? "block" : "hidden",
          )}
        >
          <p className="px-1 text-[11px] font-medium tracking-wide text-[#9ca3af]">Campaign</p>
          <ul className="mt-1.5 flex flex-col">
            {["Brief", "Audience", "Channel", "Tone", "Visual style"].map((item) => (
              <li key={item}>
                <a
                  href={`#pp-${item.toLowerCase().replace(" ", "-")}`}
                  className="block rounded-md px-2 py-1.5 text-[13px] text-[#374151] transition-colors hover:bg-[#f3f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-[#e5e7eb] pt-3">
            <p id="pp-brief-heading" className="px-1 text-[11px] font-medium text-[#9ca3af]">
              Brief
            </p>
            <textarea
              id="pp-brief"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => log("Brief edited")}
              rows={5}
              aria-labelledby="pp-brief-heading"
              className={cn(
                "mt-1.5 w-full resize-y rounded-md border px-2 py-1.5 text-[12px] leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                briefTooShort ? "border-[#dc2626]" : "border-[#e5e7eb]",
              )}
              placeholder="Product, promise, proof, call to action"
            />
          </div>

          <div className="mt-3">
            <label htmlFor="pp-audience" className="px-1 text-[11px] font-medium text-[#9ca3af]">
              Audience
            </label>
            <select
              id="pp-audience"
              value={audience}
              onChange={(event) => {
                setAudience(event.target.value as AudienceId)
                log(`Audience set to ${event.target.value}`)
              }}
              className="mt-1.5 h-8 w-full rounded-md border border-[#e5e7eb] px-2 text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
            >
              {AUDIENCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label htmlFor="pp-channel" className="px-1 text-[11px] font-medium text-[#9ca3af]">
              Channel
            </label>
            <select
              id="pp-channel"
              value={channel}
              onChange={(event) => {
                setChannel(event.target.value as ChannelId)
                log(`Channel set to ${event.target.value}`)
              }}
              className="mt-1.5 h-8 w-full rounded-md border border-[#e5e7eb] px-2 text-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
            >
              {CHANNELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <p id="pp-tone" className="px-1 text-[11px] font-medium text-[#9ca3af]">
              Tone
            </p>
            <div role="radiogroup" aria-labelledby="pp-tone" className="mt-1.5 grid grid-cols-3 gap-1">
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
                    "h-7 rounded border text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                    tone === item.id
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-[#e5e7eb] bg-white text-[#374151] hover:border-[#d1d5db]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <fieldset className="mt-3">
            <legend id="pp-style" className="px-1 text-[11px] font-medium text-[#9ca3af]">
              Visual style
            </legend>
            <div role="radiogroup" aria-labelledby="pp-style" className="mt-1.5 grid grid-cols-2 gap-1">
              {STYLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={style === item.id}
                  onClick={() => {
                    setStyle(item.id as StyleId)
                    log(`Visual style set to ${item.label}`)
                  }}
                  className={cn(
                    "rounded border px-1.5 py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                    style === item.id
                      ? "border-[#111827] bg-[#f3f4f6] text-[#111827]"
                      : "border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#d1d5db]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
        </aside>

        <section aria-label="Workspace" className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e7eb] bg-white px-3 py-2">
            <h1 className="text-[13px] font-semibold">Concept {concept.id} · {concept.name}</h1>
            <div
              role="radiogroup"
              aria-label="Preview device"
              className="ml-auto flex overflow-hidden rounded-md border border-[#e5e7eb]"
            >
              {(
                [
                  ["desktop", Monitor, "Desktop"],
                  ["mobile", Smartphone, "Mobile"],
                ] as const
              ).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={device === id}
                  onClick={() => setDevice(id)}
                  className={cn(
                    "inline-flex h-7 items-center gap-1 px-2 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#111827]",
                    device === id ? "bg-[#111827] text-white" : "bg-white text-[#4b5563] hover:bg-[#f3f4f6]",
                  )}
                >
                  <Icon className="size-3" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "creative" && (
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-center">
                  <div
                    className={cn(
                      "w-full overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-1.5 shadow-sm",
                      device === "desktop" ? "max-w-[420px]" : "max-w-[260px]",
                    )}
                  >
                    <article
                      aria-label={`Concept ${concept.id} preview`}
                      className={cn(
                        "relative flex w-full flex-col justify-between overflow-hidden rounded-lg",
                        device === "desktop" ? "aspect-[4/5]" : "aspect-[9/16]",
                      )}
                      style={{ background: concept.palette.bg, color: concept.palette.fg }}
                    >
                      <header className="flex items-center justify-between px-4 pt-3.5 text-[10px] opacity-80">
                        <span>Hydra</span>
                        <span>{channelRecord.format}</span>
                      </header>
                      <div className="px-4">
                        <p className="text-[10px] opacity-80">{audienceRecord.note}</p>
                        <h2
                          className={cn(
                            "mt-1.5 font-semibold leading-[1.1] tracking-tight",
                            device === "desktop" ? "text-[26px]" : "text-[20px]",
                          )}
                        >
                          {concept.headline[tone]}
                        </h2>
                        <p className="mt-2 max-w-[32ch] text-[11px] leading-relaxed opacity-85">
                          {concept.sub}
                        </p>
                      </div>
                      <footer className="flex items-end justify-between px-4 pb-3.5">
                        <p className="text-[10px] opacity-75">{concept.tagline}</p>
                        <span
                          className="rounded-full px-3 py-1.5 text-[10px] font-semibold"
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
                          <div className="absolute inset-x-4 top-20 h-2.5 rounded bg-[#e5e7eb]" />
                          <div className="absolute inset-x-4 top-28 h-8 w-2/3 rounded bg-[#e5e7eb]" />
                        </div>
                      )}
                    </article>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {concepts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={item.id === conceptId}
                      onClick={() => selectConcept(item.id)}
                      className={cn(
                        "rounded-lg border p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                        item.id === conceptId
                          ? "border-[#111827] bg-white"
                          : "border-[#e5e7eb] bg-white hover:border-[#d1d5db]",
                      )}
                    >
                      <span className="block h-10 rounded" style={{ background: item.palette.bg }} aria-hidden />
                      <span className="mt-1.5 block text-[12px] font-medium">{item.id}. {item.name}</span>
                      <span className="block text-[11px] text-[#6b7280]">{item.angle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === "forecast" && (
              <div className="p-4">
                <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
                  <h2 className="text-[13px] font-semibold">Channel breakdown</h2>
                  <table className="mt-3 w-full text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                        <th scope="col" className="py-1.5 font-medium">Channel</th>
                        <th scope="col" className="py-1.5 text-right font-medium">Reach</th>
                        <th scope="col" className="py-1.5 text-right font-medium">CTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHANNELS.map((item) => {
                        const active = item.id === channel
                        return (
                          <tr
                            key={item.id}
                            className={cn("border-b border-[#f3f4f6] last:border-b-0", active && "bg-[#f9fafb]")}
                          >
                            <th scope="row" className="py-1.5 font-normal">
                              {item.label}
                              {active && <span className="ml-1 text-[11px] text-[#111827]">current</span>}
                            </th>
                            <td className="py-1.5 text-right tabular-nums">
                              {formatReach(Math.round(metrics.reach * (item.reachWeight / channelRecord.reachWeight)))}
                            </td>
                            <td className="py-1.5 text-right tabular-nums">
                              {formatPercent(metrics.ctr * (item.ctrWeight / channelRecord.ctrWeight))}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "activity" && (
              <div className="p-4">
                <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
                  <h2 className="text-[13px] font-semibold">Activity log</h2>
                  <ol className="mt-2 flex flex-col divide-y divide-[#f3f4f6]">
                    {activity.map((entry) => (
                      <li key={entry.id} className="flex gap-2 py-2 text-[12px]">
                        <time className="shrink-0 font-mono text-[#9ca3af] tabular-nums">{entry.time}</time>
                        <span className="text-[#374151]">{entry.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>

          <div aria-live="polite" className="border-t border-[#e5e7eb] bg-white px-3 py-2">
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
              <p className="text-[11px] text-[#6b7280]">Ready to export · 3 routes · brief locked</p>
            )}
            {status === "loading" && <p className="text-[11px] text-[#6b7280]">Generating…</p>}
          </div>
        </section>

        <aside className="flex flex-col gap-3 border-t border-[#e5e7eb] bg-white p-3 lg:border-t-0 lg:border-l lg:overflow-y-auto">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={save}
              className={cn(
                "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border px-2 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]",
                saved
                  ? "border-[#047857] bg-[#ecfdf5] text-[#047857]"
                  : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f3f4f6]",
              )}
            >
              {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
              {saved ? "Saved" : "Save"}
            </button>
            <div data-export-root className="relative flex-1">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={exportOpen}
                onClick={() => setExportOpen(!exportOpen)}
                className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-2 text-[12px] text-[#374151] transition-colors hover:bg-[#f3f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]"
              >
                <Download className="size-3.5" aria-hidden />
                Export
                <ChevronDown className="size-3 text-[#9ca3af]" aria-hidden />
              </button>
              {exportOpen && (
                <div
                  role="menu"
                  aria-label="Export options"
                  className="absolute right-0 bottom-full z-30 mb-1 w-40 overflow-hidden rounded-md border border-[#e5e7eb] bg-white py-1 shadow-lg"
                >
                  {["PNG", "SVG", "PDF", "Copy JSON"].map((kind) => (
                    <button
                      key={kind}
                      type="button"
                      role="menuitem"
                      onClick={() => exportAs(kind)}
                      className="block w-full px-3 py-1.5 text-left text-[12px] text-[#374151] hover:bg-[#f3f4f6] focus-visible:bg-[#f3f4f6] focus-visible:outline-none"
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
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#111827] px-2 text-[12px] font-medium text-white transition-colors hover:bg-[#1f2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2"
            >
              {status === "loading" ? (
                <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <Sparkles className="size-3.5" aria-hidden />
              )}
              {status === "loading" ? "Running" : "Generate"}
            </button>
          </div>

          <section aria-labelledby="pp-metrics">
            <h2 id="pp-metrics" className="text-[11px] font-medium text-[#9ca3af]">
              Metrics
            </h2>
            <dl className="mt-1.5 flex flex-col gap-1.5">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conversion", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-baseline justify-between rounded-md border border-[#e5e7eb] px-2 py-1.5"
                >
                  <dt className="text-[12px] text-[#6b7280]">{metric.label}</dt>
                  <dd className="text-[13px] font-semibold tabular-nums">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="pp-activity">
            <h2 id="pp-activity" className="text-[11px] font-medium text-[#9ca3af]">
              Recent activity
            </h2>
            <ol className="mt-1.5 flex flex-col gap-1">
              {activity.slice(0, 5).map((entry) => (
                <li key={entry.id} className="flex gap-2 text-[11px] text-[#4b5563]">
                  <time className="shrink-0 font-mono text-[#9ca3af] tabular-nums">{entry.time}</time>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="pp-status" className="mt-auto">
            <h2 id="pp-status" className="text-[11px] font-medium text-[#9ca3af]">
              Production status
            </h2>
            <ul className="mt-1.5 flex flex-wrap gap-1">
              {[
                ["Brief locked", "ok"],
                ["3 routes", "ok"],
                ["Legal review", "warn"],
                ["Assets ready", "ok"],
              ].map(([label, state]) => (
                <li
                  key={label}
                  className={cn(
                    "rounded border px-1.5 py-0.5 text-[11px]",
                    state === "ok"
                      ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"
                      : "border-[#fde68a] bg-[#fffbeb] text-[#b45309]",
                  )}
                >
                  {label}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>

      <footer className="hidden h-7 shrink-0 items-center gap-3 border-t border-[#e5e7eb] bg-white px-3 text-[11px] text-[#6b7280] lg:flex">
        <span>{saved ? "Draft saved just now" : "Draft saved 2 minutes ago"}</span>
        <span aria-hidden>·</span>
        <span>Concept {concept.id}</span>
        <span aria-hidden>·</span>
        <span>{channelRecord.format}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "error" ? "bg-[#dc2626]" : status === "loading" ? "bg-[#f59e0b]" : "bg-[#10b981]",
            )}
            aria-hidden
          />
          {status === "error" ? "Generation failed" : status === "loading" ? "Generating" : "Ready"}
        </span>
      </footer>
    </div>
  )
}
