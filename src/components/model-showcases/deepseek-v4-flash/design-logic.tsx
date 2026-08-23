"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  CircleX,
  Download,
  Grid3X3,
  Loader2,
  PenLine,
  Ruler,
  Save,
  Sparkles,
  Type,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  display: string
  kicker: string
  headline: string
  deck: string
  footline: string
  accent: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "字里行间",
    display: "A",
    kicker: "TYPE T-01 · CHAPTER ONE",
    headline: "打字，是思考的另一种呼吸",
    deck: "T-01 机械键盘搭载线性静音轴体，让每一次落键都成为思路的延续。",
    footline: "GASKET 结构 · 五层消音 · 三模连接",
    accent: "#334155",
    reach: 688,
    ctr: 4.3,
    conversion: 3.0,
  },
  {
    id: "B",
    name: "工具的尊严",
    display: "B",
    kicker: "TYPE T-01 · CHAPTER TWO",
    headline: "为职业写作者打造的工具，值得被认真设计",
    deck: "阳极氧化铝机身，热插拔轴座，键盘首先是器物，其次才是外设。",
    footline: "6063 铝合金 · CNC 一体成型 · 1.5kg 配重",
    accent: "#b45309",
    reach: 742,
    ctr: 3.9,
    conversion: 2.7,
  },
  {
    id: "C",
    name: "午夜排版",
    display: "C",
    kicker: "TYPE T-01 · CHAPTER THREE",
    headline: "黑暗模式下的专注，由每一个键帽保证",
    deck: "PBT 侧刻键帽与柔光背光，深夜写作时，视线只属于屏幕与文字。",
    footline: "PBT 侧刻 · 柔光背光 · 低噪 40dB",
    accent: "#0f766e",
    reach: 631,
    ctr: 4.6,
    conversion: 3.3,
  },
]

const audiences = ["职业写作者", "程序员", "产品设计师", "编辑记者"]
const channels = ["印刷海报", "产品官网", "出版行业刊", "创作者社区"]
const tones = ["冷静陈述", "抒情叙事", "锐利短句", "学术严谨"]
const styles = ["灰度版式", "靛蓝印刷", "赭石暖调", "墨绿复古"]

