"use client"

import { useState } from "react"
import { ArrowRight, Check, CircleAlert, Loader2, Minus, Plus } from "lucide-react"

type DirectionId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-app-builder + taste-skill"

const directions: {
  id: DirectionId
  title: string
  line: string
  note: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    title: "少说一点",
    line: "把三个卖点砍到一个，剩下的交给产品自己说。",
    note: "去掉形容词，只保留可验证的句子。",
    reach: 864,
    ctr: 4.6,
    conversion: 3.2,
  },
  {
    id: "B",
    title: "说准一点",
    line: "不夸张，不模糊，每个承诺都能被检验。",
    note: "所有数字附上测试条件。",
    reach: 838,
    ctr: 4.9,
    conversion: 3.5,
  },
  {
    id: "C",
    title: "说慢一点",
    line: "给用户留出理解的时间，比抢注意力更有效。",
    note: "段落之间留白，节奏放缓。",
    reach: 902,
    ctr: 4.3,
    conversion: 3.0,
  },
]

const audiences = ["理性消费者", "设计从业者", "长期使用者", "内容读者"]
const channels = ["品牌官网", "长图文", "邮件通讯", "产品内提示"]
const tones = ["安静", "真诚", "克制", "笃定"]
const finishes = ["米白纸感", "暖灰哑光", "墨绿点缀", "原木中性"]

type Phase = "idle" | "loading" | "success" | "error"

