"use client"

import { useState } from "react"
import {
  Boxes,
  Check,
  ChevronRight,
  CircleAlert,
  Download,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Loader2,
  Save,
  Settings,
  Sparkles,
  SquareStack,
  Timer,
  TriangleAlert,
} from "lucide-react"

type ModeId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable"

const modes: {
  id: ModeId
  name: string
  focus: string
  notes: string[]
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "均衡投放",
    focus: "覆盖效率与体验，适合全量发布。",
    notes: ["三层信息结构", "状态机完整", "键盘可达"],
    reach: 896,
    ctr: 4.6,
    conversion: 3.2,
  },
  {
    id: "B",
    name: "转化优先",
    focus: "强化 CTA 与信任证据，适合冲刺阶段。",
    notes: ["CTA 单一化", "证据前置", "错误可恢复"],
    reach: 862,
    ctr: 4.9,
    conversion: 3.5,
  },
  {
    id: "C",
    name: "品牌优先",
    focus: "以视觉与叙事为主，适合长期传播。",
    notes: ["视觉主张明确", "留白充足", "动效克制"],
    reach: 930,
    ctr: 4.3,
    conversion: 3.0,
  },
]

const audiences = ["全量用户", "高意向用户", "品牌关注者", "企业客户"]
const channels = ["全渠道", "付费媒体", "自有媒体", "线下触点"]
const tones = ["专业", "坚定", "从容", "锐利"]
const stacks = ["设计逻辑", "UX 规范", "界面指引", "可访问性", "性能预算"]

type Phase = "idle" | "loading" | "success" | "error"
type RailId = "campaign" | "quality" | "activity" | "settings"

