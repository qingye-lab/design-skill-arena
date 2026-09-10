"use client"

import { useState } from "react"
import {
  Accessibility,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  Keyboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

type PlanId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "ui-ux-pro-max"

const plans: {
  id: PlanId
  name: string
  promise: string
  steps: string[]
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "首次了解",
    promise: "用三步讲清楚 Aurora X1 到底解决什么问题。",
    steps: ["问题", "方案", "价格"],
    reach: 870,
    ctr: 4.4,
    conversion: 3.0,
  },
  {
    id: "B",
    name: "对比选择",
    promise: "帮用户在同价位里做出有依据的选择。",
    steps: ["筛选", "对比", "下单"],
    reach: 833,
    ctr: 4.8,
    conversion: 3.5,
  },
  {
    id: "C",
    name: "复购升级",
    promise: "面向老用户的升级路径，减少决策成本。",
    steps: ["回访", "升级", "推荐"],
    reach: 918,
    ctr: 4.1,
    conversion: 2.8,
  },
]

const audiences = ["首次访客", "比价用户", "老用户", "无障碍用户"]
const channels = ["产品页", "帮助中心", "客服话术", "应用内引导"]
const tones = ["清晰友好", "简洁专业", "耐心解释", "鼓励行动"]
const standards = ["WCAG AA", "WCAG AAA", "对比度增强", "减少动效"]

type Phase = "idle" | "loading" | "success" | "error"

