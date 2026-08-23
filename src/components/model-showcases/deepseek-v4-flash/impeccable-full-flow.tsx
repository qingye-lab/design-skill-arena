"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Info,
  Loader2,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  headline: string
  subline: string
  kvo: string
  accent: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "克制之美",
    headline: "一杯咖啡的时间，什么都不必多余",
    subline: "Kanso M1 手冲咖啡机，单键操作，92℃ 恒温注水，把仪式感还给味觉。",
    kvo: "单键 · 92℃ 恒温",
    accent: "#b45309",
    reach: 521,
    ctr: 4.8,
    conversion: 3.5,
  },
  {
    id: "B",
    name: "晨间契约",
    headline: "叫醒你的，应该是香气而不是闹钟",
    subline: "Kanso M1 预约冲泡，起床前 6 分钟自动开始，让工作日从一杯手冲开始。",
    kvo: "预约 · 6 分钟唤醒",
    accent: "#0369a1",
    reach: 576,
    ctr: 4.5,
    conversion: 3.2,
  },
  {
    id: "C",
    name: "安静科技",
    headline: "真正的智能，是让你感觉不到它的存在",
    subline: "Kanso M1 静音研磨与自适应水流，技术负责沉默，你负责享受。",
    kvo: "40dB 静音 · 自适应水流",
    accent: "#15803d",
    reach: 498,
    ctr: 5.0,
    conversion: 3.7,
  },
]

const audiences = ["咖啡爱好者", "都市上班族", "设计师群体", "家庭用户"]
const channels = ["官网专题页", "社交媒体", "KOL 种草", "门店体验"]
const tones = ["极简克制", "温暖叙事", "理性客观", "品质自信"]
const styles = ["奶油米白", "雾霭灰蓝", "燕麦棕调", "石墨深灰"]

const steps = ["定义 Brief", "校准方向", "评审交付"]

