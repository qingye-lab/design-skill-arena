"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Contrast,
  Download,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"
type ViewState = "idle" | "loading" | "success" | "error"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup, tuned for real rooms.", reach: 845, ctr: 4.1, conversion: 2.9 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff without missing a beat.", reach: 785, ctr: 4.6, conversion: 3.1 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon for privacy and speed.", reach: 920, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const VISUAL_STYLES = ["Grid Strict", "Grid Loose", "Asymmetric"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function MaxQualityChainShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch: strict grid rhythm, typographic hierarchy, and full state coverage across every control.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId | null>("A")
  const [genState, setGenState] = useState<ViewState>("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [controlsDisabled, setControlsDisabled] = useState(false)
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Grid system initialized" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = conceptId ? CONCEPTS[conceptId] : null

  const metrics = useMemo(() => {
    if (!concept) return { reach: 0, ctr: 0, conversion: 0 }
    const toneMul = tone === "Confident" ? 1.05 : tone === "Precise" ? 0.98 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.08 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Grid cell activated: concept ${id}`)
  }

  function handleGenerate() {
    if (genState === "loading") return
    setGenState("loading")
    log("Recomputing layout against grid constraints")
    setTimeout(() => {
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Layout failed contrast validation" : "Layout passed validation")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1200)
  }

  function clearConcept() {
    setConceptId(null)
    log("Concept selection cleared")
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b-2 border-neutral-900 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-sm border border-neutral-300 px-2.5 py-1 font-mono text-[11px] leading-tight text-neutral-500 break-words">frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable</span>
          </div>
          <button
            type="button"
            onClick={() => setControlsDisabled((d) => !d)}
            aria-pressed={controlsDisabled}
            className="flex items-center gap-1.5 rounded-sm border border-neutral-300 px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <Contrast className="size-3.5" /> {controlsDisabled ? "Enable Controls" : "Disable Controls"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {/* Typographic hierarchy header */}
        <div className="mb-6 border-b border-neutral-200 pb-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Muse / Campaign Studio</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Aurora X1 Launch Grid</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Brief + controls, strict grid col span */}
          <section className="space-y-5 md:col-span-4">
            <div>
              <label htmlFor="mq-brief" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">Campaign Brief</label>
              <textarea
                id="mq-brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                disabled={controlsDisabled}
                className="min-h-24 w-full resize-y rounded-sm border border-neutral-300 p-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>

            <GridField label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} disabled={controlsDisabled} />
            <GridField label="Channel" options={CHANNELS} value={channel} onChange={setChannel} disabled={controlsDisabled} />
            <GridField label="Tone" options={TONES} value={tone} onChange={setTone} disabled={controlsDisabled} />

            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Visual Style</div>
              <div className="grid grid-cols-3 gap-1.5">
                {VISUAL_STYLES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    disabled={controlsDisabled}
                    onClick={() => setVisualStyle(opt)}
                    aria-pressed={visualStyle === opt}
                    className={`rounded-sm border px-2 py-1.5 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 ${
                      visualStyle === opt ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                <Contrast className="size-3.5" /> Contrast Check
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white"><CheckCircle2 className="size-3" /></span>
                Text passes AA contrast on white background
              </div>
            </div>
          </section>

          {/* Concept grid, strict 3-col */}
          <section className="md:col-span-8">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Concepts</div>
              {conceptId && (
                <button type="button" onClick={clearConcept} className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  <RotateCcw className="size-3" /> Clear selection
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  aria-pressed={conceptId === id}
                  className={`rounded-sm border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                    conceptId === id ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Concept {id}</span>
                  <h3 className="mt-1 text-sm font-bold leading-snug">{CONCEPTS[id].headline}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{CONCEPTS[id].body}</p>
                </button>
              ))}
            </div>

            {/* Hero preview with full state coverage */}
            <div className="mt-4 rounded-sm border border-neutral-200 p-6">
              {genState === "loading" && (
                <div className="flex items-center gap-2 text-sm text-neutral-500"><Loader2 className="size-4 animate-spin" /> Validating layout against grid constraints…</div>
              )}
              {genState === "idle" && concept && (
                <>
                  <span className="mb-2 inline-block rounded-sm bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{audience} · {channel}</span>
                  <h2 className="mb-2 text-2xl font-bold leading-tight md:text-3xl">{concept.headline}</h2>
                  <p className="max-w-xl text-sm text-neutral-600">{concept.body}</p>
                </>
              )}
              {genState === "idle" && !concept && (
                <div className="py-6 text-center text-sm text-neutral-400">No concept selected. Choose a concept above to populate the preview.</div>
              )}
              {genState === "success" && (
                <div className="flex items-center gap-2 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="size-4 shrink-0" /> Layout passed contrast and spacing validation.</div>
              )}
              {genState === "error" && (
                <div className="flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"><CircleX className="size-4 shrink-0" /> Layout failed validation. Adjust spacing tokens.</div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={genState === "loading" || !concept} className="flex items-center gap-1.5 rounded-sm bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                {genState === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Layout saved to grid library"); setTimeout(() => setSaveState("idle"), 2000) }} disabled={!concept} className="flex items-center gap-1.5 rounded-sm border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Grid spec exported"); setTimeout(() => setExportState("idle"), 2000) }} disabled={!concept} className="flex items-center gap-1.5 rounded-sm border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-neutral-200 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Predicted Metrics</div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between border-b border-neutral-100 py-1"><span className="text-neutral-500">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                  <div className="flex justify-between border-b border-neutral-100 py-1"><span className="text-neutral-500">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                  <div className="flex justify-between py-1"><span className="text-neutral-500">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
                </div>
              </div>
              <div className="rounded-sm border border-neutral-200 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Recent Operations</div>
                <ul className="max-h-28 space-y-1.5 overflow-y-auto pr-1">
                  {activity.map((a) => (
                    <li key={a.id} className="flex justify-between rounded-sm bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600">
                      <span>{a.label}</span><span className="text-neutral-400">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function GridField({ label, options, value, onChange, disabled }: { label: string; options: string[]; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</div>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-neutral-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
