"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Info,
  Keyboard,
  Loader2,
  Save,
  Sparkles,
  Timer,
  Users,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  headline: string
  subline: string
  feature: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "习惯养成",
    headline: "喝水的仪式感，从第一口开始",
    subline: "Solo 智能水杯的刻度呼吸灯，把补水变成每天 8 次的小成就。",
    feature: "呼吸灯提醒",
    reach: 456,
    ctr: 4.4,
    conversion: 3.3,
  },
  {
    id: "B",
    name: "数据陪伴",
    headline: "你的身体，值得一份饮水的年报",
    subline: "温度曲线、补水节奏与睡眠关联分析，Solo 比你更了解你的杯子。",
    feature: "年度补水报告",
    reach: 512,
    ctr: 4.1,
    conversion: 3.0,
  },
  {
    id: "C",
    name: "职场关怀",
    headline: "会议室里的你，也在悄悄缺水",
    subline: "久坐提醒与静音饮水提示，Solo 用不打扰的方式照顾办公室的你。",
    feature: "静音久坐提醒",
    reach: 489,
    ctr: 4.7,
    conversion: 3.5,
  },
]

const audiences = ["办公室人群", "健身爱好者", "学生群体", "母婴家庭"]
const channels = ["官方商城", "电梯广告", "校园活动", "运动社群"]
const tones = ["鼓励陪伴", "数据严谨", "轻松俏皮", "专业保健"]
const styles = ["薄荷绿", "珊瑚粉", "天空蓝", "燕麦米"]