export default function ImpeccableFullFlowShowcase() {
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState(
    "为 Kanso M1 手冲咖啡机做新品发布传播：定位“克制的科技”，覆盖都市咖啡人群，强调仪式感与自动化并存。"
  )
  const [audience, setAudience] = useState(audiences[1])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "流程已初始化，等待 Brief 确认" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [validated, setValidated] = useState(false)

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 12))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`概念切换至 ${conceptId} · ${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    if (step > 0) log(`进入阶段 ${steps[step]}`)
  }, [step, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "品质自信" ? 1.05 : tone === "温暖叙事" ? 1.02 : 1
    const styleMul = style === "燕麦棕调" ? 1.04 : style === "石墨深灰" ? 0.97 : 1
    const channelMul = channel === "官网专题页" ? 1.05 : channel === "KOL 种草" ? 1.07 : 1
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
          log(`${label}：未通过`)
        } else {
          setter("success")
          log(`${label}：通过`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const confirmBrief = () => {
    if (brief.trim().length < 10) return
    setValidated(true)
    log("Brief 已确认，进入方向校准")
    setStep(1)
  }

  const theme = useMemo(() => {
    switch (style) {
      case "雾霭灰蓝":
        return { bg: "bg-sky-50 text-sky-950", btn: "bg-sky-800 hover:bg-sky-900" }
      case "燕麦棕调":
        return { bg: "bg-amber-50 text-amber-950", btn: "bg-amber-800 hover:bg-amber-900" }
      case "石墨深灰":
        return { bg: "bg-neutral-900 text-neutral-100", btn: "bg-neutral-100 text-neutral-900 hover:bg-white" }
      default:
        return { bg: "bg-orange-50 text-orange-950", btn: "bg-orange-800 hover:bg-orange-900" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-stone-900 px-3 py-1 text-xs font-bold text-white">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-3 py-1 font-mono text-[11px] text-stone-600">
              impeccable
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Wand2 className="size-4" /> 全流程精修模式
          </div>
        </header>

        <div className="mb-8 flex items-center gap-2 md:gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                    i < step
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : i === step
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 bg-white text-stone-400"
                  }`}
                >
                  {i < step ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={`hidden text-sm font-medium sm:block ${i === step ? "text-stone-900" : "text-stone-400"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-emerald-600" : "bg-stone-300"}`} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <section className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <h1 className="text-xl font-bold">先定义这场发布要解决什么问题</h1>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              好的 Brief 决定后续所有方向。请包含：产品名、目标人群、核心卖点与期望语气。
            </p>
            <textarea
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                setValidated(e.target.value.trim().length >= 10)
              }}
              className="mt-5 min-h-44 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-relaxed outline-none transition-all focus:border-stone-900 focus:bg-white focus:ring-4 focus:ring-stone-900/10"
              placeholder="例如：为 XX 新品策划发布，面向 XX 人群，强调 XX 卖点…"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Info className="size-3.5" /> 至少 10 字才能进入下一步
              </span>
              <span>{brief.trim().length} 字</span>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={confirmBrief}
                disabled={!validated}
                className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-stone-700 focus-visible:ring-4 focus-visible:ring-stone-900/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                确认 Brief <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        )}

        {step > 0 && (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="flex flex-col gap-4">
              <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-1 text-xs font-semibold text-stone-400">已确认的 Brief</div>
                <p className="text-sm leading-relaxed text-stone-600 line-clamp-4">{brief}</p>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0)
                    log("返回修改 Brief")
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-stone-900 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-stone-900/30"
                >
                  <ArrowLeft className="size-3.5" /> 修改
                </button>
              </section>

              <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-4 text-sm font-bold">方向参数</div>
                <div className="space-y-4">
                  <Seg label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                  <Seg label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                  <Seg label="语气" options={tones} value={tone} onChange={setTone} />
                  <Seg label="视觉风格" options={styles} value={style} onChange={setStyle} />
                </div>
              </section>

              <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-4 text-sm font-bold">预测指标</div>
                <div className="space-y-2">
                  <Metric label="Reach" value={metrics.reach.toLocaleString()} suffix="K" />
                  <Metric label="CTR" value={metrics.ctr.toFixed(1)} suffix="%" />
                  <Metric label="Conversion" value={metrics.conversion.toFixed(1)} suffix="%" />
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-500">
                  <Info className="size-3.5 shrink-0" /> 指标随概念与参数实时重算
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
                      title={`查看概念 ${c.name}`}
                      className={`relative rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-stone-900/15 ${
                        conceptId === c.id
                          ? "border-stone-900 bg-stone-900 text-white shadow-md"
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
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
                  <Action
                    solid
                    onClick={() => runAsync(setGenerateState, "生成创意", 0.08)}
                    disabled={busy}
                    icon={busy ? Loader2 : Sparkles}
                    spin={busy}
                  >
                    生成
                  </Action>
                  <Action
                    onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                    disabled={busy}
                    icon={saveState === "success" ? CheckCircle2 : Save}
                    success={saveState === "success"}
                  >
                    保存
                  </Action>
                  <Action
                    onClick={() => runAsync(setExportState, "导出交付包", 0.05)}
                    disabled={busy}
                    icon={exportState === "success" ? CheckCircle2 : Download}
                    success={exportState === "success"}
                  >
                    导出
                  </Action>
                </div>
              </div>

              {generateState === "success" && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <CheckCircle2 className="size-4" /> 创意通过校验：文案无截断、配色对比度达标、CTA 可点击区域充足。
                </div>
              )}
              {generateState === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
                  <CircleX className="size-4" /> 校验未通过：主标题在 320px 宽度下溢出两行，请缩短文案。
                </div>
              )}

              <div
                className={`relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-md transition-colors duration-500 md:p-10 ${theme.bg}`}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-current/20 bg-white/60 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {channel} · {audience}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-50">
                    CONCEPT {conceptId}
                  </span>
                </div>
                <div className="max-w-2xl py-8">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] opacity-60">{tone} · {style}</div>
                  <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                  <p className="mb-5 max-w-lg text-sm leading-relaxed opacity-80 md:text-base">{concept.subline}</p>
                  <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-current/25 bg-white/60 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                    <Check className="size-3.5" /> {concept.kvo}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-4">
                  <div className="flex gap-3">
                    {["预约通道", "门店地图", "客服答疑"].map((t) => (
                      <button
                        key={t}
                        className="text-xs font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-current/30"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button className={`rounded-lg px-5 py-2.5 text-sm font-medium shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-current/20 active:scale-95 ${theme.btn}`}>
                    立即预约 <ArrowRight className="ml-1 inline size-4" />
                  </button>
                </div>
              </div>

              <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-3 text-sm font-bold">最近操作</div>
                <ul className="grid gap-2 md:grid-cols-2">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-xs">
                      <span className="size-1.5 rounded-full bg-stone-400" />
                      <span className="flex-1 text-stone-600">{a.label}</span>
                      <span className="text-stone-400">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
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
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-stone-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-stone-900/15 ${
              value === opt
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 px-3 py-2">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-lg font-bold text-stone-900">
        {value}
        <span className="ml-0.5 text-xs font-normal text-stone-400">{suffix}</span>
      </span>
    </div>
  )
}

function Action({
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-stone-900/15 disabled:opacity-60 ${
        success
          ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-stone-900 text-white shadow-sm hover:bg-stone-700"
            : "border border-stone-200 bg-white text-stone-700 hover:border-stone-400"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
