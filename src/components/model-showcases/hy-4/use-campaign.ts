"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  AUDIENCES,
  CHANNELS,
  CONCEPTS,
  DEFAULT_BRIEF,
  INITIAL_ACTIVITY,
  MIN_BRIEF,
  STYLES,
  TONES,
  clockNow,
  conceptById,
  forecast,
  type ActivityEntry,
  type AudienceId,
  type ChannelId,
  type ConceptId,
  type Concept,
  type Forecast,
  type StyleId,
  type ToneId,
} from "./campaign-data"

/**
 * The whole local interaction model for a Muse workspace: brief editing,
 * audience / channel / tone / style controls, concept switching, a simulated
 * generate run with loading, success and failure, save and export, and a recent
 * activity feed. Every Hy4 page wires this into a different interface.
 */
export function useCampaignStudio() {
  const [brief, setBrief] = useState(DEFAULT_BRIEF)
  const [audience, setAudience] = useState<AudienceId>("gym")
  const [channel, setChannel] = useState<ChannelId>("instagram")
  const [tone, setTone] = useState<ToneId>("direct")
  const [style, setStyle] = useState<StyleId>("studio")
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [saved, setSaved] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [activity, setActivity] = useState<ActivityEntry[]>(INITIAL_ACTIVITY)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const runCount = useRef(0)
  const nextEntryId = useRef(100)

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
    }
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const log = useCallback((text: string) => {
    nextEntryId.current += 1
    const entry: ActivityEntry = { id: nextEntryId.current, time: clockNow(), text }
    setActivity((prev) => [entry, ...prev].slice(0, 8))
  }, [])

  useEffect(() => {
    if (!exportOpen) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (!target?.closest?.("[data-export-root]")) setExportOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [exportOpen])

  const concept: Concept = conceptById(conceptId)
  const audienceRecord = AUDIENCES.find((a) => a.id === audience) ?? AUDIENCES[0]
  const channelRecord = CHANNELS.find((c) => c.id === channel) ?? CHANNELS[0]
  const toneRecord = TONES.find((t) => t.id === tone) ?? TONES[0]
  const styleRecord = STYLES.find((s) => s.id === style) ?? STYLES[0]
  const metrics: Forecast = forecast(concept, audience, channel, tone, style)
  const briefTooShort = brief.trim().length < MIN_BRIEF

  const generate = useCallback(() => {
    setExportOpen(false)
    setStatus("loading")
    runCount.current += 1
    // Deterministic failure rule: an under-length brief always fails, and every
    // fourth run fails so the error state can be exercised without editing copy.
    const willFail = brief.trim().length < MIN_BRIEF || runCount.current % 4 === 0
    later(() => {
      if (willFail) {
        setStatus("error")
        log(
          brief.trim().length < MIN_BRIEF
            ? `Generate failed · brief under ${MIN_BRIEF} characters`
            : "Generate failed · model timed out after 30s"
        )
      } else {
        setStatus("success")
        log(`Concept ${conceptId} regenerated for ${channelRecord.label}`)
        later(() => setStatus((current) => (current === "success" ? "idle" : current)), 3200)
      }
    }, 1400)
  }, [brief, channelRecord.label, conceptId, later, log])

  const save = useCallback(() => {
    if (saved) return
    setSaved(true)
    log(`Draft saved · concept ${conceptId}, ${toneRecord.label.toLowerCase()} tone`)
    later(() => setSaved(false), 2000)
  }, [conceptId, later, log, saved, toneRecord.label])

  const exportAs = useCallback(
    (kind: string) => {
      setExportOpen(false)
      log(`Exported concept ${conceptId} as ${kind}`)
    },
    [conceptId, log]
  )

  const selectConcept = useCallback(
    (id: ConceptId) => {
      if (id === conceptId) return
      setConceptId(id)
      log(`Switched to concept ${id} · ${conceptById(id).name}`)
    },
    [conceptId, log]
  )

  return {
    brief,
    setBrief,
    briefTooShort,
    audience,
    setAudience,
    audienceRecord,
    channel,
    setChannel,
    channelRecord,
    tone,
    setTone,
    toneRecord,
    style,
    setStyle,
    styleRecord,
    concept,
    conceptId,
    setConceptId,
    selectConcept,
    concepts: CONCEPTS,
    status,
    generate,
    saved,
    save,
    exportOpen,
    setExportOpen,
    exportAs,
    activity,
    log,
    metrics,
  }
}

export type CampaignStudio = ReturnType<typeof useCampaignStudio>

/** Shared mobile panel switch for pages that collapse side rails into tabs. */
export function useMobilePanel<T extends string>(initial: T) {
  return useState<T>(initial)
}
