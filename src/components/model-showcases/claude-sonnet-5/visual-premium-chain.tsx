"use client"

import { useCallback, useMemo, useState } from "react"
import {
  CheckCircle2,
  CircleX,
  Crown,
  Download,
  Loader2,
  Save,
  Sparkles,
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
const PALETTES: { name: string; from: string; to: string }[] = [
  { name: "Gilded Cream", from: "#3a2f1d", to: "#0f0c07" },
  { name: "Aurora Plum", from: "#3b1f3a", to: "#0f0710" },
  { name: "Midnight Bronze", from: "#332218", to: "#0a0705" },
]

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export default function VisualPremiumChainShowcase() {
  const [brief, setBrief] = useState("Aurora X1 launch: an editorial, full-bleed presentation with a curated palette and meticulous state handling.")
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [busy, setBusy] = useState(false)
  const [genState, setGenState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success">("idle")
  const [exportState, setExportState] = useState<"idle" | "success">("idle")
  const [activity, setActivity] = useState<{ id: string; time: string; label: string }[]>([
    { id: "seed", time: timestamp(), label: "Editorial canvas mounted" },
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
    log(`Concept ${id} brought into full-bleed view`)
  }

  function handleGenerate() {
    if (busy) return
    setBusy(true)
    log("Rendering premium composition")
    setTimeout(() => {
      setBusy(false)
      const fail = Math.random() < 0.12
      setGenState(fail ? "error" : "success")
      log(fail ? "Composition failed to render" : "Premium composition rendered")
      setTimeout(() => setGenState("idle"), 2500)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#f2e9d8]">
      <header className="border-b border-[#f2e9d8]/10 px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#f2e9d8] px-2.5 py-1 text-xs font-bold text-[#0c0a08]">Claude sonnet 5</span>
            <span className="rounded-full border border-[#f2e9d8]/20 px-2.5 py-1 font-mono text-[11px] leading-tight text-[#f2e9d8]/50 break-words">frontend-skill + taste-skill + impeccable</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#f2e9d8]/40"><Crown className="size-3.5" /> Muse Editorial</div>
        </div>
      </header>

      {/* Full-bleed hero */}
      <div
        className="relative overflow-hidden px-4 py-14 md:px-12 md:py-24"
        style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
      >
        <div className="mx-auto max-w-6xl">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#f2e9d8]/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#f2e9d8]/70">
            {audience} · {channel}
          </span>
          <h2 className="mb-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">{concept.headline}</h2>
          <p className="max-w-xl text-base text-[#f2e9d8]/60 md:text-lg">{concept.body}</p>

          {genState === "success" && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-200">
              <CheckCircle2 className="size-4 shrink-0" /> Composition rendered with the current palette.
            </div>
          )}
          {genState === "error" && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
              <CircleX className="size-4 shrink-0" /> Rendering failed. The palette or copy may conflict.
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
          {/* Curated palette rail */}
          <aside className="space-y-3 rounded-xl border border-[#f2e9d8]/10 bg-[#f2e9d8]/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#f2e9d8]/40">Curated Palette</div>
            {PALETTES.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => { setPaletteIdx(i); log(`Palette switched to ${p.name}`) }}
                aria-pressed={paletteIdx === i}
                className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#f2e9d8]/50 ${
                  paletteIdx === i ? "border-[#f2e9d8]/60 bg-[#f2e9d8]/10" : "border-[#f2e9d8]/10 hover:border-[#f2e9d8]/30"
                }`}
              >
                <span className="size-6 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
                <span className="font-medium">{p.name}</span>
              </button>
            ))}
            <div className="pt-2 text-[11px] font-semibold uppercase tracking-wide text-[#f2e9d8]/40">Tone</div>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  aria-pressed={tone === t}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#f2e9d8]/50 ${
                    tone === t ? "border-[#f2e9d8]/60 bg-[#f2e9d8]/10 text-[#f2e9d8]" : "border-[#f2e9d8]/10 text-[#f2e9d8]/60 hover:border-[#f2e9d8]/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </aside>

          {/* Center: brief + concepts */}
          <div className="space-y-4">
            <section className="rounded-xl border border-[#f2e9d8]/10 bg-[#f2e9d8]/5 p-4">
              <label htmlFor="vp-brief" className="mb-1.5 block text-xs font-semibold text-[#f2e9d8]/50">Campaign Brief</label>
              <textarea id="vp-brief" value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-20 w-full resize-y rounded-lg border border-[#f2e9d8]/15 bg-transparent p-2.5 text-sm text-[#f2e9d8] outline-none focus:border-[#f2e9d8]/40 focus:ring-2 focus:ring-[#f2e9d8]/20" />
            </section>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Audience" options={AUDIENCES} value={audience} onChange={setAudience} />
              <Field label="Channel" options={CHANNELS} value={channel} onChange={setChannel} />
            </div>
            <section className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#f2e9d8]/40">Concepts</div>
              {(Object.keys(CONCEPTS) as ConceptId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectConcept(id)}
                  aria-pressed={conceptId === id}
                  className={`block w-full rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#f2e9d8]/50 ${
                    conceptId === id ? "border-[#f2e9d8]/60 bg-[#f2e9d8]/10" : "border-[#f2e9d8]/10 hover:border-[#f2e9d8]/30"
                  }`}
                >
                  <span className="text-sm font-bold">Concept {id}</span>
                  <p className="mt-0.5 text-xs text-[#f2e9d8]/50">{CONCEPTS[id].headline}</p>
                </button>
              ))}
            </section>
          </div>

          {/* Right: metrics + actions + activity */}
          <div className="space-y-4">
            <section className="rounded-xl border border-[#f2e9d8]/10 bg-[#f2e9d8]/5 p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#f2e9d8]/40">Predicted Metrics</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-[#f2e9d8]/50">Reach</span><span className="font-bold">{metrics.reach.toLocaleString()}K</span></div>
                <div className="flex justify-between"><span className="text-[#f2e9d8]/50">CTR</span><span className="font-bold">{metrics.ctr}%</span></div>
                <div className="flex justify-between"><span className="text-[#f2e9d8]/50">Conversion</span><span className="font-bold">{metrics.conversion}%</span></div>
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleGenerate} disabled={busy} className="flex items-center gap-1.5 rounded-full bg-[#f2e9d8] px-3.5 py-2 text-xs font-bold text-[#0c0a08] transition-transform hover:scale-105 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#f2e9d8] active:scale-95">
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} Generate
              </button>
              <button type="button" onClick={() => { setSaveState("success"); log("Editorial saved"); setTimeout(() => setSaveState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-full border border-[#f2e9d8]/20 px-3.5 py-2 text-xs font-medium text-[#f2e9d8]/80 hover:bg-[#f2e9d8]/10 focus-visible:ring-2 focus-visible:ring-[#f2e9d8]/50">
                {saveState === "success" ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <Save className="size-3.5" />} Save
              </button>
              <button type="button" onClick={() => { setExportState("success"); log("Editorial exported"); setTimeout(() => setExportState("idle"), 2000) }} className="flex items-center gap-1.5 rounded-full border border-[#f2e9d8]/20 px-3.5 py-2 text-xs font-medium text-[#f2e9d8]/80 hover:bg-[#f2e9d8]/10 focus-visible:ring-2 focus-visible:ring-[#f2e9d8]/50">
                {exportState === "success" ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <Download className="size-3.5" />} Export
              </button>
            </div>

            <section className="rounded-xl border border-[#f2e9d8]/10 bg-[#f2e9d8]/5 p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#f2e9d8]/40">Recent Operations</div>
              <ul className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="rounded-md bg-[#f2e9d8]/5 px-2.5 py-1.5 text-xs text-[#f2e9d8]/60">
                    <span className="mr-1.5 text-[#f2e9d8]/30">{a.time}</span>{a.label}
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
    <div className="rounded-xl border border-[#f2e9d8]/10 bg-[#f2e9d8]/5 p-3">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#f2e9d8]/40">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#f2e9d8]/15 bg-transparent px-2 py-1.5 text-sm text-[#f2e9d8] outline-none focus:border-[#f2e9d8]/40 focus:ring-2 focus:ring-[#f2e9d8]/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">{opt}</option>
        ))}
      </select>
    </div>
  )
}
