"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Quote,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const CONCEPTS: Record<ConceptId, { kicker: string; headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: { kicker: "Capability", headline: "Every whisper, heard from across the room.", body: "Far-field pickup tuned across a dozen home layouts, so the Aurora X1 hears you before you finish speaking.", reach: 830, ctr: 4.0, conversion: 2.8 },
  B: { kicker: "Lifestyle", headline: "Your evening, scored without a beat missed.", body: "Multi-room handoff means the sound follows you, from kitchen to porch, without a single dropped note.", reach: 770, ctr: 4.5, conversion: 3.1 },
  C: { kicker: "Technology", headline: "80 milliseconds. Nothing leaves home.", body: "On-device inference for speed and privacy at once, proof that intelligence doesn't need the cloud.", reach: 910, ctr: 3.6, conversion: 2.4 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Serif Editorial", "Bold Sans", "Newsprint", "Modern Trade"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function DesignImpeccableShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch. Editorial single column, large display headline, controls woven into the copy flow, sticky action bar below.")
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
    { id: "seed", time: timestamp(), label: "Editorial draft opened" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 8))
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
    log(`Switched to concept ${id} — ${CONCEPTS[id].kicker}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Drafting new edition…")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Draft failed — revise the brief and retry" : "New edition drafted successfully")
      setTimeout(() => setGenState("idle"), 2400)
    }, 1200)
  }

  function handleSave() {
    setSaveState("success")
    log("Edition saved to drafts")
    setTimeout(() => setSaveState("idle"), 1800)
  }

  function handleExport() {
    setExportState("success")
    log("Edition exported for print")
    setTimeout(() => setExportState("idle"), 1800)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900">
      <header className="border-b border-stone-200 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-full border border-stone-300 px-3 py-1 font-mono text-[11px] text-stone-500">frontend-design + impeccable</span>
          </div>
          <span className="font-serif text-xs italic text-stone-400">Muse Gazette</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-8 md:px-8">
        <div className="mb-6 flex flex-wrap gap-1.5">
          {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => selectConcept(id)}
              aria-pressed={conceptId === id}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all focus-visible:ring-4 focus-visible:ring-stone-300 ${
                conceptId === id ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 text-stone-500 hover:border-stone-500"
              }`}
            >
              Edition {id}
            </button>
          ))}
        </div>

        <div className="mb-2 font-serif text-sm uppercase tracking-[0.3em] text-stone-400">{concept.kicker}</div>
        <h1 className="mb-5 font-serif text-4xl font-bold leading-[1.05] text-stone-900 md:text-6xl">{concept.headline}</h1>
        <p className="mb-8 max-w-xl font-serif text-lg leading-relaxed text-stone-600">
          <Quote className="mr-1 inline size-4 -translate-y-1 text-stone-300" />
          {concept.body}
        </p>

        {genState === "success" && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
            <CheckCircle2 className="size-4" /> New edition drafted for the current brief.
          </div>
        )}
        {genState === "error" && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
            <CircleX className="size-4" /> Draft failed. Revise the brief and try again.
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-stone-200 bg-white/70 p-5">
          <label htmlFor="di-brief" className="mb-2 block font-serif text-sm font-semibold">Campaign Brief</label>
          <textarea
            id="di-brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="min-h-24 w-full resize-y rounded-xl border border-stone-200 bg-[#faf7f2] p-3 text-sm leading-relaxed outline-none transition-colors focus:border-stone-900 focus:bg-white focus:ring-4 focus:ring-stone-200"
          />
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <EditorialGroup label="Target Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
          <EditorialGroup label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
          <EditorialGroup label="Tone" options={TONES} value={tone} onChange={setTone} />
          <EditorialGroup label="Visual Style" options={STYLES} value={style} onChange={setStyle} />
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
          <StatCard label="CTR" value={`${metrics.ctr}%`} />
          <StatCard label="Conversion" value={`${metrics.conversion}%`} />
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white/70 p-5">
          <div className="mb-3 font-serif text-sm font-semibold">Recent Operations</div>
          <ul className="space-y-1.5">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-100">
                <span className="flex-1">{a.label}</span>
                <span className="shrink-0 text-[11px] text-stone-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-end gap-2">
          <ActionBtn icon={busy ? Loader2 : Sparkles} label="Generate" spin={busy} solid disabled={busy} onClick={handleGenerate} />
          <ActionBtn icon={saveState === "success" ? CheckCircle2 : Save} label="Save" success={saveState === "success"} onClick={handleSave} />
          <ActionBtn icon={exportState === "success" ? CheckCircle2 : Download} label="Export" success={exportState === "success"} onClick={handleExport} />
        </div>
      </div>
    </div>
  )
}

function EditorialGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-4 focus-visible:ring-stone-300 ${
              value === opt ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white text-stone-600 hover:border-stone-500"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white/70 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-stone-400">{label}</div>
      <div className="font-serif text-2xl font-bold text-stone-900">{value}</div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, disabled, solid = false, success = false, spin = false }: { icon: typeof Sparkles; label: string; onClick: () => void; disabled?: boolean; solid?: boolean; success?: boolean; spin?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-stone-300 disabled:opacity-60 ${
        solid ? "bg-stone-900 text-white shadow-sm hover:bg-stone-800" : "border border-stone-300 bg-white text-stone-700 hover:border-stone-500"
      }`}
    >
      <Icon className={`size-4 ${success ? "text-emerald-600" : ""} ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
