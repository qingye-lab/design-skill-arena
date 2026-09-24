"use client"

import { Instrument_Sans, JetBrains_Mono } from "next/font/google"
import {
  Braces,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Download,
  FileCode,
  FileText,
  FolderOpen,
  Gauge,
  History,
  LoaderCircle,
  Play,
  RotateCcw,
  Save,
  SquareTerminal,
} from "lucide-react"
import { useMemo, useState, type KeyboardEvent } from "react"

import {
  BRIEF_MAX,
  GENERATION_STAGES,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ControlKey,
  type MuseStudio,
  type Output,
  type RenderedVariant,
  type StudioSpec,
  type VariantId,
} from "./core"

const ui = Instrument_Sans({ subsets: ["latin"], display: "swap" })
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap" })

/* ---------- brief ---------- */

const spec: StudioSpec = {
  showcaseId: "artifact-builder",
  product: "Brightline Barista",
  brief:
    "Launch Brightline Barista, an oat milk that steams to glossy microfoam and holds a rosetta for 90 seconds. Win home baristas and café buyers before the 6 October retail drop. Lead with pour quality, not dairy guilt.",
  audiences: [
    { id: "home", label: "Home baristas", hint: "own an espresso machine", size: 520000, lift: { ctr: 1.12, conversion: 1.08 } },
    { id: "cafe", label: "Café buyers", hint: "order milk by the case", size: 46000, lift: { ctr: 1.35, conversion: 1.6 } },
    { id: "curious", label: "Oat-curious dairy drinkers", hint: "try one carton first", size: 1380000, lift: { ctr: 0.86, conversion: 0.82 } },
  ],
  channels: [
    { id: "reels", label: "Instagram Reels", hint: "9:16 vertical", lift: { reach: 1.2, ctr: 1.05 } },
    { id: "trade", label: "Café trade newsletter", hint: "16:9 banner", lift: { reach: 0.38, ctr: 2.2, conversion: 1.35 } },
    { id: "shelf", label: "Shelf wobbler", hint: "1:1 in-store card", lift: { reach: 0.74, ctr: 0.6, conversion: 1.15 } },
  ],
  tones: [
    { id: "precise", label: "Precise", hint: "numbers and temperatures", lift: { conversion: 1.08 } },
    { id: "playful", label: "Playful", hint: "café banter", lift: { ctr: 1.1, conversion: 0.96 } },
    { id: "warm", label: "Warm", hint: "morning ritual", lift: { ctr: 1.03, conversion: 1.02 } },
  ],
  styles: [
    { id: "espresso", label: "Cream on espresso", hint: "dark roast ground", lift: { ctr: 1.06 } },
    { id: "ceramic", label: "White ceramic", hint: "clean counter light", lift: { conversion: 1.04 } },
    { id: "kraft", label: "Morning kraft", hint: "paper bag warmth", lift: { reach: 1.03 } },
  ],
  variants: [
    {
      id: "A",
      name: "Microfoam that holds",
      headline: "Pour the rosetta. Watch it stay.",
      body: "{product} steams to glossy microfoam that holds its shape for 90 seconds. Made for {audience} who care what the cup looks like.",
      cta: "Find a carton",
      lift: { ctr: 1.08 },
    },
    {
      id: "B",
      name: "Café at home",
      headline: "Your kitchen, pouring like a café.",
      body: "The oat milk baristas steam at work, in a carton for your counter. A {tone} upgrade to every flat white.",
      cta: "Try the 1 L carton",
      lift: { reach: 1.06, conversion: 0.95 },
    },
    {
      id: "C",
      name: "The trade secret",
      headline: "What the good cafés steam.",
      body: "Stable at 65 °C, no splitting in acidic espresso, 12 cartons to the case. Built for {audience}.",
      cta: "Order a sample case",
      lift: { ctr: 0.94, conversion: 1.16 },
    },
  ],
  recent: [
    { id: "r1", title: "Cold foam summer push", variant: "B", when: "Tue" },
    { id: "r2", title: "Barista Series 6-pack", variant: "C", when: "18 Sep" },
    { id: "r3", title: "Oat Original shelf reset", variant: "A", when: "9 Sep" },
  ],
  initialRun: 12,
}

/* ---------- artifact look ---------- */

type Look = {
  bg: string
  ink: string
  sub: string
  accent: string
  onAccent: string
  saucer: string
  cup: string
  crema: string
  foam: string
}

const looks: Record<string, Look> = {
  espresso: { bg: "#2B1B14", ink: "#F6EBDD", sub: "#D9C4AE", accent: "#E9B872", onAccent: "#2B1B14", saucer: "#3D2A20", cup: "#F3EEE6", crema: "#8E5227", foam: "#F7EEDF" },
  ceramic: { bg: "#F7F5F0", ink: "#1E1A17", sub: "#5C534B", accent: "#2F6F5E", onAccent: "#FFFFFF", saucer: "#E4DED4", cup: "#FFFFFF", crema: "#9A5A2E", foam: "#F6EDE0" },
  kraft: { bg: "#D9C3A0", ink: "#2A1F14", sub: "#56432F", accent: "#A13D2D", onAccent: "#FFFFFF", saucer: "#C5AB82", cup: "#FBF7F0", crema: "#8A4F26", foam: "#F7EEDF" },
}

