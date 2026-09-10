"use client"

import { useState } from "react"
import {
  Bell,
  Check,
  ChevronDown,
  Download,
  Info,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"

type TrackId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-app-builder + impeccable"

const tracks: {
  id: TrackId
  name: string
  summary: string
  changes: string[]
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "效率主张",
    summary: "强调一句话开会、三秒唤醒的效率收益。",
    changes: ["主标题收紧 40%", "移除重复承诺", "CTA 改为单一动作"],
    reach: 876,
    ctr: 4.4,
    conversion: 3.1,
  },
  {
    id: "B",
    name: "体验主张",
    summary: "从会议室的真实尴尬场景切入。",
    changes: ["增加场景引言", "弱化参数列表", "补充错误状态文案"],
    reach: 842,
    ctr: 4.8,
    conversion: 3.4,
  },
  {
    id: "C",
    name: "信任主张",
    summary: "用第三方测试条件建立可信度。",
    changes: ["所有数字附条件", "增加免责说明", "统一术语表"],
    reach: 908,
    ctr: 4.2,
    conversion: 2.9,
  },
]

const audiences = ["企业决策者", "行政采购", "团队负责人", "远程办公者"]
const channels = ["官网", "产品内引导", "销售 PDF", "行业展会"]
const tones = ["专业清晰", "亲和可信", "简洁有力", "稳重可靠"]
const finishes = ["冷调靛蓝", "清爽白蓝", "低饱和灰", "深色专业"]

type Phase = "idle" | "loading" | "success" | "error"
type TabId = "overview" | "variants" | "metrics"

