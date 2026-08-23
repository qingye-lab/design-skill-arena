"use client"

import { useCallback, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Gauge,
  Loader2,
  Save,
  Sparkles,
  TrendingUp,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { label: string; headline: string; body: string; accent: string; reach: number; ctr: number; conversion: number }> = {
  A: { label: "Capability First", headline: "Every word, captured the first time.", body: "Far-field arrays tuned across 12 room profiles.", accent: "bg-sky-500", reach: 850, ctr: 4.1, conversion: 2.9 },
  B: { label: "Life First", headline: "Sound that keeps pace with your day.", body: "Seamless handoff across every room you walk into.", accent: "bg-violet-500", reach: 780, ctr: 4.6, conversion: 3.2 },
  C: { label: "Spec First", headline: "80ms local inference. Zero cloud lag.", body: "On-device AI silicon built for privacy and speed.", accent: "bg-slate-700", reach: 915, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Clean Light", "Deep Contrast", "Warm Neutral", "Cool Slate"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function ImpeccableFullFlowShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch. Full flow from brief to export, with every state polished: loading, success, error, empty, hover, focus.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "loading" | "success">("idle")
  const [briefTouched, setBriefTouched] = useState(false)
  const [activity, setActivity] = useState<{ id: string; time: string; label: string; kind: "info" | "success" | "error" }[]>([
    { id: "seed", time: timestamp(), label: "Flow initialized — all systems nominal", kind: "info" },
  ])

  const log = useCallback((label: string, kind: "info" | "success" | "error" = "info") => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label, kind }, ...prev].slice(0, 14))
  }, [])

  const concept = CONCEPTS[conceptId]

  const metrics = useMemo(() => {
    const toneMul = tone === "Confident" ? 1.06 : tone === "Precise" ? 0.98 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.1 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Concept ${id} selected — ${CONCEPTS[id].label}`)
  }

  function handleGenerate() {
    if (busy) return
    if (brief.trim().length < 10) {
      setGenState("error")
      log("Generate blocked: brief is too short", "error")
      setTimeout(() => setGenState("idle"), 2600)
      return
    }
    setBusy(true)
    setGenState("loading")
    log("Generating updated concepts…")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.15
      setGenState(fail ? "error" : "success")
      log(fail ? "Generation failed — model timeout, please retry" : "All three concepts refreshed successfully", fail ? "error" : "success")
      setTimeout(() => setGenState("idle"), 2800)
    }, 1300)
  }

  function handleSave() {
    setSaveState("loading")
    setTimeout(() => {
      setSaveState("success")
      log("Campaign snapshot saved", "success")
      setTimeout(() => setSaveState("idle"), 2000)
    }, 700)
  }

  function handleExport() {
    setExportState("loading")
    setTimeout(() => {
      setExportState("success")
      log("Export bundle ready for download", "success")
      setTimeout(() => setExportState("idle"), 2000)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-full border border-slate-300 px-3 py-1 font-mono text-[11px] text-slate-600">impeccable</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-400"><Gauge className="size-3.5" /> Impeccable Full Flow</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="if-brief" className="mb-2 block text-sm font-semibold">Campaign Brief</label>
              <textarea
                id="if-brief"
                value={brief}
                onChange={(e) => { setBrief(e.target.value); setBriefTouched(true) }}
                onBlur={() => setBriefTouched(true)}
                className={`min-h-32 w-full resize-y rounded-xl border p-3 text-sm leading-relaxed outline-none transition-colors focus:ring-4 ${
                  briefTouched && brief.trim().length < 10 ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100" : "border-slate-200 bg-slate-50 focus:border-slate-900 focus:bg-white focus:ring-slate-100"
                }`}
              />
              {briefTouched && brief.trim().length < 10 && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertTriangle className="size-3.5" /> Brief needs more detail before generating.</p>
              )}
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 text-sm font-semibold">Controls</div>
              <div className="space-y-4">
                <ControlBlock label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
                <ControlBlock label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
                <ControlBlock label="Tone" options={TONES} value={tone} onChange={setTone} />
                <ControlBlock label="Style" options={STYLES} value={style} onChange={setStyle} />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-slate-200 ${
                    conceptId === id ? "border-slate-900 bg-slate-900 text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:shadow-sm"
                  }`}
                >
                  <span className={`size-2 rounded-full ${conceptId === id ? "bg-white" : CONCEPTS[id].accent}`} />
                  {CONCEPTS[id].label}
                </button>
              ))}
            </div>

            <div className={`relative flex min-h-[380px] flex-1 flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-500 md:p-10 ${
              style === "Deep Contrast" ? "bg-slate-900 text-white" : style === "Warm Neutral" ? "bg-amber-50 text-amber-950" : style === "Cool Slate" ? "bg-slate-100 text-slate-900" : "bg-white text-slate-900 border border-slate-200"
            }`}>
              <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${concept.accent} text-white`}>{channel} · {audience}</span>
              <div className="py-6">
                <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                <p className="max-w-lg text-sm opacity-70 md:text-base">{concept.body}</p>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-60"><TrendingUp className="size-3.5" /> Tone: {tone}</div>
            </div>

            {genState === "loading" && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Loader2 className="size-4 animate-spin" /> Generating concepts…
              </div>
            )}
            {genState === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="size-4" /> Generation complete. All concepts refreshed.
              </div>
            )}
            {genState === "error" && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <AlertTriangle className="size-4" /> {brief.trim().length < 10 ? "Add more detail to the brief first." : "Generation failed. Please retry."}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <FlowButton icon={busy ? Loader2 : Sparkles} label="Generate" spin={busy} solid onClick={handleGenerate} />
              <FlowButton icon={saveState === "loading" ? Loader2 : saveState === "success" ? CheckCircle2 : Save} label="Save" spin={saveState === "loading"} success={saveState === "success"} onClick={handleSave} />
              <FlowButton icon={exportState === "loading" ? Loader2 : exportState === "success" ? CheckCircle2 : Download} label="Export" spin={exportState === "loading"} success={exportState === "success"} onClick={handleExport} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 text-sm font-semibold">Predicted Metrics</div>
              <div className="space-y-2.5">
                <MetricRow label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
                <MetricRow label="CTR" value={`${metrics.ctr}%`} />
                <MetricRow label="Conversion" value={`${metrics.conversion}%`} />
              </div>
            </section>
            <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Clock className="size-4 text-slate-400" /> Activity Log</div>
              <ul className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                    a.kind === "success" ? "border-emerald-100 bg-emerald-50 text-emerald-800" : a.kind === "error" ? "border-red-100 bg-red-50 text-red-800" : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}>
                    <span className="flex-1">{a.label}</span>
                    <span className="shrink-0 text-[11px] opacity-60">{a.time}</span>
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

function ControlBlock({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-4 focus-visible:ring-slate-200 ${
              value === opt ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
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
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base font-bold text-slate-900">{value}</span>
    </div>
  )
}

function FlowButton({ icon: Icon, label, onClick, solid = false, success = false, spin = false }: { icon: typeof Sparkles; label: string; onClick: () => void; solid?: boolean; success?: boolean; spin?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-slate-200 ${
        solid ? "bg-slate-900 text-white shadow-md hover:bg-slate-800" : "border border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm"
      }`}
    >
      <Icon className={`size-4 ${success ? "text-emerald-600" : ""} ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
