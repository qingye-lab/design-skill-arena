"use client"

import { useState } from "react"
import {
  Check,
  CircleAlert,
  Gauge,
  Loader2,
  Maximize2,
  Save,
  Share2,
  Sparkles,
  Volume2,
} from "lucide-react"

type SceneId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-skill + impeccable"

const scenes: {
  id: SceneId
  title: string
  script: string
  beat: string
  gradient: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    title: "开场：一束光",
    script: "画面从全黑开始，一束暖光扫过音箱的表面纹理。",
    beat: "00:00 – 00:06",
    gradient: "from-[#1b2436] via-[#26334a] to-[#0e131d]",
    reach: 892,
    ctr: 4.6,
    conversion: 3.2,
  },
  {
    id: "B",
    title: "中段：一次对话",
    script: "镜头跟随人物在房间中移动，声音始终保持在正前方。",
    beat: "00:06 – 00:18",
    gradient: "from-[#2a2338] via-[#3b2f4d] to-[#14101d]",
    reach: 856,
    ctr: 4.9,
    conversion: 3.5,
  },
  {
    id: "C",
    title: "收束：一句承诺",
    script: "画面定格在产品标识上，字幕浮现：不打扰，才听得清。",
    beat: "00:18 – 00:24",
    gradient: "from-[#1d2c2a] via-[#27403c] to-[#0d1614]",
    reach: 924,
    ctr: 4.3,
    conversion: 3.0,
  },
]

const audiences = ["都市中产", "影音爱好者", "品牌关注者", "视频用户"]
const channels = ["品牌影片", "影院前贴", "信息流", "官网首屏"]
const tones = ["电影感", "冷静旁白", "克制抒情", "强势节奏"]
const grades = ["青橙对比", "冷蓝夜景", "自然中性", "高对比黑白"]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualImpeccableShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 拍一支 24 秒的品牌短片，用光影和空间讲述声音如何留在房间里，文案尽量少。"
  )
  const [sceneId, setSceneId] = useState<SceneId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [grade, setGrade] = useState(grades[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [muted, setMuted] = useState(false)
  const [saved, setSaved] = useState(false)

  const scene = scenes.find((item) => item.id === sceneId) ?? scenes[0]
  const reach = Math.round(scene.reach * (channel === "影院前贴" ? 1.06 : 1))
  const ctr = Number((scene.ctr * (tone === "强势节奏" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((scene.conversion * (grade === "青橙对比" ? 1.02 : 1)).toFixed(1))

  function render() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.1 ? "error" : "success"), 1350)
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100">
      <div className="mx-auto max-w-[1460px] px-3 py-4 md:px-6 md:py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-black">{MODEL}</span>
            <span className="rounded-md border border-white/15 px-2.5 py-1 font-mono text-[11px] text-slate-400">
              {SKILL}
            </span>
            <span className="text-[11px] text-slate-500">Visual + Impeccable · Film Surface</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((prev) => !prev)}
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-3 focus-visible:ring-white/25"
              aria-label={muted ? "开启声音" : "静音"}
            >
              <Volume2 className={`size-4 ${muted ? "opacity-40" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-3 focus-visible:ring-white/25"
              aria-label="保存"
            >
              {saved ? <Check className="size-4 text-emerald-400" /> : <Save className="size-4" />}
            </button>
            <button
              type="button"
              onClick={render}
              disabled={phase === "loading"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/40 disabled:opacity-60"
            >
              {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 渲染
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${scene.gradient}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(400px circle at 70% 30%, rgba(255,255,255,0.18), transparent 60%)",
              }}
            />
            <div className="relative flex min-h-[46vh] flex-col justify-between p-6 md:min-h-[62vh] md:p-10">
              <div className="flex items-start justify-between text-[11px] text-slate-300/70">
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 backdrop-blur">
                  {scene.beat}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur transition-colors hover:bg-white/10"
                  aria-label="全屏预览"
                >
                  <Maximize2 className="size-3.5" />
                </button>
              </div>
              <div className="max-w-xl">
                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Scene {scene.id}</div>
                <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">{scene.title}</h1>
                <p className="mt-4 text-sm leading-relaxed text-slate-300/80">{scene.script}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/40"
                >
                  播放预览
                </button>
                <span className="text-[11px] text-slate-400">
                  {channel} · {grade}
                </span>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Shot List</h2>
              <div className="mt-3 space-y-2">
                {scenes.map((item) => {
                  const active = item.id === sceneId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSceneId(item.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors focus-visible:ring-3 focus-visible:ring-white/25 ${
                        active ? "border-white/40 bg-white/10" : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <span className={`size-11 shrink-0 rounded-lg bg-gradient-to-br ${item.gradient}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{item.id} · {item.title}</span>
                        <span className="block text-[11px] text-slate-500">{item.beat}</span>
                      </span>
                      {active && <Check className="size-4 shrink-0 text-emerald-400" />}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h2 className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                <Gauge className="size-3.5" /> Simulated Metrics
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Cell label="Reach" value={`${reach}K`} />
                <Cell label="CTR" value={`${ctr}%`} />
                <Cell label="Conv" value={`${conversion}%`} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Inspector</h2>
              <Chips label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Chips label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Chips label="语气" options={tones} value={tone} onChange={setTone} />
              <Chips label="调色" options={grades} value={grade} onChange={setGrade} />
            </section>

            {phase === "error" && (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                <CircleAlert className="mt-0.5 size-4 shrink-0" /> 渲染失败：短片时长超出媒体位限制，请压缩中段。
              </div>
            )}
            {phase === "success" && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <Check className="size-4" /> {scene.title} 已渲染完成，可导出 4K 母版。
              </div>
            )}

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Recent</h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 transition-colors hover:text-white"
                >
                  <Share2 className="size-3" /> 分享
                </button>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                {["Aurora X1 24s 母版", "Aurora X1 竖版 9:16", "发布会开场片头"].map((item, index) => (
                  <li key={item} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 transition-colors hover:bg-white/5">
                    <span>{item}</span>
                    <span className="text-slate-600">{index === 0 ? "渲染中" : "已完成"}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <label htmlFor="brief-vi41" className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Campaign Brief
              </label>
              <textarea
                id="brief-vi41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-3 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/40 p-3 text-sm leading-relaxed text-slate-200 outline-none transition-colors focus:border-white/40 focus:ring-3 focus:ring-white/10"
              />
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 px-2 py-3">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

function Chips({
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
      <div className="mb-1.5 text-[11px] text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-white/25 ${
              value === option
                ? "border-white/60 bg-white text-black"
                : "border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
