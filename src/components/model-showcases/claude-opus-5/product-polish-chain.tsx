"use client"

import { useState } from "react"
import { Check, Download, Gauge, Save, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable",
  brief:
    "Launch Ridgeway, an insulated commuter jacket rated to minus ten, to cyclists who currently layer three jackets badly.",
  controls: {
    audiences: ["Year-round cyclists", "Dog walkers", "Site supervisors"],
    channels: ["Bike shop", "Weather-triggered ads", "Outdoor press"],
    tones: ["Technical", "Blunt", "Encouraging"],
    styles: ["High-vis", "Muted technical", "Winter grey"],
  },
  concepts: [
    {
      id: "A",
      name: "One Layer",
      headline: "One jacket instead of the three you're wearing.",
      sub: "Simplification route aimed at the current workaround.",
      reach: 424,
      ctr: 4.8,
      conv: 5.6,
    },
    {
      id: "B",
      name: "Minus Ten",
      headline: "Rated to minus ten. Tested at minus fourteen.",
      sub: "Spec route that overshoots its own claim.",
      reach: 368,
      ctr: 5.4,
      conv: 6.1,
    },
    {
      id: "C",
      name: "Seen at Dusk",
      headline: "Visible from the side, where it matters.",
      sub: "Safety route focused on lateral visibility.",
      reach: 446,
      ctr: 4.5,
      conv: 5.2,
    },
  ],
  activity: ["Console ready", "Guidelines checklist attached"],
}

const panels = ["Copy", "Placement", "Metrics"] as const

