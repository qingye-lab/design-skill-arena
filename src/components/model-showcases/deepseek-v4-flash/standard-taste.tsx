"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  CircleX,
  Download,
  Leaf,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  epigraph: string
  headline: string
  body: string
  note: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "守拙",
    epigraph: "I. 关于慢",
    headline: "慢一点，气味才来得及抵达",
    body: "Suisen 香薰蜡烛使用大豆蜡与植物精油，燃烧时长 42 小时，香气不必急于消散。",
    note: "NO.01 · 初版叙事",
    reach: 341,
    ctr: 4.2,
    conversion: 3.1,
  },
  {
    id: "B",
    name: "留白",
    epigraph: "II. 关于空间",
    headline: "一支蜡烛，留出一间房的安静",
    body: "扩香半径 3.5 米，苏生木调与雪松尾韵，为房间留出呼吸的余地。",
    note: "NO.02 · 空间叙事",
    reach: 366,
    ctr: 4.0,
    conversion: 2.9,
  },
  {
    id: "C",
    name: "归时",
    epigraph: "III. 关于归处",
    headline: "下班后，气味先于你回到家",
    body: "智能烛芯联动 App 远程点燃，Suisen 在你进门的前十分钟，把家还给你。",
    note: "NO.03 · 时间叙事",
    reach: 318,
    ctr: 4.5,
    conversion: 3.4,
  },
]

const audiences = ["独居青年", "设计师", "书店主理人", "酒店买手"]
const channels = ["独立书店陈列", "订阅礼盒", "官网首页", "内容杂志"]
const tones = ["安静克制", "诗意温柔", "干脆利落", "朴素真诚"]
const styles = ["纸白", "沙金", "黛青", "苔藓绿"]