type Format = { ratio: string; max: number; row: boolean; label: string; head: string; body: string; cup: string }

const formats: Record<string, Format> = {
  reels: { ratio: "9 / 16", max: 310, row: false, label: "Reels · 1080 × 1920", head: "clamp(22px, 9cqw, 32px)", body: "clamp(13px, 4.4cqw, 15px)", cup: "62%" },
  trade: { ratio: "16 / 9", max: 540, row: true, label: "Newsletter · 1200 × 675", head: "clamp(18px, 5cqw, 28px)", body: "clamp(12px, 2.7cqw, 14px)", cup: "38%" },
  shelf: { ratio: "1 / 1", max: 380, row: false, label: "Wobbler · 100 × 100 mm", head: "clamp(19px, 7cqw, 28px)", body: "clamp(12px, 3.6cqw, 14px)", cup: "34%" },
}

const BUDGET_BYTES = 8 * 1024

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function cupSvg(look: Look) {
  return [
    `<svg viewBox="0 0 200 200" width="100%" role="img" aria-label="Top view of a flat white with a rosetta poured in oat milk" style="display:block">`,
    `<circle cx="100" cy="100" r="96" fill="${look.saucer}"/>`,
    `<rect x="150" y="90" width="42" height="20" rx="10" fill="${look.cup}"/>`,
    `<circle cx="100" cy="100" r="72" fill="${look.cup}"/>`,
    `<circle cx="100" cy="100" r="60" fill="${look.crema}"/>`,
    `<g fill="${look.foam}">`,
    `<path d="M100 56c-11 0-19 7-19 16 0 10 19 21 19 21s19-11 19-21c0-9-8-16-19-16z"/>`,
    `<ellipse cx="100" cy="104" rx="27" ry="8"/>`,
    `<ellipse cx="100" cy="117" rx="23" ry="7"/>`,
    `<ellipse cx="100" cy="129" rx="18" ry="6"/>`,
    `<ellipse cx="100" cy="140" rx="12" ry="5"/>`,
    `</g>`,
    `<rect x="98.6" y="66" width="2.8" height="84" rx="1.4" fill="${look.crema}"/>`,
    `</svg>`,
  ].join("\n")
}

/** The creative itself. Shared verbatim by the preview and the exported file. */
function adMarkup(output: Output, variant: RenderedVariant, product: string, headTag: "h1" | "p") {
  const look = looks[output.settings.style] ?? looks.espresso
  const format = formats[output.settings.channel] ?? formats.reels
  const font = `'Instrument Sans', 'Helvetica Neue', system-ui, sans-serif`
  return [
    `<div style="container-type:inline-size;width:100%;max-width:${format.max}px;margin:0 auto">`,
    `<article style="box-sizing:border-box;aspect-ratio:${format.ratio};display:flex;flex-direction:${format.row ? "row" : "column"};gap:${format.row ? "6cqw" : "5cqw"};align-items:${format.row ? "center" : "stretch"};padding:7cqw;border-radius:10px;background:${look.bg};color:${look.ink};font-family:${font}">`,
    `<div style="flex:none;width:${format.cup};${format.row ? "" : "align-self:flex-start"}">`,
    cupSvg(look),
    `</div>`,
    `<div style="display:flex;flex-direction:column;gap:3cqw;flex:1;min-width:0;justify-content:flex-end">`,
    `<${headTag} style="margin:0;font-size:${format.head};line-height:1.08;font-weight:700;letter-spacing:-0.02em;text-wrap:balance">${esc(variant.headline)}</${headTag}>`,
    `<p style="margin:0;font-size:${format.body};line-height:1.45;color:${look.sub}">${esc(variant.body)}</p>`,
    `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-top:2cqw">`,
    `<span style="display:inline-block;padding:9px 14px;border-radius:999px;background:${look.accent};color:${look.onAccent};font-size:13px;font-weight:700">${esc(variant.cta)}</span>`,
    `<span style="font-size:12px;font-weight:700;letter-spacing:0.02em">${esc(product)}</span>`,
    `</div>`,
    `</div>`,
    `</article>`,
    `</div>`,
  ].join("\n")
}

