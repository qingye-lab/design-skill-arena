"use client"

import { Mona_Sans } from "next/font/google"
import {
  Check,
  ChevronRight,
  Download,
  LoaderCircle,
  Mail,
  Monitor,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  TriangleAlert,
  Undo2,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import {
  BRIEF_MAX,
  GENERATION_STAGES,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type LogEntry,
  type MuseStudio,
  type RenderedVariant,
  type StudioSpec,
  type VariantId,
} from "./core"

/* One variable family. Width does the hierarchy work: semi-condensed for dense labels, wide for the ad headline. */
const mona = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "standard-impeccable",
  product: "Arc",
  brief:
    "Launch Arc, a smart desk lamp that tunes its colour temperature from 2700K to 5600K through the day. Reach people who work from home before the November pre-order window closes.",
  audiences: [
    { id: "home", label: "Home-office workers", hint: "Spare rooms and kitchen tables", size: 1620000, lift: { ctr: 1.02 } },
    { id: "designers", label: "Designers and illustrators", hint: "Colour-critical desk work", size: 610000, lift: { ctr: 1.14, conversion: 1.12 } },
    { id: "students", label: "Students in shared rooms", hint: "Late study, small desks", size: 2100000, lift: { ctr: 0.96, conversion: 0.78 } },
  ],
  channels: [
    { id: "feed", label: "Instagram feed", hint: "1080 × 1350", lift: { reach: 1.18 } },
    { id: "hero", label: "Product page hero", hint: "1920 × 1080", lift: { reach: 0.52, ctr: 1.6, conversion: 1.3 } },
    { id: "newsletter", label: "Design newsletter", hint: "600 px email", lift: { reach: 0.36, ctr: 2.2, conversion: 1.18 } },
  ],
  tones: [
    { id: "calm", label: "Calm", lift: { conversion: 1.04 } },
    { id: "precise", label: "Precise", lift: { ctr: 0.97, conversion: 1.1 } },
    { id: "witty", label: "Witty", lift: { ctr: 1.12, conversion: 0.95 } },
  ],
  styles: [
    { id: "warm", label: "Warm 2700K", lift: { ctr: 1.06 } },
    { id: "neutral", label: "Neutral 4000K", lift: { conversion: 1.03 } },
    { id: "daylight", label: "Daylight 5600K", lift: { reach: 1.03, ctr: 0.98 } },
  ],
  variants: [
    {
      id: "A",
      name: "Follows the day",
      headline: "Light that knows what time it is.",
      body: "{product} moves from 5600K focus light at noon to 2700K warmth by evening, on its own. Made for {audience}.",
      cta: "Pre-order Arc",
      lift: { ctr: 1.05 },
    },
    {
      id: "B",
      name: "One clean arc",
      headline: "One arc of aluminium. No clutter.",
      body: "A single curved arm, a 14 cm base and a touch strip. {product} leaves the desk to your work.",
      cta: "See the design",
      lift: { reach: 1.07, conversion: 0.95 },
    },
    {
      id: "C",
      name: "Easy on late eyes",
      headline: "Late nights, easier on the eyes.",
      body: "Flicker-free CRI 97 light with a warm floor that dims to 2%. Set it once and {product} remembers.",
      cta: "Try it for 30 nights",
      lift: { ctr: 0.95, conversion: 1.14 },
    },
  ],
  recent: [
    { id: "r1", title: "Arc Mini teaser", variant: "A", when: "Mon" },
    { id: "r2", title: "Back-to-desk sale", variant: "B", when: "9 Sep" },
    { id: "r3", title: "Studio lighting guide", variant: "C", when: "28 Aug" },
  ],
  initialRun: 5,
}

/* ---------- light temperature (drives the preview scene) ---------- */

type Temp = {
  light: string
  wall: string
  wallTop: string
  desk: string
  paper: string
  ink: string
  sub: string
  ctaInk: string
}

const temps: Record<string, Temp> = {
  warm: { light: "#FFB866", wall: "#1A140F", wallTop: "#0D0A07", desk: "#2B2016", paper: "#F2D6B3", ink: "#F8EEE2", sub: "#D6C4AE", ctaInk: "#1C1206" },
  neutral: { light: "#FFE6C2", wall: "#16171A", wallTop: "#0B0C0E", desk: "#27251F", paper: "#ECE5D8", ink: "#F3F1EC", sub: "#C6C1B7", ctaInk: "#17140E" },
  daylight: { light: "#EAF2FF", wall: "#12161D", wallTop: "#090C11", desk: "#1F242C", paper: "#E4EAF3", ink: "#EEF2F8", sub: "#B7C1CF", ctaInk: "#0E131A" },
}

const channelIcon: Record<string, typeof Save> = { feed: Smartphone, hero: Monitor, newsletter: Mail }

/* ---------- state model ---------- */

type Phase = "idle" | "pending" | "done" | "error"

const genPhase = (s: MuseStudio["generateStatus"]): Phase =>
  s === "loading" ? "pending" : s === "success" ? "done" : s === "error" ? "error" : "idle"
const savePhase = (s: MuseStudio["saveStatus"]): Phase =>
  s === "saving" ? "pending" : s === "saved" ? "done" : s === "error" ? "error" : "idle"
const exportPhase = (s: MuseStudio["exportStatus"]): Phase =>
  s === "exporting" ? "pending" : s === "exported" ? "done" : s === "error" ? "error" : "idle"

type RunTone = "fresh" | "stale" | "busy" | "failed" | "blocked"

