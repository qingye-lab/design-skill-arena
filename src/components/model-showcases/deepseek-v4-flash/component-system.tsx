"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  CheckCircle2,
  CircleX,
  Download,
  Loader2,
  Save,
  Settings2,
  Sparkles,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Concept = {
  id: "A" | "B" | "C"
  name: string
  role: string
  headline: string
  subline: string
  reach: number
  ctr: number
  conversion: number
}

type Activity = { id: string; time: string; label: string }

const concepts: Concept[] = [
  {
    id: "A",
    name: "静谧",
    role: "核心概念",
    headline: "一室香，自成一方宁静",
    subline: "Zen 香薰机超声雾化 5ml/h，让 40㎡ 的房间在十分钟内被气味接管。",
    reach: 389,
    ctr: 4.6,
    conversion: 3.4,
  },
  {
    id: "B",
    name: "节奏",
    role: "延展概念",
    headline: "香气，是生活的节拍器",
    subline: "定时香氛程序与昼夜节律联动，Zen 帮你把一天分成呼吸的段落。",
    reach: 412,
    ctr: 4.3,
    conversion: 3.1,
  },
  {
    id: "C",
    name: "安睡",
    role: "转化概念",
    headline: "睡前的最后一件事，是关灯，不是关香",
    subline: "睡眠模式 30 分钟自动渐弱，Zen 香薰机陪你从清醒滑入梦乡。",
    reach: 375,
    ctr: 4.9,
    conversion: 3.7,
  },
]

const audiences = ["都市独居者", "失眠人群", "瑜伽爱好者", "高端酒店"]
const channels = ["官方商城", "生活方式电商", "礼品渠道", "线下买手店"]
const tones = ["宁静舒缓", "质感高级", "温暖亲近", "理性客观"]
const styles = ["雾灰", "岩米", "黛蓝", "苔绿"]

