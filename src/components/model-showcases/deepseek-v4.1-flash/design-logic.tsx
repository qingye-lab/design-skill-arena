"use client"

import { useState } from "react"
import { ArrowUpRight, CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react"

type SectionId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-design"

const sections: {
  id: SectionId
  index: string
  name: string
  thesis: string
  body: string
  proof: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    index: "01",
    name: "命题",
    thesis: "新品不是功能清单，而是一次立场声明。",
    body: "把 Aurora X1 的远场拾音写成一种态度：对话不该被打断，会议不该重复第二遍。",
    proof: "以三段式结构展开：命题、证据、行动。",
    reach: 884,
    ctr: 4.3,
    conversion: 2.9,
  },
  {
    id: "B",
    index: "02",
    name: "证据",
    thesis: "让参数自己说话，但要说人话。",
    body: "80ms 离线响应、6 麦克风阵列、360° 声场，全部翻译成可感知的日常结果。",
    proof: "每个数字后面必须跟一句生活场景。",
    reach: 826,
    ctr: 4.7,
    conversion: 3.2,
  },
  {
    id: "C",
    index: "03",
    name: "行动",
    thesis: "把决定权交还给读者。",
    body: "结尾不做催促，只给一个明确的下一步和一条可验证的承诺。",
    proof: "CTA 与承诺条款并列呈现。",
    reach: 901,
    ctr: 3.9,
    conversion: 3.0,
  },
]

const audiences = ["理性决策者", "产品经理", "设计从业者", "技术媒体"]
const channels = ["长文专题", "行业媒体", "Newsletter", "播客联名"]
const tones = ["克制陈述", "锋芒论述", "平实解释", "冷峻数据"]
const systems = ["铅字灰", "档案棕", "蓝图青", "极简黑白"]

type Phase = "idle" | "loading" | "success" | "error"

