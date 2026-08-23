"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Activity,
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Palette,
  Save,
  Sparkles,
  Type,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears the whisper across the room.", body: "Far-field pickup, tuned for real living rooms.", reach: 840, ctr: 4.0, conversion: 2.8 },
  B: { headline: "Sound that moves with your evening.", body: "Multi-room handoff without ever losing the beat.", reach: 775, ctr: 4.5, conversion: 3.1 },
  C: { headline: "Intelligence you never have to wait for.", body: "80ms local inference, nothing sent to the cloud.", reach: 915, ctr: 3.6, conversion: 2.4 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]

const PALETTES = [
  { id: "obsidian", name: "Obsidian", swatch: ["#0b0f19", "#1c2333", "#c9a24b"], bg: "from-[#0b0f19] via-[#131a2b] to-[#1c2333]", accent: "#c9a24b", font: "font-serif" },
  { id: "plum", name: "Deep Plum", swatch: ["#1a0e1f", "#3d1f4d", "#e8b4d8"], bg: "from-[#1a0e1f] via-[#2b1436] to-[#3d1f4d]", accent: "#e8b4d8", font: "font-sans" },
  { id: "forest", name: "Midnight Forest", swatch: ["#0a1f1a", "#153029", "#7fd9b4"], bg: "from-[#0a1f1a] via-[#102822] to-[#153029]", accent: "#7fd9b4", font: "font-sans" },
  { id: "ember", name: "Ember Slate", swatch: ["#180f0a", "#2e1c12", "#f2905c"], bg: "from-[#180f0a] via-[#241610] to-[#2e1c12]", accent: "#f2905c", font: "font-serif" },
]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function VisualTasteShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch. Mood-board driven: pick a palette and type pairing, let the hero absorb it instantly.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [paletteId, setPaletteId] = useState(PALETTES[0].id)
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Mood board initialized with Obsidian palette" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const palette = useMemo(() => PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0], [paletteId])
  const concept = CONCEPTS[conceptId]

  const metrics = useMemo(() => {
    const toneMul = tone === "Confident" ? 1.05 : tone === "Precise" ? 0.97 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.08 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Concept ${id} applied to the mood board`)
  }

  function selectPalette(id: string) {
    setPaletteId(id)
    log(`Palette switched to ${PALETTES.find((p) => p.id === id)?.name}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Regenerating concepts against current palette")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Generation failed — retry needed" : "Concepts refreshed for this palette")
      setTimeout(() => setGenState("idle"), 2400)
    }, 1200)
  }

  function handleSave() {
    setSaveState("success")
    log("Mood board snapshot saved")
    setTimeout(() => setSaveState("idle"), 1800)
  }

  function handleExport() {
    setExportState("success")
    log("Export bundle rendered")
    setTimeout(() => setExportState("idle"), 1800)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br text-white ${palette.bg}`}>
      <header className="border-b border-white/10 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">Claude sonnet 5</span>
            <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] text-white/60">frontend-skill + taste-skill</span>
          </div>
          <span className="text-xs text-white/40">Muse — AI Campaign Studio</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">{channel} · {tone} · For {audience}</span>
            <div className="flex gap-2">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  aria-pressed={conceptId === id}
                  className={`flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition-all focus-visible:ring-4 focus-visible:ring-white/40 ${
                    conceptId === id ? "border-white bg-white text-black" : "border-white/30 text-white/70 hover:border-white/70"
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-3xl py-8">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">Concept {conceptId} preview</div>
            <h1 className={`mb-4 text-4xl font-bold leading-[1.05] md:text-6xl ${palette.font}`}>{concept.headline}</h1>
            <p className="max-w-xl text-base text-white/70">{concept.body}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionBtn icon={busy ? Loader2 : Sparkles} label="Generate" spin={busy} solid accent={palette.accent} onClick={handleGenerate} />
            <ActionBtn icon={saveState === "success" ? CheckCircle2 : Save} label="Save" success={saveState === "success"} onClick={handleSave} />
            <ActionBtn icon={exportState === "success" ? CheckCircle2 : Download} label="Export" success={exportState === "success"} onClick={handleExport} />
          </div>
          {genState === "error" && (
            <div className="absolute right-6 top-20 flex items-center gap-2 rounded-lg border border-red-300/30 bg-red-500/20 px-3 py-2 text-sm text-red-100">
              <CircleX className="size-4" /> Regeneration failed. Try again.
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Palette className="size-4 text-white/50" /> Palette & Type Pairing</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPalette(p.id)}
                  aria-pressed={paletteId === p.id}
                  className={`rounded-xl border p-3 text-left transition-all focus-visible:ring-4 focus-visible:ring-white/40 ${
                    paletteId === p.id ? "border-white bg-white/10" : "border-white/10 hover:border-white/40"
                  }`}
                >
                  <div className="mb-2 flex gap-1">
                    {p.swatch.map((c) => (
                      <span key={c} className="size-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <Type className="size-3 text-white/40" /> {p.name}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <TasteGroup label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} accent={palette.accent} />
              <TasteGroup label="Channel" options={CHANNELS} value={channel} onChange={setChannel} accent={palette.accent} />
              <TasteGroup label="Tone" options={TONES} value={tone} onChange={setTone} accent={palette.accent} />
            </div>
            <label htmlFor="vt-brief" className="mb-2 mt-4 block text-sm font-semibold">Campaign Brief</label>
            <textarea
              id="vt-brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-relaxed text-white outline-none focus:border-white/40 focus:ring-4 focus:ring-white/10"
            />
          </section>

          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 text-sm font-semibold">Predicted Metrics</div>
              <div className="space-y-2.5">
                <MetricRow label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
                <MetricRow label="CTR" value={`${metrics.ctr}%`} />
                <MetricRow label="Conversion" value={`${metrics.conversion}%`} />
              </div>
            </section>
            <section className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Activity className="size-4 text-white/40" /> Recent Operations</div>
              <ul className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm hover:bg-black/30">
                    <span className="flex-1 text-white/70">{a.label}</span>
                    <span className="shrink-0 text-[11px] text-white/30">{a.time}</span>
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

function TasteGroup({ label, options, value, onChange, accent }: { label: string; options: string[]; value: string; onChange: (v: string) => void; accent: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            style={value === opt ? { borderColor: accent, color: accent } : undefined}
            className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white/60 transition-all hover:border-white/40 focus-visible:ring-2 focus-visible:ring-white/40"
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
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-base font-bold text-white">{value}</span>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, solid = false, success = false, spin = false, accent }: { icon: typeof Sparkles; label: string; onClick: () => void; solid?: boolean; success?: boolean; spin?: boolean; accent?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={solid && accent ? { backgroundColor: accent } : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-white/40 ${
        solid ? "text-black shadow-md hover:opacity-90" : "border border-white/20 bg-white/5 text-white hover:border-white/50"
      }`}
    >
      <Icon className={`size-4 ${success ? "text-emerald-400" : ""} ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
