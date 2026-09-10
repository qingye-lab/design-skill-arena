"use client"

import { useState } from "react"
import {
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  LayoutGrid,
  Loader2,
  Save,
  Send,
  Settings,
  Sparkles,
  Wand2,
} from "lucide-react"

type OptionId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "impeccable"

const options: {
  id: OptionId
  title: string
  hook: string
  detail: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    title: "Quiet Power",
    hook: "安静，也可以很有力量。",
    detail: "主打夜间场景，用极低亮度与低频曲线讲清产品性格。",
    reach: 902,
    ctr: 4.5,
    conversion: 3.1,
  },
  {
    id: "B",
    title: "Every Room",
    hook: "每个房间，都听得见你。",
    detail: "以多房间联动为核心，强调空间覆盖与无缝切换。",
    reach: 865,
    ctr: 4.8,
    conversion: 3.3,
  },
  {
    id: "C",
    title: "Instant Sense",
    hook: "不用唤醒词，也懂你在说什么。",
    detail: "把离线语义理解放在最前面，弱化参数、强化直觉。",
    reach: 934,
    ctr: 4.2,
    conversion: 2.9,
  },
]

const audiences = ["高端家庭", "影音爱好者", "设计人群", "企业会议"]
const channels = ["官网首页", "品牌影片", "精品媒体", "线下门店"]
const tones = ["从容克制", "精致叙述", "冷静专业", "温暖人文"]
const palettes = ["炭黑金", "石板灰", "深海蓝", "暖砂白"]

type Phase = "idle" | "loading" | "success" | "error"

const navItems = [
  { id: "campaign", label: "Campaign", icon: Wand2 },
  { id: "assets", label: "Assets", icon: LayoutGrid },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function ImpeccableFullFlowShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 打造一条高端产品叙事线，从夜间静音场景切入，延伸到多房间联动与离线语义理解。"
  )
  const [optionId, setOptionId] = useState<OptionId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [palette, setPalette] = useState(palettes[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [activeNav, setActiveNav] = useState("campaign")
  const [exportState, setExportState] = useState<"idle" | "loading" | "done">("idle")

  const option = options.find((item) => item.id === optionId) ?? options[0]

  const reach = Math.round(option.reach * (palette === "炭黑金" ? 1.03 : 1))
  const ctr = Number((option.ctr * (tone === "精致叙述" ? 1.04 : 1)).toFixed(1))
  const conversion = Number((option.conversion * (channel === "官网首页" ? 1.05 : 1)).toFixed(1))

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => {
      setPhase(Math.random() < 0.1 ? "error" : "success")
    }, 1250)
  }

  function save() {
    setSavedAt("刚刚")
  }

  function exportPack() {
    if (exportState === "loading") return
    setExportState("loading")
    window.setTimeout(() => setExportState("done"), 1300)
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 to-amber-400 text-xs font-bold text-black">
              41
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                Campaign <ChevronRight className="size-3" /> <span className="text-slate-200">Aurora X1 Launch</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>{MODEL}</span>
                <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono">{SKILL}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {savedAt ? `已保存 ${savedAt}` : "有未保存更改"}
            </span>
            <button
              type="button"
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200 focus-visible:ring-3 focus-visible:ring-white/30"
              aria-label="通知"
            >
              <Bell className="size-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <nav className="flex shrink-0 gap-1 border-b border-white/8 px-3 py-2 lg:w-52 lg:flex-col lg:border-b-0 lg:border-r lg:px-3 lg:py-5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = activeNav === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-white/30 ${
                    active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className="size-4" /> {item.label}
                </button>
              )
            })}
            <div className="mt-2 hidden rounded-xl border border-white/8 bg-white/[0.02] p-3 lg:block">
              <div className="text-[11px] uppercase tracking-widest text-slate-500">Quality</div>
              <div className="mt-2 space-y-1.5 text-[11px] text-slate-400">
                <Row label="状态覆盖" ok />
                <Row label="键盘可达" ok />
                <Row label="响应式" ok />
                <Row label="导出路径" ok />
              </div>
            </div>
          </nav>

          <main className="flex-1 px-4 py-5 md:px-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {options.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOptionId(item.id)}
                    aria-pressed={item.id === optionId}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-amber-300/30 ${
                      item.id === optionId
                        ? "border-amber-300/60 bg-amber-300/15 text-amber-100"
                        : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
                    }`}
                  >
                    {item.id} · {item.title}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={generate}
                  disabled={phase === "loading"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-300 px-3.5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-amber-300/40 disabled:opacity-60"
                >
                  {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  生成
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-white/30"
                >
                  <Save className="size-4" /> 保存
                </button>
                <button
                  type="button"
                  onClick={exportPack}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-white/30"
                >
                  {exportState === "done" ? <Check className="size-4 text-emerald-400" /> : exportState === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                  {exportState === "done" ? "已导出" : "导出"}
                </button>
              </div>
            </div>

            {phase === "error" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200">
                <CircleAlert className="size-4" /> 生成失败：请检查品牌语气与目标人群是否冲突。
              </div>
            )}
            {phase === "success" && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200">
                <Check className="size-4" /> 已按 {tone} 语气重新生成 {options.length} 个方案。
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#161c26] via-[#111721] to-[#0f141d] p-6 md:p-10">
              <div className="mb-8 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-500">
                <span>Campaign Preview</span>
                <span>{channel}</span>
              </div>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                {option.hook}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">{option.detail}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/40"
                >
                  了解 Aurora X1 <ChevronRight className="size-4" />
                </button>
                <span className="text-[11px] text-slate-500">面向 {audience} · {palette}</span>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-20 rounded-xl border border-white/8 bg-white/[0.02] transition-colors hover:bg-white/[0.05] md:h-28"
                    style={{ opacity: 1 - index * 0.22 }}
                  />
                ))}
              </div>
            </div>

            <section className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <label htmlFor="brief-if41" className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Campaign Brief
              </label>
              <textarea
                id="brief-if41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="min-h-24 w-full resize-y rounded-xl border border-white/8 bg-black/30 p-4 text-sm leading-relaxed text-slate-200 outline-none transition-colors focus:border-amber-300/50 focus:ring-3 focus:ring-amber-300/15"
              />
            </section>
          </main>

          <aside className="w-full shrink-0 border-t border-white/8 px-4 py-5 md:px-6 lg:w-80 lg:border-l lg:border-t-0">
            <section>
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Predicted Metrics</h2>
              <div className="mt-3 space-y-2">
                <Metric label="Reach" value={`${reach}K`} />
                <Metric label="CTR" value={`${ctr}%`} />
                <Metric label="Conversion" value={`${conversion}%`} />
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Configuration</h2>
              <Segmented label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Segmented label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Segmented label="语气" options={tones} value={tone} onChange={setTone} />
              <Segmented label="视觉风格" options={palettes} value={palette} onChange={setPalette} />
            </section>

            <section className="mt-6">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Recent Campaigns</h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {[
                  { name: "Aurora X1 Launch", status: "进行中" },
                  { name: "Holiday Sound", status: "已归档" },
                  { name: "Back to Office", status: "草稿" },
                ].map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-white/8 px-3 py-2 transition-colors hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2 text-slate-300">
                      <Send className="size-3.5 text-slate-500" /> {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.status}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Row({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <Check className={`size-3.5 ${ok ? "text-emerald-400" : "text-slate-600"}`} />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  )
}

function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[11px] text-slate-500">{label}</div>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-xs transition-all focus-visible:ring-3 focus-visible:ring-white/30 ${
              value === option
                ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
                : "border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
