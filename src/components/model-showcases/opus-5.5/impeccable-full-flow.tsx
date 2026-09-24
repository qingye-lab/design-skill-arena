"use client"

import { Hanken_Grotesk, Spline_Sans_Mono } from "next/font/google"
import {
  Aperture,
  Check,
  ChevronRight,
  Download,
  LoaderCircle,
  RotateCcw,
  Save,
  TriangleAlert,
  Undo2,
} from "lucide-react"

import {
  BRIEF_MAX,
  BRIEF_MIN,
  GENERATION_STAGES,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ExportFile,
  type MuseStudio,
  type Output,
  type RenderedVariant,
  type StudioSpec,
} from "./core"

const ui = Hanken_Grotesk({ subsets: ["latin"], display: "swap" })
const mono = Spline_Sans_Mono({ subsets: ["latin"], display: "swap" })
/* Mono is reserved for measurements: run numbers, timestamps, counts and the forecast readout. */
const MONO = mono.className

const spec: StudioSpec = {
  showcaseId: "impeccable-full-flow",
  product: "Aperture M2",
  brief:
    "Launch Aperture M2, a 412 g full-frame mirrorless body, to hybrid shooters before the 10 October release. Lead with low-light performance and open pre-orders for launch week.",
  audiences: [
    { id: "hybrid", label: "Hybrid creators", hint: "Stills and video from one bag", size: 780000, lift: { ctr: 1.1, conversion: 1.04 } },
    { id: "upgraders", label: "Phone upgraders", hint: "Buying a first dedicated camera", size: 1340000, lift: { ctr: 0.94, conversion: 0.88 } },
    { id: "travel", label: "Travel photographers", hint: "Weight-conscious, shoot at dusk", size: 520000, lift: { reach: 0.96, conversion: 1.22 } },
  ],
  channels: [
    { id: "feed", label: "Instagram feed", hint: "4:5", lift: { reach: 1.12 } },
    { id: "preroll", label: "YouTube pre-roll", hint: "16:9", lift: { reach: 1.34, ctr: 0.72, conversion: 0.9 } },
    { id: "newsletter", label: "Camera-store newsletter", hint: "Email", lift: { reach: 0.34, ctr: 2.3, conversion: 1.38 } },
  ],
  tones: [
    { id: "understated", label: "Understated", lift: { conversion: 1.06 } },
    { id: "technical", label: "Technical", lift: { ctr: 0.96, conversion: 1.12 } },
    { id: "playful", label: "Playful", lift: { ctr: 1.12, conversion: 0.94 } },
  ],
  styles: [
    { id: "night", label: "Night street", lift: { ctr: 1.08 } },
    { id: "daylight", label: "Daylight", lift: { reach: 1.04 } },
    { id: "mono", label: "Studio mono", lift: { conversion: 1.05 } },
  ],
  variants: [
    {
      id: "A",
      name: "Pocket full frame",
      headline: "Full frame. Jacket pocket.",
      body: "{product} fits a 33 MP full-frame sensor into 412 g, for {audience} who would rather leave the big bag at home.",
      cta: "Reserve yours",
      lift: { reach: 1.06 },
    },
    {
      id: "B",
      name: "After dark",
      headline: "Keep shooting after the light goes.",
      body: "Dual-gain ISO to 51,200 and 7-stop stabilization hold a half-second handheld. The night is the sample gallery.",
      cta: "See night samples",
      lift: { ctr: 1.1, conversion: 0.96 },
    },
    {
      id: "C",
      name: "One body, both jobs",
      headline: "Stills at noon. 4K by nightfall.",
      body: "Open-gate 4K 60, a screen that flips to face you and USB-C power for long takes. One {product}, both jobs.",
      cta: "Build your kit",
      lift: { conversion: 1.12 },
    },
  ],
  recent: [
    { id: "r1", title: "M1 trade-in week", variant: "B", when: "Tue" },
    { id: "r2", title: "35 mm f/1.8 lens drop", variant: "A", when: "18 Sep" },
    { id: "r3", title: "Summer street contest recap", variant: "C", when: "2 Sep" },
  ],
  initialRun: 7,
  initialVariant: "B",
}

/* ---------- ad look per visual style (content colours, not UI chrome) ---------- */

type Grade = {
  bg: string
  wash: string
  ink: string
  sub: string
  cta: string
  ctaInk: string
  body: string
  bodyTop: string
  bodyInk: string
}

const grades: Record<string, Grade> = {
  night: {
    bg: "#0F1217",
    wash: "radial-gradient(90% 70% at 80% 12%, rgba(242,166,90,0.26), transparent 62%)",
    ink: "#F4EFE6",
    sub: "#BDB6AA",
    cta: "#F2A65A",
    ctaInk: "#15110C",
    body: "#1A1C21",
    bodyTop: "#33363D",
    bodyInk: "#8E949C",
  },
  daylight: {
    bg: "#E9E5DD",
    wash: "linear-gradient(180deg, rgba(255,255,255,0.6), transparent 55%)",
    ink: "#1A1B1E",
    sub: "#4D4A44",
    cta: "#2F5D50",
    ctaInk: "#F3F0EA",
    body: "#222428",
    bodyTop: "#43464C",
    bodyInk: "#A3A8AF",
  },
  mono: {
    bg: "#D8D9DB",
    wash: "radial-gradient(80% 60% at 50% 38%, rgba(255,255,255,0.65), transparent 70%)",
    ink: "#111316",
    sub: "#44474D",
    cta: "#111316",
    ctaInk: "#ECEDEF",
    body: "#BFC2C6",
    bodyTop: "#E6E7E9",
    bodyInk: "#3B3F45",
  },
}

const pad = (run: number) => String(run).padStart(2, "0")

/* ---------- the flow model behind the header track ---------- */

type StepId = "brief" | "generate" | "review" | "save" | "export"
type StepState = "todo" | "current" | "running" | "done" | "stale" | "error"
type FlowStep = { id: StepId; label: string; detail: string; state: StepState }

const stateWords: Record<StepState, string> = {
  todo: "not started",
  current: "next step",
  running: "in progress",
  done: "done",
  stale: "out of date",
  error: "needs attention",
}

