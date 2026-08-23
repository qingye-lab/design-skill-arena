"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Activity,
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; badge: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup, tuned for real rooms.", badge: "Flagship", reach: 845, ctr: 4.1, conversion: 2.9 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff without missing a beat.", badge: "Lifestyle", reach: 785, ctr: 4.6, conversion: 3.1 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon for privacy and speed.", badge: "Technical", reach: 920, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Card", "Banner", "Modal"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function ProductPolishChainShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch, configured as a SaaS-style campaign workspace with production-grade controls and tables.")
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
    { id: "seed", time: timestamp(), label: "Workspace initialized" },
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
    log(`Row selection changed to concept ${id}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Submitting generation job")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Generation job failed" : "Generation job completed")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-md border border-neutral-300 px-2.5 py-1 font-mono text-[11px] leading-tight text-neutral-500 break-words">frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400"><Settings2 className="size-3.5" /> Campaign Console</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Settings panel */}
          <section className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-sm font-semibold">Settings</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">v1.2</span>
            </div>
            <div>
              <label htmlFor="pp-brief" className="mb-1.5 block text-xs font-medium text-neutral-500">Campaign Brief</label>
              <textarea id="pp-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-24 w-full resize-y rounded-md border border-neutral-300 bg-white p-2.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200">
                {AUDIENCES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Channel</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200">
                {CHANNELS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-200">
                {TONES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <div className="mb-1.5 text-xs font-medium text-neutral-500">Visual Style</div>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStyle(opt)}
                    aria-pressed={style === opt}
                    className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                      style === opt ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Main content */}
          <div className="space-y-4">
            {/* Badge / concept table */}
            <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-100 px-4 py-3 text-sm font-semibold">Concepts</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 text-left text-xs text-neutral-400">
                    <th className="px-4 py-2 font-medium">Concept</th>
                    <th className="px-4 py-2 font-medium">Headline</th>
                    <th className="px-4 py-2 font-medium">Badge</th>
                    <th className="px-4 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                    <tr key={id} className={`border-b border-neutral-50 last:border-0 ${conceptId === id ? "bg-neutral-50" : ""}`}>
                      <td className="px-4 py-2.5 font-semibold">{id}</td>
                      <td className="px-4 py-2.5 text-neutral-600">{CONCEPTS[id].headline}</td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">{CONCEPTS[id].badge}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => selectConcept(id)}
                          aria-pressed={conceptId === id}
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                            conceptId === id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          {conceptId === id ? "Selected" : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Preview card */}
            <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">Preview · Concept {conceptId}</span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500">{audience} · {channel}</span>
              </div>
              <h2 className="mb-2 text-2xl font-bold">{concept.headline}</h2>
              <p className="mb-4 text-sm text-neutral-600">{concept.body}</p>

              {genState === "success" && (
                <div className="mb-3 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="size-4 shrink-0" /> Generation job completed successfully.</div>
              )}
              {genState === "error" && (
                <div className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"><CircleX className="size-4 shrink-0" /> Generation job failed. Retry from settings.</div>
              )}

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
                </button>
                <button type="button" onClick={() => { setSaveState("success"); log("Campaign saved to workspace"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
                </button>
                <button type="button" onClick={() => { setExportState("success"); log("Campaign bundle exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
                </button>
              </div>
            </section>

            {/* Metrics + activity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold">Predicted Metrics</div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between border-b border-neutral-50 py-1"><span className="text-neutral-500">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                  <div className="flex justify-between border-b border-neutral-50 py-1"><span className="text-neutral-500">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                  <div className="flex justify-between py-1"><span className="text-neutral-500">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
                </div>
              </section>
              <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Activity className="size-3.5 text-neutral-400" /> Recent Operations</div>
                <ul className="max-h-28 space-y-1.5 overflow-y-auto pr-1">
                  {activity.map((a) => (
                    <li key={a.id} className="flex justify-between rounded-md bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600">
                      <span>{a.label}</span><span className="text-neutral-400">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}