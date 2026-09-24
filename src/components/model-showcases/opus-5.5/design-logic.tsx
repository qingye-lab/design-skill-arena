"use client"

import { Archivo, Spectral } from "next/font/google"
import { Check, CircleAlert, Download, LoaderCircle, RotateCcw, Save, Undo2 } from "lucide-react"
import { useState, type ReactNode } from "react"

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
  type Option,
  type RenderedVariant,
  type Settings,
  type StudioSpec,
} from "./core"

/*
 * Lumen Atlas · design logic.
 * Swiss sheet on cool grey paper. Width is the typographic system:
 * Archivo expanded for headings and numerals, condensed for labels, normal for values.
 * Spectral italic is used only for marginal reasoning.
 */

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-la-archivo", display: "swap" })
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-la-spectral",
  display: "swap",
})

const spec: StudioSpec = {
  showcaseId: "design-logic",
  product: "Lumen Atlas",
  brief:
    "Launch Lumen Atlas, a night-sky field guide for iOS and Android. Point a phone at the sky and it names stars, planets and satellites, fully offline, with a red-light mode that keeps night vision. Drive installs before the Geminids peak on 14 December.",
  audiences: [
    {
      id: "beginners",
      label: "Backyard beginners",
      hint: "A phone, no telescope",
      size: 1840000,
      lift: { reach: 1.1, ctr: 0.95, conversion: 1.05 },
    },
    {
      id: "amateurs",
      label: "Amateur astronomers",
      hint: "Own a scope, keep a log",
      size: 380000,
      lift: { ctr: 1.3, conversion: 1.25 },
    },
    {
      id: "travellers",
      label: "Dark-sky travellers",
      hint: "Plan trips by the new moon",
      size: 620000,
      lift: { ctr: 1.1, conversion: 0.92 },
    },
  ],
  channels: [
    { id: "store", label: "App Store page", hint: "Portrait screenshot", lift: { reach: 0.7, ctr: 1.6, conversion: 1.45 } },
    { id: "story", label: "Story ad", hint: "9:16, under 3 seconds", lift: { reach: 1.35, ctr: 0.85, conversion: 0.9 } },
    { id: "poster", label: "Transit poster", hint: "3:2, read from 6 m", lift: { reach: 1.1, ctr: 0.5, conversion: 0.8 } },
  ],
  tones: [
    { id: "wonder", label: "Quiet wonder", lift: { ctr: 1.08 } },
    { id: "precise", label: "Precise", lift: { conversion: 1.1 } },
    { id: "playful", label: "Playful", lift: { ctr: 1.12, conversion: 0.94 } },
  ],
  styles: [
    { id: "chart", label: "Star chart", lift: { ctr: 1.02 } },
    { id: "field", label: "Night field", lift: { ctr: 1.06 } },
    { id: "signal", label: "Signal blue", lift: { reach: 1.05, ctr: 0.98 } },
  ],
  variants: [
    {
      id: "A",
      name: "Point and read",
      headline: "Point at the sky. Read its name.",
      body: "{product} labels 120,000 stars, every planet and the ISS as you move your phone. Made for {audience}.",
      cta: "Download free",
      note: "leads with the gesture, so the first thing learned is what to do with the phone.",
      lift: { ctr: 1.06 },
    },
    {
      id: "B",
      name: "No signal needed",
      headline: "No signal. Every star still named.",
      body: "The whole catalogue lives on your phone, and red-light mode keeps your eyes dark-adapted for {audience}.",
      cta: "Get it before the Geminids",
      note: "leads with the constraint of the dark site, so the offline claim does the persuading.",
      lift: { reach: 0.94, conversion: 1.12 },
    },
    {
      id: "C",
      name: "Tonight's sky",
      headline: "Saturn clears the rooftops at 21:40.",
      body: "{product} tells {audience} what is up tonight, where to look and how long it stays in view.",
      cta: "See tonight's sky",
      note: "leads with a checkable fact, so the headline is itself the demo.",
      lift: { reach: 1.08, ctr: 1.04, conversion: 0.95 },
    },
  ],
  recent: [
    { id: "la-r1", title: "Saturn clears the rooftops at 21:40.", variant: "C", when: "Mon 16:05" },
    { id: "la-r2", title: "No signal. Every star still named.", variant: "B", when: "Mon 11:30" },
    { id: "la-r3", title: "Point at the sky. Read its name.", variant: "A", when: "Fri 17:48" },
  ],
  initialRun: 4,
}

/* ---------- tokens ---------- */

const GRID = "grid grid-cols-4 gap-x-4 px-4 sm:px-6 lg:grid-cols-12 lg:gap-x-6 lg:px-10"
const WIDE = "font-stretch-expanded"
const NARROW = "font-stretch-condensed"
const NOTE = "font-(family-name:--font-la-spectral) italic"
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3BFF]"

const STEPS: { key: "brief" | ControlKey | "route"; name: string; narrows: string }[] = [
  { key: "brief", name: "Brief", narrows: "Sets what may be claimed" },
  { key: "audience", name: "Audience", narrows: "Narrows the channels" },
  { key: "channel", name: "Channel", narrows: "Fixes the format and word count" },
  { key: "tone", name: "Tone", narrows: "Bounds the visual style" },
  { key: "style", name: "Visual style", narrows: "Sets ground and ink" },
  { key: "route", name: "Route", narrows: "Chosen against all five" },
]