function deriveFlow(m: MuseStudio) {
  const length = m.settings.brief.trim().length
  const run = pad(m.output.run)
  const next = pad(m.output.run + 1)

  const brief: FlowStep = m.issue
    ? {
        id: "brief",
        label: "Brief",
        detail: length === 0 ? "Empty" : length < BRIEF_MIN ? `${length} of ${BRIEF_MIN} min` : `${length - BRIEF_MAX} over limit`,
        state: "error",
      }
    : { id: "brief", label: "Brief", detail: `${length} chars`, state: "done" }

  const generate: FlowStep = m.busy
    ? { id: "generate", label: "Generate", detail: `Run ${next} · ${m.progress}%`, state: "running" }
    : m.generateStatus === "error"
      ? { id: "generate", label: "Generate", detail: m.issue ? "Blocked by brief" : `Run ${next} timed out`, state: "error" }
      : m.stale
        ? { id: "generate", label: "Generate", detail: `Stale since run ${run}`, state: "stale" }
        : { id: "generate", label: "Generate", detail: `Run ${run} · ${m.output.at}`, state: "done" }

  const kept = m.saveStatus === "saved" || m.exportStatus === "exported"
  const review: FlowStep = m.busy
    ? { id: "review", label: "Review", detail: "Waiting for run", state: "todo" }
    : m.stale
      ? { id: "review", label: "Review", detail: `Route ${m.selected} · run ${run}`, state: "stale" }
      : { id: "review", label: "Review", detail: `Route ${m.selected} · ${m.current.name}`, state: kept ? "done" : "todo" }

  const save: FlowStep =
    m.saveStatus === "saving"
      ? { id: "save", label: "Save", detail: "Writing to recent", state: "running" }
      : m.saveStatus === "saved"
        ? { id: "save", label: "Save", detail: "In recent", state: "done" }
        : m.saveStatus === "error"
          ? { id: "save", label: "Save", detail: "Not saved", state: "error" }
          : { id: "save", label: "Save", detail: `Keep route ${m.selected}`, state: "todo" }

  const exportStep: FlowStep =
    m.exportStatus === "exporting"
      ? { id: "export", label: "Export", detail: "Building file", state: "running" }
      : m.exportStatus === "exported"
        ? { id: "export", label: "Export", detail: "JSON downloaded", state: "done" }
        : m.exportStatus === "error"
          ? { id: "export", label: "Export", detail: m.stale ? "Needs a fresh run" : "Download refused", state: "error" }
          : { id: "export", label: "Export", detail: m.stale ? "Needs a fresh run" : `JSON · run ${run}`, state: "todo" }

  const steps = [brief, generate, review, save, exportStep]
  const currentIndex = steps.findIndex((step) => step.state !== "done")
  if (currentIndex >= 0 && steps[currentIndex].state === "todo") {
    steps[currentIndex] = { ...steps[currentIndex], state: "current" }
  }
  return { steps, currentIndex }
}

function exportBuilder(model: string, chain: string) {
  return ({ output, variant }: { output: Output; variant: RenderedVariant }): ExportFile => ({
    filename: `aperture-m2-run${pad(output.run)}-route-${variant.id.toLowerCase()}.json`,
    mime: "application/json",
    content: JSON.stringify(
      {
        product: spec.product,
        model,
        chain,
        run: output.run,
        generatedAt: output.at,
        settings: output.settings,
        route: variant,
        alternatives: VARIANT_IDS.filter((id) => id !== variant.id).map((id) => output.variants[id]),
        note: "Simulated forecast generated locally in the browser.",
      },
      null,
      2
    ),
  })
}

/* ---------- page ---------- */

export default function ImpeccableFullFlow() {
  const m = useMuseStudio(spec)
  const { steps, currentIndex } = deriveFlow(m)
  const grade = grades[m.output.settings.style] ?? grades.night
  const build = exportBuilder(m.modelName, m.chain)
  const failed = m.generateStatus === "error" && !m.issue
  const run = pad(m.output.run)
  const next = pad(m.output.run + 1)

  const status = m.busy
    ? `Generating run ${next}`
    : failed
      ? `Run ${next} failed. Still showing run ${run}.`
      : m.generateStatus === "error"
        ? "Generation blocked: the brief needs work."
        : m.stale
          ? `Settings changed after run ${run}. Generate to refresh the preview.`
          : `Run ${run} ready at ${m.output.at}. Route ${m.selected} selected.`

  function exportNow() {
    m.exportCampaign(build)
  }

  function activate(id: StepId) {
    if (id === "brief") document.getElementById("af-brief")?.focus()
    else if (id === "generate") m.generate()
    else if (id === "review") document.querySelector<HTMLInputElement>('input[name="af-route"]:checked')?.focus()
    else if (id === "save") m.save()
    else exportNow()
  }

  return (
    <div
      className={`${ui.className} flex min-h-screen flex-col bg-[#111316] text-[#ECEDEF] antialiased [color-scheme:dark] accent-[#8FB3FF] caret-[#8FB3FF] selection:bg-[#8FB3FF]/30 selection:text-white`}
    >
      <header className="border-b border-[#2A2F36]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 pb-2 pt-3 lg:px-6">
          <div className="flex items-center gap-2.5">
            <Aperture aria-hidden className="size-[18px] text-[#8FB3FF]" strokeWidth={1.75} />
            <span className="text-[14px] font-semibold tracking-[-0.01em]">Muse</span>
            <span aria-hidden className="h-4 w-px bg-[#2A2F36]" />
            <h1 className="text-[14px] font-medium">Aperture M2 launch</h1>
          </div>
          <p aria-live="polite" className="order-last w-full text-[12.5px] text-[#9AA0A8] md:order-none md:w-auto">
            {status}
          </p>
          <p className={`${MONO} ml-auto flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-[#9AA0A8]`}>
            <span>
              BODY <span className="text-[#ECEDEF]">{m.modelName}</span>
            </span>
            <span>
              LENS <span className="text-[#ECEDEF]">{m.chain}</span>
            </span>
          </p>
        </div>
        <FlowTrack
          steps={steps}
          currentIndex={currentIndex}
          progress={m.progress}
          busy={m.busy}
          saving={m.saveStatus === "saving"}
          exporting={m.exportStatus === "exporting"}
          onActivate={activate}
        />
      </header>

      <main className="grid flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <ControlPanel m={m} />

        <section aria-labelledby="af-preview-title" className="flex min-w-0 flex-col border-b border-[#2A2F36] lg:border-b-0">
          <div className="flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 lg:px-6">
            <h2 id="af-preview-title" className="text-[13px] font-semibold">
              Preview
              <span className="ml-2 font-normal text-[#9AA0A8]">
                Route {m.selected} · {m.current.name}
              </span>
            </h2>
            <PreviewNotice m={m} failed={failed} />
          </div>

          <Viewfinder m={m} grade={grade} />

          <div className="flex flex-wrap items-center gap-3 border-t border-[#2A2F36] px-4 py-3 lg:px-6">
            <p className="min-w-0 flex-1 text-[13px] text-[#9AA0A8]">
              Keep <span className="text-[#ECEDEF]">route {m.selected}</span> from run {run}
            </p>
            <SaveButton m={m} />
            <ExportButton m={m} onExport={exportNow} />
          </div>
          {m.saveStatus === "error" && m.saveError && (
            <p role="alert" className="flex items-start gap-2 border-t border-[#2A2F36] px-4 py-2.5 text-[13px] text-[#FF7A6E] lg:px-6">
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {m.saveError}
            </p>
          )}
          {m.exportStatus === "error" && m.exportError && (
            <p role="alert" className="flex flex-wrap items-start gap-x-2 gap-y-1 border-t border-[#2A2F36] px-4 py-2.5 text-[13px] text-[#FF7A6E] lg:px-6">
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span className="min-w-0 flex-1">{m.exportError}</span>
              {m.stale && (
                <button
                  type="button"
                  onClick={m.generate}
                  disabled={m.busy}
                  className="rounded-[3px] text-[13px] font-semibold text-[#ECEDEF] underline decoration-[#8FB3FF] underline-offset-4 hover:text-[#8FB3FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF]"
                >
                  Generate now
                </button>
              )}
            </p>
          )}
        </section>

        <RouteColumn m={m} />
      </main>
    </div>
  )
}