export default function DesignLogicShowcase() {
  const [brief, setBrief] = useState(
    "把 Aurora X1 的新品发布写成一篇有观点的行业长文，用结构代替形容词，用证据代替修辞。"
  )
  const [sectionId, setSectionId] = useState<SectionId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [system, setSystem] = useState(systems[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [checked, setChecked] = useState<string[]>(["命题已确立", "证据已归类"])
  const [saved, setSaved] = useState(false)

  const section = sections.find((item) => item.id === sectionId) ?? sections[0]

  const density = tone === "冷峻数据" ? 1.04 : tone === "平实解释" ? 1.01 : 1
  const reach = Math.round(section.reach * (channel === "长文专题" ? 1.05 : 1))
  const ctr = Number((section.ctr * density).toFixed(1))
  const conversion = Number((section.conversion * (system === "蓝图青" ? 1.03 : 1)).toFixed(1))

  function run() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => {
      const failed = Math.random() < 0.1
      setPhase(failed ? "error" : "success")
      if (!failed) {
        setChecked((prev) =>
          prev.includes("结构已验证") ? prev : [...prev, "结构已验证"]
        )
      }
    }, 1200)
  }

  const steps = ["Brief 解析", "命题确立", "证据归类", "结构验证"]

  return (
    <div className="min-h-screen bg-[#f4f1ea] px-4 py-8 text-[#1c1a17] md:px-10 md:py-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-[#1c1a17] pb-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]">{MODEL}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8377]">{SKILL}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8377]">
            Design Logic / Editorial Grid
          </span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8377]">Section 03 / 结构</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              布局本身就是论证。
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#4b463e] md:text-base">
              每一栏、每一条分隔线都对应一个决策。先用栅格确定信息的优先级，再决定用什么语气把它说清楚。
            </p>

            <div className="mt-8 grid grid-cols-3 gap-0 border-y border-[#c9c2b5]">
              {steps.map((step, index) => {
                const done = checked.some((item) => item.startsWith(step.slice(0, 2)))
                return (
                  <div
                    key={step}
                    className={`px-3 py-4 ${index < steps.length - 1 ? "border-r border-[#c9c2b5]" : ""}`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#8a8377]">
                      {done ? (
                        <CheckCircle2 className="size-3.5 text-[#3f6b4a]" />
                      ) : (
                        <CircleDashed className="size-3.5" />
                      )}
                      0{index + 1}
                    </div>
                    <div className="mt-2 text-sm">{step}</div>
                  </div>
                )
              })}
            </div>

            <section className="mt-8">
              <label htmlFor="brief-dl41" className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8377]">
                Campaign Brief
              </label>
              <textarea
                id="brief-dl41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-3 min-h-32 w-full resize-y border border-[#c9c2b5] bg-transparent p-4 text-sm leading-relaxed outline-none transition-colors focus:border-[#1c1a17] focus:ring-2 focus:ring-[#1c1a17]/15"
              />
              <div className="mt-2 flex justify-between font-mono text-[11px] text-[#8a8377]">
                <span>纯文本 · 不支持富格式</span>
                <span>{brief.length} 字</span>
              </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              <RuleGroup label="受众" options={audiences} value={audience} onChange={setAudience} />
              <RuleGroup label="渠道" options={channels} value={channel} onChange={setChannel} />
              <RuleGroup label="语气" options={tones} value={tone} onChange={setTone} />
              <RuleGroup label="视觉系统" options={systems} value={system} onChange={setSystem} />
            </section>
          </div>

          <div className="border-t-2 border-[#1c1a17] pt-6 lg:border-l-2 lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8377]">方案</span>
              <div className="flex gap-1">
                {sections.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSectionId(item.id)}
                    aria-pressed={item.id === sectionId}
                    className={`size-8 border font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1a17]/30 ${
                      item.id === sectionId
                        ? "border-[#1c1a17] bg-[#1c1a17] text-[#f4f1ea]"
                        : "border-[#c9c2b5] text-[#4b463e] hover:border-[#1c1a17]"
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
            </div>

            <article className="mt-6 border border-[#c9c2b5] bg-[#faf8f3] p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-[#8a8377]">{section.index}</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em]">{section.name}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-snug">{section.thesis}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4b463e]">{section.body}</p>
              <p className="mt-4 border-l-2 border-[#1c1a17] pl-3 text-xs text-[#6b6459]">{section.proof}</p>
            </article>

            <dl className="mt-6 divide-y divide-[#c9c2b5] border-y border-[#c9c2b5]">
              <Metric label="Reach" value={`${reach}K`} />
              <Metric label="CTR" value={`${ctr}%`} />
              <Metric label="Conversion" value={`${conversion}%`} />
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={run}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-2 border border-[#1c1a17] bg-[#1c1a17] px-4 py-2 text-sm font-medium text-[#f4f1ea] transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#1c1a17]/30 disabled:opacity-60"
              >
                {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
                生成结构
              </button>
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="inline-flex items-center gap-2 border border-[#1c1a17] px-4 py-2 text-sm transition-colors hover:bg-[#1c1a17] hover:text-[#f4f1ea] focus-visible:ring-2 focus-visible:ring-[#1c1a17]/30"
              >
                {saved ? "已保存" : "保存"}
              </button>
              <button
                type="button"
                onClick={() => setPhase("idle")}
                className="inline-flex items-center gap-2 border border-transparent px-4 py-2 text-sm text-[#8a8377] transition-colors hover:text-[#1c1a17]"
              >
                重置
              </button>
            </div>

            {phase === "success" && (
              <p className="mt-3 flex items-center gap-2 text-xs text-[#3f6b4a]">
                <CheckCircle2 className="size-4" /> 结构验证通过，证据与命题一一对应。
              </p>
            )}
            {phase === "error" && (
              <p className="mt-3 flex items-center gap-2 text-xs text-[#a1412f]">
                <XCircle className="size-4" /> 生成失败：证据与命题存在冲突，请检查 Brief。
              </p>
            )}

            <section className="mt-8">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8377]">核对清单</h3>
              <ul className="mt-3 space-y-2">
                {[...checked, "导出交付", "归档版本"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <ArrowUpRight className="size-3.5 text-[#8a8377]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function RuleGroup({
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
    <div className="border-t border-[#c9c2b5] pt-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8a8377]">{label}</div>
      <div className="mt-2 space-y-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`flex w-full items-center justify-between border-b border-dotted border-[#c9c2b5] py-1.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#1c1a17]/30 ${
              value === option ? "text-[#1c1a17]" : "text-[#8a8377] hover:text-[#4b463e]"
            }`}
          >
            {option}
            <span className="font-mono text-[10px]">{value === option ? "●" : "○"}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-3">
      <dt className="text-sm text-[#4b463e]">{label}</dt>
      <dd className="font-mono text-lg">{value}</dd>
    </div>
  )
}
