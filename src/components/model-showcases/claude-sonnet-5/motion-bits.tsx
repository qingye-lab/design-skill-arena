"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Play,
  Save,
  Sparkles,
  Zap,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup, tuned for real rooms.", reach: 845, ctr: 4.1, conversion: 2.9 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff without missing a beat.", reach: 785, ctr: 4.6, conversion: 3.1 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon for privacy and speed.", reach: 920, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const MOTIONS = ["Slide + Fade", "Scale Pop", "Stagger Reveal", "Elastic Bounce"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function MotionBitsShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch, choreographed: every concept swap and control change triggers a purposeful transition.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [motion, setMotion] = useState(MOTIONS[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [replayKey, setReplayKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Motion timeline primed" },
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
    setReplayKey((k) => k + 1)
    log(`Concept ${id} entrance animation replayed`)
  }

  function replay() {
    setReplayKey((k) => k + 1)
    log("Timeline replayed")
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Generating new motion sequence")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      setReplayKey((k) => k + 1)
      log(fail ? "Sequence failed to render — easing conflict" : "New motion sequence generated")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1200)
  }

  const motionClass = {
    "Slide + Fade": "animate-[slideFade_0.5s_ease-out]",
    "Scale Pop": "animate-[scalePop_0.4s_cubic-bezier(0.34,1.56,0.64,1)]",
    "Stagger Reveal": "animate-[slideFade_0.5s_ease-out]",
    "Elastic Bounce": "animate-[elasticBounce_0.6s_cubic-bezier(0.68,-0.55,0.27,1.55)]",
  }[motion]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <style>{`
        @keyframes slideFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scalePop { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes elasticBounce { 0% { opacity: 0; transform: scale(0.7) rotate(-2deg); } 60% { opacity: 1; transform: scale(1.05) rotate(1deg); } 100% { transform: scale(1) rotate(0); } }
      `}</style>
      <header className="border-b border-white/10 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-black">Claude sonnet 5</span>
            <span className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[11px] text-white/60">react-bits</span>
          </div>
          <button type="button" onClick={replay} className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50">
            <Play className="size-3.5" /> Replay
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className={`animate-[slideFade_0.4s_ease-out_backwards] rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white/50 ${
                    conceptId === id ? "border-white bg-white text-black" : "border-white/20 text-white/70 hover:border-white/50"
                  }`}
                >
                  Concept {id}
                </button>
              ))}
            </div>

            <div key={replayKey} className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 md:p-14 ${motionClass}`}>
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
                <Zap className="size-3" /> {audience} · {channel}
              </span>
              <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
              <p className="max-w-xl text-sm text-white/60 md:text-base">{concept.body}</p>
            </div>

            {genState === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle2 className="size-4" /> Motion sequence generated and applied.
              </div>
            )}
            {genState === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                <CircleX className="size-4" /> Sequence failed. Adjust easing and retry.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-white active:scale-95">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Sequence saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50">
                {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Save className="size-4" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Motion spec exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50">
                {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-400" /> : <Download className="size-4" />} Export
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <label htmlFor="mb-brief" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">Brief</label>
              <textarea id="mb-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-20 w-full resize-y rounded-lg border border-white/15 bg-white/5 p-2.5 text-sm text-white outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20" />
            </section>
            <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Chips label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
              <Chips label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
              <Chips label="Tone" options={TONES} value={tone} onChange={setTone} />
              <Chips label="Motion Style" options={MOTIONS} value={motion} onChange={setMotion} />
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Metrics</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-white/50">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                <div className="flex justify-between"><span className="text-white/50">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                <div className="flex justify-between"><span className="text-white/50">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Activity</div>
              <ul className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/70">
                    <span className="mr-1.5 text-white/40">{a.time}</span>{a.label}
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

function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
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
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-white/50 ${
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
