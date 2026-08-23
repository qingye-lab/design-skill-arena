"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Info,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  headline: string
  subline: string
  assurance: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

type Toast = { id: string; kind: "success" | "error" | "info"; text: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "安心到家",
    headline: "开门的速度，快过你想起钥匙",
    subline: "Aegis L1 智能门锁 0.3 秒识别指纹，误识率低于百万分之一，从容如常。",
    assurance: "半导体指纹 · 0.3s",
    reach: 805,
    ctr: 4.5,
    conversion: 3.2,
  },
  {
    id: "B",
    name: "全家通行",
    headline: "一把锁，认识家里的每一个人",
    subline: "50 组指纹与 100 组临时密码，访客权限按小时计，家人各有各的回家方式。",
    assurance: "50 指纹 · 100 密码",
    reach: 846,
    ctr: 4.3,
    conversion: 3.0,
  },
  {
    id: "C",
    name: "无感安防",
    headline: "门锁最好的状态，是被忘记",
    subline: "异常开锁即时推送到手机，Aegis 在你看不见的地方，替你看家。",
    assurance: "异常警报 · 视频复核",
    reach: 872,
    ctr: 4.1,
    conversion: 2.8,
  },
]

const audiences = ["新装家庭", "独居女性", "租住青年", "改善型家庭"]
const channels = ["家装渠道", "官方商城", "物业合作", "社群团购"]
const tones = ["专业可信", "安心温暖", "冷静客观", "时尚活力"]
const styles = ["曜石黑", "香槟金", "冰川银", "雾霭灰"]