/* ---------- header track ---------- */

function FlowTrack({
  steps,
  currentIndex,
  progress,
  busy,
  saving,
  exporting,
  onActivate,
}: {
  steps: FlowStep[]
  currentIndex: number
  progress: number
  busy: boolean
  saving: boolean
  exporting: boolean
  onActivate: (id: StepId) => void
}) {
  return (
    <nav aria-label="Campaign flow" className="border-t border-[#2A2F36]/60">
      <div className="relative overflow-x-auto overscroll-x-contain [scrollbar-color:#2A2F36_transparent] [scrollbar-width:thin]">
        <ol className="flex w-max min-w-full items-center px-2 py-2 lg:px-4">
          {steps.map((step, index) => {
            const action = step.id === "save" || step.id === "export"
            const last = index === steps.length - 1
            const disabled = (step.id === "generate" && busy) || (step.id === "save" && saving) || (step.id === "export" && exporting)
            const connector = step.state === "done" ? "bg-[#6BCB8B]/45" : "bg-[#2A2F36]"
            return (
              <li key={step.id} className={`flex items-center ${action ? "shrink-0" : "min-w-[176px] flex-1"}`}>
                {action ? (
                  <ActionStep step={step} index={index} current={index === currentIndex} disabled={disabled} onActivate={onActivate} />
                ) : (
                  <button
                    type="button"
                    onClick={() => onActivate(step.id)}
                    disabled={disabled}
                    aria-current={index === currentIndex ? "step" : undefined}
                    className="group flex min-h-11 items-center gap-2.5 rounded-[5px] px-2 py-1.5 text-left transition-colors duration-150 hover:bg-[#1E2227] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#8FB3FF] disabled:cursor-progress disabled:hover:bg-transparent"
                  >
                    <StepNode state={step.state} index={index} />
                    <span className="min-w-0">
                      <span className={`block text-[13px] font-semibold ${step.state === "error" ? "text-[#FF7A6E]" : ""}`}>
                        {step.label}
                        <span className="sr-only">, {stateWords[step.state]}</span>
                      </span>
                      <span className={`${MONO} block whitespace-nowrap text-[11px] tabular-nums text-[#9AA0A8]`}>{step.detail}</span>
                      {step.state === "running" && (
                        <span aria-hidden className="mt-1 block h-[2px] w-28 overflow-hidden rounded-full bg-[#2A2F36]">
                          <span
                            className="block h-full rounded-full bg-[#8FB3FF] transition-[width] duration-300 ease-out motion-reduce:transition-none"
                            style={{ width: `${progress}%` }}
                          />
                        </span>
                      )}
                    </span>
                  </button>
                )}
                {!last && <span aria-hidden className={`mx-2 h-px ${action ? "w-5" : "min-w-5 flex-1"} ${connector}`} />}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

function ActionStep({
  step,
  index,
  current,
  disabled,
  onActivate,
}: {
  step: FlowStep
  index: number
  current: boolean
  disabled: boolean
  onActivate: (id: StepId) => void
}) {
  const filled = step.state === "current"
  const tone = filled
    ? "border-[#8FB3FF] bg-[#8FB3FF] text-[#111316] hover:border-[#A9C4FF] hover:bg-[#A9C4FF]"
    : step.state === "done"
      ? "border-[#6BCB8B]/45 bg-[#6BCB8B]/10 hover:bg-[#6BCB8B]/15"
      : step.state === "error"
        ? "border-[#FF7A6E]/60 bg-[#FF7A6E]/10 hover:bg-[#FF7A6E]/15"
        : "border-[#2A2F36] bg-[#171A1E] hover:border-[#3A414B] hover:bg-[#1E2227]"
  return (
    <button
      type="button"
      onClick={() => onActivate(step.id)}
      disabled={disabled}
      aria-current={current ? "step" : undefined}
      className={`flex h-12 items-center gap-2.5 rounded-[5px] border pl-2.5 pr-4 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF] disabled:cursor-progress ${tone}`}
    >
      <StepNode state={step.state} index={index} icon={step.id === "save" ? Save : Download} inverted={filled} />
      <span>
        <span className="block text-[13px] font-semibold">
          {step.label}
          <span className="sr-only">, {stateWords[step.state]}</span>
        </span>
        <span className={`${MONO} block whitespace-nowrap text-[11px] tabular-nums ${filled ? "text-[#111316]/75" : "text-[#9AA0A8]"}`}>
          {step.detail}
        </span>
      </span>
    </button>
  )
}

function StepNode({
  state,
  index,
  icon: Icon,
  inverted,
}: {
  state: StepState
  index: number
  icon?: typeof Save
  inverted?: boolean
}) {
  const base = `${MONO} grid size-6 shrink-0 place-items-center rounded-full border text-[11px] tabular-nums`
  const idle = Icon ? <Icon aria-hidden className="size-3.5" /> : index + 1
  if (inverted) return <span aria-hidden className={`${base} border-[#111316]/40 text-[#111316]`}>{idle}</span>
  if (state === "running")
    return (
      <span aria-hidden className={`${base} border-[#8FB3FF]/70 text-[#8FB3FF]`}>
        <LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
      </span>
    )
  if (state === "done")
    return (
      <span aria-hidden className={`${base} border-[#6BCB8B]/60 bg-[#6BCB8B]/15 text-[#6BCB8B]`}>
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
    )
  if (state === "error")
    return (
      <span aria-hidden className={`${base} border-[#FF7A6E]/70 bg-[#FF7A6E]/15 text-[#FF7A6E]`}>
        <TriangleAlert className="size-3.5" />
      </span>
    )
  if (state === "stale")
    return (
      <span aria-hidden className={`${base} border-dashed border-[#ECEDEF]/60 text-[#ECEDEF]`}>
        <RotateCcw className="size-3" />
      </span>
    )
  if (state === "current")
    return <span aria-hidden className={`${base} border-[#8FB3FF] bg-[#8FB3FF]/15 text-[#8FB3FF]`}>{idle}</span>
  return <span aria-hidden className={`${base} border-[#2A2F36] text-[#9AA0A8]`}>{idle}</span>
}

/* ---------- left: controls ---------- */

const fieldLabel = "block text-[12px] font-medium text-[#9AA0A8]"
const quietInput =
  "w-full rounded-[4px] border border-[#2A2F36] bg-[#1E2227] text-base text-[#ECEDEF] transition-colors duration-150 hover:border-[#3A414B] focus-visible:border-[#8FB3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FB3FF]/30 lg:text-[13.5px]"

function ControlPanel({ m }: { m: MuseStudio }) {
  const length = m.settings.brief.trim().length
  const blocked = m.generateStatus === "error" && m.generateError
  const audience = spec.audiences.find((option) => option.id === m.settings.audience)

  return (
    <section
      aria-labelledby="af-controls-title"
      className="border-b border-[#2A2F36] bg-[#171A1E] px-4 py-4 lg:row-span-2 lg:border-b-0 lg:border-r xl:row-span-1 lg:px-5"
    >
      <h2 id="af-controls-title" className="sr-only">
        Brief and controls
      </h2>

      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="af-brief" className="text-[13px] font-semibold">
          Brief
        </label>
        <span className={`${MONO} text-[11px] tabular-nums ${m.issue ? "text-[#FF7A6E]" : "text-[#9AA0A8]"}`}>
          {length}/{BRIEF_MAX}
        </span>
      </div>
      <textarea
        id="af-brief"
        value={m.settings.brief}
        onChange={(event) => m.setBrief(event.target.value)}
        rows={4}
        aria-invalid={m.issue ? true : undefined}
        aria-describedby="af-brief-help"
        className={`${quietInput} mt-2 block resize-y px-3 py-2.5 leading-[1.5] aria-invalid:border-[#FF7A6E]/70`}
      />
      <p id="af-brief-help" className={`mt-1.5 text-[12px] leading-snug ${m.issue ? "text-[#FF7A6E]" : "text-[#9AA0A8]"}`}>
        {m.issue ?? "What is launching, for whom, and by when."}
      </p>

      <div className="mt-5 border-t border-[#2A2F36] pt-4">
        <label htmlFor="af-audience" className={fieldLabel}>
          Audience
        </label>
        <select
          id="af-audience"
          value={m.settings.audience}
          onChange={(event) => m.setControl("audience", event.target.value)}
          aria-describedby="af-audience-hint"
          className={`${quietInput} mt-1.5 h-10 px-2.5`}
        >
          {spec.audiences.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p id="af-audience-hint" className="mt-1 text-[12px] text-[#9AA0A8]">
          {audience?.hint} · <span className={`${MONO} tabular-nums`}>{formatReach(audience?.size ?? 0)}</span> reachable
        </p>
      </div>

      <fieldset className="mt-4">
        <legend className={fieldLabel}>Channel</legend>
        <div className="mt-1.5 grid gap-1">
          {spec.channels.map((option) => (
            <label key={option.id} className="block">
              <input
                type="radio"
                name="af-channel"
                value={option.id}
                checked={m.settings.channel === option.id}
                onChange={() => m.setControl("channel", option.id)}
                className="peer sr-only"
              />
              <span className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-[4px] border border-transparent px-2.5 text-[13px] text-[#9AA0A8] transition-colors duration-150 hover:bg-[#1E2227] hover:text-[#ECEDEF] peer-checked:border-[#8FB3FF]/50 peer-checked:bg-[#8FB3FF]/10 peer-checked:text-[#ECEDEF] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-[#8FB3FF] lg:min-h-9">
                {option.label}
                <span className={`${MONO} text-[11px] text-[#9AA0A8]`}>{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className={fieldLabel}>Tone</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {spec.tones.map((option) => (
            <label key={option.id} className="block min-w-0">
              <input
                type="radio"
                name="af-tone"
                value={option.id}
                checked={m.settings.tone === option.id}
                onChange={() => m.setControl("tone", option.id)}
                className="peer sr-only"
              />
              <span className="flex h-10 cursor-pointer items-center justify-center rounded-[4px] border border-[#2A2F36] px-1 text-[12.5px] text-[#9AA0A8] transition-colors duration-150 hover:border-[#3A414B] hover:text-[#ECEDEF] peer-checked:border-[#8FB3FF]/60 peer-checked:bg-[#8FB3FF]/10 peer-checked:text-[#ECEDEF] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8FB3FF] lg:h-9">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className={fieldLabel}>Visual style</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {spec.styles.map((option) => {
            const swatch = grades[option.id]
            return (
              <label key={option.id} className="block min-w-0">
                <input
                  type="radio"
                  name="af-style"
                  value={option.id}
                  checked={m.settings.style === option.id}
                  onChange={() => m.setControl("style", option.id)}
                  className="peer sr-only"
                />
                <span className="block cursor-pointer rounded-[4px] border border-[#2A2F36] p-1 text-center text-[12px] text-[#9AA0A8] transition-colors duration-150 hover:border-[#3A414B] hover:text-[#ECEDEF] peer-checked:border-[#8FB3FF]/60 peer-checked:text-[#ECEDEF] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8FB3FF]">
                  <span
                    aria-hidden
                    className="flex h-6 items-end justify-end rounded-[2px] p-1"
                    style={{ backgroundColor: swatch.bg, backgroundImage: swatch.wash }}
                  >
                    <span className="size-2 rounded-full" style={{ background: swatch.cta }} />
                  </span>
                  <span className="mt-1 block truncate">{option.label}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-5 border-t border-[#2A2F36] pt-4">
        <button
          type="button"
          onClick={m.generate}
          disabled={m.busy}
          className="flex h-11 w-full items-center justify-between gap-3 rounded-[5px] bg-[#8FB3FF] px-4 text-[14px] font-semibold text-[#111316] transition-colors duration-150 hover:bg-[#A9C4FF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF] active:bg-[#7FA5F5] disabled:cursor-progress disabled:bg-[#8FB3FF]/55"
        >
          <span className="flex items-center gap-2">
            {m.busy ? (
              <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Aperture aria-hidden className="size-4" strokeWidth={2} />
            )}
            {m.busy ? "Generating" : "Generate"}
          </span>
          <span className={`${MONO} text-[11px] font-medium tabular-nums text-[#111316]/75`}>
            {m.busy ? `${m.stage + 1}/${GENERATION_STAGES.length}` : `Run ${pad(m.output.run + 1)}`}
          </span>
        </button>

        <label className="mt-2 flex min-h-10 cursor-pointer items-center justify-between gap-3 text-[12.5px] leading-snug text-[#9AA0A8]">
          <span>Simulate a forecast outage on the next run</span>
          <input
            type="checkbox"
            role="switch"
            checked={m.failNext}
            onChange={(event) => m.setFailNext(event.target.checked)}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="relative h-5 w-9 shrink-0 rounded-full border border-[#2A2F36] bg-[#1E2227] transition-colors duration-150 after:absolute after:left-[3px] after:top-[3px] after:size-3 after:rounded-full after:bg-[#9AA0A8] after:transition-transform after:duration-150 peer-checked:border-[#FF7A6E]/60 peer-checked:bg-[#FF7A6E]/15 peer-checked:after:translate-x-4 peer-checked:after:bg-[#FF7A6E] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8FB3FF] motion-reduce:after:transition-none"
          />
        </label>

        {blocked && (
          <div role="alert" className="mt-2 rounded-[4px] border border-[#FF7A6E]/40 bg-[#FF7A6E]/10 px-3 py-2.5 text-[12.5px] leading-snug">
            <p className="flex items-start gap-2 text-[#FF7A6E]">
              <TriangleAlert aria-hidden className="mt-px size-4 shrink-0" />
              {m.generateError}
            </p>
            <button
              type="button"
              onClick={m.issue ? () => document.getElementById("af-brief")?.focus() : m.generate}
              className="ml-6 mt-1.5 rounded-[3px] font-semibold text-[#ECEDEF] underline decoration-[#FF7A6E]/60 underline-offset-4 hover:decoration-[#FF7A6E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF]"
            >
              {m.issue ? "Edit the brief" : "Try the run again"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={m.reset}
          className="mt-1 inline-flex min-h-10 items-center gap-1.5 rounded-[3px] text-[12.5px] text-[#9AA0A8] transition-colors hover:text-[#ECEDEF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF] lg:min-h-8"
        >
          <Undo2 aria-hidden className="size-3.5" />
          Reset to launch defaults
        </button>
      </div>
    </section>
  )
}

/* ---------- centre: viewfinder ---------- */

function PreviewNotice({ m, failed }: { m: MuseStudio; failed: boolean }) {
  const format = `${spec.channels.find((c) => c.id === m.output.settings.channel)?.hint} · ${m.labelOf("channel", m.output.settings.channel)}`
  if (m.busy) {
    return <p className={`${MONO} ml-auto text-[11px] text-[#8FB3FF]`}>{m.stageLabel}</p>
  }
  if (failed) {
    return (
      <p className="ml-auto flex items-center gap-1.5 text-[12.5px] text-[#9AA0A8]">
        <TriangleAlert aria-hidden className="size-3.5 text-[#FF7A6E]" />
        Run {pad(m.output.run + 1)} failed. Showing run {pad(m.output.run)}.
      </p>
    )
  }
  if (m.stale) {
    return (
      <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <p className="flex items-center gap-1.5 text-[12.5px]">
          <RotateCcw aria-hidden className="size-3.5 text-[#8FB3FF]" />
          Out of date: settings changed after run {pad(m.output.run)}.
        </p>
        <button
          type="button"
          onClick={m.generate}
          className="h-9 rounded-[4px] border border-[#8FB3FF]/60 px-3 text-[12.5px] font-semibold text-[#8FB3FF] transition-colors hover:bg-[#8FB3FF]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF] lg:h-8"
        >
          Generate again
        </button>
      </div>
    )
  }
  return <p className={`${MONO} ml-auto text-[11px] text-[#9AA0A8]`}>{format}</p>
}

function Viewfinder({ m, grade }: { m: MuseStudio; grade: Grade }) {
  const dim = m.busy ? "opacity-25" : m.stale ? "opacity-50 saturate-[0.35]" : ""
  const mark = `pointer-events-none absolute size-5 transition-colors duration-200 ${m.busy ? "border-[#8FB3FF]" : "border-[#9AA0A8]/70"}`
  const channel = m.output.settings.channel
  const metrics = m.current.metrics
  const before = m.previous?.metrics

  return (
    <>
      <figure
        aria-label={`Route ${m.selected} preview for ${m.labelOf("channel", channel)}, run ${m.output.run}`}
        className="relative mx-4 flex min-h-[420px] items-center justify-center border border-[#2A2F36] bg-[#0D0F12] px-4 py-12 sm:px-10 lg:mx-6 lg:min-h-[500px]"
      >
        <span aria-hidden className={`${mark} left-3 top-3 border-l border-t`} />
        <span aria-hidden className={`${mark} right-3 top-3 border-r border-t`} />
        <span aria-hidden className={`${mark} bottom-3 left-3 border-b border-l`} />
        <span aria-hidden className={`${mark} bottom-3 right-3 border-b border-r`} />
        <span aria-hidden className={`${MONO} absolute left-10 top-3.5 text-[10.5px] tabular-nums text-[#9AA0A8]`}>
          RUN {pad(m.output.run)} · {m.output.at}
        </span>
        <span aria-hidden className={`${MONO} absolute right-10 top-3.5 text-[10.5px] ${m.stale && !m.busy ? "text-[#ECEDEF]" : "text-[#9AA0A8]"}`}>
          {m.busy ? "FOCUSING" : m.stale ? "STALE" : `ROUTE ${m.selected}`}
        </span>

        <div className={`flex w-full justify-center transition-[opacity,filter] duration-200 motion-reduce:transition-none ${dim}`}>
          <AdCanvas variant={m.current} grade={grade} channel={channel} />
        </div>

        {m.busy && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[min(300px,80%)] border border-[#2A2F36] bg-[#171A1E] px-4 py-3.5">
              <p className="text-[13px] font-medium">{m.stageLabel}</p>
              <p className={`${MONO} mt-0.5 text-[11px] tabular-nums text-[#9AA0A8]`}>
                Stage {m.stage + 1} of {GENERATION_STAGES.length} · {m.progress}%
              </p>
              <span aria-hidden className="mt-3 block h-[2px] overflow-hidden bg-[#2A2F36]">
                <span
                  className="block h-full bg-[#8FB3FF] transition-[width] duration-300 ease-out motion-reduce:transition-none"
                  style={{ width: `${m.progress}%` }}
                />
              </span>
            </div>
          </div>
        )}
      </figure>

      <div className="mx-4 flex flex-wrap items-end gap-x-8 gap-y-3 border-x border-b border-[#2A2F36] bg-[#171A1E] px-4 py-3 lg:mx-6">
        <p className={`${MONO} text-[10.5px] uppercase leading-[1.5] tracking-[0.06em] text-[#9AA0A8]`}>
          Simulated forecast
          <br />
          Route {m.selected} · run {pad(m.output.run)}
        </p>
        <dl className={`flex flex-wrap gap-x-8 gap-y-2 ${m.stale && !m.busy ? "opacity-60" : ""}`}>
          <Readout label="Reach" value={formatReach(metrics.reach)} delta={formatDelta(metrics.reach, before?.reach, "reach")} />
          <Readout label="CTR" value={formatPercent(metrics.ctr)} delta={formatDelta(metrics.ctr, before?.ctr, "percent")} />
          <Readout
            label="Conversion"
            value={formatPercent(metrics.conversion)}
            delta={formatDelta(metrics.conversion, before?.conversion, "percent")}
          />
        </dl>
      </div>
    </>
  )
}

function Readout({ label, value, delta }: { label: string; value: string; delta: string | null }) {
  const tone = !delta || delta === "±0" ? "text-[#9AA0A8]" : delta.startsWith("−") ? "text-[#FF7A6E]" : "text-[#6BCB8B]"
  return (
    <div>
      <dt className={`${MONO} text-[10.5px] uppercase tracking-[0.06em] text-[#9AA0A8]`}>{label}</dt>
      <dd className={`${MONO} mt-0.5 flex items-baseline gap-2 tabular-nums`}>
        <span className="text-[19px] leading-none text-[#ECEDEF]">{value}</span>
        {delta && (
          <span className={`text-[11px] ${tone}`}>
            {delta}
            <span className="sr-only"> versus the previous run</span>
          </span>
        )}
      </dd>
    </div>
  )
}

function AdCanvas({ variant, grade, channel }: { variant: RenderedVariant; grade: Grade; channel: string }) {
  const surface = { backgroundColor: grade.bg, backgroundImage: grade.wash, color: grade.ink }

  if (channel === "preroll") {
    return (
      <div className="@container relative aspect-video w-full max-w-[720px] overflow-hidden" style={surface}>
        <div className="grid h-full grid-cols-[1.1fr_1fr] items-center gap-[2cqw] pl-[6cqw] pr-[3cqw]">
          <div className="min-w-0">
            <h3 className="text-[length:max(15px,4.3cqw)] font-semibold leading-[1.04] tracking-[-0.02em] text-balance">{variant.headline}</h3>
            <p className="mt-[1.6cqw] hidden text-[length:max(11px,1.75cqw)] leading-[1.45] @md:block" style={{ color: grade.sub }}>
              {variant.body}
            </p>
            <span
              className="mt-[2.4cqw] inline-flex h-[max(26px,5cqw)] items-center rounded-full px-[max(10px,2.4cqw)] text-[length:max(11px,1.7cqw)] font-semibold"
              style={{ background: grade.cta, color: grade.ctaInk }}
            >
              {variant.cta}
            </span>
          </div>
          <CameraArt grade={grade} className="w-full" />
        </div>
        <span className={`${MONO} absolute left-[1.6cqw] top-[1.6cqw] rounded-[2px] bg-black/65 px-1.5 py-0.5 text-[10px] text-white`}>
          Ad · 0:06
        </span>
        <span className="absolute bottom-[3cqw] right-0 bg-black/70 px-2.5 py-1 text-[11px] text-white">Skip in 5</span>
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
          <span className="block h-full w-1/3 bg-[#F4C542]" />
        </span>
      </div>
    )
  }

  if (channel === "newsletter") {
    return (
      <div className="w-full max-w-[430px] overflow-hidden rounded-[3px] bg-[#FAFAF8] text-[#1C1D20]">
        <div className="border-b border-[#E1E1DC] px-4 py-2.5 text-[12px] leading-[1.5]">
          <p>
            <span className="font-semibold">Aperture Cameras</span> <span className="text-[#5C5E63]">· to Camera Club members</span>
          </p>
          <p className="truncate text-[#3F4146]">{variant.headline}</p>
        </div>
        <div className="px-6 pb-6 pt-4" style={surface}>
          <CameraArt grade={grade} className="mx-auto w-[62%]" />
          <h3 className="mt-3 text-[24px] font-semibold leading-[1.08] tracking-[-0.02em] text-balance">{variant.headline}</h3>
          <p className="mt-2 text-[13px] leading-[1.5]" style={{ color: grade.sub }}>
            {variant.body}
          </p>
          <span
            className="mt-4 inline-flex h-10 items-center rounded-[3px] px-4 text-[13px] font-semibold"
            style={{ background: grade.cta, color: grade.ctaInk }}
          >
            {variant.cta}
          </span>
        </div>
        <p className="px-4 py-2.5 text-[11px] text-[#5C5E63]">You joined the Aperture Camera Club at the Leith Street store.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[300px] overflow-hidden rounded-[4px] bg-[#0A0A0B] text-white">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span aria-hidden className="grid size-7 place-items-center rounded-full" style={{ background: grade.cta, color: grade.ctaInk }}>
          <Aperture className="size-4" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[12.5px] font-semibold">aperture.cameras</span>
          <span className="block text-[11px] text-[#A8A8AD]">Sponsored</span>
        </span>
      </div>
      <div className="flex aspect-[4/5] flex-col justify-between px-5 pb-4 pt-5" style={surface}>
        <div>
          <h3 className="text-[23px] font-semibold leading-[1.06] tracking-[-0.02em] text-balance">{variant.headline}</h3>
          <p className="mt-2 text-[12.5px] leading-[1.45]" style={{ color: grade.sub }}>
            {variant.body}
          </p>
        </div>
        <CameraArt grade={grade} className="w-full" />
      </div>
      <div
        className="flex items-center justify-between px-3 py-2.5 text-[12.5px] font-semibold"
        style={{ background: grade.cta, color: grade.ctaInk }}
      >
        {variant.cta}
        <ChevronRight aria-hidden className="size-4" />
      </div>
    </div>
  )
}

function CameraArt({ grade, className }: { grade: Grade; className?: string }) {
  return (
    <svg viewBox="0 0 260 158" aria-hidden className={className}>
      <defs>
        <linearGradient id="af-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={grade.bodyTop} />
          <stop offset="0.5" stopColor={grade.body} />
        </linearGradient>
        <radialGradient id="af-glass" cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#56648A" />
          <stop offset="0.42" stopColor="#151B28" />
          <stop offset="1" stopColor="#040507" />
        </radialGradient>
      </defs>
      <ellipse cx="130" cy="150" rx="112" ry="5" fill="#000" opacity="0.28" />
      <path d="M100 44 L108 22 Q110 18 114 18 H150 Q154 18 156 22 L164 44 Z" fill="url(#af-body)" />
      <rect x="184" y="31" width="32" height="11" rx="3" fill={grade.body} />
      <ellipse cx="200" cy="30" rx="11" ry="3.2" fill={grade.bodyTop} />
      <rect x="44" y="35" width="24" height="8" rx="2" fill={grade.body} />
      <rect x="20" y="40" width="220" height="104" rx="15" fill="url(#af-body)" />
      <rect x="20" y="64" width="220" height="62" fill="#000" opacity="0.2" />
      <path d="M20 56 Q20 40 36 40 H66 Q74 40 74 50 V134 Q74 144 64 144 H36 Q20 144 20 128 Z" fill={grade.body} />
      <path d="M26 58 Q26 46 38 46 H62 Q68 46 68 54 V70 H26 Z" fill="#fff" opacity="0.05" />
      <circle cx="90" cy="72" r="2.6" fill="#000" opacity="0.45" />
      <text x="84" y="57" fontSize="7" fontWeight="600" letterSpacing="2.4" fill={grade.bodyInk}>
        APERTURE
      </text>
      <text x="214" y="57" fontSize="8" fontWeight="700" fill={grade.bodyInk}>
        M2
      </text>
      <circle cx="150" cy="92" r="47" fill="#17191D" />
      <circle cx="150" cy="92" r="45" fill="none" stroke="#9AA0A8" strokeOpacity="0.35" strokeWidth="1.2" />
      <circle cx="150" cy="92" r="39" fill="#0C0D10" />
      <circle cx="150" cy="92" r="34.5" fill="none" stroke="#2A2F36" strokeWidth="4.5" strokeDasharray="1.6 2.4" />
      <circle cx="150" cy="92" r="27" fill="url(#af-glass)" />
      <circle cx="150" cy="92" r="27" fill="none" stroke="#8FB3FF" strokeOpacity="0.18" strokeWidth="1" />
      <ellipse cx="139" cy="81" rx="8.5" ry="4.6" fill="#fff" opacity="0.26" transform="rotate(-32 139 81)" />
      <circle cx="160" cy="102" r="2.6" fill="#8FB3FF" opacity="0.32" />
    </svg>
  )
}

/* ---------- action buttons (contextual copies of the track's last two steps) ---------- */

const secondaryButton =
  "inline-flex h-10 items-center gap-2 rounded-[5px] border px-3.5 text-[13px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF] disabled:cursor-progress"

function SaveButton({ m }: { m: MuseStudio }) {
  const s = m.saveStatus
  const tone =
    s === "saved"
      ? "border-[#6BCB8B]/45 text-[#6BCB8B] hover:bg-[#6BCB8B]/10"
      : s === "error"
        ? "border-[#FF7A6E]/60 text-[#FF7A6E] hover:bg-[#FF7A6E]/10"
        : "border-[#2A2F36] bg-[#171A1E] text-[#ECEDEF] hover:border-[#3A414B] hover:bg-[#1E2227]"
  return (
    <button type="button" onClick={m.save} disabled={s === "saving"} className={`${secondaryButton} ${tone}`}>
      {s === "saving" ? (
        <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
      ) : s === "saved" ? (
        <Check aria-hidden className="size-4" strokeWidth={2.5} />
      ) : s === "error" ? (
        <TriangleAlert aria-hidden className="size-4" />
      ) : (
        <Save aria-hidden className="size-4" />
      )}
      {s === "saving" ? "Saving" : s === "saved" ? "Saved" : s === "error" ? "Save again" : "Save"}
    </button>
  )
}

function ExportButton({ m, onExport }: { m: MuseStudio; onExport: () => void }) {
  const s = m.exportStatus
  const tone =
    s === "exported"
      ? "border-[#6BCB8B]/45 text-[#6BCB8B] hover:bg-[#6BCB8B]/10"
      : s === "error"
        ? "border-[#FF7A6E]/60 text-[#FF7A6E] hover:bg-[#FF7A6E]/10"
        : "border-[#8FB3FF] bg-[#8FB3FF] text-[#111316] hover:border-[#A9C4FF] hover:bg-[#A9C4FF]"
  return (
    <button type="button" onClick={onExport} disabled={s === "exporting"} className={`${secondaryButton} ${tone}`}>
      {s === "exporting" ? (
        <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
      ) : s === "exported" ? (
        <Check aria-hidden className="size-4" strokeWidth={2.5} />
      ) : s === "error" ? (
        <TriangleAlert aria-hidden className="size-4" />
      ) : (
        <Download aria-hidden className="size-4" />
      )}
      {s === "exporting" ? "Exporting" : s === "exported" ? "Exported" : s === "error" ? "Export again" : "Export"}
    </button>
  )
}

/* ---------- right: routes and history ---------- */

function RouteColumn({ m }: { m: MuseStudio }) {
  const logTone = { info: "bg-[#9AA0A8]", success: "bg-[#6BCB8B]", error: "bg-[#FF7A6E]" } as const
  return (
    <aside
      aria-label="Routes and history"
      className="min-w-0 border-[#2A2F36] bg-[#171A1E] lg:col-start-2 lg:border-t xl:col-start-3 xl:row-start-1 xl:border-l xl:border-t-0"
    >
      <fieldset className="border-b border-[#2A2F36] pb-2">
        <legend className="float-left flex w-full items-baseline justify-between px-4 pb-2 pt-4 text-[13px] font-semibold lg:px-5">
          Routes
          <span className={`${MONO} text-[11px] font-normal tabular-nums text-[#9AA0A8]`}>Run {pad(m.output.run)}</span>
        </legend>
        <div className="clear-both">
          {VARIANT_IDS.map((id) => {
            const variant = m.output.variants[id]
            const on = m.selected === id
            return (
              <label key={id} className="block">
                <input type="radio" name="af-route" value={id} checked={on} onChange={() => m.select(id)} className="peer sr-only" />
                <span className="mx-2 flex cursor-pointer gap-3 rounded-[5px] border border-transparent px-2.5 py-2.5 transition-colors duration-150 hover:bg-[#1E2227] peer-checked:border-[#2A2F36] peer-checked:bg-[#1E2227] peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-[#8FB3FF] lg:mx-3">
                  <span
                    aria-hidden
                    className={`${MONO} grid size-7 shrink-0 place-items-center rounded-[4px] border text-[12px] font-medium ${
                      on ? "border-[#8FB3FF] bg-[#8FB3FF] text-[#111316]" : "border-[#2A2F36] text-[#9AA0A8]"
                    }`}
                  >
                    {id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">
                      <span className="sr-only">Route {id}: </span>
                      {variant.name}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-snug text-[#9AA0A8]">{variant.headline}</span>
                    <span className={`${MONO} mt-1.5 flex gap-3 text-[11px] tabular-nums text-[#9AA0A8]`}>
                      <span>
                        CTR <span className="text-[#ECEDEF]">{formatPercent(variant.metrics.ctr)}</span>
                      </span>
                      <span>
                        CONV <span className="text-[#ECEDEF]">{formatPercent(variant.metrics.conversion)}</span>
                      </span>
                    </span>
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <section aria-labelledby="af-recent-title" className="border-b border-[#2A2F36] pb-2">
        <h2 id="af-recent-title" className="px-4 pb-1 pt-4 text-[13px] font-semibold lg:px-5">
          Recent campaigns
        </h2>
        <p className="px-4 pb-2 text-[12px] text-[#9AA0A8] lg:px-5">Restore loads the brief and controls; generate to see it again.</p>
        <ul>
          {m.recent.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-4 py-2 lg:px-5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px]">{item.title}</span>
                <span className={`${MONO} block text-[11px] tabular-nums text-[#9AA0A8]`}>
                  {item.when} · route {item.variant}
                  {item.saved ? " · saved here" : ""}
                </span>
              </span>
              <button
                type="button"
                onClick={() => m.restore(item)}
                aria-label={`Restore ${item.title}`}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[4px] border border-[#2A2F36] px-2.5 text-[12px] font-medium text-[#ECEDEF] transition-colors duration-150 hover:border-[#3A414B] hover:bg-[#1E2227] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB3FF] lg:h-8"
              >
                <RotateCcw aria-hidden className="size-3.5 text-[#9AA0A8]" />
                Restore
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="af-activity-title" className="pb-4">
        <h2 id="af-activity-title" className="px-4 pb-2 pt-4 text-[13px] font-semibold lg:px-5">
          Activity
        </h2>
        <ol className="space-y-1.5 px-4 lg:px-5">
          {m.log.slice(0, 6).map((entry) => (
            <li key={entry.id} className="flex items-baseline gap-2.5 text-[12.5px] leading-snug">
              <span className={`${MONO} w-10 shrink-0 text-[11px] tabular-nums text-[#9AA0A8]`}>{entry.at}</span>
              <span aria-hidden className={`size-1.5 shrink-0 translate-y-[-1px] rounded-full ${logTone[entry.tone]}`} />
              <span className="min-w-0 break-words text-[#ECEDEF]">{entry.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}
