"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Aperture,
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Lightbulb,
  Loader2,
  Save,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  phase: string
  headline: string
  subline: string
  keyline: string
  reach: number
  ctr: number
  conversion: number
  trend: number[]
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "极光",
    phase: "PHASE 01 · 造势",
    headline: "把黄昏，请进客厅",
    subline: "Solstice 落地灯以 2700K–6500K 全域调光复刻日落色温，让黄昏成为家居常驻选项。",
    keyline: "全域色温 · 日落复刻",
    reach: 812,
    ctr: 4.6,
    conversion: 3.3,
    trend: [42, 48, 45, 58, 66, 72],
  },
  {
    id: "B",
    name: "聚焦",
    phase: "PHASE 02 · 发布",
    headline: "一盏灯，一场发布会",
    subline: "发布会现场以 Solstice 阵列构建灯光装置，让产品本身成为舞台。",
    keyline: "发布会灯光装置",
    reach: 866,
    ctr: 4.8,
    conversion: 3.5,
    trend: [38, 44, 52, 61, 69, 81],
  },
  {
    id: "C",
    name: "余晖",
    phase: "PHASE 03 · 转化",
    headline: "关灯以后，故事才刚开始",
    subline: "入睡模式 45 分钟渐暗，Solstice 用光的消退为夜晚划上句点。",
    keyline: "45 分钟渐进暗",
    reach: 779,
    ctr: 4.4,
    conversion: 3.6,
    trend: [45, 47, 53, 57, 63, 70],
  },
]

const audiences = ["高端家居用户", "室内设计师", "氛围感生活博主", "酒店民宿主理人"]
const channels = ["品牌发布会", "家居设计周", "官网专题", "生活方式媒体"]
const tones = ["克制高级", "温暖叙事", "专业严谨", "未来感"]
const styles = ["鎏金暖白", "炭黑极简", "雾灰岩色", "云白米色"]

