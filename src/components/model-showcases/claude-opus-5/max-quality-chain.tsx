"use client"

import { useEffect, useRef, useState } from "react"
import { CornerDownLeft, Download, Save, Search } from "lucide-react"

import { useMuse, type MuseSpec, type ConceptId, type ControlKey } from "./core"

const spec: MuseSpec = {
  chain: "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable",
  brief:
    "Take Ferrous, a cast-iron skillet pre-seasoned in the foundry, to cooks who inherited one and are afraid to use it wrong.",
  controls: {
    audiences: ["Nervous inheritors", "Grill cooks", "Culinary students"],
    channels: ["Recipe site", "Cookware aisle", "Video course"],
    tones: ["Coaching", "Unfussy", "Confident"],
    styles: ["Foundry dark", "Kitchen daylight", "Iron blue"],
  },
  concepts: [
    {
      id: "A",
      name: "You Can't Ruin It",
      headline: "Almost nothing you do to it is permanent.",
      sub: "Permission route dismantling the fear of misuse.",
      reach: 412,
      ctr: 5.1,
      conv: 6.0,
    },
    {
      id: "B",
      name: "Seasoned in the Foundry",
      headline: "Seasoned before it left the foundry floor.",
      sub: "Process route removing the setup ritual.",
      reach: 372,
      ctr: 5.3,
      conv: 5.7,
    },
    {
      id: "C",
      name: "Second Generation",
      headline: "Built to be handed down twice.",
      sub: "Inheritance route mirroring how people got theirs.",
      reach: 448,
      ctr: 4.6,
      conv: 5.3,
    },
  ],
  activity: ["Palette bound to Ctrl+K", "Split canvas mounted"],
}

type Command = {
  id: string
  label: string
  group: string
  run: () => void
}

