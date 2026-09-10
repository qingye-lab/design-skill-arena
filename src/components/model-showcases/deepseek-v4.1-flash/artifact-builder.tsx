"use client"

import { useState } from "react"
import {
  Boxes,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileCode2,
  FileJson2,
  FolderOpen,
  Loader2,
  Package,
  Play,
  Terminal,
  TriangleAlert,
} from "lucide-react"

type BuildId = "A" | "B" | "C"

const MODEL = "DeepSeek V4.1 flash"
const SKILL = "web-artifacts-builder / artifacts-builder"

const builds: {
  id: BuildId
  entry: string
  name: string
  components: number
  bytes: string
  snippet: string
  reach: number
  ctr: number
  conversion: number
}[] = [
  {
    id: "A",
    entry: "campaign.spec.tsx",
    name: "单片式发布页",
    components: 6,
    bytes: "182 KB",
    snippet: "export const Campaign = () => <Hero variant=\"aurora\" />",
    reach: 875,
    ctr: 4.2,
    conversion: 2.9,
  },
  {
    id: "B",
    entry: "compare.table.tsx",
    name: "参数对比页",
    components: 9,
    bytes: "204 KB",
    snippet: "columns.map((c) => <Col spec={c} />) // 12 specs",
    reach: 812,
    ctr: 4.6,
    conversion: 3.4,
  },
  {
    id: "C",
    entry: "story.scroller.tsx",
    name: "滚动叙事页",
    components: 11,
    bytes: "236 KB",
    snippet: "useScroll(story.length, { snap: true })",
    reach: 928,
    ctr: 3.9,
    conversion: 3.0,
  },
]

const files = [
  { name: "campaign.spec.tsx", icon: FileCode2, depth: 1 },
  { name: "compare.table.tsx", icon: FileCode2, depth: 1 },
  { name: "story.scroller.tsx", icon: FileCode2, depth: 1 },
  { name: "tokens.json", icon: FileJson2, depth: 1 },
  { name: "assets/", icon: FolderOpen, depth: 0 },
]

const audiences = ["开发者", "技术决策者", "产品团队", "开源社区"]
const channels = ["文档站", "GitHub README", "发布博客", "技术会议"]
const tones = ["工程化", "简明直接", "克制技术", "热情布道"]
const signatures = ["暗色代码", "浅色文档", "终端绿", "高对比"]

type Phase = "idle" | "loading" | "success" | "error"

