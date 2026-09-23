"use client"

import { Familjen_Grotesk, Martian_Mono } from "next/font/google"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  Download,
  History,
  Loader2,
  RotateCcw,
  Save,
  Wand2,
} from "lucide-react"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react"

import {
  BRIEF_MAX,
  GENERATION_STAGES,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type RecentCampaign,
  type RenderedVariant,
  type Settings,
  type StudioSpec,
  type VariantId,
} from "./core"

const grotesk = Familjen_Grotesk({ subsets: ["latin"], display: "swap" })
const martian = Martian_Mono({ subsets: ["latin"], display: "swap" })

/** Martian Mono is reserved for measurement: timecodes, ratios, readouts. */
const MONO = `${martian.className} tabular-nums`
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F7CF6]"

const spec: StudioSpec = {
  showcaseId: "motion-bits",
  product: "Kite Mini",
  brief:
    "Launch Kite Mini, a 249 g folding camera drone that fits a jacket pocket and skips registration in most countries. Drive pre-orders before the 3 June release, using the 4K/60 camera and 34-minute flight time as proof.",
  audiences: [
    { id: "travel", label: "Travel creators", hint: "Pack light, film everything", size: 1380000, lift: { ctr: 1.06 } },
    { id: "first", label: "First-time pilots", hint: "Never flown a drone", size: 2150000, lift: { ctr: 0.94, conversion: 0.88 } },
    { id: "upgrade", label: "Drone owners upgrading", hint: "Flying a 900 g model today", size: 640000, lift: { ctr: 1.02, conversion: 1.24 } },
  ],
  channels: [
    { id: "reels", label: "Reels", hint: "9:16", lift: { reach: 1.2, ctr: 0.92 } },
    { id: "preroll", label: "YouTube pre-roll", hint: "16:9", lift: { reach: 1.05, ctr: 0.78, conversion: 1.08 } },
    { id: "feed", label: "Feed post", hint: "4:5", lift: { reach: 0.82, ctr: 1.1 } },
  ],
  tones: [
    { id: "light", label: "Lighthearted", lift: { ctr: 1.08 } },
    { id: "precise", label: "Precise", lift: { ctr: 0.96, conversion: 1.1 } },
    { id: "bold", label: "Bold", lift: { reach: 1.06, ctr: 1.03, conversion: 0.95 } },
  ],
  styles: [
    { id: "sky", label: "Open sky", lift: { ctr: 1.04 } },
    { id: "studio", label: "Pocket studio", lift: { conversion: 1.05 } },
    { id: "dusk", label: "City at dusk", lift: { reach: 0.97, ctr: 1.09 } },
  ],
  variants: [
    {
      id: "A",
      name: "Pocket proof",
      headline: "Fold it. Pocket it. Fly it.",
      body: "Kite Mini weighs 249 g and folds smaller than a phone. Made for {audience} who travel light and still want the aerial shot.",
      cta: "Pre-order Kite Mini",
      lift: { ctr: 1.06 },
    },
    {
      id: "B",
      name: "The 249 g rule",
      headline: "Under 250 grams. Over the ridge.",
      body: "At 249 g, Kite Mini skips registration in most countries. 4K/60 video and 34 minutes a charge, in a {tone} first cut.",
      cta: "Reserve for 3 June",
      lift: { reach: 0.96, conversion: 1.08 },
    },
    {
      id: "C",
      name: "First flight",
      headline: "Your first flight takes one tap.",
      body: "Tap once and Kite Mini lifts off, holds steady and frames the shot. Built for {audience}, cut for {channel}.",
      cta: "Watch the first flight",
      lift: { ctr: 1.1, conversion: 0.92 },
    },
  ],
  recent: [
    { id: "kite-r1", title: "Fold it. Pocket it. Fly it.", variant: "A", when: "Yesterday 17:20" },
    { id: "kite-r2", title: "Under 250 grams. Over the ridge.", variant: "B", when: "Mon 11:05" },
    { id: "kite-r3", title: "Your first flight takes one tap.", variant: "C", when: "12 May" },
  ],
  initialRun: 6,
}

/* The hook runs four 420 ms stages; the track draws that same clock. */
const STAGE_MS = 420
const TRACK_MS = STAGE_MS * GENERATION_STAGES.length
const RATES = [0.5, 1, 2] as const
type Rate = (typeof RATES)[number]
type Enter = "none" | "left" | "right"
type RunRecord = { key: number; n: number; at: string }
type RunState = "done" | "running" | "failed"

const css = `
@keyframes mb-blur-in {
  0% { opacity: 0; filter: blur(10px); transform: translateY(-0.4em); }
  55% { opacity: 0.6; filter: blur(4px); transform: translateY(0.04em); }
  100% { opacity: 1; filter: blur(0); transform: none; }
}
@keyframes mb-from-right { from { opacity: 0; filter: blur(6px); transform: translateX(44px); } to { opacity: 1; filter: blur(0); transform: none; } }
@keyframes mb-from-left { from { opacity: 0; filter: blur(6px); transform: translateX(-44px); } to { opacity: 1; filter: blur(0); transform: none; } }
@keyframes mb-rise { from { opacity: 0; transform: translateY(80%); } to { opacity: 1; transform: none; } }
@keyframes mb-slide-in { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: none; } }
@keyframes mb-playhead { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes mb-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.mb-root .mb-blur-word { animation: mb-blur-in calc(720ms / var(--mb-rate, 1)) cubic-bezier(0.2, 0.7, 0.2, 1) both; }
.mb-root .mb-from-right { animation: mb-from-right calc(480ms / var(--mb-rate, 1)) cubic-bezier(0.16, 1, 0.3, 1) both; }
.mb-root .mb-from-left { animation: mb-from-left calc(480ms / var(--mb-rate, 1)) cubic-bezier(0.16, 1, 0.3, 1) both; }
.mb-root .mb-rise { animation: mb-rise calc(360ms / var(--mb-rate, 1)) cubic-bezier(0.16, 1, 0.3, 1) both; }
.mb-root .mb-slide-in { animation: mb-slide-in calc(420ms / var(--mb-rate, 1)) cubic-bezier(0.16, 1, 0.3, 1) both; }
.mb-root .mb-playhead-run { animation: mb-playhead ${TRACK_MS}ms linear both; }
.mb-root .mb-fill-run { transform-origin: left center; animation: mb-fill ${STAGE_MS}ms linear both; }
.mb-root .mb-ease { transition-duration: calc(200ms / var(--mb-rate, 1)); }
.mb-root[data-still="true"] *, .mb-root[data-still="true"] *::before, .mb-root[data-still="true"] *::after {
  animation: none !important;
  transition: none !important;
}
`

