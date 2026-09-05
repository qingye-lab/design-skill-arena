"use client"

import { useEffect, useRef, useState } from "react"

const AUDIENCES = ["Skate crews", "Street photographers", "Night-shift creatives"]
const CHANNELS = ["Guerrilla posters", "Short-form video", "Pop-up walls"]
const TONES = ["Rebellious", "Deadpan", "Uplifting"]
const STYLES = ["Risograph pop", "Xerox grain", "Chrome liquid"]

const CONCEPTS = [
  {
    id: "A",
    name: "Kickflip",
    line1: "Land it",
    line2: "loud.",
    reach: 880,
    ctr: 5.2,
    conv: 3.1,
    grad: "from-pink-500 via-rose-600 to-purple-800",
    spring: "spring-a",
  },
  {
    id: "B",
    name: "Long Exposure",
    line1: "Stay out",
    line2: "past dark.",
    reach: 790,
    ctr: 4.6,
    conv: 3.5,
    grad: "from-cyan-400 via-sky-600 to-indigo-900",
    spring: "spring-b",
  },
  {
    id: "C",
    name: "Static Bloom",
    line1: "Tune in,",
    line2: "glitch out.",
    reach: 950,
    ctr: 4.9,
    conv: 2.8,
    grad: "from-lime-400 via-emerald-600 to-teal-900",
    spring: "spring-c",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function MotionBits() {
  const [brief, setBrief] = useState(
    "Muse for a streetwear audio drop: high-energy launch campaign built for screens in motion."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [displayed, setDisplayed] = useState({ reach: 880, ctr: 5.2, conv: 3.1 })
  const [activity, setActivity] = useState(["Motion system armed", "Audience: Skate crews"])
  const raf = useRef<number | null>(null)

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  // Animated metric count-up on concept change
  useEffect(() => {
    const target = { reach: active.reach, ctr: active.ctr, conv: active.conv }
    const start = { ...displayed }
    const t0 = performance.now()
    function tick(now: number) {
      const p = Math.min((now - t0) / 500, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplayed({
        reach: Math.round(start.reach + (target.reach - start.reach) * e),
        ctr: +(start.ctr + (target.ctr - start.ctr) * e).toFixed(1),
        conv: +(start.conv + (target.conv - start.conv) * e).toFixed(1),
      })
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 5))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      return
    }
    setPhase("loading")
    log("Motion pass started")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} animated in`)
    }, 1500)
  }

  const pill = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
      on ? "scale-105 border-transparent bg-white text-black shadow-lg" : "border-white/25 text-white/70 hover:border-white/60 hover:text-white"
    }`

  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral-950 text-white">
      {/* Marquee header */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="animate-pulse rounded bg-lime-400 px-2 py-0.5 text-xs font-black text-black">GLM 5.3 Flash</span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">react-bits</span>
        </div>
        <h1 className="text-xs font-black uppercase tracking-[0.3em] sm:text-sm">Muse · Campaign Studio</h1>
      </header>

      {/* Hero stage */}
      <section aria-label="Main creative preview" className="relative px-4 pt-10 pb-6 sm:px-8">
        <div className={`relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br ${active.grad} p-8 transition-all duration-700 sm:p-16`}>
          {/* floating blobs */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 animate-bounce rounded-full bg-white/15 blur-2xl [animation-duration:3s]" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

          {phase === "loading" ? (
            <div key={active.spring} className="flex min-h-[260px] flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-xl border-4 border-white/30 border-t-white" />
              <p className="text-sm font-black uppercase tracking-[0.3em]">animating…</p>
            </div>
          ) : phase === "error" ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <p role="alert" className="rounded-2xl bg-black/60 px-6 py-4 text-center text-sm font-bold backdrop-blur">
                ✗ Brief too short — give the motion something to move.
              </p>
            </div>
          ) : (
            <div key={activeId} className={`relative min-h-[260px] ${phase === "success" ? "" : ""}`}>
              <p className="mb-3 inline-block rounded-full bg-black/30 px-3 py-1 text-[11px] font-black uppercase tracking-[0.25em] backdrop-blur">
                {tone} · {channel}
              </p>
              <h2 className="text-5xl font-black leading-[0.95] tracking-tighter drop-shadow-xl sm:text-8xl">
                <span className="block animate-[slidein_0.5s_ease-out]">{active.line1}</span>
                <span className="block italic animate-[slidein_0.7s_ease-out]">{active.line2}</span>
              </h2>
              <p className="mt-4 max-w-md text-sm font-medium text-white/85">{audience} · {style}</p>
              {phase === "success" && (
                <span className="mt-5 inline-block animate-[pop_0.4s_ease-out] rounded-full bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black">
                  ✓ rendered
                </span>
              )}
            </div>
          )}
        </div>

        {/* Live metrics bar */}
        <div className="mx-auto mt-4 grid max-w-5xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          {(
            [
              ["Reach", displayed.reach.toLocaleString()],
              ["CTR", `${displayed.ctr.toFixed(1)}%`],
              ["Conversion", `${displayed.conv.toFixed(1)}%`],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="px-3 py-4 text-center transition-transform duration-300 hover:scale-105">
              <p className="text-xl font-black tabular-nums sm:text-3xl">{v}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">{k}</p>
            </div>
          ))}
        </div>

        {/* Concept carousel */}
        <div className="mx-auto mt-4 flex max-w-5xl gap-3" role="radiogroup" aria-label="Concepts">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={activeId === c.id}
              onClick={() => {
                setActiveId(c.id)
                setPhase("idle")
                log(`Cut to ${c.name}`)
              }}
              className={`group flex-1 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                activeId === c.id ? `border-white/60 bg-gradient-to-br ${c.grad}` : "border-white/10 bg-white/5"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">{c.id}</span>
              <span className="mt-1 block truncate text-base font-black group-hover:tracking-wide">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-5xl space-y-5 px-4 pb-14 sm:px-8" aria-label="Controls and actions">
        <label htmlFor="m-brief" className="block text-[11px] font-black uppercase tracking-[0.25em] text-white/45">
          Brief
        </label>
        <textarea
          id="m-brief"
          rows={2}
          value={brief}
          onChange={(e) => {
            setBrief(e.target.value)
            if (phase === "error") setPhase("idle")
          }}
          className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed placeholder:text-white/30 transition focus:border-white/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        />

        {(
          [
            ["Audience", audience, AUDIENCES],
            ["Channel", channel, CHANNELS],
            ["Tone", tone, TONES],
            ["Style", style, STYLES],
          ] as const
        ).map(([name, value, opts]) => (
          <fieldset key={name}>
            <legend className="mb-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/45">{name}</legend>
            <div className="flex flex-wrap gap-2">
              {opts.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    if (name === "Audience") setAudience(o)
                    if (name === "Channel") setChannel(o)
                    if (name === "Tone") setTone(o)
                    if (name === "Style") setStyle(o)
                    log(`${name}: ${o}`)
                  }}
                  className={pill(value === o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={generate}
            disabled={phase === "loading"}
            className="rounded-full bg-lime-400 px-8 py-3 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-lime-400/25 transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 disabled:cursor-wait disabled:opacity-60"
          >
            {phase === "loading" ? "Animating…" : "Generate"}
          </button>
          <button
            type="button"
            onClick={() => log("Saved to reel")}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => log("Exported loop.mp4 (mock)")}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Export
          </button>
        </div>

        <ul aria-label="Activity" className="space-y-1 border-t border-white/10 pt-4 text-xs text-white/45">
          {activity.map((a, i) => (
            <li key={`${a}-${i}`} className={i === 0 ? "font-semibold text-white/75" : ""}>
              › {a}
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        @keyframes slidein { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes pop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </main>
  )
}
