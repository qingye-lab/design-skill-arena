"use client"

import { useRef, useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Save,
  Settings2,
  Sparkles,
  Target,
  Users,
} from "lucide-react"

type VariantId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-app-builder"

const variants: {
  id: VariantId
  name: string
  headline: string
  subline: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "功能演绎",
    headline: "把会议室的每一个想法，变成台上的一句话",
    subline: "Aurora X1 智能音箱，远场拾音加三秒唤醒，团队协作不用再重复第二遍。",
    reach: 862,
    ctr: 4.1,
    conversion: 2.8,
  },
  {
    id: "B",
    name: "场景代入",
    headline: "晚八点的家，声音从厨房传向客厅",
    subline: "360° 声场让音乐跟着人走，而不是跟着设备走。",
    reach: 798,
    ctr: 4.6,
    conversion: 3.1,
  },
  {
    id: "C",
    name: "技术宣言",
    headline: "安静，是新一代算力最响亮的表达",
    subline: "边缘 AI 芯片加持，离线响应低于 80ms，不联网也懂你。",
    reach: 935,
    ctr: 3.8,
    conversion: 2.5,
  },
]

const audiences = ["科技发烧友", "都市白领", "家庭用户", "企业采购"]
const channels = ["落地页", "信息流广告", "邮件营销", "线下快闪"]
const tones = ["专业可信", "轻松活泼", "冷静克制", "热情高亢"]
const styles = ["清爽蓝白", "森林绿调", "深邃暗色", "暖阳橙调"]

type LogRow = { id: number; label: string; time: string }

let logSeed = 0

