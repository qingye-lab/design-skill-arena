"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Download,
  Loader2,
  Save,
  Sparkles,
  TrendingUp,
} from "lucide-react"

type PickId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-app-builder + taste-skill + impeccable"

const picks: {
  id: PickId
  name: string
  angle: string
  line: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "效率",
    angle: "以结果为导向",
    line: "让每一次会议，都只开一遍",
    reach: 878,
    ctr: 4.4,
    conversion: 3.1,
  },
  {
    id: "B",
    name: "体验",
    angle: "以感受为导向",
    line: "声音应该待在该待的地方",
    reach: 844,
    ctr: 4.7,
    conversion: 3.3,
  },
  {
    id: "C",
    name: "信任",
    angle: "以证据为导向",
    line: "所有承诺，都可以被验证",
    reach: 906,
    ctr: 4.3,
    conversion: 3.0,
  },
]

const audiences = ["中小团队", "远程协作者", "内容创作者", "会议组织者"]
const channels = ["官网", "信息流", "社区", "邮件"]
const tones = ["平衡", "专业", "轻松", "务实"]
const styles = ["翡翠绿", "石板灰", "暖白", "深海蓝"]

type Phase = "idle" | "loading" | "success" | "error"

export default function BalancedChainShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 规划一次覆盖多人群的新品发布，既要讲清效率收益，也要照顾到体验与信任。"
  )
  const [pickId, setPickId] = useState<PickId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [exported, setExported] = useState(false)

  const pick = picks.find((item) => item.id === pickId) ?? picks[0]
  const reach = Math.round(pick.reach * (channel === "官网" ? 1.03 : 1))
  const ctr = Number((pick.ctr * (tone === "轻松" ? 1.02 : 1)).toFixed(1))
  const conversion = Number((pick.conversion * (style === "翡翠绿" ? 1.02 : 1)).toFixed(1))

  function run() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.09 ? "error" : "success"), 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1360px] px-4 py-5 md:px-7">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">{MODEL}</span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600">
                  {SKILL}
                </span>
              </div>
              <h1 className="mt-3 text-xl font-bold md:text-2xl">Balanced Chain · 综合工作台</h1>
              <p className="mt-1 text-sm text-slate-500">
                不追求单一极端，让参数、方案、预览、指标、记录保持在同一水平线。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-500">
                <Clock className="size-3.5" /> {savedAt ? `已保存 ${savedAt}` : "自动保存开启"}
              </span>
              <button
                type="button"
                onClick={run}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:ring-3 focus-visible:ring-emerald-500/30 disabled:opacity-60"
              >
                {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
              </button>
              <button
                type="button"
                onClick={() => setSavedAt("刚刚")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-emerald-500/25"
              >
                <Save className="size-4" /> 保存
              </button>
              <button
                type="button"
                onClick={() => setExported(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-emerald-500/25"
              >
                {exported ? <BadgeCheck className="size-4 text-emerald-600" /> : <Download className="size-4" />} 导出
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div>
              <label htmlFor="brief-bc41" className="text-sm font-semibold">
                Campaign Brief
              </label>
              <textarea
                id="brief-bc41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/15"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Chip label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Chip label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Chip label="语气" options={tones} value={tone} onChange={setTone} />
              <Chip label="视觉风格" options={styles} value={style} onChange={setStyle} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {picks.map((item) => {
                const active = item.id === pickId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPickId(item.id)}
                    aria-pressed={active}
                    className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:ring-3 focus-visible:ring-emerald-500/25 ${
                      active
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{item.id} · {item.name}</span>
                      {active && <BadgeCheck className="size-4 text-emerald-600" />}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">{item.angle}</div>
                  </button>
                )
              })}
            </div>

            {phase === "error" && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                生成失败：三个方向的受众重叠度过高，请调整人群划分。
              </div>
            )}
            {phase === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <BadgeCheck className="size-4" /> 三个方向均已按要求同步更新。
              </div>
            )}

            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-emerald-50 via-slate-50 to-white p-8 md:p-12">
                <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-700">
                  {channel} · 面向 {audience}
                </div>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{pick.line}</h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                  Aurora X1 用远场拾音与离线语义理解，把会议记录压缩成一次真正的对话。
                </p>
                <button
                  type="button"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-slate-900/25"
                >
                  查看详情 <ArrowUpRight className="size-4" />
                </button>
              </div>
              <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[["拾音半径", "8 m"], ["离线响应", "80 ms"], ["同时发言", "12 人"]].map(([label, value]) => (
                  <div key={label} className="px-5 py-4">
                    <div className="text-[11px] text-slate-500">{label}</div>
                    <div className="mt-1 font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </article>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">发布节奏</h2>
              <ol className="mt-4 space-y-3">
                {[
                  { label: "Brief 定稿", time: "D-14" },
                  { label: "主视觉确认", time: "D-10" },
                  { label: "素材上线", time: "D-3" },
                  { label: "发布日", time: "D-day" },
                ].map((item, index) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-[11px] ${
                        index <= 1 ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.time}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="size-4 text-emerald-600" /> 预测指标
              </h2>
              <div className="mt-3 space-y-2">
                <Metric label="Reach" value={`${reach}K`} />
                <Metric label="CTR" value={`${ctr}%`} />
                <Metric label="Conversion" value={`${conversion}%`} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">方案对比</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">方案</th>
                      <th className="px-3 py-2 font-medium">Reach</th>
                      <th className="px-3 py-2 font-medium">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {picks.map((item) => (
                      <tr key={item.id} className={`border-t border-slate-100 ${item.id === pickId ? "bg-emerald-50/60" : ""}`}>
                        <td className="px-3 py-2">{item.id}</td>
                        <td className="px-3 py-2 tabular-nums">{item.reach}K</td>
                        <td className="px-3 py-2 tabular-nums">{item.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">最近活动</h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {[
                  { label: "更新方案 B 主标题", time: "刚刚" },
                  { label: "调整渠道为信息流", time: "8 分钟前" },
                  { label: "保存版本 v4", time: "今天 10:20" },
                  { label: "导出素材包", time: "昨天" },
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

function Chip({
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
    <div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-emerald-500/25 ${
              value === option
                ? "border-emerald-600 bg-emerald-600 text-white"
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  )
}