export default function ProductPolishChain() {
  const m = useMuse(spec)
  const [panel, setPanel] = useState<(typeof panels)[number]>("Copy")
  const [name, setName] = useState("Ridgeway · Winter")

  const guidelines = [
    { label: "Brief long enough to forecast", ok: m.brief.trim().length >= 28 },
    { label: "Route chosen deliberately", ok: m.revision > 1 || m.conceptId !== "A" },
    { label: "Forecast current", ok: m.phase === "success" },
    { label: "Draft saved", ok: m.saved },
  ]
  const cleared = guidelines.filter((item) => item.ok).length

  return (
    <main className="min-h-screen bg-muted/40 text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-8">
        <div className="rounded-xl bg-card ring-1 ring-foreground/10">
          <header className="flex flex-wrap items-center gap-2 px-4 py-3">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="size-4" aria-hidden />
              Muse
            </span>
            <Badge>{m.modelName}</Badge>
            <Badge variant="secondary" className="max-w-[22rem] truncate font-mono text-[10px]">
              {m.chain}
            </Badge>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Gauge className="size-3.5" aria-hidden />
              {cleared}/4 guidelines
            </span>
          </header>

          <Separator />

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="min-w-0 p-4 sm:p-6">
              <div className="rounded-lg bg-gradient-to-br from-muted/70 to-transparent p-5 ring-1 ring-foreground/8 sm:p-8">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Route {m.concept.id} · {m.concept.name}
                </p>
                <h1 className="mt-3 max-w-xl text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
                  {m.concept.headline}
                </h1>
                <p className="mt-3 max-w-lg text-sm text-muted-foreground">{m.concept.sub}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {[m.audience, m.channel, m.tone, m.style].map((value) => (
                    <Badge key={value} variant="outline" className="text-[11px]">
                      {value}
                    </Badge>
                  ))}
                </div>
                {m.phase === "loading" ? (
                  <div className="mt-5 h-1 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
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
                          ? "rounded-lg bg-primary p-3 text-left text-primary-foreground"
                          : "rounded-lg bg-card p-3 text-left ring-1 ring-foreground/10 transition-all hover:ring-foreground/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      }
                    >
                      <span className="text-xs font-bold">
                        {concept.id} · {concept.name}
                      </span>
                      <span
                        className={
                          on
                            ? "mt-1 block text-[11px] leading-snug opacity-80"
                            : "mt-1 block text-[11px] leading-snug text-muted-foreground"
                        }
                      >
                        {concept.sub}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5">
                <div
                  className="flex gap-1 border-b border-foreground/10"
                  role="tablist"
                  aria-label="Detail panels"
                >
                  {panels.map((item) => (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={panel === item}
                      onClick={() => setPanel(item)}
                      className={
                        panel === item
                          ? "-mb-px border-b-2 border-primary px-3 py-2 text-xs font-semibold"
                          : "-mb-px border-b-2 border-transparent px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  {panel === "Copy" ? (
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        Campaign brief
                      </span>
                      <Textarea
                        value={m.brief}
                        onChange={(event) => m.setBrief(event.target.value)}
                        rows={5}
                      />
                      <span className="mt-1.5 block text-[11px] text-muted-foreground">
                        {m.brief.trim().length} characters
                      </span>
                    </label>
                  ) : null}

                  {panel === "Placement" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["audience", "Audience", spec.controls.audiences, m.audience],
                          ["channel", "Channel", spec.controls.channels, m.channel],
                          ["tone", "Tone", spec.controls.tones, m.tone],
                          ["style", "Visual style", spec.controls.styles, m.style],
                        ] as const
                      ).map(([key, label, options, value]) => (
                        <div key={key}>
                          <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            {label}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {options.map((option) => (
                              <Button
                                key={option}
                                size="sm"
                                variant={option === value ? "default" : "outline"}
                                aria-pressed={option === value}
                                onClick={() => m.setControl(key, option)}
                                className="h-7 px-2 text-[11px]"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {panel === "Metrics" ? (
                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        ["Reach", `${m.metrics.reach}K`],
                        ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                        ["Conversion", `${m.metrics.conv.toFixed(1)}%`],
                        ["Confidence", `${m.confidence}%`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg bg-muted/60 p-3">
                          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {label}
                          </div>
                          <div className="mt-0.5 text-xl font-semibold tabular-nums">{value}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <aside className="space-y-4 border-t border-foreground/10 p-4 sm:p-6 lg:border-t-0 lg:border-l">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Campaign name
                </span>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </label>

              <div>
                <h2 className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Guidelines
                </h2>
                <ul className="mt-2.5 space-y-2">
                  {guidelines.map((item) => (
                    <li key={item.label} className="flex items-start gap-2 text-[11px]">
                      <span
                        className={
                          item.ok
                            ? "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
                            : "mt-0.5 size-4 shrink-0 rounded-full ring-1 ring-foreground/25"
                        }
                      >
                        {item.ok ? <Check className="size-2.5" aria-hidden /> : null}
                      </span>
                      <span className={item.ok ? "text-muted-foreground line-through" : undefined}>
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  onClick={m.generate}
                  disabled={m.phase === "loading"}
                  className="w-full"
                >
                  {m.phase === "loading" ? `Generating ${m.progress}%` : "Generate"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={m.save} className="w-full">
                    <Save className="size-3.5" aria-hidden />
                    {m.saved ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={m.exportCampaign}
                    disabled={!m.saved}
                    className="w-full"
                  >
                    <Download className="size-3.5" aria-hidden />
                    {m.exported ? "Exported" : "Export"}
                  </Button>
                </div>
                <p
                  role="status"
                  className={
                    m.phase === "error"
                      ? "rounded-md bg-destructive/10 px-2.5 py-2 text-[11px] font-medium text-destructive ring-1 ring-destructive/25"
                      : m.phase === "success"
                        ? "rounded-md bg-primary/8 px-2.5 py-2 text-[11px] font-medium ring-1 ring-primary/25"
                        : "text-[11px] text-muted-foreground"
                  }
                >
                  {m.phase === "error"
                    ? "Brief needs more substance before a forecast can run."
                    : m.phase === "success"
                      ? `Forecast current for ${name}.`
                      : m.phase === "loading"
                        ? "Sampling routes."
                        : "Export unlocks once the draft is saved."}
                </p>
              </div>

              <div>
                <h2 className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Activity
                </h2>
                <ul className="mt-2 space-y-1.5">
                  {m.log.map((entry, index) => (
                    <li
                      key={`${entry}-${index}`}
                      className="text-[11px] leading-snug text-muted-foreground"
                    >
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

