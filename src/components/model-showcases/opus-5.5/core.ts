"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"

import { MODEL_NAME, MODEL_SLUG, chainLabel, showcaseSkills, type ShowcaseId } from "./meta"

/*
 * Shared local state for the Opus 5.5 Muse pages. This file owns behaviour only:
 * every page draws its own interface on top of it.
 */

export type VariantId = "A" | "B" | "C"
export const VARIANT_IDS: readonly VariantId[] = ["A", "B", "C"]

export type ControlKey = "audience" | "channel" | "tone" | "style"

/** Multipliers applied to the simulated forecast. Missing values count as 1. */
export type Lift = { reach?: number; ctr?: number; conversion?: number }

export type Option = {
  id: string
  label: string
  hint?: string
  lift?: Lift
  /** Audience only: people reachable at a 1× channel multiplier. */
  size?: number
}

export type VariantSpec = {
  id: VariantId
  name: string
  /** Copy may use {product} {audience} {channel} {tone} {style} tokens. */
  headline: string
  body: string
  cta: string
  note?: string
  lift?: Lift
}

export type Settings = {
  brief: string
  audience: string
  channel: string
  tone: string
  style: string
}

export type RecentCampaign = {
  id: string
  title: string
  variant: VariantId
  when: string
  settings: Settings
  saved?: boolean
}

export type StudioSpec = {
  showcaseId: ShowcaseId
  product: string
  brief: string
  audiences: Option[]
  channels: Option[]
  tones: Option[]
  styles: Option[]
  variants: [VariantSpec, VariantSpec, VariantSpec]
  /** Seeded history shown before the visitor saves anything. */
  recent: Omit<RecentCampaign, "settings" | "saved">[]
  /** Run number of the output already on screen when the page opens. */
  initialRun?: number
  initialVariant?: VariantId
}

export type Metrics = { reach: number; ctr: number; conversion: number }

export type RenderedVariant = {
  id: VariantId
  name: string
  headline: string
  body: string
  cta: string
  note?: string
  metrics: Metrics
}

export type Output = {
  run: number
  at: string
  settings: Settings
  variants: Record<VariantId, RenderedVariant>
}

export type GenerateStatus = "idle" | "loading" | "success" | "error"
export type SaveStatus = "idle" | "saving" | "saved" | "error"
export type ExportStatus = "idle" | "exporting" | "exported" | "error"

export type LogEntry = {
  id: number
  at: string
  text: string
  tone: "info" | "success" | "error"
}

export type ExportFile = { filename: string; mime: string; content: string }

export const BRIEF_MIN = 24
export const BRIEF_MAX = 480

export const GENERATION_STAGES = [
  "Reading the brief",
  "Drafting routes A, B and C",
  "Simulating reach and response",
  "Composing the preview",
] as const

const STAGE_MS = 420
const SAVE_MS = 650
const EXPORT_MS = 550

/* ---------- pure helpers ---------- */

function fold(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967295
}

function lift(option: Option | VariantSpec | undefined, key: keyof Lift) {
  return option?.lift?.[key] ?? 1
}

function find(options: Option[], id: string) {
  return options.find((option) => option.id === id) ?? options[0]
}

export function briefIssue(brief: string): string | null {
  const length = brief.trim().length
  if (length === 0) return "Write a brief first: what is launching, for whom, and when."
  if (length < BRIEF_MIN)
    return `Brief is ${length} characters. Add at least ${BRIEF_MIN - length} more so Muse knows what is launching.`
  if (length > BRIEF_MAX) return `Brief is ${length - BRIEF_MAX} characters over the ${BRIEF_MAX} limit. Trim it before generating.`
  return null
}

function fill(template: string, spec: StudioSpec, settings: Settings) {
  const words: Record<string, string> = {
    product: spec.product,
    audience: find(spec.audiences, settings.audience).label.toLowerCase(),
    channel: find(spec.channels, settings.channel).label,
    tone: find(spec.tones, settings.tone).label.toLowerCase(),
    style: find(spec.styles, settings.style).label.toLowerCase(),
  }
  return template.replace(/\{(product|audience|channel|tone|style)\}/g, (_, key: string) => words[key])
}

