"use client"

import { useState } from "react"
import {
  Activity,
  Check,
  Gauge,
  Layers3,
  Loader2,
  Pause,
  Play,
  Repeat,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react"

type TrackId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "react-bits"

const tracks: {
  id: TrackId
  name: string
  motion: string
  motionEn: string
  bars: number[]
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "脉冲入场",
    motion: "元素以 120ms 交错脉冲进入，强调节奏感。",
    motionEn: "staggered pulse-in",
    bars: [40, 68, 92, 54, 76, 38, 62],
    reach: 872,
    ctr: 4.5,
    conversion: 3.0,
  },
  {
    id: "B",
    name: "视差推进",
    motion: "滚动时前景与背景以不同速度推进，制造纵深。",
    motionEn: "parallax push",
    bars: [58, 44, 80, 96, 60, 72, 46],
    reach: 838,
    ctr: 4.9,
    conversion: 3.4,
  },
  {
    id: "C",
    name: "磁吸悬停",
    motion: "按钮跟随光标轻微位移，点击后回弹。",
    motionEn: "magnetic hover",
    bars: [70, 52, 88, 42, 66, 94, 50],
    reach: 915,
    ctr: 4.2,
    conversion: 3.1,
  },
]

const audiences = ["年轻用户", "内容创作者", "移动端用户", "活动参与者"]
const channels = ["短视频", "H5 活动页", "应用启动页", "社交媒体"]
const tones = ["轻快", "有张力", "俏皮", "冷静"]
const easings = ["ease-out", "spring", "cubic-bezier(0.4,0,0.2,1)", "linear"]

type Phase = "idle" | "loading" | "success" | "error"

