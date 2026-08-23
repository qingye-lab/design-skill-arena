"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleX,
  Download,
  Layers,
  Loader2,
  Save,
  Settings2,
  Sparkles,
  Target,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  headline: string
  subline: string
  chip: string
  reach: number
  ctr: number
  conversion: number
}

type ActivityRow = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "功能演绎",
    headline: "把会议室的每一个想法，变成台上的一句话",
    subline: "Aurora X1 智能音箱——清晰拾音，三秒唤醒，让团队协作不再重复第二遍。",
    chip: "bg-blue-600",
    reach: 862,
    ctr: 4.1,
    conversion: 2.8,
  },
  {
    id: "B",
    name: "场景代入",
    headline: "晚八点的家，声音从厨房传向客厅",
    subline: "Aurora X1 的 360° 声场，让音乐跟着人走，而不是跟着设备。",
    chip: "bg-emerald-600",
    reach: 798,
    ctr: 4.6,
    conversion: 3.1,
  },
  {
    id: "C",
    name: "技术宣言",
    headline: "安静，是新一代算力最响亮的表达",
    subline: "边缘 AI 芯片加持，Aurora X1 离线响应低于 80ms，不联网也懂你。",
    chip: "bg-slate-800",
    reach: 935,
    ctr: 3.8,
    conversion: 2.5,
  },
]

const audiences = ["科技发烧友", "都市白领", "家庭用户", "企业采购"]
const channels = ["落地页", "信息流广告", "邮件营销", "线下快闪"]
const tones = ["专业可信", "轻松活泼", "冷静克制", "热情高亢"]
const styles = ["清爽蓝白", "森林绿调", "深邃暗色", "暖阳橙调"]

export default function StandardBuilderShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 智能音箱的新品发布规划一次整合营销，突出远场拾音与离线 AI 能力，面向科技与生活方式人群。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<ActivityRow[]>([
    { id: "seed-1", time: now(), label: "工作台就绪，已载入默认 Brief" },
    { id: "seed-2", time: now(), label: "预测模型完成校准" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [hovered, setHovered] = useState<Concept["id"] | null>(null)

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 16))
  }, [])

  useEffect(() => {
    log(`已切换创意方案 ${conceptId} · ${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`控制项更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "热情高亢" ? 1.05 : tone === "轻松活泼" ? 1.02 : 1
    const styleMul = style === "暖阳橙调" ? 1.04 : style === "深邃暗色" ? 0.97 : 1
    const channelMul = channel === "落地页" ? 1.06 : channel === "信息流广告" ? 0.95 : 1
    return {
      reach: Math.round(concept.reach * channelMul),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * styleMul).toFixed(1)),
    }
  }, [concept, tone, style, channel])

  const runAsync = useCallback(
    (setter: (v: "idle" | "success" | "error") => void, label: string, failChance = 0) => {
      if (busy) return
      setBusy(true)
      setter("idle")
      log(`${label}：开始执行`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：失败，请重试`)
        } else {
          setter("success")
          log(`${label}：完成`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const theme = useMemo(() => {
    switch (style) {
      case "森林绿调":
        return { bg: "from-emerald-50 to-teal-100 text-emerald-950", btn: "bg-emerald-600 hover:bg-emerald-700" }
      case "深邃暗色":
        return { bg: "from-slate-900 to-slate-800 text-slate-100", btn: "bg-slate-100 text-slate-900 hover:bg-white" }
      case "暖阳橙调":
        return { bg: "from-orange-50 to-amber-100 text-orange-950", btn: "bg-orange-600 hover:bg-orange-700" }
      default:
        return { bg: "from-blue-50 to-slate-100 text-blue-950", btn: "bg-blue-600 hover:bg-blue-700" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-900 md:p-5">
      <div className="mx-auto grid max-w-[1500px] gap-3 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <Header />
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
            <label htmlFor="brief-sb" className="mb-2 block text-sm font-semibold">
              Campaign Brief
            </label>
            <textarea
              id="brief-sb"
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (e.target.value.length % 24 === 0) log("Brief 内容更新")
              }}
              className="min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/20"
              placeholder="描述新品、目标与核心信息…"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>回车即自动记录版本</span>
              <span>{brief.length} 字</span>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConceptId(c.id)}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`relative rounded-lg border px-3 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 ${
                    conceptId === c.id
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full border border-current text-[11px]">
                    {c.id}
                  </span>
                  {c.name}
                  {hovered === c.id && conceptId !== c.id && (
                    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white">
                      点击替换主创意
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <ActionButton
                icon={busy ? Loader2 : Sparkles}
                label="生成"
                spin={busy}
                solid
                disabled={busy}
                onClick={() => runAsync(setGenerateState, "生成创意")}
              />
              <ActionButton
                icon={saveState === "success" ? CheckCircle2 : Save}
                label="保存"
                success={saveState === "success"}
                disabled={busy}
                onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
              />
              <ActionButton
                icon={exportState === "success" ? CheckCircle2 : Download}
                label="导出"
                success={exportState === "success"}
                disabled={busy}
                onClick={() => runAsync(setExportState, "导出素材包", 0.05)}
              />
            </div>
          </div>

          {generateState === "success" && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="size-4" /> 创意已生成，三个方案均已更新。
            </div>
          )}
          {generateState === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              <CircleX className="size-4" /> 生成失败：Brief 信息不足，请补充目标与预算后重试。
            </div>
          )}

          <div
            className={`relative flex min-h-[420px] flex-1 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-sm transition-colors duration-500 md:p-10 ${theme.bg}`}
          >
            <div className="absolute inset-0 opacity-[0.07]">
              {["0%", "25%", "50%", "75%", "100%"].map((p) => (
                <div key={p} className="absolute top-0 h-full w-px bg-current" style={{ left: p }} />
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
                面向 {audience} 的主视觉 · 方案 {conceptId}
              </div>
              <h2 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
              <p className="mb-6 max-w-xl text-sm opacity-75 md:text-base">{concept.subline}</p>
              <button
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/60 active:scale-95 ${theme.btn}`}
              >
                查看详情 <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="relative flex flex-wrap gap-2">
              {["远场拾音", "离线 AI", "360° 声场", "多设备联动"].map((t) => (
                <span key={t} className="rounded-full border border-current/15 bg-white/60 px-3 py-1 text-xs">
                  {t}
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
              <MetricRow label="Reach" value={metrics.reach.toLocaleString()} unit="K 曝光" />
              <MetricRow label="CTR" value={metrics.ctr.toFixed(1)} unit="%" />
              <MetricRow label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" />
              <div className="pt-1">
                <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                  <span>触达效率</span>
                  <span>{Math.min(Math.round(metrics.ctr * 18), 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${Math.min(metrics.ctr * 18, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Layers className="size-4 text-slate-400" /> 最近操作
            </div>
            <ul className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {activity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm transition-colors hover:bg-blue-50"
                >
                  <Activity className="mt-0.5 size-3.5 shrink-0 text-slate-300" />
                  <span className="flex-1 text-slate-700">{a.label}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">{a.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">DeepSeek V4 flash 0731</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600">
          frontend-app-builder
        </span>
      </div>
      <h1 className="mt-3 text-base font-bold">Standard Builder · 新品发布工作台</h1>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        以标准构建流程组织 Campaign：参数 → 预览 → 指标，一个入口完成生成与交付。
      </p>
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
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-blue-500/40 ${
              value === opt
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {opt}
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