function artifactDocument(output: Output, variant: RenderedVariant, product: string, model: string, chain: string) {
  return [
    `<!doctype html>`,
    `<html lang="en">`,
    `<head>`,
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<title>${esc(product)} · route ${variant.id} · run ${output.run}</title>`,
    `<!-- Built by ${esc(model)} with ${esc(chain)}. Forecast figures are simulated. -->`,
    `<style>`,
    `html{background:#EEF1F4}`,
    `body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;box-sizing:border-box}`,
    `</style>`,
    `</head>`,
    `<body>`,
    adMarkup(output, variant, product, "h1"),
    `</body>`,
    `</html>`,
  ].join("\n")
}

function kb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

/* ---------- source highlighting ---------- */

const C = {
  canvas: "#EEF1F4",
  panel: "#FFFFFF",
  ink: "#1B2230",
  muted: "#5A6475",
  line: "#D9DEE5",
  key: "#2553C7",
  string: "#1A7F5A",
  number: "#B35C00",
  comment: "#6B7686",
  error: "#C0362C",
}

type Token = { text: string; color?: string }

const HTML_TOKEN = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][\w-]*|\/?>)|("[^"]*")|([a-z-]+(?==))/g
const CSS_TOKEN = /([a-z-]+(?=:))|(#[0-9A-Fa-f]{3,6}\b)|(-?\d*\.?\d+(?:px|%|cqw|em|rem|s)?)/g

function cssTokens(value: string): Token[] {
  const out: Token[] = []
  let last = 0
  for (const match of value.matchAll(CSS_TOKEN)) {
    const index = match.index ?? 0
    if (index > last) out.push({ text: value.slice(last, index), color: C.string })
    out.push({ text: match[0], color: match[1] ? C.key : C.number })
    last = index + match[0].length
  }
  if (last < value.length) out.push({ text: value.slice(last), color: C.string })
  return out
}

function htmlTokens(line: string): Token[] {
  const out: Token[] = []
  let last = 0
  for (const match of line.matchAll(HTML_TOKEN)) {
    const index = match.index ?? 0
    if (index > last) out.push({ text: line.slice(last, index) })
    const [text, comment, tag, string] = match
    if (comment) out.push({ text, color: C.comment })
    else if (tag) out.push({ text, color: C.key })
    else if (string) out.push(...(string.includes(":") ? cssTokens(string) : [{ text, color: C.string }]))
    else out.push({ text, color: C.muted })
    last = index + text.length
  }
  if (last < line.length) out.push({ text: line.slice(last) })
  return out
}

/* ---------- shared chrome ---------- */

const code = mono.className
const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2553C7]"
const btn = `inline-flex min-h-10 touch-manipulation items-center justify-center gap-1.5 rounded-[5px] px-3 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 xl:min-h-8 ${ring}`
const btnPrimary = `${btn} bg-[#2553C7] text-white hover:bg-[#1D45A6] active:bg-[#183A8C]`
const btnQuiet = `${btn} border border-[#D9DEE5] bg-white text-[#1B2230] hover:border-[#B4BCC8] hover:bg-[#F4F6F9] active:bg-[#EBEEF2]`
const spin = "size-4 animate-spin motion-reduce:animate-none"

type FileId = "brief" | "targeting"

const CONTROL_ROWS: { key: ControlKey; options: StudioSpec["audiences"] }[] = [
  { key: "audience", options: spec.audiences },
  { key: "channel", options: spec.channels },
  { key: "tone", options: spec.tones },
  { key: "style", options: spec.styles },
]

function fileNameFor(output: Output, id: VariantId) {
  return `brightline-run${output.run}-${id}.html`
}

function liveStatus(m: MuseStudio, filename: string) {
  if (m.busy) return `Building run ${m.output.run + 1}: ${m.stageLabel} (${m.progress}%)`
  if (m.exportStatus === "exporting") return `Bundling ${filename}…`
  if (m.saveStatus === "saving") return "Saving this build…"
  if (m.generateStatus === "error") return `Run ${m.output.run + 1} did not build`
  if (m.exportStatus === "exported") return `Exported ${filename}`
  if (m.saveStatus === "saved") return `Saved route ${m.selected} to recent builds`
  if (m.generateStatus === "success") return `Run ${m.output.run} ready: three routes built`
  if (m.stale) return `Targeting changed since run ${m.output.run}`
  return `Run ${m.output.run} built at ${m.output.at}`
}

/* ---------- page ---------- */

