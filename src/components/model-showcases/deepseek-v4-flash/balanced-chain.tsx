"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Download,
  FileText,
  LayoutGrid,
  Loader2,
  PanelRight,
  Save,
  Sparkles,
  Target,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  headline: string
  subline: string
  pack: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "轻装出发",
    headline: "一包收纳整个周末",
    subline: "Voyager 旅行背包 35L 展开式收纳，一周衣物、相机与三脚架各归其位。",
    pack: "35L · 展开式收纳",
    reach: 723,
    ctr: 4.4,
    conversion: 3.2,
  },
  {
    id: "B",
    name: "城市穿梭",
    headline: "从工位到机舱，同一个背影",
    subline: "180° 全开设计与独立电脑舱，Voyager 在城市与机场之间无缝切换。",
    pack: "独立电脑舱 · 180° 开合",
    reach: 756,
    ctr: 4.2,
    conversion: 3.0,
  },
  {
    id: "C",
    name: "七日漫游",
    headline: "一次打包，七天不重复",
    subline: "模块化内胆与 8 个收纳隔层，Voyager 让漫游式旅行说走就走。",
    pack: "8 隔层 · 模块内胆",
    reach: 689,
    ctr: 4.6,
    conversion: 3.4,
  },
]

const audiences = ["商务差旅族", "周末徒步者", "环球旅行者", "城市通勤族"]
const channels = ["电商旗舰店", "户外展会", "旅行社区", "机场快闪"]
const tones = ["实用干练", "自由洒脱", "稳妥可靠", "活力年轻"]
const styles = ["远山青", "砂岩棕", "午夜黑", "雾灰蓝"]

