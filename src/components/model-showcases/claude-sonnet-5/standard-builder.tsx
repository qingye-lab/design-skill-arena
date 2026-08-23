"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

type Concept = {
  id: ConceptId
  name: string
  headline: string
  reach: number
  ctr: number
  conversion: number
}

const CONCEPTS: Concept[] = [
  { id: "A", name: "Precision Story", headline: "Every whisper, heard from across the room", reach: 810, ctr: 4.0, conversion: 2.7 },
  { id: "B", name: "Everyday Scene", headline: "Your evening, scored by sound that follows you", reach: 760, ctr: 4.5, conversion: 3.0 },
  { id: "C", name: "Tech Manifesto", headline: "Silence is the loudest proof of intelligence", reach: 905, ctr: 3.7, conversion: 2.4 },
]

const AUDIENCES = ["Early Adopters", "Urban Professionals", "Households", "Enterprise Buyers"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Pop-up Retail"]
const TONES = ["Confident", "Warm", "Restrained", "Energetic"]
const STYLES = ["Cool Blue", "Forest Green", "Midnight", "Sunrise"]

function nowStamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function StandardBuilderShowcase() {
  const [brief, setBrief] = useState(
    "Launch campaign for the Aurora X1 smart speaker, spotlighting far-field voice pickup and offline on-device AI for tech-forward lifestyle audiences."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: nowStamp(), label: "Workbench initialized with default brief" },
  ])

  const concept = useMemo(() => CONCEPTS.find((c) => c.id === conceptId) ?? CONCEPTS[0], [conceptId])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: nowStamp(), label }, ...prev].slice(0, 12))
  }, [])

  const metrics = useMemo(() => {
    const toneMul = tone === "Energetic" ? 1.06 : tone === "Warm" ? 1.02 : 1
    const channelMul = channel === "Landing Page" ? 1.05 : channel === "Paid Social" ? 0.96 : 1
    return {
      reach: Math.round(concept.reach * channelMul),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Switched creative concept to ${id} · ${CONCEPTS.find((c) => c.id === id)?.name}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    setGenState("idle")
    log("Generate: started")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Generate: failed, brief needs more detail" : "Generate: completed, concepts refreshed")
      setTimeout(() => setGenState("idle"), 2600)
    }, 1100)
  }

  function handleSave() {
    setSaveState("success")
    log("Save: campaign snapshot stored")
    setTimeout(() => setSaveState("idle"), 2000)
  }

  function handleExport() {
    setExportState("success")
    log("Export: asset bundle prepared")
    setTimeout(() => setExportState("idle"), 2000)
  }

  const theme = useMemo(() => {
    switch (style) {
      case "Forest Green":
        return { bg: "from-emerald-50 to-teal-100 text-emerald-950", btn: "bg-emerald-600 hover:bg-emerald-700" }
      case "Midnight":
        return { bg: "from-slate-900 to-slate-800 text-slate-100", btn: "bg-white text-slate-900 hover:bg-slate-100" }
      case "Sunrise":
        return { bg: "from-orange-50 to-amber-100 text-orange-950", btn: "bg-orange-600 hover:bg-orange-700" }
      default:
        return { bg: "from-blue-50 to-slate-100 text-blue-950", btn: "bg-blue-600 hover:bg-blue-700" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-900 md:p-5">
      <div className="mx-auto grid max-w-[1440px] gap-3 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-3">
          <TagHeader />
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="size-4 text-slate-400" /> Campaign Controls
            </div>
            <div className="space-y-4">
              <ChipGroup label="Target Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
              <ChipGroup label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
              <ChipGroup label="Tone" options={TONES} value={tone} onChange={setTone} />
              <ChipGroup label="Visual Style" options={STYLES} value={style} onChange={setStyle} />
            </div>
          </section>
          <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <label htmlFor="brief" className="mb-2 block text-sm font-semibold">Campaign Brief</label>
            <textarea
              id="brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/20"
            />
            <div className="mt-1 text-right text-xs text-slate-400">{brief.length} chars</div>
          </section>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectConcept(c.id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 ${
                    conceptId === c.id ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full border border-current text-[11px]">{c.id}</span>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <ActionBtn icon={busy ? Loader2 : Sparkles} label="Generate" spin={busy} solid disabled={busy} onClick={handleGenerate} />
              <ActionBtn icon={saveState === "success" ? CheckCircle2 : Save} label="Save" success={saveState === "success"} onClick={handleSave} />
              <ActionBtn icon={exportState === "success" ? CheckCircle2 : Download} label="Export" success={exportState === "success"} onClick={handleExport} />
            </div>
          </div>

          {genState === "success" && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="size-4" /> Concepts refreshed for the current brief.
            </div>
          )}
          {genState === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              <CircleX className="size-4" /> Generation failed: add more detail to the brief and retry.
            </div>
          )}

          <div className={`relative flex min-h-[400px] flex-1 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-sm transition-colors duration-500 md:p-10 ${theme.bg}`}>
            <span className="w-fit rounded-md bg-white/70 px-2.5 py-1 text-xs font-semibold backdrop-blur">{channel} · {tone}</span>
            <div className="max-w-2xl py-6">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">For {audience} · Concept {conceptId}</div>
              <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
              <button className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/60 ${theme.btn}`}>
                View details <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><BarChart3 className="size-4 text-slate-400" /> Predicted Metrics</div>
            <div className="space-y-2.5">
              <MetricRow label="Reach" value={metrics.reach.toLocaleString()} unit="K impressions" />
              <MetricRow label="CTR" value={metrics.ctr.toFixed(1)} unit="%" />
              <MetricRow label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" />
            </div>
          </section>
          <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Activity className="size-4 text-slate-400" /> Recent Activity</div>
            <ul className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:bg-blue-50">
                  <Activity className="mt-0.5 size-3.5 shrink-0 text-slate-300" />
                  <span className="flex-1 text-slate-700">{a.label}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">{a.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

function TagHeader() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600">frontend-app-builder</span>
      </div>
      <h1 className="mt-3 text-base font-bold">Standard Builder · Campaign Workbench</h1>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        A linear workbench: controls on the left drive the brief, the center holds preview and concepts, metrics and activity sit on the right.
      </p>
    </div>
  )
}

function ChipGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
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
            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 ${
              value === opt ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MetricRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base font-bold text-slate-900">{value}<span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span></span>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, disabled, solid = false, success = false, spin = false }: { icon: typeof Sparkles; label: string; onClick: () => void; disabled?: boolean; solid?: boolean; success?: boolean; spin?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 disabled:opacity-60 ${
        solid ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" : "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className={`size-4 ${success ? "text-emerald-600" : ""} ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
