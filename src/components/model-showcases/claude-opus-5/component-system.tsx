"use client"

import { useState } from "react"
import { Download, Layers, Save } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { useMuse, type MuseSpec } from "./core"

const spec: MuseSpec = {
  chain: "shadcn-best-practices / shadcn",
  brief:
    "Launch Foundry Kit, a set of enamel cookware, to home cooks who own one good pan and nothing else that matches it.",
  controls: {
    audiences: ["First-kitchen cooks", "Wedding registries", "Batch cookers"],
    channels: ["Marketplace", "Recipe partnership", "Store display"],
    tones: ["Steady", "Friendly", "Precise"],
    styles: ["Neutral system", "Warm cream", "Slate"],
  },
  concepts: [
    {
      id: "A",
      name: "Matching Set",
      headline: "The rest of the kitchen, finally in agreement.",
      sub: "Cohesion route positioning the range as a system.",
      reach: 418,
      ctr: 4.6,
      conv: 5.4,
    },
    {
      id: "B",
      name: "Oven to Table",
      headline: "Bake in it. Serve from it. Skip a dish.",
      sub: "Utility route built on a single behaviour change.",
      reach: 372,
      ctr: 5.2,
      conv: 6.0,
    },
    {
      id: "C",
      name: "Twenty Years",
      headline: "Enamel that outlives the recipe book.",
      sub: "Durability route leaning on material longevity.",
      reach: 446,
      ctr: 4.2,
      conv: 5.1,
    },
  ],
  activity: ["Library loaded", "Tokens resolved"],
}

export default function ComponentSystem() {
  const m = useMuse(spec)
  const [campaignName, setCampaignName] = useState("Foundry Kit · Launch")

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <header className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Layers className="size-4" aria-hidden />
            Muse
          </span>
          <Badge>{m.modelName}</Badge>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {m.chain}
          </Badge>
          <Badge
            variant={
              m.phase === "error"
                ? "destructive"
                : m.phase === "success"
                  ? "default"
                  : "outline"
            }
            className="ml-auto"
          >
            {m.phase === "loading" ? "Generating" : m.phase === "idle" ? "Draft" : m.phase === "success" ? "Ready" : "Needs detail"}
          </Badge>
        </header>

        <Separator className="my-5" />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Route {m.concept.id} · {m.concept.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="max-w-xl text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
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
                  <Progress value={m.progress} className="mt-5" aria-label="Generation progress" />
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button onClick={m.generate} disabled={m.phase === "loading"}>
                    {m.phase === "loading" ? "Generating…" : "Generate"}
                  </Button>
                  <Button variant="outline" onClick={m.save}>
                    <Save className="size-3.5" aria-hidden />
                    {m.saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" onClick={m.exportCampaign}>
                    <Download className="size-3.5" aria-hidden />
                    {m.exported ? "Exported" : "Export"}
                  </Button>
                </div>
                <p
                  role="status"
                  className={
                    m.phase === "error"
                      ? "mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
                      : m.phase === "success"
                        ? "mt-4 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium"
                        : "mt-4 text-xs text-muted-foreground"
                  }
                >
                  {m.phase === "error"
                    ? "Brief needs more substance before a forecast can run."
                    : m.phase === "success"
                      ? "Forecast rebuilt for the selected route."
                      : m.phase === "loading"
                        ? `Sampling routes… ${m.progress}%`
                        : "Draft state. Any control change updates the hero and metrics."}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-3">
              {spec.concepts.map((concept) => {
                const on = m.conceptId === concept.id
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => m.selectConcept(concept.id)}
                    aria-pressed={on}
                    className="rounded-xl text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Card
                      size="sm"
                      className={
                        on
                          ? "h-full ring-2 ring-primary"
                          : "h-full transition-shadow hover:ring-foreground/25"
                      }
                    >
                      <CardContent>
                        <Badge variant={on ? "default" : "secondary"}>{concept.id}</Badge>
                        <p className="mt-2 text-sm font-semibold">{concept.name}</p>
                        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                          {concept.sub}
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                )
              })}
            </div>
          </div>
          <aside className="space-y-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                    Name
                  </span>
                  <Input
                    value={campaignName}
                    onChange={(event) => setCampaignName(event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                    Brief
                  </span>
                  <Textarea
                    value={m.brief}
                    onChange={(event) => m.setBrief(event.target.value)}
                    rows={5}
                  />
                </label>
                {(
                  [
                    ["audience", "Audience", spec.controls.audiences, m.audience],
                    ["channel", "Channel", spec.controls.channels, m.channel],
                    ["tone", "Tone", spec.controls.tones, m.tone],
                    ["style", "Style", spec.controls.styles, m.style],
                  ] as const
                ).map(([key, label, options, value]) => (
                  <div key={key}>
                    <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
                      {label}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {options.map((option) => (
                        <Button
                          key={option}
                          size="sm"
                          variant={option === value ? "default" : "outline"}
                          onClick={() => m.setControl(key, option)}
                          aria-pressed={option === value}
                          className="h-7 px-2 text-[11px]"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                {[
                  ["Reach", `${m.metrics.reach}K`],
                  ["CTR", `${m.metrics.ctr.toFixed(1)}%`],
                  ["Conv", `${m.metrics.conv.toFixed(1)}%`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[10px] tracking-wider text-muted-foreground uppercase">
                      {label}
                    </div>
                    <div className="text-lg font-semibold tabular-nums">{value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {m.log.map((entry, index) => (
                    <li
                      key={`${entry}-${index}`}
                      className="text-[11px] leading-snug text-muted-foreground"
                    >
                      {entry}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}