export default function BalancedChainShowcase() {
  const [brief, setBrief] = useState(
    "Voyager 旅行背包上市：以「一次打包」为心智，覆盖差旅与旅行人群，主打电商与展会双渠道。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "工作台装载完成，三视图就绪" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [section, setSection] = useState("overview")
  const [panelOpen, setPanelOpen] = useState(true)

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`方案切换：${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`参数更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "自由洒脱" ? 1.04 : tone === "活力年轻" ? 1.03 : 1
    const styleMul = style === "砂岩棕" ? 1.02 : style === "午夜黑" ? 0.97 : 1
    const channelMul = channel === "电商旗舰店" ? 1.06 : channel === "机场快闪" ? 1.02 : 1
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

  const palette = useMemo(() => {
    switch (style) {
      case "砂岩棕":
        return { bg: "bg-amber-50", main: "#92400e", bar: "bg-amber-800" }
      case "午夜黑":
        return { bg: "bg-slate-100", main: "#1e293b", bar: "bg-slate-900" }
      case "雾灰蓝":
        return { bg: "bg-sky-50", main: "#0369a1", bar: "bg-sky-800" }
      default:
        return { bg: "bg-emerald-50", main: "#047857", bar: "bg-emerald-800" }
    }
  }, [style])

  const nav = [
    { id: "overview", label: "总览", icon: LayoutGrid },
    { id: "concepts", label: "概念", icon: Target },
    { id: "brief", label: "简报", icon: FileText },
    { id: "metrics", label: "指标", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row">
        <aside className="hidden w-14 flex-col items-center gap-1 border-r border-slate-200 bg-white py-4 lg:flex">
          <span className="mb-3 rounded-lg bg-indigo-600 px-1.5 py-1 text-[9px] font-black leading-tight text-white">
            DEEP<br />SEEK
          </span>
          {nav.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setSection(n.id)
                log(`导航至 ${n.label}`)
              }}
              title={n.label}
              className={`flex size-10 items-center justify-center rounded-lg transition-all focus-visible:ring-3 focus-visible:ring-indigo-500/30 ${
                section === n.id ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <n.icon className="size-4.5" />
            </button>
          ))}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
                DeepSeek V4 flash 0731
              </span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-500">
                frontend-app-builder + taste-skill + impeccable
              </span>
              <span className="hidden text-sm font-semibold md:inline">Voyager · 发布工作台</span>
            </div>
            <div className="flex gap-2">
              <WorkButton
                solid
                disabled={busy}
                onClick={() => runAsync(setGenerateState, "生成方案", 0.08)}
                icon={busy ? Loader2 : Sparkles}
                spin={busy}
              >
                生成
              </WorkButton>
              <WorkButton
                disabled={busy}
                success={saveState === "success"}
                onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                icon={saveState === "success" ? CheckCircle2 : Save}
              >
                保存
              </WorkButton>
              <WorkButton
                disabled={busy}
                success={exportState === "success"}
                onClick={() => runAsync(setExportState, "导出素材", 0.05)}
                icon={exportState === "success" ? CheckCircle2 : Download}
              >
                导出
              </WorkButton>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {generateState === "success" && (
              <div className="arena-enter flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
                <CheckCircle2 className="size-4" /> 方案已生成：概念、预览与指标三者已同步。
              </div>
            )}
            {generateState === "error" && (
              <div className="arena-enter flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-900">
                <CircleX className="size-4" /> 生成失败：请补充产品容量与价格信息。
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-indigo-500/30 ${
                      conceptId === c.id
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <span className="flex size-5 items-center justify-center rounded-full border border-current text-[11px]">
                      {c.id}
                    </span>
                    {c.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-indigo-500/30"
              >
                <PanelRight className="size-3.5" />
                {panelOpen ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
                {panelOpen ? "收起侧栏" : "展开侧栏"}
              </button>
            </div>

            <div className={`flex flex-col gap-4 transition-all ${panelOpen ? "lg:flex-row" : ""}`}>
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className={`relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-sm transition-colors duration-500 md:p-9 ${palette.bg}`}>
                  <div className="flex items-start justify-between">
                    <span className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur">
                      {channel} · {tone}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      CONCEPT {conceptId}
                    </span>
                  </div>
                  <div className="max-w-xl py-8">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                      面向 {audience}
                    </div>
                    <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
                    <p className="mb-6 max-w-lg text-sm leading-relaxed text-slate-600">{concept.subline}</p>
                    <button
                      className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/50 active:scale-95 ${palette.bar}`}
                    >
                      {concept.pack} →
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {["防泼水面料", "背负透气", "两年质保"].map((t) => (
                      <span key={t} className="rounded-full border border-slate-300 bg-white/70 px-3 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {section === "concepts" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="mb-3 text-sm font-bold">概念对比</div>
                    <div className="grid gap-2 md:grid-cols-3">
                      {concepts.map((c) => (
                        <div
                          key={c.id}
                          className={`rounded-xl border p-4 text-sm ${conceptId === c.id ? "border-indigo-400 bg-indigo-50/50" : "border-slate-100"}`}
                        >
                          <div className="mb-1 font-bold">
                            {c.id} · {c.name}
                          </div>
                          <div className="text-xs leading-relaxed text-slate-500">{c.subline}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {section === "brief" && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <label htmlFor="brief-bal" className="mb-2 block text-sm font-bold">
                      Campaign Brief
                    </label>
                    <textarea
                      id="brief-bal"
                      value={brief}
                      onChange={(e) => {
                        setBrief(e.target.value)
                        if (e.target.value.length % 25 === 0) log("Brief 更新")
                      }}
                      className="min-h-40 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15"
                      placeholder="产品 / 人群 / 卖点 / 渠道…"
                    />
                  </section>
                )}
              </div>

              {panelOpen && (
                <aside className="flex w-full flex-col gap-4 lg:w-72">
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="mb-3 text-sm font-bold">活动参数</div>
                    <div className="space-y-4">
                      <ControlField label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                      <ControlField label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                      <ControlField label="语气" options={tones} value={tone} onChange={setTone} />
                      <ControlField label="视觉风格" options={styles} value={style} onChange={setStyle} />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="mb-3 text-sm font-bold">预测指标</div>
                    <div className="space-y-2">
                      <BalMetric label="Reach" value={metrics.reach.toLocaleString()} suffix="K" />
                      <BalMetric label="CTR" value={metrics.ctr.toFixed(1)} suffix="%" />
                      <BalMetric label="Conversion" value={metrics.conversion.toFixed(1)} suffix="%" />
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full transition-all duration-700 ${palette.bar}`} style={{ width: `${Math.min(metrics.ctr * 18, 100)}%` }} />
                    </div>
                  </section>

                  <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div className="mb-3 text-sm font-bold">最近操作</div>
                    <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                      {activity.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                          <span className="size-1.5 shrink-0 rounded-full bg-indigo-500" />
                          <span className="flex-1 text-slate-600">{a.label}</span>
                          <span className="shrink-0 font-mono text-[10px] text-slate-400">{a.time}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </aside>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ControlField({
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
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-indigo-500/25 ${
              value === opt
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-indigo-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function BalMetric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-lg font-bold text-slate-900">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-400">{suffix}</span>
      </span>
    </div>
  )
}

function WorkButton({
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-indigo-500/30 disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
            : "border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
