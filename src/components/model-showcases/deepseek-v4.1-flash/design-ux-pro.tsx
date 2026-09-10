"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Loader2, PenLine, Ruler, Save, Share } from "lucide-react"

type PlanId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-design + ui-ux-pro-max"

const plans: {
  id: PlanId
  name: string
  grid: string
  column: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  { id: "A", name: "12 栏标准", grid: "12 × 8px", column: "1fr / 2fr / 1fr", reach: 880, ctr: 4.4, conversion: 3.1 },
  { id: "B", name: "内容优先", grid: "10 × 6px", column: "2fr / 3fr", reach: 846, ctr: 4.8, conversion: 3.4 },
  { id: "C", name: "展示优先", grid: "8 × 12px", column: "1fr / 1fr", reach: 912, ctr: 4.2, conversion: 2.9 },
]

const audiences = ["产品团队", "设计评审", "工程实现", "市场投放"]
const channels = ["设计稿", "需求文档", "评审会议", "落地页"]
const tones = ["精确", "说明性", "克制", "标准化"]
const annotations = ["标注间距", "标注层级", "标注状态", "标注栅格"]

type Phase = "idle" | "loading" | "success" | "error"

export default function DesignUxProShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 的发布页先画出结构与栅格，确保设计意图在交给工程实现时不会被误解。"
  )
  const [planId, setPlanId] = useState<PlanId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [activeAnnotations, setActiveAnnotations] = useState<string[]>(["标注栅格"])
  const [phase, setPhase] = useState<Phase>("idle")
  const [checked, setChecked] = useState(true)

  const plan = plans.find((item) => item.id === planId) ?? plans[0]
  const reach = Math.round(plan.reach * (channel === "设计稿" ? 1.03 : 1))
  const ctr = Number((plan.ctr * (tone === "精确" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((plan.conversion * (activeAnnotations.length * 0.01 + 1)).toFixed(1))

  function toggleAnnotation(item: string) {
    setActiveAnnotations((prev) =>
      prev.includes(item) ? prev.filter((entry) => entry !== item) : [...prev, item]
    )
  }

  function run() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.1 ? "error" : "success"), 1150)
  }

  return (
    <div className="min-h-screen bg-[#0b1626] text-cyan-50">
      <div
        className="min-h-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/20 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-cyan-400 px-2.5 py-1 text-xs font-bold text-[#0b1626]">{MODEL}</span>
                <span className="rounded border border-cyan-400/30 px-2.5 py-1 font-mono text-[11px] text-cyan-200">
                  {SKILL}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                Design + UX Pro · 结构蓝图
              </h1>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-cyan-300/70">
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="size-3.5" /> {plan.grid}
              </span>
              <span>{plan.column}</span>
            </div>
          </header>

          <div className="mt-6 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-5">
              <section className="rounded-xl border border-cyan-400/20 bg-[#0e1c30]/70 p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">01 / Brief</h2>
                <textarea
                  id="brief-du41"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  className="mt-3 min-h-32 w-full resize-y rounded-lg border border-cyan-400/20 bg-[#08111e] p-3 text-sm leading-relaxed text-cyan-50 outline-none transition-colors focus:border-cyan-400/60 focus:ring-3 focus:ring-cyan-400/15"
                />
                <div className="mt-2 flex justify-between font-mono text-[10px] text-cyan-300/50">
                  <span>结构化输入</span>
                  <span>{brief.length} 字</span>
                </div>
              </section>

              <section className="rounded-xl border border-cyan-400/20 bg-[#0e1c30]/70 p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">02 / 栅格方案</h2>
                <div className="mt-3 space-y-2">
                  {plans.map((item) => {
                    const active = item.id === planId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPlanId(item.id)}
                        aria-pressed={active}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-cyan-400/30 ${
                          active ? "border-cyan-400 bg-cyan-400/15 text-white" : "border-cyan-400/15 hover:border-cyan-400/40"
                        }`}
                      >
                        <span>{item.id} · {item.name}</span>
                        <span className="font-mono text-[10px] text-cyan-300/70">{item.grid}</span>
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-xl border border-cyan-400/20 bg-[#0e1c30]/70 p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">03 / 参数</h2>
                <Param label="受众" options={audiences} value={audience} onChange={setAudience} />
                <Param label="渠道" options={channels} value={channel} onChange={setChannel} />
                <Param label="语气" options={tones} value={tone} onChange={setTone} />
              </section>

              <section className="rounded-xl border border-cyan-400/20 bg-[#0e1c30]/70 p-5">
                <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">04 / 标注</h2>
                <div className="mt-3 space-y-2">
                  {annotations.map((item) => {
                    const active = activeAnnotations.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAnnotation(item)}
                        aria-pressed={active}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-cyan-400/10 focus-visible:ring-3 focus-visible:ring-cyan-400/30"
                      >
                        <span
                          className={`flex size-4 items-center justify-center rounded border ${
                            active ? "border-cyan-400 bg-cyan-400 text-[#0b1626]" : "border-cyan-400/40"
                          }`}
                        >
                          {active && <CheckCircle2 className="size-3" />}
                        </span>
                        {item}
                      </button>
                    )
                  })}
                </div>
              </section>
            </aside>

            <main>
              <section className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-[#0e1c30]/60 p-5 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">
                    Campaign Preview · {channel}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={run}
                      disabled={phase === "loading"}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3.5 py-2 text-sm font-semibold text-[#0b1626] transition-colors hover:bg-cyan-300 focus-visible:ring-3 focus-visible:ring-cyan-200/40 disabled:opacity-60"
                    >
                      {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <PenLine className="size-4" />} 生成
                    </button>
                    <button
                      type="button"
                      onClick={() => setChecked(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 px-3.5 py-2 text-sm transition-colors hover:bg-cyan-400/10 focus-visible:ring-3 focus-visible:ring-cyan-400/30"
                    >
                      <Save className="size-4" /> 保存
                    </button>
                    <button
                      type="button"
                      onClick={() => setChecked(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 px-3.5 py-2 text-sm transition-colors hover:bg-cyan-400/10 focus-visible:ring-3 focus-visible:ring-cyan-400/30"
                    >
                      <Share className="size-4" /> 导出
                    </button>
                  </div>
                </div>

                <div className="relative mt-6">
                  <div className="absolute -left-2 top-0 h-full w-3 border-y border-l border-cyan-400/40" />
                  <div className="absolute -bottom-2 left-0 h-3 w-full border-x border-b border-cyan-400/40" />
                  <div className="rounded-lg border border-cyan-400/30 bg-[#08111e] p-6 md:p-10">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded border border-dashed border-cyan-400/40 bg-cyan-400/5 p-4">
                        <div className="text-[10px] uppercase tracking-widest text-cyan-300/60">Hero</div>
                        <div className="mt-2 text-lg font-semibold leading-snug text-white">
                          声音，应该留在它该在的地方
                        </div>
                        <div className="mt-3 h-1.5 rounded-full bg-cyan-400/30" />
                        <div className="mt-2 h-1.5 w-2/3 rounded-full bg-cyan-400/20" />
                      </div>
                      <div className="rounded border border-dashed border-cyan-400/40 bg-cyan-400/5 p-4">
                        <div className="text-[10px] uppercase tracking-widest text-cyan-300/60">Specs</div>
                        <div className="mt-2 space-y-2">
                          {["拾音半径", "响应延迟", "声场覆盖"].map((label) => (
                            <div key={label} className="flex items-center justify-between rounded bg-[#0b1626] px-2 py-1.5 text-xs">
                              <span className="text-cyan-200/70">{label}</span>
                              <span className="font-mono text-cyan-100">—</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded border border-dashed border-cyan-400/40 bg-cyan-400/5 p-4">
                        <div className="text-[10px] uppercase tracking-widest text-cyan-300/60">States</div>
                        <div className="mt-2 space-y-2 text-xs">
                          <div className="rounded bg-[#0b1626] px-2 py-1.5 text-cyan-200/70">默认</div>
                          <div className="rounded bg-cyan-400/20 px-2 py-1.5 text-cyan-100">选中</div>
                          <div className="rounded bg-[#0b1626] px-2 py-1.5 text-cyan-200/70">悬停 / 焦点</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeAnnotations.map((item, index) => (
                    <span
                      key={item}
                      className="absolute hidden rounded bg-cyan-400 px-2 py-0.5 font-mono text-[10px] text-[#0b1626] md:inline-block"
                      style={{ top: `${-14 - index * 22}px`, left: `${index * 110}px` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Metric label="Reach" value={`${reach}K`} />
                  <Metric label="CTR" value={`${ctr}%`} />
                  <Metric label="Conversion" value={`${conversion}%`} />
                </div>

                {phase === "error" && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
                    <AlertTriangle className="size-4" /> 生成失败：栅格与标注冲突，请先关闭部分标注再重试。
                  </div>
                )}
                {phase === "success" && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
                    <CheckCircle2 className="size-4" /> 蓝图已生成，可直接进入实现阶段。
                  </div>
                )}
              </section>

              <section className="mt-5 rounded-xl border border-cyan-400/20 bg-[#0e1c30]/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-mono text-[11px] uppercase tracking-widest text-cyan-300/70">05 / 交付核对</h2>
                  <button
                    type="button"
                    onClick={() => setChecked((prev) => !prev)}
                    className="font-mono text-[10px] text-cyan-300/70 underline-offset-2 hover:underline"
                  >
                    {checked ? "标记为待确认" : "标记为已确认"}
                  </button>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    "栅格与间距已标注",
                    "响应式断点已定义",
                    "交互状态已覆盖",
                    "错误文案已补齐",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 rounded-lg border border-cyan-400/15 bg-[#08111e] px-3 py-2 text-sm text-cyan-100/80">
                      <CheckCircle2 className={`size-3.5 ${checked ? "text-cyan-400" : "text-cyan-400/30"}`} /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

function Param({
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
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300/60">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded border px-2.5 py-1.5 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-cyan-400/30 ${
              value === option
                ? "border-cyan-400 bg-cyan-400 text-[#0b1626]"
                : "border-cyan-400/20 text-cyan-200/80 hover:border-cyan-400/50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cyan-400/20 bg-[#08111e] px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/60">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}