function runStatus(m: MuseStudio): { tone: RunTone; text: string; detail: string } {
  const run = m.output.run
  if (m.busy)
    return { tone: "busy", text: `Run ${run + 1} · generating`, detail: `${m.stage + 1}/${GENERATION_STAGES.length} ${m.stageLabel}` }
  if (m.generateStatus === "error" && !m.issue)
    return { tone: "failed", text: `Run ${run + 1} failed`, detail: `showing run ${run}` }
  if (m.generateStatus === "error") return { tone: "blocked", text: `Run ${run} · brief needs work`, detail: "fix it to generate" }
  if (m.stale) return { tone: "stale", text: `Run ${run} · settings changed`, detail: "preview is out of date" }
  return { tone: "fresh", text: `Run ${run} · fresh`, detail: `generated ${m.output.at}` }
}

/* ---------- page ---------- */

export default function StandardImpeccable() {
  const m = useMuseStudio(spec)
  const { save } = m
  const status = runStatus(m)
  const savedCount = m.recent.filter((item) => item.saved).length

  // Ctrl/Cmd+S saves from anywhere on the page, matching the hint in the status bar.
  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "s") {
        event.preventDefault()
        save()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [save])

  return (
    <div
      className={`${mona.className} flex min-h-screen flex-col bg-[#0C0F13] text-[#E6E9EE] antialiased [color-scheme:dark] [scrollbar-color:#262C36_#0C0F13] accent-[#F0B44C] caret-[#F0B44C] selection:bg-[#F0B44C]/30 selection:text-white`}
    >
      <style>{`
        @keyframes si-toast-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .si-toast { animation: si-toast-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) { .si-toast { animation: none; } }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[#262C36] bg-[#0C0F13]">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-5">
          <ArcMark />
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex min-w-0 items-center gap-1.5 text-[13.5px]">
              <li className="hidden text-[#97A0AE] sm:block">Muse</li>
              <li aria-hidden className="hidden text-[#97A0AE] sm:block">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="hidden text-[#97A0AE] md:block">Campaigns</li>
              <li aria-hidden className="hidden text-[#97A0AE] md:block">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="min-w-0">
                <h1 aria-current="page" className="truncate font-semibold">
                  Arc desk lamp launch
                </h1>
              </li>
            </ol>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <StateButton
              phase={savePhase(m.saveStatus)}
              icon={Save}
              labels={{ idle: "Save", pending: "Saving", done: "Saved", error: "Save failed" }}
              onClick={m.save}
              variant="secondary"
              compact
              keyshortcuts="Control+S"
            />
            <StateButton
              phase={exportPhase(m.exportStatus)}
              icon={Download}
              labels={{ idle: "Export", pending: "Exporting", done: "Exported", error: m.stale ? "Export blocked" : "Export failed" }}
              onClick={() => m.exportCampaign()}
              variant="solid"
              compact
            />
          </div>
        </div>
        {(m.saveStatus === "error" && m.saveError) || (m.exportStatus === "error" && m.exportError) ? (
          <div className="border-t border-[#F07166]/30 bg-[#F07166]/10 px-4 py-2 lg:px-5">
            {m.saveStatus === "error" && m.saveError && (
              <p role="alert" className="flex items-start gap-2 text-[13px] text-[#F07166]">
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                {m.saveError}
              </p>
            )}
            {m.exportStatus === "error" && m.exportError && (
              <p role="alert" className="flex items-start gap-2 text-[13px] text-[#F07166]">
                <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                {m.exportError}
              </p>
            )}
          </div>
        ) : null}
      </header>

      <main className="grid flex-1 items-start gap-4 p-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-5 xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        <FormPanel m={m} />
        <PreviewPanel m={m} status={status} />
        <MetricsRail m={m} />
        <RecentPanel m={m} />
      </main>

      <footer className="sticky bottom-0 z-30 border-t border-[#262C36] bg-[#0C0F13]">
        <div className="flex min-h-8 flex-wrap items-center gap-x-5 gap-y-0.5 px-4 py-1.5 text-[12px] text-[#97A0AE] font-stretch-semi-condensed lg:px-5">
          <p>
            Built by <span className="font-semibold text-[#E6E9EE]">{m.modelName}</span>
            <span aria-hidden> · </span>
            <span className="sr-only">with </span>
            {m.chain}
          </p>
          <p className="hidden tabular-nums sm:block">
            {savedCount === 0 ? "No campaigns saved in this browser yet" : `${savedCount} saved in this browser`}
          </p>
          <p className="ml-auto hidden items-center gap-3 md:flex">
            <span className="flex items-center gap-1">
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
              <span className="ml-1">Generate</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>Ctrl</Kbd>
              <Kbd>S</Kbd>
              <span className="ml-1">Save</span>
            </span>
          </p>
        </div>
      </footer>

      <ToastStack log={m.log} />
    </div>
  )
}

/* ---------- shared primitives ---------- */

const panel = "min-w-0 rounded-xl border border-[#262C36] bg-[#12161C]"
const labelText = "block text-[12.5px] font-medium text-[#97A0AE] font-stretch-semi-condensed"
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0B44C]"

function ArcMark() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className="size-7 shrink-0">
      <rect width="28" height="28" rx="7" fill="#1A1F27" />
      <path d="M8.5 22 C 8 13.5, 12 8.5, 18 8.6" fill="none" stroke="#F0B44C" strokeWidth="2" strokeLinecap="round" />
      <rect x="15.6" y="7.3" width="7" height="3" rx="1.5" transform="rotate(8 19 8.8)" fill="#F0B44C" />
      <path d="M17 12 L 14.5 19 H 23.5 L 21 12 Z" fill="#F0B44C" opacity="0.18" />
      <rect x="5.5" y="21.4" width="6" height="1.8" rx="0.9" fill="#97A0AE" />
    </svg>
  )
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-[#262C36] bg-[#1A1F27] px-1 font-sans text-[11px] font-medium text-[#C3CAD4] font-stretch-semi-condensed">
      {children}
    </kbd>
  )
}

function StateButton({
  phase,
  icon: Icon,
  labels,
  onClick,
  variant,
  compact,
  keyshortcuts,
  detail,
  className = "",
}: {
  phase: Phase
  icon: typeof Save
  labels: Record<Phase, string>
  onClick: () => void
  variant: "primary" | "secondary" | "solid"
  compact?: boolean
  keyshortcuts?: string
  detail?: ReactNode
  className?: string
}) {
  const PhaseIcon = phase === "pending" ? LoaderCircle : phase === "done" ? Check : phase === "error" ? TriangleAlert : Icon
  const idle = {
    primary: "bg-[#F0B44C] text-[#0C0F13] hover:bg-[#F6C56C] active:bg-[#E3A53A]",
    secondary: "border border-[#262C36] bg-[#12161C] text-[#E6E9EE] hover:border-[#343C48] hover:bg-[#1A1F27]",
    solid: "bg-[#E6E9EE] text-[#0C0F13] hover:bg-white active:bg-[#D3D8DF]",
  }[variant]
  const pending = {
    primary: "bg-[#F0B44C]/75 text-[#0C0F13]",
    secondary: "border border-[#262C36] bg-[#1A1F27] text-[#C3CAD4]",
    solid: "bg-[#E6E9EE]/75 text-[#0C0F13]",
  }[variant]
  const tone =
    phase === "done"
      ? "border border-[#5CC38A]/40 bg-[#5CC38A]/12 text-[#5CC38A] hover:bg-[#5CC38A]/18"
      : phase === "error"
        ? "border border-[#F07166]/50 bg-[#F07166]/12 text-[#F07166] hover:bg-[#F07166]/18"
        : phase === "pending"
          ? pending
          : idle
  const size = compact
    ? "size-10 px-0 sm:h-9 sm:w-auto sm:px-3"
    : "h-11 w-full px-4"
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={phase === "pending"}
      aria-keyshortcuts={keyshortcuts}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-[13.5px] font-semibold transition-colors duration-150 disabled:cursor-progress ${focusRing} ${size} ${tone} ${className}`}
    >
      <PhaseIcon aria-hidden className={`size-4 shrink-0 ${phase === "pending" ? "animate-spin motion-reduce:animate-none" : ""}`} />
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>{labels[phase]}</span>
      {detail}
    </button>
  )
}

