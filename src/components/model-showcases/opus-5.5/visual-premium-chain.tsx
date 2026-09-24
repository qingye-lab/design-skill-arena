"use client"

import { Italiana, Jost } from "next/font/google"
import { AlertCircle, Check, Download, Loader2, RotateCcw, Save } from "lucide-react"
import { useState, type KeyboardEvent } from "react"

import {
  BRIEF_MAX,
  VARIANT_IDS,
  formatDelta,
  formatPercent,
  formatReach,
  useMuseStudio,
  type ControlKey,
  type Option,
  type RecentCampaign,
  type StudioSpec,
  type VariantId,
} from "./core"

const italiana = Italiana({ subsets: ["latin"], weight: "400", display: "swap" })
const jost = Jost({ subsets: ["latin"], display: "swap" })

const spec: StudioSpec = {
  showcaseId: "visual-premium-chain",
  product: "Aurum Calibre 7",
  brief:
    "Aurum Calibre 7 is a hand-wound mechanical watch with a 72-hour power reserve and an open caseback. 180 pieces, finished by hand in our Geneva workshop. Launch it on 1 December, with fittings by appointment.",
  audiences: [
    { id: "collectors", label: "Collectors", hint: "Own five or more", size: 214000, lift: { ctr: 1.1, conversion: 1.32 } },
    { id: "first", label: "First-watch buyers", hint: "Buying to keep", size: 640000, lift: { ctr: 1.02, conversion: 0.84 } },
    { id: "gift", label: "Gift givers", hint: "Milestone gifts", size: 420000, lift: { conversion: 0.95 } },
  ],
  channels: [
    { id: "press", label: "Watch magazine", hint: "Print spread", lift: { reach: 0.72, ctr: 0.62, conversion: 1.26 } },
    { id: "reel", label: "Instagram reel", hint: "9:16 film", lift: { reach: 1.2, ctr: 1.12 } },
    { id: "window", label: "Boutique window", hint: "Geneva, Rue du Rhône", lift: { reach: 0.46, ctr: 0.4, conversion: 1.62 } },
  ],
  tones: [
    { id: "reserved", label: "Reserved", lift: { conversion: 1.06 } },
    { id: "assured", label: "Assured", lift: { ctr: 1.05 } },
    { id: "intimate", label: "Intimate", lift: { ctr: 1.03, conversion: 1.03 } },
  ],
  styles: [
    { id: "obsidian", label: "Obsidian dial", lift: { ctr: 1.04 } },
    { id: "champagne", label: "Champagne dial", lift: { reach: 1.03, conversion: 1.02 } },
    { id: "bronze", label: "Bronze patina", lift: { ctr: 1.07, conversion: 0.98 } },
  ],
  variants: [
    {
      id: "A",
      name: "The long hour",
      headline: "Wound by hand. Kept for life.",
      body: "Seventy-two hours from a single winding, regulated by hand in Geneva for {audience}.",
      cta: "Book a fitting",
      lift: { conversion: 1.06 },
    },
    {
      id: "B",
      name: "Seen through",
      headline: "Turn it over.",
      body: "Every bridge of {product} is finished by hand and left on view through the open caseback.",
      cta: "See the movement",
      lift: { ctr: 1.09, reach: 0.96 },
    },
    {
      id: "C",
      name: "One of 180",
      headline: "One of one hundred and eighty.",
      body: "{product} is made in a single run of 180 pieces. Reserve yours before 1 December.",
      cta: "Reserve a piece",
      lift: { reach: 1.04, conversion: 1.1 },
    },
  ],
  recent: [
    { id: "vp-r1", title: "Calibre 5 anniversary edition", variant: "A", when: "Tue" },
    { id: "vp-r2", title: "Geneva boutique opening", variant: "C", when: "14 Sep" },
    { id: "vp-r3", title: "Winding ritual film", variant: "B", when: "2 Sep" },
  ],
  initialRun: 6,
}

type Finish = {
  face: [string, string]
  index: string
  hand: string
  text: string
  sub: string
  track: string
  sheen: string
}

