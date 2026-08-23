"use client"

import { useCallback, useMemo, useState } from "react"
import {
  AlignLeft,
  CheckCircle2,
  CircleX,
  Contrast,
  Download,
  Eye,
  Loader2,
  Ruler,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number; contrastScore: number; hierarchyScore: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup tuned for real homes, not demo booths.", reach: 845, ctr: 4.1, conversion: 2.9, contrastScore: 92, hierarchyScore: 88 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff, without missing a beat.", reach: 785, ctr: 4.6, conversion: 3.1, contrastScore: 87, hierarchyScore: 94 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon means privacy and speed at once.", reach: 920, ctr: 3.6, conversion: 2.5, contrastScore: 95, hierarchyScore: 82 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["8pt Grid", "Baseline Rhythm", "Modular Scale", "Optical Balance"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function UxProReferenceShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch. Reference-grade UX: strict spacing scale, contrast checks, and hierarchy scoring on every concept.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [showGrid, setShowGrid] = useState(false)
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Accessibility and spacing audit ready" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]

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
    log(`Concept ${id} selected — hierarchy score ${CONCEPTS[id].hierarchyScore}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Re-scoring concepts against spacing and contrast rules")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.1
      setGenState(fail ? "error" : "success")
      log(fail ? "Audit failed — insufficient contrast on primary CTA" : "All concepts pass contrast and spacing audit")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-sm border border-neutral-300 px-2.5 py-1 font-mono text-[11px] text-neutral-600">ui-ux-pro-max</span>
          </div>
          <button type="button" onClick={() => setShowGrid((v) => !v)} aria-pressed={showGrid} className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 ${showGrid ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"}`}>
            <Ruler className="size-3.5" /> Grid Overlay
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div>
              <label htmlFor="ux-brief" className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500"><AlignLeft className="size-3.5" /> Campaign Brief</label>
              <textarea id="ux-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-24 w-full resize-y rounded-sm border border-neutral-300 p-3 text-sm leading-relaxed outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200" />
            </div>

            <div className="flex flex-wrap gap-8 border-y border-neutral-200 py-4">
              <Scale label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
              <Scale label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
              <Scale label="Tone" options={TONES} value={tone} onChange={setTone} />
              <Scale label="Grid System" options={STYLES} value={style} onChange={setStyle} />
            </div>

            <div className="flex gap-2">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  aria-pressed={conceptId === id}
                  className={`flex-1 rounded-sm border p-3 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                    conceptId === id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:border-neutral-500"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold">Concept {id}</span>
                    <span className={`flex items-center gap-1 text-[11px] ${conceptId === id ? "text-white/70" : "text-neutral-400"}`}>
                      <Contrast className="size-3" /> {CONCEPTS[id].contrastScore}
                    </span>
                  </div>
                  <div className={`text-[11px] ${conceptId === id ? "text-white/60" : "text-neutral-400"}`}>Hierarchy score {CONCEPTS[id].hierarchyScore}</div>
                </button>
              ))}
            </div>

            <div className={`relative overflow-hidden rounded-sm border border-neutral-200 p-8 md:p-14 ${showGrid ? "bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:8px_100%]" : ""}`}>
              <span className="mb-3 inline-block rounded-sm bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600">
                {audience} · {channel} · {style}
              </span>
              <h2 className={`mb-3 leading-tight ${style === "Modular Scale" ? "text-5xl font-black" : style === "Baseline Rhythm" ? "text-4xl font-semibold" : "text-3xl font-bold"} md:text-5xl`}>
                {concept.headline}
              </h2>
              <p className="max-w-xl text-base text-neutral-600">{concept.body}</p>
              <button className="mt-6 flex items-center gap-2 rounded-sm bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400">
                <Eye className="size-4" /> Preview full page
              </button>
            </div>

            {genState === "success" && (
              <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <CheckCircle2 className="size-4" /> Audit passed: contrast and spacing within reference tolerances.
              </div>
            )}
            {genState === "error" && (
              <div className="flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                <CircleX className="size-4" /> Audit flagged an issue. Review CTA contrast.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-sm bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-neutral-400">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Reference snapshot saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-sm border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Reference spec exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-sm border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-sm border border-neutral-200 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Predicted Metrics</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-neutral-500">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
              </div>
            </section>
            <section className="rounded-sm border border-neutral-200 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Audit Log</div>
              <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="rounded-sm bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600">
                    <span className="mr-1.5 text-neutral-400">{a.time}</span>{a.label}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
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