export default function StandardImpeccableShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 企业版发布会准备一套上线级文案与页面结构，要求状态完整、层级清晰、导出可直接交付。"
  )
  const [trackId, setTrackId] = useState<TrackId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [finish, setFinish] = useState(finishes[0])
  const [tab, setTab] = useState<TabId>("overview")
  const [phase, setPhase] = useState<Phase>("idle")
  const [dirty, setDirty] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const track = tracks.find((item) => item.id === trackId) ?? tracks[0]
  const reach = Math.round(track.reach * (channel === "官网" ? 1.03 : 1))
  const ctr = Number((track.ctr * (tone === "简洁有力" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((track.conversion * (finish === "冷调靛蓝" ? 1.02 : 1)).toFixed(1))

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => {
      const failed = Math.random() < 0.1
      setPhase(failed ? "error" : "success")
      if (!failed) setDirty(false)
    }, 1200)
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "概览" },
    { id: "variants", label: "方案对比" },
    { id: "metrics", label: "指标" },
  ]

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              41
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{MODEL}</span>
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                  {SKILL}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Standard + Impeccable · 发布工作台</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] ${
                dirty ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span className={`size-1.5 rounded-full ${dirty ? "bg-amber-500" : "bg-emerald-500"}`} />
              {dirty ? "有未保存更改" : "已同步"}
            </span>
            <button
              type="button"
              onClick={() => notify("已保存到本地草稿")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:ring-3 focus-visible:ring-indigo-500/30"
            >
              <Save className="size-4" /> 保存
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50"
              aria-label="通知"
            >
              <Bell className="size-4" />
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1400px] gap-1 px-4 md:px-8">
          {tabs.map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={active}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-indigo-500/25 ${
                  active ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
            <Check className="size-4 text-emerald-400" /> {toast}
            <button type="button" onClick={() => setToast(null)} aria-label="关闭提示" className="text-slate-400 hover:text-white">
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main>
            {tab === "overview" && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {tracks.map((item) => {
                      const active = item.id === trackId
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setTrackId(item.id)
                            setDirty(true)
                          }}
                          aria-pressed={active}
                          className={`rounded-lg border px-3.5 py-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-indigo-500/30 ${
                            active
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {item.id} · {item.name}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={generate}
                    disabled={phase === "loading"}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 focus-visible:ring-3 focus-visible:ring-indigo-500/30 disabled:opacity-60"
                  >
                    {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
                  </button>
                </div>

                {phase === "error" && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <Info className="mt-0.5 size-4 shrink-0" /> 生成失败：术语表存在冲突，请统一产品名称后重试。
                  </div>
                )}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className={`bg-gradient-to-br px-6 py-10 md:px-10 md:py-14 ${
                    finish === "深色专业" ? "from-slate-900 to-slate-800 text-white" : "from-indigo-50 to-slate-50"
                  }`}>
                    <div className="text-[11px] uppercase tracking-[0.24em] opacity-60">
                      {channel} · 面向 {audience}
                    </div>
                    <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                      {track.name}：让会议记录不再需要第二遍
                    </h1>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed opacity-75">{track.summary}</p>
                    <button
                      type="button"
                      className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:ring-3 focus-visible:ring-indigo-500/40"
                    >
                      预约演示 <ChevronDown className="size-4 -rotate-90" />
                    </button>
                  </div>
                  <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
                    {["远场拾音半径 8m", "离线响应 80ms", "支持 12 人同时发言"].map((item) => (
                      <div key={item} className="bg-white px-5 py-4 text-sm text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <label htmlFor="brief-si41" className="text-sm font-semibold">
                    Campaign Brief
                  </label>
                  <textarea
                    id="brief-si41"
                    value={brief}
                    onChange={(event) => {
                      setBrief(event.target.value)
                      setDirty(true)
                    }}
                    className="mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed outline-none transition-colors focus:border-indigo-500 focus:bg-white focus:ring-3 focus:ring-indigo-500/15"
                  />
                </section>
              </div>
            )}

            {tab === "variants" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold">方案对比</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                        <th className="py-2.5 font-medium">方案</th>
                        <th className="py-2.5 font-medium">主张</th>
                        <th className="py-2.5 font-medium">改动</th>
                        <th className="py-2.5 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {tracks.map((item) => {
                        const active = item.id === trackId
                        return (
                          <tr key={item.id} className="border-b border-slate-100 last:border-0">
                            <td className="py-3 font-medium">{item.id}</td>
                            <td className="py-3 text-slate-600">{item.name}</td>
                            <td className="py-3 text-slate-500">{item.changes.length} 项</td>
                            <td className="py-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setTrackId(item.id)
                                  setTab("overview")
                                  setDirty(true)
                                }}
                                className={`rounded-lg px-3 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-indigo-500/25 ${
                                  active ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:border-slate-400"
                                }`}
                              >
                                {active ? "当前" : "设为主方案"}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <ul className="mt-5 space-y-2">
                  {track.changes.map((change) => (
                    <li key={change} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      <Check className="size-3.5 text-indigo-600" /> {change}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tab === "metrics" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold">预测指标</h2>
                <div className="mt-4 space-y-5">
                  <Bar label="Reach" value={`${reach}K`} pct={Math.min(reach / 10, 100)} />
                  <Bar label="CTR" value={`${ctr}%`} pct={Math.min(ctr * 18, 100)} />
                  <Bar label="Conversion" value={`${conversion}%`} pct={Math.min(conversion * 28, 100)} />
                </div>
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                  <ShieldCheck className="size-4 text-indigo-600" /> 指标为本地模拟，不参与任何排名或评分。
                </div>
              </section>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => notify("已导出交付包")}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:ring-3 focus-visible:ring-slate-900/25"
              >
                <Download className="size-4" /> 导出交付包
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("idle")
                  setDirty(true)
                }}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-indigo-500/25"
              >
                重置状态
              </button>
            </div>
          </main>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">控件</h2>
              <Seg label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Seg label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Seg label="语气" options={tones} value={tone} onChange={setTone} />
              <Seg label="视觉风格" options={finishes} value={finish} onChange={setFinish} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">质量检查</h2>
              <ul className="mt-3 space-y-2 text-xs">
                {[
                  "状态覆盖：加载 / 成功 / 错误",
                  "键盘可达与焦点可见",
                  "移动端单列回退",
                  "导出路径可交付",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-600">
                    <Check className="size-3.5 text-emerald-600" /> {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">最近活动</h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {[
                  { label: "校对术语表", time: "刚刚" },
                  { label: "收紧主标题", time: "3 分钟前" },
                  { label: "补充错误文案", time: "12 分钟前" },
                  { label: "导出销售 PDF", time: "今天" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span>{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.time}</span>
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

function Bar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-600 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Seg({
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
      <div className="mb-1.5 text-xs font-medium text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-indigo-500/25 ${
              value === option
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
