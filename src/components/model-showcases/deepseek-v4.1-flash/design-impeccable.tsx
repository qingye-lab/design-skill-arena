"use client"

import { useState } from "react"
import { AlertOctagon, Check, Loader2 } from "lucide-react"

type SetId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-design + impeccable"

const sets: {
  id: SetId
  label: string
  rule: string
  split: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    label: "Hard Rule",
    rule: "所有间距是 8 的倍数，所有边框 1px 纯黑。",
    split: "50 / 50",
    reach: 886,
    ctr: 4.5,
    conversion: 3.1,
  },
  {
    id: "B",
    label: "Wide Column",
    rule: "左侧只放标题与主张，右侧承载全部信息。",
    split: "38 / 62",
    reach: 842,
    ctr: 4.9,
    conversion: 3.4,
  },
  {
    id: "C",
    label: "Table First",
    rule: "以表格结构呈现，对照行列阅读。",
    split: "62 / 38",
    reach: 918,
    ctr: 4.2,
    conversion: 3.0,
  },
]

const audiences = ["研究型用户", "采购决策", "技术评审", "媒体"]
const channels = ["专题页", "白皮书", "发布会投屏", "直邮"]
const tones = ["断言式", "中立", "数据驱动", "极简"]
const weights = ["Regular", "Medium", "Bold", "Black"]

type Phase = "idle" | "loading" | "success" | "error"

export default function DesignImpeccableShowcase() {
  const [brief, setBrief] = useState(
    "用瑞士式栅格发布 Aurora X1：所有信息对齐在同一套行列里，删掉所有装饰，只保留可比对的事实。"
  )
  const [setId, setSetId] = useState<SetId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [weight, setWeight] = useState(weights[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [saved, setSaved] = useState(false)

  const set = sets.find((item) => item.id === setId) ?? sets[0]
  const reach = Math.round(set.reach * (channel === "发布会投屏" ? 1.04 : 1))
  const ctr = Number((set.ctr * (tone === "数据驱动" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((set.conversion * (weight === "Bold" ? 1.02 : 1)).toFixed(1))

  function run() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.1 ? "error" : "success"), 1100)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-[1360px] border-x border-black px-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black px-5 py-4 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-black px-2.5 py-1 text-xs font-bold text-white">{MODEL}</span>
            <span className="font-mono text-[11px] uppercase tracking-widest">{SKILL}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest">Design + Impeccable</span>
        </header>

        <div className="grid lg:grid-cols-[38fr_62fr]">
          <div className="border-b border-black p-5 md:p-8 lg:border-b-0 lg:border-r">
            <div className="font-mono text-[11px] uppercase tracking-widest">Section 01 / Claim</div>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tighter md:text-6xl">
              事实
              <br />
              比形容词
              <br />
              更有说服力。
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed">
              这套页面不使用渐变、阴影、圆角。所有元素对齐在同一套 8px 栅格，所有数字使用等宽字体。
            </p>

            <div className="mt-8 border-t border-black pt-5">
              <label htmlFor="brief-di41" className="font-mono text-[11px] uppercase tracking-widest">
                Campaign Brief
              </label>
              <textarea
                id="brief-di41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-3 min-h-28 w-full resize-y border border-black bg-white p-3 text-sm leading-relaxed outline-none transition-colors focus:bg-neutral-50 focus:ring-2 focus:ring-red-600"
              />
              <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest">
                <span>Plain text</span>
                <span>{brief.length} chars</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-0 border-t border-black">
              <Swiss label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Swiss label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Swiss label="语气" options={tones} value={tone} onChange={setTone} />
              <Swiss label="字重" options={weights} value={weight} onChange={setWeight} />
            </div>
          </div>

          <div className="p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black pb-4">
              <div className="flex gap-0">
                {sets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSetId(item.id)}
                    aria-pressed={item.id === setId}
                    className={`border border-black px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-red-600 ${
                      item.id === setId ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
                    } ${item.id !== "A" ? "-ml-px" : ""}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={run}
                  disabled={phase === "loading"}
                  className="inline-flex items-center gap-1.5 bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60"
                >
                  {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : null} 生成
                </button>
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  className="border border-black px-4 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  {saved ? "已保存" : "保存"}
                </button>
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  className="border border-black px-4 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  导出
                </button>
              </div>
            </div>

            {phase === "error" && (
              <div className="mt-4 flex items-center gap-2 border border-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertOctagon className="size-4" /> 生成失败：存在未对齐元素，请检查 8px 栅格约束。
              </div>
            )}
            {phase === "success" && (
              <div className="mt-4 flex items-center gap-2 border border-black bg-neutral-100 px-3 py-2 text-sm">
                <Check className="size-4" /> 栅格校验通过，共 0 处越界。
              </div>
            )}

            <div className="mt-6 border border-black">
              <div className="flex items-center justify-between border-b border-black px-4 py-2 font-mono text-[11px] uppercase tracking-widest">
                <span>Campaign / {channel}</span>
                <span>{set.split}</span>
              </div>
              <div className="grid md:grid-cols-[1.2fr_1fr]">
                <div className="border-b border-black p-6 md:border-b-0 md:border-r">
                  <div className="font-mono text-[11px] uppercase tracking-widest">Headline</div>
                  <div className="mt-4 text-3xl font-black leading-[1.05] tracking-tighter md:text-4xl">
                    {set.rule}
                  </div>
                  <div className="mt-6 inline-flex border border-black px-4 py-2 text-sm font-medium">
                    查看全部规格
                  </div>
                </div>
                <div className="divide-y divide-black">
                  {[
                    ["拾音半径", "8 m"],
                    ["离线响应", "80 ms"],
                    ["同时发言", "12 人"],
                    ["重量", "1.2 kg"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span>{label}</span>
                      <span className="font-mono tabular-nums">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-black border-t border-black">
                <Figure label="Reach" value={`${reach}K`} />
                <Figure label="CTR" value={`${ctr}%`} />
                <Figure label="Conversion" value={`${conversion}%`} />
              </div>
            </div>

            <div className="mt-6">
              <div className="font-mono text-[11px] uppercase tracking-widest">Recent Activity</div>
              <table className="mt-3 w-full border border-black text-left text-sm">
                <thead>
                  <tr className="border-b border-black bg-neutral-100 font-mono text-[10px] uppercase tracking-widest">
                    <th className="px-3 py-2 font-normal">Revision</th>
                    <th className="px-3 py-2 font-normal">Change</th>
                    <th className="px-3 py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["r12", "收紧行距与字重", "已发布"],
                    ["r11", "统一数字格式为等宽", "已发布"],
                    ["r10", "删除全部阴影", "已发布"],
                    ["r09", "补齐错误状态", "草稿"],
                  ].map(([rev, change, status]) => (
                    <tr key={rev} className="border-b border-black/20 last:border-0">
                      <td className="px-3 py-2 font-mono">{rev}</td>
                      <td className="px-3 py-2">{change}</td>
                      <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-wide">{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Swiss({
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
    <div className="border-b border-black px-0 py-4 odd:border-r">
      <div className="font-mono text-[10px] uppercase tracking-widest">{label}</div>
      <div className="mt-2 space-y-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`block w-full px-2 py-1 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-red-600 ${
              value === option ? "bg-black text-white" : "hover:bg-neutral-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4">
      <div className="font-mono text-[10px] uppercase tracking-widest">{label}</div>
      <div className="mt-1 font-mono text-2xl font-bold tabular-nums">{value}</div>
    </div>
  )
}
