"use client"

import { useState } from "react"
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Copy,
  Grid3x3,
  Loader2,
  Plus,
  RotateCcw,
  Sliders,
  Sparkles,
} from "lucide-react"

type PresetId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "shadcn-best-practices / shadcn"

const presets: {
  id: PresetId
  name: string
  density: string
  radius: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  { id: "A", name: "Density / Default", density: "舒适", radius: "8px", reach: 868, ctr: 4.3, conversion: 3.0 },
  { id: "B", name: "Density / Compact", density: "紧凑", radius: "6px", reach: 824, ctr: 4.7, conversion: 3.3 },
  { id: "C", name: "Density / Airy", density: "宽松", radius: "12px", reach: 906, ctr: 4.0, conversion: 2.8 },
]

const inventory = [
  { name: "Button", variants: 5, states: "default / hover / focus / active / disabled" },
  { name: "Card", variants: 3, states: "default / interactive / selected" },
  { name: "Tabs", variants: 2, states: "idle / selected / focus" },
  { name: "Table", variants: 2, states: "default / hover / sorted" },
  { name: "Badge", variants: 4, states: "solid / soft / outline / status" },
]

const audiences = ["增长团队", "产品设计", "前端工程", "品牌市场"]
const channels = ["设计系统文档", "组件市场", "应用内弹窗", "销售物料"]
const tones = ["克制系统化", "说明性", "面向工程", "面向业务"]
const tokenSets = ["Zinc Neutral", "Slate Cool", "Stone Warm", "High Contrast"]

type Phase = "idle" | "loading" | "success" | "error"