const rails: { id: RailId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "campaign", label: "Campaign", icon: LayoutDashboard },
  { id: "quality", label: "Quality", icon: ListChecks },
  { id: "activity", label: "Activity", icon: Timer },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function MaxQualityChainShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 的新品发布做一个尽可能完整的控制台：设计逻辑、UX 规范、界面指引与最终打磨全部覆盖。"
  )
  const [modeId, setModeId] = useState<ModeId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [activeStack, setActiveStack] = useState<string[]>(["设计逻辑", "UX 规范", "可访问性"])
  const [phase, setPhase] = useState<Phase>("idle")
  const [rail, setRail] = useState<RailId>("campaign")
  const [saved, setSaved] = useState(false)

  const mode = modes.find((item) => item.id === modeId) ?? modes[0]
  const reach = Math.round(mode.reach * (channel === "全渠道" ? 1.02 : 1))
  const ctr = Number((mode.ctr * (tone === "锐利" ? 1.02 : 1)).toFixed(1))
  const conversion = Number((mode.conversion + activeStack.length * 0.01).toFixed(1))

  function toggleStack(item: string) {
    setActiveStack((prev) => (prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]))
  }

  function run() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.11 ? "error" : "success"), 1350)
  }

  const readiness = Math.min(Math.round((activeStack.length / stacks.length) * 100), 100)

  return (
    <div className="min-h-screen bg-[#0c0f16] text-slate-200">
      <div className="mx-auto flex min-h-screen max-w-[1560px]">
        <nav className="hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-white/8 py-5 lg:flex">
          {rails.map((item) => {
            const Icon = item.icon
            const active = rail === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRail(item.id)}
                aria-pressed={active}
                title={item.label}
                className={`flex size-11 items-center justify-center rounded-xl transition-colors focus-visible:ring-3 focus-visible:ring-indigo-400/30 ${
                  active ? "bg-indigo-500/20 text-indigo-200" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className="size-5" />
              </button>
            )
          })}
        </nav>

        <div className="flex-1 px-4 py-5 md:px-7">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-500 px-2.5 py-1 text-xs font-bold text-white">{MODEL}</span>
                <span className="rounded-md border border-white/10 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                  {SKILL}
                </span>
              </div>
              <h1 className="mt-3 text-xl font-semibold text-white md:text-2xl">Max Quality Chain · 质量驾驶舱</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                把设计逻辑、UX 规范、界面指引与最终打磨放在同一个面板里，一次看清全部质量维度。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-400">
                <Gauge className="size-3.5" /> 就绪度 {readiness}%
              </span>
              <button
                type="button"
                onClick={run}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus-visible:ring-3 focus-visible:ring-indigo-300/40 disabled:opacity-60"
              >
                {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
              </button>
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm transition-colors hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-white/25"
              >
                {saved ? <Check className="size-4 text-emerald-400" /> : <Save className="size-4" />} 保存
              </button>
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-sm transition-colors hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-white/25"
              >
                <Download className="size-4" /> 导出
              </button>
            </div>
          </header>

          <div className="mt-4 flex gap-1 rounded-xl bg-white/5 p-1 lg:hidden">
            {rails.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRail(item.id)}
                aria-pressed={rail === item.id}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  rail === item.id ? "bg-indigo-500/25 text-indigo-100" : "text-slate-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <main className="space-y-4">
              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-wrap gap-2">
                  {modes.map((item) => {
                    const active = item.id === modeId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setModeId(item.id)}
                        aria-pressed={active}
                        className={`rounded-lg border px-3.5 py-2 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-indigo-400/30 ${
                          active ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100" : "border-white/10 text-slate-400 hover:border-white/25"
                        }`}
                      >
                        {item.id} · {item.name}
                      </button>
                    )
                  })}
                </div>

                {phase === "error" && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                    <CircleAlert className="size-4" /> 生成失败：质量栈存在未通过项，请先完成可访问性检查。
                  </div>
                )}
                {phase === "success" && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                    <Check className="size-4" /> 全部质量维度已同步，就绪度 {readiness}%。
                  </div>
                )}

                <div className="mt-4 rounded-2xl border border-white/8 bg-gradient-to-br from-[#141a26] via-[#101520] to-[#0d111a] p-6 md:p-9">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    <span>{channel} · {audience}</span>
                    <span>{mode.name}</span>
                  </div>
                  <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                    用一套完整的方法，把新品发布做到可以交付。
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">{mode.focus}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {mode.notes.map((note) => (
                      <span key={note} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className="h-16 rounded-xl border border-white/8 bg-white/[0.02] transition-colors hover:border-indigo-400/30 md:h-24"
                        style={{ opacity: 1 - index * 0.22 }}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <label htmlFor="brief-mq41" className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Campaign Brief
                </label>
                <textarea
                  id="brief-mq41"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  className="mt-3 min-h-24 w-full resize-y rounded-xl border border-white/8 bg-black/30 p-4 text-sm leading-relaxed text-slate-200 outline-none transition-colors focus:border-indigo-400/50 focus:ring-3 focus:ring-indigo-400/15"
                />
              </section>
            </main>

            <div className="space-y-4">
              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <Gauge className="size-3.5" /> 模拟指标
                </h2>
                <div className="mt-3 space-y-2">
                  <Metric label="Reach" value={`${reach}K`} pct={Math.min(reach / 10, 100)} />
                  <Metric label="CTR" value={`${ctr}%`} pct={Math.min(ctr * 18, 100)} />
                  <Metric label="Conversion" value={`${conversion}%`} pct={Math.min(conversion * 28, 100)} />
                </div>
              </section>

              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <SquareStack className="size-3.5" /> 质量栈
                </h2>
                <ul className="mt-3 space-y-2">
                  {stacks.map((item) => {
                    const active = activeStack.includes(item)
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => toggleStack(item)}
                          aria-pressed={active}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-indigo-400/30"
                        >
                          <span
                            className={`flex size-4 items-center justify-center rounded border ${
                              active ? "border-indigo-400 bg-indigo-500 text-white" : "border-white/20"
                            }`}
                          >
                            {active && <Check className="size-3" />}
                          </span>
                          <span className={active ? "text-slate-200" : "text-slate-500"}>{item}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>就绪度</span>
                    <span>{readiness}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-indigo-400 transition-all duration-700" style={{ width: `${readiness}%` }} />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <Boxes className="size-3.5" /> 控件
                </h2>
                <Chips label="受众" options={audiences} value={audience} onChange={setAudience} />
                <Chips label="渠道" options={channels} value={channel} onChange={setChannel} />
                <Chips label="语气" options={tones} value={tone} onChange={setTone} />
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">质量明细</h2>
                <ul className="mt-3 space-y-2 text-xs">
                  {[
                    { label: "信息层级", state: "pass" },
                    { label: "键盘可达", state: "pass" },
                    { label: "焦点可见", state: "pass" },
                    { label: "错误可恢复", state: "pass" },
                    { label: "移动端回退", state: "warn" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center justify-between rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                      <span className="text-slate-300">{item.label}</span>
                      {item.state === "pass" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <Check className="size-3.5" /> pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <TriangleAlert className="size-3.5" /> warn
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">最近活动</h2>
                <ul className="mt-3 space-y-2 text-xs">
                  {[
                    { label: "完成可访问性复核", time: "刚刚" },
                    { label: "更新设计逻辑说明", time: "5 分钟前" },
                    { label: "补充界面指引用例", time: "20 分钟前" },
                    { label: "收敛性能预算", time: "今天" },
                    { label: "导出交付清单", time: "昨天" },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 transition-colors hover:bg-white/5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <ChevronRight className="size-3 text-slate-600" /> {item.label}
                      </span>
                      <span className="text-[11px] text-slate-600">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">交付清单</h2>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                  {["设计稿与标注", "组件与状态清单", "文案终稿", "导出素材包", "上线检查表"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="size-3.5 text-indigo-400" /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-indigo-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Chips({
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
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-indigo-400/30 ${
              value === option
                ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                : "border-white/10 text-slate-400 hover:border-white/25"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
