"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  CircleX,
  Download,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"
type FlowState = "idle" | "loading" | "success" | "error"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears the room, not just the mic.", body: "Far-field arrays tuned across a dozen home layouts.", reach: 830, ctr: 4.0, conversion: 2.8 },
  B: { headline: "Your day, scored without a beat missed.", body: "Seamless handoff as you move between rooms.", reach: 770, ctr: 4.5, conversion: 3.1 },
  C: { headline: "80ms local inference. Nothing leaves home.", body: "On-device AI silicon for speed and privacy at once.", reach: 910, ctr: 3.6, conversion: 2.4 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Clean Light", "Deep Contrast", "Warm Neutral", "Cool Slate"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function StandardImpeccableShowcase() {
  const [brief, setBrief] = useState("Launch campaign for the Aurora X1 smart speaker. Every micro-state must be explicit: loading, success, error, empty, disabled.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [genState, setGenState] = useState<FlowState>("idle")
  const [saveState, setSaveState] = useState<FlowState>("idle")
  const [exportState, setExportState] = useState<FlowState>("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]

  const metrics = useMemo(() => {
    const toneMul = tone === "Confident" ? 1.05 : tone === "Precise" ? 0.97 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.08 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  const flowState: FlowState = genState !== "idle" ? genState : saveState !== "idle" ? saveState : exportState !== "idle" ? exportState : "idle"

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Concept ${id} selected for the preview`)
  }

  function handleGenerate() {
    if (genState === "loading") return
    if (brief.trim().length < 10) {
      setGenState("error")
      log("Generate blocked — brief is too short")
      setTimeout(() => setGenState("idle"), 2400)
      return
    }
    setGenState("loading")
    log("Generate: requested")
    setTimeout(() => {
      const fail = Math.random() < 0.15
      setGenState(fail ? "error" : "success")
      log(fail ? "Generate: failed, model timeout" : "Generate: concepts refreshed")
      setTimeout(() => setGenState("idle"), 2400)
    }, 1200)
  }

  function handleSave() {
    setSaveState("loading")
    setTimeout(() => {
      setSaveState("success")
      log("Save: snapshot stored")
      setTimeout(() => setSaveState("idle"), 1800)
    }, 650)
  }

  function handleExport() {
    setExportState("loading")
    setTimeout(() => {
      setExportState("success")
      log("Export: bundle prepared for download")
      setTimeout(() => setExportState("idle"), 1800)
    }, 850)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className={`flex items-center gap-2 border-b px-4 py-2 text-xs font-medium transition-colors md:px-8 ${
        flowState === "loading" ? "border-amber-200 bg-amber-50 text-amber-700" :
        flowState === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
        flowState === "error" ? "border-red-200 bg-red-50 text-red-700" :
        "border-slate-200 bg-white text-slate-400"
      }`}>
        {flowState === "loading" && <Loader2 className="size-3.5 animate-spin" />}
        {flowState === "success" && <CheckCircle2 className="size-3.5" />}
        {flowState === "error" && <CircleX className="size-3.5" />}
        {flowState === "idle" && <CircleDashed className="size-3.5" />}
        <span>Flow status: {flowState === "idle" ? "waiting for action" : flowState}</span>
      </div>

      <header className="border-b border-slate-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-3 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-full border border-slate-300 px-3 py-1 font-mono text-[11px] text-slate-600">frontend-app-builder + impeccable</span>
          </div>
          <span className="text-xs text-slate-400">Muse — AI Campaign Studio</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="si-brief" className="mb-2 block text-sm font-semibold">Campaign Brief</label>
              <textarea
                id="si-brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-colors focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>{brief.trim().length < 10 ? "Needs at least 10 characters" : "Ready"}</span>
                <span>{brief.length} chars</span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 text-sm font-semibold">Controls</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatusChipGroup label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
                <StatusChipGroup label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
                <StatusChipGroup label="Tone" options={TONES} value={tone} onChange={setTone} />
                <StatusChipGroup label="Visual Style" options={STYLES} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-2">
                {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectConcept(id)}
                    aria-pressed={conceptId === id}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-slate-200 ${
                      conceptId === id ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    Concept {id}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <StateButton icon={genState === "loading" ? Loader2 : Sparkles} label="Generate" state={genState} solid onClick={handleGenerate} />
                <StateButton icon={saveState === "loading" ? Loader2 : Save} label="Save" state={saveState} onClick={handleSave} />
                <StateButton icon={exportState === "loading" ? Loader2 : Download} label="Export" state={exportState} onClick={handleExport} />
              </div>
            </section>

            {genState === "error" && brief.trim().length < 10 && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
                <AlertTriangle className="size-4" /> Brief is too short. Add more detail before generating.
              </div>
            )}

            <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-sm transition-all md:p-10">
              <div className="flex items-center justify-between">
                <span className="w-fit rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold backdrop-blur">{channel} · {tone}</span>
                <ConceptBadge state={genState} />
              </div>
              <div className="max-w-2xl py-6">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">For {audience} · Concept {conceptId}</div>
                <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                <p className="max-w-lg text-sm text-white/70">{concept.body}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 text-sm font-semibold">Predicted Metrics</div>
              <div className="space-y-2.5">
                <MetricRow label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
                <MetricRow label="CTR" value={`${metrics.ctr}%`} />
                <MetricRow label="Conversion" value={`${metrics.conversion}%`} />
              </div>
            </section>
            <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Activity className="size-4 text-slate-400" /> Recent Operations</div>
              {activity.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-xs text-slate-400">
                  <CircleDashed className="size-5" />
                  No operations yet. Generate, save, or export to see a log.
                </div>
              ) : (
                <ul className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100">
                      <span className="flex-1 text-slate-700">{a.label}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{a.time}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function ConceptBadge({ state }: { state: FlowState }) {
  if (state === "loading") return <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-medium text-amber-200"><Loader2 className="size-3 animate-spin" /> generating</span>
  if (state === "success") return <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-200"><CheckCircle2 className="size-3" /> refreshed</span>
  if (state === "error") return <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-[11px] font-medium text-red-200"><CircleX className="size-3" /> failed</span>
  return <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/50"><CircleDashed className="size-3" /> idle</span>
}

function StatusChipGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
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
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base font-bold text-slate-900">{value}</span>
    </div>
  )
}

function StateButton({ icon: Icon, label, state, onClick, solid = false }: { icon: typeof Sparkles; label: string; state: FlowState; onClick: () => void; solid?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "loading"}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-slate-200 disabled:opacity-60 ${
        solid ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" : "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-400"
      }`}
    >
      <Icon className={`size-4 ${state === "success" ? "text-emerald-500" : state === "error" ? "text-red-500" : ""} ${state === "loading" ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
