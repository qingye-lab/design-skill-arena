"use client"

import { Atkinson_Hyperlegible } from "next/font/google"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  CircleCheck,
  Download,
  History,
  Info,
  Keyboard,
  LoaderCircle,
  Minus,
  RefreshCw,
  Save,
  Sparkles,
  TriangleAlert,
} from "lucide-react"
import { useEffect, useEffectEvent, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react"

import {
  BRIEF_MAX,
  BRIEF_MIN,
  VARIANT_IDS,
  briefIssue,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ControlKey,
  type MuseStudio,
  type Option,
  type RecentCampaign,
  type Settings,
  type StudioSpec,
  type VariantId,
} from "./core"

/*
 * Tidewell Flow launch workspace.
 * Skill applied: ui-ux-pro-max (accessibility, touch targets, forms and feedback first).
 * Signature: the error summary at the top of the form plus a live status rail on the right.
 */

const atkinson = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "ux-pro-reference",
  product: "Tidewell Flow",
  brief:
    "Launch Tidewell Flow, a 750 ml steel bottle with a carbon filter that lasts 60 days, on 3 March. Show that any tap can give clean-tasting water, and drive first-week orders at $39.",
  audiences: [
    { id: "commuters", label: "Daily commuters", hint: "Refill at work and on the train", size: 820000, lift: { ctr: 1.06 } },
    { id: "hikers", label: "Trail hikers", hint: "Fill up from huts and taps on long days", size: 460000, lift: { ctr: 0.96, conversion: 1.16 } },
    { id: "students", label: "Students on campus", hint: "Refill stations between lectures", size: 1180000, lift: { ctr: 1.1, conversion: 0.84 } },
  ],
  channels: [
    { id: "story", label: "Instagram story", hint: "Tall 9:16 frame, seen for about 5 seconds", lift: { reach: 1.2, ctr: 0.9 } },
    { id: "email", label: "Email newsletter", hint: "Subject line, header and two lines", lift: { reach: 0.45, ctr: 2.2, conversion: 1.25 } },
    { id: "shelf", label: "Retail shelf card", hint: "Read from a metre away in store", lift: { reach: 0.62, ctr: 0.55, conversion: 1.32 } },
  ],
  tones: [
    { id: "reassuring", label: "Reassuring", hint: "Calm and specific", lift: { conversion: 1.08 } },
    { id: "plain", label: "Matter-of-fact", hint: "Facts first", lift: { ctr: 1.03 } },
    { id: "upbeat", label: "Upbeat", hint: "Bright and quick", lift: { ctr: 1.1, conversion: 0.95 } },
  ],
  styles: [
    { id: "clear", label: "Clear water", hint: "Pale aqua with deep teal type", lift: { ctr: 1.02 } },
    { id: "night", label: "Night refill", hint: "Deep teal with white type", lift: { ctr: 1.06, conversion: 0.98 } },
    { id: "studio", label: "Studio white", hint: "White with teal accents", lift: { conversion: 1.03 } },
  ],
  variants: [
    {
      id: "A",
      name: "Taste test",
      headline: "Tap water, minus the aftertaste.",
      body: "{product} filters as you drink, so {audience} can refill from any tap. One filter lasts 60 days.",
      cta: "Order yours",
      note: "Leads with taste, the first thing people notice.",
      lift: { ctr: 1.06 },
    },
    {
      id: "B",
      name: "Filter value",
      headline: "One bottle. Sixty days of filtered refills.",
      body: "Swap single-use bottles for {product}. The carbon filter clicks out in seconds when it is time for a new one.",
      cta: "See how it filters",
      note: "Leads with value; strongest where people compare prices.",
      lift: { conversion: 1.1 },
    },
    {
      id: "C",
      name: "Any tap",
      headline: "Every tap is a refill station now.",
      body: "Office, campus or trailhead: {product} makes the nearest tap good enough for {audience}.",
      cta: "Pre-order for 3 March",
      note: "Leads with freedom; widest reach, softer clicks.",
      lift: { reach: 1.08, ctr: 0.95 },
    },
  ],
  recent: [
    { id: "tw-spring", title: "Filter swap reminder, spring", variant: "B", when: "Yesterday" },
    { id: "tw-campus", title: "Campus refill stations", variant: "C", when: "Mon 10 Feb" },
    { id: "tw-huts", title: "Hut-to-hut hiking kit", variant: "A", when: "Thu 6 Feb" },
  ],
  initialRun: 3,
  initialVariant: "A",
}

const DEFAULTS: Settings = {
  brief: spec.brief,
  audience: spec.audiences[0].id,
  channel: spec.channels[0].id,
  tone: spec.tones[0].id,
  style: spec.styles[0].id,
}

