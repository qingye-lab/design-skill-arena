"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Bell,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleX,
  Download,
  Home,
  Loader2,
  Package,
  Save,
  Search,
  Settings,
  Sparkles,
  Store,
  Users,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  status: string
  headline: string
  subline: string
  sku: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "定时喂养",
    status: "主推",
    headline: "不在家的日子，它也有准时的一餐",
    subline: "Whisker 智能喂食器按克出粮，App 端可随时远程补粮与加餐。",
    sku: "SKU-01 · 标准版",
    reach: 928,
    ctr: 4.6,
    conversion: 3.3,
  },
  {
    id: "B",
    name: "体型管理",
    status: "转化款",
    headline: "每一克，都在为它的健康记账",
    subline: "内置体重秤模块与喂食日历，Whisker 让减重计划看得见进度。",
    sku: "SKU-02 · 健康版",
    reach: 903,
    ctr: 4.4,
    conversion: 3.5,
  },
  {
    id: "C",
    name: "多宠家庭",
    status: "延展款",
    headline: "两只猫，两份餐，互不打扰",
    subline: "双仓设计与芯片识别项圈，Whisker 为每只宠物分配专属餐量。",
    sku: "SKU-03 · 家庭版",
    reach: 951,
    ctr: 4.3,
    conversion: 3.1,
  },
]

const audiences = ["新手养宠人", "多宠家庭", "出差频繁的职场人", "宠物繁育者"]
const channels = ["宠物电商", "线下门店", "社群分销", "宠物医院合作"]
const tones = ["贴心专业", "幽默轻松", "科学可靠", "温情陪伴"]
const styles = ["奶油白", "薄荷绿", "蜜瓜橙", "雾霾蓝"]

const NAV = [
  { id: "overview", label: "总览", icon: Home },
  { id: "campaigns", label: "活动管理", icon: Boxes, count: "3" },
  { id: "products", label: "商品库", icon: Package, count: "12" },
  { id: "stores", label: "渠道门店", icon: Store },
  { id: "audiences", label: "人群包", icon: Users, count: "5" },
]