export default function StandardTasteShowcase() {
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "页面装载完毕，排版基线就位" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 10))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`切换叙事 ${conceptId} · ${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`参数调整：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "干脆利落" ? 1.03 : tone === "诗意温柔" ? 1.01 : 1
    const styleMul = style === "沙金" ? 1.02 : style === "黛青" ? 0.99 : 1
    const channelMul = channel === "官网首页" ? 1.05 : channel === "订阅礼盒" ? 1.02 : 1
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
      log(`${label}：开始排版`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：文案超长，需删减`)
        } else {
          setter("success")
          log(`${label}：已定稿`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const palette = useMemo(() => {
    switch (style) {
      case "沙金":
        return { bg: "bg-[#f7f1e4]", card: "border-[#d9c9a3]", ink: "#6b5317" }
      case "黛青":
        return { bg: "bg-[#eef2f0]", card: "border-[#b9c6c2]", ink: "#2f5d57" }
      case "苔藓绿":
        return { bg: "bg-[#eef2e9]", card: "border-[#b8c6a8]", ink: "#3f5d2f" }
      default:
        return { bg: "bg-[#faf8f4]", card: "border-[#e0d8c8]", ink: "#3f3a2e" }
    }
  }, [style])

  return (
    <div className={`min-h-screen ${palette.bg} text-[#2b2a26]`}>
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-lg font-semibold tracking-wide">DeepSeek V4 flash 0731</span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-current/50">
              frontend-app-builder + taste-skill
            </span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-current/40">Muse · 新品发布</div>
        </header>

        <div className="py-10 text-center md:py-14">
          <div className="mb-4 text-[11px] uppercase tracking-[0.4em] text-current/45">Campaign Studio</div>
          <h1 className="font-serif text-3xl font-medium leading-snug md:text-5xl">
            Suisen 蜡烛
            <br />
            一场不说服你的发布
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-current/55">
            没有弹窗，没有倒计时。只有三篇关于「慢」的短叙事，和一处安静的入口。
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="order-2 lg:order-1">
            <SectionLabel>一 · 叙事</SectionLabel>
            <div className="mb-8 flex flex-col gap-2">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConceptId(c.id)}
                  className={`group flex items-baseline gap-3 border-b py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-current/30 ${
                    conceptId === c.id ? "border-current" : "border-current/15 hover:border-current/50"
                  }`}
                >
                  <span className={`font-serif text-xl ${conceptId === c.id ? "text-current" : "text-current/30"}`}>
                    {c.id}
                  </span>
                  <span className="flex-1">
                    <span className={`block font-serif text-base ${conceptId === c.id ? "font-semibold" : "text-current/60"}`}>
                      {c.name}
                    </span>
                    <span className="block text-xs text-current/40">{c.epigraph}</span>
                  </span>
                </button>
              ))}
            </div>

            <SectionLabel>二 · 读者</SectionLabel>
            <div className="mb-8 space-y-5">
              <QuietField label="人群" options={audiences} value={audience} onChange={setAudience} />
              <QuietField label="渠道" options={channels} value={channel} onChange={setChannel} />
              <QuietField label="语气" options={tones} value={tone} onChange={setTone} />
              <QuietField label="纸色" options={styles} value={style} onChange={setStyle} />
            </div>

            <SectionLabel>三 · 度量</SectionLabel>
            <div className="space-y-2">
              <QuietMetric label="Reach" value={metrics.reach.toLocaleString()} unit="K" />
              <QuietMetric label="CTR" value={metrics.ctr.toFixed(1)} unit="%" />
              <QuietMetric label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" />
            </div>
          </aside>

          <div className="order-1 lg:order-2">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] uppercase tracking-[0.25em] text-current/45">主视觉预览</div>
              <div className="flex gap-2">
                <QuietButton
                  solid
                  disabled={busy}
                  onClick={() => runAsync(setGenerateState, "重排主视觉", 0.08)}
                >
                  {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} 生成
                </QuietButton>
                <QuietButton
                  disabled={busy}
                  success={saveState === "success"}
                  onClick={() => runAsync(setSaveState, "保存叙事", 0.1)}
                >
                  {saveState === "success" ? <Check className="size-3.5" /> : <Save className="size-3.5" />} 保存
                </QuietButton>
                <QuietButton
                  disabled={busy}
                  success={exportState === "success"}
                  onClick={() => runAsync(setExportState, "导出版式", 0.05)}
                >
                  {exportState === "success" ? <Check className="size-3.5" /> : <Download className="size-3.5" />} 导出
                </QuietButton>
              </div>
            </div>

            {generateState === "success" && (
              <div className="mb-4 flex items-center gap-2 border border-emerald-800/20 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
                <Check className="size-4" /> 主视觉已按当前参数重排，叙事结构完整。
              </div>
            )}
            {generateState === "error" && (
              <div className="mb-4 flex items-center gap-2 border border-red-800/20 bg-red-50 px-4 py-2.5 text-sm text-red-900">
                <CircleX className="size-4" /> 排版失败：正文超过一页纸的篇幅，请精简。
              </div>
            )}

            <div key={conceptId} className={`arena-enter relative border ${palette.card} bg-white p-8 md:p-12`}>
              <div className="absolute left-6 top-6 text-[10px] uppercase tracking-[0.3em] text-current/35">
                {channel} · {tone}
              </div>
              <div className="absolute right-6 top-6 text-[10px] uppercase tracking-[0.3em] text-current/35">
                {concept.note}
              </div>

              <div className="py-14 text-center md:py-20">
                <div className="mb-5 text-[11px] uppercase tracking-[0.35em] text-current/40">{concept.epigraph}</div>
                <h2 className="mx-auto max-w-md font-serif text-3xl font-medium leading-snug md:text-4xl">
                  {concept.headline}
                </h2>
                <div className="mx-auto mt-6 h-px w-16 bg-current/25" />
                <p className="mx-auto mt-6 max-w-sm text-sm leading-loose text-current/60">{concept.body}</p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    className="inline-flex items-center gap-1.5 border-b border-current pb-0.5 font-serif text-sm transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-current/30"
                    style={{ color: palette.ink }}
                  >
                    阅读全文 <ArrowRight className="size-3.5" />
                  </button>
                  <span className="text-xs text-current/35">· 面向 {audience}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 border-t border-current/10 pt-5 text-[11px] uppercase tracking-[0.2em] text-current/40">
                <span className="flex items-center gap-1.5">
                  <Leaf className="size-3.5" /> 大豆蜡
                </span>
                <span>42h 燃烧</span>
                <span>植物精油</span>
              </div>
            </div>

            <div className="mt-8 border-t border-current/10 pt-5">
              <SectionLabel>最近操作</SectionLabel>
              <ol className="mt-3 grid gap-1.5 md:grid-cols-2">
                {activity.map((a, i) => (
                  <li key={a.id} className="flex items-baseline gap-2 text-sm">
                    <span className="font-serif text-current/30">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-current/70">{a.label}</span>
                    <span className="text-xs text-current/35">{a.time}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-current/40">{children}</div>
  )
}

function QuietField({
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
      <div className="mb-1.5 text-xs text-current/45">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`border px-2.5 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-current/30 ${
              value === opt ? "border-current bg-current text-white" : "border-current/25 bg-transparent text-current/60 hover:border-current/60"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function QuietMetric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dotted border-current/25 pb-2">
      <span className="text-xs uppercase tracking-[0.2em] text-current/45">{label}</span>
      <span className="font-serif text-lg">
        {value}
        <span className="ml-0.5 text-xs text-current/40">{unit}</span>
      </span>
    </div>
  )
}

function QuietButton({
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
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-current/30 disabled:opacity-50 ${
        success
          ? "border-emerald-700/40 bg-emerald-50 text-emerald-900"
          : solid
            ? "border-current bg-current text-white hover:opacity-85"
            : "border-current/30 text-current/70 hover:border-current/60"
      }`}
    >
      {children}
    </button>
  )
}
