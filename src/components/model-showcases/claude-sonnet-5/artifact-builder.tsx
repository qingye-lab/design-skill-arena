"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Code2,
  Download,
  Eye,
  FileJson,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"
type ViewMode = "preview" | "spec"

const CONCEPTS: Record<ConceptId, { headline: string; body: string; cta: string; color: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Hears you from across the room.", body: "Far-field pickup tuned for real homes.", cta: "Shop Aurora X1", color: "#2563eb", reach: 845, ctr: 4.1, conversion: 2.9 },
  B: { headline: "Sound that follows your day.", body: "Multi-room handoff without missing a beat.", cta: "See it in action", color: "#7c3aed", reach: 785, ctr: 4.6, conversion: 3.1 },
  C: { headline: "80ms local response, always.", body: "Edge AI silicon means no cloud lag.", cta: "Explore the tech", color: "#0f172a", reach: 920, ctr: 3.6, conversion: 2.5 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Technical", "Playful"]
const STYLES = ["Card Artifact", "Banner Artifact", "Modal Artifact", "Inline Artifact"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function ArtifactBuilderShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch artifact: a self-contained, embeddable campaign unit with live spec output.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [view, setView] = useState<ViewMode>("preview")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Artifact scaffold generated" },
  ])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = CONCEPTS[conceptId]

  const metrics = useMemo(() => {
    const toneMul = tone === "Confident" ? 1.05 : tone === "Technical" ? 0.97 : 1
    return {
      reach: Math.round(concept.reach * (channel === "Paid Social" ? 1.08 : 1)),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * toneMul).toFixed(1)),
    }
  }, [concept, tone, channel])

  function selectConcept(id: ConceptId) {
    setConceptId(id)
    log(`Artifact variant swapped to ${id}`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Rebuilding artifact from spec")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.13
      setGenState(fail ? "error" : "success")
      log(fail ? "Build failed — spec validation error" : "Artifact rebuilt and validated")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1100)
  }

  const specJson = useMemo(() => JSON.stringify({
    artifact: "muse-campaign-unit",
    variant: conceptId,
    style,
    audience,
    channel,
    tone,
    content: { headline: concept.headline, body: concept.body, cta: concept.cta },
    metrics,
  }, null, 2), [conceptId, style, audience, channel, tone, concept, metrics])

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
            <span className="rounded-md border border-zinc-300 px-2.5 py-1 font-mono text-[11px] text-zinc-600">web-artifacts-builder / artifacts-builder</span>
          </div>
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 text-xs font-medium">
            <button type="button" onClick={() => setView("preview")} className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${view === "preview" ? "bg-white shadow-sm" : "text-zinc-500"}`}>
              <Eye className="size-3.5" /> Preview
            </button>
            <button type="button" onClick={() => setView("spec")} className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${view === "spec" ? "bg-white shadow-sm" : "text-zinc-500"}`}>
              <FileJson className="size-3.5" /> Spec
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <label htmlFor="ab-brief" className="mb-2 block text-sm font-semibold">Brief</label>
              <textarea
                id="ab-brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 p-2.5 text-sm leading-relaxed outline-none focus:border-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-200"
              />
            </section>
            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="mb-3 text-sm font-semibold">Props</div>
              <div className="space-y-3">
                <Field label="audience" options={AUDIENCES} value={audience} onChange={setAudience} />
                <Field label="channel" options={CHANNELS} value={channel} onChange={setChannel} />
                <Field label="tone" options={TONES} value={tone} onChange={setTone} />
                <Field label="artifactStyle" options={STYLES} value={style} onChange={setStyle} />
              </div>
            </section>
            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Code2 className="size-4 text-zinc-400" /> Variant</div>
              <div className="flex gap-1.5">
                {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectConcept(id)}
                    aria-pressed={conceptId === id}
                    className={`flex-1 rounded-md border py-2 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                      conceptId === id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </section>
            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="mb-2 text-sm font-semibold">Metrics</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
              </div>
            </section>
          </aside>

          <div className="flex flex-col gap-4">
            {view === "preview" ? (
              <div
                className={`relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-500 ${
                  style === "Banner Artifact" ? "flex min-h-[180px] items-center p-6 md:p-10" :
                  style === "Modal Artifact" ? "mx-auto max-w-md p-8 shadow-xl" :
                  style === "Inline Artifact" ? "flex items-center gap-4 p-4" : "p-8 md:p-12"
                }`}
                style={{ borderTopColor: concept.color, borderTopWidth: 4 }}
              >
                <div className={style === "Inline Artifact" ? "flex-1" : ""}>
                  <span className="mb-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white" style={{ backgroundColor: concept.color }}>
                    {audience} · {channel}
                  </span>
                  <h2 className="mb-2 text-2xl font-bold leading-tight md:text-4xl">{concept.headline}</h2>
                  <p className="mb-4 max-w-md text-sm text-zinc-600">{concept.body}</p>
                  <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-zinc-400 active:scale-95" style={{ backgroundColor: concept.color }}>
                    {concept.cta}
                  </button>
                </div>
              </div>
            ) : (
              <pre className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-xs leading-relaxed text-emerald-300">
                <code>{specJson}</code>
              </pre>
            )}

            {genState === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <CheckCircle2 className="size-4" /> Artifact rebuilt and validated against spec.
              </div>
            )}
            {genState === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                <CircleX className="size-4" /> Build failed. Check props for conflicts.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-zinc-400">
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Artifact saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400">
                {saveState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Save className="size-4" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Artifact bundle exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400">
                {exportState === "success" ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Download className="size-4" />} Export
              </button>
            </div>

            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="mb-2 text-sm font-semibold">Build Log</div>
              <ul className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between rounded-md bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-600">
                    <span>{a.label}</span>
                    <span className="text-zinc-400">{a.time}</span>
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

function Field({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[11px] text-zinc-400">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}