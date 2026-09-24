"use client"

import { Figtree, Red_Hat_Mono } from "next/font/google"
import { CircleAlert, Download, LoaderCircle, RotateCcw, Save, Wand2 } from "lucide-react"
import type { KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import {
  BRIEF_MAX,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ControlKey,
  type MuseStudio,
  type Option,
  type StudioSpec,
} from "./core"

const sans = Figtree({ subsets: ["latin"], display: "swap" })
const mono = Red_Hat_Mono({ subsets: ["latin"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "component-system",
  product: "Northline Coffee Subscription",
  brief:
    "Launch the Northline coffee subscription: two 250 g bags a month, roasted the Tuesday before they ship, with a different single farm each month. Convince people who already grind at home to stop buying supermarket beans ahead of the 3 November signup push.",
  audiences: [
    { id: "grinders", label: "Home grinders", hint: "own a burr grinder", size: 430000, lift: { ctr: 1.12, conversion: 1.14 } },
    { id: "cafe", label: "Café regulars", hint: "buy beans on the way out", size: 260000, lift: { ctr: 1.04, conversion: 1.2 } },
    { id: "gift", label: "Gift buyers", hint: "December shopping in November", size: 680000, lift: { ctr: 0.9, conversion: 0.88 } },
  ],
  channels: [
    { id: "email", label: "Email campaign", hint: "600 px, two columns", lift: { reach: 0.44, ctr: 1.6, conversion: 1.28 } },
    { id: "social", label: "Paid social", hint: "4:5 feed", lift: { reach: 1.26, ctr: 0.98 } },
    { id: "insert", label: "Bag insert", hint: "85 × 55 mm card", lift: { reach: 0.28, ctr: 1.2, conversion: 1.34 } },
  ],
  tones: [
    { id: "plain", label: "Plain", hint: "roast dates and farms", lift: { conversion: 1.06 } },
    { id: "curious", label: "Curious", hint: "tasting notes", lift: { ctr: 1.09 } },
    { id: "brisk", label: "Brisk", hint: "three sentences, done", lift: { ctr: 1.02, conversion: 1.02 } },
  ],
  styles: [
    { id: "paper", label: "Paper bag", hint: "kraft and ink", lift: { ctr: 1.04 } },
    { id: "counter", label: "Counter marble", hint: "cool grey and cream", lift: { conversion: 1.03 } },
    { id: "ledger", label: "Roast ledger", hint: "columns and dates", lift: { reach: 1.03, conversion: 1.02 } },
  ],
  variants: [
    {
      id: "A",
      name: "Roasted Tuesday",
      headline: "Roasted the Tuesday before it ships.",
      body: "Two 250 g bags a month, one single farm. Nothing sits in a warehouse for a season.",
      cta: "Start a subscription",
    },
    {
      id: "B",
      name: "New farm monthly",
      headline: "A different farm every month.",
      body: "Built for {audience} who want to taste the difference between a washed Ethiopian and a natural Brazilian.",
      cta: "See next month's farm",
      lift: { ctr: 1.1, conversion: 0.97 },
    },
    {
      id: "C",
      name: "Pause anytime",
      headline: "Skip a month whenever you like.",
      body: "Two clicks to pause, no calls. A {tone} subscription you can leave as easily as you joined.",
      cta: "Compare plans",
      lift: { reach: 1.04, conversion: 1.12 },
    },
  ],
  recent: [
    { id: "r1", title: "Single-origin gift box", variant: "C", when: "Fri" },
    { id: "r2", title: "Cold brew kit promo", variant: "B", when: "14 Sep" },
    { id: "r3", title: "Back-to-office beans", variant: "A", when: "1 Sep" },
  ],
  initialRun: 33,
}

const looks: Record<string, { bg: string; ink: string; sub: string; cta: string; ctaInk: string; extra: string }> = {
  paper: { bg: "#DCCBB0", ink: "#241E17", sub: "#483E32", cta: "#241E17", ctaInk: "#F6EFE4", extra: "#C0AA8A" },
  counter: { bg: "#E8E6E2", ink: "#1E2124", sub: "#4C5257", cta: "#1E2124", ctaInk: "#F4F3F1", extra: "#CFCCC6" },
  ledger: { bg: "#F4F1EA", ink: "#1E2124", sub: "#4C5257", cta: "#8A5A2B", ctaInk: "#FFFFFF", extra: "#E2DCCF" },
}

const frames: Record<string, { ratio: string; width: string; label: string }> = {
  email: { ratio: "3 / 4", width: "min(100%, 19rem)", label: "Email, 600 × 800" },
  social: { ratio: "4 / 5", width: "min(100%, 21rem)", label: "Feed, 1080 × 1350" },
  insert: { ratio: "85 / 55", width: "min(100%, 23rem)", label: "Insert card, 85 × 55 mm" },
}

const CONTROLS: { key: ControlKey; label: string; options: Option[] }[] = [
  { key: "audience", label: "Audience", options: spec.audiences },
  { key: "channel", label: "Channel", options: spec.channels },
  { key: "tone", label: "Tone", options: spec.tones },
  { key: "style", label: "Visual style", options: spec.styles },
]

const METRICS = [
  { key: "reach", label: "Reach", hint: "people who could see it" },
  { key: "ctr", label: "CTR", hint: "click-through on the call to action" },
  { key: "conversion", label: "Conversion", hint: "signups per 100 sessions" },
] as const

function summary(m: MuseStudio) {
  if (m.busy) return `Generating, ${m.stageLabel}, ${m.progress}%`
  if (m.generateStatus === "error") return "Generation failed"
  if (m.saveStatus === "saving") return "Saving"
  if (m.exportStatus === "exporting") return "Exporting"
  if (m.saveStatus === "saved") return `Saved route ${m.selected}`
  if (m.exportStatus === "exported") return `Exported route ${m.selected}`
  if (m.generateStatus === "success") return `Run ${m.output.run} generated`
  if (m.stale) return "Needs regenerating"
  return `Run ${m.output.run}, ${m.output.at}`
}

export default function ComponentSystem() {
  const m = useMuseStudio(spec)
  const length = m.settings.brief.trim().length
  const errors = [
    m.generateStatus === "error" ? m.generateError : null,
    m.saveStatus === "error" ? m.saveError : null,
    m.exportStatus === "error" ? m.exportError : null,
  ].filter((text): text is string => Boolean(text))

  return (
    <div className={`${sans.className} min-h-screen bg-[#F7F6F3] text-[#1E2124] antialiased`}>
      <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#DEDBD4] bg-white px-4 py-3 sm:px-6 lg:h-16 lg:flex-nowrap lg:py-0">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8A5A2B] text-[13px] font-semibold text-white">
            N
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-[-0.01em]" translate="no">
              {spec.product}
            </h1>
            <p className="truncate text-[12px] text-[#565B60]">
              Campaign studio · {m.modelName} · {m.chain}
            </p>
          </div>
        </div>

        <p role="status" aria-live="polite" className="order-last w-full text-[13px] text-[#565B60] lg:order-none lg:ml-4 lg:w-auto lg:flex-1">
          {summary(m)}
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <Button onClick={m.generate} disabled={m.busy} className="min-h-10">
            {m.busy ? <LoaderCircle className="animate-spin motion-reduce:animate-none" data-icon="inline-start" /> : <Wand2 data-icon="inline-start" />}
            Generate
          </Button>
          <Button variant="outline" onClick={m.save} disabled={m.saveStatus === "saving"} className="min-h-10">
            {m.saveStatus === "saving" ? <LoaderCircle className="animate-spin motion-reduce:animate-none" data-icon="inline-start" /> : <Save data-icon="inline-start" />}
            Save
          </Button>
          <Button variant="outline" onClick={() => m.exportCampaign()} disabled={m.exportStatus === "exporting"} className="min-h-10">
            {m.exportStatus === "exporting" ? <LoaderCircle className="animate-spin motion-reduce:animate-none" data-icon="inline-start" /> : <Download data-icon="inline-start" />}
            Export
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)_19rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-[14px]">Brief</CardTitle>
              <CardDescription>Ctrl or ⌘ + Enter generates.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <label htmlFor="cs-brief" className="sr-only">
                Launch brief
              </label>
              <Textarea
                id="cs-brief"
                name="brief"
                rows={5}
                value={m.settings.brief}
                onChange={(event) => m.setBrief(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    m.generate()
                  }
                }}
                aria-invalid={m.issue ? true : undefined}
                aria-describedby="cs-brief-help"
                className="text-base lg:text-[14px]"
              />
              <div className="flex items-start justify-between gap-3 text-[12px]">
                <p id="cs-brief-help" className={`min-w-0 flex-1 ${m.issue ? "text-[#B3261E]" : "text-[#565B60]"}`}>
                  {m.issue ?? "Name the product, the reader and the deadline."}
                </p>
                <span className={`${mono.className} shrink-0 tabular-nums ${length > BRIEF_MAX ? "text-[#B3261E]" : "text-[#565B60]"}`}>
                  {length}/{BRIEF_MAX}
                </span>
              </div>
            </CardContent>
          </Card>

          {CONTROLS.map((control) => (
            <Card key={control.key} className="gap-3">
              <CardHeader>
                <CardTitle className="text-[14px]">{control.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Select value={m.settings[control.key]} onValueChange={(next) => m.setControl(control.key, String(next))}>
                  <SelectTrigger id={`cs-${control.key}`} className="min-h-11 w-full" aria-label={control.label}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{control.label}</SelectLabel>
                      {control.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 text-[12px] text-[#565B60]">
                    {control.options.find((option) => option.id === m.settings[control.key])?.hint}
                  </p>
                  {m.settings[control.key] !== m.output.settings[control.key] ? (
                    <Badge variant="secondary" className="shrink-0 text-[11px]">
                      Changed
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[13px] text-[#565B60]">
              <input type="checkbox" checked={m.failNext} onChange={(event) => m.setFailNext(event.target.checked)} className="size-4 accent-[#B3261E]" />
              Fail the next run (forecast outage)
            </label>
            <Button variant="ghost" size="sm" onClick={m.reset} className="min-h-10 text-[13px]">
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {errors.length > 0 ? (
            <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#E8C4C0] bg-[#FDF3F2] px-3.5 py-3 text-[13.5px] text-[#8C1D18]">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <div className="flex min-w-0 flex-col gap-1">
                {errors.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          ) : null}

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-[14px]">Routes</CardTitle>
              <CardDescription>Three drafts written from the same brief.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={m.selected} onValueChange={(value) => m.select(String(value) as "A" | "B" | "C")}>
                <TabsList className="grid w-full grid-cols-3">
                  {VARIANT_IDS.map((id) => (
                    <TabsTrigger key={id} value={id} className="min-h-10">
                      Route {id}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {VARIANT_IDS.map((id) => (
                  <TabsContent key={id} value={id} className="pt-2">
                    <p className="truncate text-[13.5px] text-[#565B60]">
                      {m.output.variants[id].name} · CTR {formatPercent(m.output.variants[id].metrics.ctr)}
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-[14px]">
                <span>
                  Preview, route {m.selected}
                  <span className="ml-1.5 font-normal text-[#565B60]">{m.current.name}</span>
                </span>
                {m.stale ? <Badge variant="outline">Out of date</Badge> : null}
              </CardTitle>
              <CardDescription>Simulated forecast. Nothing here is published.</CardDescription>
            </CardHeader>
            <CardContent>
              {m.busy ? (
                <div className="flex flex-col gap-3" aria-hidden>
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-9 w-36" />
                </div>
              ) : (
                <div className="flex justify-center">
                  <Preview m={m} />
                </div>
              )}
              {m.stale && !m.busy ? (
                <p className="mt-2.5 text-[13px] text-[#8A5A2B]">
                  The preview shows run {m.output.run}. Generate again to apply the current controls.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-[14px]">Recent campaigns</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              {m.recent.map((item, index) => (
                <div key={item.id}>
                  {index > 0 ? <Separator /> : null}
                  <Button variant="ghost" onClick={() => m.restore(item)} className="h-auto min-h-11 w-full justify-start gap-3 px-2 py-2">
                    <span className={`${mono.className} flex size-7 shrink-0 items-center justify-center rounded-md bg-[#EFEDE8] text-[12px]`}>
                      {item.variant}
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-[13.5px]">{item.title}</span>
                      <span className="block text-[12px] text-[#565B60]">Restore · {item.when}</span>
                    </span>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-3 xl:col-start-3">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-[14px]">Forecast</CardTitle>
              <CardDescription>Simulated locally for planning only.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {METRICS.map((metric) => {
                const value = m.current.metrics[metric.key]
                const delta = formatDelta(value, m.previous?.metrics[metric.key], metric.key === "reach" ? "reach" : "percent")
                return (
                  <div key={metric.key} className="flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[13.5px] font-medium">{metric.label}</span>
                      <span className={`text-[15px] font-semibold tabular-nums ${m.busy ? "text-[#A9A49B]" : ""}`}>
                        {metric.key === "reach" ? formatReach(value) : formatPercent(value)}
                      </span>
                    </div>
                    {delta ? (
                      <span className={`${mono.className} text-[12px] tabular-nums ${delta.startsWith("−") ? "text-[#B3261E]" : "text-[#2F6B45]"}`}>
                        {delta} vs previous run
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#565B60]">{metric.hint}</span>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-[14px]">Run progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Progress value={m.busy ? m.progress : 100} aria-label="Generation progress" />
              <p className="text-[13px] text-[#565B60]">
                {m.busy ? `Stage ${m.stage + 1} of 4, ${m.stageLabel}` : `Run ${m.output.run} complete at ${m.output.at}.`}
              </p>
              <Separator />
              <ol className={`${mono.className} flex flex-col gap-1 text-[12px]`}>
                {m.log.slice(0, 5).map((entry) => (
                  <li key={entry.id} className="flex gap-2">
                    <span className="shrink-0 text-[#565B60] tabular-nums">{entry.at}</span>
                    <span className={`min-w-0 ${entry.tone === "error" ? "text-[#B3261E]" : entry.tone === "success" ? "text-[#2F6B45]" : ""}`}>
                      {entry.text}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <p className="text-[12px] leading-5 text-[#565B60]">
            Built with <span className="font-medium text-[#1E2124]">{m.modelName}</span> using {m.chain}.
          </p>
        </div>
      </main>
    </div>
  )
}

function Preview({ m }: { m: MuseStudio }) {
  const look = looks[m.output.settings.style] ?? looks.paper
  const frame = frames[m.output.settings.channel] ?? frames.email
  const v = m.current
  return (
    <article
      className="flex flex-col justify-between gap-4 overflow-hidden rounded-xl border border-black/5 p-5 shadow-[0_12px_28px_-20px_rgba(30,33,36,0.5)] [container-type:inline-size]"
      style={{ aspectRatio: frame.ratio, width: frame.width, background: look.bg, color: look.ink }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`${mono.className} rounded-full border px-2 py-0.5 text-[11px]`} style={{ borderColor: look.extra }}>
          {frame.label}
        </span>
        <span aria-hidden className="size-8 shrink-0 rounded-full" style={{ background: look.extra }} />
      </div>
      <p className="text-[clamp(1.1rem,7.2cqw,1.95rem)] leading-[1.05] font-semibold tracking-[-0.025em] text-balance">{v.headline}</p>
      <div className="flex flex-col gap-3">
        <p className="max-w-[42ch] text-[clamp(0.75rem,3.4cqw,0.95rem)] leading-[1.45]" style={{ color: look.sub }}>
          {v.body}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: look.cta, color: look.ctaInk }}>
            {v.cta}
          </span>
          <span className="text-[11.5px] font-semibold" translate="no">
            {spec.product}
          </span>
        </div>
      </div>
    </article>
  )
}
