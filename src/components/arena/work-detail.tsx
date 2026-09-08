"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import type { PublicArenaSkill } from "@/lib/public-arena-skills"
import type { ShowcaseItem } from "@/types/showcase"
import type { ArenaLocale, PreviewDevice } from "@/lib/arena-gallery"
import { chainContext, designIntent } from "@/lib/arena-context"
import { ArenaDialog, CopyButton } from "./arena-controls"
import { arenaCopy } from "./arena-copy"
import { localeHref } from "./arena-shell"
import { CaptureView, DeviceSwitch, MobilePreview, usePreferredDevice, ZoomButton } from "./work-preview"
import styles from "./arena.module.css"

export default function WorkDetail({ item, locale, device: savedDevice, onDeviceChange, onClose, sources }: {
  item: ShowcaseItem; locale: ArenaLocale; device: PreviewDevice | null; onDeviceChange: (device: PreviewDevice) => void; onClose: () => void; sources: PublicArenaSkill[]
}) {
  const text = arenaCopy(locale)
  const preferredDevice = usePreferredDevice()
  const device = savedDevice ?? preferredDevice
  const [zoom, setZoom] = useState(false)
  const context = chainContext(item, locale, sources)
  return <ArenaDialog title={`${item.model} · ${item.title}`} subtitle={text.previewLabel} onClose={onClose} locale={locale}>
    <div className={styles.detailBody}>
      <section className={styles.detailVisual} aria-label={text.previewLabel}>
        <div className={styles.previewToolbar}>
          <DeviceSwitch device={device} onChange={onDeviceChange} locale={locale} />
          {device === "desktop" && <ZoomButton zoom={zoom} onChange={setZoom} locale={locale} />}
        </div>
        {device === "mobile" ? <MobilePreview key={item.id} item={item} locale={locale} /> : <CaptureView key={item.id} item={item} locale={locale} zoom={zoom} />}
      </section>
      <aside className={styles.detailAside}>
        <h3>{text.model}</h3><p>{item.model}</p>
        <h3>{text.chain}</h3><p><strong>{item.title}</strong></p>
        <div className={styles.skillLinks}>{item.skills.map((id) => {
          const skill = sources.find((source) => source.id === id)
          return <details key={id}><summary>{id}<ChevronDown size={12} /></summary><p>{locale === "zh-CN" ? skill?.summary : skill?.summaryEn}</p><Link href={localeHref(`/skills/#${id}`, locale)}>{text.skillPage}<ArrowUpRight size={11} /></Link></details>
        })}</div>
        <a className={styles.primaryButton} href={item.demoUrl} target="_blank" rel="noreferrer">{text.openWork}<ArrowUpRight size={15} /></a>
        <h3>{text.designGoal}</h3><p>{designIntent(item, locale)}</p>
        <Link className={styles.textLink} href={localeHref("/methodology/#brief", locale)}>{text.readBrief}<ArrowUpRight size={13} /></Link>
        <h3>{text.metadata}</h3>
        <dl className={styles.record}><div><dt>{text.generatedAt}</dt><dd>{text.unknown}</dd></div><div><dt>{text.modelVersion}</dt><dd>{item.model}</dd></div><div><dt>{text.skillVersion}</dt><dd>{text.unknown}</dd></div></dl>
        <h3>{text.promptTitle}</h3><CopyButton value={context} label={text.copyContext} locale={locale} />
        <details className={styles.copyBlock}><summary>{text.showPrompt}</summary><pre>{context}</pre></details>
        <CopyButton value={() => window.location.href} label={text.share} locale={locale} className={styles.textLink} />
      </aside>
    </div>
  </ArenaDialog>
}