export default function MotionBitsShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 设计一套以动效为主导的发布传播，让声音的存在感通过节奏和位移被感知。"
  )
  const [trackId, setTrackId] = useState<TrackId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [easing, setEasing] = useState(easings[0])
  const [duration, setDuration] = useState(420)
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState<Phase>("idle")
  const [events, setEvents] = useState<string[]>(["轨道 A 已载入", "动效库已连接"])

  const track = tracks.find((item) => item.id === trackId) ?? tracks[0]

  function record(entry: string) {
    setEvents((prev) => [entry, ...prev].slice(0, 6))
  }

  const reach = Math.round(track.reach * (channel === "H5 活动页" ? 1.03 : 1))
  const ctr = Number((track.ctr * (tone === "有张力" ? 1.04 : 1)).toFixed(1))
  const conversion = Number((track.conversion * (easing === "spring" ? 1.03 : 1)).toFixed(1))

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    record("开始渲染动效轨道")
    window.setTimeout(() => {
      const failed = Math.random() < 0.12
      setPhase(failed ? "error" : "success")
      record(failed ? "渲染失败，动效预算超限" : "动效轨道渲染完成")
    }, 1250)
  }

  return (
    <div className="min-h-screen bg-[#120a1f] text-violet-50">
      <div
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(600px circle at 15% 10%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(500px circle at 85% 80%, rgba(236,72,153,0.25), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1340px] px-4 py-6 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-500/30">
              <Zap className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{MODEL}</span>
                <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-200">
                  {SKILL}
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-violet-300/70">Motion Bits · Playground</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 px-3 py-1.5 text-xs transition-colors hover:bg-violet-400/10 focus-visible:ring-3 focus-visible:ring-violet-300/40"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "暂停动效" : "播放动效"}
            </button>
            <span className="hidden rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[11px] text-violet-200 sm:inline-flex">
              {duration}ms · {easing}
            </span>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-violet-400/20 bg-white/[0.04] p-5 backdrop-blur md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-violet-300/70">Active Track</div>
                  <h1 className="mt-1 text-2xl font-semibold md:text-3xl">{track.name}</h1>
                </div>
                <span className="rounded-full bg-violet-500/20 px-3 py-1 font-mono text-[11px] text-violet-200">
                  {track.motionEn}
                </span>
              </div>
              <p className="mt-3 max-w-xl text-sm text-violet-100/80">{track.motion}</p>

              <div className="mt-6 flex h-40 items-stretch gap-2 rounded-2xl border border-violet-400/15 bg-black/30 p-4">
                {track.bars.map((height, index) => (
                  <div key={`${track.id}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <div
                      className={`w-full rounded-full bg-gradient-to-t from-violet-600 to-fuchsia-400 transition-all ${
                        playing ? "animate-pulse" : ""
                      }`}
                      style={{
                        height: `${height}%`,
                        animationDelay: `${index * 90}ms`,
                        transitionDuration: `${duration}ms`,
                        transitionTimingFunction: easing.includes("cubic") ? "cubic-bezier(0.4,0,0.2,1)" : "ease-out",
                      }}
                    />
                    <span className="text-[9px] text-violet-300/50">{index + 1}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={generate}
                  disabled={phase === "loading"}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-violet-200/50 disabled:opacity-60"
                >
                  {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  生成动效
                </button>
                <button
                  type="button"
                  onClick={() => record("动效参数已保存")}
                  className="rounded-xl border border-violet-400/30 px-4 py-2.5 text-sm transition-colors hover:bg-violet-400/10 focus-visible:ring-3 focus-visible:ring-violet-300/40"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => record("动效资源包已导出")}
                  className="rounded-xl border border-violet-400/30 px-4 py-2.5 text-sm transition-colors hover:bg-violet-400/10 focus-visible:ring-3 focus-visible:ring-violet-300/40"
                >
                  导出
                </button>
                <label className="ml-auto flex items-center gap-2 text-[11px] text-violet-200">
                  <Gauge className="size-3.5" /> 时长
                  <input
                    type="range"
                    min={120}
                    max={900}
                    step={20}
                    value={duration}
                    onChange={(event) => {
                      setDuration(Number(event.target.value))
                      record(`动效时长调整为 ${event.target.value}ms`)
                    }}
                    className="h-1.5 w-32 appearance-none rounded-full bg-violet-400/25 accent-violet-300 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-violet-300/40"
                    aria-label="动效时长"
                  />
                  <span className="w-12 font-mono">{duration}ms</span>
                </label>
              </div>

              {phase === "error" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  <TriangleAlert className="size-4" /> 渲染失败：动效时长超出移动端预算，请降低到 600ms 以下。
                </div>
              )}
              {phase === "success" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  <Check className="size-4" /> {track.name} 动效已生成，支持降级为静态版本。
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-violet-400/20 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Repeat className="size-4 text-violet-300" /> 版本切换
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {tracks.map((item) => {
                  const active = item.id === trackId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTrackId(item.id)
                        record(`切换到轨道 ${item.id} · ${item.name}`)
                      }}
                      aria-pressed={active}
                      className={`group rounded-2xl border p-4 text-left transition-all focus-visible:ring-3 focus-visible:ring-violet-300/40 ${
                        active
                          ? "border-violet-300/60 bg-violet-500/15"
                          : "border-violet-400/15 hover:border-violet-300/40 hover:bg-violet-400/5"
                      }`}
                    >
                      <div className="mb-3 flex h-10 items-end gap-1">
                        {item.bars.slice(0, 5).map((height, index) => (
                          <span
                            key={index}
                            className={`flex-1 rounded-sm ${active ? "bg-violet-300" : "bg-violet-400/40"}`}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {item.id} · {item.name}
                        </span>
                        {active && <Check className="size-3.5 text-violet-200" />}
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-violet-300/60">{item.motionEn}</div>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-violet-400/20 bg-white/[0.03] p-5">
              <label htmlFor="brief-mb41" className="text-[11px] uppercase tracking-[0.24em] text-violet-300/70">
                Campaign Brief
              </label>
              <textarea
                id="brief-mb41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-3 min-h-24 w-full resize-y rounded-2xl border border-violet-400/20 bg-black/30 p-4 text-sm leading-relaxed text-violet-50 outline-none transition-colors focus:border-violet-300/60 focus:ring-3 focus:ring-violet-300/20"
              />
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-violet-400/20 bg-white/[0.04] p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-violet-300/70">模拟指标</div>
              <div className="mt-4 space-y-3">
                <Metric label="Reach" value={`${reach}K`} pct={Math.min(reach / 10, 100)} />
                <Metric label="CTR" value={`${ctr}%`} pct={Math.min(ctr * 18, 100)} />
                <Metric label="Conversion" value={`${conversion}%`} pct={Math.min(conversion * 28, 100)} />
              </div>
            </section>

            <section className="rounded-3xl border border-violet-400/20 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Layers3 className="size-4 text-violet-300" /> 动效控件
              </div>
              <Group label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Group label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Group label="语气" options={tones} value={tone} onChange={setTone} />
              <Group label="缓动" options={easings} value={easing} onChange={setEasing} />
            </section>

            <section className="rounded-3xl border border-violet-400/20 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Activity className="size-4 text-violet-300" /> 最近活动
              </div>
              <ul className="mt-3 space-y-2">
                {events.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="flex items-center gap-2 rounded-xl border border-violet-400/10 bg-black/20 px-3 py-2 text-xs text-violet-100/80"
                  >
                    <span className="size-1.5 rounded-full bg-violet-300" />
                    {entry}
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

function Metric({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-violet-200/80">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-violet-400/20">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-300 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Group({
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
    <div className="mt-3">
      <div className="mb-1.5 text-[11px] text-violet-300/70">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-violet-300/40 ${
              value === option
                ? "border-violet-300/60 bg-violet-500/25 text-white"
                : "border-violet-400/20 text-violet-200/80 hover:border-violet-300/50 hover:bg-violet-400/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
