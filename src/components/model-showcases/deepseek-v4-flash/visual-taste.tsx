"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CircleX,
  Download,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  plate: string
  caption: string
  headline: string
  note: string
  tone: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "素坯",
    plate: "PLATE 01 · UNGLAZED",
    caption: "不上釉的诚实",
    headline: "手与泥之间，隔着一千年",
    note: "Terra 手工陶器使用龙泉窑土，每一件都有唯一的手作痕迹。",
    tone: "大地色系 · 哑光",
    reach: 287,
    ctr: 3.8,
    conversion: 2.9,
  },
  {
    id: "B",
    name: "窑变",
    plate: "PLATE 02 · KILN CHANGE",
    caption: "火焰留下的签名",
    headline: "没有两件 Terra 完全相同",
    note: "1300℃ 还原烧制中的窑变效果，让每件陶器都成为孤品。",
    tone: "青釉 · 开片",
    reach: 305,
    ctr: 4.1,
    conversion: 3.1,
  },
  {
    id: "C",
    name: "手痕",
    plate: "PLATE 03 · FINGERPRINT",
    caption: "指尖的纪录片",
    headline: "杯沿的弧度，是匠人的日常",
    note: "手工拉坯保留旋纹与指痕，机器做不出的细节，交给时间。",
    tone: "糙面 · 暖灰",
    reach: 264,
    ctr: 3.6,
    conversion: 2.7,
  },
]

const audiences = ["茶器藏家", "生活方式博主", "设计从业者", "日式家居用户"]
const channels = ["展览空间", "独立商店", "内容平台", "官网图录"]
const tones = ["克制陈述", "温润叙事", "物件档案", "匠人口吻"]
const styles = ["土陶褐", "灰陶青", "瓷白", "黑陶"]

