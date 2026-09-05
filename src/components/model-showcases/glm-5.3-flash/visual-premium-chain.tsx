"use client"

import { useState } from "react"

const AUDIENCES = ["Watch collectors", "First fine-watch buyers", "Gift seekers"]
const CHANNELS = ["Print spread", "Boutique screening room", "Private mailing"]
const TONES = ["Ceremonial", "Intimate", "Assured"]
const STYLES = ["Midnight gilt", "Champagne mist", "Onyx minimal"]

const CONCEPTS = [
  {
    id: "A",
    name: "The Unveiling",
    line: "Some moments are measured in seconds. This one, in generations.",
    reach: 210,
    ctr: 2.7,
    conv: 5.1,
    gold: "#c9a227",
  },
  {
    id: "B",
    name: "Inherited Time",
    line: "Made to be handed down, not upgraded.",
    reach: 190,
    ctr: 3.0,
    conv: 4.6,
    gold: "#a67c52",
  },
  {
    id: "C",
    name: "Quiet Complication",
    line: "The loudest thing about it is what it says without speaking.",
    reach: 175,
    ctr: 2.4,
    conv: 5.6,
    gold: "#d4af37",
  },
]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualPremiumChain() {
  const [brief, setBrief] = useState(
    "Muse for a heritage watchmaker: the unveiling campaign for a limited anniversary timepiece."
  )
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [channel, setChannel] = useState(CHANNELS[0])
  const [tone, setTone] = useState(TONES[0])
  const [style, setStyle] = useState(STYLES[0])
  const [activeId, setActiveId] = useState("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [activity, setActivity] = useState([
    "Salon opened",
    "Guest list considered: Watch collectors",
  ])

  const active = CONCEPTS.find((c) => c.id === activeId) ?? CONCEPTS[0]

  function log(msg: string) {
    setActivity((p) => [msg, ...p].slice(0, 5))
  }

  function generate() {
    if (brief.trim().length < 12) {
      setPhase("error")
      return
    }
    setPhase("loading")
    log("Preparing the stage…")
    window.setTimeout(() => {
      setPhase("success")
      log(`Concept ${active.id} unveiled`)
    }, 1600)
  }

  const eyebrow = "text-[10px] uppercase tracking-[0.45em]"
  const choice = (on: boolean) =>
    `border px-3 py-1.5 text-xs tracking-wide transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]/70 ${
      on
        ? "border-[#c9a227] bg-[#c9a227]/10 text-[#e8cf7a]"
        : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
    }`

  return (
    <main className="min-h-screen bg-[#0b0b0d] text-neutral-200">
      {/* Salon header */}
      <header className="border-b border-neutral-800/80">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-5 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="border border-[#c9a227]/60 px-2 py-0.5 text-[11px] font-bold tracking-[0.25em] text-[#c9a227]">GLM 5.3 Flash</span>
            <span className={`${eyebrow} text-neutral-500`}>frontend-skill + taste-skill + impeccable</span>
          </div>
          <h1 className={`${eyebrow} text-neutral-300`}>Muse · Campaign Studio</h1>
        </div>
      </header>

      {/* The stage */}
      <section aria-label="Main creative preview" className="relative mx-auto max-w-5xl px-6 pt-14 sm:px-10">
        {phase === "loading" ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-sm border border-neutral-800/70 bg-gradient-to-b from-neutral-900/60 to-transparent">
            <div className="flex flex-col items-center gap-5">
              <span className="h-12 w-12 animate-spin rounded-full border border-neutral-700 border-t-[#c9a227]" />
              <p className={`${eyebrow} animate-pulse text-neutral-500`}>preparing the unveiling</p>
            </div>
          </div>
        ) : (
          <figure key={activeId} className="relative overflow-hidden rounded-sm border border-neutral-800/70 px-8 py-16 text-center sm:py-24"
            style={{ background: "radial-gradient(ellipse 90% 65% at 50% 30%, #17150f 0%, #0b0b0d 70%)" }}
          >
            {/* spotlight */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-72 w-[130%] -translate-x-1/2 opacity-20"
              style={{ background: `conic-gradient(from 180deg at 50% -10%, transparent 42%, ${active.gold} 50%, transparent 58%)` }}
              aria-hidden
            />
            {/* pedestal glow */}
            <div
              className="pointer-events-none absolute bottom-10 left-1/2 h-24 w-56 -translate-x-1/2 rounded-full blur-2xl transition-colors duration-1000"
              style={{ background: `${active.gold}33` }}
              aria-hidden
            />

            <figcaption className="relative z-10">
              <p className={`${eyebrow} mb-6`} style={{ color: active.gold }}>
                Concept {active.id} — {active.name}
              </p>
              <blockquote className="mx-auto max-w-xl font-serif text-2xl leading-relaxed text-neutral-100 sm:text-[34px] sm:leading-snug">
                “{active.line}”
              </blockquote>
              <div className="mx-auto my-8 flex max-w-xs items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-neutral-800" />
                <span className="h-2 w-2 rotate-45 border" style={{ borderColor: active.gold }} />
                <span className="h-px flex-1 bg-neutral-800" />
              </div>
              <p className={`${eyebrow} text-neutral-500`}>
                {tone} · {channel} · {style}
              </p>

              {phase === "success" && (
                <span className="mt-8 inline-block border border-emerald-800/60 bg-emerald-950/40 px-4 py-1.5 text-xs font-medium tracking-widest text-emerald-400">
                  ✓ UNVEILED
                </span>
              )}
              {phase === "error" && (
                <span role="alert" className="mt-8 inline-block border border-red-900/60 bg-red-950/40 px-4 py-1.5 text-xs font-medium tracking-widest text-red-400">
                  ✗ THE BRIEF NEEDS MORE CEREMONY
                </span>
              )}
            </figcaption>
          </figure>
        )}

        {/* Plaque metrics */}
        <dl className="mx-auto mt-6 grid max-w-2xl grid-cols-3 divide-x divide-neutral-800/70 border border-neutral-800/70 bg-neutral-900/40 text-center">
          {(
            [
              ["Reach", active.reach.toLocaleString()],
              ["CTR", `${active.ctr.toFixed(1)}%`],
              ["Conversion", `${active.conv.toFixed(1)}%`],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="px-2 py-5 transition-colors hover:bg-neutral-900">
              <dd className="font-serif text-2xl tabular-nums" style={{ color: active.gold }}>{v}</dd>
              <dt className={`${eyebrow} mt-1.5 text-neutral-500`}>{k}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Private viewing controls */}
      <section aria-label="Controls and actions" className="mx-auto max-w-5xl space-y-7 px-6 py-12 sm:px-10">
        <label htmlFor="p-brief" className={`${eyebrow} block text-neutral-500`}>
          The brief
        </label>
        <textarea
          id="p-brief"
          rows={2}
          value={brief}
          onChange={(e) => {
            setBrief(e.target.value)
            if (phase === "error") setPhase("idle")
          }}
          className="w-full resize-none border border-neutral-800 bg-transparent p-4 font-serif text-base italic leading-relaxed placeholder:text-neutral-600 focus:border-[#c9a227]/60 focus:outline-none focus:ring-1 focus:ring-[#c9a227]/30"
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
            <legend className={`${eyebrow} mb-2.5 text-neutral-500`}>{name}</legend>
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
                  className={choice(value === o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        {/* Concept plaques */}
        <div role="radiogroup" aria-label="Concepts" className="grid grid-cols-3 gap-3">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={activeId === c.id}
              onClick={() => {
                setActiveId(c.id)
                setPhase("idle")
                log(`Moved to ${c.name}`)
              }}
              className={`group border p-4 text-left transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]/60 ${
                activeId === c.id ? "border-[#c9a227]/70 bg-[#c9a227]/5" : "border-neutral-800 hover:border-neutral-600"
              }`}
            >
              <span className={`${eyebrow} block text-neutral-500`}>No. {c.id}</span>
              <span className="mt-1 block truncate font-serif text-base">{c.name}</span>
              <span className="mt-2 block h-px w-full origin-left transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: c.gold, transform: activeId === c.id ? "scaleX(1)" : "scaleX(0.2)" }}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <button
            type="button"
            onClick={generate}
            disabled={phase === "loading"}
            className="border border-[#c9a227] bg-[#c9a227]/10 px-10 py-3 text-sm font-semibold tracking-[0.2em] text-[#e8cf7a] transition hover:bg-[#c9a227] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] disabled:cursor-wait disabled:opacity-50"
          >
            {phase === "loading" ? "UNVEILING…" : "UNVEIL"}
          </button>
          <button
            type="button"
            onClick={() => log("Placed in the vault")}
            className="text-sm tracking-wide text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => log("Sent to atelier (mock)")}
            className="text-sm tracking-wide text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
          >
            Export
          </button>
        </div>

        <ul aria-label="Activity" className="space-y-1.5 border-t border-neutral-800/70 pt-5 text-xs text-neutral-500">
          {activity.map((a, i) => (
            <li key={`${a}-${i}`} className="flex gap-3">
              <span style={{ color: i === 0 ? active.gold : undefined }}>◆</span>
              {a}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