export default function MaxQualityChainShowcase() {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState(
    "Solstice 落地灯上市传播：以「复刻黄昏」为核心概念，分三阶段推进——造势、发布、转化。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "传播地图载入：三阶段链路就绪" },
    { id: "s2", time: now(), label: "预测模型完成校准" },
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
    log(`阶段创意切换：${concept.phase} · ${concept.name}`)
  }, [conceptId, concept.phase, concept.name, log])

  useEffect(() => {
    log(`策略参数更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "未来感" ? 1.04 : tone === "温暖叙事" ? 1.02 : 1
    const styleMul = style === "鎏金暖白" ? 1.03 : style === "炭黑极简" ? 0.98 : 1
    const channelMul = channel === "品牌发布会" ? 1.05 : channel === "生活方式媒体" ? 1.03 : 1
    return {
      reach: Math.round(concept.reach * channelMul),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * styleMul).toFixed(1)),
      trend: concept.trend.map((v) => Math.round(v * (tone === "未来感" ? 1.04 : 1))),
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
          log(`${label}：未通过终检`)
        } else {
          setter("success")
          log(`${label}：通过终检`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const theme = useMemo(() => {
    switch (style) {
      case "炭黑极简":
        return { bg: "from-stone-900 via-stone-800 to-stone-900 text-stone-100", bar: "bg-stone-100 text-stone-900 hover:bg-white" }
      case "雾灰岩色":
        return { bg: "from-stone-200 via-stone-100 to-stone-200 text-stone-900", bar: "bg-stone-800 text-white hover:bg-stone-900" }
      case "云白米色":
        return { bg: "from-orange-50 via-amber-50 to-orange-50 text-orange-950", bar: "bg-orange-800 text-white hover:bg-orange-900" }
      default:
        return { bg: "from-amber-100 via-yellow-50 to-amber-100 text-amber-950", bar: "bg-amber-800 text-white hover:bg-amber-900" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-slate-900">
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-amber-800 px-3 py-1 text-xs font-black tracking-wide text-white">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-md border border-slate-300 bg-white px-3 py-1 font-mono text-[11px] text-slate-500">
              frontend-design + ui-ux-pro-max + web-interface-guidelines + impeccable
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Aperture className="size-4 text-amber-700" /> 全链路终检模式
          </div>
        </header>

        <div className="mb-6 grid gap-2 sm:grid-cols-4">
          {["策略", "创意", "度量", "交付"].map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStep(i)
                log(`进入阶段：${s}`)
              }}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all focus-visible:ring-3 focus-visible:ring-amber-800/30 ${
                step === i
                  ? "border-amber-800 bg-amber-800 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-500 hover:border-amber-700/40"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full border text-xs font-bold ${
                  step === i ? "border-white/40" : "border-slate-300"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-semibold">{s}</span>
              {i === 3 && (
                <span className={`ml-auto hidden rounded-full px-2 py-0.5 text-[10px] sm:block ${step === 3 ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                  READY
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Target className="size-4 text-amber-700" /> 策略参数
              </div>
              <div className="space-y-4">
                <MaxField label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                <MaxField label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                <MaxField label="语气" options={tones} value={tone} onChange={setTone} />
                <MaxField label="视觉风格" options={styles} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Lightbulb className="size-4 text-amber-700" /> Campaign Brief
              </div>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 28 === 0) log("Brief 更新")
                }}
                className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-all focus:border-amber-800 focus:bg-white focus:ring-4 focus:ring-amber-800/15"
                placeholder="产品 / 阶段节奏 / 人群 / 核心概念…"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>三阶段：造势 → 发布 → 转化</span>
                <span>{brief.length} 字</span>
              </div>
            </section>
          </aside>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`group rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:ring-3 focus-visible:ring-amber-800/30 ${
                      conceptId === c.id
                        ? "border-amber-800 bg-amber-800 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-500 hover:border-amber-700/40 hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full border border-current text-[11px]">
                      {c.id}
                    </span>
                    {c.name}
                    <span className={`ml-2 hidden text-[10px] uppercase tracking-widest md:inline ${conceptId === c.id ? "text-white/70" : "text-slate-300"}`}>
                      {c.phase}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <MaxButton
                  solid
                  disabled={busy}
                  onClick={() => runAsync(setGenerateState, "生成创意", 0.08)}
                  icon={busy ? Loader2 : Sparkles}
                  spin={busy}
                >
                  生成
                </MaxButton>
                <MaxButton
                  disabled={busy}
                  success={saveState === "success"}
                  onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                  icon={saveState === "success" ? CheckCircle2 : Save}
                >
                  保存
                </MaxButton>
                <MaxButton
                  disabled={busy}
                  success={exportState === "success"}
                  onClick={() => runAsync(setExportState, "导出交付包", 0.05)}
                  icon={exportState === "success" ? CheckCircle2 : Download}
                >
                  导出
                </MaxButton>
              </div>
            </div>

            {generateState === "success" && (
              <div className="arena-enter flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <CheckCircle2 className="size-4" /> 终检通过：文案、配色、动效与可访问性全部达标。
              </div>
            )}
            {generateState === "error" && (
              <div className="arena-enter flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                <CircleX className="size-4" /> 终检未过：主标题在移动端溢出，请缩短后重试。
              </div>
            )}

            <div className={`relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-lg transition-colors duration-700 md:p-10 ${theme.bg}`}>
              <div className="absolute inset-0 opacity-[0.08]">
                <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-black/40 blur-3xl" />
              </div>
              <div className="relative flex items-start justify-between">
                <span className="rounded-full border border-current/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {channel} · {tone}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                  {concept.phase}
                </span>
              </div>
              <div className="relative max-w-2xl py-8">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
                  面向 {audience} 的阶段主视觉
                </div>
                <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                <p className="mb-6 max-w-lg text-sm leading-relaxed opacity-85 md:text-base">{concept.subline}</p>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-current/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                  <Wand2 className="size-3.5" /> {concept.keyline}
                </div>
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-4">
                <div className="flex flex-wrap gap-2 text-xs opacity-75">
                  {["全域调光", "日落复刻", "45 分钟渐暗"].map((t) => (
                    <span key={t} className="rounded-full border border-current/20 bg-white/10 px-3 py-1 backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
                <button className={`rounded-lg px-5 py-2.5 text-sm font-medium shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-current/20 active:scale-95 ${theme.bar}`}>
                  进入发布页 →
                </button>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-bold">预测指标</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  置信 92%
                </span>
              </div>
              <div className="space-y-2.5">
                <MaxMetric label="Reach" value={metrics.reach.toLocaleString()} suffix="K" trend={metrics.trend} />
                <MaxMetric label="CTR" value={metrics.ctr.toFixed(1)} suffix="%" trend={metrics.trend.map((v) => Math.round(v * 0.6))} />
                <MaxMetric label="Conversion" value={metrics.conversion.toFixed(1)} suffix="%" trend={metrics.trend.map((v) => Math.round(v * 0.4))} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 text-sm font-bold">阶段进度</div>
              <div className="space-y-2.5">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all focus-visible:ring-3 focus-visible:ring-amber-800/25 ${
                      conceptId === c.id ? "border-amber-800 bg-amber-50" : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className={`font-mono text-[10px] ${conceptId === c.id ? "text-amber-800" : "text-slate-400"}`}>
                      {c.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{c.name}</span>
                      <span className="block truncate text-[10px] text-slate-400">{c.phase}</span>
                    </span>
                    {conceptId === c.id && <Check className="size-3.5 text-amber-800" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 text-sm font-bold">最近操作</div>
              <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                    <span className="size-1.5 shrink-0 rounded-full bg-amber-600" />
                    <span className="flex-1 text-slate-600">{a.label}</span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-400">{a.time}</span>
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

function MaxField({
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
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-amber-800/25 ${
              value === opt
                ? "border-amber-800 bg-amber-800 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-amber-700/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function MaxMetric({ label, value, suffix, trend }: { label: string; value: string; suffix: string; trend: number[] }) {
  const max = Math.max(...trend, 1)
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-xl font-bold text-slate-900">
          {value}
          <span className="ml-0.5 text-xs font-normal text-slate-400">{suffix}</span>
        </span>
      </div>
      <div className="mt-2 flex h-8 items-end gap-1">
        {trend.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-amber-700/70 transition-all duration-500 hover:bg-amber-800"
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function MaxButton({
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-amber-800/25 disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-amber-800 text-white shadow-sm hover:bg-amber-900"
            : "border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-amber-700/40 hover:bg-amber-50"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