/* ---------- form ---------- */

function FormPanel({ m }: { m: MuseStudio }) {
  const length = m.settings.brief.trim().length
  const audience = spec.audiences.find((option) => option.id === m.settings.audience)
  const phase = genPhase(m.generateStatus)
  const generateLabels: Record<Phase, string> = {
    idle: "Generate",
    pending: `Generating ${m.stage + 1}/${GENERATION_STAGES.length}`,
    done: `Generated run ${m.output.run}`,
    error: m.issue ? "Fix the brief to generate" : "Retry generate",
  }

  function onBriefKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      m.generate()
    }
  }

  return (
    <section aria-labelledby="si-form-title" className={`${panel} p-4 lg:row-span-3 xl:row-span-2`}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="si-form-title" className="text-[15px] font-semibold">
          Brief and targeting
        </h2>
        <button
          type="button"
          onClick={m.reset}
          className={`inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-[12.5px] text-[#97A0AE] transition-colors hover:bg-[#1A1F27] hover:text-[#E6E9EE] lg:h-8 ${focusRing}`}
        >
          <Undo2 aria-hidden className="size-3.5" />
          Reset
        </button>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <label htmlFor="si-brief" className={labelText}>
          Launch brief
        </label>
        <span className="hidden items-center gap-1 text-[11px] text-[#97A0AE] sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>Enter</Kbd>
          <span className="sr-only">generates</span>
        </span>
      </div>
      <textarea
        id="si-brief"
        value={m.settings.brief}
        onChange={(event) => m.setBrief(event.target.value)}
        onKeyDown={onBriefKey}
        rows={5}
        aria-keyshortcuts="Control+Enter"
        aria-invalid={m.issue ? true : undefined}
        aria-describedby="si-brief-help"
        className="mt-1.5 block w-full resize-y rounded-lg border border-[#262C36] bg-[#0C0F13] px-3 py-2.5 text-base leading-[1.5] text-[#E6E9EE] transition-colors placeholder:text-[#97A0AE] hover:border-[#343C48] focus-visible:border-[#F0B44C] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0B44C]/20 aria-invalid:border-[#F07166]/70 lg:text-[14px]"
      />
      <p
        id="si-brief-help"
        className={`mt-1.5 flex justify-between gap-3 text-[12px] leading-snug font-stretch-semi-condensed ${m.issue ? "text-[#F07166]" : "text-[#97A0AE]"}`}
      >
        <span>{m.issue ?? "Product, audience and the date that matters."}</span>
        <span className="shrink-0 tabular-nums">
          {length}/{BRIEF_MAX}
        </span>
      </p>

      <div className="mt-4 grid gap-4 border-t border-[#262C36] pt-4">
        <div>
          <label htmlFor="si-audience" className={labelText}>
            Audience
          </label>
          <select
            id="si-audience"
            value={m.settings.audience}
            onChange={(event) => m.setControl("audience", event.target.value)}
            aria-describedby="si-audience-hint"
            className="mt-1.5 h-10 w-full rounded-lg border border-[#262C36] bg-[#0C0F13] px-2.5 text-base text-[#E6E9EE] transition-colors hover:border-[#343C48] focus-visible:border-[#F0B44C] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F0B44C]/20 lg:text-[14px]"
          >
            {spec.audiences.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p id="si-audience-hint" className="mt-1 text-[12px] text-[#97A0AE] font-stretch-semi-condensed">
            {audience?.hint} · <span className="tabular-nums">{formatReach(audience?.size ?? 0)}</span> reachable
          </p>
        </div>

        <fieldset>
          <legend className={labelText}>Channel</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            {spec.channels.map((option) => {
              const Icon = channelIcon[option.id] ?? Smartphone
              return (
                <label key={option.id} className="block min-w-0">
                  <input
                    type="radio"
                    name="si-channel"
                    value={option.id}
                    checked={m.settings.channel === option.id}
                    onChange={() => m.setControl("channel", option.id)}
                    className="peer sr-only"
                  />
                  <span className="flex h-[66px] cursor-pointer flex-col items-start justify-between rounded-lg border border-[#262C36] bg-[#0C0F13] p-2 text-[12.5px] leading-tight text-[#97A0AE] transition-colors duration-150 hover:border-[#343C48] hover:text-[#E6E9EE] peer-checked:border-[#F0B44C]/70 peer-checked:bg-[#F0B44C]/8 peer-checked:text-[#E6E9EE] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#F0B44C]">
                    <Icon aria-hidden className="size-4" />
                    <span className="font-medium font-stretch-semi-condensed">{option.label}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelText}>Tone</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-[#0C0F13] p-1">
            {spec.tones.map((option) => (
              <label key={option.id} className="block">
                <input
                  type="radio"
                  name="si-tone"
                  value={option.id}
                  checked={m.settings.tone === option.id}
                  onChange={() => m.setControl("tone", option.id)}
                  className="peer sr-only"
                />
                <span className="flex h-10 cursor-pointer items-center justify-center rounded-md text-[13px] font-medium text-[#97A0AE] transition-colors duration-150 hover:text-[#E6E9EE] peer-checked:bg-[#1A1F27] peer-checked:text-[#E6E9EE] peer-checked:shadow-[0_1px_2px_rgba(0,0,0,0.45)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-[#F0B44C] lg:h-8">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelText}>Light temperature</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            {spec.styles.map((option) => {
              const t = temps[option.id]
              return (
                <label key={option.id} className="block min-w-0">
                  <input
                    type="radio"
                    name="si-style"
                    value={option.id}
                    checked={m.settings.style === option.id}
                    onChange={() => m.setControl("style", option.id)}
                    className="peer sr-only"
                  />
                  <span className="block cursor-pointer rounded-lg border border-[#262C36] p-1.5 text-[12px] text-[#97A0AE] transition-colors duration-150 hover:border-[#343C48] hover:text-[#E6E9EE] peer-checked:border-[#F0B44C]/70 peer-checked:text-[#E6E9EE] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#F0B44C]">
                    <span
                      aria-hidden
                      className="block h-7 rounded-md"
                      style={{ background: `radial-gradient(70% 120% at 50% 0%, ${t.light}, ${t.wall} 78%)` }}
                    />
                    <span className="mt-1 block truncate text-center font-medium tabular-nums font-stretch-semi-condensed">{option.label}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 border-t border-[#262C36] pt-4">
        <StateButton
          phase={phase}
          icon={m.stale ? RotateCcw : Sparkles}
          labels={generateLabels}
          onClick={m.generate}
          variant="primary"
          keyshortcuts="Control+Enter"
        />
        <label className="mt-2 flex min-h-10 cursor-pointer items-center gap-2.5 text-[12.5px] text-[#97A0AE]">
          <input
            type="checkbox"
            checked={m.failNext}
            onChange={(event) => m.setFailNext(event.target.checked)}
            className={`size-4 shrink-0 rounded border-[#262C36] ${focusRing}`}
          />
          Simulate a forecast outage on the next run
        </label>
        {m.generateStatus === "error" && m.generateError && (
          <div role="alert" className="mt-1 rounded-lg border border-[#F07166]/40 bg-[#F07166]/10 p-3 text-[13px] leading-snug">
            <p className="flex items-start gap-2 text-[#F07166]">
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {m.generateError}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- preview ---------- */

const statusDot: Record<RunTone, string> = {
  fresh: "bg-[#5CC38A]",
  stale: "bg-[#F0B44C]",
  busy: "bg-[#F0B44C]",
  failed: "bg-[#F07166]",
  blocked: "bg-[#F07166]",
}

function PreviewPanel({ m, status }: { m: MuseStudio; status: ReturnType<typeof runStatus> }) {
  const t = temps[m.output.settings.style] ?? temps.warm
  const channel = spec.channels.find((option) => option.id === m.output.settings.channel) ?? spec.channels[0]

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, id: VariantId) {
    const index = VARIANT_IDS.indexOf(id)
    const target =
      event.key === "ArrowRight"
        ? (index + 1) % VARIANT_IDS.length
        : event.key === "ArrowLeft"
          ? (index + VARIANT_IDS.length - 1) % VARIANT_IDS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? VARIANT_IDS.length - 1
              : -1
    if (target < 0) return
    event.preventDefault()
    const next = VARIANT_IDS[target]
    m.select(next)
    document.getElementById(`si-tab-${next}`)?.focus()
  }

  return (
    <section aria-labelledby="si-preview-title" className={`${panel} lg:col-start-2 xl:row-start-1`}>
      <h2 id="si-preview-title" className="sr-only">
        Preview
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#262C36] px-3 py-2.5 sm:px-4">
        <div role="tablist" aria-label="Campaign routes" className="flex gap-1 rounded-lg bg-[#0C0F13] p-1">
          {VARIANT_IDS.map((id) => {
            const on = m.selected === id
            return (
              <button
                key={id}
                id={`si-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="si-preview-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => m.select(id)}
                onKeyDown={(event) => onTabKey(event, id)}
                className={`flex h-10 items-center gap-2 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-150 lg:h-9 ${focusRing} ${
                  on ? "bg-[#1A1F27] text-[#E6E9EE] shadow-[0_1px_2px_rgba(0,0,0,0.45)]" : "text-[#97A0AE] hover:text-[#E6E9EE]"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid size-5 place-items-center rounded-[5px] text-[11px] font-bold ${on ? "bg-[#F0B44C] text-[#0C0F13]" : "bg-[#262C36] text-[#C3CAD4]"}`}
                >
                  {id}
                </span>
                <span className="sr-only">Route {id}: </span>
                <span className="hidden font-stretch-semi-condensed sm:inline">{m.output.variants[id].name}</span>
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="flex min-w-0 items-center gap-2 text-[13px] tabular-nums">
          {status.tone === "busy" ? (
            <LoaderCircle aria-hidden className="size-3.5 shrink-0 animate-spin text-[#F0B44C] motion-reduce:animate-none" />
          ) : (
            <span aria-hidden className={`size-2 shrink-0 rounded-full ${statusDot[status.tone]}`} />
          )}
          <span className="font-semibold">{status.text}</span>
          <span className="truncate text-[#97A0AE] font-stretch-semi-condensed">· {status.detail}</span>
        </p>
      </div>

      {m.stale && !m.busy && (
        <div className="mx-3 mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-[#F0B44C]/35 bg-[#F0B44C]/8 px-3 py-2 text-[13px] sm:mx-4">
          <RotateCcw aria-hidden className="size-4 shrink-0 text-[#F0B44C]" />
          <p className="min-w-0 flex-1">
            Out of date: this preview is run {m.output.run}. Generate again to see your new settings.
          </p>
          <button
            type="button"
            onClick={m.generate}
            className={`h-9 shrink-0 rounded-md border border-[#F0B44C]/60 px-3 text-[12.5px] font-semibold text-[#F0B44C] transition-colors hover:bg-[#F0B44C]/12 lg:h-8 ${focusRing}`}
          >
            Generate
          </button>
        </div>
      )}

      <div id="si-preview-panel" role="tabpanel" aria-labelledby={`si-tab-${m.selected}`} className="p-3 sm:p-4">
        <p className="mb-2.5 flex flex-wrap items-center gap-x-2 text-[12px] text-[#97A0AE] font-stretch-semi-condensed">
          <span className="font-medium text-[#C3CAD4]">{channel.label}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{channel.hint}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{m.labelOf("style", m.output.settings.style)}</span>
        </p>
        <div className="relative">
          {m.busy && (
            <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] overflow-hidden rounded-full bg-[#262C36]">
              <div
                className="h-full bg-[#F0B44C] transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${m.progress}%` }}
              />
            </div>
          )}
          <div className={`transition-opacity duration-200 motion-reduce:transition-none ${m.busy ? "opacity-35" : m.stale ? "opacity-60" : ""}`}>
            <LampAd variant={m.current} t={t} channel={channel.id} />
          </div>
        </div>
      </div>
    </section>
  )
}

function LampAd({ variant, t, channel }: { variant: RenderedVariant; t: Temp; channel: string }) {
  const cta = (
    <span
      className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors duration-500"
      style={{ background: t.light, color: t.ctaInk }}
    >
      {variant.cta}
      <ChevronRight aria-hidden className="size-3.5" />
    </span>
  )

  if (channel === "hero") {
    return (
      <div className="@container relative aspect-video w-full overflow-hidden rounded-lg" style={{ background: t.wall, color: t.ink }}>
        <LampScene t={t} view="-110 20 640 360" className="absolute inset-0 size-full" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between px-[4cqw] py-[2.4cqw] text-[length:max(10px,1.5cqw)]" style={{ color: t.sub }}>
            <span className="text-[length:max(13px,2.2cqw)] font-bold font-stretch-[115%]" style={{ color: t.ink }}>
              arc
            </span>
            <span className="flex gap-[2.6cqw]">
              <span>Lamps</span>
              <span>Design</span>
              <span>Support</span>
            </span>
          </div>
          <div className="flex max-w-[52%] flex-1 flex-col justify-center pb-[5cqw] pl-[5cqw]">
            <h3 className="text-[length:max(17px,4.6cqw)] font-bold leading-[1.02] tracking-[-0.02em] text-balance font-stretch-[112%]">
              {variant.headline}
            </h3>
            <p className="mt-[1.6cqw] hidden text-[length:max(11px,1.55cqw)] leading-[1.45] @md:block" style={{ color: t.sub }}>
              {variant.body}
            </p>
            <div className="mt-[2.6cqw] hidden @sm:block">{cta}</div>
          </div>
        </div>
      </div>
    )
  }

  if (channel === "newsletter") {
    return (
      <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-lg border border-[#262C36]" style={{ background: t.wall, color: t.ink }}>
        <div className="border-b border-[#262C36] bg-[#12161C] px-4 py-2.5 text-[12px] leading-[1.5] text-[#97A0AE]">
          <p>
            <span className="font-semibold text-[#E6E9EE]">Arc Studio</span> · The Desk, issue 41
          </p>
          <p className="truncate text-[#C3CAD4]">{variant.headline}</p>
        </div>
        <div className="relative aspect-[2/1]">
          <LampScene t={t} view="80 70 480 240" className="absolute inset-0 size-full" />
        </div>
        <div className="px-5 pb-5 pt-4">
          <h3 className="text-[23px] font-bold leading-[1.06] tracking-[-0.02em] text-balance font-stretch-[112%]">{variant.headline}</h3>
          <p className="mt-2 text-[13.5px] leading-[1.5]" style={{ color: t.sub }}>
            {variant.body}
          </p>
          <div className="mt-4">{cta}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-lg" style={{ background: t.wall, color: t.ink }}>
      <LampScene t={t} view="190 -90 360 450" className="absolute inset-0 size-full" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div>
          <h3 className="max-w-[13ch] text-[26px] font-bold leading-[1.03] tracking-[-0.02em] text-balance font-stretch-[112%]">
            {variant.headline}
          </h3>
          <p className="mt-2 max-w-[30ch] text-[13px] leading-[1.45]" style={{ color: t.sub }}>
            {variant.body}
          </p>
        </div>
        <div className="flex items-end justify-between gap-3">
          {cta}
          <span className="text-[15px] font-bold font-stretch-[115%]">arc</span>
        </div>
      </div>
    </div>
  )
}

/* The scene is one 640×400 world; each format frames it through its own viewBox. */
function LampScene({ t, view, className }: { t: Temp; view: string; className?: string }) {
  const fade = "transition-[fill,stop-color] duration-500 ease-out motion-reduce:transition-none"
  return (
    <svg viewBox={view} preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <defs>
        <linearGradient id="si-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={fade} style={{ stopColor: t.wallTop }} />
          <stop offset="1" className={fade} style={{ stopColor: t.wall }} />
        </linearGradient>
        <radialGradient id="si-halo">
          <stop offset="0" className={fade} style={{ stopColor: t.light, stopOpacity: 0.2 }} />
          <stop offset="1" className={fade} style={{ stopColor: t.light, stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="si-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className={fade} style={{ stopColor: t.light, stopOpacity: 0.46 }} />
          <stop offset="1" className={fade} style={{ stopColor: t.light, stopOpacity: 0.05 }} />
        </linearGradient>
        <radialGradient id="si-pool">
          <stop offset="0" className={fade} style={{ stopColor: t.light, stopOpacity: 0.5 }} />
          <stop offset="1" className={fade} style={{ stopColor: t.light, stopOpacity: 0 }} />
        </radialGradient>
        <filter id="si-soft" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect x="-200" y="-120" width="1040" height="420" fill="url(#si-wall)" />
      <circle cx="320" cy="150" r="300" fill="url(#si-halo)" />
      <rect x="-200" y="300" width="1040" height="160" className={fade} style={{ fill: t.desk }} />
      <rect x="-200" y="300" width="1040" height="2" className={fade} style={{ fill: t.light, opacity: 0.14 }} />
      <polygon points="292,138 350,136 440,318 185,318" fill="url(#si-cone)" />
      <ellipse cx="312" cy="322" rx="172" ry="24" fill="url(#si-pool)" />
      <path d="M250 314 L352 309 L362 327 L256 332 Z" className={fade} style={{ fill: t.paper }} />
      <path d="M262 318 L346 314 M266 323 L350 319" stroke="#000" strokeOpacity="0.14" strokeWidth="1" />
      <path d="M374 326 L418 319" stroke="#F0B44C" strokeWidth="3" strokeLinecap="round" />
      <path d="M418 319 L424 318" stroke="#2A2F36" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="480" cy="303" rx="48" ry="4" fill="#000" opacity="0.4" />
      <path d="M480 288 C 488 150, 410 108, 336 124" fill="none" stroke="#7D848E" strokeWidth="7" strokeLinecap="round" />
      <path d="M478 282 C 485 154, 410 113, 340 127" fill="none" stroke="#D5D9DF" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="440" y="288" width="80" height="14" rx="7" fill="#3A3F47" />
      <rect x="447" y="288.5" width="66" height="2.6" rx="1.3" fill="#fff" opacity="0.16" />
      <circle cx="500" cy="295" r="1.7" className={fade} style={{ fill: t.light }} />
      <ellipse cx="320" cy="141" rx="42" ry="7" className={fade} style={{ fill: t.light, opacity: 0.75 }} filter="url(#si-soft)" />
      <g transform="rotate(-6 320 128)">
        <rect x="282" y="120" width="78" height="15" rx="7.5" fill="#2E333B" />
        <rect x="286" y="121" width="70" height="3" rx="1.5" fill="#fff" opacity="0.1" />
        <rect x="289" y="132" width="64" height="3" rx="1.5" className={fade} style={{ fill: t.light }} />
      </g>
    </svg>
  )
}

/* ---------- metrics rail ---------- */

function MetricsRail({ m }: { m: MuseStudio }) {
  const metrics = m.current.metrics
  const before = m.previous?.metrics
  const rows = [
    { key: "reach", label: "Reach", value: formatReach(metrics.reach), delta: formatDelta(metrics.reach, before?.reach, "reach") },
    { key: "ctr", label: "Click-through rate", value: formatPercent(metrics.ctr), delta: formatDelta(metrics.ctr, before?.ctr, "percent") },
    {
      key: "conversion",
      label: "Conversion",
      value: formatPercent(metrics.conversion),
      delta: formatDelta(metrics.conversion, before?.conversion, "percent"),
    },
  ]
  const logIcon = { info: null, success: Check, error: TriangleAlert } as const
  const logTone = { info: "text-[#97A0AE]", success: "text-[#5CC38A]", error: "text-[#F07166]" } as const

  return (
    <aside aria-labelledby="si-metrics-title" className={`${panel} lg:col-start-2 xl:col-start-3 xl:row-span-2 xl:row-start-1`}>
      <div className="flex items-baseline justify-between gap-3 border-b border-[#262C36] px-4 py-3">
        <h2 id="si-metrics-title" className="text-[15px] font-semibold">
          Forecast
        </h2>
        <span className="text-[12px] text-[#97A0AE] font-stretch-semi-condensed">Simulated · route {m.selected}</span>
      </div>

      <dl className={`grid grid-cols-1 divide-y divide-[#262C36] sm:grid-cols-3 sm:divide-x sm:divide-y-0 xl:grid-cols-1 xl:divide-x-0 xl:divide-y ${m.stale && !m.busy ? "opacity-60" : ""}`}>
        {rows.map((row) => {
          const tone =
            !row.delta || row.delta === "±0"
              ? "bg-[#262C36] text-[#C3CAD4]"
              : row.delta.startsWith("−")
                ? "bg-[#F07166]/12 text-[#F07166]"
                : "bg-[#5CC38A]/12 text-[#5CC38A]"
          return (
            <div key={row.key} className="px-4 py-3">
              <dt className="text-[12.5px] text-[#97A0AE] font-stretch-semi-condensed">{row.label}</dt>
              <dd className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-[26px] font-semibold leading-none tracking-[-0.01em] tabular-nums">{row.value}</span>
                {row.delta && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold tabular-nums font-stretch-semi-condensed ${tone}`}>
                    {row.delta}
                    <span className="sr-only"> versus run {m.output.run - 1}</span>
                  </span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="border-t border-[#262C36] px-4 pb-3 pt-3">
        <table className="w-full text-[12.5px] tabular-nums">
          <caption className="pb-2 text-left text-[12.5px] font-medium text-[#97A0AE] font-stretch-semi-condensed">
            All routes, run {m.output.run}
          </caption>
          <thead>
            <tr className="text-[11.5px] text-[#97A0AE] font-stretch-semi-condensed">
              <th scope="col" className="pb-1 text-left font-medium">
                Route
              </th>
              <th scope="col" className="pb-1 text-right font-medium">
                Reach
              </th>
              <th scope="col" className="pb-1 text-right font-medium">
                CTR
              </th>
              <th scope="col" className="pb-1 text-right font-medium">
                Conv.
              </th>
            </tr>
          </thead>
          <tbody>
            {VARIANT_IDS.map((id) => {
              const v = m.output.variants[id].metrics
              const on = m.selected === id
              return (
                <tr key={id} className={on ? "text-[#E6E9EE]" : "text-[#97A0AE]"}>
                  <th scope="row" className="py-0.5 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => m.select(id)}
                      aria-pressed={on}
                      aria-label={`Show route ${id}`}
                      className={`-ml-1 inline-flex h-11 items-center gap-1.5 rounded-md px-1 font-semibold transition-colors hover:text-[#E6E9EE] sm:h-8 ${focusRing}`}
                    >
                      <span
                        aria-hidden
                        className={`grid size-5 place-items-center rounded-[5px] text-[11px] font-bold ${on ? "bg-[#F0B44C] text-[#0C0F13]" : "bg-[#262C36] text-[#C3CAD4]"}`}
                      >
                        {id}
                      </span>
                    </button>
                  </th>
                  <td className="text-right">{formatReach(v.reach)}</td>
                  <td className="text-right">{formatPercent(v.ctr)}</td>
                  <td className="text-right">{formatPercent(v.conversion)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#262C36] px-4 py-3">
        <h3 className="text-[12.5px] font-medium text-[#97A0AE] font-stretch-semi-condensed">Activity</h3>
        <ol className="mt-2 space-y-2">
          {m.log.slice(0, 5).map((entry) => {
            const Icon = logIcon[entry.tone]
            return (
              <li key={entry.id} className="flex gap-2.5 text-[12.5px] leading-snug">
                <span className="w-9 shrink-0 tabular-nums text-[#97A0AE] font-stretch-semi-condensed">{entry.at}</span>
                <span className={`mt-0.5 shrink-0 ${logTone[entry.tone]}`}>
                  {Icon ? <Icon aria-hidden className="size-3.5" /> : <span aria-hidden className="mx-1 block size-1.5 translate-y-1 rounded-full bg-[#97A0AE]" />}
                </span>
                <span className="min-w-0 break-words">{entry.text}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

/* ---------- recent campaigns ---------- */

function RecentPanel({ m }: { m: MuseStudio }) {
  return (
    <section aria-labelledby="si-recent-title" className={`${panel} lg:col-start-2 xl:row-start-2`}>
      <div className="flex items-baseline justify-between gap-3 border-b border-[#262C36] px-4 py-3">
        <h2 id="si-recent-title" className="text-[15px] font-semibold">
          Recent campaigns
        </h2>
        <span className="text-[12px] text-[#97A0AE] font-stretch-semi-condensed">Restore loads settings, then generate</span>
      </div>
      <div
        aria-hidden
        className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_56px_96px] gap-4 border-b border-[#262C36] px-4 py-2 text-[11.5px] font-medium text-[#97A0AE] font-stretch-semi-condensed md:grid"
      >
        <span>Campaign</span>
        <span>Settings</span>
        <span>When</span>
        <span />
      </div>
      <ul className="divide-y divide-[#262C36]">
        {m.recent.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_56px_96px]"
          >
            <p className="flex min-w-0 items-center gap-2 text-[13.5px] font-medium">
              <span
                aria-hidden
                className="grid size-5 shrink-0 place-items-center rounded-[5px] bg-[#262C36] text-[11px] font-bold text-[#C3CAD4]"
              >
                {item.variant}
              </span>
              <span className="truncate">{item.title}</span>
              {item.saved && (
                <span className="shrink-0 rounded-md bg-[#5CC38A]/12 px-1.5 py-0.5 text-[11px] font-semibold text-[#5CC38A] font-stretch-semi-condensed">
                  Saved
                </span>
              )}
            </p>
            <p className="col-start-1 row-start-2 truncate text-[12.5px] text-[#97A0AE] font-stretch-semi-condensed md:col-start-auto md:row-start-auto">
              <span className="sr-only">Route {item.variant}, </span>
              {m.labelOf("audience", item.settings.audience)} · {m.labelOf("channel", item.settings.channel)} ·{" "}
              {m.labelOf("style", item.settings.style)}
            </p>
            <p className="hidden text-[12.5px] tabular-nums text-[#97A0AE] md:block">{item.when}</p>
            <button
              type="button"
              onClick={() => m.restore(item)}
              aria-label={`Restore ${item.title}`}
              className={`col-start-2 row-span-2 row-start-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#262C36] px-3 text-[12.5px] font-semibold transition-colors hover:border-[#343C48] hover:bg-[#1A1F27] md:col-start-auto md:row-span-1 md:row-start-auto md:h-8 ${focusRing}`}
            >
              <RotateCcw aria-hidden className="size-3.5 text-[#97A0AE]" />
              Restore
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- toasts ---------- */

function toastCopy(entry: LogEntry) {
  const [head, ...rest] = entry.text.split(": ")
  if (rest.length) {
    const detail = rest.join(": ")
    return { title: head, detail: detail.charAt(0).toUpperCase() + detail.slice(1) }
  }
  if (entry.text.startsWith("Exported ")) return { title: "Exported", detail: entry.text.slice("Exported ".length) }
  return { title: entry.text, detail: "" }
}

function ToastStack({ log }: { log: LogEntry[] }) {
  const [since] = useState(() => log[0]?.id ?? 0)
  const [dismissed, setDismissed] = useState<number[]>([])
  const timers = useRef(new Map<number, number>())

  const toasts = useMemo(
    () => log.filter((entry) => entry.id > since && entry.tone !== "info" && !dismissed.includes(entry.id)).slice(0, 3),
    [log, since, dismissed]
  )

  useEffect(() => {
    const map = timers.current
    for (const toast of toasts) {
      if (map.has(toast.id)) continue
      const handle = window.setTimeout(
        () => {
          map.delete(toast.id)
          setDismissed((list) => [...list, toast.id])
        },
        toast.tone === "error" ? 7000 : 4500
      )
      map.set(toast.id, handle)
    }
  }, [toasts])

  useEffect(() => {
    const map = timers.current
    return () => map.forEach((handle) => window.clearTimeout(handle))
  }, [])

  function dismiss(id: number) {
    const handle = timers.current.get(id)
    if (handle) window.clearTimeout(handle)
    timers.current.delete(id)
    setDismissed((list) => [...list, id])
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-16 right-3 z-40 w-[min(360px,calc(100vw-1.5rem))] sm:bottom-12 sm:right-5"
    >
      <ul className="flex flex-col-reverse gap-2">
        {toasts.map((toast) => {
          const copy = toastCopy(toast)
          const error = toast.tone === "error"
          return (
            <li
              key={toast.id}
              className="si-toast pointer-events-auto flex items-start gap-3 rounded-xl border border-[#262C36] bg-[#1A1F27] py-3 pl-3 pr-1.5 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.7),0_2px_6px_rgba(0,0,0,0.4)]"
            >
              <span
                aria-hidden
                className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${error ? "bg-[#F07166]/15 text-[#F07166]" : "bg-[#5CC38A]/15 text-[#5CC38A]"}`}
              >
                {error ? <TriangleAlert className="size-3.5" /> : <Check className="size-3.5" strokeWidth={2.5} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{copy.title}</p>
                {copy.detail && <p className="mt-0.5 break-words text-[12.5px] leading-snug text-[#97A0AE]">{copy.detail}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={`Dismiss: ${copy.title}`}
                className={`grid size-8 shrink-0 place-items-center rounded-md text-[#97A0AE] transition-colors hover:bg-[#262C36] hover:text-[#E6E9EE] ${focusRing}`}
              >
                <X aria-hidden className="size-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
