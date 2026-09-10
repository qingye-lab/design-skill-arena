"use client"

import { useState } from "react"
import { Check, CircleAlert, Loader2, MoveDown } from "lucide-react"

type FieldId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-skill + taste-skill"

const fields: {
  id: FieldId
  title: string
  caption: string
  field: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    title: "晨间光",
    caption: "把产品放在一天开始的时刻，光线就是主角。",
    field: "from-[#cfd9c9] via-[#e4e8dc] to-[#f2efe7]",
    reach: 858,
    ctr: 4.5,
    conversion: 3.1,
  },
  {
    id: "B",
    title: "午后窗",
    caption: "一个安静的角落，声音代替了视觉的存在感。",
    field: "from-[#e6dcc7] via-[#efe7d6] to-[#f7f3ea]",
    reach: 826,
    ctr: 4.8,
    conversion: 3.4,
  },
  {
    id: "C",
    title: "夜灯下",
    caption: "低照度场景，强调夜间模式与不打扰。",
    field: "from-[#b9c3bd] via-[#cdd6cf] to-[#e6e9e2]",
    reach: 894,
    ctr: 4.2,
    conversion: 3.0,
  },
]

const audiences = ["生活方式人群", "家居爱好者", "安静派用户", "设计审美人群"]
const channels = ["品牌视觉", "杂志内页", "社交媒体", "线下陈列"]
const tones = ["安静", "松弛", "温暖", "留白"]
const palettes = ["鼠尾草绿", "亚麻米", "雾霾蓝", "燕麦灰"]

type Phase = "idle" | "loading" | "success" | "error"

