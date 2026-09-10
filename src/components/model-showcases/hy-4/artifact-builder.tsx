"use client"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Check, Download, Loader2, Save, Sparkles, Terminal } from "lucide-react"

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
const CHAIN = "web-artifacts-builder / artifacts-builder"

type FileId = "brief.md" | "audience.json" | "concept.tsx" | "theme.ts"

const FILES: { id: FileId; note: string }[] = [
  { id: "brief.md", note: "12 kB" },
  { id: "audience.json", note: "1 kB" },
  { id: "concept.tsx", note: "8 kB" },
  { id: "theme.ts", note: "2 kB" },
]

const INITIAL_LOG = [
  "$ npx muse init campaign-hydra",
  "  ✓ scaffold react + tailwind",
  "  ✓ 4 files written",
  "$ npx muse build --campaign hydra",
  "  ✓ bundle.html  412 kB  gzip 118 kB",
]

export default function ArtifactBuilder() {
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
    log,
    activity,
    metrics,
    channelRecord,
    audienceRecord,
    toneRecord,
    styleRecord,
  } = useCampaignStudio()

  const [activeFile, setActiveFile] = useState<FileId>("concept.tsx")
  const [logLines, setLogLines] = useState<string[]>(INITIAL_LOG)
  const [openPanel, setOpenPanel] = useState<"files" | "output" | "bundle">("files")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const buildCount = useRef(0)

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
    }
  }, [])

  function runBuild() {
    setOpenPanel("output")
    setLogLines((prev) => [...prev, "$ npx muse build --campaign hydra --concept " + conceptId])
    generate()
    const willFail = briefTooShort || buildCount.current % 4 === 0
    buildCount.current += 1
    const steps = willFail
      ? ["  · resolving assets…", "  · rendering concept " + conceptId + "…", "  ✗ build failed: upstream timeout"]
      : [
          "  · resolving assets…",
          "  · rendering concept " + conceptId + "…",
          "  · inlining styles…",
          "  ✓ bundle.html  " + (398 + conceptId.charCodeAt(0)) + " kB  gzip 116 kB",
        ]
    steps.forEach((line, index) => {
      timers.current.push(
        setTimeout(() => setLogLines((prev) => [...prev, line]), 320 * (index + 1))
      )
    })
  }

  const bundleSize = 398 + conceptId.charCodeAt(0)

  return (
    <div className="flex min-h-dvh flex-col bg-[#0f1115] font-mono text-[13px] text-[#d7dbe2]">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-[#232833] bg-[#14171d] px-3">
        <span className="text-[#e5a03b]">◆</span>
        <h1 className="truncate text-[13px] font-semibold text-white">muse-campaign-hydra</h1>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[11px]",
            status === "loading"
              ? "border-[#4a3a1c] bg-[#241c0e] text-[#e5a03b]"
              : status === "error"
                ? "border-[#5a2a2a] bg-[#261414] text-[#ff8f80]"
                : status === "success"
                  ? "border-[#25402c] bg-[#12241a] text-[#7ee787]"
                  : "border-[#2c323e] bg-[#191d24] text-[#8b93a1]",
          )}
        >
          {status === "loading" ? "building" : status === "error" ? "failed" : status === "success" ? "ready" : "idle"}
        </span>
        <span className="hidden text-[11px] text-[#6d7583] md:inline">
          {MODEL} · {CHAIN}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={save}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded border px-2 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]",
              saved
                ? "border-[#25402c] bg-[#12241a] text-[#7ee787]"
                : "border-[#2c323e] bg-[#191d24] text-[#b9c0cc] hover:border-[#3a4351]",
            )}
          >
            {saved ? <Check className="size-3" aria-hidden /> : <Save className="size-3" aria-hidden />}
            {saved ? "saved" : "save"}
          </button>
          <button
            type="button"
            onClick={() => exportAs("bundle.html")}
            className="inline-flex h-7 items-center gap-1 rounded border border-[#2c323e] bg-[#191d24] px-2 text-[11px] text-[#b9c0cc] transition-colors hover:border-[#3a4351] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]"
          >
            <Download className="size-3" aria-hidden />
            bundle
          </button>
          <button
            type="button"
            onClick={runBuild}
            className="inline-flex h-7 items-center gap-1 rounded bg-[#e5a03b] px-2.5 text-[11px] font-semibold text-[#1b1408] transition-colors hover:bg-[#f0b45a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14171d]"
          >
            {status === "loading" ? (
              <Loader2 className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <Sparkles className="size-3" aria-hidden />
            )}
            {status === "loading" ? "building" : "generate"}
          </button>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Workspace panel"
        className="grid grid-cols-3 border-b border-[#232833] bg-[#12151a] lg:hidden"
      >
        {(["files", "output", "bundle"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={openPanel === id}
            onClick={() => setOpenPanel(id)}
            className={cn(
              "h-9 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e5a03b]",
              openPanel === id ? "bg-[#191d24] text-white" : "text-[#6d7583]",
            )}
          >
            {id}
          </button>
        ))}
      </div>

      <main className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[196px_minmax(0,1fr)_248px]">
        <aside
          className={cn(
            "border-b border-[#232833] bg-[#12151a] lg:block lg:overflow-y-auto lg:border-r lg:border-b-0",
            openPanel !== "files" && "hidden",
          )}
        >
          <p className="px-3 pt-3 pb-1 text-[11px] text-[#6d7583]">files</p>
          <ul className="pb-3">
            {FILES.map((file) => (
              <li key={file.id}>
                <button
                  type="button"
                  onClick={() => setActiveFile(file.id)}
                  aria-current={activeFile === file.id}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e5a03b]",
                    activeFile === file.id
                      ? "bg-[#232833] text-white"
                      : "text-[#9aa2b0] hover:bg-[#191d24] hover:text-white",
                  )}
                >
                  <span>{file.id}</span>
                  <span className="text-[11px] text-[#5b6270]">{file.note}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-[#232833] px-3 py-3">
            <p className="text-[11px] text-[#6d7583]">concept</p>
            <div className="mt-2 flex gap-1">
              {concepts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === conceptId}
                  onClick={() => selectConcept(item.id)}
                  className={cn(
                    "size-7 rounded border text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]",
                    item.id === conceptId
                      ? "border-[#e5a03b] bg-[#241c0e] text-[#e5a03b]"
                      : "border-[#2c323e] text-[#9aa2b0] hover:border-[#3a4351]",
                  )}
                >
                  {item.id}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#232833] px-3 py-3">
            <p className="text-[11px] text-[#6d7583]">inputs</p>
            <label htmlFor="ab-channel" className="mt-2 block text-[11px] text-[#9aa2b0]">
              channel
            </label>
            <select
              id="ab-channel"
              value={channel}
              onChange={(event) => {
                setChannel(event.target.value as ChannelId)
                log(`channel set to ${event.target.value}`)
              }}
              className="mt-1 h-7 w-full rounded border border-[#2c323e] bg-[#0f1115] px-1.5 text-[11px] text-[#d7dbe2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]"
            >
              {CHANNELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <label htmlFor="ab-audience" className="mt-2 block text-[11px] text-[#9aa2b0]">
              audience
            </label>
            <select
              id="ab-audience"
              value={audience}
              onChange={(event) => {
                setAudience(event.target.value as AudienceId)
                log(`audience set to ${event.target.value}`)
              }}
              className="mt-1 h-7 w-full rounded border border-[#2c323e] bg-[#0f1115] px-1.5 text-[11px] text-[#d7dbe2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]"
            >
              {AUDIENCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p id="ab-tone" className="mt-2 text-[11px] text-[#9aa2b0]">
              tone
            </p>
            <div role="radiogroup" aria-labelledby="ab-tone" className="mt-1 flex gap-1">
              {TONES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={tone === item.id}
                  onClick={() => {
                    setTone(item.id as ToneId)
                    log(`tone set to ${item.label}`)
                  }}
                  className={cn(
                    "flex-1 rounded border py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]",
                    tone === item.id
                      ? "border-[#e5a03b] bg-[#241c0e] text-[#e5a03b]"
                      : "border-[#2c323e] text-[#9aa2b0] hover:border-[#3a4351]",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section aria-label="Editor" className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-[#232833] bg-[#12151a] px-3 py-1.5 text-[11px] text-[#6d7583]">
            <span className="text-[#9aa2b0]">{activeFile}</span>
            <span className="ml-auto">{channelRecord.format}</span>
          </div>

          <div
            className={cn(
              "flex-1 overflow-y-auto p-3",
              activeFile === "concept.tsx" && "flex items-center justify-center",
            )}
          >
            {activeFile === "concept.tsx" && (
              <div className="mx-auto w-full max-w-[440px]">
                <div className="overflow-hidden rounded-md border border-[#2c323e]">
                  <div className="flex items-center gap-1.5 border-b border-[#2c323e] bg-[#191d24] px-3 py-1.5">
                    <span className="size-2 rounded-full bg-[#ef4444]/70" aria-hidden />
                    <span className="size-2 rounded-full bg-[#eab308]/70" aria-hidden />
                    <span className="size-2 rounded-full bg-[#22c55e]/70" aria-hidden />
                    <span className="ml-2 text-[11px] text-[#6d7583]">muse.local/campaigns/hydra</span>
                  </div>
                  <article
                    className="relative flex aspect-[4/5] w-full flex-col justify-between font-sans"
                    style={{ background: concept.palette.bg, color: concept.palette.fg }}
                  >
                    <header className="flex items-center justify-between px-5 pt-4 text-[11px] opacity-80">
                      <span>Hydra</span>
                      <span>{concept.angle}</span>
                    </header>
                    <div className="px-5">
                      <h2 className="text-[26px] leading-[1.06] font-semibold tracking-tight sm:text-[32px]">
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
                        className="absolute inset-0 animate-pulse bg-[#0f1115]/85 motion-reduce:animate-none"
                      >
                        <div className="absolute inset-x-5 top-24 h-2.5 rounded bg-white/15" />
                        <div className="absolute inset-x-5 top-32 h-8 w-2/3 rounded bg-white/15" />
                      </div>
                    )}
                  </article>
                </div>
                <p className="mt-2 text-center text-[11px] text-[#6d7583]">
                  {styleRecord.label} · {toneRecord.label} · {audienceRecord.label}
                </p>
              </div>
            )}

            {activeFile === "brief.md" && (
              <div>
                <label htmlFor="ab-brief" className="block text-[11px] text-[#6d7583]">
                  brief.md
                </label>
                <textarea
                  id="ab-brief"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  onBlur={() => log("brief.md edited")}
                  rows={12}
                  className={cn(
                    "mt-2 w-full resize-y rounded-md border bg-[#0b0d11] px-3 py-2 text-[12px] leading-relaxed text-[#d7dbe2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]",
                    briefTooShort ? "border-[#5a2a2a]" : "border-[#2c323e]",
                  )}
                />
                {briefTooShort && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#ff8f80]">
                    <AlertCircle className="size-3" aria-hidden />
                    build blocked: brief.md is under 24 characters
                  </p>
                )}
              </div>
            )}

            {activeFile === "audience.json" && (
              <pre className="overflow-x-auto rounded-md border border-[#2c323e] bg-[#0b0d11] p-3 text-[12px] leading-relaxed text-[#9aa2b0]">
{`{
  "audience": "${audience}",
  "note": "${audienceRecord.note}",
  "channel": "${channel}",
  "format": "${channelRecord.format}",
  "tone": "${tone}",
  "cta": "${toneRecord.cta}"
}`}
              </pre>
            )}

            {activeFile === "theme.ts" && (
              <pre className="overflow-x-auto rounded-md border border-[#2c323e] bg-[#0b0d11] p-3 text-[12px] leading-relaxed text-[#9aa2b0]">
{`export const theme = {
  concept: "${concept.id}",
  name: "${concept.name}",
  fg: "${concept.palette.fg}",
  accent: "${concept.palette.accent}",
  deep: "${concept.palette.deep}",
  style: "${style}",
}`}
              </pre>
            )}
          </div>

          <div
            className={cn(
              "shrink-0 border-t border-[#232833] bg-[#0b0d11]",
              openPanel !== "output" && "hidden lg:block",
            )}
          >
            <div className="flex items-center gap-2 border-b border-[#232833] px-3 py-1.5 text-[11px] text-[#6d7583]">
              <Terminal className="size-3" aria-hidden />
              build output
            </div>
            <pre
              aria-live="polite"
              className="max-h-32 overflow-y-auto px-3 py-2 text-[11px] leading-relaxed"
            >
              {logLines.map((line, index) => (
                <div
                  key={`${index}-${line}`}
                  className={cn(
                    line.includes("✓") && "text-[#7ee787]",
                    line.includes("✗") && "text-[#ff8f80]",
                    line.startsWith("$") && "text-[#e5a03b]",
                  )}
                >
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </section>

        <aside
          className={cn(
            "border-t border-[#232833] bg-[#12151a] lg:block lg:overflow-y-auto lg:border-t-0 lg:border-l",
            openPanel !== "bundle" && "hidden",
          )}
        >
          <div className="p-3">
            <p className="text-[11px] text-[#6d7583]">artifact</p>
            <dl className="mt-2 flex flex-col gap-1.5 text-[12px]">
              {[
                ["files", "4"],
                ["bundle", `${bundleSize} kB`],
                ["gzip", "116 kB"],
                ["render", status === "loading" ? "…" : "1.4s"],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-[#1c212a] pb-1">
                  <dt className="text-[#6d7583]">{key}</dt>
                  <dd className="tabular-nums text-[#d7dbe2]">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-[11px] text-[#6d7583]">forecast</p>
            <dl className="mt-2 flex flex-col gap-1.5 text-[12px]">
              {[
                ["reach", formatReach(metrics.reach)],
                ["ctr", formatPercent(metrics.ctr)],
                ["conv", formatPercent(metrics.conv)],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-[#1c212a] pb-1">
                  <dt className="text-[#6d7583]">{key}</dt>
                  <dd className="tabular-nums text-[#d7dbe2]">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-[11px] text-[#6d7583]">recent activity</p>
            <ol className="mt-2 flex flex-col gap-1">
              {activity.map((entry) => (
                <li key={entry.id} className="text-[11px] leading-snug text-[#9aa2b0]">
                  <span className="text-[#5b6270]">{entry.time} </span>
                  {entry.text}
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <p id="ab-style" className="text-[11px] text-[#6d7583]">
                style
              </p>
              <div role="radiogroup" aria-labelledby="ab-style" className="mt-1.5 grid grid-cols-2 gap-1">
                {STYLES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={style === item.id}
                    onClick={() => {
                      setStyle(item.id as StyleId)
                      log(`style set to ${item.label}`)
                    }}
                    className={cn(
                      "rounded border px-1.5 py-1 text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a03b]",
                      style === item.id
                        ? "border-[#e5a03b] bg-[#241c0e] text-[#e5a03b]"
                        : "border-[#2c323e] text-[#9aa2b0] hover:border-[#3a4351]",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