const FOCUS = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0B6E69]"
const BTN_PRIMARY = `inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#0B6E69] px-5 text-[17px] font-bold text-white transition-colors hover:bg-[#08524F] active:bg-[#063F3C] disabled:cursor-not-allowed disabled:bg-[#5C8F8C] ${FOCUS}`
const BTN_SECONDARY = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border-2 border-[#0B6E69] bg-white px-4 text-[16px] font-bold text-[#0B6E69] transition-colors hover:bg-[#E6F2F1] hover:text-[#08524F] active:bg-[#D2E8E6] disabled:cursor-not-allowed disabled:border-[#8FB5B2] disabled:text-[#4F6F6C] ${FOCUS}`
const LINK = `rounded-sm font-bold text-[#0B6E69] underline decoration-2 underline-offset-4 hover:text-[#08524F] hover:decoration-[3px] ${FOCUS}`

const CHANNEL_PLACE: Record<string, string> = {
  story: "in their Instagram stories",
  email: "in their inbox",
  shelf: "on a store shelf",
}

type Look = { bg: string; ink: string; soft: string; ctaBg: string; ctaInk: string; rule: string }

const LOOKS: Record<string, Look> = {
  clear: { bg: "#E3F1EF", ink: "#0E1B1A", soft: "#2F4A47", ctaBg: "#0B6E69", ctaInk: "#FFFFFF", rule: "#A9CFCB" },
  night: { bg: "#0C3B39", ink: "#FFFFFF", soft: "#C9E4E1", ctaBg: "#F4F7F6", ctaInk: "#0C3B39", rule: "#2C5E5B" },
  studio: { bg: "#FFFFFF", ink: "#0E1B1A", soft: "#3D5553", ctaBg: "#0B6E69", ctaInk: "#FFFFFF", rule: "#D3DEDC" },
}

const FIELD_NAMES: Record<keyof Settings, string> = {
  brief: "brief",
  audience: "audience",
  channel: "channel",
  tone: "tone",
  style: "look",
}

type StepId = 1 | 2 | 3 | 4
type StepState = "complete" | "attention" | "changed" | "open"
type Step = { id: StepId; label: string; state: StepState; note: string }
type ActionKind = "generate" | "save" | "export" | "load" | null
type CheckState = "pass" | "fail" | "advice" | "info" | "warn"
type Check = { id: string; state: CheckState; title: string; detail: string }

function sameSettings(a: Settings, b: Settings) {
  return (
    a.brief.trim() === b.brief.trim() &&
    a.audience === b.audience &&
    a.channel === b.channel &&
    a.tone === b.tone &&
    a.style === b.style
  )
}

function changedFields(now: Settings, then: Settings) {
  const keys: (keyof Settings)[] = ["brief", "audience", "channel", "tone", "style"]
  return keys.filter((key) => (key === "brief" ? now.brief.trim() !== then.brief.trim() : now[key] !== then[key]))
}

function listWords(words: string[]) {
  if (words.length <= 1) return words.join("")
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`
}

function stepAnchor(id: StepId) {
  return `uxr-step-${id}`
}

function focusById(id: string) {
  window.requestAnimationFrame(() => document.getElementById(id)?.focus())
}

const MONTH = "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"
const LAUNCH_WORDS = new RegExp(
  `\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:of\\s+)?${MONTH}\\b|\\b${MONTH}\\s+\\d{1,4}(?:st|nd|rd|th)?\\b|\\bq[1-4]\\b|\\b\\d{4}-\\d{2}-\\d{2}\\b|\\b(?:this|next|in|from)\\s+(?:spring|summer|autumn|fall|winter)\\b`,
  "i"
)

/* ---------- page ---------- */

export default function UxProReference() {
  const m = useMuseStudio(spec)
  const [activeStep, setActiveStep] = useState<StepId>(1)
  const [briefTouched, setBriefTouched] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [lastAction, setLastAction] = useState<ActionKind>(null)
  const [baseline, setBaseline] = useState<Settings>(DEFAULTS)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [loadedTitle, setLoadedTitle] = useState("")
  const summaryRef = useRef<HTMLDivElement>(null)

  const dirty = !sameSettings(m.settings, baseline) && !m.recent.some((item) => item.saved && sameSettings(item.settings, m.settings))
  const changed = changedFields(m.settings, m.output.settings)
  const showBriefError = Boolean(m.issue) && (briefTouched || attempted)
  const summaryVisible = summaryOpen && Boolean(m.issue)

  function blockedByBrief() {
    if (!m.issue) return false
    setAttempted(true)
    setSummaryOpen(true)
    window.requestAnimationFrame(() => summaryRef.current?.focus())
    return true
  }

  function runGenerate() {
    setLastAction("generate")
    blockedByBrief()
    m.generate()
  }

  function runSave() {
    setLastAction("save")
    blockedByBrief()
    m.save()
  }

  function runExport() {
    setLastAction("export")
    setActiveStep(4)
    m.exportCampaign()
  }

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
    if (event.code === "KeyG") {
      event.preventDefault()
      runGenerate()
    } else if (event.code === "KeyS") {
      event.preventDefault()
      runSave()
    } else if (event.code === "KeyE") {
      event.preventDefault()
      runExport()
    }
  })

  useEffect(() => {
    const handler = (event: KeyboardEvent) => onShortcut(event)
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  function load(item: RecentCampaign) {
    m.restore(item)
    setBaseline({ ...item.settings })
    setConfirmId(null)
    setLoadedTitle(item.title)
    setLastAction("load")
    setSummaryOpen(false)
    focusById(`uxr-load-${item.id}`)
  }

  function requestLoad(item: RecentCampaign) {
    if (dirty) {
      setConfirmId(item.id)
      focusById(`uxr-confirm-${item.id}`)
      return
    }
    load(item)
  }

  function cancelLoad(item: RecentCampaign) {
    setConfirmId(null)
    focusById(`uxr-load-${item.id}`)
  }

  function onBriefChange(value: string) {
    m.setBrief(value)
    if (!briefIssue(value)) setSummaryOpen(false)
  }

  const briefChanged = changed.includes("brief")
  const stepChanged = (keys: (keyof Settings)[]) => keys.filter((key) => changed.includes(key))
  const steps: Step[] = [
    {
      id: 1,
      label: "Brief",
      state: m.issue ? (showBriefError ? "attention" : "open") : briefChanged ? "changed" : "complete",
      note: m.issue ? (showBriefError ? "Needs attention" : "In progress") : briefChanged ? `Changed since run ${m.output.run}` : "Complete",
    },
    {
      id: 2,
      label: "Audience & channel",
      state: stepChanged(["audience", "channel"]).length ? "changed" : "complete",
      note: stepChanged(["audience", "channel"]).length ? `Changed since run ${m.output.run}` : "Complete",
    },
    {
      id: 3,
      label: "Voice & look",
      state: stepChanged(["tone", "style"]).length ? "changed" : "complete",
      note: stepChanged(["tone", "style"]).length ? `Changed since run ${m.output.run}` : "Complete",
    },
    {
      id: 4,
      label: "Review & export",
      state: m.exportStatus === "exported" ? "complete" : m.stale || m.exportStatus === "error" ? "attention" : "open",
      note: m.exportStatus === "exported" ? "Exported" : m.stale ? "Preview out of date" : m.exportStatus === "error" ? "Export failed" : "Not exported yet",
    },
  ]

  const briefLength = m.settings.brief.trim().length
  const checks: Check[] = [
    m.issue
      ? { id: "length", state: "fail", title: "Brief length", detail: m.issue }
      : { id: "length", state: "pass", title: "Brief length", detail: `${briefLength} characters, inside the ${BRIEF_MIN} to ${BRIEF_MAX} range.` },
    LAUNCH_WORDS.test(m.settings.brief)
      ? { id: "date", state: "pass", title: "Launch timing", detail: "The brief says when Tidewell Flow goes on sale." }
      : { id: "date", state: "advice", title: "Launch timing (recommended)", detail: "Add a launch date so route C can name it." },
    briefLength >= 320
      ? { id: "detail", state: "pass", title: "Brief detail", detail: "Full detail credit in the forecast." }
      : {
          id: "detail",
          state: "advice",
          title: "Brief detail (recommended)",
          detail: `${Math.min(briefLength, 320)} of 320 characters count toward forecast detail. More specifics lift click and order forecasts slightly.`,
        },
    m.stale
      ? { id: "fresh", state: "info", title: "Preview", detail: `Shows run ${m.output.run}. You changed the ${listWords(changed.map((key) => FIELD_NAMES[key]))} since.` }
      : { id: "fresh", state: "pass", title: "Preview", detail: `Matches your settings (run ${m.output.run}).` },
    m.failNext
      ? { id: "service", state: "warn", title: "Forecast service", detail: "Outage test is on. The next run will fail on purpose." }
      : { id: "service", state: "pass", title: "Forecast service", detail: "Answering normally." },
  ]

  return (
    <div
      className={`${atkinson.className} uxr-root min-h-[100dvh] touch-manipulation bg-[#F4F7F6] text-[16px] leading-normal text-[#0E1B1A] selection:bg-[#0B6E69] selection:text-white`}
    >
      <style>{`
        @media (max-width: 1023px) {
          .uxr-root :where(a, button, input, select, textarea, [tabindex="-1"]) { scroll-margin-bottom: 10rem; }
        }
        .uxr-root :where(textarea) { scrollbar-color: #0B6E69 #E6F2F1; }
      `}</style>

      <a
        href="#uxr-form"
        className={`sr-only z-30 rounded-lg bg-[#0B6E69] px-4 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 ${FOCUS}`}
      >
        Skip to the campaign form
      </a>

      <Header m={m} />
      <StepPath steps={steps} activeStep={activeStep} onPick={setActiveStep} />

      <main className="mx-auto grid max-w-[1440px] gap-6 px-4 pb-48 pt-4 sm:px-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)_minmax(0,300px)] lg:px-8 lg:pb-10">
        <form
          id="uxr-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            runGenerate()
          }}
          className="min-w-0 space-y-3"
          aria-label="Campaign settings"
        >
          {summaryVisible && m.issue ? (
            <div
              ref={summaryRef}
              role="alert"
              tabIndex={-1}
              aria-labelledby="uxr-summary-title"
              className={`rounded-xl border-2 border-[#B42318] bg-white p-4 ${FOCUS}`}
            >
              <h2 id="uxr-summary-title" className="flex items-center gap-2 text-[18px] font-bold text-[#B42318]">
                <CircleAlert aria-hidden className="size-5 shrink-0" />
                {lastAction === "save" && m.saveStatus === "error" ? "Nothing to save yet. Fix this first:" : "Fix this before you generate:"}
              </h2>
              <ul className="mt-2 space-y-1">
                <li>
                  <a
                    href="#uxr-brief"
                    onClick={(event) => {
                      event.preventDefault()
                      document.getElementById("uxr-brief")?.focus()
                    }}
                    className={`inline-flex min-h-[44px] items-center text-[16px] ${LINK} text-[#B42318] hover:text-[#8F1B12]`}
                  >
                    {m.issue}
                  </a>
                </li>
              </ul>
            </div>
          ) : null}

          <FormSection id={1} title="Brief" onFocus={() => setActiveStep(1)}>
            <BriefField
              value={m.settings.brief}
              issue={m.issue}
              showError={showBriefError}
              onChange={onBriefChange}
              onBlur={() => setBriefTouched(true)}
              onSubmitShortcut={runGenerate}
            />
          </FormSection>

          <FormSection id={2} title="Audience & channel" onFocus={() => setActiveStep(2)}>
            <RadioCards
              name="audience"
              legend="Who is it for?"
              options={spec.audiences}
              value={m.settings.audience}
              onChange={(id) => m.setControl("audience", id)}
              meta={(option) => `${formatReach(option.size ?? 0)} people`}
            />
            <SelectField
              controlKey="channel"
              label="Where will it run?"
              options={spec.channels}
              value={m.settings.channel}
              onChange={(id) => m.setControl("channel", id)}
              showHint
            />
          </FormSection>

          <FormSection id={3} title="Voice & look" onFocus={() => setActiveStep(3)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                controlKey="tone"
                label="Tone"
                options={spec.tones}
                value={m.settings.tone}
                onChange={(id) => m.setControl("tone", id)}
              />
              <SelectField
                controlKey="style"
                label="Visual look"
                options={spec.styles}
                value={m.settings.style}
                onChange={(id) => m.setControl("style", id)}
              />
            </div>
          </FormSection>
        </form>

        <section
          id={stepAnchor(4)}
          tabIndex={-1}
          aria-labelledby="uxr-review-title"
          onFocus={() => setActiveStep(4)}
          className={`min-w-0 scroll-mt-4 space-y-4 rounded-xl ${FOCUS}`}
        >
          <div className="rounded-xl border border-[#D3DEDC] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="uxr-review-title" className="text-[20px] font-bold">
                <span className="text-[#3D5553]">4.</span> Review & export
              </h2>
              <p className="text-[15px] text-[#3D5553]">Pick a route to preview it and see its forecast.</p>
            </div>
            <RouteTabs m={m} />
            {m.stale && !m.busy ? (
              <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[#E9C58A] bg-[#FFFAEB] p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex gap-2 text-[15px]">
                  <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B54708]" />
                  <span>
                    <strong>Out of date.</strong> This preview shows run {m.output.run}. You changed the{" "}
                    {listWords(changed.map((key) => FIELD_NAMES[key]))} since. Generate again to see them.
                  </span>
                </p>
                <button type="button" onClick={runGenerate} className={`${BTN_SECONDARY} shrink-0`}>
                  <RefreshCw aria-hidden className="size-4" />
                  Generate again
                </button>
              </div>
            ) : null}
            <div id="uxr-route-panel" role="tabpanel" aria-labelledby={`uxr-tab-${m.selected}`} className="mt-4">
              <PreviewPanel m={m} />
            </div>
          </div>
          <Metrics m={m} />
        </section>

        <StatusRail
          m={m}
          checks={checks}
          lastAction={lastAction}
          loadedTitle={loadedTitle}
          confirmId={confirmId}
          dirty={dirty}
          onGenerate={runGenerate}
          onSave={runSave}
          onExport={runExport}
          onRequestLoad={requestLoad}
          onLoad={load}
          onCancelLoad={cancelLoad}
          onFocusStep={() => setActiveStep(4)}
        />
      </main>

      <MobileActionBar m={m} lastAction={lastAction} onGenerate={runGenerate} onSave={runSave} onExport={runExport} />
    </div>
  )
}

