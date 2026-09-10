"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Check,
  Download,
  Flame,
  Loader2,
  Play,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react"

type CutId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-skill"

const cuts: {
  id: CutId
  label: string
  kicker: string
  headline: string
  copy: string
  hue: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    label: "夜行",
    kicker: "Campaign 01",
    headline: "城市睡着了，声音还醒着",
    copy: "Aurora X1 深夜模式，把 20Hz 的低频留在房间里，不打扰任何一个邻居。",
    hue: "from-amber-500/30 via-orange-600/10 to-transparent",
    reach: 910,
    ctr: 4.4,
    conversion: 3.0,
  },
  {
    id: "B",
    label: "晨雾",
    kicker: "Campaign 02",
    headline: "第一缕光，先照到音乐上",
    copy: "晨间唤醒曲线从 40 分贝开始，让一天以舒适而不是惊吓开场。",
    hue: "from-sky-400/30 via-indigo-500/10 to-transparent",
    reach: 848,
    ctr: 4.9,
    conversion: 3.4,
  },
  {
    id: "C",
    label: "热浪",
    kicker: "Campaign 03",
    headline: "把派对装进一只 1.2 公斤的盒子",
    copy: "双低音辐射器加 IP67 防水，户外也能把低音推到人群外面。",
    hue: "from-rose-500/30 via-fuchsia-600/10 to-transparent",
    reach: 977,
    ctr: 4.0,
    conversion: 2.9,
  },
]

