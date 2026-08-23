"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Moon,
  Save,
  Sparkles,
  Sun,
  X,
} from "lucide-react"

type ConceptId = "A" | "B" | "C"
type Toast = { id: string; kind: "success" | "error" | "info"; text: string }

const CONCEPTS: Record<ConceptId, { headline: string; body: string; reach: number; ctr: number; conversion: number }> = {
  A: { headline: "Every whisper, heard across the room.", body: "Far-field pickup tuned for real homes.", reach: 825, ctr: 4.0, conversion: 2.8 },
  B: { headline: "Your evening, scored without a gap.", body: "Multi-room handoff that never drops the beat.", reach: 768, ctr: 4.5, conversion: 3.1 },
  C: { headline: "80ms local response. Always private.", body: "Edge AI silicon built for speed and privacy.", reach: 902, ctr: 3.6, conversion: 2.4 },
}

const AUDIENCES = ["Early Adopters", "Households", "Enterprise", "Urban Pros"]
const CHANNELS = ["Landing Page", "Paid Social", "Email", "Retail"]
const TONES = ["Confident", "Warm", "Precise", "Playful"]
const STYLES = ["Bold Contrast", "Soft Gradient", "Editorial", "Minimal"]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function VisualImpeccableShowcase() {
  const [dark, setDark] = useState(true)
  const [brief, setBrief] = useState("Aurora X1 launch. Visual-forward hero, polished toast feedback, and a real light/dark theme toggle.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Theme workspace initialized" },
  ])

  const pushToast = useCallback((kind: Toast["kind"], text: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, kind, text }].slice(-4))
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: timestamp(), label: text }, ...prev].slice(0, 10))
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

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
    pushToast("info", `Concept ${id} is now in preview`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    pushToast("info", "Generating updated concepts…")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.15
      pushToast(fail ? "error" : "success", fail ? "Generation failed — model timeout, retry" : "Concepts refreshed successfully")
    }, 1200)
  }

  function handleSave() {
    pushToast("success", `Snapshot saved at ${timestamp()}`)
  }

  function handleExport() {
    pushToast("success", "Export bundle ready for download")
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 px-4 py-3 dark:border-slate-800 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-1 text-xs font-bold text-white">Claude sonnet 5</span>
              <span className="rounded-full border border-slate-300 px-3 py-1 font-mono text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">frontend-skill + impeccable</span>
            </div>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-pressed={dark}
              className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-400 focus-visible:ring-4 focus-visible:ring-indigo-200 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:focus-visible:ring-indigo-900"
            >
              {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
              {dark ? "Dark theme" : "Light theme"}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-xl md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{channel} · {tone} · {style}</span>
              <div className="flex gap-2">
                {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectConcept(id)}
                    aria-pressed={conceptId === id}
                    className={`flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-all focus-visible:ring-4 focus-visible:ring-white/50 ${
                      conceptId === id ? "border-white bg-white text-indigo-700" : "border-white/40 text-white/80 hover:border-white"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-w-2xl py-6">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">For {audience} · Concept {conceptId}</div>
              <h1 className="mb-3 text-4xl font-bold leading-tight md:text-6xl">{concept.headline}</h1>
              <p className="max-w-lg text-base text-white/80">{concept.body}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <HeroBtn icon={busy ? Loader2 : Sparkles} label="Generate" spin={busy} onClick={handleGenerate} />
              <HeroBtn icon={Save} label="Save" onClick={handleSave} />
              <HeroBtn icon={Download} label="Export" onClick={handleExport} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
              <label htmlFor="vi-brief" className="mb-2 block text-sm font-semibold">Campaign Brief</label>
              <textarea
                id="vi-brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-800 dark:focus:ring-indigo-900"
              />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ImpChip label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
                <ImpChip label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
                <ImpChip label="Tone" options={TONES} value={tone} onChange={setTone} />
                <ImpChip label="Visual Style" options={STYLES} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 text-sm font-semibold">Predicted Metrics</div>
              <div className="space-y-2.5">
                <MetricRow label="Reach" value={`${metrics.reach.toLocaleString()}K`} />
                <MetricRow label="CTR" value={`${metrics.ctr}%`} />
                <MetricRow label="Conversion" value={`${metrics.conversion}%`} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 text-sm font-semibold">Recent Operations</div>
              <ul className="max-h-[180px] space-y-2 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-800/70">
                    <span className="flex-1 text-slate-600 dark:text-slate-300">{a.label}</span>
                    <span className="shrink-0 text-slate-400 dark:text-slate-500">{a.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>

        <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(360px,90vw)] flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur transition-all ${
                t.kind === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" :
                t.kind === "error" ? "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200" :
                "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {t.kind === "success" && <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
              {t.kind === "error" && <CircleX className="mt-0.5 size-4 shrink-0" />}
              {t.kind === "info" && <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />}
              <span className="flex-1">{t.text}</span>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
                className="rounded-full p-0.5 text-current/60 transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/10"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ImpChip({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-4 focus-visible:ring-indigo-200 dark:focus-visible:ring-indigo-900 ${
              value === opt ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
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
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-base font-bold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  )
}

function HeroBtn({ icon: Icon, label, onClick, spin = false }: { icon: typeof Sparkles; label: string; onClick: () => void; spin?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-md transition-all hover:bg-indigo-50 focus-visible:ring-4 focus-visible:ring-white/60"
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