export default function ArtifactBuilder() {
  const m = useMuseStudio(spec)
  const [view, setView] = useState<"preview" | "source">("preview")
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [openFile, setOpenFile] = useState<FileId>("brief")

  const html = artifactDocument(m.output, m.current, spec.product, m.modelName, m.chain)
  const bytes = new TextEncoder().encode(html).length
  const filename = fileNameFor(m.output, m.selected)
  const status = liveStatus(m, filename)
  const statusTone = m.busy ? C.key : m.generateStatus === "error" || m.saveError || m.exportError ? C.error : m.stale ? C.number : C.string

  function exportFile() {
    m.exportCampaign(({ output, variant }) => ({
      filename: fileNameFor(output, variant.id),
      mime: "text/html",
      content: artifactDocument(output, variant, spec.product, m.modelName, m.chain),
    }))
  }

  function openEditor(file: FileId) {
    setOpenFile(file)
    document.getElementById(file === "brief" ? "ab-brief" : "ab-audience")?.focus()
  }

  return (
    <div className={`${ui.className} min-h-screen bg-[#EEF1F4] text-[#1B2230] antialiased selection:bg-[#2553C7]/20 selection:text-[#1B2230]`}>
      <style>{`
        .ab-line { animation: ab-line 280ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes ab-line { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .ab-reveal { animation: ab-reveal 320ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes ab-reveal { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: none; } }
        .ab-grid { container-type: inline-size; }
        .ab-scroll { scrollbar-width: thin; scrollbar-color: #C3CAD4 transparent; }
        .ab-caret { caret-color: #2553C7; }
        @media (prefers-reduced-motion: reduce) { .ab-line, .ab-reveal { animation: none; } }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-[#D9DEE5] bg-white">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 xl:h-14 xl:flex-nowrap xl:px-4 xl:py-0">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark />
            <div className="min-w-0">
              <h1 className="truncate text-[15px] leading-tight font-semibold">Brightline Barista launch</h1>
              <p className={`${code} truncate text-[12px] text-[#5A6475]`}>
                <span translate="no">muse/brightline-barista</span>
                <span aria-hidden> · </span>
                <span className="tabular-nums">run {m.output.run}</span>
              </p>
            </div>
          </div>

          <p
            role="status"
            aria-live="polite"
            className="order-last flex w-full min-w-0 items-center gap-2 text-[13px] xl:order-none xl:ml-4 xl:w-auto xl:flex-1"
          >
            {m.busy ? (
              <LoaderCircle aria-hidden className={spin} style={{ color: statusTone }} />
            ) : (
              <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: statusTone }} />
            )}
            <span className="min-w-0 truncate tabular-nums">{status}</span>
          </p>

          <div className="grid w-full grid-cols-3 gap-2 sm:ml-auto sm:flex sm:w-auto">
            <button type="button" onClick={m.generate} disabled={m.busy} className={btnPrimary}>
              {m.busy ? <LoaderCircle aria-hidden className={spin} /> : <Play aria-hidden className="size-4" />}
              Generate
            </button>
            <button type="button" onClick={m.save} disabled={m.saveStatus === "saving"} className={btnQuiet}>
              {m.saveStatus === "saving" ? <LoaderCircle aria-hidden className={spin} /> : <Save aria-hidden className="size-4" />}
              Save
            </button>
            <button type="button" onClick={exportFile} disabled={m.exportStatus === "exporting"} className={btnQuiet}>
              {m.exportStatus === "exporting" ? <LoaderCircle aria-hidden className={spin} /> : <Download aria-hidden className="size-4" />}
              Export
              <span className={`${code} hidden text-[11px] font-normal text-[#5A6475] 2xl:inline`}>.html</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-px bg-[#D9DEE5] md:grid-cols-2 xl:h-[calc(100dvh-3.5rem)] xl:grid-cols-[200px_minmax(0,380px)_minmax(0,1fr)_288px] xl:grid-rows-[minmax(0,1fr)_188px]">
        <Explorer m={m} openFile={openFile} onOpen={openEditor} />
        <Editors m={m} onFocusFile={setOpenFile} />
        <Preview m={m} view={view} onView={setView} html={html} bytes={bytes} filename={filename} />
        <Terminal m={m} open={terminalOpen} onToggle={() => setTerminalOpen((open) => !open)} bytes={bytes} filename={filename} />
        <Readiness m={m} bytes={bytes} filename={filename} />
      </div>
    </div>
  )
}

/* ---------- explorer ---------- */

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="size-8 shrink-0">
      <rect width="32" height="32" rx="7" fill="#1B2230" />
      <circle cx="16" cy="16" r="10" fill="#F3EEE6" />
      <circle cx="16" cy="16" r="7.6" fill="#8E5227" />
      <path d="M16 10.4c-1.6 0-2.8 1-2.8 2.3 0 1.5 2.8 3.1 2.8 3.1s2.8-1.6 2.8-3.1c0-1.3-1.2-2.3-2.8-2.3z" fill="#F7EEDF" />
      <ellipse cx="16" cy="18" rx="3.8" ry="1.2" fill="#F7EEDF" />
      <ellipse cx="16" cy="20.2" rx="2.6" ry="1" fill="#F7EEDF" />
    </svg>
  )
}