const audiences = ["城市夜行者", "通勤人群", "户外玩家", "居家办公"]
const channels = ["品牌大屏", "短视频", "社交媒体", "线下体验"]
const tones = ["电影感", "温暖叙述", "高能节奏", "克制留白"]
const moods = ["午夜琥珀", "晨雾冷蓝", "霓虹玫红", "极简银灰"]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualFrontendShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 智能音箱做一次以情绪为主导的发布传播，主题是声音如何改变空间的温度。"
  )
  const [cutId, setCutId] = useState<CutId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [mood, setMood] = useState(moods[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [saved, setSaved] = useState(false)
  const [exported, setExported] = useState(false)
  const [timeline, setTimeline] = useState<string[]>([
    "导入品牌情绪板",
    "选定主视觉方向",
  ])

  const cut = cuts.find((item) => item.id === cutId) ?? cuts[0]

  function remember(entry: string) {
    setTimeline((prev) => [entry, ...prev].slice(0, 6))
  }

  const moodBoost = mood === "霓虹玫红" ? 1.06 : mood === "晨雾冷蓝" ? 1.02 : 1
  const reach = Math.round(cut.reach * moodBoost)
  const ctr = Number((cut.ctr * (tone === "高能节奏" ? 1.05 : 1)).toFixed(1))
  const conversion = Number((cut.conversion * (channel === "线下体验" ? 1.08 : 1)).toFixed(1))

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    remember("开始渲染主视觉")
    window.setTimeout(() => {
      const failed = Math.random() < 0.12
      setPhase(failed ? "error" : "success")
      remember(failed ? "渲染失败，等待重试" : "主视觉渲染完成")
    }, 1400)
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-zinc-100">
      <div className="mx-auto max-w-[1360px] px-4 pb-28 pt-6 md:px-8 md:pb-32">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-400 text-black">
              <Flame className="size-4" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold tracking-wide">{MODEL}</span>
                <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                  {SKILL}
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Visual Frontend · Campaign Studio
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="size-1.5 rounded-full bg-emerald-400" /> 自动保存开启
            </span>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 sm:inline-flex">
              2026 新品季
            </span>
          </div>
        </header>

        <section
          className={`relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br px-6 py-10 md:px-12 md:py-16 ${cut.hue}`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0, transparent 40%)",
            }}
          />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-300/80">
              <span>{cut.kicker}</span>
              <span className="h-px w-10 bg-zinc-400/50" />
              <span>{mood}</span>
            </div>
            <h1 className="mt-6 max-w-3xl text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-7xl">
              {cut.headline}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-200/80 md:text-base">{cut.copy}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={generate}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-white/60 active:scale-95 disabled:opacity-70"
              >
                {phase === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Wand2 className="size-4" />
                )}
                重新生成主视觉
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaved(true)
                  remember("已保存当前视觉方向")
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm text-zinc-100 transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40"
              >
                {saved ? <Check className="size-4 text-emerald-400" /> : <Save className="size-4" />} 保存
              </button>
              <button
                type="button"
                onClick={() => {
                  setExported(true)
                  remember("素材包已导出")
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm text-zinc-100 transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/40"
              >
                {exported ? <Check className="size-4 text-emerald-400" /> : <Download className="size-4" />} 导出
              </button>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300/70">
                <Play className="size-3" /> 面向 {audience}
              </span>
            </div>

            {phase === "error" && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                <AlertTriangle className="size-4" /> 渲染服务暂时不可用，已保留上一版主视觉。
              </div>
            )}
            {phase === "success" && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                <Sparkles className="size-4" /> {cut.label} 方向已生成 3 张情绪稿。
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-500">方案胶片</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {cuts.map((item) => {
                  const active = item.id === cutId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCutId(item.id)
                        remember(`切换到方案 ${item.id} · ${item.label}`)
                      }}
                      aria-pressed={active}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all focus-visible:ring-3 focus-visible:ring-white/40 ${
                        active
                          ? "border-white/60 bg-white/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className={`mb-3 h-16 rounded-xl bg-gradient-to-br ${item.hue}`} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.id} · {item.label}</span>
                        {active && <Check className="size-4 text-amber-300" />}
                      </div>
                      <div className="mt-1 line-clamp-2 text-[11px] text-zinc-400">{item.headline}</div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <label htmlFor="brief-vf41" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                Campaign Brief
              </label>
              <textarea
                id="brief-vf41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-zinc-100 outline-none transition-colors focus:border-amber-300/60 focus:ring-3 focus:ring-amber-300/20"
              />
              <div className="mt-2 text-[11px] text-zinc-500">{brief.length} 字 · 情绪驱动文案</div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">最近活动</h2>
                <span className="text-[11px] text-zinc-500">本地会话</span>
              </div>
              <ol className="space-y-2">
                {timeline.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="flex items-center gap-3 text-xs text-zinc-300">
                    <span className="flex size-5 items-center justify-center rounded-full border border-white/15 text-[10px] text-zinc-400">
                      {timeline.length - index}
                    </span>
                    {entry}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 text-[11px] uppercase tracking-[0.28em] text-zinc-500">模拟指标</h2>
              <div className="space-y-4">
                <Stat label="Reach" value={`${reach}K`} accent="text-amber-300" />
                <Stat label="CTR" value={`${ctr}%`} accent="text-sky-300" />
                <Stat label="Conversion" value={`${conversion}%`} accent="text-rose-300" />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-3 text-[11px] uppercase tracking-[0.28em] text-zinc-500">投放控件</h2>
              <Selector label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Selector label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Selector label="语气" options={tones} value={tone} onChange={setTone} />
              <Selector label="视觉风格" options={moods} value={mood} onChange={setMood} />
            </section>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-amber-300" /> 方案 {cutId}
            </span>
            <span className="hidden sm:inline">{channel} · {tone}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] text-zinc-300 transition-colors hover:bg-white/10"
            >
              重置状态
            </button>
            <button
              type="button"
              onClick={generate}
              className="rounded-full bg-amber-400 px-4 py-1.5 text-[11px] font-semibold text-black transition-transform hover:scale-105"
            >
              生成
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className={`text-2xl font-semibold tracking-tight ${accent}`}>{value}</span>
    </div>
  )
}

function Selector({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 text-[11px] text-zinc-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-all focus-visible:ring-3 focus-visible:ring-white/40 ${
              value === option
                ? "border-amber-300 bg-amber-300 text-black"
                : "border-white/15 text-zinc-300 hover:border-white/40 hover:bg-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
