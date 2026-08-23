"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  Check,
  CheckCircle2,
  CircleX,
  Download,
  LayoutDashboard,
  Loader2,
  Save,
  Sparkles,
  Users,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  thesis: string
  headline: string
  body: string
  kv: string
  cta: string
  audience: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "城市农夫",
    thesis: "把超市的生菜搬进厨房",
    headline: "三周，从种子到沙拉",
    body: "Grove 智能种菜机内置 12 种蔬菜方案，光照、水分、营养液全自动管理，阳台也能种出沙拉。",
    kv: "12 种种植方案",
    cta: "开始第一茬种植",
    audience: "厨房爱好者",
    reach: 604,
    ctr: 4.4,
    conversion: 3.3,
  },
  {
    id: "B",
    name: "食育家庭",
    thesis: "让孩子看见食物从哪来",
    headline: "孩子第一次收获，比游戏升级更兴奋",
    body: "Grove 的观察日记模式记录每一株的生长，把自然课搬进 0.3㎡ 的家里。",
    kv: "观察日记模式",
    cta: "为孩子种一棵",
    audience: "亲子家庭",
    reach: 633,
    ctr: 4.6,
    conversion: 3.5,
  },
  {
    id: "C",
    name: "绿植手残党",
    thesis: "养不活植物的另一种解法",
    headline: "你不擅长浇水，但 Grove 擅长",
    body: "缺水预警与远程补水，Grove 把「忘记浇水」从罪名变成常事。",
    kv: "自动补水系统",
    cta: "试试自动模式",
    audience: "植物新手",
    reach: 571,
    ctr: 4.2,
    conversion: 3.0,
  },
]

const audiences = ["厨房爱好者", "亲子家庭", "植物新手", "独居青年"]
const channels = ["电商大促", "亲子社区", "生活方式媒体", "线下体验店"]
const tones = ["亲切实用", "教育叙事", "轻快有趣", "科学严谨"]
const styles = ["芽绿", "奶白", "陶土", "雾蓝"]

