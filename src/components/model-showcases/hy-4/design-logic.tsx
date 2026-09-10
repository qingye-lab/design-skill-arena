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
const CHAIN = "frontend-design"

const STEPS = [
  { id: "brief", label: "Brief" },
  { id: "audience", label: "Audience" },
  { id: "channel", label: "Channel" },
  { id: "style", label: "Style" },
] as const

export default function DesignLogic() {
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
    <div className="min-h-dvh bg-[#f3f0ea] px-4 font-sans text-[#16150f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="border-b border-[#16150f]/15 py-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-serif text-2xl leading-none tracking-tight sm:text-3xl">
              Muse campaign studio
            </h1>
            <p className="text-xs text-[#16150f]/60">
              {MODEL} with {CHAIN}. Hydra launch, spring flight.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#16150f]/15 pt-3">
            <div className="flex gap-1">
              {concepts.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "px-3 py-1 font-serif text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16150f]",
                    item.id === conceptId
                      ? "bg-[#16150f] text-[#f3f0ea]"
                      : "text-[#16150f]/60 hover:text-[#16150f]",
                  )}
                >
                  {["I", "II", "III"][index]}
                  <span className="sr-only">Concept {item.id}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={save}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 px-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16150f]",
                  saved ? "text-[#1c6b45]" : "text-[#16150f]/70 hover:text-[#16150f]",
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
                  className="inline-flex h-8 items-center gap-1.5 px-2.5 text-xs text-[#16150f]/70 transition-colors hover:text-[#16150f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16150f]"
                >
                  <Download className="size-3.5" aria-hidden />
                  Export
                </button>
                {exportOpen && (
                  <div
                    role="menu"
                    aria-label="Export options"
                    className="absolute right-0 top-full z-30 mt-1 w-40 border border-[#16150f]/25 bg-[#f3f0ea] py-1 shadow-md"
                  >
                    {["PNG plate", "PDF proof", "Copy JSON"].map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        role="menuitem"
                        onClick={() => exportAs(kind)}
                        className="block w-full px-3 py-1.5 text-left text-xs hover:bg-[#16150f]/8 focus-visible:bg-[#16150f]/8 focus-visible:outline-none"
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
                className="inline-flex h-8 items-center gap-1.5 border border-[#16150f] bg-[#16150f] px-3 text-xs text-[#f3f0ea] transition-colors hover:bg-transparent hover:text-[#16150f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16150f] focus-visible:ring-offset-2"
              >
                {status === "loading" ? (
                  <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                ) : (
                  <Sparkles className="size-3.5" aria-hidden />
                )}
                {status === "loading" ? "Setting type" : "Generate"}
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-0 lg:grid-cols-[minmax(0,168px)_minmax(0,1fr)_minmax(0,240px)]">
          <nav
            aria-label="Sequence"
            className="order-2 border-[#16150f]/15 py-6 lg:order-1 lg:border-r lg:pr-6"
          >
            <ol className="flex flex-col">
              {STEPS.map((step, index) => (
                <li
                  key={step.id}
                  className="border-b border-[#16150f]/15 py-3 first:border-t first:border-t-[#16150f]/15"
                >
                  <span className="font-mono text-[11px] text-[#16150f]/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-0.5 text-sm">{step.label}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-[#16150f]/55">
              Four inputs decide the plate on the right. Order matters: audience first narrows the
              promise, channel then sets the format.
            </p>
          </nav>

          <section
            aria-label="Creative plate"
            className="order-1 border-[#16150f]/15 py-6 lg:order-2 lg:border-r lg:px-6"
          >
            <figure className="m-0">
              <div
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden sm:aspect-[16/10]"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <div className="flex items-center justify-between px-6 pt-5 font-mono text-[11px] opacity-80">
                  <span>hydra</span>
                  <span>{channelRecord.format}</span>
                </div>
                <div className="max-w-[26ch] px-6">
                  <h2 className="font-serif text-3xl leading-[1.05] tracking-tight sm:text-5xl">
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-4 max-w-[42ch] text-sm leading-relaxed opacity-85">{concept.sub}</p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3 px-6 pb-5">
                  <p className="font-mono text-[11px] opacity-75">{concept.tagline}</p>
                  <span
                    className="px-4 py-2 text-xs font-semibold"
                    style={{ background: concept.palette.fg, color: concept.palette.deep }}
                  >
                    {toneRecord.cta}
                  </span>
                </div>
                {status === "loading" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-[#f3f0ea]/85 motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-6 top-1/3 h-3 bg-[#16150f]/20" />
                    <div className="absolute inset-x-6 top-1/3 mt-6 h-10 w-2/3 bg-[#16150f]/20" />
                    <div className="absolute inset-x-6 top-1/3 mt-20 h-3 w-1/2 bg-[#16150f]/20" />
                  </div>
                )}
              </div>
              <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2 border-t border-[#16150f]/15 pt-2 text-xs text-[#16150f]/60">
                <span>
                  Concept {concept.id}, {concept.angle.toLowerCase()}. {styleRecord.hint.toLowerCase()}.
                </span>
                <span className="font-mono">{channelRecord.format}</span>
              </figcaption>
            </figure>

            {status === "error" && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 border border-[#8c2f1b]/40 bg-[#8c2f1b]/8 px-3 py-2 text-sm text-[#8c2f1b]"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {briefTooShort
                    ? "Nothing was set: the brief is shorter than 24 characters."
                    : "The run failed. The model did not return a layout in time."}
                </span>
                <button
                  type="button"
                  onClick={generate}
                  className="ml-auto shrink-0 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c2f1b]"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="dl-brief" className="block text-sm">
                  Brief
                </label>
                <textarea
                  id="dl-brief"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  onBlur={() => log("Brief edited")}
                  rows={5}
                  className="mt-1.5 w-full resize-y border border-[#16150f]/25 bg-transparent px-3 py-2 text-sm leading-relaxed focus-visible:border-[#16150f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16150f]"
                  placeholder="What is being launched, and what should the reader do next"
                />
              </div>

              <div>
                <label htmlFor="dl-audience" className="block text-sm">
                  Audience
                </label>
                <select
                  id="dl-audience"
                  value={audience}
                  onChange={(event) => {
                    setAudience(event.target.value as AudienceId)
                    log(`Audience set to ${event.target.value}`)
                  }}
                  className="mt-1.5 h-9 w-full border border-[#16150f]/25 bg-transparent px-2 text-sm focus-visible:border-[#16150f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16150f]"
                >
                  {AUDIENCES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dl-channel" className="block text-sm">
                  Channel
                </label>
                <select
                  id="dl-channel"
                  value={channel}
                  onChange={(event) => {
                    setChannel(event.target.value as ChannelId)
                    log(`Channel set to ${event.target.value}`)
                  }}
                  className="mt-1.5 h-9 w-full border border-[#16150f]/25 bg-transparent px-2 text-sm focus-visible:border-[#16150f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16150f]"
                >
                  {CHANNELS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p id="dl-tone" className="text-sm">
                  Tone
                </p>
                <div role="radiogroup" aria-labelledby="dl-tone" className="mt-1.5 flex gap-3">
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
                        "border-b pb-0.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16150f]",
                        tone === item.id
                          ? "border-[#16150f]"
                          : "border-transparent text-[#16150f]/55 hover:text-[#16150f]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <fieldset>
                <legend className="text-sm">Visual style</legend>
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
                        "border px-2 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16150f]",
                        style === item.id
                          ? "border-[#16150f] bg-[#16150f]/6"
                          : "border-[#16150f]/25 hover:border-[#16150f]/60",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <aside className="order-3 border-t border-[#16150f]/15 py-6 lg:border-t-0 lg:pl-6">
            <h2 className="font-serif text-lg">Forecast</h2>
            <table className="mt-2 w-full border-collapse text-sm">
              <tbody>
                {[
                  { label: "Reach", value: formatReach(metrics.reach) },
                  { label: "CTR", value: formatPercent(metrics.ctr) },
                  { label: "Conversion", value: formatPercent(metrics.conv) },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-[#16150f]/15">
                    <th scope="row" className="py-2 text-left font-normal">
                      {row.label}
                    </th>
                    <td className="py-2 text-right font-mono tabular-nums">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs leading-relaxed text-[#16150f]/60">
              Modelled for {audienceRecord.label.toLowerCase()}, {channelRecord.label.toLowerCase()},{" "}
              {toneRecord.label.toLowerCase()} tone.
            </p>

            <h2 className="mt-8 font-serif text-lg">Recent activity</h2>
            <ol className="mt-2 flex flex-col">
              {activity.map((entry) => (
                <li
                  key={entry.id}
                  className="border-b border-[#16150f]/15 py-2 text-xs leading-relaxed first:border-t first:border-t-[#16150f]/15"
                >
                  <time className="font-mono text-[11px] text-[#16150f]/45 tabular-nums">
                    {entry.time}
                  </time>
                  <p className="mt-0.5">{entry.text}</p>
                </li>
              ))}
            </ol>
          </aside>
        </main>
      </div>
    </div>
  )
}
