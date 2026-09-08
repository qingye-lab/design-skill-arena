"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { Check, ChevronDown, Copy, X } from "lucide-react"
import type { ArenaLocale } from "@/lib/arena-gallery"
import { arenaCopy } from "./arena-copy"
import styles from "./arena.module.css"

export function SearchFilter({ label, value, options, searchLabel, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; searchLabel: string; onChange: (value: string) => void
}) {
  const [query, setQuery] = useState("")
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const close = (event: PointerEvent) => { if (ref.current?.open && !ref.current.contains(event.target as Node)) ref.current.open = false }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [])
  return <details className={styles.filter} ref={ref} onKeyDown={(event) => {
    if (event.key === "Escape" && ref.current) { ref.current.open = false; ref.current.querySelector("summary")?.focus(); event.stopPropagation() }
  }} onToggle={(event) => { if (!event.currentTarget.open) setQuery("") }}>
    <summary aria-label={`${label}: ${options.find((option) => option.value === value)?.label}`}><span>{options.find((option) => option.value === value)?.label ?? label}</span><ChevronDown size={13} /></summary>
    <div className={styles.filterPanel}>
      <input type="search" autoComplete="off" aria-label={searchLabel} placeholder={searchLabel} value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className={styles.filterOptions}>
        {options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())).map((option) => <button key={option.value} aria-pressed={value === option.value} onClick={() => {
          onChange(option.value)
          if (ref.current) { ref.current.open = false; ref.current.querySelector("summary")?.focus() }
        }}>{option.label}{value === option.value && <Check size={13} />}</button>)}
      </div>
    </div>
  </details>
}

export function CopyButton({ value, label, locale, className = styles.button }: {
  value: string | (() => string); label: string; locale: ArenaLocale; className?: string
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  const [fallback, setFallback] = useState("")
  const text = arenaCopy(locale)
  useEffect(() => { if (status !== "copied") return; const timer = setTimeout(() => setStatus("idle"), 1800); return () => clearTimeout(timer) }, [status])
  return <>
    <button className={className} onClick={async () => {
      const content = typeof value === "function" ? value() : value
      try { await navigator.clipboard.writeText(content); setStatus("copied") }
      catch { setFallback(content); setStatus("error") }
    }} aria-label={status === "copied" ? text.copied : label} title={label}>
      {status === "copied" ? <Check size={14} /> : <Copy size={14} />}<span>{status === "copied" ? text.copied : label}</span>
    </button>
    {status === "error" && <div role="status" className={styles.copyBlock}><p>{text.copyFailed}</p><textarea aria-label={label} readOnly value={fallback} onFocus={(event) => event.target.select()} className={styles.promptText} /></div>}
  </>
}

export function ArenaDialog({ title, subtitle, children, onClose, locale, compact = false }: {
  title: string; subtitle?: string; children: ReactNode; onClose: () => void; locale: ArenaLocale; compact?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const id = useId()
  useEffect(() => {
    const dialog = ref.current
    const originalFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = "hidden"
    heading.current?.focus({ preventScroll: true })
    return () => {
      dialog?.close()
      document.body.style.overflow = originalOverflow
      if (originalFocus?.isConnected) originalFocus.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={ref} aria-labelledby={id} className={`${styles.dialog} ${compact ? styles.promptDialog : ""}`} onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }}>
    <header className={styles.dialogHeader}>
      <div><h2 id={id} ref={heading} tabIndex={-1}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      <button className={styles.iconButton} onClick={onClose} aria-label={arenaCopy(locale).close}><X size={20} /></button>
    </header>
    {children}
  </dialog>
}