export default function VisualTasteShowcase() {
  const [brief, setBrief] = useState(
    "Terra 手工陶器系列上市：以「手作孤品」为概念，通过展览与图录建立器物美学认知。"
  )
  const [audience, setAudience] = useState(audiences[2])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "展陈架已搭建，3 件器物就位" },
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
    log(`展品切换：${concept.plate}`)
  }, [conceptId, concept.plate, log])

  useEffect(() => {
    log(`展陈参数：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "物件档案" ? 1.03 : tone === "温润叙事" ? 1.02 : 1
    const styleMul = style === "黑陶" ? 0.98 : style === "瓷白" ? 1.03 : 1
    const channelMul = channel === "官网图录" ? 1.05 : channel === "内容平台" ? 1.02 : 1
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
      log(`${label}：陈列调整中`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：陈列冲突`)
        } else {
          setter("success")
          log(`${label}：陈列定案`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const plateBg = useMemo(() => {
    switch (style) {
      case "灰陶青":
        return "bg-[#d7dcd6]"
      case "瓷白":
        return "bg-[#f3f1ec]"
      case "黑陶":
        return "bg-[#2b2a27]"
      default:
        return "bg-[#d9c9b4]"
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#f5f2ec] text-[#2c2a26]">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#2c2a26]/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-wider">DeepSeek V4 flash 0731</span>
            <span className="border border-[#2c2a26]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#2c2a26]/50">
              frontend-skill + taste-skill
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#2c2a26]/40">
            Terra 陶器 · 上市展陈
          </span>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className={`relative aspect-[16/10] overflow-hidden ${plateBg} transition-colors duration-700`}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.12) 0, transparent 55%)" }} />
              <div className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.3em] text-current opacity-40 md:left-8 md:top-8">
                {concept.plate}
              </div>
              <div className="absolute right-5 top-5 rounded-full border border-current/20 px-3 py-1 text-[10px] uppercase tracking-widest opacity-50">
                {channel}
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <div className="mb-6 flex size-28 items-center justify-center rounded-full border border-current/20 bg-current/5 backdrop-blur-[2px] md:size-40">
                  <div className="flex size-16 items-center justify-center rounded-full border border-current/30 text-2xl font-serif md:size-24 md:text-4xl">
                    {concept.id}
                  </div>
                </div>
                <div className="mb-3 text-[10px] uppercase tracking-[0.35em] opacity-50">{concept.caption}</div>
                <h1 className="max-w-md font-serif text-3xl font-medium leading-snug md:text-5xl">
                  {concept.headline}
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-60">{concept.note}</p>
                <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] opacity-50">
                  <span>{concept.tone}</span>
                  <span className="size-1 rounded-full bg-current" />
                  <span>面向 {audience}</span>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.25em] opacity-40 md:bottom-8 md:left-8">
                TERRA · 2026 COLLECTION
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConceptId(c.id)}
                  className={`group border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#2c2a26]/30 ${
                    conceptId === c.id ? "border-[#2c2a26] bg-white" : "border-[#2c2a26]/15 hover:border-[#2c2a26]/50"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-sm">{c.name}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-40">{c.id}</span>
                  </div>
                  <div className="mt-1 line-clamp-1 text-[11px] opacity-50">{c.caption}</div>
                </button>
              ))}
            </div>

            <section className="mt-8 border-t border-[#2c2a26]/10 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] opacity-45">展陈记录</span>
                <span className="text-[11px] opacity-40">{activity.length} 条</span>
              </div>
              <ol className="grid gap-1.5 md:grid-cols-2">
                {activity.map((a, i) => (
                  <li key={a.id} className="flex items-baseline gap-2 border-b border-dotted border-[#2c2a26]/20 pb-2 text-xs">
                    <span className="font-serif opacity-30">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 opacity-70">{a.label}</span>
                    <span className="font-mono text-[10px] opacity-40">{a.time}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="flex gap-2">
              <QuietAction
                solid
                disabled={busy}
                onClick={() => runAsync(setGenerateState, "重新陈列", 0.08)}
                icon={busy ? Loader2 : Sparkles}
                spin={busy}
              >
                生成
              </QuietAction>
              <QuietAction
                disabled={busy}
                success={saveState === "success"}
                onClick={() => runAsync(setSaveState, "保存展陈", 0.1)}
                icon={saveState === "success" ? Check : Save}
              >
                保存
              </QuietAction>
              <QuietAction
                disabled={busy}
                success={exportState === "success"}
                onClick={() => runAsync(setExportState, "导出图录", 0.05)}
                icon={exportState === "success" ? Check : Download}
              >
                导出
              </QuietAction>
            </div>

            {generateState === "success" && (
              <div className="arena-enter flex items-center gap-2 border border-emerald-900/20 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
                <Check className="size-4" /> 展陈更新完成，器物图录已同步。
              </div>
            )}
            {generateState === "error" && (
              <div className="arena-enter flex items-center gap-2 border border-red-900/20 bg-red-50 px-4 py-2.5 text-sm text-red-900">
                <CircleX className="size-4" /> 展陈失败：背景与器物色调冲突。
              </div>
            )}

            <section className="border border-[#2c2a26]/15 bg-white p-5">
              <div className="mb-4 text-[11px] uppercase tracking-[0.3em] opacity-45">策展参数</div>
              <div className="space-y-4">
                <GalleryField label="目标藏家" options={audiences} value={audience} onChange={setAudience} />
                <GalleryField label="展陈渠道" options={channels} value={channel} onChange={setChannel} />
                <GalleryField label="文案语气" options={tones} value={tone} onChange={setTone} />
                <GalleryField label="陶色" options={styles} value={style} onChange={setStyle} />
              </div>
            </section>

            <section className="border border-[#2c2a26]/15 bg-white p-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.3em] opacity-45">Brief</div>
              <textarea
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value)
                  if (e.target.value.length % 23 === 0) log("Brief 修订")
                }}
                className="min-h-32 w-full resize-y border border-[#2c2a26]/15 bg-[#faf8f3] p-3 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-[#2c2a26]/50"
                placeholder="器物、人群、策展思路…"
              />
            </section>

            <section className="border border-[#2c2a26]/15 bg-white p-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.3em] opacity-45">收藏指标</div>
              <div className="space-y-2">
                <GalleryMetric label="Reach" value={metrics.reach.toLocaleString()} unit="K" />
                <GalleryMetric label="CTR" value={metrics.ctr.toFixed(1)} unit="%" />
                <GalleryMetric label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function GalleryField({
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
      <div className="mb-1.5 text-xs text-[#2c2a26]/50">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`border px-2.5 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#2c2a26]/30 ${
              value === opt
                ? "border-[#2c2a26] bg-[#2c2a26] text-white"
                : "border-[#2c2a26]/20 text-[#2c2a26]/60 hover:border-[#2c2a26]/50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function GalleryMetric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dotted border-[#2c2a26]/20 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-[#2c2a26]/50">{label}</span>
      <span className="font-serif text-xl">
        {value}
        <span className="ml-0.5 text-xs opacity-40">{unit}</span>
      </span>
    </div>
  )
}

function QuietAction({
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
      className={`inline-flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#2c2a26]/30 disabled:opacity-50 ${
        success
          ? "border-emerald-900/30 bg-emerald-50 text-emerald-900"
          : solid
            ? "border-[#2c2a26] bg-[#2c2a26] text-white hover:opacity-85"
            : "border-[#2c2a26]/25 bg-white text-[#2c2a26]/70 hover:border-[#2c2a26]/60"
      }`}
    >
      <Icon className={`size-3.5 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