const FINISHES: Record<string, Finish> = {
  obsidian: { face: ["#1F1C18", "#0B0A09"], index: "#E9D8B4", hand: "#E9D8B4", text: "#B8AB91", sub: "#141210", track: "#6F6556", sheen: "rgba(233,216,180,0.16)" },
  champagne: { face: ["#F2E6CA", "#CDB684"], index: "#2A2118", hand: "#1C1712", text: "#4A3C2A", sub: "#E2CFA5", track: "#8A7552", sheen: "rgba(255,250,238,0.5)" },
  bronze: { face: ["#80633D", "#35281A"], index: "#F0E2C2", hand: "#F0E2C2", text: "#E2CFA6", sub: "#443320", track: "#B99C6E", sheen: "rgba(240,226,194,0.2)" },
}

const C = 300
const round = (value: number) => Math.round(value * 100) / 100
const TICKS = Array.from({ length: 60 }, (_, index) => {
  const angle = ((index * 6 - 90) * Math.PI) / 180
  const major = index % 5 === 0
  const outer = 258
  const inner = major ? 247 : 252
  return {
    major,
    x1: round(C + outer * Math.cos(angle)),
    y1: round(C + outer * Math.sin(angle)),
    x2: round(C + inner * Math.cos(angle)),
    y2: round(C + inner * Math.sin(angle)),
  }
})
const SUB = { x: 300, y: 404, r: 54 }
const SUB_TICKS = Array.from({ length: 12 }, (_, index) => {
  const angle = ((index * 30 - 90) * Math.PI) / 180
  const inner = index % 3 === 0 ? 40 : 45
  return {
    x1: round(SUB.x + 50 * Math.cos(angle)),
    y1: round(SUB.y + 50 * Math.sin(angle)),
    x2: round(SUB.x + inner * Math.cos(angle)),
    y2: round(SUB.y + inner * Math.sin(angle)),
  }
})

type Tab = "brief" | "direction" | "routes"
const TABS: { id: Tab; label: string }[] = [
  { id: "brief", label: "Brief" },
  { id: "direction", label: "Direction" },
  { id: "routes", label: "Routes" },
]

const SCOPED = `
@keyframes vp-iris { from { clip-path: circle(0% at var(--vp-iris)); } to { clip-path: circle(150% at var(--vp-iris)); } }
.vp-iris { animation: vp-iris 820ms cubic-bezier(0.65, 0, 0.35, 1) both; }
@keyframes vp-sweep { 0% { transform: translateX(-40px) rotate(18deg); } 58%, 100% { transform: translateX(820px) rotate(18deg); } }
.vp-sweep { transform-box: view-box; transform-origin: 0 0; animation: vp-sweep 11s cubic-bezier(0.45, 0, 0.2, 1) 1.2s infinite both; }
@keyframes vp-tick { to { transform: rotate(360deg); } }
.vp-seconds { transform-box: view-box; transform-origin: ${SUB.x}px ${SUB.y}px; animation: vp-tick 60s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .vp-iris { animation: none; }
  .vp-sweep { animation: none; transform: translateX(250px) rotate(18deg); }
  .vp-seconds { animation: none; transform: rotate(52deg); }
}
`

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9D8B4]"

