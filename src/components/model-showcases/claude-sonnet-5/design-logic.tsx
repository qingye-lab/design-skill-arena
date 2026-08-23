"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Download,
  GitBranch,
  ListTree,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"

const STEPS = ["Brief", "Structure", "Preview"] as const
type Step = (typeof STEPS)[number]

const CONCEPTS: Record<ConceptId, { rationale: string; headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: {
    rationale: "Leads with the core spec claim, because early adopters buy on capability first.",
    headline: "Hears you from across the room.",
    body: "Far-field microphones tuned for real rooms, not demo booths.",
    reach: 830, ctr: 4.0, conversion: 2.8,
  },
  B: {
    rationale: "Leads with a lifestyle moment, because households buy on fit into daily life.",
    headline: "The soundtrack that follows you home.",
    body: "Multi-room audio that hands off between spaces without a beat lost.",
    reach: 775, ctr: 4.5, conversion: 3.1,
  },
  C: {
    rationale: "Leads with a technical differentiator, because enterprise buyers need defensible specs.",
    headline: "80ms on-device inference. No cloud dependency.",
    body: "Edge AI silicon keeps response local, private, and fast.",
    reach: 910, ctr: 3.7, conversion: 2.6,
  },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Direct", "Warm", "Technical", "Playful"]
const STYLES = ["Structured Grid", "Editorial", "Monochrome", "Accent Pop"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function DesignLogicShowcase() {
  const [step, setStep] = useState<Step>("Brief")
  const [brief, setBrief] = useState("Aurora X1 launch. The logic: match message structure to audience decision drivers, not just aesthetics.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [trail, setTrail] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Logic tree initialized from brief" },
  ])

  const pushTrail = useCallback((label: string) => {
    setTrail((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]

  const metrics = useMemo(() => {
    const toneMul = tone === "Direct" ? 1.05 : tone === "Technical" ? 0.97 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.08 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    pushTrail(`Structure branch switched to ${id}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    pushTrail("Re-deriving structure from brief + controls")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      pushTrail(fail ? "Derivation failed — conflicting signals in brief" : "Structure regenerated across all three branches")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1100)
  }

  const stepIndex = STEPS.indexOf(step)

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-neutral-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded border border-neutral-300 px-2.5 py-1 font-mono text-[11px] text-neutral-600">frontend-design</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
            <ListTree className="size-3.5" /> Design Logic · Muse
          </div>
        </div>
      </header>

      <nav className="border-b border-neutral-200 bg-white px-4 md:px-8">
        <div className="mx-auto flex max-w-6xl gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                step === s ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full border border-current text-[11px]">{i + 1}</span>
              {s}
              {step === s && <span className="absolute inset-x-4 -bottom-px h-0.5 bg-neutral-900" />}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        {step === "Brief" && (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-5">
              <label htmlFor="dl-brief" className="mb-2 block text-sm font-semibold">Campaign Brief</label>
              <textarea id="dl-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-40 w-full resize-y rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm leading-relaxed outline-none focus:border-neutral-500 focus:bg-white focus:ring-2 focus:ring-neutral-300" />
              <button type="button" onClick={() => setStep("Structure")} className="mt-3 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400">
                Continue to Structure
              </button>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-100 p-5 text-sm text-neutral-500">
              <div className="mb-2 font-semibold text-neutral-700">Why this step matters</div>
              The brief seeds every downstream decision: which audience driver leads, which structural branch gets picked, and how metrics get weighted.
            </div>
          </section>
        )}

        {step === "Structure" && (
          <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
              <ControlGroup label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
              <ControlGroup label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
              <ControlGroup label="Tone" options={TONES} value={tone} onChange={setTone} />
              <ControlGroup label="Layout Style" options={STYLES} value={style} onChange={setStyle} />
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><GitBranch className="size-4 text-neutral-400" /> Structural Branches</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectConcept(id)}
                    className={`rounded-lg border p-3 text-left text-sm transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                      conceptId === id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white hover:border-neutral-400"
                    }`}
                  >
                    <div className="mb-1 font-bold">Branch {id}</div>
                    <div className={`text-xs ${conceptId === id ? "text-white/70" : "text-neutral-500"}`}>{CONCEPTS[id].rationale}</div>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep("Preview")} className="mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-400">
                Continue to Preview
              </button>
            </div>
          </section>
        )}

        {step === "Preview" && (
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4">
              <div className={`relative overflow-hidden rounded-lg border border-neutral-200 p-8 transition-colors duration-500 md:p-14 ${
                style === "Monochrome" ? "bg-neutral-900 text-white" : style === "Accent Pop" ? "bg-amber-50 text-amber-950" : style === "Editorial" ? "bg-white text-neutral-900" : "bg-neutral-100 text-neutral-900"
              }`}>
                <span className="mb-3 inline-block rounded-full border border-current/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  Branch {conceptId} · {audience} · {channel}
                </span>
                <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                <p className="max-w-xl text-sm opacity-75 md:text-base">{concept.body}</p>
              </div>

              {genState === "success" && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  <CheckCircle2 className="size-4" /> Structure regenerated across all branches.
                </div>
              )}
              {genState === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  <CircleX className="size-4" /> Derivation failed. Adjust the brief and retry.
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
                </button>
                <button type="button" onClick={() => { setSaveState("success"); pushTrail("Structure saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
                </button>
                <button type="button" onClick={() => { setExportState("success"); pushTrail("Structure exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400">
                  {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-2 text-sm font-semibold">Predicted Metrics</div>
                <div className="space-y-2">
                  <Metric label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
                  <Metric label="CTR" value={`${metrics.ctr}%`} />
                  <Metric label="Conversion" value={`${metrics.conversion}%`} />
                </div>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-4">
                <div className="mb-2 text-sm font-semibold">Decision Trail</div>
                <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                  {trail.map((t) => (
                    <li key={t.id} className="rounded-md bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600">
                      <span className="mr-1.5 text-neutral-400">{t.time}</span>{t.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <div className="mt-6 flex justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <span key={s} className={`h-1.5 w-8 rounded-full transition-colors ${i <= stepIndex ? "bg-neutral-900" : "bg-neutral-200"}`} />
          ))}
        </div>
      </main>
    </div>
  )
}

function ControlGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-neutral-500">{label}</div>
      <div className="flex flex-col gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-md border px-2.5 py-1.5 text-left text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              value === opt ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-bold text-neutral-900">{value}</span>
    </div>
  )
}
