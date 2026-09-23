"use client"

import { Source_Sans_3 } from "next/font/google"
import {
  AlertCircle,
  BarChart3,
  Check,
  Download,
  FolderOpen,
  Loader2,
  Mail,
  MonitorPlay,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
} from "lucide-react"
import type { KeyboardEvent } from "react"

import {
  BRIEF_MAX,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type StudioSpec,
  type VariantId,
} from "./core"

const sans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "standard-builder",
  product: "Halden Trail 2",
  brief:
    "Launch Halden Trail 2, a 248 g trail shoe with a recycled rock plate, for the spring race season. Drive pre-orders before the 14 March drop.",
  audiences: [
    { id: "racers", label: "Weekend racers", hint: "Signed up for a 25K+", size: 640000, lift: { conversion: 1.18 } },
    { id: "hikers", label: "Fast hikers", hint: "Day trips, light packs", size: 1120000, lift: { ctr: 0.92 } },
    { id: "road", label: "Road runners crossing over", hint: "First trail shoe", size: 880000, lift: { ctr: 1.08, conversion: 0.9 } },
  ],
  channels: [
    { id: "feed", label: "Instagram feed", lift: { reach: 1.15, ctr: 1 } },
    { id: "email", label: "Member email", lift: { reach: 0.42, ctr: 2.1, conversion: 1.3 } },
    { id: "retail", label: "In-store screen", lift: { reach: 0.7, ctr: 0.55, conversion: 1.1 } },
  ],
  tones: [
    { id: "direct", label: "Direct", lift: { ctr: 1.05 } },
    { id: "gritty", label: "Gritty", lift: { ctr: 1.12, conversion: 0.95 } },
    { id: "technical", label: "Technical", lift: { conversion: 1.1 } },
  ],
  styles: [
    { id: "dust", label: "Trail dust", lift: { ctr: 1.02 } },
    { id: "night", label: "Night run", lift: { ctr: 1.08 } },
    { id: "alpine", label: "Alpine", lift: { reach: 1.04 } },
  ],
  variants: [
    {
      id: "A",
      name: "Weight first",
      headline: "248 grams. Every climb.",
      body: "Halden Trail 2 drops 40 g and keeps the rock plate. Built for {audience} who count every step up.",
      cta: "Pre-order now",
      lift: { ctr: 1.06 },
    },
    {
      id: "B",
      name: "Race day",
      headline: "Your spring start line starts here.",
      body: "Reserve a pair before 14 March and race-test it on the first muddy weekend.",
      cta: "Reserve a pair",
      lift: { reach: 1.08, conversion: 0.94 },
    },
    {
      id: "C",
      name: "Made from the mountain",
      headline: "A rock plate made from old soles.",
      body: "62% recycled plate, same grip. A trail shoe you can feel good wearing out.",
      cta: "See how it's made",
      lift: { ctr: 0.94, conversion: 1.12 },
    },
  ],
  recent: [
    { id: "r1", title: "Winter Grip: last pairs", variant: "B", when: "Mon" },
    { id: "r2", title: "Halden Road 4 relaunch", variant: "A", when: "12 Feb" },
    { id: "r3", title: "Trail club referral", variant: "C", when: "3 Feb" },
  ],
  initialRun: 4,
}

const palettes: Record<string, { bg: string; ink: string; sub: string; accent: string }> = {
  dust: { bg: "#E9DFD1", ink: "#2A2118", sub: "#5E4D3B", accent: "#B4561E" },
  night: { bg: "#151A26", ink: "#F3F5FA", sub: "#A9B2C6", accent: "#F5C542" },
  alpine: { bg: "#DDEAF2", ink: "#0F2433", sub: "#3F5A6C", accent: "#1F6FB2" },
}

const channelIcon = { feed: Smartphone, email: Mail, retail: MonitorPlay } as const

