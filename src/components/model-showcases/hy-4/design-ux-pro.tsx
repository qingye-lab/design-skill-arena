"use client"

import {
  AlertCircle,
  Check,
  CheckCircle2,
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
  formatReach,
  formatPercent,
} from "./campaign-data"
import { useCampaignStudio } from "./use-campaign"
import type { AudienceId, ChannelId, StyleId, ToneId } from "./campaign-data"

const MODEL = "Hy4"
const CHAIN = "frontend-design + ui-ux-pro-max"

export default function DesignUxPro() {
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

  const evidence = [
    {
      label: "Brief length",
      value: `${brief.trim().length} characters`,
      state: briefTooShort ? "fail" : "pass",
    },
    {
      label: "Concept routes",
      value: "3 generated",
      state: "pass",
    },
    {
      label: "Format fit",
      value: channelRecord.format,
      state: channel === "youtube" ? "warn" : "pass",
    },
    {
      label: "Headline length",
      value: `${concept.headline[tone].length} characters`,
      state: concept.headline[tone].length > 44 ? "warn" : "pass",
    },
    {
      label: "Copy reading level",
      value: "Grade 7",
      state: "pass",
    },
    {
      label: "Tap target on CTA",
      value: "48 × 44 px",
      state: "pass",
    },
  ]

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#0b2530] font-sans text-[#dce9ee]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(120,180,200,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(120,180,200,0.09) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#1c3f4c] bg-[#0d2b37]/95 px-4 backdrop-blur">
        <span className="text-[13px] font-semibold tracking-[0.14em] text-[#ffd166] uppercase">
          Muse
        </span>
        <span className="text-[13px] text-[#9fc0cb]">Hydra · campaign blueprint</span>
        <div className="ml-1 hidden items-center gap-1.5 md:flex">
          <span className="border border-[#1c3f4c] px-1.5 py-0.5 text-[11px] text-[#ffd166]">
            {MODEL}
          </span>
          <span className="border border-[#1c3f4c] px-1.5 py-0.5 font-mono text-[11px] text-[#8fb2bd]">
            {CHAIN}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 border px-2.5 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd166]",
              saved
                ? "border-[#7be0c4] text-[#7be0c4]"
                : "border-[#27525f] text-[#b7d3dc] hover:border-[#3a6c7c]",
            )}
          >
            {saved ? <Check className="size-3.5" aria-hidden /> : <Save className="size-3.5" aria-hidden />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("PDF")}
            className="hidden h-8 items-center gap-1.5 border border-[#27525f] px-2.5 text-[12px] text-[#b7d3dc] transition-colors hover:border-[#3a6c7c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd166] sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden />
            Export
          </button>
          <button
            type="button"
            onClick={generate}
            className="inline-flex h-8 items-center gap-1.5 bg-[#ffd166] px-3 text-[12px] font-semibold text-[#3a2a06] transition-colors hover:bg-[#ffdd8a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd166] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d2b37]"
          >
            {status === "loading" ? (
              <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3.5" aria-hidden />
            )}
            {status === "loading" ? "Drafting" : "Generate"}
          </button>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-[270px_minmax(0,1fr)_270px]">
        <aside className="order-2 flex flex-col gap-4 lg:order-1 lg:overflow-y-auto">
          <section
            aria-labelledby="du-inputs"
            className="border border-[#1c3f4c] bg-[#0d2b37]/90 p-3"
          >
            <h2 id="du-inputs" className="text-[12px] font-semibold text-[#ffd166]">
              Blueprint inputs
            </h2>

            <ol className="mt-3 flex flex-col gap-3">
              <li>
                <p className="font-mono text-[11px] text-[#7ba3b0]">01 brief</p>
                <textarea
                  id="du-brief"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  onBlur={() => log("Brief edited")}
                  rows={5}
                  className={cn(
                    "mt-1 w-full resize-y border-b bg-transparent px-0 pb-1.5 text-[12px] leading-relaxed text-[#dce9ee] placeholder:text-[#5f8894] focus-visible:border-[#ffd166] focus-visible:outline-none",
                    briefTooShort ? "border-[#e07a5f]" : "border-[#27525f]",
                  )}
                  aria-label="Campaign brief"
                  placeholder="What is launching, and what the reader must do"
                />
              </li>

              <li>
                <p className="font-mono text-[11px] text-[#7ba3b0]">02 audience</p>
                <div className="mt-1 flex flex-col gap-1">
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
                        "border-l-2 py-1 pl-2 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffd166]",
                        audience === item.id
                          ? "border-[#ffd166] text-[#dce9ee]"
                          : "border-[#1c3f4c] text-[#8fb2bd] hover:border-[#3a6c7c] hover:text-[#dce9ee]",
                      )}
                    >
                      {item.label}
                      <span className="block text-[11px] text-[#6d97a3]">{item.note}</span>
                    </button>
                  ))}
                </div>
              </li>

              <li>
                <p className="font-mono text-[11px] text-[#7ba3b0]">03 channel</p>
                <select
                  id="du-channel"
                  value={channel}
                  onChange={(event) => {
                    setChannel(event.target.value as ChannelId)
                    log(`Channel set to ${event.target.value}`)
                  }}
                  className="mt-1 h-8 w-full border border-[#27525f] bg-[#0a2029] px-2 text-[12px] text-[#dce9ee] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffd166]"
                >
                  {CHANNELS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </li>

              <li>
                <p id="du-tone" className="font-mono text-[11px] text-[#7ba3b0]">
                  04 tone
                </p>
                <div role="radiogroup" aria-labelledby="du-tone" className="mt-1 grid grid-cols-3 gap-1">
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
                        "border py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffd166]",
                        tone === item.id
                          ? "border-[#ffd166] bg-[#ffd166]/12 text-[#ffd166]"
                          : "border-[#27525f] text-[#8fb2bd] hover:border-[#3a6c7c]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </li>

              <li>
                <p id="du-style" className="font-mono text-[11px] text-[#7ba3b0]">
                  05 style
                </p>
                <div role="radiogroup" aria-labelledby="du-style" className="mt-1 grid grid-cols-2 gap-1">
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
                        "border py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffd166]",
                        style === item.id
                          ? "border-[#ffd166] bg-[#ffd166]/12 text-[#ffd166]"
                          : "border-[#27525f] text-[#8fb2bd] hover:border-[#3a6c7c]",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </li>
            </ol>
          </section>
        </aside>

        <section aria-label="Plate" className="order-1 flex min-h-0 flex-col gap-3 lg:order-2">
          <div className="flex items-center gap-1.5">
            {concepts.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === conceptId}
                onClick={() => selectConcept(item.id)}
                className={cn(
                  "border px-2.5 py-1 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffd166]",
                  item.id === conceptId
                    ? "border-[#ffd166] text-[#ffd166]"
                    : "border-[#27525f] text-[#8fb2bd] hover:border-[#3a6c7c]",
                )}
              >
                {item.id}
              </button>
            ))}
            <span className="ml-auto font-mono text-[11px] text-[#7ba3b0]">
              {channelRecord.format}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center border border-[#1c3f4c] bg-[#0d2b37]/70 p-4 sm:p-6">
            <div className="relative w-full max-w-[420px]">
              <div
                className="relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden"
                style={{ background: concept.palette.bg, color: concept.palette.fg }}
              >
                <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-80">
                  <span>Hydra</span>
                  <span>{concept.angle}</span>
                </header>
                <div className="px-5">
                  <p className="text-[11px] opacity-80">{audienceRecord.note}</p>
                  <h2 className="mt-1.5 text-[26px] leading-[1.08] font-semibold tracking-tight sm:text-[32px]">
                    {concept.headline[tone]}
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-[12px] leading-relaxed opacity-85">
                    {concept.sub}
                  </p>
                </div>
                <footer className="flex items-end justify-between px-5 pb-4">
                  <p className="text-[11px] opacity-75">{concept.tagline}</p>
                  <span
                    className="px-3 py-1.5 text-[11px] font-semibold"
                    style={{ background: concept.palette.fg, color: concept.palette.deep }}
                  >
                    {toneRecord.cta}
                  </span>
                </footer>

                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <span className="absolute inset-3 border border-dashed border-white/45" />
                  <span className="absolute top-2 left-4 font-mono text-[9px] text-white/80">
                    safe 40
                  </span>
                  <span className="absolute bottom-2 left-4 font-mono text-[9px] text-white/80">
                    cta 48×44
                  </span>
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 border-l border-dashed border-white/45 pl-1 font-mono text-[9px] text-white/80">
                    4:5
                  </span>
                </div>

                {status === "loading" && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-[#0b2530]/85 motion-reduce:animate-none"
                  >
                    <div className="absolute inset-x-5 top-24 h-2.5 bg-white/15" />
                    <div className="absolute inset-x-5 top-32 h-8 w-2/3 bg-white/15" />
                  </div>
                )}
              </div>
              <p className="mt-2 text-center font-mono text-[11px] text-[#7ba3b0]">
                plate {concept.id} · {concept.name}
              </p>
            </div>
          </div>

          <div aria-live="polite" className="min-h-[24px]">
            {status === "success" && (
              <p className="flex items-center gap-1.5 text-[12px] text-[#7be0c4]">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Blueprint regenerated for {channelRecord.label}.
              </p>
            )}
            {status === "error" && (
              <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#ffb4a2]">
                <AlertCircle className="size-3.5" aria-hidden />
                {briefTooShort
                  ? "Drafting blocked: the brief is shorter than 24 characters."
                  : "Drafting failed: the model timed out."}
                <button
                  type="button"
                  onClick={generate}
                  className="underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffb4a2]"
                >
                  Retry
                </button>
              </p>
            )}
          </div>
        </section>

        <aside className="order-3 flex flex-col gap-4 lg:overflow-y-auto">
          <section
            aria-labelledby="du-evidence"
            className="border border-[#1c3f4c] bg-[#0d2b37]/90 p-3"
          >
            <h2 id="du-evidence" className="text-[12px] font-semibold text-[#ffd166]">
              Evidence
            </h2>
            <ul className="mt-2 flex flex-col">
              {evidence.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-2 border-b border-[#16323d] py-1.5 last:border-b-0"
                >
                  {item.state === "pass" ? (
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#7be0c4]" aria-hidden />
                  ) : item.state === "warn" ? (
                    <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-[#ffd166]" aria-hidden />
                  ) : (
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-[#ffb4a2]" aria-hidden />
                  )}
                  <span className="text-[12px]">
                    <span className="block text-[#dce9ee]">{item.label}</span>
                    <span className="block text-[11px] text-[#8fb2bd]">{item.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="du-metrics"
            className="border border-[#1c3f4c] bg-[#0d2b37]/90 p-3"
          >
            <h2 id="du-metrics" className="text-[12px] font-semibold text-[#ffd166]">
              Simulated metrics
            </h2>
            <dl className="mt-2 flex flex-col gap-1.5">
              {[
                { label: "Reach", value: formatReach(metrics.reach) },
                { label: "CTR", value: formatPercent(metrics.ctr) },
                { label: "Conversion", value: formatPercent(metrics.conv) },
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between border-b border-[#16323d] pb-1">
                  <dt className="text-[12px] text-[#8fb2bd]">{metric.label}</dt>
                  <dd className="font-mono text-[12px] tabular-nums text-[#dce9ee]">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="du-activity"
            className="border border-[#1c3f4c] bg-[#0d2b37]/90 p-3"
          >
            <h2 id="du-activity" className="text-[12px] font-semibold text-[#ffd166]">
              Recent activity
            </h2>
            <ol className="mt-2 flex flex-col gap-1.5">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-2 text-[11px]">
                  <time className="shrink-0 font-mono text-[#6d97a3] tabular-nums">{entry.time}</time>
                  <span className="text-[#b7d3dc]">{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </main>
    </div>
  )
}