export default function DesignUxProShowcase() {
  const [stage, setStage] = useState(0)
  const [brief, setBrief] = useState(
    "Grove 智能种菜机上市：以「把种植带回家」为核心，分人群制定策略，先打电商与亲子社区。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "策略库载入：3 组人群画像" },
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
    log(`策略文档切换：${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`画像更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "教育叙事" ? 1.04 : tone === "轻快有趣" ? 1.02 : 1
    const styleMul = style === "陶土" ? 1.03 : style === "雾蓝" ? 0.98 : 1
    const channelMul = channel === "电商大促" ? 1.06 : channel === "亲子社区" ? 1.04 : 1
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
      log(`${label}：策略推演中`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：策略冲突`)
        } else {
          setter("success")
          log(`${label}：策略定稿`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const palette = useMemo(() => {
    switch (style) {
      case "陶土":
        return { bg: "bg-orange-50", main: "#c2410c", btn: "bg-orange-700 hover:bg-orange-800" }
      case "雾蓝":
        return { bg: "bg-sky-50", main: "#0369a1", btn: "bg-sky-700 hover:bg-sky-800" }
      case "奶白":
        return { bg: "bg-amber-50", main: "#92400e", btn: "bg-amber-800 hover:bg-amber-900" }
      default:
        return { bg: "bg-emerald-50", main: "#047857", btn: "bg-emerald-700 hover:bg-emerald-800" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] text-slate-500">
              frontend-design + ui-ux-pro-max
            </span>
          </div>
          <nav aria-label="策略流程" className="flex items-center gap-1.5">
            {["策略", "创意", "度量", "交付"].map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStage(i)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/30 ${
                  stage === i ? "bg-emerald-700 text-white" : "bg-white text-slate-400 hover:text-slate-700"
                }`}
              >
                {i < stage && <Check className="size-3" />}
                <span className="hidden sm:inline">{s}</span>
              </button>
            ))}
          </nav>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <BookOpen className="size-4 text-emerald-600" /> 策略文档
                </div>
                <div className="flex gap-2">
                  <DocButton
                    solid
                    disabled={busy}
                    onClick={() => runAsync(setGenerateState, "生成策略", 0.08)}
                    icon={busy ? Loader2 : Sparkles}
                    spin={busy}
                  >
                    生成
                  </DocButton>
                  <DocButton
                    disabled={busy}
                    success={saveState === "success"}
                    onClick={() => runAsync(setSaveState, "保存文档", 0.1)}
                    icon={saveState === "success" ? CheckCircle2 : Save}
                  >
                    保存
                  </DocButton>
                  <DocButton
                    disabled={busy}
                    success={exportState === "success"}
                    onClick={() => runAsync(setExportState, "导出策略包", 0.05)}
                    icon={exportState === "success" ? CheckCircle2 : Download}
                  >
                    导出
                  </DocButton>
                </div>
              </div>

              {generateState === "success" && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  <CheckCircle2 className="size-4" /> 策略文档已按当前画像重写并通过结构校验。
                </div>
              )}
              {generateState === "error" && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                  <CircleX className="size-4" /> 策略冲突：所选人群与渠道的匹配度不足，请调整。
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-3">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    aria-pressed={conceptId === c.id}
                    className={`group rounded-xl border-2 p-4 text-left transition-all focus-visible:ring-3 focus-visible:ring-emerald-500/30 ${
                      conceptId === c.id
                        ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`font-mono text-[10px] font-bold ${conceptId === c.id ? "text-emerald-700" : "text-slate-300"}`}>
                        {c.id} · 概念
                      </span>
                      {conceptId === c.id && <Check className="size-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-sm font-bold">{c.name}</div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">{c.thesis}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className={`rounded-xl border border-slate-200 p-6 shadow-xs md:p-8 ${palette.bg}`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {[channel, tone, concept.audience].map((t) => (
                    <span key={t} className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  DOC · {concept.id} / 03
                </span>
              </div>

              <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    核心论点
                  </div>
                  <h2 className="text-3xl font-bold leading-tight md:text-4xl">{concept.headline}</h2>
                  <div className="mb-6 mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: palette.main }} />
                  <p className="max-w-xl text-sm leading-relaxed text-slate-600">{concept.body}</p>
                  <button
                    className={`mt-6 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/50 active:scale-95 ${palette.btn}`}
                  >
                    {concept.cta} →
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      关键信息
                    </div>
                    <div className="text-lg font-bold text-slate-800">{concept.kv}</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      目标人群
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <Users className="size-3.5 text-slate-400" /> {concept.audience}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <LayoutDashboard className="size-4 text-emerald-600" /> 画像与参数
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <UxField label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                <UxField label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                <UxField label="叙述语气" options={tones} value={tone} onChange={setTone} />
                <UxField label="视觉风格" options={styles} value={style} onChange={setStyle} />
              </div>
              <label htmlFor="brief-du" className="mt-4 mb-1.5 block text-xs font-semibold text-slate-500">
                Campaign Brief
              </label>
              <textarea
                id="brief-du"
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 24 === 0) log("Brief 更新")
                }}
                className="min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
                placeholder="产品 / 分人群策略 / 渠道节奏…"
              />
            </section>
          </div>

          <aside className="flex flex-col gap-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 text-sm font-bold">度量看板</div>
              <div className="space-y-2.5">
                <DocMetric label="Reach" value={metrics.reach.toLocaleString()} unit="K" note="曝光人群估算" />
                <DocMetric label="CTR" value={metrics.ctr.toFixed(1)} unit="%" note="点击率预估" />
                <DocMetric label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" note="下单转化预估" />
              </div>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
                指标随「概念 × 人群 × 渠道」组合实时重算，作为策略取舍依据。
              </div>
            </section>

            <section className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="mb-3 text-sm font-bold">评审记录</div>
              <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="flex-1 leading-relaxed text-slate-600">{a.label}</span>
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

function UxField({
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
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-emerald-500/25 ${
              value === opt
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function DocMetric({ label, value, unit, note }: { label: string; value: string; unit: string; note: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-xl font-bold text-slate-900">
          {value}
          <span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span>
        </span>
      </div>
      <div className="mt-0.5 text-[10px] text-slate-400">{note}</div>
    </div>
  )
}

function DocButton({
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-emerald-500/25 disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
            : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-400"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
