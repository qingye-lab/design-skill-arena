"use client"

import { useState } from "react"
import {
  Activity,
  CircleAlert,
  Cloud,
  Command,
  Monitor,
  Loader2,
  Rocket,
  Save,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react"

type FlowId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable"

const flows: {
  id: FlowId
  name: string
  step: string
  detail: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    name: "自助开户",
    step: "3 步完成",
    detail: "按 web-interface-guidelines 收敛表单字段，只保留必要输入。",
    reach: 884,
    ctr: 4.5,
    conversion: 3.2,
  },
  {
    id: "B",
    name: "预约演示",
    step: "2 步完成",
    detail: "把时间选择前置，减少用户填写长表单的负担。",
    reach: 848,
    ctr: 4.8,
    conversion: 3.5,
  },
  {
    id: "C",
    name: "邀请协作",
    step: "1 步完成",
    detail: "单字段邀请流程，适合已有账号的老用户扩散。",
    reach: 922,
    ctr: 4.2,
    conversion: 3.0,
  },
]

const audiences = ["新注册用户", "企业管理员", "团队邀请者", "试用用户"]
const channels = ["产品内", "官网表单", "销售跟进", "应用推送"]
const tones = ["产品化", "简洁", "引导性强", "克制"]
const releases = ["Stable", "Beta", "Canary", "Preview"]

type Phase = "idle" | "loading" | "success" | "error"
type Device = "desktop" | "mobile"
type TabId = "flow" | "components" | "status"

