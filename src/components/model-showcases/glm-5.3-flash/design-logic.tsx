"use client"

import { useState } from "react"

const AUDIENCES = ["Gallery openers", "Book-club regulars", "Slow-living readers"]
const CHANNELS = ["Print insert", "Newsletter", "Podcast read"]
const TONES = ["Reflective", "Wry", "Sincere"]
const STYLES = ["Letterpress", "Risograph", "Ink wash"]

const CONCEPTS = [
  {
    id: "A",
    name: "Marginalia",
    thesis: "A campaign that reads like a note left in a beloved book.",
    reach: 412,
    ctr: 2.8,
    conv: 4.1,
    ink: "#1a1a18",
    accent: "#b3432b",
  },
  {
    id: "B",
    name: "Second Printing",
    thesis: "The return of a classic, argued for in three short paragraphs.",
    reach: 388,
    ctr: 3.1,
    conv: 3.7,
    ink: "#20242c",
    accent: "#2f5d50",
  },
  {
    id: "C",
    name: "Colophon",
    thesis: "Craft-first storytelling that ends with the maker's mark.",
    reach: 356,
    ctr: 2.5,
    conv: 4.6,
    ink: "#2b2117",
    accent: "#8a6d3b",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function DesignLogic() {
  const [brief, setBrief] = useState(
    "Introduce Muse to independent bookshops as the campaign studio for considered, print-flavoured product launches."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Brief transcribed",
    "Premise accepted: craft over noise",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 5))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      log("Reasoning halted: brief incomplete")
      return
    }
    setPhase("loading")
    log(`Drafting argument for concept ${active.id}`)
    window.setTimeout(() => {
      setPhase("success")
      log("Argument complete, proof attached")
    }, 1500)
  }

  const steps = [
    { n: "01", t: "Brief", body: brief },
    { n: "02", t: "Audience & Channel", body: `${audience}, reached through ${channel.toLowerCase()}.` },
    { n: "03", t: "Voice", body: `Written in a ${tone.toLowerCase()} register, set in a ${style.toLowerCase()} treatment.` },
    { n: "04", t: "Concept", body: `${active.name} — ${active.thesis}` },
  ]

  const choice =
    "border px-3 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"

  return (
    <main className="min-h-screen bg-[#f6f3ec] font-serif text-[#1f1d19]">
      <header className="border-b border-[#1f1d19]/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-5 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="bg-[#1f1d19] px-2 py-0.5 font-sans text-xs font-bold tracking-widest text-[#f6f3ec]">GLM 5.3 Flash</span>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#1f1d19]/60">frontend-design</span>
          </div>
          <h1 className="text-xl italic sm:text-2xl">Muse — Campaign Studio</h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Left: numbered reasoning column */}
        <section aria-label="Campaign reasoning">
          <p className="mb-8 max-w-lg text-sm leading-relaxed text-[#1f1d19]/70">
            A campaign is an argument. Each step below states one premise; change any premise and
            the argument — and the plate on the right — must be re-set.
          </p>

          <ol className="space-y-8">
            {steps.map((s) => (
              <li key={s.n} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-t border-[#1f1d19]/15 pt-6">
                <span className="text-sm font-bold tabular-nums text-[#b3432b]">{s.n}</span>
                <div>
                  <h2 className="mb-2 text-base font-bold">{s.t}</h2>

                  {s.n === "01" ? (
                    <textarea
                      rows={3}
                      value={brief}
                      onChange={(e) => {
                        setBrief(e.target.value)
                        if (phase === "error") setPhase("idle")
                      }}
                      aria-label="Campaign brief"
                      className="w-full resize-none border-b border-[#1f1d19]/30 bg-transparent pb-2 text-sm leading-relaxed focus:border-[#b3432b] focus:outline-none"
                    />
                  ) : s.n === "02" ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {AUDIENCES.map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => {
                              setAudience(a)
                              log(`Audience revised: ${a}`)
                            }}
                            className={`${choice} ${
                              audience === a
                                ? "border-[#1f1d19] bg-[#1f1d19] text-[#f6f3ec]"
                                : "border-[#1f1d19]/30 text-[#1f1d19]/70 hover:border-[#1f1d19]/60"
                            } focus-visible:ring-[#b3432b]`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {CHANNELS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setChannel(c)
                              log(`Channel revised: ${c}`)
                            }}
                            className={`${choice} ${
                              channel === c
                                ? "border-[#1f1d19] bg-[#1f1d19] text-[#f6f3ec]"
                                : "border-[#1f1d19]/30 text-[#1f1d19]/70 hover:border-[#1f1d19]/60"
                            } focus-visible:ring-[#b3432b]`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : s.n === "03" ? (
                    <div className="flex flex-wrap gap-2">
                      {[...TONES, ...STYLES].map((opt) => {
                        const isTone = TONES.includes(opt)
                        const val = isTone ? tone : style
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              if (isTone) setTone(opt)
                              else setStyle(opt)
                              log(`${isTone ? "Tone" : "Style"} revised: ${opt}`)
                            }}
                            className={`${choice} ${
                              val === opt
                                ? "border-[#1f1d19] bg-[#1f1d19] text-[#f6f3ec]"
                                : "border-[#1f1d19]/30 text-[#1f1d19]/70 hover:border-[#1f1d19]/60"
                            } focus-visible:ring-[#b3432b]`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {CONCEPTS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setActiveId(c.id)
                            log(`Concept selected: ${c.name}`)
                          }}
                          aria-pressed={activeId === c.id}
                          className={`${choice} underline decoration-2 underline-offset-4 ${
                            activeId === c.id
                              ? "border-[#1f1d19] font-bold"
                              : "border-[#1f1d19]/30 text-[#1f1d19]/70 hover:border-[#1f1d19]/60"
                          } focus-visible:ring-[#b3432b]`}
                        >
                          {c.id}. {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[#1f1d19]/15 pt-6">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="border-2 border-[#1f1d19] bg-[#1f1d19] px-6 py-2.5 font-sans text-sm font-bold text-[#f6f3ec] transition-colors hover:bg-transparent hover:text-[#1f1d19] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3432b] disabled:cursor-wait disabled:opacity-50"
            >
              {phase === "loading" ? "Setting type…" : "Set the campaign"}
            </button>
            <button
              type="button"
              onClick={() => log("Proof filed to archive")}
              className="font-sans text-sm font-semibold underline underline-offset-4 hover:text-[#b3432b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3432b]"
            >
              Save proof
            </button>
            <button
              type="button"
              onClick={() => log("Plate exported for press (mock)")}
              className="font-sans text-sm font-semibold underline underline-offset-4 hover:text-[#b3432b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b3432b]"
            >
              Export plate
            </button>
          </div>

          {phase === "error" && (
            <p role="alert" className="mt-4 font-sans text-sm text-[#b3432b]">
              The brief is incomplete — state premise 01 before setting the campaign.
            </p>
          )}
          {phase === "success" && (
            <p role="status" className="mt-4 font-sans text-sm text-[#2f5d50]">
              Proof pulled. Concept {active.id} is ready for review.
            </p>
          )}
        </section>

        {/* Right: sticky printed plate */}
        <aside className="lg:sticky lg:top-10 lg:self-start" aria-label="Printed plate preview">
          <div
            className="border p-8 shadow-[6px_6px_0_rgba(31,29,25,0.12)] transition-colors duration-500"
            style={{ background: "#fbf9f4", borderColor: active.ink, color: active.ink }}
          >
            <p className="mb-6 flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: active.accent }}>
              <span>Muse · Plate {active.id}</span>
              <span>{style}</span>
            </p>
            <h3 className="text-3xl font-black leading-tight sm:text-4xl">{active.name}</h3>
            <p className="mt-4 text-sm leading-relaxed opacity-80">{active.thesis}</p>
            <div className="my-6 h-px w-full" style={{ background: active.accent }} />
            <dl className="grid grid-cols-3 gap-2 font-sans text-center">
              {(
                [
                  ["Reach", active.reach.toLocaleString()],
                  ["CTR", `${active.ctr.toFixed(1)}%`],
                  ["Conv.", `${active.conv.toFixed(1)}%`],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dd className="text-lg font-bold tabular-nums">{v}</dd>
                  <dt className="text-[10px] uppercase tracking-widest opacity-60">{k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-right font-sans text-[10px] uppercase tracking-[0.3em] opacity-50">
              {tone} · {channel} · {audience}
            </p>
          </div>

          <div className="mt-6 border-t border-[#1f1d19]/15 pt-4">
            <h2 className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#1f1d19]/60">
              Marginalia (activity)
            </h2>
            <ul className="space-y-1.5 text-xs italic leading-relaxed text-[#1f1d19]/70">
              {activity.map((a, i) => (
                <li key={`${a}-${i}`}>— {a}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