export default function UxProReferenceShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 设计一条人人都能走完的购买路径，重点覆盖首次访客与无障碍用户，保证键盘可达与错误可恢复。"
  )
  const [planId, setPlanId] = useState<PlanId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [standard, setStandard] = useState(standards[0])
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [briefError, setBriefError] = useState<string | null>(null)
  const [announced, setAnnounced] = useState("已进入工作台")

  const plan = plans.find((item) => item.id === planId) ?? plans[0]

  const reach = Math.round(plan.reach * (channel === "产品页" ? 1.05 : 1))
  const ctr = Number((plan.ctr * (tone === "鼓励行动" ? 1.04 : 1)).toFixed(1))
  const conversion = Number((plan.conversion * (standard === "WCAG AAA" ? 1.03 : 1)).toFixed(1))

  function checkBrief(value: string) {
    if (value.trim().length < 12) {
      setBriefError("Brief 至少需要 12 个字符，才能生成可靠的路径。")
      return false
    }
    setBriefError(null)
    return true
  }

  function generate() {
    if (!checkBrief(brief)) {
      setAnnounced("生成被拦截，请先修正 Brief")
      return
    }
    if (phase === "loading") return
    setPhase("loading")
    setAnnounced("正在生成路径")
    window.setTimeout(() => {
      const failed = Math.random() < 0.1
      setPhase(failed ? "error" : "success")
      setAnnounced(failed ? "生成失败" : "路径生成完成")
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <a
        href="#main-workbench"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        跳到主工作台
      </a>

      <p aria-live="polite" className="sr-only">
        {announced}
      </p>

      <div className="mx-auto max-w-[1240px] px-4 py-6 md:px-8" id="main-workbench">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-teal-700 px-2.5 py-1 text-xs font-semibold text-white">{MODEL}</span>
              <span className="rounded-md border border-slate-300 px-2.5 py-1 font-mono text-[11px] text-slate-600">
                {SKILL}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold md:text-3xl">UX Pro Reference · 可用性工作台</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              先保证每个人都能完成，再考虑让它好看。所有控件支持键盘、可见焦点与屏幕阅读器播报。
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <Badge icon={<Keyboard className="size-3.5" />} label="键盘可达" />
            <Badge icon={<Accessibility className="size-3.5" />} label="AA 对比度" />
            <Badge icon={<ShieldCheck className="size-3.5" />} label="错误可恢复" />
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <ol className="flex flex-wrap items-center gap-2" aria-label="任务步骤">
              {plan.steps.map((label, index) => {
                const state = index < step ? "done" : index === step ? "current" : "todo"
                return (
                  <li key={label} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(index)
                        setAnnounced(`已跳到第 ${index + 1} 步：${label}`)
                      }}
                      aria-current={state === "current" ? "step" : undefined}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-teal-600/40 ${
                        state === "current"
                          ? "border-teal-700 bg-teal-700 text-white"
                          : state === "done"
                            ? "border-teal-200 bg-teal-50 text-teal-800"
                            : "border-slate-300 text-slate-500 hover:border-slate-400"
                      }`}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <span className="flex size-4 items-center justify-center rounded-full border border-current text-[10px]">
                          {index + 1}
                        </span>
                      )}
                      {label}
                    </button>
                    {index < plan.steps.length - 1 && <ArrowRight className="size-3.5 text-slate-300" />}
                  </li>
                )
              })}
            </ol>

            <div className="mt-5 rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">第 {step + 1} 步：{plan.steps[step]}</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-teal-600/40 disabled:opacity-40"
                  >
                    <ArrowLeft className="size-3.5" /> 上一步
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.min(prev + 1, plan.steps.length - 1))}
                    disabled={step === plan.steps.length - 1}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-sm text-white transition-colors hover:bg-teal-800 focus-visible:ring-3 focus-visible:ring-teal-600/40 disabled:opacity-40"
                  >
                    下一步 <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.promise}</p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-[11px] uppercase tracking-widest text-slate-500">
                  {channel} · 面向 {audience}
                </div>
                <div className="mt-3 text-xl font-semibold">{plan.name} 路径</div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className={`h-14 rounded-lg border transition-colors ${
                        index <= step ? "border-teal-300 bg-teal-100/70" : "border-slate-200 bg-white"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 flex items-start gap-2 text-xs text-slate-600">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-teal-700" />
                  当前语气为 {tone}，可读性标准为 {standard}。
                </p>
              </div>
            </div>

            <section className="mt-5 rounded-2xl border border-slate-200 p-5">
              <label htmlFor="brief-ux41" className="block text-sm font-semibold">
                Campaign Brief
              </label>
              <textarea
                id="brief-ux41"
                value={brief}
                onChange={(event) => {
                  setBrief(event.target.value)
                  if (briefError) checkBrief(event.target.value)
                }}
                onBlur={(event) => checkBrief(event.target.value)}
                aria-invalid={briefError ? true : undefined}
                aria-describedby={briefError ? "brief-ux41-error" : "brief-ux41-hint"}
                className={`mt-2 min-h-28 w-full resize-y rounded-xl border p-4 text-sm leading-relaxed outline-none transition-colors focus:ring-3 ${
                  briefError
                    ? "border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 bg-white focus:border-teal-600 focus:ring-teal-600/20"
                }`}
              />
              {briefError ? (
                <p id="brief-ux41-error" role="alert" className="mt-2 flex items-center gap-2 text-sm text-rose-700">
                  <AlertCircle className="size-4" /> {briefError}
                </p>
              ) : (
                <p id="brief-ux41-hint" className="mt-2 text-xs text-slate-500">
                  描述用户、场景与成功标准；系统会自动生成可访问路径。
                </p>
              )}
            </section>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={generate}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:ring-3 focus-visible:ring-teal-600/40 disabled:opacity-60"
              >
                {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                生成路径
              </button>
              <button
                type="button"
                onClick={() => setAnnounced("方案已保存到本地")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-teal-600/40"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setAnnounced("已导出为可访问性报告")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-teal-600/40"
              >
                导出报告
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("idle")
                  setStep(0)
                }}
                className="rounded-lg px-4 py-2.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
              >
                重置
              </button>
            </div>

            {phase === "success" && (
              <div role="status" className="mt-4 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
                <CheckCircle2 className="size-4" /> 路径已生成，并通过 {standard} 检查。
              </div>
            )}
            {phase === "error" && (
              <div role="alert" className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                <AlertCircle className="size-4" /> 生成失败：路径中存在不可达步骤，请调整受众或渠道后重试。
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold">模拟指标</h2>
              <div className="mt-3 space-y-2.5">
                <Metric label="Reach" value={`${reach}K`} />
                <Metric label="CTR" value={`${ctr}%`} />
                <Metric label="Conversion" value={`${conversion}%`} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold">方案</h2>
              <div className="mt-3 space-y-2">
                {plans.map((item) => {
                  const active = item.id === planId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPlanId(item.id)
                        setStep(0)
                        setAnnounced(`已选择方案 ${item.id}：${item.name}`)
                      }}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:ring-3 focus-visible:ring-teal-600/40 ${
                        active ? "border-teal-700 bg-teal-50" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <span>
                        <span className="font-medium">{item.id}</span> · {item.name}
                      </span>
                      {active && <CheckCircle2 className="size-4 text-teal-700" />}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold">控件</h2>
              <Field label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Field label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Field label="语气" options={tones} value={tone} onChange={setTone} />
              <Field label="可读标准" options={standards} value={standard} onChange={setStandard} />
            </section>

            <section className="rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold">最近活动</h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {[
                  "对照度进行检查",
                  "补充键盘焦点顺序",
                  "校对错误文案",
                  "导出可访问性报告",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <CheckCircle2 className="size-3.5 text-teal-700" /> {item}
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

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-slate-600">
      {icon} {label}
    </span>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  )
}

function Field({
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
      <div className="mb-1.5 text-xs font-medium text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-teal-600/40 ${
              value === option
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