export default function ArtifactBuilderShowcase() {
  const [brief, setBrief] = useState(
    "构建一个可独立交付的 Aurora X1 发布 artifact：单文件产出、可交互、可直接部署，附带参数对比与滚动叙事。"
  )
  const [buildId, setBuildId] = useState<BuildId>("A")
  const [audience, setAudience] = useState(audiences[0])
  const [channel, setChannel] = useState(channels[0])
  const [tone, setTone] = useState(tones[0])
  const [signature, setSignature] = useState(signatures[0])
  const [phase, setPhase] = useState<Phase>("idle")
  const [logs, setLogs] = useState<string[]>([
    "$ artifacts init --template campaign",
    "✔ tokens.json 已挂载",
    "✔ 预览沙箱就绪",
  ])
  const [exported, setExported] = useState(false)

  const build = builds.find((item) => item.id === buildId) ?? builds[0]

  function log(line: string) {
    setLogs((prev) => [...prev.slice(-8), line])
  }

  const reach = Math.round(build.reach * (channel === "文档站" ? 1.04 : 1))
  const ctr = Number((build.ctr * (tone === "简明直接" ? 1.03 : 1)).toFixed(1))
  const conversion = Number((build.conversion * (signature === "高对比" ? 1.02 : 1)).toFixed(1))

  function runBuild() {
    if (phase === "loading") return
    setPhase("loading")
    log(`$ pnpm build ${build.entry}`)
    window.setTimeout(() => {
      const failed = Math.random() < 0.12
      setPhase(failed ? "error" : "success")
      if (failed) {
        log("✖ 构建失败：artifact 体积超出沙箱上限")
      } else {
        log(`✔ 构建完成 · ${build.bytes} · ${build.components} 个组件`)
      }
    }, 1350)
  }

  return (
    <div className="min-h-screen bg-[#0f1115] font-mono text-[13px] text-zinc-300">
      <div className="mx-auto max-w-[1480px] p-3 md:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2 py-1 text-zinc-200">
            <Boxes className="size-3.5" /> {MODEL}
          </span>
          <span className="rounded-md border border-zinc-700 px-2 py-1">{SKILL}</span>
          <span className="hidden sm:inline">Artifact Builder · workbench</span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="rounded-lg border border-zinc-800 bg-[#14171c] p-3">
            <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-500">
              Explorer <ChevronDown className="size-3" />
            </div>
            <ul className="space-y-0.5">
              {files.map((file) => {
                const Icon = file.icon
                const active = file.name === build.entry
                return (
                  <li key={file.name}>
                    <button
                      type="button"
                      onClick={() => {
                        const match = builds.find((item) => item.entry === file.name)
                        if (match) {
                          setBuildId(match.id)
                          log(`$ open ${file.name}`)
                        }
                      }}
                      className={`flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400/40 ${
                        active ? "bg-emerald-500/10 text-emerald-200" : "text-zinc-400 hover:bg-zinc-800/70"
                      }`}
                      style={{ paddingLeft: `${8 + file.depth * 12}px` }}
                    >
                      <Icon className="size-3.5 shrink-0" /> {file.name}
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 border-t border-zinc-800 pt-3">
              <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Artifact</div>
              <div className="space-y-1.5 text-[11px] text-zinc-400">
                <div className="flex justify-between">
                  <span>components</span>
                  <span className="text-zinc-200">{build.components}</span>
                </div>
                <div className="flex justify-between">
                  <span>bundle</span>
                  <span className="text-zinc-200">{build.bytes}</span>
                </div>
                <div className="flex justify-between">
                  <span>sandbox</span>
                  <span className="text-emerald-300">ready</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#14171c] p-2">
              {builds.map((item) => {
                const active = item.id === buildId
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setBuildId(item.id)
                      log(`$ switch --target ${item.id}`)
                    }}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400/40 ${
                      active
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200"
                    }`}
                  >
                    <span className="text-[10px]">{item.id}</span>
                    {item.name}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={runBuild}
                disabled={phase === "loading"}
                className="ml-auto inline-flex items-center gap-1.5 rounded bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {phase === "loading" ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
                构建
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 border-b border-zinc-800 bg-[#14171c] px-3 py-2 text-[11px] text-zinc-500">
                <FileCode2 className="size-3.5" /> {build.entry}
                <span className="ml-auto inline-flex items-center gap-1 text-emerald-300">
                  <CircleDot className="size-3" /> preview
                </span>
              </div>
              <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <pre className="overflow-x-auto border-b border-zinc-800 bg-[#0d1014] p-4 text-[12px] leading-relaxed text-zinc-400 md:border-b-0 md:border-r">
                  <code>{`import { Hero, Spec, CTA } from "@aurora/ui"

${build.snippet}

export default function Page() {
  return (
    <main data-variant="${build.id}">
      <Hero tone="${tone}" />
      <Spec audience="${audience}" />
      <CTA channel="${channel}" />
    </main>
  )
}`}</code>
                </pre>
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Rendered artifact</div>
                  <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/60 p-4">
                    <div className="text-lg font-semibold text-zinc-100">
                      {build.name}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">{build.components} 个组件 · {build.bytes}</div>
                    <div className="mt-4 h-16 rounded bg-gradient-to-r from-emerald-500/20 to-sky-500/10" />
                    <div className="mt-3 flex gap-2">
                      <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">{audience}</span>
                      <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400">{signature}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-[#14171c] p-3">
              <label htmlFor="brief-ab41" className="mb-2 block text-[11px] uppercase tracking-widest text-zinc-500">
                brief.config
              </label>
              <textarea
                id="brief-ab41"
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                className="min-h-20 w-full resize-y rounded border border-zinc-700 bg-[#0d1014] p-3 text-[12px] leading-relaxed text-zinc-200 outline-none transition-colors focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>

            <div className="rounded-lg border border-zinc-800 bg-[#0d1014] p-3">
              <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-500">
                <Terminal className="size-3.5" /> output
              </div>
              <pre className="max-h-36 overflow-y-auto text-[11px] leading-relaxed text-zinc-400">
                {logs.map((line, index) => (
                  <div key={`${line}-${index}`} className={line.startsWith("✖") ? "text-rose-400" : line.startsWith("✔") ? "text-emerald-300" : "text-zinc-400"}>
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          </div>

          <div className="space-y-3">
            <section className="rounded-lg border border-zinc-800 bg-[#14171c] p-3">
              <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Metrics</div>
              <div className="space-y-2">
                <Meter label="Reach" value={`${reach}K`} pct={Math.min(reach / 10, 100)} />
                <Meter label="CTR" value={`${ctr}%`} pct={Math.min(ctr * 18, 100)} />
                <Meter label="Conversion" value={`${conversion}%`} pct={Math.min(conversion * 28, 100)} />
              </div>
            </section>

            <section className="rounded-lg border border-zinc-800 bg-[#14171c] p-3">
              <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Config</div>
              <Config label="audience" options={audiences} value={audience} onChange={setAudience} />
              <Config label="channel" options={channels} value={channel} onChange={setChannel} />
              <Config label="tone" options={tones} value={tone} onChange={setTone} />
              <Config label="signature" options={signatures} value={signature} onChange={setSignature} />
            </section>

            <section className="rounded-lg border border-zinc-800 bg-[#14171c] p-3">
              <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-500">
                <Package className="size-3.5" /> Export
              </div>
              <button
                type="button"
                onClick={() => {
                  setExported(true)
                  log("✔ artifact.zip 已生成")
                }}
                className="w-full rounded bg-zinc-800 px-3 py-2 text-xs text-zinc-200 transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-emerald-400/40"
              >
                {exported ? "已导出 artifact.zip" : "导出 artifact.zip"}
              </button>
              <button
                type="button"
                onClick={() => log("✔ 已保存到本地 workspace")}
                className="mt-2 w-full rounded border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-zinc-800/60"
              >
                保存到 workspace
              </button>
            </section>

            {phase === "error" && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] text-rose-300">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" /> 构建失败：请缩减组件数量或压缩资源后重试。
              </div>
            )}
            {phase === "success" && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-[11px] text-emerald-300">
                <CircleDot className="size-3.5" /> 构建通过，artifact 可独立部署。
              </div>
            )}

            <section className="rounded-lg border border-zinc-800 bg-[#14171c] p-3">
              <div className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Recent</div>
              <ul className="space-y-1 text-[11px] text-zinc-400">
                {["aurora-launch v3", "spec-compare v2", "story-scroll v1"].map((item, index) => (
                  <li key={item} className="flex items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-zinc-800/60">
                    <span className="inline-flex items-center gap-1.5">
                      <ChevronRight className="size-3" /> {item}
                    </span>
                    <span className="text-zinc-600">{index === 0 ? "当前" : "已存档"}</span>
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

function Meter({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px]">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-200">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Config({
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
    <div className="mb-2.5 last:mb-0">
      <div className="mb-1 text-[10px] text-zinc-500">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded border px-2 py-1 text-[10px] transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400/40 ${
              value === option
                ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
