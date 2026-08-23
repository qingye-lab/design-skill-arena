"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Bolt,
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Save,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  tag: string
  headline: string
  subline: string
  spec: string
  from: string
  to: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "城市飞驰",
    tag: "CONCEPT 01 · URBAN",
    headline: "红绿灯之间，你是最短的直线",
    subline: "Volt V2 电动滑板 25km/h 极速与 40km 续航，把通勤路上的等待全部折叠。",
    spec: "25km/h · 40km",
    from: "#22c55e",
    to: "#0ea5e9",
    reach: 954,
    ctr: 5.3,
    conversion: 3.5,
  },
  {
    id: "B",
    name: "疾风少年",
    tag: "CONCEPT 02 · FREE",
    headline: "风追不上的人，才会看见新的路",
    subline: "双电机四驱与液压减震，Volt 把每一次起步都变成一次小飞行。",
    spec: "双电机 · 液压减震",
    from: "#f97316",
    to: "#ef4444",
    reach: 1012,
    ctr: 5.1,
    conversion: 3.2,
  },
  {
    id: "C",
    name: "都市慢行",
    tag: "CONCEPT 03 · CALM",
    headline: "快，是为了有更多时间慢下来",
    subline: "静音电机与智能巡航，Volt 在城市里安静穿行，不惊扰任何一场风。",
    spec: "静音 · 智能巡航",
    from: "#8b5cf6",
    to: "#ec4899",
    reach: 887,
    ctr: 4.9,
    conversion: 3.7,
  },
]

const audiences = ["通勤青年", "大学生", "骑行爱好者", "新潮白领"]
const channels = ["开屏广告", "新品发布会", "线下试驾", "内容种草"]
const tones = ["生猛直接", "潮流自信", "轻松玩味", "克制高级"]
const styles = ["电光绿", "落日橙", "炫彩紫", "雾白"]