export function forecast(spec: StudioSpec, settings: Settings, variant: VariantSpec, run: number): Metrics {
  const audience = find(spec.audiences, settings.audience)
  const channel = find(spec.channels, settings.channel)
  const tone = find(spec.tones, settings.tone)
  const style = find(spec.styles, settings.style)
  const factors = [audience, channel, tone, style]
  const product = (key: keyof Lift) =>
    factors.reduce((total, option) => total * lift(option, key), lift(variant, key))
  const briefLength = Math.min(settings.brief.trim().length, 320)
  const briefQuality = 0.9 + (briefLength / 320) * 0.16
  const jitter = fold(`${JSON.stringify(settings)}|${variant.id}|${run}`)

  return {
    reach: Math.round((audience.size ?? 420000) * product("reach") * (0.93 + jitter * 0.14)),
    ctr: Math.round(1.7 * product("ctr") * briefQuality * (0.95 + jitter * 0.1) * 100) / 100,
    conversion: Math.round(3.1 * product("conversion") * briefQuality * (0.96 + (1 - jitter) * 0.08) * 100) / 100,
  }
}

export function renderOutput(spec: StudioSpec, settings: Settings, run: number, at: string): Output {
  const variants = {} as Record<VariantId, RenderedVariant>
  for (const variant of spec.variants) {
    variants[variant.id] = {
      id: variant.id,
      name: variant.name,
      headline: fill(variant.headline, spec, settings),
      body: fill(variant.body, spec, settings),
      cta: fill(variant.cta, spec, settings),
      note: variant.note ? fill(variant.note, spec, settings) : undefined,
      metrics: forecast(spec, settings, variant, run),
    }
  }
  return { run, at, settings, variants }
}

function sameSettings(a: Settings, b: Settings) {
  return (
    a.brief.trim() === b.brief.trim() &&
    a.audience === b.audience &&
    a.channel === b.channel &&
    a.tone === b.tone &&
    a.style === b.style
  )
}

function clock() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
}