type Ground = {
  bg: string
  ink: string
  sub: string
  line: string
  cta: string
  rule: string
}

const GROUNDS: Record<string, Ground> = {
  chart: {
    bg: "bg-white",
    ink: "text-[#121416]",
    sub: "text-[#4A5058]",
    line: "#121416",
    cta: "bg-[#1F3BFF] text-white",
    rule: "border-[#C5CBD2]",
  },
  field: {
    bg: "bg-[#121416]",
    ink: "text-[#E9ECEF]",
    sub: "text-[#C5CBD2]",
    line: "#C5CBD2",
    cta: "bg-[#1F3BFF] text-white",
    rule: "border-[#4A5058]",
  },
  signal: {
    bg: "bg-[#1F3BFF]",
    ink: "text-white",
    sub: "text-[#E9ECEF]",
    line: "#E9ECEF",
    cta: "bg-white text-[#1F3BFF]",
    rule: "border-white/40",
  },
}

type Format = { frame: string; aside: string; aspect: string; columns: string }

const FORMATS: Record<string, Format> = {
  store: {
    frame: "col-span-4 max-w-[17.5rem] lg:col-span-3 lg:max-w-none",
    aside: "col-span-4 lg:col-span-4",
    aspect: "aspect-[9/16]",
    columns: "3 of 7 columns",
  },
  story: {
    frame: "col-span-4 max-w-[17.5rem] lg:col-span-3 lg:max-w-none",
    aside: "col-span-4 lg:col-span-4",
    aspect: "aspect-[9/16]",
    columns: "3 of 7 columns",
  },
  poster: {
    frame: "col-span-4 lg:col-span-5",
    aside: "col-span-4 lg:col-span-2",
    aspect: "aspect-[3/2]",
    columns: "5 of 7 columns",
  },
}

const HEADLINE_NOTES: Record<string, string> = {
  store:
    "Caption held in the top third of the screenshot. The store shows it as a thumbnail first, so the line has to survive at a third of its size.",
  story:
    "Headline sits above the reply bar, inside the top 70% of the frame. A story gets under three seconds, so it is the only line set large.",
  poster:
    "Headline set at 125% width across most of the frame. From six metres the width of a letter reads before its weight.",
}

const BODY_NOTES: Record<string, string> = {
  beginners: "Body explains the gesture before the catalogue: beginners need to know what to do before what they get.",
  amateurs: "Body keeps the star count where amateurs look for it; they compare catalogues before they install.",
  travellers: "Body closes on offline use. Dark-sky travellers lose signal exactly when they need the app.",
}

const GROUND_NOTES: Record<string, string> = {
  chart: "Star chart: ink lines on white. Signal blue is kept for the one action, so the eye lands on it last.",
  field: "Night field: the ground goes dark so the stars carry the contrast, as they do outside.",
  signal: "Signal blue fills the ground, so the chart drops to hairlines and the headline keeps the weight.",
}

const ACTION_NOTES: Record<string, string> = {
  wonder: "Quiet wonder: no exclamation marks, and the action is a plain verb in the condensed cut.",
  precise: "Precise: times in 24-hour form and figures set tabular, so every claim can be checked.",
  playful: "Playful: the headline may wink, the action never does. It stays a plain instruction.",
}

/* ---------- star chart data (deterministic, no randomness at render) ---------- */

function starField(count: number, seed: number) {
  let state = seed
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
  return Array.from({ length: count }, (_, index) => ({
    x: Math.round(next() * 2000) / 10,
    y: Math.round(next() * 2000) / 10,
    r: index % 6 === 0 ? 1.3 : 0.6,
  }))
}

const FIELD = starField(52, 11)

const GEMINI = [
  { x: 62, y: 34, r: 3.2, label: "Castor" },
  { x: 104, y: 48, r: 3.6, label: "Pollux" },
  { x: 58, y: 84, r: 1.8 },
  { x: 98, y: 98, r: 1.8 },
  { x: 46, y: 130, r: 2.2 },
  { x: 36, y: 172, r: 1.6 },
  { x: 114, y: 144, r: 2.4 },
  { x: 132, y: 178, r: 1.6 },
]

const GEMINI_LINES: [number, number][] = [
  [0, 2],
  [2, 4],
  [4, 5],
  [1, 3],
  [3, 6],
  [6, 7],
  [2, 3],
  [0, 1],
]

const RADIANT = { x: 74, y: 24 }
const STREAKS = [
  [150, 6],
  [168, 40],
  [186, 18],
  [140, 64],
]

/* ---------- helpers ---------- */

function pick(options: Option[], id: string) {
  return options.find((option) => option.id === id) ?? options[0]
}

