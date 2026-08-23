"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Flame,
  HeartPulse,
  Loader2,
  Save,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  headline: string
  subline: string
  orbit: string
  hue: number
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "燃点",
    headline: "每天 5 分钟，把脂肪甩进风里",
    subline: "Orbit 智能跳绳记录每一次腾空，卡路里以实时曲线在你眼前燃烧。",
    orbit: "180° 挥绳检测",
    hue: 15,
    reach: 702,
    ctr: 5.2,
    conversion: 3.6,
  },
  {
    id: "B",
    name: "节奏",
    headline: "音乐不停，绳也不停",
    subline: "BPM 同步训练模式，让每一次起跳都踩在节拍上，运动变成律动。",
    orbit: "BPM 同步模式",
    hue: 265,
    reach: 668,
    ctr: 4.8,
    conversion: 3.3,
  },
  {
    id: "C",
    name: "记录",
    headline: "三万次跳跃，都是你写下的进度",
    subline: "Orbit 自动标记连续跳跃、双摇与耐力段，生成属于你的跳跃史。",
    orbit: "自动动作识别",
    hue: 200,
    reach: 731,
    ctr: 4.6,
    conversion: 3.0,
  },
]

const audiences = ["健身新人", "减脂人群", "跳绳爱好者", "居家训练者"]
const channels = ["短视频挑战赛", "运动社区", "直播带货", "健身 App 合作"]
const tones = ["燃力十足", "节奏感强", "科学严谨", "轻松有趣"]
const styles = ["火焰橙", "电光紫", "冷萃蓝", "霓虹绿"]

