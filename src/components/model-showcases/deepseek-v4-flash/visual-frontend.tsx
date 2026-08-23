"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Check,
  CircleX,
  Download,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  Palette,
  Play,
  Save,
  Sparkles,
  Users,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  kicker: string
  headline: string
  body: string
  gradient: string
  accent: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "旷野",
    kicker: "NOCTURNE FIELD RECORDINGS",
    headline: "在旷野里录音，在卧室里播放",
    body: "Lumen 便携录音机，48kHz 无损采样，为独立音乐人把整个世界的声场装进口袋。",
    gradient: "from-indigo-600 via-violet-600 to-fuchsia-500",
    accent: "#f0abfc",
    reach: 1204,
    ctr: 5.4,
    conversion: 3.2,
  },
  {
    id: "B",
    name: "夜行",
    kicker: "AFTER DARK MODE",
    headline: "夜，是第二片创作现场",
    body: "低光模式 + 静音触控，Lumen 在凌晨三点的工作台里，不发出一丝打扰。",
    gradient: "from-slate-900 via-blue-950 to-slate-800",
    accent: "#93c5fd",
    reach: 986,
    ctr: 4.7,
    conversion: 2.9,
  },
  {
    id: "C",
    name: "回声",
    kicker: "ECHO OF THE DAY",
    headline: "一天的声音，值得被记住",
    body: "自动场景标记，把散步、雨声与咖啡馆里的灵感，按时间轴排成你的声音日记。",
    gradient: "from-amber-500 via-rose-500 to-pink-600",
    accent: "#fef3c7",
    reach: 1103,
    ctr: 5.1,
    conversion: 3.6,
  },
]

const audiences = ["独立音乐人", "播客创作者", "音效设计师", "内容团队"]
const channels = ["短视频", "产品官网", "线下快闪", "创作者社群"]
const tones = ["诗意感性", "生猛直接", "冷静专业", "少年气"]
const styles = ["霓虹渐变", "午夜暗色", "胶片暖调", "黑白影调"]

