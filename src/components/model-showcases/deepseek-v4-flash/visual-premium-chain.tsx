"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CheckCircle2,
  CircleX,
  Crown,
  Download,
  Loader2,
  Play,
  Save,
  Sparkles,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  line: string
  headline: string
  subline: string
  detail: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "初见",
    line: "FIRST SIGHT",
    headline: "第一眼，就该是收藏级",
    subline: "Onyx 黑胶唱机以整块阳极氧化铝与胡桃木底座成型，安静得像一件雕塑。",
    detail: "整铝机身 · 胡桃木底座",
    reach: 532,
    ctr: 4.7,
    conversion: 3.4,
  },
  {
    id: "B",
    name: "回响",
    line: "RESONANCE",
    headline: "唱针落下的那一刻，房间开始呼吸",
    subline: "磁悬浮转盘与低噪伺服，Onyx 把模拟之声的纹理完整交给听者。",
    detail: "磁悬浮转盘 · 低噪伺服",
    reach: 568,
    ctr: 4.5,
    conversion: 3.2,
  },
  {
    id: "C",
    name: "传承",
    line: "HERITAGE",
    headline: "为下一个十年，保留一张唱片的位置",
    subline: "模块化唱臂与可升级电路，Onyx 让这台唱机与你的收藏一同成长。",
    detail: "模块唱臂 · 可升级电路",
    reach: 501,
    ctr: 4.9,
    conversion: 3.6,
  },
]

const audiences = ["黑胶发烧友", "高端生活方式人群", "设计收藏家", "咖啡馆主理人"]
const channels = ["品牌旗舰店", "奢侈生活方式刊", "私享品鉴会", "官网限量页"]
const tones = ["克制奢华", "艺术叙事", "专业深谈", "稀缺感"]
const styles = ["曜黑鎏金", "深棕古铜", "墨绿描金", "灰岩白金"]