export default function ComponentSystemShowcase() {
  const [tab, setTab] = useState("brief")
  const [brief, setBrief] = useState(
    "Zen 香薰机上市：面向都市独居与失眠人群，强调「气味管理生活节奏」，先开官方商城。"
  )
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [style, setStyle] = useState(styles[0])
  const [conceptId, setConceptId] = useState<Concept["id"]>("A")
  const [activity, setActivity] = useState<Activity[]>([
    { id: "s1", time: now(), label: "组件树挂载完成" },
  ])
  const [busy, setBusy] = useState(false)
  const [generateState, setGenerateState] = useState<"idle" | "success" | "error">("idle")
  const [saveState, setSaveState] = useState<"idle" | "success" | "error">("idle")
  const [exportState, setExportState] = useState<"idle" | "success" | "error">("idle")

  function now() {
    return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const log = useCallback((label: string) => {
    setActivity((prev) => [{ id: Math.random().toString(36).slice(2), time: now(), label }, ...prev].slice(0, 14))
  }, [])

  const concept = useMemo(() => concepts.find((c) => c.id === conceptId) ?? concepts[0], [conceptId])

  useEffect(() => {
    log(`概念切换：${concept.name}`)
  }, [conceptId, concept.name, log])

  useEffect(() => {
    log(`参数变更：${audience} / ${channel} / ${tone} / ${style}`)
  }, [audience, channel, tone, style, log])

  const metrics = useMemo(() => {
    const toneMul = tone === "质感高级" ? 1.04 : tone === "温暖亲近" ? 1.02 : 1
    const styleMul = style === "苔绿" ? 1.03 : style === "雾灰" ? 0.98 : 1
    const channelMul = channel === "官方商城" ? 1.05 : channel === "礼品渠道" ? 1.03 : 1
    return {
      reach: Math.round(concept.reach * channelMul),
      ctr: Number((concept.ctr * toneMul).toFixed(1)),
      conversion: Number((concept.conversion * styleMul).toFixed(1)),
    }
  }, [concept, tone, style, channel])

  const runAsync = (
    setter: (v: "idle" | "success" | "error") => void,
    label: string,
    failChance = 0
  ) => {
    if (busy) return
    setBusy(true)
    setter("idle")
    log(`${label}：开始`)
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
  }

  const accent = useMemo(() => {
    switch (style) {
      case "岩米":
        return "text-amber-600 border-amber-300 bg-amber-50"
      case "黛蓝":
        return "text-blue-600 border-blue-300 bg-blue-50"
      case "苔绿":
        return "text-emerald-600 border-emerald-300 bg-emerald-50"
      default:
        return "text-slate-600 border-slate-300 bg-slate-50"
    }
  }, [style])

  const headline = concept.headline
  const subline = concept.subline

  return (
    <div className="min-h-screen bg-background p-3 text-foreground md:p-5">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-slate-900 text-white hover:bg-slate-800">DeepSeek V4 flash 0731</Badge>
            <Badge variant="outline" className="font-mono text-[11px]">
              shadcn-best-practices / shadcn
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings2 className="size-3.5" /> 统一设计令牌 · 一套组件
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">Zen 香薰机 · 组件化发布台</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => runAsync(setGenerateState, "生成创意", 0.08)} disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} 生成
                </Button>
                <Button
                  size="sm"
                  variant={saveState === "success" ? "secondary" : "outline"}
                  onClick={() => runAsync(setSaveState, "保存方案", 0.1)}
                  disabled={busy}
                >
                  {saveState === "success" ? <CheckCircle2 className="text-emerald-600" /> : <Save />} 保存
                </Button>
                <Button
                  size="sm"
                  variant={exportState === "success" ? "secondary" : "outline"}
                  onClick={() => runAsync(setExportState, "导出素材", 0.05)}
                  disabled={busy}
                >
                  {exportState === "success" ? <CheckCircle2 className="text-emerald-600" /> : <Download />} 导出
                </Button>
              </div>
            </div>
          </CardHeader>

          <Tabs value={tab} onValueChange={setTab} className="px-4 pb-4">
            <TabsList>
              <TabsTrigger value="brief">简报</TabsTrigger>
              <TabsTrigger value="concept">创意概念</TabsTrigger>
              <TabsTrigger value="metrics">预测指标</TabsTrigger>
              <TabsTrigger value="activity">最近操作</TabsTrigger>
            </TabsList>

            <TabsContent value="brief" className="pt-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {audiences.map((a) => (
                      <Badge key={a} variant={audience === a ? "default" : "outline"} className="cursor-pointer" onClick={() => setAudience(a)}>
                        {audience === a && <Check />} {a}
                      </Badge>
                    ))}
                  </div>
                  <Textarea
                    value={brief}
                    onChange={(e) => {
                      setBrief(e.target.value)
                      if (e.target.value.length % 20 === 0) log("简报更新")
                    }}
                    className="min-h-40 resize-y"
                    placeholder="产品 / 人群 / 卖点…"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">人群：{audience}</Badge>
                    <Badge variant="outline">渠道：{channel}</Badge>
                    <Badge variant="outline">语气：{tone}</Badge>
                    <Badge variant="outline">风格：{style}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <ControlRow label="投放渠道" options={channels} value={channel} onChange={setChannel} />
                  <ControlRow label="语气" options={tones} value={tone} onChange={setTone} />
                  <ControlRow label="视觉风格" options={styles} value={style} onChange={setStyle} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="concept" className="pt-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <Card className={`border-2 ${accent}`}>
                  <CardContent className="flex min-h-[360px] flex-col justify-between p-6 md:p-8">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{channel}</Badge>
                      <Badge variant="secondary">{concept.role}</Badge>
                    </div>
                    <div className="py-6">
                      <div className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {tone} · {audience}
                      </div>
                      <h2 className="mb-3 text-3xl font-bold leading-tight md:text-4xl">{headline}</h2>
                      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{subline}</p>
                    </div>
                    <Button className="w-fit">进入详情 <Wand2 /></Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">概念库</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">ID</TableHead>
                          <TableHead>概念</TableHead>
                          <TableHead className="text-right">选择</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {concepts.map((c) => (
                          <TableRow key={c.id} className={conceptId === c.id ? "bg-muted/60" : ""}>
                            <TableCell className="font-mono text-xs">{c.id}</TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.role}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant={conceptId === c.id ? "default" : "outline"} onClick={() => setConceptId(c.id)}>
                                {conceptId === c.id ? <><Check /> 已选</> : "选用"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="pt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard label="Reach" value={metrics.reach.toLocaleString()} unit="K" ratio={72} />
                <MetricCard label="CTR" value={metrics.ctr.toFixed(1)} unit="%" ratio={Math.min(metrics.ctr * 18, 100)} />
                <MetricCard label="Conversion" value={metrics.conversion.toFixed(1)} unit="%" ratio={Math.min(metrics.conversion * 24, 100)} />
              </div>
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="mb-2 text-sm font-medium">触达效率</div>
                  <Progress value={Math.min(metrics.ctr * 18, 100)} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardContent className="p-4">
                  {busy && (
                    <div className="space-y-2 pb-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-2/3" />
                    </div>
                  )}
                  <ul className="space-y-1.5">
                    {activity.map((a) => (
                      <li key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                        <span>{a.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">{a.time}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        <Separator className="my-4" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Wand2 className="size-3.5" /> 所有交互均使用同一套组件与状态规范
          </span>
          {generateState === "success" && (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircle2 className="size-3.5" /> 生成成功，组件状态已更新
            </span>
          )}
          {generateState === "error" && (
            <span className="flex items-center gap-1 text-red-600">
              <CircleX className="size-3.5" /> 生成失败，请检查输入
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ControlRow({
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
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <Button
            key={opt}
            size="xs"
            variant={value === opt ? "default" : "outline"}
            onClick={() => onChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ label, value, unit, ratio }: { label: string; value: string; unit: string; ratio: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold">
          {value}
          <span className="ml-0.5 text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        <Progress value={ratio} className="mt-3" />
      </CardContent>
    </Card>
  )
}