export default function ProductPolishChainShowcase() {
  const [brief, setBrief] = useState(
    "Whisker 智能喂食器新品首发：以「准时的爱」为主题，覆盖新手与多宠家庭，先开宠物电商与线下门店。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "商品库同步完成（3 个 SKU）" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [search, setSearch] = useState("")

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`切换活动概念：${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`人群包更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "科学可靠" ? 1.04 : tone === "幽默轻松" ? 1.02 : 1
    const styleMul = style === "蜜瓜橙" ? 1.03 : style === "雾霾蓝" ? 0.98 : 1
    const channelMul = channel === "宠物电商" ? 1.06 : channel === "社群分销" ? 1.03 : 1
    return {
      reach: Math.round(concept.reach * channelMul),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * styleMul).toFixed(1)),
    }
  }, [concept, tone, style, channel])

  const runAsync = useCallback(
    (setter: (v: "idle" | "success" | "error") => void, label: string, failChance = 0) => {
      if (busy) return
      setBusy(true)
      setter("idle")
      log(`${label}：任务提交`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：失败`)
        } else {
          setter("success")
          log(`${label}：成功`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 1000)
    },
    [busy, log]
  )

  const theme = useMemo(() => {
    switch (style) {
      case "薄荷绿":
        return { bg: "bg-teal-50", bar: "bg-teal-600", ring: "text-teal-700" }
      case "蜜瓜橙":
        return { bg: "bg-orange-50", bar: "bg-orange-600", ring: "text-orange-700" }
      case "雾霾蓝":
        return { bg: "bg-sky-50", bar: "bg-sky-600", ring: "text-sky-700" }
      default:
        return { bg: "bg-amber-50", bar: "bg-amber-600", ring: "text-amber-700" }
    }
  }, [style])

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-sm font-black tracking-tight">
            <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] text-white">DS</span>
            Muse Studio
          </div>
          <div className="hidden items-center gap-1 text-xs text-slate-400 md:flex">
            <span>活动</span>
            <ChevronRight className="size-3" />
            <span className="text-slate-600">Whisker 首发</span>
          </div>
          <div className="relative ml-auto w-full max-w-60">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索活动、商品、人群…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-3 focus:ring-slate-400/15"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <span className="hidden rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white md:block">
              DeepSeek V4 flash 0731
            </span>
            <span className="hidden rounded-md border border-slate-200 px-2.5 py-1 font-mono text-[10px] text-slate-400 lg:block">
              frontend-app-builder + shadcn-best-practices + web-interface-guidelines + impeccable
            </span>
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((v) => !v)
                log(settingsOpen ? "关闭设置面板" : "打开设置面板")
              }}
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus-visible:ring-3 focus-visible:ring-slate-400/30"
              aria-label="设置"
            >
              <Settings className="size-4" />
            </button>
            <button
              type="button"
              className="relative flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 focus-visible:ring-3 focus-visible:ring-slate-400/30"
              aria-label="通知"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500" />
            </button>
          </div>
        </div>

        {settingsOpen && (
          <div className="arena-enter border-t border-slate-100 bg-slate-50 px-4 py-3">
            <div className="mb-2 text-xs font-bold text-slate-500">工作台设置</div>
            <div className="flex flex-wrap gap-3 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-slate-900" /> 自动保存版本
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-slate-900" /> 指标实时重算
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-slate-900" /> 生成后播报声音
              </label>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        <aside className="hidden w-52 shrink-0 border-r border-slate-200 bg-white p-3 md:block">
          <div className="mb-4 px-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            工作区
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => log(`导航：${n.label}`)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-400/30 ${
                  n.id === "campaigns" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <n.icon className="size-4" />
                <span className="flex-1 text-left">{n.label}</span>
                {n.count && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${n.id === "campaigns" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {n.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold">Whisker 智能喂食器 · 首发活动</h1>
              <p className="mt-0.5 text-xs text-slate-400">创建于 10:24 · 状态：草稿 · 负责人：你</p>
            </div>
            <div className="flex gap-2">
              <ShellButton
                solid
                disabled={busy}
                onClick={() => runAsync(setGenerateState, "生成活动", 0.08)}
                icon={busy ? Loader2 : Sparkles}
                spin={busy}
              >
                生成
              </ShellButton>
              <ShellButton
                disabled={busy}
                success={saveState === "success"}
                onClick={() => runAsync(setSaveState, "保存活动", 0.1)}
                icon={saveState === "success" ? CheckCircle2 : Save}
              >
                保存
              </ShellButton>
              <ShellButton
                disabled={busy}
                success={exportState === "success"}
                onClick={() => runAsync(setExportState, "导出活动包", 0.05)}
                icon={exportState === "success" ? CheckCircle2 : Download}
              >
                导出
              </ShellButton>
            </div>
          </div>

          {generateState === "success" && (
            <div className="arena-enter mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
              <CheckCircle2 className="size-4" /> 活动已生成：3 个 SKU 方案、渠道与人群包已关联。
            </div>
          )}
          {generateState === "error" && (
            <div className="arena-enter mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-900">
              <CircleX className="size-4" /> 生成失败：商品库缺少价格字段，请先补齐。
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="flex min-w-0 flex-col gap-4">
              <div className={`relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-sm transition-colors duration-500 md:p-8 ${theme.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur">
                      {channel}
                    </span>
                    <span className={`rounded-full bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur ${theme.ring}`}>
                      {concept.status}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    {concept.sku}
                  </span>
                </div>
                <div className="max-w-xl py-8">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {tone} · 面向 {audience}
                  </div>
                  <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">{concept.headline}</h2>
                  <p className="mb-6 max-w-lg text-sm leading-relaxed text-slate-600">{concept.subline}</p>
                  <button className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-white/50 active:scale-95 ${theme.bar}`}>
                    查看商品详情 →
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  {["按克出粮", "App 远程", "双仓可选", "一年质保"].map((t) => (
                    <span key={t} className="rounded-full border border-slate-300 bg-white/70 px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="border-b border-slate-100 px-5 py-3 text-sm font-bold">概念方案</div>
                <div className="divide-y divide-slate-100">
                  {concepts.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setConceptId(c.id)}
                      className={`flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors focus-visible:ring-3 focus-visible:ring-slate-400/30 ${
                        conceptId === c.id ? "bg-slate-50" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          conceptId === c.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-400"
                        }`}
                      >
                        {c.id}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          {c.name}
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {c.status}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-400">{c.headline}</span>
                      </span>
                      <span className="hidden shrink-0 font-mono text-[10px] text-slate-400 sm:block">{c.sku}</span>
                      {conceptId === c.id && <Check className="size-4 shrink-0 text-slate-900" />}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-3 text-sm font-bold">活动参数与 Brief</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ShellField label="目标人群" options={audiences} value={audience} onChange={setAudience} />
                  <ShellField label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                  <ShellField label="语气" options={tones} value={tone} onChange={setTone} />
                  <ShellField label="视觉风格" options={styles} value={style} onChange={setStyle} />
                </div>
                <textarea
                  value={brief}
                  onChange={(e) => {
                    setBrief(e.target.value)
                    if (e.target.value.length % 24 === 0) log("Brief 更新")
                  }}
                  className="mt-4 min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-3 focus:ring-slate-400/15"
                  placeholder="产品 / 人群 / 卖点 / 渠道…"
                />
              </section>
            </div>

            <aside className="flex flex-col gap-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-3 text-sm font-bold">预测指标</div>
                <div className="space-y-2">
                  <ShellMetric label="Reach" value={metrics.reach.toLocaleString()} suffix="K" />
                  <ShellMetric label="CTR" value={metrics.ctr.toFixed(1)} suffix="%" />
                  <ShellMetric label="Conversion" value={metrics.conversion.toFixed(1)} suffix="%" />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-all duration-700 ${theme.bar}`} style={{ width: `${Math.min(metrics.ctr * 18, 100)}%` }} />
                </div>
              </section>

              <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="mb-3 text-sm font-bold">最近操作</div>
                <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
                      <span className="size-1.5 shrink-0 rounded-full bg-slate-400" />
                      <span className="flex-1 text-slate-600">{a.label}</span>
                      <span className="shrink-0 font-mono text-[10px] text-slate-400">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

function ShellField({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold text-slate-500">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-400/30 ${
              value === opt
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ShellMetric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-lg font-bold text-slate-900">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-400">{suffix}</span>
      </span>
    </div>
  )
}

function ShellButton({
  children,
  onClick,
  disabled,
  solid = false,
  success = false,
  icon: Icon,
  spin = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  solid?: boolean
  success?: boolean
  icon: typeof Sparkles
  spin?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-slate-400/30 disabled:opacity-50 ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : solid
            ? "bg-slate-900 text-white shadow-sm hover:bg-slate-700"
            : "border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className={`size-4 ${spin ? "animate-spin" : ""}`} />
      {children}
    </button>
  )
}