export default function StandardImpeccableShowcase() {
  const [brief, setBrief] = useState(
    "Aegis L1 智能门锁新品发布：突出「快」与「安心」两大利益点，面向新装与独居人群。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "工作台初始化完成" },
    { id: "s2", time: now(), label: "安全策略载入：本地 mock 数据" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [toasts, setToasts] = useState<Toast[]>([])

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const pushToast = useCallback((kind: Toast["kind"], text: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev.slice(-2), { id, kind, text }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`切换概念 ${conceptId} · ${concept.name}`)
    pushToast("info", `已切换到概念 ${conceptId}`)
  }, [conceptId, concept.name, log, pushToast])

  useEffect(() => {
    log(`控制项更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "时尚活力" ? 1.04 : tone === "安心温暖" ? 1.02 : 1
    const styleMul = style === "香槟金" ? 1.03 : style === "雾霭灰" ? 0.98 : 1
    const channelMul = channel === "官方商城" ? 1.06 : channel === "家装渠道" ? 1.02 : 1
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
          pushToast("error", `${label}失败，请重试`)
        } else {
          setter("success")
          log(`${label}：完成`)
          pushToast("success", `${label}成功`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log, pushToast]
  )

  const theme = useMemo(() => {
    switch (style) {
      case "香槟金":
        return { bg: "from-amber-50 to-yellow-100 text-amber-950", btn: "bg-amber-700 hover:bg-amber-800", ring: "focus-visible:ring-amber-500/40" }
      case "冰川银":
        return { bg: "from-sky-50 to-slate-100 text-sky-950", btn: "bg-sky-700 hover:bg-sky-800", ring: "focus-visible:ring-sky-500/40" }
      case "雾霭灰":
        return { bg: "from-slate-100 to-stone-200 text-stone-900", btn: "bg-stone-800 hover:bg-stone-900", ring: "focus-visible:ring-stone-500/40" }
      default:
        return { bg: "from-slate-900 to-neutral-800 text-slate-100", btn: "bg-slate-100 text-slate-900 hover:bg-white", ring: "focus-visible:ring-slate-400/40" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-900 md:p-5">
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-72 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`arena-enter pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm shadow-lg ${
              t.kind === "success"
                ? "border-emerald-200 bg-white text-emerald-900"
                : t.kind === "error"
                  ? "border-red-200 bg-white text-red-900"
                  : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            ) : t.kind === "error" ? (
              <CircleX className="mt-0.5 size-4 shrink-0 text-red-600" />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0 text-slate-400" />
            )}
            <span className="flex-1">{t.text}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-slate-300 transition-colors hover:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-400/40"
              aria-label="关闭提示"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-3 lg:grid-cols-[300px_minmax(0,1fr)_310px]">
        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                DeepSeek V4 flash 0731
              </span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600">
                frontend-app-builder + impeccable
              </span>
            </div>
            <h1 className="mt-3 text-base font-bold">Standard + Impeccable</h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              标准三栏布局，辅以提示、快捷键与状态胶囊等精修细节。
            </p>
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              全部交互均有 focus 环与状态反馈
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <label htmlFor="brief-si" className="mb-1.5 block text-sm font-semibold">
              Campaign Brief
            </label>
            <textarea
              id="brief-si"
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (e.target.value.length % 21 === 0) log("Brief 更新")
              }}
              className="min-h-36 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-all focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/15"
              placeholder="产品 / 人群 / 卖点 / 渠道…"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Info className="size-3" /> 保存后自动生成版本
              </span>
              <span className="font-mono">{brief.length} chars</span>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 text-sm font-semibold">活动参数</div>
            <div className="space-y-4">
              <Field label="目标人群" options={audiences} value={audience} onChange={setAudience} />
              <Field label="投放渠道" options={channels} value={channel} onChange={setChannel} />
              <Field label="语气" options={tones} value={tone} onChange={setTone} />
              <Field label="视觉风格" options={styles} value={style} onChange={setStyle} />
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
                  title={`概念 ${c.id}：${c.name}`}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-500/30 ${
                    conceptId === c.id
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
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
              <RefinedButton
                solid
                disabled={busy}
                onClick={() => runAsync(setGenerateState, "生成创意", 0.08)}
                icon={busy ? Loader2 : Sparkles}
                spin={busy}
              >
                生成
              </RefinedButton>
              <RefinedButton
                disabled={busy}
                success={saveState === "success"}
                onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                icon={saveState === "success" ? CheckCircle2 : Save}
              >
                保存
              </RefinedButton>
              <RefinedButton
                disabled={busy}
                success={exportState === "success"}
                onClick={() => runAsync(setExportState, "导出素材", 0.05)}
                icon={exportState === "success" ? CheckCircle2 : Download}
              >
                导出
              </RefinedButton>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusPill state={generateState === "success" ? "ok" : generateState === "error" ? "bad" : "idle"} label="生成状态" />
            <StatusPill state={saveState === "success" ? "ok" : saveState === "error" ? "bad" : "idle"} label="保存状态" />
            <StatusPill state={exportState === "success" ? "ok" : exportState === "error" ? "bad" : "idle"} label="导出状态" />
            <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-400">
              <kbd className="rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px]">⌘G</kbd> 生成
            </span>
          </div>

          <div className={`relative flex min-h-[400px] flex-1 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-sm transition-colors duration-500 md:p-9 ${theme.bg}`}>
            <div className="flex items-start justify-between">
              <span className="rounded-full border border-current/15 bg-white/60 px-3 py-1 text-xs font-semibold backdrop-blur">
                {channel} · {tone}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest opacity-50">
                <span className="size-1.5 rounded-full bg-current" /> CONCEPT {conceptId}
              </span>
            </div>
            <div className="max-w-xl py-8">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
                面向 {audience}
              </div>
              <h2 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{concept.headline}</h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed opacity-80 md:text-base">{concept.subline}</p>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-current/20 bg-white/60 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                <ShieldCheck className="size-3.5" /> {concept.assurance}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-4">
              <div className="flex gap-4 text-xs opacity-70">
                {["指纹识别", "临时密码", "异常报警"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="size-3.5" /> {t}
                  </span>
                ))}
              </div>
              <button className={`rounded-lg px-5 py-2.5 text-sm font-medium shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-4 focus-visible:ring-current/20 active:scale-95 ${theme.btn}`}>
                预约安装
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 text-sm font-semibold">预测指标</div>
            <div className="space-y-2.5">
              <Metric label="Reach" value={metrics.reach.toLocaleString()} suffix="K" />
              <Metric label="CTR" value={metrics.ctr.toFixed(1)} suffix="%" />
              <Metric label="Conversion" value={metrics.conversion.toFixed(1)} suffix="%" />
            </div>
            <div className="mt-4 space-y-2">
              <ProgressLine label="触达" value={Math.min(metrics.reach / 10, 100)} color="bg-slate-800" />
              <ProgressLine label="点击" value={Math.min(metrics.ctr * 18, 100)} color="bg-sky-600" />
              <ProgressLine label="转化" value={Math.min(metrics.conversion * 24, 100)} color="bg-emerald-600" />
            </div>
          </section>

          <section className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">最近操作</span>
              <button
                type="button"
                onClick={() => {
                  setActivity([])
                  log("已清空操作记录")
                  pushToast("info", "操作记录已清空")
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 transition-colors hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-400/40"
              >
                <Trash2 className="size-3" /> 清空
              </button>
            </div>
            {activity.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-200 py-8 text-center">
                <CircleX className="size-5 text-slate-300" />
                <p className="text-xs text-slate-400">暂无记录，执行任意操作后会出现在这里</p>
              </div>
            ) : (
              <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs transition-colors hover:bg-slate-100">
                    <span className="size-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span className="flex-1 text-slate-600">{a.label}</span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function Field({
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
            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-500/30 ${
              value === opt
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"
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
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-lg font-bold text-slate-900">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-400">{suffix}</span>
      </span>
    </div>
  )
}

function ProgressLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-slate-400">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function StatusPill({ state, label }: { state: "ok" | "bad" | "idle"; label: string }) {
  const cfg =
    state === "ok"
      ? { dot: "bg-emerald-500", text: "text-emerald-800", ring: "ring-emerald-500/20", label: "完成" }
      : state === "bad"
        ? { dot: "bg-red-500", text: "text-red-800", ring: "ring-red-500/20", label: "失败" }
        : { dot: "bg-slate-300", text: "text-slate-500", ring: "ring-slate-500/10", label: "待命" }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium shadow-xs ring-1 ${cfg.text} ${cfg.ring}`}>
      <span className={`size-1.5 rounded-full ${cfg.dot} ${state === "ok" ? "animate-pulse" : ""}`} />
      {label} · {cfg.label}
    </span>
  )
}

function RefinedButton({
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-500/30 disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-slate-900 text-white shadow-sm hover:bg-slate-700"
            : "border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