export default function StandardBuilder() {
  const m = useMuseStudio(spec)
  const palette = palettes[m.output.settings.style] ?? palettes.dust
  const shownChannel = m.output.settings.channel as keyof typeof channelIcon

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, id: VariantId) {
    const index = VARIANT_IDS.indexOf(id)
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = VARIANT_IDS[(index + step + VARIANT_IDS.length) % VARIANT_IDS.length]
    m.select(next)
    document.getElementById(`sb-tab-${next}`)?.focus()
  }

  return (
    <div className={`${sans.className} min-h-screen bg-[#F5F6F8] text-[#16181D] selection:bg-[#2F5BEA]/20`}>
      <header className="sticky top-0 z-10 border-b border-[#E2E5EA] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-2.5">
            <svg aria-hidden viewBox="0 0 32 32" className="size-8">
              <rect width="32" height="32" rx="6" fill="#16181D" />
              <path d="M8 23V9l8 9 8-9v14" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round" />
              <circle cx="24" cy="23" r="2.4" fill="#2F5BEA" />
            </svg>
            <div className="leading-tight">
              <p className="text-[15px] font-bold">Muse Campaign Studio</p>
              <p className="text-xs text-[#5B6270]">Halden Trail 2 · Spring launch</p>
            </div>
          </div>
          <p className="order-last w-full text-xs text-[#5B6270] sm:order-none sm:ml-4 sm:w-auto">
            <span className="rounded border border-[#E2E5EA] px-1.5 py-0.5 font-semibold text-[#16181D]">{m.modelName}</span>
            <span className="mx-1.5">·</span>
            {m.chain}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={m.save}
              disabled={m.saveStatus === "saving"}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D3D8E0] bg-white px-3 text-sm font-semibold hover:bg-[#F0F2F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BEA] disabled:opacity-60"
            >
              {m.saveStatus === "saving" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : m.saveStatus === "saved" ? (
                <Check className="size-4 text-[#1F8A4C]" />
              ) : (
                <Save className="size-4" />
              )}
              {m.saveStatus === "saving" ? "Saving…" : m.saveStatus === "saved" ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => m.exportCampaign()}
              disabled={m.exportStatus === "exporting"}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#16181D] px-3 text-sm font-semibold text-white hover:bg-[#2B2F37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BEA] disabled:opacity-60"
            >
              {m.exportStatus === "exporting" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {m.exportStatus === "exported" ? "Exported" : "Export"}
            </button>
          </div>
        </div>
        {(m.saveError || m.exportError) && (
          <div role="alert" className="border-t border-[#F3C9C6] bg-[#FDF1F0] px-4 py-2 text-sm text-[#9E2620] lg:px-6">
            <div className="mx-auto flex max-w-[1440px] items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {m.exportError ?? m.saveError}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-4 p-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-6 xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        {/* Brief and targeting */}
        <section aria-labelledby="sb-brief-title" className="rounded-lg border border-[#E2E5EA] bg-white p-4 lg:row-span-2">
          <h2 id="sb-brief-title" className="text-sm font-bold">Brief and targeting</h2>
          <label htmlFor="sb-brief" className="mt-4 block text-sm font-semibold">
            Launch brief
          </label>
          <textarea
            id="sb-brief"
            value={m.settings.brief}
            onChange={(event) => m.setBrief(event.target.value)}
            rows={5}
            aria-invalid={m.generateStatus === "error" && !!m.issue}
            aria-describedby="sb-brief-help"
            className="mt-1.5 w-full resize-y rounded-md border border-[#D3D8E0] bg-white px-3 py-2 text-sm leading-relaxed outline-none hover:border-[#AEB5C1] focus-visible:border-[#2F5BEA] focus-visible:ring-3 focus-visible:ring-[#2F5BEA]/20 aria-invalid:border-[#C8322B]"
          />
          <p id="sb-brief-help" className={`mt-1 text-xs ${m.issue ? "text-[#9E2620]" : "text-[#5B6270]"}`}>
            {m.issue ?? `${m.settings.brief.trim().length} / ${BRIEF_MAX} characters`}
          </p>

          <label htmlFor="sb-audience" className="mt-4 block text-sm font-semibold">
            Audience
          </label>
          <select
            id="sb-audience"
            value={m.settings.audience}
            onChange={(event) => m.setControl("audience", event.target.value)}
            className="mt-1.5 h-10 w-full rounded-md border border-[#D3D8E0] bg-white px-2.5 text-sm hover:border-[#AEB5C1] focus-visible:border-[#2F5BEA] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2F5BEA]/20"
          >
            {spec.audiences.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} ({option.hint})
              </option>
            ))}
          </select>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Channel</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-md bg-[#EEF0F3] p-1">
              {spec.channels.map((option) => {
                const Icon = channelIcon[option.id as keyof typeof channelIcon]
                return (
                  <label key={option.id} className="relative">
                    <input
                      type="radio"
                      name="sb-channel"
                      value={option.id}
                      checked={m.settings.channel === option.id}
                      onChange={() => m.setControl("channel", option.id)}
                      className="peer sr-only"
                    />
                    <span className="flex h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded text-center text-xs font-semibold text-[#5B6270] hover:text-[#16181D] peer-checked:bg-white peer-checked:text-[#16181D] peer-checked:shadow-[0_1px_2px_rgba(22,24,29,0.12)] peer-focus-visible:outline-2 peer-focus-visible:outline-[#2F5BEA]">
                      <Icon className="size-4" aria-hidden />
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Tone</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {spec.tones.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="sb-tone"
                    value={option.id}
                    checked={m.settings.tone === option.id}
                    onChange={() => m.setControl("tone", option.id)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex h-9 cursor-pointer items-center rounded-full border border-[#D3D8E0] px-3.5 text-sm hover:border-[#AEB5C1] peer-checked:border-[#2F5BEA] peer-checked:bg-[#EDF1FD] peer-checked:font-semibold peer-checked:text-[#1D43C4] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F5BEA]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-sm font-semibold">Visual style</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {spec.styles.map((option) => {
                const swatch = palettes[option.id]
                return (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name="sb-style"
                      value={option.id}
                      checked={m.settings.style === option.id}
                      onChange={() => m.setControl("style", option.id)}
                      className="peer sr-only"
                    />
                    <span className="block cursor-pointer rounded-md border border-[#D3D8E0] p-1.5 text-xs hover:border-[#AEB5C1] peer-checked:border-[#2F5BEA] peer-checked:ring-2 peer-checked:ring-[#2F5BEA]/25 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2F5BEA]">
                      <span aria-hidden className="flex h-8 overflow-hidden rounded" style={{ background: swatch.bg }}>
                        <span className="m-auto h-2 w-8 rounded-full" style={{ background: swatch.accent }} />
                      </span>
                      <span className="mt-1 block text-center font-semibold">{option.label}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-5 border-t border-[#E2E5EA] pt-4">
            <button
              type="button"
              onClick={m.generate}
              disabled={m.busy}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2F5BEA] text-sm font-bold text-white hover:bg-[#244BD0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BEA] disabled:cursor-progress disabled:bg-[#6F8CEF]"
            >
              {m.busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {m.busy ? `${m.stageLabel}…` : m.stale ? "Generate with new settings" : "Generate again"}
            </button>
            <label className="mt-3 flex items-center gap-2 text-xs text-[#5B6270]">
              <input
                type="checkbox"
                checked={m.failNext}
                onChange={(event) => m.setFailNext(event.target.checked)}
                className="size-4 accent-[#2F5BEA]"
              />
              Simulate a forecast outage on the next run
            </label>
            <div aria-live="polite" className="mt-3 text-sm">
              {m.generateStatus === "error" && (
                <p role="alert" className="flex items-start gap-2 rounded-md bg-[#FDF1F0] p-2.5 text-[#9E2620]">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {m.generateError}
                </p>
              )}
              {m.generateStatus === "success" && (
                <p className="flex items-center gap-2 rounded-md bg-[#EAF6EF] p-2.5 text-[#17693A]">
                  <Check className="size-4" /> Run {m.output.run} is ready. Compare the three routes on the right.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Preview */}
        <section aria-labelledby="sb-preview-title" className="min-w-0 rounded-lg border border-[#E2E5EA] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E5EA] px-4 py-3">
            <div>
              <h2 id="sb-preview-title" className="text-sm font-bold">Preview</h2>
              <p className="text-xs text-[#5B6270]">
                Run {m.output.run} · {m.labelOf("channel", m.output.settings.channel)} · generated {m.output.at}
              </p>
            </div>
            <div role="tablist" aria-label="Campaign route" className="flex rounded-md border border-[#D3D8E0] p-0.5">
              {VARIANT_IDS.map((id) => (
                <button
                  key={id}
                  id={`sb-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={m.selected === id}
                  aria-controls="sb-preview-panel"
                  tabIndex={m.selected === id ? 0 : -1}
                  onClick={() => m.select(id)}
                  onKeyDown={(event) => onTabKey(event, id)}
                  className="h-11 rounded px-3 text-sm font-semibold text-[#5B6270] hover:bg-[#F0F2F5] hover:text-[#16181D] focus-visible:outline-2 focus-visible:outline-[#2F5BEA] aria-selected:bg-[#16181D] aria-selected:text-white sm:h-8"
                >
                  {id} <span className="hidden font-normal sm:inline">· {m.output.variants[id].name}</span>
                </button>
              ))}
            </div>
          </div>

          <div id="sb-preview-panel" role="tabpanel" aria-labelledby={`sb-tab-${m.selected}`} className="relative p-4 sm:p-6">
            {m.stale && !m.busy && (
              <p className="mb-3 flex items-center gap-2 rounded-md border border-[#F1D9A6] bg-[#FFF8E8] px-3 py-2 text-xs text-[#7A5410]">
                <RotateCcw className="size-3.5" /> Settings changed since run {m.output.run}. Generate to refresh this preview.
              </p>
            )}
            <div className={`transition-opacity ${m.busy ? "opacity-40" : ""}`}>
              <AdPreview channel={shownChannel} palette={palette} variant={m.current} product={spec.product} />
            </div>
            {m.busy && (
              <div className="absolute inset-x-4 top-4 sm:inset-x-6 sm:top-6">
                <div className="h-1 overflow-hidden rounded-full bg-[#E2E5EA]">
                  <div className="h-full rounded-full bg-[#2F5BEA] transition-[width] duration-300" style={{ width: `${m.progress}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-[#2F5BEA]">{m.stageLabel}…</p>
              </div>
            )}
          </div>
        </section>

        {/* Metrics */}
        <section aria-labelledby="sb-metrics-title" className="rounded-lg border border-[#E2E5EA] bg-white p-4 xl:row-span-2">
          <div className="flex items-baseline justify-between">
            <h2 id="sb-metrics-title" className="text-sm font-bold">Forecast</h2>
            <span className="text-xs text-[#5B6270]">Simulated · route {m.selected}</span>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 xl:grid-cols-1">
            {(
              [
                ["Reach", formatReach(m.current.metrics.reach), formatDelta(m.current.metrics.reach, m.previous?.metrics.reach, "reach")],
                ["CTR", formatPercent(m.current.metrics.ctr), formatDelta(m.current.metrics.ctr, m.previous?.metrics.ctr, "percent")],
                [
                  "Conversion",
                  formatPercent(m.current.metrics.conversion),
                  formatDelta(m.current.metrics.conversion, m.previous?.metrics.conversion, "percent"),
                ],
              ] as const
            ).map(([label, value, delta]) => (
              <div key={label} className="rounded-md border border-[#E2E5EA] p-3">
                <dt className="text-xs font-semibold text-[#5B6270]">{label}</dt>
                <dd className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xl font-bold tabular-nums xl:text-2xl">{value}</span>
                  {delta && (
                    <span className={`text-xs font-semibold tabular-nums ${delta.startsWith("−") ? "text-[#B0341F]" : "text-[#1F8A4C]"}`}>
                      {delta}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#5B6270]">
            <BarChart3 className="size-3.5" /> CTR by route
          </h3>
          <ul className="mt-2 space-y-2">
            {VARIANT_IDS.map((id) => {
              const variant = m.output.variants[id]
              const max = Math.max(...VARIANT_IDS.map((key) => m.output.variants[key].metrics.ctr))
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => m.select(id)}
                    aria-pressed={m.selected === id}
                    className="group flex w-full flex-col justify-center rounded text-left min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BEA] sm:min-h-0"
                  >
                    <span className="flex justify-between text-xs">
                      <span className="font-semibold group-hover:underline">
                        {id} · {variant.name}
                      </span>
                      <span className="tabular-nums">{formatPercent(variant.metrics.ctr)}</span>
                    </span>
                    <span className="mt-1 block h-2 rounded-full bg-[#EEF0F3]">
                      <span
                        className={`block h-full rounded-full ${m.selected === id ? "bg-[#2F5BEA]" : "bg-[#AEB5C1]"}`}
                        style={{ width: `${(variant.metrics.ctr / max) * 100}%` }}
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <h3 className="mt-6 text-xs font-bold text-[#5B6270]">Activity</h3>
          <ol className="mt-2 space-y-2 text-xs">
            {m.log.slice(0, 5).map((entry) => (
              <li key={entry.id} className="flex gap-2">
                <span className="w-9 shrink-0 tabular-nums text-[#5B6270]">{entry.at}</span>
                <span className={entry.tone === "error" ? "text-[#9E2620]" : entry.tone === "success" ? "text-[#17693A]" : ""}>
                  {entry.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Recent campaigns */}
        <section aria-labelledby="sb-recent-title" className="min-w-0 rounded-lg border border-[#E2E5EA] bg-white">
          <h2 id="sb-recent-title" className="border-b border-[#E2E5EA] px-4 py-3 text-sm font-bold">
            Recent campaigns
          </h2>
          <ul className="divide-y divide-[#E2E5EA]">
            {m.recent.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => m.restore(item)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#F7F8FA] focus-visible:bg-[#F7F8FA] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2F5BEA]"
                >
                  <FolderOpen className="size-4 shrink-0 text-[#5B6270]" aria-hidden />
                  <span className="min-w-0 flex-1 truncate font-semibold">{item.title}</span>
                  <span className="rounded bg-[#EEF0F3] px-1.5 text-xs font-semibold">{item.variant}</span>
                  {item.saved && <span className="text-xs text-[#1F8A4C]">Saved</span>}
                  <span className="w-12 text-right text-xs tabular-nums text-[#5B6270]">{item.when}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="px-4 py-2.5 text-xs text-[#5B6270]">Select a campaign to load its brief and settings.</p>
        </section>
      </main>
    </div>
  )
}

function AdPreview({
  channel,
  palette,
  variant,
  product,
}: {
  channel: "feed" | "email" | "retail"
  palette: { bg: string; ink: string; sub: string; accent: string }
  variant: { headline: string; body: string; cta: string }
  product: string
}) {
  const shoe = (
    <svg viewBox="0 0 240 110" aria-hidden className="w-full max-w-[280px]">
      <path d="M12 78c30-4 52-22 70-44 8-10 22-12 30-2l18 22c10 12 30 16 52 16h30c14 0 24 8 24 20v4H18c-8 0-12-6-6-16z" fill={palette.ink} opacity="0.92" />
      <path d="M14 96h214v6c0 4-3 6-7 6H22c-5 0-8-4-8-12z" fill={palette.accent} />
      <path d="M92 46l14 18M104 38l14 18M116 34l12 16" stroke={palette.bg} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
  const cta = (
    <span className="inline-flex h-10 items-center rounded-full px-5 text-sm font-bold" style={{ background: palette.accent, color: palette.bg }}>
      {variant.cta}
    </span>
  )

  if (channel === "email") {
    return (
      <div className="mx-auto max-w-[560px] overflow-hidden rounded-md border border-[#E2E5EA]">
        <div className="border-b border-[#E2E5EA] bg-[#F7F8FA] px-4 py-2 text-xs text-[#5B6270]">
          <p>
            <span className="font-semibold text-[#16181D]">Halden Members</span> · to you
          </p>
          <p className="truncate">Subject: {variant.headline}</p>
        </div>
        <div className="p-6 sm:p-8" style={{ background: palette.bg, color: palette.ink }}>
          <p className="text-xs font-bold tracking-wide" style={{ color: palette.accent }}>
            {product}
          </p>
          <h3 className="mt-2 text-3xl font-bold leading-tight text-balance">{variant.headline}</h3>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed" style={{ color: palette.sub }}>
            {variant.body}
          </p>
          <div className="my-5">{shoe}</div>
          {cta}
        </div>
      </div>
    )
  }

  if (channel === "retail") {
    return (
      <div className="mx-auto aspect-video max-w-[760px] overflow-hidden rounded-md border-8 border-[#16181D]" style={{ background: palette.bg, color: palette.ink }}>
        <div className="grid h-full grid-cols-[1.1fr_1fr] items-center gap-4 p-5 sm:p-8">
          <div>
            <p className="text-xs font-bold sm:text-sm" style={{ color: palette.accent }}>
              {product} · in store now
            </p>
            <h3 className="mt-1 text-xl font-bold leading-tight text-balance sm:text-4xl">{variant.headline}</h3>
            <p className="mt-2 hidden text-sm sm:block" style={{ color: palette.sub }}>
              {variant.body}
            </p>
            <div className="mt-3 hidden sm:block">{cta}</div>
          </div>
          {shoe}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[420px] overflow-hidden rounded-md border border-[#E2E5EA] bg-white">
      <div className="flex items-center gap-2 px-3 py-2 text-xs">
        <span aria-hidden className="size-6 rounded-full" style={{ background: palette.accent }} />
        <span className="font-semibold">halden.run</span>
        <span className="text-[#5B6270]">· Sponsored</span>
      </div>
      <div className="flex aspect-square flex-col justify-between p-6" style={{ background: palette.bg, color: palette.ink }}>
        <h3 className="text-3xl font-bold leading-tight text-balance">{variant.headline}</h3>
        {shoe}
      </div>
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <p className="text-xs leading-snug text-[#3A3F4A]">{variant.body}</p>
        <span className="shrink-0 rounded-md bg-[#EEF0F3] px-3 py-1.5 text-xs font-bold">{variant.cta}</span>
      </div>
    </div>
  )
}
