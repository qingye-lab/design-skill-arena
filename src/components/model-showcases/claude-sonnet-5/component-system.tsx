"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Blocks,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Download,
  Loader2,
  Save,
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
const DENSITIES = ["Comfortable", "Compact", "Spacious"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function ComponentSystemShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch, assembled entirely from a shared component library: Select, Card, Badge, Button, Table.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [density, setDensity] = useState(DENSITIES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Component tree mounted" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]
  const pad = density === "Compact" ? "p-2.5" : density === "Spacious" ? "p-6" : "p-4"

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
    log(`Card selection changed to concept ${id}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Re-rendering component tree with updated props")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Render failed — prop type mismatch on Card" : "Component tree re-rendered")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-md border border-slate-300 px-2.5 py-1 font-mono text-[11px] text-slate-600">shadcn-best-practices / shadcn</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400"><Blocks className="size-3.5" /> Component System</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4">
          <Select label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
          <Select label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
          <Select label="Tone" options={TONES} value={tone} onChange={setTone} />
          <Select label="Density" options={DENSITIES} value={density} onChange={setDensity} />
        </div>

        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
          <label htmlFor="cs-brief" className="mb-1.5 block text-xs font-semibold text-slate-500">Brief</label>
          <textarea id="cs-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-20 w-full resize-y rounded-md border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectConcept(id)}
              aria-pressed={conceptId === id}
              className={`group rounded-xl border ${pad} text-left shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-slate-400 ${
                conceptId === id ? "border-slate-900 ring-2 ring-slate-900" : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md"
              }`}
            >
              <span className="mb-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 group-aria-[pressed=true]:bg-slate-900 group-aria-[pressed=true]:text-white">
                {CONCEPTS[id].badge}
              </span>
              <h3 className="mb-1 text-lg font-bold">{CONCEPTS[id].headline}</h3>
              <p className="text-sm text-slate-500">{CONCEPTS[id].body}</p>
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border border-slate-200 bg-white ${pad} shadow-sm`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold">Preview · Concept {conceptId}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500">{audience} · {channel}</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold">{concept.headline}</h2>
          <p className="mb-4 text-sm text-slate-600">{concept.body}</p>

          {genState === "success" && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="size-4" /> Component tree updated.</div>
          )}
          {genState === "error" && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"><CircleX className="size-4" /> Render failed. Retry generation.</div>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-slate-400">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
            </button>
            <button type="button" onClick={() => { setSaveState("success"); log("Layout saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400">
              {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
            </button>
            <button type="button" onClick={() => { setExportState("success"); log("Component bundle exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400">
              {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 text-sm font-semibold">Metrics Table</div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-500">Reach</td><td className="py-1.5 text-right font-bold">{metrics.reach.toLocaleString()}K</td></tr>
                <tr className="border-b border-slate-100"><td className="py-1.5 text-slate-500">CTR</td><td className="py-1.5 text-right font-bold">{metrics.ctr}%</td></tr>
                <tr><td className="py-1.5 text-slate-500">Conversion</td><td className="py-1.5 text-right font-bold">{metrics.conversion}%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 text-sm font-semibold">Activity</div>
            <ul className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
              {activity.map((a) => (
                <li key={a.id} className="flex justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600">
                  <span>{a.label}</span><span className="text-slate-400">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

function Select({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-slate-500">{label}</div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-slate-200 bg-white px-2.5 py-1.5 pr-7 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  )
}
