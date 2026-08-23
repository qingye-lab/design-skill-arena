"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Download,
  Heart,
  Loader2,
  Palette,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number; tasteScore: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup, tuned for real rooms.", reach: 845, ctr: 4.1, conversion: 2.9, tasteScore: 78 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff without missing a beat.", reach: 785, ctr: 4.6, conversion: 3.1, tasteScore: 91 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon for privacy and speed.", reach: 920, ctr: 3.6, conversion: 2.5, tasteScore: 65 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const PALETTES: { name: string; swatch: string[] }[] = [
  { name: "Terracotta Dusk", swatch: ["#c65d3b", "#e8a87c", "#3a2e2c"] },
  { name: "Sage Quiet", swatch: ["#7c9070", "#dde5d4", "#2f3b2a"] },
  { name: "Ink & Cream", swatch: ["#1c1c1c", "#f2ede4", "#8a8478"] },
  { name: "Coastal Slate", swatch: ["#3c6e71", "#d9d9d9", "#284b63"] },
]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function StandardTasteShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch, built on the standard workbench but curated through a refined, hand-picked palette system.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [conceptId, setConceptId] = useState<ConceptId>("B")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Palette curated from brand taste profile" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]
  const palette = PALETTES[paletteIdx]

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
    log(`Concept ${id} selected — taste score ${CONCEPTS[id].tasteScore}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Curating fresh concepts against palette")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.1
      setGenState(fail ? "error" : "success")
      log(fail ? "Curation failed — palette clash detected" : "Concepts refreshed, taste-checked against palette")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1200)
  }

  return (
    <div className="min-h-screen text-stone-900" style={{ backgroundColor: `${palette.swatch[1]}30` }}>
      <header className="border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-full border border-stone-300 px-2.5 py-1 font-mono text-[11px] text-stone-600">frontend-app-builder + taste-skill</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <label htmlFor="st-brief" className="mb-2 block text-sm font-semibold">Brief</label>
              <textarea id="st-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-28 w-full resize-y rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-sm outline-none focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200" />
            </section>
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold"><Palette className="size-4 text-stone-400" /> Curated Palettes</div>
              <div className="space-y-2">
                {PALETTES.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => { setPaletteIdx(i); log(`Palette switched to ${p.name}`) }}
                    aria-pressed={paletteIdx === i}
                    className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-all focus-visible:ring-2 focus-visible:ring-stone-400 ${
                      paletteIdx === i ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <div className="flex -space-x-1">
                      {p.swatch.map((c) => <span key={c} className="size-5 rounded-full border border-white" style={{ backgroundColor: c }} />)}
                    </div>
                    <span className="text-xs font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-4">
              <ControlList label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
              <ControlList label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
              <ControlList label="Tone" options={TONES} value={tone} onChange={setTone} />
            </section>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button key={id} type="button" onClick={() => selectConcept(id)} aria-pressed={conceptId === id} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-stone-400 ${conceptId === id ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"}`}>
                  <Heart className={`size-3.5 ${conceptId === id ? "fill-white text-white" : CONCEPTS[id].tasteScore > 80 ? "fill-rose-400 text-rose-400" : ""}`} /> Concept {id}
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-2xl p-8 shadow-sm transition-colors duration-500 md:p-14" style={{ backgroundColor: palette.swatch[1], color: palette.swatch[2] }}>
              <span className="mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white" style={{ backgroundColor: palette.swatch[0] }}>
                {audience} · {channel} · {palette.name}
              </span>
              <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
              <p className="max-w-xl text-sm opacity-75 md:text-base">{concept.body}</p>
              <button className="mt-6 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white active:scale-95" style={{ backgroundColor: palette.swatch[0] }}>
                Explore
              </button>
            </div>

            {genState === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="size-4" /> Concepts curated and taste-checked.</div>
            )}
            {genState === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"><CircleX className="size-4" /> Palette clash detected. Try another combination.</div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-stone-400">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Curated set saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-400">
                {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Palette-locked assets exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-400">
                {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="mb-2 text-sm font-semibold">Predicted Metrics</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-stone-500">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
              </div>
            </section>
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="mb-2 text-sm font-semibold">Activity</div>
              <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs text-stone-600">
                    <span className="mr-1.5 text-stone-400">{a.time}</span>{a.label}
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

function ControlList({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-semibold">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={() => onChange(opt)} aria-pressed={value === opt} className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-stone-400 ${value === opt ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