export default function StandardTasteShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 写一次不夸张的新品发布。用户已经厌倦了堆料式宣传，我们只用可验证的说法描述产品。"
  )
  const [directionId, setDirectionId] = useState<DirectionId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [finish, setFinish] = useState(finishes[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [density, setDensity] = useState(2)
  const [notes, setNotes] = useState<string[]>(["已删除 6 个形容词", "已合并 2 个卖点"])

  const direction = directions.find((item) => item.id === directionId) ?? directions[0]
  const reach = Math.round(direction.reach * (finish === "米白纸感" ? 1.02 : 1))
  const ctr = Number((direction.ctr * (tone === "笃定" ? 1.02 : 1)).toFixed(1))
  const conversion = Number((direction.conversion * (1 + (density - 2) * 0.01)).toFixed(1))

  function addNote(entry: string) {
    setNotes((prev) => [entry, ...prev].slice(0, 5))
  }

  function run() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => {
      const failed = Math.random() < 0.08
      setPhase(failed ? "error" : "success")
      if (!failed) addNote(`已按 ${direction.title} 重写文案`)
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#25231f]">
      <div className="mx-auto max-w-[1080px] px-6 py-12 md:px-10 md:py-16">
        <header className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-xs font-medium tracking-wide">{MODEL}</span>
            <span className="text-[11px] tracking-wide text-[#8d877c]">{SKILL}</span>
          </div>
          <span className="text-[11px] tracking-wide text-[#8d877c]">Standard + Taste</span>
        </header>

        <h1 className="mt-10 max-w-2xl font-serif text-4xl leading-[1.15] tracking-tight md:text-5xl">
          好的活动页，先学会删掉一半。
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-loose text-[#5c564c] md:text-base">
          这套页面的第一版总是太满：太多颜色、太多修饰、太多感叹号。真正的工作是从第二版开始，把不该出现的东西移走。
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <section>
              <div className="flex flex-wrap gap-2">
                {directions.map((item) => {
                  const active = item.id === directionId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDirectionId(item.id)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30 ${
                        active
                          ? "border-[#25231f] bg-[#25231f] text-[#f7f4ee]"
                          : "border-[#d8d2c6] text-[#5c564c] hover:border-[#a89f90]"
                      }`}
                    >
                      {item.title}
                    </button>
                  )
                })}
              </div>

              <article className="mt-6 rounded-2xl border border-[#e2ddd2] bg-[#fdfcf9] p-6 md:p-8">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">方案 {direction.id}</div>
                <h2 className="mt-3 font-serif text-2xl leading-snug md:text-3xl">{direction.line}</h2>
                <p className="mt-4 text-sm leading-loose text-[#5c564c]">{direction.note}</p>
                <div className="mt-6 h-px w-full bg-[#e2ddd2]" />
                <dl className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <dt className="text-[11px] text-[#8d877c]">Reach</dt>
                    <dd className="mt-1 text-xl font-medium">{reach}K</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#8d877c]">CTR</dt>
                    <dd className="mt-1 text-xl font-medium">{ctr}%</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-[#8d877c]">Conversion</dt>
                    <dd className="mt-1 text-xl font-medium">{conversion}%</dd>
                  </div>
                </dl>
              </article>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={run}
                  disabled={phase === "loading"}
                  className="inline-flex items-center gap-2 rounded-full bg-[#4b6b4f] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30 disabled:opacity-60"
                >
                  {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : null} 生成
                </button>
                <button
                  type="button"
                  onClick={() => addNote("已保存当前文字版本")}
                  className="rounded-full border border-[#d8d2c6] px-5 py-2.5 text-sm transition-colors hover:border-[#a89f90] focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => addNote("已导出最终文案")}
                  className="rounded-full border border-[#d8d2c6] px-5 py-2.5 text-sm transition-colors hover:border-[#a89f90] focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30"
                >
                  导出
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("idle")}
                  className="rounded-full px-5 py-2.5 text-sm text-[#8d877c] transition-colors hover:text-[#25231f]"
                >
                  重置
                </button>
              </div>

              {phase === "success" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-[#40603f]">
                  <Check className="size-4" /> 文案已按 {tone} 的语气重写完成。
                </p>
              )}
              {phase === "error" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-[#9c3f31]">
                  <CircleAlert className="size-4" /> 生成失败：保留的主张不足，请补充一条可验证的承诺。
                </p>
              )}
            </section>

            <section className="mt-10">
              <label htmlFor="brief-st41" className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">
                Campaign Brief
              </label>
              <textarea
                id="brief-st41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="mt-3 min-h-32 w-full resize-y rounded-2xl border border-[#e2ddd2] bg-[#fdfcf9] p-5 font-serif text-sm leading-loose outline-none transition-colors focus:border-[#4b6b4f] focus:ring-3 focus:ring-[#4b6b4f]/15"
              />
              <div className="mt-2 text-[11px] text-[#8d877c]">{brief.length} 字 · 越短越好</div>
            </section>
          </div>

          <aside className="space-y-10">
            <section>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">受众</h3>
              <ul className="mt-3 space-y-1">
                {audiences.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => setAudience(item)}
                      aria-pressed={audience === item}
                      className={`w-full border-b border-[#e9e4da] py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#4b6b4f]/30 ${
                        audience === item ? "text-[#25231f]" : "text-[#8d877c] hover:text-[#5c564c]"
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">渠道</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {channels.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setChannel(item)}
                    aria-pressed={channel === item}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30 ${
                      channel === item ? "border-[#4b6b4f] text-[#4b6b4f]" : "border-[#d8d2c6] text-[#8d877c]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">语气</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tones.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTone(item)}
                    aria-pressed={tone === item}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30 ${
                      tone === item ? "border-[#4b6b4f] text-[#4b6b4f]" : "border-[#d8d2c6] text-[#8d877c]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">视觉风格</h3>
              <div className="mt-3 space-y-1">
                {finishes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFinish(item)}
                    aria-pressed={finish === item}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30 ${
                      finish === item ? "bg-[#25231f] text-[#f7f4ee]" : "text-[#8d877c] hover:bg-[#efeae0]"
                    }`}
                  >
                    {item}
                    {finish === item && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">信息密度</h3>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDensity((prev) => Math.max(1, prev - 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-[#d8d2c6] transition-colors hover:border-[#a89f90] focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30"
                  aria-label="降低密度"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="text-sm">{density} / 4</span>
                <button
                  type="button"
                  onClick={() => setDensity((prev) => Math.min(4, prev + 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-[#d8d2c6] transition-colors hover:border-[#a89f90] focus-visible:ring-3 focus-visible:ring-[#4b6b4f]/30"
                  aria-label="提高密度"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[#8d877c]">编辑记录</h3>
              <ul className="mt-3 space-y-2">
                {notes.map((note, index) => (
                  <li key={`${note}-${index}`} className="flex items-start gap-2 text-xs text-[#5c564c]">
                    <ArrowRight className="mt-0.5 size-3 shrink-0 text-[#a89f90]" />
                    {note}
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