export default function VisualFrontendShowcase() {
  const [brief, setBrief] = useState(
    "为 Lumen 便携录音机策划新品发布：面向独立音乐人与播客创作者，强调无损音质与创作自由。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "画布加载完成，三张主视觉就绪" },
    { id: "s2", time: now(), label: "视觉风格引擎已启动" },
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
    log(`切换主视觉 ${conceptId} · ${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`控制项更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "生猛直接" ? 1.06 : tone === "少年气" ? 1.03 : 1
    const styleMul = style === "胶片暖调" ? 1.04 : style === "黑白影调" ? 0.96 : 1
    const channelMul = channel === "短视频" ? 1.08 : channel === "创作者社群" ? 1.03 : 1
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
      log(`${label}：开始`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：失败`)
        } else {
          setter("success")
          log(`${label}：完成`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const overlay = useMemo(() => {
    switch (style) {
      case "午夜暗色":
        return "bg-black/50"
      case "胶片暖调":
        return "bg-amber-900/30"
      case "黑白影调":
        return "bg-black/35 grayscale"
      default:
        return "bg-black/20"
    }
  }, [style])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-fuchsia-500/90 px-3 py-1 text-xs font-bold text-white">
            DeepSeek V4 flash 0731
          </span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70">
            frontend-skill
          </span>
        </div>
        <div className="flex gap-2">
          <GlassButton onClick={() => runAsync(setGenerateState, "重新生成主视觉")} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
          </GlassButton>
          <GlassButton
            onClick={() => runAsync(setSaveState, "保存方案", 0.08)}
            disabled={busy}
            success={saveState === "success"}
          >
            {saveState === "success" ? <Check className="size-4" /> : <Save className="size-4" />} 保存
          </GlassButton>
          <GlassButton
            onClick={() => runAsync(setExportState, "导出海报包", 0.05)}
            disabled={busy}
            success={exportState === "success"}
          >
            {exportState === "success" ? <Check className="size-4" /> : <Download className="size-4" />} 导出
          </GlassButton>
        </div>
      </header>

      {generateState === "success" && (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <Check className="size-4" /> 主视觉已重新渲染，三张概念海报均可切换。
          </div>
        </div>
      )}
      {generateState === "error" && (
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300">
            <CircleX className="size-4" /> 生成失败：素材库缺少主题图像，请补充 Brief。
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section
            className={`relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${concept.gradient} shadow-2xl transition-all duration-700`}
          >
            <div className={`absolute inset-0 ${overlay} transition-all duration-700`} />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -left-24 -top-24 size-96 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute -bottom-32 -right-16 size-96 rounded-full bg-black/30 blur-3xl" />
            </div>

            <div className="absolute left-5 top-5 z-10 flex flex-wrap items-center gap-2 md:left-8 md:top-8">
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                {channel}
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                {tone}
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                {audience}
              </span>
            </div>

            <div className="absolute right-5 top-5 z-10 flex gap-2 md:right-8 md:top-8">
              <button
                type="button"
                onClick={() => setConceptId("B")}
                className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-white/60"
                aria-label="播放宣传片"
              >
                <Play className="size-5" />
              </button>
            </div>

            <div className="relative z-10 p-6 md:p-12">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-white/70">
                {concept.kicker}
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-7xl">
                {concept.headline}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">{concept.body}</p>
              <button
                className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-slate-900 transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-white/60 active:scale-95"
                style={{ backgroundColor: concept.accent }}
              >
                预约首发 <ArrowUpRight className="size-4" />
              </button>
            </div>

            <div className="relative z-10 border-t border-white/15 px-6 py-3 backdrop-blur-sm md:px-12">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/75">
                {["48kHz / 24bit", "内置立体声麦克风", "6 小时续航", "IP54 防尘防溅"].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <span className="size-1 rounded-full bg-white/70" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                <Palette className="size-4 text-fuchsia-300" /> 视觉控制
              </div>
              <div className="space-y-4">
                <ChipRow label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                <ChipRow label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                <ChipRow label="语气" options={tones} value={tone} onChange={setTone} />
                <ChipRow label="影调" options={styles} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Megaphone className="size-4 text-fuchsia-300" /> Campaign Brief
              </div>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 25 === 0) log("Brief 更新")
                }}
                className="min-h-32 w-full resize-y rounded-xl border border-white/15 bg-slate-900/60 p-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/30 focus:border-fuchsia-400 focus:ring-3 focus:ring-fuchsia-400/20"
                placeholder="写下这场发布想说的话…"
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                <Users className="size-4 text-fuchsia-300" /> 概念切换
              </div>
              <div className="flex gap-2">
                {concepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConceptId(c.id)}
                    className={`flex-1 rounded-xl border p-3 text-center transition-all duration-300 focus-visible:ring-3 focus-visible:ring-white/50 ${
                      conceptId === c.id
                        ? "border-fuchsia-400 bg-fuchsia-400/20 scale-[1.03]"
                        : "border-white/15 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-xs font-bold text-white/90">{c.name}</span>
                    <span className="mt-1 block text-[10px] text-white/50">视觉 {c.id}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-3 gap-3">
              <Stat label="Reach" value={metrics.reach.toLocaleString()} hint="K" />
              <Stat label="CTR" value={metrics.ctr.toFixed(1)} hint="%" />
              <Stat label="Conv" value={metrics.conversion.toFixed(1)} hint="%" />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                <ImageIcon className="size-4 text-fuchsia-300" /> 最近操作
              </div>
              <ul className="max-h-56 space-y-2 overflow-y-auto">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                    <span className="flex-1 leading-relaxed">{a.label}</span>
                    <span className="shrink-0 text-white/35">{a.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

function GlassButton({
  children,
  onClick,
  disabled,
  success = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  success?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all focus-visible:ring-3 focus-visible:ring-white/50 disabled:opacity-60 ${
        success
          ? "border-emerald-400/50 bg-emerald-400/20 text-emerald-200"
          : "border-white/20 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  )
}

function ChipRow({
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
      <div className="mb-1.5 text-xs font-semibold text-white/50">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-fuchsia-400/50 ${
              value === opt
                ? "border-fuchsia-400 bg-fuchsia-400 text-slate-950"
                : "border-white/15 bg-white/5 text-white/80 hover:border-white/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition-colors hover:border-white/25">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">{label}</div>
      <div className="mt-1 text-xl font-black text-white">
        {value}
        <span className="ml-0.5 text-xs font-medium text-white/40">{hint}</span>
      </div>
    </div>
  )
}