export default function ComponentSystemShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 的发布活动建立一套组件化表达规范，让按钮、卡片、表格和徽标在不同渠道保持一致。"
  )
  const [presetId, setPresetId] = useState<PresetId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [tokenSet, setTokenSet] = useState(tokenSets[0])
  const [activeItem, setActiveItem] = useState(inventory[0].name)
  const [phase, setPhase] = useState<Phase>("idle")
  const [copied, setCopied] = useState<string | null>(null)

  const preset = presets.find((item) => item.id === presetId) ?? presets[0]
  const reach = Math.round(preset.reach * (tokenSet === "High Contrast" ? 1.02 : 1))
  const ctr = Number((preset.ctr * (tone === "克制系统化" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((preset.conversion * (channel === "设计系统文档" ? 1.04 : 1)).toFixed(1))

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.1 ? "error" : "success"), 1150)
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-[1420px] px-4 py-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
          <aside className="rounded-xl border border-zinc-200 bg-white">
            <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
              <Grid3x3 className="size-4 text-zinc-400" />
              <span className="text-sm font-semibold">Component Inventory</span>
            </div>
            <ul className="p-2">
              {inventory.map((item) => {
                const active = activeItem === item.name
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setActiveItem(item.name)}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-zinc-900/20 ${
                        active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {item.name}
                      <span className={`text-[11px] ${active ? "text-zinc-300" : "text-zinc-400"}`}>
                        {item.variants} variants
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-zinc-200 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sliders className="size-4 text-zinc-400" /> Variant Preset
              </div>
              <div className="mt-3 space-y-2">
                {presets.map((item) => {
                  const active = item.id === presetId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPresetId(item.id)}
                      aria-pressed={active}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors focus-visible:ring-3 focus-visible:ring-zinc-900/20 ${
                        active ? "border-zinc-900 bg-zinc-100" : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.id}</span>
                        {active && <Check className="size-3.5" />}
                      </div>
                      <div className="mt-0.5 text-zinc-500">{item.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          <main>
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">{MODEL}</span>
                  <span className="rounded-md border border-zinc-300 px-2.5 py-1 font-mono text-[11px] text-zinc-600">
                    {SKILL}
                  </span>
                </div>
                <h1 className="mt-3 text-2xl font-bold">Component System · 组件矩阵</h1>
                <p className="mt-1 text-sm text-zinc-600">
                  用同一套组件覆盖所有渠道，变体与状态都记录在案。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={generate}
                  disabled={phase === "loading"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:ring-3 focus-visible:ring-zinc-900/30 disabled:opacity-60"
                >
                  {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  生成
                </button>
                <button
                  type="button"
                  onClick={() => setCopied("saved")}
                  className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm transition-colors hover:bg-white focus-visible:ring-3 focus-visible:ring-zinc-900/20"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setCopied("exported")}
                  className="rounded-lg border border-zinc-300 px-3.5 py-2 text-sm transition-colors hover:bg-white focus-visible:ring-3 focus-visible:ring-zinc-900/20"
                >
                  导出 tokens
                </button>
              </div>
            </header>

            <section className="mt-5 overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                <span className="text-sm font-semibold">{activeItem} · 变体矩阵</span>
                <span className="text-[11px] text-zinc-500">状态覆盖 100%</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] uppercase tracking-wider text-zinc-500">
                      <th className="px-4 py-2.5 font-medium">Variant</th>
                      <th className="px-4 py-2.5 font-medium">Preview</th>
                      <th className="px-4 py-2.5 font-medium">States</th>
                      <th className="px-4 py-2.5 font-medium">Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Primary", "Secondary", "Outline", "Ghost", "Destructive"].map((variant, index) => (
                      <tr key={variant} className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50">
                        <td className="px-4 py-3 font-medium">{variant}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs ${
                              index === 0
                                ? "bg-zinc-900 text-white"
                                : index === 4
                                  ? "bg-rose-600 text-white"
                                  : index === 2
                                    ? "border border-zinc-300"
                                    : index === 3
                                      ? "text-zinc-600 hover:bg-zinc-100"
                                      : "bg-zinc-100 text-zinc-900"
                            }`}
                            style={{ borderRadius: preset.radius }}
                          >
                            按钮
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">
                          default · hover · focus · disabled
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setCopied(variant)}
                            className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-[11px] text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                          >
                            {copied === variant ? <Check className="size-3" /> : <Copy className="size-3" />}
                            token
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-zinc-200 bg-white p-4">
                <label htmlFor="brief-cs41" className="block text-sm font-semibold">
                  Campaign Brief
                </label>
                <textarea
                  id="brief-cs41"
                  value={brief}
                  onChange={(event) => setBrief(event.target.value)}
                  className="mt-2 min-h-28 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-sm leading-relaxed outline-none transition-colors focus:border-zinc-900 focus:bg-white focus:ring-3 focus:ring-zinc-900/15"
                />
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-sm font-semibold">预览</div>
                <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  {phase === "error" && (
                    <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      生成失败：tokenSet 缺少对比度变量，请切换到 High Contrast。
                    </div>
                  )}
                  {phase === "success" && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                      <BadgeCheck className="size-3.5" /> 组件矩阵已按 {preset.name} 重新生成。
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-white" style={{ borderRadius: preset.radius }}>
                      主行动
                    </span>
                    <span className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs" style={{ borderRadius: preset.radius }}>
                      次行动
                    </span>
                    <span className="rounded-md bg-emerald-100 px-3 py-1.5 text-xs text-emerald-800" style={{ borderRadius: preset.radius }}>
                      {preset.density}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-zinc-300 px-3 py-1.5 text-xs text-zinc-500">
                      <Plus className="size-3" /> add variant
                    </span>
                  </div>
                  <div className="mt-3 text-[11px] text-zinc-500">
                    {channel} · 面向 {audience} · {tone}
                  </div>
                </div>
              </section>
            </div>
          </main>

          <aside className="min-w-0 space-y-4">
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="text-sm font-semibold">模拟指标</div>
              <div className="mt-3 space-y-2">
                <Metric label="Reach" value={`${reach}K`} />
                <Metric label="CTR" value={`${ctr}%`} />
                <Metric label="Conversion" value={`${conversion}%`} />
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                Tokens <ChevronDown className="size-3.5 text-zinc-400" />
              </div>
              <dl className="mt-3 space-y-2 font-mono text-[11px]">
                {[
                  ["--radius", preset.radius],
                  ["--font-ui", "Inter"],
                  ["--space-unit", preset.density === "紧凑" ? "4px" : preset.density === "宽松" ? "8px" : "6px"],
                  ["--palette", tokenSet],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded border border-zinc-100 bg-zinc-50 px-2 py-1.5">
                    <dt className="text-zinc-500">{key}</dt>
                    <dd className="text-zinc-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="text-sm font-semibold">配置</div>
              <Group label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Group label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Group label="语气" options={tones} value={tone} onChange={setTone} />
              <Group label="Token 集" options={tokenSets} value={tokenSet} onChange={setTokenSet} />
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                最近活动
                <button
                  type="button"
                  onClick={() => setCopied(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-normal text-zinc-500 hover:text-zinc-800"
                >
                  <RotateCcw className="size-3" /> 清除提示
                </button>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-600">
                {[
                  { label: "更新 Button token", state: "已同步" },
                  { label: "新增 Card interactive", state: "已同步" },
                  { label: "校对 Table 排序态", state: "待确认" },
                  { label: "导出 tokens.json", state: "已完成" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                    <span>{item.label}</span>
                    <span className="text-[11px] text-zinc-400">{item.state}</span>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <span className="text-sm text-zinc-600">{label}</span>
      <span className="text-base font-bold">{value}</span>
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
      <div className="mb-1.5 text-xs text-zinc-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-zinc-900/20 ${
              value === option
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