export default function MaxQualityChain() {
  const m = useMuse(spec)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setQuery("")
        setOpen((value) => !value)
      }
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  const openPalette = () => {
    setQuery("")
    setOpen(true)
  }

  const closePalette = () => {
    setQuery("")
    setOpen(false)
  }

  const commands: Command[] = [
    ...(["A", "B", "C"] as ConceptId[]).map((id) => ({
      id: `route-${id}`,
      group: "Routes",
      label: `Select route ${id} · ${spec.concepts.find((c) => c.id === id)?.name ?? ""}`,
      run: () => m.selectConcept(id),
    })),
    ...(
      [
        ["audience", spec.controls.audiences],
        ["channel", spec.controls.channels],
        ["tone", spec.controls.tones],
        ["style", spec.controls.styles],
      ] as [ControlKey, string[]][]
    ).flatMap(([key, options]) =>
      options.map((option) => ({
        id: `${key}-${option}`,
        group: key[0].toUpperCase() + key.slice(1),
        label: `Set ${key} to ${option}`,
        run: () => m.setControl(key, option),
      }))
    ),
    { id: "generate", group: "Actions", label: "Generate forecast", run: m.generate },
    { id: "save", group: "Actions", label: "Save draft", run: m.save },
    { id: "export", group: "Actions", label: "Export campaign", run: m.exportCampaign },
  ]

  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase())
  )

  const run = (command: Command) => {
    command.run()
    closePalette()
  }

  return (
    <main className="min-h-screen bg-[#0d0f12] text-[#e8ebef]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-8">
        <header className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Muse</span>
          <span className="rounded bg-[#e8ebef] px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#0d0f12] uppercase">
            {m.modelName}
          </span>
          <span className="max-w-full truncate rounded border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/55">
            {m.chain}
          </span>
          <button
            type="button"
            onClick={openPalette}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            <Search className="size-3.5" aria-hidden />
            Command palette
            <kbd className="rounded border border-white/20 px-1 font-mono text-[10px]">Ctrl K</kbd>
          </button>
        </header>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="flex min-h-[22rem] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-6 sm:p-9">
            <div>
              <p className="font-mono text-[10px] tracking-[0.26em] text-white/45 uppercase">
                Route {m.concept.id} · {m.concept.name}
              </p>
              <h1 className="mt-4 text-[2rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-[2.9rem]">
                {m.concept.headline}
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                {m.concept.sub}
              </p>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
              {[
                ["Reach", `${m.metrics.reach}K`],
                ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                    {label}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums sm:text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="space-y-4 rounded-2xl border border-white/10 p-5 sm:p-7">
            <label className="block">
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                Brief
              </span>
              <textarea
                value={m.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                rows={4}
                className="mt-1.5 w-full resize-y rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs leading-relaxed outline-none focus-visible:border-white/55"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["audience", "Audience", spec.controls.audiences, m.audience],
                  ["channel", "Channel", spec.controls.channels, m.channel],
                  ["tone", "Tone", spec.controls.tones, m.tone],
                  ["style", "Style", spec.controls.styles, m.style],
                ] as const
              ).map(([key, label, options, value]) => (
                <label key={key} className="block">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
                    {label}
                  </span>
                  <select
                    value={value}
                    onChange={(event) => m.setControl(key, event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs outline-none focus-visible:border-white/55 [&>option]:text-neutral-900"
                  >
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={m.generate}
                disabled={m.phase === "loading"}
                className="relative w-full overflow-hidden rounded-lg bg-[#e8ebef] px-3 py-2.5 text-xs font-bold tracking-[0.14em] text-[#0d0f12] uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none disabled:opacity-55"
              >
                {m.phase === "loading" ? (
                  <span
                    className="absolute inset-y-0 left-0 bg-black/15 transition-all duration-200"
                    style={{ width: `${m.progress}%` }}
                    aria-hidden
                  />
                ) : null}
                <span className="relative">
                  {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
                </span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={m.save}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                >
                  <Save className="size-3" aria-hidden />
                  {m.saved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={m.exportCampaign}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-2 py-2 text-[11px] font-semibold transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                >
                  <Download className="size-3" aria-hidden />
                  {m.exported ? "Exported" : "Export"}
                </button>
              </div>
              <p
                role="status"
                className={
                  m.phase === "error"
                    ? "rounded-lg border border-rose-400/40 bg-rose-500/10 px-2.5 py-2 text-[11px] font-medium text-rose-300"
                    : m.phase === "success"
                      ? "rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-2 text-[11px] font-medium text-emerald-300"
                      : "px-0.5 text-[11px] text-white/45"
                }
              >
                {m.phase === "error"
                  ? "Brief needs more substance before a forecast can run."
                  : m.phase === "success"
                    ? "Forecast rebuilt for the selected route."
                    : m.phase === "loading"
                      ? "Sampling routes."
                      : `Draft r${m.revision}. Ctrl+K drives every control.`}
              </p>
            </div>
          </section>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="grid gap-3 sm:grid-cols-3">
            {spec.concepts.map((concept) => {
              const on = m.conceptId === concept.id
              return (
                <button
                  key={concept.id}
                  type="button"
                  onClick={() => m.selectConcept(concept.id)}
                  aria-pressed={on}
                  className={
                    on
                      ? "rounded-xl border border-white/40 bg-white/10 p-3.5 text-left"
                      : "rounded-xl border border-white/10 p-3.5 text-left transition-colors hover:border-white/30 hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                  }
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    Route {concept.id}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">{concept.name}</span>
                  <span className="mt-1 block text-[11px] leading-snug text-white/55">
                    {concept.sub}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <h2 className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Activity
            </h2>
            <ol className="mt-2.5 space-y-1.5">
              {m.log.map((entry, index) => (
                <li
                  key={`${entry}-${index}`}
                  className="flex gap-2 text-[11px] leading-snug text-white/55"
                >
                  <span className="font-mono text-white/25">
                    {String(m.log.length - index).padStart(2, "0")}
                  </span>
                  {entry}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-[12vh]">
          <button
            type="button"
            aria-label="Close command palette"
            onClick={closePalette}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-label="Command palette"
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-[#14171b] shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
              <Search className="size-4 shrink-0 text-white/40" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && filtered[0]) {
                    run(filtered[0])
                  }
                }}
                placeholder="Search routes, controls, actions…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
              />
              <kbd className="hidden shrink-0 items-center gap-1 rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/40 sm:flex">
                <CornerDownLeft className="size-2.5" aria-hidden />
                run
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-1.5">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-white/40">No matches.</li>
              ) : (
                filtered.map((command, index) => (
                  <li key={command.id}>
                    <button
                      type="button"
                      onClick={() => run(command)}
                      className={
                        index === 0
                          ? "flex w-full items-center gap-3 bg-white/10 px-3 py-2 text-left text-xs"
                          : "flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.07] focus-visible:bg-white/10 focus-visible:outline-none"
                      }
                    >
                      <span className="w-16 shrink-0 font-mono text-[10px] tracking-wider text-white/35 uppercase">
                        {command.group}
                      </span>
                      <span className="truncate">{command.label}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </main>
  )
}

