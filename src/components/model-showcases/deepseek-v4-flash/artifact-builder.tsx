"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CircleX,
  Copy,
  Download,
  ExternalLink,
  Grip,
  Layers,
  Loader2,
  MousePointer2,
  Save,
  Sparkles,
  Square,
  Trash2,
  Wand2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  artboard: string
  badge: string
  title: string
  subtitle: string
  cta: string
  accent: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "星空信号",
    artboard: "ARTBOARD 01",
    badge: "NOVA LANTERN · GEN 2",
    title: "把星空折叠进一盏灯里",
    subtitle: "Nova 露营灯内置投影光罩，帐篷里也能拥有 4 平米的银河。",
    cta: "加入首发名单",
    accent: "#6d28d9",
    reach: 613,
    ctr: 4.9,
    conversion: 3.4,
  },
  {
    id: "B",
    name: "光影剧场",
    artboard: "ARTBOARD 02",
    badge: "NOVA LANTERN · GEN 2",
    title: "一盏灯，就是一个人的剧场",
    subtitle: "24 种光线场景与蓝牙音频联动，营地氛围由你导演。",
    cta: "预约体验",
    accent: "#0f766e",
    reach: 589,
    ctr: 4.6,
    conversion: 3.1,
  },
  {
    id: "C",
    name: "荒野生火",
    artboard: "ARTBOARD 03",
    badge: "NOVA LANTERN · GEN 2",
    title: "不是光源，是篝火的另一种可能",
    subtitle: "动态火焰光效与 IP67 防护，把篝火装进 380 克的灯体里。",
    cta: "立即抢购",
    accent: "#b45309",
    reach: 642,
    ctr: 4.4,
    conversion: 3.6,
  },
]

const audiences = ["露营玩家", "户外摄影师", "自驾游家庭", "城市野餐族"]
const channels = ["专题落地页", "露营市集", "社群团购", "短视频"]
const tones = ["自由浪漫", "硬核可靠", "轻松治愈", "探索精神"]
const styles = ["暮色紫", "湖水绿", "荒原橙", "雪地蓝"]

