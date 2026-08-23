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
  chapter: string
  headline: string
  subhead: string
  body: string[]
  quote: string
  caption: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "晨间排版",
    chapter: "CHAPTER 01 · MORNING",
    headline: "把一天的开始，排成一张温柔的版面",
    subhead: "Sundial 桌面日历屏 · 晨间模式",
    body: [
      "当第一缕光落在书桌上，Sundial 的墨水屏开始书写新的一天。天气、日程与一句手写体问候，以排版的方式依次登场。",
      "它不闪烁，不推送，只在固定的时刻完成自己的版式更新——像一本每天早晨重新印刷的日报。",
    ],
    quote: "真正的日历，不打扰时间，只整理时间。",
    caption: "图 01 · 晨间模式下的今日版面",
    reach: 426,
    ctr: 4.3,
    conversion: 3.1,
  },
  {
    id: "B",
    name: "午夜副刊",
    chapter: "CHAPTER 02 · MIDNIGHT",
    headline: "深夜的书桌，需要一盏不亮的屏幕",
    subhead: "Sundial 桌面日历屏 · 午夜模式",
    body: [
      "深色底、低亮度与无蓝光墨水屏，让午夜加班的人不必再与屏幕的刺眼对抗。",
      "Sundial 在凌晨自动进入副刊模式：只剩下日期、一句诗，和一片安静的留白。",
    ],
    quote: "我们为深夜工作的人，设计了一盏不亮的灯。",
    caption: "图 02 · 午夜模式与一句诗",
    reach: 398,
    ctr: 4.0,
    conversion: 2.8,
  },
  {
    id: "C",
    name: "周末特辑",
    chapter: "CHAPTER 03 · WEEKEND",
    headline: "周末的版面，没有日程，只有清单",
    subhead: "Sundial 桌面日历屏 · 周末特辑",
    body: [
      "周六的 Sundial 会自动隐藏会议提醒，把版面让给三件小事：一部电影、一次散步、一页没读完的书。",
      "它用最朴素的方式提醒你——休息，也是日程的一部分。",
    ],
    quote: "最好的特辑，是空出来的那一版。",
    caption: "图 03 · 周末清单版式",
    reach: 451,
    ctr: 4.6,
    conversion: 3.4,
  },
]

const audiences = ["设计师", "自由职业者", "极客收藏家", "纸质日历怀旧者"]
const channels = ["设计杂志", "极客商店", "官网长文", "线下展览"]
const tones = ["克制陈述", "诗意叙述", "客观报道", "怀旧温情"]
const styles = ["纸白米黄", "午夜深蓝", "墨绿素装", "淡灰石青"]