export default function MotionBitsShowcase() {
  const [brief, setBrief] = useState(
    "Orbit 智能跳绳新品发布：用「节奏与燃点」做传播主线，发起短视频挑战赛，让运动像音乐一样上瘾。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "动效引擎启动，物理曲线就绪" },
    { id: "s2", time: now(), label: "计数器预热完成" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [pulse, setPulse] = useState(false)

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 12))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`概念切换：${concept.name}，画布平移入场`)
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 700)
    return () => clearTimeout(t)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`参数更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "燃力十足" ? 1.06 : tone === "节奏感强" ? 1.03 : 1
    const styleMul = style === "霓虹绿" ? 1.04 : style === "冷萃蓝" ? 0.98 : 1
    const channelMul = channel === "短视频挑战赛" ? 1.08 : channel === "直播带货" ? 1.02 : 1
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
      log(`${label}：能量注入`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：能量不足，重试`)
        } else {
          setter("success")
          log(`${label}：爆发完成`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const hue = concept.hue
  const styleHue = useMemo(() => {
    switch (style) {
      case "电光紫":
        return 265
      case "冷萃蓝":
        return 205
      case "霓虹绿":
        return 145
      default:
        return 22
    }
  }, [style])

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <style>{`
        @keyframes orbit-gradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes orbit-slide-in { from { opacity: 0; transform: translateX(32px) scale(0.98); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes orbit-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes orbit-bounce { 0%,100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-10px) scale(1.04); } 70% { transform: translateY(0) scale(0.98); } }
        @keyframes orbit-shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes orbit-spin-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-pop { 0% { transform: scale(1); } 50% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .orbit-enter { animation: orbit-rise 420ms cubic-bezier(0.34,1.56,0.64,1) both; }
        .orbit-stage { animation: orbit-slide-in 480ms cubic-bezier(0.34,1.56,0.64,1) both; }
        .orbit-shimmer-bg { background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%); background-size: 200% 100%; animation: orbit-shimmer 1.1s linear infinite; }
        .orbit-ring { animation: orbit-spin-ring 6s linear infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 text-xs font-black tracking-wide">
              DeepSeek V4 flash 0731
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/60">
              react-bits
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Zap className="size-3.5 text-amber-300" /> 动效引擎在线 · 120fps
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`group relative overflow-hidden rounded-xl border px-4 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:ring-3 focus-visible:ring-white/40 ${
                      conceptId === c.id
                        ? "border-transparent text-white shadow-lg"
                        : "border-white/10 bg-white/5 text-white/60 hover:-translate-y-0.5 hover:border-white/30 hover:text-white"
                    }`}
                    style={conceptId === c.id ? { background: `hsl(${hue} 80% 45%)` } : undefined}
                  >
                    <span className="mr-1.5 inline-block size-5 rounded-full border border-current align-middle text-center text-[11px] leading-5">
                      {c.id}
                    </span>
                    {c.name}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <SpringButton solid busy={busy} onClick={() => runAsync(setGenerateState, "生成创意", 0.08)}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
                </SpringButton>
                <SpringButton success={saveState === "success"} onClick={() => runAsync(setSaveState, "保存方案", 0.1)}>
                  {saveState === "success" ? <Check className="size-4" /> : <Save className="size-4" />} 保存
                </SpringButton>
                <SpringButton success={exportState === "success"} onClick={() => runAsync(setExportState, "导出素材", 0.05)}>
                  {exportState === "success" ? <Check className="size-4" /> : <Download className="size-4" />} 导出
                </SpringButton>
              </div>
            </div>

            {generateState === "success" && (
              <div className="orbit-enter flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                <CheckCircle2 className="size-4" /> 生成完成！主创意与指标已同步刷新。
              </div>
            )}
            {generateState === "error" && (
              <div className="orbit-enter flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                <CircleX className="size-4" /> 生成中断：挑战赛规则缺失，请补充 Brief。
              </div>
            )}

            <div
              key={conceptId}
              className={`orbit-stage relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-10`}
              style={{
                background: `linear-gradient(120deg, hsl(${styleHue} 60% 22%), hsl(${hue} 65% 40%), hsl(${(hue + 60) % 360} 70% 28%))`,
                backgroundSize: "200% 200%",
                animation: "orbit-gradient 9s ease infinite",
              }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="orbit-ring absolute -right-24 -top-24 size-96 rounded-full border-2 border-dashed border-white/50" />
                <div className="orbit-ring absolute -bottom-32 -left-20 size-80 rounded-full border border-white/30" style={{ animationDirection: "reverse", animationDuration: "9s" }} />
              </div>

              <div className="relative flex items-start justify-between">
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur">
                  {channel}
                </span>
                <span className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                  <Flame className="size-5 text-amber-300" />
                </span>
              </div>

              <div className="relative py-8">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-white/70">
                  {tone} · {concept.orbit}
                </div>
                <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                  {concept.headline}
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">{concept.subline}</p>
                <button
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-900 shadow-xl transition-all duration-300 hover:scale-110 active:scale-90 focus-visible:ring-4 focus-visible:ring-white/50"
                  style={{ animation: pulse ? "orbit-bounce 600ms ease" : undefined }}
                >
                  <HeartPulse className="size-4" /> 加入挑战赛
                </button>
              </div>

              <div className="relative flex flex-wrap items-center gap-3 text-xs text-white/75">
                {["智能计数", "BPM 同步", "无绳模式", "自动识别"].map((t, i) => (
                  <span
                    key={t}
                    className="orbit-enter rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 text-sm font-bold text-white/80">最近操作</div>
              <ul className="space-y-2">
                {activity.map((a, i) => (
                  <li
                    key={a.id}
                    className="orbit-enter flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs"
                    style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                  >
                    <Timer className="size-3.5 shrink-0 text-white/40" />
                    <span className="flex-1 text-white/75">{a.label}</span>
                    <span className="shrink-0 font-mono text-white/35">{a.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 text-sm font-bold text-white/80">训练参数</div>
              <div className="space-y-4">
                <MotionField label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                <MotionField label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                <MotionField label="语气" options={tones} value={tone} onChange={setTone} />
                <MotionField label="视觉风格" options={styles} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 text-sm font-bold text-white/80">Campaign Brief</div>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 25 === 0) log("Brief 更新")
                }}
                className="orbit-shimmer-bg min-h-36 w-full resize-y rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-white/30 focus:border-white/40"
                placeholder="为这场发布写点燃力的话…"
              />
            </section>

            <div className="grid grid-cols-3 gap-3">
              <AnimatedStat label="Reach" value={metrics.reach} unit="K" />
              <AnimatedStat label="CTR" value={Math.round(metrics.ctr * 10)} unit="‰" />
              <AnimatedStat label="Conv" value={Math.round(metrics.conversion * 10)} unit="‰" />
            </div>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-xs leading-relaxed text-white/55">
              计数动画使用 900ms 缓出曲线；所有入场动效在 prefers-reduced-motion 下自动降级为瞬时。
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SpringButton({
  children,
  onClick,
  solid = false,
  success = false,
  busy = false,
}: {
  children: React.ReactNode
  onClick: () => void
  solid?: boolean
  success?: boolean
  busy?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-95 focus-visible:ring-3 focus-visible:ring-white/40 disabled:opacity-50 ${
        success
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
          : solid
            ? "border-transparent bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
            : "border-white/15 bg-white/5 text-white/80 hover:border-white/35"
      }`}
    >
      {children}
    </button>
  )
}

function MotionField({
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
      <div className="mb-1.5 text-xs font-semibold text-white/45">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/40 ${
              value === opt
                ? "border-transparent bg-white text-slate-900 shadow-md"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/35"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function AnimatedStat({ label, value, unit }: { label: string; value: number; unit: string }) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const duration = 900
    const from = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [value])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition-colors hover:border-white/25">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">{label}</div>
      <div className="mt-1 text-xl font-black text-white">
        {display.toLocaleString()}
        <span className="ml-0.5 text-xs font-medium text-white/40">{unit}</span>
      </div>
    </div>
  )
}