export default function ProductPolishChainShowcase() {
  const [brief, setBrief] = useState(
    "为 Aurora X1 设计一条可以直接上线的新用户引导流程，要求组件可复用、状态完整、键盘与触控均可完成。"
  )
  const [flowId, setFlowId] = useState<FlowId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [release, setRelease] = useState(releases[0])
  const [device, setDevice] = useState<Device>("desktop")
  const [tab, setTab] = useState<TabId>("flow")
  const [phase, setPhase] = useState<Phase>("idle")
  const [deployed, setDeployed] = useState(false)

  const flow = flows.find((item) => item.id === flowId) ?? flows[0]
  const reach = Math.round(flow.reach * (channel === "产品内" ? 1.04 : 1))
  const ctr = Number((flow.ctr * (tone === "引导性强" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((flow.conversion * (release === "Stable" ? 1.03 : 0.98)).toFixed(1))

  function generate() {
    if (phase === "loading") return
    setPhase("loading")
    window.setTimeout(() => setPhase(Math.random() < 0.1 ? "error" : "success"), 1200)
  }

  const tabs: { id: TabId; label: string; icon: typeof Rocket }[] = [
    { id: "flow", label: "流程", icon: Rocket },
    { id: "components", label: "组件", icon: Command },
    { id: "status", label: "状态", icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Rocket className="size-4" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{MODEL}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                  {SKILL}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Product Polish Chain · 上线工作台</div>
            </div>
          </div>
          <nav className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {tabs.map((item) => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-blue-500/25 ${
                    active ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="size-3.5" /> {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-5 md:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="emerald" icon={<Cloud className="size-3.5" />} label={`Release: ${release}`} />
          <Badge tone="blue" icon={<Activity className="size-3.5" />} label="All systems normal" />
          <Badge tone="slate" icon={<Users className="size-3.5" />} label={audience} />
          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generate}
              disabled={phase === "loading"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-blue-500/30 disabled:opacity-60"
            >
              {phase === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
            </button>
            <button
              type="button"
              onClick={() => setDeployed(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-blue-500/25"
            >
              <Save className="size-4" /> 保存
            </button>
            <button
              type="button"
              onClick={() => setDeployed(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-blue-500/25"
            >
              {deployed ? <Cloud className="size-4 text-emerald-600" /> : <Cloud className="size-4" />} 导出
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main>
            {tab === "flow" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {flows.map((item) => {
                      const active = item.id === flowId
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFlowId(item.id)}
                          aria-pressed={active}
                          className={`rounded-xl border px-4 py-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-blue-500/25 ${
                            active
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {item.id} · {item.name}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setDevice("desktop")}
                      aria-pressed={device === "desktop"}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-blue-500/25 ${
                        device === "desktop" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Monitor className="size-3.5" /> 桌面
                    </button>
                    <button
                      type="button"
                      onClick={() => setDevice("mobile")}
                      aria-pressed={device === "mobile"}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors focus-visible:ring-3 focus-visible:ring-blue-500/25 ${
                        device === "mobile" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Smartphone className="size-3.5" /> 手机
                    </button>
                  </div>
                </div>

                {phase === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <CircleAlert className="size-4" /> 生成失败：流程中存在未处理的失败路径，请补充重试入口。
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                  <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Preview · {channel}</span>
                    <span>{device === "desktop" ? "1440 × 900" : "390 × 844"}</span>
                  </div>
                  <div className="flex justify-center">
                    <div
                      className={`overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 transition-all duration-500 ${
                        device === "mobile" ? "w-full max-w-[360px]" : "w-full"
                      }`}
                    >
                      <div className="border-b border-slate-200/70 bg-white/70 px-4 py-2.5 text-[11px] text-slate-500">
                        aurora.example / {flow.name}
                      </div>
                      <div className={`p-5 md:p-8 ${device === "mobile" ? "text-center" : ""}`}>
                        <div className="text-[11px] uppercase tracking-[0.24em] text-blue-600">{flow.step}</div>
                        <h1 className={`mt-3 font-bold leading-tight ${device === "mobile" ? "text-2xl" : "text-3xl md:text-4xl"}`}>
                          {flow.name}：从第一次点击到完成
                        </h1>
                        <p className="mt-3 text-sm text-slate-600">{flow.detail}</p>
                        <div className={`mt-6 flex gap-2 ${device === "mobile" ? "flex-col" : "flex-wrap"}`}>
                          <button
                            type="button"
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-3 focus-visible:ring-blue-500/30"
                          >
                            开始
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-blue-500/25"
                          >
                            了解更多
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-slate-200/70 border-t border-slate-200/70 bg-white/60">
                        {[["Reach", `${reach}K`], ["CTR", `${ctr}%`], ["Conv", `${conversion}%`]].map(([label, value]) => (
                          <div key={label} className="px-3 py-3 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
                            <div className="mt-0.5 font-semibold tabular-nums">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <label htmlFor="brief-pp41" className="text-sm font-semibold">
                    Campaign Brief
                  </label>
                  <textarea
                    id="brief-pp41"
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    className="mt-2 min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/15"
                  />
                </section>
              </div>
            )}

            {tab === "components" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold">可复用组件</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { name: "StepProgress", states: "current / done / upcoming" },
                    { name: "FormField", states: "default / error / focus" },
                    { name: "PrimaryButton", states: "default / hover / loading / disabled" },
                    { name: "StatusBadge", states: "stable / beta / canary" },
                    { name: "InviteField", states: "empty / valid / invalid" },
                    { name: "ToastStack", states: "success / error / dismiss" },
                  ].map((item) => (
                    <div key={item.name} className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-slate-800">{item.name}</span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">ready</span>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500">{item.states}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "status" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-semibold">发布状态</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { env: "Production", state: "healthy", uptime: "99.99%" },
                    { env: "Staging", state: "healthy", uptime: "99.90%" },
                    { env: "Preview", state: "building", uptime: "—" },
                  ].map((item) => (
                    <div key={item.env} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3">
                      <span className="text-sm font-medium">{item.env}</span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${
                          item.state === "healthy" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${item.state === "healthy" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {item.state}
                      </span>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">{item.uptime}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">指标</h2>
              <div className="mt-3 space-y-2">
                <Metric label="Reach" value={`${reach}K`} />
                <Metric label="CTR" value={`${ctr}%`} />
                <Metric label="Conversion" value={`${conversion}%`} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">配置</h2>
              <Group label="受众" options={audiences} value={audience} onChange={setAudience} />
              <Group label="渠道" options={channels} value={channel} onChange={setChannel} />
              <Group label="语气" options={tones} value={tone} onChange={setTone} />
              <Group label="发布通道" options={releases} value={release} onChange={setRelease} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-semibold">最近活动</h2>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {[
                  { label: "发布到 Staging", time: "刚刚" },
                  { label: "通过无障碍检查", time: "6 分钟前" },
                  { label: "更新 FormField 状态", time: "今天" },
                  { label: "创建 v5 标签", time: "昨天" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span>{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.time}</span>
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

function Badge({
  tone,
  icon,
  label,
}: {
  tone: "emerald" | "blue" | "slate"
  icon: React.ReactNode
  label: string
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-white text-slate-600"
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] ${cls}`}>
      {icon} {label}
    </span>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-lg font-bold tabular-nums">{value}</span>
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
      <div className="mb-1.5 text-xs font-medium text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors focus-visible:ring-3 focus-visible:ring-blue-500/25 ${
              value === option
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