function runStatus(m: MuseStudio) {
  if (m.busy)
    return `Run ${m.output.run + 1}, stage ${m.stage + 1} of ${GENERATION_STAGES.length}: ${m.stageLabel}.`
  if (m.saveStatus === "saving") return `Saving route ${m.selected} to the index.`
  if (m.exportStatus === "exporting") return `Exporting run ${m.output.run}, route ${m.selected}.`
  if (m.exportStatus === "exported") return `Exported run ${m.output.run}, route ${m.selected}, as a JSON file.`
  if (m.saveStatus === "saved") return `Saved route ${m.selected}. It now heads the index below.`
  if (m.generateStatus === "success") return `Run ${m.output.run} set at ${m.output.at}. Specimen and forecast updated.`
  if (m.stale) return "Settings changed since the last run. Generate to set a new specimen."
  return `Showing run ${m.output.run}, set at ${m.output.at}.`
}

/* ---------- sub-components ---------- */

function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 bg-[repeating-linear-gradient(to_bottom,transparent_0_23px,rgba(31,59,255,0.2)_23px_24px)]"
    >
      <div className={`${GRID} h-full`}>
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className={`h-full bg-[#1F3BFF]/[0.07] ${index >= 4 ? "hidden lg:block" : ""}`}
          >
            <span className={`${NARROW} block pt-1 text-center text-[11px] font-semibold text-[#1F3BFF] tabular-nums`}>
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className={`${WIDE} block text-[1.75rem] leading-none font-extrabold tracking-[-0.01em] tabular-nums`}
    >
      {n}
    </span>
  )
}

/**
 * The heading for one decision step. Steps 6 and 7 of the sequence are labelled
 * from this element, so it carries the id their radio groups point at. The brief
 * textarea is labelled too, which is why the heading can be a `<label>`.
 */
function StepHead({ n, name, narrows, id, labelFor }: { n: number; name: string; narrows: string; id: string; labelFor?: string }) {
  const title = (
    <>
      <span className="sr-only">Step {n}: </span>
      {name}
    </>
  )
  return (
    <div className="min-w-0">
      {labelFor ? (
        <label id={id} htmlFor={labelFor} className={`${NARROW} block text-[15px] leading-tight font-semibold`}>
          {title}
        </label>
      ) : (
        <span id={id} className={`${NARROW} block text-[15px] leading-tight font-semibold`}>
          {title}
        </span>
      )}
      <span className={`${NARROW} block text-[13px] leading-tight text-[#4A5058]`}>{narrows}</span>
    </div>
  )
}

