"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { ArrowUpRight, ImageOff, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import type { ShowcaseItem } from "@/types/showcase"
import { assetUrl } from "@/lib/assets"
import type { ArenaLocale, PreviewDevice } from "@/lib/arena-gallery"
import { arenaCopy } from "./arena-copy"
import styles from "./arena.module.css"

function subscribeViewport(callback: () => void) {
  const query = window.matchMedia("(max-width: 767px)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}
export function usePreferredDevice(): PreviewDevice {
  return useSyncExternalStore(subscribeViewport, () => window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop", () => "desktop")
}

export function DeviceSwitch({ device, onChange, locale }: { device: PreviewDevice; onChange: (device: PreviewDevice) => void; locale: ArenaLocale }) {
  const text = arenaCopy(locale)
  return <div className={styles.segmented} aria-label={locale === "zh-CN" ? "展示模式" : "View mode"}>
    <button aria-pressed={device === "desktop"} onClick={() => onChange("desktop")}>{text.desktop}</button>
    <button aria-pressed={device === "mobile"} onClick={() => onChange("mobile")}>{text.mobile}</button>
  </div>
}

export function ZoomButton({ zoom, onChange, locale }: { zoom: boolean; onChange: (zoom: boolean) => void; locale: ArenaLocale }) {
  const text = arenaCopy(locale)
  return <button className={styles.iconButton} aria-pressed={zoom} onClick={() => onChange(!zoom)} title={zoom ? text.fit : text.zoom}>{zoom ? <Minimize2 size={14} /> : <Maximize2 size={14} />}<span>{zoom ? text.fit : text.zoom}</span></button>
}

export function CaptureView({ item, locale, zoom, mobile = false }: { item: ShowcaseItem; locale: ArenaLocale; zoom: boolean; mobile?: boolean }) {
  const text = arenaCopy(locale)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const source = assetUrl(mobile ? item.screenshots.mobile : item.screenshots.desktop)
  return <>
    <div className={styles.imageViewport} data-zoom={zoom}>
      {failed ? <div className={styles.previewError}><ImageOff size={24} /><strong>{text.imageError}</strong><p>{text.imageErrorHint}</p><button className={styles.button} onClick={() => { setFailed(false); setAttempt(attempt + 1) }}><RotateCcw size={14} />{text.retry}</button><a href={item.demoUrl} target="_blank" rel="noreferrer" className={styles.textLink}>{text.openWork}<ArrowUpRight size={14} /></a></div> : <>
        {/* eslint-disable-next-line @next/next/no-img-element -- Real versioned screenshots support local and R2 static builds. */}
        <img key={attempt} src={source} alt={`${item.model} · ${item.title} · ${mobile ? text.mobileCapture : text.desktopCapture}`} onError={() => setFailed(true)} onLoad={(event) => setSize(`${event.currentTarget.naturalWidth} × ${event.currentTarget.naturalHeight}`)} />
      </>}
    </div>
    <div className={styles.previewCaption}><span>{mobile ? text.mobileCapture : text.desktopCapture}</span><span>{size ?? (failed ? "—" : text.loading)}</span></div>
  </>
}

export function MobilePreview({ item, locale }: { item: ShowcaseItem; locale: ArenaLocale }) {
  const text = arenaCopy(locale)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)
  const ref = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (status !== "loading") return
    const timer = setTimeout(() => setStatus("error"), 20000)
    return () => clearTimeout(timer)
  }, [status, attempt])
  return <>
    <div className={styles.phoneViewport}>
      <div className={styles.phoneFrame}>
        <iframe ref={ref} key={attempt} src={item.demoUrl} title={`${item.model} · ${item.title} · ${text.mobileLive}`} onError={() => setStatus("error")} onLoad={() => {
          const title = ref.current?.contentDocument?.title ?? ""
          setStatus(/404|Application error/i.test(title) ? "error" : "ready")
        }} />
        {status !== "ready" && <div className={styles.loadingOverlay} role="status">
          {status === "loading" ? <><span className={styles.spinner} />{text.loading}</> : <><ImageOff size={24} /><strong>{text.previewError}</strong><p>{text.previewErrorHint}</p><button className={styles.button} onClick={() => { setStatus("loading"); setAttempt(attempt + 1) }}><RotateCcw size={14} />{text.retry}</button></>}
          <a href={item.demoUrl} target="_blank" rel="noreferrer" className={styles.textLink}>{text.openWork}<ArrowUpRight size={14} /></a>
        </div>}
      </div>
    </div>
    <div className={styles.previewCaption}><span>{text.mobileLive}</span><a href={item.demoUrl} target="_blank" rel="noreferrer">{text.openWork} ↗</a></div>
  </>
}