/* ---------- media queries read through useSyncExternalStore ---------- */

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)"
const FINE_QUERY = "(hover: hover) and (pointer: fine)"

function subscribeQuery(query: string, onChange: () => void) {
  const list = window.matchMedia(query)
  list.addEventListener("change", onChange)
  return () => list.removeEventListener("change", onChange)
}
const subscribeReduce = (onChange: () => void) => subscribeQuery(REDUCE_QUERY, onChange)
const subscribeFine = (onChange: () => void) => subscribeQuery(FINE_QUERY, onChange)
const readReduce = () => window.matchMedia(REDUCE_QUERY).matches
const readFine = () => window.matchMedia(FINE_QUERY).matches
const readFalse = () => false

function clock() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
}

function timecode(ms: number) {
  const seconds = Math.max(0, ms) / 1000
  const whole = Math.floor(seconds)
  const hundredths = Math.floor((seconds - whole) * 100)
  return `00:${String(whole).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`
}

function runStates(runs: RunRecord[], outputRun: number, busy: boolean): RunState[] {
  return runs.map((run, index) => {
    if (runs.slice(index + 1).some((later) => later.n === run.n)) return "failed"
    if (index === runs.length - 1) {
      if (busy) return "running"
      return outputRun >= run.n ? "done" : "failed"
    }
    return "done"
  })
}

/* ---------- react-bits primitives ---------- */

type SparkPoint = { x: number; y: number; angle: number; start: number }

// Adapted from react-bits ClickSpark (DavidHDev/react-bits@c5df861, MIT + Commons Clause): canvas burst, loop runs only while sparks live.
function Spark({ color, rate, still, children }: { color: string; rate: Rate; still: boolean; children: ReactNode }) {
  const host = useRef<HTMLSpanElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<SparkPoint[]>([])
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const burst = (event: MouseEvent<HTMLSpanElement>) => {
    const surface = canvas.current
    const wrap = host.current
    if (still || !surface || !wrap) return
    const context = surface.getContext("2d")
    if (!context) return
    const pad = 28
    const box = wrap.getBoundingClientRect()
    const width = box.width + pad * 2
    const height = box.height + pad * 2
    const ratio = window.devicePixelRatio || 1
    if (surface.width !== Math.round(width * ratio) || surface.height !== Math.round(height * ratio)) {
      surface.width = Math.round(width * ratio)
      surface.height = Math.round(height * ratio)
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    const fromKeyboard = event.detail === 0
    const x = (fromKeyboard ? box.width / 2 : event.clientX - box.left) + pad
    const y = (fromKeyboard ? box.height / 2 : event.clientY - box.top) + pad
    const start = performance.now()
    const count = 9
    for (let index = 0; index < count; index += 1) {
      sparks.current.push({ x, y, angle: (2 * Math.PI * index) / count, start })
    }
    const duration = 440 / rate
    const draw = (now: number) => {
      context.clearRect(0, 0, width, height)
      sparks.current = sparks.current.filter((spark) => {
        const progress = Math.max(0, (now - spark.start) / duration)
        if (progress >= 1) return false
        const eased = progress * (2 - progress)
        const distance = eased * 22
        const length = 9 * (1 - eased)
        context.strokeStyle = color
        context.lineWidth = 2
        context.lineCap = "round"
        context.beginPath()
        context.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle))
        context.lineTo(
          spark.x + (distance + length) * Math.cos(spark.angle),
          spark.y + (distance + length) * Math.sin(spark.angle)
        )
        context.stroke()
        return true
      })
      frame.current = sparks.current.length > 0 ? requestAnimationFrame(draw) : 0
    }
    if (!frame.current) frame.current = requestAnimationFrame(draw)
  }

  return (
    <span ref={host} className="relative inline-flex" onClick={burst}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-7 h-[calc(100%+56px)] w-[calc(100%+56px)]"
      />
      {children}
    </span>
  )
}