export default function VisualImpeccableShowcase() {
  const [brief, setBrief] = useState(
    "Volt V2 电动滑板新品发布：以「把通勤变成冒险」为主题，先在开屏与发布会造势。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "主视觉渲染完成" },
    { id: "s2", time: now(), label: "预测引擎就绪" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`主视觉切换：${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`参数更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "生猛直接" ? 1.06 : tone === "潮流自信" ? 1.03 : 1
    const styleMul = style === "落日橙" ? 1.04 : style === "雾白" ? 0.97 : 1
    const channelMul = channel === "开屏广告" ? 1.08 : channel === "内容种草" ? 1.04 : 1
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

  const gradient = useMemo(() => {
    if (style === "落日橙") return { from: "#f97316", to: "#ef4444" }
    if (style === "炫彩紫") return { from: "#8b5cf6", to: "#ec4899" }
    if (style === "雾白") return { from: "#64748b", to: "#334155" }
    return { from: "#22c55e", to: "#0ea5e9" }
  }, [style])

  const primaryStyle = useMemo(() => {
    if (style === "落日橙") return "bg-orange-600 hover:bg-orange-700"
    if (style === "炫彩紫") return "bg-violet-600 hover:bg-violet-700"
    if (style === "雾白") return "bg-slate-800 hover:bg-slate-900"
    return "bg-emerald-600 hover:bg-emerald-700"
  }, [style])

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-3 py-1 text-xs font-black text-white shadow-md">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-500">
              frontend-skill + impeccable
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap className="size-3.5 text-amber-500" /> 视觉引擎 · 精修模式已开启
          </div>
        </header>

        <div
          key={conceptId}
          className="arena-enter relative overflow-hidden rounded-3xl p-8 text-white shadow-xl md:p-12"
          style={{ background: `linear-gradient(120deg, ${gradient.from} 0%, ${gradient.to} 100%)` }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-24 size-80 rounded-full bg-white/40 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-black/20 blur-3xl" />
          </div>
          <div className="absolute right-6 top-6 hidden items-center gap-2 md:flex">
            <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              {channel}
            </span>
            <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              {tone}
            </span>
          </div>

          <div className="relative max-w-3xl py-6 md:py-10">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.35em] text-white/70">
              <Bolt className="size-4" /> {concept.tag}
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">{concept.headline}</h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">{concept.subline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                className={`rounded-full px-7 py-3 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/50 active:scale-95 ${primaryStyle}`}
              >
                参与发布会 <TrendingUp className="ml-1 inline size-4" />
              </button>
              <span className="flex items-center gap-1.5 text-xs text-white/80">
                <CheckCircle2 className="size-4" /> {concept.spec}
              </span>
            </div>
          </div>

          <div className="relative flex flex-wrap gap-2 border-t border-white/20 pt-4 text-xs text-white/85">
            {["双电机", "液压减震", "IPX6 防水", "折叠便携"].map((t) => (
              <span key={t} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 backdrop-blur">
                {t}
              </span>
            ))}
            <span className="ml-auto text-white/60">面向 {audience}</span>
          </div>
        </div>

        {generateState === "success" && (
          <div className="arena-enter mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <CheckCircle2 className="size-4" /> 生成完成：主视觉与指标已更新，对比度与可读性通过检查。
          </div>
        )}
        {generateState === "error" && (
          <div className="arena-enter mt-4 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            <CircleX className="size-4" /> 生成失败：发布会信息缺失，请补充日期与场地。
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all focus-visible:ring-3 focus-visible:ring-slate-900/20 ${
                      conceptId === c.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full border border-current text-[11px]">
                      {c.id}
                    </span>
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <PolishButton
                  solid
                  disabled={busy}
                  onClick={() => runAsync(setGenerateState, "生成创意", 0.08)}
                  icon={busy ? Loader2 : Sparkles}
                  spin={busy}
                >
                  生成
                </PolishButton>
                <PolishButton
                  disabled={busy}
                  success={saveState === "success"}
                  onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                  icon={saveState === "success" ? CheckCircle2 : Save}
                >
                  保存
                </PolishButton>
                <PolishButton
                  disabled={busy}
                  success={exportState === "success"}
                  onClick={() => runAsync(setExportState, "导出素材", 0.05)}
                  icon={exportState === "success" ? CheckCircle2 : Download}
                >
                  导出
                </PolishButton>
              </div>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-4 text-sm font-bold">发布参数</div>
              <div className="grid gap-4 sm:grid-cols-2">
                <RefinedField label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                <RefinedField label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                <RefinedField label="语气" options={tones} value={tone} onChange={setTone} />
                <RefinedField label="视觉风格" options={styles} value={style} onChange={setStyle} />
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <label htmlFor="brief-vi" className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Campaign Brief
                </label>
                <textarea
                  id="brief-vi"
                  value={brief}
                  onChange={(e) => {
                    setBrief(e.target.value)
                    if (e.target.value.length % 22 === 0) log("Brief 更新")
                  }}
                  className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-all focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/15"
                  placeholder="产品 / 人群 / 发布会信息…"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 text-sm font-bold">预测指标</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniMetric label="Reach" value={metrics.reach.toLocaleString()} unit="K" ratio={Math.min(metrics.reach / 11, 100)} color="from-emerald-400 to-sky-500" />
                <MiniMetric label="CTR" value={metrics.ctr.toFixed(1)} unit="%" ratio={Math.min(metrics.ctr * 18, 100)} color="from-amber-400 to-orange-500" />
                <MiniMetric label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" ratio={Math.min(metrics.conversion * 24, 100)} color="from-violet-400 to-fuchsia-500" />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold">最近操作</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  LIVE
                </span>
              </div>
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition-colors hover:border-slate-200 hover:bg-white"
                  >
                    <span className="mt-1 flex size-4 items-center justify-center rounded-full bg-slate-900">
                      <Check className="size-2.5 text-white" />
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-700">{a.label}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-slate-400">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-relaxed text-slate-400 shadow-xs">
              全部按钮带 focus 环与按压反馈；加载时禁用重复提交；成功与错误均有独立文案提示。
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function RefinedField({
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
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-500/25 ${
              value === opt
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MiniMetric({
  label,
  value,
  unit,
  ratio,
  color,
}: {
  label: string
  value: string
  unit: string
  ratio: number
  color: string
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-900">
        {value}
        <span className="ml-0.5 text-xs font-medium text-slate-400">{unit}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
        <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${color}`} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  )
}

function PolishButton({
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
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-900/20 disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-slate-900 text-white shadow-md hover:bg-slate-700"
            : "border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