export default function VisualPremiumChainShowcase() {
  const [brief, setBrief] = useState(
    "Onyx 黑胶唱机首发：以「收藏级」为定位，走限量发售路线，先办私享品鉴会再开官网。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "陈列室已布置，灯光就绪" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 12))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`陈列切换：${concept.line} · ${concept.name}`)
  }, [conceptId, concept.line, concept.name, log])

  useEffect(() => {
    log(`策展参数：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "稀缺感" ? 1.05 : tone === "艺术叙事" ? 1.02 : 1
    const styleMul = style === "墨绿描金" ? 1.03 : style === "灰岩白金" ? 0.98 : 1
    const channelMul = channel === "官网限量页" ? 1.06 : channel === "奢侈生活方式刊" ? 1.02 : 1
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
      log(`${label}：筹备中`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：未达成`)
        } else {
          setter("success")
          log(`${label}：达成`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const palette = useMemo(() => {
    switch (style) {
      case "深棕古铜":
        return { glow: "rgba(214,158,46,0.22)", ring: "border-amber-200/30" }
      case "墨绿描金":
        return { glow: "rgba(163,177,138,0.18)", ring: "border-emerald-200/25" }
      case "灰岩白金":
        return { glow: "rgba(203,213,225,0.16)", ring: "border-slate-200/25" }
      default:
        return { glow: "rgba(217,180,110,0.25)", ring: "border-amber-200/40" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#12100d] text-[#f0ead9]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-sm border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-xs font-bold tracking-widest text-amber-200">
              DeepSeek V4 flash 0731
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f0ead9]/40">
              frontend-skill + taste-skill + impeccable
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f0ead9]/40">
            <Crown className="size-3.5 text-amber-300/70" /> 限量 500 台 · 私人品鉴制
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div key={conceptId} className="arena-enter relative min-h-[480px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1d1912] to-[#0d0b08] p-8 md:p-12">
              <div
                className="absolute inset-0 transition-all duration-1000"
                style={{ background: `radial-gradient(ellipse 60% 45% at 30% 25%, ${palette.glow}, transparent 70%)` }}
              />
              <div className="absolute inset-0 opacity-[0.05]">
                <div className="absolute left-0 top-0 h-full w-px bg-white" />
                <div className="absolute right-0 top-0 h-full w-px bg-white" />
                <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
                <div className="absolute right-1/3 top-0 h-full w-px bg-white" />
                <div className="absolute left-0 top-0 h-full w-full border-y border-white/20" />
              </div>

              <div className="relative flex flex-wrap items-start justify-between">
                <span className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] backdrop-blur ${palette.ring}`}>
                  {concept.line}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] backdrop-blur">
                  {channel} · {tone}
                </span>
              </div>

              <div className="relative mx-auto max-w-2xl py-12 text-center md:py-16">
                <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/5 md:size-32">
                  <div className="relative flex size-16 items-center justify-center md:size-24">
                    <span className="absolute inset-0 rounded-full border border-amber-200/20" />
                    <span className="absolute inset-2 rounded-full border border-amber-200/15" />
                    <Play className="size-6 text-amber-200/80 md:size-8" />
                  </div>
                </div>
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.5em] text-amber-200/60">
                  ONYX · TURNTABLE
                </div>
                <h1 className="font-serif text-4xl font-medium leading-tight md:text-6xl">{concept.headline}</h1>
                <p className="mx-auto mt-6 max-w-md text-sm leading-loose text-[#f0ead9]/60">{concept.subline}</p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button className="rounded-full bg-amber-300 px-8 py-3 text-sm font-bold text-[#12100d] shadow-[0_8px_40px_rgba(217,180,110,0.35)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-amber-200/50 active:scale-95">
                    申请品鉴名额
                  </button>
                  <button className="rounded-full border border-amber-200/30 px-6 py-3 text-sm font-medium text-amber-200/85 transition-colors hover:bg-amber-200/10 focus-visible:ring-4 focus-visible:ring-amber-200/40">
                    查看样张
                  </button>
                </div>
              </div>

              <div className="relative flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.25em] text-[#f0ead9]/45">
                <span>{concept.detail}</span>
                <span className="text-amber-200/50">·</span>
                <span>MM 动磁唱头</span>
                <span className="text-amber-200/50">·</span>
                <span>33/45 RPM</span>
                <span className="ml-auto hidden md:inline">NO. {concept.id}/500</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConceptId(c.id)}
                  className={`group rounded-2xl border p-5 text-left backdrop-blur transition-all duration-500 focus-visible:ring-3 focus-visible:ring-amber-200/40 ${
                    conceptId === c.id
                      ? "border-amber-200/40 bg-amber-200/10"
                      : "border-white/10 bg-white/5 hover:border-amber-200/25 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200/50">
                      {c.line}
                    </span>
                    {conceptId === c.id && <Check className="size-3.5 text-amber-200" />}
                  </div>
                  <div className="mt-2 font-serif text-lg">{c.name}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-[#f0ead9]/45">{c.headline}</div>
                </button>
              ))}
            </div>

            {generateState === "success" && (
              <div className="arena-enter mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="size-4" /> 品鉴方案更新完成，三组陈列均通过视觉校验。
              </div>
            )}
            {generateState === "error" && (
              <div className="arena-enter mt-4 flex items-center gap-2 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                <CircleX className="size-4" /> 方案未通过：限量信息与文案语气冲突，请复核。
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="flex gap-2">
              <PremiumButton
                solid
                disabled={busy}
                onClick={() => runAsync(setGenerateState, "生成品鉴方案", 0.08)}
                icon={busy ? Loader2 : Sparkles}
                spin={busy}
              >
                生成
              </PremiumButton>
              <PremiumButton
                disabled={busy}
                success={saveState === "success"}
                onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                icon={saveState === "success" ? CheckCircle2 : Save}
              >
                保存
              </PremiumButton>
              <PremiumButton
                disabled={busy}
                success={exportState === "success"}
                onClick={() => runAsync(setExportState, "导出邀请函", 0.05)}
                icon={exportState === "success" ? CheckCircle2 : Download}
              >
                导出
              </PremiumButton>
            </div>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 text-sm font-bold tracking-wide text-[#f0ead9]/90">策展参数</div>
              <div className="space-y-4">
                <PremiumField label="藏家画像" options={audiences} value={audience} onChange={setAudience} />
                <PremiumField label="发布渠道" options={channels} value={channel} onChange={setChannel} />
                <PremiumField label="语气" options={tones} value={tone} onChange={setTone} />
                <PremiumField label="陈设色" options={styles} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-3 text-sm font-bold tracking-wide text-[#f0ead9]/90">Brief</div>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 27 === 0) log("Brief 更新")
                }}
                className="min-h-32 w-full resize-y rounded-xl border border-white/10 bg-[#1a1712] p-3 text-sm leading-relaxed text-[#f0ead9] outline-none transition-colors placeholder:text-[#f0ead9]/25 focus:border-amber-200/40"
                placeholder="产品 / 藏家 / 限量信息…"
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold tracking-wide text-[#f0ead9]/90">收藏指标</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-200/50">EST.</span>
              </div>
              <div className="space-y-2">
                <PremiumMetric label="Reach" value={metrics.reach.toLocaleString()} suffix="K" />
                <PremiumMetric label="CTR" value={metrics.ctr.toFixed(1)} suffix="%" />
                <PremiumMetric label="Conversion" value={metrics.conversion.toFixed(1)} suffix="%" />
              </div>
            </section>

            <section className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-3 text-sm font-bold tracking-wide text-[#f0ead9]/90">最近操作</div>
              <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">
                    <span className="size-1 shrink-0 rounded-full bg-amber-300/70" />
                    <span className="flex-1 text-[#f0ead9]/65">{a.label}</span>
                    <span className="shrink-0 font-mono text-[10px] text-[#f0ead9]/30">{a.time}</span>
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

function PremiumField({
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
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#f0ead9]/40">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-300 focus-visible:ring-3 focus-visible:ring-amber-200/30 ${
              value === opt
                ? "border-amber-300 bg-amber-300 text-[#12100d]"
                : "border-white/15 bg-white/5 text-[#f0ead9]/60 hover:border-amber-200/40 hover:text-[#f0ead9]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function PremiumMetric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
      <span className="text-sm text-[#f0ead9]/45">{label}</span>
      <span className="text-lg font-semibold text-amber-100">
        {value}
        <span className="ml-0.5 text-xs font-normal text-[#f0ead9]/35">{suffix}</span>
      </span>
    </div>
  )
}

function PremiumButton({
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
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-300 focus-visible:ring-3 focus-visible:ring-amber-200/30 disabled:opacity-50 ${
        success
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : solid
            ? "border-amber-300 bg-amber-300 text-[#12100d] font-bold shadow-[0_4px_24px_rgba(217,180,110,0.3)] hover:bg-amber-200"
            : "border-white/15 bg-white/5 text-[#f0ead9]/80 hover:border-amber-200/40"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