export function formatReach(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 10_000) return `${Math.round(value / 1000)}K`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return String(value)
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`
}

export function formatDelta(current: number, previous: number | undefined, kind: "reach" | "percent") {
  if (previous === undefined || previous === 0) return null
  const change = current - previous
  if (Math.abs(change) < (kind === "reach" ? 1 : 0.005)) return "±0"
  const sign = change > 0 ? "+" : "−"
  return kind === "reach"
    ? `${sign}${formatReach(Math.abs(change))}`
    : `${sign}${Math.abs(change).toFixed(2)} pt`
}

/* ---------- saved campaigns (localStorage) ---------- */

const storageListeners = new Set<() => void>()

function subscribeStorage(listener: () => void) {
  storageListeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    storageListeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  window.localStorage.setItem(key, value)
  storageListeners.forEach((listener) => listener())
}

function parseSaved(raw: string | null): RecentCampaign[] {
  if (!raw) return []
  try {
    const value = JSON.parse(raw) as unknown
    return Array.isArray(value) ? (value as RecentCampaign[]) : []
  } catch {
    return []
  }
}

/* ---------- the hook ---------- */

export function useMuseStudio(spec: StudioSpec) {
  const defaults = useMemo<Settings>(
    () => ({
      brief: spec.brief,
      audience: spec.audiences[0].id,
      channel: spec.channels[0].id,
      tone: spec.tones[0].id,
      style: spec.styles[0].id,
    }),
    [spec]
  )

  const [settings, setSettings] = useState<Settings>(defaults)
  const [selected, setSelected] = useState<VariantId>(spec.initialVariant ?? "A")
  const [output, setOutput] = useState<Output>(() => renderOutput(spec, defaults, spec.initialRun ?? 1, "09:40"))
  const [previous, setPrevious] = useState<Output | null>(null)
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle")
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [stage, setStage] = useState(0)
  const [failNext, setFailNext] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle")
  const [exportError, setExportError] = useState<string | null>(null)
  const [log, setLog] = useState<LogEntry[]>(() => [
    { id: 2, at: "09:40", text: `Run ${spec.initialRun ?? 1} generated for ${spec.product}`, tone: "success" },
    { id: 1, at: "09:38", text: "Workspace opened", tone: "info" },
  ])
  const timers = useRef<number[]>([])
  const logId = useRef(3)

  const storageKey = `muse:${MODEL_SLUG}:${spec.showcaseId}`
  const savedRaw = useSyncExternalStore(
    subscribeStorage,
    () => readStorage(storageKey),
    () => null
  )
  const saved = useMemo(() => parseSaved(savedRaw), [savedRaw])

  useEffect(() => {
    const handles = timers.current
    return () => handles.forEach((handle) => window.clearTimeout(handle))
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const note = useCallback((text: string, tone: LogEntry["tone"] = "info") => {
    const id = logId.current
    logId.current += 1
    setLog((current) => [{ id, at: clock(), text, tone }, ...current].slice(0, 8))
  }, [])

  const touch = useCallback(() => {
    setSaveStatus((status) => (status === "saved" || status === "error" ? "idle" : status))
    setExportStatus((status) => (status === "exported" || status === "error" ? "idle" : status))
    setGenerateStatus((status) => (status === "success" || status === "error" ? "idle" : status))
  }, [])

  const setBrief = useCallback(
    (brief: string) => {
      setSettings((current) => ({ ...current, brief }))
      touch()
    },
    [touch]
  )

  const setControl = useCallback(
    (key: ControlKey, id: string) => {
      setSettings((current) => (current[key] === id ? current : { ...current, [key]: id }))
      touch()
    },
    [touch]
  )

  const select = useCallback(
    (id: VariantId) => {
      setSelected(id)
      setExportStatus((status) => (status === "exported" || status === "error" ? "idle" : status))
    },
    []
  )

  const issue = briefIssue(settings.brief)
  const stale = !sameSettings(settings, output.settings)
  const busy = generateStatus === "loading"

  const generate = useCallback(() => {
    if (busy) return
    const problem = briefIssue(settings.brief)
    if (problem) {
      setGenerateStatus("error")
      setGenerateError(problem)
      note("Generation blocked: brief needs work", "error")
      return
    }
    const snapshot = { ...settings }
    const willFail = failNext
    setGenerateStatus("loading")
    setGenerateError(null)
    setStage(0)
    note(`Run ${output.run + 1} started`)
    GENERATION_STAGES.forEach((_, index) => {
      if (index > 0) later(() => setStage(index), STAGE_MS * index)
    })
    later(() => {
      if (willFail) {
        setFailNext(false)
        setGenerateStatus("error")
        setGenerateError(
          "The forecast service did not answer within 2 seconds. Your brief and controls are unchanged; run it again."
        )
        note(`Run ${output.run + 1} failed: forecast service timed out`, "error")
        return
      }
      const next = renderOutput(spec, snapshot, output.run + 1, clock())
      setPrevious(output)
      setOutput(next)
      setGenerateStatus("success")
      note(`Run ${next.run} ready: three routes forecast`, "success")
    }, STAGE_MS * GENERATION_STAGES.length)
  }, [busy, failNext, later, note, output, settings, spec])

  const save = useCallback(() => {
    if (saveStatus === "saving") return
    const problem = briefIssue(settings.brief)
    if (problem) {
      setSaveStatus("error")
      setSaveError("Nothing to save yet. " + problem)
      note("Save blocked: brief is incomplete", "error")
      return
    }
    setSaveStatus("saving")
    setSaveError(null)
    const variant = output.variants[selected]
    later(() => {
      const entry: RecentCampaign = {
        id: `${Date.now()}`,
        title: variant.headline,
        variant: selected,
        when: clock(),
        settings: { ...settings },
        saved: true,
      }
      try {
        const next = [entry, ...parseSaved(readStorage(storageKey))].slice(0, 6)
        writeStorage(storageKey, JSON.stringify(next))
        setSaveStatus("saved")
        note(`Saved route ${selected}: “${variant.name}”`, "success")
      } catch {
        setSaveStatus("error")
        setSaveError("This browser blocked local storage, so the campaign was not saved. Export a file instead.")
        note("Save failed: local storage unavailable", "error")
      }
    }, SAVE_MS)
  }, [later, note, output.variants, saveStatus, selected, settings, storageKey])

  const exportCampaign = useCallback(
    (build?: (payload: { output: Output; variant: RenderedVariant; spec: StudioSpec }) => ExportFile) => {
      if (exportStatus === "exporting") return
      if (stale) {
        setExportStatus("error")
        setExportError("The preview is out of date. Generate again so the exported file matches what you see.")
        note("Export blocked: preview is out of date", "error")
        return
      }
      setExportStatus("exporting")
      setExportError(null)
      const variant = output.variants[selected]
      later(() => {
        const file = build
          ? build({ output, variant, spec })
          : {
              filename: `muse-${spec.showcaseId}-run${output.run}-${selected}.json`,
              mime: "application/json",
              content: JSON.stringify(
                {
                  model: MODEL_NAME,
                  chain: chainLabel(spec.showcaseId),
                  product: spec.product,
                  run: output.run,
                  settings: output.settings,
                  selected: variant,
                  alternatives: VARIANT_IDS.filter((id) => id !== selected).map((id) => output.variants[id]),
                  note: "Simulated forecast generated locally in the browser.",
                },
                null,
                2
              ),
            }
        try {
          const url = URL.createObjectURL(new Blob([file.content], { type: file.mime }))
          const anchor = document.createElement("a")
          anchor.href = url
          anchor.download = file.filename
          anchor.rel = "noopener"
          document.body.appendChild(anchor)
          anchor.click()
          anchor.remove()
          window.setTimeout(() => URL.revokeObjectURL(url), 1000)
          setExportStatus("exported")
          note(`Exported ${file.filename}`, "success")
        } catch {
          setExportStatus("error")
          setExportError("The browser refused the download. Allow downloads for this page and export again.")
          note("Export failed: download refused", "error")
        }
      }, EXPORT_MS)
    },
    [exportStatus, later, note, output, selected, spec, stale]
  )

  const restore = useCallback(
    (campaign: RecentCampaign) => {
      setSettings({ ...campaign.settings })
      setSelected(campaign.variant)
      touch()
      note(`Restored “${campaign.title}”`)
    },
    [note, touch]
  )

  const reset = useCallback(() => {
    setSettings(defaults)
    touch()
    note("Controls reset to the launch defaults")
  }, [defaults, note, touch])

  const recent = useMemo<RecentCampaign[]>(() => {
    const seeded = spec.recent.map((item, index) => ({
      ...item,
      settings: {
        brief: spec.brief,
        audience: spec.audiences[index % spec.audiences.length].id,
        channel: spec.channels[(index + 1) % spec.channels.length].id,
        tone: spec.tones[index % spec.tones.length].id,
        style: spec.styles[(index + 2) % spec.styles.length].id,
      },
    }))
    return [...saved, ...seeded].slice(0, 6)
  }, [saved, spec])

  const current = output.variants[selected]
  const before = previous?.variants[selected]

  const labelOf = useCallback(
    (key: ControlKey, id: string = settings[key]) => {
      const list = { audience: spec.audiences, channel: spec.channels, tone: spec.tones, style: spec.styles }[key]
      return find(list, id).label
    },
    [settings, spec]
  )

  return {
    modelName: MODEL_NAME,
    chain: chainLabel(spec.showcaseId),
    skills: showcaseSkills[spec.showcaseId],
    spec,
    settings,
    setBrief,
    setControl,
    labelOf,
    issue,
    stale,
    busy,
    selected,
    select,
    output,
    current,
    previous: before,
    generate,
    generateStatus,
    generateError,
    stage,
    stageLabel: GENERATION_STAGES[stage],
    progress: busy ? Math.round(((stage + 1) / GENERATION_STAGES.length) * 100) : 100,
    failNext,
    setFailNext,
    save,
    saveStatus,
    saveError,
    exportCampaign,
    exportStatus,
    exportError,
    recent,
    restore,
    reset,
    log,
  }
}

export type MuseStudio = ReturnType<typeof useMuseStudio>
