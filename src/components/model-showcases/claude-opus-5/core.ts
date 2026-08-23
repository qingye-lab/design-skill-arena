"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export const MODEL_LABEL = "Claude Opus 5"

export type ConceptId = "A" | "B" | "C"

export type Concept = {
  id: ConceptId
  name: string
  headline: string
  sub: string
  reach: number
  ctr: number
  conv: number
}

export type Controls = {
  audiences: string[]
  channels: string[]
  tones: string[]
  styles: string[]
}

export type MuseSpec = {
  chain: string
  brief: string
  controls: Controls
  concepts: [Concept, Concept, Concept]
  activity: string[]
}

export type Phase = "idle" | "loading" | "success" | "error"

export type ControlKey = "audience" | "channel" | "tone" | "style"

function fold(value: string) {
  let hash = 7
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) % 100003
  }
  return hash
}

export function useMuse(spec: MuseSpec) {
  const [brief, setBrief] = useState(spec.brief)
  const [audience, setAudience] = useState(spec.controls.audiences[0])
  const [channel, setChannel] = useState(spec.controls.channels[0])
  const [tone, setTone] = useState(spec.controls.tones[0])
  const [style, setStyle] = useState(spec.controls.styles[0])
  const [conceptId, setConceptId] = useState<ConceptId>("A")
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const [saved, setSaved] = useState(false)
  const [exported, setExported] = useState(false)
  const [log, setLog] = useState<string[]>(spec.activity)
  const [revision, setRevision] = useState(1)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const handles = timers.current
    return () => {
      handles.forEach((handle) => window.clearTimeout(handle))
    }
  }, [])

  const note = useCallback((entry: string) => {
    setLog((current) => [entry, ...current].slice(0, 7))
  }, [])

  const concept = useMemo(
    () => spec.concepts.find((item) => item.id === conceptId) ?? spec.concepts[0],
    [conceptId, spec.concepts]
  )

  const selectConcept = useCallback(
    (id: ConceptId) => {
      if (id === conceptId) return
      setConceptId(id)
      const next = spec.concepts.find((item) => item.id === id)
      note(`Route ${id}${next ? ` · ${next.name}` : ""} promoted to hero`)
      if (phase === "error") setPhase("idle")
    },
    [conceptId, note, phase, spec.concepts]
  )

  const setControl = useCallback(
    (key: ControlKey, value: string) => {
      const apply = { audience: setAudience, channel: setChannel, tone: setTone, style: setStyle }
      apply[key](value)
      setRevision((current) => current + 1)
      setSaved(false)
      setExported(false)
      note(`${key[0].toUpperCase()}${key.slice(1)} → ${value}`)
    },
    [note]
  )

  const generate = useCallback(() => {
    if (phase === "loading") return
    const thin = brief.trim().length < 28
    setPhase("loading")
    setProgress(8)
    setSaved(false)
    note("Generation pass started")
    const steps = [26, 52, 74, 91]
    steps.forEach((value, index) => {
      timers.current.push(
        window.setTimeout(() => setProgress(value), 220 * (index + 1))
      )
    })
    timers.current.push(
      window.setTimeout(() => {
        setProgress(100)
        if (thin) {
          setPhase("error")
          note("Generation halted · brief under 28 characters")
        } else {
          setPhase("success")
          setRevision((current) => current + 1)
          note("Forecast rebuilt across all three routes")
        }
      }, 1350)
    )
  }, [brief, note, phase])

  const save = useCallback(() => {
    setSaved(true)
    note(`Revision r${revision} saved to workspace`)
  }, [note, revision])

  const exportCampaign = useCallback(() => {
    setExported(true)
    note("Export bundle assembled (mock)")
  }, [note])

  const reset = useCallback(() => {
    setPhase("idle")
    setProgress(0)
  }, [])

  const seed = useMemo(
    () => fold(`${brief}|${audience}|${channel}|${tone}|${style}|${conceptId}`),
    [audience, brief, channel, conceptId, style, tone]
  )

  const lift = phase === "success" ? 34 : 0
  const metrics = useMemo(
    () => ({
      reach: Math.max(40, Math.round(concept.reach + (seed % 120) - 55 + lift)),
      ctr: Math.max(0.6, Math.round((concept.ctr + ((seed % 18) - 8) / 10) * 10) / 10),
      conv: Math.max(0.4, Math.round((concept.conv + ((seed % 12) - 6) / 10) * 10) / 10),
    }),
    [concept.conv, concept.ctr, concept.reach, lift, seed]
  )

  const confidence = Math.min(98, 54 + (seed % 34) + (phase === "success" ? 8 : 0))

  return {
    modelName: MODEL_LABEL,
    chain: spec.chain,
    spec,
    brief,
    setBrief,
    audience,
    channel,
    tone,
    style,
    setControl,
    concept,
    conceptId,
    selectConcept,
    phase,
    progress,
    generate,
    reset,
    saved,
    save,
    exported,
    exportCampaign,
    log,
    metrics,
    revision,
    confidence,
    seed,
  }
}

export type MuseState = ReturnType<typeof useMuse>

export const phaseCopy: Record<Phase, { label: string; detail: string }> = {
  idle: { label: "Draft", detail: "Brief is editable. Nothing generated yet." },
  loading: { label: "Generating", detail: "Sampling routes and rebuilding the forecast." },
  success: { label: "Ready", detail: "Forecast rebuilt for the selected route." },
  error: { label: "Needs detail", detail: "Brief needs more substance before a forecast can run." },
}