function ChoiceRow({
  name,
  labelledBy,
  options,
  value,
  onChange,
}: {
  name: string
  labelledBy: string
  options: Option[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-3 gap-px bg-[#C5CBD2] p-px">
      {options.map((option) => (
        <label
          key={option.id}
          className="group relative flex min-h-11 cursor-pointer flex-col justify-center bg-[#E9ECEF] px-2.5 py-1.5 transition-colors duration-150 hover:bg-white has-[:checked]:bg-[#121416] has-[:checked]:text-[#E9ECEF] has-[:focus-visible]:z-10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1F3BFF]"
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="sr-only"
          />
          <span className={`${NARROW} text-[15px] leading-tight font-semibold`}>{option.label}</span>
          {option.hint ? (
            <span className={`${NARROW} text-[12px] leading-tight text-[#4A5058] group-has-[:checked]:text-[#C5CBD2]`}>
              {option.hint}
            </span>
          ) : null}
        </label>
      ))}
    </div>
  )
}

function Marker({ letter, className = "" }: { letter: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${NOTE} absolute z-10 flex size-4 items-center justify-center bg-[#1F3BFF] text-[11px] leading-none text-white ring-1 ring-white ${className}`}
    >
      {letter}
    </span>
  )
}

function StarChart({ ground, compact = false }: { ground: Ground; compact?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="Star chart of Gemini with the Geminids radiant near Castor">
      {FIELD.map((star, index) => (
        <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={ground.line} opacity={0.55} />
      ))}
      {STREAKS.map(([x, y], index) => (
        <line
          key={index}
          x1={RADIANT.x + 6}
          y1={RADIANT.y}
          x2={x}
          y2={y}
          stroke={ground.line}
          strokeWidth={0.6}
          strokeDasharray="10 3 2 3"
          opacity={0.8}
        />
      ))}
      {GEMINI_LINES.map(([a, b], index) => (
        <line
          key={index}
          x1={GEMINI[a].x}
          y1={GEMINI[a].y}
          x2={GEMINI[b].x}
          y2={GEMINI[b].y}
          stroke={ground.line}
          strokeWidth={0.8}
        />
      ))}
      {GEMINI.map((star, index) => (
        <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={ground.line} />
      ))}
      <circle cx={RADIANT.x} cy={RADIANT.y} r={5} fill="none" stroke={ground.line} strokeWidth={0.8} />
      {!compact
        ? GEMINI.filter((star) => star.label).map((star) => (
            <text
              key={star.label}
              x={star.x + 7}
              y={star.y + 4}
              fill={ground.line}
              fontSize={9}
              className={NARROW}
              style={{ fontStretch: "75%" }}
            >
              {star.label}
            </text>
          ))
        : null}
    </svg>
  )
}

function AppIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
      <rect width="40" height="40" fill="#121416" />
      <circle cx="14" cy="13" r="2.4" fill="#E9ECEF" />
      <circle cx="26" cy="17" r="2.8" fill="#E9ECEF" />
      <line x1="14" y1="13" x2="26" y2="17" stroke="#E9ECEF" strokeWidth="1" />
      <line x1="14" y1="13" x2="12" y2="30" stroke="#E9ECEF" strokeWidth="1" />
      <line x1="26" y1="17" x2="29" y2="31" stroke="#E9ECEF" strokeWidth="1" />
      <rect x="24" y="30" width="10" height="3" fill="#1F3BFF" />
    </svg>
  )
}

function Specimen({ channel, style, variant, product }: { channel: string; style: string; variant: RenderedVariant; product: string }) {
  const ground = GROUNDS[style] ?? GROUNDS.chart
  const wordmark = <span className={`${WIDE} text-[max(9px,3.4cqi)] font-bold`}>{product}</span>

  if (channel === "poster") {
    return (
      <div className={`@container relative flex h-full flex-col p-[5cqi] ${ground.bg} ${ground.ink}`}>
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-[4cqi]">
          <div className="relative flex flex-col justify-between">
            <div className="relative">
              <Marker letter="a" className="-top-2 -left-2" />
              <p className={`${WIDE} text-[7.6cqi] leading-[0.98] font-extrabold tracking-[-0.02em] text-balance`}>
                {variant.headline}
              </p>
            </div>
            <div className="relative">
              <Marker letter="b" className="-top-2 -left-2" />
              <p className={`max-w-[34ch] text-[max(9px,2.3cqi)] leading-snug ${ground.sub}`}>{variant.body}</p>
            </div>
          </div>
          <div className="relative min-h-0">
            <Marker letter="c" className="top-0 left-0" />
            <StarChart ground={ground} />
          </div>
        </div>
        <div className={`mt-[3cqi] flex items-center justify-between border-t pt-[2.5cqi] ${ground.rule}`}>
          {wordmark}
          <span className="relative">
            <Marker letter="d" className="-top-2 -left-2" />
            <span className={`${NARROW} inline-block px-[2.4cqi] py-[1cqi] text-[max(9px,2.6cqi)] font-semibold ${ground.cta}`}>
              {variant.cta}
            </span>
          </span>
        </div>
      </div>
    )
  }

  if (channel === "store") {
    return (
      <div className={`@container relative flex h-full flex-col ${ground.bg} ${ground.ink}`}>
        <div className={`flex items-center gap-[4cqi] border-b px-[6cqi] py-[5cqi] ${ground.rule}`}>
          <AppIcon />
          <div className="min-w-0 flex-1">
            <p className={`${WIDE} truncate text-[max(10px,5.4cqi)] font-bold`}>{product}</p>
            <p className={`${NARROW} truncate text-[max(9px,4.4cqi)] ${ground.sub}`}>Night-sky field guide</p>
          </div>
          <span className="relative">
            <Marker letter="d" className="-top-2 -left-2" />
            <span className={`${NARROW} inline-block px-[3cqi] py-[1.5cqi] text-[max(9px,4cqi)] font-semibold ${ground.cta}`}>
              {variant.cta}
            </span>
          </span>
        </div>
        <div className="relative px-[6cqi] pt-[7cqi]">
          <Marker letter="a" className="top-4 left-2" />
          <p className={`${WIDE} text-[9cqi] leading-[1.02] font-extrabold tracking-[-0.02em] text-balance`}>
            {variant.headline}
          </p>
        </div>
        <div className="relative min-h-0 flex-1 px-[4cqi] py-[3cqi]">
          <Marker letter="c" className="top-2 left-2" />
          <StarChart ground={ground} />
        </div>
        <div className="relative px-[6cqi] pb-[7cqi]">
          <Marker letter="b" className="-top-2 left-2" />
          <p className={`text-[max(9px,4.2cqi)] leading-snug ${ground.sub}`}>{variant.body}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`@container relative flex h-full flex-col px-[6cqi] pt-[5cqi] pb-[8cqi] ${ground.bg} ${ground.ink}`}>
      <div className="grid grid-cols-5 gap-[1.5cqi]" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={`h-[0.8cqi] min-h-[2px] ${index === 0 ? "bg-current" : "bg-current opacity-30"}`} />
        ))}
      </div>
      <div className="mt-[4cqi] flex items-center gap-[3cqi]">{wordmark}</div>
      <div className="relative mt-[8cqi]">
        <Marker letter="a" className="-top-2 -left-2" />
        <p className={`${WIDE} text-[11cqi] leading-[1] font-extrabold tracking-[-0.02em] text-balance`}>
          {variant.headline}
        </p>
      </div>
      <div className="relative my-[4cqi] min-h-0 flex-1">
        <Marker letter="c" className="top-0 left-0" />
        <StarChart ground={ground} compact />
      </div>
      <div className="relative">
        <Marker letter="b" className="-top-2 -left-2" />
        <p className={`text-[max(9px,4.6cqi)] leading-snug ${ground.sub}`}>{variant.body}</p>
      </div>
      <div className="relative mt-[5cqi]">
        <Marker letter="d" className="-top-2 -left-2" />
        <span className={`${NARROW} block px-[4cqi] py-[2.4cqi] text-center text-[max(10px,5cqi)] font-semibold ${ground.cta}`}>
          {variant.cta}
        </span>
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  verb,
  sub,
  icon,
  primary = false,
  working = false,
  describedBy,
}: {
  onClick: () => void
  verb: string
  sub: string
  icon: ReactNode
  primary?: boolean
  working?: boolean
  describedBy?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-busy={working || undefined}
      aria-describedby={describedBy}
      className={`${FOCUS} flex min-h-11 min-w-0 items-center gap-2 px-3 py-2 text-left transition-colors duration-150 disabled:cursor-not-allowed ${
        primary
          ? "bg-[#1F3BFF] text-white hover:bg-[#121416]"
          : "border border-[#121416] bg-transparent text-[#121416] hover:bg-white"
      } ${working ? "cursor-progress" : "cursor-pointer"}`}
    >
      <span aria-hidden="true" className="shrink-0">
        {working ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" /> : icon}
      </span>
      <span className="min-w-0">
        <span className={`${WIDE} block text-[14px] leading-tight font-bold`}>{verb}</span>
        <span className={`${NARROW} block truncate text-[12px] leading-tight ${primary ? "text-[#E9ECEF]" : "text-[#4A5058]"}`}>
          {sub}
        </span>
      </span>
    </button>
  )
}

