"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  Check,
  Crown,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react"

type EditId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-skill + taste-skill + impeccable"

const edits: {
  id: EditId
  name: string
  tone: string
  canvas: string
  accent: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "午夜鎏金",
    tone: "深色大片，金色作唯一高光",
    canvas: "from-[#12100c] via-[#1b1710] to-[#0a0906]",
    accent: "text-amber-200",
    reach: 908,
    ctr: 4.6,
    conversion: 3.2,
  },
  {
    id: "B",
    name: "晨曦琥珀",
    tone: "暖调柔光，高级而不张扬",
    canvas: "from-[#1c1710] via-[#241d13] to-[#120e08]",
    accent: "text-orange-200",
    reach: 872,
    ctr: 4.9,
    conversion: 3.5,
  },
  {
    id: "C",
    name: "极夜白银",
    tone: "冷调金属质感，克制而锋利",
    canvas: "from-[#0f1113] via-[#171a1d] to-[#090b0d]",
    accent: "text-zinc-200",
    reach: 936,
    ctr: 4.3,
    conversion: 3.1,
  },
]

const audiences = ["高净值人群", "品牌会员", "设计人群", "收藏爱好者"]
const channels = ["品牌官网", "旗舰店屏幕", "会员邮件", "时尚媒体"]
const tones = ["奢华", "低调", "冷峻", "优雅"]
const finishes = ["鎏金哑光", "陶瓷亮面", "拉丝金属", "磨砂皮革"]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualPremiumChainShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 特别版打造一次高奢感的发布传播，画面极简但质感极强，突出材质与工艺。"
  )
  const [editId, setEditId] = useState<EditId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [finish, setFinish] = useState(finishes[0])
  const [zoom, setZoom] = useState(100)
  const [phase, setPhase] = useState<Phase>("idle")
  const [saved, setSaved] = useState(false)

  const edit = edits.find((item) => item.id === editId) ?? edits[0]
  const reach = Math.round(edit.reach * (channel === "旗舰店屏幕" ? 1.05 : 1))
  const ctr = Number((edit.ctr * (tone === "奢华" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((edit.conversion * (finish === "鎏金哑光" ? 1.02 : 1)).toFixed(1))

  function render() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.1 ? "error" : "success"), 1400)
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full border border-amber-200/40 text-amber-200">
              <Crown className="size-4" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium tracking-wide">{MODEL}</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                  {SKILL}
                </span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-zinc-600">Visual Premium Chain</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-1">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(60, prev - 10))}
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-amber-200/30"
                aria-label="缩小预览"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-12 text-center font-mono text-[11px] tabular-nums text-zinc-400">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(140, prev + 10))}
                className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-amber-200/30"
                aria-label="放大预览"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={render}
              disabled={phase === "loading"}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-amber-100/50 disabled:opacity-60"
            >
              {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
            </button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section
            className={`relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br ${edit.canvas}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(500px circle at 25% 20%, rgba(255,215,150,0.22), transparent 60%), radial-gradient(400px circle at 80% 85%, rgba(255,255,255,0.08), transparent 55%)",
              }}
            />
            <div
              className="relative flex min-h-[50vh] flex-col justify-between gap-8 p-6 transition-transform duration-500 md:min-h-[66vh] md:p-12"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
            >
              <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                <span>Special Edition</span>
                <span>{finish}</span>
              </div>

              <div className="max-w-2xl">
                <h1 className="text-4xl font-light leading-[1.06] tracking-tight md:text-6xl">
                  光落在
                  <span className={`font-normal ${edit.accent}`}>金属边缘</span>
                  的那一刻
                </h1>
                <p className="mt-6 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base">{edit.tone}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-white/50"
                  >
                    预约品鉴 <ArrowUpRight className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-white/30"
                  >
                    {saved ? <Check className="size-4 text-emerald-400" /> : null} 保存
                  </button>
                  <span className="text-[11px] text-zinc-500">
                    {channel} · 面向 {audience}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-16 rounded-2xl border border-white/8 bg-white/[0.03] transition-colors hover:border-white/20 md:h-24"
                    style={{ opacity: 1 - index * 0.25 }}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Simulated Metrics</h2>
              <div className="mt-4 space-y-3">
                <Row label="Reach" value={`${reach}K`} />
                <Row label="CTR" value={`${ctr}%`} />
                <Row label="Conversion" value={`${conversion}%`} />
              </div>
            </section>

            <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Edits</h2>
              <div className="mt-3 space-y-2">
                {edits.map((item) => {
                  const active = item.id === editId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEditId(item.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-amber-200/30 ${
                        active ? "border-amber-200/50 bg-amber-200/10 text-amber-100" : "border-white/8 hover:border-white/25"
                      }`}
                    >
                      {item.id} · {item.name}
                      {active && <Check className="size-4" />}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <h2 className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Inspector</h2>
              <Opt label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Opt label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Opt label="语气" options={tones} value={tone} onChange={setTone} />
              <Opt label="材质" options={finishes} value={finish} onChange={setFinish} />
            </section>

            {phase === "error" && (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-400/25 bg-rose-500/10 p-3 text-xs text-rose-200">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" /> 渲染失败：材质贴图缺失，请重新选择材质。
              </div>
            )}
            {phase === "success" && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <Check className="size-4" /> {edit.name} 已生成，可导出 6K 静帧。
              </div>
            )}

            <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">Recent</h2>
                <button
                  type="button"
                  onClick={() => {
                    setPhase("idle")
                    setZoom(100)
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-500 transition-colors hover:text-white"
                >
                  <RotateCcw className="size-3" /> 重置
                </button>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
                {["Special Edition 6K", "Vertical 9:16", "Flagship Screen Loop"].map((item, index) => (
                  <li key={item} className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2">
                    <span>{item}</span>
                    <span className="text-zinc-600">{index === 0 ? "最新" : "已归档"}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-white/8 bg-white/[0.03] p-5">
              <label htmlFor="brief-vp41" className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Campaign Brief
              </label>
              <textarea
                id="brief-vp41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-3 min-h-24 w-full resize-y rounded-2xl border border-white/8 bg-black/40 p-3 text-sm leading-relaxed text-zinc-200 outline-none transition-colors focus:border-amber-200/50 focus:ring-3 focus:ring-amber-200/15"
              />
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-xl font-light tracking-tight text-white">{value}</span>
    </div>
  )
}

function Opt({
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
      <div className="mb-1.5 text-[11px] text-zinc-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-amber-200/30 ${
              value === option
                ? "border-amber-200/50 bg-amber-200/15 text-amber-100"
                : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
