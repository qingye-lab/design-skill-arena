"use client"

import { useCallback, useMemo, useState } from "react"
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Download,
  Loader2,
  Save,
  Sparkles,
  Zap,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { title: string; tagline: string; image: string; reach: number; ctr: number; conversion: number }> = {
  A: { title: "Signal in the Noise", tagline: "Far-field pickup that hears you before you finish the sentence.", image: "from-indigo-600 via-blue-600 to-cyan-500", reach: 840, ctr: 4.2, conversion: 2.9 },
  B: { title: "The Quiet Room", tagline: "Sound that moves with you, not the wires that carry it.", image: "from-fuchsia-600 via-purple-600 to-indigo-500", reach: 790, ctr: 4.7, conversion: 3.2 },
  C: { title: "Offline, On Point", tagline: "80ms local response. No cloud roundtrip required.", image: "from-slate-800 via-slate-700 to-slate-900", reach: 920, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Urban Pros", "Households", "Enterprise"]
const CHANNELS = ["Hero Landing", "Social Feed", "Email Drop", "Retail Kiosk"]
const TONES = ["Bold", "Intimate", "Minimal", "Playful"]
const VISUALS = ["Gradient Wash", "Duotone", "High Contrast", "Soft Focus"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function VisualFrontendShowcase() {
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [visual, setVisual] = useState(VISUALS[0])
  const [brief, setBrief] = useState("Aurora X1 launch: a visual-first hero campaign spotlighting sound quality and instant response.")
  const [controlsOpen, setControlsOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [log, setLog] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Visual canvas ready" },
  ])

  const pushLog = useCallback((label: string) => {
    setLog((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]

  const metrics = useMemo(() => {
    const toneMul = tone === "Bold" ? 1.08 : tone === "Playful" ? 1.03 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Social Feed" ? 1.1 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    pushLog(`Hero swapped to concept ${id} — ${CONCEPTS[id].title}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    pushLog("Rendering new hero variations")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.15
      setGenState(fail ? "error" : "success")
      pushLog(fail ? "Render failed — asset pipeline timeout" : "Hero variations rendered")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur md:px-8">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">Claude sonnet 5</span>
          <span className="hidden rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] text-white/60 sm:inline">frontend-skill</span>
        </div>
        <button
          type="button"
          onClick={() => setControlsOpen((v) => !v)}
          className="flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 lg:hidden"
        >
          Controls <ChevronDown className={`size-3.5 transition-transform ${controlsOpen ? "rotate-180" : ""}`} />
        </button>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px]">
        <main className="relative overflow-hidden">
          <div className={`relative flex min-h-[70vh] flex-col justify-end bg-gradient-to-br p-6 transition-all duration-700 md:min-h-[85vh] md:p-16 ${concept.image} ${visual === "Duotone" ? "saturate-50" : visual === "High Contrast" ? "contrast-125" : visual === "Soft Focus" ? "blur-[0.3px]" : ""}`}>
            <div className="absolute right-6 top-6 flex gap-1.5 md:right-10 md:top-10">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  aria-pressed={conceptId === id}
                  className={`flex size-9 items-center justify-center rounded-full border text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-white ${
                    conceptId === id ? "border-white bg-white text-black" : "border-white/40 bg-black/30 text-white hover:border-white"
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
            <span className="mb-4 w-fit rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
              {channel} · {audience}
            </span>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] md:text-7xl">{concept.title}</h1>
            <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">{concept.tagline}</p>
            <button className="mt-6 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white active:scale-95">
              Explore campaign <ArrowUpRight className="size-4" />
            </button>
          </div>

          {genState === "success" && (
            <div className="m-4 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <CheckCircle2 className="size-4" /> New hero variations are live in the canvas.
            </div>
          )}
          {genState === "error" && (
            <div className="m-4 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              <CircleX className="size-4" /> Render failed. Try again in a moment.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 p-4 md:p-6">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={busy}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-white"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
            </button>
            <button
              type="button"
              onClick={() => { setSaveState("success"); pushLog("Canvas saved"); setTimeout(() => setSaveState("idle"), 2000) }}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Save className="size-4" />} Save
            </button>
            <button
              type="button"
              onClick={() => { setExportState("success"); pushLog("Assets exported"); setTimeout(() => setExportState("idle"), 2000) }}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Download className="size-4" />} Export
            </button>
            <div className="ml-auto flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1"><Zap className="size-3.5" /> Reach {metrics.reach}K</span>
              <span>CTR {metrics.ctr}%</span>
              <span>Conv {metrics.conversion}%</span>
            </div>
          </div>
        </main>

        <aside className={`border-t border-white/10 lg:border-l lg:border-t-0 ${controlsOpen ? "block" : "hidden lg:block"}`}>
          <div className="flex flex-col gap-4 p-4 md:p-5">
            <div>
              <label htmlFor="vf-brief" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">Brief</label>
              <textarea id="vf-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-24 w-full resize-y rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20" />
            </div>
            <PillGroup label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
            <PillGroup label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
            <PillGroup label="Tone" options={TONES} value={tone} onChange={setTone} />
            <PillGroup label="Visual Treatment" options={VISUALS} value={visual} onChange={setVisual} />

            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">Activity</div>
              <ul className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {log.map((l) => (
                  <li key={l.id} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70">
                    <span className="mr-1.5 text-white/40">{l.time}</span>{l.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function PillGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-white/50 ${
              value === opt ? "border-white bg-white text-black" : "border-white/20 text-white/70 hover:border-white/50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