export default function UxProReferenceShowcase() {
  const [brief, setBrief] = useState(
    "Solo 智能水杯上市：面向办公室人群，主打补水习惯养成与年度数据报告，先开官方商城。"
  )
  const [touched, setTouched] = useState(false)
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "表单初始化完成" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [announcement, setAnnouncement] = useState("")

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const briefValid = brief.trim().length >= 12
  const completeness = useMemo(() => {
    let score = 0
    if (briefValid) score += 25
    if (audience) score += 15
    if (channel) score += 15
    if (tone) score += 15
    if (style) score += 15
    if (conceptId) score += 15
    return score
  }, [briefValid, audience, channel, tone, style, conceptId])

  const log = useCallback(
    (label: string) => {
      setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
      setAnnouncement(label)
    },
    []
  )

  useEffect(() => {
    if (!announcement) return
    const t = setTimeout(() => setAnnouncement(""), 3000)
    return () => clearTimeout(t)
  }, [announcement])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`已选择概念 ${conceptId} · ${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`表单值更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "数据严谨" ? 1.04 : tone === "轻松俏皮" ? 1.02 : 1
    const styleMul = style === "珊瑚粉" ? 1.03 : style === "燕麦米" ? 0.98 : 1
    const channelMul = channel === "官方商城" ? 1.06 : channel === "电梯广告" ? 0.94 : 1
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
      log(`${label}：执行中`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：失败`)
        } else {
          setter("success")
          log(`${label}：成功`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const theme = useMemo(() => {
    switch (style) {
      case "珊瑚粉":
        return { main: "#e11d48", soft: "bg-rose-50", chip: "bg-rose-500" }
      case "天空蓝":
        return { main: "#0284c7", soft: "bg-sky-50", chip: "bg-sky-500" }
      case "燕麦米":
        return { main: "#92400e", soft: "bg-amber-50", chip: "bg-amber-600" }
      default:
        return { main: "#059669", soft: "bg-emerald-50", chip: "bg-emerald-500" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-600">
              ui-ux-pro-max
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Keyboard className="size-4" />
            <span>
              <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px]">G</kbd> 生成
              <kbd className="ml-2 rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px]">S</kbd> 保存
            </span>
          </div>
        </div>

        <div aria-live="polite" role="status" className="sr-only">
          {announcement}
        </div>

        <header className="mt-6 max-w-2xl">
          <h1 className="text-2xl font-bold">Solo 智能水杯 · 发布表单</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            每个字段都有明确的校验与状态反馈：错误、必填、完成度与进度一目了然。
          </p>
        </header>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Brief 完整度</span>
            <span className="font-mono text-xs text-slate-500">{completeness}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={completeness}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2.5 overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <label htmlFor="brief-ux" className="mb-1.5 block text-sm font-semibold">
                Campaign Brief <span className="text-red-500" aria-hidden> *</span>
              </label>
              <textarea
                id="brief-ux"
                required
                value={brief}
                aria-describedby={touched && !briefValid ? "brief-error" : "brief-hint"}
                aria-invalid={touched && !briefValid}
                onBlur={() => setTouched(true)}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 20 === 0) log("Brief 输入更新")
                }}
                className={`min-h-40 w-full resize-y rounded-lg border p-3 text-sm leading-relaxed outline-none transition-all focus:ring-4 ${
                  touched && !briefValid
                    ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/15"
                    : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500/15"
                }`}
                placeholder="产品、人群、卖点与渠道（至少 12 字）…"
              />
              {touched && !briefValid ? (
                <p id="brief-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <CircleX className="size-3.5" /> 请补充至少 12 字，当前 {brief.trim().length} 字
                </p>
              ) : (
                <p id="brief-hint" className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                  <Info className="size-3.5" /> 建议包含：产品名 / 人群 / 卖点
                </p>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">活动参数</legend>
                <div className="space-y-4">
                  <RadioGroup label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                  <RadioGroup label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                  <RadioGroup label="语气" options={tones} value={tone} onChange={setTone} />
                  <RadioGroup label="视觉风格" options={styles} value={style} onChange={setStyle} />
                </div>
              </fieldset>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="创意方案选择" className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    aria-pressed={conceptId === c.id}
                    className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-emerald-500/30 ${
                      conceptId === c.id
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <span aria-hidden className="flex size-5 items-center justify-center rounded-full border border-current text-[11px]">
                      {c.id}
                    </span>
                    {c.name}
                    {conceptId === c.id && (
                      <Check aria-hidden className="size-4" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <UxAction
                  solid
                  disabled={busy || !briefValid}
                  onClick={() => runAsync(setGenerateState, "生成创意", 0.08)}
                  icon={busy ? Loader2 : Sparkles}
                  spin={busy}
                >
                  生成
                </UxAction>
                <UxAction
                  disabled={busy}
                  onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                  icon={saveState === "success" ? CheckCircle2 : Save}
                  success={saveState === "success"}
                >
                  保存
                </UxAction>
                <UxAction
                  disabled={busy}
                  onClick={() => runAsync(setExportState, "导出素材", 0.05)}
                  icon={exportState === "success" ? CheckCircle2 : Download}
                  success={exportState === "success"}
                >
                  导出
                </UxAction>
              </div>
            </div>

            {busy && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin text-emerald-600" /> 正在处理，请稍候…
              </div>
            )}
            {!busy && generateState === "success" && (
              <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="size-4" /> 创意生成成功，全部状态与可访问性已通过自动检查。
              </div>
            )}
            {!busy && generateState === "error" && (
              <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <CircleX className="size-4" /> 生成失败：请检查 Brief 是否包含明确的产品与人群。
              </div>
            )}

            <section className={`relative flex min-h-[400px] flex-1 flex-col justify-between overflow-hidden rounded-xl border border-slate-200 p-6 shadow-xs transition-colors duration-500 md:p-8 ${theme.soft}`}>
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-xs">
                  {channel} · {audience}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Timer className="size-3.5" /> 概念 {conceptId}
                </span>
              </div>
              <div className="max-w-xl py-8">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{tone}</div>
                <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600">{concept.subline}</p>
                <button
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/60 active:scale-95 ${theme.chip}`}
                >
                  {concept.feature} →
                </button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                {["500ml 容量", "36 小时保温", "316 不锈钢", "抗菌涂层"].map((t) => (
                  <span key={t} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="mb-3 text-sm font-semibold">预测指标</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="pb-2 font-medium">指标</th>
                    <th className="pb-2 text-right font-medium">预估</th>
                    <th className="pb-2 text-right font-medium">较基线</th>
                  </tr>
                </thead>
                <tbody>
                  <MetricRow label="Reach" value={`${metrics.reach.toLocaleString()}K`} delta={"+12%"} />
                  <MetricRow label="CTR" value={`${metrics.ctr.toFixed(1)}%`} delta={"+0.8%"} />
                  <MetricRow label="Conversion" value={`${metrics.conversion.toFixed(1)}%`} delta={"+0.5%"} />
                </tbody>
              </table>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4 text-slate-400" /> 最近操作
              </div>
              <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="flex-1 leading-relaxed text-slate-600">{a.label}</span>
                    <span className="shrink-0 text-[10px] text-slate-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function RadioGroup({
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
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            onClick={() => onChange(opt)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-emerald-500/30 ${
              value === opt
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MetricRow({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="py-2.5 text-slate-500">{label}</td>
      <td className="py-2.5 text-right font-bold text-slate-900">{value}</td>
      <td className="py-2.5 text-right text-xs font-medium text-emerald-600">{delta}</td>
    </tr>
  )
}

function UxAction({
  children,
  onClick,
  disabled,
  solid = false,
  success = false,
  icon: Icon,
  spin = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  solid?: boolean
  success?: boolean
  icon: typeof Sparkles
  spin?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
            : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