export default function StandardBuilderShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 智能音箱的新品发布规划一次整合营销，突出远场拾音与离线 AI 能力，面向科技与生活方式人群。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [variantId, setVariantId] = useState<VariantId>("A")
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [saved, setSaved] = useState(false)
  const [exported, setExported] = useState(false)
  const [logs, setLogs] = useState<LogRow[]>([
    { id: 1, label: "工作台就绪，已载入默认 Brief", time: "刚刚" },
    { id: 2, label: "预测模型完成校准", time: "刚刚" },
  ])
  const hoverTimer = useRef<number | null>(null)

  const variant = variants.find((item) => item.id === variantId) ?? variants[0]

  function push(label: string) {
    logSeed += 1
    setLogs((prev) => [{ id: logSeed + 100, label, time: "刚刚" }, ...prev].slice(0, 12))
  }

  const channelMul = channel === "落地页" ? 1.06 : channel === "信息流广告" ? 0.95 : 1
  const toneMul = tone === "热情高亢" ? 1.05 : tone === "轻松活泼" ? 1.02 : 1
  const styleMul = style === "暖阳橙调" ? 1.04 : style === "深邃暗色" ? 0.97 : 1
  const reach = Math.round(variant.reach * channelMul)
  const ctr = Number((variant.ctr * toneMul).toFixed(1))
  const conversion = Number((variant.conversion * styleMul).toFixed(1))

  function run(action: "generate" | "save" | "export") {
    if (busy) return
    setBusy(true)
    if (action === "generate") setPhase("loading")
    push(
      action === "generate" ? "开始生成创意" : action === "save" ? "开始保存方案" : "开始导出素材包"
    )
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      setBusy(false)
      const failed = action === "export" ? Math.random() < 0.12 : false
      if (action === "generate") {
        setPhase(failed ? "error" : "success")
        push(failed ? "生成失败，请补充 Brief 后重试" : "生成完成，三个方案已刷新")
      } else if (action === "save") {
        setSaved(!failed)
        push(failed ? "保存失败，本地草稿已保留" : "方案已保存到本地草稿")
      } else {
        setExported(!failed)
        push(failed ? "导出中断，请重试" : "素材包导出完成")
      }
    }, 1100)
  }

  const theme =
    style === "森林绿调"
      ? { canvas: "from-emerald-50 via-teal-50 to-emerald-100 text-emerald-950", accent: "bg-emerald-600 hover:bg-emerald-700" }
      : style === "深邃暗色"
        ? { canvas: "from-slate-900 via-slate-900 to-slate-800 text-slate-100", accent: "bg-slate-100 text-slate-900 hover:bg-white" }
        : style === "暖阳橙调"
          ? { canvas: "from-orange-50 via-amber-50 to-amber-100 text-orange-950", accent: "bg-orange-600 hover:bg-orange-700" }
          : { canvas: "from-blue-50 via-slate-50 to-slate-100 text-blue-950", accent: "bg-blue-600 hover:bg-blue-700" }

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-900 md:p-6">
      <div className="mx-auto grid max-w-[1500px] gap-3 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">{MODEL}</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600">
                {SKILL}
              </span>
            </div>
            <h1 className="mt-3 text-base font-bold">Standard Builder · 新品发布工作台</h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              以标准构建流程组织 Campaign：参数、预览、指标在一个入口里闭环。
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="size-4 text-slate-400" /> 活动参数
            </div>
            <div className="space-y-4">
              <ChipGroup label="目标人群" options={audiences} value={audience} onChange={setAudience} />
              <ChipGroup label="投放渠道" options={channels} value={channel} onChange={setChannel} />
              <ChipGroup label="沟通语气" options={tones} value={tone} onChange={setTone} />
              <ChipGroup label="视觉风格" options={styles} value={style} onChange={setStyle} />
            </div>
          </section>

          <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <label htmlFor="brief-sb41" className="mb-2 block text-sm font-semibold">
              Campaign Brief
            </label>
            <textarea
              id="brief-sb41"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              onBlur={() => push("Brief 已更新并记录版本")}
              className="min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/20"
              placeholder="描述新品、目标与核心信息…"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>失焦时自动记录版本</span>
              <span>{brief.length} 字</span>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap gap-2">
              {variants.map((item) => {
                const active = item.id === variantId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setVariantId(item.id)
                      push(`切换到方案 ${item.id} · ${item.name}`)
                    }}
                    aria-pressed={active}
                    className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <span className="inline-flex size-5 items-center justify-center rounded-full border border-current text-[11px]">
                      {item.id}
                    </span>
                    {item.name}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton
                icon={busy && phase === "loading" ? Loader2 : Sparkles}
                label="生成"
                solid
                disabled={busy}
                spin={busy && phase === "loading"}
                onClick={() => run("generate")}
              />
              <ActionButton
                icon={saved ? CheckCircle2 : Save}
                label="保存"
                success={saved}
                disabled={busy}
                onClick={() => run("save")}
              />
              <ActionButton
                icon={exported ? CheckCircle2 : Download}
                label="导出"
                success={exported}
                disabled={busy}
                onClick={() => run("export")}
              />
            </div>
          </div>

          {phase === "success" && (
            <Status tone="ok" icon={<CheckCircle2 className="size-4" />}>
              创意已生成，A / B / C 三个方案均已更新。
            </Status>
          )}
          {phase === "error" && (
            <Status tone="bad" icon={<CircleX className="size-4" />}>
              生成失败：Brief 信息不足，请补充目标与预算后重试。
            </Status>
          )}

          <div
            className={`relative flex min-h-[380px] flex-1 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-sm transition-colors duration-500 md:p-10 ${theme.canvas}`}
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
              {["0%", "25%", "50%", "75%", "100%"].map((left) => (
                <div key={left} className="absolute top-0 h-full w-px bg-current" style={{ left }} />
              ))}
            </div>
            <div className="relative flex items-start justify-between">
              <span className="rounded-md bg-white/70 px-2.5 py-1 text-xs font-semibold tracking-wide backdrop-blur">
                {channel} · {tone}
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/70 backdrop-blur">
                <Target className="size-4" />
              </span>
            </div>
            <div className="relative max-w-2xl py-6">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
                面向 {audience} 的主视觉 · 方案 {variantId}
              </div>
              <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{variant.headline}</h2>
              <p className="mb-6 max-w-xl text-sm opacity-75 md:text-base">{variant.subline}</p>
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-slate-900/40 active:scale-95 ${theme.accent}`}
              >
                查看详情 <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="relative flex flex-wrap gap-2">
              {["远场拾音", "离线 AI", "360° 声场", "多设备联动"].map((tag) => (
                <span key={tag} className="rounded-full border border-current/15 bg-white/60 px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <BarChart3 className="size-4 text-slate-400" /> 预测指标
            </div>
            <div className="space-y-2.5">
              <MetricRow label="Reach" value={reach.toLocaleString()} unit="K 曝光" />
              <MetricRow label="CTR" value={ctr.toFixed(1)} unit="%" />
              <MetricRow label="Conversion" value={conversion.toFixed(1)} unit="%" />
              <div className="pt-1">
                <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                  <span>触达效率</span>
                  <span>{Math.min(Math.round(ctr * 18), 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${Math.min(ctr * 18, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Users className="size-4 text-slate-400" /> 受众分布
            </div>
            <ul className="space-y-2">
              {audiences.map((item, index) => (
                <li key={item} className="flex items-center gap-2 text-xs">
                  <span className="w-16 shrink-0 text-slate-500">{item}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className={`block h-full rounded-full transition-all duration-500 ${
                        item === audience ? "bg-blue-600" : "bg-slate-300"
                      }`}
                      style={{ width: `${72 - index * 13}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Activity className="size-4 text-slate-400" /> 最近活动
            </div>
            <ul className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
              {logs.map((row) => (
                <li
                  key={row.id}
                  className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm transition-colors hover:bg-blue-50"
                >
                  <Activity className="mt-0.5 size-3.5 shrink-0 text-slate-300" />
                  <span className="flex-1 text-slate-700">{row.label}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">{row.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

function ChipGroup({
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
      <div className="mb-1.5 text-xs font-semibold text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 ${
              value === option
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function MetricRow({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base font-bold text-slate-900">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span>
      </span>
    </div>
  )
}

function Status({
  tone,
  icon,
  children,
}: {
  tone: "ok" | "bad"
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const cls =
    tone === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800"
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${cls}`}>
      {icon}
      {children}
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  solid = false,
  success = false,
  spin = false,
}: {
  icon: typeof Sparkles
  label: string
  onClick: () => void
  disabled?: boolean
  solid?: boolean
  success?: boolean
  spin?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 disabled:opacity-60 ${
        solid
          ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          : "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className={`size-4 ${success ? "text-emerald-600" : ""} ${spin ? "animate-spin" : ""}`} />
      {label}
    </button>
  )
}