export default function DesignImpeccableShowcase() {
  const [brief, setBrief] = useState(
    "Sundial 桌面日历屏上市：用「报纸副刊」的方式讲产品，让每个模式都成为一页可收藏的版面。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "版面排版完成，页码已就位" },
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
    log(`版面切换：${concept.chapter}`)
  }, [conceptId, concept.chapter, log])

  useEffect(() => {
    log(`版式参数：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "客观报道" ? 1.03 : tone === "诗意叙述" ? 1.02 : 1
    const styleMul = style === "墨绿素装" ? 1.02 : style === "淡灰石青" ? 0.98 : 1
    const channelMul = channel === "官网长文" ? 1.05 : channel === "设计杂志" ? 1.02 : 1
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
      log(`${label}：拼版中`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：版面溢出`)
        } else {
          setter("success")
          log(`${label}：拼版完成`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const paper = useMemo(() => {
    switch (style) {
      case "午夜深蓝":
        return { bg: "bg-[#101820]", text: "text-[#e8e6e1]", rule: "border-[#e8e6e1]/25" }
      case "墨绿素装":
        return { bg: "bg-[#1f2b24]", text: "text-[#e6e4d9]", rule: "border-[#e6e4d9]/25" }
      case "淡灰石青":
        return { bg: "bg-[#e9ece8]", text: "text-[#2b3028]", rule: "border-[#2b3028]/20" }
      default:
        return { bg: "bg-[#faf7f0]", text: "text-[#2e2a24]", rule: "border-[#2e2a24]/20" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#efece4] text-[#2e2a24]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#2e2a24]/15 pb-5">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-tight">DeepSeek V4 flash 0731</span>
            <span className="border border-[#2e2a24]/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#2e2a24]/50">
              frontend-design + impeccable
            </span>
          </div>
          <div className="flex gap-2">
            <EditorButton
              solid
              disabled={busy}
              onClick={() => runAsync(setGenerateState, "重排版面", 0.08)}
              icon={busy ? Loader2 : Sparkles}
              spin={busy}
            >
              生成
            </EditorButton>
            <EditorButton
              disabled={busy}
              success={saveState === "success"}
              onClick={() => runAsync(setSaveState, "保存版面", 0.1)}
              icon={saveState === "success" ? Check : Save}
            >
              保存
            </EditorButton>
            <EditorButton
              disabled={busy}
              success={exportState === "success"}
              onClick={() => runAsync(setExportState, "导出杂志页", 0.05)}
              icon={exportState === "success" ? Check : Download}
            >
              导出
            </EditorButton>
          </div>
        </div>

        {generateState === "success" && (
          <div className="arena-enter mb-5 flex items-center gap-2 border border-emerald-900/25 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
            <Check className="size-4" /> 版面重排完成：栏宽、字号与留白均符合排版规范。
          </div>
        )}
        {generateState === "error" && (
          <div className="arena-enter mb-5 flex items-center gap-2 border border-red-900/25 bg-red-50 px-4 py-2.5 text-sm text-red-900">
            <CircleX className="size-4" /> 拼版失败：正文长度超出当前栏位，请精简文案。
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside>
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2a24]/45">
              目录 · 三章
            </div>
            <div className="mb-7 flex flex-col gap-1 border-l border-[#2e2a24]/20">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConceptId(c.id)}
                  className={`group border-l-2 py-2.5 pl-4 text-left transition-all focus-visible:ring-2 focus-visible:ring-[#2e2a24]/30 ${
                    conceptId === c.id
                      ? "-ml-px border-[#2e2a24] bg-white/60"
                      : "border-transparent hover:border-[#2e2a24]/40"
                  }`}
                >
                  <span className={`block text-[10px] font-mono uppercase tracking-widest ${conceptId === c.id ? "text-[#2e2a24]/70" : "text-[#2e2a24]/35"}`}>
                    {c.id} / {c.chapter}
                  </span>
                  <span className={`mt-0.5 block font-serif ${conceptId === c.id ? "font-semibold" : "opacity-60"}`}>
                    {c.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2a24]/45">
              版式参数
            </div>
            <div className="mb-7 space-y-4">
              <EditField label="读者" options={audiences} value={audience} onChange={setAudience} />
              <EditField label="渠道" options={channels} value={channel} onChange={setChannel} />
              <EditField label="语气" options={tones} value={tone} onChange={setTone} />
              <EditField label="纸色" options={styles} value={style} onChange={setStyle} />
            </div>

            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2a24]/45">
              编辑备注
            </div>
            <textarea
              value={brief}
              onChange={(e) => {
                setBrief(e.target.value)
                if (e.target.value.length % 26 === 0) log("编辑备注更新")
              }}
              className="min-h-28 w-full resize-y border border-[#2e2a24]/20 bg-[#faf7f0] p-3 font-mono text-xs leading-relaxed outline-none transition-colors focus:border-[#2e2a24]/60"
              placeholder="给版面的备注…"
            />
          </aside>

          <div>
            <div key={conceptId} className={`arena-enter relative overflow-hidden ${paper.bg} ${paper.text}`}>
              <div className="flex flex-wrap items-center justify-between border-b px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] opacity-60 md:px-8">
                <span>SUNDIAL MAGAZINE</span>
                <span className="hidden md:inline">{channel} · {tone}</span>
                <span>VOL.01 · 2026</span>
              </div>

              <div className="grid md:grid-cols-2">
                <div className={`border-b p-7 md:border-b-0 md:border-r md:p-10 ${paper.rule}`}>
                  <div className="mb-6 text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">
                    {concept.chapter}
                  </div>
                  <h1 className="font-serif text-4xl font-bold leading-[1.15] md:text-5xl">{concept.headline}</h1>
                  <div className="mt-6 border-t-2 border-current pt-4 text-sm leading-relaxed opacity-80">
                    {concept.subhead}
                  </div>
                  <blockquote className="mt-8 border-l-2 border-current pl-4 font-serif text-lg italic opacity-75">
                    「{concept.quote}」
                  </blockquote>
                </div>

                <div className="flex flex-col p-7 md:p-10">
                  <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 text-[13px] leading-[1.8]">
                    {concept.body.map((para, i) => (
                      <p key={i} className={i % 2 === 1 ? "col-span-1" : "col-span-1"}>
                        <span className="mr-1 font-serif text-lg opacity-40">{i === 0 ? "「" : "『"}</span>
                        {para}
                        <span className="ml-1 font-serif text-lg opacity-40">{i === 0 ? "」" : "』"}</span>
                      </p>
                    ))}
                  </div>
                  <div className={`mt-6 border-t pt-4 ${paper.rule}`}>
                    <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.3em] opacity-50">
                      {concept.caption}
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="border-b border-current pb-0.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current/30">
                        订阅 Sundial →
                      </button>
                      <span className="font-mono text-[10px] opacity-40">P.0{concept.id === "A" ? "4" : concept.id === "B" ? "5" : "6"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between border-t px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] opacity-50 md:px-8">
                <span>读者：{audience}</span>
                <span className="hidden md:inline">REACH {metrics.reach.toLocaleString()}K · CTR {metrics.ctr.toFixed(1)}% · CONV {metrics.conversion.toFixed(1)}%</span>
                <span>页面 04–05</span>
              </div>
            </div>

            <section className="mt-5 border border-[#2e2a24]/15 bg-[#faf7f0] p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2e2a24]/45">
                  校对记录
                </span>
                <span className="font-mono text-[10px] text-[#2e2a24]/35">{activity.length} 条</span>
              </div>
              <ol className="grid gap-1.5 md:grid-cols-2">
                {activity.map((a, i) => (
                  <li key={a.id} className="flex items-baseline gap-2 border-b border-dotted border-[#2e2a24]/20 pb-2 text-xs">
                    <span className="font-serif opacity-40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 opacity-75">{a.label}</span>
                    <span className="font-mono text-[10px] opacity-40">{a.time}</span>
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

function EditField({
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
      <div className="mb-1.5 text-xs text-[#2e2a24]/55">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`border px-2 py-1 text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-[#2e2a24]/30 ${
              value === opt
                ? "border-[#2e2a24] bg-[#2e2a24] text-white"
                : "border-[#2e2a24]/25 bg-white/50 text-[#2e2a24]/60 hover:border-[#2e2a24]/60"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function EditorButton({
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
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#2e2a24]/30 disabled:opacity-50 ${
        success
          ? "border-emerald-900/30 bg-emerald-50 text-emerald-900"
          : solid
            ? "border-[#2e2a24] bg-[#2e2a24] text-white hover:opacity-85"
            : "border-[#2e2a24]/30 bg-white/60 text-[#2e2a24]/75 hover:border-[#2e2a24]/60"
      }`}
    >
      <Icon className={`size-3.5 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