// Adapted from react-bits Magnet (DavidHDev/react-bits@c5df861, MIT + Commons Clause): writes transform directly instead of re-rendering.
function Magnet({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const outer = useRef<HTMLSpanElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrap = outer.current
    const body = inner.current
    if (!enabled || !wrap || !body) return
    const padding = 56
    const strength = 5
    const move = (event: globalThis.MouseEvent) => {
      const box = wrap.getBoundingClientRect()
      const dx = event.clientX - (box.left + box.width / 2)
      const dy = event.clientY - (box.top + box.height / 2)
      if (Math.abs(dx) < box.width / 2 + padding && Math.abs(dy) < box.height / 2 + padding) {
        body.style.transition = "transform 0.3s ease-out"
        body.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`
      } else {
        body.style.transition = "transform 0.5s ease-in-out"
        body.style.transform = "translate3d(0, 0, 0)"
      }
    }
    window.addEventListener("mousemove", move)
    return () => {
      window.removeEventListener("mousemove", move)
      body.style.transition = ""
      body.style.transform = ""
    }
  }, [enabled])

  return (
    <span ref={outer} className="relative inline-flex">
      <span ref={inner} className="inline-flex will-change-transform">
        {children}
      </span>
    </span>
  )
}

// BlurText behaviour from react-bits (DavidHDev/react-bits@c5df861): word-by-word blur-to-sharp, rebuilt on CSS keyframes.
function BlurHeadline({ text, still, className }: { text: string; still: boolean; className: string }) {
  const words = text.split(" ")
  return (
    <h2 className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          {index > 0 ? " " : null}
          <span
            className={still ? "inline-block" : "mb-blur-word inline-block"}
            style={{ animationDelay: `calc(${index * 85}ms / var(--mb-rate, 1))` }}
          >
            {word}
          </span>
        </span>
      ))}
    </h2>
  )
}

// CountUp behaviour from react-bits (DavidHDev/react-bits@c5df861): counts from the previous value on requestAnimationFrame.
function Rolling({
  value,
  format,
  rate,
  still,
  className,
}: {
  value: number
  format: (value: number) => string
  rate: Rate
  still: boolean
  className: string
}) {
  const node = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)

  useLayoutEffect(() => {
    const element = node.current
    if (!element) return
    const from = shown.current
    if (still || from === value) {
      shown.current = value
      element.textContent = format(value)
      return
    }
    element.textContent = format(from)
    const duration = 900 / rate
    let frame = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = from + (value - from) * eased
      shown.current = current
      element.textContent = format(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, format, rate, still])

  return (
    <>
      <span ref={node} aria-hidden="true" className={className}>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}

function Timecode({ running, runKey, stage, still }: { running: boolean; runKey: number; stage: number; still: boolean }) {
  const node = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = node.current
    if (!element || !running || still) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const elapsed = Math.min(TRACK_MS, now - start)
      element.textContent = timecode(elapsed)
      if (elapsed < TRACK_MS) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, runKey, still])

  const label = running ? (still ? timecode((stage + 1) * STAGE_MS) : timecode(0)) : timecode(TRACK_MS)
  return (
    <span ref={node} className={`${MONO} text-[13px] text-[#0F1826]`}>
      {label}
    </span>
  )
}

function DroneMark({ stroke, accent, className }: { stroke: string; accent: string; className: string }) {
  const rotors = [
    [34, 26],
    [126, 26],
    [34, 94],
    [126, 94],
  ] as const
  return (
    <svg viewBox="0 0 160 120" role="img" aria-label="Kite Mini, top view with arms unfolded" className={className}>
      {rotors.map(([x, y]) => (
        <g key={`${x}-${y}`} fill="none" stroke={stroke} strokeLinecap="round">
          <line x1={x} y1={y} x2={x < 80 ? 64 : 96} y2={y < 60 ? 48 : 72} strokeWidth="4" />
          <circle cx={x} cy={y} r="21" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7" />
          <line x1={x - 16} y1={y - 4} x2={x + 16} y2={y + 4} strokeWidth="2.5" />
          <circle cx={x} cy={y} r="3.5" fill={stroke} stroke="none" />
        </g>
      ))}
      <rect x="60" y="40" width="40" height="40" rx="12" fill={stroke} />
      <rect x="70" y="80" width="20" height="10" rx="4" fill={stroke} />
      <circle cx="80" cy="86" r="3.5" fill={accent} />
    </svg>
  )
}

const LOOKS: Record<string, { frame: string; ink: string; soft: string; stroke: string; cta: string; ctaText: string }> = {
  sky: { frame: "bg-[#DCE8FD]", ink: "text-[#0F1826]", soft: "text-[#3B4A61]", stroke: "#0F1826", cta: "bg-[#FF5A3C]", ctaText: "text-[#0F1826]" },
  studio: { frame: "bg-white", ink: "text-[#0F1826]", soft: "text-[#4A5568]", stroke: "#0F1826", cta: "bg-[#0F1826]", ctaText: "text-white" },
  dusk: { frame: "bg-[#0F1826]", ink: "text-[#EEF1F6]", soft: "text-[#B9C3D3]", stroke: "#EEF1F6", cta: "bg-[#FF5A3C]", ctaText: "text-[#0F1826]" },
}

function AdFrame({ variant, settings, still }: { variant: RenderedVariant; settings: Settings; still: boolean }) {
  const look = LOOKS[settings.style] ?? LOOKS.sky
  const wide = settings.channel === "preroll"
  const tall = settings.channel === "reels"
  const shape = wide
    ? "aspect-video w-full max-w-[600px]"
    : tall
      ? "aspect-[9/16] h-full max-w-full"
      : "aspect-[4/5] h-full max-w-full"
  const headline = wide
    ? "text-[24px] leading-[1.05] sm:text-[30px]"
    : tall
      ? "text-[19px] leading-[1.08] sm:text-[21px]"
      : "text-[22px] leading-[1.06] sm:text-[25px]"
  return (
    <figure
      className={`relative flex overflow-hidden rounded-[14px] ${look.frame} ${shape} ${wide ? "flex-row items-center gap-4 p-5 sm:p-7" : "flex-col p-4 sm:p-5"}`}
    >
      {settings.style === "studio" ? (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] bg-[#EEF1F6]" />
      ) : null}
      {settings.style === "dusk" ? (
        <svg aria-hidden="true" viewBox="0 0 300 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[16%] w-full">
          <path d="M0 40V22h22V12h18v10h26V4h20v18h30V14h16v8h34V8h24v14h28V16h22v6h30V10h30v30Z" fill="#1C2A40" />
        </svg>
      ) : null}
      <div className={`relative flex ${wide ? "w-[42%] shrink-0 justify-center" : "justify-center pb-3 pt-2"}`}>
        <DroneMark stroke={look.stroke} accent="#FF5A3C" className={wide ? "w-full max-w-[210px]" : tall ? "h-24 w-auto" : "h-28 w-auto"} />
      </div>
      <figcaption className={`relative flex min-w-0 flex-col ${wide ? "flex-1" : "flex-1 justify-end"}`}>
        <BlurHeadline text={variant.headline} still={still} className={`font-semibold tracking-[-0.02em] text-balance ${headline} ${look.ink}`} />
        <p className={`mt-2 text-[12px] leading-[1.45] sm:text-[13px] ${look.soft}`}>{variant.body}</p>
        <span
          className={`mt-3 inline-flex min-h-8 w-fit items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold ${look.cta} ${look.ctaText}`}
        >
          {variant.cta}
          <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
        </span>
      </figcaption>
    </figure>
  )
}

function Diamond({ tone }: { tone: "done" | "open" | "ghost" | "error" }) {
  if (tone === "error") {
    return (
      <svg viewBox="0 0 10 10" aria-hidden="true" className="size-[11px]">
        <path d="M2 2l6 6M8 2l-6 6" stroke="#C8322B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  const fill = tone === "done" ? "#FF5A3C" : tone === "open" ? "#FFFFFF" : "none"
  const stroke = tone === "done" ? "#0F1826" : tone === "open" ? "#0F1826" : "#8A96A8"
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className="size-[11px]">
      <path d="M5 0.8 9.2 5 5 9.2 0.8 5Z" fill={fill} stroke={stroke} strokeWidth="1.3" />
    </svg>
  )
}

function RunBlock({
  run,
  state,
  latest,
  stage,
  still,
}: {
  run: RunRecord
  state: RunState
  latest: boolean
  stage: number
  still: boolean
}) {
  const ghost = !latest
  const running = state === "running"
  const statusText = running ? "rendering" : state === "failed" ? "failed" : "rendered"
  const parked = running && still ? `translateX(${((stage + 1) / GENERATION_STAGES.length) * 100}%)` : "translateX(100%)"
  return (
    <li
      aria-label={`Run ${run.n}, ${statusText} at ${run.at}`}
      className={`relative w-[188px] shrink-0 rounded-[10px] px-3 sm:w-[212px] ${latest ? "bg-white" : ""}`}
    >
      <div className="flex h-9 items-center justify-between gap-2 text-[12px]">
        <span className={`font-semibold ${ghost ? "text-[#4A5568]" : "text-[#0F1826]"}`}>Run {run.n}</span>
        <span className={`${MONO} text-[11px] ${state === "failed" ? "text-[#C8322B]" : "text-[#4A5568]"}`}>
          {state === "failed" ? "failed" : run.at}
        </span>
      </div>
      <div className="relative">
        {GENERATION_STAGES.map((label, lane) => {
          const done = state !== "running" || lane < stage
          const active = running && lane === stage
          const startTone = ghost ? "ghost" : done || active ? "done" : "open"
          const endTone =
            state === "failed" && lane === GENERATION_STAGES.length - 1 ? "error" : ghost ? "ghost" : done ? "done" : "open"
          return (
            <div key={label} className="relative h-[30px]">
              <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-[#D5DBE5]" />
              <span
                aria-hidden="true"
                className="absolute top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full"
                style={{ left: `${lane * 25}%`, width: "25%" }}
              >
                {done || active ? (
                  <span
                    key={active ? `run-${run.key}-${lane}` : "static"}
                    className={`block h-full w-full ${ghost ? "bg-[#B4BDCB]" : "bg-[#0F1826]"} ${active ? "mb-fill-run" : ""}`}
                  />
                ) : null}
              </span>
              <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${lane * 25}%` }}>
                <Diamond tone={startTone} />
              </span>
              <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(lane + 1) * 25}%` }}>
                <Diamond tone={endTone} />
              </span>
            </div>
          )
        })}
        {latest ? (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-2 bottom-0 left-0 w-full ${running && !still ? "mb-playhead-run" : ""}`}
            style={running && !still ? undefined : { transform: parked }}
          >
            <span className={`absolute -top-1 left-0 h-2.5 w-2.5 -translate-x-1/2 rounded-[2px] ${state === "failed" ? "bg-[#C8322B]" : "bg-[#2F7CF6]"}`} />
            <span className={`absolute bottom-0 left-0 top-1 w-[1.5px] -translate-x-1/2 ${state === "failed" ? "bg-[#C8322B]" : "bg-[#2F7CF6]"}`} />
          </div>
        ) : null}
      </div>
      <div aria-hidden="true" className={`${MONO} flex h-6 items-center justify-between text-[10px] text-[#4A5568]`}>
        <span>0.00</span>
        <span>{(TRACK_MS / 2000).toFixed(2)}</span>
        <span>{(TRACK_MS / 1000).toFixed(2)}</span>
      </div>
    </li>
  )
}

function MotionTrack({
  runs,
  states,
  stage,
  still,
}: {
  runs: RunRecord[]
  states: RunState[]
  stage: number
  still: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const lastKey = runs[runs.length - 1]?.key

  useEffect(() => {
    const element = scroller.current
    if (!element) return
    element.scrollTo({ left: element.scrollWidth, behavior: still ? "auto" : "smooth" })
  }, [lastKey, still])

  const latestRunning = states[states.length - 1] === "running"
  return (
    <div className="flex min-w-0">
      <ol aria-label="Generation stages" className="w-[104px] shrink-0 pt-[42px] sm:w-[150px]">
        {GENERATION_STAGES.map((label, lane) => {
          const active = latestRunning && lane === stage
          return (
            <li
              key={label}
              className={`flex h-[30px] items-center gap-1.5 pr-2 text-[11px] leading-[13px] sm:text-[12.5px] ${active ? "font-semibold text-[#0F1826]" : "text-[#4A5568]"}`}
            >
              <span aria-hidden="true" className={`size-1.5 shrink-0 rotate-45 ${active ? "bg-[#2F7CF6]" : "bg-[#B4BDCB]"}`} />
              {label}
            </li>
          )
        })}
      </ol>
      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Runs on the motion track, oldest to newest"
        className={`min-w-0 flex-1 overflow-x-auto rounded-[10px] bg-[#E3E8F0] ${FOCUS}`}
      >
        <ol className="flex w-max gap-1.5 p-1.5">
          {runs.map((run, index) => (
            <RunBlock
              key={run.key}
              run={run}
              state={states[index]}
              latest={index === runs.length - 1}
              stage={stage}
              still={still}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

function Segmented<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  mono = false,
  columns,
}: {
  name: string
  legend: string
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  mono?: boolean
  columns: string
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-[12.5px] font-semibold text-[#0F1826]">{legend}</legend>
      <div className={`grid ${columns} gap-1 rounded-[10px] bg-[#E3E8F0] p-1`}>
        {options.map((option) => (
          <label
            key={option.id}
            className={`mb-ease relative flex min-h-10 cursor-pointer items-center justify-center rounded-[7px] px-2 text-center text-[12.5px] leading-tight text-[#4A5568] transition-colors hover:bg-white/70 hover:text-[#0F1826] has-[:checked]:bg-[#0F1826] has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2F7CF6] sm:min-h-9 ${mono ? MONO : ""}`}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const reachText = (value: number) => formatReach(Math.round(value))
const percentText = (value: number) => formatPercent(value)

type RateId = `${Rate}`
const RATE_OPTIONS: { id: RateId; label: string }[] = RATES.map((value) => ({ id: String(value) as RateId, label: `${value}×` }))

const METRIC_ROWS = [
  { key: "reach", label: "Reach", kind: "reach" },
  { key: "ctr", label: "CTR", kind: "percent" },
  { key: "conversion", label: "Conversion", kind: "percent" },
] as const

const RATIO_BOX: Record<string, string> = {
  reels: "h-6 w-[13.5px]",
  preroll: "h-[13.5px] w-6",
  feed: "h-6 w-[19px]",
}

function Delta({ current, previous, kind }: { current: number; previous: number | undefined; kind: "reach" | "percent" }) {
  const delta = formatDelta(current, previous, kind)
  if (!delta) return <span className="text-[11.5px] text-[#4A5568]">No earlier run yet</span>
  const up = delta.startsWith("+")
  const flat = delta === "±0"
  return (
    <span className={`${MONO} inline-flex items-center gap-1 text-[11.5px] text-[#0F1826]`}>
      {flat ? null : up ? (
        <ArrowUpRight aria-hidden="true" className="size-3.5 text-[#19B38A]" strokeWidth={2.5} />
      ) : (
        <ArrowDownRight aria-hidden="true" className="size-3.5 text-[#FF5A3C]" strokeWidth={2.5} />
      )}
      {delta}
    </span>
  )
}

function Slate({ model, chain, take }: { model: string; chain: string; take: number }) {
  return (
    <div className="flex min-w-0 items-stretch overflow-hidden rounded-[8px] bg-[#0F1826] text-white">
      <span
        aria-hidden="true"
        className="w-2.5 shrink-0 bg-[repeating-linear-gradient(135deg,#FF5A3C_0_4px,#0F1826_4px_8px)]"
      />
      <dl className="flex min-w-0 items-center gap-3.5 px-3 py-1.5">
        <div>
          <dt className="text-[10px] leading-none text-[#9FB0C7]">Model</dt>
          <dd className="mt-1 text-[12.5px] font-semibold leading-none">{model}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[10px] leading-none text-[#9FB0C7]">Chain</dt>
          <dd className="mt-1 truncate text-[12.5px] font-semibold leading-none">{chain}</dd>
        </div>
        <div>
          <dt className="text-[10px] leading-none text-[#9FB0C7]">Take</dt>
          <dd className={`${MONO} mt-1 text-[12px] leading-none`}>{String(take).padStart(2, "0")}</dd>
        </div>
      </dl>
    </div>
  )
}

export default function MotionBits() {
  const m = useMuseStudio(spec)
  const systemReduce = useSyncExternalStore(subscribeReduce, readReduce, readFalse)
  const finePointer = useSyncExternalStore(subscribeFine, readFine, readFalse)
  const [reduceChoice, setReduceChoice] = useState<boolean | null>(null)
  const still = reduceChoice ?? systemReduce
  const [rate, setRate] = useState<Rate>(1)
  const [enter, setEnter] = useState<Enter>("none")
  const base = spec.initialRun ?? 1
  const [runs, setRuns] = useState<RunRecord[]>(() => [
    { key: 0, n: base - 2, at: "09:12" },
    { key: 1, n: base - 1, at: "09:31" },
    { key: 2, n: base, at: "09:40" },
  ])
  const runKey = useRef(3)

  const states = runStates(runs, m.output.run, m.busy)
  const latest = runs[runs.length - 1]
  const generateError = m.generateStatus === "error" ? m.generateError : null
  const serviceDown = Boolean(generateError?.startsWith("The forecast service"))
  const saveError = m.saveStatus === "error" ? m.saveError : null
  const exportError = m.exportStatus === "error" ? m.exportError : null
  const shown = m.output.settings
  const channelHint = spec.channels.find((option) => option.id === shown.channel)?.hint ?? ""

  const onGenerate = () => {
    if (m.busy) return
    if (!m.issue) {
      const key = runKey.current
      runKey.current += 1
      const record = { key, n: m.output.run + 1, at: clock() }
      setRuns((current) => [...current, record].slice(-8))
    }
    m.generate()
  }

  const directionTo = (id: VariantId): Enter =>
    VARIANT_IDS.indexOf(id) > VARIANT_IDS.indexOf(m.selected) ? "right" : "left"

  const pick = (id: VariantId) => {
    if (id === m.selected) return
    setEnter(directionTo(id))
    m.select(id)
  }

  const onRestore = (item: RecentCampaign) => {
    if (item.variant !== m.selected) setEnter(directionTo(item.variant))
    m.restore(item)
  }

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = VARIANT_IDS.indexOf(m.selected)
    const last = VARIANT_IDS.length - 1
    let next = index
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = last
    else return
    event.preventDefault()
    const id = VARIANT_IDS[next]
    pick(id)
    document.getElementById(`mb-tab-${id}`)?.focus()
  }

  let status: ReactNode
  let statusIcon: ReactNode = null
  if (m.busy) {
    statusIcon = <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin text-[#2F7CF6]" />
    status = (
      // RotatingText behaviour from react-bits: each stage label rises into place.
      <span key={`stage-${latest.key}-${m.stage}`} className="mb-rise inline-block">
        Run {m.output.run + 1}: {m.stageLabel}
      </span>
    )
  } else if (generateError) {
    statusIcon = <CircleAlert aria-hidden="true" className="size-4 shrink-0 text-[#C8322B]" />
    status = serviceDown ? `Run ${m.output.run + 1} did not finish` : "Generation blocked: the brief needs work"
  } else if (m.exportStatus === "exported") {
    statusIcon = <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-[#19B38A]" />
    status = `Exported route ${m.selected} from run ${m.output.run}`
  } else if (m.saveStatus === "saved") {
    statusIcon = <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-[#19B38A]" />
    status = `Saved route ${m.selected} to recent campaigns`
  } else if (m.generateStatus === "success") {
    statusIcon = <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-[#19B38A]" />
    status = `Run ${m.output.run} ready: three routes forecast`
  } else if (m.stale) {
    statusIcon = <History aria-hidden="true" className="size-4 shrink-0 text-[#4A5568]" />
    status = `Controls changed since run ${m.output.run}`
  } else {
    status = `Run ${m.output.run} on stage, rendered ${m.output.at}`
  }

  const metrics = m.current.metrics
  const before = m.previous?.metrics

  return (
    <main
      data-still={still ? "true" : "false"}
      style={{ "--mb-rate": rate } as CSSProperties}
      className={`${grotesk.className} mb-root min-h-[100dvh] overflow-x-clip bg-[#EEF1F6] text-[#0F1826] antialiased selection:bg-[#FF5A3C] selection:text-[#0F1826]`}
    >
      <style>{css}</style>

      <header className="border-b border-[#D5DBE5] bg-white">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center gap-x-5 gap-y-3 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-[15px] font-bold tracking-[-0.01em]">
              Muse <span className="font-medium text-[#4A5568]">/ Kite Mini launch</span>
            </p>
            <Slate model={m.modelName} chain={m.chain} take={m.output.run} />
          </div>
          <p
            id="mb-status"
            aria-live="polite"
            className="order-last flex min-h-6 w-full min-w-0 items-center gap-2 overflow-hidden text-[13px] text-[#0F1826] lg:order-none lg:w-auto lg:flex-1"
          >
            {statusIcon}
            <span className="min-w-0 truncate">{status}</span>
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Magnet enabled={finePointer && !still && !m.busy}>
              <Spark color="#FF5A3C" rate={rate} still={still}>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={m.busy}
                  className={`mb-ease inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FF5A3C] px-5 text-[14px] font-semibold text-[#0F1826] transition hover:bg-[#FF7257] active:scale-[0.97] disabled:cursor-progress ${FOCUS}`}
                >
                  {m.busy ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <Wand2 aria-hidden="true" className="size-4" />
                  )}
                  {m.busy ? "Generating" : "Generate"}
                </button>
              </Spark>
            </Magnet>
            <Spark color="#2F7CF6" rate={rate} still={still}>
              <button
                type="button"
                onClick={m.save}
                disabled={m.saveStatus === "saving"}
                className={`mb-ease inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-[#0F1826] ring-1 ring-[#C9D1DD] transition hover:bg-[#EEF1F6] active:scale-[0.97] disabled:cursor-progress ${FOCUS}`}
              >
                {m.saveStatus === "saving" ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : m.saveStatus === "saved" ? (
                  <Check aria-hidden="true" className="size-4 text-[#19B38A]" strokeWidth={3} />
                ) : (
                  <Save aria-hidden="true" className="size-4" />
                )}
                {m.saveStatus === "saving" ? "Saving" : m.saveStatus === "saved" ? "Saved" : "Save"}
              </button>
            </Spark>
            <Spark color="#0F1826" rate={rate} still={still}>
              <button
                type="button"
                onClick={() => m.exportCampaign()}
                disabled={m.exportStatus === "exporting"}
                className={`mb-ease inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0F1826] px-4 text-[14px] font-semibold text-white transition hover:bg-[#223149] active:scale-[0.97] disabled:cursor-progress ${FOCUS}`}
              >
                {m.exportStatus === "exporting" ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : m.exportStatus === "exported" ? (
                  <Check aria-hidden="true" className="size-4 text-[#5FE0BC]" strokeWidth={3} />
                ) : (
                  <Download aria-hidden="true" className="size-4" />
                )}
                {m.exportStatus === "exporting" ? "Exporting" : m.exportStatus === "exported" ? "Exported" : "Export"}
              </button>
            </Spark>
          </div>
        </div>
      </header>

      {saveError || exportError ? (
        <div className="mx-auto max-w-[1560px] space-y-2 px-4 pt-3 sm:px-6">
          {saveError ? (
            <p role="alert" className="flex items-start gap-2 rounded-[10px] bg-white px-3 py-2 text-[13px] ring-1 ring-[#C8322B]">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C8322B]" />
              {saveError}
            </p>
          ) : null}
          {exportError ? (
            <p role="alert" className="flex items-start gap-2 rounded-[10px] bg-white px-3 py-2 text-[13px] ring-1 ring-[#C8322B]">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C8322B]" />
              {exportError}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1560px] gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[284px_minmax(0,1fr)] xl:grid-cols-[284px_minmax(0,1fr)_264px] xl:gap-6">
        <aside aria-label="Campaign controls" className="min-w-0 space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="mb-brief" className="text-[12.5px] font-semibold">
                Brief
              </label>
              <span
                className={`${MONO} text-[11px] ${m.settings.brief.trim().length > BRIEF_MAX ? "text-[#C8322B]" : "text-[#4A5568]"}`}
              >
                {m.settings.brief.trim().length}/{BRIEF_MAX}
              </span>
            </div>
            <textarea
              id="mb-brief"
              rows={6}
              value={m.settings.brief}
              onChange={(event) => m.setBrief(event.target.value)}
              aria-invalid={m.issue ? true : undefined}
              aria-describedby="mb-brief-note"
              className={`mt-1.5 block w-full resize-y rounded-[10px] border bg-white px-3 py-2.5 text-[13.5px] leading-[1.5] text-[#0F1826] placeholder:text-[#4A5568] ${m.issue ? "border-[#C8322B]" : "border-[#C9D1DD] hover:border-[#8A96A8]"} ${FOCUS}`}
            />
            <p id="mb-brief-note" className={`mt-1.5 text-[12px] leading-snug ${m.issue ? "text-[#C8322B]" : "text-[#4A5568]"}`}>
              {m.issue ?? "Say what launches, for whom, and by when."}
            </p>
          </div>

          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-[12.5px] font-semibold">Audience</legend>
            <div className="space-y-1">
              {spec.audiences.map((option) => (
                <label
                  key={option.id}
                  className="mb-ease flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-transparent bg-white/55 px-3 py-1.5 transition-colors hover:bg-white has-[:checked]:border-[#0F1826] has-[:checked]:bg-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2F7CF6]"
                >
                  <input
                    type="radio"
                    name="mb-audience"
                    value={option.id}
                    checked={m.settings.audience === option.id}
                    onChange={() => m.setControl("audience", option.id)}
                    className="sr-only"
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold leading-tight">{option.label}</span>
                    <span className="block text-[11.5px] leading-tight text-[#4A5568]">{option.hint}</span>
                  </span>
                  <span className={`${MONO} shrink-0 text-[11px] text-[#4A5568]`}>{formatReach(option.size ?? 0)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-[12.5px] font-semibold">Channel</legend>
            <div className="grid grid-cols-3 gap-1">
              {spec.channels.map((option) => (
                <label
                  key={option.id}
                  className="mb-ease flex min-h-[74px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] bg-white/55 px-1.5 py-2 text-center text-[#0F1826] transition-colors hover:bg-white has-[:checked]:bg-[#0F1826] has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#2F7CF6]"
                >
                  <input
                    type="radio"
                    name="mb-channel"
                    value={option.id}
                    checked={m.settings.channel === option.id}
                    onChange={() => m.setControl("channel", option.id)}
                    className="sr-only"
                  />
                  <span aria-hidden="true" className={`block rounded-[3px] border-[1.5px] border-current ${RATIO_BOX[option.id]}`} />
                  <span className="text-[12px] font-semibold leading-tight">{option.label}</span>
                  <span className={`${MONO} text-[10.5px] opacity-80`}>{option.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Segmented
            name="mb-tone"
            legend="Tone"
            columns="grid-cols-3"
            options={spec.tones}
            value={m.settings.tone}
            onChange={(id) => m.setControl("tone", id)}
          />
          <Segmented
            name="mb-style"
            legend="Visual style"
            columns="grid-cols-3"
            options={spec.styles}
            value={m.settings.style}
            onChange={(id) => m.setControl("style", id)}
          />

          <div className="space-y-1 border-t border-[#D5DBE5] pt-3">
            <label className="flex min-h-10 cursor-pointer items-start gap-2.5 text-[12.5px] leading-snug text-[#4A5568]">
              <input
                type="checkbox"
                checked={m.failNext}
                onChange={(event) => m.setFailNext(event.target.checked)}
                className={`mt-0.5 size-4 shrink-0 accent-[#C8322B] ${FOCUS}`}
              />
              <span>
                <span className="font-semibold text-[#0F1826]">Simulate a forecast outage</span> on the next run to
                rehearse the error state.
              </span>
            </label>
            <button
              type="button"
              onClick={m.reset}
              className={`inline-flex min-h-10 items-center gap-2 rounded-[8px] text-[12.5px] font-semibold text-[#0F1826] underline-offset-4 hover:underline ${FOCUS}`}
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Reset to launch defaults
            </button>
          </div>
        </aside>
        <section aria-labelledby="mb-stage-title" className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 id="mb-stage-title" className="text-[22px] leading-tight font-bold tracking-[-0.02em]">
              Kite Mini launch
            </h1>
            <div role="tablist" aria-label="Campaign routes" onKeyDown={onTabKey} className="flex gap-1 rounded-full bg-[#E3E8F0] p-1">
              {VARIANT_IDS.map((id) => {
                const active = m.selected === id
                return (
                  <button
                    key={id}
                    id={`mb-tab-${id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="mb-stage"
                    tabIndex={active ? 0 : -1}
                    onClick={() => pick(id)}
                    className={`mb-ease inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition-colors ${FOCUS} ${
                      active ? "bg-[#0F1826] text-white" : "text-[#4A5568] hover:bg-white hover:text-[#0F1826]"
                    }`}
                  >
                    {id}
                    <span className="hidden max-w-[9rem] truncate font-medium sm:inline">{m.output.variants[id].name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {generateError ? (
            <p role="alert" className="flex items-start gap-2 rounded-[10px] bg-white px-3 py-2.5 text-[13px] ring-1 ring-[#C8322B]">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#C8322B]" />
              {generateError}
            </p>
          ) : null}

          <div
            id="mb-stage"
            role="tabpanel"
            aria-labelledby={`mb-tab-${m.selected}`}
            className="relative flex h-[23rem] items-center justify-center overflow-hidden rounded-[16px] bg-white p-4 ring-1 ring-[#D5DBE5] sm:h-[25rem]"
          >
            <div
              key={`${m.output.run}-${m.selected}`}
              className={`mb-ease flex h-full w-full items-center justify-center transition-opacity ${
                enter === "right" ? "mb-from-right" : enter === "left" ? "mb-from-left" : ""
              } ${m.busy ? "opacity-40" : ""}`}
            >
              <AdFrame variant={m.current} settings={shown} still={still} />
            </div>
            {m.stale && !m.busy ? (
              <p className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] rounded-[8px] bg-[#0F1826] px-3 py-2 text-[12.5px] text-white">
                Out of date: controls changed after run {m.output.run}. Generate again to re-render.
              </p>
            ) : null}
            <p className={`${MONO} absolute right-3 bottom-2 text-[10.5px] text-[#4A5568]`}>{channelHint}</p>
          </div>

          <div className="rounded-[14px] bg-white p-3 ring-1 ring-[#D5DBE5]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-[12.5px] font-semibold">Motion track</h2>
              <Timecode running={m.busy} runKey={latest.key} stage={m.stage} still={still} />
            </div>
            <MotionTrack runs={runs} states={states} stage={m.stage} still={still} />
          </div>
        </section>

        <aside aria-label="Forecast and history" className="flex min-w-0 flex-col gap-4 lg:col-span-2 xl:col-span-1">
          <section aria-labelledby="mb-forecast" className="rounded-[14px] bg-white p-3.5 ring-1 ring-[#D5DBE5]">
            <h2 id="mb-forecast" className="text-[12.5px] font-semibold">
              Forecast, route {m.selected} <span className="font-normal text-[#4A5568]">(simulated)</span>
            </h2>
            <dl className="mt-2 grid grid-cols-3 gap-3 xl:grid-cols-1 xl:gap-2.5">
              {METRIC_ROWS.map((row) => (
                <div key={row.key} className="min-w-0">
                  <dt className="text-[12px] text-[#4A5568]">{row.label}</dt>
                  <dd className="text-[24px] leading-tight font-bold tracking-[-0.02em]">
                    <Rolling value={metrics[row.key]} format={row.kind === "reach" ? reachText : percentText} rate={rate} still={still} className={MONO} />
                  </dd>
                  <dd>
                    <Delta current={metrics[row.key]} previous={before?.[row.key]} kind={row.kind} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="mb-motion" className="rounded-[14px] bg-white p-3.5 ring-1 ring-[#D5DBE5]">
            <h2 id="mb-motion" className="text-[12.5px] font-semibold">
              Motion
            </h2>
            <div className="mt-2 flex flex-col gap-2.5">
              <Segmented
                name="mb-rate"
                legend="Playback speed"
                columns="grid-cols-3"
                mono
                options={RATE_OPTIONS}
                value={String(rate) as RateId}
                onChange={(id) => setRate(Number(id) as Rate)}
              />
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-[12.5px] text-[#4A5568]">
                <input type="checkbox" checked={still} onChange={(event) => setReduceChoice(event.target.checked)} className={`size-4 accent-[#2F7CF6] ${FOCUS}`} />
                Hold motion still{systemReduce ? " (your system asks for reduced motion)" : ""}
              </label>
            </div>
          </section>

          <section aria-labelledby="mb-recent" className="rounded-[14px] bg-white p-3.5 ring-1 ring-[#D5DBE5]">
            <h2 id="mb-recent" className="text-[12.5px] font-semibold">
              Recent campaigns
            </h2>
            <ul className="mt-1.5 flex flex-col">
              {m.recent.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onRestore(item)}
                    className={`mb-ease flex min-h-11 w-full items-center gap-2.5 rounded-[8px] px-1.5 text-left transition-colors hover:bg-[#EEF1F6] ${FOCUS}`}
                  >
                    <span className={`${MONO} flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-[#0F1826] text-[11px] text-white`}>{item.variant}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px]">{item.title}</span>
                      <span className="block text-[11px] text-[#4A5568]">{item.saved ? `Saved ${item.when}` : item.when}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="mb-log" className="rounded-[14px] bg-white p-3.5 ring-1 ring-[#D5DBE5]">
            <h2 id="mb-log" className="text-[12.5px] font-semibold">
              Activity
            </h2>
            <ol className="mt-1.5 flex flex-col gap-1">
              {m.log.slice(0, 5).map((entry) => (
                <li key={entry.id} className="mb-slide-in flex gap-2 text-[12px] leading-snug">
                  <span className={`${MONO} shrink-0 text-[11px] text-[#4A5568]`}>{entry.at}</span>
                  <span className={entry.tone === "error" ? "text-[#C8322B]" : entry.tone === "success" ? "text-[#0E7C5E]" : "text-[#0F1826]"}>{entry.text}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </main>
  )
}