export default function DesignLogicShowcase() {
  const [brief, setBrief] = useState(
    "T-01 机械键盘上市传播：以“打字”为核心意象构建品牌叙事，面向职业写作者与深度用户。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "版式系统初始化：12 栏栅格就绪" },
    { id: "s2", time: now(), label: "三组标题层级已排版" },
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
    log(`换版 ${conceptId} · ${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`版面参数：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "锐利短句" ? 1.05 : tone === "抒情叙事" ? 1.02 : 1
    const styleMul = style === "赭石暖调" ? 1.04 : style === "墨绿复古" ? 0.98 : 1
    const channelMul = channel === "产品官网" ? 1.06 : channel === "印刷海报" ? 0.94 : 1
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
      log(`${label}：排版任务提交`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：字号冲突，需人工复核`)
        } else {
          setter("success")
          log(`${label}：版式定稿`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const palette = useMemo(() => {
    switch (style) {
      case "靛蓝印刷":
        return { bg: "bg-indigo-50 text-indigo-950", rule: "bg-indigo-900", chip: "border-indigo-300 text-indigo-800" }
      case "赭石暖调":
        return { bg: "bg-amber-50 text-amber-950", rule: "bg-amber-800", chip: "border-amber-300 text-amber-800" }
      case "墨绿复古":
        return { bg: "bg-emerald-50 text-emerald-950", rule: "bg-emerald-900", chip: "border-emerald-300 text-emerald-800" }
      default:
        return { bg: "bg-slate-100 text-slate-900", rule: "bg-slate-800", chip: "border-slate-300 text-slate-700" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#f4f1ec] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-slate-300/60 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-slate-900 px-3 py-1 text-xs font-bold tracking-widest text-white">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-sm border border-slate-400/60 px-3 py-1 font-mono text-[11px] text-slate-600">
              frontend-design
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Ruler className="size-4" /> 12 栏栅格 · 8pt 基准线
          </div>
        </div>

        <header className="mb-10 max-w-3xl">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            01 / Campaign Brief
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">T-01 上市传播 · 版式工作台</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            以印刷逻辑组织页面：Brief 定信息，参数定层级，预览定版式，指标定取舍。
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-6">
            <section className="border border-slate-300/60 bg-white p-5 shadow-[4px_4px_0_rgba(15,23,42,0.08)]">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                <PenLine className="size-4" /> Brief
              </div>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 22 === 0) log("Brief 修订")
                }}
                className="min-h-40 w-full resize-y border border-slate-300 bg-[#faf9f7] p-3 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15"
                placeholder="产品 / 目标 / 核心信息…"
              />
            </section>

            <section>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                02 / 版面参数
              </div>
              <div className="flex flex-col gap-4 border border-slate-300/60 bg-white p-5 shadow-[4px_4px_0_rgba(15,23,42,0.08)]">
                <NumberedSelect num="A" label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                <NumberedSelect num="B" label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                <NumberedSelect num="C" label="叙述语气" options={tones} value={tone} onChange={setTone} />
                <NumberedSelect num="D" label="色彩体系" options={styles} value={style} onChange={setStyle} />
              </div>
            </section>

            <section>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                03 / 版式指标
              </div>
              <div className="flex flex-col gap-2 border border-slate-300/60 bg-white p-5 shadow-[4px_4px_0_rgba(15,23,42,0.08)]">
                <PrintMetric label="Reach" value={metrics.reach.toLocaleString()} unit="K" />
                <PrintMetric label="CTR" value={metrics.ctr.toFixed(1)} unit="%" />
                <PrintMetric label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" />
              </div>
            </section>
          </aside>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`border px-4 py-2 font-mono text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-slate-900/30 ${
                      conceptId === c.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {c.name} · {c.display}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <PrintButton
                  onClick={() => runAsync(setGenerateState, "重新排版")}
                  disabled={busy}
                  solid
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
                </PrintButton>
                <PrintButton
                  onClick={() => runAsync(setSaveState, "保存版面", 0.1)}
                  disabled={busy}
                  success={saveState === "success"}
                >
                  {saveState === "success" ? <Check className="size-4" /> : <Save className="size-4" />} 保存
                </PrintButton>
                <PrintButton
                  onClick={() => runAsync(setExportState, "导出印刷稿", 0.05)}
                  disabled={busy}
                  success={exportState === "success"}
                >
                  {exportState === "success" ? <Check className="size-4" /> : <Download className="size-4" />} 导出
                </PrintButton>
              </div>
            </div>

            {generateState === "success" && (
              <div className="flex items-center gap-2 border border-emerald-600/40 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
                <Check className="size-4" /> 版式已按新参数重排，层级无冲突。
              </div>
            )}
            {generateState === "error" && (
              <div className="flex items-center gap-2 border border-red-600/40 bg-red-50 px-4 py-2.5 text-sm text-red-900">
                <CircleX className="size-4" /> 排版冲突：标题与副标字数超出栅格容限。
              </div>
            )}

            <div className={`relative border-2 ${palette.rule} bg-white`}>
              <div className={`absolute inset-0 ${palette.bg} opacity-95`} />
              <div className="absolute inset-0 flex justify-between opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-full w-px bg-current" />
                ))}
              </div>

              <div className="relative flex min-h-[460px] flex-col justify-between p-6 md:p-10">
                <div className="flex items-start justify-between">
                  <div className={`flex gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] ${palette.chip}`}>
                    {[channel, tone, audience].map((t) => (
                      <span key={t} className="border px-2 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">N°{concept.display}</span>
                </div>

                <div className="grid grid-cols-12 gap-4 py-10">
                  <div className="col-span-12 md:col-span-7">
                    <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] opacity-60">
                      {concept.kicker}
                    </div>
                    <h2 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
                      {concept.headline}
                    </h2>
                  </div>
                  <div className="col-span-12 flex flex-col justify-end md:col-span-5">
                    <div className="border-t-2 border-current pt-4 text-sm leading-relaxed opacity-80">
                      {concept.deck}
                    </div>
                    <div className="mt-4 font-mono text-[11px] uppercase tracking-widest opacity-60">
                      {concept.footline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-current/20 pt-4">
                  <button
                    className="inline-flex items-center gap-2 text-sm font-bold underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-current/30"
                  >
                    立即预定 <ArrowRight className="size-4" />
                  </button>
                  <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest opacity-50 md:flex">
                    <Grid3X3 className="size-3" /> 12-COL GRID · OCT 2026 · ISSUE 01
                  </div>
                </div>
              </div>
            </div>

            <section className="border border-slate-300/60 bg-white p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Type className="size-4" /> 最近操作
              </div>
              <ol className="grid gap-2 md:grid-cols-2">
                {activity.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-2 border border-slate-100 bg-[#faf9f7] px-3 py-2 text-xs">
                    <span className="font-mono text-[10px] text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-slate-700">{a.label}</span>
                    <span className="font-mono text-[10px] text-slate-400">{a.time}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function NumberedSelect({
  num,
  label,
  options,
  value,
  onChange,
}: {
  num: string
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-500">
        <span className="flex size-4 items-center justify-center border border-slate-400 font-mono text-[9px]">{num}</span>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`border px-2.5 py-1 text-xs transition-all focus-visible:ring-2 focus-visible:ring-slate-900/30 ${
              value === opt
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function PrintMetric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-slate-300 pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{label}</span>
      <span className="text-lg font-bold">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span>
      </span>
    </div>
  )
}

function PrintButton({
  children,
  onClick,
  disabled,
  solid = false,
  success = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  solid?: boolean
  success?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 border px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-slate-900/30 disabled:opacity-60 ${
        success
          ? "border-emerald-700 bg-emerald-50 text-emerald-800"
          : solid
            ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-700"
            : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  )
}