export default function ArtifactBuilderShowcase() {
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "画板挂载：3 个 artboard 已注册" },
    { id: "s2", time: now(), label: "图层树就绪" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")
  const [zoom, setZoom] = useState(100)
  const [layerOpen, setLayerOpen] = useState(true)

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`切换 artboard：${concept.artboard}`)
  }, [conceptId, concept.artboard, log])

  useEffect(() => {
    log(`属性更新：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "自由浪漫" ? 1.05 : tone === "探索精神" ? 1.03 : 1
    const styleMul = style === "荒原橙" ? 1.04 : style === "雪地蓝" ? 0.98 : 1
    const channelMul = channel === "专题落地页" ? 1.06 : channel === "短视频" ? 1.04 : 1
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
      log(`${label}：任务入队`)
      setTimeout(() => {
        setBusy(false)
        if (Math.random() < failChance) {
          setter("error")
          log(`${label}：构建失败`)
        } else {
          setter("success")
          log(`${label}：构建完成`)
        }
        setTimeout(() => setter("idle"), 2400)
      }, 950)
    },
    [busy, log]
  )

  const swatch = useMemo(() => {
    switch (style) {
      case "湖水绿":
        return { main: "#0f766e", soft: "bg-teal-50" }
      case "荒原橙":
        return { main: "#b45309", soft: "bg-amber-50" }
      case "雪地蓝":
        return { main: "#0369a1", soft: "bg-sky-50" }
      default:
        return { main: "#6d28d9", soft: "bg-violet-50" }
    }
  }, [style])

  return (
    <div className="flex min-h-screen flex-col bg-[#1c1f26] text-slate-100">
      <header className="flex items-center gap-3 border-b border-white/10 bg-[#232732] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-2 hidden h-5 w-px bg-white/10 md:block" />
        <span className="rounded bg-violet-500/90 px-2.5 py-1 text-[11px] font-bold text-white">
          DeepSeek V4 flash 0731
        </span>
        <span className="hidden rounded border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/60 sm:block">
          web-artifacts-builder / artifacts-builder
        </span>
        <div className="mx-auto hidden items-center gap-2 rounded-lg bg-white/5 px-4 py-1.5 text-xs text-white/60 md:flex">
          <Wand2 className="size-3.5" /> nova-lantern-launch.artifact
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <ToolButton label="缩小" onClick={() => setZoom((z) => Math.max(60, z - 10))} disabled={zoom <= 60}>
            <ZoomOut className="size-4" />
          </ToolButton>
          <span className="w-10 text-center font-mono text-xs text-white/60">{zoom}%</span>
          <ToolButton label="放大" onClick={() => setZoom((z) => Math.min(140, z + 10))} disabled={zoom >= 140}>
            <ZoomIn className="size-4" />
          </ToolButton>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="hidden w-12 flex-col items-center gap-1.5 border-r border-white/10 bg-[#232732] py-3 md:flex">
          {[MousePointer2, Square, Grip, TypeIcon, Layers, Trash2].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className={`flex size-9 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-violet-400/60 ${
                i === 0 ? "bg-violet-500/25 text-violet-300" : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-hidden p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setConceptId(c.id)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-violet-400/60 ${
                    conceptId === c.id
                      ? "border-violet-400 bg-violet-500/20 text-violet-200"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {c.artboard} · {c.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <ArtAction solid onClick={() => runAsync(setGenerateState, "重新构建画板", 0.08)} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} 生成
              </ArtAction>
              <ArtAction onClick={() => runAsync(setSaveState, "保存画板", 0.1)} disabled={busy} success={saveState === "success"}>
                {saveState === "success" ? <Check className="size-4" /> : <Save className="size-4" />} 保存
              </ArtAction>
              <ArtAction onClick={() => runAsync(setExportState, "导出单页", 0.05)} disabled={busy} success={exportState === "success"}>
                {exportState === "success" ? <Check className="size-4" /> : <Download className="size-4" />} 导出
              </ArtAction>
            </div>
          </div>

          {generateState === "success" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
              <Check className="size-4" /> 画板重建完成，图层树已同步。
            </div>
          )}
          {generateState === "error" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              <CircleX className="size-4" /> 构建失败：图片资源缺失，请补充素材。
            </div>
          )}

          <div className="flex h-[calc(100vh-190px)] min-h-[520px] items-start justify-center overflow-auto rounded-xl border border-white/10 bg-[#14161b] p-6">
            <div
              className="w-full max-w-3xl overflow-hidden rounded-xl bg-white text-slate-900 shadow-2xl transition-all duration-500"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className={`flex items-center justify-between px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest ${swatch.soft}`}>
                <span>{concept.artboard} / HOME / HERO</span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="size-3" /> 1440 × 720
                </span>
              </div>
              <div
                className="relative flex min-h-[380px] flex-col justify-between overflow-hidden p-6 text-white md:min-h-[440px] md:p-10"
                style={{ background: `linear-gradient(135deg, #101418 0%, ${swatch.main} 130%)` }}
              >
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #fff 0, transparent 40%)" }} />
                <div className="relative flex items-start justify-between">
                  <span className="rounded-md border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-widest backdrop-blur">
                    {concept.badge}
                  </span>
                  <span className="rounded-md border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] backdrop-blur">
                    {channel} · {tone}
                  </span>
                </div>
                <div className="relative max-w-xl py-8">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] opacity-60">
                    For {audience}
                  </div>
                  <h1 className="text-3xl font-black leading-tight md:text-5xl">{concept.title}</h1>
                  <p className="mt-4 max-w-md text-sm leading-relaxed opacity-85">{concept.subtitle}</p>
                </div>
                <div className="relative flex flex-wrap items-center gap-3">
                  <button
                    className="rounded-lg px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.03] focus-visible:ring-3 focus-visible:ring-white/60 active:scale-95"
                    style={{ backgroundColor: swatch.main }}
                  >
                    {concept.cta}
                  </button>
                  <span className="flex items-center gap-1.5 text-xs text-white/60">
                    <Copy className="size-3.5" /> 首发限量 2000 台
                  </span>
                </div>
              </div>
              <div className={`flex items-center justify-between px-5 py-2.5 text-[10px] uppercase tracking-widest ${swatch.soft}`}>
                <span>REACH {metrics.reach.toLocaleString()}K · CTR {metrics.ctr.toFixed(1)}% · CONV {metrics.conversion.toFixed(1)}%</span>
                <span className="flex gap-1.5">
                  {["远光投影", "IP67", "380g"].map((t) => (
                    <span key={t} className="rounded border border-current/20 px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden w-64 flex-col gap-3 border-l border-white/10 bg-[#232732] p-3 lg:flex">
          <section className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/70">
              <span>图层</span>
              <button type="button" onClick={() => setLayerOpen((v) => !v)} className="text-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400/60" aria-label="折叠图层">
                <span className="text-[10px]">{layerOpen ? "收起" : "展开"}</span>
              </button>
            </div>
            {layerOpen && (
              <ul className="space-y-1 text-xs text-white/60">
                {["CTA 按钮", "主标题", "副标题", "角标 / badge", "背景光晕", "Artboard 容器"].map((l, i) => (
                  <li
                    key={l}
                    className={`flex items-center gap-2 rounded px-2 py-1.5 ${i === 0 ? "bg-violet-500/20 text-violet-200" : "hover:bg-white/5"}`}
                  >
                    <Grip className="size-3 text-white/30" /> {l}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs font-semibold text-white/70">属性面板</div>
            <div className="space-y-3">
              <Field label="目标人群" options={audiences} value={audience} onChange={setAudience} />
              <Field label="投放渠道" options={channels} value={channel} onChange={setChannel} />
              <Field label="语气" options={tones} value={tone} onChange={setTone} />
              <Field label="主题色" options={styles} value={style} onChange={setStyle} />
            </div>
          </section>

          <section className="flex-1 rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-xs font-semibold text-white/70">最近操作</div>
            <ul className="space-y-1.5">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-1.5 text-[11px] leading-snug text-white/55">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-violet-400" />
                  <span className="flex-1">{a.label}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <footer className="flex items-center gap-4 border-t border-white/10 bg-[#232732] px-4 py-2 text-xs text-white/50">
        <span className="hidden md:block">画布 {concept.artboard}</span>
        <span className="ml-auto">面板状态：{layerOpen ? "展开" : "折叠"} · 缩放 {zoom}%</span>
      </footer>
    </div>
  )
}

function ToolButton({
  children,
  onClick,
  label,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-violet-400/60 disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function TypeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
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
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={`rounded px-1.5 py-1 text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-violet-400/60 ${
              value === opt ? "bg-violet-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/15"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ArtAction({
  children,
  onClick,
  disabled,
  solid = false,
  success = false,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  solid?: boolean
  success?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-violet-400/60 disabled:opacity-60 ${
        success
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
          : solid
            ? "border-violet-500 bg-violet-500 text-white hover:bg-violet-600"
            : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  )
}