function ErrorLine({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 border-t border-[#C62D1F] pt-2 text-[14px] leading-snug text-[#C62D1F]">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  )
}

function Progress({ stage, busy }: { stage: number; busy: boolean }) {
  return (
    <ol className="grid grid-cols-4 gap-px" aria-label="Generation stages">
      {GENERATION_STAGES.map((label, index) => {
        const state = !busy ? "idle" : index < stage ? "done" : index === stage ? "active" : "todo"
        return (
          <li key={label} className="min-w-0">
            <span
              aria-hidden="true"
              className={`block h-1 ${
                state === "done" || state === "active" ? "bg-[#1F3BFF]" : "bg-[#C5CBD2]"
              } ${state === "active" ? "opacity-60" : ""}`}
            />
            <span className={`${NARROW} mt-1 block truncate text-[12px] ${state === "active" ? "text-[#121416]" : "text-[#4A5058]"}`}>
              {label}
              <span className="sr-only">{state === "done" ? " (done)" : state === "active" ? " (in progress)" : ""}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function MetricsTable({ m }: { m: MuseStudio }) {
  const rows = [
    { key: "reach" as const, label: "Reach", format: formatReach, kind: "reach" as const },
    { key: "ctr" as const, label: "Click-through", format: formatPercent, kind: "percent" as const },
    { key: "conversion" as const, label: "Conversion", format: formatPercent, kind: "percent" as const },
  ]
  return (
    <table aria-busy={m.busy || undefined} className={`w-full border-collapse text-left transition-opacity duration-200 ${m.busy ? "opacity-50" : ""}`}>
      <caption className="pb-2 text-left">
        <span className={`${WIDE} text-[14px] font-bold`}>Forecast</span>{" "}
        <span className={`${NARROW} text-[13px] text-[#4A5058]`}>
          simulated for run {m.output.run}
          {m.stale ? ", earlier settings" : ""}
        </span>
      </caption>
      <thead>
        <tr className="border-y border-[#121416]">
          <th scope="col" className={`${NARROW} py-1.5 pr-2 text-[13px] font-semibold`}>
            Metric
          </th>
          {VARIANT_IDS.map((id) => (
            <th
              key={id}
              scope="col"
              className={`${WIDE} py-1.5 pr-2 text-right text-[13px] font-bold ${id === m.selected ? "bg-white text-[#1F3BFF]" : ""}`}
            >
              {id}
              {id === m.selected ? <span className="sr-only"> (selected route)</span> : null}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key} className="border-b border-[#C5CBD2]">
            <th scope="row" className={`${NARROW} py-1.5 pr-2 text-[14px] font-medium`}>
              {row.label}
            </th>
            {VARIANT_IDS.map((id) => {
              const value = m.output.variants[id].metrics[row.key]
              const delta =
                id === m.selected && m.previous
                  ? formatDelta(value, m.previous.metrics[row.key], row.kind)
                  : null
              return (
                <td key={id} className={`py-1.5 pr-2 text-right align-top tabular-nums ${id === m.selected ? "bg-white" : ""}`}>
                  <span className="block text-[15px] font-semibold">{row.format(value)}</span>
                  {delta ? (
                    <span className={`${NARROW} block text-[12px] text-[#4A5058]`}>
                      {delta}
                      <span className="sr-only"> against the previous run</span>
                    </span>
                  ) : null}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------- page ---------- */

export default function DesignLogic() {
  const m = useMuseStudio(spec)
  const [showGrid, setShowGrid] = useState(false)

  const generated: Settings = m.output.settings
  const channel = generated.channel
  const format = FORMATS[channel] ?? FORMATS.story
  const briefLength = m.settings.brief.trim().length
  const variantSpec = spec.variants.find((variant) => variant.id === m.selected) ?? spec.variants[0]

  const notes = [
    { letter: "a", target: "Headline", from: "Channel", text: HEADLINE_NOTES[channel] ?? HEADLINE_NOTES.story },
    { letter: "b", target: "Body", from: "Audience", text: BODY_NOTES[generated.audience] ?? BODY_NOTES.beginners },
    { letter: "c", target: "Chart and ground", from: "Visual style", text: GROUND_NOTES[generated.style] ?? GROUND_NOTES.chart },
    { letter: "d", target: "Action", from: "Tone", text: ACTION_NOTES[generated.tone] ?? ACTION_NOTES.wonder },
  ]

  const controlOptions: Record<ControlKey, Option[]> = {
    audience: spec.audiences,
    channel: spec.channels,
    tone: spec.tones,
    style: spec.styles,
  }

  return (
    <div
      className={`${archivo.className} ${archivo.variable} ${spectral.variable} relative min-h-dvh w-full overflow-x-clip bg-[#E9ECEF] text-[#121416] antialiased selection:bg-[#1F3BFF] selection:text-white`}
    >
      <style>{`
        .la-set { animation: la-set 640ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes la-set { from { clip-path: inset(0 68% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @media (prefers-reduced-motion: reduce) { .la-set { animation: none; } }
      `}</style>

      {showGrid ? <GridOverlay /> : null}

      {/* document header row */}
      <header className={`${GRID} items-center gap-y-2 border-b border-[#121416] py-3`}>
        <h1 className={`${WIDE} col-span-2 text-[20px] leading-none font-extrabold tracking-[-0.01em] lg:col-span-3`}>
          Lumen Atlas
        </h1>
        <p className={`${NARROW} col-span-4 row-start-2 text-[14px] text-[#4A5058] lg:col-span-4 lg:row-start-auto`}>
          Launch campaign for iOS and Android, ahead of the Geminids on 14 December
        </p>
        <p className={`${NARROW} col-span-4 row-start-3 text-[14px] lg:col-span-3 lg:row-start-auto`}>
          Set by <span className={`${WIDE} font-bold`}>{m.modelName}</span>
          <span aria-hidden="true" className="px-1.5 text-[#4A5058]">
            ·
          </span>
          <span className="font-semibold">{m.chain}</span>
        </p>
        <div className="col-span-2 row-start-1 flex justify-end lg:col-span-2 lg:row-start-auto">
          <button
            type="button"
            role="switch"
            aria-checked={showGrid}
            onClick={() => setShowGrid((value) => !value)}
            className={`${FOCUS} flex min-h-10 cursor-pointer items-center gap-2.5 px-1`}
          >
            <span className={`${NARROW} text-[14px] font-semibold`}>Show grid</span>
            <span
              aria-hidden="true"
              className={`relative h-5 w-9 border border-[#121416] transition-colors duration-150 ${showGrid ? "bg-[#1F3BFF]" : "bg-transparent"}`}
            >
              <span
                className={`absolute top-0.5 size-3.5 transition-transform duration-150 motion-reduce:transition-none ${
                  showGrid ? "translate-x-[18px] bg-white" : "translate-x-0.5 bg-[#121416]"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <main className={`${GRID} gap-y-10 pt-5 pb-12`}>
        {/* columns 1–5: the decision sequence */}
        <section aria-labelledby="la-sequence" className="col-span-4 min-w-0 lg:col-span-5">
          <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4">
            <h2 id="la-sequence" className={`${WIDE} col-start-2 text-[15px] leading-tight font-bold`}>
              Decision sequence
            </h2>
            <p className={`${NOTE} col-start-2 mt-1 text-[14px] leading-[1.45] text-[#4A5058]`}>
              Numbered because the order is real: the audience decides which channels can reach them, the channel fixes how
              many words fit, that bounds the tone, and the tone limits the visual style. The route is chosen last.
            </p>
          </div>

          <ol className="mt-3 border-t border-[#121416]">
            {STEPS.map((step, index) => {
              const n = index + 1
              return (
                <li key={step.key} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-[#C5CBD2] py-2.5">
                  <StepNumber n={n} />
                  <div className="min-w-0">
                    {step.key === "brief" ? (
                      <>
                        <StepHead n={n} name={step.name} narrows={step.narrows} id="la-brief-head" labelFor="la-brief" />
                        <textarea
                          id="la-brief"
                          value={m.settings.brief}
                          onChange={(event) => m.setBrief(event.target.value)}
                          rows={3}
                          aria-invalid={m.issue ? true : undefined}
                          aria-describedby="la-brief-meta"
                          className="mt-2 block w-full resize-y border border-[#121416] bg-white px-2.5 py-2 text-[15px] leading-[1.45] text-[#121416] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3BFF] aria-invalid:border-[#C62D1F]"
                        />
                        <p id="la-brief-meta" className={`${NARROW} mt-1 flex flex-wrap justify-between gap-x-3 text-[13px]`}>
                          {m.issue ? (
                            <span className="flex items-start gap-1.5 text-[#C62D1F]">
                              <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                              {m.issue}
                            </span>
                          ) : (
                            <span className="text-[#4A5058]">Name the product, the reader and the date.</span>
                          )}
                          <span className={`tabular-nums ${briefLength > BRIEF_MAX ? "text-[#C62D1F]" : "text-[#4A5058]"}`}>
                            {briefLength} / {BRIEF_MAX}
                          </span>
                        </p>
                      </>
                    ) : step.key === "route" ? (
                      <>
                        <StepHead n={n} name={step.name} narrows={step.narrows} id="la-route-head" />
                        <div role="radiogroup" aria-label="Route" className="mt-2 grid grid-cols-3 gap-px bg-[#C5CBD2] p-px">
                          {VARIANT_IDS.map((id) => (
                            <label
                              key={id}
                              className="group flex min-h-11 cursor-pointer items-center gap-2 bg-[#E9ECEF] px-2.5 py-1.5 transition-colors duration-150 hover:bg-white has-[:checked]:bg-[#121416] has-[:checked]:text-[#E9ECEF] has-[:focus-visible]:z-10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1F3BFF]"
                            >
                              <input
                                type="radio"
                                name="la-route"
                                value={id}
                                checked={m.selected === id}
                                onChange={() => m.select(id)}
                                className="sr-only"
                              />
                              <span className={`${WIDE} text-[18px] leading-none font-extrabold`}>{id}</span>
                              <span className={`${NARROW} min-w-0 text-[14px] leading-tight font-semibold`}>
                                {m.output.variants[id].name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <StepHead n={n} name={step.name} narrows={step.narrows} id={`la-${step.key}-head`} />
                        <ChoiceRow
                          name={`la-${step.key}`}
                          labelledBy={`la-${step.key}-head`}
                          options={controlOptions[step.key]}
                          value={m.settings[step.key]}
                          onChange={(id) => m.setControl(step.key as ControlKey, id)}
                        />
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {/* run block */}
          <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 pt-3">
            <span aria-hidden="true" className={`${WIDE} pt-2 text-[13px] font-bold text-[#4A5058]`}>
              Run
            </span>
            <div className="min-w-0 space-y-2.5">
              <div className="grid grid-cols-3 gap-2">
                <ActionButton
                  primary
                  onClick={m.generate}
                  working={m.busy}
                  verb="Generate"
                  sub={m.busy ? `Stage ${m.stage + 1} of 4` : m.stale ? `Run ${m.output.run + 1} is due` : `Run ${m.output.run + 1}`}
                  icon={<RotateCcw className="size-4" />}
                  describedBy="la-status"
                />
                <ActionButton
                  onClick={m.save}
                  working={m.saveStatus === "saving"}
                  verb="Save"
                  sub={m.saveStatus === "saved" ? "Saved to index" : m.saveStatus === "saving" ? "Saving" : `Route ${m.selected}`}
                  icon={m.saveStatus === "saved" ? <Check className="size-4" /> : <Save className="size-4" />}
                />
                <ActionButton
                  onClick={() => m.exportCampaign()}
                  working={m.exportStatus === "exporting"}
                  verb="Export"
                  sub={m.exportStatus === "exported" ? "File downloaded" : m.exportStatus === "exporting" ? "Writing file" : "JSON file"}
                  icon={m.exportStatus === "exported" ? <Check className="size-4" /> : <Download className="size-4" />}
                />
              </div>

              <div aria-live="polite" id="la-status" className="space-y-1.5">
                {m.busy ? <Progress stage={m.stage} busy={m.busy} /> : null}
                <p className={`${NARROW} text-[14px] ${m.generateStatus === "success" && !m.busy ? "text-[#1F3BFF]" : "text-[#4A5058]"}`}>
                  {runStatus(m)}
                </p>
              </div>
              {m.generateError ? <ErrorLine message={m.generateError} /> : null}
              {m.saveError ? <ErrorLine message={m.saveError} /> : null}
              {m.exportError ? <ErrorLine message={m.exportError} /> : null}

              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[14px]">
                  <input
                    type="checkbox"
                    checked={m.failNext}
                    onChange={(event) => m.setFailNext(event.target.checked)}
                    className="size-4 cursor-pointer accent-[#1F3BFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F3BFF]"
                  />
                  <span className={NARROW}>Simulate a forecast outage on the next run</span>
                </label>
                <button
                  type="button"
                  onClick={m.reset}
                  className={`${FOCUS} ${NARROW} min-h-10 cursor-pointer text-[14px] font-semibold underline decoration-[#C5CBD2] underline-offset-4 hover:decoration-[#121416]`}
                >
                  Reset to launch defaults
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <MetricsTable m={m} />
          </div>
        </section>

        {/* columns 6–12: the specimen */}
        <section aria-labelledby="la-specimen" className="col-span-4 min-w-0 lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#121416] pb-2">
            <h2 id="la-specimen" className={`${WIDE} text-[15px] font-bold`}>
              Specimen, route {m.selected}: {m.current.name}
            </h2>
            <p className={`${NARROW} text-[14px] text-[#4A5058] tabular-nums`}>
              {m.labelOf("channel", generated.channel)} · {m.labelOf("style", generated.style)} · run {m.output.run},{" "}
              {m.output.at}
            </p>
          </div>

          {m.stale ? (
            <p className="mt-3 flex flex-wrap items-center justify-between gap-2 border border-[#121416] bg-white px-3 py-2 text-[14px]">
              <span>
                <span className="font-semibold">Out of date.</span> The settings changed after run {m.output.run}; this specimen
                still shows the old ones.
              </span>
              <button
                type="button"
                onClick={m.generate}
                disabled={m.busy}
                className={`${FOCUS} ${NARROW} min-h-10 cursor-pointer px-2 font-semibold text-[#1F3BFF] underline underline-offset-4 disabled:cursor-progress disabled:opacity-60`}
              >
                Generate again
              </button>
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-4 gap-x-4 gap-y-6 lg:grid-cols-7 lg:gap-x-6">
            <figure
              aria-busy={m.busy || undefined}
              className={`${format.frame} w-full min-w-0 transition-opacity duration-200 ${m.busy || m.stale ? "opacity-60" : ""}`}
            >
              <div key={`${m.output.run}-${m.selected}`} className={`la-set ${format.aspect} w-full overflow-hidden border border-[#121416]`}>
                <Specimen channel={channel} style={generated.style} variant={m.current} product={spec.product} />
              </div>
              <figcaption className={`${NARROW} mt-1.5 text-[13px] text-[#4A5058]`}>
                {m.labelOf("channel", channel)}, {pick(spec.channels, channel).hint?.toLowerCase()}
              </figcaption>
            </figure>

            <aside aria-label="Placement notes" className={`${format.aside} min-w-0`}>
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-t border-[#121416] text-[13px]">
                {[
                  ["Format", m.labelOf("channel", channel)],
                  ["Grid", format.columns],
                  ["Measure", `${m.current.headline.length} characters`],
                  ["Voice", `${m.labelOf("tone", generated.tone)}, for ${m.labelOf("audience", generated.audience).toLowerCase()}`],
                ].map(([term, value]) => (
                  <div key={term} className="col-span-2 grid grid-cols-subgrid border-b border-[#C5CBD2] py-1">
                    <dt className={`${NARROW} text-[#4A5058]`}>{term}</dt>
                    <dd className={`${NARROW} font-semibold tabular-nums`}>{value}</dd>
                  </div>
                ))}
              </dl>
              <ol className="mt-3 space-y-3">
                {notes.map((note) => (
                  <li key={note.letter} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2">
                    <span
                      aria-hidden="true"
                      className={`${NOTE} mt-0.5 flex size-4 items-center justify-center bg-[#1F3BFF] text-[11px] leading-none text-white`}
                    >
                      {note.letter}
                    </span>
                    <p className="min-w-0">
                      <span className={`${NARROW} block text-[12px] font-semibold text-[#121416]`}>
                        {note.target}, from {note.from.toLowerCase()}
                      </span>
                      <span className={`${NOTE} block text-[14px] leading-[1.45] text-[#4A5058]`}>{note.text}</span>
                    </p>
                  </li>
                ))}
                <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 border-t border-[#C5CBD2] pt-2">
                  <span aria-hidden="true" className={`${WIDE} text-[12px] font-extrabold`}>
                    {m.selected}
                  </span>
                  <p className={`${NOTE} min-w-0 text-[14px] leading-[1.45] text-[#4A5058]`}>
                    Route {m.selected} {variantSpec.note}
                  </p>
                </li>
              </ol>
            </aside>
          </div>
        </section>

        {/* index + record, full width below the fold */}
        <section aria-labelledby="la-index" className="col-span-4 min-w-0 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4 border-b border-[#121416] pb-2">
            <h2 id="la-index" className={`${WIDE} text-[15px] font-bold`}>
              Index of campaigns
            </h2>
            <span className={`${NARROW} text-[13px] text-[#4A5058]`}>Restore puts the settings back in the sequence</span>
          </div>
          <ul>
            {m.recent.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#C5CBD2] py-2">
                <span className="min-w-0 flex-1 basis-56 text-[15px]">
                  <span className="break-words">{item.title}</span>
                  {item.saved ? <span className={`${NARROW} ml-2 text-[12px] font-semibold text-[#1F3BFF]`}>saved</span> : null}
                </span>
                <span aria-hidden="true" className="hidden h-px flex-1 border-b border-dotted border-[#4A5058] sm:block" />
                <span className={`${NARROW} text-[14px] text-[#4A5058] tabular-nums`}>
                  Route {item.variant}, {item.when}
                </span>
                <button
                  type="button"
                  onClick={() => m.restore(item)}
                  aria-label={`Restore “${item.title}”, route ${item.variant}`}
                  className={`${FOCUS} ${NARROW} flex min-h-10 cursor-pointer items-center gap-1.5 px-2 text-[14px] font-semibold hover:bg-white`}
                >
                  <Undo2 aria-hidden="true" className="size-3.5" />
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="la-record" className="col-span-4 min-w-0 lg:col-span-5">
          <h2 id="la-record" className={`${WIDE} border-b border-[#121416] pb-2 text-[15px] font-bold`}>
            Record
          </h2>
          <ol>
            {m.log.map((entry) => (
              <li key={entry.id} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-[#C5CBD2] py-1.5 text-[14px]">
                <span className={`${NARROW} text-[#4A5058] tabular-nums`}>{entry.at}</span>
                <span className={entry.tone === "error" ? "text-[#C62D1F]" : entry.tone === "success" ? "text-[#121416]" : "text-[#4A5058]"}>
                  {entry.tone === "error" ? <span className="sr-only">Error: </span> : null}
                  {entry.text}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  )
}