export default function VisualTasteShowcase() {
  const [brief, setBrief] = useState(
    "用一组安静的视觉完成 Aurora X1 的发布，画面里尽量不出现文字堆砌，让产品和光自己说话。"
  )
  const [fieldId, setFieldId] = useState<FieldId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [palette, setPalette] = useState(palettes[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [open, setOpen] = useState(true)

  const field = fields.find((item) => item.id === fieldId) ?? fields[0]
  const reach = Math.round(field.reach * (palette === "鼠尾草绿" ? 1.02 : 1))
  const ctr = Number((field.ctr * (tone === "留白" ? 1.02 : 1)).toFixed(1))
  const conversion = Number((field.conversion * (channel === "品牌视觉" ? 1.03 : 1)).toFixed(1))

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.09 ? "error" : "success"), 1250)
  }

  return (
    <div className="min-h-screen bg-[#f3f2ed] text-[#2c2e2a]">
      <div className="mx-auto max-w-[1240px] px-6 py-10 md:px-10 md:py-14">
        <header className="flex flex-wrap items-center justify-between gap-3 text-[11px] tracking-wide text-[#7d8177]">
          <div className="flex flex-wrap items-center gap-3">
            <span>{MODEL}</span>
            <span>{SKILL}</span>
          </div>
          <span>Visual + Taste</span>
        </header>

        <div
          className={`relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br ${field.field} transition-all duration-700`}
        >
          <div className="flex min-h-[52vh] flex-col justify-between p-8 md:min-h-[62vh] md:p-14">
            <div className="flex items-start justify-between">
              <span className="rounded-full bg-white/60 px-3 py-1 text-[11px] tracking-wide backdrop-blur">
                {channel} · {palette}
              </span>
              <span className="text-[11px] tracking-wide text-[#5f6459]">0{field.id}</span>
            </div>

            <div className="max-w-xl">
              <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-[#22241f] md:text-6xl">
                {field.title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#4d5149] md:text-base">{field.caption}</p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex gap-4 text-[11px] tracking-wide text-[#5f6459]">
                <span>Reach {reach}K</span>
                <span>CTR {ctr}%</span>
                <span>Conv {conversion}%</span>
              </div>
              <MoveDown className="size-4 text-[#5f6459]" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {fields.map((item) => {
            const active = item.id === fieldId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFieldId(item.id)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-2xl border p-2 pr-4 text-left transition-colors focus-visible:ring-3 focus-visible:ring-[#5f6459]/30 ${
                  active ? "border-[#2c2e2a] bg-white" : "border-transparent bg-white/50 hover:bg-white"
                }`}
              >
                <span className={`size-10 rounded-xl bg-gradient-to-br ${item.field}`} />
                <span className="text-xs">
                  <span className="block font-medium">{item.id} · {item.title}</span>
                  <span className="text-[#7d8177]">{item.id === "A" ? "主推" : "备选"}</span>
                </span>
                {active && <Check className="size-3.5 text-[#4a6a4d]" />}
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generate}
            disabled={phase === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-[#2c2e2a] px-5 py-2.5 text-sm text-[#f3f2ed] transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-[#5f6459]/30 disabled:opacity-60"
          >
            {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : null} 生成
          </button>
          <button
            type="button"
            onClick={() => setPhase("success")}
            className="rounded-full border border-[#cdcdc4] px-5 py-2.5 text-sm transition-colors hover:bg-white focus-visible:ring-3 focus-visible:ring-[#5f6459]/30"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => setPhase("success")}
            className="rounded-full border border-[#cdcdc4] px-5 py-2.5 text-sm transition-colors hover:bg-white focus-visible:ring-3 focus-visible:ring-[#5f6459]/30"
          >
            导出
          </button>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full px-5 py-2.5 text-sm text-[#7d8177] transition-colors hover:text-[#2c2e2a]"
          >
            {open ? "收起控件" : "展开控件"}
          </button>
        </div>

        {phase === "success" && (
          <p className="mt-4 flex items-center gap-2 text-sm text-[#4a6a4d]">
            <Check className="size-4" /> 已生成 {field.title} 方向的静帧与动效草图。
          </p>
        )}
        {phase === "error" && (
          <p className="mt-4 flex items-center gap-2 text-sm text-[#9a5140]">
            <CircleAlert className="size-4" /> 生成失败：画面留白过多导致主体不清晰，请补充一句说明。
          </p>
        )}

        {open && (
          <div className="mt-8 grid gap-6 rounded-3xl border border-[#e2e1d8] bg-white/70 p-6 backdrop-blur md:grid-cols-2 lg:grid-cols-4">
            <Quiet label="受众" options={audiences} value={audience} onChange={setAudience} />
            <Quiet label="渠道" options={channels} value={channel} onChange={setChannel} />
            <Quiet label="语气" options={tones} value={tone} onChange={setTone} />
            <Quiet label="视觉风格" options={palettes} value={palette} onChange={setPalette} />
          </div>
        )}

        <section className="mt-8">
          <label htmlFor="brief-vt41" className="text-[11px] tracking-wide text-[#7d8177]">
            Campaign Brief
          </label>
          <textarea
            id="brief-vt41"
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            className="mt-3 min-h-24 w-full resize-y rounded-3xl border border-[#e2e1d8] bg-white/70 p-5 text-sm leading-loose outline-none transition-colors focus:border-[#5f6459] focus:ring-3 focus:ring-[#5f6459]/15"
          />
        </section>

        <section className="mt-10">
          <h2 className="text-[11px] tracking-wide text-[#7d8177]">最近活动</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {["选光", "布景", "调色", "导出静帧"].map((item, index) => (
              <li
                key={item}
                className={`rounded-full px-3.5 py-1.5 text-xs ${
                  index === 0 ? "bg-[#2c2e2a] text-[#f3f2ed]" : "bg-white/70 text-[#5f6459]"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function Quiet({
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
    <div>
      <div className="text-[11px] tracking-wide text-[#7d8177]">{label}</div>
      <div className="mt-2 space-y-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-[#5f6459]/30 ${
              value === option ? "bg-[#2c2e2a] text-[#f3f2ed]" : "text-[#5f6459] hover:bg-[#f2f1ea]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
