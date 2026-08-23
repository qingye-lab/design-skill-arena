"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Download,
  Layers,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; tag: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup, tuned for real rooms.", tag: "Flagship", reach: 845, ctr: 4.1, conversion: 2.9 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff without missing a beat.", tag: "Lifestyle", reach: 785, ctr: 4.6, conversion: 3.1 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon for privacy and speed.", tag: "Technical", reach: 920, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Structured", "Editorial", "Minimal"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function BalancedChainShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch: a balanced workflow moving from structured brief, to curated concepts, to a polished final preview.")
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
    { id: "seed", time: timestamp(), label: "Workflow initialized" },
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
    log(`Concept ${id} moved into preview zone`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Structure zone locked, regenerating preview")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Preview generation failed" : "Preview zone refreshed")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-stone-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-md border border-stone-300 px-2.5 py-1 font-mono text-[11px] leading-tight text-stone-600 break-words">frontend-app-builder + taste-skill + impeccable</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400"><Layers className="size-3.5" /> Muse Studio</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Zone 1: Structure */}
          <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-4 md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">01 · Structure</div>
            <div>
              <label htmlFor="bc-brief" className="mb-1.5 block text-xs font-semibold text-stone-500">Campaign Brief</label>
              <textarea id="bc-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-24 w-full resize-y rounded-md border border-stone-200 bg-stone-50 p-2.5 text-sm outline-none focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200" />
            </div>
            <Field label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
            <Field label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
            <Field label="Tone" options={TONES} value={tone} onChange={setTone} />
            <div>
              <div className="mb-1.5 text-xs font-semibold text-stone-500">Visual Style</div>
              <div className="flex flex-wrap gap-1.5">
                {STYLES.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStyle(opt)}
                    aria-pressed={style === opt}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-stone-400 ${
                      style === opt ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Zone 2: Curated gallery */}
          <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4 md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">02 · Curated Concepts</div>
            {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectConcept(id)}
                aria-pressed={conceptId === id}
                className={`block w-full rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-stone-400 ${
                  conceptId === id ? "border-stone-900 ring-2 ring-stone-900" : "border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <span className="mb-1.5 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">{CONCEPTS[id].tag}</span>
                <h3 className="mb-1 text-sm font-bold leading-snug">{CONCEPTS[id].headline}</h3>
                <p className="text-xs text-stone-500">{CONCEPTS[id].body}</p>
              </button>
            ))}
          </section>

          {/* Zone 3: Polished preview */}
          <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4 md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">03 · Preview</div>
            <div className="rounded-lg bg-gradient-to-br from-stone-900 to-stone-700 p-5 text-white">
              <span className="mb-2 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{audience} · {channel}</span>
              <h2 className="mb-1.5 text-xl font-bold leading-tight">{concept.headline}</h2>
              <p className="text-xs text-white/70">{concept.body}</p>
            </div>

            {genState === "success" && (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800"><CheckCircle2 className="size-4 shrink-0" /> Preview refreshed successfully.</div>
            )}
            {genState === "error" && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"><CircleX className="size-4 shrink-0" /> Generation failed. Try again.</div>
            )}

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-stone-50 p-2">
                <div className="text-[10px] uppercase text-stone-400">Reach</div>
                <div className="text-sm font-bold">{metrics.reach.toLocaleString()}K</div>
              </div>
              <div className="rounded-md bg-stone-50 p-2">
                <div className="text-[10px] uppercase text-stone-400">CTR</div>
                <div className="text-sm font-bold">{metrics.ctr}%</div>
              </div>
              <div className="rounded-md bg-stone-50 p-2">
                <div className="text-[10px] uppercase text-stone-400">Conv.</div>
                <div className="text-sm font-bold">{metrics.conversion}%</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-stone-900 px-3 py-2 text-xs font-medium text-white hover:bg-stone-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-stone-400">
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Campaign saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-400">
                {saveState === "success" ? <CheckCircle2 className="size-3.5 text-emerald-600" /> : <Save className="size-3.5" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Campaign exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-400">
                {exportState === "success" ? <CheckCircle2 className="size-3.5 text-emerald-600" /> : <Download className="size-3.5" />} Export
              </button>
            </div>

            <div className="rounded-md border border-stone-200 p-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-400">Recent Operations</div>
              <ul className="max-h-28 space-y-1 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex justify-between rounded-md bg-stone-50 px-2 py-1 text-[11px] text-stone-600">
                    <span>{a.label}</span><span className="text-stone-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function Field({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-stone-500">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
