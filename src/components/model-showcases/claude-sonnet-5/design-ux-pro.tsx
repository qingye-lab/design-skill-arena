"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  ChevronRight,
  CircleX,
  Contrast,
  Download,
  Grid3x3,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number; contrast: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup tuned for real homes.", reach: 845, ctr: 4.1, conversion: 2.9, contrast: 9.2 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff, without missing a beat.", reach: 785, ctr: 4.6, conversion: 3.1, contrast: 6.4 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon means privacy and speed at once.", reach: 920, ctr: 3.6, conversion: 2.5, contrast: 11.8 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Cool Blue", "Forest Green", "Midnight", "Sunrise"]

const OUTLINE = [
  { id: "brief", label: "Campaign Brief" },
  { id: "controls", label: "Controls" },
  { id: "concepts", label: "Creative Concepts" },
  { id: "metrics", label: "Predicted Metrics" },
  { id: "log", label: "Recent Operations" },
]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function contrastLabel(ratio: number) {
  if (ratio >= 7) return { text: "AAA pass", tone: "text-emerald-600" }
  if (ratio >= 4.5) return { text: "AA pass", tone: "text-amber-600" }
  return { text: "Fails AA", tone: "text-red-600" }
}

export default function DesignUxProShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch. Structure first: strict IA outline, 8pt spacing grid, and computed contrast per concept.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [showGrid, setShowGrid] = useState(false)
  const [activeSection, setActiveSection] = useState("brief")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Structure outline ready" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]
  const contrast = contrastLabel(concept.contrast)

  const metrics = useMemo(() => {
    const toneMul = tone === "Confident" ? 1.05 : tone === "Precise" ? 0.98 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.08 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Concept ${id} selected — contrast ratio ${CONCEPTS[id].contrast.toFixed(1)}:1`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Re-scoring concepts against spacing and contrast rules")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.1
      setGenState(fail ? "error" : "success")
      log(fail ? "Generate failed — audit incomplete" : "Concepts refreshed, audit passed")
      setTimeout(() => setGenState("idle"), 2400)
    }, 1100)
  }

  function handleSave() {
    setSaveState("success")
    log("Structure snapshot saved")
    setTimeout(() => setSaveState("idle"), 1800)
  }

  function handleExport() {
    setExportState("success")
    log("Export bundle prepared")
    setTimeout(() => setExportState("idle"), 1800)
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-neutral-900 px-3 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-sm border border-neutral-300 px-3 py-1 font-mono text-[11px] text-neutral-500">frontend-design + ui-ux-pro-max</span>
          </div>
          <button
            type="button"
            onClick={() => setShowGrid((g) => !g)}
            aria-pressed={showGrid}
            className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              showGrid ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
            }`}
          >
            <Grid3x3 className="size-3.5" /> {showGrid ? "Grid on" : "Grid off"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="rounded-sm border border-neutral-200 bg-white p-3">
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">Document Outline</div>
            <ul className="space-y-0.5">
              {OUTLINE.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                      activeSection === s.id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <ChevronRight className="size-3.5 shrink-0" /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`flex flex-col gap-4 rounded-sm ${showGrid ? "bg-[linear-gradient(to_bottom,transparent_7px,rgba(0,0,0,0.06)_8px),linear-gradient(to_right,transparent_7px,rgba(0,0,0,0.06)_8px)] bg-[size:8px_8px]" : ""}`}>
            <section id="brief" className="rounded-sm border border-neutral-200 bg-white p-4">
              <label htmlFor="dux-brief" className="mb-2 block text-sm font-semibold">Campaign Brief</label>
              <textarea
                id="dux-brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="min-h-24 w-full resize-y rounded-sm border border-neutral-200 bg-neutral-50 p-3 text-sm leading-relaxed outline-none focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-400"
              />
            </section>

            <section id="controls" className="rounded-sm border border-neutral-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold">Controls</div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Scale label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
                <Scale label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
                <Scale label="Tone" options={TONES} value={tone} onChange={setTone} />
                <Scale label="Style" options={STYLES} value={style} onChange={setStyle} />
              </div>
            </section>

            <section id="concepts" className="rounded-sm border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectConcept(id)}
                      aria-pressed={conceptId === id}
                      className={`rounded-sm border px-3 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                        conceptId === id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600 hover:border-neutral-500"
                      }`}
                    >
                      Concept {id}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <PBtn icon={busy ? Loader2 : Sparkles} label="Generate" spin={busy} solid onClick={handleGenerate} />
                  <PBtn icon={saveState === "success" ? CheckCircle2 : Save} label="Save" success={saveState === "success"} onClick={handleSave} />
                  <PBtn icon={exportState === "success" ? CheckCircle2 : Download} label="Export" success={exportState === "success"} onClick={handleExport} />
                </div>
              </div>

              {genState === "error" && (
                <div className="mb-3 flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  <CircleX className="size-4" /> Audit incomplete — retry generation.
                </div>
              )}

              <div className="rounded-sm bg-neutral-900 p-6 text-white md:p-10">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">For {audience} · {channel}</span>
                  <span className={`flex items-center gap-1 rounded-sm bg-white/10 px-2 py-1 text-[11px] font-medium ${contrast.tone}`}>
                    <Contrast className="size-3" /> {concept.contrast.toFixed(1)}:1 · {contrast.text}
                  </span>
                </div>
                <h2 className="mb-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                <p className="max-w-lg text-sm text-white/70">{concept.body}</p>
              </div>
            </section>

            <section id="metrics" className="rounded-sm border border-neutral-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold">Predicted Metrics</div>
              <div className="grid gap-2.5 sm:grid-cols-3">
                <MetricRow label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
                <MetricRow label="CTR" value={`${metrics.ctr}%`} />
                <MetricRow label="Conversion" value={`${metrics.conversion}%`} />
              </div>
            </section>

            <section id="log" className="rounded-sm border border-neutral-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold">Recent Operations</div>
              <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="rounded-sm bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100">
                    <span className="mr-1.5 text-neutral-400">{a.time}</span>{a.label}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function Scale({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-sm border px-2 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              value === opt ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-600 hover:border-neutral-500"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-neutral-100 bg-neutral-50 px-3 py-2">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-base font-bold text-neutral-900">{value}</span>
    </div>
  )
}

function PBtn({ icon: Icon, label, onClick, solid = false, success = false, spin = false }: { icon: typeof Sparkles; label: string; onClick: () => void; solid?: boolean; success?: boolean; spin?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
        solid ? "bg-neutral-900 text-white hover:bg-neutral-800" : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
      }`}
    >
      <Icon className={`size-4 ${success ? "text-emerald-600" : ""} ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