export default function VisualPremiumChain() {
  const m = useMuseStudio(spec)
  const [tab, setTab] = useState<Tab>("brief")
  const [armed, setArmed] = useState(false)
  const finish = FINISHES[m.output.settings.style] ?? FINISHES.obsidian
  const variant = m.current
  const sig = `${m.selected}-${m.output.run}`

  function choose(id: VariantId) {
    if (id === m.selected) return
    setArmed(true)
    m.select(id)
  }

  function generate() {
    setArmed(true)
    if (m.issue) setTab("brief")
    m.generate()
  }

  function restore(item: RecentCampaign) {
    setArmed(true)
    m.restore(item)
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1
    if (next < 0) return
    event.preventDefault()
    setTab(TABS[next].id)
    document.getElementById(`vp-tab-${TABS[next].id}`)?.focus()
  }

  const metrics = [
    { label: "Reach", value: formatReach(variant.metrics.reach), delta: formatDelta(variant.metrics.reach, m.previous?.metrics.reach, "reach") },
    { label: "CTR", value: formatPercent(variant.metrics.ctr), delta: formatDelta(variant.metrics.ctr, m.previous?.metrics.ctr, "percent") },
    {
      label: "Conversion",
      value: formatPercent(variant.metrics.conversion),
      delta: formatDelta(variant.metrics.conversion, m.previous?.metrics.conversion, "percent"),
    },
  ]

  const status = m.busy
    ? `Run ${m.output.run + 1}: ${m.stageLabel}.`
    : m.generateStatus === "success"
      ? `Run ${m.output.run} ready. Three routes forecast.`
      : m.saveStatus === "saved"
        ? `Route ${m.selected} saved to recent campaigns.`
        : m.exportStatus === "exported"
          ? `Route ${m.selected} exported as JSON.`
          : m.stale
            ? `Settings changed since run ${m.output.run}.`
            : `Run ${m.output.run}, generated ${m.output.at}.`

  return (
    <div
      className={`${jost.className} relative min-h-[100dvh] bg-[#0B0A09] text-[#E9D8B4] selection:bg-[#9C7A4B] selection:text-[#0B0A09] lg:h-[100dvh] lg:overflow-hidden`}
    >
      <style>{SCOPED}</style>

      {/* ---------- Canvas ---------- */}
      <section aria-labelledby="vp-headline" className="relative lg:absolute lg:inset-0">
        <header className="relative px-5 pb-1 pt-5 lg:absolute lg:left-14 lg:top-8 lg:z-10 lg:p-0">
          <h1 className="flex items-baseline gap-3">
            <span className={`${italiana.className} text-[28px] leading-none tracking-[0.28em]`}>AURUM</span>
            <span className="text-[14px] text-[#A39E95]">Calibre 7 launch</span>
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#A39E95]">
            Movement by <span className="text-[#E9D8B4]">{m.modelName}</span>
            <span aria-hidden className="mx-2 text-[#9C7A4B]">/</span>
            <span className="normal-case tracking-[0.06em]">{m.chain}</span>
          </p>
        </header>

        <div
          key={sig}
          className={`relative [--vp-iris:50%_50vw] lg:absolute lg:inset-y-0 lg:left-0 lg:right-[388px] lg:[--vp-iris:64%_46%] ${armed ? "vp-iris" : ""}`}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(42%_46%_at_50%_50vw,#1C1915_0%,#0B0A09_100%)] lg:bg-[radial-gradient(38%_52%_at_64%_46%,#1C1915_0%,#0B0A09_100%)]"
          />
          <div className="relative mx-auto aspect-square w-full p-[6%] lg:absolute lg:left-[64%] lg:top-[46%] lg:w-[min(62vh,44vw,560px)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:p-0">
            <Dial finish={finish} busy={m.busy} progress={m.progress} />
          </div>

          <div
            className={`relative px-5 pb-6 transition-opacity duration-300 lg:absolute lg:left-14 lg:top-[46%] lg:w-[min(330px,31%)] lg:-translate-y-1/2 lg:p-0 ${m.busy ? "opacity-45" : ""}`}
          >
            <h2
              id="vp-headline"
              className={`${italiana.className} text-[clamp(2.4rem,3.9vw,3.6rem)] leading-[1.06] tracking-[0.005em] text-balance`}
            >
              {variant.headline}
            </h2>
            <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.65] text-[#CFC6B4]">{variant.body}</p>
            <p className="mt-7 inline-flex items-center border border-[#9C7A4B] px-5 py-3 text-[12px] font-medium uppercase tracking-[0.22em]">
              {variant.cta}
            </p>
            {m.stale && !m.busy && (
              <p className="mt-6 flex max-w-[34ch] items-start gap-2 text-[13px] leading-snug text-[#CFC6B4]">
                <RotateCcw aria-hidden className="mt-0.5 size-3.5 shrink-0 text-[#C49A62]" strokeWidth={1.5} />
                Out of date: this is run {m.output.run}. Generate again to see your changes on the dial.
              </p>
            )}
          </div>
        </div>

        {/* metrics band */}
        <div className="relative border-y border-[#9C7A4B]/25 bg-[#0B0A09] px-5 py-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex lg:h-[72px] lg:items-center lg:gap-12 lg:border-b-0 lg:px-14 lg:py-0">
          <p className="text-[11px] uppercase leading-snug tracking-[0.18em] text-[#A39E95]">
            Simulated forecast
            <span className="block normal-case tracking-[0.02em] text-[#E9D8B4]">
              Route {m.selected}, {variant.name}
            </span>
          </p>
          <dl className="mt-3 grid grid-cols-3 gap-4 lg:mt-0 lg:flex lg:gap-12">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-0">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-[#A39E95]">{metric.label}</dt>
                <dd className="flex flex-wrap items-baseline gap-x-2">
                  <span className={`${italiana.className} text-[26px] leading-tight tabular-nums lg:text-[30px]`}>{metric.value}</span>
                  {metric.delta && <span className="text-[12px] tabular-nums text-[#C49A62]">{metric.delta}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Inspector ---------- */}
      <aside
        aria-label="Inspector"
        className="relative mx-4 my-6 flex flex-col border border-[#9C7A4B]/30 bg-[#14120F] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.75)] lg:absolute lg:bottom-[88px] lg:right-6 lg:top-6 lg:m-0 lg:w-[340px]"
      >
        <div role="tablist" aria-label="Inspector sections" className="flex shrink-0 border-b border-[#9C7A4B]/25">
          {TABS.map((item, index) => (
            <button
              key={item.id}
              id={`vp-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls={`vp-panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => onTabKey(event, index)}
              className={`relative h-12 flex-1 text-[13px] font-medium tracking-[0.06em] text-[#A39E95] transition-colors hover:text-[#E9D8B4] aria-selected:text-[#E9D8B4] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#E9D8B4]`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute inset-x-5 bottom-[-1px] h-px bg-[#E9D8B4] transition-transform duration-300 ${tab === item.id ? "scale-x-100" : "scale-x-0"}`}
              />
            </button>
          ))}
        </div>

        <div
          id={`vp-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`vp-tab-${tab}`}
          tabIndex={0}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#9C7A4B] [scrollbar-color:#3A332A_transparent] [scrollbar-width:thin]"
        >
          {tab === "brief" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="vp-brief" className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">
                    Launch brief
                  </label>
                  <span className="text-[12px] tabular-nums text-[#A39E95]">
                    {m.settings.brief.trim().length}/{BRIEF_MAX}
                  </span>
                </div>
                <textarea
                  id="vp-brief"
                  rows={5}
                  value={m.settings.brief}
                  onChange={(event) => m.setBrief(event.target.value)}
                  aria-invalid={m.issue ? true : undefined}
                  aria-describedby={m.issue ? "vp-brief-issue" : undefined}
                  className="mt-2 block w-full resize-y border border-[#9C7A4B]/45 bg-[#0B0A09] px-3 py-2.5 text-[14px] leading-relaxed text-[#E9D8B4] caret-[#E9D8B4] outline-none hover:border-[#9C7A4B] focus-visible:border-[#E9D8B4] aria-invalid:border-[#E5735C]"
                />
                {m.issue && (
                  <p id="vp-brief-issue" className="mt-1.5 text-[12px] leading-snug text-[#E5735C]">
                    {m.issue}
                  </p>
                )}
              </div>
              <ChoiceList legend="Audience" control="audience" options={spec.audiences} value={m.settings.audience} onPick={m.setControl} />
              <ChoiceList legend="Channel" control="channel" options={spec.channels} value={m.settings.channel} onPick={m.setControl} />
            </div>
          )}

          {tab === "direction" && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">Tone</legend>
                <div className="mt-2 grid grid-cols-3">
                  {spec.tones.map((option) => (
                    <label key={option.id} className="relative -ml-px first:ml-0">
                      <input
                        type="radio"
                        name="vp-tone"
                        checked={m.settings.tone === option.id}
                        onChange={() => m.setControl("tone", option.id)}
                        className="peer sr-only"
                      />
                      <span className="flex h-10 cursor-pointer items-center justify-center border border-[#9C7A4B]/45 text-[13px] transition-colors hover:bg-[#1F1B17] peer-checked:relative peer-checked:border-[#E9D8B4] peer-checked:bg-[#E9D8B4] peer-checked:text-[#0B0A09] peer-focus-visible:relative peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#E9D8B4]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">Visual style</legend>
                <div className="mt-2 space-y-1">
                  {spec.styles.map((option) => {
                    const swatch = FINISHES[option.id]
                    return (
                      <label
                        key={option.id}
                        className="flex min-h-12 cursor-pointer items-center gap-3 px-2 transition-colors hover:bg-[#1F1B17] has-[:checked]:bg-[#1F1B17] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#E9D8B4]"
                      >
                        <input
                          type="radio"
                          name="vp-style"
                          checked={m.settings.style === option.id}
                          onChange={() => m.setControl("style", option.id)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden
                          className="size-8 shrink-0 rounded-full border border-[#9C7A4B]/60 peer-checked:ring-1 peer-checked:ring-[#E9D8B4] peer-checked:ring-offset-2 peer-checked:ring-offset-[#1F1B17]"
                          style={{ background: `radial-gradient(circle at 38% 32%, ${swatch.face[0]}, ${swatch.face[1]})` }}
                        />
                        <span className="flex-1 text-[14px]">{option.label}</span>
                        {m.settings.style === option.id && <Check aria-hidden className="size-4 text-[#E9D8B4]" strokeWidth={1.5} />}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <label className="flex min-h-10 cursor-pointer items-start gap-3 text-[13px] leading-snug text-[#CFC6B4] hover:text-[#E9D8B4]">
                <input
                  type="checkbox"
                  checked={m.failNext}
                  onChange={(event) => m.setFailNext(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-[#9C7A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9D8B4]"
                />
                Simulate a forecast outage on the next run
              </label>
              <button
                type="button"
                onClick={m.reset}
                className={`inline-flex min-h-10 items-center gap-2 text-[13px] text-[#CFC6B4] underline decoration-[#9C7A4B] underline-offset-4 hover:text-[#E9D8B4] ${focus}`}
              >
                <RotateCcw aria-hidden className="size-3.5" strokeWidth={1.5} />
                Reset to launch defaults
              </button>
            </div>
          )}

          {tab === "routes" && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">Compare routes</legend>
                <div className="mt-2 space-y-1">
                  {VARIANT_IDS.map((id) => {
                    const route = m.output.variants[id]
                    return (
                      <label
                        key={id}
                        className="flex cursor-pointer items-center gap-3 px-2 py-2.5 transition-colors hover:bg-[#1F1B17] has-[:checked]:bg-[#1F1B17] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#E9D8B4]"
                      >
                        <input
                          type="radio"
                          name="vp-route-list"
                          checked={m.selected === id}
                          onChange={() => choose(id)}
                          className="sr-only"
                        />
                        <span className={`${italiana.className} w-6 text-[28px] leading-none`}>{id}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px]">{route.name}</span>
                          <span className="block text-[12px] tabular-nums text-[#A39E95]">
                            {formatReach(route.metrics.reach)} reach, {formatPercent(route.metrics.ctr)} CTR, {formatPercent(route.metrics.conversion)} conv.
                          </span>
                        </span>
                        {m.selected === id && <Check aria-hidden className="size-4 shrink-0 text-[#E9D8B4]" strokeWidth={1.5} />}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <section aria-labelledby="vp-recent">
                <h3 id="vp-recent" className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">
                  Recent campaigns
                </h3>
                <ul className="mt-2">
                  {m.recent.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => restore(item)}
                        className={`flex min-h-11 w-full items-center gap-3 px-2 text-left text-[13px] transition-colors hover:bg-[#1F1B17] ${focus} focus-visible:-outline-offset-2`}
                      >
                        <span className={`${italiana.className} w-4 text-[18px]`}>{item.variant}</span>
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                        <span className="shrink-0 tabular-nums text-[#A39E95]">{item.saved ? `Saved ${item.when}` : item.when}</span>
                        <span className="shrink-0 text-[#C49A62] underline underline-offset-4">Restore</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="vp-log">
                <h3 id="vp-log" className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">
                  Activity
                </h3>
                <ol className="mt-2 space-y-1.5 text-[12px] leading-snug">
                  {m.log.slice(0, 6).map((entry) => (
                    <li key={entry.id} className="flex gap-3">
                      <span className="w-10 shrink-0 tabular-nums text-[#A39E95]">{entry.at}</span>
                      <span className={entry.tone === "error" ? "text-[#E5735C]" : "text-[#CFC6B4]"}>{entry.text}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          )}
        </div>

        {/* persistent footer: route switch and actions */}
        <div className="shrink-0 space-y-3 border-t border-[#9C7A4B]/25 px-5 py-4">
          <fieldset className="flex items-center gap-3">
            <legend className="sr-only">Route on the canvas</legend>
            <span aria-hidden className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">
              Route
            </span>
            <div className="grid flex-1 grid-cols-3">
              {VARIANT_IDS.map((id) => (
                <label key={id} className="relative -ml-px first:ml-0">
                  <input
                    type="radio"
                    name="vp-route-quick"
                    checked={m.selected === id}
                    onChange={() => choose(id)}
                    className="peer sr-only"
                  />
                  <span className="sr-only">Route {id}, {m.output.variants[id].name}</span>
                  <span
                    aria-hidden
                    className={`${italiana.className} flex h-10 cursor-pointer items-center justify-center border border-[#9C7A4B]/45 text-[20px] transition-colors hover:bg-[#1F1B17] peer-checked:relative peer-checked:border-[#E9D8B4] peer-checked:bg-[#E9D8B4] peer-checked:text-[#0B0A09] peer-focus-visible:relative peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#E9D8B4]`}
                  >
                    {id}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={generate}
            disabled={m.busy}
            className={`relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden bg-[#E9D8B4] text-[13px] font-semibold uppercase tracking-[0.18em] text-[#0B0A09] transition-colors hover:bg-[#F4E8CD] active:translate-y-px disabled:cursor-progress disabled:hover:bg-[#E9D8B4] ${focus}`}
          >
            {m.busy && <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />}
            {m.busy ? `Generating ${m.progress}%` : m.stale ? `Generate run ${m.output.run + 1}` : "Generate"}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={m.save}
              disabled={m.saveStatus === "saving"}
              className={`flex h-10 items-center justify-center gap-2 border border-[#9C7A4B]/60 text-[13px] tracking-[0.06em] transition-colors hover:border-[#E9D8B4] hover:bg-[#1F1B17] disabled:cursor-progress ${focus}`}
            >
              {m.saveStatus === "saving" ? (
                <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
              ) : m.saveStatus === "saved" ? (
                <Check aria-hidden className="size-4" strokeWidth={1.5} />
              ) : (
                <Save aria-hidden className="size-4" strokeWidth={1.5} />
              )}
              {m.saveStatus === "saving" ? "Saving" : m.saveStatus === "saved" ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => m.exportCampaign()}
              disabled={m.exportStatus === "exporting"}
              className={`flex h-10 items-center justify-center gap-2 border border-[#9C7A4B]/60 text-[13px] tracking-[0.06em] transition-colors hover:border-[#E9D8B4] hover:bg-[#1F1B17] disabled:cursor-progress ${focus}`}
            >
              {m.exportStatus === "exporting" ? (
                <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
              ) : m.exportStatus === "exported" ? (
                <Check aria-hidden className="size-4" strokeWidth={1.5} />
              ) : (
                <Download aria-hidden className="size-4" strokeWidth={1.5} />
              )}
              {m.exportStatus === "exporting" ? "Exporting" : m.exportStatus === "exported" ? "Exported" : "Export"}
            </button>
          </div>
          <p aria-live="polite" className="text-[12px] leading-snug text-[#A39E95]">
            {status}
          </p>
          {[m.generateError, m.saveError, m.exportError].map((error, index) =>
            error ? (
              <p key={index} role="alert" className="flex items-start gap-2 border border-[#E5735C]/60 px-3 py-2 text-[12px] leading-snug text-[#F0B3A5]">
                <AlertCircle aria-hidden className="mt-px size-4 shrink-0 text-[#E5735C]" strokeWidth={1.5} />
                {error}
              </p>
            ) : null
          )}
        </div>
      </aside>
    </div>
  )
}

function ChoiceList({
  legend,
  control,
  options,
  value,
  onPick,
}: {
  legend: string
  control: ControlKey
  options: Option[]
  value: string
  onPick: (key: ControlKey, id: string) => void
}) {
  return (
    <fieldset>
      <legend className="text-[12px] uppercase tracking-[0.16em] text-[#A39E95]">{legend}</legend>
      <div className="mt-1.5">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex min-h-10 cursor-pointer items-center gap-3 px-2 transition-colors hover:bg-[#1F1B17] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#E9D8B4]"
          >
            <input
              type="radio"
              name={`vp-${control}`}
              checked={value === option.id}
              onChange={() => onPick(control, option.id)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="size-3.5 shrink-0 rounded-full border border-[#9C7A4B] peer-checked:border-[#E9D8B4] peer-checked:bg-[#E9D8B4] peer-checked:shadow-[inset_0_0_0_3px_#14120F]"
            />
            <span className="min-w-0 flex-1 text-[14px] text-[#CFC6B4] peer-checked:text-[#E9D8B4]">{option.label}</span>
            {option.hint && <span className="shrink-0 text-[12px] text-[#A39E95]">{option.hint}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Dial({ finish, busy, progress }: { finish: Finish; busy: boolean; progress: number }) {
  const ring = 2 * Math.PI * 287
  return (
    <svg viewBox="0 0 620 600" role="img" aria-label="Aurum Calibre 7 dial with hour batons, dauphine hands and a small seconds sub-dial" className="h-auto w-full">
      <defs>
        <linearGradient id="vp-case" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#D2B07A" />
          <stop offset="0.35" stopColor="#6E5231" />
          <stop offset="0.62" stopColor="#B38D58" />
          <stop offset="1" stopColor="#3E2E1C" />
        </linearGradient>
        <radialGradient id="vp-face" cx="0.42" cy="0.36" r="0.75">
          <stop offset="0" stopColor={finish.face[0]} />
          <stop offset="1" stopColor={finish.face[1]} />
        </radialGradient>
        <linearGradient id="vp-sheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={finish.sheen} stopOpacity="0" />
          <stop offset="0.5" stopColor={finish.sheen} />
          <stop offset="1" stopColor={finish.sheen} stopOpacity="0" />
        </linearGradient>
        <clipPath id="vp-face-clip">
          <circle cx={C} cy={C} r="272" />
        </clipPath>
      </defs>

      <rect x="592" y="280" width="18" height="40" rx="3" fill="url(#vp-case)" />
      <rect x="586" y="288" width="8" height="24" fill="#3E2E1C" />
      <circle cx={C} cy={C} r="294" fill="url(#vp-case)" />
      <circle cx={C} cy={C} r="280" fill="#0B0A09" opacity="0.55" />
      <circle cx={C} cy={C} r="272" fill="url(#vp-face)" />

      {/* generation progress runs round the bezel like a power reserve */}
      {busy && (
        <circle
          cx={C}
          cy={C}
          r="287"
          fill="none"
          stroke="#E9D8B4"
          strokeWidth="3"
          strokeDasharray={`${(ring * progress) / 100} ${ring}`}
          transform={`rotate(-90 ${C} ${C})`}
          className="transition-[stroke-dasharray] duration-300"
        />
      )}

      {TICKS.map((tick, index) => (
        <line
          key={index}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke={tick.major ? finish.index : finish.track}
          strokeWidth={tick.major ? 2.4 : 1.2}
        />
      ))}
      {Array.from({ length: 12 }, (_, hour) =>
        hour === 0 ? (
          <g key={hour}>
            <rect x="286" y="66" width="9" height="46" fill={finish.index} />
            <rect x="305" y="66" width="9" height="46" fill={finish.index} />
          </g>
        ) : (
          <rect key={hour} x="295.5" y="66" width="9" height="40" fill={finish.index} transform={`rotate(${hour * 30} ${C} ${C})`} />
        )
      )}

      <text x={C} y="178" textAnchor="middle" fontSize="24" letterSpacing="7" fill={finish.text} className={italiana.className}>
        AURUM
      </text>
      <text x={C} y="198" textAnchor="middle" fontSize="9" letterSpacing="3.5" fill={finish.text} className={jost.className}>
        CALIBRE 7
      </text>

      {/* small seconds */}
      <circle cx={SUB.x} cy={SUB.y} r={SUB.r} fill={finish.sub} stroke={finish.track} strokeWidth="1" />
      {SUB_TICKS.map((tick, index) => (
        <line key={index} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke={finish.track} strokeWidth="1.2" />
      ))}
      <g className="vp-seconds">
        <line x1={SUB.x} y1={SUB.y + 12} x2={SUB.x} y2={SUB.y - 46} stroke={finish.hand} strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <circle cx={SUB.x} cy={SUB.y} r="3.5" fill={finish.hand} />

      {/* hands at ten past ten */}
      <g transform={`rotate(305 ${C} ${C})`}>
        <polygon points="300,150 311,300 300,322 289,300" fill={finish.hand} />
        <polygon points="300,150 300,322 289,300" fill="#0B0A09" opacity="0.22" />
      </g>
      <g transform={`rotate(62 ${C} ${C})`}>
        <polygon points="300,76 308,300 300,320 292,300" fill={finish.hand} />
        <polygon points="300,76 300,320 292,300" fill="#0B0A09" opacity="0.22" />
      </g>
      <circle cx={C} cy={C} r="9" fill={finish.hand} />
      <circle cx={C} cy={C} r="3" fill="#9C7A4B" />

      {/* slow light sweep across the crystal */}
      <g clipPath="url(#vp-face-clip)" aria-hidden>
        <rect className="vp-sweep" x="-60" y="-160" width="120" height="920" fill="url(#vp-sheen)" />
      </g>
    </svg>
  )
}