function Modified({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[#B35C00]" />
      <span className="sr-only">{label}</span>
    </>
  )
}

function targetingChanged(m: MuseStudio) {
  return CONTROL_ROWS.some((row) => m.settings[row.key] !== m.output.settings[row.key])
}

function briefChanged(m: MuseStudio) {
  return m.settings.brief.trim() !== m.output.settings.brief.trim()
}

function Explorer({ m, openFile, onOpen }: { m: MuseStudio; openFile: FileId; onOpen: (file: FileId) => void }) {
  const item = `flex min-h-10 shrink-0 touch-manipulation items-center gap-2 rounded-[4px] px-2.5 text-left text-[13px] transition-colors hover:bg-[#F2F4F7] xl:min-h-8 xl:px-2 ${ring}`
  return (
    <nav aria-label="Project files" className="flex min-w-0 flex-col bg-white md:col-span-2 xl:col-span-1 xl:row-span-2">
      <h2 className="hidden h-10 items-center border-b border-[#D9DEE5] px-3 text-[12px] font-semibold text-[#5A6475] xl:flex">
        Explorer
      </h2>
      <ul className={`${code} ab-scroll flex min-w-0 gap-1 overflow-x-auto px-2 py-2 xl:flex-col xl:gap-0.5 xl:overflow-visible xl:py-3`}>
        <li className="hidden items-center gap-1.5 px-2 pb-1 text-[12px] text-[#5A6475] xl:flex">
          <FolderOpen aria-hidden className="size-3.5" />
          brightline-barista
        </li>
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => onOpen("brief")}
            aria-current={openFile === "brief" ? "true" : undefined}
            className={`${item} w-full xl:pl-5 ${openFile === "brief" ? "bg-[#F2F4F7] font-medium" : ""}`}
          >
            <FileText aria-hidden className="size-3.5 text-[#5A6475]" />
            brief.md
            {briefChanged(m) ? <Modified label="edited since the last run" /> : null}
          </button>
        </li>
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => onOpen("targeting")}
            aria-current={openFile === "targeting" ? "true" : undefined}
            className={`${item} w-full xl:pl-5 ${openFile === "targeting" ? "bg-[#F2F4F7] font-medium" : ""}`}
          >
            <Braces aria-hidden className="size-3.5 text-[#B35C00]" />
            targeting.json
            {targetingChanged(m) ? <Modified label="edited since the last run" /> : null}
          </button>
        </li>
        <li className="hidden items-center gap-1.5 px-2 pt-2 pb-1 pl-5 text-[12px] text-[#5A6475] xl:flex">
          <FolderOpen aria-hidden className="size-3.5" />
          routes
        </li>
        {VARIANT_IDS.map((id) => {
          const active = m.selected === id
          return (
            <li key={id} className="shrink-0">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => m.select(id)}
                className={`${item} w-full xl:items-start xl:py-1.5 xl:pl-8 ${active ? "bg-[#E8EEFB] text-[#1B2230] hover:bg-[#E8EEFB]" : ""}`}
              >
                <FileCode aria-hidden className={`size-3.5 shrink-0 xl:mt-0.5 ${active ? "text-[#2553C7]" : "text-[#5A6475]"}`} />
                <span className="min-w-0">
                  <span className="block">
                    <span className="xl:hidden">routes/</span>
                    {id}.tsx
                  </span>
                  <span className={`${ui.className} hidden truncate text-[12px] text-[#5A6475] xl:block`}>{m.output.variants[id].name}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className={`${code} border-t border-[#D9DEE5] px-3 py-2.5 text-[11.5px] leading-5 xl:mt-auto xl:py-3`}>
        <p style={{ color: C.comment }}>{"// muse.config"}</p>
        <p className="flex flex-wrap gap-x-2">
          <span style={{ color: C.key }}>model</span>
          <span style={{ color: C.string }}>&quot;{m.modelName}&quot;</span>
        </p>
        <p className="flex flex-wrap gap-x-2">
          <span style={{ color: C.key }}>chain</span>
          <span className="min-w-0 [overflow-wrap:anywhere]" style={{ color: C.string }}>
            &quot;{m.chain}&quot;
          </span>
        </p>
      </div>
    </nav>
  )
}

/* ---------- editors ---------- */

function FileTab({ name, icon: Icon, iconColor, changed, children }: { name: string; icon: typeof FileText; iconColor: string; changed: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-10 items-center gap-2 border-b border-[#D9DEE5] bg-[#F7F8FA] pr-2">
      <h2 className={`${code} flex h-10 items-center gap-2 border-r border-[#D9DEE5] bg-white px-3 text-[12px] font-medium`}>
        <Icon aria-hidden className="size-3.5" style={{ color: iconColor }} />
        {name}
        {changed ? <Modified label="edited since the last run" /> : null}
      </h2>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  )
}

function Editors({ m, onFocusFile }: { m: MuseStudio; onFocusFile: (file: FileId) => void }) {
  const length = m.settings.brief.trim().length
  return (
    <section aria-label="Open files" className="flex min-w-0 flex-col gap-px bg-[#D9DEE5] xl:col-start-2 xl:row-start-1 xl:overflow-y-auto ab-scroll">
      <div className="bg-white" onFocus={() => onFocusFile("brief")}>
        <FileTab name="brief.md" icon={FileText} iconColor={C.muted} changed={briefChanged(m)} />
        <label htmlFor="ab-brief" className="sr-only">
          Launch brief
        </label>
        <textarea
          id="ab-brief"
          name="brief"
          value={m.settings.brief}
          onChange={(event) => m.setBrief(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              m.generate()
            }
          }}
          rows={7}
          spellCheck
          aria-invalid={m.issue ? true : undefined}
          aria-describedby="ab-brief-meta"
          className="ab-caret block w-full resize-none bg-white px-4 py-3 text-base leading-[1.55] text-[#1B2230] outline-none placeholder:text-[#6B7686] focus-visible:bg-[#FBFCFE] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2553C7] xl:text-[14px]"
          placeholder="What is launching, for whom, and by when…"
        />
        <div id="ab-brief-meta" className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 border-t border-[#D9DEE5] px-4 py-2 text-[12px]">
          <span className="min-w-0 flex-1" style={{ color: m.issue ? C.error : C.muted }}>
            {m.issue ?? "Ctrl or ⌘ + Enter runs Generate."}
          </span>
          <span className={`${code} tabular-nums`} style={{ color: length > BRIEF_MAX ? C.error : C.muted }}>
            {length}/{BRIEF_MAX}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-white" onFocus={() => onFocusFile("targeting")}>
        <FileTab name="targeting.json" icon={Braces} iconColor={C.number} changed={targetingChanged(m)}>
          <button type="button" onClick={m.reset} className={`${btn} min-h-10 px-2 text-[12px] font-medium text-[#5A6475] hover:bg-white hover:text-[#1B2230] xl:min-h-7`}>
            <RotateCcw aria-hidden className="size-3.5" />
            Reset to defaults
          </button>
        </FileTab>
        <TargetingJson m={m} />
      </div>
    </section>
  )
}

function TargetingJson({ m }: { m: MuseStudio }) {
  return (
    <div className={`${code} px-4 py-3 text-[13px] leading-7`}>
      <p style={{ color: C.muted }}>{"{"}</p>
      {CONTROL_ROWS.map((row, index) => {
        const option = row.options.find((candidate) => candidate.id === m.settings[row.key]) ?? row.options[0]
        const note = row.key === "audience" && option.size ? `${formatReach(option.size)} reachable, ${option.hint}` : option.hint
        return (
          <div key={row.key} className="pl-4">
            <div className="flex flex-wrap items-center gap-x-1">
              <label htmlFor={`ab-${row.key}`} style={{ color: C.key }}>
                &quot;{row.key}&quot;
              </label>
              <span aria-hidden style={{ color: C.muted }}>
                :
              </span>
              <span className="relative inline-flex max-w-full items-center">
                <select
                  id={`ab-${row.key}`}
                  value={m.settings[row.key]}
                  onChange={(event) => m.setControl(row.key, event.target.value)}
                  className={`min-h-10 max-w-full cursor-pointer appearance-none truncate rounded-[3px] border-b border-dashed border-[#1A7F5A]/60 py-0 pr-5 pl-1 text-base transition-colors hover:bg-[#EEF6F2] xl:min-h-0 xl:text-[13px] ${ring}`}
                  style={{ backgroundColor: "#FFFFFF", color: C.string }}
                >
                  {row.options.map((candidate) => (
                    <option key={candidate.id} value={candidate.id} style={{ backgroundColor: "#FFFFFF", color: C.ink }}>
                      &quot;{candidate.label}&quot;
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute right-0.5 size-3.5 text-[#1A7F5A]" />
              </span>
              <span aria-hidden style={{ color: C.muted }}>
                {index < CONTROL_ROWS.length - 1 ? "," : ""}
              </span>
            </div>
            {note ? (
              <p className="text-[12px] leading-5" style={{ color: C.comment }}>
                {`// ${note}`}
              </p>
            ) : null}
          </div>
        )
      })}
      <p style={{ color: C.muted }}>{"}"}</p>
    </div>
  )
}

/* ---------- preview ---------- */

function Preview({
  m,
  view,
  onView,
  html,
  bytes,
  filename,
}: {
  m: MuseStudio
  view: "preview" | "source"
  onView: (view: "preview" | "source") => void
  html: string
  bytes: number
  filename: string
}) {
  const [copied, setCopied] = useState(false)
  const lines = useMemo(() => html.split("\n"), [html])
  const format = formats[m.output.settings.channel] ?? formats.reels
  const over = isOver(bytes)

  const tab = (id: "preview" | "source", label: string) => (
    <button
      key={id}
      type="button"
      role="tab"
      id={`ab-tab-${id}`}
      aria-selected={view === id}
      aria-controls="ab-panel"
      tabIndex={view === id ? 0 : -1}
      onClick={() => onView(id)}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
        event.preventDefault()
        const next = id === "preview" ? "source" : "preview"
        onView(next)
        document.getElementById(`ab-tab-${next}`)?.focus()
      }}
      className={`min-h-10 touch-manipulation rounded-[4px] px-2.5 text-[12px] font-medium transition-colors xl:min-h-7 ${ring} ${
        view === id ? "bg-white text-[#1B2230] shadow-[0_1px_2px_rgba(27,34,48,0.14)]" : "text-[#5A6475] hover:text-[#1B2230]"
      }`}
    >
      {label}
    </button>
  )

  return (
    <section aria-label="Artifact" className="flex min-w-0 flex-col bg-white xl:col-start-3 xl:row-start-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-[#D9DEE5] bg-[#F7F8FA] px-2 py-1.5">
        <div role="tablist" aria-label="Artifact view" className="flex items-center gap-1 rounded-[5px] bg-[#EBEEF2] p-0.5">
          {tab("preview", "Rendered")}
          {tab("source", "Source")}
        </div>
        <p className={`${code} min-w-0 truncate text-[12px] text-[#5A6475]`} translate="no">
          {filename}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`${code} tabular-nums text-[12px] ${over ? "font-semibold" : ""}`}
            style={{ color: over ? C.error : C.muted }}
          >
            {kb(bytes)} / {kb(BUDGET_BYTES)}
          </span>
          <button
            type="button"
            onClick={() => {
              const done = () => {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1400)
              }
              if (!navigator.clipboard) return
              navigator.clipboard
                .writeText(html)
                .then(done)
                .catch(() => setCopied(false))
            }}
            className={`${btn} min-h-10 px-2 text-[12px] font-medium text-[#5A6475] hover:bg-white hover:text-[#1B2230] xl:min-h-7`}
          >
            {copied ? <CircleCheck aria-hidden className="size-3.5 text-[#1A7F5A]" /> : <FileCode aria-hidden className="size-3.5" />}
            {copied ? "Copied" : "Copy HTML"}
          </button>
        </div>
      </div>

      <div
        id="ab-panel"
        role="tabpanel"
        aria-labelledby={`ab-tab-${view}`}
        className="ab-scroll ab-grid flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        {m.stale ? (
          <p className="flex items-center gap-2 border-b border-[#E4C48A] bg-[#FDF6E7] px-3 py-2 text-[13px] text-[#6B4A00]">
            <CircleAlert aria-hidden className="size-4 shrink-0" />
            Targeting changed since run {m.output.run}. Generate again and this file and its forecast will be rebuilt.
          </p>
        ) : null}

        {view === "preview" ? (
          <div className="flex flex-1 items-start justify-center bg-[#EEF1F4] px-4 py-5 xl:items-center xl:px-6">
            <div className="w-full min-w-0 max-w-[540px]">
              {/*
                The generated creative. Every text node is escaped through esc() and the
                only markup is the fixed markup produced here, so this renders inline
                rather than in a frame — the brief is data, not markup.
              */}
              <div key={`${m.output.run}-${m.selected}`} className="ab-reveal" dangerouslySetInnerHTML={{ __html: adMarkup(m.output, m.current, spec.product, "p") }} />
              <p className={`${code} mt-3 text-center text-[11.5px] text-[#5A6475]`}>{format.label}</p>
            </div>
          </div>
        ) : (
          <div className={`${code} ab-scroll min-h-0 flex-1 overflow-auto bg-[#FBFCFD] py-3 text-[12.5px] leading-6`}>
            {lines.map((line, index) => (
              <div key={index} className="ab-line flex gap-3 px-3">
                <span aria-hidden className="w-6 shrink-0 select-none text-right text-[11px] tabular-nums text-[#A8B0BC]">
                  {index + 1}
                </span>
                <code className="min-w-0 whitespace-pre [overflow-wrap:anywhere]">
                  {htmlTokens(line).map((token, tokenIndex) => (
                    <span key={tokenIndex} style={token.color ? { color: token.color } : undefined}>
                      {token.text}
                    </span>
                  ))}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- build log ---------- */

function Terminal({ m, open, onToggle, bytes, filename }: { m: MuseStudio; open: boolean; onToggle: () => void; bytes: number; filename: string }) {
  const tone = { info: C.muted, success: C.string, error: C.error }
  return (
    <section aria-label="Build log" className="flex min-w-0 flex-col bg-white xl:col-start-4 xl:row-start-1 xl:h-full">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="ab-log"
        className={`flex min-h-10 w-full touch-manipulation items-center gap-2 border-b border-[#D9DEE5] bg-[#F7F8FA] px-3 text-left text-[12px] font-semibold text-[#5A6475] transition-colors hover:text-[#1B2230] xl:min-h-10 ${ring}`}
      >
        <SquareTerminal aria-hidden className="size-3.5" />
        Build log
        <span className={`${code} ml-auto font-normal tabular-nums`}>{open ? "hide" : "show"}</span>
      </button>

      <div id="ab-log" className={`${code} ab-scroll min-h-0 flex-1 overflow-y-auto px-3 py-2 text-[12px] leading-6`}>
        {m.generateError || m.saveError || m.exportError ? (
          <div role="alert" className="mb-2 rounded-[4px] border border-[#E8BFBA] bg-[#FCF1F0] px-2.5 py-2">
            <p className="flex items-start gap-1.5 text-[12px] font-semibold" style={{ color: C.error }}>
              <CircleAlert aria-hidden className="mt-1 size-3.5 shrink-0" />
              {m.generateError ?? m.saveError ?? m.exportError}
            </p>
          </div>
        ) : null}

        <ol className={open ? undefined : "hidden"}>
          {m.log.map((entry) => (
            <li key={entry.id} className="ab-line flex flex-wrap gap-x-1.5">
              <span className="tabular-nums text-[#A8B0BC]">{entry.at}</span>
              <span className="min-w-0 [overflow-wrap:anywhere]" style={{ color: tone[entry.tone] }}>
                {entry.text}
              </span>
            </li>
          ))}
        </ol>

        {m.busy ? (
          <div className="mt-2 border-t border-dashed border-[#D9DEE5] pt-2">
            <p className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: C.key }}>
              <LoaderCircle aria-hidden className={spin} />
              {m.stageLabel}
            </p>
            <div
              role="progressbar"
              aria-label="Build progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={m.progress}
              className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#E4E8EE]"
            >
              <div className="h-full bg-[#2553C7] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${m.progress}%` }} />
            </div>
            <ol className="mt-1.5">
              {GENERATION_STAGES.map((label, index) => (
                <li key={label} className="flex items-center gap-1.5" style={{ color: index <= m.stage ? C.ink : "#A8B0BC" }}>
                  <span aria-hidden className="size-1 rounded-full" style={{ background: index <= m.stage ? C.key : "#C3CAD4" }} />
                  <span className="min-w-0 truncate">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        <dl className="mt-2 border-t border-dashed border-[#D9DEE5] pt-2 text-[11.5px]">
          <div className="flex gap-x-1.5">
            <dt className="text-[#A8B0BC]">out</dt>
            <dd className="min-w-0 truncate" style={{ color: C.ink }}>
              {filename}
            </dd>
          </div>
          <div className="flex gap-x-1.5">
            <dt className="text-[#A8B0BC]">size</dt>
            <dd className="tabular-nums" style={{ color: isOver(bytes) ? C.error : C.ink }}>
              {kb(bytes)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function isOver(bytes: number) {
  return bytes > BUDGET_BYTES
}

/* ---------- forecast + history ---------- */

const METRIC_ROWS: { key: "reach" | "ctr" | "conversion"; label: string; hint: string }[] = [
  { key: "reach", label: "Reach", hint: "accounts that could see this" },
  { key: "ctr", label: "CTR", hint: "tap-through on the call to action" },
  { key: "conversion", label: "Conversion", hint: "cartons ordered per 100 sessions" },
]

function Readiness({ m, bytes, filename }: { m: MuseStudio; bytes: number; filename: string }) {
  const format = formats[m.output.settings.channel] ?? formats.reels
  return (
    <section
      aria-label="Forecast and recent builds"
      className="flex min-w-0 flex-col gap-px bg-[#D9DEE5] md:col-span-2 xl:col-span-1 xl:col-start-4 xl:row-start-2 xl:overflow-y-auto"
    >
      <div className="bg-white px-3 py-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <h2 className="text-[12px] font-semibold text-[#5A6475]">Forecast · route {m.selected}</h2>
          <p className={`${code} text-[11px] text-[#5A6475]`}>simulated</p>
        </div>
        <dl className="mt-2 flex flex-col gap-1.5">
          {METRIC_ROWS.map((row) => {
            const value = m.current.metrics[row.key]
            const delta = formatDelta(value, m.previous?.metrics[row.key], row.key === "reach" ? "reach" : "percent")
            return (
              <div key={row.key} className="flex flex-wrap items-baseline gap-x-2">
                <dt className="text-[13px] font-medium">{row.label}</dt>
                <dd className={`${code} ml-auto tabular-nums text-[14px] font-semibold`}>
                  {row.key === "reach" ? formatReach(value) : formatPercent(value)}
                </dd>
                {delta ? (
                  <dd
                    className={`${code} w-full text-[11px] tabular-nums`}
                    style={{ color: delta.startsWith("+") ? C.string : delta.startsWith("−") ? C.error : C.muted }}
                  >
                    {delta} vs run {Math.max(1, m.output.run - 1)}
                    <span className="sr-only"> {row.hint}</span>
                  </dd>
                ) : (
                  <dd className={`${code} w-full text-[11px]`} style={{ color: C.muted }}>
                    {row.hint}
                  </dd>
                )}
              </div>
            )
          })}
        </dl>
        <p className="mt-2 border-t border-dashed border-[#D9DEE5] pt-2 text-[11.5px] text-[#5A6475]">
          {m.labelOf("audience")} · {format.label}. Figures are a local simulation, not a media plan.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-white px-3 py-2.5">
        <h2 className="flex items-center gap-1.5 text-[12px] font-semibold text-[#5A6475]">
          <History aria-hidden className="size-3.5" />
          Recent builds
        </h2>
        <ul className="mt-1.5 flex flex-col gap-0.5">
          {m.recent.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => m.restore(item)}
                className={`flex min-h-10 w-full touch-manipulation items-center gap-2 rounded-[4px] px-2 py-1.5 text-left text-[12.5px] transition-colors hover:bg-[#F2F4F7] xl:min-h-0 ${ring}`}
              >
                <span aria-hidden className={`${code} w-4 shrink-0 text-center text-[11px] font-semibold text-[#2553C7]`}>
                  {item.variant}
                </span>
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span className={`${code} shrink-0 text-[11px] tabular-nums text-[#5A6475]`}>{item.when}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[#D9DEE5] pt-2">
          <label htmlFor="ab-failnext" className="flex min-h-10 min-w-0 flex-1 cursor-pointer items-center gap-2 text-[12px] xl:min-h-0">
            <input
              id="ab-failnext"
              type="checkbox"
              checked={m.failNext}
              onChange={(event) => m.setFailNext(event.target.checked)}
              className="size-4 shrink-0 accent-[#C0362C]"
            />
            <span className="min-w-0">Fail the next build (forecast outage)</span>
          </label>
          <span className={`${code} flex items-center gap-1 text-[11px] text-[#5A6475]`}>
            <Gauge aria-hidden className="size-3.5" />
            <span className="tabular-nums">{kb(bytes)}</span>
            <span className="sr-only">{filename}</span>
          </span>
        </div>
      </div>
    </section>
  )
}