/* ---------- header and step path ---------- */

function BottleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden className={className} fill="none">
      <rect x="8" y="1.5" width="8" height="4" rx="1.5" fill="currentColor" />
      <path
        d="M7 7.5h10a2 2 0 0 1 2 2V28a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 28V9.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M5.5 15h13" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Header({ m }: { m: MuseStudio }) {
  return (
    <header className="border-b border-[#D3DEDC] bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <BottleMark className="h-8 w-6 shrink-0 text-[#0B6E69]" />
          <h1 className="min-w-0 text-[20px] font-bold leading-tight">
            <span translate="no">Tidewell Flow</span> launch campaign
            <span className="ml-2 hidden text-[15px] font-normal text-[#3D5553] xl:inline">Muse studio: four steps, then export</span>
          </h1>
        </div>
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
          <div className="flex gap-1.5">
            <dt className="text-[#3D5553]">Drafted by</dt>
            <dd className="font-bold" translate="no">
              {m.modelName}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-[#3D5553]">Skill chain</dt>
            <dd className="font-bold" translate="no">
              {m.chain}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  )
}

function StepIcon({ step, current }: { step: Step; current: boolean }) {
  const base = "flex size-8 shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
  if (step.state === "complete")
    return (
      <span className={`${base} bg-[#0B6E69] text-white`}>
        <Check aria-hidden className="size-4" strokeWidth={3} />
      </span>
    )
  if (step.state === "attention")
    return (
      <span className={`${base} border-2 border-[#B54708] bg-[#FFFAEB] text-[#B54708]`}>
        <TriangleAlert aria-hidden className="size-4" />
      </span>
    )
  if (step.state === "changed")
    return (
      <span className={`${base} border-2 border-[#3D5553] bg-white text-[#3D5553]`}>
        <Info aria-hidden className="size-4" />
      </span>
    )
  return (
    <span className={`${base} border-2 ${current ? "border-[#0B6E69] text-[#0B6E69]" : "border-[#6B7F7D] text-[#3D5553]"} bg-white`}>
      {step.id}
    </span>
  )
}

function StepPath({ steps, activeStep, onPick }: { steps: Step[]; activeStep: StepId; onPick: (id: StepId) => void }) {
  const active = steps.find((step) => step.id === activeStep) ?? steps[0]
  return (
    <nav aria-label="Campaign steps" className="border-b border-[#D3DEDC] bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <ol className="hidden grid-cols-4 gap-2 md:grid">
          {steps.map((step) => {
            const current = step.id === activeStep
            return (
              <li key={step.id} className="min-w-0">
                <a
                  href={`#${stepAnchor(step.id)}`}
                  aria-current={current ? "step" : undefined}
                  onClick={() => {
                    onPick(step.id)
                    window.requestAnimationFrame(() => document.getElementById(stepAnchor(step.id))?.focus({ preventScroll: true }))
                  }}
                  className={`group flex min-h-[56px] items-center gap-3 border-b-[3px] px-2 py-1.5 transition-colors ${
                    current ? "border-[#0B6E69] bg-[#F4F7F6]" : "border-transparent hover:border-[#A9CFCB] hover:bg-[#F4F7F6]"
                  } ${FOCUS}`}
                >
                  <StepIcon step={step} current={current} />
                  <span className="min-w-0">
                    <span className={`block truncate text-[16px] text-[#0E1B1A] ${current ? "font-bold" : ""}`}>
                      {step.id}. {step.label}
                    </span>
                    <span
                      className={`block truncate text-[14px] ${step.state === "attention" ? "font-bold text-[#B54708]" : "text-[#3D5553]"}`}
                    >
                      {step.note}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>

        <div className="py-3 md:hidden">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[16px] font-bold">
              Step {active.id} of {steps.length}: {active.label}
            </p>
            <p className={`text-[14px] ${active.state === "attention" ? "font-bold text-[#B54708]" : "text-[#3D5553]"}`}>{active.note}</p>
          </div>
          <div
            role="progressbar"
            aria-label={`Step ${active.id} of ${steps.length}`}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={active.id}
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#DDE7E5]"
          >
            <div
              className="h-full origin-left rounded-full bg-[#0B6E69] transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${active.id / steps.length})` }}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ---------- form ---------- */

function FormSection({ id, title, onFocus, children }: { id: StepId; title: string; onFocus: () => void; children: ReactNode }) {
  return (
    <section
      id={stepAnchor(id)}
      tabIndex={-1}
      aria-labelledby={`${stepAnchor(id)}-title`}
      onFocus={onFocus}
      className={`scroll-mt-4 space-y-3 rounded-xl border border-[#D3DEDC] bg-white px-4 pb-4 pt-3 ${FOCUS}`}
    >
      <h2 id={`${stepAnchor(id)}-title`} className="text-[19px] font-bold leading-[26px]">
        <span className="text-[#3D5553]">{id}.</span> {title}
      </h2>
      {children}
    </section>
  )
}

function BriefField({
  value,
  issue,
  showError,
  onChange,
  onBlur,
  onSubmitShortcut,
}: {
  value: string
  issue: string | null
  showError: boolean
  onChange: (value: string) => void
  onBlur: () => void
  onSubmitShortcut: () => void
}) {
  const length = value.trim().length
  const counter =
    length < BRIEF_MIN
      ? `${length} of ${BRIEF_MAX}. ${BRIEF_MIN - length} more needed.`
      : length > BRIEF_MAX
        ? `${length} of ${BRIEF_MAX}. ${length - BRIEF_MAX} over the limit.`
        : `${length} of ${BRIEF_MAX} characters`
  const bucket =
    length === 0
      ? "The brief is empty."
      : length < BRIEF_MIN
        ? "The brief is too short to generate."
        : length > BRIEF_MAX
          ? "The brief is over the character limit."
          : length > BRIEF_MAX - 40
            ? "The brief is close to the character limit."
            : "The brief length is fine."
  const counterTone =
    length > BRIEF_MAX || (showError && length < BRIEF_MIN) ? "text-[#B42318] font-bold" : length > BRIEF_MAX - 40 ? "text-[#B54708] font-bold" : "text-[#3D5553]"

  return (
    <div className="space-y-1.5">
      <label htmlFor="uxr-brief" className="block text-[16px] font-bold">
        Launch brief <span className="font-normal text-[#3D5553]">(required)</span>
      </label>
      <p id="uxr-brief-help" className="text-[15px] text-[#3D5553]">
        What is launching, for whom, and when. {BRIEF_MIN} to {BRIEF_MAX} characters.
      </p>
      <textarea
        id="uxr-brief"
        name="brief"
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            onSubmitShortcut()
          }
        }}
        aria-invalid={showError}
        aria-describedby={`uxr-brief-help uxr-brief-count${showError ? " uxr-brief-error" : ""}`}
        placeholder="Launch Tidewell Flow on 3 March for…"
        className={`block w-full resize-y rounded-lg border-2 bg-white px-3 py-2 text-[16px] leading-normal text-[#0E1B1A] caret-[#0B6E69] placeholder:text-[#5B6F6D] ${
          showError ? "border-[#B42318]" : "border-[#6B7F7D] hover:border-[#3D5553]"
        } ${FOCUS}`}
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        {showError && issue ? (
          <p id="uxr-brief-error" className="flex min-w-0 gap-1.5 text-[15px] font-bold text-[#B42318]">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>{issue}</span>
          </p>
        ) : (
          <span />
        )}
        <p id="uxr-brief-count" aria-hidden className={`ml-auto shrink-0 text-[14px] tabular-nums ${counterTone}`}>
          {counter}
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {bucket}
      </p>
    </div>
  )
}

function RadioCards({
  name,
  legend,
  options,
  value,
  onChange,
  meta,
}: {
  name: string
  legend: string
  options: Option[]
  value: string
  onChange: (id: string) => void
  meta?: (option: Option) => string
}) {
  const hint = options.find((option) => option.id === value)?.hint
  return (
    <fieldset aria-describedby={`uxr-${name}-hint`}>
      <legend className="mb-1.5 text-[16px] font-bold">{legend}</legend>
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
        {options.map((option) => {
          const checked = option.id === value
          return (
            <label
              key={option.id}
              className={`relative flex min-h-[52px] cursor-pointer gap-2 rounded-lg border-2 px-2.5 py-2 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0B6E69] min-[420px]:flex-col min-[420px]:gap-1 ${
                checked ? "border-[#0B6E69] bg-[#E6F2F1]" : "border-[#D3DEDC] bg-white hover:border-[#6B7F7D]"
              }`}
            >
              <input
                type="radio"
                name={`uxr-${name}`}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="mt-0.5 size-5 shrink-0 accent-[#0B6E69] focus-visible:outline-none"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold leading-snug">{option.label}</span>
                {meta ? <span className="block text-[14px] tabular-nums text-[#3D5553]">{meta(option)}</span> : null}
              </span>
            </label>
          )
        })}
      </div>
      <p id={`uxr-${name}-hint`} className="mt-1.5 text-[14px] text-[#3D5553]">
        {hint}
      </p>
    </fieldset>
  )
}

function SelectField({
  controlKey,
  label,
  options,
  value,
  onChange,
  showHint = false,
}: {
  controlKey: ControlKey
  label: string
  options: Option[]
  value: string
  onChange: (id: string) => void
  showHint?: boolean
}) {
  const id = `uxr-${controlKey}`
  const hint = options.find((option) => option.id === value)?.hint
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={id} className="block text-[16px] font-bold">
        {label}
      </label>
      <select
        id={id}
        name={controlKey}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={showHint ? `${id}-hint` : undefined}
        className={`block min-h-[48px] w-full cursor-pointer rounded-lg border-2 border-[#6B7F7D] bg-white px-3 text-[16px] text-[#0E1B1A] hover:border-[#3D5553] ${FOCUS}`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {showHint ? (
        <p id={`${id}-hint`} className="text-[14px] text-[#3D5553]">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/* ---------- routes, preview and metrics ---------- */

function RouteTabs({ m }: { m: MuseStudio }) {
  function onKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % VARIANT_IDS.length
    else if (event.key === "ArrowLeft") next = (index - 1 + VARIANT_IDS.length) % VARIANT_IDS.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = VARIANT_IDS.length - 1
    else return
    event.preventDefault()
    const id = VARIANT_IDS[next]
    m.select(id)
    document.getElementById(`uxr-tab-${id}`)?.focus()
  }

  return (
    <div role="tablist" aria-label="Campaign routes" className="mt-4 grid grid-cols-3 gap-2">
      {VARIANT_IDS.map((id, index) => {
        const variant = m.output.variants[id]
        const selected = m.selected === id
        return (
          <button
            key={id}
            id={`uxr-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="uxr-route-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => m.select(id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`flex min-h-[56px] min-w-0 flex-col items-start justify-center rounded-lg border-2 px-3 py-2 text-left transition-colors ${
              selected ? "border-[#0B6E69] bg-[#E6F2F1]" : "border-[#D3DEDC] bg-white hover:border-[#6B7F7D] hover:bg-[#F4F7F6]"
            } ${FOCUS}`}
          >
            <span className="flex items-center gap-1.5 text-[15px] font-bold">
              {selected ? <CircleCheck aria-hidden className="size-4 text-[#0B6E69]" /> : null}
              Route {id}
            </span>
            <span className="w-full truncate text-[14px] text-[#3D5553]">{variant.name}</span>
          </button>
        )
      })}
    </div>
  )
}

function PreviewPanel({ m }: { m: MuseStudio }) {
  if (m.busy) {
    return (
      <div aria-busy="true" aria-label="Preview is being generated" className="grid min-h-[340px] gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
        <PreviewSkeleton channel={m.settings.channel} />
        <div className="space-y-3 self-center">
          <p className="text-[16px] font-bold">
            Generating run {m.output.run + 1}: {m.stageLabel}
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-[#DDE7E5]">
            <div
              className="h-full origin-left rounded-full bg-[#0B6E69] transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${m.progress / 100})` }}
            />
          </div>
          <p className="text-[15px] text-[#3D5553]">Your brief and settings stay editable. The preview fills in when all three routes are ready.</p>
        </div>
      </div>
    )
  }

  const variant = m.current
  const look = LOOKS[m.output.settings.style] ?? LOOKS.clear
  const channel = m.output.settings.channel
  return (
    <figure className="grid min-h-[340px] items-center gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className="flex justify-center">
        <AdFrame channel={channel} look={look} headline={variant.headline} body={variant.body} cta={variant.cta} />
      </div>
      <figcaption className="min-w-0 space-y-3">
        <p className="text-[18px] font-bold leading-snug">
          Route {variant.id}: {variant.name}
        </p>
        {variant.note ? <p className="text-[15px] text-[#3D5553]">{variant.note}</p> : null}
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-[15px]">
          <dt className="text-[#3D5553]">Format</dt>
          <dd className="font-bold">{m.labelOf("channel", channel)}</dd>
          <dt className="text-[#3D5553]">Voice</dt>
          <dd>
            {m.labelOf("tone", m.output.settings.tone)}, {m.labelOf("style", m.output.settings.style).toLowerCase()}
          </dd>
          <dt className="text-[#3D5553]">Made</dt>
          <dd className="tabular-nums">
            Run {m.output.run} at {m.output.at}
          </dd>
        </dl>
        {m.stale ? (
          <p className="flex gap-1.5 text-[14px] font-bold text-[#B54708]">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            Out of date: generate again to include your changes.
          </p>
        ) : (
          <p className="flex gap-1.5 text-[14px] text-[#067647]">
            <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
            Up to date with your settings.
          </p>
        )}
      </figcaption>
    </figure>
  )
}

function AdFrame({ channel, look, headline, body, cta }: { channel: string; look: Look; headline: string; body: string; cta: string }) {
  const colors = { backgroundColor: look.bg, color: look.ink }
  const soft = { color: look.soft }
  const button = { backgroundColor: look.ctaBg, color: look.ctaInk }

  if (channel === "email") {
    return (
      <div className="w-full max-w-[340px] overflow-hidden rounded-lg border border-[#D3DEDC] bg-white text-left shadow-[0_1px_2px_rgba(14,27,26,0.06),0_8px_24px_-12px_rgba(14,27,26,0.18)]">
        <div className="border-b border-[#D3DEDC] px-3 py-2 text-[13px] text-[#3D5553]">
          <p>
            From <span className="font-bold text-[#0E1B1A]">Tidewell</span>
          </p>
          <p className="truncate font-bold text-[#0E1B1A]">{headline}</p>
        </div>
        <div className="px-4 py-5" style={colors}>
          <BottleMark className="h-10 w-8" />
          <p className="mt-3 text-[20px] font-bold leading-tight [text-wrap:balance]">{headline}</p>
          <p className="mt-2 text-[14px] leading-normal" style={soft}>
            {body}
          </p>
          <span className="mt-4 inline-flex min-h-[40px] items-center rounded-md px-4 text-[14px] font-bold" style={button}>
            {cta}
          </span>
        </div>
      </div>
    )
  }

  if (channel === "shelf") {
    return (
      <div
        className="flex aspect-[4/3] w-full max-w-[340px] flex-col justify-between rounded-lg border p-5 text-left shadow-[0_1px_2px_rgba(14,27,26,0.06),0_8px_24px_-12px_rgba(14,27,26,0.18)]"
        style={{ ...colors, borderColor: look.rule }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-[24px] font-bold leading-[1.1] [text-wrap:balance]">{headline}</p>
          <BottleMark className="h-14 w-10 shrink-0" />
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-[13px] font-bold" style={soft} translate="no">
            Tidewell Flow
          </p>
          <span className="inline-flex min-h-[36px] items-center gap-1 rounded-md px-3 text-[14px] font-bold" style={button}>
            {cta}
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex aspect-[9/16] w-[190px] flex-col justify-between rounded-[22px] border-4 border-[#0E1B1A] p-4 text-left shadow-[0_1px_2px_rgba(14,27,26,0.06),0_12px_28px_-12px_rgba(14,27,26,0.28)]"
      style={colors}
    >
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold" style={soft} translate="no">
          Tidewell
        </p>
        <BottleMark className="h-9 w-7" />
      </div>
      <div>
        <p className="text-[20px] font-bold leading-[1.15] [text-wrap:balance]">{headline}</p>
        <p className="mt-2 text-[13px] leading-snug" style={soft}>
          {body}
        </p>
      </div>
      <span className="inline-flex min-h-[40px] items-center justify-center rounded-full px-3 text-[14px] font-bold" style={button}>
        {cta}
      </span>
    </div>
  )
}

function PreviewSkeleton({ channel }: { channel: string }) {
  const bar = "rounded bg-[#D5E3E1] motion-safe:animate-pulse"
  if (channel === "email")
    return (
      <div aria-hidden className="w-full max-w-[340px] overflow-hidden rounded-lg border border-[#D3DEDC] bg-white">
        <div className="space-y-2 border-b border-[#D3DEDC] px-3 py-3">
          <div className={`${bar} h-3 w-24`} />
          <div className={`${bar} h-3 w-52`} />
        </div>
        <div className="space-y-3 bg-[#EEF4F3] px-4 py-5">
          <div className={`${bar} h-10 w-8`} />
          <div className={`${bar} h-5 w-4/5`} />
          <div className={`${bar} h-3 w-full`} />
          <div className={`${bar} h-3 w-2/3`} />
          <div className={`${bar} h-10 w-28`} />
        </div>
      </div>
    )
  if (channel === "shelf")
    return (
      <div aria-hidden className="flex aspect-[4/3] w-full max-w-[340px] flex-col justify-between rounded-lg border border-[#D3DEDC] bg-[#EEF4F3] p-5">
        <div className="space-y-2">
          <div className={`${bar} h-6 w-4/5`} />
          <div className={`${bar} h-6 w-3/5`} />
        </div>
        <div className="flex justify-between">
          <div className={`${bar} h-3 w-20`} />
          <div className={`${bar} h-9 w-28`} />
        </div>
      </div>
    )
  return (
    <div aria-hidden className="mx-auto flex aspect-[9/16] w-[190px] flex-col justify-between rounded-[22px] border-4 border-[#B5C7C5] bg-[#EEF4F3] p-4">
      <div className={`${bar} h-3 w-16`} />
      <div className="space-y-2">
        <div className={`${bar} h-5 w-full`} />
        <div className={`${bar} h-5 w-3/4`} />
        <div className={`${bar} h-3 w-full`} />
        <div className={`${bar} h-3 w-5/6`} />
      </div>
      <div className={`${bar} h-10 w-full rounded-full`} />
    </div>
  )
}

function DeltaLine({ now, before, kind, run }: { now: number; before: number | undefined; kind: "reach" | "percent"; run: number }) {
  const text = formatDelta(now, before, kind)
  if (text === null) return <p className="text-[14px] text-[#3D5553]">First run this session</p>
  const direction = before === undefined || text === "±0" ? 0 : now > before ? 1 : -1
  const Icon = direction > 0 ? ArrowUpRight : direction < 0 ? ArrowDownRight : Minus
  return (
    <p className="flex items-center gap-1 text-[14px] tabular-nums text-[#3D5553]">
      <Icon aria-hidden className="size-4" />
      <span>
        {direction > 0 ? "Up" : direction < 0 ? "Down" : "No change"} {text === "±0" ? "" : text} since run {run - 1}
      </span>
    </p>
  )
}

function Metrics({ m }: { m: MuseStudio }) {
  const { reach, ctr, conversion } = m.current.metrics
  const before = m.previous?.metrics
  const audience = m.labelOf("audience", m.output.settings.audience).toLowerCase()
  const place = CHANNEL_PLACE[m.output.settings.channel] ?? "in this placement"
  const perThousand = Math.max(1, Math.round(ctr * 10))
  const oneIn = Math.max(1, Math.round(100 / conversion))
  const items = [
    {
      key: "reach",
      label: "Reach",
      value: formatReach(reach),
      delta: <DeltaLine now={reach} before={before?.reach} kind="reach" run={m.output.run} />,
      plain: `About ${formatReach(reach)} ${audience} could see it ${place}.`,
    },
    {
      key: "ctr",
      label: "Click-through rate",
      value: formatPercent(ctr),
      delta: <DeltaLine now={ctr} before={before?.ctr} kind="percent" run={m.output.run} />,
      plain: `About ${perThousand} in every 1,000 people who see it tap through.`,
    },
    {
      key: "conversion",
      label: "Conversion",
      value: formatPercent(conversion),
      delta: <DeltaLine now={conversion} before={before?.conversion} kind="percent" run={m.output.run} />,
      plain: `About 1 in ${oneIn} people who tap through place an order.`,
    },
  ]

  return (
    <section aria-labelledby="uxr-metrics-title" className="rounded-xl border border-[#D3DEDC] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="uxr-metrics-title" className="text-[18px] font-bold">
          Forecast for route {m.current.id}
        </h3>
        <p className="text-[14px] text-[#3D5553]">Simulated by Muse, not live data. Use it to compare routes.</p>
      </div>
      <dl className="mt-3 grid gap-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#D3DEDC]">
        {items.map((item) => (
          <div key={item.key} className="min-w-0 sm:px-4 sm:first:pl-0 sm:last:pr-0">
            <dt className="text-[15px] font-bold text-[#3D5553]">{item.label} (forecast)</dt>
            <dd>
              <p className={`text-[28px] font-bold leading-tight tabular-nums ${m.stale ? "text-[#3D5553]" : ""}`}>{item.value}</p>
              {item.delta}
              <p className="mt-1 text-[15px] leading-snug">{item.plain}</p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---------- status rail ---------- */

function CheckIcon({ state }: { state: CheckState }) {
  if (state === "pass") return <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[#067647]" />
  if (state === "fail") return <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B42318]" />
  if (state === "warn" || state === "advice") return <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B54708]" />
  return <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-[#3D5553]" />
}

const CHECK_WORD: Record<CheckState, string> = {
  pass: "Done",
  fail: "Must fix",
  advice: "Recommended",
  warn: "Heads up",
  info: "Note",
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[28px] items-center justify-center rounded border border-[#6B7F7D] border-b-2 bg-white px-1.5 text-[13px] font-bold text-[#0E1B1A]">
      {children}
    </kbd>
  )
}

function StatusRail({
  m,
  checks,
  lastAction,
  loadedTitle,
  confirmId,
  dirty,
  onGenerate,
  onSave,
  onExport,
  onRequestLoad,
  onLoad,
  onCancelLoad,
  onFocusStep,
}: {
  m: MuseStudio
  checks: Check[]
  lastAction: ActionKind
  loadedTitle: string
  confirmId: string | null
  dirty: boolean
  onGenerate: () => void
  onSave: () => void
  onExport: () => void
  onRequestLoad: (item: RecentCampaign) => void
  onLoad: (item: RecentCampaign) => void
  onCancelLoad: (item: RecentCampaign) => void
  onFocusStep: () => void
}) {
  const blocking = checks.filter((check) => check.state === "fail").length
  const readiness = m.busy
    ? "Generating now. You can keep editing."
    : blocking
      ? `Not yet. Fix ${blocking === 1 ? "the item" : `${blocking} items`} marked Must fix.`
      : m.stale
        ? "Yes. Generate to update the preview with your changes."
        : "Yes. Everything required is in place."

  return (
    <aside aria-label="Campaign status" className="min-w-0 space-y-3">
      <section aria-labelledby="uxr-ready-title" className="rounded-xl border border-[#D3DEDC] bg-white p-4">
        <h2 id="uxr-ready-title" className="text-[20px] font-bold">
          Ready to generate?
        </h2>
        <p aria-live="polite" className={`mt-1 text-[15px] ${blocking ? "font-bold text-[#B42318]" : "text-[#0E1B1A]"}`}>
          {readiness}
        </p>
        <ul className="mt-3 space-y-2.5">
          {checks.map((check) => (
            <li key={check.id} className="flex gap-2">
              <CheckIcon state={check.state} />
              <div className="min-w-0">
                <p className="text-[15px] font-bold leading-snug">
                  <span className="sr-only">{CHECK_WORD[check.state]}: </span>
                  {check.title}
                </p>
                <p className="text-[14px] leading-snug text-[#3D5553]">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 hidden gap-2 lg:grid" onFocus={onFocusStep}>
          <button
            type="button"
            onClick={onGenerate}
            disabled={m.busy}
            aria-keyshortcuts="Alt+G"
            className={`${BTN_PRIMARY} w-full`}
          >
            {m.busy ? <LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" /> : <Sparkles aria-hidden className="size-5" />}
            Generate
            <span className="sr-only"> three routes</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={onSave} disabled={m.saveStatus === "saving"} aria-keyshortcuts="Alt+S" className={BTN_SECONDARY}>
              {m.saveStatus === "saving" ? (
                <LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" />
              ) : m.saveStatus === "saved" ? (
                <Check aria-hidden className="size-4" />
              ) : (
                <Save aria-hidden className="size-4" />
              )}
              Save
            </button>
            <button type="button" onClick={onExport} disabled={m.exportStatus === "exporting"} aria-keyshortcuts="Alt+E" className={BTN_SECONDARY}>
              {m.exportStatus === "exporting" ? (
                <LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" />
              ) : m.exportStatus === "exported" ? (
                <Check aria-hidden className="size-4" />
              ) : (
                <Download aria-hidden className="size-4" />
              )}
              Export
            </button>
          </div>
        </div>
      </section>

      <LastActionPanel m={m} lastAction={lastAction} loadedTitle={loadedTitle} onGenerate={onGenerate} onSave={onSave} onExport={onExport} />

      <section aria-labelledby="uxr-test-title" className="rounded-xl border border-[#D3DEDC] bg-white p-4">
        <h2 id="uxr-test-title" className="text-[18px] font-bold">
          Test the failure path
        </h2>
        <label className="mt-2 flex min-h-[48px] cursor-pointer items-start gap-3 rounded-lg py-1.5 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#0B6E69]">
          <input
            type="checkbox"
            checked={m.failNext}
            onChange={(event) => m.setFailNext(event.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-[#0B6E69] focus-visible:outline-none"
          />
          <span>
            <span className="block text-[16px] font-bold">Simulate a forecast outage on the next run</span>
            <span className="block text-[14px] text-[#3D5553]">Turns itself off after one failed run.</span>
          </span>
        </label>
      </section>

      <section aria-labelledby="uxr-keys-title" className="hidden rounded-xl border border-[#D3DEDC] bg-white p-4 md:block">
        <h2 id="uxr-keys-title" className="flex items-center gap-2 text-[18px] font-bold">
          <Keyboard aria-hidden className="size-5 text-[#3D5553]" />
          Keyboard shortcuts
        </h2>
        <p className="mt-1 text-[14px] text-[#3D5553]">Work from anywhere on the page, including inside the brief. Use Option on a Mac.</p>
        <dl className="mt-3 space-y-2 text-[15px]">
          {[
            ["Alt", "G", "Generate three routes"],
            ["Alt", "S", "Save the selected route"],
            ["Alt", "E", "Export the selected route"],
            ["Ctrl", "Enter", "Generate from inside the brief"],
          ].map(([modifier, key, label]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <dt className="flex shrink-0 items-center gap-1">
                <Kbd>{modifier}</Kbd>
                <span aria-hidden>+</span>
                <Kbd>{key}</Kbd>
              </dt>
              <dd className="text-right">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <RecentPanel m={m} confirmId={confirmId} dirty={dirty} onRequestLoad={onRequestLoad} onLoad={onLoad} onCancelLoad={onCancelLoad} />
    </aside>
  )
}

function LastActionPanel({
  m,
  lastAction,
  loadedTitle,
  onGenerate,
  onSave,
  onExport,
}: {
  m: MuseStudio
  lastAction: ActionKind
  loadedTitle: string
  onGenerate: () => void
  onSave: () => void
  onExport: () => void
}) {
  const generateServiceError = m.generateStatus === "error" && !m.issue && m.generateError
  const generateBlocked = m.generateStatus === "error" && Boolean(m.issue)
  const saveBlocked = m.saveStatus === "error" && Boolean(m.issue)

  let status: { tone: "busy" | "success" | "info" | "blocked"; text: string } = {
    tone: "info",
    text: `Run ${m.output.run} is on screen, generated at ${m.output.at}.${m.stale ? " You have changes that are not in it yet." : ""}`,
  }
  if (m.busy) status = { tone: "busy", text: `Generating run ${m.output.run + 1}: ${m.stageLabel} (${m.progress}%).` }
  else if (lastAction === "generate" && m.generateStatus === "success")
    status = { tone: "success", text: `Run ${m.output.run} ready at ${m.output.at}. Three routes forecast; route ${m.selected} is showing.` }
  else if (lastAction === "generate" && generateBlocked)
    status = { tone: "blocked", text: "Generate did not run: the brief needs work. The problem is listed at the top of the form." }
  else if (lastAction === "save" && m.saveStatus === "saving") status = { tone: "busy", text: `Saving route ${m.selected}…` }
  else if (lastAction === "save" && m.saveStatus === "saved")
    status = { tone: "success", text: `Saved route ${m.selected}, “${m.current.name}”. It is at the top of Recent campaigns.` }
  else if (lastAction === "save" && saveBlocked)
    status = { tone: "blocked", text: "Save did not run: the brief needs work. The problem is listed at the top of the form." }
  else if (lastAction === "export" && m.exportStatus === "exporting") status = { tone: "busy", text: "Preparing the export file…" }
  else if (lastAction === "export" && m.exportStatus === "exported")
    status = { tone: "success", text: `Exported route ${m.selected} from run ${m.output.run}. Check your downloads folder.` }
  else if (lastAction === "load")
    status = {
      tone: "info",
      text: `Loaded “${loadedTitle}”.${m.stale ? ` The preview still shows run ${m.output.run}; generate to see the loaded settings.` : ""}`,
    }

  const Icon =
    status.tone === "busy" ? LoaderCircle : status.tone === "success" ? CircleCheck : status.tone === "blocked" ? CircleAlert : History
  const iconTone =
    status.tone === "busy"
      ? "text-[#0B6E69] motion-safe:animate-spin"
      : status.tone === "success"
        ? "text-[#067647]"
        : status.tone === "blocked"
          ? "text-[#B42318]"
          : "text-[#3D5553]"

  const saveStorageError = m.saveStatus === "error" && !m.issue && m.saveError
  const exportError = m.exportStatus === "error" && m.exportError

  return (
    <section
      id="uxr-last"
      tabIndex={-1}
      aria-labelledby="uxr-last-title"
      className={`scroll-mt-4 rounded-xl border border-[#D3DEDC] bg-white p-4 ${FOCUS}`}
    >
      <h2 id="uxr-last-title" className="text-[18px] font-bold">
        Last action
      </h2>
      <div role="status" aria-live="polite" className="mt-2 flex gap-2 text-[15px]">
        <Icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${iconTone}`} />
        <p className="min-w-0">{status.text}</p>
      </div>

      {generateServiceError ? (
        <div role="alert" className="mt-3 rounded-lg border-2 border-[#B42318] bg-[#FEF3F2] p-3">
          <p className="flex gap-2 text-[15px]">
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B42318]" />
            <span>
              <strong className="text-[#B42318]">Run {m.output.run + 1} failed.</strong> {m.generateError}
            </span>
          </p>
          <button type="button" onClick={onGenerate} className={`${BTN_PRIMARY} mt-3 w-full`}>
            <RefreshCw aria-hidden className="size-5" />
            Try again
          </button>
        </div>
      ) : null}

      {saveBlocked && m.saveError ? (
        <p role="alert" className="mt-3 flex gap-2 rounded-lg border-2 border-[#B42318] bg-[#FEF3F2] p-3 text-[15px]">
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B42318]" />
          <span>{m.saveError}</span>
        </p>
      ) : null}

      {saveStorageError ? (
        <div role="alert" className="mt-3 rounded-lg border-2 border-[#B42318] bg-[#FEF3F2] p-3">
          <p className="flex gap-2 text-[15px]">
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B42318]" />
            <span>{m.saveError}</span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={onSave} className={BTN_SECONDARY}>
              <RefreshCw aria-hidden className="size-4" />
              Try again
            </button>
            <button type="button" onClick={onExport} className={BTN_SECONDARY}>
              <Download aria-hidden className="size-4" />
              Export
            </button>
          </div>
        </div>
      ) : null}

      {exportError ? (
        <div role="alert" className="mt-3 rounded-lg border-2 border-[#B42318] bg-[#FEF3F2] p-3">
          <p className="flex gap-2 text-[15px]">
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B42318]" />
            <span>{m.exportError}</span>
          </p>
          <button type="button" onClick={m.stale ? onGenerate : onExport} className={`${BTN_SECONDARY} mt-3 w-full`}>
            <RefreshCw aria-hidden className="size-4" />
            {m.stale ? "Generate again" : "Try again"}
          </button>
        </div>
      ) : null}
    </section>
  )
}

function RecentPanel({
  m,
  confirmId,
  dirty,
  onRequestLoad,
  onLoad,
  onCancelLoad,
}: {
  m: MuseStudio
  confirmId: string | null
  dirty: boolean
  onRequestLoad: (item: RecentCampaign) => void
  onLoad: (item: RecentCampaign) => void
  onCancelLoad: (item: RecentCampaign) => void
}) {
  return (
    <section aria-labelledby="uxr-recent-title" className="rounded-xl border border-[#D3DEDC] bg-white p-4">
      <h2 id="uxr-recent-title" className="text-[18px] font-bold">
        Recent campaigns
      </h2>
      <p className="mt-1 text-[14px] text-[#3D5553]">
        {dirty ? "You have unsaved edits. Loading will ask before replacing them." : "Load one to reuse its brief and settings."}
      </p>
      <ul className="mt-3 divide-y divide-[#D3DEDC]">
        {m.recent.map((item) => {
          const confirming = confirmId === item.id
          return (
            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold leading-snug [overflow-wrap:anywhere]">{item.title}</p>
                  <p className="text-[14px] text-[#3D5553]">
                    Route {item.variant}, {m.labelOf("channel", item.settings.channel)}, {item.when}
                    {item.saved ? <span className="font-bold text-[#067647]"> · Saved here</span> : null}
                  </p>
                </div>
                <button
                  id={`uxr-load-${item.id}`}
                  type="button"
                  onClick={() => onRequestLoad(item)}
                  aria-expanded={confirming}
                  aria-label={`Load ${item.title}`}
                  className={`${BTN_SECONDARY} min-h-[44px] shrink-0 px-3`}
                >
                  Load
                </button>
              </div>
              {confirming ? (
                <div
                  role="group"
                  aria-labelledby={`uxr-confirm-text-${item.id}`}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") onCancelLoad(item)
                  }}
                  className="mt-3 rounded-lg border-2 border-[#B54708] bg-[#FFFAEB] p-3"
                >
                  <p id={`uxr-confirm-text-${item.id}`} className="flex gap-2 text-[15px]">
                    <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-[#B54708]" />
                    <span>Replace your unsaved brief and settings with this campaign? This cannot be undone.</span>
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      id={`uxr-confirm-${item.id}`}
                      type="button"
                      onClick={() => onLoad(item)}
                      className={`${BTN_PRIMARY} min-h-[44px] px-3 text-[15px]`}
                    >
                      Replace and load
                    </button>
                    <button type="button" onClick={() => onCancelLoad(item)} className={`${BTN_SECONDARY} min-h-[44px] px-3 text-[15px]`}>
                      Keep editing
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ---------- phone action bar ---------- */

function MobileActionBar({
  m,
  lastAction,
  onGenerate,
  onSave,
  onExport,
}: {
  m: MuseStudio
  lastAction: ActionKind
  onGenerate: () => void
  onSave: () => void
  onExport: () => void
}) {
  const failed = m.generateStatus === "error" || m.saveStatus === "error" || m.exportStatus === "error"
  const line = m.busy
    ? `Generating: ${m.stageLabel}`
    : failed
      ? "Something needs attention. See the details below."
      : lastAction === "save" && m.saveStatus === "saved"
        ? `Saved route ${m.selected}`
        : lastAction === "export" && m.exportStatus === "exported"
          ? `Exported route ${m.selected}`
          : m.stale
            ? `Preview shows run ${m.output.run}: out of date`
            : `Run ${m.output.run}, route ${m.selected}, up to date`

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#D3DEDC] bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_-16px_rgba(14,27,26,0.35)] lg:hidden">
      <p aria-hidden className={`mb-2 truncate text-[14px] ${failed ? "font-bold text-[#B42318]" : "text-[#3D5553]"}`}>
        {line}
      </p>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
        <button type="button" onClick={onGenerate} disabled={m.busy} className={`${BTN_PRIMARY} min-w-0`}>
          {m.busy ? <LoaderCircle aria-hidden className="size-5 motion-safe:animate-spin" /> : <Sparkles aria-hidden className="size-5" />}
          {m.generateStatus === "error" && !m.issue ? "Try again" : "Generate"}
        </button>
        <button type="button" onClick={onSave} disabled={m.saveStatus === "saving"} className={`${BTN_SECONDARY} min-h-[52px] px-3`}>
          {m.saveStatus === "saving" ? <LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" /> : <Save aria-hidden className="size-4" />}
          Save
        </button>
        <button type="button" onClick={onExport} disabled={m.exportStatus === "exporting"} className={`${BTN_SECONDARY} min-h-[52px] px-3`}>
          {m.exportStatus === "exporting" ? (
            <LoaderCircle aria-hidden className="size-4 motion-safe:animate-spin" />
          ) : (
            <Download aria-hidden className="size-4" />
          )}
          Export
        </button>
      </div>
    </div>
  )
}

export type { VariantId }
